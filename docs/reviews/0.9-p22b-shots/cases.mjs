/* #855 (0.9 P22b, docs/design/0.9-keys/README.md §11 and #388, frames 12-sheet-fill-1500 and 388-key-listen-390): Key
   setup's desktop panel in the drawer's place (before: the drawer's fold), the phone's key picker opened from the E chip
   (a new screen). Next up's "put it on E" chip following a rebound key is checked in tests/e4test.js (it needs the
   regress fixture's stigma state, which a flat save here doesn't build).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p22b-shots */
const openKeys = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  const ks = document.querySelector('#statDrawer details.mini'); if (ks) ks.open = true;
  return new Promise(res => setTimeout(res, 400));
};
const pickAct = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('tabBuild').click();
  const ks = document.querySelector('#statDrawer details.mini'); if (ks) ks.open = true;
  return new Promise(res => setTimeout(() => { const c = document.querySelector('#stackViz [data-col="E"]'); if (c) c.click(); setTimeout(res, 300); }, 400));
};
export default [
  { name: 'keysetup-lv27-1500', width: 1500, height: 1000, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act: openKeys },
  { name: 'keypicker-lv27-390', afterOnly: true, width: 390, height: 844, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act: pickAct },
];
