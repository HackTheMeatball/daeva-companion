# 0.6 S1: Lane A mockup: first run, cards that open as they unlock, key hints, terms

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, docs/team/design.md,
docs/design/phone-layout.md, docs/design/0.5-nextup-mockup.md (the format to copy),
docs/research/2026-10-owner-unlocks.md and #254 notes 1, 2 and the lane A row of ROADMAP 0.6 first.

## Problem

Lane A changes what a new player sees first, and none of it is drawn: a first-run welcome, joining at a level above 1,
cards that appear (or fade) only when the game unlocks them (#254 note 1: the owner hasn't chosen hidden vs faded),
"press K to open Skills" hints (#254 note 2) and short explanations of the guide's terms. Builds P14, P16, P17 and P18
need an approved drawing first.

## Result

`docs/design/0.6-onboarding-mockup.md` plus SVG or HTML mockups under `docs/design/mockups/0.6-onboarding*`, at
390 px and desktop, in both Basic and Advanced:

- the first-run welcome and the "I'm already Lv N" path (what is ticked, what is asked);
- a locked card in **both** variants side by side (hidden until it opens; faded with the unlock line on top), with a
  recommendation (faded on desktop is the recommendation to test: it previews what's coming without its content);
- a key hint on a Next up row and on the card it opens, using only keys already on owner screens (K, U, J, P);
- one term explanation (how it opens, where it sits, its length cap);
- numbered owner questions, each with a recommendation the owner can answer "yes" to.

## Appetite

M (docs).

## No-gos

- No code, data or style change; no new game art; no key the owner's screens don't show (the stigma key and the respec
  steps are owner input, ROADMAP 0.6 owner input 3).
- Reuses the existing card patterns (CLAUDE.md "What the user wants"); no new card type.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Both locked-card variants drawn at 390 px and desktop, Basic and Advanced (list the files).
- [ ] Every key shown in the mockup is in `docs/research/2026-10-owner-unlocks.md` (paste the key list with rows).
- [ ] Welcome and mid-level join drawn, with what the save gets in each case (keys inside `companion-save-v5`, no new
      key version).
- [ ] An owner-question list with a recommendation on every line.
- [ ] Only files under `docs/design/` changed.

## Files (owns)

`docs/design/0.6-onboarding-mockup.md`, `docs/design/mockups/0.6-onboarding*`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Sonnet (docs; 0.5's S1 and S2 were Sonnet and merged first time). Stall limit: 41 min (M docs).

After: nothing.

- [next] #? sonnet lanes:none
