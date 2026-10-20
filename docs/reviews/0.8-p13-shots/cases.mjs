/* 0.8 P13 (#502): a regional quest's state icon replaces its checkbox (teal star = to pick up, Metabot's quest_district
   marker = in progress, a green SVG check = turned in), one button says the next step (Pick up, Turn in, Undo), Next up
   rows get a map pin column and cut long names with "…", the Regional quests tile is the ❖ on the regional teal, and the
   extract tip shows the flask before "beaker icon". All three states are in each shot: Hugo Mercenaries turned in,
   Missing Mount in progress, the rest to pick up (the v4 boards' Lv 16 example). Format: tests/support/shots.mjs.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p13-shots */
const save = { level: 16, quest: 'Buried Atrocities', welcomed: 1, checks: { 'rq:2202010': true }, started: { 'rq:2202012': 1 } };
/* the Regional quests card first, so it shows its list */
const nu = () => { const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => /Regional quests/.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no Regional quests card'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc); };
/* the milestone that holds the quest in progress, open and in view */
const ms = () => { const li = document.querySelector('#gates li.qrow input[data-k="rq:2202012"]').closest('li'), d = li.closest('details'); d.hidden = false; d.open = true; li.closest('ul').scrollIntoView(); };
const tip = () => { document.querySelector('li .tip[data-tip="extract"]')?.click(); };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844], [360, 800]]) {
  cases.push({ name: `nextup-${w}`, save, mode: 'advanced', width: w, height: h, act: nu, shots: [{ sel: '#nowStar .ns-card.first' }] });
  cases.push({ name: `milestone-${w}`, save, mode: 'advanced', width: w, height: h, act: ms, shots: [{ sel: '#gates details:has(li.qrow.running) ul.items' }] });
}
for (const w of [1500, 390])
  cases.push({ name: `tip-extract-${w}`, width: w, height: 1400, mode: 'advanced', save: { checks: { 'g4:refund': true, 'g6:0': true }, level: 10, quest: 'Finding Nemon', open: { g10: true } }, act: tip, shots: [{ sel: 'li.tipbox' }] });
export default cases;
