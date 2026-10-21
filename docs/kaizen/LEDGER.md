# Rules and decisions ledger

[`ledger.csv`](ledger.csv) is the index of every standing rule and owner decision: one row each, saying what it is in one
line, who owns it, and where its full text lives. That place is the rule's **one home** (rules audit Q-14, 2026-10-19).
Every other copy of a rule is a one-line pointer to its home.

The ledger holds a summary and the home, never the full text. The wording lives only in the home, so the ledger can't
drift from it. If a summary and its home disagree, the home wins and the summary is fixed.

## Columns

| Column | Meaning |
|---|---|
| `id` | The rules audit id (`COM-02`, `PLN-09` …), `KZ-10` and later for new rules, `DEC-YYYYMMDD-<slug>` for a DECISIONS row |
| `kind` | `safety`, `owner-rule` (one of Isaac's own rules), `process`, or `decision` (a DECISIONS row) |
| `area` | The part of the work it governs, from the id prefix (table below) |
| `summary` | One short line (≤ 140 characters) saying what the rule is now, in the team's terms |
| `plain` | One plain-English sentence (≤ 160 characters, the test allows 200) that Isaac, or anyone reading the tracker, understands without context. For a decision it says what was decided, not the topic name. A retired or superseded row states the old rule in its own words, with no "Retired:" prefix (`status` marks it). Never a copy of the full text |
| `owner` | The one person accountable for the rule (list below). Every decision's owner is Isaac |
| `enforced_by` | The others who carry it out or check it: names separated by `;`, or `all` (every thread), or `harness` (the platform's safety check enforces it). Empty when the owner does it alone. For a decision, the thread that carries it out, when that is clear |
| `home` | Where the full text lives: `path/in/repo.md#<heading or phrase in that file>`, `docs/DECISIONS.md#YYYY-MM-DD / <Topic>` for a DECISIONS row, or a GitHub issue (`#114`, `#221`, `#222`, `#232`). Never a team-memory file |
| `status` | `active`, `trial`, `pending` (approved but not yet in force: a new rule waiting to start; a graded change to a rule still in force stays `active`, with a note that it waits on its owner), `retired`, or `superseded` (a decision a later one replaced) |
| `since` | Date it was OK'd (YYYY-MM-DD), if known |
| `ok_by` | Who OK'd it (e.g. Isaac), if known |
| `last_change` | The last review or PR that changed the row |
| `grade` | The last audit's grade: keep, tighten, loosen, merge, retire or add |
| `replaced_by` | For a superseded or retired-by-merge row, the id of the row that replaced it |
| `note` | Anything else worth knowing about the row, e.g. "text not yet in #114" (kept out of `last_change`) |

## Owners

`owner` is exactly one `name` from [`team.csv`](team.csv); `enforced_by` uses the same names (or `all` / `harness`).

## Team, team changes and audits

The roster and its history live next to the ledger, and the Daeva Ledger page reads them. Rules Steward (Francesca)
keeps all three current; `tests/ledger.mjs` checks them.

| File | One row per | Columns |
|---|---|---|
| `team.csv` | standing thread, current or folded (short-lived threads aren't listed) | `name`, `role` (thread name), `title` (real-world equivalent), `joined` (date the thread started, ET; empty for Isaac and Saul, there from the start), `status` (`active`, `folded`, `closed`), `folded_into` (a `name`, only when folded), `used_to_own` (work that moved away, with when), `never_does` (the thread's own lines; empty until it writes them) |
| `team-changes.csv` | change to who does what: a thread joining, folding, or work moving | `date`, `time` (ET), `change` (plain words), `was`, `now`, `source` (the decision's ledger id; empty only when no decision exists, e.g. a thread Saul started) |
| `audits.csv` | audit recommendation | `audit`, `rec`, `text`, `decides`, `status` (`done`, `partial`, `scheduled`, `waiting`, `open`), `decision` (ledger id, if one), `note` |

## Who does what

One Accountable thread per kind of work (team audit 1.0, rec 3; DEC-20261019-team-audit-recs-3-and). Coordinator
(Saul) routes work only from this table, never from memory. A thread that finds itself doing work this table gives to
someone else stops and sends it there. "Plain" says the same in everyday words for the Ledger page (no ids, issue numbers or code). "Source" is the ledger row or DECISIONS row that sets the owner; a
change to an owner changes that row and this table in the same PR. Rules Steward (Francesca) keeps the table current.

| Work | Plain | Owner | Not | Source |
|---|---|---|---|---|
| Routing work to a thread; starting long-standing or temporary threads (standing, until Isaac revokes it); what is waiting on Isaac; the morning debrief of every OK and question | Saul sends each piece of work to the right thread, starts new threads when the work needs them, keeps track of what is waiting on Isaac, and gives him one morning summary. | Saul | Mike, Huell | COM-02, PLN-09, DEC-20261019-saul-owns-what-s-waiting, DEC-20261020-coordinator-creates-threads |
| Asking Isaac for a decision (opening its To-do) | The thread that needs a decision asks Huell to put the question on Isaac's To-do list. | The thread that needs it, through Huell | Saul, Walter | DEC-20261019-each-thread-opens-its |
| Telling Huell an answer is recorded (OK RECORDED), so the To-do closes | Whoever writes down Isaac's answer tells Huell, so the To-do can close. | Whoever recorded it | | DEC-03 |
| Writing tracker data: cards, To-dos, versions, Scrapbook; a notice to the coordinator for each new, closed or withdrawn To-do of Isaac's | Only Huell changes what the tracker shows: cards, To-dos, versions and the Scrapbook, and tells the coordinator, who posts it in the project chat, when a To-do of Isaac's is added, closed or withdrawn. | Huell | everyone else | TRK-01, DEC-20261020-todo-notifications |
| Tracker page code and design | Jane owns how the tracker page looks and works; changes are built one at a time from Skyler's handover notes or through the pipeline, after Huell checks no data was lost. | Jane (accountable; one-off builds or the pipeline write the code), after Huell's data check | Huell (data only) | DEC-20261018-tracker-2-0-tab-by; coordinator, 2026-10-20 7:56 PM ET (Skyler ended) |
| DECISIONS rows | Walter writes every decision into the decisions file; others pass Walter Isaac's exact words. | Walter | everyone else (forward the OK verbatim) | DEC-01 |
| ROADMAP, planning passes, item specs, the queue, #232 | Walter keeps the roadmap, plans each release, writes the work items and orders the queue. | Walter | Gus | PLN-01, Q-01, PLN-11 |
| Design asks from Isaac | Walter and Jane take Isaac's design requests together. | Walter and Jane together | | PLN-12 |
| Mockups, look-and-feel, DESIGN OK on PRs with shots | Jane owns mockups and the look of the app, and approves changes that alter what players see. | Jane | | MRG-06, MRG-08 |
| Cleaning up Isaac's screen crops | Jane cleans up Isaac's own screen crops when they have to be used. | Jane | Gretchen | DEC-20261018-owner-crop-clean-up-is |
| Design review against the checklist, starting from a baseline; the content of `docs/design/review-checklist.md`; fresh design briefs; the findings log; the Design Critic pass on a minor's mockups | Holly checks designs against the checklist before Isaac sees them, keeps the checklist and its findings log, and briefs reviewers new to the work. | Holly | Jane (designs, DESIGN OK / CHANGES); Walter (fresh-review tags); Saul (starts fresh threads) | DEC-20261020-k24-design-and-code-review, DEC-20261019-design-critic-reviews-a-minor |
| Icon and fact lookups on approved domains; icon provenance | Gretchen looks up icons and facts on approved sites and records where each icon came from. | Gretchen | Lydia | ROL-03, ROL-05 |
| Fact checks, the two-source and labelling rules, DATA OK | Gretchen checks game facts against two sources and approves the data before a release. | Gretchen | | REPO-05, PLN-18 |
| Vetting a site not yet in SOURCES.md; last-resort spot checks; outside research for any thread on any topic, under the fetching rules | Lydia vets any new website before the team uses it, and helps any thread research anything outside the project, using only sites the rules allow. | Lydia | Gretchen | ROL-03, ROL-04, DEC-20261020-lydia-research-any-topic |
| Research packs (data and icons for a class) | A research thread gathers the data and icons for a class; Gretchen checks the icons. | A research thread Walter starts; Gretchen checks icons | | Q-08, ROL-03 |
| A data fix in `data/` | A fix to game data is a planned work item; Gretchen checks the fact. | A queued item (Walter); Gretchen checks the fact | | Q-01, REPO-05 |
| Workflows, kickoff, auto-merge, shipping a release | Gus runs the automation: starting work, merging approved changes and shipping releases. | Gus | | PIP-03, MRG-01, PLN-19 |
| Release manager: each release from RC READY (a patch: PRE-RELEASE CHECK) to the live site; a minor's merge freeze from RC READY to the tag | Walter makes sure every release step finishes and chases any that stall; while a minor is frozen, Gus merges nothing that changes the build. | Walter (freeze enforced by Gus) | Mike (keeps the 60 min stall flag) | DEC-20261020-release-manager-and-freeze |
| The #114 body | Gus keeps the main pipeline status page; each thread only edits its own line there. | Gus (owners edit only their own status line) | | Q-13 |
| Code review criteria (what earns APPROVE or CHANGES, what counts as blocking); fresh code reviews on fresh-review items; the cross-PR pattern log | Howard decides what a code review must check before it approves a change, and gives risky changes a second look from a reviewer new to the work. | Howard (loosening a criterion needs Isaac's typed OK) | Gus (when a review runs, model, verdict format and parser, applying pipeline.yml edits); Jane (design review); Gretchen (data) | DEC-20261020-k24-design-and-code-review |
| Health check: stalls, idle queue, red runs, tracker drift | Mike watches for stuck work, an idle queue, failing builds and a tracker out of step. | Mike | | HC-01 |
| The stall log #221: every row, its format and kinds, the per-release error report, KIND RECURRED | Mike alone writes the stall log, reports errors for each release, and tells Gale when a fixed problem returns. | Mike | everyone else (report stalls to Mike) | DEC-20261019-incident-log-folds-into-stall, HC-02 |
| A typed OK not applied within 60 min (a stall) | Mike flags any approval from Isaac that hasn't been acted on within an hour. | Mike | | DEC-20261019-saul-owns-what-s-waiting |
| Playing the release candidate before the tag and the live site after; player findings issues | Jesse plays each release before it ships and again once it is live, and files any findings. | Jesse | | PLN-21, PLN-22, DEC-20261019-player-testing-plays-each-minor |
| Outside reports: beta tester reports and GitHub issues from Report a problem (`docs/team/support.md`): intake, dedupe, triage, routing to Gus / Gretchen / Jane / Walter, and closing the loop with the reporter | Ernesto takes in everything players and beta testers report, sends each item to the right owner and tells the reporter what happened; beta ideas reach Walter as planning inputs. | Ernesto | Jesse (internal plays); Walter (whether an idea is planned) | Hire OK by Team Audit (Gomez), 2026-10-20 5:52 PM ET; boundary set by Walter, 5:54 PM ET |
| `PRIVACY.md`: its content, including the beta tester data section and its 30-day deletion; reviewing every other edit to it | Ernesto keeps the privacy notice accurate, including how long beta tester data is kept. Any planned change to what the app stores or sends updates the privacy notice itself, and Ernesto reviews that update. | Ernesto | Plan-item builders (they write their own PRIVACY.md edit, e.g. P3c, P21, P5, sync.md §9) | Coordinator's hiring decision after Gale's outside review, 2026-10-20; review split set by Ernesto, 6:47 PM ET |
| Kaizen review, #222, the scorecard, rule changes and grades; redrafting the project instructions at each review (Gomez reviews, Saul applies) | Gale reviews how the team works after each release and decides changes to the rules. At each review Gale also rewrites the project's standing instructions; Gomez checks them and Saul puts them in place. | Gale | | KZ-01, PLN-04, DEC-20261020-project-instructions-redraft |
| Grading Gale's own rules and checking the scorecard compares like with like (from 0.9) | From 0.9, Francesca grades Gale's own rules and checks the scorecard is fair. | Francesca | Gale | DEC-20261019-from-0-9-rules-steward |
| Grading Q-14 | Gale grades the rule that makes this ledger each rule's one home. | Gale | Francesca | DEC-20261019-kaizen-grades-the-ledger-rule |
| This ledger, this table, team.csv, team-changes.csv, audits.csv, drift and roster sweeps | Francesca keeps this ledger, this table, the team list, its change history and the audit list current, and checks them for drift. | Francesca | | Q-14, ROL-07, DEC-20261019-rules-steward-francesca-joins-each |
| Pushing a fix a fresh reviewer asked for to another thread's claude/ branch, when its owner can't push it (never on a PR Francesca reviews, never one that loosens an owner-held limit) | When a reviewer new to the work asks for a fix and the thread that owns the change can't make it, Francesca makes it after the tests pass and sends it back for another review. | Francesca | The branch owner, whenever they can push their own fix | DEC-20261020-steward-push-fixes |
| Permission stalls: fixing what the team can change in its own settings (never widening a permission touching the owner-held limits, fetching, push to main, the owner's device, secrets or publishing; each fix reviewed before it applies, KZ-19 step 3), then drafting narrow advance standing OKs at each batch | Francesca first fixes the permission stalls the team can fix in its own settings, never widening what Isaac keeps for himself and only after a review, then drafts narrow standing approvals for Isaac; a reviewer new to the work checks each draft against Isaac's own limits. | Francesca | Mike (logs the stalls), Gale (finds the patterns), a fresh reviewer (checks drafts against the owner-held limits) | KZ-19 |
| Outside review of process and rule changes, standing hires, and privacy, legal and terms text when the triage rule names an external reviewer; the team audit at each major | Gomez gives an outside check to rule and process changes, new standing roles, and privacy, legal and terms text when the review list calls for one, and audits the whole team at each major release. | Gomez | Gale (decides rules and grades), Saul (hiring decisions), Nacho (roster recommendations) | DEC-20261019-team-audit-recs-3-and, DEC-20261020-review-triage, DEC-20261020-reviewer-rotation |
| Applying a fix to team memory | Gale applies fixes to the team's shared memory; Francesca sends them to Gale. | Gale (Francesca sends the fix; no other thread can read memory yet) | | Interim, until the 0.8 review assigns it |
| The roster scan once per minor (load, overlap, unowned work, idle threads); ranked roster recommendations (hire, merge, split, retire, re-scope); the roster findings log | Once per minor, Nacho checks whether anyone is handling too much, whether two threads do the same job and what nobody owns, then recommends changes; the coordinator decides. | Nacho | Saul (decides), Gomez or a fresh reviewer (reviews each proposal), Gale (rule changes) | DEC-20261020-hiring; Fresh governance review HIRE OK, 2026-10-20 6:56 PM ET |
| The compliance register: every legal or compliance obligation, its owner and the check that proves it; a register check at each kaizen review | Chuck keeps one list of every legal duty the project has (the not-affiliated wording, licences, privacy, fetching rules, icon sources), who owns each one and the check that proves it. | Chuck | Each obligation's owner keeps its own document (Ernesto, Lydia, Gretchen, Gus) | DEC-20261020-hiring; coordinator hired 2026-10-20 7:51 PM ET after Fresh governance review |
| Drafting the Terms of Use and the robots.txt policy so the two match (P24) | Chuck writes the site's terms of use and decides which automated visitors the site turns away; an outside reviewer checks both before they are adopted. | Chuck | Lydia (handed it over), Walter (schedules the build only) | DEC-20261020-hiring; coordinator hired 2026-10-20 7:51 PM ET after Fresh governance review |
| Compliance sign-off on a SOURCES.md row whose use rests on reading terms or a licence; the check on a demotion or cut | Chuck checks how a website's terms or licence were read before it is used; Gretchen checks when a site is made stricter or dropped. | Chuck (terms and licence); Gretchen (demotions and cuts) | Lydia (vets the site and writes the row) | ROL-09, ROL-04 |
| Legal review of a change with legal risk: a PR touching LICENSE, PRIVACY.md, the Terms, robots.txt, the footer or not-affiliated text, tests/site.js or SOURCES.md; a new icon or art source; each release PR; any takedown, IP notice or app store question | Chuck checks any change with legal risk before it ships; this adds to the usual reviews and replaces none of them. | Chuck | Howard (code), Jane (DESIGN OK) | DEC-20261020-hiring; coordinator hired 2026-10-20 7:51 PM ET after Fresh governance review |

## Areas

| Prefix | Area |
|---|---|
| COM | communication |
| MRG | merging |
| PIP | pipeline |
| Q | queue |
| HC | health-check |
| LOG | logging |
| PLN | planning |
| KZ | kaizen |
| DEC | decisions (also every `DEC-YYYYMMDD-…` row) |
| TRK | tracker |
| CLK | clocks |
| ROL | roles |
| REPO | repo |
| NEW | the area of the rule (NEW-01 planning, NEW-02 logging) |

## Keeping it current

- Any PR that adds, changes or retires a rule, or adds or changes a DECISIONS row, updates its ledger row in the same
  PR. Git history is the change log.
- Rules Steward (Francesca) owns the ledger's upkeep and the "Who does what" table. CI already fails a DECISIONS row
  with no ledger row, so on each rule or DECISIONS merge Francesca checks for drift instead: copies of the rule elsewhere,
  a row whose wording, owner or home no longer matches, and owners that aren't live threads.
- Kaizen (Gale) re-grades every row at each release kaizen review and sets `grade` and `last_change`.
- Tracker Sync (Huell) mirrors the ledger into the tracker once a Ledger view exists.
- `tests/ledger.mjs` (run by `tests/schema.mjs`, so CI's data job runs it) checks the header, unique ids, the fixed
  kind and status values, that every home exists and its anchor text is in that file, and that there is one decision
  row per DECISIONS table row. A new decision without a ledger row fails CI. It also checks that `plain` is filled in
  and names no issue number or rule id (`#114`, `PLN-12`), that `owner` and `enforced_by` use the names above, that
  `enforced_by` doesn't repeat the owner, and that every decision's owner is Isaac.
- Only `kind=decision` rows are matched one for one against DECISIONS rows. A rule of another kind may also have its
  home in DECISIONS (e.g. COM-02, KZ-01); that row doesn't count as the decision's ledger row.
