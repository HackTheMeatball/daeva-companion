/* 0.6.1 F1 (#334): at Lv 1 (a fresh start), the story card's objective count right after ticking "Remember Aldelle Village"
   (before the row fades), and the Journey card's Ahead list in level order (format: tests/support/shots.mjs). */
const tick = () => { document.querySelector('#nowStar input[data-nsobj]').click(); };
export default [
  { name: 'story-count', width: 1400, height: 900, act: tick, shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'ahead', width: 1400, height: 900, shots: [{ sel: '#ahead' }] },
];
