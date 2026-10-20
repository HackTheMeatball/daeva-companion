/* 0.8 P10 (#499): on a phone the featured Next up card's icon sits beside the title with Show in that row, and the detail
   lines (the "i" note: "+2 crystals … · ~5 min · … m away") run the full width under it. The 1500 px shots must not change.
   Same save and card picker as 0.6.2-p21. Format: tests/support/shots.mjs.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p10-shots */
import { coreBundle } from '../../../tests/support/core-bundle.mjs';

const M = await coreBundle();
const save = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {}, welcomed: 1 };
const pick = re => new Function(`const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc); sc.classList.add('show-info');`);
const cases = [];
for (const [k, re] of [['sealed', '/^Clear /'], ['stronghold', '/^Run /']]) {
  for (const [w, h, m] of [[360, 780, 'basic'], [360, 780, 'advanced'], [390, 844, 'basic'], [390, 844, 'advanced'], [1500, 900, 'advanced']])
    cases.push({ name: `${k}-${m}-${w}`, save, mode: m, width: w, height: h, act: pick(re), shots: [{ sel: '#nowStar .ns-card.first' }] });
}
export default cases;
