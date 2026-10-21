# FLOW-14: Owner decision

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Ask Isaac only for what only Isaac can decide or do, in one clear To-do, and make sure the typed answer is recorded and applied within the hour.

## Trigger

A thread needs a product call, an in-game check, an external setup, a setting the team cannot change, or a loosening of one of the seven owner-held limits (listed in [DEC-20261020-team-owns-pipeline-and-permissions](../DECISIONS.md#2026-10-20); tightening one needs no owner OK). Process, rule and team changes do not come here ([FLOW-15](FLOW-15-process-change.md), DEC-20261020-owner-steps-away).

## Owner

**Saul** (accountable for this flow end to end; each step names who does it).

## Inputs

- The question, the options and a recommendation
- The exact words Isaac would type, and the thread to type them in

## Steps

1. **Requesting thread**: Checks it is a true blocker only Isaac can clear (PLN-07, DEC-20261020-team-owns-pipeline-and-permissions), then asks Huell for a To-do: one owner, one OK, what waits on it, a copy box naming the thread (COM-09; DEC-20261019-each-thread-opens-its).
2. **Huell**: Writes the To-do and sends the coordinator one `NEW TODO` line for the project chat (DEC-20261020-todo-notifications).
3. **Nacho**: Backs the ask before it reaches Isaac: Nacho checks routing and roles, and the owning department head checks the work. Both are logged in `coordinator/state.md` in the project's shared folder, naming who backed it.
4. **Saul**: Puts a not-blocking ask in the one morning debrief (COM-02). A hard blocker goes out at once as a red To-do and a `HARD BLOCKER:` post (COM-05). A judgment To-do stays not red until its output is on main (COM-08).
5. **Isaac**: Types the answer in the named thread.
6. **Recorder**: The thread where Isaac typed it reads Isaac's own words (DEC-02) and forwards them verbatim to Walter.
7. **Walter**: Writes the DECISIONS row and its ledger row (DEC-01), with times in ET (COM-01).
8. **Recorder**: Sends Huell `OK RECORDED` once the PR has merged (DEC-03, COM-13).
9. **Huell**: Closes the To-do only on `OK RECORDED` or a DECISIONS row (DEC-20261019-tracker-sync-closes-a), marks it user or Claude remediated (PLN-10), and posts the close line.

## Gates

- Only Isaac's own typed words count (DEC-02).
- A typed OK is applied within 60 min, or it is a stall (DEC-20261019-saul-owns-what-s-waiting).

## Records

- Tracker To-do
- docs/DECISIONS.md row and ledger.csv row
- The morning debrief
- `coordinator/state.md` in the project's shared folder (who backed each ask)

## Failure and escalation

- Not applied within 60 min: Mike logs a stall ([FLOW-12](FLOW-12-incident-and-stall.md)).
- A notify that fails: a `Notify FAILED` note and a retry (COM-07).
- A relayed or paraphrased OK is not an OK: ask for the typed words.

## Rules it runs on

- [PLN-07](../../ROADMAP.md): only true blockers
- [DEC-20261020-team-owns-pipeline-and-permissions](../DECISIONS.md): what only Isaac decides; the seven owner-held limits
- [DEC-20261020-owner-steps-away](../DECISIONS.md): process asks stay with the team
- [DEC-20261019-each-thread-opens-its](../DECISIONS.md): the thread opens its To-do
- [COM-09](../team/team-wide.md): copy boxes
- [DEC-20261020-todo-notifications](../DECISIONS.md): NEW TODO line
- [COM-02](../DECISIONS.md): morning debrief
- [COM-05](../team/saul.md): hard blockers
- [COM-07](../team/saul.md): notify format
- [COM-08](../team/saul.md): judgment To-dos
- [COM-01](../team/team-wide.md): times in ET
- [DEC-02](../team/walter.md): typed words only
- [DEC-01](../DECISIONS.md): Walter writes DECISIONS
- [DEC-03](../team/walter.md): OK RECORDED
- [COM-13](../team/team-wide.md): done means merged
- [DEC-20261019-tracker-sync-closes-a](../DECISIONS.md): closing the To-do
- [PLN-10](../../ROADMAP.md): who remediated
- [DEC-20261019-saul-owns-what-s-waiting](../DECISIONS.md): 60 min stall

## Last confirmed by owner

2026-10-21, by Saul (coordinator).
