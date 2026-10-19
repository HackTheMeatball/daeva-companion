/* 0.8 data nits (Walter, 0.7.0 pre-release check): the Extraction tip's Enhance Stones example no longer names the
   Assassin's Training Dagger (the tip shows for every class), and its footnote now says only the auto-extract path comes
   from the Korean patch notes (the manual steps follow the owner's extraction screens).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-extract-tip-shots */
const story = { checks: { 'g4:refund': true, 'g6:0': true } };
const tip = () => { document.querySelector('li .tip[data-tip="extract"]')?.click(); };
export default [
  { name: 'tip-extract', width: 1400, height: 1400, mode: 'advanced', save: { ...story, level: 10, quest: 'Finding Nemon', open: { g10: true } }, act: tip, shots: [{ sel: 'li.tipbox' }] },
];
