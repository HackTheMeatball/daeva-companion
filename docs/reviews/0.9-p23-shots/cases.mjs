/* 0.9 P23 (#645): the Sources card's link lists load when the card opens, and a plain sources page (sources.html) lists
   every source URL with no script. After: the card ends on a link to that page; open, it shows the same site rows as
   before (loaded then). The sources page is new (afterOnly). Fixed and sticky bars are hidden for the element shots, so
   they don't cover the card.
   Format: tests/support/shots.mjs. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p23-shots */
const save = { level: 27, quest: 'Preparations for Restoration', welcomed: 1, checks: {} };
/* (each act is sent to the page on its own, so the bar hiding is written into both) */
const closed = () => { const d = document.getElementById('srcCard'); d.open = false;
  for (const el of document.querySelectorAll('body *')) if (/^(fixed|sticky)$/.test(getComputedStyle(el).position) && !d.contains(el) && !el.contains(d)) el.style.visibility = 'hidden'; };
const open = async () => { const d = document.getElementById('srcCard'); d.open = true;
  for (const el of document.querySelectorAll('body *')) if (/^(fixed|sticky)$/.test(getComputedStyle(el).position) && !d.contains(el) && !el.contains(d)) el.style.visibility = 'hidden';
  for (let i = 0; i < 40 && !document.querySelector('#srcBody .srcg'); i++) await new Promise(r => setTimeout(r, 50)); };
const page = () => { location.href = 'sources.html'; };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) cases.push(
  { name: `card-closed-${w}`, save, width: w, height: h, act: closed, shots: [{ sel: '#srcCard' }] },
  { name: `card-open-${w}`, save, width: w, height: h, act: open, shots: [{ sel: '#srcCard' }] },
  { name: `sources-page-${w}`, save, width: w, height: h, act: page, afterOnly: true });
export default cases;
