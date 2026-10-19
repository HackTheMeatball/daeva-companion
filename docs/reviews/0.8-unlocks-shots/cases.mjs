/* #325 (data audit): Metabot's dungeon pages back the Lv 25 and Lv 30 Sealed Dungeon batches and its Daevanion
   planner backs the Zikel / Vaizel / Triniel board levels. The Lv 30 batch was single source, so the Ahead card at Lv 29
   now lists it; both batches credit Metabot. No level changed.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-unlocks-shots */
const save = { level: 29, open: {}, hideCards: false };
export default [
  { name: 'ahead-lv29', width: 1400, height: 1000, mode: 'advanced', save, shots: [{ sel: '#ahead' }] },
];
