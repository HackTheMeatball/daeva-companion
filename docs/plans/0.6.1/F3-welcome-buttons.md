# 0.6.1 F3: New character level step shows two "Start at Lv 1" buttons (#333 note 1)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"; patches skip the planning pass). Read CLAUDE.md first. Source: Player Testing report #333 (new in 0.6.0).

## Problem

After New character → Create character, "Your level" shows a green "Start at Lv 1" (uses the slider and quest) and a grey
"Start at Lv 1" (`src/cards/welcome.js:64` relabels Back for new characters; skips to Lv 1). A player can't tell them
apart, and they behave differently.

## Result

The two buttons never carry the same label. The grey one for a new character reads "Skip: start at Lv 1" (or is hidden
if the green one already covers Lv 1 with the slider at 1; the builder picks, says which, and keeps one way to start at
Lv 1 with no quest picked).

## Appetite

S.

## No-gos

- No change to the first-visit welcome, no new step, no change to what either action saves.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] A test opens the new-character level step and finds no two buttons with the same text (paste).
- [ ] Both paths still save what they saved before (paste the save diff check).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/welcome.js`, `src/cards/welcome.html`, its test, `docs/reviews/0.6.1-f3-shots/`.

## Lanes, model, order

Lanes: a11y. Model: Sonnet. Stall limit: 16 min (S).

After: none.
