/* 0.8 P8: the level step of a new character (welcomed 0). Before: the grey button reads "Skip: start at Lv 1" next to the
   green "Start at Lv 1"; after it reads "Skip, start at Lv 1". Phone and desktop. Format: tests/support/shots.mjs. */
export default [
  { name: 'new-character-level-step-390', save: { level: 1, checks: {}, welcomed: 0 }, height: 900,
    shots: [{ sel: '#welcomeCard' }] },
  { name: 'new-character-level-step-1280', save: { level: 1, checks: {}, welcomed: 0 }, width: 1280, height: 900,
    shots: [{ sel: '#welcomeCard' }] },
];
