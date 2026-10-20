/* 0.8 P7 (#496): phone overlaps. The Undo toast no longer slides in over the tab bar (it only fades on a phone), and the
   level-up chip stays in the sticky level bar's row. The shots run with reduced motion, so the chip (hidden then) and the
   slide-in are measured by tests/a11y.js section 3b instead; this shows the toast at rest above the tab bar.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p7-shots */
const toast = () => new Promise(res => { rewardToast('Lv 6: "Prepare to Escape" turned in', () => {}); setTimeout(res, 800); });
export default [
  { name: 'phone-undo-toast', width: 390, height: 844, mode: 'basic', save: { level: 5 }, act: toast },
];
