# 0.6 P19: Level up on ticking a quest that gives a full level (#254 note 3)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). **Changes a CLAUDE.md rule: needs Isaac's typed OK
(`owner-ok-autolevel` in DECISIONS) before it is queued.** Read CLAUDE.md ("Manual progress is intended… Level changes
only via Level up / − / + / slider"), DECISIONS (A Village in the Fog: 100% EXP, owner screens 2026-10-15) and
`src/cards/journey.js` first.

## Problem

Early quests that give 100% EXP make the player tick the quest and then press Level up, though we know the quest gives
a level. The owner wants the tick to level up for at least the start of the game.

## Result

- A quest record may carry `levelsUp: true` only with a verified 100%-EXP source (today one quest: "A Village in the
  Fog", owner screens 2026-10-15). Ticking it raises the level by one if the level is still the quest's level; unticking
  or Undo lowers it back.
- CLAUDE.md's rule gains the exception in the owner's words, with the DECISIONS date.

## Appetite

S–M.

## No-gos

- No quest without a verified 100% EXP figure; no EXP model or partial-level math; no change to Level up / − / + /
  slider.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Tick at the quest's level → level + 1; tick at a higher level → no change; Undo → back (tests, paste).
- [ ] Every `levelsUp` record has its source (paste); golden `journey/` diff only for that tick (paste).
- [ ] CLAUDE.md line updated with the DECISIONS reference; before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`data/schema/` (quest schema field), `data/packs/aion2/asmodian/story-quests.json` (one field), `src/cards/journey.js`,
`src/core/state.js` (tick → level), `tests/golden/snapshots/**`, `CLAUDE.md` (the one rule line),
`docs/reviews/0.6-p19-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (`src/core`, golden, data/schema). Stall limit: 20 min (S–M).

After: owner-ok-autolevel, P18 (golden).

- [next] #? opus lanes:golden
