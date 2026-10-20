# research-387-macro: key setup and macro facts for 0.8 P14 (#387)

Game Data Check, 2026-10-20. Gate `research-387-macro` for P14 (#503). Sources are the owner's game (the source of truth)
and the two written guides already cited in #387. No new site was read for this note.

## Answers

| # | Question (#387) | Answer | Basis |
|---|---|---|---|
| a | Can a macro step fire a stack bound to the macro's own key? | Yes: the macro on right click fires the Quick Use 2 stack | Owner, project chat 2026-10-18 8:12 PM ET ("hold right click and all the skills in my quickslot 2 … fire automatically"). That the stack's T label is the same Quick Use 2 slot is inferred (#387 comment, 2026-10-18 8:59 PM ET) |
| b | Does a macro step naming a stacked skill fire the whole stack, lowest ready row first? | Yes | Owner (as above) and C21; macro list order runs from step 1 (aion2turkiye) |
| c | Does the one-key macro replace "hold both clicks"? | **No.** Holding right click alone runs out of MP; holding both clicks prevents it | Owner, Game Data Check thread 2026-10-20 8:36 AM ET: "Right click alone will eventually run out of MP—holding both prevents that." Agrees with daevaguides and aion2turkiye (hold both) |
| d | Is E the default slot for Shadowstrike? | **No, E is the owner's own choice.** The game default is not known yet | Owner, same message: "Yes I moved it manually to E." The owner will send a defaults screenshot later |
| – | Default Macro key | None | daevaguides (#387 comment, 2026-10-18) |

## What this means for P14

- The guide keeps **"hold both clicks"** as the instruction. The owner's one-key macro (Heart Gore stack, then Quick Slice,
  10 ms delays) is not a replacement: it drains MP when used alone.
- **Shadowstrike stays on Q** in the default keys until a screenshot of the game's defaults shows otherwise. The plan's
  "Shadowstrike on E" (docs/plans/0.8/README.md §P14) came from the owner's own layout and should not ship as a default.
- Still sourced and unchanged: the game's grid columns are Q, E, the Quick Use 2 (mouse) slot and T. Binding the macro to
  right click takes right click from Quick Use 2, whose stack then shows on T. Macro steps start at Add Macro, because
  the Macro tab is empty the first time (owner's Lv 4 screens, 2026-10-18 8:01–8:11 PM ET; not archived, text record in `docs/design/0.6.2-icons-locks-mockup.md` §1a–1b and `docs/research/owner-screens-2026-10-18/README.md`).

## Still open (not blocking P14)

- The game's default K-window layout for a fresh Assassin (owner screenshot after Key Settings → reset to defaults).
  Ranger, Gladiator and Templar defaults each put a stack on both Q and E (owner screens, 2026-10-18), so the Assassin
  default may differ from the guide's Q as well; the guide's current Q stays until that screen arrives.
