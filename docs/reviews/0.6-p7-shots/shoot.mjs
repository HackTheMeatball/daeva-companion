#!/usr/bin/env node
/* 0.6 P7 review shots: the character list sorted by name. Four characters saved as bravo, Alpha, (unnamed), alpha with
   bravo current; the list is open. Run once per build, the "before" with the card change stashed:
     npm run build && node docs/reviews/0.6-p7-shots/shoot.mjs after
   Writes list-<width>-<before|after>.png here (site build, Basic, 390 and 1500 px). */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../../../scripts/serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const OUT = dirname(fileURLToPath(import.meta.url));
const when = process.argv[2];
if (when !== 'before' && when !== 'after') { console.error('usage: shoot.mjs before|after'); process.exit(2); }

/* the save order is bravo, Alpha, unnamed, alpha (made with the page's own functions) */
const setup = () => {
  let s = JSON.parse(JSON.stringify(state)); const first = s.current;
  s.chars[first].name = 'bravo'; s.chars[first].level = 27;
  [['Alpha', 12], ['', 1], ['alpha', 40]].forEach(([name, level], i) => {
    s = addChar(s, { name, now: 0, id: `00000000-0000-4000-8000-0000000000b${i + 2}` });
    s.chars[s.current].level = level;
  });
  s.current = first;
  localStorage.setItem(KEY, JSON.stringify(s));
};

const { server, url } = await startServer();
const b = await chromium.launch();
for (const w of [390, 1500]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(url + '/'); await p.waitForTimeout(300);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.evaluate(setup);
  await p.reload(); await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('charBtn').click());
  await p.waitForTimeout(250);
  await p.screenshot({ path: join(OUT, `list-${w}-${when}.png`), clip: { x: 0, y: 0, width: w, height: w < 500 ? 680 : 420 } });
  if (errs.length) { console.error(w, errs); process.exitCode = 1; }
  await ctx.close();
}
await b.close(); server.close();
console.log('shots written to', OUT);
