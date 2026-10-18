/* 0.6.1 F5 (#338): Ranger skill and stigma icons instead of initials. A Ranger at Lv 30 in Advanced: the Skills and
   Stigmas cards, and the Build drawer (its skill and stigma names carry the same icons). Format: tests/support/shots.mjs. */
const RANGER = { pack: 'aion2/asmodian/ranger', class: 'ranger' };
const lv30 = { level: 30, checks: {}, welcomed: 1 };
export default [
  { name: 'ranger-lv30-skills-stigmas-1500', width: 1500, height: 1400, mode: 'advanced', save: lv30, char: RANGER,
    shots: [{ sel: '#spCard', suffix: '-skills' }, { sel: '#stCard', suffix: '-stigmas' }] },
  { name: 'ranger-build-drawer-1500', width: 1500, height: 1000, mode: 'advanced', save: lv30, char: RANGER,
    act: () => { document.getElementById('sdTab').click(); } },
];
