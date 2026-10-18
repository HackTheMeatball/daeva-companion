# 0.6 P11: Pop-out styled like the app inside its window (#254 note 4)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md and the pop-out code in
`src/cards/nextup.js` (Document Picture-in-Picture) first.

## Problem

The owner wants the Next up pop-out to look like the app, with rounded corners, not a square Windows frame. The
pop-out is a Document Picture-in-Picture window: Chrome draws its frame and title bar, so the page can't round the
window itself (inferred, not tested); it can only style what is inside.

## Result

- Inside the pop-out: the app's background, a rounded container with the card's radius and padding, no square white
  edge at any window size.
- The PR states plainly that the window frame is the browser's and can't be changed by the page, with the test that
  shows it (transparent document background tried; result pasted), so the owner knows what's left.

## Appetite

S.

## No-gos

- No change to what the pop-out shows; no other window type; the frame itself is moved out (ROADMAP 0.6 "Moved out").

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] The pop-out document's styles: background, radius and padding match the Next up card (computed-style check,
      paste).
- [ ] The frame test and its result are in the PR (paste).
- [ ] Before / after shots of the pop-out content and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/nextup.js` (pop-out area only), the Next up stylesheet's pop-out rules, `docs/reviews/0.6-p11-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Sonnet (styles). Stall limit: 16 min (S).

After: nothing. (P13 edits the icon area of the same file; it runs after this one.)

- [next] #? sonnet lanes:none
