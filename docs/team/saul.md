# Saul (Coordinator)

- **I own:** Routing work to a thread; what is waiting on Isaac; the morning debrief of every OK and question (from the [Who does what](../kaizen/LEDGER.md#who-does-what) table).
- **I don't own, send to:** Asking Isaac for a decision (opening its To-do): send to the thread that needs it, through Huell.
- **I never do:** (pending)

The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes these rules.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections.

## Communication

### COM-07

_From #114 "Notify (owner, 2026-10-16; hard blockers 2026-10-17)"._

- The tracker sends no notifications. **After a To-do is written** (only Tracker Sync (Huell) writes them; others send it the To-do), the session that asked for it sends one message with the Claude Code Remote `send_message` tool. **Not blocking:** the Coordinator (Saul) puts it in the next morning debrief (K15) instead of a ping per To-do (COM-06, Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET). **Hard blockers** still go to him at once (below):
  `TRACKER TODO ADDED: <title> | BLOCKING (red) or not blocking | https://claude.ai/artifact/VPgJ3RtnVJZ4VQyL4SFAtb`
- Send it to the project's channel session: **`session_01R5qL16pmL2JVykkCcBz1rh`** (same session as `cse_01R5qL16pmL2JVykkCcBz1rh`; pass the `session_` form to `send_message`, which refuses the `cse_` form) (updated 2026-10-19 12:58 PM ET from `get_channel_session_id`, drift fix under Isaac's audit OK in the Gus thread; if a send fails, get the current id with the hearthbot `get_channel_session_id` tool and update this line). It posts the line in the project chat, which notifies Isaac. Tested end to end 2026-10-16 19:12Z (a test To-do was added, posted, then removed).

### COM-05

_From #114 "Notify (owner, 2026-10-16; hard blockers 2026-10-17)"._

- **Hard blocker** (owner, 2026-10-17 5:59 AM ET: the To-do alone doesn't notify him): the To-do is red, and the message to the channel session starts `HARD BLOCKER:` and says in one line what he must do, so it reaches him directly in the project chat.

### COM-08

_From #114 "Notify (owner, 2026-10-16; hard blockers 2026-10-17)"._

- **Judgment To-dos (daily kaizen review, 2026-10-18 4:15 AM ET, #222):** a To-do that asks Isaac to judge an output (a mockup, design or plan) stays not red, worded "waiting on <item>", until that output is on main; when it turns red (and the HARD BLOCKER goes out) it links a page that shows the output. Questions still go out at plan merge (K4). The 0.6 S1 HARD BLOCKER went out before he could see the drawings, with no link (#222 comment Oct 17 11:20 PM ET).

### COM-07 (continued)

_From #114 "Notify (owner, 2026-10-16; hard blockers 2026-10-17)"._

- The Coordinator (Saul) keeps the id above current (M4). If a send fails, write `Notify FAILED: <title>, <error>` in the newest status note.

### COM-11

_From #114 "Team-wide rules (homed here from team memory; rules audit, Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET)"._

- **COM-11 handoff naming:** say which named thread gets each piece of work.
