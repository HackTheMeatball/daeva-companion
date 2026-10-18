/* 0.5 P16 (#208): the travel line on the story card (travelAdvice), "I'll walk" and "Prefer running". Golden states
   (tests/golden/states.js) at Lv 19 on "Watchful Eyes", last seen at a Moslan Forest Sealed Dungeon: the turn-in's
   Kibelisk (Temporary Retreat) is bound and another zone, so the line says "Teleport to Temporary Retreat (1 scroll), then
   401 m". Every objective before "Turn in" is ticked (unticked ones carry no point yet, so no line: design §3; ticks
   carry no date, so the player is still placed at the dungeon). The save has no skill points left (stones -100), so
   the story card is the first card, as S1 draws it. Basic
   (-B) and Advanced (-A) at 1500 px (S1 D2, D4) and 390 px (S1 M3, M5); Advanced shows the "Prefer running" box in the
   options row, so its shots hold the whole Next up. */
import { createRequire } from 'node:module';
import { coreBundle } from '../../../tests/support/core-bundle.mjs';
import { catalogOf } from '../../../tests/invariant/states.mjs';

const require = createRequire(import.meta.url);
const { generate } = require('../../../tests/golden/states.js');
const { parseStored } = require('../../../tests/support/save.js');
const M = await coreBundle(), states = new Map(generate(catalogOf(M)).map(s => [s.id, s.raw]));
const Q = 'Watchful Eyes', ticked = { [Q]: M.QUEST_STEPS[Q].map((t, i) => i).filter(i => !/^Turn in\b/.test(M.QUEST_STEPS[Q][i])) };
const save = id => { const raw = states.get(id); if (!raw) throw new Error(`cases: no golden state ${id}`); const s = parseStored(raw);
  if (s.quest !== Q) throw new Error(`cases: ${id} is on ${s.quest}, not ${Q}`); return { ...s, stones: -100, qsteps: { ...s.qsteps, ...ticked } }; };
const unroll = () => { const s = document.createElement('style'); s.textContent = '#nowStar .ns-stack { height: auto !important; overflow: visible !important; mask-image: none !important; -webkit-mask-image: none !important; transition: none !important; }'; document.head.append(s); };
const notabs = () => { const s = document.createElement('style'); s.textContent = '#tabBar { display: none !important; }'; document.head.append(s); };
const card = [{ sel: '#nowStar .ns-card.first' }], top = [{ sel: '#nowStar' }], wide = { width: 1500, height: 1000, act: unroll };
const A = 'loc/L19-q26-before-A-sd-moslan-forest', B = 'loc/L19-q26-before-B-sd-moslan-forest';

export default [
  { name: '1-d1500-basic', mode: 'basic', ...wide, save: save(B), shots: card },
  { name: '2-d1500-advanced', mode: 'advanced', ...wide, save: save(A), shots: top },
  { name: '3-m390-basic', mode: 'basic', act: notabs, save: save(B), shots: card },
  { name: '4-m390-advanced', mode: 'advanced', act: notabs, save: save(A), shots: top },
];
