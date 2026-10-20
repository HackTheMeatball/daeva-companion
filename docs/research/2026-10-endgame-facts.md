# Endgame facts: resets, daily and weekly counters, gear path (0.10 gate)

Game Data Check, 2026-10-20, for the 1.0 endgame guide (planned as 0.10). Builds on Lydia's
`2026-10-endgame-sources-vetting.md`: Kanon's Bible is leads only. Research only.

Read 2026-10-20 with our User-Agent, ≥ 10 s apart. Metabot `/weekly-reset`, `/guides/daily-weekly-checklist` and
`/guides/gear-progression-guide` (Metabot reads the global client's ContentsTicket table). daevaguides `/en/guides/reset-times/`
and `/en/guides/gear-progression/`. aion2maps `/guides/daily-and-weekly/` (it tags rows "Datamine" / "Seen in game").
All three sites are Full. Facts only.

## Reset times

| Fact | Metabot | daevaguides | aion2maps | Label |
|---|---|---|---|---|
| Daily reset | 16:00 server time = 07:00 UTC on every global server | 07:00 UTC | 07:00 UTC, same moment in every region | 2+ sources (none official; Metabot: "community-confirmed") |
| Weekly reset | Wednesday, same time | Wednesday, same time | Wednesday, same time | 2+ sources |
| Daylight saving | — | the UTC time stays; local hours move (Europe 25 Oct, US 1 Nov) | same; US West's weekly reset then falls on Tuesday 23:00 | 2+ sources (aion2maps marks it "Inference") |

The app should store the reset as 07:00 UTC and convert it to local time, never as a local hour.

## Daily and weekly counters (level 45)

| Counter | Value | Sources | Label |
|---|---|---|---|
| Duty Missions | 5 a day, counted per server | Metabot; daevaguides | 2+ sources |
| Nightmare attempts | +2 a day, bank up to 14 | Metabot; daevaguides (+2, banks to a cap) | 2+ sources |
| Odyle Energy | +15 every 3 h (120 a day), cap 560 (840 with membership: daevaguides' page title) | Metabot; daevaguides | 2+ sources for the refill and the 560 cap |
| Ascension Trial | 3 entries a week per character | Metabot; daevaguides; aion2maps | 2+ sources |
| Sanctuary raids | 4 attempts a week per raid; final-boss kills: Abyssal Forge (Ludra) 1, Corroded Decontamination Facility 2, Chalice of Muspel 2 | Metabot | single source (client table) |
| Subjugation | 3 tickets a week | Metabot | single source |
| Exploration rewards | 7 a week per Expedition dungeon | Metabot | single source |
| Daily dungeon (Unknown Fissure) | 14 entries a week, per server | Metabot | single source |
| Conquest / Transcendence unclaimed cubes | 10 a week per server; at 0 you can't enter until Wednesday | Metabot; aion2maps | 2+ sources |
| Weekly entries carry over? | No, they are lost at the reset | Metabot; daevaguides | 2+ sources |
| Shugo Festival / Dimensional Invasion keys | refill daily, capped | Metabot; daevaguides | 2+ sources that they refill daily; caps single source |

Kanon's Bible names Supply Request, Daily Duties and Weekly Commands as Abyss Point sources. That is a lead only, not
checked here.

## Gear path at 45 (item level, "gear score")

- **Grades on Global:** Common → Rare → Epic → Unique. There is no Heroic or Mythic gear on Global yet. Unique item
  level 102 is the best there is (Metabot; daevaguides "nothing above gold"). 2+ sources. The Bible's "Heroic +20"
  is KR-only and does not apply.
- **Enhancement caps:** Common and Rare +5, Epic +10, Unique +15 (Metabot; daevaguides' table credits Metabot). After
  +15 on Unique from item level 54 comes Amplified Enhancement: +1 at item level 54–62, up to +3 at 70–78, up to +5
  from 86 (daevaguides, citing Metabot). Labelled **single source** (one origin), until Metabot's enhancement guide is
  read directly.
- **Rates:** 100% to +10; then 65 / 50 / 35 / 25 / 20% to +15, with +5% pity per failure. The item never breaks, and a
  failure costs only the materials (daevaguides, which credits Metabot, Grobs and couga54). Single origin.
- **Item level:** +1 per enhancement level (daevaguides). Single source.
- **Upgrade order** (Metabot): item level 46 named elite sets → Krao Cave / Draupnir Unique 54 → a True Dragon Lord
  craft at 62, then Vakron Sky Island / Urugugu Canyon for 70 → Fire Temple / Ferocious Horn Den for 86 → the Ludra raid
  and Splendent Wise Dragon Lord crafts for 102. Amulet and belt: upgrade, never replace. daevaguides agrees on
  "+10 everything, push past +10 only on pieces you keep" and on Gear Transfer. The dungeon-by-item-level steps are
  **single source** until a second site's order is read.

## For the "best next step" bar

The reset times and the core daily and weekly counters are ready to ship. The gear order has one source, so the
next-step logic should label it "single source" or wait for a second order (aion2maps' `/guides/upgrading-gear/` is
the next read). Owner check, one screen: the Journal's Duty tab countdown (it confirms the reset hour).
