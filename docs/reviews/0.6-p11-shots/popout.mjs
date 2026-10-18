#!/usr/bin/env node
/* 0.6 P11: shots of the Next up pop-out window content, plus the frame test.
   Usage: npm run build && node docs/reviews/0.6-p11-shots/popout.mjs <dist-dir> <out-suffix>   (suffix: before | after)
   The pop-out is a Document Picture-in-Picture window; headless Chromium has none, so a stub opens a plain popup with
   window.open and the app's own code moves the card into it. Only the page content is shot, never the frame.
   Frame test: with --transparent the pop-out's html and body are set to a transparent background; the screenshot and the
   computed colours are printed. The browser still draws its own opaque frame (not reachable from the page). */
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { writeSave } = require('../../../tests/support/save.js');
const HERE = dirname(fileURLToPath(import.meta.url));
const [distArg, suffix = 'after', ...flags] = process.argv.slice(2);
const dist = resolve(distArg);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = createServer((req, r) => { let f = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); r.end(readFileSync(f)); });
await new Promise(res => srv.listen(0, '127.0.0.1', res));
const url = 'http://127.0.0.1:' + srv.address().port + '/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2, serviceWorkers: 'block', reducedMotion: 'reduce' });
await ctx.addInitScript(() => { window.documentPictureInPicture = { requestWindow: async o => { const w = window.open('', 'pip' + Date.now(), `popup,width=${o.width},height=${o.height}`); if (!w) throw new Error('blocked'); await new Promise(r => setTimeout(r, 50)); return w; } }; });
const p = await ctx.newPage();
await p.goto(url); await p.waitForTimeout(300);
await writeSave(p, { open: {}, hideCards: false, mode: 'advanced', level: 27 }, { fresh: true });
await p.reload(); await p.waitForTimeout(500);
const [pop] = await Promise.all([ctx.waitForEvent('page'), p.click('[data-nspop]')]);
await pop.setViewportSize({ width: 400, height: 280 }); await p.waitForTimeout(500);
if (flags.includes('--transparent')) {
  await pop.addStyleTag({ content: 'html.pip, html.pip body { background: transparent !important; }' });
  console.log(JSON.stringify(await pop.evaluate(() => ({ html: getComputedStyle(document.documentElement).backgroundColor, body: getComputedStyle(document.body).backgroundColor }))));
  await pop.screenshot({ path: join(HERE, 'frame-transparent.png'), omitBackground: true });
} else {
  await pop.screenshot({ path: join(HERE, `popout-${suffix}.png`) });
}
await b.close(); srv.close();
