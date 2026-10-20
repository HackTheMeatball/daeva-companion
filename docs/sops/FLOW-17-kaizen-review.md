# FLOW-17: Kaizen review

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

After each minor, review how the team worked, grade every active rule and decision, and set the changes the next plan is made under.

## Trigger

After `RELEASE SHIPPED` and `PLAY DONE`, each input owner sends `REPORT READY <minor>`; the review starts when the last arrives (PLN-03). Weekly fallback Tuesday 4:03 AM ET (CLK-04).

## Owner

**Gale** (accountable for this flow end to end; each step names who does it).

## Inputs

- Stall log #221 and Mike's error report
- Planner log #232
- Kaizen log #222
- #114 Waste comments
- Player findings, data report, rules and roster report
- The previous minor's scorecard in docs/kaizen/

## Steps

1. **Every report owner**: Logs inputs live and sends Gale `REPORT READY <minor>` (DEC-20261019-kaizen-aggregates-each-review).
2. **Gale**: Audits the workflow and writes `docs/kaizen/<minor>-scorecard.md` beside the previous one (PLN-04, KZ-09).
3. **Gale**: Grades every active rule and decision: keep, tighten, loosen, merge or retire, with evidence (KZ-01).
4. **Francesca**: Grades Gale's own rules and checks the scorecard compares like with like, reporting to Saul's debrief (DEC-20261019-from-0-9-rules-steward).
5. **Gale**: Grades Q-14 (DEC-20261019-kaizen-grades-the-ledger-rule) and decides every open #222 row (KZ-05).
6. **Gale**: Turns each repeated cause or worse metric into one change through [FLOW-15](FLOW-15-process-change.md), and proposes project-instruction updates to the coordinator.
7. **Gale**: When the audit is written, reviewed and its changes merged or handed over, sends `KAIZEN REVIEW DONE <minor>` naming the audit file (KZ-10).

## Gates

- The graded audit is written and reviewed before `KAIZEN REVIEW DONE` (KZ-10).
- Francesca's grading is in the debrief.

## Records

- docs/kaizen/<minor>-scorecard.md
- The rules audit file
- #222 rows
- ledger.csv grade column

## Failure and escalation

- `PLAY DONE` with no `KAIZEN REVIEW DONE` after 60 min: Mike flags it (HC-08).
- An input Gale has to look up after the fact is a gap, assigned to an owner at that review.
- Never loosen a safety rule for speed (KZ-02).

## Rules it runs on

- [PLN-02](../../ROADMAP.md): hard gate
- [PLN-03](../../ROADMAP.md): when it runs
- [CLK-04](../team/gale.md): weekly fallback
- [DEC-20261019-kaizen-aggregates-each-review](../DECISIONS.md): inputs logged live
- [PLN-04](../../ROADMAP.md): scorecard
- [KZ-09](https://github.com/HackTheMeatball/daeva-companion/issues/222): targets, blind spots, rule count
- [KZ-01](../DECISIONS.md): graded audit
- [KZ-05](https://github.com/HackTheMeatball/daeva-companion/issues/222): every #222 row decided
- [KZ-10](../DECISIONS.md): done before planning
- [KZ-02](../team/gale.md): safety limits
- [DEC-20261019-from-0-9-rules-steward](../DECISIONS.md): Francesca grades Gale
- [DEC-20261019-kaizen-grades-the-ledger-rule](../DECISIONS.md): Gale grades the ledger rule
- [HC-08](../../ROADMAP.md): 60 min flag
- [PIP-10](../../ROADMAP.md): limits re-derived only where hit

## Last confirmed by owner

Not yet.
