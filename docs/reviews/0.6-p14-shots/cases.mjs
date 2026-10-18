/* 0.6 P14: default keys. "Open Skills: press K" on the Next up row that spends skill points, and the K chip on the
   Skills card (mockup K1: 390 px, Basic, Lv 4); the same with U for Daevanion on desktop (DK1: 1500 px, Advanced, Lv 13,
   "Urgent Pursuit" turned in). Format: tests/support/shots.mjs. */
const lv4 = { level: 4, open: {}, hideCards: false, checks: {} };
const lv13 = { level: 13, quest: 'Cemetery Cleanup', open: {}, hideCards: false, dvTotal: 40, checks: {} };
export default [
  { name: 'k1-nextup-390', mode: 'basic', save: lv4, shots: [{ sel: '#nowStar' }] },
  { name: 'k1-skills-390', mode: 'basic', save: lv4, shots: [{ sel: '#spCard' }] },
  { name: 'dk1-1500', mode: 'advanced', width: 1500, height: 1000, save: lv13 },
];
