/* 0.8 P1: Gladiator and Spiritmaster skill and stigma icons. Each class in Advanced at Lv 1, 30 and 45 on desktop and
   phone (before: letter squares; after: the Metabot icons). Format: tests/support/shots.mjs. */
const CLASSES = {
  gladiator: { pack: 'aion2/asmodian/gladiator', class: 'gladiator' },
  spiritmaster: { pack: 'aion2/asmodian/spiritmaster', class: 'spiritmaster' },
};
const at = level => ({ level, checks: {}, welcomed: 1 });
export default Object.entries(CLASSES).flatMap(([cls, char]) => [1, 30, 45].flatMap(lv => [
  { name: `${cls}-lv${lv}-advanced-1500`, width: 1500, height: 1400, mode: 'advanced', save: at(lv), char },
  { name: `${cls}-lv${lv}-advanced-390`, width: 390, height: 1600, mode: 'advanced', save: at(lv), char },
]));
