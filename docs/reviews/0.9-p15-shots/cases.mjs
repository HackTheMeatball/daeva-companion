/* 0.9 P15: every choice point has a recommendation. The Ranger's Skills card at Lv 19 with Snipe at skill Lv 8: before,
   no specialty step (the build had no picks); after, Snipe's slot 1 pick. The Cleric's Skills card at Lv 45: Earth's
   Retribution and Judgment Thunder now have a labelled (disputed) slot 1 pick, and Divine Aura's slot 2 says
   "no guide pick" with its reason instead of "pick a specialty".
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p15-shots */
const ranger = { pack: 'aion2/asmodian/ranger', class: 'ranger' }, cleric = { pack: 'aion2/asmodian/cleric', class: 'cleric' };
const snipe8 = Object.fromEntries([2, 3, 4, 5, 6, 7, 8].map(L => [`sp:snipe:${L}`, true]));
export default [
  { name: 'ranger-lv19-specialty', width: 1500, height: 1600, mode: 'advanced', char: ranger, save: { level: 19, checks: snipe8, welcomed: 1 }, shots: [{ sel: '#spCard' }] },
  { name: 'cleric-lv45-skills', width: 1500, height: 1600, mode: 'advanced', char: cleric, save: { level: 45, checks: {}, welcomed: 1 }, shots: [{ sel: '#spCard' }] },
];
