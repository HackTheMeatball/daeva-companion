# FLOW-21: Game patch re-check

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

When the game changes, re-verify the facts the guide depends on, oldest first, and label what changed.

## Trigger

Metabot's game build changes (`data/packs/aion2/game-builds.json`), a patch note is published, or a player report says the game changed.

## Owner

**Gretchen** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/team/patch-watch.md](../team/patch-watch.md) (order of checks and claim labels)
- data/packs/aion2/sources.json
- `verifiedAt` on each record

## Steps

1. **Gretchen**: Records the new build and lists the records to re-check, oldest `verifiedAt` first.
2. **Walter**: Queues the re-check as a data item ([FLOW-06](FLOW-06-data-fact-verification.md)).
3. **Research thread**: Re-verifies in the order patch-watch.md gives, under the fetching rules (REPO-06), and sets each claim's verdict.
4. **Gretchen**: Verifies the PR ([FLOW-06](FLOW-06-data-fact-verification.md) gate) and lists in-game checks for Isaac.

## Gates

- Game Data Check VERIFIED (ROL-03).

## Records

- game-builds.json, claims.json, `verifiedAt`
- A CHANGELOG Data line naming the build

## Failure and escalation

- A change that could touch saved progress goes to Gus (REPO-04).
- Unreachable source: label `unverifiable`, never guess.

## Rules it runs on

- [REPO-05](../../CLAUDE.md): verified data only
- [REPO-06](../../CLAUDE.md): fetching
- [REPO-07](../../CLAUDE.md): banned sites
- [ROL-03](../DECISIONS.md): Gretchen verifies
- [REPO-04](../../CLAUDE.md): saves

## Open questions for the owner of this flow

- patch-watch.md's sign-off section still says nothing merges without the owner's OK and names old departments; the merge gate today is [FLOW-09](FLOW-09-merge.md). Fold or rewrite?

## Last confirmed by owner

Not yet.
