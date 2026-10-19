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
| `plain` | One plain-English sentence (≤ 160 characters, the test allows 200) that Isaac, or anyone reading the tracker, understands without context. For a decision it says what was decided, not the topic name. Never a copy of the full text |
| `owner` | The one person accountable for the rule (list below). Every decision's owner is Isaac |
| `enforced_by` | The others who carry it out or check it: names separated by `;`, or `all` (every thread), or `harness` (the platform's safety check enforces it). Empty when the owner does it alone. For a decision, the thread that carries it out, when that is clear |
| `home` | Where the full text lives: `path/in/repo.md#<heading or phrase in that file>`, `docs/DECISIONS.md#YYYY-MM-DD / <Topic>` for a DECISIONS row, or a GitHub issue (`#114`, `#221`, `#222`, `#232`). Never a team-memory file |
| `status` | `active`, `trial`, `pending` (a graded change not applied yet), `retired`, or `superseded` (a decision a later one replaced) |
| `since` | Date it was OK'd (YYYY-MM-DD), if known |
| `ok_by` | Who OK'd it (e.g. Isaac), if known |
| `last_change` | The last review or PR that changed the row |
| `grade` | The last audit's grade: keep, tighten, loosen, merge, retire or add |
| `replaced_by` | For a superseded or retired-by-merge row, the id of the row that replaced it |
| `note` | Anything else worth knowing about the row, e.g. "text not yet in #114" (kept out of `last_change`) |

## Owners

`owner` is exactly one name from this table; `enforced_by` uses the same names (or `all` / `harness`).
`tests/ledger.mjs` checks that this table and its list of names match.

| Name | Role | Status |
|---|---|---|
| Isaac | Owner | the owner; every decision is his |
| Saul | Coordinator | live |
| Walter | Release Planner | live |
| Gus | Build Pipeline | live |
| Jane | Design Lead | live |
| Hank | Incident Log | handed over to Mike 2026-10-19; kept for retired rows |
| Mike | Stall Watch | live |
| Skyler | Tracker Design | live |
| Huell | Tracker Sync | live |
| Gretchen | Game Data Check | live |
| Lydia | Source Vetting | live |
| Jesse | Player Testing | live |
| Gale | Kaizen | live |
| Francesca | Rules Steward (owns the ledger's upkeep) | live |
| Gomez | Team Audit | live |

## Who does what

One Accountable thread per kind of work (team audit 1.0, rec 3; DEC-20261019-team-audit-recs-3-and). Coordinator
(Saul) routes work only from this table, never from memory. A thread that finds itself doing work this table gives to
someone else stops and sends it there. "Source" is the ledger row or DECISIONS row that sets the owner; a
change to an owner changes that row and this table in the same PR. Rules Steward (Francesca) keeps the table current.

| Work | Owner | Not | Source |
|---|---|---|---|
| Routing work to a thread; what is waiting on Isaac; the morning debrief of every OK and question | Saul | Mike, Huell | COM-02, PLN-09, DEC-20261019-saul-owns-what-s-waiting |
| Asking Isaac for a decision (opening its To-do) | The thread that needs it, through Huell | Saul, Walter | DEC-20261019-each-thread-opens-its |
| Telling Huell an answer is recorded (OK RECORDED), so the To-do closes | Whoever recorded it | | DEC-03 |
| Writing tracker data: cards, To-dos, versions, Scrapbook | Huell | everyone else | TRK-01 |
| Tracker page code and design | Skyler, tab by tab, after Jane's DESIGN OK and Huell's data check | Huell | DEC-20261018-tracker-2-0-tab-by |
| DECISIONS rows | Walter | everyone else (forward the OK verbatim) | DEC-01 |
| ROADMAP, planning passes, item specs, the queue, #232 | Walter | Gus | PLN-01, Q-01, PLN-11 |
| Design asks from Isaac | Walter and Jane together | | PLN-12 |
| Mockups, look-and-feel, DESIGN OK on PRs with shots | Jane | | MRG-06, MRG-08 |
| Cleaning up Isaac's screen crops | Jane | Gretchen | DEC-20261018-owner-crop-clean-up-is |
| Icon and fact lookups on approved domains; icon provenance | Gretchen | Lydia | ROL-03, ROL-05 |
| Fact checks, the two-source and labelling rules, DATA OK | Gretchen | | REPO-05, PLN-18 |
| Vetting a site not yet in SOURCES.md; last-resort spot checks | Lydia | Gretchen | ROL-03, ROL-04 |
| Research packs (data and icons for a class) | A research thread Walter starts; Gretchen checks icons | | Q-08, ROL-03 |
| A data fix in `data/` | A queued item (Walter); Gretchen checks the fact | | Q-01, REPO-05 |
| Workflows, kickoff, auto-merge, shipping a release | Gus | | PIP-03, MRG-01, PLN-19 |
| The #114 body | Gus (owners edit only their own status line) | | Q-13 |
| Health check: stalls, idle queue, red runs, tracker drift | Mike | | HC-01 |
| The stall log #221: every row, its format and kinds, the per-release error report, KIND RECURRED | Mike | everyone else (report stalls to Mike) | DEC-20261019-incident-log-folds-into-stall, HC-02 |
| A typed OK not applied within 60 min (a stall) | Mike | | DEC-20261019-saul-owns-what-s-waiting |
| Playing the release candidate before the tag and the live site after; player findings issues | Jesse | | PLN-21, PLN-22, DEC-20261019-player-testing-plays-each-minor |
| Kaizen review, #222, the scorecard, rule changes and grades | Gale | | KZ-01, PLN-04 |
| Grading Gale's own rules and checking the scorecard compares like with like (from 0.9) | Francesca | Gale | DEC-20261019-from-0-9-rules-steward |
| Grading Q-14 | Gale | Francesca | DEC-20261019-kaizen-grades-the-ledger-rule |
| This ledger, this table, drift and roster sweeps | Francesca | | Q-14, ROL-07, DEC-20261019-rules-steward-francesca-joins-each |
| Applying a fix to team memory | Gale (Francesca sends the fix; no other thread can read memory yet) | | Interim, until the 0.8 review assigns it |

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
  with no ledger row, so on each rule or DECISIONS merge she checks for drift instead: copies of the rule elsewhere,
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
