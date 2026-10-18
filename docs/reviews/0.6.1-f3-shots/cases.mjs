/* 0.6.1 F3: the level step of a new character (New character → Create character, which leaves welcomed 0). Before: the
   green and the grey button both read "Start at Lv 1"; after the grey one reads "Skip: start at Lv 1". Format:
   tests/support/shots.mjs. */
export default [
  { name: 'new-character-level-step-390', save: { level: 1, checks: {}, welcomed: 0 }, height: 900,
    shots: [{ sel: '#welcomeCard' }] },
];
