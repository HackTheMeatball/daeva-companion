/* Review follow-up to #407: the disputed Overhead Slam line credits the third source (mmo-codex class page) and names
   the two picks other sources take (AoE, HP absorb). The Confidence card of a Lv 22 Gladiator in Advanced on desktop.
   Format: tests/support/shots.mjs. */
const GLADIATOR = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
export default [
  { name: 'gladiator-confidence-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 22, checks: {}, welcomed: 1 }, char: GLADIATOR,
    act: () => { document.getElementById('confCard').open = true; }, shots: [{ sel: '#confCard' }] },
];
