/* 0.6.1 F4 (#337): at Lv 20 on desktop, with the Nezekan board just opened, the board line wraps inside the Daevanion
   card (format: tests/support/shots.mjs). The headings and hit areas change nothing on screen. */
const save = { level: 20, quest: 'Cemetery Cleanup', open: {}, hideCards: false, checks: {} };
export default [
  { name: 'daevanion-board-line-1366', save, mode: 'advanced', width: 1366, height: 1000, shots: [{ sel: '#dvBox' }] },
];
