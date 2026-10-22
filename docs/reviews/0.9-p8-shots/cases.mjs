/* 0.9 P8 (#625) small text and colour fixes, each at 1500 and 390 px. Format: tests/support/shots.mjs.
   spent: Lv 4 with skill points, Next up's first card is a skill buy ("Spent", with the "Open Skills: press K" line).
   nextup: Lv 25, nothing ticked: the whole Next up (the featured card's "Mark spent" in the same green at both widths).
   equip-row: Lv 22, slot 1 open, 1 shard: the stigma equip card below the hero; on a phone row "Stigma slot 1 is..."
   is cut and "· then put it on E, row N" stays whole (at 1500 nothing changes).
   egrid: the same save's Key setup grid (the Build drawer): Triniel's Dagger (Lv 22, not equipped) left E, as
   "Coming to E" under the grid lists it. */
const lv4 = { level: 4, open: {}, hideCards: false, checks: {} };
const lv25 = { level: 25, open: {}, hideCards: false, dvTotal: 40, checks: {} };
const lv22 = { level: 22, open: {}, hideCards: false, stShards: 1, checks: { 'g22:0': 1 } };
const drawer = () => { const d = document.getElementById('statDrawer'), t = document.getElementById('tabBuild');
  if (t && t.offsetParent) t.click(); else if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  document.querySelectorAll('#statDrawer details').forEach(x => { x.open = true; }); };
const both = (name, extra) => [1500, 390].map(width => ({ name: `${name}-${width}`, width, height: width > 900 ? 1100 : 1400, mode: 'advanced', ...extra }));
export default [
  ...both('1-spent', { save: lv4, shots: [{ sel: '#nowStar .ns-card.first' }] }),
  ...both('2-nextup', { save: lv25, shots: [{ sel: '#nowStar' }] }),
  ...both('4-equip-row', { save: lv22, shots: [{ sel: '#nowStar' }] }),
  ...both('3-egrid', { save: lv25, act: drawer, shots: [{ sel: '#stackViz' }] }),
];
