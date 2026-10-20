# FLOW-15: Process change

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Change how the team works through an outside review and one recording PR, without asking Isaac unless the team stays unsure.

## Trigger

Any thread proposes a change to a rule, a role or a permission, usually at a kaizen review ([FLOW-17](FLOW-17-kaizen-review.md)); an incident takes the fast path.

## Owner

**Gale** (accountable for this flow end to end; each step names who does it).

## Inputs

- The evidence (stall rows, scorecard, review findings)
- The affected rule text at its home
- Isaac's hand-off words (the baseline every brief carries)

## Steps

1. **Proposer**: Writes the change under KZ-01: evidence, the check the next review tests, owner, kind, and the rows and homes it touches. Workflow changes are written for Gus (KZ-06).
2. **Outside reviewer**: A thread with no history on it (Gomez by default, Howard for pipeline and code, Holly for design) reviews a fixed brief and posts `PROCESS REVIEW <id> OK`, `CHANGES` or `UNSURE` (DEC-20261020-process-change-procedure).
3. **Proposer**: On CHANGES, revises once and goes back for review.
4. **Rule owner**: On OK, has every ledger row and home written in one PR, with the rule owner as a reviewer.
5. **Walter**: Writes the DECISIONS row in that PR (DEC-01).
6. **Francesca**: Updates the ledger, Who does what and any SOP the change touches ([FLOW-19](FLOW-19-rule-and-roster-upkeep.md)).
7. **Saul**: On UNSURE, or disagreement after one revision, sends Isaac one card with both views and a recommendation ([FLOW-14](FLOW-14-owner-decision.md)).

## Gates

- `PROCESS REVIEW <id> OK` before adoption; incidents adopt first and are reviewed the same day.
- Loosening one of the seven owner-held limits stays Isaac's (DEC-20261020-team-owns-pipeline-and-permissions); a safety rule is never loosened for speed (KZ-02).

## Records

- The review comment
- DECISIONS row (ok_by "team (outside review: ...)") and ledger rows
- Kaizen log #222 row

## Failure and escalation

- UNSURE: escalate as above.
- A change to Gomez's own role or this gate goes to a consultant, never to Gomez.
- A change whose check fails at the next review is reverted ([FLOW-17](FLOW-17-kaizen-review.md)).

## Rules it runs on

- [DEC-20261020-process-change-procedure](../DECISIONS.md): the procedure
- [KZ-01](../DECISIONS.md): how a change is written
- [KZ-02](../team/gale.md): never loosen safety
- [KZ-06](../team/gale.md): workflow changes to Gus
- [DEC-01](../DECISIONS.md): DECISIONS writer
- [DEC-20261020-team-owns-pipeline-and-permissions](../DECISIONS.md): owner-held limits
- [DEC-20261020-owner-steps-away](../DECISIONS.md): why Isaac is not asked
- [Q-14](../kaizen/LEDGER.md): one home per rule

## Last confirmed by owner

Not yet.
