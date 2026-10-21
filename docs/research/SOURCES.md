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
- **No new use**: existing citations stay as they are (labelled); nothing new is taken from the site, and it is never
  fetched again (allowed-domains audit, 2026-10-21, `2026-10-allowed-domains-audit.md`).
- **Own app**: our own site. It's for checking the live app, not a data source.
- **Fail**: never read by a session. The owner may look in a browser. Reason given.

`sources.json` (`data/packs/aion2/sources.json`) holds the per-site records the data cites. Its `access` fields date
from 2026-10-14 and are older than this register; where they differ, this register wins until they are synced (issue #317).

## Allowed domains (on the Limited environment, 2026-10-18; daevacompass.com added 2026-10-20)

| Site | Use | Good for | Limits | Checked | Evidence |
|---|---|---|---|---|---|
| metabot.gg | Full | Main source: game data read from the global client (skills, specialties, stigmas, quests, Daevanion boards, locations); class meta pick rates from top players (official character pages) | Not `/api/` or profile pages. Terms: "personal, non-commercial use". Credit with plain dofollow links | 2026-10-18 | BGS §2; methodology page read 2026-10-18 3:07 AM ET |
| aion2hub.com | **No new use** (audit 2026-10-21; was Full, reuse unknown) | Weak corroboration: story-quest order and levels, Sealed Dungeon bands, Global vs KR labels; boss schedules (weak, 2026-10-20) | Not `/api/`. Pre-launch snapshot (2026-09-19); never for prerequisites, unlock levels, specialties, locations. Known wrong: stigma unlock Lv 23 (owner: 22). #685's boss refs are grandfathered until the 0.10 timer item | 2026-10-21 | `2026-10-source-vetting.md` §3.2; `2026-10-allowed-domains-audit.md` |
| skycoach.gg | **No new use** (audit 2026-10-21; was Full) | Class build guides (skill order, specialties) | `Crawl-delay: 1`. Boosting shop: guides are editorial; its builds page is a paid service. Known wrong: the wings / flight-tutorial line | 2026-10-21 | BGS §2; `2026-10-allowed-domains-audit.md` |
| corpus.gg | **No new use** (audit 2026-10-21; was Full) | Class build guides, from named creators | Not `/data/` (terms: "don't access data outside the published pages"). Low use; human-only read | 2026-10-21 | BGS §2; `2026-10-allowed-domains-audit.md` |
| aion2-meta.com | Full, reuse unknown | Per-class skills, stigmas, Daevanion, specialties: the one Korean preview source (audit 2026-10-21) | Korean top-player data: a preview, never proof of a global fact | 2026-10-21 | BGS §2; `2026-10-allowed-domains-audit.md` |
| aion2turkiye.com | Full, reuse unknown | Leveling / dungeon / PvP build panels | — | 2026-10-18 | BGS §2 |
| gamesfuze.com | **No new use** (audit 2026-10-21; was Full, reuse unknown) | Class builds | Picks are not slot-ordered (never a slot witness) | 2026-10-21 | BGS §2; `2026-10-allowed-domains-audit.md` |
| aion2quest.pro | Full | Daevanion planner, titles database, map-marker icons (`UT_Marker_*`) where Metabot has none, and its purple Kibelisk crest (owner, 2026-10-18, DECISIONS `owner-ok-0.6.2-map-icons`) | Not `/api/` or `/sim/`. Its desktop app reads game traffic: check each field's origin before use. Icons and crest only (audit 2026-10-21): no new facts | 2026-10-21 | BGS §2; `2026-10-allowed-domains-audit.md` |
| daevaguides.com | Full | Class build and macro guides | Never use the "Check your character" tool (terms) | 2026-10-18 | BGS §2 |
| mmo-codex.com | **Spot** | Class guides (skill order by level, stigmas) | Terms: "Automated republication and scraped copies are not permitted" | 2026-10-18 | BGS §2 |
| daevacompass.com | Full | Ability database (`/en/db/abilities/<game id>`, e.g. 18120000 = Recuperation) and its skill icons (`/images/skills/icon_*.webp`, 72 px); news, guides | Not `/api/`, `/admin`, `/login`, `/settings`, `/setup`, `/continue`, `/design-system`. Terms ban only disruption, bypassing protections and abusive automated requests. Approved icon source (owner, 2026-10-20 12:46 PM ET): its skill icons ship under the standing icon OK, each recorded in `docs/ISSUES.md` and checked against the owner's screen, since an ID-to-icon mapping can be wrong (Metabot 18120000). Added to the network list by the owner, 2026-10-20 12:27 PM ET | 2026-10-20 | `2026-10-icon-sites-vetting.md` |
| aion2.app | **Spot**: never the only source (owner, 2026-10-18, `docs/DECISIONS.md`; amends Q3) | Item and skill database | Terms: "personal, non-commercial… not to: Scrape, copy, or redistribute". Not `/api/`, `/admin`, `/account`, `/login`. Non-commercial terms: review before monetising | terms read for `2026-10-data-sources.md` §10 (2026-10), robots 2026-10-18 | BGS §1; `2026-10-data-sources.md` §10 |
| daevacompanion.com, *.daevacompanion.com | Own app | The live site | — | — | `docs/DEPLOY.md` |
| daevapath.com, *.daevapath.com | Own app | Forwards (301) to daevacompanion.com | — | — | `docs/DECISIONS.md` D1c |

Removed from this table in the allowed-domains audit (2026-10-21, `2026-10-allowed-domains-audit.md`; Game Data Check backed it: no shipped fact
rests on them): aion2-guides.info (an aggregator, not independent), aion2.inven.co.kr (its Korean preview overlaps
aion2-meta), aionbuilds.com (player-shared builds), aion2maps.com (overlaps daevaguides) and aion2t.com (collected
guides). None was cited in `data/`. They are not read for new work. They stay on the environment's network list until the
owner removes them there.

**Build sources** (audit 2026-10-21; gamewith.ai added by Game Data Check 2026-10-21). Build picks cite top-player
pick rates from Metabot and gamewith.ai build-stats (Global regions only; KR and TW are disputed for Global by default),
and the three build witnesses, daevaguides.com, mmo-codex.com and aion2turkiye.com; no other build site is cited for
picks. gamewith.ai is Spot level under Legal's ruling (`/mnt/project-files/legal/ruling-gamewith-guildorder-2026-10-21.md`):
individual facts a pick needs, linked, paraphrased, never a table or ranking reproduced, never the only source.
How a pick is labelled (pick rate is never "verified"; leveling picks need two witnesses; two pick rates that disagree
make it "disputed") is Game Data Check's standard (ROL-03), proposed in the audit note.

## Passed but not on the allowed list (low value; add only if a task needs one)

gameplay.tips, pixelnitro.com, mein-mmo.de (re-checked 2026-10-19: weekly maintenance schedule only, single source,
never game data; cited by `docs/kaizen/patch-watch.md`; `2026-10-steam-and-news-vetting.md`), gamerblurb.com
(non-commercial terms), aion2tierlist.com (tier lists only), and the gold/boosting shops aoeah.com, mmoexp.com,
expcarry.com, oslink.io, u4n.com (**Spot**: its terms ban scraping). All checked 2026-10-18, BGS §2 / §3a.
expcarry.com re-read 2026-10-20 for its daily/weekly checklist guide (reset times, entry counts): terms now grant a
"personal, non-commercial" licence and ban bots only as uploads; robots.txt doesn't block Claude-User. It stays
**Spot**, never the only source (boosting shop, editorial), `2026-10-endgame-sources-vetting.md`.
aion2kina.com (fan toolkit and map; terms ban only "unreasonable automated load"; its map markers aren't game art,
inferred) checked 2026-10-19, `2026-10-t47-icon-check.md`. Steam Index API (public-api.steamidx.com: AION 2's Steam
(app id 3393110) build ID changes with timestamps; owner-created key and the owner's network-list OK needed first; its site pages ask
not to be scraped, so never those; its API terms require a "Data from Steam Index" link, plus a Sources card entry,
wherever the app shows its data) checked 2026-10-20, `2026-10-steam-and-news-vetting.md`.
gamewith.ai (checked 2026-10-21, `2026-10-build-sites.md`): **Spot**, facts only (Legal ruling 2026-10-21, `/mnt/project-files/legal/ruling-gamewith-guildorder-2026-10-21.md`; outside review OK 14:10Z). Its build-stats pages (`/aion2/en/build-stats/<region>/<class>`) give per-region top-player shares for gear, skill levels and Daevanion from a stated sample. Terms: no bot clause; robots.txt is 404. Cite single facts with a link, paraphrased (`quotes: no`); never copy its tables, rankings or sets of shares (terms act 14), and no systematic extraction (only the facts a given pick needs); never the only source. The permission ends if the project monetises (act 16, commercial use). Its pick-rate use is set in "Build sources" above.
World-boss trackers, checked 2026-10-20 (`2026-10-world-boss-sources.md`). They are not on the environment's network
list; adding one needs the owner's OK. Community trackers: never the only source for a schedule. Rows marked "No terms found" may be read
under the no-terms rule in "Keeping this current" (owner, 2026-10-21).

| Site | Use | Good for | Limits | Checked | Evidence |
|---|---|---|---|---|---|
| aion2atlas.app | Full, facts only | World boss and field boss timers (Global and KR columns) | Not `/api/` (robots.txt; Claude-User falls under `*`). Terms (`/terms`): "do not copy whole pages or scrape the site at high volume"; short quotes with a link are fine; icons and art are NCSOFT's. Timers may be outdated after patches | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| aion2vault.com | Full, facts only | Boss timers (cites allthings.how, so never an independent second source) | robots.txt allows all. Terms of Service (`/terms-of-service/`): no clause on bots or scraping; "may not copy, republish, or redistribute our content without attribution and a link back"; personal, non-commercial use, so review before monetising. Facts and a link only | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| aion2data.com | No terms found: **Spot**, facts only (owner, 2026-10-21) | Game data read from the Global client (v2.0.6.0 hotfix 1, per its About page) | Not `/api/` (robots.txt, Claude-User group). No terms page found (`/terms` is 404, no footer link); footer says game data and art belong to NCSOFT. Facts and a link only | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| allthings.how | Spot | News and guides, boss respawn times | robots.txt blocks only admin paths. Terms at `/terms-and-conditions/` (found by web search 2026-10-20; the footer's `/terms/` is 404) ban copying, reproducing or downloading its material without written permission, not reading it. Facts and a link only, never its wording | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| aion2rifttimer.com | No terms found: **Spot**, facts only (owner, 2026-10-21) | Boss, Artifact Siege and reset timers | robots.txt allows all. No terms or legal link on the site. Facts and a link only | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| aion2rift.com | No terms found: **Spot**, facts only (owner, 2026-10-21) | Rift and boss timers (region tags kr/tw) | robots.txt allows all. No terms link (only `/privacy/`); `/terms` is 404. Facts and a link only | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |
| criticalhits.com.br | No terms found: **Spot**, facts only (owner, 2026-10-21) | Portuguese news and guides | robots.txt blocks only admin and pagination paths. No terms of use page; footer has a legal notice (`/aviso-legal/`), not read. Facts and a link only | 2026-10-20 | `2026-10-world-boss-sources.md` (23:20Z update) |

## Owner-supplied documents (not fetched; read from the owner's upload)

| Document | Use | Good for | Limits | Checked | Evidence |
|---|---|---|---|---|---|
| Kanon's Aion 2 Bible (PDF of a Google Doc by the streamer Kanon, "Update Note 10/4/2026"; owner upload 2026-10-20) | Leads only, facts only | Leads for endgame gear: enhancement and Amp levels, gear transfer, soul binding, stigma shard sources, Arcana, Daevanion, Genus, wings | Never one of the two sources for a fact: single author, self-reported, written from KR at Lv 50 and only partly updated for Global (Lv 45 cap); Lv 50 / "Chapter 1" content is KR-only. No licence or sharing statement: never its wording, tables or structure. Barely covers dailies and weeklies | 2026-10-20 | `2026-10-endgame-sources-vetting.md` |

## Fail (never read by a session)

| Site | Why | Checked |
|---|---|---|
| aion2.th.gl | CLAUDE.md: no automated reading (its robots.txt excludes AI agents) | 2026-10-14 |
| Game8 (game8.co) | CLAUDE.md: never used | — |
| aion2.plaync.com (NCSoft's official site, its character search and data feed) | NC's End User License Agreement bans automated access, scraping, "spiders, robots, crawlers, data mining tools" | 2026-10-18 |
| maxroll.gg, sportskeeda.com | robots.txt blocks Claude-User (`Disallow: /`) | 2026-10-18 |
| metaroad.gg | Terms: "automated means (bots, scrapers)… without permission". Written permission could open it | 2026-10-18 |
| bluestacks.com, invenglobal.com | Terms ban crawling / any "robot, spider or other automatic device" | 2026-10-18 |
| dbaion2.ru / .online, gamers4.life (+ interactivemap.app), wikily.gg | Terms ban bots or automated collection (gamers4.life `/terms` re-read at the owner's request 2026-10-20, unchanged) | 2026-10-14 to 2026-10-20 |
| aion2.online | No data of its own: its database links all go to gamers4.life | 2026-10-18 |
| aion2.gaming.tools, games.gg, mobalytics.gg, eloboost24.eu, icy-veins.com, keengamer.com | 403 challenge to our requests (access, not a ban). Owner browser only | 2026-10-18 |
| noping.com | 403 to our request for its terms page (`/terms/terms-of-use`). Owner browser only; its AION 2 build blog is dated 2025-11 (pre-Global) | 2026-10-21 |
| guildorder.com | Acceptable Use Policy bans "Using automated tools (bots) to interact with the Platform without authorization". An opt-out (Legal ruling 2026-10-21): never fetched, owner browser only; robots.txt and content not read | 2026-10-21 |
| neonsect.com | Terms page (`/terms-of-service/`) doesn't render to a script, so its terms are unread; a boosting shop. No new use (Legal, 2026-10-21); owner browser only | 2026-10-21 |
| thegameswiki.com | 429 security checkpoint. Its content is CC BY-NC-SA: facts only, never wording | 2026-10-18 |
| timesaver.gg | Connection reset, not reached | 2026-10-18 |
| namu.wiki | Cloudflare challenge (403) on our first request, the terms page (`/w/나무위키:이용약관`). Owner browser only | 2026-10-19 |
| Allakhazam / ZAM (\*.allakhazam.com, Fanbyte terms) | Terms ban "spiders, robots, crawlers, data mining tools" | 2026-10-19 |
| Steam Web API (api.steampowered.com) | Terms: Pass (keyed use). robots.txt `Disallow: /` for all agents, and robots wins for us | 2026-10-19 |
| steamdb.info | Its FAQ (its terms): "We also do not allow scraping/crawling on SteamDB". Owner browser only | 2026-10-20 |
| questlog.gg | Cloudflare challenge (403) on our first request, the terms page (`/terms`). Owner browser only. No auto-pull or kept copy; one fresh, logged `/terms` request is allowed after 2026-11-19, and if it is challenged again, stop (Legal ruling, 2026-10-21) | 2026-10-21 |
| 6sword.com | robots.txt `User-Agent: *` / `Disallow: /`; terms (제7조) ban automated collection and scraping without written consent | 2026-10-20 |
| zygorguides.com | Terms of Use ban navigating the site with "spiders, bots… or intelligent agents" and "aggregating, copying or duplicating" its materials. Product research only (Daeva Companion's inspiration); owner browser only | 2026-10-20 |
| playnews.gg | 403 to our request for its home page (where its terms link would be); robots.txt itself loads. Owner browser only | 2026-10-20 |

## Keeping this current

Any session that vets a site, or finds a change (new terms, a new block), updates its row here in the same PR, with the
date and the research note that holds the evidence. When a site's terms URL is unknown, try `/terms`, `/terms-of-service`,
`/tos`, `/terms-of-use` and `/terms-and-conditions` (with `curl -L`, since many redirect to a trailing slash), then a web
search, before reading any content page.

Fetch log (ROL-08, team after the governance review, 2026-10-20). Every thread that fetches keeps one line per request
in its own file, `/mnt/project-files/legal/fetch-log/<thread>.md`, which only that thread writes, adding lines at the end
(Legal, 2026-10-21; `legal/fetch-log.md` is the frozen archive): time (UTC), host, URL, purpose and thread, status code. Before the first
content request to a new host, its line names the terms URL and robots.txt already read, and the verdict: terms OK,
scraping-only (spot checks allowed) or opt-out (never fetch). No terms URL means no content request, with one exception (owner, 2026-10-21, Source Vetting thread; Legal's
conditions): a site whose terms page the five paths above and a web search don't find may be read when robots.txt
allows it, with the paths tried and the search logged in the thread's file as evidence, at Spot level (a few pages, at
least 5 s apart), for facts with a link only: no quotes, no copies kept. The evidence follows the same timing as a terms
read: before the first content request, the host's line says "no terms found" with the paths tried and the search query.
If a terms page turns up later, the site is vetted again before any further read, and each minor's spot check also
re-checks one no-terms entry. Copyright still applies, so no terms page is no
permission to reuse wording. Legal (Chuck) confirms every thread's file in `legal/fetch-log/` and the archive. A break of this order (content read before its terms) is closed out in the log: anything kept from it is deleted or re-sourced from a
permitted source, and the facts it supports are re-verified or labelled. Each minor's fresh spot check verifies one
terms-read entry against the live terms page.
