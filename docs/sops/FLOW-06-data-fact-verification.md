# FLOW-06: Data fact intake and verification

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Get a game fact into `data/` only when it is verified or honestly labelled, and checked by Game Data Check before it merges.

## Trigger

A research pack for a class, a queued data-fix item, a data correction routed by Beta Program ([FLOW-13](FLOW-13-outside-report-intake.md)), a fact walk finding from a play ([FLOW-20](FLOW-20-player-testing.md)), or Isaac's in-game screens.

## Owner

**Gretchen** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/research/SOURCES.md](../research/SOURCES.md) (which site for what)
- [docs/DATA-FORMAT-V2.md](../DATA-FORMAT-V2.md)
- The pack's `claims.json`
- The owner's screens in project files

## Steps

1. **Walter**: Queues the work as an item (a research pack or a data fix); it is never a direct edit (Q-01, Q-08).
2. **Research thread**: Looks facts up only on approved domains for its own pack (ROL-03), under the fetching rules (REPO-06, REPO-07). A site not on the list goes to Lydia ([FLOW-07](FLOW-07-source-vetting.md)).
3. **Research thread**: Changes the JSON in `data/`, labels anything not verified in `claims.json` (REPO-05), runs `npm run gen`, and opens the PR.
4. **Gretchen**: Checks each fact against its sources and posts `Game Data Check (ROL-03) on <sha7>: VERIFIED`, `CHANGES` or `HOLD` on the PR head; auto-merge waits for VERIFIED.
5. **Gretchen**: Lists any fact no permitted source confirms for an owner in-game check (through [FLOW-14](FLOW-14-owner-decision.md) if it blocks).
6. **Fresh reviewer**: Once per minor, re-checks 10 data fields Gretchen fixed or passed (KZ-16).

## Gates

- Game Data Check VERIFIED on the head of every data, research or icon PR (ROL-03; carry rule DEC-20261020-verified-carry-skips-data-sources).
- `npm run gen` and the schema checks green (REPO-01).

## Records

- `data/**` and `claims.json` (verdicts, `verifiedAt`)
- `data/DATA_SOURCES.md` (written by `npm run gen`)
- PR comments with Gretchen's verdict

## Failure and escalation

- CHANGES or HOLD: the builder fixes the named data; a new head needs a new check.
- Sources disagree: label it disputed and keep the old text (REPO-05).
- A fetch hits 403, 429 or a challenge: stop and record it (REPO-06).

## Rules it runs on

- [REPO-05](../../CLAUDE.md): verified data only
- [ROL-03](../DECISIONS.md): who looks up, Gretchen verifies
- [DEC-20261019-research-threads-may-fetch-from](../DECISIONS.md): research threads fetch in their pack
- [REPO-06](../../CLAUDE.md): fetching
- [REPO-07](../../CLAUDE.md): banned sites and methods
- [DEC-20261020-verified-carry-skips-data-sources](../DECISIONS.md): VERIFIED carry
- [Q-08](../../ROADMAP.md): research gates
- [KZ-16](../../ROADMAP.md): per-minor fresh data re-check
- [REPO-01](../../CLAUDE.md): tests before commit

## Last confirmed by owner

Not yet.
