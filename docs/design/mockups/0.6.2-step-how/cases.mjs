/* 0.6.2 mockup (Design Lead, #397): a Next up step card says how, not just what. Today stepHTML keeps only the step's
   bold phrase ("Extract gear you've replaced"); the how-to after it is dropped. Drawn on the real built page: act() puts
   the step's first sentence after the bold phrase under the title, and the rest behind the card's existing "i" button.
   Nothing here is app code. Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-step-how --after-only
   MOCK_BEFORE=1 shoots today's page with the same saves (the Scrapbook's before half). */
import { coreBundle } from '../../../../tests/support/core-bundle.mjs';

const M = await coreBundle(), L = 10;
const save = { level: L, quest: M.QUESTS.find(([l]) => l >= L)[1], open: {},
  checks: Object.fromEntries(M.GATES.filter(g => g.lv < L).flatMap(g => g.items.filter(it => it.k)).map(it => [it.k, true])) };
/* the step's text as data/packs/aion2/asmodian/guide/steps.json g10:0 has it, tips resolved to plain words */
const HOW = 'Open the Cube, click the old piece, choose Extract and confirm.';
const MORE = "Only gear in your Cube can be extracted, not what you're wearing, so the option appears once a drop replaces something.";
const css = `#nowStar .ns-card .title p.ns-how { margin: var(--space-4) 0 0; font-size: 14px; line-height: 1.45; color: var(--fg); }
#nowStar .ns-card .title h3 .nsinfo { display: inline-grid; margin-left: var(--space-6); vertical-align: middle; }`;
/* both halves bring the step card to the top (as if the story and earlier rows were done), so they show the same card */
const lift = `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => /Extract gear/.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no Extract step card'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);`;
const act = (on, open) => new Function(lift + (on ? `const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s);
  const t = sc.querySelector('.title'), h = t.querySelector('h3'), p = t.querySelector('p');
  const how = Object.assign(document.createElement('p'), { className: 'ns-how', textContent: ${JSON.stringify(HOW)} });
  h.after(how);
  h.insertAdjacentHTML('beforeend', ' <button type="button" class="tipbtn nsinfo" aria-label="More info" aria-expanded="${open}">i</button>');
  t.insertAdjacentHTML('beforeend', '<span class="ns-info">${MORE.replace(/'/g, "\\'")}</span>');
  ${open ? "sc.classList.add('show-info');" : ''}` : ''));
const before = !!process.env.MOCK_BEFORE;
export default [
  { name: 'h1-basic-390', save, mode: 'basic', width: 390, height: 844, act: act(!before, false), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h2-basic-1500', save, mode: 'basic', width: 1500, height: 900, act: act(!before, false), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h3-info-open-390', save, mode: 'advanced', width: 390, height: 844, act: act(!before, true), shots: [{ sel: '#nowStar .ns-card.first' }] },
];
