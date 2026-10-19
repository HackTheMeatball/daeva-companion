/* 0.6.2 mockup (Design Lead): Next up card icons sit tight, with no dead space around the tile (Isaac, 2026-10-18
   10:22 PM ET). Drawn on the real built page with the map-icons mockup's icons. Nothing here is app code.
   Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-icon-fit --after-only
   MOCK_BEFORE=1 keeps today's layout (icons on, layout as is): the before half. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreBundle } from '../../../../tests/support/core-bundle.mjs';

const HERE = dirname(fileURLToPath(import.meta.url)), MAP = join(HERE, '../0.6.2-map-icons');
const uri = f => 'data:image/png;base64,' + readFileSync(join(MAP, f)).toString('base64');
const ICO = { sealed: uri('sealed.png'), garrison: uri('garrison.png') };
const M = await coreBundle();
const save = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {} };
const icons = `#nowStar .ns-card .ns-num.mk-tile { background: var(--panel-2); border-color: var(--line); }
#nowStar .ns-card .ns-num.mk-tile img { width: 70%; height: 70%; object-fit: contain; }`;
/* the fit: the tile lines up with the title only; every line under the title runs the card's full width */
const fit = `#nowStar .ns-card .ns-mhead { align-items: center; row-gap: var(--space-8); }
#nowStar .ns-card .ns-mhead > .title { display: contents; }
#nowStar .ns-card .ns-mhead > .ns-num { grid-row: 1; align-self: center; }
#nowStar .ns-card .ns-mhead > .title > h3 { grid-column: 2; grid-row: 1; margin: 0; }
#nowStar .ns-card .ns-mhead > .title > :not(h3) { grid-column: 1 / -1; margin: 0; }
#nowStar .ns-card .ns-mhead > .meta { grid-column: 1 / -1; }
@media (min-width: 521px) { #nowStar .ns-card .ns-mhead > .meta { grid-column: 3; grid-row: 1; } }`;
const pick = re => `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc); sc.classList.add('show-info');`;
const draw = tile => `const s = document.createElement('style'); s.textContent = ${JSON.stringify(icons + (process.env.MOCK_BEFORE ? '' : '\n' + fit))}; document.head.append(s);
  ${tile ? `{ const n = document.querySelector('#nowStar .ns-card.first .ns-num'); n.classList.add('mk-tile'); n.innerHTML = ''; n.append(Object.assign(document.createElement('img'), { alt: '', src: ${JSON.stringify(ICO[tile] || '')} })); }` : ''}`;
const act = (re, tile) => new Function(pick(re) + draw(tile));
export default [
  { name: 'f1-sealed-card-390', save, mode: 'advanced', width: 390, height: 844, act: act('/^Clear /', 'sealed'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'f2-stronghold-card-390', save, mode: 'advanced', width: 390, height: 844, act: act('/^Run /', 'garrison'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'f3-story-card-390', save, mode: 'advanced', width: 390, height: 844, act: act('/^Story/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'f4-sealed-card-1500', save, mode: 'advanced', width: 1500, height: 1000, act: act('/^Clear /', 'sealed'), shots: [{ sel: '#nowStar .ns-card.first' }] },
];
