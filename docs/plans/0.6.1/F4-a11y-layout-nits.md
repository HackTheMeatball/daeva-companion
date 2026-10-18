# 0.6.1 F4: Headings, tap targets and the Daevanion board line (#321 notes 9 and 11)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"; patches skip the planning pass). Read CLAUDE.md first. Source: Player Testing report #321.

## Problem

- An empty `<h2>`, and the Skills, Daevanion and Stigmas H2s duplicated on desktop.
- Tap targets under 24 px: Basic / Advanced (20 px tall), objective checkboxes (12–13 px), the "N traces" buttons (13 px).
- Desktop at Lv 20: "Nezekan board · 0 of 10 acquired" runs into the right edge of the Daevanion card.

## Result

No empty or duplicated headings; those targets are at least 24×24 px (WCAG 2.2 target size, minimum) without changing the
cards' layout beyond the hit area; the board line wraps or truncates inside the card.

## Appetite

S–M.

## No-gos

- No visual redesign; keep both builds identical; no change to card order.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `a11y` gains checks for an empty heading, duplicate card headings and the 24 px minimum on those controls; each fails
      on main before the fix (paste).
- [ ] Golden Daevanion at Lv 20 desktop: the board line inside the card (paste).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

The card HTML files with the headings, `src/styles/app.css` and card stylesheets (hit areas, board line),
`src/packs/aion2/cards/daevanion.js` (board line only), `tests/a11y*`, `tests/golden/snapshots/**`,
`docs/reviews/0.6.1-f4-shots/`.

## Lanes, model, order

Lanes: a11y. Model: Sonnet. Stall limit: 20 min (S–M).

After: none. (Shares the a11y lane with F3, so kickoff runs them one after the other.)
