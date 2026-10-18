# 0.7 C1: Second 0.7 class data (Spiritmaster unless the owner names another), not offered yet

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Lane A. The class follows ROADMAP 0.7 owner input 1 (D8 rule; default Spiritmaster). Read CLAUDE.md, 0.6 P22
(docs/plans/0.6/P22-ranger-class-data.md, the model for this item), the class research file
(`docs/research/2026-10-spiritmaster-pack.md`, or the named class's) first.

## Problem

0.7 ships two classes; the second has no class pack.

## Result

`data/packs/aion2/classes/<class>/`: class record, skills by level, specializations, stigmas, Daevanion boards, from the
research files only, each field with its source page; `sources.json` updated; `npm run gen` green. Not in `classes` yet.

## Appetite

L.

## No-gos

- No fetching (bot builds have no web); nothing not in the research files; no UI change.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `gen` green with the new pack; record counts match the research CSVs (paste).
- [ ] Golden and `equiv` unchanged (paste); `npm test` green. No visible change.

## Files (owns)

`data/packs/aion2/classes/<class>/**` (new), `sources.json`, `data/DATA_SOURCES.md`.

## Lanes, model, order

Lanes: gen. Model: Opus. Stall limit: 120 min (L).

If the owner names another class, the Release Planner changes this token to that class's research file.

After: research-spiritmaster
