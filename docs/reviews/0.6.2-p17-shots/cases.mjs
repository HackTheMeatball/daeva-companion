/* 0.6.2 P17 (#397): Next up step cards say how (the step's first sentence after its bold phrase, the rest behind "i"),
   and Wisdom Stones, Daevanion Crystals and Enhance Stones show their icon on Next up cards and reward lines. The same
   frames as the approved mockup (docs/design/mockups/0.6.2-step-how/cases.mjs, h1-h3, i1-i4), drawn by the app itself.
   i3 is the Zikel board card (Lv 20): "Save your Enhance Stones" left the guide in P16 (#398).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.6.2-p17-shots */
import { coreBundle } from '../../../tests/support/core-bundle.mjs';

const M = await coreBundle();
const at = (L, extra = {}) => ({ level: L, quest: M.QUESTS.find(([l]) => l >= L)[1], open: {},
  checks: Object.fromEntries(M.GATES.filter(g => g.lv < L).flatMap(g => g.items.filter(it => it.k)).map(it => [it.k, true])), ...extra });
/* both builds bring the card to the top (as if the story and earlier rows were done), so they show the same card */
const pick = (re, info) => new Function(`const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);${info ? " sc.classList.add('show-info');" : ''}`);
const save12 = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {}, pendSt: 3, pendCr: 2 };
export default [
  { name: 'h1-basic-390', save: at(10), mode: 'basic', width: 390, height: 844, act: pick('/Extract gear/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h2-basic-1500', save: at(10), mode: 'basic', width: 1500, height: 900, act: pick('/Extract gear/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h3-info-open-390', save: at(10), mode: 'advanced', width: 390, height: 844, act: pick('/Extract gear/', true), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h4-advanced-1500', save: at(10), mode: 'advanced', width: 1500, height: 900, act: pick('/Extract gear/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i1-cube-390', save: save12, mode: 'advanced', width: 390, height: 844, act: pick('/Use your Cube/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i2-dungeon-390', save: save12, mode: 'advanced', width: 390, height: 844, act: pick('/^Clear /', true), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i3-step-card-390', save: at(20), mode: 'advanced', width: 390, height: 844, act: pick('/Zikel/'), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i4-dungeons-card-1500', save: save12, mode: 'advanced', width: 1500, height: 1000, shots: [{ sel: '#areaList li.sh-note', text: 'Wisdom' }] },
];
