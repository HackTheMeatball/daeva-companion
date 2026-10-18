# 0.6 P14: "Press K to open Skills": key hints when a feature opens (#254 note 2)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, the approved S1 mockup
(`docs/design/0.6-onboarding-mockup.md`, `owner-ok-S1` in DECISIONS), docs/research/2026-10-owner-unlocks.md and
`data/packs/aion2/asmodian/unlocks.json` first.

## Problem

The guide says what to do but not how: a new player doesn't know Skills opens with K. The owner's unlock screens show
the default keys (Journal J, Stats P, Skills K, Daevanion U, Legion L, Shop H, …).

## Result

- Each unlock record gets an optional `hotkey` (the default key from the owner's screens, cited
  `owner:2026-10-14-unlocks-NN`); the schema allows it.
- Where the mockup puts it (the unlock's Next up row and the card the feature belongs to), a short "Press K to open
  Skills (default key)" line, Basic and Advanced as the mockup says.

## Appetite

M.

## No-gos

- Only keys on owner screens: no stigma, dungeon or stronghold key until the owner supplies it (owner input 3); no
  respec steps (P15); no key rebinding support.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every `hotkey` value matches a row of the owner-unlocks table with its screen number (paste the list).
- [ ] The hint shows at the unlock and on the card, per the mockup (golden diff, paste).
- [ ] `schema`, `gen` green; before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`data/schema/` (unlock schema), `data/packs/aion2/asmodian/unlocks.json`, `src/packs/aion2/cards/nextup-kinds.js`,
the Skills / Daevanion card templates (hint line only), `tests/golden/snapshots/**`, `data/DATA_SOURCES.md`,
`docs/reviews/0.6-p14-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (data/schema, golden). Stall limit: 80 min (M).

After: S1, owner-ok-S1, P13 (golden), P9 (Skills card files).

- [next] #? opus lanes:golden
