"""Scheduler: the guard runs directly before Flash on every tick; Flash only judges.

2026-11-06: under load the guard took over 126 s (ZCode's Bash tool limit), Flash
polled the backgrounded run until the 600 s timeout, three ticks in a row.
"""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import booking_guard_scheduler as sched  # noqa: E402


def proc(stdout='', code=0, stderr=''):
    return subprocess.CompletedProcess([], code, stdout, stderr)


class Tick(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.state = Path(tmp.name)
        for name, value in (('STATE', self.state), ('EXECUTOR_STATUS', self.state / 'flash-executor-status.json')):
            p = mock.patch.object(sched, name, value)
            p.start()
            self.addCleanup(p.stop)
        self.calls, self.cards = [], []
        p = mock.patch.object(sched, 'card', lambda title, body: self.cards.append(f'{title}\n{body}') or True)
        p.start()
        self.addCleanup(p.stop)

    def tick(self, direct, flash):
        def run_direct():
            self.calls.append('direct')
            return direct
        def run_flash():
            self.calls.append('flash')
            return flash
        with mock.patch.object(sched, 'run_direct', run_direct), mock.patch.object(sched, 'run_flash', run_flash), \
                mock.patch('builtins.print'):
            sched.main()
        return json.loads((self.state / 'flash-executor-status.json').read_text())

    def test_guard_runs_directly_before_flash_even_when_flash_works(self):
        self.tick((True, '', True), ({'checked_at': 'x', 'alert': None}, None))
        self.assertEqual(self.calls, ['direct', 'flash'])

    def status(self, **over):
        st = {'checked_at': sched.now(), 'source_error': None, 'repair_error': None, 'submitted_nights': 0,
              'unverified_channel_nights': [], 'conflicts': [], 'notifications_without_hostex_record': [],
              'changed': False, 'signature': 'abc'}
        st.update(over)
        (self.state / 'status.json').write_text(json.dumps(st))

    def test_flash_timeout_leaves_guard_run_and_no_card_while_status_is_clean(self):
        # 2026-11-07: Flash stalled on its second model request three ticks in a
        # row while every direct run was fine; the old code paged noe anyway.
        self.status()
        for n in range(1, 5):
            st = self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
            self.assertEqual(st['consecutive_failures'], n)
            self.assertTrue(st['direct_success'])
        self.assertEqual(self.calls, ['direct', 'flash'] * 4)  # Flash is retried on every tick
        self.assertEqual(self.cards, [])

    def test_flash_timeout_with_a_failed_repair_cards_at_once_and_once(self):
        self.status(repair_error='hostex 502 on /availabilities')
        for _ in range(3):
            self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(len(self.cards), 1)
        self.assertIn('hostex 502', self.cards[0])

    def test_flash_timeout_with_unverified_protective_block_cards(self):
        self.status(unverified_channel_nights=[{'property_id': 1, 'date': '2026-12-01'}])
        self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(len(self.cards), 1)
        self.assertIn('unverified', self.cards[0])

    def test_stale_status_cards_when_flash_is_down(self):
        self.status(checked_at='2026-01-01T00:00:00+00:00')
        self.tick((True, '', False), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(len(self.cards), 1)
        self.assertIn('not updated', self.cards[0])

    def test_known_conflicts_stay_quiet_new_conflict_cards(self):
        old = {'date': '2026-12-24', 'manual_block': False, 'reservations': ['a', 'b']}
        new = {'date': '2027-01-02', 'manual_block': False, 'reservations': ['c', 'd']}
        self.status(conflicts=[old], source_error='booking login expired')
        self.tick((True, '', True), ({'checked_at': 'x', 'alert': None}, None))  # Flash judged them known
        self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(self.cards, [])
        self.status(conflicts=[old, new], source_error='booking login expired')
        self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(len(self.cards), 1)
        self.assertIn('2027-01-02', self.cards[0])

    def test_first_fallback_does_not_page_about_conflicts_it_cannot_date(self):
        # No baseline yet (first tick after the upgrade): existing conflicts are
        # taken as known; only hard problems may page.
        self.status(conflicts=[{'date': '2026-12-24', 'manual_block': False, 'reservations': ['a', 'b']}])
        self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
        self.assertEqual(self.cards, [])

    def test_failed_direct_run_cards_at_once(self):
        st = self.tick((False, 'hostex curl error', True), ({'checked_at': 'x', 'alert': None}, None))
        self.assertEqual([c.splitlines()[0] for c in self.cards], ['Il Buco booking guard: direct guard run failed'])
        self.assertTrue(st['failure_card_open'])


class Direct(unittest.TestCase):
    def test_waits_for_a_held_run_lock_instead_of_counting_it_as_a_check(self):
        outs = iter([proc(json.dumps({'status': 'already-running'})), proc(json.dumps({'status': 'ok'}))])
        with mock.patch.object(sched.subprocess, 'run', lambda *a, **k: next(outs)), \
                mock.patch.object(sched.time, 'sleep') as slept:
            self.assertEqual(sched.run_direct(), (True, '', True))
        slept.assert_called_once()

    def test_lock_held_for_whole_wait_is_reported(self):
        clock = iter(range(0, 10_000, 100))
        with mock.patch.object(sched.subprocess, 'run', lambda *a, **k: proc(json.dumps({'status': 'already-running'}))), \
                mock.patch.object(sched.time, 'sleep'), mock.patch.object(sched.time, 'monotonic', lambda: next(clock)):
            ok, reason, ran = sched.run_direct()
        self.assertFalse(ran)
        self.assertIn('run.lock', reason)


if __name__ == '__main__':
    unittest.main()
