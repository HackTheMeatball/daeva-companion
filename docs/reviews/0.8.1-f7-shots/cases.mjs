/* 0.8.1 F7 (#604, owner note 7): Basic mode shows the Skills and Daevanion Respec buttons, in the same place as Advanced
   (before: Basic hid each card's whole footer, Respec with it). The rest of each footer (Sync levels, How points work,
   All nodes) stays hidden. Shots: both cards in Basic at 1500 and 390 px.
   Format: tests/support/shots.mjs. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8.1-f7-shots */
const save = { level: 16, quest: 'Buried Atrocities', welcomed: 1 };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  cases.push({ name: `skills-${w}`, save, mode: 'basic', width: w, height: h, shots: [{ sel: '#spCard' }] });
  cases.push({ name: `daevanion-${w}`, save, mode: 'basic', width: w, height: h, shots: [{ sel: '#dvBox' }] });
}
export default cases;
