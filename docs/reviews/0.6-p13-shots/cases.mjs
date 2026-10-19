/* 0.6 P13: the Next up story card's icon. Before: the 📜 emoji on the red tile; after: the game's active story-quest icon
   (Metabot's copy) filling a dark tile. Format: tests/support/shots.mjs. */
export default [
  { name: 'story-card-390', save: { level: 1, checks: {}, welcomed: 1 }, height: 900,
    shots: [{ sel: '#nowStar' }] },
  { name: 'story-card-1280', save: { level: 1, checks: {}, welcomed: 1 }, width: 1280, height: 900, mode: 'advanced',
    shots: [{ sel: '#nowStar' }] },
  { name: 'story-quest-lv13-390', save: { level: 13, quest: 'Cemetery Cleanup', checks: {}, welcomed: 1 }, height: 900,
    shots: [{ sel: '#nowStar' }] },
];
