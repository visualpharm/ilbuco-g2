/**
 * Vanish editor password gate tests — pins the fail-closed behavior: no
 * configured VANISH_PASSWORD means every request is rejected. Runs on Node's
 * built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyVanishPassword, VANISH_PASSWORD_HEADER } from './vanish-auth.ts';

const SECRET = 'correct-horse-battery';

/** Run fn with VANISH_PASSWORD forced to value, restoring the original after. */
function withPassword(value: string | undefined, fn: () => void): void {
  const saved = process.env.VANISH_PASSWORD;
  if (value === undefined) delete process.env.VANISH_PASSWORD;
  else process.env.VANISH_PASSWORD = value;
  try {
    fn();
  } finally {
    if (saved === undefined) delete process.env.VANISH_PASSWORD;
    else process.env.VANISH_PASSWORD = saved;
  }
}

// ─── Header name ─────────────────────────────────────────────────────────────

test('VANISH_PASSWORD_HEADER is the documented custom header', () => {
  assert.equal(VANISH_PASSWORD_HEADER, 'x-vanish-password');
});

// ─── Fail-closed ─────────────────────────────────────────────────────────────

test('verifyVanishPassword: fails closed when VANISH_PASSWORD is not configured', () => {
  withPassword(undefined, () => {
    assert.equal(verifyVanishPassword(SECRET), false);
  });
});

test('verifyVanishPassword: rejects missing candidate', () => {
  withPassword(SECRET, () => {
    assert.equal(verifyVanishPassword(null), false);
    assert.equal(verifyVanishPassword(undefined), false);
    assert.equal(verifyVanishPassword(''), false);
  });
});

// ─── Verification ────────────────────────────────────────────────────────────

test('verifyVanishPassword: accepts the correct password', () => {
  withPassword(SECRET, () => {
    assert.equal(verifyVanishPassword(SECRET), true);
  });
});

test('verifyVanishPassword: rejects a wrong password of a different length', () => {
  withPassword(SECRET, () => {
    assert.equal(verifyVanishPassword('nope'), false);
  });
});

test('verifyVanishPassword: rejects a wrong password of the same length', () => {
  withPassword(SECRET, () => {
    assert.equal(verifyVanishPassword('wrong-horse-battery'), false);
  });
});
