/* Game Data Check follow-up to 0.7 P2 (#393): Overhead Slam's Lv 8 specialty pick moves from the Gladiator's verified
   specialty line to a disputed line of its own (C64: two sources for it, two against). The Confidence card of a Lv 22
   Gladiator in Advanced on desktop, before and after. Format: tests/support/shots.mjs. */
const GLADIATOR = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
export default [
  { name: 'gladiator-confidence-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 22, checks: {}, welcomed: 1 }, char: GLADIATOR,
    act: () => { document.getElementById('confCard').open = true; }, shots: [{ sel: '#confCard' }] },
];
