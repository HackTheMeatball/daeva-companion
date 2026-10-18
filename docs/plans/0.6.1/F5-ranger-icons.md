# 0.6.1 F5: Ranger skill and stigma icons instead of letter placeholders (#333 note 4)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"; patches skip the planning pass). Read CLAUDE.md first. Source: Player Testing report #333. Standing OK (owner, 2026-10-14, CLAUDE.md): skill, stigma and item icons may be
added from approved sources (Metabot first) without asking, each recorded in docs/ISSUES.md.

## Problem

The Ranger's skills show letter placeholders ("S" for Snipe, "TS" for Tempest Shot) where the Assassin has real icons.

Bot builds have no web, so a cloud research session (`research-ranger-icons`, started 2026-10-18) fetches the files
and writes `docs/research/2026-10-ranger-icons.md` (each icon's page, file URL, date, and the missing ones). This item
wires them in.

## Result

Every Ranger skill and stigma icon that Metabot (or another approved source in docs/research/SOURCES.md) has is added the
way the Assassin's are (site files and `/_blob/` in the artifact), each with its source page, file URL and date in
docs/ISSUES.md. A skill with no approved icon keeps its placeholder and is listed in docs/ISSUES.md for the owner.

## Appetite

M.

## No-gos

- No icon without an approved source; no aion2.th.gl or Game8; fetching per CLAUDE.md (spot rate limits, our User-Agent).
- Page budgets stay blocking: if the icons don't fit `dist-artifact`'s budget, stop and report, don't raise it.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] docs/ISSUES.md lists each icon's source page, file URL and date, and each missing one (paste).
- [ ] The artifact build lists the new icons as `/_blob/` and stays one file; budgets green (paste).
- [ ] Golden Ranger skills / stigmas show icons (paste); before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

The Ranger pack's icon folder and its icon map, `docs/ISSUES.md`, `data/DATA_SOURCES.md` (if `gen` rewrites it),
`tests/golden/snapshots/**` (Ranger only), `docs/reviews/0.6.1-f5-shots/`.

## Lanes, model, order

Lanes: gen, golden. Model: Opus (golden snapshots are Opus-only, #114 routing). Stall limit: 80 min (M).

After: research-ranger-icons.
