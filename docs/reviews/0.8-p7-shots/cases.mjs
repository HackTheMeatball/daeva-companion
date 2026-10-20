/* 0.8 P7 (#496): phone overlaps. The Undo toast no longer slides in over the tab bar (it only fades on a phone), and the
   level-up chip stays in the sticky level bar's row. phone-undo-toast shows the toast at rest above the tab bar (reduced
   motion, so before and after look alike). The phone-level-chip cases allow motion and shoot 250 ms after Level up at
   Lv 27 -> 28 (the chip is hidden under reduced motion); tests/a11y.js section 3b measures every frame.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p7-shots */
const toast = () => new Promise(res => { rewardToast('Lv 6: "Prepare to Escape" turned in', () => {}); setTimeout(res, 800); });
const levelUp = () => document.getElementById('lvlUpBig').click();
export default [
  { name: 'phone-undo-toast', width: 390, height: 844, mode: 'basic', save: { level: 5 }, act: toast },
  { name: 'phone-level-chip-390', width: 390, height: 844, mode: 'basic', save: { level: 27 }, motion: true, act: levelUp },
  { name: 'phone-level-chip-360', width: 360, height: 800, mode: 'basic', save: { level: 27 }, motion: true, act: levelUp },
];
