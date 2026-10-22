# Gale (Kaizen)

- **I own:** Kaizen review, #222, the scorecard, rule changes and grades; Grading Q-14; Applying a fix to team memory (Francesca sends the fix) (from the [Who does what](../kaizen/LEDGER.md#who-does-what) table).
- **I don't own, send to:** Grading Gale's own rules and checking the scorecard compares like with like (from 0.9): send to Francesca.
- **I never do:** Grade Gale's own rows (from 0.9 Francesca grades them); approve rules or design the team alone; edit another owner's files; count a relayed OK as Isaac's; look facts up after the fact.

The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes these rules.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections. Where a rule was amended later, it shows the current wording, and an "amended" line under it gives the source and the old wording.

## Kaizen

### KZ-02

_From #114 "Kaizen (owner, 2026-10-17 5:59 AM ET)"._

- **Limits:** never loosen a safety rule (never merge, verified data only, contact through Saul's morning debrief with a HARD BLOCKER only for what can't wait, no th.gl / Game8, Isaac's device only if he agrees it genuinely helps, tests before commits) to gain speed.
- **Device clause amended** (owner, typed in the Kaizen (Gale) thread 2026-10-20 12:38 PM ET; ledger row `DEC-20261020-ask-before-owner-device`): was "no owner computer".

### CLK-04

_From #114 "Kaizen (owner, 2026-10-17 5:59 AM ET)", the "Who" bullet, and the "Scheduled tasks" line._

- **Weekly fallback:** a kaizen review also runs every Tuesday at 4:03 AM ET (trigger trig_01BhE33jAevxTzMQGbJSnWck, which wakes the Kaizen (Gale) thread), on top of the reviews at each planning pass, after each release and on a recurring Kind. No daily review (owner, 2026-10-18 5:27 AM ET).

### Kaizen scope

_From the owner, project chat 2026-10-20 6:46 PM ET: "kaizen is supposed to improve workflow every cycle by recommending adding, changing, or deleting any standing rules, decisions, instructions, etc". Outside review: Team Audit (Gomez), `PROCESS REVIEW kaizen-scope` CHANGES 6:47 PM ET, folded in. Revised after the fresh outside review, 6:58 PM ET._

- **Scope:** each kaizen review recommends adding, changing or deleting anything standing, and deleting gets the same
  weight as adding: prune what no longer earns its cost. Kaizen recommends; each item's owner decides and applies, and
  anything among the seven owner-held limits goes to Isaac with the outside review attached. The list it walks
  (owner in brackets where it isn't Kaizen):
  1. rules and decisions (DECISIONS, the Ledger, CLAUDE.md) [each rule's owner; DECISIONS: Walter];
  2. the project instructions (see below) [applied by the coordinator];
  3. the team: not Kaizen's to recommend. Org Design's roster scan (hire, merge, retire; charters and ownership)
     comes into the review as its own section before `KAIZEN REVIEW DONE` [Org Design proposes, the coordinator
     decides, an outside reviewer checks];
  4. review triage (standing, blind, external) and its defaults [Walter];
  5. checks and automation: CI checks, scripts, gates, auto-merge conditions; reaches the review as a prune list from
     its owners [Gus, Howard];
  6. templates: briefs, PR and issue templates, review checklists [each template's owner];
  7. cadences: scheduled tasks, polling, check-ins, health checks [each task's owner];
  8. budgets: usage, the build cap, model routing [Gus, Walter];
  9. metrics: the scorecard's own definitions and targets;
  10. runbooks and docs: DEPLOY, ARCHITECTURE, handover files, and memory files where memory is on [each doc's owner];
  11. the trackers' and the Ledger's structure; reaches the review as a prune list from its owners [Jane, Huell; the
      Ledger: Francesca];
  12. how threads talk: message formats, hand-off markers, escalation paths;
  13. the owner's To-do list: whatever only Isaac can do, kept short [the coordinator; data: Huell];
  14. the release and deploy process: gate order, freeze, staging, rollback [Walter, Gus];
  15. risk, incidents and recovery: severity, incident lead, postmortems, rollback drills, live checks;
  16. data handling and privacy, process side only: tester data and retention, the source and claims-labelling
      workflow [Ernesto, Gretchen, Lydia]; fetching and ToS stay owner-held.
  17. practice gaps against real-world practice [scored by a one-off reviewer; references: Lydia]: each review scores
      a fixed checklist of named practices as done, partial or missing, with evidence. Each practice is a concrete
      question with checkable evidence, not a name (for example "Is the live build exactly a tagged release? Evidence:
      live build.json vs the latest tag" and "Does a person play the build against each item's acceptance lines?").
      The practices: acceptance criteria, UAT, code review, CI, release management (including patch release branches),
      postmortems, change management, monitoring, data QA, accessibility, security and docs. Lydia sources the
      reference practice for each; her references follow SOURCES.md vetting like any other site. The scorer is a
      one-off with no history, not Fresh governance review, briefed with the checklist, the evidence and Lydia's
      references, nothing else. It may add up to one practice per review that isn't on the list. Each "missing", and
      each "partial" that carries a real risk, becomes a proposal routed through the coordinator. The scorecard and its
      status go in `docs/kaizen/` next to the waste scorecard. First run: the 0.9 kaizen review. _Source: Isaac,
      project chat 2026-10-21 6:52 PM ET (cmsg_01UNirAFgxf3jC8kQS8uvvHBViiU6n169JFZBKWmY2KqgU): "When will I get the
      next report on how close our development cycles align with real world examples? … If not, what would have it if
      I didn’t bring it up?"; Kaizen batch-0.9 item 24; `PROCESS REVIEW practice-gap` OK with 3 changes (Fresh
      governance review), applied by Rules Steward as neutral writer (2026-10-21 9:34 AM owner row). Routed:
      coordinator 2026-10-21T22:54Z._
- **Org Design boundary (coordinator decision, 2026-10-20 6:53 PM ET):** items 3, 5 and 11 are inputs to the review,
  not recommendations Kaizen generates. Kaizen grades and scores them with the rest.
- **Kaizen's own process isn't Kaizen's to grade:** a change to this file, KZ-01, the scorecard definitions that measure
  Kaizen, or this scope goes to the outside reviewer per the triage rule (ROADMAP step 3, "Review level").
- **Coordinator hand-off audit (coordinator, 2026-10-20 6:59 PM ET):** at each kaizen review, Gale and Org Design audit
  `coordinator/state.md` (one row per hand-off) from the record for skipped consults, stalls and misrouted work. The
  test is zero re-asks and zero dropped commitments at the next coordinator change.
- **Scorecard:** each scorecard lists, per item above, what it adds, changes and deletes (or "none"), and the net rule
  count for the minor (added minus retired).

### Role review

_From the owner, project chat 2026-10-20 7:00 PM ET: "No one is safe if their worth can't be proven." Outside review:
Fresh governance review, `PROCESS REVIEW role-review` OK on v3, 2026-10-20 7:59 PM ET; comments from Team Audit and
Org Design. Conformed 2026-10-22 to #791 (Team Audit seat closed, Review Broker opened) by Rules Steward as neutral
writer; routed: coordinator 2026-10-22T00:35Z. Who assesses whom follows board-report.md (#790, #798)._

**Role review (owner, 2026-10-20 7:00 PM ET):** every minor's kaizen review ends with one table, with a row for every
standing role and every consultant past its end condition. Each row gives a **keep / change / cut** recommendation on
evidence. No role is exempt: Kaizen, Org Design, the Review Broker, the standing reviewers and the coordinator's hand-off log
all get a row.

- **Evidence per row:** everything comes from the record (git, PR comments, the Ledger, the scorecard), not from the
  role's own account.
  1. **Outcomes, not volume:** the escape rate (majors that got past a control role and were found later, target 0),
     first-pass rate, and the rework or hand-interventions the role caused others.
  2. **Seeded test, for control roles:** Watchdog, the reviewers, Game Data Check, the Review Broker and any gate role are
     tested once per minor with a planted defect where they should catch it, such as a stale To-do, a wrong data field,
     a removal in a mock, or a red-flag process change. For the Review Broker, the planted defect is an unplanned change
     that meets an `external` trigger of the Review level list (ROADMAP "How a minor is planned", step 3) sent to it
     with no review asked; it catches it by brokering an outside one-off before the change is applied. Whether they
     caught it is recorded. A quiet minor with 0 catches
     isn't held against a control role that passes its test. Kaizen plants the defects; a fresh reviewer plants Kaizen's.
     Seeds go only on throwaway branches, mocks or copies, are recorded before they're planted and removed afterwards,
     and never touch main, live data or Isaac's tracker.
  3. **Cost:** runs per role, plus per-day session spend as a relative cost proxy, until per-thread usage can be read
     as a share of the usage reading.
  4. **Isaac touches:** the process touches the role caused Isaac in the minor. Each one counts against the role,
     whatever it shipped; the 1.0 goal is that Isaac only says "add X feature". Touches that an owner-held limit or an
     in-game check requires don't count.
  5. **Dependency:** what would break, or who would take on its work, without it. If nobody can name anything, that
     counts against it.
  6. **Model and effort fit** (Gale, routed by the coordinator 2026-10-22T03:05Z after Isaac's in-principle OK,
     cmsg_01UNirAFgxf3jC8kQS8uvvHBXt9ktTtRrErW4HsQXfGJ1t): is the seat on the right model and effort level for its
     work? Judged from the record, not taste: the misses and rework that trace to judgment (such as the model rule's
     line-3 triggers), calls outside the brief, and the seat's usage from 3. The row recommends keep, up or down for
     the model and for the effort level. A model change the model rule (DECISIONS `owner-ok-model-rule`) already
     calls for is applied at the seat's next handover, as its line 4 says; anything else, any effort-level change
     included, goes to Isaac as a recommendation, because those settings are his. Reviewing the rule itself stays
     with its line 5.
- **Cut tests:**
  - A role with no value in the minor and no named dependency is recommended **cut**.
  - A role whose value doesn't cover its cost two minors running is recommended **cut** or **change** (merge, narrow,
    or move it to a consultant).
  - A role in its first minor is graded against its hire brief's end condition instead.
  - A control role that fails its seeded test is recommended **change** the first time and **cut** the second.
- **Roles that review the coordinator:** cutting or narrowing one is trigger 2 of the triage rule. It needs a fresh
  review first, and it goes on Isaac's per-minor list.
- **Before a cut:** every row it owns (Ledger rows, Who-does-what rows, any owner-held duty) has a named successor
  first. A cut takes effect only after `RELEASE SHIPPED` and the handover file, never inside a freeze.
- **Who assesses whom:** a role never assesses itself.
  - Kaizen does the data pull, from the sources in the brief in [board-report.md](../kaizen/board-report.md) and no
    others, and grades nothing.
  - A one-off scorer with no history, not Fresh governance review, drafts every row from that brief, Kaizen's, Org
    Design's, the Review Broker's, the standing reviewers' and the coordinator's included (board-report.md "Steps",
    the spec's one home).
  - Org Design adds workload and overlap evidence, but not for its own row.
- **Who decides:** the coordinator decides each row and logs the outcome (Ledger, team-changes.csv) with the evidence
  link. A cut follows the hiring procedure's end steps: a handover file, then the thread ends. The coordinator's own
  row stands as the scorer wrote it. The coordinator logs it, doesn't override
  it, and may add a dissent; the verdict and any dissent both go on Isaac's per-minor list.
- **Lean:** the table goes into the existing scorecard (`docs/kaizen/<minor>-scorecard.md`). There is no new meeting
  and no new thread, and each row is at most three lines. Org Design's roster section is the input for it, not a second
  table.
- **Graded at the next review:** whether each cut's work was covered afterwards (no dropped commitments), and whether a
  kept role met its evidence the following minor.

### Project instructions redraft

_From the owner, project chat 2026-10-20 6:42 PM ET: "Can Gale update this on his own during his review moving forward?"_

- **Project instructions:** at each kaizen review, redraft the project instructions in
  `docs/kaizen/project-instructions.md` against what changed in the minor; the outside reviewer per the triage rule
  reviews the change (`PROCESS REVIEW project-instructions OK`), and it's a consultant for any draft that touches the
  Review Broker or the review system. Only after that OK, send the full text to the coordinator, who applies it in project
  settings. A change never loosens the owner-held limits.

### KZ-04

_From #114 "Kaizen (owner, 2026-10-17 5:59 AM ET)", the last sentence of the "Who" bullet._

- The last step of every planner and health-check run that did real work, and any session that sees a better way, only adds a #222 row as `proposed` (C8).

### KZ-06

_From #114 "Kaizen (owner, 2026-10-17 5:59 AM ET)"._

- **Workflow files** (.github/workflows/) can't be pushed by bots: write the exact change in the row as `needs pipeline thread` and send it to Build Pipeline (Gus) (C12).
