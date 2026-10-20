/* 0.8.1 F1 (#591): a fresh Assassin at Lv 39 (the owner's level) with All nodes open: every plan row's cost box is
   pre-filled from the owner's boards (Nezekan 52, Zikel 47, Vaizel 39), the Nezekan corner is the Combat Speed corner,
   and Vaizel lists Ambush and Exploit Weakness before its corner (format: tests/support/shots.mjs). */
const save = { level: 39, quest: 'Cemetery Cleanup', open: {}, hideCards: false, checks: {}, dvTotal: 112, dvAllOpen: true };
const boards = ['Nezekan', 'Zikel', 'Vaizel'];
export default [1500, 390].flatMap(w => boards.map(b => ({
  name: `${b.toLowerCase()}-${w}`, save, mode: 'advanced', width: w, height: 1000,
  shots: [{ sel: '#dvAllList ul.dv-board', text: `${b} ·` }],
})));
