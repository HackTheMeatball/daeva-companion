# 0.6 P7: Character list sorted by name (#254 note 10)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, `src/cards/characters.js` and
`tests/save.js` first.

## Problem

The characters drop-down draws rows in save order (`src/cards/characters.js:30`); the owner wants them alphabetical by
name.

## Result

Rows sorted by name, case-insensitive (`localeCompare` with `sensitivity: 'base'`), ties by slot id so the order is
stable; unnamed characters after named ones. The save order is unchanged (display only).

## Appetite

S.

## No-gos

- No save change; no change to switching, rename or remove; no new UI.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] A test with names "bravo", "Alpha", "" and "alpha" shows Alpha / alpha (stable) / bravo / unnamed (paste).
- [ ] The stored `chars` order is byte-identical after opening the list (paste).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/characters.js`, `tests/save.js`, `docs/reviews/0.6-p7-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Sonnet (small UI fix). Stall limit: 16 min (S).

After: nothing.

- [next] #? sonnet lanes:none
