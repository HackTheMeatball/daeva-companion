# Build-guide sources: robots.txt and terms vetting (2026-10)

Research session, 18 Oct 2026, 2:00–2:05 AM ET (06:00–06:05 UTC). **Access vetting only: no guide page was read, and no
file in `data/` or `src/` was changed.** Prepares the future class-build dropdown (skill order, stigmas, Daevanion
nodes, titles, specialties): which sites a session may later read for build data. Follows the fetching policy in
`CLAUDE.md` and the checklist in `2026-10-source-vetting.md` §2 (items 1 and 2 only). Builds on
`2026-10-specialty-picks.md` §2 and `2026-10-source-vetting.md`; where this file and those disagree about a site's
access, this file is newer.

**Environment.** Run from a session on the owner's temporary full-network environment. Before that, the project's
Limited environment refused 30 of 32 build sites at the proxy (Build guide sources check thread, 1:48 AM ET). This
session re-tested skycoach.gg, corpus.gg and aion2.gaming.tools first: all three returned robots.txt with HTTP 200.

**Method.** User-Agent `DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`. Per host, in order: robots.txt; if
robots allowed us, the home page (only to find the terms link in the footer, as checklist item 1 allows); then the
terms page. At most 4 requests per host, at least 5 s apart on each host. **116 requests in total** (54 robots.txt, 37
home pages, 25 terms, imprint, index or methodology pages; including the follow-up checks the owner asked for until 3:32 AM ET). A 403, 429 or challenge page ended work on that host with no retry; one
connection-reset host (timesaver.gg) got one retry. Responses stayed in the session scratchpad and were not committed.
Candidates came from web search results (titles and URLs only) plus the sites already named in earlier vetting.

**Rules applied.**

- *Robots fail* = robots.txt disallows the agent we actually use: Claude-User, or our own User-Agent (which falls
  under `*` unless named). Blocking only AI training crawlers (ClaudeBot, anthropic-ai, Claude-Web, GPTBot, CCBot,
  Google-Extended …) is not an opt-out. This is the owner's rule from 2026-10-18 3:31 AM ET (docs/DECISIONS.md), which
  replaced the earlier "names Claude/AI agents" reading; the first pass of this file used the earlier reading, and
  §3a re-checks the five sites it changes.
- *Terms fail (tier 1)* = the terms ban automated access, bots, crawlers or scripts. *Tier 2* = the terms ban only
  scraping or bulk copying: a few spot checks per task, 5 s apart, facts only, nothing stored. *Tier 3* = no clause:
  12 req/min per host, one at a time, 24 h cache. No terms page = tier 3 with unknown reuse rights: facts only, credit
  link, no tables.
- *Access fail* = 403 / 429 / challenge page / no connection. Not a ban, but sessions can't read it honestly, so it is
  an owner hand check only.
- "Personal, non-commercial use" clauses (Metabot, GamerBlurb, Inven) restrict reuse of their content, not reading.
  We take facts only and credit with a link, as with Metabot today. Flagged because the owner plans to monetize.

## 1. Result in brief

- **Pass, worth adding for build research (12):** skycoach.gg, corpus.gg, aion2-meta.com, aion2turkiye.com,
  gamesfuze.com, aion2quest.pro, daevaguides.com, aion2-guides.info, mmo-codex.com (tier 2), aion2.inven.co.kr, and
  under the 2026-10-18 robots rule aionbuilds.com and aion2maps.com (§3a).
  metabot.gg and aion2hub.com also pass and are already allowed.
- **Pass, but low value (10):** gameplay.tips, pixelnitro.com, mein-mmo.de, gamerblurb.com, aion2tierlist.com (§3a), and five gold/boosting
  shops (aoeah.com, mmoexp.com, u4n.com (tier 2), expcarry.com, oslink.io). Not recommended for the allowed list:
  earlier research found no usable picks on gameplay.tips and Pixelnitro, mein-mmo shows up only for tier lists, and the
  shops' guides are marketing for paid services. Add them only if a later task needs one.
- **Fail, robots.txt blocks Claude-User (2):** maxroll.gg, sportskeeda.com. Of the five that blocked only training
  crawlers (§3a): metaroad.gg fails on its terms, keengamer.com on access (403), aion2tierlist.com passes but is low
  value, aionbuilds.com and aion2maps.com pass.
- **Fail, terms ban bots or crawling (2 new + 2 earlier):** bluestacks.com, invenglobal.com; earlier: dbaion2.ru /
  .online, gamers4.life. aion2.app was not re-checked: its terms (read in `2026-10-data-sources.md` §10) ban scraping,
  copying and redistribution. Read on their own words that is tier 2 (spot checks), but owner decision Q3
  (2026-10-14, `docs/DATA-FORMAT-V2.md` §14.1) says aion2.app is read "by a person or not at all", so it stays
  **human-only** until the owner decides otherwise. It is an item/skill database, not a build guide. Its sister site **aion2t.com** (news and guides) is the same operator: same terms text dated 26 Apr 2026
  ("personal, non-commercial purposes only… not to: Scrape, copy, or redistribute Site content without permission"),
  terms contact `contact@aion2.app`, images and the Database link served from aion2.app; robots.txt allows all but
  `/api/`, `/admin`, `/account`, `/login` and query URLs of `/dps-top` and `/leaderboard`. Same verdict as aion2.app:
  human-only under Q3 until the owner decides. Checked at the owner's request, 2:55 AM ET (robots.txt of both, aion2t.com home and `/terms`).
- **Fail, can't be read by a session (7):** aion2.gaming.tools, games.gg, mobalytics.gg, eloboost24.eu, icy-veins.com (403 challenge),
  thegameswiki.com (429 Vercel checkpoint), timesaver.gg (connection reset twice).
- **Never fetched by rule:** aion2.th.gl, Game8.

## 2. Pass

| Site | robots.txt (ClaudeBot / Claude-User / GPTBot) | Terms | Tier | Build-guide URL (from search, not read) | Notes |
|---|---|---|---|---|---|
| metabot.gg | Allowed / allowed / allowed (`*` group) | `/en/legal/terms-of-service` (effective 04/01/2026): "You may browse and use the website and application for personal, non-commercial use. You agree not to misuse the site or application, attempt unauthorized access, interfere with its operation…". No bot clause. | 3 | https://metabot.gg/en/aion-2/classes/sorcerer/build (per class) | Already allowed; main source. Daevanion planner at `/en/aion-2/daevanion/<class>`. |
| skycoach.gg | Allowed (`Crawl-delay: 1`) | `/agreement/customer` (15/07/2026): no bot, crawler or scraping clause. | 3 | https://skycoach.gg/blog/aion-2/articles/gladiator-guide | Boosting shop with a guide blog; used for specialty picks. |
| corpus.gg | Allowed (`/data/` disallowed) | `/terms`: "Use the site for personal reference. Do not attempt to disrupt the service or to access data outside the published pages and tools." No bot clause. | 3 | https://corpus.gg/blog/aion-2/assassin-pve-build | Says entries are "built from extracted game data". Keep off `/data/`. |
| aion2-meta.com | Allowed | No terms page (only `/privacy/` in the footer). | 3, reuse unknown | https://aion2-meta.com/guides/gladiator/ (per class) | Skills, stigmas, Daevanion and specialties per class, from Korean top-player data (KR = preview, not verification of a global fact). |
| aion2turkiye.com | Allowed | No terms page (footer: Hakkında, İletişim, Gizlilik). | 3, reuse unknown | https://aion2turkiye.com/en/class/assassin/ | Leveling, Dungeon and PvP panels. |
| gamesfuze.com | Allowed | No terms page (only a privacy policy). | 3, reuse unknown | https://gamesfuze.com/guides/aion-2-assassin-build-best-skills-stigmas-and-rotation/ | Picks not slot-ordered (specialty research). |
| aion2hub.com | Allowed (`/api/` disallowed) | No terms page (2026-10-14 vetting). | 3, reuse unknown | https://aion2hub.com/ | Already allowed; pre-launch snapshot, weak corroboration only. |
| aion2quest.pro | Allowed; names GPTBot, ClaudeBot, Claude-SearchBot, Claude-User with `Allow: /` (`/api/`, `/sim/` disallowed) | `/terms` (Russian): asks for credit and a link for a short quote, and agreement before full republication; "Не пытайтесь … обходить защиту сайта или мешать работе сервиса" (don't bypass site protection or disrupt the service). No bot clause. | 3 | https://aion2quest.pro/en/daevanion/sorcerer (Daevanion planner); also a titles database | Its desktop app reads game network traffic for a DPS meter. That doesn't affect reading the site, but data derived from it would fall under our no-packet-sniffing rule: check each field's origin before use. |
| daevaguides.com | Allowed; ClaudeBot, Claude-User, GPTBot each `Allow: /` with `Content-Signal: search=yes, ai-input=yes, ai-train=yes` | `/en/guides/terms/`: "It is forbidden to act in a way that disrupts the Site, in particular mass automated queries to the 'Check your character' tool and circumventing the query limit." Applies to that tool only. | 3 (never touch the character tool) | https://daevaguides.com/en/sorcerer/ | Polish/English guides. |
| aion2-guides.info | Allowed | No terms page; the index says the guides are collected from content creators, link their sources, and are organised "with the help of Claude (AI)". | 3, reuse unknown | https://aion2-guides.info/en/sorcerer/ | Secondary: a compilation of other creators. Cite the creator it links, and don't count it as independent of them. couga54.github.io/aion2-guides looks like the same project (same page titles, inferred) and was not vetted separately. |
| mmo-codex.com | Allowed | `/terms/`: quoting "a reasonable extract — a paragraph, a table row, a set of numbers" with credit and a link is allowed; "Automated republication and scraped copies are not permitted in any language." | **2** (spot checks) | https://mmo-codex.com/articles/aion-2-gladiator-guide/ | Bans scraping, not reading: a few pages per task, 5 s apart. |
| aion2.inven.co.kr | Allowed | Inven member terms `www.inven.co.kr/doc/service.php`, Art. 10②: members may not copy, transmit, modify or publish posts the company holds copyright to without consent, or use them commercially. No crawler, robot or automation clause found. | 3, facts only | https://aion2.inven.co.kr/ (class boards) | Korean. KR builds are a preview, never verification of a global fact. |
| gameplay.tips | Allowed | Only a privacy link. | 3 | — | Low value: no usable picks in specialty research. |
| pixelnitro.com | Allowed | Only a privacy link. | 3 | — | Low value: same. |
| mein-mmo.de | Allowed | `/nutzungsbestimmungen/` and `/impressum/` (Webedia): no crawler or text-and-data-mining reservation found. | 3 | — | Low value: tier lists only in search. |
| gamerblurb.com | Names anthropic-ai, ClaudeBot and GPTBot in one group with `*` that only disallows paths such as `/config`, `/search`, `/api/` | `/terms-of-use`: "You may use our website for personal, non-commercial purposes only… you can't republish or reuse our content without permission." No bot clause. | 3, facts only | — | Low value. Earlier research skipped it under the stricter robots reading. |
| expcarry.com | Names GPTBot, ClaudeBot, Claude-Web in a shared group with `*` (path disallows only) | `/terms`: "Upload or transmit malware, bots, or harmful code" (about uploading, not reading). | 3 | — | Low value: boosting shop. |
| aoeah.com | Allowed | `/conditions` is a privacy policy; no terms of use. | 3, reuse unknown | https://www.aoeah.com/news/4215--aion-2-global-best-builds--skills-for-each-class-solo-pvp--pve | Low value: gold shop. |
| mmoexp.com | Allowed | `/Terms.html`: no bot or scraping clause. | 3 | — | Low value: gold shop. |
| u4n.com | Allowed | `/terms-service`: "Do not scrape, copy, republish, or sell user data or Platform content without authorization." | **2** | — | Low value: trading marketplace. |
| oslink.io | Allowed | `/terms-of-service.html`: service terms for its remote-play product; no bot or scraping clause. | 3 | — | Low value. |

## 3. Fail

| Site | Gate | Evidence (quoted) | Build-guide URL (from search, not read) |
|---|---|---|---|
| maxroll.gg | robots | One group lists anthropic-ai, Claude-Code, Claude-SearchBot, Claude-User, Claude-Web, ClaudeBot, GPTBot and others, with `Disallow: /`. | — |
| sportskeeda.com | robots | `User-agent: ClaudeBot` / `Claude-SearchBot` / `Claude-User` / `Claude-Web`, each `Disallow: /`. | https://www.sportskeeda.com/mmo/aion-2-gladiator-skill-build-easy-macro-leveling-endgame |
| metaroad.gg | terms (§3a) | robots.txt blocks training crawlers only and explicitly allows Claude-User. `/terms-of-service` (last updated September 4, 2026): you may not "Use automated means (bots, scrapers) to access the Service without permission". Tier 1. | https://metaroad.gg/aion2/build-guides/gladiator-pve-dps-build |
| keengamer.com | access (§3a) | robots.txt blocks ClaudeBot only (Claude-User gets the general rules), but the home page returned **403** with a challenge, so the terms weren't read. | https://www.keengamer.com/articles/guides/aion-2-best-class-tier-list-pve-pvp-solo/ |
| bluestacks.com | terms | `/terms-and-privacy.html`: you may not use the Services in a way that "'Crawls,' 'scrapes,' or 'spiders' any page, data, or portion of or relating to the Services or Content (through use of manual or automated means)". Tier 1. | https://www.bluestacks.com/blog/game-guides/aion2/a2-class-tier-list-en.html |
| invenglobal.com | terms | `/doc/terms-of-service`: you may not "Use any robot, spider or other automatic device, process or means to access the Website for any purpose, including monitoring or copying any of the material on the Website." Tier 1. | — |
| dbaion2.ru / .online, gamers4.life | terms (earlier) | Terms ban bots/automated collection (`2026-10-source-vetting.md` §1, `2026-10-data-sources.md` §10). Not re-requested. | — |
| aion2.gaming.tools | access | robots.txt allows everyone, but the home page returned **403** with a Cloudflare challenge. Same as 2026-10-14. It's named as a game-database source in CLAUDE.md, but sessions can't read it: owner hand check only. | — |
| games.gg | access | robots.txt allows (`Content-Signal: ai-input=yes`), home page **403** challenge. Same as 2026-10-16. | https://games.gg/aion-2/guides/aion-2-assassin-build-guide/ |
| mobalytics.gg | access | robots.txt allows, home page **403** challenge. | https://mobalytics.gg/gamebase/guides/aion-2-sorcerer-hellfire-pve-build |
| eloboost24.eu | access | robots.txt allows, home page **403** challenge. | https://eloboost24.eu/blog/aion-2-assassin-build |
| icy-veins.com | access | robots.txt allows everyone (no AI agent named), but the home page returned **403** with a challenge, so the terms weren't read. Checked at the owner's request, 2:20 AM ET. Search found no AION 2 section on the site. | — |
| thegameswiki.com | access | robots.txt returned **429** "Vercel Security Checkpoint". Same as 2026-10-16. | — |
| timesaver.gg | access | TLS connection reset on robots.txt, twice. Not reached. | https://timesaver.gg/blog/aion-2-tier-list-best-class-october-2026 |
| aion2.plaync.com (NCSoft's official AION 2 site, incl. its character search and the data feed behind it) | terms | robots.txt `Allow: /`, but the site links NC's End User License Agreement (`www.plaync.com/policy/service/game_en`, last updated 15 Apr 2026), which covers its "Websites" and bans accessing or searching the Services "by any means (automated or otherwise) other than through our currently available, published interfaces… (scraping the Services without the prior consent of NC is prohibited)" and "spiders, robots, crawlers, data mining tools or the like" other than NC's software or ordinary web browsers. No published developer API was found. Tier 1: never scripted; owner browser only. Checked at the owner's request, 3:12 AM ET. | — |
| gamers4.life (incl. `/aion-2/database/en/`) | terms | Re-checked at the owner's request, 3:21 AM ET: robots.txt allows all but `/api/`, `/studio/`, `/admin/`, `/_next/`; `/terms` §2 still says "personal, non-commercial use. Not allowed: … Using bots, scrapers, or automated tools". Tier 1: database pages not opened; owner browser only. Says its data is read from the official client files (`2026-10-data-sources.md` §10). | — |
| aion2.online (`/database/`) | not a source | robots.txt allows all; no terms page. `/database/` (read 3:21 AM ET) is a landing page whose links all go to gamers4.life's database and planners and to aion2.interactivemap.app (same operator as gamers4.life). It has no data of its own, so it inherits gamers4.life's tier-1 verdict for anything useful. | — |
| aion2.th.gl, Game8 | rule | Never fetched (CLAUDE.md). | — |

## 3a. Re-check under the 2026-10-18 robots rule

Run at 3:32 AM ET, after the owner's OK: each site's home page (for the terms link) and its terms page, 7 requests,
5 s apart per host. robots.txt was already read in the first pass.

| Site | robots.txt | Terms | Verdict | Build-guide URL (from search, not read) |
|---|---|---|---|---|
| aionbuilds.com | Blocks ClaudeBot, Claude-Web, Anthropic-ai; Claude-User and our UA fall under `*` | `/en/terms` (October 6, 2026): community guide and build-planner site; user accounts, data accuracy ("compiled from game client data and community verification"), ads. No bot, scraping or reuse clause. | **Pass, tier 3** | https://aionbuilds.com/en/tier-list (also a build editor and class pages) |
| aion2maps.com | "AI training crawlers" group (GPTBot, ClaudeBot, anthropic-ai …) `Disallow: /`; others allowed | No terms page (footer: Contact, About, Privacy). | **Pass, tier 3, reuse unknown** | https://aion2maps.com/guides/gladiator/ |
| aion2tierlist.com | Blocks ClaudeBot and GPTBot only | No terms page (footer: About, Privacy). | **Pass, tier 3**, low value (tier lists only) | https://aion2tierlist.com/ |
| metaroad.gg | Blocks training crawlers; explicitly `Allow: /` for Claude-User and Claude-SearchBot | Bans "automated means (bots, scrapers)… without permission". | **Fail (terms)**. Asking for permission could change it. | https://metaroad.gg/aion2/build-guides/gladiator-pve-dps-build |
| keengamer.com | Blocks ClaudeBot only | Not read: home page 403 challenge. | **Fail (access)** | https://www.keengamer.com/articles/guides/aion-2-best-class-tier-list-pve-pvp-solo/ |

## 4. Allowed domains to add (owner)

The twelve "worth adding" sites from §1 (the last two added after §3a). `metabot.gg` and `aion2hub.com` are already on the list:

```
skycoach.gg
corpus.gg
aion2-meta.com
aion2turkiye.com
gamesfuze.com
aion2quest.pro
daevaguides.com
aion2-guides.info
mmo-codex.com
aion2.inven.co.kr
aionbuilds.com
aion2maps.com
```

## 5. Owner decisions (none block the build dropdown)

1. **Robots reading: decided.** Owner, 2026-10-18 3:31 AM ET: robots.txt fails a site only if it blocks the agent we
   use (Claude-User or our own User-Agent); blocking only training crawlers is not an opt-out. Applied in §3a and in
   CLAUDE.md / `docs/team/data-research.md`.
2. **Monetization.** Metabot, GamerBlurb and Inven allow only personal or non-commercial use of their content. We take
   facts and link, which is how Metabot is used today. Whether that still holds once the app earns money is a question
   for the owner, not one this vetting can settle.

## 6. Next step (not done here)

Vetting covers checklist items 1 and 2 only. Before any site feeds the build dropdown, run items 3 to 8 (data origin,
game build shown, agreement test, update speed, rate limits, independence) on the guide pages themselves, with the
claims labels from `claims.json`.
