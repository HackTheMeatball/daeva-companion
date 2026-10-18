/* 0.6.1 F2 (#335): at 390x844 the Undo toast sits above the tab bar, and the Build sheet stops at the tab bar so it stays tappable
   (format: tests/support/shots.mjs). */
const save = { level: 20, open: {}, hideCards: false, checks: {} };
const toast = () => { window.rewardToast ? window.rewardToast('Turned in', () => {}) : 0; };
export default [
  { name: 'toast', save, width: 390, height: 844, act: toast, shots: [{}] },
  { name: 'build-sheet', save, width: 390, height: 844, act: () => { document.getElementById('tabBuild').click(); }, shots: [{}] },
];
