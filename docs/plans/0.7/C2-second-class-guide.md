# 0.7 C2: Second 0.7 class guide, offered in the picker

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Lane A. Read CLAUDE.md, G1 and 0.6 P5 (the models), C1's class pack and its research file first.

## Problem

After C1 the second class has data but no advice, icons, golden states or picker entry.

## Result

As G1, for this class: `data/packs/aion2/asmodian/<class>/` guide pack with sourced or labelled claims; icons only if
research saved them; listed in `classes` (site); golden states at Lv 1, 10, 22, 30, 45; artifact unchanged (A1).

## Appetite

L.

## No-gos

As G1.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every guide claim has two sources or a label (paste).
- [ ] Golden: new states recorded, every other class identical (paste).
- [ ] The site picker offers every `classes` entry, the artifact's only `ARTIFACT_CLASSES` (paste).
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/<class>/**` (new), `src/packs/aion2/pack.js` (`classes`), `docs/ISSUES.md`,
`tests/golden/**` (new states), `tests/save.js`, `docs/reviews/0.7-c2-shots/`.

## Lanes, model, order

Lanes: gen, golden. Model: Opus. Stall limit: 120 min (L).

After: C1, A1, owner-ok-artifact-classes.
