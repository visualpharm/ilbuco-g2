import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import hub_wake_relay as R  # noqa: E402

SECRET = 'k' * 40
NOW = 1_800_000_000


def req(payload, secret=SECRET, ts=NOW, sig=None):
    raw = json.dumps(payload).encode()
    h = {'X-Hub-Wake-Timestamp': str(ts), 'X-Hub-Wake-Signature': sig or R.sign(secret, str(ts), raw)}
    return h, raw


GUEST = {'message_id': 'm-1', 'conversation_id': 'conv-1', 'guest': 'Ana', 'text': 'El código no funciona',
         'test': False}


class RelayTest(unittest.TestCase):
    def setUp(self):
        self.calls = []
        self.code = 0
        self.relay = R.Relay(SECRET, run=lambda text, cid: (self.calls.append((text, cid)) or (self.code, 'ok')),
                             clock=lambda: NOW)

    def test_guest_message_wakes_with_ids(self):
        st, res = self.relay.handle('/hostex-wake', *req(GUEST))
        self.assertEqual(st, 200)
        self.assertEqual(len(self.calls), 1)
        text, cid = self.calls[0]
        self.assertEqual(cid, 'hostex-m-1')
        self.assertIn('conv-1', text)
        self.assertIn('El código no funciona', text)
        self.assertIn('noe-hostex-guests', text)

    def test_repeat_id_does_not_wake_twice(self):
        self.relay.handle('/hostex-wake', *req(GUEST))
        st, res = self.relay.handle('/hostex-wake', *req(GUEST))
        self.assertEqual((st, res.get('duplicate')), (200, True))
        self.assertEqual(len(self.calls), 1)

    def test_failed_hub_call_is_retried_next_time(self):
        self.code = 1
        st, _ = self.relay.handle('/hostex-wake', *req(GUEST))
        self.assertEqual(st, 502)
        self.code = 0
        st, _ = self.relay.handle('/hostex-wake', *req(GUEST))
        self.assertEqual(st, 200)
        self.assertEqual(len(self.calls), 2)

    def test_auth(self):
        self.assertEqual(self.relay.handle('/hostex-wake', *req(GUEST, secret='x' * 40))[1]['error'], 'bad_signature')
        self.assertEqual(self.relay.handle('/hostex-wake', *req(GUEST, ts=NOW - 301))[1]['error'], 'stale')
        self.assertEqual(self.relay.handle('/hostex-wake', {}, b'{}')[1]['error'], 'unsigned')
        h, raw = req(GUEST)
        self.assertEqual(self.relay.handle('/hostex-wake', h, raw.replace(b'Ana', b'Bob'))[0], 401)
        self.assertEqual(self.relay.handle('/other', *req(GUEST))[0], 404)
        self.assertEqual(self.calls, [])

    def test_bad_payload(self):
        for p in ({'message_id': 'a b', 'conversation_id': 'c'}, {'message_id': 'm'}, ['x']):
            self.assertEqual(self.relay.handle('/hostex-wake', *req(p))[0], 400)
        self.assertEqual(self.relay.handle('/hostex-wake', *req({**GUEST, 'text': 'x' * 20000}))[0], 413)
        self.assertEqual(self.calls, [])

    def test_test_event_says_do_nothing(self):
        st, res = self.relay.handle('/hostex-wake', *req({**GUEST, 'message_id': 't-1', 'test': True}))
        self.assertEqual((st, res['test']), (200, True))
        text = self.calls[0][0]
        self.assertIn('ТЕСТ', text)
        self.assertIn('никому не пиши', text)
        self.assertNotIn('El código', text)

    def test_text_is_flattened_and_cut(self):
        self.relay.handle('/hostex-wake', *req({**GUEST, 'text': 'a\n\nb ' + 'c' * 3000}))
        text = self.calls[0][0]
        self.assertIn('«a b c', text)
        self.assertLess(len(text), 2200)


class AgentPost(unittest.TestCase):
    def test_signed_urgent_post(self):
        import hashlib, hmac, tempfile
        d = tempfile.mkdtemp()
        kf = os.path.join(d, 'k')
        with open(kf, 'w') as f:
            f.write('z' * 40 + '\n')
        seen = {}

        class Resp:
            status = 202
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self, n=-1): return b''

        def opener(req, timeout):
            seen['req'] = req
            return Resp()

        code, _ = R.Relay._agent_post('hi', 'hostex-1', url='https://hub.example/api/send/agent', key_file=kf,
                                          opener=opener, clock=lambda: 1_800_000_000)
        self.assertEqual(code, 0)
        req = seen['req']
        body = json.loads(req.data)
        self.assertEqual((body['now'], body['agent'], body['client_id']), (True, 'hostex-webhook', 'hostex-1'))
        h = {k.lower(): v for k, v in req.header_items()}
        self.assertEqual(h['x-agent-timestamp'], '1800000000')
        want = hmac.new(b'z' * 40, b'1800000000.' + req.data, hashlib.sha256).hexdigest()
        self.assertEqual(h['x-agent-signature'], want)
        self.assertEqual(h['x-hub'], '1')


class VoiceNoticeTest(unittest.TestCase):
    def setUp(self):
        self.calls = []
        self.relay = R.Relay(SECRET, run=lambda text, cid, to='noe': (self.calls.append((text, cid, to)) or (0, 'ok')),
                             clock=lambda: NOW)

    def notice(self, **kw):
        n = {'type': 'voice_notice', 'id': 'h-abc-expired', 'kind': 'hold_expired', 'name': 'Ana Pérez',
             'phone': '+54 9 11 5555 1234', 'check_in': '2027-05-10', 'check_out': '2027-05-12',
             'amount': 412037, 'hold_id': 'h-abc', 'unit': 'Giardino'}
        n.update(kw)
        return n

    def test_expired_hold_reaches_noe_and_payments(self):
        st, res = self.relay.handle('/hostex-wake', *req(self.notice()))
        self.assertEqual(st, 200)
        self.assertEqual([c[2] for c in self.calls], ['noe', 'agent-payments'])
        text = self.calls[0][0]
        for want in ('Ana Pérez', '+54 9 11 5555 1234', '2027-05-10', '412 037 ARS', 'h-abc'):
            self.assertIn(want, text)
        self.assertEqual(self.calls[0][1], 'voice-h-abc-expired-noe')

    def test_callback_goes_to_noe_only_and_dedups(self):
        n = self.notice(id='cb-1', kind='callback', reason='quiere hablar con Iván')
        self.relay.handle('/hostex-wake', *req(n))
        st, res = self.relay.handle('/hostex-wake', *req(n))
        self.assertTrue(res.get('duplicate'))
        self.assertEqual([c[2] for c in self.calls], ['noe'])
        self.assertIn('quiere hablar con Iván', self.calls[0][0])

    def test_bad_fields_are_dropped_not_echoed(self):
        self.relay.handle('/hostex-wake', *req(self.notice(phone='call me; rm -rf', check_in='tomorrow', amount='9')))
        text = self.calls[0][0]
        self.assertNotIn('rm -rf', text)
        self.assertNotIn('tomorrow', text)
        self.assertIn('номер не известен', text)

    def test_unknown_kind_and_unsigned_are_refused(self):
        self.assertEqual(self.relay.handle('/hostex-wake', *req(self.notice(kind='transfer_money')))[0], 400)
        h, raw = req(self.notice())
        self.assertEqual(self.relay.handle('/hostex-wake', {}, raw)[0], 401)
        self.assertEqual(self.calls, [])

    def test_test_notice_only_to_noe_with_do_nothing(self):
        self.relay.handle('/hostex-wake', *req(self.notice(id='t-1', test=True)))
        self.assertEqual([c[2] for c in self.calls], ['noe'])
        self.assertIn('ТЕСТ', self.calls[0][0])


if __name__ == '__main__':
    unittest.main()
