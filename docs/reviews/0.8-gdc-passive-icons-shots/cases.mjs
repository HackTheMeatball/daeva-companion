/* Passive icons from the owner's 2026-10-20 checks (Game Data Check; docs/ISSUES.md "Chanter passive icons"). Of the
   skills that gained an icon, only the Chanter's Recuperation (daevacompass.com, owner-approved) is in a guide build
   plan, so only it can show in the app; the three relabelled Cleric files appear in no card today. The shot: a Chanter
   at Lv 8, Advanced, desktop, Skills card, after marking points spent until Recuperation is the next skill: before, a
   letter square; after, the game's icon. Format: tests/support/shots.mjs. */
/* acts run in the page, so each names its skill literally (a closure would not serialize) */
const toRecuperation = async () => {
  for (let i = 0; i < 80 && !/Recuperation/.test(document.getElementById('spHero').textContent); i++) {
    const b = document.getElementById('spBuy'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 30)); }
  document.getElementById('spCard').scrollIntoView({ block: 'start' }); };
export default [
  { name: 'chanter-lv8-recuperation-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 8, checks: {}, welcomed: 1 },
    char: { pack: 'aion2/asmodian/chanter', class: 'chanter' }, act: toRecuperation, shots: [{ sel: '#spCard' }] },
];
