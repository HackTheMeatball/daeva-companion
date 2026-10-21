/* 0.8.1 F4 (#594, RC play #586): the regional quest icon legend shows once per milestone card, under its first "Regional
   quests" heading (before: under every one). The shot is the first milestone card with more than one such heading, open;
   the sticky Level up bar and the phone tab bar are hidden for it, so they don't cover the headings in the element shot.
   And the page header follows the class picked on the welcome card at once (before: it stayed on the save's Assassin):
   a fresh browser, the Ranger picked, the top of the page.
   Format: tests/support/shots.mjs. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8.1-f4-shots */
const save = { level: 16, quest: 'Buried Atrocities', welcomed: 1 };
const ms = () => { const d = [...document.querySelectorAll('#gates details')].find(x => x.querySelectorAll('li.sub-h.rq').length > 1);
  if (!d) throw new Error('no milestone with two Regional quests headings'); d.hidden = false; d.open = true; d.id = 'shotMs';
  for (const el of document.querySelectorAll('body *')) if (/^(fixed|sticky)$/.test(getComputedStyle(el).position) && !d.contains(el)) el.style.visibility = 'hidden';
  d.querySelector('li.sub-h.rq').scrollIntoView(); };
const pickRanger = () => { const b = document.querySelector('.welclass[data-class="ranger"]:not(.welsoon)');
  if (!b) throw new Error('no playable Ranger on the welcome card'); b.click(); window.scrollTo(0, 0); };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  cases.push({ name: `legend-${w}`, save, mode: 'advanced', width: w, height: h, act: ms, shots: [{ sel: '#shotMs ul.items' }] });
  cases.push({ name: `header-${w}`, width: w, height: h, act: pickRanger });
}
export default cases;
