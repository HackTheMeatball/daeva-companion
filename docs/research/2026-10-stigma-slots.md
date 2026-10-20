# Where a stigma can be bound (0.9 P22, Jane's D4, slug `stigma-slots`)

Game Data Check, 2026-10-20. Research only. No new fetches: the pages read 2026-10-20 for `2026-10-respec.md`,
`2026-10-bindable-keys.md` and `2026-10-rotation-play.md` (Metabot `/guides/stigma-guide`, daevaguides
`/en/guides/stigmas-guide/` and `/en/guides/macros/`, aion2turkiye `/en/class/cleric/` and `/en/class/spiritmaster/`,
aion2maps `/guides/commands-and-controls/`). Facts only.

## What the sources say

| Fact | Sources | Label |
|---|---|---|
| A stigma works only while it is registered to one of the stigma quickslots; their default key labels are Quick Use 9–12 | Metabot | single source |
| The number of stigmas you can register goes by level (1 at 22, 2 at 27, 3 at 32, 4 at 37), matching the four stigma quickslot actions | Metabot; daevaguides (slot levels, "only the slotted ones go on your bar") | 2+ sources |
| Skill slots 9–12 default to keys 5–8 | aion2maps; Metabot | 2+ sources |
| A stigma can share a skill column with regular skills: Cleric Earth Punishment (stigma) heads the column with Divine Aura, Condemnation, Chain of Torment; Spiritmaster Corrode (stigma) heads the column with Curse, Dimensional Control, Combustion | aion2turkiye (Cleric, Spiritmaster); daevaguides (Cleric main line with Earth Punishment and Prayer of Amplification, both stigmas; Spiritmaster line with Corrode row 0) | 2+ sources |
| Which slot number holds such a mixed column | not stated by any source | **unknown** |

## Answer to D4

1. **Can a stigma go in a regular slot (1–8)?** Not settled. Two sources show stigmas in the same column as regular
   skills, so stigmas are not limited to a column of their own. No source says whether that column sits on a regular
   slot (1–8) or on a stigma slot (9–12). Two readings fit every source:
   - (a) registering a stigma (up to 4) is what turns it on; once registered it can be placed in any column, 1–12;
   - (b) only columns 9–12 take a stigma, and those columns can also take regular skills.
2. **The guide's E column** (slot 8, `keyStacks.eOrder`, four stigmas) works under (a) and not under (b). It is
   already labelled inferred and is the guide's suggestion, not the game's default: the owner's screen shows E holding
   Storm Rampage, Whirlwind Slice and Heart Gore (claim C21a).
3. **Safe under both readings:** each stigma on its own stigma slot, keys 5–8 (Metabot's registration rule, the
   client's defaults). Stacking all four on one stigma slot is safe only if (b)'s columns hold 4 rows, also unstated.

## For the design (P22)

Until the owner check below, the key setup should show the stigmas on keys 5–8 (one each, the default) and offer the
E stack only as "check in game". If the check confirms (a), the E stack can stay as drawn.

**Owner check, one screen** (added to To-do T-61): in the skill window, drag a registered stigma onto a row of slot 8
(E). If the client takes it, reading (a) holds. If it refuses, try a regular skill onto a row of slot 9 (key 5) to
test (b).
