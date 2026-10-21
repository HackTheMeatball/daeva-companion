# World boss timers: what is known (Lydia, 2026-10-20, for 1.0 scope)

Isaac (2026-10-20 23:02Z): world boss timers are in 1.0, "the ones that matter anyway".
Facts only. Sources: Metabot `/en/aion-2/events` and `/en/aion-2/bosses` (Full; 2 requests, 6 s apart, our UA), plus
one web search for corroboration. **Kanon's Bible has nothing on world bosses**: its "boss" mentions are combat stats
(Boss Attack and the like) and raid crit caps.

## Confirmed: game-database fields (Metabot reads the Global client's schedule tables, build 0.0.4387.0)
All times are **server time, UTC+9** (the clock itself is disputed: see the 23:20Z update), said to be shared by every Global region (NA, EU, LatAm, Asia). Korea and Taiwan are separate
services. That the regions share UTC+9 is labelled by Metabot as "community-confirmed, not official". It matches the
daily reset at 16:00 server time = 07:00 UTC.

| Boss | Lv | Where | Spawns (server time) |
|---|---|---|---|
| Watcher Kaira | 65 | Chaotic Lower Reshanta · Black Fragments Area - Abandoned Island | Every 3 h from 01:00 |
| Guardian Lord Nahma | 65 | Chaotic Lower Reshanta · Reshanta's Root; Devastated Remnants - Shade Island; Black Fragments Area - Lonely Island | Fri and Sun 21:00 |
| Executor Argo | 65 | Chaotic Lower Reshanta · Archipelago of Siel's Wings - Siel's Heart | Mon, Thu, Sat 21:30 |
| Executor Kaira | 65 | Chaotic Lower Reshanta · Sulfur Tree Island - Branding Island | Mon, Thu, Sat 21:30 |
| Executor Tamasa | 65 | Chaotic Lower Reshanta · Reshanta's Root | Mon, Thu, Sat 21:30 |
| Enraged Guardian Lord Nahma | 80 | Chaotic Middle Reshanta · Steel Titan's Grave; Eroded Fragment Area | Fri and Sun 21:00 |
| Executioner Dramos | 80 | Chaotic Middle Reshanta · Corroded Heart | Mon, Thu, Sat 21:30 |
| Ravager Marakha | 80 | Chaotic Middle Reshanta · Steel Titan's Grave | Mon, Thu, Sat 21:30 |
| Turncoat Ducal | 80 | Chaotic Middle Reshanta · Eroded Fragment Area | Mon, Thu, Sat 21:30 |

Same clock, also in the client: Rift portals every 3 h from 00:00 (Altgard, Verteron, Morheim, Eltnen); Artifact Siege
Mon/Thu/Sat 21:00; Shugo Festival hourly at :00; Dimensional Invasion hourly at :30; Arena of Tactics 11:00–14:00 and
19:00–21:00 (it unlocks at player Lv 45).

A second source agrees: the allthings.how world-boss article (search summary, not fetched) gives the same Kaira /
Nahma / Executor schedule. One community source says Kaira's start hour is disputed; the client table says 01:00. KR/TW
reportedly use every 4 h, which doesn't apply to Global.

## Inferred / community only: kill-timer field bosses (Verteron, Altgard and others)
Not in Metabot's timed list. Community trackers (aion2rifttimer.com, aion2vault.com, aion2data.com, aion2atlas.app;
unvetted at first, now vetted in the 23:20Z update below) say these respawn a fixed interval **after the kill**, with cycles of
1/2/3/4/6/8/12/24 h (e.g. Melted Danar 1 h, Silent Dartan 6 h, High Commander Lagta 12 h). Counts disagree (48 vs 49).
There is no fixed clock, so a timer needs the player to enter the kill time (or uses the in-game Field Boss list's own
countdown). Community only (two community sources, see the 23:20Z update below) and inferred until checked in game.

## Open points (inferred, for Walter)
- "The ones that matter": the 9 timed bosses are the only ones on a fixed clock. Monster Lv 65/80 doesn't mean
  player Lv 65 (the cap is 45); Chaotic Reshanta is end-game Abyss PvPvE. That they are worth it at the Lv 45 cap is
  inferred, so an owner check is needed.
- Server-clock offset: an owner check that the in-game server clock reads UTC+9 (one screenshot) would turn
  "community-confirmed" into owner-confirmed.
- DST: UTC+9 has no DST, but local times shift for NA/EU players when their clocks change, so convert at render time.

## Update 23:20Z: seven tracker sites vetted, Gretchen's four questions
Vetting (terms first, then robots.txt; our UA, ≥ 5 s apart):
- aion2atlas.app: Full (terms: "do not copy whole pages or scrape the site at high volume"; quoting short parts with a link is fine; robots.txt's `*` group allows all agents, so Claude-User and our UA are allowed; it also allows ClaudeBot by name).
- aion2vault.com: Full, facts only (terms: personal, non-commercial; no republishing without attribution and a link). Its boss table cites AllThingsHow, so it is not independent of it.
- aion2data.com: Full, reuse unknown (no terms page; robots explicitly allows Claude-User).
- allthings.how: **Spot**. Its terms are at `/terms-and-conditions/` (found by web search after review): material "may not be copied,
  modified, reproduced, downloaded or distributed … without the express prior written permission". There's no ban on reading.
  Facts only, a few pages per task, no copies kept. Order: the boss article was read at 23:1xZ after `/terms`, `/terms-of-service`,
  `/tos` and `/terms-of-use` all returned 404 and robots.txt allowed us; the real terms page was found later by web search. Reading
  the article was within what Spot allows, but it came before the terms.
- aion2rifttimer.com, aion2rift.com: Full, reuse unknown (no terms page at the usual paths; robots `*` allow).
- criticalhits.com.br: Full, reuse unknown (no terms page found; robots doesn't block us). Not read.

1. **Middle Reshanta Lv 80 bosses on Global: DISPUTED, leaning KR/TW only.** aion2atlas ("KR/TW only so far") and aion2rift (region tags tw/kr only) say KR/TW. aion2vault says "provisional". aion2rifttimer marks them "confirmed", but its citations (Shugo.GG, Questlog) may be KR. Metabot's client tables list them, but a client table can carry rows for content that isn't live (inferred). Recommendation: leave them out of 1.0, or show them labelled "disputed".
2. **Nahma = "Abyss Siege Boss": INFERRED yes.** allthings.how lists both as separate rows with the same window (Fri/Sun 21:00) and the same zone (Chaotic Lower Reshanta). aion2rifttimer calls it "Guardian General Nahma". No source names a different Fri/Sun boss.
3. **Lv 48 field bosses: kill-based; two community sources** (aion2vault copies allthings.how, so it doesn't count separately). Silent Dartan and Soul Ruler Kashapa 6 h, High Commander Lagta 12 h after the kill (aion2atlas's Global column, and allthings.how via aion2vault). aion2atlas lists Korea at double (12 h / 24 h): "about half the Korean respawn timers". All three bosses exist in both Verteron and Altgard. The in-game Field Boss list (Exploration) shows "Spawned" or "Time Left" per server.
4. **Watcher Kaira stays up 30 min: two-plus sources** (aion2atlas "30 min", allthings.how, same 30 minutes, aion2rifttimer "30-minute reported activity window").

**New dispute on the clock:** aion2atlas says Global Reshanta times "appear to follow each region's own clock (CET for EU, Eastern for NA East, Pacific for NA West)". Metabot and allthings.how say a single shared UTC+9 clock. This changes every countdown, so an owner check of the in-game time is worth it now: what time does Watcher Kaira (or the Siege) actually start on Isaac's server?

**Close-out of the allthings.how read order (ROL-08, 2026-10-21).** The boss-timer article was read before its terms were
found. Nothing from it was kept except facts, in this note, never its wording. Each fact it supports has another source:
Kaira's 30 minutes (aion2atlas, aion2rifttimer), the Nahma schedule (Metabot's events page; Nahma = Siege boss stays inferred), and the
Lv 48 kill timers (aion2atlas). The raw copy was deleted on 2026-10-21; the log is `legal/fetch-log.md` in the shared folder.
