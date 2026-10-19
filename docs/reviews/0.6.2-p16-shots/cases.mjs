/* 0.6.2 P16 (#398): Next up drops "Save your Enhance Stones" (Lv 9), "Claim Daeva Pass free-track rewards" and
   "Use your Wisdom Stones" (Lv 10); the save-stones advice moves into the Extraction tip, whose steps follow the owner's
   extraction screens. States are a story-only play like the owner's (no regional quest or Sealed Dungeon ticked).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.6.2-p16-shots */
const story = { checks: { 'g4:refund': true, 'g6:0': true } };
const tip = () => { document.querySelector('li .tip[data-tip="extract"]')?.click(); };
export default [
  { name: 'milestone-lv9', width: 1400, height: 1300, mode: 'advanced', save: { ...story, level: 9, quest: 'The Longest Night', open: { g9: true } }, shots: [{ sel: '#gates details.step', text: 'Enhancement unlocks' }] },
  { name: 'milestone-lv10', width: 1400, height: 1300, mode: 'advanced', save: { ...story, level: 10, quest: 'Finding Nemon', open: { g10: true } }, shots: [{ sel: '#gates details.step', text: 'Altgard opens' }] },
  { name: 'tip-extract', width: 1400, height: 1400, mode: 'advanced', save: { ...story, level: 10, quest: 'Finding Nemon', open: { g10: true } }, act: tip, shots: [{ sel: 'li.tipbox' }] },
];
