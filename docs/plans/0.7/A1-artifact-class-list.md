# 0.7 A1: The claude.ai artifact carries a fixed class list, chosen at build time

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Read CLAUDE.md ("Keep both builds visually identical; dist-artifact must stay a single file"),
docs/ARCHITECTURE.md (build), `scripts/build.mjs` (`allClasses`, `siteClasses`), `scripts/generated-data.mjs`
(`splitClasses`) and ROADMAP 0.6 audit 2 first.

## Problem

The site loads only the current class's chunk (0.6 P2), but the artifact can't fetch, so `allClasses()` inlines every
playable class. With Assassin + Ranger it is at 971,146 / 1,030,000 B (94%, main `5f4755f`): adding the Gladiator (G1)
would fail the blocking budget.

## Result

- One list in the build (`ARTIFACT_CLASSES`, default: the classes the artifact carries today, Assassin and Ranger)
  decides which class chunks the artifact inlines; every other playable class is site-only.
- In the artifact, the class picker offers only the inlined classes; a save whose character uses a site-only class
  shows a one-line note ("This class is on daevacompanion.com") instead of breaking. Text from `data/`, not `main.js`.
- The artifact for today's classes is byte-for-byte what it is now, apart from the list code.

## Appetite

M.

## No-gos

- No budget change; no change to the site build; no save break; no new UI beyond the one note.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] A build test with a third playable class (the fake pack or the hidden Gladiator) shows it in the site chunks and
      not in `dist-artifact`; budgets green (paste).
- [ ] The artifact's picker lists only `ARTIFACT_CLASSES`; a save with a site-only class loads with the note (save
      suite, paste).
- [ ] Golden and `equiv` unchanged for every current state (paste); `npm test` green.
- [ ] docs/ARCHITECTURE.md §4 says how to add a class to the artifact (and that the budget decides).

## Files (owns)

`scripts/build.mjs`, `scripts/generated-data.mjs`, the artifact class-picker filter (`src/cards/characters.js` or
the pack's class list accessor), `tests/save.js`, a build test, docs/ARCHITECTURE.md §4.

## Lanes, model, order

Lanes: none. Model: Opus (build). Stall limit: 80 min (M).

After: none.
