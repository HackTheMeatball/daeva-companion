/* 0.8.1 F2 (#592, owner note 5): a labelled specialty pick in every core slot 2. An Assassin at Lv 45 with every skill line
   and every Daevanion plan node bought, Advanced, so each slot 2 the plan reaches is open. Before: Insignia Explosion and
   Ambush read "Slot 2 open: pick a specialty"; after: "Pick: <choice>" with its label (disputed). Savage Roar and
   Shadowstrike stay below skill Lv 12 with the plan (Q5): their slot 2 is a Skills card Coming up row whose tooltip names
   the pick ("Guide pick: … contested / inferred at skill Lv 12"); a tooltip doesn't show in a screenshot, so the Skills card
   shot shows the rows and tests/labels.js checks the text. Format: tests/support/shots.mjs. */
import { generate } from '../../../tools/gen/gen.mjs';

const out = generate({ pack: 'aion2/asmodian/assassin' }), g = out.constants;
const lines = [...g.SP_SKILLS_CORE, ...g.SP_EXTRA].flatMap(s => Array.from({ length: 9 }, (_, i) => `sp:${s.n}:${i + 2}`));
const plan = Object.values(out.gateGraph.nodes).filter(n => n.kind === 'plan' && n.key).map(n => n.key);
const slot1 = g.SP_SKILLS_CORE.filter(s => s.spec && !s.passive).map(s => `sp:${s.n}:spec`);
/* the slot 2 picks the plan reaches; ticking all but one makes that one the Skills card's hero and Next up's skill card */
const OPEN2 = ['Heart Gore', 'Quick Slice', 'Insignia Explosion', 'Ambush'];
const saveFor = skip => ({ level: 45, stones: 200, welcomed: 1,
  checks: Object.fromEntries([...lines, ...plan, ...slot1, ...OPEN2.filter(n => n !== skip).map(n => `sp:${n}:spec2`)].map(k => [k, true])) });
const shots = [{ sel: '#spCard' }, { sel: '#nowStar', suffix: '-nextup' }];

export default [
  { name: 'insignia-explosion-slot2-1500', width: 1500, height: 1400, mode: 'advanced', save: saveFor('Insignia Explosion'), shots },
  { name: 'ambush-slot2-1500', width: 1500, height: 1400, mode: 'advanced', save: saveFor('Ambush'), shots },
  /* Savage Roar and Shadowstrike: every reachable slot 2 picked, so their slot 2 rows lead Coming up (the pick is in the
     row's tooltip: the plan stops below skill Lv 12) */
  { name: 'savage-roar-shadowstrike-slot2-1500', width: 1500, height: 1400, mode: 'advanced', save: saveFor(null), shots: [{ sel: '#spCard' }] },
  { name: 'insignia-explosion-slot2-390', width: 390, height: 1400, mode: 'advanced', save: saveFor('Insignia Explosion'), shots: [{ sel: '#nowStar', suffix: '-nextup' }] },
];
