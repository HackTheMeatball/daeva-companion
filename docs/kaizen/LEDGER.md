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

`owner` is exactly one of: Isaac (the owner), Saul (Coordinator), Walter (Release Planner), Gus (Build Pipeline), Jane
(Design Lead), Hank (Incident Log), Mike (Stall Watch), Skyler (Tracker Design), Huell (Tracker Sync), Gretchen (Game
Data Check), Lydia (Source Vetting), Jesse (Player Testing), Gale (Kaizen), Francesca (Rules Steward, who owns the
ledger's upkeep), Gomez (Team Audit). `enforced_by` uses the same names.

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
- Rules Steward (Francesca) owns the ledger's upkeep: she checks that each rule or DECISIONS change brings its row
  up to date.
- Kaizen (Gale) re-grades every row at each release kaizen review and sets `grade` and `last_change`.
- Tracker Sync (Huell) mirrors the ledger into the tracker once a Ledger view exists.
- `tests/ledger.mjs` (run by `tests/schema.mjs`, so CI's data job runs it) checks the header, unique ids, the fixed
  kind and status values, that every home exists and its anchor text is in that file, and that there is one decision
  row per DECISIONS table row. A new decision without a ledger row fails CI. It also checks that `plain` is filled in
  and names no issue number or rule id (`#114`, `PLN-12`), that `owner` and `enforced_by` use the names above, that
  `enforced_by` doesn't repeat the owner, and that every decision's owner is Isaac.
- Only `kind=decision` rows are matched one for one against DECISIONS rows. A rule of another kind may also have its
  home in DECISIONS (e.g. COM-02, KZ-01); that row doesn't count as the decision's ledger row.
