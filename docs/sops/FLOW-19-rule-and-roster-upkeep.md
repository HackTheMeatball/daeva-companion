# FLOW-19: Rule and roster upkeep

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Keep the ledger, the Who does what table, the team list and these SOPs matching what was decided, so every rule has one home and one owner.

## Trigger

A merge that changes a rule or decision, a thread joining, folding or ending, or Francesca's drift sweep.

## Owner

**Francesca** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/kaizen/ledger.csv](../kaizen/ledger.csv) and [LEDGER.md](../kaizen/LEDGER.md)
- team.csv, team-changes.csv, audits.csv
- This flow index

## Steps

1. **Francesca**: Runs the drift sweep and roster check on the merge (ROL-07).
2. **Francesca**: Updates ledger rows, Who does what, team.csv, team-changes.csv and audits.csv in one PR; DECISIONS rows stay Walter's (DEC-01).
3. **Francesca**: Updates any SOP whose rules or owners changed; the ledger test fails a stale one.
4. **Francesca**: Sends a team-memory fix to Gale, who applies it.
5. **Gale**: Grades Q-14 at each kaizen review.

## Gates

- `npm test` ledger checks green (REPO-01): homes, owners, roster and SOP links.

## Records

- docs/kaizen/ledger.csv, LEDGER.md, team.csv, team-changes.csv, audits.csv
- docs/sops/

## Failure and escalation

- A rule found with two homes: point one at the other (Q-14).
- Francesca never decides, grades or changes a rule; she sends it to its owner or [FLOW-15](FLOW-15-process-change.md).

## Rules it runs on

- [Q-14](../kaizen/LEDGER.md): one home per rule
- [ROL-07](../kaizen/LEDGER.md): drift sweep
- [DEC-01](../DECISIONS.md): DECISIONS writer
- [DEC-20261019-rules-steward-francesca-joins-each](../DECISIONS.md): Rules Steward
- [DEC-20261019-kaizen-grades-the-ledger-rule](../DECISIONS.md): who grades Q-14
- [REPO-01](../../CLAUDE.md): tests green

## Last confirmed by owner

Not yet.
