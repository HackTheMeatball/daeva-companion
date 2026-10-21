/* 0.9 P15: every choice point has a recommendation. The Ranger's Skills card at Lv 19 with Snipe at skill Lv 8: before,
   no specialty step (the build had no picks); after, Snipe's slot 1 pick. The Cleric at 390 px, with the save set so the
   Skills card's hero is the slot in question: Earth's Retribution at skill Lv 8 (slot 1 now has a pick, tagged disputed),
   and every planned line bought with each slot 1 taken (28 Wisdom Stones cover the extra lines), so the hero is Divine Aura's slot 2, which now says "Pick your own · no guide pick"
   with its reason in the tag's tooltip instead of "pick a specialty".
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p15-shots */
const ranger = { pack: 'aion2/asmodian/ranger', class: 'ranger' }, cleric = { pack: 'aion2/asmodian/cleric', class: 'cleric' };
const lines = (keys, to) => Object.fromEntries(keys.flatMap(k => Array.from({ length: to - 1 }, (_, i) => [`sp:${k}:${i + 2}`, true])));
const snipe8 = lines(['snipe'], 8);
const CORE = ['earths-retribution', 'judgment-thunder', 'earths-grace', 'chain-of-torment', 'condemnation', 'divine-aura', 'healing-light', 'empyrean-lords-grace', 'light-of-regeneration'];
const ACTIVE = ['earths-retribution', 'judgment-thunder', 'chain-of-torment', 'condemnation', 'divine-aura', 'healing-light', 'light-of-regeneration'];
const core10 = { ...lines(CORE, 10), ...lines(['debilitating-mark', 'radiant-recovery'], 10),...Object.fromEntries(ACTIVE.map(k => [`sp:${k}:spec`, true])) };
export default [
  { name: 'ranger-lv19-specialty', width: 1500, height: 1600, mode: 'advanced', char: ranger, save: { level: 19, checks: snipe8, welcomed: 1 }, shots: [{ sel: '#spCard' }] },
  { name: 'cleric-lv45-disputed-pick', mode: 'advanced', char: cleric, save: { level: 45, checks: lines(['earths-retribution'], 8), welcomed: 1 }, shots: [{ sel: '#spCard' }] },
  { name: 'cleric-lv45-no-pick', mode: 'advanced', char: cleric, save: { level: 45, stones: 28, checks: core10, welcomed: 1 }, shots: [{ sel: '#spCard' }] },
];
