# Roadmap

**Vision (owner, 2026-10-20 5:42 PM ET):** "the ultimate end goal is just open the app, follow the next up and it's always
the best thing you could be doing for your character. always. from 1-45 and beyond. This is Daeva Companion. be
inspired." Every item is judged against it, and it is the acceptance bar for the endgame guide (0.10) and the
microscope pass (0.11).

**1.0.0 = all eight classes, Asmodian only, Lv 1–45, and the endgame guide past Lv 45.** Every class meets the bar the Assassin guide sets today:
verified data only (see CLAUDE.md), Next up always correct, saved progress never broken. Elyos is after 1.0.

**How we work by 1.0 (owner, 2026-10-20 2:43 PM ET):** the owner can just say "add x feature" and the workflow is tuned
well enough that they don't have to tinker: it operates like a real development company. Each release kaizen review
measures against this (DECISIONS 2026-10-20).

Classes (per [Metabot](https://metabot.gg/en/aion-2/classes)): Gladiator, Templar, Assassin, Ranger, Sorcerer,
Spiritmaster, Cleric, Chanter.

**Direction (owner, 2026-10-16):** Daeva Companion is an engine that AION 2 happens to be the first game for. The engine
knows no game; AION 2 is a game pack, each class a content pack, each feature a module. Modules are what make parallel
work real: two items run at the same time only when they touch different modules. The audit behind this plan, with
evidence: [Daeva Companion: audit and plan to 1.0](https://claude.ai/code/artifact/37732d7b-6100-47ba-b191-fb3fe9d69f96)
(repo copy for sessions that can't open it: [docs/audits/2026-10-16-audit-and-plan-to-1.0.md](docs/audits/2026-10-16-audit-and-plan-to-1.0.md)).

## Versioning

[Semantic versioning](https://semver.org/); 0.x is beta. Each part is its own counter (0.9 → 0.10 → 0.11), so there is
no running out before 1.0: 1.0 ships when its scope is done.

**Until 1.0 (owner, 2026-10-20 5:13 and 5:15 PM ET; DECISIONS "Standing OK until 1.0"):** the team plans, builds and ships
every minor and patch without a separate owner go, each release on the Release Planner's GO. When the team judges a
release ready for 1.0, the owner tests that candidate personally (on staging once it exists) and types go or no-go. A
no-go relabels it as the next minor (for example 0.11) and another cycle runs. Still brought to the owner: product calls
the team can't settle after an outside review, hard blockers, and what only the owner's hands can do.
**The owner steps away (2026-10-20 5:24 PM ET):** the coordinator runs the project day to day; looks are Design Lead's after
a fresh or outside review; the owner is asked about direction only when the team is genuinely unsure and only after an
outside reviewer has looked, naming who reviewed it and what they said. Company structure, workflow and process are the
team's too (5:25 PM ET): "it all needs to be just as good or better than a real dev company. and you make that happen
completely on your own."

- **Minor (0.X.0)**: a theme, i.e. one or more related objectives. New ideas join a theme that fits before they start a
  new one.
- **Patch (0.X.Y)**: fixes, data corrections, small polish and upkeep. No new features. New looks (what a player
  sees changes) go in the next minor unless the owner says "now" for that item (owner, 2026-10-18 10:40 PM ET, DECISIONS).
- **Releasing**: bump `version` in `package.json` and add a `## X.Y.Z` section to CHANGELOG.md in the same commit. After
  tests and the deploy pass on `main`, CI tags `vX.Y.Z` and publishes the GitHub Release with that section as its notes.
  CI fails early if the version has no CHANGELOG section.

## How a minor is planned (every 0.X.0)

Every minor opens with a planning and audit pass, and it is most of the work: like painting, about 90% prep and 10%
execution (owner, 2026-10-17). It runs on Opus and has two halves that work as a team: step 1 is the **release kaizen
review, the "how"** (is the way we build optimal?), and steps 2–6 are the **plan, the "what"** (which items, in what
order). The "how" goes first because its findings change the rules the plan is made under. The pass that redrew the
plan after 0.3 is the model: it audited the whole path to 1.0 before planning the next minor ([audit and plan to
1.0](docs/audits/2026-10-16-audit-and-plan-to-1.0.md)). Nothing in the minor is queued in #114 until the pass is
written down and reviewed. **Kaizen's review is a hard gate for every minor and major release** (owner, 2026-10-18
6:59 AM ET): nothing in it is planned or queued before Kaizen reports, and Watchdog (Mike) flags a `PLAY DONE` with
no `KAIZEN REVIEW DONE` after 60 min. Patches (0.X.Y) skip the pass, Kaizen included. After a major release (1.0, 2.0
…) Kaizen runs a larger pass over the data of all the minors before it.

1. **Release kaizen review: the "how" (owner, 2026-10-17).** Kaizen (Gale) runs it, over the whole minor just
   shipped, aimed at the workflow itself, not at the product. Kaizen runs after each release (the review that opens
   the next pass), with a weekly fallback (owner, 2026-10-18). Until 0.8 the Release Planner opened the pass by
   sending Kaizen `PLANNING PASS START <minor> <ET time>`; from 0.9 the pass starts only on `KAIZEN REVIEW DONE`
   (below). Raised usage caps don't change the goal: the least waste per item shipped (owner, 2026-10-17 3:00 PM ET).
   **Order after a minor ships (owner, 2026-10-18 11:21 PM ET; wording approved 2026-10-19 12:51 PM ET; this is its
   one statement):** Player Testing (Jesse) plays it and sends `PLAY DONE`, then Kaizen (Gale) sends
   `KAIZEN REVIEW DONE`, then the Release Planner writes the planning pass; each sends Coordinator (Saul) and Tracker
   sync (Huell) a report, and Saul folds them into one morning debrief. Nothing of the next minor builds before the
   owner's typed go. **Tinkering stop (owner, 2026-10-19 5:47 PM ET):** between the draft plan and the go, the owner
   looks the plan over. If nothing needs changing he just types the go. Scope ideas are folded into the plan; rule and
   team ideas queue for Kaizen's next review, unless a scope change needs one now.
   - **Data.** Combine the **stall log (#221)**: stalls and idle minutes by Kind, and the Kinds that came back
     after a fix; the **planner log (#232)**: one row per planning pass and per release (what was queued and
     whether it worked out), plus the usage checkpoints (bot runs by model and outcome against the owner's weekly
     usage %); the **kaizen log (#222)**: which changes helped, which didn't (revert them), which are still
     `trial` or `needs Isaac`; the `Waste:` lines in #114; and the Actions runs (build minutes, kickoff start to
     PR open, PR open to merge, per item).
   - **Audit the workflow.** Lanes (did two builds collide, or did a lane hold work that could have run?); model
     routing (Opus runs that Sonnet would have done, Sonnet runs that handed up or were redone); redone runs and their
     causes (review CHANGES, fix rounds, merge runs, restarts, Blocked); idle time on the critical path; handoffs
     between the planner, the health check, kaizen, Tracker sync and the workflows (who noticed late, who waited on
     whom); and owner waits (To-dos, typed OKs).
   - **Scorecard.** Write `docs/kaizen/<minor>-scorecard.md`: items shipped; bot runs by model and outcome; redone runs
     and waste %; stalls and idle minutes by Kind; median build and review-to-merge times; owner-wait hours; weekly
     usage % per item shipped. Each row is set beside the previous minor's scorecard with the change marked better or
     worse. The first scorecard (0.5) takes 0.4's numbers from #221 and the `Waste:` lines where they exist and marks
     the rest "no baseline".
   - **Rules audit, and when the review is done (owner, 2026-10-19 10:17 AM and 1:49 PM ET, Kaizen thread).** The
     review grades every active rule and decision against the minor's data (keep / tighten / loosen / merge /
     retire, each with evidence) and reports the rule count and any conflicts. From 0.9 the release kaizen review
     is complete only when that graded audit is written and reviewed, and its rule and ledger changes are merged
     or handed to their owners. Kaizen (Gale) then sends `KAIZEN REVIEW DONE <minor>` naming the audit file. The
     Release Planner starts no planning pass, writes no plan and queues nothing for the minor before that message.
     0.8 is not redone.
   - **Inputs are logged live; Kaizen aggregates (owner, 2026-10-19 2:57 PM ET, Kaizen thread).** Each review input is
     logged as it happens by its owner: stalls, incidents, owner waits and the per-release error report by Watchdog
     (Mike), the only writer of #221 since Incident Log (Hank) folded into it (owner, 2026-10-19 4:56 PM ET); plan,
     execution and usage by the Release Planner in #232; waste, CI health and each build's model and outcome by
     Build Pipeline (Gus) in #114's Waste section; player findings by Jesse; game data by Game Data Check
     (Gretchen); rules, decisions, drift and roster by Rules Steward (Francesca). After `RELEASE SHIPPED` each owner sends
     Kaizen `REPORT READY <minor>`, and the review starts when the last one arrives. Anything Kaizen has to look up
     after the fact is a gap, assigned to an owner at that review.
   - **Kaizen's own rules are graded by someone else (owner, 2026-10-19 4:56 PM ET, Kaizen thread).** From 0.9, at
     each minor review, Rules Steward (Francesca) grades Kaizen's own rules (KZ-*, PLN-02/03/04, CLK-04), checks
     that the scorecard compares like with like, and reports to Coordinator (Saul)'s debrief, not to Kaizen; Kaizen
     grades Q-14 (the ledger as each rule's one home), which Rules Steward owns (owner, 4:57 PM ET), so no one
     grades their own rule.
     Kaizen's reading, which the Release Planner applies: the review is complete, and `KAIZEN REVIEW DONE` can be
     sent, only once that grading is in the debrief. A full team audit runs only at a major release or when two or
     more standing threads are added or removed.
   - **Changes.** Each cause that repeated, and each metric that got worse, becomes one concrete process change: a
     #222 row, put in place before the minor's first item is queued (a #114 rule, a planner-instruction change, or
     a workflow PR). Stall limits, the build cap and model routing in #114 are only
     re-derived from this minor's build times and usage where a build hit a limit (a stall limit, the cap, or a
     model routing stop); everything else carries over unchanged (rules audit PIP-10, loosened in the 0.8 kaizen
     review). The plan in steps 2–6 is made under these changes and cites the scorecard where it relies on it.
2. **Audit the whole path to 1.0, then this minor.** First re-read the plan from this minor to 1.0 against the code
   and what the look-back found: is any later minor stale, in the wrong order, too big, or blocked on something
   nobody has started (research, owner input, hosting)? Change the later minors here, in this pass, before planning
   this one. Then audit this minor's section the same way. Read the budget trend and write it into this minor's
   section with all its rows: site page bytes and gzip -9 (`npm run build`), elements at 390 px fresh (blocking) and at
   1500 px, Advanced, Lv 39 (logged; both printed by `tests/site.js`), and the `update()` median (`npm run test:perf`, run
   alone); `node scripts/build.mjs --sizes` says which tables and modules hold the gzip bytes. Schedule a performance item only when a budget is within 20% of its limit. Before 1.0 and before
   any store app, this step is a full architecture and performance audit.
3. **Shape each item:** problem; appetite (S < 100 changed lines, M 100–300, L 300–1,000; bigger = split it); no-gos
   (what it will not do); the module(s) and files it owns (every acceptance line needs an owning file); the test that
   proves it done; builder model (routing rule in #114, as step 1 left it); its stall limit from step 1's build times. An item with an
   unknown is a research item first, not a build. **Live dependencies** (Kaizen, 2026-10-19): anything the item needs
   that isn't on the live site yet (a server, a feature of another item). Such an item ships hidden behind a flag until
   the dependency is live, and the reviewer checks the flag (0.7's sync line showed for ~5 h with no server).
   **Fresh review (owner, 2026-10-20 4:39 PM ET; Kaizen K24):** the planner tags an item `fresh-review` when it is a new
   look, layout or colour meaning, a change to an owner-approved look, a pipeline, merge-gate or workflow change, a save
   or storage key change, or a release PR, plus one full design pass per minor (the Design Critic run in step 5, briefed by
   Design Review). The standing Design Review and Code Review
   threads may add a tag, never remove one, and brief a reviewer with no history on the work from a fixed template (the
   checklist, the work and its acceptance line, and its baseline once K26 is in; nothing from the author); findings go to the work's owner, and a
   disagreement between reviewers goes to the owner in the morning debrief. Watchdog (Mike) flags a merged tagged item
   with no fresh-review note (`review-skipped`). Once per minor a no-history thread re-checks 10 data fields Game Data
   Check fixed or passed.

   **Review level (owner, 2026-10-20 6:45 PM ET; defaults from Org Design's trigger list; approved by Fresh governance
   review, 2026-10-20 7:02 PM ET):** every review is triaged `standing`, `blind` or `external`. The defaults list below sets each item's
   level, and that call isn't left to anyone's judgement. Anyone may raise a level. Only the coordinator may lower
   triggers 1, 3 and 4 below their default, logged in the PR with a reason and counted at each kaizen review. The team
   never lowers triggers 2, 5, 4b or 6, and only Isaac can narrow 4b and 6. Trigger 2 is the roster, where the
   coordinator is the decider. Trigger 5 is the conflict check, and the coordinator picks the reviewer. Triggers 4b and 6 are K24, so lowering them narrows an owner decision,
   and that goes to Isaac.

   | # | Default trigger | Level |
   |---|---|---|
   | 1 | A change to a rule, a process, a review criterion or a gate: pipeline.yml review steps, verdict parsing, merge and kickoff gates, model routing, the review criteria and the fresh-review briefs, and this rule itself | external |
   | 2 | A hire, merge, retire or re-scope of a standing role. Org Design brings the evidence, the coordinator decides, and the reviewer checks both the need and the charter | external |
   | 3 | Privacy, legal or ToS text | external |
   | 4 | Removing or hiding anything Isaac sees in the app or the tracker | blind |
   | 4b | An owner-facing new look, layout or colour meaning, or a change to an owner-approved look (K24's tag, Isaac 4:39 PM ET) | blind |
   | 5 | A review where the usual reviewer helped draft, propose or brief the work, commented on it, or owns the rules the work changes | blind (external if 1–3 also match) |
   | 6 | Save or storage key changes, and every release PR (K24, unchanged) | blind |
   | – | Anything else | standing |

   - **Reviewers:**
     - *External* is an outside reviewer with no history on the change: Team Audit, or a consultant whenever Team Audit
       drafted it, commented on it or is its subject.
     - *Blind* is a no-history reviewer working from the fixed brief, without the author's reasoning.
     - *Standing* for code is the pipeline's per-PR review (MRG-04, criteria owned by Code Review), plus Code Review by
       hand only on tagged or requested PRs. For design, standing is Design Review.
   - **Conflicts come from the record, not self-declaration:** before picking the reviewer, the coordinator checks git
     authorship, Ledger co-authors, comments and past reviews (trigger 5).
   - **Set at plan time and checked by path:**
     - From 0.10 each spec carries the bullet `- **Review:** standing | blind | external — <trigger # or reason>.` next
       to Lanes. Walter sets it at plan time. Kickoff ignores it, and the `fresh-review` label is derived from it. 0.9's
       existing fresh-review labels count as blind, so no issue is rewritten.
     - An unplanned PR is triaged by the same list when it opens.
     - Triggers 1 and 6 are also detected from changed paths: Build Pipeline keeps `review-triggers.json`, Code Review
       owns its trigger-1 and trigger-6 entries, and kickoff's drift comment (K20) flags a PR whose paths need a higher
       level than its `review:` line. This also catches scope growth.
   - **Marker and hold:**
     - Blind and external items open with `hold`.
     - The review note's first line is `FRESH REVIEW #<n> <sha7>`, as in the merged brief template (#603); this is what
       Watchdog's `review-skipped` check reads.
     - A separate last line, `FRESH REVIEW OK <sha7>`, on the head SHA clears hold. The line never contains a CHANGES word.
     - Only Build Pipeline's automation removes `hold`. Until that ships, the Release Planner does. The post-#615
       convention of the reviewer removing it ends.
     - Watchdog flags a held PR 60 min after its review started with no marker, and logs any merge that matched a trigger
       without one.
   - **Fast path and batching:**
     - Incident fast path: the coordinator declares and logs the incident, the change is adopted at once, and it is
       reviewed the same day (docs/DECISIONS.md 2026-10-20, "Process changes are decided by the team after an outside
       review", step 6).
     - Trigger-1 changes are reviewed in a batch at each kaizen review, except recurrences and incidents (the 5:30 PM ET
       procedure's step 3), so external reviews stay inside the usage budget.
   - **Who adopts:** the reviewer gives the verdict, and the change's owner decides whether to adopt it (the coordinator
     for roster changes).
   - **Known limit, not a control:** every comment posts under one account, so a marker's author rests on trust and is
     visible in the thread.
   - **Graded at each kaizen review:**
     - merges that matched a trigger without a marker (target 0);
     - lowerings below default, with their reasons;
     - findings and runs per level, as cost per major finding;
     - external runs from trigger 1 against the majors they found;
     - triggers that fired too often or never;
     - whether blind runs on new looks (4b) found majors that standing review missed. If two minors find none, propose
       narrowing 4b to Isaac, since K24 is his decision.

4. **Waves and lanes for the whole minor.** Lay every item out in waves before anything is queued: items in the same
   module or serial file run one after another; items in different modules may run at the same time, at most three
   builds (the cap in kickoff.yml; 3 under the owner's usage budget since 2026-10-20, five before). Name the critical path, put the items that unblock the most first, and give each item an `After:` line so
   kickoff can queue it the moment its dependencies merge. An item whose owner OK isn't typed when the plan merges is off
   the critical path: route the path through ungated items and put gated ones last (Kaizen, 2026-10-19; 0.7's path
   ran through P2, which waited 747 min for its OK). An After line lists only real dependencies (code, data, research or owner gates); lane order lives in the wave plan, never in After (Kaizen, 2026-10-18: lane-order keys idled P14 and P18). Owner gates use the `owner-ok-<slug>` form kickoff reads from DECISIONS. From 0.7 on, the token carries its version, `owner-ok-<minor>-<slug>` (a patch item uses the patch version), and the copy box for the owner's typed OK names the same token. Kickoff treats an unversioned or wrong-version owner-ok key as not understood, so it fails closed (Kaizen K12, 2026-10-18: 0.7 P6 was queued on the 0.5 `owner-ok-S2` row). Check every wave for two items that touch the same file:
   that is where bots step on each other's toes, so split the file's owner or move one item. Shared files
   (`docs/team/DISPATCH.md` "Serial files") count as one module. Item keys (`<minor> P<n>` / `S<n>`), After tokens
   and lanes follow kickoff's grammar (`tests/kickoff.mjs` fixtures); the plan reviewer checks every one before
   approving (Kaizen, 2026-10-19).
5. **Owner input.** List what needs the owner (in-game checks, mockups, money, legal). Only a true blocker becomes a
   tracker To-do; everything else follows the recommendation. The thread that needs the decision opens its own
   To-do through Tracker sync (Huell): one owner and one owner's OK per card, listing what waits on it; it tells every
   thread the decision affects when it opens and when it is answered (owner, 2026-10-19 2:20 PM ET; trial through
   0.8). Every decision is recorded on the tracker as **user remediated** (the owner chose) or **Claude
   remediated** (the recommendation applied under a standing approval), so the owner can see which calls were whose.
   **Design Critic (owner, 2026-10-19 6:02 PM ET):** for every minor with visible changes, and for Design Lead's 1.0
   design review, Coordinator (Saul) starts a one-off Design Critic thread that took no part in the design. Before the
   owner sees Design Lead (Jane)'s mockups, it reviews them against `docs/design/review-checklist.md` (its "looks
   AI-made" section included), briefed by Design Review (Holly) from the fixed template, and sends its findings to Jane and to the morning debrief. Jane answers each finding in writing;
   the final look OK is Design Lead's after that review (owner, 2026-10-20 5:24 PM ET).
   **Owner asks (Kaizen K23, owner 2026-10-20 4:39 PM ET; replaces K15's morning batch, which replaced K10):** the
   planning pass lists every product OK the minor needs, each with its recommendation, the exact words to type and the
   thread to type them in, and asks them together with the build go and the draft plan. That includes the minor's
   standing ship OK, one per minor covering the .0 and every patch, which covers a release once the Release Planner's GO
   is in (rules audit COM-03, K19). Each release's OK list also carries one line asking the owner's weekly usage %, and
   the Release Planner records the number in that release's #232 row (owner, 2026-10-19 12:51 PM ET). **Process asks
   (rule, team and permission changes) no longer go to the owner (owner, 2026-10-20 5:24 and 5:25 PM ET; retires K23's
   box):** the team decides them after an outside review, Kaizen (Gale) drafts the procedure, and the Release Planner
   writes the DECISIONS row and every ledger row and home a decision names in one PR, with each rule's owner as a
   reviewer. The owner is asked only when the team stays genuinely unsure after that review. Product calls and HARD BLOCKERs still go when needed: a question that first
   comes up mid-minor and gates an item already queued or building goes out at once as a HARD BLOCKER. Ungated items are queued first,
   and a gated item without its typed OK goes to the end of the queue; it never holds a lane or the critical path.
   Research gates start at pass start (kept from K10).
6. **Write and review.** The plan goes into this file and the #114 queue in one PR, written by one session and
   reviewed by a separate one that didn't write it. Then the planner queues the items, top of the lane map first.

**Usage budget (owner, 2026-10-20 5:17 and 5:20 PM ET; DECISIONS "Usage budget"):** the owner's weekly usage limit must
last to each Tuesday 3 AM reset. 22% at 5:17 PM ET on 2026-10-20 is the baseline, and the line is the week's budget
spread evenly to the reset, recomputed at each reading (about 12% a day for the week from 22%; about 14% a day for a full week from a fresh reset). Readings come once per minor release (the release's owner list asks for
Settings → Usage, and the Release Planner logs it in #232), so pace is kept by design: Kaizen (Gale) and Build Pipeline
(Gus) set builds in flight, polling and health-check intervals and the throttle order. A reading over the line throttles
work first, and the owner is told what was paused.

**Release gate (owner, 2026-10-18 6:24 AM ET), for every release, patches included.** When every item of a release has
merged, the Release Planner writes the release's CHANGELOG section into the release issue (Kaizen K17, 2026-10-19:
the release build copies it verbatim, and Gretchen's check reads that text against ISSUES.md and the live build, and
checks that every promise in it exists in the build: Kaizen, 2026-10-19 6:11 PM ET, team-audit rec 6), then
sends Game Data Check (Gretchen) `PRE-RELEASE CHECK <version>` and tells Build Pipeline (Gus)
`DATA OK <version>` only after she answers `DATA OK`; Gus queues and ships the release item only then. A `DATA HOLD`
means the named data is fixed first. Watchdog (Mike) flags a check unanswered after 60 min. If data lands on main
after her check, she re-runs it before the tag. **Release-candidate play (owner, 2026-10-19 4:56 PM ET), for every
minor from 0.8.0:** with `PRE-RELEASE CHECK` the Release Planner sends Player Testing (Jesse) `RC READY <minor> <sha>`
(main's head once every item has merged); Jesse plays main built locally at that commit and answers
`RC PLAY DONE <minor>` with an issue link. The Release Planner reads that report before telling Gus `DATA OK`. **The
release starts on one GO (owner, 2026-10-20 4:39 PM ET; Kaizen K19):** the Release Planner posts `GO <version>` only after
`DATA OK` and `RC PLAY DONE` name the same build (build.json; a patch has no RC play, so after `DATA OK`), and Gus starts the
release item on GO and nothing else; the owner's standing ship OK covers a release once GO is in. The
live play after release and the per-patch delta check stay.
**Release manager and merge freeze (owner, 2026-10-20 1:35 PM ET), from 0.8.0:** the Release Planner owns every release
from `RC READY` (a patch: from `PRE-RELEASE CHECK`) until the live site shows the new version, and checks that every step
finishes. For a minor, from `RC READY` until CI's tag, Gus merges only PRs whose files are all `docs/**`, `ROADMAP.md` or
`.github/ISSUE_TEMPLATE/**`, plus the release PR, and none at all until the release candidate's deploy and smoke check
have finished (K19). A blocker fix named by `RC PLAY DONE` or `DATA HOLD` may merge, and then
the release candidate restarts at the new head (DECISIONS 2026-10-20).

## How an objective is worked

1. **Problem**: what's wrong or missing, in a sentence or two.
2. **Acceptance**: how we know it's done, as a test where possible.
3. **UX pass**: what the user sees and does, sketched and reviewed *before* building. Visual polish comes after the
   feature works. New UI reuses the existing card patterns (uniform milestone / Next up / Skills / Stigmas cards).
4. **Build → test → release.**
5. **Play with it** in game; what you notice feeds the next objective.

## Released

- **0.1.0** — repository, standalone site (aion2.ishkabytes.com), offline/PWA, CI. App identical to artifact v291.
- **0.1.1** — CI upkeep, automatic tags and GitHub Releases, this roadmap.
- **0.1.2** — licensing (PolyForm Strict code, original content reserved) and unofficial-guide wording.
- **0.1.3** — Ascension hotfix: story gates for "The One Who Dreams" and the Lv 45 Hero/Ascension step, story steps
  already passed no longer offered, text fixes, `gates` suite and golden master.
- **0.1.4** — version in the footer, *Report a problem* link with prefilled issue form, issue forms and labels.
- **0.1.5** — persistent storage request, save-failure warning, self-hosted fonts.
- **0.1.6** — accessibility fixes with no visible change (screen-reader names, focus, reduced motion, touch), `a11y` suite.
- **0.1.7** — rebrand to Daeva Companion (name, mark, icons; palette unchanged).
- **0.1.8** — new address: daevacompanion.com.
- **0.1.9** — touch, contrast and page-zoom fixes (visible accessibility batch from the mobile audit).
- **0.2.0** — Foundations: pure core, data format v2 with JSON Schemas and a Node generator, owner-verified unlocks and
  Metabot locations, aion2.th.gl withdrawn, per-item change times and `merge()` in the save.
- **0.2.1** — a fresh browser starts at Lv 1 on the first story quest instead of Lv 5 with no quest.
- **0.2.2** — Daevanion up arrow starts at 1, rotation pop-out lists only unlocked skills, missing skill icons.
- **0.2.3** — story-quest zones for 34 more quest sides (Metabot), stigma unlock cost check.
- **0.2.4** — Active / Passive skill labels, specialty slots, villages as zones, clearer lock text (most of the 0.3
  engine steps went live here).
- **0.2.5** — backup line, 14-day backup reminder, iPhone home-screen tip.
- **0.2.6** — phone layout fixes, Route rules card moved, one gate evaluation per update.
- **0.3.0** — Next up correctness: one requirement check per card, completion derived from the story, blocker
  chains, the story's last quest (Lv 45).
- **0.4.0** — Engine and packs: the engine holds no AION 2 term, AION 2 is a game pack, save v5 shaped for several
  characters (saves reset once), blocking page budgets.
- **0.5.0** — Smart Next up, travel help, the phone layout and a character switcher.
- **0.6.0** — New players and the first new class: the Ranger, a welcome, cards on unlock.
- **0.6.1** — fixes from 0.6.0 testing: objective count, phone toast, headings, Ranger icons; sync line hidden.
- **0.7.0** — the Gladiator and the Spiritmaster, clearer Next up cards, map markers, sync server and screens (not
  switched on); 0.6.2's items folded in.

## Plan (redrawn 2026-10-16)

Redrawn after the engine audit, with the owner's go-ahead to re-plan the path to 1.0. Before: eleven minors after 0.3
(0.4–0.14), one class per release, the class framework late. After: six minors (0.4–0.9), the engine split first, then
three lanes per minor. The minor numbers below replace the ones in older decisions, reports, specs and DISPATCH; read an
old "0.4 Smart Next up" as 0.5 here, an old "0.5 characters" as 0.4 (save shape) plus 0.6 (picker).

**Decided (owner, 2026-10-16, 4:30 PM ET):** the Engine split comes right after 0.3.0. Engine code carries no AION 2 or
Assassin reference; all game data lives outside the engine, in packs. 0.3.0 ships first and nothing here competes with
it (owner, 4:34 PM ET); 0.3.0 went live 2026-10-16, 5:11 PM ET.

**Risk, called out:** two classes per minor assumes a tester (the owner or another player) can do each class's in-game
spot check. If only one class can be checked per minor, 0.7–0.9 become one class each and 1.0 moves out by three
minors. Research packs for every class start early (below) so data is never the bottleneck.

### 0.3.x — patches while 0.4 is planned (0.3.0 released 2026-10-16)

- Bug #105: `fitRail()` race at load (Basic rail width differs between loads). Planned as 0.5 P1.
- #136: the 0.3.0 CHANGELOG's Lv 45 quest name and its saved-progress note (docs/reviews/0.3-lookback.md). Done in
  #163.
- Data corrections from issues; owner checks as they arrive (C41 Koro at Lv 45; the Home Screen storage check).

### 0.4 — Engine and packs (invisible; released 2026-10-17)

Look back: [docs/reviews/0.4-lookback.md](docs/reviews/0.4-lookback.md).

Goal: the engine holds no AION 2 term, the Assassin guide shows the same in the golden master, and a second game
could be added as a pack. One clean save break (CLAUDE.md pre-1.0 rule), so the save is shaped for several characters
once and no migration is carried.

Planning pass written 2026-10-16 (#135): look back in [docs/reviews/0.3-lookback.md](docs/reviews/0.3-lookback.md),
one spec per item in [docs/plans/0.4/](docs/plans/0.4/) (the issue body the planner creates, verbatim), audit evidence
in [docs/audits/2026-10-16-audit-and-plan-to-1.0.md](docs/audits/2026-10-16-audit-and-plan-to-1.0.md) (the repo copy
of the audit, PR #137).

**Process rule from the look back (0.4 on):** an issue's *Acceptance* list is the review checklist. The reviewer
answers every line with pass / fail and its evidence; one missing line is `VERDICT: CHANGES`.

#### Audit (step 2), against `main` at `acf4c8e`

Stale, cut-able or in the wrong order in the plan as #134 drew it:

1. **P2's named gates are stale.** "Lest We Forget" and the Daevanion gate are data since E5 (#78). What is still
   AION 2 in `src/core/requirements.js` is the five `KEPT_RULES` (lines 19–29) and the record ids in the
   `GATE_CHANGES` switches (71–80, 107, 116). The other hard-coded spots moved a little: `catalog.js:52-57` (two
   milestones), `build.js:15,17,44,45` (costs, slot levels, node minimum). The values themselves are already data
   (`rule:skill-point-cost`, `rule:stigma-shard-cost`, `rule:specialty-slots`, `rule:node-costs`); only the code copies
   are left. The one-player seed in `migrations.js:30` goes with the save break (P3c), not P2.
2. **P2 has an unknown.** Nothing says where pack *code* lives (AION 2 card templates, Next up producers, the kept rules
   can't be data) or how the engine calls it. That's a design question, so it becomes **P0**, a docs item, first.
3. **P2 is over 1,000 lines as one item.** About half of `src/core/` names AION 2 (requirements 106 of 442 lines,
   nextup 59 of 158, catalog 37 of 118). Split: P2a (code copies of data rules), P2b (pack code out of the core),
   P2c (Next up producers).
4. **P3 is over 1,000 lines as one item.** The v4 key is written in 43 files, 32 of them under `tests/`. The `e1`, `mig1`, `mig2`,
   `regress` and `journey` fixtures are v4-shaped saves. Split: P3a (tests write saves through one helper), P3b
   (storage adapter, no save change), P3c (save v5).
5. **P3 misses one case:** a pre-0.4 *export file* has the v4 shape. Import must refuse it with a message, never read it.
6. **"`src/main.js` holds no AION 2 term" doesn't need twelve card PRs.** The AION 2 cards (Skills, Stigmas, Daevanion,
   Cube, areas, rotation) are the game pack's own cards: P4 moves them into the pack unchanged. Only the engine's cards
   (Next up, milestones and Route rules, Journey, Sources and Confidence) are made neutral, so **P5 shrinks to four
   items**. A pack card is rewritten when a later feature touches it, not as a batch now.
7. **P7's per-pack loading is in the wrong minor.** With one class there's nothing to leave out. It moves to 0.6 lane B,
   before the Gladiator pack lands. The blocking budgets stay in 0.4.
8. **The done check needs an owner:** **P8** adds the term scan that proves "no AION 2 term" (P6 proves the fake game).
9. **"Byte-identical golden" can't hold through P3c.** The snapshots record the stored save, and its shape changes
   once, on purpose. What must not change, in every 0.4 item, is Next up, milestones, Journey and the Dungeons card.
10. **The kickoff lanes have no `core` lane.** Two `src/core/` items would start together, so each item below names the
    files it owns (review note 1 on #134).
11. **No input for the player name exists.** The save label is `<playername>-<class>-lvl<level>` (owner); until 0.5 lane
    C adds the name, the label leaves the name part out.

**Budget trend** (`npm run build`; elements at 390 px in a fresh browser; `tests/perf.js`, 45 states):

| | 0.2.0 | 0.2.3 | 0.2.5 | 0.2.6 / 0.3.0 | Limit | Use |
|---|---|---|---|---|---|---|
| `dist/index.html` | 498,891 B | 507,536 B | 665,735 B | 669,290 B (153,871 gz) | none yet (P7) | — |
| Page elements | — | 4,658 | — | 4,741 | none yet (P7) | — |
| `update()` median / worst | — | — | — | 6.8 / 8.5 ms | 15 ms, advisory | 57% |
| Inlined fonts (artifact) | — | — | — | 126.2 KB | 150 KB, blocking | **84%** |

The fonts are the only budget within 20% of a limit. They don't grow with packs or features, and no 0.4 item adds a
font, so there's no performance item. A new font needs the cap raised in the same PR, with a reason. `update()` time is
at 57% of its limit. The page grew 34% in 0.2 (0.2.4 villages and 0.2.5); P7 sets the first byte and element limits.

#### Items (step 3)

Appetite counts hand-written changed lines: a verbatim move counts once, deleted files and regenerated
fixtures or snapshots don't count. Models follow the routing rule in #114. The full spec of each item, with its
acceptance tests, is its plan file.

| Item | Problem → result | Size | Owns (files) | Model | Lanes |
|---|---|---|---|---|---|
| [P0](docs/plans/0.4/P0-engine-contract.md) | No written contract for packs → design doc: code layout, pack hooks, card registry interface, AION 2 term list | M (docs) | `docs/design/0.4-engine-contract.md` | Opus | none |
| [P1](docs/plans/0.4/P1-pack-folders.md) | Data has no pack boundaries → `data/packs/…` with manifests; the generator builds a pack chain; compiled output byte-identical | M | `data/**` (moves), `data/schema/pack.schema.json`, `tools/gen/`, `tests/schema.mjs`, `tests/support/oracle.mjs` paths | Opus | gen, gates |
| [P2a](docs/plans/0.4/P2a-rules-from-data.md) | Code copies of data rules → costs and slot levels read from `rule:*`; two milestones into the guide data | S–M | `src/data/build.js`, `src/core/catalog.js`, the pack's `guide/milestones.json`, `tools/gen/` | Opus | gen, gates |
| [P2b](docs/plans/0.4/P2b-pack-code.md) | AION 2 code inside the engine → moved to `src/packs/aion2/` behind P0's hooks | L | `src/core/{catalog,requirements,ascension,blockers,migrations,evaluator}.js`, `src/data/*.js`, `src/packs/aion2/**`, `src/main.js` imports, module paths in `scripts/`, `tests/core/` | Opus | main.js |
| [P2c](docs/plans/0.4/P2c-nextup-producers.md) | Next up ranks AION 2 kinds in the engine → engine ranks, pack produces cards | M | `src/core/nextup.js`, `src/packs/aion2/nextup.js`, `tests/core/nextup*` | Opus | none |
| [P3a](docs/plans/0.4/P3a-test-save-helper.md) | Save key and v4 shape spread over 32 test files, old fixtures fed through the migrations → one helper writes and reads every test save; migrated flat fixtures | M | `tests/**` except snapshots, baselines and existing fixtures | Opus | golden, mig |
| [P3b](docs/plans/0.4/P3b-storage-adapter.md) | `localStorage` called from the page → storage adapter; same key, same bytes | S–M | `src/core/storage.js`, `src/shell/storage-web.js`, `src/main.js` save area, `src/site.js` | Opus | main.js |
| [P3c](docs/plans/0.4/P3c-save-v5.md) | Save shaped for one Assassin → save v5: neutral key, character slots, clean break | L | `src/core/{state,migrations,sync,backup}.js`, `src/data/migrations.js` (deleted), `src/main.js` save area, save tests, golden snapshots, `PRIVACY.md`, `docs/ARCHITECTURE.md` §1 | Opus | main.js, mig, golden |
| [P4a](docs/plans/0.4/P4a-card-registry.md) | Every card hard-wired in the page script → registry; first two cards mounted through it | M | `src/core/cards.js`, `src/main.js`, `src/index.html`, `src/cards/sources.js`, `tests/support/dom-snapshot.mjs` | Opus | main.js |
| [P4b](docs/plans/0.4/P4b-pack-cards.md) | AION 2 cards in the page script → moved verbatim to `src/packs/aion2/cards/` | L | `src/main.js`, `src/index.html`, `src/packs/aion2/cards/**` | Opus | main.js |
| [P4c](docs/plans/0.4/P4c-engine-cards.md) | Engine cards in the page script → moved verbatim to `src/cards/`; `main.js` is the shell | L | `src/main.js`, `src/index.html`, `src/cards/**` | Opus | main.js |
| [P4d](docs/plans/0.4/P4d-card-styles.md) | All card styles in one `app.css` → one stylesheet per card, verbatim, proven by a computed-style snapshot (owner idea, added 2026-10-16) | L | `src/styles/**`, `src/index.html` links | Opus | app.css |
| [P4e](docs/plans/0.4/P4e-card-golden.md) | Golden shards hold every card together → snapshots stored per card, `--record --card` (owner idea, added 2026-10-16) | M | `tests/golden.js`, `tests/golden/snapshots/**` | Opus | golden |
| [P5a](docs/plans/0.4/P5a-nextup-card.md) | Next up and Later cards neutral | M | `src/cards/nextup.js`, `src/cards/ahead.js`, pack renderers | Opus | none |
| [P5b](docs/plans/0.4/P5b-milestone-cards.md) | Milestone and Route rules cards neutral | M | `src/cards/milestones.js`, `src/cards/route.js`, pack row renderers | Opus | none |
| [P5c](docs/plans/0.4/P5c-journey-card.md) | Journey card neutral (Ascension bar becomes a pack section) | M | `src/cards/journey.js`, `src/packs/aion2/cards/ascension.js` | Opus | none |
| [P5d](docs/plans/0.4/P5d-sources-cards.md) | Sources, Confidence and Undo cards neutral | S | `src/cards/sources.js`, `src/cards/undo.js` | Sonnet | none |
| [P6](docs/plans/0.4/P6-fake-pack.md) | Nothing proves the engine is game-neutral → a fake game pack + conformance suite in Node | M | `tests/fixtures/packs/fakegame/`, `tests/conformance.mjs`, `tests/run.mjs` | Opus | none |
| [P7](docs/plans/0.4/P7-budgets.md) | Nothing stops the page growing → blocking byte and element budgets | S | `scripts/build.mjs`, `tests/site.js` | Sonnet | none |
| [P8](docs/plans/0.4/P8-done-check.md) | "No AION 2 term" is a claim, not a test → term scan over engine, engine cards and shell | S | `tests/core/purity.test.mjs` | Sonnet | none |
| [S0](docs/plans/0.4/S0-sync-design.md) | Sync needs a design and an owner hosting decision before 0.6 → design doc (old Y0) | M (docs) | `docs/design/sync.md` | Opus | none |
| [R](docs/plans/0.4/R-release-0.4.0.md) | Release 0.4.0 (CHANGELOG: saves reset) | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | release, alone |

No-gos for the whole minor: no visible change except the save reset (no new UI, no new text on screen, no restyle);
no new game data; no `.github/workflows/` edits (bots can't push them); no change to the artifact rules (one file,
`/_blob/` icons, no service worker).

#### Lane map (step 4)

At most three builds at a time (five since 2026-10-17, PR #233). Kickoff checks lanes, not order, so **the planner queues an item only once everything
in its "After" has merged**.

| Wave | Builds | After |
|---|---|---|
| 1 | P1 (gen, gates) ∥ P3a (golden, mig) ∥ P3b (main.js) | — |
| 2 | P0 (none) ∥ P2a (gen, gates) ∥ P7 (none) | P2a: P1 |
| 3 | P3c (main.js, mig, golden) ∥ S0 (none) | P3c: P1, P3a, P3b |
| 4 | P2b (main.js) | P0, P2a, P3c |
| 5 | P2c (none) ∥ P4a (main.js) | P2b |
| 6 | P6 (none) ∥ P4b (main.js) | P6: P2c, P3c · P4b: P4a |
| 7 | P4c (main.js) | P4b |
| 8 | P5a ∥ P5b ∥ P5c, then P5d, P4d (app.css), P4e (golden) as slots free | P4c; P5a also P2c |
| 9 | P8 (none) | P5a–P5d, P6 |
| 10 | R, alone | everything above |

How the review notes on #134 are settled:

1. **P2 and P3 both touch `src/core/`:** split by file. P3b and P3c own `state.js`, `migrations.js`, `sync.js`,
   `backup.js`, the new `storage.js` and the save area of `main.js`; P2a owns `catalog.js` and `src/data/build.js`. The
   two P2 items that move core code (P2b, P2c) run after P3c, in sequence.
2. **P4 owns `src/main.js` until the registry and the moves merge** (P4a → P4b → P4c, one at a time). The P5 card
   items wait for P4c; after it, each card is its own file, so three run at once.
3. **Gladiator follows the P1 pack layout:** see 0.6 lane B.
4. **The audit copy** is `docs/audits/2026-10-16-audit-and-plan-to-1.0.md` (PR #137), linked above and in Direction.
5. **The player name never reaches a server unencrypted.** No-go on P3c: no name or label in a storage key, file name,
   URL, the *Report a problem* link or a log, and the slot id is random, never derived from the name. Requirement on S0:
   the name and label travel only inside the encrypted payload; the server sees opaque ids, sizes and times.

Done when: golden shows no change in Next up, milestones, Journey or the Dungeons card for the Assassin (the stored save
changes once, in P3c); P6's fake game passes conformance; P8's term scan finds no AION 2 term in `src/core/`,
`src/cards/` or `src/main.js`.

#### Owner input (step 5)

Nothing in 0.4 needs an in-game check, a mockup, money or a legal answer, so **no To-do**. For the owner's
information (the recommendation applies unless the owner says otherwise):

- **Your own progress resets at 0.4.0** (decision #2). Export a backup before 0.4.0 if you want a record; 0.4 can't
  import it (P3c refuses old files rather than reading them).
- **Storage key `companion-save-v5`**: neutral, no game or class name.
- **The save label shows no player name until 0.5** (the name field comes with the character switcher).
- **S0 ends in a hosting and cost decision** for the owner; that decision blocks 0.6 lane C, not 0.4.

Alongside 0.4 (docs only, no code, any time): **class research packs** for all seven classes, two at a time, in cloud
research sessions under the fetching rules (old R1). They need the web, so they are not bot items in the #114 queue; the
coordinator starts them. **Sync design** is S0 above.

### 0.5 — Smart Next up and the phone layout

| Lane | What | Module |
|---|---|---|
| A | Smart Next up (old 0.4 N1–N5): travel data, location tie-break, derived Kibelisk binds, fastest / completionist with level bands, travel UI, catch-up ranking | ranking module, Next up card |
| B | Phone layout (audit #81 / PR #87 mockup): Next up near the top, a touch-friendly stack, Build as a bottom sheet | shell layout, styles |
| C | Character switcher and class picker (old 0.5 C2), Assassin the only visible class; the player-name field that completes the save label (0.4 P3c) | header, character module |

Lane A's travel UI and lane B both touch the Next up card's layout: B lands first, A's UI step builds on it.

Planning pass written 2026-10-17 (#191): look back in [docs/reviews/0.4-lookback.md](docs/reviews/0.4-lookback.md), one
spec per item in [docs/plans/0.5/](docs/plans/0.5/) (the issue body the planner creates, verbatim). Item keys are
`P<n>` / `S<n>` so kickoff's After-line queueing (#173) reads them; an After line with a token that isn't a key
(`owner-ok-…`, `research-…`) is left to the planner, who queues the item once that input is recorded.

**Process rule from the look back (0.5 on):** before an item is queued, each acceptance line has a file that makes it
pass, owned by the item or by one on its After line, and no no-go forbids it; a check a later item turns green is run
on `main` at planning time and every hit gets an owner. Each plan file has an "Ownership check" line; the reviewer of
the pass checks it. (0.4: P6 Blocked on the generator, P8 needed a fix round.)

#### Audit (step 2), against `main` at `f1d38e5` (0.4.0)

1. **This file was stale:** the released list ended at 0.3.0; 0.3.x still listed #136 (done in #163) and #105 (now
   P1). Fixed here.
2. **The smart Next up design predates the engine split** ([docs/design/0.4-smart-next-up.md](docs/design/0.4-smart-next-up.md),
   PR #85). Its paths are gone (`src/data/node-place.js`, `nextup.js` tiers and line numbers, `renderNow` in
   `main.js`), and its place layer would put AION 2 terms (Kibelisk, teleport, scroll) in the engine, which the 0.4 P8
   term scan fails. Re-cut: the engine gets the neutral parts (where the player is, the nearest-first comparator,
   tracks, catch-up, the switch table); the AION 2 pack gets Kibelisks, binding, the Bind row and the teleport line
   (its producers and `nowRenderers`). Its tiers are P2c's phases now; location only reorders inside a phase. Design
   steps S1–S8 become P8–P16; S9 (filler XP, F9) stays moved out.
3. **The design's data step needs the web** (Metabot step markers for the story objectives), and a bot build has none
   (DISPATCH checklist 7). Split: P8 builds the Kibelisk registry and rules from the research already in the repo
   (`docs/research/2026-10-kibelisks.md`, `data/research/`); P9 adds the objective points after a cloud research
   session (below, "Alongside").
4. **The phone layout plan** ([docs/design/phone-layout.md](docs/design/phone-layout.md), PR #87): patches A, B and D
   shipped in 0.2.6 (#121, #126); C (195 / 640 px page zoom) is still open, and the CHANGELOG has listed its known
   issue since 0.1.9; E–I remain. Its file references are stale: card code is in `src/cards/` (P4c), styles are per
   card (P4d; `app.css` is the shell's 747 lines), the Build drawer is the AION 2 pack's card, Level up lives in
   `src/cards/journey.html`. Its §5 owner questions were never answered (owner input 1).
5. **Lane C has its save:** v5 already holds slots, random slot ids and `labelOf` (P3c). Missing: functions that add,
   switch, rename and remove a character; a class list (`newChar` takes the pack's one `character`); any place that
   shows the label. Finding for 0.6 (sync): `merge()` keeps a slot present on one side only, so a removed character
   can come back from another device's save; 0.5 doesn't change `merge()`, P17 and P19 say so.
6. **A stale comment:** `src/main.js` says `updateAll` takes over once P5a–d make the cards independent; P5a–d merged
   and `update()` still calls each card by name in the old order. Not scheduled (no user value); P2 keeps the order.
7. **Order:** lane A's ranking steps (P12, P13) don't touch the card's layout and can go before lane B's P3; its UI
   steps (P14–P16) wait for P3. Nothing in the 0.5 table is cut-able: each lane answers an owner decision (DECISIONS
   2026-10-14 / 15) or an audit finding.

**Budget trend** (`npm run build`; elements at 390 px in a fresh browser; `tests/perf.js`, 45 states, run alone):

| | 0.2.0 | 0.2.3 | 0.2.5 | 0.2.6 / 0.3.0 | 0.4.0 | Limit | Use |
|---|---|---|---|---|---|---|---|
| `dist/index.html` | 498,891 B | 507,536 B | 665,735 B | 669,290 B | 705,008 B | 870,000 B, blocking | **81%** |
| same, gzip -9 | — | — | — | 153,871 B | 164,936 B | 200,000 B, blocking | **82%** |
| `dist-artifact/index.html` | — | — | — | 790,763 B | 826,481 B | 1,030,000 B, blocking | **80%** |
| Page elements | — | 4,658 | — | 4,741 | 4,741 | 6,200, blocking | 76% |
| `update()` median / worst | — | — | — | 6.8 / 8.5 ms | 8.7 / 10.3 ms | 15 ms, advisory | 58% / 69% |
| Inlined fonts (artifact) | — | — | — | 126.2 KB | 126.2 KB | 150 KB, blocking | **84%** |

The three byte budgets entered the 20% band in 0.4 (+5.3% with no visible feature: module boundaries and pack hooks),
and 0.5 adds the place data and new UI, so **P20 is a performance item**: whitespace and syntax minification of the page
script, measured here at −84 KB raw and −8.6 KB gzip. The fonts are unchanged at 84% and no 0.5 item adds a font. The
0.3.0 `update()` figures were measured in another session, possibly on other hardware, so the rise to 8.7 ms isn't a
trend yet (the next pass re-measures both on one machine); `perf` also fails its limit when it runs beside `site`
(16–18 ms, look back), and stays advisory.

#### Items (step 3)

Appetite counts hand-written changed lines as in 0.4 (data records count; regenerated fixtures and snapshots don't).
The full spec of each item, with its acceptance tests and ownership check, is its plan file.

| Item | Problem → result | Size | Owns (files) | Model | Lanes |
|---|---|---|---|---|---|
| [P1](docs/plans/0.5/P1-fitrail-race.md) | Basic rail height differs between loads (#105) → cause found, `fitRail()` re-runs when it settles | S | `src/main.js` (`fitRail()`), one `regress` check | Sonnet | main.js |
| [P2](docs/plans/0.5/P2-phone-order.md) | Next up 2.5–4.4 screens down on phones → Next up first at ≤ 860 px | M | `src/main.js` (placement), `app.css` phone block, 390 px expectations | Sonnet | main.js, app.css |
| [P3](docs/plans/0.5/P3-nextup-phone-card.md) | Next up wraps badly on phones, nested scroll stack → full-width first card, "1 of N", compact later cards | M | `src/cards/nextup.js`, `ahead.js`, their stylesheets, golden `nextup/` | Opus | golden |
| [P4](docs/plans/0.5/P4-level-bar.md) | Level up out of reach on phones → sticky bar holding the one `#lvlUpBig` | M | `src/index.html`, `src/main.js`, `app.css`, `src/cards/journey.js` | Sonnet | main.js, app.css |
| [P5](docs/plans/0.5/P5-tab-bar-build-sheet.md) | Build drawer behind a thin edge tab → bottom tab bar, Build as a bottom sheet | M | the pack's `build` card and stylesheet, `src/main.js`, `src/index.html`, `app.css`, `tests/a11y.js` | Sonnet | main.js, app.css, a11y |
| [P6](docs/plans/0.5/P6-phone-folds.md) | Long cards push the page down on phones → folded by default, choice saved as `fold_<id>` | M | three card `.html` files, `src/main.js`, card stylesheets | Opus | main.js |
| [P7](docs/plans/0.5/P7-zoom-195.md) | Headers overflow at 195 px (known issue since 0.1.9) → fixed, checked at 195 / 260 / 640 px | S | `tests/a11y.js` §8, stylesheets | Sonnet | app.css, a11y |
| [P8](docs/plans/0.5/P8-place-data.md) | Kibelisks are names only, travel numbers only in DECISIONS → registry, rules, `binds`, place table | M–L | AION 2 pack data (`kibelisks.json` new, zones, story `binds`, rules), schemas, `checks.mjs`, `tools/gen/` | Opus | gen |
| [P9](docs/plans/0.5/P9-step-points.md) | 0 of 432 objectives have a point → `steps[].at` from the research | M–L | story-quests data and schema, `checks.mjs`, `tools/gen/` | Opus | gen |
| [P10](docs/plans/0.5/P10-place-module.md) | Nothing knows where the player is → `whereNow`, `byPlace` (engine), `bound` / nudge / teleport (pack), not wired | M | `src/core/place.js`, `src/core/pack.js`, `src/packs/aion2/travel.js`, core tests | Opus | none |
| [P11](docs/plans/0.5/P11-ranking-families.md) | Golden and invariant states have no dated ticks → `loc` / `behind` / `bind` families, oracle, invariants, switches off | M–L | `tests/golden/**` (new states), oracle, `tests/invariant/**`, switch tables | Opus | golden |
| [P12](docs/plans/0.5/P12-place-rank.md) | Location ignored, Ascension not always first → `ascensionFirst`, `placeRank` on | M | `src/core/nextup.js`, `src/packs/aion2/nextup.js`, golden `nextup/` | Opus | golden |
| [P13](docs/plans/0.5/P13-catch-up.md) | A player ahead of their ticks sees 2 missed steps → catch-up, Later by when it opens | M | same as P12, core cases | Opus | golden |
| [P14](docs/plans/0.5/P14-tracks-bands.md) | No fastest / completionist, no level bands → tracks, band labels, toggle as the owner decides | M | `src/core/nextup.js`, `src/cards/nextup.js`, its stylesheet, golden `nextup/` | Opus | golden |
| [P15](docs/plans/0.5/P15-bind-row.md) | No Kibelisk binding → derived binds, one-time "Bind X" row (`bind:<kib>` on tick) | M | the pack's `nextup.js`, `travel.js`, `nextup-kinds.js`, a pack stylesheet, golden | Opus | golden |
| [P16](docs/plans/0.5/P16-travel-line.md) | No teleport-or-walk advice → travel line, "I'll walk", `preferRun` | M | same as P15, `src/cards/nextup.js` (setting) | Opus | golden |
| [P17](docs/plans/0.5/P17-character-ops.md) | Slots exist, nothing manages them → add / switch / rename / remove, pack `classes` | M | `src/core/chars.js`, `state.js`, `pack.js`, the AION 2 pack's `classes` | Opus | none |
| [P18](docs/plans/0.5/P18-character-switcher.md) | One character per browser, no name → header switcher, class picker (Assassin), name field | M–L | `src/cards/characters.*`, `src/index.html`, `src/main.js`, `tests/save.js` | Opus | main.js |
| [P19](docs/plans/0.5/P19-rename-remove.md) | Names fixed at creation, no remove → rename, remove with confirmation | S–M | the characters card, `tests/save.js` | Opus | main.js |
| [S1](docs/plans/0.5/S1-nextup-mockup.md) | Lane A's rows not drawn yet → mockup on P3's phone card and desktop, owner questions | M (docs) | `docs/design/0.5-nextup-mockup.md`, `docs/design/mockups/0.5-nextup*` | Sonnet | none |
| [S2](docs/plans/0.5/S2-characters-mockup.md) | Switcher not drawn yet → mockup, owner questions | S–M (docs) | `docs/design/0.5-characters-mockup.md`, `docs/design/mockups/0.5-characters*` | Sonnet | none |
| [P20](docs/plans/0.5/P20-page-script-size.md) | Byte budgets at 80–82% → page script minified (whitespace and syntax, names kept) | S | `scripts/build.mjs` (esbuild options), ARCHITECTURE §4 | Sonnet | none |
| [R](docs/plans/0.5/R-release-0.5.0.md) | Release 0.5.0 | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | release, alone |

No-gos for the whole minor: no save break (0.5 adds keys inside `companion-save-v5` only: `bind:<kib>` checks,
`track`, `preferRun`, `fold_<id>`, more character slots); no AION 2 term in the engine, engine cards or shell (term
scan); no new game data except P8 / P9's, each with its source; no `.github/workflows/` edits (bots can't push them);
no change to the artifact rules (one file, `/_blob/` icons, no service worker); no new game art (class icons need the
owner's OK).

#### Lane map (step 4)

At most three builds at a time (five since 2026-10-17, PR #233); kickoff queues an item once everything on its After line has merged, and the planner
queues the ones whose After line names an owner input or the research. Serial lanes (DISPATCH "Serial files", the
names kickoff knows): **golden** P11 → P3 → P12 → P13 → P14 → P15 → P16 (the critical path; P3 and P12 in whichever
order they are ready); **main.js** P1 → P2 → P4 → P5 → P6 → P18 → P19; **gen** P8 → P9; **app.css** P2, P4, P5, P7;
**a11y** P5, P7. The Next up card is shared by lanes A and B: B first (P14–P16 are After P3).

| Wave | Builds | After |
|---|---|---|
| 1 | S1 (none) ∥ S2 (none) ∥ P8 (gen) | — |
| 2 | P1 (main.js) ∥ P10 (none) ∥ P17 (none) | P10: P8 |
| 3 | P2 (main.js, app.css) ∥ P11 (golden) ∥ P20 (none) | P2: P1 + owner input 1 · P11: P10 |
| 4 | P3 (golden) ∥ P4 (main.js, app.css) ∥ P9 (gen) | P3, P4: P2 · P9: P8 + the step-points research |
| 5 | P12 (golden) ∥ P5 (main.js, app.css, a11y) | P12: P11 + owner input 1 · P5: P4 |
| 6 | P13 (golden) ∥ P6 (main.js) ∥ P7 (app.css, a11y) | P13: P12 · P6, P7: P2 |
| 7 | P14 (golden) ∥ P18 (main.js) | P14: P3, P13 + owner input 2 · P18: P17 + owner input 3 |
| 8 | P15 (golden) ∥ P19 (main.js) | P15: P3, P9, P12 + owner input 2 · P19: P18 |
| 9 | P16 (golden) | P15 |
| 10 | R, alone | everything above |

Waves are the expected order, not gates: an item starts when its After line has merged and its lanes are free.

#### Owner input (step 5)

Three To-dos, each a true blocker for visible work; the recommendation is in each, so the owner can answer "yes":

1. **Phone layout and 0.5's visible steps** (blocks P2–P7 and P12–P16; token `owner-ok-phone`, `owner-ok-visible`).
   Answer the phone mockup's open questions (phone-layout §5); recommended: Basic opens on Next up with Journey still
   open (it holds Level − / + and the slider) and Progress folded; tabs Route · Gear · Build; the level bar and tab bar
   in both modes; Dungeons & Strongholds folded on phones in both modes; "1 of N" in Advanced only; Milestones stays
   where it is; the `before-*` shots are already in the repo, no action. And a **standing approval** like 0.3's: a
   visible 0.5 step that follows an approved mockup or the smart Next up design merges on a separate reviewer's
   APPROVE and green CI, with its before / after shots and `--explain` table kept for you to check afterwards (undo by
   a follow-up patch).
2. **S1 mockup** (written when S1 merges; blocks P14–P16; token `owner-ok-S1`): approve the drawn rows and its
   questions. One needs your OK because it differs from your 2026-10-14 decision ("fastest, with a completionist
   toggle"): the toggle stays hidden until at least one milestone has approved non-core labels (today every record is
   `core`, so the toggle would change nothing).
3. **S2 mockup** (written when S2 merges; blocks P18–P19; token `owner-ok-S2`): approve the switcher, the one-class
   picker and the name field.

Not blockers (the recommendation applies unless the owner says otherwise):

- **Bind radius:** your working value, 25 m, stays (DECISIONS 2026-10-15). P8 prints the bound / nudge split for 25,
  32, 35 and 40 m (the Kibelisk research finds the data fit at least 32 m); changing it later is one data line.
- **In-game checks, when convenient:** the Kibelisk check list P8 / P9 generate (which objective binds which
  Kibelisk), a timed walk vs teleport on two routes (`rule:teleport-gain`, 400 m to start), C41 (Koro at Lv 45). None
  blocks a build.
- **Route labels:** Data & Research proposes `filler` / `completionist` labels milestone by milestone for your approval;
  until then fastest = today's order.
- **Sync hosting** (S0's decision) blocks 0.6 lane C, not 0.5.

#### Alongside (not #114 items)

- **Story step-points research** (gates P9; token `research-step-points`): a cloud research session (it needs the web)
  reads the Metabot quest pages of the 51 story quests with step markers (about 185 points) under the fetching rules
  (terms first, then robots.txt, ≤ 12 requests / min, one at a time, our User-Agent, 24 h cache, facts only), and writes
  `docs/research/2026-10-story-step-points.md` plus a CSV under `data/research/`, each point with its page URL. The
  coordinator starts it; no aion2.th.gl.
- **Route label proposals** for P14's toggle (Data & Research, docs only).
- **Class research packs** for 0.6 lane B continue as in 0.4.

### 0.6 — New players and the first new class

| Lane | What | Module |
|---|---|---|
| A | First-run welcome, Lv 1–10 tuning, terms explained, join mid-level (old 0.7 P1–P3) | onboarding module, guide text |
| B | Ranger pack (the owner's choice, 2026-10-18; first planned as the Gladiator, see Replan below), from its research pack: data, guide build, icons, golden snapshot, in-game spot check. It follows the 0.4 P1 pack layout: class data in `data/packs/aion2/classes/ranger/`, its Asmodian guide in `data/packs/aion2/asmodian/ranger/`, each with a manifest. First step: per-pack loading (moved from 0.4 P7), so the page carries only the chosen class; then the guide text both classes share is split out of the Assassin pack | its two pack folders only, after the loading step |
| C | Sync client on `merge()` (old 0.6 Y1), if the owner approved the sync design and hosting | sync module |

**Replan (pipeline thread, 2026-10-18 1:50 AM ET): the Ranger replaces the Gladiator in lane B.** Isaac chose the Ranger
(DECISIONS 2026-10-18, D8). P4 (Gladiator class data, PR #300) had already merged; that hidden pack stays on main,
unchanged, for a later class release. New item P22 builds the Ranger class data from a `research-ranger` session (the
same method as `research-gladiator`, PR #291); P5 becomes the Ranger guide and picker, after P22 and
`owner-check-ranger` (made optional the same night, owner input 5). Lane B's gen lane is now P2 → P3 → P4 (done) → P22 → P5. Audit text below that names the
Gladiator describes the plan as first written; the item table, waves and owner input are updated.

Planning pass written 2026-10-18 (#257): release kaizen review in [docs/kaizen/0.5-scorecard.md](docs/kaizen/0.5-scorecard.md)
(the first scorecard), one spec per item in [docs/plans/0.6/](docs/plans/0.6/) (the issue body the planner creates,
verbatim), owner notes from #254 placed below. Item keys are `P<n>` / `S<n>` for kickoff's After-line queueing; tokens
that aren't keys (`owner-*`, `research-*`) are listed under "Owner input" and "Alongside" with who clears them.

**Process changes from the scorecard (in place before the first 0.6 item is queued):** K1 builds expected past 45
min commit and push after each step (the 1 h token killed P6); K2 / K4 every research gate and owner question of the
minor goes out the hour this plan merges; K5 / K6 per-item times and Waste lines are kept for the next scorecard; K7
fix round 2 on Opus; K3 and K9 (Kickoff writes the build card; golden split by snapshot folder) need the pipeline
thread. Re-derived #114 limits: M code 80 min, M–L 80 min, L 120 min, S 16, S–M 20, M docs 41; build cap 5; build
routing unchanged. The rows are in the scorecard and in the PR of this pass for #222.

**Moved out of 0.6 (Release Planner, 2026-10-18 5:35 AM ET; now 0.6.1, see below), per the waves rule below:** every other 0.6 item had merged (P19, PR #320, 4:37 AM ET) and two owner inputs were still missing, so **P13** (story-quest icon, waits on the owner's icon crop; Metabot has none, PR #289) and **P15** (respec walk-through, waits on the owner's in-game key screens) move out, and R ships 0.6.0 without them. First planned for 0.7; Isaac moved them to a 0.6.1 patch at 6:05 AM ET ("anything outstanding we just patch tomorrow"). Their gates are renamed `owner-ok-story-icon` and `owner-ok-keys` (recorded as an "Owner, typed" DECISIONS row when the input arrives) so kickoff can read them. Their issues (#272, #274) stay open for 0.6.1.

#### Audit (step 2), against `main` at `aab1032` (0.5.0)

Path to 1.0 first:

1. **0.7–0.9 are blocked on research nobody started.** "Class research packs for all seven classes, two at a time"
   (0.4 "Alongside") produced only the Gladiator groundwork ([docs/research/2026-10-next-class.md](docs/research/2026-10-next-class.md)).
   Changed: the research packs for 0.7's two classes run alongside 0.6 (below), chosen by D8's rule once the owner says
   who levels which class (owner input 5).
2. **The artifact can't carry eight classes.** P2 (per-pack loading) leaves other classes out of the site page, but the
   claude.ai artifact can't fetch, so it inlines every class: at 84% of its byte budget with one class, it fails
   before the fourth. Added to 0.7: decide (in its planning pass, with the owner) between an artifact that carries one
   class chosen at build time and a raised budget with a reason.
3. **0.7 lane C (sync server and UI) waits on the same owner decision as 0.6 P21** (sync.md §6 S1 hosting, S2 money);
   it is asked now (owner input 4), so 0.7 isn't held by it.
4. **The two-classes-per-minor risk stands** (Plan, "Risk, called out"); D8 (which class first) is still "decided
   later" in DECISIONS. Gladiator stays the default (next-class research §5); owner input 5 asks once.
5. 1.0 and 1.1 are unchanged; 1.1's reset and boss research can still run any time.

Then 0.6:

6. **Lane A was vague** ("Lv 1–10 tuning" has no acceptance). It becomes the #254 notes plus the old 0.7 P1–P3:
   tuning is what P6, P12, P14, P15 and P16 do for the first ten levels; no separate item.
7. **Lane A's visible work needs one drawing first** (S1), and #254 note 1 needs an owner choice (hidden vs faded), so
   S1 asks it with both drawn.
8. **Lane B needs the web** (Gladiator data from Metabot) and a bot build has none: a cloud research session
   (`research-gladiator`) writes the files P4 reads, started when this plan merges.
9. **Lane C is conditional:** P20 (removed characters stay removed through `merge()`, the 0.5 P17 finding) needs no
   host and runs now; P21 (client) waits for the hosting decision and moves to 0.7 if it isn't recorded by the time P5
   merges.
10. **#254 note 3 changes a CLAUDE.md rule**, so P19 is queued only on Isaac's typed OK.
11. **The private screens (`daevacompanion-private`) couldn't be read from this run** (no credentials). The keys they
    were mined for are in [docs/research/2026-10-owner-unlocks.md](docs/research/2026-10-owner-unlocks.md) (Journal J,
    Stats P, Skills K, Daevanion U, Legion L, Shop H, …); owner input 3 asks only what that table doesn't show, and the
    coordinator, who can read the private repo, answers from the screens first if they show it.

**Budget trend** (`npm run build`; elements and `update()` not re-measured: no item in this pass changes the page):

| | 0.2.6 / 0.3.0 | 0.4.0 | 0.5.0 | Limit | Use |
|---|---|---|---|---|---|
| `dist/index.html` | 669,290 B | 705,008 B | 741,479 B | 870,000 B, blocking | 85% |
| same, gzip -9 | 153,871 B | 164,936 B | 182,302 B | 200,000 B, blocking | **91%** |
| `dist-artifact/index.html` | 790,763 B | 826,481 B | 863,343 B | 1,030,000 B, blocking | **84%** |
| Inlined fonts (artifact) | 126.2 KB | 126.2 KB | 126.2 KB | 150 KB, blocking | **84%** |

All three byte budgets are within 20% of their limits, gzip at 91% (+10.5% in 0.5 even after 0.5 P20's minification).
**P1 is a performance item** and goes first in lane B: lane A adds text and markup, and P4 / P5 add a second class.
Fonts unchanged; no 0.6 item adds one.

#### Items (step 3)

Appetite counts hand-written changed lines (data records count; regenerated fixtures and snapshots don't). Models
follow #114's routing as the scorecard left it; stall limits are the scorecard's re-derived ones.

| Item | Problem → result | Size | Owns (files) | Model | Stall | Lanes |
|---|---|---|---|---|---|---|
| [S1](docs/plans/0.6/S1-onboarding-mockup.md) | Lane A not drawn → mockup: welcome, mid-level join, locked cards hidden vs faded, key hints, terms | M (docs) | `docs/design/0.6-onboarding-mockup.md`, mockups | Sonnet | 41 | none |
| [P1](docs/plans/0.6/P1-page-size-headroom.md) | gzip at 91% → size table, largest share cut, ≤ 170,000 B | S–M | `scripts/build.mjs`, `scripts/generated-data.mjs`, ARCHITECTURE §4 | Sonnet | 20 | none |
| [P2](docs/plans/0.6/P2-per-pack-loading.md) | Every class in every page → per-class chunks, site loads the current class | M–L | `tools/gen/`, build scripts, `src/packs/aion2/load.js`, `src/sw.js`, fake pack, conformance | Opus | 80 | gen |
| [P3](docs/plans/0.6/P3-shared-guide-split.md) | Shared guide text inside the Assassin pack → shared Asmodian guide pack | M–L | `data/packs/aion2/asmodian/guide/**`, Assassin guide, `checks.mjs`, `tools/gen/` | Opus | 80 | gen |
| [P4](docs/plans/0.6/P4-gladiator-class-data.md) | No Gladiator pack → class data from the research files, not offered yet (merged, PR #300; kept hidden after the Replan) | L | `data/packs/aion2/classes/gladiator/**`, `sources.json` | Opus | 120 | gen |
| [P22](docs/plans/0.6/P22-ranger-class-data.md) | No Ranger pack → class data from the Ranger research files, not offered yet | L | `data/packs/aion2/classes/ranger/**`, `sources.json` | Opus | 120 | gen |
| [P5](docs/plans/0.6/P5-ranger-guide.md) | Ranger has no advice → guide pack, icons, golden states, in the picker | L | `data/packs/aion2/asmodian/ranger/**`, pack `classes`, icons, golden | Opus | 120 | gen, golden |
| [P6](docs/plans/0.6/P6-step-text-pronouns.md) | "investigate it with Maard" (#254 n11) → 4 texts fixed, pronoun check | S | `story-quests.json` (4 texts), `checks.mjs`, golden | Opus | 16 | golden |
| [P7](docs/plans/0.6/P7-character-sort.md) | Characters in save order (#254 n10) → sorted by name | S | `src/cards/characters.js`, `tests/save.js` | Sonnet | 16 | none |
| [P8](docs/plans/0.6/P8-skills-respec.md) | No Respec on Skills (#254 n8) → button like Daevanion's | S | the pack's `skills.*` | Sonnet | 16 | none |
| [P9](docs/plans/0.6/P9-daevanion-skill-bonus.md) | No node bonus shown (#254 n9) → green (+x) | M | the pack's `skills.*`, node-bonus helper | Opus | 80 | none |
| [P10](docs/plans/0.6/P10-build-step-icons.md) | Play steps are names only (#254 n5) → icons | S | the pack's `build.*` | Sonnet | 16 | none |
| [P11](docs/plans/0.6/P11-popout-rounded.md) | Square pop-out (#254 n4) → app styling inside; frame is the browser's | S | `src/cards/nextup.js` pop-out area | Sonnet | 16 | none |
| [P12](docs/plans/0.6/P12-auto-bind-mentions.md) | Binds that happen at an objective still mentioned (#254 n6) → trimmed within 25 m | M | the pack's `travel.js`, `nextup.js`, `nextup-kinds.js`, golden | Opus | 80 | golden |
| [P13](docs/plans/0.6/P13-story-quest-icon.md) | 📜 for story (#254 n7) → the game's yellow icon | S | `src/cards/nextup.js` icon map, icon file, `docs/ISSUES.md`, golden | Opus | 16 | golden |
| [P14](docs/plans/0.6/P14-key-hints.md) | No "press K" (#254 n2) → `hotkey` on unlocks, hints | M | unlock schema and data, `nextup-kinds.js`, golden | Opus | 80 | golden |
| [P15](docs/plans/0.6/P15-respec-walkthrough.md) | No refund / respec steps (#254 n2) → rows from the owner's answer | S–M | guide records, `unlocks.json`, golden | Opus | 20 | golden |
| [P16](docs/plans/0.6/P16-cards-on-unlock.md) | Every card from Lv 1 (#254 n1) → cards open with their unlock | M–L | `src/core/cards.js`, `src/main.js`, pack card index, golden | Opus | 80 | main.js, golden |
| [P17](docs/plans/0.6/P17-welcome-join-mid-level.md) | No welcome, no mid-level start → both, per S1 | M–L | `src/cards/welcome.*`, `src/main.js`, characters card | Opus | 80 | main.js |
| [P18](docs/plans/0.6/P18-terms-explained.md) | Game words unexplained → `terms.json`, explanations on cards | M | `terms.json`, schema, `text.js`, golden, `tests/a11y.js` | Opus | 80 | golden, a11y |
| [P19](docs/plans/0.6/P19-auto-level-up.md) | Tick + Level up for a full-level quest (#254 n3) → tick levels up (verified quests only) | S–M | quest schema, one record, `journey.js`, `state.js`, golden, CLAUDE.md line | Opus | 20 | golden |
| [P20](docs/plans/0.6/P20-removed-characters-merge.md) | A removed character returns through `merge()` → tombstones | M | `src/core/sync.js`, `chars.js`, `state.js`, characters card | Opus | 80 | none |
| [P21](docs/plans/0.6/P21-sync-client.md) | No sync client → encrypted push / pull / merge on a fake host | L | `src/core/sync-client.js`, host adapter, build exclusion, PRIVACY.md | Opus | 120 | none |
| [R](docs/plans/0.6/R-release-0.6.0.md) | Release 0.6.0 | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | 16 | release, alone |

No-gos for the whole minor: no save break (0.6 adds fields inside `companion-save-v5` only); no AION 2 term in the
engine, engine cards or shell (term scan); no game data without its source (P4, P22, P5 from the research files; keys,
refund and respec from the owner); no `.github/workflows/` edits; no change to the artifact rules; no new game art beyond
the standing icon OK and the owner's OK for the story-quest icon (#254 note 7).

#### Waves and lane map (step 4)

At most five builds at a time (kickoff.yml). Serial lanes: **gen** P2 → P3 → P4 → P22 → P5 (lane B's critical path, gated
by `research-ranger`; P4 merged before the Replan); **golden** P6 → P12 → P13 → P14 → P16 → P15 → P18 → P19 → P5 (lane
A's critical path, gated by `owner-ok-S1`); **main.js** P16 → P17; **a11y** P18. Shared files outside the lanes are
ordered by After lines: build scripts P1 → P2 → P21; the Skills card P8 → P9 → P14; `src/cards/nextup.js` P11 → P13;
the characters card P7 → P20 and P7 → P17. Critical path: P1 → P2 → P3 → P22 → P5 → R, so P1 and the
research session start first (`research-ranger` since the Replan).

| Wave | Builds | After |
|---|---|---|
| 1 | S1 (none) ∥ P1 (none) ∥ P6 (golden) ∥ P7 (none) ∥ P8 (none) | — |
| 2 | P2 (gen) ∥ P12 (golden) ∥ P10 (none) ∥ P11 (none) ∥ P20 (none) | P2: P1 · P12: P6 · P20: P7 |
| 3 | P3 (gen) ∥ P13 (golden) ∥ P9 (none) ∥ P21 (none) | P3: P2 · P13: P11, P12 + `research-story-icon` · P9: P8 · P21: P2, P20 + `owner-ok-sync-hosting` |
| 4 | P4 (gen, merged) → P22 (gen) ∥ P14 (golden) | P4: P3 + `research-gladiator` · P22: P3 + `research-ranger` · P14: S1, P9, P13 + `owner-ok-S1` |
| 5 | P16 (main.js, golden) | P14 + `owner-ok-S1` |
| 6 | P15 (golden) ∥ P17 (main.js) | P15: P14 + `owner-keys` (after P16 frees golden) · P17: P7, P16 |
| 7 | P18 (golden, a11y) | P15 |
| 8 | P19 (golden) | P18 + `owner-ok-autolevel` |
| 9 | P5 (gen, golden) | P22 |
| 10 | R, alone | everything above, or moved out here |

Checked: no two items in one wave own the same file (P4, P22 and P14 touch different schema files; P13 and P11 are in
different waves). Waves are the expected order, not gates. An item whose owner token isn't recorded when its wave
comes is skipped, not waited on; if it is still missing when everything else has merged, it moves to 0.7 in this file
and R ships without it.

#### Owner input (step 5)

To-dos the hour this plan merges (scorecard K4), each with its recommendation and the exact words to type (`copy`):

1. **S1 mockup** (`owner-ok-S1`, blocks P14, P16, P17, P18; red once S1 merges): approve the drawings and choose hidden
   vs faded for locked cards (#254 note 1). Recommended: faded with "Opens at …" on desktop and hidden on phones, if
   S1's drawing reads well; otherwise faded everywhere.
2. **Auto level-up** (`owner-ok-autolevel`, blocks P19 only, not red): it changes CLAUDE.md's "Level changes only via
   Level up / − / + / slider". Recommended: yes, for quests with a verified 100% EXP reward only (today one: A Village
   in the Fog), undoable.
3. **In-game keys and steps** (`owner-keys`, blocks P15 only, not red): the keys the owner-unlocks table doesn't show
   (Stigmas, Dungeons, Strongholds), where the skill reset / refund button is and what the tutorial-skill refund looks
   like, how to respec the Daevanion board and stigmas, where the auto-use slots are set. A screen of each is enough.
4. **Sync hosting and money** (`owner-ok-sync-hosting`, docs/design/sync.md §6 S1 + S2; blocks P21 and 0.7's server,
   not red): recommended Cloudflare Workers + R2 in the existing account, free tier with a usage alert.
5. **Ranger spot check** (`owner-check-ranger`, optional, blocks nothing since 2026-10-18 2:45 AM ET; replaced the
   Gladiator spot check at the Replan): who levels which class is answered (the Ranger, DECISIONS 2026-10-18). Left,
   nice to have: one Skills-window screen from a Lv 1 Ranger for Marking Shot 3, Burst Arrow 10 and Deadshot 14. At
   Isaac's ask the research session found those on other allowed sites besides Metabot (P5 labels them, since the
   sites may share data), so P5 waits only on P22. Not asked: the stigma max
   level. A leveling guide doesn't reach it (the Gladiator research session counted about 30 stigma points by Lv 45
   against 75 for stigma Lv 20; not re-checked here), so `maxLevel` ships labelled single source unless the Ranger
   research finds otherwise.

Not blockers (the recommendation applies unless the owner says otherwise):

- **#254 note 5:** P10 puts icons on the play steps; an explanation of auto-use waits for owner input 3's screen of the
  auto-use slots.
- **#254 note 11, full objective audit:** owner spot checks when convenient; P6's check catches the pronoun class.
- **#254 note 4:** after P11 the owner checks the pop-out on his machine; the frame stays the browser's.

Decisions this pass recorded (for the tracker, each as a done To-do with its remediation):

- **User remediated:** bind radius stays 25 m (#254, 7:55 PM ET; note 6 means objective binds only); the story-quest
  icon may be added (#254 note 7, still needs an approved source).
- **Claude remediated:** Gladiator stays the 0.6 class (D8 default; superseded 2026-10-18, the owner chose the Ranger); lane C splits into P20 now and P21 on the hosting
  OK; "Lv 1–10 tuning" folds into P6 / P12 / P14–P16; note 6 trimmed by derived distance, data text kept; note 5 read as
  the play steps; note 4's frame moved out; P1 scheduled from the 91% budget.

#### #254 notes placed

| Note | Placed as |
|---|---|
| 1 Cards only when they unlock | P16, choice in S1 (owner input 1) |
| 2 Keys, tutorial refund, respec walk-through | P14 (known keys), P15 (refund and respec, owner input 3) |
| 3 Auto level-up on 100% EXP quests | P19, behind `owner-ok-autolevel` (owner input 2) |
| 4 Rounded pop-out | P11 (inside); the window frame moved out: the browser draws it |
| 5 Icons in the rotation setup | P10 (play steps); auto-use explanation waits on owner input 3 |
| 6 Kibelisk binds that happen on their own | P12, R = 25 m kept |
| 7 Yellow story-quest icon | P13, gated by `research-story-icon` |
| 8 Respec on the Skills card | P8 |
| 9 Green (+x) from Daevanion nodes | P9 |
| 10 Character list by name | P7 |
| 11 Wrong step subtext, objective audit | P6; the full audit moved out to owner spot checks |

#### Alongside (not #114 items)

- **Gladiator research** (gated P4; token `research-gladiator`): done, PR #291
  (`docs/research/2026-10-gladiator-pack.md` plus CSVs under `data/research/`).
- **Ranger research** (gates P22; token `research-ranger`, added at the Replan): the same session type and method reads
  Metabot's Ranger class, skill, stigma and Daevanion pages under the fetching rules and writes
  `docs/research/2026-10-ranger-pack.md` plus CSVs under `data/research/` (file names with `ranger`), each row with its
  page URL, and names three skill learn levels for owner input 5. Started 2026-10-18 by the pipeline thread through
  the coordinator.
- **Story-quest icon source** (gates P13; token `research-story-icon`): the same kind of session looks for the game's
  story-quest icon on Metabot and records page, file URL and date in docs/ISSUES.md; if none, the owner supplies the
  file.
- **Research packs for 0.7's two classes** (audit 1), after owner input 5 names them.

### 0.6.1 — patch after 0.6.0 (owner, 2026-10-18 6:05 AM ET)

Isaac, in the project chat: "Can we just push to the 6.0 release with what we have and anything outstanding we just patch
tomorrow after I wake up?" So 0.6.0 ships without the two owner-gated items and 0.6.1 carries them, plus data fixes:

- ~~**P13** story-quest icon (#272)~~ and ~~**P15** respec walk-through (#274)~~: moved to 0.6.2 (below) on
  2026-10-18 9:20 AM ET under K10, because their owner inputs weren't in when every other 0.6.1 item had merged.
- **Game Data Check fixes** for #325 (thin-sourced "verified" fields), in small data PRs.
- **Player Testing fixes** (#321, #333; issues #334–#338; Release Planner triage 2026-10-18 7:30 AM ET), no owner input needed:
  [F1](docs/plans/0.6.1/F1-story-counter.md) story objective counter and Ahead order (golden) ·
  [F2](docs/plans/0.6.1/F2-phone-overlays.md) phone toast and Build sheet over the tab bar (main.js) ·
  [F3](docs/plans/0.6.1/F3-welcome-buttons.md) two "Start at Lv 1" buttons (a11y) ·
  [F4](docs/plans/0.6.1/F4-a11y-layout-nits.md) headings, tap targets, board line (a11y, main.js) ·
  [F5](docs/plans/0.6.1/F5-ranger-icons.md) Ranger icons under the standing icon OK (gen, golden; after `research-ranger-icons`, a cloud session, since bot builds have no web).
  Not patched (to the 0.7 planning pass as input): #321 notes 5, 6, 8, 10 and #333 notes 2, 3, 5 (judgement calls or
  new features). #321 bug 4 (`assassin-lvl1` label) is the owner's 2026-10-16 label design, so it goes to the owner.

No planning pass (patch): the Release Planner queues each item when its gate is met, sends Game Data Check
`PRE-RELEASE CHECK 0.6.1` once they merge, and opens the release issue after `DATA OK`.

Contents: F1 #366, F2, F3, F4 #362, F5 #370, data fixes #361, #363, #364 (#358); `DATA OK 0.6.1` 9:21 AM ET (main
`8ba3fab`); release item #371.

### 0.6.2 — the owner-gated 0.6 leftovers

**Folded into 0.7.0 (owner rule, 2026-10-18 10:40 PM ET: "New looks ship in the next minor by default; a patch only
when I say now").** There is no 0.6.2 release: the items below keep their issue titles (so their owner-ok tokens still
parse) and are listed in the 0.7.0 CHANGELOG. Main already carries merged 0.7 work, so a 0.6.2 cut from main would have
shipped it too. The Release Planner sends `PRE-RELEASE CHECK 0.7.0` only after these have merged as well, which holds
Release 0.7.0 (#350) for them. The text below is kept as the record of how they were planned.

- **P13** story-quest icon (#272), after `owner-ok-story-icon` (the owner's icon crop).
- **P15** respec walk-through (#274), after `P14, owner-ok-keys` (the owner's in-game key screens).

Both auto-queue from their issue bodies when the owner's typed DECISIONS row lands (0.6 items, so the unversioned tokens
still parse under K12). Same patch rules as 0.6.1: Game Data Check before the release item; the release issue opens
after `DATA OK 0.6.2`. If 0.7.0 is due first, they move to 0.7.1.

Inputs in (Release Planner, 2026-10-18 8:00 PM ET): the owner sent the icon crops and skill screens at 7:55 PM ET
(`docs/research/owner-screens-2026-10-18/`, DECISIONS `owner-ok-story-icon`, `owner-ok-keys`). P13 uses the active-quest
crop and ships on the site only (artifact frozen). P15 covers skills only: the tutorial-skill refund and the reset-one /
reset-all steps. Daevanion and stigma respec steps wait for his screens. Two design asks from the same message (skill icons in the
Build pop-out's Key setup grid, and a placeholder before the Skills card unlocks) go to Design Lead first and are not queued
until a DESIGN OK and the owner's OK.

More owner input the same evening (8:01–8:46 PM ET): **P16** (#398) drops the Daeva Pass and Save-stones Next up
steps, folds the stone advice and his extraction screens into the extract tip, and finds why the Wisdom Stones card
showed early (queued after P15).

Owner OKs typed 2026-10-18 9:38–10:04 PM ET turned the evening's mockups into builds (DECISIONS rows of that time):

| Item | What | Mockup | Lanes |
|---|---|---|---|
| P17 (#397) | Next up step cards say how; item names show their icon | #403, #406 | golden, app.css, a11y |
| P18 (#414) | Key setup shows skill icons, key chips under each column | #389 §1, §1a | a11y |
| P19 (#415) | Locked-card shells in Basic on desktop, "N levels to go" | #389 §2 | main.js, app.css, a11y |
| P20 (#391) | Story card icon follows the quest state | #394 | golden, app.css |
| P21 (#404) | Map markers: Sealed Dungeon, Stronghold, Kibelisk, Empyrean Trace | #408 | golden, app.css |

Golden runs P13 → P15 → P16 → P17 → P20 → P21 by queue order (P20 needs P13's icon, P21 the dark tile).
P21 also waits on `research-map-icons` (Game Data Check commits the files; bot builds have no web). Patch items
don't auto-queue from their bodies (kickoff keys only minor titles): Build Pipeline adds their #114 lines.
Planned, not queued: the Key setup / macro fix (#387, waits on the owner's in-game checks; the macro walk-through of
#389 §1b ships with it), regional quest state icons (#409, Design Lead). Player-chosen keys (#388) is a 0.8 candidate.

### 0.7 — The Gladiator, a second class, and sync

Planning pass written 2026-10-18 (Release Planner, PLANNING PASS START 0.7 at 7:12 AM ET): release kaizen review in
[docs/kaizen/0.6-scorecard.md](docs/kaizen/0.6-scorecard.md) (Kaizen, KAIZEN REVIEW DONE 0.7; changes K10, K11; S limit
16 → 44 min), audit and plan below. Patches 0.6.1 run alongside (above); 0.7 depends on none of them.

#### Audit (step 2), against `main` at `5f4755f` (0.6.0)

Path to 1.0 first:

1. **Two classes per minor is still the pace that reaches eight by 0.9** (Assassin, Ranger now; 0.7 two, 0.8 two,
   0.9 two). The limit is research: a bot build has no web, so every class needs a cloud research session first.
   Changed: 0.7's research sessions start at pass start (K10), not when the plan merges.
2. **The artifact can't carry a third class** (971,146 / 1,030,000 B, 94%). Decided here (Claude remediated, reversible):
   P1 makes the artifact carry a fixed build-time list, Assassin and Ranger as today, and new classes are site-only.
   The artifact stays byte-identical for today's classes. A site-only class makes the two builds' pickers differ, which CLAUDE.md ("both builds visually identical") leaves to the owner, so P2 and P4 wait on owner input 2 (PR #340 review).
3. **Sync has a client and a hosting decision but no server or UI.** Lane C: P5 server (offline tests, no deploy),
   S2 mockup, P6 UI. The deploy needs the owner's Cloudflare token (owner input 4) and is a Build Pipeline task, not a
   bot item (no bot edits `.github/workflows/`).
4. 1.0 and 1.1 are unchanged.

Then 0.7:

5. **The Gladiator's class data (0.6 P4) merged before 0.6 P3's guide split** and has had no guide research for a
   0.6 P5-style pack. A small research session (`research-gladiator-guide`) checks it first; 0.7 P2 re-checks 0.6 P4's fields.
6. **The second class follows D8.** Who plays is unknown; data coverage then picks the Spiritmaster (Metabot Lv 45
   sample, 5 guides, 2 builds; Sorcerer, Cleric and Chanter show no sample; Templar 1 build; classes-and-gaps §2.2).
   Its research starts now and is redirected if the owner names another class (owner input 1).
7. **Player Testing found new-feature asks** (#333 notes 2, 3, 5; #321 notes 5, 6, 8, 10). Adding features needs the
   owner's OK, so they are owner input 6, not items.

**Budget trend** (`npm run build`):

| | 0.5.0 | 0.6.0 | Limit | Use |
|---|---|---|---|---|
| Site page (index + class chunk) | 741,479 B | 714,616 B | 870,000 B, blocking | 82% |
| same, gzip -9 | 182,302 B | 177,657 B | 200,000 B, blocking | **89%** |
| claude.ai artifact | 863,343 B | 971,146 B | none: build and budget removed by P9 (frozen 2026-10-18) | — |

Per-class chunks keep each new class out of the site page. P6 adds UI to the site
page only (site-only code), so gzip is watched there.

#### Items (step 3)

Item keys are `P<n>` / `S<n>` so kickoff can read them (kickoff.yml matches `<minor> P\d+|S\d+`; first drafted as A1, G1, C1,
C2, Y2, Y3). Models follow #114's routing; stall limits as the 0.6 scorecard left them (S 44, S–M 20, M 80, M–L 80, L 120, M docs 41).

| Item | Problem → result | Size | Owns (files) | Model | Stall | Lanes |
|---|---|---|---|---|---|---|
| [P1](docs/plans/0.7/P1-artifact-class-list.md) | Artifact inlines every class → fixed build-time list, others site-only | M | `scripts/build.mjs`, `scripts/generated-data.mjs`, picker filter, ARCHITECTURE §4 | Opus | 80 | none |
| [S2](docs/plans/0.7/S2-sync-screen-mockup.md) | Sync UI not drawn → mockup of every client state | M (docs) | `docs/design/0.7-sync-mockup.md`, mockups | Sonnet | 41 | none |
| [P2](docs/plans/0.7/P2-gladiator-guide.md) | Gladiator hidden, no advice → guide pack, golden, site picker | L | `data/packs/aion2/asmodian/gladiator/**`, gladiator class fixes, `pack.js`, golden | Opus | 120 | gen, golden |
| [P3](docs/plans/0.7/P3-second-class-data.md) | No second class pack → class data from research, hidden | L | `data/packs/aion2/classes/<class>/**`, `sources.json` | Opus | 120 | gen |
| [P4](docs/plans/0.7/P4-second-class-guide.md) | Second class has no advice → guide pack, golden, site picker | L | `data/packs/aion2/asmodian/<class>/**`, `pack.js`, golden | Opus | 120 | gen, golden |
| [P5](docs/plans/0.7/P5-sync-server.md) | No sync server → Worker + R2 per sync.md §4, offline tests, no deploy | L | `server/sync/**`, server tests, sync.md §9, PRIVACY.md | Opus | 120 | none |
| [P6](docs/plans/0.7/P6-sync-ui.md) | Client unused → S2's screens on the site only | M–L | sync card/section, `main.js` mount, sync texts, `tests/site.js` | Opus | 80 | main.js, a11y |
| [P7](https://github.com/HackTheMeatball/daeva-companion/issues/379) | Join field cuts off the code on phones → whole code shown (Design Lead fix on P6 #378, added 2026-10-18 2:35 PM ET) | S | `src/cards/sync.*`, `tests/site.js` | Sonnet | 44 | a11y |
| [P8](https://github.com/HackTheMeatball/daeva-companion/issues/382) | Sync line shown to every visitor before the server exists → hidden behind `SYNC_LIVE` (false) until the server deploy turns it on (added 2026-10-18 7:20 PM ET; must merge before 0.6.1) | S | `src/site.js`, `src/shell/sync-host-http.js`, `tests/site.js` | Sonnet | 44 | a11y |
| [P9](https://github.com/HackTheMeatball/daeva-companion/issues/383) | Two builds, one shipped → the site is the only build; the claude.ai artifact build is removed (owner freeze, 2026-10-18 7:12 PM ET) | M | `scripts/build.mjs`, `scripts/serve.mjs`, tests, `docs/ARCHITECTURE.md`, `docs/DEPLOY.md` | Opus | 80 | gen, a11y |
| [P10](https://github.com/HackTheMeatball/daeva-companion/issues/399) | P9 left inert artifact-class code → removed (`ARTIFACT_CLASSES`, `siteOnlyNote`, `DAEVA_CLASSES`, schema field; #396 review, added 2026-10-18 8:50 PM ET) | S | `src/cards/characters.js`, `data/schema/pack.schema.json`, `scripts/build.mjs` filter path, `tests/save.js` header | Sonnet | 44 | gen |
| [P11](https://github.com/HackTheMeatball/daeva-companion/issues/418) | Ranger and Gladiator Key setup say "no source" / show only the guide's line, though the owner's screens show the game's default keys → per-key skill stacks in data, Q/E no longer hard-coded (added 2026-10-18 10:20 PM ET) | M | `data/schema/builds.schema.json`, `src/packs/aion2/requirements.js`, `src/packs/aion2/data/build.js`, Ranger and Gladiator `builds.json` | Opus | 80 | gen, a11y |
| [P12](https://github.com/HackTheMeatball/daeva-companion/issues/422) | Spiritmaster Route rules talk about Elemental Fusion from Lv 1 (#410 review) → Route rules hide a step until its `requires.level`; triggers step gated at Lv 14 (added 2026-10-18 10:40 PM ET) | S | `src/cards/route.js`, Spiritmaster `steps.json` | Sonnet | 44 | golden-route |
| [R](docs/plans/0.7/R-release-0.7.0.md) | Release 0.7.0 | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | 44 | release, alone |

Not a bot item: **sync deploy** (Build Pipeline, after owner input 4 and P5): a deploy workflow with the owner's token.

No-gos for the whole minor: no save break (sync has its own key); no AION 2 term in the engine; no game data without its
source; no fetching in bot builds; no `.github/workflows/` edits by bots; artifact byte-identical for today's classes;
no new game art beyond the standing icon OK.

#### Waves and lane map (step 4)

At most five builds at a time. Serial lanes: **gen** P2 → P3 → P4 (the critical path), plus P9 (merged #396) → P10; **golden** P2, P4 (and 0.6.1's
F1, F5 when they run); **main.js** P6 (and 0.6.1's F2, F4). Shared files outside lanes, by After: `pack.js` P2 → P4 (gen
lane already orders them); build scripts P1 only. Critical path: P1 → P2 → P3 → P4 → R, gated by
`research-gladiator-guide` (P2) and `research-spiritmaster` (P3).

| Wave | Builds | After |
|---|---|---|
| 1 | P1 (none) ∥ S2 (none) ∥ P5 (none) | P5: `owner-ok-0.7-sync-rules` |
| 2 | P2 (gen, golden) | P1 + `research-gladiator-guide` + `owner-ok-0.7-artifact-classes` |
| 3 | P3 (gen) ∥ P6 (main.js, a11y) | P3: `research-spiritmaster` · P6: S2 + `owner-ok-0.7-S2` |
| 3b | P7 (a11y) | P6 (merged #378) |
| 3c | P8 (a11y) | P7 (merged #380); 0.6.1 waits for it |
| 3d | P9 (gen, a11y) | P8 |
| 3e | P10 (gen) | P9 (merged #396) |
| 4 | P4 (gen, golden) | P3, P1 + `owner-ok-0.7-artifact-classes` |
| 5 | R, alone | everything above, or moved to the next patch; `DATA OK 0.7.0` |

`owner-ok-0.7-artifact-classes` is met (DECISIONS 2026-10-18) and, since P9 (#396) stopped building the artifact, moot: it stays in the P2 / P4 After lines as a satisfied gate, so no re-spec is needed.

Checked: no two items in one wave own the same file. Waves are the expected order, not gates. An item whose owner
input isn't in when its wave is due moves to the next patch at once (K10).

#### Owner input (step 5)

Sent to Coordinator (Saul)'s daily list at pass start, 2026-10-18 7:35 AM ET (K10), typed in the Release planning
(Walter) thread:

1. **Second class** (token for P3: the class's research file; default Spiritmaster): "Yes: 0.7's second class is the
   Spiritmaster." or name the class someone will level to 45.
2. **Artifact classes** (`owner-ok-0.7-artifact-classes`, blocks P2 and P4; P1 itself keeps today's list): "0.7 artifact classes OK:
   the claude.ai artifact carries Assassin and Ranger only; new classes are site-only."
3. **Sync rules** (`owner-ok-0.7-sync-rules`, blocks P5; sync.md §6 S3, S5): 180-day retention; "Show sync code" on a
   syncing device. Typed as "0.7 sync rules OK: as recommended".
4. **Sync deploy** (blocks the deploy only): a Cloudflare API token limited to Workers and R2, added as
   `CLOUDFLARE_API_TOKEN`; then CI may deploy to `sync.daevacompanion.com`.
5. **S2 mockup** (`owner-ok-0.7-S2`, blocks P6; the 0.5 `owner-ok-S2` row would otherwise match): asked when S2 merged
   (#357, 7:52 AM ET), typed as "0.7 S2 OK: as recommended".
6. **Proposed additions** (new features, so the owner's call; recommended: (a) only): (a) a class choice on the
   welcome card (#333 note 3); (b) a Ranger rotation section (#333 note 5, needs research); (c) story quests in
   Progress (#321 note 5); (d) a shorter phone header in Advanced mode (#321 note 10).

Decisions this pass recorded (for the tracker):

- **Claude remediated:** P1's build-time class list, today's two (audit 2; offering site-only classes is the owner's, input 2); second class defaults to the
  Spiritmaster by D8 (audit 6); sync deploy is a Build Pipeline task.

#### Alongside (not #114 items)

- **Research sessions** started 2026-10-18 at pass start: `research-spiritmaster`
  (`docs/research/2026-10-spiritmaster-pack.md`), `research-gladiator-guide` (`docs/research/2026-10-gladiator-guide.md`),
  and for 0.6.1 F5 `research-ranger-icons` (`docs/research/2026-10-ranger-icons.md`).

### 0.8 — The last four classes, icons for every class

Planning pass written 2026-10-19 (Release Planner). It came after Player Testing's full play of 0.7.0 (#441) and Kaizen's
release review ([docs/kaizen/0.7-scorecard.md](docs/kaizen/0.7-scorecard.md), PR #443; KAIZEN REVIEW DONE 0.7.0, 6:16 AM ET;
changes K15–K18), in the order the owner set on 2026-10-18 at 11:21 PM ET. Item specs:
[docs/plans/0.8/README.md](docs/plans/0.8/README.md). **Nothing is queued until the owner's morning OK** (owner,
2026-10-18 11:15 PM ET; DECISIONS "Overnight: everything up to 0.8 builds"). **Redrawn 2026-10-19 8:30 PM ET** at the owner's
tinkering stop: he chose all four remaining classes for 0.8 (DECISIONS "0.8 takes all four remaining classes"), so the
Sorcerer and the Chanter join as P16–P19, and the label item P20 joins from Game Data Check's #472 review.

#### Audit (step 2), against `main` at `v0.7.0`

Path to 1.0 first:

1. **All four remaining classes in 0.8 (redrawn; first planned as two per minor).** Done: Assassin, Ranger (0.6),
   Gladiator and Spiritmaster (0.7). As first planned, 0.8 would take two of Templar, Sorcerer, Cleric and Chanter, and 0.9 the other two. Per D8, the class the owner plays
   comes first. His Templar key screens are in (`/mnt/project-files/owner-screens/2026-10-18/templar/`), so the
   **Templar** is first. Data coverage then picks the **Cleric**: 7 candidate guides and 3 Metabot builds, against the
   Sorcerer's 6 and 3 and the Chanter's 7 and 0 (classes-and-gaps §2.2). Both research sessions started at pass start
   (K10/K15). **Redrawn:** the owner chose all four (2026-10-19 8:30 PM ET). His Lv 4 skill screens, checked by Game Data
   Check, already give the Sorcerer and Chanter unlock levels, icon ids and default keys
   (`/mnt/project-files/owner-screens/2026-10-19/`); `research-sorcerer` and `research-chanter` add the rest (stigmas,
   specializations, boards, passives, two-source advice, icon files). Templar research took about 35 min and Cleric's
   about 1 h 40 min. The Chanter has no Metabot build sample, so its advice is thinner and labelled. All eight classes
   then ship in 0.8, and 0.9 no longer adds classes.
2. **A class must ship with its icons.** Gladiator and Spiritmaster went live with letter squares, and the 0.7.0 CHANGELOG
   said they had icons (#441-4). Two causes: the research packs saved no icon files, and nobody checked the CHANGELOG
   against `docs/ISSUES.md`. Changed here: every class research brief now saves the class's skill and stigma icons from
   Metabot under the standing icon OK. P1 adds the 29 that are missing. K17 checks the CHANGELOG. The 0.7.0 section is
   corrected in this PR.
3. **Sync is built but switched off.** The deploy still waits on the owner's Cloudflare token (0.7 owner input 4). That
   is not a 0.8 item; it stays on the owner's list for whenever he wants sync on.
4. 1.0 and 1.1 are unchanged.

Then 0.8:

5. **The site page's gzip budget is at 95%** (below), past the step-2 line of 20% from the limit, so 0.8 carries a
   performance item (P6). Sync's UI code ships to every visitor, yet stays hidden until the server is switched on
   (`SYNC_LIVE` false). Loading it on demand takes its weight out of the first page.
6. **Owner OKs set 0.7's pace** (540 idle minutes, scorecard §1). Under K15, every OK 0.8 needs is in step 5 below as one
   batch, with one copy box, in one thread. Items that need no OK run first. A gated item whose OK isn't typed by the
   time its lane is free goes to the end of the queue.
7. **Player findings get a decision each** (K18), in the table under step 5.

**Budget trend** (`npm run build`):

| | 0.6.0 | 0.7.0 | Limit | Use |
|---|---|---|---|---|
| Site page (index + largest class chunk) | 714,616 B | 752,614 B | 870,000 B, blocking | 87% |
| same, gzip -9 | 177,657 B | 189,634 B | 200,000 B, blocking | **95%** |

Class chunks are 132–148 KB each and stay out of `index.html`, so the two new classes don't add to the page. Icons are
files, not inline.

#### Items (step 3)

Keys are `0.8 P<n>` (kickoff). Models follow #114's routing: Opus for L items, for anything under `src/core/**` and for
the build script; Sonnet otherwise. Stall limits are 0.7's (S 44, M 80, L 120 min); the scorecard has no newer
build times that would change them. Each item's problem, result, no-gos, acceptance and files are in
[docs/plans/0.8/README.md](docs/plans/0.8/README.md).

| Item | Problem → result | Size | Model | Lanes | After (real dependencies only) |
|---|---|---|---|---|---|
| P1 | Gladiator and Spiritmaster show letter squares (#441-4) → their 29 Metabot icons | S | Sonnet | gen, golden | `research-gl-sm-icons` |
| P2 | No Templar pack → class data from research, hidden | L | Opus | gen | `research-templar` |
| P3 | Templar has no advice → guide pack, golden, site picker | L | Opus | gen, golden | P2 |
| P4 | No Cleric pack → class data from research, hidden | L | Opus | gen | `research-cleric` |
| P5 | Cleric has no advice → guide pack, golden, site picker | L | Opus | gen, golden | P4, P3 (`pack.js`) |
| P6 | gzip budget at 95% → sync UI loads on demand, page under 90% | M | Opus | site | none |
| P7 | Phone: Undo toast 6 px over the tab bar (#321-2), level-up chip over the name box (#441-7) → neither overlaps | S | Sonnet | app.css, a11y | none |
| P8 | New character's "Your level" shows two "Start at Lv 1" buttons (#333-1) → the two read differently | S | Sonnet | welcome, a11y | none |
| P9 | Key setup follow-ups from the #424 review: fit test at 390 px only, chips read after all 12 cells, long names → 1500 px test, a label per column, names wrap | S | Sonnet | build-card, a11y | none |
| P10 | Icons sit loose in Next up cards (#421) → on phones the icon box sits beside the title, lines run full width under it, and Show moves into the title row so the card is about 30 % shorter (owner A, 2:39 PM ET; Design Lead round 2, `tracker/mockups/0.8-owner-ok-v2/` §1 and `1c-icon-balance.png`); desktop unchanged | S | Sonnet | nextup.css | `owner-ok-0.8-icon-fit` (met, 2026-10-19 1:36 AM ET), `owner-ok-0.8-icon-box` |
| P11 | Map markers on Next up tiles read small → sized by the visible emblem (Design Lead mockup, DESIGN OK 4:47 AM ET) | S | Sonnet | nextup.css | `owner-ok-0.8-marker-size` |
| P12 | First-time players don't see the class choice (#333-3) → a class picker for all 8 classes on the welcome card: 8 badges (`radiogroup`), Metabot class emblems, "Soon" and not pickable for classes with no guide (owner A, 2:35 PM ET; Design Lead round 2, §3) | M | Sonnet | welcome, a11y | `owner-ok-0.8-welcome-class` |
| P13 | Regional quests and the extract tip lack the game's icons, and the click-twice box hides its second state → the state icon (#409: the owner's star crop, Metabot's `quest_district`, ✓) replaces the box, marked by one "Picked up" / "Turned in" / Undo button, in milestone rows and the Next up card, where every quest row also shows its map pin left of the button and long names are cut with "…"; the ✓ is a centred SVG (owner A, 2:36–2:40 PM ET; `2b-check-fix.png`, `2c-map-pin.png`), same `started`/`checks` data, no save change; extract flask unchanged (Design Lead round 2, §2 and §4) | L | Opus | gen, golden, nextup.css, rows | `owner-ok-0.8-crop-icons` |
| P14 | Key setup and macro steps don't match the game (#387) → the game's grid, the macro on right click, Shadowstrike on E | M | Opus | gen, golden, build-card, a11y, rows | `research-387-macro` |
| P15 | Auto level-up fires at the wrong level (#401) → it uses the level the quest is turned in at | M | Opus | gen, golden | `research-401-levels` |
| P16 | No Sorcerer pack → class data from research, hidden | L | Opus | gen | `research-sorcerer` |
| P17 | Sorcerer has no advice → guide pack, golden, site picker | L | Opus | gen, golden | P16, P5 (`pack.js`) |
| P18 | No Chanter pack → class data from research, hidden | L | Opus | gen | `research-chanter` |
| P19 | Chanter has no advice → guide pack, golden, site picker | L | Opus | gen, golden | P18, P17 (`pack.js`) |
| P20 | Unverified values show with no label (the compiler drops `fieldStatus`; #472 review) → rendered disputed and owner-check fields say "check in game", inferred ones "inferred" | S | Sonnet | gen, golden, nextup.css, rows | none |
| R | Release 0.8.0 | S | Sonnet | release, alone | everything above, or moved to 0.8.x; `RC PLAY DONE 0.8` read; `DATA OK 0.8.0` |

Not bot items (they run alongside): Game Data Check does the research gates `research-gl-sm-icons`, `research-387-macro`
and `research-401-levels`, plus #329 (the ◆ 5th stigma specialization), her tip:extract data nits and the #325 data audit
PRs. Research sessions do `research-templar` and `research-cleric`. Source Vetting does #317. Tracker work (Reports tab,
Tracker 2.0) has no app version.

No-gos for the whole minor: no save break (`companion-save-v5` stays); no AION 2 term in the engine; no game data without
its source; no fetching in bot builds; no `.github/workflows/` edits by bots; no new game art beyond the standing icon OK
and the owner's crop and marker OK (P13) and the class emblems his class answer approves (P12). Campsite and
point-of-interest markers are held: the crops are the game's zone labels, and no place record has a kind yet (Design Lead, 6:23 AM ET; 0.6.2 Q5). They need a data item first (`kind` on
places), a 0.9 candidate.

#### Waves and lane map (step 4)

At most five builds at a time. Serial lanes: **gen** P1 → P2 → P3 → P4 → P5 → P16 → P17 → P18 → P19 → P20 → P13 → P14 → P15 (every
item that touches `data/`); **golden** the same items; **a11y** P7 → P9 → P8 → P12 → P14; **nextup.css** P10 → P11 → P20 → P13;
**rows** (`rows.js`) P20 → P13 → P14;
**welcome** P8 → P12; **build-card** P9 → P14; **site** P6 alone. Critical path: `research-templar` (in, #447) → P2 →
P3 → P4 → P5 → P16 → P17 → P18 → P19 → P20 → P13 → P14 → P15 → R, i.e. the whole gen lane (the last two packs wait on
`research-sorcerer` and `research-chanter`, started 2026-10-19 8:35 PM ET). P20 also edits
`src/styles/packs/aion2/areas.css`, `skills.js` and `skills.css`, which no lane owns; P13 also edits `areas.css`, after P20 on the same serial lanes. The gen/golden lane is the bottleneck: the non-class items on it (P13, P14, P15) run after the class
packs, since those are the minor's point.

| Wave | Builds (no owner OK needed first, K15) |
|---|---|
| 1 | P6 (site) ∥ P7 (app.css, a11y) ∥ P1 (gen, golden) |
| 2 | P9 (a11y, build-card) ∥ P2 (gen) ∥ P10 → P11 (nextup.css; gated) |
| 3 | P8 (a11y, welcome) ∥ P3 (gen, golden) |
| 4 | P12 (a11y, welcome; gated) ∥ P4 (gen) |
| 5 | P5 (gen, golden) |
| 6 | P16 (gen), then P17 (gen, golden) |
| 7 | P18 (gen), then P19 (gen, golden) |
| 8 | P20 (gen, golden, nextup.css, rows) |
| 9 | P13 (gen, golden, nextup.css, rows; gated) |
| 10 | P14 (gen, golden, build-card, a11y, rows) |
| 11 | P15 (gen, golden), when its level notes are in |
| 12 | R, alone, after the CHANGELOG draft (K17), `RC PLAY DONE 0.8` and `DATA OK 0.8.0` |

Checked: items in one wave that own the same file run serially within the wave (waves 6 and 7: P16 then P17, P18 then
P19, on gen). Waves are the expected order, not gates. Under K15, a gated item
(P10, P11, P12, P13) whose OK isn't typed by the time its lane is free moves to the end of the queue, not waited on. An item
whose research isn't in by the time the rest has merged moves to 0.8.x. Both research packs are in (Chanter #486, Sorcerer
#487). If the Sorcerer or Chanter isn't verified when the rest of 0.8 is ready, 0.8.0 ships with the classes that are and the
rest follows in a 0.8.x patch (owner, 2026-10-19 9:14 PM ET; DECISIONS).

**After 0.8.0 ships (not a bot item):** team-audit rec 4, moving rules out of #114 to their owners' homes, put in
place by Kaizen (Gale) through each rule's owner (owner, 2026-10-19 4:57 PM ET; `/mnt/project-files/audit-1.0/team-audit-1.0.md`).

#### Owner input (step 5)

**The go is given.** The owner typed it in the project chat on 2026-10-19 at 8:55 PM ET, for this four-class plan:
"i guess go ahead an launch to 0.8 when walt is done planning / adding the new classes to the plan". It records
`owner-ok-0.8-go` (T-50, build only), effective when this redraw merges; the planner then queues 0.8 in #114. The
earlier line "0.8 OK: build as planned" no longer applies. The looks were Design Lead's To-do (T-51, round 2
after the owner's 2:13 PM ET notes on the first-round looks, which T-50 carried until it was re-cut; boards and spec
in `/mnt/project-files/tracker/mockups/0.8-owner-ok-v2/`), answered on the boards, so no looks line is needed: "icon"
recorded `owner-ok-0.8-marker-size` (P11) and `owner-ok-0.8-icon-box` (P10), "quest" `owner-ok-0.8-crop-icons` (P13,
with Metabot's `quest_district` map marker, which the 0.6.2 map-icons OK didn't cover), "class"
`owner-ok-0.8-welcome-class` (P12, with the Metabot class emblems).
The owner answered all three on the boards, 2:35–2:40 PM ET, each A (DECISIONS rows), with his own tweaks that Design
Lead drew: P10 also balances the phone card (Show in the title row, `1c-icon-balance.png`); P13 builds the centred SVG
check (`2b-check-fix.png`) and a map pin on every Next up quest row, left of the button, long names cut with "…"
(`2c-map-pin.png`). The Design Critic then reviewed the looks, and the owner answered T-58 on the v4 boards, 8:25–8:44 PM ET
(`/mnt/project-files/tracker/mockups/0.8-owner-ok-v4/`; DECISIONS "0.8 look changes after the Design Critic"): verb
buttons "Pick up" / "Turn in" (green) with Undo in a fixed action column, the Regional quests tile shows today's ❖ in white on green, the state icons share
one centre line, and the selected class is marked by highlight only. The go and the looks are independent: ungated
items build on the go alone.

Not OKs, but only the owner can do them. None blocks a wave:

- **Level notes for #401** (P15): your level before each story-quest turn-in from Lv 1 to 10. Without them, P15 moves
  to 0.8.x.
- **Two in-game checks for #387** (P14; Game Data Check's #387 comment has the steps): whether the right-click macro
  replaces "hold both clicks", and whether Shadowstrike alone on E is the game's default or your own layout. Without
  them, P14 moves to 0.8.x.
- **A usage reading at each release** (scorecard blind spot): the weekly % from Settings → Usage.

**Player findings (K18), each with a decision:**

| Finding | Decision |
|---|---|
| #321-2 Undo toast still 6 px over the phone tab bar | 0.8 P7 |
| #321-4 default name `<class>-lvl<N>` | Won't fix: the owner's label design (2026-10-16), kept on purpose. The owner can override it in the debrief. |
| #333-1 two "Start at Lv 1" buttons | 0.8 P8 |
| #333-2 a new character skips the welcome | Won't fix: intended; whoever adds a second character already knows the app |
| #333-3 class choice hard to find | 0.8 P12 (owner OK in the batch) |
| #441-4 letter-square icons; CHANGELOG claimed icons | 0.8 P1; the 0.7.0 CHANGELOG line is corrected in this PR |
| #441-5 Gladiator "Rotation" vs `docs/ISSUES.md` | Doc wording fixed in this PR: since 0.7 P11 the section shows the game's default keys, by design |
| #441-6 tutorial-skill refund step only for the Assassin | Won't fix in 0.8: no source for the other classes' tutorial skill. Game Data Check looks for one on Metabot; if she verifies it, it becomes a 0.8.x data item. |
| #441-7 level-up chip over the name box on phone | 0.8 P7 |

**Targets for 0.8** (scorecard §2): ≤ 30 min per item PR from plan merge to release merge; ≤ 1.08 build attempts per
item; first-pass success ≥ 85%; ≤ 60 min idle on owner OKs; ≤ 4 hand interventions; ≤ 12 typed owner OKs in ≤ 2
threads (this plan asks for one line).

Decisions recorded on the tracker:

- **Claude remediated:**
  - ~~0.8 classes default to Templar and Cleric (D8, audit 1)~~ replaced: the owner chose all four (user remediated);
  - the label item P20 (CLAUDE.md data policy, #472 review);
  - the performance item P6 (audit 5);
  - the won't-fix decisions above;
  - class research now saves icons (audit 2).

#### Alongside (not #114 items)

- **Research started at pass start** (2026-10-19 ~6:35 AM ET):
  - `research-templar` (`docs/research/2026-10-templar-pack.md`) and `research-cleric` (`docs/research/2026-10-cleric-pack.md`), research sessions;
  - Game Data Check (all in by 6:53 AM ET, PR #444):
    - `research-gl-sm-icons` is in: 29 icons, provenance rows.
    - `research-387-macro` needs the owner's game (owner input above).
    - #329: the ◆ 5th specialization has no item or level in the client data, so it stays out of the guide
      (`docs/research/2026-10-stigma-specialization-5.md`; that it can't be reached is inferred).
- **Tracker work, outside the app versions** (owner, 2026-10-18 11:27 PM ET; no app version, no #114 line, no app release
  gate): **Tracker: Reports tab** now (Design Lead designs it, Tracker Design builds what she approves, the morning
  debrief reports land there), then **Tracker 2.0**, a redesign of every tab, as a side project.

### 0.8.1 — data and bug fixes after 0.8.0 (Release Planner, 2026-10-20)

A patch, no planning pass. From the owner's Lv 39 notes (2026-10-20 12:18 PM ET), Player Testing's RC report #586 and
Game Data Check's research (#570, #584). Specs: [docs/plans/0.8.1/README.md](docs/plans/0.8.1/README.md).

- **F1** Assassin Daevanion: cost boxes pre-filled from the owner's boards, Combat Speed corner, on-path rows (gen, golden).
- **F2** A labelled specialty pick in every guide skill's slot 2 (gen, golden).
- **F3** Specialty rows placed by effective skill level (golden, golden-nextup; after F1).
- **F4** RC play fixes: page title on class pick, a tooltip typo, one legend per card (a11y, golden).
- **F5** Gladiator and Ranger rotation icons (gen; after Game Data Check commits the files).
- **F6** Size trim: page gzip under 90% of its budget, no visible change.
- **F7** Respec buttons in Basic (app.css, golden). **F8** Recommended specialty in Next up, also after a respec (golden,
  golden-nextup; after F3). Both are new looks; the owner said "now" on 2026-10-20 at 4:28 PM ET (DECISIONS).

Also: #585 (simpler link preview) merged after the v0.8.0 tag. Release: `PRE-RELEASE CHECK 0.8.1`, then the release
item after `DATA OK 0.8.1`; no RC play or freeze for a patch. Owner notes 9–16 go to the 0.9 pass (triage in #232).

### 0.9 — Ready for 1.0: saves, labels, late starters

Planning pass written 2026-10-20 (Release Planner). It came after Kaizen's release review
([docs/kaizen/0.8-scorecard.md](docs/kaizen/0.8-scorecard.md); `KAIZEN REVIEW DONE 0.8`, 4:39 PM ET; changes K19–K26) and the
owner's yes to its batch (DECISIONS 2026-10-20: K19 GO, K23 one box, K24 fresh reviews, the outside audit trial). Item
specs: [docs/plans/0.9/README.md](docs/plans/0.9/README.md). Step 2 is the full pre-1.0 architecture, performance and UX
audit (three audit reports of 2026-10-20, in the project's shared folder; every fact a build needs is copied into its
spec). The owner's standing OK until 1.0 (5:13 and 5:15 PM ET) is the build go (`owner-ok-0.9-go`): items are queued once
this plan is reviewed and merged.

#### Audit (step 2), against `main` after 0.8.1 F6

Path to 1.0 first:

1. **Three more minors, then 1.0 (estimate).** All eight classes shipped in 0.8. What 1.0 still needs: foundations
   that must land before saves turn strict (0.9); the endgame guide past Lv 45, which the owner made a 1.0 requirement
   at 5:40 PM ET (0.10, research starting now); and the 1.0 look with the microscope pass over everything (0.11). The
   owner's design review for 1.0 (2026-10-19 1:57 PM ET: the app mustn't "look like AI made it"; a beginner must
   understand it) is "likely most of a minor" in Design Lead's notes, with its blind check run during 0.9. If that
   check or the endgame research finds more than a minor's work, the count grows by one.
2. **Saves turn strict at 1.0, and save keys still come from names and positions** (architecture audit F1: gen.mjs:108,
   gen.mjs:438, journey.js:106,113, gen.mjs:183). A typo fix in a quest name moves a player's ticks. 0.9 makes the last
   clean break (P2) and adds the load safety net and a key ledger (P9, P10). The frozen per-class save fixtures are
   captured at 1.0 itself.
3. **Correctness tests cover the Assassin only** (F3), and every class release edited hand-kept lists in the tests (F4,
   Kaizen K22). P3, P11 and P12 make the tests read the class list from the data and run the invariants on all eight.
4. **Unverified values show unlabelled** (Game Data Check's K25 audit, #607: 230 fields). A policy gap (CLAUDE.md), so P1
   leads the queue.
5. **A real company's release safety net** (team audit §8, owner 2026-10-20 3:06 PM ET: "run the way a real company
   would"): staging before 1.0 (owner tap 4:33 PM ET; S4, needing the owner's answers below), a scripted live-site check
   (S2), a CI path for the sync server (S3), a rollback drill on staging, an incident runbook and an owner-settings
   checklist. A closed beta with real players (§8e) is the owner's call for 0.11.
6. 1.1 is unchanged.

Then 0.9:

7. **Budgets.** gzip and elements are both at 89%, within 20% of their limits, so 0.9 carries a performance item (P5).
   The performance audit projects 0.9's new UI at +9 to +18 K gzip (94–98%) and says 1.0 very likely crosses without
   action. No build-only trims are left. P5 corrects the measuring tool and cuts repeated writes. P23 moves the Sources
   lists into a chunk that loads when the card opens, gated on the process-change procedure (outside review), not the owner, because it changes how the credit links load.
   No budget raise in 0.9; a reasoned raise is the 1.0 fallback.
8. **The owner's Lv 39 notes** (2026-10-20 12:18 PM ET): notes 1–8 went to 0.8.1. Notes 9–12 are design items (P19–P22,
   on Design Lead's mocks and the owner's look OK). Notes 13–15 are Game Data Check research, then data (P17, P16, P18).
   Note 16 went to Kaizen.
9. **UX audit findings** (Lv 39 late start, all classes): the slider path locks the board cards (P7), Ranger and
   Spiritmaster show no specialty step (P15), small text and colour fixes (P8), Basic hides the catch-up tools and early
   chores crowd Next up (P21). Finding 10 (letter-square icons) is fixed by 0.8.1 F5. Finding 12 (the same step in three
   places) is a design question for the 1.0 look (0.11).

**Budget trend** (`npm run build`; elements from `tests/site.js`; `update()` from `tests/perf.js`, one noisy local run):

| | 0.7.0 | 0.8.0 | after 0.8.1 F6 | Limit | Use |
|---|---|---|---|---|---|
| Site page (index + largest class chunk) | 752,614 B | 747,379 B | 727,830 B | 870,000 B, blocking | 84% |
| same, gzip -9 | 189,634 B | 185,395 B | 178,793 B | 200,000 B, blocking | **89%** |
| Elements, 390 px fresh | 4,963 | 5,517 | 5,517 | 6,200, blocking | **89%** |
| `update()` median | 11.4 ms | 11.9 ms | 12.4 ms | 15 ms, advisory | 84% |

#### Items (step 3)

Keys are `0.9 P<n>` (kickoff). Models follow #114's routing (Opus for `src/core/**`, saves, `tools/gen`, golden, `scripts/`
and L items). Stall limits are 0.8.1's (S 44, M 90, L 120 min); no 0.8 build hit a limit (rules audit PIP-10). **FR** marks
the `fresh-review` label (K24). S1–S4 are pipeline items Build Pipeline builds in its own thread (bots don't edit
workflows).

| Item | Problem → result | Size | Model | Lanes | After (real dependencies only) |
|---|---|---|---|---|---|
| P1 | 230 visible values the data marks unverified show with no label (#607) → every one carries "check in game" / "inferred" | M | Opus | gen, golden, rows, skills-card, build-card, nextup-card, daevanion-card | none (input: #607's audit file) |
| P2 FR | Save keys come from names and positions → stable ids, `companion-save-v6`, the last clean break | L | Opus | gen, golden, mig, nextup-card, journey-card | none |
| P3 | Each class release edits test lists by hand (K22) → tests read classes from the data | M | Sonnet | schema, e2 | none |
| P4 | 33 unused names, the deleted artifact's export branch, a narrow term scan → removed, scan widened | S | Opus | main.js, page-card | none |
| P5 | `--sizes` overstates tables 8x, `update()` repeats identical writes → measured right, writes skipped | M | Opus | site, skills-card, nextup-card, page-card, architecture, build-card, daevanion-card | none |
| P6 FR | Data suite 12.7 s, invariant 89 s, ledger inside schema → faster, ledger its own suite | M | Opus | gen, schema, run-mjs | none |
| P7 | Slider to Lv 39 leaves story at Lv 2 and boards locked → Journey asks for the story quest | M | Opus | journey-card, nextup-card, golden-journey, golden-nextup | none |
| P8 | Point counts disagree, a doubled accessible name, Spent green vs pink, key hint cut at 390, E grid shows unequipped stigmas → fixed | S | Opus | app.css, a11y, skills-card, build-card, nextup-card, golden-nextup | none |
| P9 FR | A newer or unreadable save can be overwritten → read-only banner, copy kept, migration flags | M | Opus | mig, main.js, save, architecture | P2 |
| P10 FR | A removed save key fails nothing → committed key ledger, `gen:check` fails without `retired` | M | Opus | gen, schema | P2 |
| P11 | Class roster and golden groups written by hand → generated | M | Opus | gen, golden, save | P2, P3 |
| P12 | Invariants run on the Assassin only → all eight classes | L | Opus | golden | P11, P6 |
| P13 | Game facts in code (key order, unlock text, `altgard`) → in data | M | Opus | gen, golden, build-card, nextup-card | P2 |
| P14 | ARCHITECTURE drifted → matches a fresh run, describes the 1.0 save contract | S | Sonnet | architecture, run-mjs | P9, P10 |
| P15 | Choice points with no pick (Ranger and Spiritmaster specialties, slots 2–3, effective level) → gen check (K25) and sourced picks | M | Opus | gen, golden, skills-card, nextup-card | `research-choice-points` |
| P16 | Board paths and costs checked for the Assassin only (note 14) → every class | M | Opus | gen, golden, daevanion-card | `research-node-paths` |
| P17 | Assassin E stigma stack on one key? (note 13) → research answer applied | S | Opus | gen, golden | `research-e-stack` |
| P18 | Rotation lists order, not play (note 15) → "how it plays" text per class | M | Opus | gen, golden, build-card | `research-rotation-play` |
| P19 FR | Lv 39 join: 70–77 skill clicks in unlock order (note 10) → one row and one tap per skill | L | Opus | skills-card, nextup-card, app.css, golden, golden-nextup | P15 (input: `docs/design/0.9-catchup/`) |
| P20 FR | Daevanion ~22 ticks, no per-board or Stigma respec (note 9) → board rows, respec per board and all, Stigma respec | M | Opus | app.css, golden, daevanion-card | P16, `research-respec` (input: `docs/design/0.9-catchup/`) |
| P21 | Two views (Basic / Advanced) to maintain; Basic hides catch-up tools; Lv 4–16 chores lead Next up → one view, folds, chores folded | L | Opus | main.js, nextup-card, page-card, daevanion-card, app.css, golden, golden-nextup | none (input: `docs/design/0.9-one-view.md`, `docs/design/0.9-catchup/`) |
| P22 FR | Key setup inline with small icons, keys fixed (notes 11, 12, #388) → a sheet, icons fill each box, players rebind keys | L | Opus | gen, build-card, app.css, a11y, golden, mig, save | `research-bindable-keys`, `research-skill-bar`, `owner-ok-0.9-key-grid` (input: `docs/design/0.9-keys/`, `docs/design/0.9-keys-macro.md`) |
| P23 | Sources lists weigh 9.6 K gzip and 1,088 elements while closed → load on open | M | Opus | site, page-card, e2 | `research-sources-credit` |
| P24 | No Terms of Use; robots.txt allows AI training crawlers → `TERMS.md` linked in the footer, training crawlers blocked | S | Sonnet | site, page-card | P23, `owner-ok-0.9-terms` |
| P25 | Nothing checks for foreign licence headers or files (CK-1) → `tests/compliance.mjs` fails on them | S | Sonnet | schema, compliance, run-mjs | none |
| P26 | PRIVACY.md's save key can go stale (CK-3) → a check that it names the code's key | S | Sonnet | schema, compliance | P2, P25 |
| P27 | Icons can ship without a provenance row (CK-2) → missing rows added from research, then a check | S | Sonnet | schema, compliance | P25, `research-icon-provenance` |
| P28 | Hiding a class still needs test edits (P3 run, #689) → hidden dirs and the idle check read from the data | S | Sonnet | schema, e2 | none |
| P29 | A hidden class is still offered and opens from a save (#689) → class list from the data, no chunk, save opens on the character list | M | Opus | gen, e2, architecture | P11, P28 |
| P30 | P5 cut identical writes 17% of a 25% target (#684) → Stigmas, Journey, Areas, Daevanion lists skip them too | M | Opus | stigmas-card, journey-card, daevanion-card, nextup-card, site | P5 |
| P31 | 106 quotes miss their hosts' terms (Legal's C7) → credited or paraphrased from research tables, then a gen check | M | Opus | gen, golden | `research-quotes-c7` |
| S1 FR | Golden shares a shard → its own shard | S | Gus | ci | P6 |
| S2 FR | Nothing checks the live app works → scripted journey after each deploy and every 6 h | S | Gus | ci | none |
| S3 FR | Sync server deployed by hand → CI tests and dry run, deploy on the owner's token | M | Gus | ci | none |
| S4 FR | No staging → `/staging/` from main, root from tags | M | Gus | ci | `owner-ok-0.9-staging` |
| R FR | Release 0.9.0 | S | Sonnet | release, alone | everything above, or moved; GO 0.9.0 |

Not bot items (they run alongside): Game Data Check does the four research gates, naming each file with its slug
(`choice-points`, `node-paths`, `e-stack`, `rotation-play`, and Design Lead's data asks `respec` and `bindable-keys`) so kickoff finds it;
from the 0.9 additions also `skill-bar` (`docs/research/2026-10-skill-bar.md`, the macro and skill-bar ruling, gates P22)
`icon-provenance` (`docs/research/2026-10-icon-provenance.md`, gates P27), both started by the Release Planner's ask,
and `quotes-c7` (`docs/research/2026-10-quotes-c7.md`, Legal's C7 tables, gates P31; the Metabot table after Legal's blind sample);
Design Lead writes `docs/design/0.9-keys-macro.md` (P22's input); plus the owner's Vaizel Assault Stance
(4 or 5) re-check. Design Lead mocks the catch-up flow (notes 9, 10 and UX findings 4, 6–8) and the key setup sheet
(notes 11, 12), tagged for fresh review; a Design Critic briefed by Design Review reads them before the owner does. Design
Lead and Source Vetting run the 1.0 look's blind check (3–5 people, a non-gamer among them) for 0.11. Watchdog and Build
Pipeline write the incident runbook; Build Pipeline the owner-settings checklist and, once S4 is live, the rollback
drill. Tracker Sync and Tracker Design move the tracker to one GitHub poll every 20 min (0.8 scorecard: tracker threads
used 28% of project tokens). The outside "Daeva audit" trial is an owner To-do (below).

No-gos for the whole minor: one save break only (P2, `companion-save-v6`), and no other key change after it; no AION 2
term in the engine; no game data without its source or label; no fetching in bot builds; no `.github/workflows/` edits by
bots; no new game art beyond the standing icon OK; no budget raise.

#### Waves and lane map (step 4)

At most five builds at a time. Ungated items queue first; gated ones go last and never hold a lane.

- **Wave 1 (at the go):** P1, P2, P3, P4, P5, P6, P7, P8 and S2, S3. Queue order P1 → P2 → P3 → P7 → P8 → P4 → P5 → P6, so the
  queue runs top-down: P1 and P3 start at once; P2, P7 and P8 wait for P1 on nextup-card (P8 also on skills-card and
  build-card), and kickoff serialises them from their queue-line lanes.
  Serial lanes: **gen** P1 → P2 → P6 → P10 → P11 → P13 → P15 → P16 → P17 → P18 → P22 → P29 → P31; **golden** P1 → P2 → P11 → P12 → P13 → the
  research items → P19 → P20 → P21 → P22 → P31; **skills-card** P1 → P8 → P5 → P15 → P19; **nextup-card** P1 → P2 → P7 → P8 → P5 → P13 → P15 →
  P19 → P21 → P30; **page-card** P4 → P5 → P21 → P23 → P24; **mig** P2 → P9 → P22; **schema** P3 → P6 → P10 → P25 → P26 → P27 → P28; **app.css** P8 → P19 → P20 → P21 →
  P22; **build-card** P1 → P8 → P5 → P13 → P18 → P22; **daevanion-card** P1 → P5 → P16 → P20 → P21 → P30; **a11y** P8 → P22; **site** P5 → P23 → P24 → P30; **golden-nextup** P7 → P8 → P19 → P21; **journey-card** P2 → P7 → P30; **main.js** P4 → P9 → P21; **ci** (Gus) S2 → S3 → S1 → S4. Shared test and doc files: **save** (`tests/save.js`) P9 → P11 → P22; **e2** (`tests/e2test.js`) P3 → P23 → P28 → P29;
  **run-mjs** (`tests/run.mjs`) P6 → P14 → P25 → S1; **architecture** (`docs/ARCHITECTURE.md`) P5 → P9 → P14 → P29 (plan review, #609; P29 also shares `src/core/state.js` and `tests/core/state.test.mjs` with P9). **compliance** P25 → P26 → P27; **stigmas-card** P30.
- **Wave 2 (after P2):** P9, P10, P11, P13, P26; then P12 (after P11 and P6) and P14 (after P9 and P10). P25 and P28
  (no gate) queue with this wave, P29 after P11 and P28, P30 after P5.
- **Wave 3 (as research lands):** P15, P16, P17, P18, in the order their files land.
- **Wave 4 (as mocks and OKs land):** P19, P20 on the catch-up mock; P21 on the one-view hide list and the mock; P22 on the keys mock, the skill-bar file and Design Lead's macro note; P27 on the icon-provenance file; P31 on the quotes-c7 file; P23 on the sources-credit verdict; S4 once #609 merges.
- **Critical path:** P2 → P11 → P12 → R (L + M + L, about 5.5 h of build at the stall limits, plus review). It runs
  through no owner gate and no research. A gated item whose OK isn't typed by the time the rest is done moves to 0.10
  rather than holding the release.

Files two items share are split by lane above; P1 and P5 both touch `skills.js` and run one after the other on
**skills-card**. P2 and P13 both touch `nextup.js` (pack) and `build.js` (data) and run in that order on **gen**.

#### Owner input (step 5)

Under the standing OK until 1.0 most of 0.9 needs nothing from the owner. What is left:

1. **Build go and staging: given.** The standing OK is `owner-ok-0.9-go` and covers staging on Build Pipeline's option B
   (`owner-ok-0.9-staging`: `/staging/` on the same site, hidden with `noindex` and a banner, no per-PR previews, $0 and
   no owner setup). The owner tests the 1.0 candidate there.
2. **Sources load when the card opens** (gates P23): no longer the owner's (5:24 PM ET). Source Vetting and an outside
   reviewer check that per-page credit links rendered on open still meet CLAUDE.md's credit rule and Metabot's terms, and
   write the verdict as a `docs/research/` file named with `sources-credit`. If they say no, a reasoned budget raise at
   1.0 is the fallback.
3. **Catch-up and key setup looks: Design Lead approves** (owner's card answer, 2026-10-20 5:21 PM ET; every look from
   5:24 PM ET). P19–P22 build from Design Lead's mocks (`docs/design/0.9-catchup/`, `docs/design/0.9-keys/`; #619 and #656),
   merged with the look OK after the fresh re-check. Design Lead made notes 11, 12 and player-chosen keys (#388) one design, so #388 moves
   from the 1.0 look into P22.
4. **Outside audit trial** (owner To-do: only the owner can do it): create the "Daeva audit" project with 7 days of Debug
   access.
5. **In-game check:** Vaizel Assault Stance, 4 or 5 nodes (Game Data Check's thread).
6. **Key grid order: given** (`owner-ok-0.9-key-grid`, 2026-10-20 10:16 PM ET: the game's order, row 0 at the bottom;
   gates P22).
7. **Weekly usage** at the 0.9.0 release (Settings → Usage; "Usage budget" in "How a minor is planned"), logged in #232.

### 0.10 — The endgame guide past Lv 45 (estimate)

**1.0 must ship it (owner, 2026-10-20 5:40 PM ET; DECISIONS "1.0 ships an endgame guide past the level cap; Elyos comes after 1.0 as a minor"):** a
"Next up" for max-level play, so a Lv 45 player completes daily and weekly objectives efficiently and is shown the next
most efficient step to raise gear score. It pulls the old 1.1 end-game tracker (daily and weekly checklists with their
resets) into the path to 1.0. Built on the engine as a module with no page-script edits; its saved data is new, and
pre-1.0 breaks are still allowed. Research starts during 0.9: Source Vetting (Lydia) vets the owner's reference
(Kanon's Aion 2 Bible, PDF in the project's shared folder, `research/endgame/`) and other sources, and Game Data Check
(Gretchen) verifies the resets, the daily and weekly content and the gear-score paths (two sources or labelled, as
everywhere). **World boss timers (owner, 2026-10-20 7:02 and 7:03 PM ET; DECISIONS "1.0 includes timers for the world bosses that
matter"):** for the world bosses that matter, picked by Game Data Check (Gretchen) from the owner's reference (Kanon's
Aion 2 Bible) and research, with Source Vetting (Lydia) doing every fetch outside the approved list. The spawn rules
(fixed times or random windows, server and time zone) must be sourced like any game fact; if they can't be, the
fallback is a manual "killed at" timer per boss, reported back before it is specced. Design Lead owns the look.
Items are shaped in 0.10's own pass once that research is in. Acceptance bar: the Vision (top of this file), so for a
Lv 45 character Next up always shows the best thing to do next.

**On the way and "Main path only" (Design Lead's calls after review, 2026-10-20 10:15 PM ET; the owner's 5:45 PM ask):**
Next up's headline stays one step, and an "On the way" line lists optional things nearby: same zone, open at your level,
sorted by distance where both ends have Metabot coordinates (every regional quest and stronghold, 72 of 87 story
quests; counted on main `d64296a` by the outside design critic, `design-review/critic-product-calls-2026-10-20.md`
finding 7, project files). The line names up to 3 kinds with counts and opens to the full list; a Skip is keyed by record id and undoable;
"Do it" ticks nothing, it only makes the item the headline. Journey and Areas stay inventory. One guide, no modes: the
Fastest / Completionist track toggle (0.5) is a named removal, replaced by one "Main path only" setting that carries the
track's drawbacks text while on. The adv and later cards that one view (0.9 P21) moves out of the headline land here.

### 0.11 — The 1.0 look and the microscope pass (estimate)

Design Lead's app design review for 1.0 (owner, 2026-10-19 1:57 PM ET): the blind check run in 0.9, a visual language
mocked and approved by Design Lead after a fresh or outside review (owner, 2026-10-20 5:24 PM ET), then built card by card. **Faction and class accent colours** (owner, 2026-10-20 5:32 and 5:35 PM ET; DECISIONS "Faction and class accent
colours"): faction is the base accent (Elyos teal, Asmodian violet, from the owner's image), class the second (the WoW
mapping approved 2026-10-13, values in `docs/research/colors-2026-10/`, never built), so each character's guide looks a
little different. Designed inside the 1.0 visual language by Design Lead, reviewed by Design Review and an outside
critic, built as a bot item. The Elyos layer is mocked but has no players until Elyos packs exist. Cards stop
reading each other's DOM (architecture audit C3), which makes "add a feature" cheaper. The same step shown in three places
(UX audit finding 12) is settled here. **Design questions the owner handed to Design Lead (2026-10-20 5:45 PM ET; answered below, after outside
review):** Next up also shows what else is nearby on the way, so completionists are served; one guide with ways to skip
what a player doesn't want, or separate fastest and completionist modes; whether Basic and Advanced merge into one better
view, so there aren't two views to maintain; and the new-user and new-character experience, including a premium opening
animation (the compass quill spinning). Decided after review (Design Lead, 2026-10-20 10:15 PM ET; outside critic and Design Review): one view
in 0.9 (P21), On the way and "Main path only" in 0.10, and the first run here. **First run and new character:** a short
opening (the Compass Quill draws in, its needle swings north, about 1.2 s) played over the rendered page, never gating
first paint or input, once per new character (not on a device sync), skippable, a still frame with reduced motion, no
fade on repeat loads; then faction, class and "Where are you?" (level or current story quest). It replaces the 0.6 S1
welcome: Q2 and Q6 carry into the flow, Q8 stays (once per new character), Q9 becomes "every step can be skipped".
Factions and classes without a complete guide show "coming" and can't be picked (Elyos today). Before the build, two
baselines are measured: time to interactive at 390 px throttled, and time to first action for a fresh Lv 1 and Lv 39. **Microscope pass (owner, 2026-10-20 5:24 PM ET):** before the 1.0 candidate, every
card, feature, element, section and function is reviewed against its purpose and the Vision (top of this file): Design Review (Holly) for looks, Code Review
(Howard) for code, Game Data Check (Gretchen) for data, Team Audit (Gomez) or an outside reviewer for the whole; each
finding is fixed or recorded as a decision before the candidate is cut. The ledger (Rules Steward, Francesca) and the
tracker (Tracker Design, Skyler; Tracker Sync, Huell) get the same review, every row, tab, card and definition, and stay
current (owner, 2026-10-20 5:26 PM ET). The bar: an outside auditor can look at any aspect of the project and grade it
A+, so every role, rule, process and record is clearly defined and findable. The 0.9 outside audit trial tests against
that bar. A closed beta with a few real players is the owner's call (team audit §8e). It comes after the endgame guide so
the new look and the microscope pass cover the endgame cards too. Planned in its own pass; if the blind check finds more
than a minor's work, it splits in two.

### 1.0

Full architecture, performance and UX audit (the planning pass in its full form), docs pass, all eight classes on the
engine, Asmodian, Lv 1–45, the endgame guide past Lv 45 (0.10), and timers for the world bosses that matter (0.10; owner, 2026-10-20 7:02 PM ET). 1.0 does not ship without the timers. One save fixture per class is frozen (`tests/fixtures/saves-1.0/`) and every later build must
load them. A reasoned budget raise if 0.9 to 0.11 land above 95%. The strict save rule returns (CLAUDE.md). The
owner tests the candidate and gives go or no-go; a no-go makes it the next minor (Versioning).

### 1.1 — Elyos (estimate)

The Elyos faction pack comes after 1.0 (Release Planner and coordinator, 2026-10-20, answering the owner's 5:40 PM ET
question): it roughly doubles the data to verify, and 1.0 already gained the endgame guide. The faction accent colours
(0.11) are designed for both factions, so Elyos needs no new look. The old 1.1 end-game tracker moved into 0.10. World
boss timers moved into 0.10 as 1.0 scope (owner, 7:02 PM ET).

### Any time (patches)

- Game patch watch: a weekly scheduled check of Metabot's client build (Thursday, the day after Global maintenance);
  a row in `docs/kaizen/patch-watch.md` and a re-check only when the build changes. Patch notes (KR or Global) are on
  aion2.plaync.com, which is never fetched; the owner reads them by hand. Re-verification driven by `verifiedAt`.
- Data corrections from issues.

## Moved out of the path to 1.0

Kept as ideas; each comes back through a planning pass when its time comes.

- **Filler XP ranking** (old 0.4 N6): needs the owner's XP-per-minute measurements; after 1.0 unless they arrive early.
- **Whole-app UX review every second minor**: replaced by the planning pass (step 2) and the full audit at 1.0.
- **Colour sprint** (owner wants its own sprint): CSS-only on the design tokens, so it can run as a lane in any minor
  after 0.5 once the owner has time for the research walk-through and one in-game check session; research in
  docs/research/colors-2026-10.
- **Store app (iPhone / Android)** (owner, 2026-10-15: "eventually"): after sync and 1.0. Likely the same web code
  wrapped (e.g. Capacitor) on the storage adapter from 0.4. Questions first: App Store review of an unofficial app
  using NCSoft's game name and icons, Apple developer account (~$99 / year), Metabot's non-commercial condition if the
  app is ever paid.
- **Lv 45 weekly/daily reset checklist**: folded into 1.1.
- **Rounded pop-out window frame** (#254 note 4, 0.6 pass): the Document Picture-in-Picture frame is drawn by the
  browser, so the page can't round it (inferred; P11 records the test). Back only if a browser API allows it.
- **Full story-objective wording audit** (#254 note 11, 0.6 pass): only the owner's screens show the in-game text, so
  it runs as owner spot checks reported as data issues; 0.6 P6 fixes the pronoun cases and adds the check.
- **Item level as an input** (gates Krao Cave 200, Ascension Trial 1,000 / 1,500), **post-Altgard (Reshanta / Abyss)**,
  **Elyos** (a faction pack after 1.0).
- **Preview deploys** with a move to Cloudflare Pages; **release tooling** (release-please / changesets) if other
  contributors join.
