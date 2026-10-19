# Stigmas: the ◆ "Specialization 5" on Metabot (#329)

**Result.** Leave it out of the leveling guide. Nothing in the data marks it as reachable by Lv 45, and nothing we can read
says what unlocks it. The ◆ is Metabot's icon placeholder, not a game marker. Status: **inferred**. One owner look in game
would confirm it (below), but the guide doesn't need that look.

## What the page shows

Read 2026-10-19 6:27 AM ET from the Lunge Stance page (<https://metabot.gg/en/aion-2/skills/lunge-stance>, Gladiator stigma,
global client build 0.0.4387.0), under the SOURCES.md `metabot.gg` row. The page's own lead line: "5 variants change how
Lunge Stance works. Each needs its stigma item and a minimum skill level." Facts from the page's data:

| Entry | Item id | Icon | Level requirement |
|---|---|---|---|
| Specialization 1–4 | 11400010 … 11400040 | each has its own stigma item image (`/web/aion2/stigma/114000x0.webp`) | skill level 5 / 10 / 15 / 20 |
| Specialization 5 | 11400050 | none: Metabot draws its `iconFallback` glyph, "◆" | none (the level field is empty) |

The 13 Ranger stigma pages read on 2026-10-18 for #329 showed the same pattern (four entries with a level, then one ◆
entry without); their item images weren't checked then.

## What that means

- **Stated by the source:** each specialization needs its stigma item and a minimum skill level. Specialization 5 has an id
  but no item image and no level in the global client data Metabot reads.
- **Inferred:** the ◆ is only the look Metabot gives an entry with no icon, so it says nothing about how Specialization 5
  unlocks. With no item art and no level, the 5th variant is most likely not obtainable yet in the global client, or comes
  from something outside the leveling path. Either way no source ties it to Lv 1–45.
- **Not the same as skills:** class skills (not stigmas) list a level for their 5th specialization, e.g. Elemental Fusion's
  at skill level 16 (docs/research/2026-10-spiritmaster-pack.md §6). Only the stigma 5th has no level.

## Decision record

The Ranger, Gladiator and Spiritmaster packs keep four `specialtyChoices` per stigma (13 each), the four with a level on
Metabot; the Assassin's 4 stigma records carry none. The 5th is left out **on purpose**, with this note as the record. Revisit if Metabot starts showing a level or an item
image for it, or after a patch adds stigma items.

Owner check (optional, not blocking): in the Stigma window, does any stigma show a 5th specialization, and what does it
say it needs?

Requests: one page (plus the terms page) on 2026-10-19, logged in `data/research/gl-sm-icons-metabot-2026-10.requests.log`.
No page copy is kept.
