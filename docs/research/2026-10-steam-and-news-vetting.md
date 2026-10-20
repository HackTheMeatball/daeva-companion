# Steam build trackers and news sites: vetting (2026-10-19 / 2026-10-20)

Source Vetting. Terms read first, then robots.txt; our User-Agent, one request at a time, at least 6 s apart; nothing
kept beyond these quotes.

| Site | Terms (read first) | robots.txt | Verdict |
|---|---|---|---|
| mein-mmo.de (2026-10-19, for Game Data Check's maintenance-day ask) | Pass: <https://mein-mmo.de/nutzungsbestimmungen/> (April 2025) has no clause on automated access, crawling or scraping; § 3 "Faire Nutzung" is about ad blockers | Pass: `User-agent: *` disallows only `/magazin/wp-admin/*`; Claude-User and our UA not named | Passed: weekly maintenance schedule only, single source, never game data |
| Steam Web API, api.steampowered.com (2026-10-19) | <https://steamcommunity.com/dev/apiterms> (July 2010) licenses keyed API use | Fail: `User-agent: *` / `Disallow: /` | Fail |
| steamdb.info (2026-10-20, owner's ask) | Fail: its FAQ is its terms (<https://steamdb.info/faq/>): "We also do not allow scraping/crawling on SteamDB", and auto-refreshing or automated crawling may be auto-banned | Not read (terms fail) | Fail; owner browser only |
| steamidx.com, Steam Index (2026-10-20, owner's ask) | No terms page (`/terms` 404). FAQ (<https://steamidx.com/faq>): "Can I scrape data from Steam Index? Please don't. Use the free Steam Index API instead". API terms (<https://steamidx.com/api-docs>, "Terms"): show a "Data from Steam Index" link wherever the data is displayed; keys private, one account per project, stay within limits; no resale or bulk republishing. Commercial use allowed | Site: AI training crawlers blocked, `User-agent: *` allowed except `/api/`, `/settings`, `/user/`. `public-api.steamidx.com/robots.txt`: 404 (no rules) | Site pages: no automated reads. API: Pass, needs an owner-created key and the owner's OK for the network list |

Steam Index API endpoint for patch watch: `GET https://public-api.steamidx.com/v1/apps/3393110/changes` returns Valve's
PICS changes newest first; a `depots.branches.public.buildid` row carries the old and new build ID and an `at`
timestamp (the patch time). 1,440 requests a day per account, 60 a minute per key. Requests: steamidx.com 7 (www
redirect, `/terms` 404, home page for the legal links, FAQ, API docs, two robots.txt); steamdb.info 1 (FAQ);
api.steampowered.com 1 plus steamcommunity.com 1; mein-mmo.de 6 (terms, robots.txt twice, one ticker page reached through two redirects).
