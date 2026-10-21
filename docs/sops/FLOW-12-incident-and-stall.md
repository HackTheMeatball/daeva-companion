# FLOW-12: Incident and stall handling

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Notice stuck work, red runs, idle queues and tracker drift; log every one before fixing it, and make repeats reach the kaizen review.

## Trigger

The health check (hourly while work is in flight, every 4 h idle: HC-06), any thread reporting a stall to Mike, an incident the coordinator or Gale declares (the fast path in [FLOW-15](FLOW-15-process-change.md)), or a one-shot follow-up Mike set.

## Owner

**Mike** (accountable for this flow end to end; each step names who does it).

## Inputs

- GitHub state: queue, PRs, Actions runs, main CI
- The tracker datasets
- Stall log #221 header (row format, Kinds)

## Steps

1. **Mike**: Runs the checks (HC-01), including OKs Isaac typed that are not applied after 60 min (DEC-20261019-saul-owns-what-s-waiting), release checks unanswered after 60 min (HC-08), clock and thread liveness, the fresh-review check on merged `fresh-review` items (KZ-16), the kaizen gate (`PLAY DONE`, then `KAIZEN REVIEW DONE`, then planning; COM-15, KZ-10), and `Blocked:` comments on `[started]` and `[blocked]` builds.
2. **Mike**: For each anomaly, first appends one #221 row, re-reading before and verifying after (HC-02, Q-15, LOG-01). Rows also go in for every Auto-merge conflict failure (K22 in [docs/kaizen/0.8-scorecard.md](../kaizen/0.8-scorecard.md), section 7), every hand edit (NEW-02), and every merged `fresh-review` item with no `FRESH REVIEW` comment (`review-skipped`, KZ-16). Waste gets no row: Gus's #114 Waste comments are the record.
3. **Mike**: Applies the first fix, or sends it to the owner from the Who does what table: queue idle to Walter (HC-07), pipeline to Gus, tracker drift to Huell.
4. **Mike**: Only if Isaac alone can unstick it, Mike sends it to the coordinator, who owns what is waiting on Isaac (TRK-08, DEC-20261019-saul-owns-what-s-waiting; [FLOW-14](FLOW-14-owner-decision.md)), worded per COM-16. Mike doesn't open To-dos.
5. **Mike**: Sends Gale `KIND RECURRED` the same day when a Kind comes back after its fix (HC-09).
6. **Gus**: Writes a #114 Waste comment for each failed or redone run (PIP-15).
7. **Mike**: Per release, writes the error report (LOG-03) and sends `REPORT READY` ([FLOW-17](FLOW-17-kaizen-review.md)).

## Gates

- A #221 row exists before the fix (HC-02).

## Records

- Stall log #221 rows, owner-wait rows (LOG-02), hand-edit rows (NEW-02)
- #114 "Health check:" line, updated every run
- `stall-log/health-runs.md` in the project's shared folder: one row per run, follow-ups included
- Mike's handover (`stall-log/mike-handover.md` in the project's shared folder)
- #114 Waste comments (Gus)

## Failure and escalation

- A refused body edit: post it as a #221 comment (LOG-04).
- The core suite timing flake: log it and send it to Gus for the one re-run (HC-11).
- Never skip, disable or quarantine a test, merge, or fire a trigger by hand.
- An incident that needs a rule change: the fast path in [FLOW-15](FLOW-15-process-change.md).

## Rules it runs on

- [HC-01](../team/mike.md): the checks
- [KZ-16](../../ROADMAP.md): fresh-review check
- [KZ-10](../DECISIONS.md): kaizen before planning
- [COM-15](../../ROADMAP.md): order after a minor ships
- [HC-02](../team/mike.md): log first
- [HC-06](../DECISIONS.md): cadence
- [HC-07](https://github.com/HackTheMeatball/daeva-companion/issues/222): QUEUE IDLE
- [HC-08](../../ROADMAP.md): 60 min flags
- [HC-09](https://github.com/HackTheMeatball/daeva-companion/issues/221): KIND RECURRED
- [HC-11](../DECISIONS.md): timing flake
- [LOG-01](https://github.com/HackTheMeatball/daeva-companion/issues/221): #221 format
- [LOG-02](https://github.com/HackTheMeatball/daeva-companion/issues/221): owner waits
- [LOG-03](../team/mike.md): release error report
- [LOG-04](https://github.com/HackTheMeatball/daeva-companion/issues/221): refused edits
- [NEW-02](https://github.com/HackTheMeatball/daeva-companion/issues/221): hand edits
- [Q-15](../team/team-wide.md): append-only logs
- [TRK-08](../team/mike.md): To-do only if Isaac alone
- [COM-16](../team/mike.md): health reports
- [PIP-15](../team/gus.md): waste record
- [DEC-20261019-saul-owns-what-s-waiting](../DECISIONS.md): unapplied OK is a stall
- [DEC-20261019-incident-log-folds-into-stall](../DECISIONS.md): Mike writes #221

## Last confirmed by owner

Not yet.
