# 0.6.1 F2: Phone: the Undo toast and the Build sheet cover the tab bar (#321 bugs 2–3, #333 note 6)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"; patches skip the planning pass). Read CLAUDE.md first. Source: Player Testing reports #321 and #333 (still live on 0.6.0).

## Problem

At 390×844: (a) after "Turned in" the Undo toast (y 789–839) sits on the bottom tab bar (793–844) over the Gear tab, and
it stays up through five Level ups and opening Build, covering the stat priority text; (b) with the Build sheet open,
tapping Route lands on `#sdPanel`, so the tab bar looks tappable but does nothing until ×.

## Result

- On phone the toast sits above the tab bar (no overlap at 390×844) and closes after its timeout or on the next action,
  as on desktop.
- The tab bar stays tappable with the Build sheet open; tapping a tab closes the sheet and goes there.
- Desktop unchanged.

## Appetite

S–M.

## No-gos

- No new toast design, no new controls; Undo keeps working for its full window.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] A Playwright check at 390×844: toast and tab bar bounding boxes don't overlap (paste).
- [ ] A Playwright check: with Build open, elementFromPoint at the Route tab is the tab, and a tap goes to Route (paste).
- [ ] The toast is gone after its timeout; Undo still works inside it (paste).
- [ ] `a11y` green; before / after shots (phone) and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/main.js` (toast and sheet only), `src/styles/app.css` (toast, sheet, tab bar), a phone test under `tests/`,
`docs/reviews/0.6.1-f2-shots/`.

## Lanes, model, order

Lanes: main.js. Model: Sonnet. Stall limit: 20 min (S–M).

After: none.
