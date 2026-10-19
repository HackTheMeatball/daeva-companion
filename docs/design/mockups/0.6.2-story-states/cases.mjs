/* 0.6.2 mockup (Design Lead, #391 behind P13): the Next up story card's icon follows the quest's state, as in the game:
   active (objectives open), ready to turn in (every objective ticked but the Turn in step), done (the guide's story complete).
   Drawn on the real built page: act() swaps the card's icon tile and, for "ready", the count line. Nothing here is app code.
   Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-story-states --after-only
   MOCK_BEFORE=1 shoots today's page (📜) with the same saves, for the Scrapbook's before half.
   Icons are the owner's own crops (docs/research/owner-screens-2026-10-18/, plus the ready-to-turn-in crop here);
   they are not in the app and need his OK for the build (DECISIONS owner-ok-story-icon covers the active one only). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreBundle } from '../../../../tests/support/core-bundle.mjs';

const HERE = dirname(fileURLToPath(import.meta.url)), SCR = join(HERE, '../../../research/owner-screens-2026-10-18');
const uri = p => 'data:image/png;base64,' + readFileSync(p).toString('base64');
const ICO = { active: uri(join(SCR, 'story-quest-active.png')), ready: uri(join(HERE, 'story-quest-ready-to-turn-in.png')), done: uri(join(SCR, 'quest-complete-check.png')) };
const M = await coreBundle(), Q = 'Cemetery Cleanup', last = M.QUESTS[M.QUESTS.length - 1][1];
/* ready = every objective ticked but the last one, the quest's own "Turn in" step */
const steps = M.QUEST_STEPS[Q] || [], ready = steps.map((_, i) => i).filter(i => !/^Turn in/.test(steps[i]));
/* every milestone row up to the level ticked, so the story card is the first card */
const upTo = L => Object.fromEntries(M.GATES.filter(g => g.lv <= L).flatMap(g => g.items.filter(it => it.k)).map(it => [it.k, true]));
const saves = {
  active: { level: 20, quest: Q, checks: upTo(20), qsteps: { [Q]: [0, 1] } },
  ready: { level: 20, quest: Q, checks: upTo(20), qsteps: { [Q]: ready } },
  done: { level: 45, quest: last, storyEnd: last, checks: upTo(45) } };
const css = `#nowStar .ns-card.first .ns-num.sq { background: var(--panel-2); border-color: var(--line); padding: 0; }
#nowStar .ns-card .ns-num.sq img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }`;
/* act is serialized into the page, so it is built as a self-contained string. Both halves first bring the story card to
   the top of the stack (as if the milestone rows above it were done), so before and after show the same card. */
const lift = `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => /^Story:|story complete/i.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no story card'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);`;
const act = state => new Function(lift + (state ? `const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s);
  const n = document.querySelector('#nowStar .ns-card.first .ns-num');
  n.classList.add('sq'); n.innerHTML = '<img alt="" src="${ICO[state]}">';
  n.setAttribute('aria-hidden', 'false'); n.setAttribute('role', 'img'); n.setAttribute('aria-label', ${JSON.stringify({ active: 'Active quest', ready: 'Ready to turn in', done: 'Story complete' }[state])});
  ${state === 'ready' ? `const p = document.querySelector('#nowStar .ns-card.first .ns-mhead p'); const c = p && p.querySelector('.ns-objn');
  if (c) { c.nextSibling.textContent = c.nextSibling.textContent.replace(/^ objectives/, ''); c.replaceWith(Object.assign(document.createElement('b'), { className: 'ns-ready', textContent: 'Ready to turn in' })); }` : ''}` : ''));
const before = !!process.env.MOCK_BEFORE;
const cases = [];
for (const st of ['active', 'ready', 'done']) for (const [w, h] of [[390, 844], [1500, 900]])
  cases.push({ name: `s-${st}-${w}`, save: saves[st], mode: 'basic', width: w, height: h, act: act(before ? null : st), shots: [{ sel: '#nowStar .ns-card.first' }] });
export default cases;
