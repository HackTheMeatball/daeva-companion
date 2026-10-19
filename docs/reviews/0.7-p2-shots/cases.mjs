/* 0.7 P2: the Gladiator guide and the class picker. The New character form (before: Assassin and Ranger; after: Assassin,
   Ranger and Gladiator); a Gladiator at Lv 22 in Advanced on desktop, and its Build drawer (stat priority only: the
   drawer's Rotation section is still the Assassin's). The Gladiator screens are new (afterOnly: the base build has no
   Gladiator guide). Format: tests/support/shots.mjs. */
const GLADIATOR = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
const lv22 = { level: 22, checks: {}, welcomed: 1 };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); } },
  { name: 'gladiator-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: GLADIATOR },
  { name: 'gladiator-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: GLADIATOR,
    act: () => { document.getElementById('sdTab').click(); } },
];
