# Templar and Cleric passive icons vs Isaac's screens (2026-10-20)

Read-only comparison of each class's staged icons (Metabot files) against Isaac's skill screens. Locked cells have no tooltip, so each cell is tied to a passive by unlock level only (from data/research/{templar,cleric}-skills-metabot-2026-10.csv). No fetches. Crops: c-cells.png / c-repo.png (Cleric), t-cells.png / t-repo.png (Templar) in this folder.

## Templar (owner-screens/2026-10-18/templar/templar-full-window.png)
8 of 10 match. Mismatches:
- Lv 15 Impact Hit: the screen shows the Assassin's Impact Hit art (13760000, already in src/assets/icons/sk-impact-hit.png), not Metabot's 12760000.
- Lv 23 Survival Willpower: the screen shows plate armour with hands on the helmet and a teal aura. No staged file matches; Metabot's art is a kneeling figure.

## Cleric (owner-screens/2026-10-19/cleric/skills-lv4-locked.png)
Lv 1, 6, 9 and 21 match. Mismatches:
- Lv 11: teal arcs around a flare. No file matches; staged healing-enhancement is a cracked shield.
- Lv 13: a figure under a green dome. No file matches; staged immortal-veil is an ankh.
- Lv 15: shows the immortal-veil (ankh) art.
- Lv 17: shows the heal-block art.
- Lv 23: same as Templar Lv 23. No file matches.
- Lv 25: shows the prayer-of-concentration art.
- Unknown: wrong files (as in the Chanter pack) or a wrong level-to-passive mapping in the CSV. The screen can't tell them apart without tooltips.

## Owner check needed
Hover these locked passives and screenshot the tooltip names:
- Cleric: Lv 11, 13, 15, 17, 23, 25.
- Templar: Lv 15, 23.
