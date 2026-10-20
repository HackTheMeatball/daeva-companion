# Gladiator and Ranger rotation icons (0.8.1 F5, #595; RC play #586 finding 1)

Game Data Check, 2026-10-20. The five rotation skills that still showed initials in the Build panel. All five are on
Metabot (the standing icon OK, owner 2026-10-14), so none goes to the owner.

Files are named like the shipped Gladiator and Ranger icons (`sk-<slug>.png`, with the record id's slug and no class
prefix). They are 128 × 128 RGB PNG, resized from Metabot's 256 px WebP with Lanczos, as in
`../icons-2026-10-19/README.md`. No file name collides with an icon already in `src/assets/icons/`. Each was fetched with
our own User-Agent, one request at a time, at least 9 s apart.

Checks:

- **Page title.** Each Metabot page's title names the skill and its class.
- **Second source.** daevacompass.com, an approved icon source (owner, 2026-10-20), shows the same art on its ability
  page for the same ability id. I compared its 72 px file to Metabot's at 128 px: the mean grey difference is 4–8 of 255,
  and none differs. The daevacompass files are not kept.

| File | Skill | Source page | File URL | Retrieved | Second source (art matches) |
|---|---|---|---|---|---|
| sk-aerial-snare.png | Gladiator, Aerial Snare | <https://metabot.gg/en/aion-2/skills/aerial-snare> | <https://metabot.gg/web/aion2/skills/11300000.webp> | 2026-10-20 4:08 PM ET | <https://daevacompass.com/en/db/abilities/11300000> |
| sk-sword-aura-rampage.png | Gladiator, Sword Aura Rampage | <https://metabot.gg/en/aion-2/skills/sword-aura-rampage> | <https://metabot.gg/web/aion2/skills/11280000.webp> | 2026-10-20 4:09 PM ET | <https://daevacompass.com/en/db/abilities/11280000> |
| sk-ankle-slice.png | Gladiator, Ankle Slice | <https://metabot.gg/en/aion-2/skills/ankle-slice> | <https://metabot.gg/web/aion2/skills/11200000.webp> | 2026-10-20 4:09 PM ET | <https://daevacompass.com/en/db/abilities/11200000> |
| sk-arrow-scattershot.png | Ranger, Arrow Scattershot | <https://metabot.gg/en/aion-2/skills/arrow-scattershot> | <https://metabot.gg/web/aion2/skills/14330000.webp> | 2026-10-20 4:09 PM ET | <https://daevacompass.com/en/db/abilities/14330000> |
| sk-suppressing-arrow.png | Ranger, Suppressing Arrow | <https://metabot.gg/en/aion-2/skills/suppressing-arrow> | <https://metabot.gg/web/aion2/skills/14070000.webp> | 2026-10-20 4:09 PM ET | <https://daevacompass.com/en/db/abilities/14070000> |

Sword Aura Rampage's daevacompass file is named `icon_te_skill_034` (a Templar prefix), but the art is the same as
Metabot's. File names are only that site's own labels.

For F5 (#595): copy the five files to `src/assets/icons/`, set the five skill records' `icon`, and add the
`docs/ISSUES.md` rows from this table.
