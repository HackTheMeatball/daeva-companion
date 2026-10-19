/* 0.7 P4: the Spiritmaster guide and the class picker. The New character form (before: Assassin, Ranger and Gladiator;
   after: the Spiritmaster too); a Spiritmaster at Lv 22 in Advanced on desktop, its Build plan card (the step that states
   the three conditional skills) and its Build drawer (stat priority only: the drawer's Rotation section is still the
   Assassin's). The Spiritmaster screens are new (afterOnly: the base build has no Spiritmaster guide). Format:
   tests/support/shots.mjs. */
const SPIRITMASTER = { pack: 'aion2/asmodian/spiritmaster', class: 'spiritmaster' };
const lv22 = { level: 22, checks: {}, welcomed: 1 };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); } },
  { name: 'spiritmaster-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: SPIRITMASTER },
  { name: 'spiritmaster-build-plan-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: SPIRITMASTER,
    act: () => { [...document.querySelectorAll('#routeCard details')].find(d => d.querySelector('summary').textContent.includes('Build plan')).open = true; },
    shots: [{ sel: '.card', text: 'only fire on a condition' }] },
  { name: 'spiritmaster-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: SPIRITMASTER,
    act: () => { document.getElementById('sdTab').click(); } },
];
