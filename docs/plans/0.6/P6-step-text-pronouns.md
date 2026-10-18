# 0.6 P6: Story step texts that say "it" for the step title (#254 note 11)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md ("Data and source policy"), #254 note 11,
`data/packs/aion2/asmodian/story-quests.json` and `data/packs/aion2/checks.mjs` first.

## Problem

Each step text is Metabot's step title + " — " + Metabot's objective line, and the objective line can refer to the
title with a pronoun: Lv 3 "Search Munihelle Forest — investigate it with Maard" (owner: in game it reads "Investigate
Munihelle Forest with Maard"). A pronoun scan of the 431 step texts finds four: Search Munihelle Forest ("it"), Gather
supplies at Aldelle Village ("them"), Escape from the prison compound ("it"), Get the storage key ("it").

## Result

- The four objective lines name what the pronoun stands for, taken from the step's own title (no new fact); the
  Munihelle line uses the owner's in-game wording and cites the owner note (#254, 2026-10-17).
- A generator check fails when an objective line after " — " starts with or holds a bare pronoun (`it`, `them`,
  `there`) that refers back to the title, with an allow list for real uses.

## Appetite

S.

## No-gos

- No other wording change; no full objective audit (owner spot checks, ROADMAP 0.6 owner input); no id or key change.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] The four texts before / after (paste).
- [ ] The new check fails on the old text and passes on the new (paste both runs).
- [ ] Golden: only these step texts change in `nextup/` (paste the diff summary).
- [ ] `npm run gen` and `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/story-quests.json` (four `text` fields), `data/packs/aion2/checks.mjs`,
`tests/golden/snapshots/**` (re-recorded), `data/DATA_SOURCES.md`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (golden, #114 routing). Stall limit: 16 min (S).

After: nothing.

- [next] #? opus lanes:golden
