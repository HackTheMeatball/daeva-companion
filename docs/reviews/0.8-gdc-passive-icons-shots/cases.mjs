/* Passive icons from the owner's 2026-10-20 checks (Game Data Check; docs/ISSUES.md "Passive icons from
   daevacompass.com"). Of the twelve skills that gained an icon, the Chanter's Attack Preparation (core), Recuperation and
   Blessing of Life (optional) are in a guide build plan, so only they can show in the app; shots for the first two. A
   Chanter at Lv 13 (Attack Preparation) and at Lv 8 (Recuperation), Advanced, desktop, Skills card, after marking points
   spent until that skill is the next one: before, a letter square; after, the game's icon. The Cleric and Templar icons
   appear in no card today. Format: tests/support/shots.mjs. */
/* acts run in the page, so each names its skill literally (a closure would not serialize) */
const toAttackPrep = async () => {
  for (let i = 0; i < 80 && !/Attack Preparation/.test(document.getElementById('spHero').textContent); i++) {
    const b = document.getElementById('spBuy'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 30)); }
  document.getElementById('spCard').scrollIntoView({ block: 'start' }); };
const toRecuperation = async () => {
  for (let i = 0; i < 80 && !/Recuperation/.test(document.getElementById('spHero').textContent); i++) {
    const b = document.getElementById('spBuy'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 30)); }
  document.getElementById('spCard').scrollIntoView({ block: 'start' }); };
export default [
  { name: 'chanter-lv13-attack-preparation-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 13, checks: {}, welcomed: 1 },
    char: { pack: 'aion2/asmodian/chanter', class: 'chanter' }, act: toAttackPrep, shots: [{ sel: '#spCard' }] },
  { name: 'chanter-lv8-recuperation-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 8, checks: {}, welcomed: 1 },
    char: { pack: 'aion2/asmodian/chanter', class: 'chanter' }, act: toRecuperation, shots: [{ sel: '#spCard' }] },
];
