# Owner's Chanter skill window (K), Lv 4 character, 2026-10-19 1:36 PM ET

Posted by Isaac in the project chat. Filed by Release Planner (Walter). Not yet checked: Game Data Check (Gretchen)
checks it against Metabot (unlock levels, icon ids, default keys) and updates this file. Input for 0.9's Chanter pack.

## Checked by Game Data Check (Gretchen), 2026-10-19

Source: Metabot class page https://metabot.gg/en/aion-2/classes/chanter and the 12 active skill pages
(`/en/aion-2/skills/<slug>`), fetched 2026-10-19 with our research UA, 6.5 s apart. Icons matched to the screen by eye
(Metabot icon WebPs side by side with the crop); mouse badges read from the lit half.

| Key (screen) | Skill | Metabot unlock | Icon id | Agrees? |
|---|---|---|---|---|
| LMB (left half lit) | Onslaught | 1 | 18010000 | yes |
| RMB (right half lit) | Incandescent Blow | 1 | 18040000 | yes |
| 1 | Rushing Smash | 1 | 18090000 | yes |
| 2 | Impactful Crush | 3 | 18060000 | yes (unlocked at Lv 4) |
| E, row 2 | Dark Crush | 4 | 18100000 | yes (unlocked at Lv 4) |
| E, row 0 (locked Lv 5) | Gust Rampage (needs Stagger) | 5 | 18300000 | yes; conditional skill in row 0 |
| E, row 1 (locked Lv 7) | Heat Wave Blow | 7 | 18150000 | yes |
| 3 (locked Lv 8) | Recuperation | 8 | 18120000 | no: the cell shows an open hand, the file a green star (corrected 2026-10-20, #486) |
| Q, row 0 (locked Lv 10) | Tremor Crush | 10 | 18210000 | yes |
| Q, row 1 (locked Lv 12) | Wave Blow (needs Stun) | 12 | 18080000 | yes; see note 1 |
| 4 (locked Lv 14) | Spinning Strike | 14 | 18290000 | yes |
| no key (locked Lv 16) | Defiance | 16 | 18200000 | yes |

Locked rows are matched by unlock level only (their icons are greyed out); the level-to-skill mapping is one-to-one, so
this is solid but inferred, not read from an icon.

Notes:
1. Wave Blow is conditional (needs Stun) but sits in Q row 1, not row 0. Every other class so far had its conditional
   skill in row 0. Inferred: Tremor Crush takes row 0 because it unlocks first; confirm the row order at Lv 12+ if the
   guide's K-window grid depends on it.
2. Onslaught specialization 2 reads "Absorbs 0.7% HP" in game; Metabot's template is unfilled (#358 pattern). Use the
   game text.
3. Passives (Metabot): 1 Blessing of Life, 6 Crossguard, 9 Protection Circle, 11 Inspiring Spell, 13 Attack
   Preparation, 15 Impact Hit, 17 Raging Spell, 21 Earth's Promise, plus 23 and 25. [Corrected 2026-10-20: the passives ARE on this screen, a 5×2 grid locked at 1, 6, 9, 11, 13, 15, 17, 21, 23, 25; the Chanter pack #486 §7 compares them cell by cell and finds Metabot's art swapped or wrong for several.]

No disagreements with Metabot on levels or ids; icon art disagrees (see the corrections above and #486 §7). Request log: scratchpad only (not committed; no repo change in this check).
