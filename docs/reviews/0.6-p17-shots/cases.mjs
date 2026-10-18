/* 0.6 P17: the first-run welcome and joining above Lv 1 (mockup docs/design/0.6-onboarding-mockup.md §1.1, W1–W3,
   owner-ok-S1). A fresh browser on a phone (W1) and on desktop; the "I'm already Lv …" step at Lv 20 (W2); and the page
   right after joining at Lv 20 in Advanced (W3). Before: the same fresh browser (Lv 1, no welcome; the join step's
   buttons don't exist there, so the act does nothing). Format: tests/support/shots.mjs. */
const join20 = () => { document.getElementById('welJoin')?.click(); const r = document.getElementById('welLv'); if (r) { r.value = '20'; r.dispatchEvent(new Event('input', { bubbles: true })); } };
export default [
  { name: 'w1-fresh-basic-390', height: 1100 },
  { name: 'w1-fresh-1500', width: 1500, height: 1000 },
  { name: 'w2-join-lv20-basic-390', height: 1100, act: join20 },
  { name: 'w3-joined-lv20-advanced-390', height: 1400,
    act: () => { document.querySelector('.modeseg [data-mode="advanced"]').click(); document.getElementById('welJoin')?.click(); const r = document.getElementById('welLv');
      if (r) { r.value = '20'; r.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('welGo').click(); } } },
];
