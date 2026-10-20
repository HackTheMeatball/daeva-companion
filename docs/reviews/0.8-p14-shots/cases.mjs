/* #503 (0.8 P14): the Assassin's Key setup. The grid's columns are now Q, E and T (the stack the macro on right click
   fires) under one line saying these are the guide's suggested keys, and a "Game default keys" list under the grid gives
   one key chip per line with the skills learned so far, then the (inferred) macro line. Shot: the Build drawer's Rotation part with Key setup open, at Lv 10 and Lv 30,
   1500 px and 390 px. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p14-shots */
const act = () => {
  const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click();
  document.querySelectorAll('#statDrawer details').forEach(x => { x.open = true; });
};
const shots = [{ sel: '#statDrawer .sd-rot' }];
export default [10, 30].flatMap(level => [1500, 390].map(width => ({
  /* tall viewports: the drawer scrolls, and an element shot is clipped to what its scroll box shows */
  name: `keys-lv${level}-${width}`, width, height: width === 1500 ? 2400 : 2600, mode: 'advanced',
  save: { level, open: {}, hideCards: false }, act, shots,
})));
