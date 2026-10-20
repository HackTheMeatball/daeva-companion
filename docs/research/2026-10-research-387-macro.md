# research-387-macro: key setup and macro facts for 0.8 P14 (#387)

Game Data Check, 2026-10-20. Gate `research-387-macro` for P14 (#503). Sources are the owner's game (the source of truth)
and the two written guides already cited in #387. No new site was read for this note.

## Answers

| # | Question (#387) | Answer | Basis |
|---|---|---|---|
| a | Can a macro step fire a stack bound to the macro's own key? | Yes: the macro on right click fires the Quick Use 2 stack | Owner, project chat 2026-10-18 8:12 PM ET ("hold right click and all the skills in my quickslot 2 … fire automatically"). That the stack's T label is the same Quick Use 2 slot is inferred (#387 comment, 2026-10-18 8:59 PM ET) |
| b | Does a macro step naming a stacked skill fire the whole stack, lowest ready row first? | Yes | Owner (as above) and C21; macro list order runs from step 1 (aion2turkiye) |
| c | Does the one-key macro replace "hold both clicks"? | **No.** Holding right click alone runs out of MP; holding both clicks prevents it | Owner, Game Data Check thread 2026-10-20 8:36 AM ET: "Right click alone will eventually run out of MP—holding both prevents that." Agrees with daevaguides and aion2turkiye (hold both) |
| d | Is E the default slot for Shadowstrike? | **No. The game default is key 1.** E holds the Heart Gore stack | Owner, same message: "Yes I moved it manually to E." Defaults: owner's Lv 4 Skill window (project chat, 2026-10-20 10:16 AM ET), see below |
| – | Default Macro key | None | daevaguides (#387 comment, 2026-10-18) |

## The game's default keys (Assassin, Lv 4)

The owner's Skill window at Lv 4, posted as "locked skills and default skill rows for assassin" (2026-10-20; not archived, this is the text record). Key labels on the
Active list and on the quick-slot grid:

| Key | Skills (unlock level) |
|---|---|
| Left click | Quick Slice (1) |
| Right click | Savage Roar (1) |
| 1 | Shadowstrike (1) |
| 2 | Ambush (3) |
| 3 | Flash Slice (8) |
| 4 | Insignia Explosion (14) |
| E (stack) | Heart Gore (4) on top, then Storm Rampage (5) and Whirlwind Slice (7) below it |
| Q (stack) | Infiltrate (10), Shadow Fall (12) |
| none | Defiance (16) |

The same window shows every unlock level in `classes/assassin/skills.json`: actives 5, 7, 8, 10, 12, 14, 16 and passives
6, 9, 11, 13, 15, 17, 21, 23, 25 (Heightened Sixth Sense at 1). All match.

## What this means for P14

- The guide keeps **"hold both clicks"** as the instruction. The owner's one-key macro (Heart Gore stack, then Quick Slice,
  10 ms delays) is not a replacement: it drains MP when used alone.
- **Shadowstrike's default key is 1**, not Q (the guide's `opener` text, "Q (Shadowstrike)", in
  `asmodian/assassin/builds.json`) and not E (the plan's "Shadowstrike on E", docs/plans/0.8/README.md §P14, which came from
  the owner's own layout). The default E is the Heart Gore stack and the default Q the Infiltrate / Shadow Fall stack.
- Still sourced and unchanged: the game's grid columns are Q, E, the Quick Use 2 (mouse) slot and T. Binding the macro to
  right click takes right click from Quick Use 2, whose stack then shows on T. Macro steps start at Add Macro, because
  the Macro tab is empty the first time (owner's Lv 4 screens, 2026-10-18 8:01–8:11 PM ET; not archived, text record in `docs/design/0.6.2-icons-locks-mockup.md` §1a–1b and `docs/research/owner-screens-2026-10-18/README.md`).

## Still open (not blocking P14)

- Nothing on the defaults. As with the Ranger, Gladiator and Templar (owner screens, 2026-10-18), the Assassin default puts a
  stack on both Q and E.
