# 0.6 P9: Green (+x) on skill levels raised by Daevanion nodes (#254 note 9)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, `src/packs/aion2/cards/skills.html:16`
(the "type the level without the green bonus" text), the board-node records with `skill` + `adds`
(`data/packs/aion2/classes/assassin/board-nodes.json`) and the effective-skill-level code from 0.3 E7 first.

## Problem

In game a Daevanion skill node adds levels to a skill, shown in green. The Skills card asks the player to type the
level without that bonus and never shows it, so the card and the game look different.

## Result

Next to each skill level, a green "(+x)" when ticked Daevanion nodes add x levels to that skill (sum of `adds` over
ticked nodes whose `skill` is that skill); nothing when x = 0. The input stays the base level.

## Appetite

M.

## No-gos

- No new game data: if a skill node lacks `skill` / `adds`, the PR lists it and shows nothing for it.
- No change to what the player types, to Next up or to costs.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Core or pack cases: no nodes → no bonus; two nodes on one skill → their sum; unticking removes it (paste).
- [ ] Every skill node in the Assassin data has `skill` and `adds`, or is listed (paste the count).
- [ ] Contrast of the green on both themes passes `a11y` (paste); before / after shots and `scrapbook.json`.
- [ ] `npm test` green.

## Files (owns)

`src/packs/aion2/cards/skills.js`, `skills.html`, its stylesheet, `src/packs/aion2/` helper for node bonuses,
`tests/core/` case file, `docs/reviews/0.6-p9-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Opus (reads board data through pack code; routing "src/core" if the effective level moves). Stall
limit: 80 min (M).

After: P8 (same card files).

- [next] #? opus lanes:none
