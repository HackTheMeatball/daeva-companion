# 0.6.1 F1: Story card's objective counter doesn't move when an objective is ticked (#321 bug 1, #321 note 7)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"; patches skip the planning pass). Read CLAUDE.md first. Source: Player Testing reports #321 (bug 1, rough spot 7) and #333 (still live on 0.6.0).

## Problem

Start at Lv 1, tick "Remember Aldelle Village" in the Next up story card: the checkbox turns green but the header stays
"0/2 objectives" (desktop and phone, live 0.6.0 and main). Separately, the Journey card's "Ahead" list at Lv 1 is out of
order: Lv 2, Lv 3, then "Lv 2 🔓 Shop and Closet".

## Result

- The story card's `done/total objectives` (`src/cards/nextup.js:71`) updates on every tick and untick, on both builds.
- The Ahead list (`src/cards/ahead.js`) is sorted by level, ties in their current order.

## Appetite

S.

## No-gos

- No new text, no layout change, no change to which objectives exist.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] A test (core or golden) ticks one of two objectives and sees "1/2 objectives"; it fails on main before the fix (paste both).
- [ ] Golden Ahead at Lv 1 is in level order (paste the diff).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/nextup.js`, `src/core/nextup.js` (only if the count is computed there), `src/cards/ahead.js`,
`tests/golden/snapshots/**`, a test file for the counter, `docs/reviews/0.6.1-f1-shots/`.

## Lanes, model, order

Lanes: golden. Model: Sonnet. Stall limit: 44 min (S).

After: none.
