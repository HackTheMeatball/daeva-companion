# 0.6 P16: Cards appear as the game unlocks them (#254 note 1)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, the approved S1 mockup and the owner's
choice of hidden vs faded (`owner-ok-S1`), `src/core/cards.js` (registry), docs/design/0.4-engine-contract.md,
docs/research/2026-10-owner-unlocks.md and `unlocks.json` first.

## Problem

Skills, Daevanion, Stigmas and Dungeons & Strongholds show from Lv 1, before the game opens them; showing everything at
once overwhelms a new player. The owner wants them fed as they unlock (hidden, or faded with the unlock line; S1 asks
which).

## Result

- The card registry takes an optional `opensWith` per card (an unlock or gate record id); the AION 2 pack sets it from
  the owner-verified unlocks (Skills Lv 4, Daevanion after "Urgent Pursuit", Stigmas Lv 22, …).
- Before that, the card is hidden or faded with "Opens at …", as the owner chose in S1; Basic and Advanced alike.
- The engine stays game-neutral (term scan); the fake pack proves a card with `opensWith`.

## Appetite

M–L.

## No-gos

- No unlock fact that isn't in data with its source; no change to Next up order; no save key beyond what S1 approved;
  `dist-artifact` rules unchanged.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] At Lv 1, Lv 4, after "Urgent Pursuit" and at Lv 22, each card's state matches its unlock (test, paste).
- [ ] Conformance: the fake pack's gated card (paste); term scan green.
- [ ] Golden diffs only in the gated cards' presence (paste summary); `a11y` green (hidden cards out of the tab order).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/core/cards.js`, `src/main.js` (card mounting), `src/packs/aion2/cards/index.js`, `tests/fixtures/packs/fakegame/`,
`tests/conformance.mjs`, `tests/golden/snapshots/**`, `docs/reviews/0.6-p16-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: main.js, golden. Model: Opus (`src/core`, golden). Stall limit: 80 min (M–L). Commit and push after the registry
and after the pack wiring (scorecard K1).

After: S1, owner-ok-S1, P14 (golden).

- [next] #? opus lanes:main.js,golden
