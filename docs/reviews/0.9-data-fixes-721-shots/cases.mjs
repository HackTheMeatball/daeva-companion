/* Game Data Check data fixes from the per-class sweep (#721 item 10): two shared milestone blurbs that only fit the
   Assassin. Lv 15 "plus four skill upgrades" becomes "plus skill upgrades" (other classes list 1–3); Lv 37 drops "Full
   rotation online" (the Spiritmaster has no rotation). Shown for the Spiritmaster, where both were wrong, desktop.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-data-fixes-721-shots */
const char = { pack: 'aion2/asmodian/spiritmaster', class: 'spiritmaster' };
const ms = (g, level) => ({ level, welcomed: 1, open: { [g]: true } });
export default [
  { name: 'milestone-lv15-1500', width: 1500, height: 1600, mode: 'advanced', save: ms('g15', 15), char, shots: [{ sel: '#g15' }] },
  { name: 'milestone-lv37-1500', width: 1500, height: 1600, mode: 'advanced', save: ms('g37', 37), char, shots: [{ sel: '#g37' }] },
];
