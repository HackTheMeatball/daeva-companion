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
- **New rules go through the coordinator:** any new rule, decision or process change goes to the coordinator first. That
  includes one Isaac states in your own thread, which you forward verbatim, and one you propose. Don't write it into any doc
  yourself. The coordinator routes it with the overlap check (DEC-01 as amended 2026-10-21; process-change procedure step 2).
  Look up the coordinator's session with `get_channel_session_id` each time. A PR that touches a rule carries
  `Routed: coordinator <UTC time>`.
- **Decision cards for Isaac:** get the card's T-NN first, then tell the coordinator in the same turn you post it
  ([DEC-20261020-todo-notifications](../DECISIONS.md)). Look up the coordinator's session with `get_channel_session_id`
  each time, never from memory; if the send fails, look it up again and retry once, and if that fails too, post the
  CARD READY line in your thread and tell Watchdog (Mike).

### COM-18

_Owner, typed in the project chat 2026-10-20 11:43 PM ET: "every standing decision, rule, etc that I came up with is under
scrutiny. Just cause I’m the owner doesn’t mean I’m right"; effect as Kaizen (Gale) worded it, for the coordinator._

- **Owner rules get no pass:** a rule or decision Isaac originated is graded against real-world practice at each kaizen
  review like any other rule, and any thread may propose changing it through the process-change route. Loosening one of
  the seven owner-held limits still goes to Isaac, as a recommendation.

## Kaizen

### KZ-19

_Owner's ask, typed in the project chat 2026-10-20 11:58 PM ET: "Yeah but we try to avoid those or think ahead and do the ok
in advance". Spec by the coordinator 2026-10-21 12:01 AM ET, routing backed by Org Design (Nacho), outside review: Fresh
governance review, OK with changes 04:01Z._

- **Permission stalls are prevented with advance standing OKs:**
  1. Every block on a permission prompt or on Isaac's typed OK is a #221 row of kind `permission` (thread, step, what was
     blocked, cause, wait, how it cleared). Mike is the only writer of #221; a blocked thread sends him the ask text
     (KZ-20).
  2. Gale groups the rows into patterns, and at each kaizen review grades how the OKs worked out.
  3. Francesca first fixes what the team can fix in its own settings, then drafts a standing OK for each remaining pattern.
     A team settings fix never widens a permission touching the seven owner-held limits, fetching, push to main, the
     owner's device, secrets or publishing. Each fix is a trigger-1 change: its diff is in the #221 row, and it is
     reviewed before it applies (the incident fast path excepted).
  4. At each batch the coordinator briefs a one-off fresh reviewer with no history on the drafts: never Francesca or Gale,
     and never Gomez for rules Gomez co-wrote. That reviewer checks every draft against the seven owner-held limits, and
     every team-fixed settings diff, consulting Howard on any permission or workflow diff.
  5. Gale plants one draft that quietly loosens a limit in every batch. If the reviewer misses it, the batch doesn't go out;
     the plant never reaches Isaac.
  6. Each draft states "loosens owner-held limit N: yes/no"; any yes goes to Isaac on its own card, as a recommendation.
  7. Each OK is narrow (the exact action, its conditions, how to undo it), is reviewed at the next kaizen review, and is
     pruned if it went unused for a full minor. Mike logs every use of an OK, so its use can be measured.
  8. Isaac adopts each OK in his own words; Walter records his verbatim text in DECISIONS.
  Harness guards, such as the session self-modification block, are not fixed with an OK; they get a route change.

### KZ-20

_Kaizen (Gale), PROCESS REVIEW stall-ask-text OK (Fresh governance review, 2026-10-21 12:03 AM ET); serves KZ-19._

- **Blocked threads send the ask text:** a thread blocked on a permission prompt or on the owner's typed OK sends the
  prompt or ask text to Watchdog (Mike) at the moment it is blocked. The text goes verbatim, with credentials, tokens and
  personal data replaced by [redacted]. Mike writes the #221 row.

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
