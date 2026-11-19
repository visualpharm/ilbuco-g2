/**
 * Admin role cookie tests — a role whose password env var is removed loses
 * access at once, even with a still-valid signed cookie. Runs on Node's
 * built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roleForPassword, signRole, verifyRoleCookie } from './pricing-auth.ts';

process.env.ADMIN_TOKEN = 'test-admin-token';

test('a configured password signs in and its cookie verifies', () => {
  process.env.PRICING_PASSWORD_IVAN = 'ivan-pass';
  assert.equal(roleForPassword('ivan-pass'), 'ivan');
  assert.equal(verifyRoleCookie(signRole('ivan')), 'ivan');
});

test('removing a password revokes the existing cookie of that role', () => {
  process.env.PRICING_PASSWORD_ANDRES = 'andres-pass';
  const cookie = signRole(roleForPassword('andres-pass')!);
  assert.equal(verifyRoleCookie(cookie), 'andres');
  delete process.env.PRICING_PASSWORD_ANDRES;
  assert.equal(roleForPassword('andres-pass'), null);
  assert.equal(verifyRoleCookie(cookie), null);
});

test('an unknown or forged role never verifies', () => {
  assert.equal(verifyRoleCookie(signRole('admin')), null);
  assert.equal(verifyRoleCookie('ivan.0000'), null);
  assert.equal(roleForPassword(''), null);
});
