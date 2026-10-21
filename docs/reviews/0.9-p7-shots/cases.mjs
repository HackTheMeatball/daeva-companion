/* 0.9 P7 (#623, UX audit finding 2): the level slider moved from Lv 2 to Lv 39 with the story at Lv 2. After: Journey
   asks which story quest you are on, under the slider (the welcome card's select, pre-filled with the first story quest
   at Lv 39); before: nothing. (Next up's side of P7, no step that needs a locked card, is pinned by tests/e4test.js P7 and
   the golden snapshots.) The sticky Level up bar and the phone tab bar are hidden for the element shot, so they don't
   cover the card.
   Format: tests/support/shots.mjs. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p7-shots */
const save = { level: 2, quest: 'A Village in the Fog', welcomed: 1, checks: {} };
const slide = () => { const r = document.getElementById('lvlRange'); r.value = '39'; r.dispatchEvent(new Event('input', { bubbles: true }));
  const d = document.querySelector('section.card.where');
  for (const el of document.querySelectorAll('body *')) if (/^(fixed|sticky)$/.test(getComputedStyle(el).position) && !d.contains(el) && !el.contains(d)) el.style.visibility = 'hidden'; };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) cases.push({ name: `ask-${w}`, save, mode: 'advanced', width: w, height: h, act: slide, shots: [{ sel: 'section.card.where' }] });
export default cases;
