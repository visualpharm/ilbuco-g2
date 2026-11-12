// Browser check of the 3D tour and its menu item, phone and desktop, every language.
//   BASE=https://ilbuco.com.ar node tour3d/check.mjs            (or a local `next start` address)
//   OUT=<folder> saves screenshots; LANGS=es,ru limits languages.
// Needs playwright-core and a Chrome with WebGL — headless Chrome without a GPU draws an empty page:
//   PLAYWRIGHT=<folder that has node_modules/playwright-core>  CHROME=<path to Chrome for Testing>
import { createRequire } from 'module';
import { homedir } from 'os';
const require = createRequire((process.env.PLAYWRIGHT || homedir() + '/projects/trago') + '/node_modules/');
const { chromium } = require('playwright-core');
const CHROME = process.env.CHROME || homedir() + '/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE = (process.env.BASE || 'https://ilbuco.com.ar').replace(/\/$/, ''), OUT = process.env.OUT;
const LANGS = (process.env.LANGS || 'es,en,pt,ru').split(',');
const pre = l => (l === 'es' ? '' : '/' + l);
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--no-sandbox'] });
const camera = p => p.evaluate(() => [camera.position.x, camera.position.y, camera.position.z].map(v => +v.toFixed(2)).join());
let failed = 0;
for (const [w, h, size] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
  const phone = size === 'phone';
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: phone ? 2 : 1, hasTouch: phone, isMobile: phone });
  const p = await ctx.newPage();
  let errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  for (const l of LANGS) {
    errors = [];
    const bad = [];
    const expect = (ok, what) => ok || bad.push(what);
    // the site's menu leads to the tour
    await p.goto(BASE + (pre(l) || '/'), { waitUntil: 'load', timeout: 120000 });
    await p.waitForTimeout(2000);
    if (phone) await p.locator('header button[aria-label="Menú"]').click();
    const link = p.locator(phone ? '[role=dialog] nav a[href$="/3d"]' : 'header nav a[href$="/3d"]').first();
    expect((await link.getAttribute('href')) === pre(l) + '/3d', 'menu href');
    await Promise.all([p.waitForURL('**' + pre(l) + '/3d', { timeout: 60000, waitUntil: 'commit' }), link.click()]);
    await p.waitForTimeout(7000);
    if (OUT) await p.screenshot({ path: `${OUT}/tour-${l}-${size}.png` });
    const page = await p.evaluate(() => ({ lang: document.documentElement.lang, canvas: !!document.querySelector('canvas'), missing: window.__missing }));
    expect(page.lang === l, 'html lang ' + page.lang);
    expect(page.canvas, 'no canvas');
    // a room picked in the tour's own menu; old ?n= addresses still open
    const c0 = await camera(p);
    if (phone) await p.locator('#navt').click();
    await p.locator('#nav button[data-n="p1"]').click();
    await p.waitForTimeout(1500);
    await p.locator('#nav button[data-n="p1-terrazzo"]').click();
    await p.waitForTimeout(2500);
    expect((await p.evaluate(() => document.querySelector('#nav button.on').textContent)) === 'Terrazzo', 'room not selected');
    expect((await camera(p)) !== c0, 'camera did not fly to the room');
    if (phone) await p.evaluate(() => document.getElementById('nav').classList.contains('open') && document.getElementById('navt').click());
    // orbit by mouse drag (desktop) or one-finger drag (phone)
    const c1 = await camera(p), x = w * 0.6, y = h * 0.7;
    if (phone) {
      const cdp = await ctx.newCDPSession(p);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
      for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - i * 12, y: y + i * 3, id: 1 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + 220, y + 40, { steps: 12 }); await p.mouse.up();
    }
    await p.waitForTimeout(800);
    expect((await camera(p)) !== c1, 'drag did not turn the model');
    if (OUT) await p.screenshot({ path: `${OUT}/room-${l}-${size}.png` });
    await p.goto(BASE + pre(l) + '/3d?n=p1-norte', { waitUntil: 'commit' });
    await p.waitForTimeout(3500);
    expect((await p.evaluate(() => document.querySelector('#nav button.on').textContent)) === 'Paraiso', 'old ?n= address');
    // a shooting point opens its photos and the walk-through video at its second
    await p.goto(BASE + pre(l) + '/3d?n=pb-giardino', { waitUntil: 'commit' });
    await p.waitForTimeout(4000);
    await p.evaluate(() => [...document.querySelectorAll('.dot.cam')].filter(e => e.style.display !== 'none')[0].click());
    await p.waitForTimeout(5000);
    if (OUT) await p.screenshot({ path: `${OUT}/point-${l}-${size}.png` });
    const video = await p.evaluate(() => { const v = document.querySelector('#photo video'); return v && { ready: v.readyState, at: Math.round(v.currentTime) }; });
    expect(video && video.ready >= 2 && video.at > 0, 'video ' + JSON.stringify(video));
    const missing = await p.evaluate(() => window.__missing);
    expect(missing.length === 0, 'untranslated: ' + missing.join(' | '));
    // IL BUCO in the tour leads back to the site
    await p.goto(BASE + pre(l) + '/3d', { waitUntil: 'commit' });
    await p.waitForTimeout(3000);
    if (phone) await p.locator('#navt').click();
    await Promise.all([p.waitForURL(u => !/\/3d/.test(u.pathname), { timeout: 30000 }), p.locator('#home').click()]);
    expect(errors.length === 0, 'console: ' + [...new Set(errors)].slice(0, 3).join(' | '));
    console.log(bad.length ? 'FAIL' : 'ok  ', size, l, bad.join('; '));
    failed += bad.length;
  }
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
