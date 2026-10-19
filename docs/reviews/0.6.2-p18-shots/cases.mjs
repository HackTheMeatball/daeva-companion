/* 0.6.2 P18 (#414): the Key setup grid in the Build drawer shows skill icons with the name under them, all cells 72 px,
   key chips under the columns, Quick Slice's icon on the Left click line. Mockup frames k1-k3 (docs/design/mockups/0.6.2-icons-locks).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.6.2-p18-shots */
const open = () => { document.getElementById('sdTab')?.click(); const d = document.querySelector('#statDrawer details.mini'); if (d) d.open = true; };
export default [
  { name: 'keys-lv4-1500', width: 1500, height: 1100, mode: 'advanced', save: { level: 4 }, act: open, shots: [{ sel: '#stackViz' }] },
  { name: 'keys-lv30-1500', width: 1500, height: 1100, mode: 'advanced', save: { level: 30 }, act: open, shots: [{ sel: '#stackViz' }] },
  { name: 'keys-lv30-390', height: 1100, mode: 'advanced', save: { level: 30 }, act: open, shots: [{ sel: '#stackViz' }] },
];
