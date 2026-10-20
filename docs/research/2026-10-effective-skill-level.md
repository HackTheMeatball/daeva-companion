# Effective skill level in specialty recommendations (owner note 6, 2026-10-20)

Game Data Check, 2026-10-20. Owner's Lv 39 play-test: "we also need to make sure we're taking 'effective skill level'
into account when recommending specialties, it's possible we could recommend them earlier if nodes are unlocked on the
boards".

## What the app does today (checked in code and tests, not in a browser)

- **Opening a slot already uses effective level.** Effective level = highest bought line + the `adds` (default 1) of
  every owned board node on that skill (DATA-FORMAT-V2 §9, design 0.3 §9; `skillLvOf` in
  `src/packs/aion2/requirements.js`). `tests/core/specialty.test.mjs` ("bought lines + owned plan nodes") covers it. The
  data exists: skill nodes in `data/packs/aion2/classes/assassin/board-nodes.json` carry `skill` and `adds`.
- **Gap 1, where the row sits.** A slot 1 row's place in the milestone order is fixed at `learn + 18` character
  levels (`SP_STEPS` in `src/packs/aion2/data/build.js`), so it is listed where lines alone would open it. A slot that
  board nodes open earlier is open (tickable) but shown at the later milestone. That is the "recommend them earlier"
  the owner saw missing (inferred from the code; the next check confirms it).
- **Gap 2, which nodes count.** Only nodes the player ticks count. The guide's `boardPlan` lists only its target nodes.
  The skill nodes a path passes on the way (the owner's Zikel Defense Break 1/2 on the way to Quick Slice; Vaizel's
  extra Ambush and Exploit Weakness nodes, note 4) aren't plan rows, so the app never counts them, even though the
  game does once they're bought.

## Proposed check (before building)

In the built app, as a Lv 39 Assassin on a fresh save: tick Heart Gore's lines to 10, then tick the Nezekan, Zikel and
Vaizel Heart Gore plan nodes. Expected: Heart Gore's slot 2 (opens at effective 12) is offered in Next up and in the
Skills card as soon as the second node is ticked, not at the milestone its character level implies.

## For 0.8.1

1. Place a slot row by when it opens on effective level, given the plan's nodes in order (build). This is data the
   app already has.
2. Add the on-path skill nodes from the board-costs audit (`2026-10-assassin-board-costs.md`) to `boardPlan` as plan
   rows with `via`, so ticking a path counts every skill node it buys. This depends on notes 1–4.
