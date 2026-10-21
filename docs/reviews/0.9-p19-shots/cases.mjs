/* 0.9 P19 (#641): catch-up for late starts, Skills. Design Lead's mock: docs/design/0.9-catchup/ (10-skills-*,
   10-nextup-a-*). A fresh Lv 39 Assassin on "An Ill Fate's Resolution" (the owner's test, 2026-10-20), at 1500 and 390 px,
   Basic and Advanced. Before: the Skills hero walks one level at a time ("Heart Gore 1 → 2"). After: the hero is Heart
   Gore's whole jump (1 → 10, one Mark spent for its lines and its specialty), Coming up lists the other jumps, and Next up
   leads with "Catch up: level Heart Gore 1 → 10". "mid" is after three taps; "lv45" a Lv 45 join holding 180 stones.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p19-shots */
const fresh = { level: 39, welcomed: 1, quest: "An Ill Fate's Resolution" };
const tap = n => new Function(`for (let i = 0; i < ${n}; i++) { const b = document.getElementById('spBuy'); if (b) b.click(); }`);
const cases = [];
for (const mode of ['advanced', 'basic']) for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { mode, width: w, height: h, save: fresh };
  cases.push({ name: `skills-${mode}-${w}`, ...a, shots: [{ sel: '#spCard' }] });
  cases.push({ name: `nextup-${mode}-${w}`, ...a, shots: [{ sel: '#nowStar .ns-card' }] });
}
cases.push({ name: 'skills-mid-advanced-390', mode: 'advanced', width: 390, height: 844, save: fresh, act: tap(3), shots: [{ sel: '#spCard' }] });
cases.push({ name: 'skills-lv45-advanced-1500', mode: 'advanced', width: 1500, height: 1000, save: { ...fresh, level: 45, stones: 180 }, shots: [{ sel: '#spCard' }] });
export default cases;
