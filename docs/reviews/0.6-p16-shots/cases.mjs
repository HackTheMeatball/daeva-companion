/* 0.6 P16: cards open as the game unlocks them (mockup docs/design/0.6-onboarding-mockup.md §1.2, owner-ok-S1 Q1:
   faded in Advanced at desktop width, hidden in Basic and on phones). A fresh Lv 1 character on desktop in Advanced
   (DL2b: three faded shells) and in Basic (DL1a: hidden), on a phone in Basic (L1a), and Lv 4 in Advanced on desktop
   (Skills open, Daevanion and Stigmas still faded). Format: tests/support/shots.mjs. */
const lv1 = { level: 1, open: {}, hideCards: false, checks: {} };
const lv4 = { level: 4, open: {}, hideCards: false, checks: {} };
export default [
  { name: 'dl2-lv1-advanced-1500', mode: 'advanced', width: 1500, height: 1000, save: lv1 },
  { name: 'dl1-lv1-basic-1500', mode: 'basic', width: 1500, height: 1000, save: lv1 },
  { name: 'l1-lv1-basic-390', mode: 'basic', save: lv1, height: 1400 },
  { name: 'dk-lv4-advanced-1500', mode: 'advanced', width: 1500, height: 1000, save: lv4 },
];
