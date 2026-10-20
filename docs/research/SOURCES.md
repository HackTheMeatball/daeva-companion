# Source access register (which site may be used for what)

**Source of truth for research sessions** on whether and how a site may be read. Read it before fetching any site. A
site that isn't listed here is unvetted: read its terms first, then its robots.txt (terms are the harder gate:
robots.txt may allow what the terms forbid; owner, 2026-10-19), then add a row. Fetching policy: `CLAUDE.md` and
`docs/team/data-research.md`. Lookups on listed sites: Game Data Check, and research threads inside their own pack,
which Game Data Check verifies before merge (ROL-03, `docs/DECISIONS.md`, owner 2026-10-19 5:20 PM ET); vetting and
last-resort spot checks on unlisted sites (each find flagged as such): Source Vetting (owner, 2026-10-19). Evidence
and quoted clauses are in the linked research notes, mostly `2026-10-build-guide-sources.md` (BGS). Last full pass:
2026-10-18.

**Use levels**

- **Full**: scripted reading is allowed. At most 12 requests/min per host, one at a time, 24 h cache, our own
  User-Agent, stop on 403 / 429 / challenge. Take facts only, never wording or whole tables, and credit with a link to
  the page. "Reuse unknown" = no terms page, so facts and a link only.
- **Spot**: the terms ban scraping or copying, but not reading. A few pages per task, at least 5 s apart, facts only,
  nothing kept beyond the session.
- **Own app**: our own site. It's for checking the live app, not a data source.
- **Fail**: never read by a session. The owner may look in a browser. Reason given.

`sources.json` (`data/packs/aion2/sources.json`) holds the per-site records the data cites. Its `access` fields date
from 2026-10-14 and are older than this register; where they differ, this register wins until they are synced (issue #317).

## Allowed domains (on the Limited environment, 2026-10-18)

| Site | Use | Good for | Limits | Checked | Evidence |
|---|---|---|---|---|---|
| metabot.gg | Full | Main source: game data read from the global client (skills, specialties, stigmas, quests, Daevanion boards, locations); class meta pick rates from top players (official character pages) | Not `/api/` or profile pages. Terms: "personal, non-commercial use". Credit with plain dofollow links | 2026-10-18 | BGS §2; methodology page read 2026-10-18 3:07 AM ET |
| aion2hub.com | Full, reuse unknown | Weak corroboration: story-quest order and levels, Sealed Dungeon bands, Global vs KR labels | Not `/api/`. Pre-launch snapshot (2026-09-19); never for prerequisites, unlock levels, specialties, locations | 2026-10-14 | `2026-10-source-vetting.md` §3.2 |
| skycoach.gg | Full | Class build guides (skill order, specialties) | `Crawl-delay: 1`. Boosting shop: guides are editorial | 2026-10-18 | BGS §2 |
| corpus.gg | Full | Class build guides, from named creators | Not `/data/` (terms: "don't access data outside the published pages") | 2026-10-18 | BGS §2 |
| aion2-meta.com | Full, reuse unknown | Per-class skills, stigmas, Daevanion, specialties | Korean top-player data: a preview, never proof of a global fact | 2026-10-18 | BGS §2 |
| aion2turkiye.com | Full, reuse unknown | Leveling / dungeon / PvP build panels | — | 2026-10-18 | BGS §2 |
| gamesfuze.com | Full, reuse unknown | Class builds | Picks are not slot-ordered (never a slot witness) | 2026-10-18 | BGS §2 |
| aion2quest.pro | Full | Daevanion planner, titles database, map-marker icons (`UT_Marker_*`) where Metabot has none, and its purple Kibelisk crest (owner, 2026-10-18, DECISIONS `owner-ok-0.6.2-map-icons`) | Not `/api/` or `/sim/`. Its desktop app reads game traffic: check each field's origin before use | 2026-10-18 | BGS §2 |
| daevaguides.com | Full | Class build and macro guides | Never use the "Check your character" tool (terms) | 2026-10-18 | BGS §2 |
| aion2-guides.info | Full, reuse unknown | Class guides collected from creators | Secondary: credit the creator it links, not an independent source | 2026-10-18 | BGS §2 |
| mmo-codex.com | **Spot** | Class guides (skill order by level, stigmas) | Terms: "Automated republication and scraped copies are not permitted" | 2026-10-18 | BGS §2 |
| aion2.inven.co.kr | Full, facts only | Korean class boards and guides | Korean data: a preview only. Inven terms: no copying of its own posts without consent | 2026-10-18 | BGS §2 |
| aionbuilds.com | Full | Class guides, tier list, player-shared builds | — | 2026-10-18 | BGS §3a |
| aion2maps.com | Full, reuse unknown | Per-class build and macro guides | robots blocks AI training crawlers only | 2026-10-18 | BGS §3a |
| aion2.app | **Spot**: never the only source (owner, 2026-10-18, `docs/DECISIONS.md`; amends Q3) | Item and skill database | Terms: "personal, non-commercial… not to: Scrape, copy, or redistribute". Not `/api/`, `/admin`, `/account`, `/login`. Non-commercial terms: review before monetising | terms read for `2026-10-data-sources.md` §10 (2026-10), robots 2026-10-18 | BGS §1; `2026-10-data-sources.md` §10 |
| aion2t.com | **Spot**: never the only source (same owner decision as aion2.app) | News and guides (aion2.app's sister site) | Same terms as aion2.app (non-commercial: review before monetising). Guides are collected: credit the original author | 2026-10-18 | BGS §1 |
| daevacompanion.com, *.daevacompanion.com | Own app | The live site | — | — | `docs/DEPLOY.md` |
| daevapath.com, *.daevapath.com | Own app | Forwards (301) to daevacompanion.com | — | — | `docs/DECISIONS.md` D1c |

## Passed but not on the allowed list (low value; add only if a task needs one)

gameplay.tips, pixelnitro.com, mein-mmo.de (re-checked 2026-10-19: weekly maintenance schedule only, single source,
never game data; cited by `docs/kaizen/patch-watch.md`; `2026-10-steam-and-news-vetting.md`), gamerblurb.com
(non-commercial terms), aion2tierlist.com (tier lists only), and the gold/boosting shops aoeah.com, mmoexp.com,
expcarry.com, oslink.io, u4n.com (**Spot**: its terms ban scraping). All checked 2026-10-18, BGS §2 / §3a.
aion2kina.com (fan toolkit and map; terms ban only "unreasonable automated load"; its map markers aren't game art,
inferred) checked 2026-10-19, `2026-10-t47-icon-check.md`. Steam Index API (public-api.steamidx.com: AION 2's Steam
build ID changes with timestamps; owner-created key and the owner's network-list OK needed first; its site pages ask
not to be scraped, so never those) checked 2026-10-20, `2026-10-steam-and-news-vetting.md`.

## Fail (never read by a session)

| Site | Why | Checked |
|---|---|---|
| aion2.th.gl | CLAUDE.md: no automated reading (its robots.txt excludes AI agents) | 2026-10-14 |
| Game8 (game8.co) | CLAUDE.md: never used | — |
| aion2.plaync.com (NCSoft's official site, its character search and data feed) | NC's End User License Agreement bans automated access, scraping, "spiders, robots, crawlers, data mining tools" | 2026-10-18 |
| maxroll.gg, sportskeeda.com | robots.txt blocks Claude-User (`Disallow: /`) | 2026-10-18 |
| metaroad.gg | Terms: "automated means (bots, scrapers)… without permission". Written permission could open it | 2026-10-18 |
| bluestacks.com, invenglobal.com | Terms ban crawling / any "robot, spider or other automatic device" | 2026-10-18 |
| dbaion2.ru / .online, gamers4.life (+ interactivemap.app), wikily.gg | Terms ban bots or automated collection | 2026-10-14 to 2026-10-18 |
| aion2.online | No data of its own: its database links all go to gamers4.life | 2026-10-18 |
| aion2.gaming.tools, games.gg, mobalytics.gg, eloboost24.eu, icy-veins.com, keengamer.com | 403 challenge to our requests (access, not a ban). Owner browser only | 2026-10-18 |
| thegameswiki.com | 429 security checkpoint. Its content is CC BY-NC-SA: facts only, never wording | 2026-10-18 |
| timesaver.gg | Connection reset, not reached | 2026-10-18 |
| namu.wiki | Cloudflare challenge (403) on our first request, the terms page (`/w/나무위키:이용약관`). Owner browser only | 2026-10-19 |
| Allakhazam / ZAM (\*.allakhazam.com, Fanbyte terms) | Terms ban "spiders, robots, crawlers, data mining tools" | 2026-10-19 |
| Steam Web API (api.steampowered.com) | robots.txt `Disallow: /` for all agents (its API terms allow keyed use, but robots wins for us) | 2026-10-19 |
| steamdb.info | Its FAQ (its terms): "We also do not allow scraping/crawling on SteamDB". Owner browser only | 2026-10-20 |

## Keeping this current

Any session that vets a site, or finds a change (new terms, a new block), updates its row here in the same PR, with the
date and the research note that holds the evidence.
