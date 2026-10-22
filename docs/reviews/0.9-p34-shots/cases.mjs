/* 0.9 P34 (#781): the 2026-10-21 patch adds a sixth Daevanion board, Ariel. The Daevanion tip (Assassin, Lv 13, at
   the "Complete Urgent Pursuit" step) keeps the five boards to Lv 45 and now says Ariel is endgame, its points only from
   Expedition (Hard).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p34-shots */
const tip = () => {
  const b = document.querySelector('.tip[data-tip="daevanion"]');
  for (let d = b && b.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
  b?.click();
};
export default [
  { name: 'tip-daevanion', width: 1400, height: 1400, mode: 'advanced', save: { level: 13 }, act: tip, shots: [{ sel: 'li.tipbox' }] },
];
