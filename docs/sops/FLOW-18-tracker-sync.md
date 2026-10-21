# FLOW-18: Tracker sync

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Keep Isaac's tracker a true live view of the work: cards, To-dos, versions, the Scrapbook and the ledger page.

## Trigger

A message from another flow (`MERGED`, `KICKOFF DISPATCHED`, a To-do ask, `OK RECORDED`, a plan merge, a release). The backstop poll is off: Huell disabled it 2026-10-21 01:57Z under the coordinator's usage tiers (cut 4.1 of Kaizen's usage plan v2, `kaizen/usage-plan-v2.md` in the project's shared folder) ([DEC-20261020-usage-tiers](../DECISIONS.md)).

## Owner

**Huell** (accountable for this flow end to end; each step names who does it).

## Inputs

- GitHub state
- The tracker datasets
- The tracker checker

## Steps

1. **Huell**: Runs the checker before each write (TRK-09) and writes with if_version, retrying up to 3 times (TRK-05). Events within 5 minutes share one write, and every event still shows within 10 minutes ([DEC-20261020-tracker-coalesce-window](../DECISIONS.md#2026-10-20)). Every write also sets the snapshot sync stamp, because the page's Updated label shows the oldest of the today, versions and snapshot stamps.
2. **Huell**: Moves item cards planned, next, working, done (TRK-03) and writes a done card for every merged PR (TRK-02).
3. **Huell**: Publishes scrapbook cards within 30 min of a merge (TRK-07).
4. **Huell**: Writes and closes To-dos ([FLOW-14](FLOW-14-owner-decision.md)). For each To-do assigned to Isaac, sends the coordinator one `NEW TODO T-xx` line when it opens and one `CLOSED TODO T-xx` line when it closes; team-internal To-dos are not sent ([DEC-20261020-todo-notifications](../DECISIONS.md#2026-10-20)). A To-do closes only with its evidence named in the log.
5. **Huell**: At each release, adds the versions row in the fixed formats (TRK-06).
6. **Huell**: Keeps the ledger page datasets in step with main, re-reading the five `docs/kaizen` files on any change to them (DEC-20261019-tracker-sync-keeps-the-daeva).

## Gates

- Checker passes before every write (TRK-09).

## Records

- The tracker datasets (cards, To-dos, versions, gallery)

## Failure and escalation

- A write held for Isaac's OK pauses only itself (TRK-04).
- Drift is caught by Mike's health check (HC-01) and fixed by Huell.
- A denied write is not retried without Isaac's typed OK.

## Rules it runs on

- [TRK-01](../team/huell.md): sole writer
- [COM-04](../team/huell.md): live view
- [TRK-02](../team/huell.md): done cards
- [TRK-03](../team/huell.md): item cards
- [TRK-04](../team/huell.md): blocked writes
- [TRK-05](../team/huell.md): if_version
- [TRK-06](../team/huell.md): formats
- [TRK-07](../team/huell.md): Scrapbook
- [TRK-09](https://github.com/HackTheMeatball/daeva-companion/issues/222): checker
- [CLK-03](../DECISIONS.md): backstop poll
- [DEC-20261020-tracker-coalesce-window](../DECISIONS.md#2026-10-20): coalesce window
- [DEC-20261020-todo-notifications](../DECISIONS.md#2026-10-20): To-do notices
- [DEC-20261019-tracker-sync-keeps-the-daeva](../DECISIONS.md): ledger page
- [HC-01](../team/mike.md): drift check

## Last confirmed by owner

2026-10-21, by Huell.
