# FLOW-11: Patch release

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Ship a 0.X.Y patch: the minor release flow without the planning pass, the kaizen review, the RC play or the freeze.

## Trigger

Every item of the patch has merged. Walter is release manager from `PRE-RELEASE CHECK`.

## Owner

**Walter** (accountable for this flow end to end; each step names who does it).

## Inputs

- The patch section in ROADMAP.md
- As [FLOW-10](FLOW-10-minor-release.md)

## Steps

1. **Walter**: Plans the patch in ROADMAP without a planning pass (PLN-20); a new look only on Isaac's "now" (PLN-15); patch owner-ok tokens use the patch version (Q-04).
2. **Walter**: Writes the CHANGELOG section into the release issue and sends Gretchen `PRE-RELEASE CHECK <version>` (PLN-17, PLN-18).
3. **Gretchen**: Answers `DATA OK` or `DATA HOLD`.
4. **Walter**: Posts `GO <version>` after DATA OK (a patch has no RC play, KZ-11).
5. **Gus**: Starts the release item on GO (PIP-08, PLN-19).
6. **CI**: Deploys, smoke-checks, tags and publishes.
7. **Walter**: Confirms the live site serves the version, then sends Gale `REPORT READY <version>`.
8. **Jesse**: Runs a delta check of the patch, or a full play at three or more visible items (PLN-21, PLN-13).

## Gates

- `DATA OK`, then `GO` (KZ-11).
- The release starts only on Walter's own GO (KZ-11).
- Smoke check green before the tag.

## Records

- As [FLOW-10](FLOW-10-minor-release.md); no scorecard and no kaizen review

## Failure and escalation

- As [FLOW-10](FLOW-10-minor-release.md).

## Rules it runs on

- [PLN-20](../../ROADMAP.md): patches skip the pass
- [PLN-15](../DECISIONS.md): looks in a patch
- [Q-04](../../ROADMAP.md): patch owner-ok tokens
- [PLN-17](../../ROADMAP.md): release gate
- [PLN-18](../../ROADMAP.md): CHANGELOG checked
- [KZ-11](../../ROADMAP.md): GO
- [PIP-08](../team/gus.md): releases run alone
- [PLN-19](../../CLAUDE.md): bump and CHANGELOG
- [PLN-21](../team/jesse.md): delta check
- [PLN-13](https://github.com/HackTheMeatball/daeva-companion/issues/222): full play at 3+ visible items (trial)

## Last confirmed by owner

Not yet.
