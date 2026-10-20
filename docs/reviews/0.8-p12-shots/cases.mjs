/* 0.8 P12 (#501): "Your class" on the welcome card's first step (design-v2 §3 option A, owner A 2026-10-19). A fresh
   browser in Basic at 390 px and 1500 px (compare docs/plans/0.8/inputs/design-v2/3-class-picker.png option A), at 360 px
   (4 × 2, Spiritmaster fits its badge), and at 390 px with the Templar picked (the highlight moves; no check mark).
   Before: the same fresh browser, the welcome without the picker. Format: tests/support/shots.mjs. */
const card = [{ sel: '#welcomeCard' }];
export default [
  { name: 'class-fresh-basic-390', height: 1100, shots: card },
  { name: 'class-fresh-basic-1500', width: 1500, height: 1000, shots: card },
  { name: 'class-fresh-basic-360', width: 360, height: 1100, shots: card },
  { name: 'class-templar-picked-basic-390', height: 1100, shots: card, act: () => document.querySelector('.welclass[data-class="templar"]')?.click() },
];
