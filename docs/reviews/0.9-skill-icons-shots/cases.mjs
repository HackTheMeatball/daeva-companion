/* Five skill icons from Metabot (standing icon OK; provenance in docs/ISSUES.md, 2026-10-21). Two of them show today: the
   Gladiator's Mocking Blade and the Ranger's Explosion Trap in the Build drawer's key grid at Lv 45; before: initials
   squares, after: their Metabot icons. The Assassin's three (Infiltrate, Shadow Fall, Whirlwind Slice) are named only as
   text in the game-default keys list, so they change nothing on screen yet.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-skill-icons-shots */
const CLASSES = {
  gladiator: { pack: 'aion2/asmodian/gladiator', class: 'gladiator' },
  ranger: { pack: 'aion2/asmodian/ranger', class: 'ranger' },
};
const open = () => { document.getElementById('sdTab')?.click(); const d = document.querySelector('#statDrawer details.mini'); if (d) d.open = true; };
const save = { level: 45, checks: {}, welcomed: 1 };
export default Object.entries(CLASSES).map(([cls, char]) =>
  ({ name: `${cls}-lv45-1500`, width: 1500, height: 1600, mode: 'advanced', save, char, act: open, shots: [{ sel: '#sdPanel' }] }));
