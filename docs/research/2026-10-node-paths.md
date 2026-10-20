# Daevanion node paths and costs, all 8 classes (0.9 note 14, P16)

Game Data Check, 2026-10-20. Research only; no data changed. Computed from data, no fetches. The model is
`tools/gen/board-path.mjs`, the one gen already checks the Assassin with. A node's cost goes by its colour (owner,
2026-10-20: common 1, green 2, blue 3, orange 4, Start 0). A node can be bought only next to one you already own (4
neighbours, from Start). Each plan row costs its cheapest path from everything the earlier rows bought, in plan
`order`. The script is reproducible: run `checkPlanCosts` over each class's `boardPlan` grouped by board (the
scratchpad copy is not committed).

## Per class

| Class | Plan rows | Rows with an owner `cost` | Path cost by board | Total |
|---|---|---|---|---|
| Assassin | 30 | 24 (owner screens) | Nezekan 52, Zikel 47, Vaizel 39, Triniel 46 | 184 |
| Chanter | 6 | 0 | Nezekan 26, Zikel 13 | 39 |
| Cleric | 7 | 0 | Nezekan 29, Zikel 17 | 46 |
| Gladiator | 6 | 0 | Nezekan 21, Zikel 29 | 50 |
| Ranger | 8 | 0 | Nezekan 20, Zikel 24 | 44 |
| Sorcerer | 6 | 0 | Nezekan 31, Zikel 13 | 44 |
| Spiritmaster | 6 | 0 | Nezekan 18, Zikel 24 | 42 |
| Templar | 10 | 0 | Nezekan 36, Zikel 24 | 60 |

Row costs for the 7 classes, in plan order (a/b means two cheapest paths give different costs):

- **Chanter:** Protection Circle 9, 9; Attack Preparation 2, 6; Earth's Promise 4, 9.
- **Cleric:** Condemnation 9; Chain of Torment 8; Divine Aura 7; Light of Regeneration 5/6; Condemnation 9; Divine Aura 5; Earth's Grace 3.
- **Gladiator:** Overhead Slam 9; Rending Blow 4; Ruinous Blow 8; Overhead Slam 12; Rending Blow 9; Ruinous Blow 8.
- **Ranger:** Hunter's Resolve 4, 10; Focused Eye **0**, 6; Rooting Eye 4, 9; Hunter's Soul 8, 3.
- **Sorcerer:** Fire Mark 11, 7; Robe of Earth 5, 8; Grace of Enhancement 4, 9.
- **Spiritmaster:** Spirit Strike 11, 7; Consecutive Countercurrent 4, 9; Element Unification 8, 3.
- **Templar:** Enhance Health 11, 7; Ironclad Defense 3, 9; Guarding Seal **0**, 6; Fury 4, 9; Insulting Roar 3, 8.

## Findings

1. **The 7 classes can take owner-rule costs now.** Every row except Cleric Light of Regeneration (5 or 6, two
   cheapest paths) has exactly one cheapest cost. Label them `inferred` (the colour rule is the owner's; this board
   path model has been checked only on the Assassin, against 24 owner rows with 1 exception). gen then checks them like
   the Assassin's. For Light of Regeneration, the plan should name the path node that makes it 5.
2. **Two rows cost 0** (Ranger Focused Eye 1 of 2, Templar Guarding Seal 1 of 2). The node lies on an earlier row's
   path, so buying that row already buys it. Taking it as its own row *before* that row gives the same points in a
   better order. Proposal: move each one ahead of the row whose path buys it.
3. **Points versus plan, Assassin.** Points by level: 4 per level past 11 (`rule:crystals-per-level`, single source,
   inferred), so 116 at Lv 40 and 136 at Lv 45, plus Daevanion Crystals from rewards. The data has 80 crystals in
   regional quest and Sealed Dungeon rewards, at most about 49 of them before Lv 45 by recommended level. That a crystal
   is worth one point is **inferred**. The Assassin plan costs 184 by its last row (Triniel at Lv 40), against at most
   about 165 at Lv 40. The plan finishes around Lv 45 at the earliest, and its rows wait on points, not on the level.
   Next up already gates a tick on points left (`dvGateOf`). For the "best thing to do" bar, row order is the
   recommendation that matters when points run short. Owner check: the board's points total at Lv 40 and at Lv 45 on
   the Assassin, which settles both the per-level rule and the crystal value.
4. **The 7 other classes spend 39–60 of about 136–216 points.** Vaizel and Triniel have no plan rows
   (`2026-10-choice-points.md` §3), so 76+ points go unrecommended. That is a no-pick choice (`noPick: no-source`) until
   a source gives those boards' paths. No source in the data gives one for these classes.
5. **Path nodes are not plan rows.** A row's cheapest path buys other nodes on the way (for example, the Assassin's direct
   path to the Vaizel corner buys r9c13, r9c12, r10c12, r11c12 (Infiltrate), r11c13, r12c13, r13c13). The plan shows only
   the targets. A player following Next up needs the path's nodes, or at least its count and cost. That is a UI item for
   P16, not a data error.
6. Still open: the owner's Vaizel Assault Stance check (r5c13: path 4, owner's screen 5).
