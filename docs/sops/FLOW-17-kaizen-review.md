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
- Org Design's roster section (Nacho)
- Each department head's load line and add / change / delete list (their department-map row)
- Owner prune lists: checks and automation (Gus, Howard), tracker (Jane, Huell), the Ledger (Francesca)
- `coordinator/state.md` in the project's shared folder (one row per hand-off)

## Steps

1. **Every report owner**: Logs inputs live and sends Gale `REPORT READY <minor>` (DEC-20261019-kaizen-aggregates-each-review).
2. **Gale**: Audits the workflow and writes `docs/kaizen/<minor>-scorecard.md` beside the previous one (PLN-04, KZ-09).
3. **Gale**: Grades every active rule and decision, Isaac's own included (COM-18): keep, tighten, loosen, merge or retire, with evidence (KZ-01).
4. **Francesca**: Grades Gale's own rules and checks the scorecard compares like with like, reporting to the coordinator (DEC-20261019-from-0-9-rules-steward).
5. **Gale**: Grades Q-14 (DEC-20261019-kaizen-grades-the-ledger-rule) and decides every open #222 row (KZ-05).
6. **Gale**: Turns each repeated cause or worse metric into one change through [FLOW-15](FLOW-15-process-change.md), and redrafts `docs/kaizen/project-instructions.md` ([Project instructions redraft](../team/gale.md#project-instructions-redraft)); the outside reviewer per the triage rule reviews it (a consultant when it touches the Review Broker or the review system), and the coordinator applies it only after that OK.
7. **Gale**: Walks the 17-item [Kaizen scope](../team/gale.md#kaizen-scope) list: add, change or delete for each item, with the net rule count. Items 3, 5 and 11 come in as Org Design's roster section and the owners' prune lists.
8. **Gale**: Pulls the data for the [Role review](../team/gale.md#role-review) table from the sources in the brief in [board-report.md](../kaizen/board-report.md) and no others, into `kaizen/role-review-<minor>/data.md`, and grades nothing; Org Design adds workload evidence.
9. **Scorer**: A one-off with no history, not Fresh governance review, started by the coordinator with the board-report.md brief, drafts every row: keep, change or cut for every standing role and every consultant past its end condition, from the record (outcomes, seeded test, cost, Isaac touches, dependency), never from the role's own account; Kaizen's, Org Design's, the Review Broker's, the standing reviewers' (Howard, Holly) and the coordinator's rows included.
10. **Saul** (the coordinator): Decides each row and logs the outcome with its evidence link; the coordinator's own log row stands as the scorer wrote it.
11. **Gale and Nacho**: Audit `coordinator/state.md` (the coordinator hand-off audit in [gale.md](../team/gale.md#kaizen-scope)): Nacho checks routing and owners, Gale checks stalls and dropped commitments.
12. **Gale**: When the audit is written, reviewed and its changes merged or handed over, sends `KAIZEN REVIEW DONE <minor>` naming the audit file (KZ-10).

## Gates

- The graded audit is written and reviewed before `KAIZEN REVIEW DONE` (KZ-10).
- Francesca's grading reaches the coordinator.

## Records

- docs/kaizen/<minor>-scorecard.md
- The rules audit file, with the Kaizen scope walk and the Role review table
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
- [COM-18](../team/team-wide.md): owner rules graded like any other
- [KZ-05](https://github.com/HackTheMeatball/daeva-companion/issues/222): every #222 row decided
- [KZ-10](../DECISIONS.md): done before planning
- [KZ-02](../team/gale.md): safety limits
- [DEC-20261019-from-0-9-rules-steward](../DECISIONS.md): Francesca grades Gale
- [DEC-20261019-kaizen-grades-the-ledger-rule](../DECISIONS.md): Gale grades the ledger rule
- [HC-08](../../ROADMAP.md): 60 min flag
- [PIP-10](../../ROADMAP.md): limits re-derived only where hit

## Last confirmed by owner

Not yet.
