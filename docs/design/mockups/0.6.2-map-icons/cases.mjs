/* 0.6.2 mockup (Design Lead, #404): one set of game map icons, used where a place type earns it. Drawn on the real built
   page: act() swaps Next up tiles and adds inline icons. Nothing here is app code.
   Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-map-icons --after-only
   MOCK_BEFORE=1 shoots today's page with the same saves (the Scrapbook's before half).
   Icons: Source Vetting's HQ copies (/mnt/project-files/icons-hq/, Metabot first, aion2quest second), copied next to
   this file so the mockup runs anywhere. Not in the app; the build records each source in docs/ISSUES.md. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreBundle } from '../../../../tests/support/core-bundle.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const uri = f => 'data:image/png;base64,' + readFileSync(join(HERE, f)).toString('base64');
const ICO = { sealed: uri('sealed.png'), garrison: uri('garrison.png'), kisk: uri('kisk-aion2quest-teleportartifact-dark-engraved.png'), trace: uri('trace.png') };
const M = await coreBundle();
const save = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {} };
const css = `#nowStar .ns-card .ns-num.mk-tile { background: var(--panel-2); border-color: var(--line); }
#nowStar .ns-card .ns-num.mk-tile img { width: 70%; height: 70%; object-fit: contain; }
.mk-map { width: 1.25em; height: 1.25em; vertical-align: -0.28em; margin-right: 0.15em; }
.mk-map.hd { width: 18px; height: 18px; vertical-align: -4px; margin-right: 6px; }`;
/* both halves: pick the card to show first, and tag the Dungeons card so it can be shot whole */
const pick = re => `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc); sc.classList.add('show-info');`;
const tagDung = `{ const a = document.getElementById('areaList'); let c = a; while (c && c.parentElement && !/card|panel/.test(c.className) && c.tagName !== 'SECTION') c = c.parentElement; (c || a).id = 'mkDung'; }`;
const draw = (tile) => `const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s);
  const ICO = ${JSON.stringify(ICO)};
  const img = (k, cls = '') => Object.assign(document.createElement('img'), { className: 'mk-map ' + cls, alt: '', src: ICO[k] });
  ${tile ? `{ const n = document.querySelector('#nowStar .ns-card.first .ns-num'); n.classList.add('mk-tile'); n.innerHTML = ''; n.append(img('${tile}')); }` : ''}
  /* inline: "Kibelisk" mentions and "N traces" counts, wherever the page writes them */
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), hits = []; let t;
  while ((t = w.nextNode())) if (/Kibelisk|\\d+ traces?/.test(t.textContent) && !t.parentElement.closest('script, style, #gates')) hits.push(t);
  const marked = new Set(); /* one Kibelisk crest per card: its first mention */
  for (const n of hits) { const box = n.parentElement.closest('.ns-card') || n.parentElement; const parts = n.textContent.split(/(Kibelisk|\\d+ traces?)/), f = document.createDocumentFragment();
    parts.forEach((p, i) => { if (!(i % 2)) { f.append(p); return; } const sp = document.createElement('span'); sp.style.whiteSpace = 'nowrap';
      if (p === 'Kibelisk') { if (marked.has(box)) sp.append(p); else { marked.add(box); sp.append(img('kisk'), p); } } else { /* tight region rows: the icon stands in for the word, which stays as its label */ const m = /^(\\d+) (.*)$/.exec(p), i = img('trace'); i.alt = 'Empyrean Traces'; i.title = 'Empyrean Traces'; sp.append(m[1], ' ', i); } f.append(sp); });
    n.replaceWith(f); }
  /* the feather's label, visible once for touch screens: on the Sealed Dungeons reward line */
  document.querySelectorAll('#mkDung li.sh-note').forEach(li => { if (!/Wisdom/.test(li.textContent)) return; const lg = li.cloneNode(false); lg.textContent = ''; lg.append(img('trace'), 'Empyrean Traces in each region'); li.after(lg); });
  /* section headers of the Dungeons card */
  document.querySelectorAll('#mkDung *').forEach(e => { if (e.children.length > 1) return; const x = (e.firstChild && e.firstChild.nodeType === 3 ? e.firstChild.textContent : '').trim();
    if (/^Sealed Dungeons$/i.test(x)) e.prepend(img('sealed', 'hd')); else if (/^Strongholds$/i.test(x)) e.prepend(img('garrison', 'hd')); });`;
const act = (pre, tile) => new Function(tagDung + pre + (process.env.MOCK_BEFORE ? '' : draw(tile)));
export default [
  { name: 'm1-sealed-card-390', save, mode: 'advanced', width: 390, height: 844, act: act(pick('/^Clear /'), 'sealed'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'm2-stronghold-card-390', save, mode: 'advanced', width: 390, height: 844, act: act(pick('/^Run /'), 'garrison'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'm3-dungeons-card-1500', save, mode: 'advanced', width: 1500, height: 1200, act: act(''), shots: [{ sel: '#mkDung' }] },
];
