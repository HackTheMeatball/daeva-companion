# 0.7 P2: Gladiator guide, offered in the picker

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Lane B. Read CLAUDE.md, 0.6 P5 (docs/plans/0.6/P5-ranger-guide.md, the model for this item), the Gladiator class
data (`data/packs/aion2/classes/gladiator/`, 0.6 P4, PR #300, hidden), docs/research/2026-10-gladiator-pack.md and
docs/research/2026-10-gladiator-guide.md first.

## Problem

The Gladiator's class data is on main but hidden: no build advice, no icons, no golden states, not in the picker.

## Result

- `data/packs/aion2/asmodian/gladiator/` guide pack (as the Ranger's): build steps, stigma picks and first nodes, each
  claim with two sources or labelled per `claims.json`.
- Skill and stigma icons only if the research session saved them; otherwise initials, listed in docs/ISSUES.md.
- The pack lists the Gladiator in `classes`; a new character can pick it on the site; golden gets Gladiator states at
  Lv 1, 10, 22, 30 and 45. The artifact leaves it out (P1's list).
- 0.6 P4's data is re-checked against the research files first; any field that changed is fixed with its source.

## Appetite

L.

## No-gos

- No advice without sources; editorial build pages are one source, never two; no fetching (bot builds have no web).
- No change to Assassin or Ranger output (golden identical); no save break; artifact unchanged.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every guide claim has two sources or a label (paste the generator's claims count).
- [ ] Golden: new Gladiator states recorded, every Assassin and Ranger state identical (paste).
- [ ] The site picker offers Assassin, Ranger, Gladiator; the artifact's offers Assassin, Ranger (paste).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/gladiator/**` (new), `data/packs/aion2/classes/gladiator/**` (fixes only),
`src/packs/aion2/pack.js` (`classes`), `docs/ISSUES.md`, `tests/golden/**` (new states), `tests/save.js`,
`docs/reviews/0.7-p2-shots/`.

## Lanes, model, order

Lanes: gen, golden. Model: Opus (golden, guide data). Stall limit: 120 min (L).

The owner gate: offering the Gladiator on the site only makes the two builds' pickers differ, which CLAUDE.md ("both
builds visually identical") leaves to the owner.

After: P1, research-gladiator-guide, owner-ok-artifact-classes

- [next] #345 opus lanes:gen,golden
