/* 0.6 P9: green (+x) on skill levels raised by Daevanion nodes. Skills card at 1100 px, Lv 30, Advanced, Sync levels open:
   Heart Gore lines to 5 with two Heart Gore nodes ticked (+2), Quick Slice with one (+1) (format: tests/support/shots.mjs). */
const save = { level: 30, open: {}, hideCards: false, stones: 20, checks: {
  'sp:Heart Gore:2': true, 'sp:Heart Gore:3': true, 'sp:Heart Gore:4': true, 'sp:Heart Gore:5': true,
  'dv:hg': true, 'dv:t:hg': true, 'dv:qs': true } };
const act = () => { document.getElementById('syncBox').open = true; };
export default [
  { name: 'skills-bonus', mode: 'advanced', width: 1100, height: 900, save, act, shots: [{ sel: '#spCard' }] },
];
