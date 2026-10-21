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
| Product | Walter | Ernesto | [product.md](product.md) |
| Engineering | Gus | one-off build threads (the pipeline) | [engineering.md](engineering.md) |
| Design | Jane | one-off build threads for the tracker page | [design.md](design.md) |
| Data & Research | Gretchen | one-off research threads | [data-research.md](data-research.md) |
| Operations | Francesca | Huell | [operations.md](operations.md) |
| Independent group (no head; reports to the coordinator) | — | Gale, Gomez, Howard, Holly, Jesse, Mike, Nacho, Chuck (second line); Lydia is listed here under Chuck but does sourcing, not checking | [independent.md](independent.md) |

Nobody reports to someone they check (Org Design's reporting pass v13; coordinator, 2026-10-21 00:47Z). Howard reviews
Gus's code, Holly reviews Jane's designs, Mike watches Gus's pipeline, Jesse plays Walter's releases, and Chuck checks
Lydia's fetching, so none of them sits in the department it checks.

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

Each run records two results (Gale's pass bar, outside OK with changes, 2026-10-21):

- **Doc** passes when the answer is correct and no question is one the doc itself should answer. Tie rule: if the
  doc's Restart or Gaps section should have pointed to where the answer lives, it is a doc question, and a Gap to fix
  in that doc.
- **Takeover** passes only when all three counts are zero: doc, handover and task-reading questions.

Whoever runs the test sorts the questions, but never on their own doc (operations.md is sorted by someone other than
Rules Steward). Handover questions go to the handover's owner, who fixes the handover before the next run and logs the
fix as a #221 row; the same handover question at the next run counts as a doc Gap. Task-reading questions go to
whoever wrote the task. Results are recorded here.

Run 1 (#681 at dad68be, 2026-10-21 01:07Z): 7/7 answers right, 0/7 empty question lists; the four doc gaps it found were
fixed before merge. Run 2 (2128b33, 01:42Z, tightened tasks): 7/7 correct, and by Rules Steward's sort no remaining
question is one a department doc should answer (operations.md still needs a non-author sort); the rest are stale handovers (each sent to its owner), task reading and one unassigned
item. Results on #681.

| Doc | Role | Handover | Task | Result (run 2) | Questions it had |
|---|---|---|---|---|---|
| leadership.md | Saul | coordinator/state.md | What is waiting on Isaac right now, and whose is each item? | Doc pass, Takeover fail | Handover only: where To-dos live; card ids in state.md given as fragments |
| product.md | Walter | release/walter-handover.md | What is the next step on 0.9, and whose is it? | Doc pass, Takeover fail | Owner of the P3 acceptance run not named (unassigned, sent to the coordinator) |
| engineering.md | Gus | pipeline/gus-handover.md | Which open claude/ PR is closest to merging, and what does it wait on? | Doc pass, Takeover fail | Handover only: holds and MRG-12 timing, PR-check fire time |
| design.md | Jane | design/handover.md | Which open PR waits on a DESIGN OK, and what must it carry? | Doc pass, Takeover fail | Task reading only |
| data-research.md | Gretchen | game-data-check/handover.md | Which open PR or item waits on a Game Data Check verdict, and what is the next step? | Doc pass, Takeover fail | Handover only: boss-data branch location, MRG-12 status |
| operations.md | Francesca | rules-steward/handover.md | Which active team.csv name, Isaac aside, is not the Owner of any row in Who does what? | Takeover fail; Doc not yet sorted by a non-author | Task wording (does Isaac count); Rules Steward's charter missing |
| independent.md | Mike | stall-log/mike-handover.md | What would the next health check look at first, and where is it recorded? | Doc pass, Takeover fail | Handover only: a stale handover-to-mike.md beside mike-handover.md |
