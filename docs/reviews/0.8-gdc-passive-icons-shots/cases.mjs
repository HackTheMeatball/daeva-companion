/* Passive icons from the owner's 2026-10-20 checks (Game Data Check; docs/ISSUES.md "Passive icons from
   aion2-meta.com"). Of the eleven passives that gained an icon, only the Chanter's Attack Preparation (core) and Blessing
   of Life (optional) are in a guide build plan, so only they can show in the app. The shot: a Chanter at Lv 13, Advanced,
   desktop, Skills card, after marking points spent until Attack Preparation is the next skill: before, a letter square;
   after, the game's icon. The other ten (Cleric, Templar, Chanter Impact Hit and Survival Willpower) appear in no card
   today. Format: tests/support/shots.mjs. */
const toAttackPrep = async () => {
  for (let i = 0; i < 80 && !/Attack Preparation/.test(document.getElementById('spHero').textContent); i++) {
    const b = document.getElementById('spBuy'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 30)); }
  document.getElementById('spCard').scrollIntoView({ block: 'start' }); };
export default [
  { name: 'chanter-lv13-attack-preparation-1500', width: 1500, height: 1400, mode: 'advanced', save: { level: 13, checks: {}, welcomed: 1 },
    char: { pack: 'aion2/asmodian/chanter', class: 'chanter' }, act: toAttackPrep, shots: [{ sel: '#spCard' }] },
];
