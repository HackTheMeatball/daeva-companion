/* Game Data Check: the regional quest rq:2202044 is "Shugo-of-All-Trades" in game (owner screenshot 2026-10-20,
   owner:2026-10-20-shugo-01), not Metabot's page name "Shugo-of-All-Trades: Asmodian". One golden `story` state
   (tests/golden/states.js, the save from the generator itself) at Lv 12: the Next up regional quest card.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-shugo-name-shots */
import { createRequire } from 'node:module';
import { coreBundle } from '../../../tests/support/core-bundle.mjs';
import { catalogOf } from '../../../tests/invariant/states.mjs';

const require = createRequire(import.meta.url);
const { generate } = require('../../../tests/golden/states.js');
const { parseStored } = require('../../../tests/support/save.js');
const M = await coreBundle(), states = new Map(generate(catalogOf(M)).map(s => [s.id, s.raw]));
const save = id => { const raw = states.get(id); if (!raw) throw new Error(`cases: no golden state ${id}`); return parseStored(raw); };
/* the desktop stack scrolls one card at a time (its height set by script): unrolled by a style rule, both builds alike, so
   the shot holds the regional card */
const unroll = () => { const s = document.createElement('style'); s.textContent = '#nowStar .ns-stack { height: auto !important; overflow: visible !important; mask-image: none !important; -webkit-mask-image: none !important; transition: none !important; }'; document.head.append(s); };
const rq = { sel: '.ns-card', text: 'Regional quests' };

export default [
  { name: '1-l12-regional-shugo', mode: 'advanced', width: 1500, height: 1000, act: unroll, save: save('story/L12-q15-before-A'), shots: [rq] },
];
