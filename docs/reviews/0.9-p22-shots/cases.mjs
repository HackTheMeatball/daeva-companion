/* #644 (0.9 P22, docs/design/0.9-keys-macro.md, frames docs/design/0.9-keys/22-*): the Build drawer's Rotation (the Hold
   step now carries the MP warning) and its Key setup fold open (square icon-filled boxes, key chips you can rebind, the
   macro as steps; the old third line gone). Shots: the Assassin at Lv 27, 1500 px and 390 px.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p22-shots */
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  const ks = document.querySelector('#statDrawer details.mini'); if (ks) ks.open = true;
};
const shots = [{ sel: '#statDrawer .sd-rot' }];
export default [1500, 390].map(width => ({
  /* tall viewports: the drawer scrolls, and an element shot is clipped to what its scroll box shows */
  name: `keysetup-lv27-${width}`, width, height: width === 1500 ? 2600 : 3000, mode: 'advanced',
  save: { level: 27, open: {}, hideCards: false }, act, shots,
}));
