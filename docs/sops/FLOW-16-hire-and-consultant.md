# FLOW-16: Hire and consultant

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Start a standing or one-off thread only when cheaper options fail, with a complete brief, an outside review for standing hires, and a clean end.

## Trigger

A department head or the coordinator sees work with no owner, or sustained overload.

## Owner

**Saul** (accountable for this flow end to end; each step names who does it).

## Inputs

- The brief: owns, doesn't own, never does, reports to, end condition, cost against the usage line, handover file
- The Who does what table

## Steps

1. **Saul**: Assesses need: cut, reshuffle, automate or a one-off thread before a standing hire.
2. **Saul**: Writes the brief; a brief missing any part does not start (DEC-20261020-hiring).
3. **Gomez**: For a standing hire, reviews it before it starts and answers `HIRE OK` or `HIRE CHANGES`.
4. **Saul**: Starts the thread (DEC-20261020-coordinator-creates-threads).
5. **Francesca**: Records a standing hire in team.csv, team-changes.csv and Who does what, and adds it to OWNERS ([FLOW-19](FLOW-19-rule-and-roster-upkeep.md)). A consultant is logged, not added to team.csv.
6. **New thread**: Works to its end condition and writes a handover.
7. **Francesca**: On retirement, moves the thread's rows to their new owners.
8. **Mike**: Flags a consultant kept past its end condition or past one minor.

## Gates

- A complete brief.
- `HIRE OK` before a standing hire starts.

## Records

- The brief and handover (project files)
- team.csv, team-changes.csv, Who does what
- Consultants: no log exists yet (the hiring decision names docs/team/consultants.md); Francesca owns that gap

## Failure and escalation

- A consultant past its end or one minor becomes a standing hire and gets the review.
- Graded at each kaizen review: did each thread earn its cost ([FLOW-17](FLOW-17-kaizen-review.md)).

## Rules it runs on

- [DEC-20261020-hiring](../DECISIONS.md): hiring procedure
- [DEC-20261020-coordinator-creates-threads](../DECISIONS.md): Saul starts threads
- [DEC-20261020-usage-budget](../DECISIONS.md): cost against the usage line
- [ROL-07](../kaizen/LEDGER.md): roster upkeep

## Open questions for the owner of this flow

- The hiring row says consultants are logged in docs/team/consultants.md; that file does not exist yet.
- Org Design's adopted v2 process (department-head request, reshuffle check, fresh review before decision) is not in the repo, and Nacho is not on team.csv yet. Once both land, add the reshuffle-check step here.

## Last confirmed by owner

Not yet.
