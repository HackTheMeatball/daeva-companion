/* 0.8.1 F5 (#595): the Gladiator's and the Ranger's Build drawer (Rotation and Key setup) at Lv 45, desktop and phone;
   before: Aerial Snare, Sword Aura Rampage, Ankle Slice, Arrow Scattershot and Suppressing Arrow as initials squares,
   after: their Metabot icons. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8.1-f5-shots */
const CLASSES = {
  gladiator: { pack: 'aion2/asmodian/gladiator', class: 'gladiator' },
  ranger: { pack: 'aion2/asmodian/ranger', class: 'ranger' },
};
const open = () => { document.getElementById('sdTab')?.click(); const d = document.querySelector('#statDrawer details.mini'); if (d) d.open = true; };
const save = { level: 45, checks: {}, welcomed: 1 };
export default Object.entries(CLASSES).flatMap(([cls, char]) => [
  { name: `${cls}-lv45-1500`, width: 1500, height: 1600, mode: 'advanced', save, char, act: open, shots: [{ sel: '#sdPanel' }] },
  { name: `${cls}-lv45-390`, width: 390, height: 1400, mode: 'advanced', save, char, act: open, shots: [{ sel: '#stackViz' }] },
]);
