/* 0.8 P11 (#500): the Sealed Dungeon and Stronghold map markers fill their Next up tile (was 70%), so the emblem shows
   at about 27-29 px like the story card's ready ring and nothing is clipped. Same save and card picker as 0.8-p10.
   Format: tests/support/shots.mjs.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p11-shots */
import { coreBundle } from '../../../tests/support/core-bundle.mjs';

const M = await coreBundle();
const save = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {}, welcomed: 1 };
const pick = re => new Function(`const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);`);
const cases = [];
for (const [k, re] of [['sealed', '/^Clear /'], ['stronghold', '/^Run /']])
  for (const [w, h] of [[1500, 900], [390, 844]])
    cases.push({ name: `${k}-${w}`, save, mode: 'advanced', width: w, height: h, act: pick(re), shots: [{ sel: '#nowStar .ns-card.first' }] });
export default cases;
