# 0.6 P12: Don't mention Kibelisk binds that happen at an objective (#254 note 6)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, #254 note 6 and the owner's answer on
it (keep R = 25 m), DECISIONS (Kibelisk binding, bind radius), `data/packs/aion2/asmodian/story-quests.json`,
`kibelisks.json`, `src/packs/aion2/travel.js` and `src/packs/aion2/nextup.js` first.

## Problem

"The Being Beneath the Lake" tells the player to bind with the Witch's Cabin Kibelisk (Metabot's step 1 text, line
689), but that bind happens on its own because the objective is within 25 m of it. 240 step texts also end in
"(Kibelisk: X)". Owner (2026-10-17 7:55 PM ET): don't mention a bind that happens at an objective within 25 m; keep the
"Bind X" rows for Kibelisks the route only passes (e.g. Safe Haven). The radius is settled at 25 m.

## Result

- Derived, not hand-edited: when a step's point (`steps[].at`) is within `rule:kibelisk-bind-radius` of the Kibelisk a
  step text names, the app drops that step's bind sentence or "(Kibelisk: X)" suffix from what it shows; a step whose
  only content is the bind (Witch's Cabin) is shown as done-on-arrival with the next step, not as its own row.
- The data keeps Metabot's text (source fidelity); the trimming is pack display code with a list printed by the
  generator (which steps, which Kibelisk, distance) for the owner.

## Appetite

M.

## No-gos

- No radius change; no change to P15's (0.5) "Bind X" rows for Kibelisks outside 25 m; no data text edits; no change
  to completion (the step is still ticked the same way).

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] The Witch's Cabin step no longer shows a bind instruction (golden diff, paste).
- [ ] Safe Haven's "Bind" row still shows (golden, paste).
- [ ] The generator's list: every trimmed step with its distance ≤ 25 m, none over (paste).
- [ ] Golden: only bind texts change (paste summary); `npm test` green; before / after shots and `scrapbook.json`.

## Files (owns)

`src/packs/aion2/travel.js`, `src/packs/aion2/nextup.js`, `src/packs/aion2/cards/nextup-kinds.js`,
`data/packs/aion2/checks.mjs` (the list), `tests/golden/snapshots/**`, `docs/reviews/0.6-p12-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (golden, ranking pack code). Stall limit: 80 min (M).

After: P6 (golden, one at a time).

- [next] #? opus lanes:golden
