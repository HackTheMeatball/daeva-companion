/* #640 (0.9 P18): how the rotation plays. Under the Rotation's chains, the Build drawer now says how it plays (the macro
   line both sources agree on, what stays off the macro) with its source line. Shot: the Assassin's Build drawer, Rotation
   part, Key setup closed, at Lv 20, 1500 px and 390 px. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p18-shots */
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
};
const shots = [{ sel: '#statDrawer .sd-rot' }];
export default [1500, 390].map(width => ({
  /* tall viewports: the drawer scrolls, and an element shot is clipped to what its scroll box shows */
  name: `rotation-play-lv20-${width}`, width, height: width === 1500 ? 2400 : 2600, mode: 'advanced',
  save: { level: 20, open: {}, hideCards: false }, act, shots,
}));
