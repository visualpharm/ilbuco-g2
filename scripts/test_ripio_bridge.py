import datetime as dt
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import ripio_bridge as B  # noqa: E402

SECRET = 'r' * 40
NOW = 1_800_000_000
SINCE = dt.datetime.fromtimestamp(NOW - 600, dt.timezone(dt.timedelta(hours=-3))).isoformat()


def req(payload, secret=SECRET, ts=NOW, sig=None):
    raw = json.dumps(payload).encode()
    h = {'X-Bridge-Timestamp': str(ts), 'X-Bridge-Signature': sig or B.sign(secret, str(ts), raw)}
    return h, raw


class BridgeTest(unittest.TestCase):
    def setUp(self):
        self.calls = []
        self.answer = ({'found': False}, '')
        self.bridge = B.Bridge(SECRET, find=lambda *q: (self.calls.append(q) or self.answer), clock=lambda: NOW)

    def test_not_found(self):
        st, res = self.bridge.handle('/ripio-find', *req({'amount': 412037, 'since': SINCE, 'wait': 10}))
        self.assertEqual((st, res), (200, {'found': False}))
        self.assertEqual(self.calls[0][0], 412037)
        self.assertEqual(self.calls[0][2], 10)

    def test_found_answers_only_amount_and_time(self):
        self.answer = ({'found': True, 'amount': '412037.00', 'at': '2026-11-16T12:01:00-03:00'}, '')
        st, res = self.bridge.handle('/ripio-find', *req({'amount': 412037, 'since': SINCE}))
        self.assertEqual(st, 200)
        self.assertEqual(set(res), {'found', 'amount', 'at'})

    def test_unsigned_stale_and_forged_are_refused(self):
        h, raw = req({'amount': 412037, 'since': SINCE})
        self.assertEqual(self.bridge.handle('/ripio-find', {}, raw)[0], 401)
        self.assertEqual(self.bridge.handle('/ripio-find', *req({'amount': 412037, 'since': SINCE}, ts=NOW - 900))[0], 401)
        self.assertEqual(self.bridge.handle('/ripio-find', *req({'amount': 412037, 'since': SINCE}, secret='x' * 40))[0], 401)
        self.assertEqual(self.calls, [])

    def test_only_one_path(self):
        self.assertEqual(self.bridge.handle('/withdraw', *req({'amount': 412037, 'since': SINCE}))[0], 404)

    def test_bad_requests(self):
        bad = [
            {'amount': '412037', 'since': SINCE},          # string amount
            {'amount': 5, 'since': SINCE},                 # too small
            {'amount': 412037, 'since': '2026-11-16'},     # no timezone
            {'amount': 412037, 'since': '2020-01-01T00:00:00+00:00'},  # too old
            {'amount': 412037, 'since': SINCE, 'wait': 600},           # waits too long
            {'amount': 412037, 'since': SINCE, 'to': 'cvu'},           # unknown field
            {'amount': 412037, 'since': SINCE, 'mode': 'withdraw'},    # unknown mode
        ]
        for p in bad:
            self.assertEqual(self.bridge.handle('/ripio-find', *req(p))[0], 400, p)
        self.assertEqual(self.calls, [])

    def test_check_failure_is_502_not_false(self):
        self.answer = (None, 'find_exit_2')
        st, res = self.bridge.handle('/ripio-find', *req({'amount': 412037, 'since': SINCE}))
        self.assertEqual(st, 502)
        self.assertNotIn('found', res)


class WatchTest(unittest.TestCase):
    """mode watch: one warm background script per (amount, since); answers never wait for its start."""

    def setUp(self):
        self.calls, self.pending = [], []
        self.answer = ({'found': False}, '')
        find = lambda *q: (self.calls.append(q) or self.answer)
        # spawn queues the watcher instead of starting a thread: the test decides when it reports
        self.watches = B.Watches(find, clock=lambda: NOW, spawn=self.pending.append)
        self.bridge = B.Bridge(SECRET, find=find, clock=lambda: NOW, watches=self.watches)

    def ask(self, wait=0, mode='watch', amount=412037):
        return self.bridge.handle('/ripio-find', *req({'amount': amount, 'since': SINCE, 'wait': wait, 'mode': mode}))

    def test_first_ask_starts_one_watcher_and_answers_at_once(self):
        self.assertEqual(self.ask(), (200, {'found': False}))
        self.assertEqual(self.ask(), (200, {'found': False}))
        self.assertEqual(len(self.pending), 1, 'one watcher per amount and since')
        self.assertEqual(self.calls, [], 'the script runs in the background, not in the request')

    def test_found_by_the_watcher_answers_every_later_ask(self):
        self.ask()
        self.answer = ({'found': True, 'amount': '412037.00', 'at': '2026-11-16T12:01:00-03:00'}, '')
        self.pending.pop()()
        self.assertEqual(self.calls[0][2], B.WATCH_SEC)
        st, res = self.ask(wait=3)
        self.assertEqual((st, res['found'], set(res)), (200, True, {'found', 'amount', 'at'}))
        # the sweep's last check (mode once) takes what the watcher saw, without a new run
        st, res = self.ask(mode='once')
        self.assertEqual((st, res['found'], len(self.calls)), (200, True, 1))

    def test_watcher_ran_out_unseen_restarts_on_the_next_ask(self):
        self.ask()
        self.pending.pop()()
        self.assertEqual(self.ask(), (200, {'found': False}))
        self.assertEqual(len(self.pending), 1)

    def test_watcher_that_could_not_check_is_502_and_restarts(self):
        self.ask()
        self.answer = (None, 'find_exit_2')
        self.pending.pop()()
        self.assertEqual(self.ask(), (502, {'error': 'check_failed', 'why': 'find_exit_2'}))
        self.assertEqual(len(self.pending), 1, 'a new watcher starts')
        self.answer = ({'found': False}, '')
        self.pending.pop()()
        self.assertEqual(self.ask(), (200, {'found': False}))

    def test_too_many_watchers_is_busy(self):
        for i in range(B.MAX_WATCHES):
            self.assertEqual(self.ask(amount=412000 + i)[0], 200)
        self.assertEqual(self.ask(amount=499999), (502, {'error': 'check_failed', 'why': 'busy'}))

    def test_once_still_runs_the_script_synchronously(self):
        self.assertEqual(self.ask(mode='once', wait=0), (200, {'found': False}))
        self.assertEqual(len(self.calls), 1)
        self.assertEqual(self.pending, [])


if __name__ == '__main__':
    unittest.main()
