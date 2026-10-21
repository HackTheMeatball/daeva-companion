# FLOW-10: Minor release

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Ship a minor (0.X.0) once its data and a play of the release candidate pass on the same build, then confirm the live site shows it.

## Trigger

The last item of the minor merges. Walter is release manager from `RC READY` until the live site shows the version.

## Owner

**Walter** (accountable for this flow end to end; each step names who does it).

## Inputs

- The minor's merged items
- CHANGELOG format ([docs/team/qa-release.md](../team/qa-release.md), "Changelog format")
- [docs/DEPLOY.md](../DEPLOY.md) "Releases"

## Steps

1. **Walter**: Writes the release's CHANGELOG section into the release issue (PLN-18).
2. **Walter**: Sends Gretchen `PRE-RELEASE CHECK <version>` and Jesse `RC READY <minor> <sha>`; the merge freeze starts (DEC-20261020-release-manager-and-freeze).
3. **Gus**: Enforces the freeze: only the PRs it allows merge until the tag.
4. **Gretchen**: Checks the CHANGELOG text against the build and ISSUES.md and answers `DATA OK` or `DATA HOLD` (PLN-18).
5. **Jesse**: Plays main built locally at that sha and answers `RC PLAY DONE <minor>` with an issue link ([FLOW-20](FLOW-20-player-testing.md)).
6. **Walter**: Posts `GO <version>` only when DATA OK and RC PLAY DONE name the same build (KZ-11), and asks for Isaac's weekly usage % (PLN-24).
7. **Gus**: Starts the release item on GO alone (PIP-08): version bump and CHANGELOG in one commit (PLN-19).
8. **CI**: Deploys, runs the smoke check, then tags and publishes the GitHub Release.
9. **Walter**: Confirms the live site serves the new version, then sends `RELEASE SHIPPED`, and sends Gale `REPORT READY <version>`.
10. **Jesse**: Plays the live site and sends `PLAY DONE` ([FLOW-20](FLOW-20-player-testing.md)), which leads into the kaizen review ([FLOW-17](FLOW-17-kaizen-review.md), COM-15).

## Gates

- `DATA OK` and `RC PLAY DONE` on one build, then `GO` (KZ-11, PLN-17).
- Smoke check green before the tag (DEPLOY.md).
- Isaac's standing ship OK covers the release once GO is in (COM-03).

## Records

- The release issue (CHANGELOG text)
- CHANGELOG.md and the GitHub Release
- Planner log #232 row with the usage %
- Player findings issue
- Tracker release card and versions row (Huell, TRK-06)

## Failure and escalation

- `DATA HOLD` or a blocker in RC PLAY DONE: the fix merges, the candidate restarts at the new head.
- A check unanswered 60 min: Mike flags it (HC-08).
- Smoke fails: no tag; check the deploy and re-run (DEPLOY.md). Rollback: revert on main.

## Rules it runs on

- [PLN-17](../../ROADMAP.md): release gate
- [PLN-18](../../ROADMAP.md): CHANGELOG checked
- [KZ-11](../../ROADMAP.md): one GO
- [DEC-20261020-k19-release-go](../DECISIONS.md): GO decision
- [DEC-20261020-release-manager-and-freeze](../DECISIONS.md): release manager and freeze
- [PIP-08](../team/gus.md): releases run alone
- [PLN-19](../../CLAUDE.md): bump and CHANGELOG in one commit
- [PLN-24](../../ROADMAP.md): usage %
- [COM-03](../DECISIONS.md): standing ship OK
- [COM-15](../../ROADMAP.md): order after a minor ships
- [PLN-21](../team/jesse.md): plays
- [HC-08](../../ROADMAP.md): 60 min flags
- [TRK-06](../team/huell.md): versions row
- [REPO-04](../../CLAUDE.md): saves reset notes

## Open questions for the owner of this flow

- Staging before 1.0 (DEC-20261020-staging-before-1-0) will change the deploy step to a promotion from a preview site; this SOP describes today's direct deploy.

## Last confirmed by owner

2026-10-21, by Walter.
