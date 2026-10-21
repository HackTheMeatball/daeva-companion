/* 0.9 P1 (#620): the build's own labels on the page. A value the data marks inferred shows "inferred", a disputed or
   owner-check one "check in game", a verified one nothing; single-source skill rows keep "single source". One view (no
   Basic / Advanced since 0.9 P21), at 1500 and 390 px: the P21 late starter's save (Lv 39, nothing ticked or bought),
   so the Daevanion card (opens after Urgent Pursuit) and the Stigmas card (Lv 22) are open.
   Assassin: the build is inferred, so its Skills rows, Daevanion plan rows, Stigmas heading and the Next up cards carry
   "inferred". Gladiator: its disputed skill order rows read "check in game" (before: "single source"). Templar: the
   default keys are inferred, so the "Game default keys" heading carries the tag.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p1-shots */
const save = { level: 39, quest: 'Inevitable Encounter', checks: {} };
/* the Build drawer open on its "Key setup" fold, where the default keys sit */
const openKeys = () => { document.getElementById('sdTab').click(); document.getElementById('stackViz').closest('details').open = true; };
const cases = [];
for (const [w, h] of [[1500, 1700], [390, 2600]]) {
  cases.push({ name: `assassin-${w}`, width: w, height: h, save, shots: [
    { sel: '.card:has(#spSoon)', suffix: '-skills' }, { sel: '#dvBox', suffix: '-daevanion' },
    { sel: '#stCard', suffix: '-stigmas' }, { sel: '#nowStar', suffix: '-nextup' }] });
  cases.push({ name: `gladiator-${w}`, width: w, height: h, save, char: { pack: 'aion2/asmodian/gladiator', class: 'gladiator' }, shots: [
    { sel: '.card:has(#spSoon)', suffix: '-skills' }] });
  cases.push({ name: `templar-${w}`, width: w, height: h, save, char: { pack: 'aion2/asmodian/templar', class: 'templar' }, act: openKeys, shots: [
    { sel: 'details.mini:has(#stackViz)', suffix: '-keys' }] });
}
export default cases;
