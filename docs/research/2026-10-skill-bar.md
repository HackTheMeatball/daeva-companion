# Skill bar and macros: how the game works, and what the app must draw (0.9 P22)

Game Data Check, 2026-10-21, for 0.9 P22 (#387) and the Gladiator key setup build. Sources: the owner's statements
and screens (the source of truth), claim C21 / C21a, `2026-10-research-387-macro.md`, and the beta session T1 report
(log B4). Nothing was fetched. Kanon's Aion 2 Bible (owner upload) was read in full and has no macro section.

## Facts

| # | Fact | Status | Basis |
|---|---|---|---|
| 1 | One skill slot (Q, E, the Quick Use 2 mouse slot, T) holds up to 4 skills, rows 0–3 | Verified | C21 (two sources); the owner, 2026-10-21 |
| 2 | Row 0 fires first; a skill that isn't ready is skipped | Verified | C21; the owner, 2026-10-21 ("0 is the highest priority") |
| 3 | The game's grid draws row 0 at the bottom | Verified | C21a (owner screens, 2026-10-18) |
| 4 | A macro is a separate, ordered list of steps (Add Macro); the Macro tab is empty the first time | Verified | `2026-10-research-387-macro.md`; C21 |
| 5 | A macro step that names a skill in a slot fires that slot's whole stack | Verified | Owner (2026-10-18); research-387 row b |
| 6 | So a right-click macro that steps through two or more slots cycles more than 4 skills | Verified | Owner, 2026-10-21 (beta T1); follows from 1 and 5 |
| 7 | The most steps a macro can hold | **Unknown** | No source. Owner check on T-61: "try adding a 5th step" |
| 8 | One skill can sit in two slots at once | **Unknown** | No source. Owner check T-61 item 10. Until then, the guide shows a skill as moved, never on two keys |
| 9 | A stigma can join a skill-slot stack | **Unknown** | T-61 item 6; Metabot puts stigmas on slots 9–12, two guides show mixed columns (`2026-10-stigma-slots.md`) |
| 10 | Holding right click alone runs out of MP; holding both clicks prevents it | Verified | Owner, 2026-10-20 (research-387 row c) |

## What the app must draw (owner decisions)

- **The key grid matches the game: row 0 at the bottom** (owner, 2026-10-21 02:16 UTC, card). This replaces the
  0-to-3 top-down order asked for earlier the same day.
- **The skill bar matches the in-game bar.** "Exactly" means the game's layout, columns and labels (Q, E, Quick Use 2,
  T, the number keys), not a tester's own bindings. The game's default keys are recorded for 7 classes
  (`defaultKeys`, owner screens 2026-10-18); the Spiritmaster has none yet.

## What this means for the data (inferred; for P22's scope)

- `keyStacks.rightClick` today is one flat list per level band, drawn as one stack in Quick Use 2. It can't express
  fact 6. The macro needs its own shape: ordered steps, each naming a slot or a lone skill. Each slot keeps no more
  than 4 skills (a check), and the step count stays open until fact 7 is answered.
- The Builds & Macros researcher's task 1 (hired 2026-10-21) is that shape plus the Assassin. Walter places its lanes
  against P22.
- The Gladiator's held Rage Burst row (4 skills) waits on facts 8 and 9.

## Open

- Where the owner saw the macro information (it isn't in Kanon's Bible): open with the owner, via Ernesto.
- Facts 7–9: the T-61 "5th step" check, items 10 and 6.
