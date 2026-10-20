/* #498 (0.8 P9): the Key setup grid at 1500 px (the 320 px side panel): chip "Right click" and names such as Shadowstrike
   used to be wider than their column; a long skill name now wraps to two lines inside its cell. The long-name fixture
   renames the first filled cell in the page (same act for both builds).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p9-shots */
const save = { level: 45, open: {}, hideCards: false };
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  document.querySelectorAll('details').forEach(x => { x.open = true; });
  const n = document.querySelector('#stackViz > .sk:not(.empty) .nm'); if (n) n.textContent = 'Swift Fang Strike';
};
export default [
  { name: 'keys-1500-long-name', width: 1500, height: 1000, mode: 'advanced', save, act, shots: [{ sel: '#stackViz' }] },
];
