/* 0.6.2 P21 (#404): the game's map markers (docs/design/0.6.2-map-icons-mockup.md). The Sealed Dungeon and Stronghold
   Next up cards show their marker on the dark tile (before: ⛏ / 🏰 on red), the card's first "Kibelisk" its crest; the
   Dungeons card's two headings carry their marker and the region rows read "N [feather]". Format: tests/support/shots.mjs.
   The save is the mockup's (Lv 12, story at its Lv 12 quest). Both halves bring the shot card to the top of the stack and
   open its "i" note, so before and after show the same card. */
import { coreBundle } from '../../../tests/support/core-bundle.mjs';

const M = await coreBundle();
const save = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {}, welcomed: 1 };
const pick = re => new Function(`const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc); sc.classList.add('show-info');`);
const cases = [];
for (const [k, re] of [['sealed', '/^Clear /'], ['stronghold', '/^Run /']]) for (const [w, h] of [[390, 844], [1500, 900]])
  cases.push({ name: `${k}-card-${w}`, save, mode: 'advanced', width: w, height: h, act: pick(re), shots: [{ sel: '#nowStar .ns-card.first' }] });
for (const [w, h] of [[1500, 1400], [390, 844]])
  cases.push({ name: `dungeons-card-${w}`, save, mode: 'advanced', width: w, height: h, shots: [{ sel: '#areas' }] });
export default cases;
