# Release 0.7.0 (Two more classes and sync)

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Read CLAUDE.md, docs/team/qa-release.md ("Changelog format"), docs/DEPLOY.md and ROADMAP "Versioning" and "Release
gate" first. Runs alone, after every other 0.7 item has merged or been moved to the next patch, and only after Game Data
Check answered `DATA OK 0.7.0`.

## Problem

0.7's items go live as they merge; the version, CHANGELOG section, tag and GitHub Release come last.

## Result

`package.json` / `package-lock.json` at 0.7.0 (description names every playable class) and a `## 0.7.0 — <date>`
CHANGELOG section in the fixed order from the merged items. Saved progress: no reset expected (sync uses its own key);
if a merged item broke saves, the section says "Saves reset in this version".

## Appetite

S.

## No-gos

- No code or data change; nothing not merged is listed.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `scripts/release-notes.mjs` passes on the new section (paste).
- [ ] Every 0.7 item issue is closed and named, from `gh api "repos/HackTheMeatball/daeva-companion/issues?state=closed&per_page=100"` (paste).
- [ ] Saved progress matches the save code at the head (paste); `npm test` green.

## Files (owns)

`package.json`, `package-lock.json`, `CHANGELOG.md`.

## Lanes, model, order

Lanes: release, alone. Model: Sonnet. Stall limit: 44 min (S).

After: everything, and `DATA OK 0.7.0`.
