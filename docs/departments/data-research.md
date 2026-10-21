# Data & Research

## Purpose

Keep every game fact in the guide correct and sourced: fact checks, icon lookups, research packs and re-checks after
game patches.

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Gretchen (head) | Game Data Check | Data QA and fact-checker | rows naming Gretchen in [Who does what](../kaizen/LEDGER.md#who-does-what) | Gap: not settled (docs/team/data-research.md was asked about) | [team.csv](../kaizen/team.csv), Gretchen's row |

Research packs are built by one-off research threads that Walter starts; they are not on the roster.

## Lanes

- **Gretchen** checks facts and icons on approved sites, posts Game Data Check verdicts and DATA OK, and records icon
  provenance ([docs/team/icon-provenance.md](../team/icon-provenance.md), [docs/ISSUES.md](../ISSUES.md)). A data fix in
  `data/` is a queued item that Gretchen checks, not a direct edit.
- **Research threads** change `data/` and `docs/research/` for their pack only.
- Hands new sites to Lydia (independent, reports to Chuck), builds to Walter's queue.
- Old-structure notes that are still live: [docs/team/data-research.md](../team/data-research.md).

## SOPs it owns

- Gretchen: [FLOW-06](../sops/FLOW-06-data-fact-verification.md), [FLOW-08](../sops/FLOW-08-icon-intake.md),
  [FLOW-21](../sops/FLOW-21-game-patch-recheck.md)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); the data and source policy in [CLAUDE.md](../../CLAUDE.md)
  and [SOURCES.md](../research/SOURCES.md) above all.
- Rules: [REPO-05](../../CLAUDE.md), [ROL-03](../DECISIONS.md), [ROL-05](../DECISIONS.md), and every ledger row whose owner is Gretchen
  ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Gretchen reads this file, then its handover (game-data-check/handover.md in the shared folder),
  then its charter.

## Gaps

- Gretchen has no charter in the repo; whether docs/team/data-research.md is it is not settled.
- Lanes are read from Who does what and the role docs, not confirmed by Gretchen yet.
