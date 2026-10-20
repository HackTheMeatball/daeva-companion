/* 0.8 P19: the Chanter guide and the class picker. The New character form (before: the Assassin to the Sorcerer; after:
   the Chanter too), its top and, at 390 px, the bottom of the sheet with Create character above the bottom bar (#551's
   ask: with eight classes the top shot cuts off before the buttons); a Chanter at Lv 22 in Advanced on desktop and phone
   and at Lv 45 on desktop (skill and stigma icons), its Build plan card (the conditional skills and the Dark Crush window
   loop) and its Build drawer (stat priority and the game's default keys). The Chanter screens are new (afterOnly: the
   base build has no Chanter guide). Format: tests/support/shots.mjs. */
const CHANTER = { pack: 'aion2/asmodian/chanter', class: 'chanter' };
const lv22 = { level: 22, checks: {}, welcomed: 1 }, lv45 = { level: 45, checks: {}, welcomed: 1 };
const openPicker = () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); };
export default [
  { name: 'picker-new-character-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900, act: openPicker },
  { name: 'picker-new-character-bottom-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 844,
    act: () => { document.getElementById('charBtn').click(); document.getElementById('charNew').click(); document.getElementById('charCreate').scrollIntoView({ block: 'center' }); } },
  { name: 'chanter-lv22-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: CHANTER },
  { name: 'chanter-lv22-advanced-390', afterOnly: true, width: 390, height: 1600, mode: 'advanced', save: lv22, char: CHANTER },
  { name: 'chanter-lv45-advanced-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv45, char: CHANTER },
  { name: 'chanter-build-plan-1500', afterOnly: true, width: 1500, height: 1400, mode: 'advanced', save: lv22, char: CHANTER,
    act: () => { [...document.querySelectorAll('#routeCard details')].find(d => d.querySelector('summary').textContent.includes('Build plan')).open = true; },
    shots: [{ sel: '.card', text: 'only fire on a condition' }] },
  { name: 'chanter-build-drawer-1500', afterOnly: true, width: 1500, height: 1000, mode: 'advanced', save: lv22, char: CHANTER,
    act: () => { document.getElementById('sdTab').click(); } },
];
