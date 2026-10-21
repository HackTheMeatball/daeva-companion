/* #639 (0.9 P17): the Assassin's E stigma stack. E now fires Illusive Clone, Swift Contract, Savage Fang, then Triniel's
   Dagger (was Triniel's Dagger before Savage Fang); the buff step says when to use the buffs and carries "check in game",
   as does the key grid's heading line. Shot: the Build drawer's Rotation part with Key setup open at Lv 40 (all four
   stigma slots open), 1500 px and 390 px. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p17-shots */
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  document.querySelectorAll('#statDrawer details').forEach(x => { x.open = true; });
};
const shots = [{ sel: '#statDrawer .sd-rot' }];
export default [1500, 390].map(width => ({
  /* tall viewports: the drawer scrolls, and an element shot is clipped to what its scroll box shows */
  name: `e-stack-lv40-${width}`, width, height: width === 1500 ? 2400 : 2600, mode: 'advanced',
  save: { level: 40, open: {}, hideCards: false }, act, shots,
}));
