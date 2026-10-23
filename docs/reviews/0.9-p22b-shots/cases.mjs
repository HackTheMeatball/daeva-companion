/* #855 (0.9 P22b, docs/design/0.9-keys/README.md §11 and #388, frames 12-sheet-fill-1500 and 388-key-listen-390): Key
   setup's desktop panel in the drawer's place (before: the drawer's fold), the phone's key picker opened from the E chip
   (a new screen), and Next up's "put it on E, row N" chip following a rebound E (Design Lead local review on 9871005).
   keysetup: 1400 px tall so the ends of both of the panel's columns show ("Coming to E" left, the row-order note right).
   stequip: the 0.9 P8 equip-row save (Lv 22, slot 1 open, 1 shard; its shots show the stigma equip card under the hero, not
   first, so the phone cuts "Stigma slot 1 is…" and keeps "then put it on E, row 0 (fires first)" whole) with E rebound to
   R: the chip reads R after, E before (no space before the comma; the 22 px chip on the one-line phone row).
   tests/e4test.js checks the same chip on the regress fixture.
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
const lv22 = { level: 22, open: {}, hideCards: false, stShards: 1, checks: { 'g22:0': 1 }, keyBinds: { E: 'R' } };
const stequip = [1500, 390].map(width => ({ name: `nextup-stequip-${width}`, width, height: width > 900 ? 1100 : 1400, mode: 'advanced',
  save: lv22, shots: [{ sel: '#nowStar .ns-card', text: 'Stigma slot' }] }));
export default [
  { name: 'keysetup-lv27-1500', width: 1500, height: 1400, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act: openKeys },
  { name: 'keypicker-lv27-390', afterOnly: true, width: 390, height: 844, mode: 'advanced',
    save: { level: 27, open: {}, hideCards: false }, act: pickAct },
  ...stequip,
];
