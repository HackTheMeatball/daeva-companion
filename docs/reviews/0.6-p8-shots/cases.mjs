/* 0.6 P8: Respec button on the Skills card. Skills card footer at 1100 px, Lv 30, Advanced (format: tests/support/shots.mjs). */
const save = { level: 30, open: {}, hideCards: false, stones: 20, checks: { 'sp:Heart Gore:2': true, 'sp:Heart Gore:3': true } };
export default [
  { name: 'skills-footer', mode: 'advanced', width: 1100, height: 900, save, shots: [{ sel: '#spCard' }] },
];
