# Skill bar and macros: how the game works, and what the app must draw (0.9 P22)

Game Data Check, 2026-10-21, for 0.9 P22 (#387) and the Gladiator key setup build. Sources: the owner's statements
and screens (the source of truth), claim C21 / C21a, `2026-10-research-387-macro.md`, and the beta session T1 report
(log B4). Nothing was fetched. Kanon's Aion 2 Bible (owner upload) was read in full and has no macro section.

## Facts

| # | Fact | Status | Basis |
|---|---|---|---|
| 1 | The game has 12 skill quickslots (Quick Use 1–12), all rebindable, each with a second key. Defaults: 1 = left click / R, 2 = right click / T, 3–6 = 1–4, 7 = Q, 8 = E, 9–12 = 5–8. Quick Use 1 holds only the base attack (row 0); every other quickslot holds up to 4 skills and/or stigmas, rows 0–3 | Verified | Owner (owner, 2026-10-21 22:29 and 22:32 UTC; Key Settings > Quickslot screens, `builds-macros/screens-t106/`); C21 (two sources) |
| 2 | Row 0 fires first; a skill that isn't ready is skipped | Verified | C21; the owner, 2026-10-21 ("0 is the highest priority") |
| 3 | The game's grid draws row 0 at the bottom | Verified | C21a (owner screens, 2026-10-18) |
| 4 | A macro is a separate, ordered list of steps (Add Macro); the Macro tab is empty the first time | Verified | `2026-10-research-387-macro.md`; C21 |
| 5 | A macro step is either a whole skill bar (a slot: it fires that slot's whole stack, rows 0–3 by priority) or a single skill. Steps fire top to bottom. A single-skill step is used only where a build guide recommends one | Verified | Owner (2026-10-18; 2026-10-21 16:05 and 16:19 UTC, first-hand play); research-387 row b |
| 6 | A macro can sit on any key that has a 0–3 row (seen on Q, E and right click / T, which are one quickslot; on Quick Use 3–6 and 9–12 inferred from fact 1), one macro per key, several per class. Stepping through two or more bars cycles more than 4 skills. Left click is the main ability: never stacked, never holds a macro, and may only be a macro's last step | Verified | Owner, 2026-10-21 (beta T1; 13:53 and 14:07 UTC); C21 (a no-cooldown skill blocks the steps after it) |
| 7 | A macro holds at most 20 entries, each with its own delay in ms | Verified | Owner (owner, 2026-10-21 22:29 and 22:32 UTC; Key Settings > Quickslot screens, `builds-macros/screens-t106/`) (T-106) |
| 8 | A skill or stigma sits in one quickslot at a time; no duplicates | Verified | Owner, 2026-10-21 22:32 UTC (T-61 item 10) |
| 9 | A stigma can join a skill-slot stack: it goes in any slot a skill can | Verified | Owner, 2026-10-21 22:21 and 22:32 UTC (T-104, T-61 item 6) |
| 10 | Holding right click alone runs out of MP; holding both clicks prevents it | Verified | Owner, 2026-10-20 (research-387 row c) |
| 11 | R and T are not quickslots of their own: by default R is Quick Use 1's (left click's) second key and T is Quick Use 2's (right click's). F holds no skill (F1–F8 are consumables). The Spiritmaster has no recorded default keys yet | Verified | Owner (owner, 2026-10-21 22:29 and 22:32 UTC; Key Settings > Quickslot screens, `builds-macros/screens-t106/`); `defaultKeys`, owner screens for 7 classes (2026-10-18). Corrects this row's earlier "R holds no skill" |

## What the app must draw (owner decisions)

- **The key grid matches the game: row 0 at the bottom** (owner, 2026-10-21 02:16 UTC, card). This replaces the
  0-to-3 top-down order asked for earlier the same day.
- **The skill bar matches the in-game bar.** "Exactly" means the game's layout, columns and labels (Q, E, Quick Use 2,
  T, the number keys), not a tester's own bindings. The game's default keys are recorded for 7 classes
  (`defaultKeys`, owner screens 2026-10-18); the Spiritmaster has none yet.

## What this means for the data (inferred; for P22's scope)

- `keyStacks` has the macro shape since #743: `slots` (up to 4 skills a slot, a check) and `macros` (one per key in
  Q, E, T, right click; ordered steps, each `{ slot }` or `{ skill }`; the basic attack only as the last step, a
  check). The step limit is 20 (fact 7).
- The Builds & Macros researcher's task 1 (hired 2026-10-21) is that shape plus the Assassin. Walter places its lanes
  against P22.
- The Gladiator's held Rage Burst row (4 skills) is allowed by facts 8 and 9.

## Open

- Where the macro information comes from: the owner's own play (Ernesto, 2026-10-21 16:05 UTC); closed.
- Facts 7–9 and 11: answered by the owner on 2026-10-21 (T-104, T-106, T-61 items 6 and 10).
- Open: what "Separate Special Skill Hotkey" (Quick Use 1 and 2, default off) does; a macro seen on a number-key quickslot.
