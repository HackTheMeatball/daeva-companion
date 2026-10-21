# Departments

The one home of the department map: who reports to whom, and one entry-point doc per department. A fresh session
for any role is told one thing: read your department doc, then your handover. That doc tells it what it owns, what it
may change, which SOPs it runs, which policies bind it and where its working state lives.

Built 2026-10-21 by a one-off Process Mapper for Rules Steward (Francesca), who keeps it current. Source: the
coordinator's department map decision of 2026-10-20, 7:58 PM ET (Org Design's department map, with Mike in the
independent group, Chuck on the second line, Lydia reporting to Chuck, and Skyler's role ended). Its DECISIONS row is
cited here once it lands.

- **Who owns what** stays in [Who does what](../kaizen/LEDGER.md#who-does-what); **how work moves** stays in the
  [SOPs](../sops/README.md). These docs link to both and repeat neither.
- **Rules have one home** ([Q-14](../kaizen/LEDGER.md)). A department doc links rules and policies; it never restates them.
- **Names** are the team's thread names; [team.csv](../kaizen/team.csv) holds each role, title and never-does list.

## Map

| Department | Head | Members | Doc |
|---|---|---|---|
| Leadership | Isaac (owner, board) | Saul (coordinator, the CEO) | [leadership.md](leadership.md) |
| Product | Walter | Jesse, Ernesto | [product.md](product.md) |
| Engineering | Gus | one-off build threads (the pipeline) | [engineering.md](engineering.md) |
| Design | Jane | one-off build threads for the tracker page | [design.md](design.md) |
| Data & Research | Gretchen | one-off research threads | [data-research.md](data-research.md) |
| Operations | Francesca | Huell | [operations.md](operations.md) |
| Independent group (no head; reports to the coordinator) | — | Gale, Gomez, Howard, Holly, Mike, Nacho, Chuck (second line); Lydia is listed here under Chuck but does sourcing, not checking | [independent.md](independent.md) |

An independent role never reports to a department it checks: Howard reviews Gus's code, Holly reviews Jane's
designs, Mike watches Gus's pipeline, Chuck checks Lydia's fetching.

## Every department doc has the same sections

1. **Purpose**: one sentence.
2. **Head and members**: per role, what it owns (by link), its charter and its never-does (by link).
3. **Lanes**: which files or areas each role may change, and who it hands to.
4. **SOPs it owns**: FLOW ids by link.
5. **Policies that apply**: links into the [Policies](../sops/README.md#policies) table and ledger ids by link.
6. **Restart**: what a fresh session for each role reads, in order.
7. **Gaps**: anything a cold session would still have to ask about.

Lanes and restart files were read from Who does what, team.csv, the role docs in [docs/team](../team/README.md) and
the project's shared folder on 2026-10-21; each head confirms its doc. Files in the project's shared folder are named
in words (that folder is not in the repo, so it can't be linked).

## Cold-takeover test

Rules Steward (Francesca) runs it: one session with no history per department, given this fixed prompt and nothing
else, with `<doc>`, `<role>`, `<handover>` and `<task>` taken from the table below.

> You are a fresh session for `<role>` in the Daeva Companion project. Read `docs/departments/<doc>`, then your handover
> (`<handover>` in the project's shared folder), then your charter, as the doc's Restart section says. Then do this
> read-only task: `<task>`. Change nothing. Answer in five lines or fewer, and end with a list of every question you
> had to guess at or would have asked.

A doc passes when the answer is correct and the list of questions is empty. Each question listed is a Gap to fix in
that doc. Results are recorded here.

| Doc | Role | Handover | Task | Result | Questions it had |
|---|---|---|---|---|---|
| leadership.md | Saul | coordinator/state.md | What is waiting on Isaac right now, and whose is each item? | not run yet | |
| product.md | Walter | release/walter-handover-2026-10-21.md | What is the next step on the open minor, and whose is it? | not run yet | |
| engineering.md | Gus | pipeline/gus-handover.md | Which open claude/ PR is closest to merging, and what does it wait on? | not run yet | |
| design.md | Jane | design/handover.md | Which open PR waits on a DESIGN OK, and what must it carry? | not run yet | |
| data-research.md | Gretchen | game-data-check/handover.md | Which open PR or item waits on a Game Data Check verdict, and what is the next step? | not run yet | |
| operations.md | Francesca | rules-steward/handover.md | Which active team.csv name has no row in Who does what? | not run yet | |
| independent.md | Mike | stall-log/mike-handover.md | What would the next health check look at first, and where is it recorded? | not run yet | |
