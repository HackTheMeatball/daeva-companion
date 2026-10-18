/* 0.6 P6 (#265): story step texts that named the step title "it" / "them". Golden states (tests/golden/states.js; the
   saves from the generator itself) at Lv 3 on "Shadow Forest", where the story card is the first card and lists its
   objectives (Search Munihelle Forest), Basic, 390 px. The other three texts sit on cards the golden states show
   collapsed; their change is in the nextup/ golden diff. */
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
const card = [{ sel: '#nowStar .ns-card.first' }];

export default [
  { name: '1-lv3-shadow-forest', mode: 'basic', act: notabs, save: save('level/L03-q02-before-B'), shots: card },
];
