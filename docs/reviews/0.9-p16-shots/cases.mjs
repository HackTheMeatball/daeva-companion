/* 0.9 P16 (#637): board path costs for every class. A non-Assassin board (the Templar's) at 1500 and 390 px: the P21
   late starter's save (Lv 39, nothing bought), the Daevanion card with All nodes open. Before: the cost boxes are empty
   ("–", "?") for every Templar row. After: each box is pre-filled with the cost the board path gives in plan order and
   tagged "inferred" (computed from the node colours, not read in game); Guarding Seal 1 of 2 comes before Ironclad
   Defense 2 of 2 and Insulting Roar before Fury, each with its reason.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p16-shots */
const save = { level: 39, quest: 'Inevitable Encounter', checks: {} };
const openAll = () => { document.getElementById('dvAllBtn').click(); };
const cases = [];
for (const [w, h] of [[1500, 2200], [390, 3600]]) {
  cases.push({ name: `templar-${w}`, width: w, height: h, save, char: { pack: 'aion2/asmodian/templar', class: 'templar' }, act: openAll, shots: [
    { sel: '#dvBox', suffix: '-daevanion' }] });
}
export default cases;
