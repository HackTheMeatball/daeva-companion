/* 0.6.2 P20 (#391): the Next up story card's icon follows the quest's state (docs/design/0.6.2-story-states-mockup.md):
   active (objectives open), ready to turn in (every objective ticked but the Turn in step: the words replace the count),
   story complete (the journal check). Before: the active icon in every state. Format: tests/support/shots.mjs.
   The saves are the mockup's (docs/design/mockups/0.6.2-story-states/cases.mjs; active ticks one objective). Both halves first bring the story card
   to the top of the stack (as if the milestone rows above it were done), so before and after show the same card. */
import { coreBundle } from '../../../tests/support/core-bundle.mjs';

const M = await coreBundle(), Q = 'Cemetery Cleanup', last = M.QUESTS[M.QUESTS.length - 1][1];
const steps = M.QUEST_STEPS[Q] || [], ready = steps.map((_, i) => i).filter(i => !/^Turn in/.test(steps[i]));
const upTo = L => Object.fromEntries(M.GATES.filter(g => g.lv <= L).flatMap(g => g.items.filter(it => it.k)).map(it => [it.k, true]));
const saves = {
  /* mid-quest: every step but the turn-in and the last objective before it */
  active: { level: 20, quest: Q, checks: upTo(20), qsteps: { [Q]: ready.slice(0, -1) }, welcomed: 1 },
  ready: { level: 20, quest: Q, checks: upTo(20), qsteps: { [Q]: ready }, welcomed: 1 },
  done: { level: 45, quest: last, storyEnd: last, checks: upTo(45), welcomed: 1 } };
const act = new Function(`const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => /^Story:|story complete/i.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no story card'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);`);
const cases = [];
for (const st of ['active', 'ready', 'done']) for (const [w, h] of [[390, 844], [1500, 900]])
  cases.push({ name: `story-${st}-${w}`, save: saves[st], mode: 'basic', width: w, height: h, act, shots: [{ sel: '#nowStar .ns-card.first' }] });
export default cases;
