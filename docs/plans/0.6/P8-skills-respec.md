# 0.6 P8: Respec button on the Skills card (#254 note 8)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, `src/packs/aion2/cards/skills.js`,
`skills.html` and the Daevanion card's Respec (`src/packs/aion2/cards/daevanion.js:192`) first.

## Problem

The Daevanion card has a Respec button; the Skills card has none, so a player who resets skills in game must lower
every skill by hand.

## Result

A Respec button on the Skills card, same placement, label and confirmation pattern as the Daevanion card's: it sets
every tracked skill level back to its learned value and is undoable through the Undo card like other edits.

## Appetite

S.

## No-gos

- No game fact about respec cost or where the in-game button is (that is P15, owner input); no change to the
  Daevanion card; no save key change (existing skill keys only).

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Respec on a Lv 30 state sets every skill to its learned value; Undo restores it (test names, paste).
- [ ] The button matches the Daevanion card's (computed-style snapshot or class list, paste).
- [ ] `a11y` green (button name, focus); before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/packs/aion2/cards/skills.js`, `src/packs/aion2/cards/skills.html`, its stylesheet under `src/styles/packs/`,
`tests/regress.js` (or the card's test), `docs/reviews/0.6-p8-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Sonnet (small UI). Stall limit: 16 min (S).

After: nothing.

- [next] #? sonnet lanes:none
