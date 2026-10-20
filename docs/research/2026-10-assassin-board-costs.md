# Assassin Daevanion: node costs per board, corners and paths (owner notes 1–4, 2026-10-20)

Game Data Check, 2026-10-20, for 0.8.1. Sources:

- The owner's Lv 39 play-test notes, corrected file `/mnt/project-files/release/owner-notes-2026-10-20-lv39-fixed.txt`. The owner confirmed Zikel's total is 47; 42 was a typo, and the rows were right (2026-10-20 12:37 PM ET). These are the owner's in-game boards, the source of truth for costs.
- A guide sweep of the allowed sites (2026-10-20, 14 requests; log at `scratchpad/corner-research/log.txt`, not kept):
  - daevaguides.com (route credited to couga54 / aion2-guides, so it counts as one source with aion2-guides.info)
  - aion2maps.com
  - aion2-guides.info
  - Metabot and aion2turkiye top-player boards (usage at Lv 45, not advice)
  - skycoach, corpus.gg, gamesfuze and aion2-meta (no node picks)
  - mmo-codex (Spot check)

  aionbuilds.com was down (503).

## 1. Costs per plan row, in the guide's order (owner, 2026-10-20)

"Cost" is the points to reach that node from what the earlier rows already bought: the number the app's cost box
should pre-fill.

| Board | Plan row (`boardPlan` label) | Cost | Now in data |
|---|---|---|---|
| Nezekan | Heart Gore | 9 | — |
| | Exploit Weakness · 1 of 2 | 2 | — |
| | Ambush | 7 | — |
| | Quick Slice | 4 | — |
| | Exploit Weakness · 2 of 2 | 5 | — |
| | Assault Stance · 1 of 2 | 3 | — |
| | Assault Stance · 2 of 2 | 9 | — |
| | Cooldown Reduction or Combat Speed corner | 5 | `via` says "costs 4 (worked out from your board)": **wrong, 5** |
| | Insignia Explosion | 5 | "about 3–5", inferred: now owner-sourced |
| | Shadowstrike | 3 | "about 3–5", inferred: now owner-sourced |
| | **Total** | **52** | |
| Zikel | Heart Gore | 12 | — |
| | Insignia Explosion | 12 | — |
| | Quick Slice | 10 | — |
| | Defense Break · 1 of 2 | 0 | bought on the way to Quick Slice (see §3) |
| | Defense Break · 2 of 2 | 8 | — |
| | Damage Boost corner | 5 | — |
| | **Total** | **47** | |
| Vaizel | Heart Gore | 6 | — |
| | Insignia Explosion | 6 | — |
| | Quick Slice | 5 | — |
| | Assault Stance | 5 | — |
| | Defense Break | 2 | — |
| | Critical Damage Boost corner | 15 | also buys an Ambush and an Exploit Weakness node on the way (owner; see §4) |
| | **Total** | **39** | |

Triniel isn't covered: the owner is Lv 39, and Triniel opens at 40.

Data shape (for the build item): a per-row `cost` on `boardPlan` with an owner source, e.g. `owner:2026-10-20-board-costs-01`
(one ref per board), `fields: ["cost"]`. A cost depends on the order, so it's valid only in the guide's order. If the
player buys out of order, the box should stay editable (today's behaviour).

## 2. Nezekan corners: Cooldown Reduction or Combat Speed (note 2)

**Pick: Combat Speed first, then Cooldown Reduction (2+ sources).**

- **For Combat Speed first:**
  - daevaguides: "On Nezekan GunghoGuns and aLuckyRO start with Combat Speed". Its route takes the Combat Speed corners before the Cooldown Reduction ones.
  - aion2maps: Combat Speed corners are targets 3 and 5 "while levelling"; the Cooldown Reduction corners come later (13–14).
- **No permitted source picks Cooldown Reduction first.** One source does, but it's Game8, which we never use.
- **Top players at Lv 45** own both kinds. Metabot: Combat Speed 99%, Cooldown Reduction 92%. aion2turkiye: all four corners, 100%.
- **Why Combat Speed** (as the sources say it): it raises every hit; Nellan97 via daevaguides: "+10% speed is about +5% damage". Cooldown Reduction mainly brings the burst skills back sooner (corpus.gg, citing Grobs and Madsin). No source compares the two stats head to head.

Change: the plan row "Cooldown Reduction or Combat Speed corner" becomes **Combat Speed corner** (`anyNode` = the two
Combat Speed corners, `node:assassin:nezekan:r13c13` and `…:r3c3`, checked in
`data/packs/aion2/classes/assassin/board-nodes.json`; the Cooldown Reduction corners are `r13c3` and `r3c13`). Later rows take the Cooldown Reduction corners. The label says why, in one line.

## 3. Zikel: Defense Break 1 of 2, and which Damage Boost corner (note 3)

- **Defense Break 1 of 2:** keep it at 0, after Quick Slice, as the owner has it. The owner's path to Quick Slice already buys it. Putting it first (3) and Quick Slice second (7) costs the same 10. The guides don't help here:
  - daevaguides takes it as a pass-through node.
  - aion2maps leaves both Zikel Defense Break nodes out.
  - Both rate the passive as low PvE value; mmo-codex lists it under PvP.

  So the order is the owner's, and the row's `via` says "bought on the way to Quick Slice".
- **Damage Boost corner:** guides and top players take **both** (2+ sources); the owner's plan takes one at 5. Which one first is **contested**:
  - daevaguides goes bottom-left first, through Attack +3 next to Heart Gore.
  - aion2maps goes top-right first, through Defense +30 next to Insignia Explosion.
  - Top players own both paths (Metabot: Attack +3 98%, Defense +30 95%).

  **Pick: bottom-left via Attack +3 (contested).** It's the PvE damage stat, and it sits next to Heart Gore, the board's first row. This is the guide's reasoning, not a source's. The row names the other path.

## 4. Vaizel: the Critical Damage Boost corner's extra nodes (note 4)

- **Exploit Weakness on the bottom-right path:** the corner's path buys an extra Exploit Weakness node.
  - Owner's board.
  - daevaguides, 2+ sources: "Critical Damage Boost +1.5% → → from node 33 (Exploit Weakness)".
  - aion2maps, 2+ sources: makes Exploit Weakness its own target between the two Critical Damage Boost corners.
- **Ambush on the way:** the owner's board shows an Ambush node on the way. No guide routes Ambush that way (gap in the guides; the owner's screen is the source). daevaguides takes Ambush Stance, but on the way to the Critical Damage Tolerance corner instead.
- **For the build item:** add both as plan rows with `via: "on the way to the Critical Damage Boost corner"` and cost 0 after the corner (or split the 15). Then the skill nodes count toward effective skill level (`2026-10-effective-skill-level.md`, gap 2). Which split the owner's 15 hides needs one owner number. **Question for the owner:** of the 15, how much is the corner itself after the Ambush and Exploit Weakness nodes?

## 5. Toward the per-class node audit (note 14, 0.9)

Two things came out of this for the audit:

- The guide's plan rows are only targets. The nodes a path buys on the way are invisible to the app.
- Two independent route sources exist for the Assassin: daevaguides (couga54) and aion2maps.

The 0.9 audit should compare each class's `boardPlan` with both routes and with the top-player usage. It should list every on-path skill node as a plan row.
