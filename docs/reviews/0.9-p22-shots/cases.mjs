/* #644 (0.9 P22, docs/design/0.9-keys-macro.md rev 2.2, frames docs/design/0.9-keys/22-*): the Build drawer's Rotation
   (the Hold step now carries the MP warning) and its Key setup fold open (square icon-filled boxes up to 88 px, key chips
   you can rebind, the macro as steps with its numbered how-to). Shots: the Assassin at Lv 27, 1500 px and 390 px, and at
   360 px (after only) with the right-hand column's top box focused, its tooltip open.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p22-shots */
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  const ks = document.querySelector('#statDrawer details.mini'); if (ks) ks.open = true;
};
const tipAct = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  const ks = document.querySelector('#statDrawer details.mini'); if (ks) ks.open = true;
  /* after the drawer's own focus move (to its close button, next frame) */
  return new Promise(res => setTimeout(() => { const c = document.querySelector('#stackViz > .sk.tip-r[data-tip]');
    if (c) { c.scrollIntoView({ block: 'center' }); c.focus({ preventScroll: true }); } res(); }, 400));
};
const shots = [{ sel: '#statDrawer .sd-rot' }];
export default [
  ...[1500, 390].map(width => ({
    /* tall viewports: the drawer scrolls, and an element shot is clipped to what its scroll box shows */
    name: `keysetup-lv27-${width}`, width, height: width === 1500 ? 2600 : 3000, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act, shots,
  })),
  { name: 'keysetup-lv27-360-tooltip', afterOnly: true, width: 360, height: 3000, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act: tipAct, shots: [{ sel: '#stackViz' }] },
];
