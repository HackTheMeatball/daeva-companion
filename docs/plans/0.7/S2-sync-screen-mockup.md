# 0.7 S2: Sync screen mockup

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Read CLAUDE.md ("What the user wants"), docs/design/sync.md (§1 code, §2 one round, §6 S4 and S5, §8 client as
built), docs/design/0.6-onboarding-mockup.md (format) and ROADMAP "How an objective is worked" step 3 first.

## Problem

0.7 adds the sync UI (P6), a visible change with several states, and the owner reviews visible work as drawings first.

## Result

`docs/design/0.7-sync-mockup.md` plus mockups (desktop and phone): where sync lives (settings, not a new card unless the
drawing shows why), turning it on (code shown once, "I've saved it"), joining on a second device (paste code; the
`not-found` / `adopt` / `ask` answers), the status line (synced, offline, conflict, not synced yet), "Show sync code"
(if S5 says yes), "Delete cloud copy", and the artifact (no sync, S4). Each state names its text, from `data/`.

## Appetite

M (docs).

## No-gos

- No code; no new card style; minimal visual distraction; Basic mode shows only the status and the switch.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every client status in sync.md §8 has a drawn state (paste the list).
- [ ] Desktop and phone drawings for each state (paste file list).
- [ ] The doc ends with the owner question and the exact words to type (`owner-ok-0.7-S2`, Kaizen K12).

## Files (owns)

`docs/design/0.7-sync-mockup.md`, `docs/design/mockups/0.7-sync-*`.

## Lanes, model, order

Lanes: none. Model: Sonnet. Stall limit: 41 min (M docs).

After: none.
