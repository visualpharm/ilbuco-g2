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
        p = mock.patch.object(sched, 'card', lambda title, body: self.cards.append(title) or True)
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

    def test_flash_timeout_leaves_guard_run_and_no_card_until_three(self):
        for n in range(1, 4):
            st = self.tick((True, '', True), (None, 'ZCODE_FLASH_TIMEOUT: zcode ran past 300s'))
            self.assertEqual(st['consecutive_failures'], n)
            self.assertTrue(st['direct_success'])
        self.assertEqual(self.calls.count('direct'), 3)
        self.assertEqual(self.cards, ['Il Buco booking guard: Flash run failed'])

    def test_failed_direct_run_cards_at_once(self):
        st = self.tick((False, 'hostex curl error', True), ({'checked_at': 'x', 'alert': None}, None))
        self.assertEqual(self.cards, ['Il Buco booking guard: direct guard run failed'])
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
