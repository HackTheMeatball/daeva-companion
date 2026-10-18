/* 0.6 P5: the Ranger guide and the class picker. The New character form (before: the Assassin only; after: Assassin and
   Ranger); a Ranger at Lv 22 in Advanced on desktop, and its Build drawer (stat priority only: no source gives a Ranger key
   setup). The Ranger screens are new (afterOnly: the base build has no Ranger guide). Format: tests/support/shots.mjs. */
const RANGER = { pack: 'aion2/asmodian/ranger', class: 'ranger' };
const lv22 = { level: 22, checks: {}, welcomed: 1 };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); } },
  { name: 'ranger-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: RANGER },
  { name: 'ranger-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: RANGER,
    act: () => { document.getElementById('sdTab').click(); } },
];
