# World boss timers on Global (1.0, Isaac 2026-10-20 23:02Z: "the ones that matter")

Game Data Check, 2026-10-20, for Walter's spec. Research only. Read 2026-10-20 with our User-Agent, ≥ 10 s apart:
Metabot `/en/aion-2/events` and `/en/aion-2/bosses` (Full; it reads the Global client's schedule tables) and aion2hub
`/tools/world-bosses` (Full, reuse unknown; robots.txt allows all; "datamined from the Global client", Launch Scale Test
client of 2026-09-19). Lydia's note `/mnt/project-files/research/endgame/world-boss-timers.md` reads the same Metabot
pages and agrees. Lydia vetted seven tracker sites at 23:20Z (her note's update section): aion2atlas.app, aion2vault.com,
aion2data.com, allthings.how, aion2rifttimer.com, aion2rift.com and criticalhits.com.br, all Full (most reuse unknown).
aion2vault cites allthings.how, so it is not an independent source. Facts only.

**Kanon's Bible has nothing on world bosses.** Its "boss" mentions are combat stats (Boss Attack, crit resistances), so
it gives no leads here (checked, 2343 lines of text).

## 1. Clock

All times below are **server time, UTC+9**, shared by every Global region (NA, EU, LatAm, Asia). Sources: Metabot,
aion2hub and allthings.how, all "community-confirmed, not official". **Disputed:** aion2atlas says the Reshanta times
follow each region's own clock (CET for EU, Eastern for NA East, Pacific for NA West). Every countdown depends on which
is right, so this is owner check 1 and it blocks the build. It matches the daily reset at 16:00 server = 07:00 UTC
(`2026-10-endgame-facts.md`). UTC+9 has no daylight saving, so store server time and convert at render time.
Korea and Taiwan are separate services on their own schedules (KR/TW: Watcher Kaira every 4 h, Executors Wed and Sat
22:30), which don't apply.

## 2. Bosses on a fixed schedule (no live game state needed)

| Boss | Monster Lv | Where | Spawns (server time) | UTC | Sources | Label |
|---|---|---|---|---|---|---|
| Watcher Kaira | 65 | Chaotic Lower Reshanta, Black Fragments Area (random spot in the zone) | Every 3 h from 01:00; up 30 min | every 3 h from 16:00 | Metabot; aion2hub (30 min: aion2atlas, allthings.how) | 2+ sources |
| Executor Argo | 65 | Chaotic Lower Reshanta, Archipelago of Siel's Wings - Siel's Heart | Mon, Thu, Sat 21:30 | same days 12:30 | Metabot; aion2hub | 2+ sources |
| Executor Kaira | 65 | Chaotic Lower Reshanta, Sulfur Tree Island - Branding Island | Mon, Thu, Sat 21:30 | same days 12:30 | Metabot; aion2hub | 2+ sources |
| Executor Tamasa | 65 | Chaotic Lower Reshanta, Reshanta's Root | Mon, Thu, Sat 21:30 | same days 12:30 | Metabot; aion2hub | 2+ sources |
| Guardian Lord Nahma | 65 | Chaotic Lower Reshanta, Reshanta's Root | Fri, Sun 21:00 | same days 12:00 | Metabot (by name); aion2hub and allthings.how list an "Abyss Siege Boss" in the same slot and zone | 2+ sources for the slot; that it is one boss is inferred |
| Enraged Guardian Lord Nahma | 80 | Chaotic Middle Reshanta, Steel Titan's Grave | Fri, Sun 21:00 | same days 12:00 | Metabot (Global); aion2hub: KR/TW only | **disputed** |
| Executioner Dramos | 80 | Chaotic Middle Reshanta, Corroded Heart | Mon, Thu, Sat 21:30 | same days 12:30 | as above | **disputed** |
| Ravager Marakha | 80 | Chaotic Middle Reshanta, Steel Titan's Grave | Mon, Thu, Sat 21:30 | same days 12:30 | as above | **disputed** |
| Turncoat Ducal | 80 | Chaotic Middle Reshanta, Eroded Fragment Area | Mon, Thu, Sat 21:30 | same days 12:30 | as above | **disputed** |

The Middle Reshanta dispute leans KR/TW only. Against Global: aion2hub, aion2atlas ("KR/TW only so far") and aion2rift
(region tags kr/tw). For Global: Metabot's client table, but a client table can hold rows for content that isn't live
(inferred). aion2vault says "provisional", and aion2rifttimer says "confirmed" on citations that may be KR.

Related events on the same clock (Metabot client tables): Artifact Siege Mon, Thu, Sat 21:00, just before the Executors.

## 3. Bosses that respawn after a kill (live game state)

The open-world field bosses in Verteron and Altgard have **no spawn clock** in either client read (aion2hub: "located,
not timed"). Each respawns a fixed interval after it is killed:

| Boss | Respawn after the kill (Global) | Sources | Label |
|---|---|---|---|
| Silent Dartan | 6 h | aion2atlas (Global column); allthings.how (aion2vault repeats it) | 2+ sources |
| Soul Ruler Kashapa | 6 h | same | 2+ sources |
| High Commander Lagta | 12 h | same | 2+ sources |

All three are in both Verteron and Altgard. aion2atlas gives Korea double these intervals. Their level is disputed:
aion2hub says Lv 45, Lydia's sources say 48. The game's Field Boss list (Exploration) shows "Spawned" or "Time Left" for
each one, per server.

A countdown here depends on when someone on the server killed the boss. We can't know that without reading live game
state, which the no-sniffing rule rules out. The only buildable form is a manual timer: the player taps "killed at"
(or copies the time left from the game's list), and the app counts down the interval above.

## 4. Which bosses matter

- **The 5 Lower Reshanta bosses** (Watcher Kaira, the 3 Executors, Guardian Lord Nahma): 2 sources, fixed clock. They
  are the bosses a Global player can time. Ship them.
- **The 4 Middle Reshanta bosses:** leaning KR/TW only. Leave them out of 1.0 unless the owner check finds them on Global.
- **The 3 field bosses:** no clock, but the intervals have 2 sources. They fit a manual "killed at" timer, which is
  Walter's call for scope.
- Monster Lv 65 / 80 is the boss's level, not a player level (the cap is 45). Chaotic Reshanta is end-game Abyss PvPvE.
  That these bosses are worth a Lv 45 player's time is **inferred**: no source here ranks them by reward.

## Owner checks (for To-do T-61, not urgent)

1. **Blocks the build.** What time does Watcher Kaira (or the Artifact Siege) start on Isaac's server, in his local
   time? One shared UTC+9 clock and per-region clocks give different answers.
2. Is Chaotic Middle Reshanta open on Global, with its bosses in the event list?

## For Walter

Q3 answered: the 5 scheduled bosses need no live state. They are a pure clock computation, once owner check 1 settles
which clock. Only the field bosses depend on live state (who killed it and when), and those fall back to a manual
"killed at" timer. Nothing needs to go back to the coordinator.
