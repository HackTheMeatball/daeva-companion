# World boss timers on Global (1.0, Isaac 2026-10-20 23:02Z: "the ones that matter")

Game Data Check, 2026-10-20, for Walter's spec. Research only. Read 2026-10-20 with our User-Agent, ≥ 10 s apart:
Metabot `/en/aion-2/events` and `/en/aion-2/bosses` (Full; it reads the Global client's schedule tables) and aion2hub
`/tools/world-bosses` (Full, reuse unknown; robots.txt allows all; "datamined from the Global client", Launch Scale Test
client of 2026-09-19). Lydia's note `/mnt/project-files/research/endgame/world-boss-timers.md` reads the same Metabot
pages and agrees. Lydia vetted seven tracker sites at 23:20Z (her note's update section): aion2atlas.app, aion2vault.com,
aion2data.com, allthings.how, aion2rifttimer.com, aion2rift.com and criticalhits.com.br. Her note is outside the repo,
so the terms and robots.txt results were re-read for this PR and are now rows in `SOURCES.md` (all Full, most reuse
unknown; allthings.how's terms link returns 404, so it is facts and a link only). aion2vault cites allthings.how, so it
is not an independent source. aion2hub is a weak voice for the schedules: its `SOURCES.md` row covers weak
corroboration on a pre-launch (2026-09-19) snapshot, now widened to boss schedules. Facts only.

**Kanon's Bible has nothing on world bosses.** Its "boss" mentions are combat stats (Boss Attack, crit resistances), so
it gives no leads here (checked, 2343 lines of text).

## 1. Clock

**Disputed: which clock the times use.** Metabot, aion2hub and allthings.how ("community-confirmed, not official") say
all times below are **server time, UTC+9**, shared by every Global region (NA, EU, LatAm, Asia). aion2atlas says the
Reshanta times follow each region's own clock (CET for EU, Eastern for NA East, Pacific for NA West). Every countdown
depends on which is right, so it is owner check 1. Until it is answered, the computed Reshanta timers carry "check in
game". The time zone is a single data field, so the dispute doesn't block the spec or the build, only that label. It matches the daily reset at 16:00 server = 07:00 UTC
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
| Silent Dartan | 6 h | aion2atlas (Global column); allthings.how (aion2vault repeats it) | 2+ sources (independence inferred) |
| Soul Ruler Kashapa | 6 h | same | 2+ sources (independence inferred) |
| High Commander Lagta | 12 h | same | 2+ sources (independence inferred) |

Are the two independent? aion2vault cites allthings.how, so it doesn't count. Lydia found no citation between aion2atlas
and allthings.how. aion2atlas also gives its own KR column (double), which allthings.how doesn't. So I count them as 2
sources, with their independence inferred, not shown. The earlier "1 to 12 h" and "1 to 24 h" ranges came from search
summaries covering every field boss, not from these three.

All three are in both Verteron and Altgard. aion2atlas gives Korea double these intervals. Their level is disputed:
aion2hub says Lv 45, Lydia's sources say 48. The game's Field Boss list (Exploration) shows "Spawned" or "Time Left" for
each one, per server.

A countdown here depends on when someone on the server killed the boss. We can't know that without reading live game
state, which the no-sniffing rule rules out. The only buildable form is a manual timer: the player taps "killed at"
(or copies the time left from the game's list), and the app counts down the interval above.

## 4. Which bosses matter (Walter's scope call, 2026-10-20)

1. **In for 1.0, each with a timer computed from the server clock:** Watcher Kaira, Executor Argo, Executor Kaira,
   Executor Tamasa and Guardian Lord Nahma. Monster Lv 65 is not a player level: this is endgame content for a Lv 45
   character, which the endgame guide covers from 0.10.
   - Guardian Lord Nahma is labelled **inferred** until a source names it as the "Abyss Siege Boss".
   - Watcher Kaira spawns at a random spot, so show its zone, not a point.
2. **Held out:** the 4 Middle Reshanta Lv 80 bosses. They are disputed with no second Global source, so they go on the
   owner's To-do (owner check 2). A confirmation adds them later; they don't block 1.0.
3. **Field bosses** (Silent Dartan, High Commander Lagta, Soul Ruler Kashapa): their location plus a manual "killed at"
   timer that counts down the cooldown in §3, labelled with its sources.

## Owner checks (for To-do T-61, not urgent)

1. **Gates the "check in game" label on every computed timer.** What time does Watcher Kaira (or the Artifact Siege) start on Isaac's server, in his local
   time? One shared UTC+9 clock and per-region clocks give different answers.
2. Is Chaotic Middle Reshanta open on Global, with its bosses in the event list?

## For Walter

Q3 answered: the 5 scheduled bosses need no live state. They are a pure clock computation. Owner check 1 decides which
clock, and that is one data field. Only the field bosses depend on live state (who killed it and when), and those fall back to a manual
"killed at" timer. Nothing needs to go back to the coordinator.
