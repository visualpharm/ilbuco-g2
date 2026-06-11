/**
 * Pricing alerts → Telegram (Ivan's @ivanbccodebot chat).
 *
 * Noise policy: alert ONLY on gate violations / verification failures, plus one
 * single-line summary after the weekly cron run. Never per-step chatter.
 */

const API = 'https://api.telegram.org';

export async function sendPricingAlert(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[pricing-alert] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set; alert:', text);
    return false;
  }
  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    const data = await res.json();
    if (!data.ok) console.error('[pricing-alert] telegram error:', JSON.stringify(data).slice(0, 200));
    return !!data.ok;
  } catch (e) {
    console.error('[pricing-alert] send failed:', e);
    return false;
  }
}
