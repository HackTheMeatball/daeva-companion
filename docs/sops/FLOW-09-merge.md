# FLOW-09: Merge

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Merge an approved PR automatically, never by hand, and kick off what follows a merge: CI on main, deploy, the tracker card and the next build.

## Trigger

A CI run completes, or a verdict comment is posted, on an open `claude/` PR (`auto-merge.yml`).

## Owner

**Gus** (accountable for this flow end to end; each step names who does it).

## Inputs

- The PR head, its checks and comments
- The #114 FREEZE line, if any

## Steps

1. **Walter**: For a PR held for a fresh review, removes `hold` once a `FRESH REVIEW OK <sha7>` names the current head ([FLOW-04](FLOW-04-code-review.md)). A PR whose body has a `Reviewers: fresh review` line needs no `hold`: auto-merge waits for that approval (MRG-12).
2. **Auto-merge**: Checks every gate on the head (MRG-02, MRG-06, the data check) and the freeze; squash-merges pinned to that head.
3. **Auto-merge**: Dispatches CI on main: deploy, smoke and, for a release, the tag ([docs/DEPLOY.md](../DEPLOY.md)).
4. **The merging PR's thread**: sends Huell `MERGED #<n>` in the turn its merge event wakes it (MRG-11, "A merged PR wakes Tracker Sync"). Gus sends it for kickoff builds; Gus's PR check (CLK-01) is the backstop for a merge nobody announces.
5. **Huell**: Writes the done card (TRK-02) and publishes any scrapbook cards (TRK-07).
6. **Kickoff**: Starts the next queued item ([FLOW-03](FLOW-03-build.md)).

## Gates

- `ci-ok` green and `VERDICT: APPROVE` on the head sha7 (MRG-02).
- `DESIGN OK` for a shots PR (MRG-06).
- Game Data Check VERIFIED for a data PR (ROL-03).
- No `hold` label (MRG-09).
- No named reviewer's latest tagged verdict is CHANGES, and every name in a `Reviewers:` body line approved the head (MRG-12).
- During a minor's freeze, only the PRs the freeze allows (DEC-20261020-release-manager-and-freeze).

## Records

- The merge commit on main
- The Auto-merge run log
- Tracker done card

## Failure and escalation

- Never merge by hand (MRG-01). If auto-merge fails, Gus fixes the workflow ([FLOW-03](FLOW-03-build.md) rules for workflow PRs, PIP-03).
- A PR in conflict with main: Mike flags it (HC-01); the builder updates the branch.
- Main CI red or not deployed: Mike logs it ([FLOW-12](FLOW-12-incident-and-stall.md)); rollback per DEPLOY.md.

## Rules it runs on

- [MRG-01](../team/gus.md): never by hand
- [MRG-02](../team/gus.md): auto-merge conditions
- [MRG-06](../reviews/README.md): DESIGN OK hold
- [ROL-03](../DECISIONS.md): data check
- [MRG-09](../team/gus.md): labels
- [MRG-12](../team/gus.md): named reviewers
- [DEC-20261020-release-manager-and-freeze](../DECISIONS.md): freeze
- [CLK-01](../DECISIONS.md): MERGED notice
- [TRK-02](../team/huell.md): done cards
- [TRK-07](../team/huell.md): Scrapbook
- [PIP-03](../team/gus.md): workflow PRs
- [HC-01](../team/mike.md): conflicts flagged

## Last confirmed by owner

2026-10-21, by Gus.
