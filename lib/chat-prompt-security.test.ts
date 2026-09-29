/**
 * Security regression tests for the public chat prompt — pins that the system
 * prompt served to the unauthenticated /api/chat carries no Wi-Fi credentials
 * and no guest roster, and that the Wi-Fi password lives only in the
 * WIFI_PASSWORD env var (for the authenticated autoresponder path).
 * Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChatSystemPrompt } from './chat-config.ts';
import { PROPERTY_INFO } from './knowledge-base.ts';

const SENTINEL = 'wifi-secret-sentinel-9x7q';

/** Run fn with WIFI_PASSWORD forced to value, restoring the original after. */
function withWifiPassword(value: string | undefined, fn: () => void): void {
  const saved = process.env.WIFI_PASSWORD;
  if (value === undefined) delete process.env.WIFI_PASSWORD;
  else process.env.WIFI_PASSWORD = value;
  try {
    fn();
  } finally {
    if (saved === undefined) delete process.env.WIFI_PASSWORD;
    else process.env.WIFI_PASSWORD = saved;
  }
}

// ─── Public chat prompt ──────────────────────────────────────────────────────

test('chat system prompt contains no Wi-Fi credentials even when WIFI_PASSWORD is set', () => {
  withWifiPassword(SENTINEL, () => {
    for (const language of ['es', 'en', 'pt']) {
      const prompt = buildChatSystemPrompt(language, '');
      assert.ok(!prompt.includes(SENTINEL), `language ${language} leaked the wifi password`);
      assert.ok(!prompt.includes('Password:'), `language ${language} has a Password: line`);
      assert.ok(!prompt.includes('Network: Il Buco'), `language ${language} has a Wi-Fi network line`);
      assert.ok(!prompt.includes('terminator'), `language ${language} contains the old password`);
    }
  });
});

test('chat system prompt contains no guest roster or guest-verification section', () => {
  const prompt = buildChatSystemPrompt('en', '');
  assert.ok(!prompt.includes('VERIFIED GUESTS'));
  assert.ok(!prompt.includes('guestContext'));
  // Availability context is still injected when provided
  const withAvailability = buildChatSystemPrompt('en', '\n\n## REAL-TIME AVAILABILITY DATA (as of 2026-09-29):\n');
  assert.ok(withAvailability.includes('REAL-TIME AVAILABILITY DATA'));
});

// ─── Knowledge base Wi-Fi secret sourcing ────────────────────────────────────

test('knowledge-base Wi-Fi password is read from WIFI_PASSWORD env, not source', () => {
  withWifiPassword(SENTINEL, () => {
    assert.equal(PROPERTY_INFO.wifi.password, SENTINEL);
  });
  withWifiPassword(undefined, () => {
    assert.equal(PROPERTY_INFO.wifi.password, '');
  });
});
