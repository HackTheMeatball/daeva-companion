/* 0.7 P11 (#418): the Build drawer's Rotation and Key setup for the Ranger and the Gladiator from the game's default keys
   (owner screens); before, both showed stat priority only. The Assassin's drawer must look the same before and after
   (Lv 4, 10, 22, 45). Run: npm run build && node tests/support/shots.mjs docs/reviews/0.7-p11-shots */
const RANGER = { pack: 'aion2/asmodian/ranger', class: 'ranger' }, GLAD = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
const open = () => { document.getElementById('sdTab')?.click(); const d = document.querySelector('#statDrawer details.mini'); if (d) d.open = true; };
const at = level => ({ level, checks: {}, welcomed: 1 });
const drawer = (name, level, char) => ({ name, width: 1500, height: 1600, mode: 'advanced', save: at(level), ...(char ? { char } : {}), act: open, shots: [{ sel: '#sdPanel' }] });
export default [
  drawer('assassin-lv4-1500', 4), drawer('assassin-lv10-1500', 10), drawer('assassin-lv22-1500', 22), drawer('assassin-lv45-1500', 45),
  drawer('ranger-lv4-1500', 4, RANGER), drawer('ranger-lv12-1500', 12, RANGER), drawer('ranger-lv14-1500', 14, RANGER),
  drawer('gladiator-lv12-1500', 12, GLAD), drawer('gladiator-lv14-1500', 14, GLAD),
  /* a new screen: before, the Ranger's drawer had no Key setup */
  { name: 'ranger-lv14-390', afterOnly: true, height: 1400, mode: 'advanced', save: at(14), char: RANGER, act: open, shots: [{ sel: '#stackViz' }] },
];
