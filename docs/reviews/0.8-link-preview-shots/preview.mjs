/* Renders the link preview a chat app builds from a page's <head> (og:title, og:image, the site's host; the
   description and tab title listed under it), so the owner can compare before / after. Not a test; run after `npm ci`:
   git show main:src/index.html > /tmp/before.html && node docs/reviews/0.8-link-preview-shots/preview.mjs /tmp/before.html link-preview-before.png */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..'), [src, out] = process.argv.slice(2);
const html = readFileSync(src, 'utf8'), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const meta = k => (html.match(new RegExp(`<meta (?:property|name)="${k}" content="([^"]*)"`)) || [])[1] || '';
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
const img = 'data:image/png;base64,' + readFileSync(join(ROOT, 'public/icons/maskable-512.png')).toString('base64');
const row = (k, v) => `<dt>${k}</dt><dd>${v ? esc(v) : '<i>(none)</i>'}</dd>`;
const page = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#000;font:16px -apple-system,system-ui,sans-serif;color:#fff;padding:24px;width:760px}
.card{width:340px;border-radius:18px;overflow:hidden;background:#264a52;float:left}
.card img{display:block;width:340px;height:300px;object-fit:cover;background:#0b1b1e}
.card .t{padding:12px 16px 2px;font-weight:600;font-size:17px;line-height:1.25}.card .h{padding:0 16px 14px;color:#9fb5ba;font-size:15px}
dl{margin:0 0 0 372px;font-size:13px;line-height:1.4}dt{color:#9fb5ba;margin-top:8px}dd{margin:2px 0 0}</style>
<div class="card"><img src="${img}" alt=""><div class="t">${esc(meta('og:title'))}</div><div class="h">daevacompanion.com</div></div>
<dl>${row('Tab title', title)}${row('Preview description (og:description)', meta('og:description'))}${row('Search description', meta('description'))}${row('Image alt text', meta('og:image:alt'))}</dl>`;
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 808, height: 400 }, deviceScaleFactor: 2 });
await p.setContent(page); await p.screenshot({ path: join(dirname(fileURLToPath(import.meta.url)), out), fullPage: true }); await b.close();
