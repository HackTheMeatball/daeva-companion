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
| `summary` | One plain line (≤ 140 characters) saying what the rule is now |
| `owner` | The thread or threads that own it |
| `home` | Where the full text lives: `path/in/repo.md#<heading or phrase in that file>`, `docs/DECISIONS.md#YYYY-MM-DD / <Topic>` for a DECISIONS row, or a GitHub issue (`#114`, `#221`, `#222`, `#232`). Never a team-memory file |
| `status` | `active`, `trial`, `pending` (a graded change not applied yet), `retired`, or `superseded` (a decision a later one replaced) |
| `since` | Date it was OK'd (YYYY-MM-DD), if known |
| `ok_by` | Who OK'd it (e.g. Isaac), if known |
| `last_change` | The last review or PR that changed the row |
| `grade` | The last audit's grade: keep, tighten, loosen, merge, retire or add |
| `replaced_by` | For a superseded or retired-by-merge row, the id of the row that replaced it |

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
- Kaizen (Gale) re-grades every row at each release kaizen review and sets `grade` and `last_change`.
- Tracker Sync (Huell) mirrors the ledger into the tracker once a Ledger view exists.
- `tests/ledger.mjs` (run by `tests/schema.mjs`, so CI's data job runs it) checks the header, unique ids, the fixed
  kind and status values, that every home exists and its anchor text is in that file, and that there is one decision
  row per DECISIONS table row. A new decision without a ledger row fails CI.
