# Release 0.6.1 (patch)

Planned for the 0.6.1 patch (Release Planner, 2026-10-18; ROADMAP "0.6.1"). Read CLAUDE.md, docs/team/qa-release.md
("Changelog format"), docs/DEPLOY.md and ROADMAP "Versioning" and "Release gate" first. Runs alone, after every other
0.6.1 item has merged or been moved out, and only after Game Data Check answered `DATA OK 0.6.1`.

## Problem

0.6.1's fixes go live as they merge; the version, CHANGELOG section, tag and GitHub Release come last. Two leftovers
from the 0.6.0 release review (#331, comment 6249019598): the 0.6.0 "Saved progress" section leaves out the new optional
top-level `welcomed` field (`src/main.js:64`, `src/cards/welcome.js:20`), and `package.json`'s description still says
"Asmodian Assassin leveling guide".

## Result

- `package.json` / `package-lock.json` at 0.6.1 and a `## 0.6.1 — <date>` CHANGELOG section in the fixed order, written
  from the merged items (F1–F5, P13 and P15 if merged, Game Data Check fixes for #325 / #329).
- The 0.6.0 section's Saved progress names the `welcomed` field; the release job republishes those notes.
- `package.json` description names the Assassin and the Ranger (no other wording change).
- Saved progress: no reset expected; if a merged item broke saves, the section says "Saves reset in this version".

## Appetite

S.

## No-gos

- No code or data change; nothing not merged is listed.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `scripts/release-notes.mjs` passes on the new section (paste).
- [ ] Every 0.6.1 item issue is closed and named under the right heading, from
      `gh api "repos/HackTheMeatball/daeva-companion/issues?state=closed&per_page=100"` (no GraphQL; paste the list).
- [ ] The Saved progress sections (0.6.0 and 0.6.1) match the save code at the head (paste).
- [ ] `npm test` green.

## Files (owns)

`package.json`, `package-lock.json`, `CHANGELOG.md`.

## Lanes, model, order

Lanes: release, alone. Model: Sonnet. Stall limit: 44 min (S).

After: everything, and `DATA OK 0.6.1` (sent by the Release Planner to Build Pipeline).
