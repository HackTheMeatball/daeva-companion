# research-401-levels: the level each Ishalgen story quest is turned in at (0.8 P15, #401)

Game Data Check, 2026-10-20. Gate `research-401-levels` for P15 (#504). Three independent kinds of evidence agree:

- **Metabot quest pages** (game-database field, global client 0.0.4387.0): each quest's EXP reward, read 2026-10-20
  (`https://metabot.gg/en/aion-2/quests/<slug>`; 10 pages, our User-Agent, 8 s apart).
- **Metabot EXP table** (`https://metabot.gg/en/aion-2/leveling`, same build, read 2026-10-20): EXP needed to finish
  each level.
- **The owner's reward windows** (private repo `screenshots/`, commits c61678d and 5a8e7e1, 2026-10-15 alt run) show each
  reward as a share of a level (100% or 50%). His Lv 4 frame with an empty EXP bar follows Shadow Forest. He also wrote
  (Game Data Check thread, 2026-10-20 8:36 AM ET): "every quest in ishalgen when turned in levels you up, meaning when
  you finish the longest night you're level 10."

## Result

Every 100% quest's EXP reward is exactly the EXP needed to finish one level. The two 50% quests together give exactly
one level.

| Quest | Metabot rec. Lv (`lv`) | EXP reward | EXP to finish Lv N (table) | Owner screen | Turned in at → after |
|---|---|---|---|---|---|
| A Village in the Fog | 2 | 1,133 | Lv 1: 1,133 | 100% | **1 → 2** |
| Prepare to Escape | 2 | 1,712 | Lv 2: 1,712 | 100% | **2 → 3** |
| Shadow Forest | 3 | 2,589 | Lv 3: 2,589 | 100% (and the Lv 3 → 4 screen, 2026-10-18) | **3 → 4** |
| Isolated Lake | 4 | 3,915 | Lv 4: 3,915 | 100% | **4 → 5** |
| The Being Beneath the Lake | 5 | 2,959 | Lv 5: 5,919 (half) | 50% | 5 → 5 (half a level) |
| Spread Your Wings | 6 | 2,960 | 2,959 + 2,960 = 5,919 | 50% | 5 → 6 (completes Lv 5 with the quest before) |
| Signs of a Crash Landing | 6 | 8,950 | Lv 6: 8,950 | 100% | **6 → 7** |
| Prison Compound Infiltration Plan | 7 | 13,532 | Lv 7: 13,532 | 100% | **7 → 8** |
| Brigade Prison Compound Infiltration Operation | 7 | 20,461 | Lv 8: 20,461 | 100% | **8 → 9** |
| The Longest Night | 9 | 30,937 | Lv 9: 30,937 | not on screen | **9 → 10** |

So the turn-in level is not Metabot's recommended level. It differs for A Village in the Fog (1, not 2) and for the
Brigade operation (8, not 7). This is the mismatch #401 describes.

## For P15

- The eight **bold** rows qualify for auto level-up under `owner-ok-autolevel` (a full level of EXP, sourced). Each
  stores its from-level: `levelsUp: { from: N }`.
- The Being Beneath the Lake and Spread Your Wings give 50% each. Neither is a 100% quest, so neither auto-levels, even
  though the second usually tips you over.
- Assumption to keep in the app rule: the quest grants a fixed EXP amount, so it is a full level only when turned in at
  its from-level. Turned in later (after extra mob EXP), it gives less than a level. That is why the rule fires only when
  the current level equals `from`, as P15's spec says.
- The Longest Night's 100% is backed by the EXP match and the owner's statement, not by a reward screen.
