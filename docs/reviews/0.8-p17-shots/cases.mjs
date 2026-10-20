/* 0.8 P17: the Sorcerer guide and the class picker. The New character form (before: Assassin, Ranger, Gladiator,
   Spiritmaster, Templar and Cleric; after: the Sorcerer too); a Sorcerer at Lv 22 in Advanced on desktop and phone and at
   Lv 45 on desktop (skill and stigma icons), its Build plan card (the conditional skills, the leveling loop and holding 4
   to charge Hellfire) and its Build drawer (stat priority and the game's default keys). The Sorcerer screens are new
   (afterOnly: the base build has no Sorcerer guide). Format: tests/support/shots.mjs. */
const SORCERER = { pack: 'aion2/asmodian/sorcerer', class: 'sorcerer' };
const lv22 = { level: 22, checks: {}, welcomed: 1 }, lv45 = { level: 45, checks: {}, welcomed: 1 };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); } },
  { name: 'sorcerer-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: SORCERER },
  { name: 'sorcerer-lv22-advanced-390', afterOnly: true, width: 390, height: 1600, mode: 'advanced', save: lv22, char: SORCERER },
  { name: 'sorcerer-lv45-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv45, char: SORCERER },
  { name: 'sorcerer-build-plan-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: SORCERER,
    act: () => { [...document.querySelectorAll('#routeCard details')].find(d => d.querySelector('summary').textContent.includes('Build plan')).open = true; },
    shots: [{ sel: '.card', text: 'only fire on a condition' }] },
  { name: 'sorcerer-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: SORCERER,
    act: () => { document.getElementById('sdTab').click(); } },
];
