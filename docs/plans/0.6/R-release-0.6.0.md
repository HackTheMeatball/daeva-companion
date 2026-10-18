# Release 0.6.0 (New players and the first new class)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6"). Read CLAUDE.md, docs/team/qa-release.md ("Changelog format"),
docs/DEPLOY.md and ROADMAP "Versioning" first. Runs alone, after every other 0.6 item has merged or been moved out in
ROADMAP.

## Problem

0.6's items go live as they merge; the version, CHANGELOG section, tag and GitHub Release come last.

## Result

`package.json` / `package-lock.json` at 0.6.0 and a `## 0.6.0 — <date>` CHANGELOG section in the fixed order, written
from the merged items: the Gladiator (if P5 merged), onboarding (welcome, mid-level join, cards on unlock, key hints,
terms), the #254 fixes, sync groundwork. Saved progress: no reset expected (0.6 adds fields inside `companion-save-v5`
only: tombstones, any S1-approved keys); if a merged item broke saves, the section says "Saves reset in this version".

## Appetite

S.

## No-gos

- No code or data change; nothing not merged is listed.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `scripts/release-notes.mjs` passes on the new section (paste).
- [ ] Every 0.6 item issue is closed and named under the right heading. Get the lists with
      `gh api "repos/HackTheMeatball/daeva-companion/issues?state=closed&per_page=100"` and
      `gh api "repos/HackTheMeatball/daeva-companion/pulls?state=closed&per_page=100"`; `gh issue list`, `gh pr list` and
      `gh pr view` are denied in bot runs (GraphQL; #114 "Spec commands") (paste the list with PR numbers).
- [ ] The Saved progress section matches the save code at the head (paste).
- [ ] `npm test` green.

## Files (owns)

`package.json`, `package-lock.json`, `CHANGELOG.md`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: release, alone. Model: Sonnet. Stall limit: 16 min (S).

After: everything.

- [next] #? sonnet lanes:release alone
