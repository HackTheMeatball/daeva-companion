/* 0.6 P12 (#271): no mention of a Kibelisk bind that happens at an objective within 25 m. Golden states
   (tests/golden/states.js) where the story card is the first card and lists its objectives, Basic, 390 px: Lv 5 on
   "The Being Beneath the Lake" (its "Bind with the Witch's Cabin Kibelisk" step hidden, the next step's marker dropped)
   and Lv 12 on "Veiled Truth" (both objectives' "(Kibelisk: Quai Campsite)" dropped). */
import { createRequire } from 'node:module';
import { coreBundle } from '../../../tests/support/core-bundle.mjs';
import { catalogOf } from '../../../tests/invariant/states.mjs';

const require = createRequire(import.meta.url);
const { generate } = require('../../../tests/golden/states.js');
const { parseStored } = require('../../../tests/support/save.js');
const M = await coreBundle(), states = new Map(generate(catalogOf(M)).map(s => [s.id, s.raw]));
const save = id => { const raw = states.get(id); if (!raw) throw new Error(`cases: no golden state ${id}`); return parseStored(raw); };
/* the phone's bottom tab bar is fixed, so an element shot taller than the screen would show it over a row: hidden */
const notabs = () => { const s = document.createElement('style'); s.textContent = '#tabBar { display: none !important; }'; document.head.append(s); };
const story = text => [{ sel: '#nowStar .ns-card', text }];

export default [
  { name: '1-lv5-being-beneath-the-lake', mode: 'basic', act: notabs, save: save('level/L05-q04-before-A'), shots: story('The Being Beneath the Lake') },
  { name: '2-lv12-veiled-truth', mode: 'basic', act: notabs, save: save('level/L12-q16-before-A'), shots: story('Veiled Truth') },
];
