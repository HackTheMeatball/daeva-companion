# Team-wide rules

These rules bind every thread. The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes them.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections. A rule added later (COM-17 on) names its own source in its italic line.

## Communication

### COM-01

_From #114 "Owner rules (Isaac, 2026-10-16)"._

- **Times in ET** (owner, 2026-10-16 4:22 PM ET): any time Isaac reads (To-do text, tracker cards and notes, aar lines, notifications) is US Eastern with the zone, e.g. "4:22 PM ET". Never UTC alone. Machine fields may stay ISO.

### COM-09 and Q-15

_From #114 "Owners (Isaac, 2026-10-18 5:05 AM ET; replaces "Three parts, one team"; standing rules audit https://claude.ai/code/artifact/428cb4b3-b93f-4dbb-867f-6d697493dd98)"._

- **Unchanged for everyone:** the safety rules, times in ET, copy boxes for anything Isaac types, append-only logs re-read before writing.

### COM-13

_From #114 "Team-wide rules (homed here from team memory; rules audit, Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET)"._

- **COM-13 done means merged:** say "recorded" or "done" only after the PR merges.

### COM-17

_Owner, typed in the Org Design thread 2026-10-20 11:34 PM ET ("Sure let’s do it"), approving Org Design's Walter load
recommendation item 2; backed by Org Design (Nacho)._

- **Card taps travel with the ask:** a thread that asks Walter for a DECISIONS row from an owner decision card puts the
  card-tap record in the ask: the card's message id, the option chosen, `chosen_by` and the tap time in ET. Walter
  checks that record instead of looking for it. A typed answer is still forwarded verbatim (DEC-02).

### COM-18

_Owner, typed in the project chat 2026-10-20 11:43 PM ET: "every standing decision, rule, etc that I came up with is under
scrutiny. Just cause I’m the owner doesn’t mean I’m right"; effect as Kaizen (Gale) worded it, for the coordinator._

- **Owner rules get no pass:** a rule or decision Isaac originated is graded against real-world practice at each kaizen
  review like any other rule, and any thread may propose changing it through the process-change route. Loosening one of
  the seven owner-held limits still goes to Isaac, as a recommendation.

## Merging

### MRG-11

_From #114 "Merge rule (AUTO since 2026-10-16 10:32Z, #115)"._

- Open PRs via REST or MCP (`create_pull_request`) if a bot didn't; the branch must start with `claude/`.

## Pipeline

### PIP-16

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)", from the "Tracker (owner, 2026-10-16 6:30 PM ET)" bullet; "the session above" there is Tracker sync, session cse_01KwhhactVQ6fSysWuTXUBNW._

- **Every session that dispatches kickoff.yml (planner, health check, any thread) sends Tracker sync (the session above) one `send_message` right after: `KICKOFF DISPATCHED <ET time>: <issues queued, or 'queue refresh'>`**; Tracker sync checks the Kickoff run about 3 min later and writes the Now cards.

## Repo

### REPO-12

_From #114 "Team-wide rules (homed here from team memory; rules audit, Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET)"._

- **REPO-12 processes:** never kill processes you didn't start (no broad pkill). Isaac, typed in the Gus thread 2026-10-19 7:33 PM ET.

### REPO-14

_From #114 "Team-wide rules (homed here from team memory; rules audit, Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET)"._

- **REPO-14 monetization plans:** keep monetization plans out of public files (repo, issues, commit messages, PRs). Isaac, typed in the Gus thread 2026-10-19 7:33 PM ET.
