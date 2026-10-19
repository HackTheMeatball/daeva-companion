/* 0.6 P15: the tutorial-skill refund. Before: at Lv 4 Next up has no refund row and no Lv 4 milestone; after: the
   one-time "Refund the tutorial's Quick Slice point" row and the Lv 4 "Skills window" milestone card. Format:
   tests/support/shots.mjs. */
export default [
  { name: 'nextup-lv4-390', save: { level: 4, checks: {}, welcomed: 1 }, height: 900,
    shots: [{ sel: '#nowStar' }] },
  { name: 'nextup-lv4-1280', save: { level: 4, checks: {}, welcomed: 1 }, width: 1280, height: 900, mode: 'advanced',
    shots: [{ sel: '#nowStar' }] },
  { name: 'milestone-lv4-1280', save: { level: 4, checks: {}, welcomed: 1, open: { g4: true } }, width: 1280, height: 900,
    mode: 'advanced', afterOnly: true, shots: [{ sel: '#g4' }] },
];
