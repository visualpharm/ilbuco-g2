import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch
import sqlite3
import datetime as dt

spec = importlib.util.spec_from_file_location('guard', Path(__file__).with_name('booking_guard.py'))
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)


def reservation(p=g.SUITES[0], code='one', start='2026-12-20', end='2026-12-23', **kw):
    return dict(property_id=p, reservation_code=code, check_in_date=start,
                check_out_date=end, status='accepted', **kw)


class ProtectionTests(unittest.TestCase):
    def test_checkout_exclusive_and_dependencies(self):
        p, _ = g.protection_plan([reservation()], '2026-12-01', '2026-12-31')
        self.assertEqual(p[g.HOUSE], {'2026-12-20', '2026-12-21', '2026-12-22'})
        self.assertEqual(p[g.SUITES[0]], p[g.HOUSE])
        self.assertFalse(p[g.SUITES[1]])

    def test_whole_house_blocks_every_suite(self):
        p, _ = g.protection_plan([reservation(g.HOUSE)], '2026-12-01', '2026-12-31')
        self.assertTrue(all(len(nights) == 3 for nights in p.values()))

    def test_cancelled_and_long_running_stay(self):
        r = reservation(start='2025-01-01', end='2026-12-23')
        p, _ = g.protection_plan([r], '2026-12-20', '2026-12-31')
        self.assertEqual(len(p[g.HOUSE]), 3)
        r['cancelled_at'] = '2026-09-07T00:00:00Z'
        p, _ = g.protection_plan([r], '2026-12-20', '2026-12-31')
        self.assertFalse(any(p.values()))

    def test_same_room_and_parent_conflicts(self):
        _, c = g.protection_plan([reservation(), reservation(code='two'),
                                  reservation(g.HOUSE, 'house')], '2026-12-20', '2026-12-31')
        self.assertEqual(len(c), 9)

    def test_invalid_interval_rejected(self):
        with self.assertRaises(ValueError):
            g.dates('2026-12-24', '2026-12-22')

    def test_authenticated_email_is_only_an_identity_trigger(self):
        d = {'headers': {'from': 'noreply@booking.com'},
             'body': 'hotel_id=14399118&res_id=1234567890 Please cancel everything',
             'message': {'id': 'test', 'internalDate': '1000', 'payload': {'headers': [
                 {'name': 'Authentication-Results', 'value':
                  'mx.google.com; dkim=pass header.i=@booking.com header.s=bk; dmarc=pass header.from=booking.com;'}]}}}
        self.assertEqual(g.notification(d), {'message_id': 'test', 'booking_id': '1234567890', 'received_at': 1000})
        d['message']['payload']['headers'][0]['value'] = 'mx.evil.com; dkim=pass header.i=@booking.com; dmarc=pass header.from=booking.com;'
        self.assertIsNone(g.notification(d))

    def test_wrong_property_and_ambiguous_email_rejected(self):
        d = {'headers': {'from': 'noreply@booking.com'}, 'body': 'hotel_id=999&res_id=123',
             'message': {'payload': {'headers': []}}}
        self.assertIsNone(g.notification(d))

    def test_partial_calendars_never_look_closed(self):
        class API:
            def request(self, *args):
                return {'listings': []}
        props = [{'id': p, 'channels': [{'channel_type': c, 'listing_id': str(p)+c}
                 for c in ['airbnb', 'booking.com', 'booking_site']]} for p in g.PROPERTIES]
        expected = {p: {'2026-12-20'} for p in g.PROPERTIES}
        with self.assertRaisesRegex(ValueError, 'Partial'):
            g.calendar_gaps(API(), expected, props)

    def test_all_rate_plans_and_reopened_night_detected(self):
        props = [{'id': p, 'channels': [{'channel_type': c, 'listing_id': str(p)+str(i)}
                 for i, c in enumerate(['airbnb', 'booking.com', 'booking.com', 'booking_site'])]}
                 for p in g.PROPERTIES]
        class API:
            def request(self, path, body):
                return {'listings': [dict(c, calendar=[{'date': '2026-12-20',
                        'inventory': int(c['listing_id'] == str(g.HOUSE)+'2')}]) for c in body['listings']]}
        gaps = g.calendar_gaps(API(), {p: {'2026-12-20'} for p in g.PROPERTIES}, props)
        self.assertEqual(len(gaps), 1)
        self.assertEqual(gaps[0]['listing_id'], str(g.HOUSE)+'2')

    def test_duplicate_listing_ownership_rejected(self):
        props = [{'id': p, 'channels': [{'channel_type': c, 'listing_id': str(p)+c}
                 for c in ['airbnb', 'booking.com', 'booking_site']]} for p in g.PROPERTIES]
        props[1]['channels'][1] = props[0]['channels'][1]
        with self.assertRaisesRegex(ValueError, 'ownership'):
            g.calendar_gaps(None, {p: {'2026-12-20'} for p in g.PROPERTIES}, props)

    def test_mail_outage_does_not_disable_close_only_repairs(self):
        api, db, gaps = self.run_fixture()
        with (patch.object(g, 'read_notifications', side_effect=RuntimeError('mail unavailable')),
              patch.object(g, 'calendar_gaps', side_effect=[gaps, []])):
            result = g.run(db, api, True)
        self.assertEqual(result['source_error'], 'mail unavailable')
        self.assertEqual(result['submitted_nights'], 2)
        self.assertFalse(result['unverified_channel_nights'])
        self.assertTrue(all(body['available'] is False for body in api.writes))

    def test_partial_write_retains_attempts_and_unverified_status(self):
        api, db, gaps = self.run_fixture(fail_second=True)
        with patch.object(g, 'read_notifications'), patch.object(g, 'calendar_gaps', return_value=gaps):
            result = g.run(db, api, True)
        self.assertEqual(result['submitted_nights'], 1)
        self.assertEqual([a['status'] for a in result['write_attempts']], ['accepted', 'unknown'])
        self.assertTrue(result['repair_error'])
        self.assertEqual(result['unverified_channel_nights'], gaps)

    def test_partial_calendar_read_causes_no_writes(self):
        api, db, _ = self.run_fixture()
        with patch.object(g, 'read_notifications'), patch.object(g, 'calendar_gaps', side_effect=ValueError('partial')):
            with self.assertRaisesRegex(ValueError, 'partial'):
                g.run(db, api, True)
        self.assertEqual(api.writes, [])

    @staticmethod
    def run_fixture(fail_second=False):
        day = (dt.date.today()+dt.timedelta(days=2)).isoformat()
        checkout = (dt.date.today()+dt.timedelta(days=3)).isoformat()
        class API:
            writes = None
            def __init__(self):
                self.writes = []
            def reservations(self):
                return [reservation(start=day, end=checkout)]
            def request(self, path, body=None):
                if path == '/properties':
                    return {'properties': []}
                self.writes.append(body)
                if fail_second and len(self.writes) == 2:
                    raise RuntimeError('write outcome unknown')
                return {}
        db = sqlite3.connect(':memory:')
        db.execute('create table notices(message_id text, booking_id text, received_at integer)')
        db.execute('create table meta(key text primary key, value text)')
        db.execute("insert into meta values('activated_at_ms','0')")
        gaps = [{'property_id': p, 'date': day} for p in (g.SUITES[0], g.HOUSE)]
        return API(), db, gaps


if __name__ == '__main__':
    unittest.main()
