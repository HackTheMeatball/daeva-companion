# Team-wide rules

These rules bind every thread. The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes them.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections. A rule added later (COM-17 on) names its own source in its italic line.

## Clocks

- **A clock's cadence lives in its ledger row** (amends CLK-01 to CLK-04 and HC-06, no new id; Kaizen batch-0.9 item
  46, Gale; routed by the coordinator 2026-10-22T11:20Z): every self-re-arming clock (a scheduled trigger or wake that
  sets its own next run) names its ledger id and cadence in the prompt it re-arms with, for example `CLK-01: 20 min
  while a claude/ PR is open or a build runs, 3 h idle`, and re-arms from that row, never from memory or an earlier
  prompt. A clock with no row gets one before it runs. Gus's PR check re-armed every 30 minutes from 2026-10-21 to
  2026-10-22 11:29Z against CLK-01's 20 (Watchdog (Mike)'s read of the trigger history: 35 of 35 gaps from Oct 21 15:20Z
  to Oct 22 11:09Z were 31 to 50 minutes), because the stored prompt said 30 and nothing tied it to the row.

## Communication

### COM-01

_From #114 "Owner rules (Isaac, 2026-10-16)"._

- **Times in ET** (owner, 2026-10-16 4:22 PM ET): any time Isaac reads (To-do text, tracker cards and notes, aar lines, notifications) is US Eastern with the zone, e.g. "4:22 PM ET". Never UTC alone. Machine fields may stay ISO.

### COM-09 and Q-15

_From #114 "Owners (Isaac, 2026-10-18 5:05 AM ET; replaces "Three parts, one team"; standing rules audit https://claude.ai/code/artifact/428cb4b3-b93f-4dbb-867f-6d697493dd98)"._

- **Unchanged for everyone:** the safety rules, times in ET, copy boxes for anything Isaac types, append-only logs re-read before writing.
  - **Writes to shared state** (amends Q-15, no new id; Kaizen batch-0.9 item 34, Gale's draft; routed by the coordinator
    2026-10-22T05:24Z; after Huell's first write after a context compaction double-wrapped the tracker's `data` field and
    every later write copied it, and Gale twice cited a superseded OK or misread a commit after a compaction: two seats,
    a likely pattern, not a proven one): before writing to any shared state (the tracker, the ledger, #114, #221, a
    shared-folder file), re-read the target; afterwards, read it back through the path its consumer reads, not your own
    write path.
    - A seat that repeatedly writes a structured payload through an API (the tracker datasets, the #114 body) keeps a
      scripted builder for that write in the shared folder (`<seat>/` there) and uses it; other writes start from a
      fresh read of the target (fresh review on #841).
    - After a context compaction, the first write of each kind is built from that script or from a fresh read of the
      target, never from memory or an earlier call. After the write, read back its top-level fields through the
      consumer's path (Gomez's replay evidence, `audit-1.0/replay-huell/results.md` in the shared folder).
    - A #221 row for a bad write says "after compaction" when that applies.

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
- **Decision cards for Isaac:** get the card's T-NN first and open the card's question with it ([COM-19](#com-19), card
  titles), then tell the coordinator in the same turn you post it
  ([DEC-20261020-todo-notifications](../DECISIONS.md)). Look up the coordinator's session with `get_channel_session_id`
  each time, never from memory; if the send fails, look it up again and retry once, and if that fails too, post the
  CARD READY line in your thread and tell Watchdog (Mike). If Huell hasn't given the T-NN in time, use `T-pending` as
  [huell.md](huell.md) says; a card with neither is a miss.

### COM-18

_Owner, typed in the project chat 2026-10-20 11:43 PM ET: "every standing decision, rule, etc that I came up with is under
scrutiny. Just cause I’m the owner doesn’t mean I’m right"; effect as Kaizen (Gale) worded it, for the coordinator._

- **Owner rules get no pass:** a rule or decision Isaac originated is graded against real-world practice at each kaizen
  review like any other rule, and any thread may propose changing it through the process-change route. Loosening one of
  the seven owner-held limits still goes to Isaac, as a recommendation.

### COM-19

_Owner, 2026-10-21 9:49 AM ET (cmsg_01UNirAFgxf3jC8kQS8uvvHB86Nb9WvZr4rfzrUAMuftpG, read by id), on T-61 being one
unreadable block: "Then make clarity a standing thing." Standard by Design Lead (Jane), reviewed by Fresh governance
review and Kaizen (Gale). Recommended reply: owner, 10:18 AM ET (cmsg_01UNirAFgxf3jC8kQS8uvvHBV2npK89zoGgAqmUo2Kpppv,
read by id): "Todo cards that need my input pasted here should have a recommended response that I can just hit copy on
so I can just do that if I agree…". Board coordinates: owner, 10:44 AM ET (cmsg_01UNirAFgxf3jC8kQS8uvvHBSf8d34bdyGkgApyBzpTjmz, read by
id): "…if you're asking me to check something you need to give me the board coordinates not the metabot frame
coordinates because that's not how I'm going to count them in game. There is no frame in game". Routed: coordinator
2026-10-21T20:20Z._

- **Ask format:** every To-do on the tracker board assigned to Isaac has these fields, each field and each step on its
  own line. Asks to him in chat follow the same format, unchecked (Kaizen samples them at each review). Decision cards
  keep their own limits: one question, 2–4 options, one line each.
  - **Title:** one ask, starting with a verb, at most 70 characters.
  - **Steps:** numbered, 1 to 7 (a hard cap); each one action starting with a verb, at most 120 characters. A check in
    game says what he should see or send. A place in game is described the way he sees it on screen: a menu path, a
    named node, or a position on that board's or window's own rows and columns, counted the way Isaac counts them in
    game, never a source site's internal or frame coordinates. Until he confirms how he counts, rows from the top and
    columns from the left, from 1 at the top-left cell, is the team's reading, not his words: each board ask states it
    ("row 3 from the top, column 5 from the left") and its Recommended reply asks him to confirm or correct it.
    Anything longer splits into ordered items ("Part 1 of 2"), each with its own Done when.
  - **Where:** in game (menu path or place), a settings page (its link), or a link to the page.
  - **Time:** about how long, in minutes or hours ("about 10 min").
  - **Why:** one sentence, at most 160 characters, on what it unblocks.
  - **Done when:** what he sends back, or what the team sees, that closes it.
  - **Recommended reply:** whenever Done when includes anything he types: the exact text he pastes if he agrees, in its
    own block with a Copy button, at most 300 characters, plain text. A choice or OK comes filled in with our
    recommendation; a check in game gives a fill-in line with `___` for what only he can see ("Copy template"). A reply
    that still contains `___` counts as not answered, and the reading thread asks him once for the missing part.
  - **Source** (stored, shown only as a small link): the origin message or card id, and the DECISIONS row when the item
    carries out a decision.
- **Card titles carry every handle that applies** (coordinator for Isaac, 2026-10-22; Isaac, project chat 02:31:55Z
  (cmsg_01UNirAFgxf3jC8kQS8uvvHBC4n4g3m1ugL2fN8Nn94bSo): "I don’t see any mention of Q-13 FYI", and 02:32:23Z
  (cmsg_01UNirAFgxf3jC8kQS8uvvHBEaceu2VbJanMm53qR38XT5): "No mention of P27 either", after he couldn't match a card
  titled by issue numbers to the "Q-13 / P27" he was pointed to; then 02:34:15Z
  (cmsg_01UNirAFgxf3jC8kQS8uvvHBJ9Ccgs6bUT4W2nk5rHLJR1): "It’s okay to show both just make sure you show the P-NN
  T-NN Q-NN etc as well". The wording below is the team's, not his. Routed: coordinator 2026-10-22T02:34Z): a
  decision card for Isaac opens its question with every handle that applies to it: its T-NN (or `T-pending`), the
  release item and its short name (P-NN, written as in the plan, e.g. P27), and the id of any rule or ledger row the card changes (such as Q-13), e.g.
  "T-123 · P27 icon check · changes Q-13: OK to edit one line of the pipeline issue?". Issue and PR numbers may appear alongside them,
  never instead of them. That handle prefix has the same limits as the To-do prefix below (at most 4 segments and 60
  characters). Each handle names only what it is: a ledger id is shown as the rule being changed, never as
  a card number. Every pointer to the card (the CARD READY line, the coordinator's posts, the debrief) uses the same
  handles as its title. A pointer naming a handle the title doesn't carry is a miss, fixed in the same hour: the
  pointer is corrected, or, since a posted card can't be edited, the thread withdraws it and posts it again.
  The same handles lead the card's To-do title, as a prefix that ends at its first colon. The ask-format check
  (Huell's `tracker-sync/askcheck.py`, 2026-10-22, tests in `askcheck-tests.py`) exempts that prefix only when it
  starts with a handle (T-NN, `T-pending`, P-NN, Q-NN, a rule id such as COM-19, or an issue or PR number), has at
  most 4 segments joined by " · " (each a handle with at most 4 plain words, or at most 5 plain words), and is at
  most 60 characters. Internal ids (`cmsg_`, `cse_`, `session_`) still fail inside it. After a qualifying prefix, the
  verb-first check, 70-character cap and rule-code and PR-number ban run on the rest of the title; a title whose
  prefix doesn't qualify gets them on the whole title, and every other field is checked as before.
- Plain language throughout: no internal ids, rule codes, file paths or PR numbers except as a link, and except the
  handles a card title must carry (above); at most 900 characters per item, not counting Recommended reply. Several in-game checks are separate items, or one item with one
  check per step.
- **The check:** one script, owned by Tracker Sync (Huell), runs on every write; Watchdog (Mike) runs the same script on
  open items. A failing item is rewritten by Huell in the same turn, or Huell tells the raiser and writes it once fixed,
  within the hour. Writers check place descriptions by hand, since the script can't.

### COM-20

_Org Design (Nacho), answering Isaac's question on seat names; routed by the coordinator 2026-10-21T23:09Z. Refined by
the owner in the project chat, 2026-10-21 23:11:48Z (cmsg_01UNirAFgxf3jC8kQS8uvvHBFrc7gRqwtwNJqS9Qu4jStY): "Technically
some of the names we use are better call Saul names but I think that’s fine. Moving forward only breaking bad characters
please. If we run out then we can use better call Saul. Kim wexler deserves a spot somewhere if we hire someone that fits
her persona." And 23:12:47Z (cmsg_01UNirAFgxf3jC8kQS8uvvHBAc1qTeo1rDNJ2zjWK8VtEL): "Wait why can’t they be reused?
That’s an issue no? Since eventually we will run out of". The reuse wording below is the coordinator's, answering it.
And 23:14:22Z (cmsg_01UNirAFgxf3jC8kQS8uvvHBJeM7g5aHazFHhov3g4RX1U): "Hmm you make a good point but wherever we have
things saved or logged should reference the role itself vs the name right? Since the name is more for flavor and
convenience"; the role-id wording below is the coordinator's. And in the Org Design thread 23:24:30Z
(cmsg_01UNirAFgxf3jC8kQS8uvvHBXEAo6bdXGBpgWJrtrLsAVY): "Ooo you know what I like? Standing roles get breaking bad names
and temp hires get better call Saul names.. whatcha think"; the both-shows and handover-rename wording is the
coordinator's, the rename-PR steps Gus's (23:27Z). Routed: coordinator 2026-10-21T23:25Z. Overlap check: no
rule named seats or set record identifiers before (no "role id" line anywhere in docs/); COM-11 (say which named thread
gets the work) is about hand-offs and stays as is._

- **Seat names:** standing seats get Breaking Bad character names; temporary and one-off hires get Better Call Saul
  names, titled as the name plus the role (e.g. "Kim (Tracker Drift Review)"). A character who appears in both shows
  counts as Breaking Bad. The four standing seats with Better Call Saul-only names (Nacho, Chuck, Howard, Ernesto) are
  renamed only at their next handover. Each rename is one PR, built by Build Pipeline (Gus), that changes the team.csv
  name, the names list in tests/ledger.mjs, docs/team/<old>.md to <new>.md, the SOP and ledger owner cells, and any open
  PR's `Reviewers:` line that still uses the old name; nothing open may name the old name when it merges. Kim Wexler is kept in mind for a
  hire who fits her persona. The name belongs to the seat, not the session: it survives rotation and a fresh session
  in the seat keeps it. Org Design (Nacho) picks each name; Rules Steward (Francesca) records it in team.csv when the
  seat is listed.
- **Reuse:** a name can be reused once its old seat has closed, and only one live seat holds a name at a time. Where a
  reused name's history could be ambiguous, refer to the seat by name and role, e.g. "Hank (Incident Log)".
- **Records use the role, not the name:** the name is flavor. Anything saved or logged (team.csv keys, DECISIONS rows,
  tracker fields, verdict tokens, incident and release logs) identifies a seat by a stable role id in lower case with
  hyphens, such as `release-planner` or `review-broker`. The name may appear beside the role id, never alone as the
  identifier. This applies to new entries. team.csv has a `role_id` column for this: filled for every row added
  from 2026-10-21 (first use: `team-audit` closed, `review-broker` opened, both named Gomez), and a name may then appear
  on two rows only with different role ids and at most one of them active. Existing name-keyed records (team.csv rows
  without a role id, the ledger test's list of names, the `(reviewer: <name>)` verdict token, Who does what Owner cells,
  ledger owner columns) stay as they are until a separate, scoped migration. Rules Steward (Francesca) keeps the list of these as drift. Until that migration a reviewer
  signs `(reviewer: <name>)` with its seat name; nobody posts a role id such as `review-broker` as the reviewer, and the
  Review Broker posts no verdict at all.
- **Named under this rule (2026-10-21):** the Review Broker (`review-broker`), a fresh seat, reuses Gomez from the closed
  Team Audit seat (`team-audit`; Isaac, 23:18:50Z). Fresh governance review is Ted (was Cliff) and Builds &
  Macros is Todd (was Werner), replacing Better Call Saul-only names given the same evening; Rules Steward picked Ted
  and Todd on the coordinator's ask.

### COM-21

_Owner, project chat 2026-10-22 12:53:10Z (cmsg_01UNirAFgxf3jC8kQS8uvvHBFnYQN72LyjG14jCSGJbzo8): "Every role or thread
needs to check with you and org design before handing off work". Narrow reading confirmed 12:55:01Z
(cmsg_01UNirAFgxf3jC8kQS8uvvHBRL9CRjzSC7H34kuWFHNctk): "No I agree with you", to the coordinator's "the check covers
real hand-offs (new owner or new builder) and not routine reviews or syncs". Routed by the coordinator 12:53Z and
12:54Z; one-hop design by Org Design (Nacho), the owner; written by the Rules Steward (Francesca). The three checks
(owner, capacity, conflict of interest) are the coordinator's answer to Isaac's 6:50 PM ET Oct 20 "Every delegation
needs to be thought through", until now kept only in the coordinator's notes._

- **A hand-off is checked with the coordinator and Org Design first.** A hand-off moves owned work to a different role:
  a To-do or issue owner, a PR's HOLD owner, a duty, a deliverable, or a new thread or one-off started to do the work.
  Not hand-offs: a review request to a named gate, a relay, an event on work already assigned, and a route the rules fix
  (kickoff, and a partial build's hold once item 47 lands).
  - **One hop:** the role handing off sends the coordinator four lines (item; from → to; why; the receiver's open
    items) and waits. The coordinator logs it with the existing three checks (owner per Who does what, capacity,
    conflict of interest) and asks Org Design in the same step; the handing role never messages Org Design separately.
  - **Pre-backed routes:** a hand-off to the ledger or Who-does-what owner is backed by Org Design in advance and logged
    "Org Design: pre-backed". Org Design answers BACKED or REDIRECT live only when the receiver isn't the listed owner,
    it creates a new duty, the receiver would gain more than 2 new duties in a day, or it touches an independent role
    or an owner-held limit.
  - **Starting a thread or one-off is the coordinator's** (DEC-20261020-hiring); a role that needs a builder or helper
    asks the coordinator, never starts its own.

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
  - **Pushing to an approved PR** (amends MRG-11, no new id; Kaizen batch-0.9 item 36, Gale's draft; routed by the
    coordinator 2026-10-22T06:06Z; three times on 2026-10-22, on #824, #832 and #833, a fix pushed after the approvals
    landed lost the race to auto-merge, which took the approved sha, so each fix needed a follow-up PR and another
    review round): first check the PR is still open. If any approval is already on the PR,
    add `hold` and post a closed-list HOLD line before pushing, for example `HOLD: VERDICT: OK (reviewer: <a required
    reviewer>) on head (owner: <author>)`, or `HOLD: FRESH REVIEW OK on head (owner: <author>)` when the PR waits on a fresh review.
    Auto-merge lifts it once that marker names the new head and every other review the PR needs approves it too
    (MRG-09), so no new marker is needed. If the PR merged before the hold landed, the fix goes in a follow-up PR as
    before. MRG-12 already keeps an unreviewed head from merging; this saves the rework, not a safety gap.
  - **A merged PR wakes Tracker Sync** (amends TRK-12, no new id; decided by the coordinator 2026-10-21 9:52 AM ET,
    option (a) in Kaizen's usage plan v2 §4.1, and left unrecorded until Kaizen batch-0.9 item 44, routed 2026-10-22T11:15Z):
    a thread whose own PR merges sends Tracker Sync (Huell) one line, `MERGED #<n>`, in the turn its merge event wakes
    it; Build Pipeline (Gus) sends the kickoff build merges, and Huell's `freshness.py` and the health check catch
    misses. Huell has no timer (CLK-03) and receives no GitHub events: a merge reaches Huell only by a
    message or by the GitHub read in a write Huell is already making. So #846 (merged 09:01Z) waited for Build Pipeline
    (Gus)'s 09:34Z PR check, and #851 (merged 10:52:56Z) for the 11:09Z one. Gus's PR check (CLK-01) stays the backstop,
    and Huell's diff on each sync makes a duplicate line harmless.

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
