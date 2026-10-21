# FLOW-16: Hire and consultant

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Start a standing or one-off thread only when cheaper options fail, with a complete brief, an outside review for every hire, and a clean end.

## Trigger

A department head or the coordinator sees work with no owner, or sustained overload.

## Owner

**Saul** (accountable for this flow end to end; each step names who does it).

## Inputs

- The brief: owns, doesn't own, never does, reports to, end condition, cost against the usage line, handover file
- The Who does what table

## Steps

1. **Requesting thread**: The department head requests the hire and drafts the job description, with its justification; a brief missing any part does not start (DEC-20261020-hiring).
2. **Saul**: Before any hire, checks whether reshuffling the work to existing threads covers it.
3. **Saul**: Approves, modifies or denies the request. Saul doesn't write the brief.
4. **Outside reviewer**: Reviews every hire, standing or consultant, before it starts and answers `HIRE OK` or `HIRE CHANGES`: a one-off the coordinator starts from the fixed brief template (`audit-1.0/fresh-reviewers.md`), or Fresh governance review where the triage rule names it. Every hire gets this review, so there is no broker call; Gomez (Review Broker) briefs only unplanned changes (`docs/team/gomez.md`).
5. **Nacho**: Backs the hire before the thread starts: Nacho checks routing and roles, and the owning department head checks the work. Both are logged in `coordinator/state.md` in the project's shared folder, naming who backed it.
6. **Saul**: Starts the thread (DEC-20261020-coordinator-creates-threads).
7. **Francesca**: Records a standing hire in team.csv, team-changes.csv and Who does what, and adds it to OWNERS ([FLOW-19](FLOW-19-rule-and-roster-upkeep.md)). A consultant is logged, not added to team.csv.
8. **New thread**: Works to its end condition and writes a handover.
9. **Francesca**: On retirement, moves the thread's rows to their new owners.
10. **Mike**: Flags a consultant kept past its end condition or past one minor.

## Gates

- A complete brief.
- A reshuffle check before any hire.
- `HIRE OK` before any hire starts.
- The backing logged in `coordinator/state.md` before the thread starts.

## Records

- The brief and handover (project files)
- team.csv, team-changes.csv, Who does what
- Consultants: no log exists yet (the hiring decision names docs/team/consultants.md); Francesca owns that gap

## Failure and escalation

- A consultant past its end or one minor becomes a standing hire.
- Graded at each kaizen review: did each thread earn its cost ([FLOW-17](FLOW-17-kaizen-review.md)).

## Rules it runs on

- [DEC-20261020-hiring](../DECISIONS.md): hiring procedure
- [DEC-20261020-coordinator-creates-threads](../DECISIONS.md): Saul starts threads
- [DEC-20261020-usage-budget](../DECISIONS.md): cost against the usage line
- [ROL-07](../kaizen/LEDGER.md): roster upkeep

## Open questions for the owner of this flow

- The hiring row says consultants are logged in docs/team/consultants.md; that file does not exist yet.
- DEC-20261020-hiring's home predates Org Design's adopted v2 hiring process: it still says the coordinator writes the brief and only standing hires get the outside review. This page follows the adopted process as the coordinator corrected it (2026-10-21: department head drafts, reshuffle first, review for every hire; no reason for exempting consultants is recorded). Walter updates the DECISIONS row to match; until it does, the row and this page differ and the coordinator's correction is the record.

## Last confirmed by owner

2026-10-21, by Saul (coordinator).
