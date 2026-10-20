/* 0.8 P3: the Templar guide and the class picker. The New character form (before: Assassin, Ranger, Gladiator and
   Spiritmaster; after: the Templar too); a Templar at Lv 22 in Advanced on desktop and phone and at Lv 45 on desktop
   (skill and stigma icons, no letter squares), its Build plan card (the step that states the five conditional skills)
   and its Build drawer (stat priority and the game's default keys). The Templar screens are new (afterOnly: the base
   build has no Templar guide). Format: tests/support/shots.mjs. */
const TEMPLAR = { pack: 'aion2/asmodian/templar', class: 'templar' };
const lv22 = { level: 22, checks: {}, welcomed: 1 }, lv45 = { level: 45, checks: {}, welcomed: 1 };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); } },
  { name: 'templar-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: TEMPLAR },
  { name: 'templar-lv22-advanced-390', afterOnly: true, width: 390, height: 1600, mode: 'advanced', save: lv22, char: TEMPLAR },
  { name: 'templar-lv45-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv45, char: TEMPLAR },
  { name: 'templar-build-plan-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: TEMPLAR,
    act: () => { [...document.querySelectorAll('#routeCard details')].find(d => d.querySelector('summary').textContent.includes('Build plan')).open = true; },
    shots: [{ sel: '.card', text: 'only fire on a condition' }] },
  { name: 'templar-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: TEMPLAR,
    act: () => { document.getElementById('sdTab').click(); } },
];
