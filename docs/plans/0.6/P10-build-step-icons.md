# 0.6 P10: Skill icons in the Build drawer's play steps (#254 note 5)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md and `src/packs/aion2/cards/build.js`
(lines 38–55: the play steps and the "New: put X on …" note) first.

## Problem

The "Right click fires" chain already shows skill icons (initials where one is missing), but the play steps ("E
Illusive Clone + Swift Contract") and the "New: put X on …" note are names only, which confuses players new to MMOs.

## Result

Each skill named in a play step and in the "New: put X on …" note gets the same icon (or initials) the chain uses,
before the name, through the chain's existing renderer.

## Appetite

S.

## No-gos

- No new icons (missing ones stay initials and are listed); no new explanation text about auto-use (owner input 5);
  no change to the chain itself.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every skill name in the play steps at Lv 10, 22 and 45 has an icon or initials (test, paste).
- [ ] Screen readers read the name once (icon `alt=""` or `aria-hidden`; `a11y` green, paste).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/packs/aion2/cards/build.js`, `src/packs/aion2/cards/build.html`, its stylesheet, `docs/reviews/0.6-p10-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Sonnet (display only). Stall limit: 16 min (S).

After: nothing.

- [next] #? sonnet lanes:none
