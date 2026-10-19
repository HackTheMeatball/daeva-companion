/* 0.6.2 P19: locked-card shells in Basic on desktop, with "N levels to go" (mockup
   docs/design/0.6.2-icons-locks-mockup.md §2, frames l1 / l2; owner-ok-0.6.2-icons-locks Q1, Q2). Lv 4 in Basic on desktop
   (l1: Skills open, Daevanion and Stigmas shells beside it, "18 levels to go"), Lv 21 in Basic on desktop (l2: "1 level to
   go"), Lv 4 in Advanced on desktop (the count line in Advanced too) and Lv 4 in Basic on a phone (no shells). Format:
   tests/support/shots.mjs. */
const lv4 = { level: 4, open: {}, hideCards: false, checks: {} };
const lv21 = { level: 21, quest: 'Cemetery Cleanup', open: {}, hideCards: false, checks: {} };
export default [
  { name: 'l1-lv4-basic-1500', mode: 'basic', width: 1500, height: 1000, save: lv4 },
  { name: 'l2-lv21-basic-1500', mode: 'basic', width: 1500, height: 1000, save: lv21 },
  { name: 'lv4-advanced-1500', mode: 'advanced', width: 1500, height: 1000, save: lv4 },
  { name: 'lv4-basic-390', mode: 'basic', save: lv4, height: 1400 },
];
