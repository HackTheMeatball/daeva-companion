/* 0.7 P12 (#422): the Route rules card leaves out a step until its level. The Spiritmaster's "Three skills only fire on a
   condition" step (Elemental Fusion is learned at Lv 14): gone at Lv 5 and 13, shown at Lv 14. The Build card of Route
   rules, Advanced on desktop. Format: tests/support/shots.mjs. */
const SPIRITMASTER = { pack: 'aion2/asmodian/spiritmaster', class: 'spiritmaster' };
const at = level => ({ name: `spiritmaster-l${level}-build-1100`, width: 1100, height: 1400, mode: 'advanced', save: { level, checks: {}, welcomed: 1 }, char: SPIRITMASTER,
  act: () => { document.getElementById('build').open = true; }, shots: [{ sel: '#build' }] });
export default [at(5), at(13), at(14)];
