/* 0.8.1 F4 (#594, RC play #586): the regional quest icon legend shows once per milestone card, under its first "Regional
   quests" heading (before: under every one). The shot is the first milestone card with more than one such heading, open.
   Format: tests/support/shots.mjs. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8.1-f4-shots */
const save = { level: 16, quest: 'Buried Atrocities', welcomed: 1 };
const ms = () => { const d = [...document.querySelectorAll('#gates details')].find(x => x.querySelectorAll('li.sub-h.rq').length > 1);
  if (!d) throw new Error('no milestone with two Regional quests headings'); d.hidden = false; d.open = true; d.id = 'shotMs'; d.querySelector('li.sub-h.rq').scrollIntoView(); };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]])
  cases.push({ name: `legend-${w}`, save, mode: 'advanced', width: w, height: h, act: ms, shots: [{ sel: '#shotMs ul.items' }] });
export default cases;
