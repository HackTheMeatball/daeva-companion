# Which keys AION 2 can bind (0.9 P22, Jane's D3)

Game Data Check, 2026-10-20. Research only. Read 2026-10-20 with our User-Agent, 10 s apart: daevaguides
`/en/guides/macros/` and aion2maps `/guides/commands-and-controls/` (both Full; aion2maps labels its default-key table
"Datamine" of the Global client). Also Metabot `/guides/stigma-guide`, read for `2026-10-respec.md`. Facts only.

## What the client has to bind

Settings (O) → Key Settings. Any of these can be changed there (aion2maps; the in-game path matches claim C21).

| Action | Global default | Sources | Label |
|---|---|---|---|
| Skill slot 1 (basic attack) | Left click, or R | aion2maps; owner's default keys (C21a: left click Quick Slice) | 2+ sources |
| Skill slot 2 (strong attack) | Right click, or T | aion2maps; C21a (right click Savage Roar); `Quick Use 2` on T is the owner's | 2+ sources |
| Skill slots 3–6 | 1, 2, 3, 4 | aion2maps; C21a | 2+ sources |
| Skill slots 7–8 | Q, E | aion2maps; C21a | 2+ sources |
| Skill slots 9–12 (the 4 stigma slots) | 5, 6, 7, 8 | aion2maps; Metabot names them Quick Use 9–12 | 2+ sources |
| Consumable slots 1–8 | F1–F8 | aion2maps | single source |
| Transformation skills 1–4 | Ctrl + 1–4 | aion2maps | single source |
| Macro | **none** (Key Settings → General → Gameplay → Macro) | daevaguides; aion2maps; claim C21 (single source until now) | 2+ sources |
| Jump / glide / Defiance | Space | aion2maps | single source |

## Rules that limit a binding

1. **Each skill slot holds up to 4 skills** (rows 0–3), and the lowest ready row fires (claim C21, 2 sources;
   daevaguides). A key binds a slot, not a skill.
2. **Mouse buttons take skills and the macro, but not in AION 1 control mode.** In AION 1 mode, skills and the macro bound
   to a mouse button stop working; the basic and strong attacks keep R and T (aion2maps; daevaguides: "a mouse button
   bound to the [macro] … AION 1 control mode"). 2+ sources.
3. **Side mouse buttons can be bound** ("most players use right mouse or a side mouse button" for the macro, daevaguides).
   Single source. That every key can take a modifier (Ctrl / Alt / Shift +) is not stated for skill slots; defaults use
   Ctrl + for transformation and fly up / down, and Alt + for windows (aion2maps).
4. **Key Settings flags a button already in use** (aion2maps, said of the gamepad layout). Single source; that it also
   flags keyboard keys is inferred.
5. **Not found:** a list of keys the client refuses (an unvetted search result names Ctrl + mouse button and the mouse
   wheel). Whether every slot takes a second key is likewise unknown: only slots 1 and 2 show two defaults. Owner check:
   try binding a skill slot to Ctrl + right click and to the mouse wheel, and look for a second key field on slot 3.

## For the design (Key setup sheet)

The sheet can offer: the 12 skill slots (stigmas on 9–12), the macro, and any keyboard key or mouse button. It should warn
that mouse-button bindings need AION 2 control mode. It should not promise Ctrl + mouse, the wheel or a second key per
slot until the owner check above is done.
