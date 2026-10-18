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
terms page. At most 4 requests per host, at least 5 s apart on each host. **86 requests in total** (39 robots.txt, 29
home pages, 18 terms/imprint/index pages). A 403, 429 or challenge page ended work on that host with no retry; one
connection-reset host (timesaver.gg) got one retry. Responses stayed in the session scratchpad and were not committed.
Candidates came from web search results (titles and URLs only) plus the sites already named in earlier vetting.

**Rules applied.**

- *Robots fail* = robots.txt disallows any Claude/Anthropic agent (ClaudeBot, Claude-User, Claude-SearchBot,
  Claude-Web, anthropic-ai). CLAUDE.md: a site that names Claude/AI agents to opt out is never fetched. A site that
  names Claude only to grant it the same access as everyone (an `Allow` group, or a shared group with `*`) is **not**
  treated as an opt-out here. That is a narrower reading than `2026-10-specialty-picks.md` §2, which skipped
  GamerBlurb and expcarry for naming ClaudeBot at all; see "Owner decisions" below.
- *Terms fail (tier 1)* = the terms ban automated access, bots, crawlers or scripts. *Tier 2* = the terms ban only
  scraping or bulk copying: a few spot checks per task, 5 s apart, facts only, nothing stored. *Tier 3* = no clause:
  12 req/min per host, one at a time, 24 h cache. No terms page = tier 3 with unknown reuse rights: facts only, credit
  link, no tables.
- *Access fail* = 403 / 429 / challenge page / no connection. Not a ban, but sessions can't read it honestly, so it is
  an owner hand check only.
- "Personal, non-commercial use" clauses (Metabot, GamerBlurb, Inven) restrict reuse of their content, not reading.
  We take facts only and credit with a link, as with Metabot today. Flagged because the owner plans to monetize.

## 1. Result in brief

- **Pass, worth adding for build research (10):** skycoach.gg, corpus.gg, aion2-meta.com, aion2turkiye.com,
  gamesfuze.com, aion2quest.pro, daevaguides.com, aion2-guides.info, mmo-codex.com (tier 2), aion2.inven.co.kr.
  metabot.gg and aion2hub.com also pass and are already allowed.
- **Pass, but low value (9):** gameplay.tips, pixelnitro.com, mein-mmo.de, gamerblurb.com, and five gold/boosting
  shops (aoeah.com, mmoexp.com, u4n.com (tier 2), expcarry.com, oslink.io). Not recommended for the allowed list:
  earlier research found no usable picks on gameplay.tips and Pixelnitro, mein-mmo shows up only for tier lists, and the
  shops' guides are marketing for paid services. Add them only if a later task needs one.
- **Fail, robots.txt opts Claude out (7):** maxroll.gg, sportskeeda.com, metaroad.gg, aionbuilds.com, aion2tierlist.com,
  keengamer.com, aion2maps.com.
- **Fail, terms ban bots or crawling (2 new + 3 earlier):** bluestacks.com, invenglobal.com; earlier: dbaion2.ru /
  .online, gamers4.life, aion2.app.
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
| metaroad.gg | robots | `User-Agent: GPTBot` / `ClaudeBot` / `anthropic-ai` / `Claude-Web` … `Disallow: /`. (It allows Claude-User and Claude-SearchBot: see "Owner decisions".) | https://metaroad.gg/aion2/build-guides/gladiator-pve-dps-build |
| aionbuilds.com | robots | `User-Agent: ClaudeBot` `Disallow: /`; same for Claude-Web and Anthropic-ai. | https://aionbuilds.com/en/tier-list |
| aion2tierlist.com | robots | `User-agent: ClaudeBot` `Disallow: /`; `User-agent: GPTBot` `Disallow: /`. | https://aion2tierlist.com/ |
| keengamer.com | robots | `User-agent: ClaudeBot` `Disallow: /` (Claude-User and Claude-SearchBot get the general rules). | https://www.keengamer.com/articles/guides/aion-2-best-class-tier-list-pve-pvp-solo/ |
| aion2maps.com | robots | "# AI training crawlers": GPTBot, ClaudeBot, anthropic-ai … `Disallow: /`. Unchanged since 2026-10-16. | https://aion2maps.com/guides/gladiator/ |
| bluestacks.com | terms | `/terms-and-privacy.html`: you may not use the Services in a way that "'Crawls,' 'scrapes,' or 'spiders' any page, data, or portion of or relating to the Services or Content (through use of manual or automated means)". Tier 1. | https://www.bluestacks.com/blog/game-guides/aion2/a2-class-tier-list-en.html |
| invenglobal.com | terms | `/doc/terms-of-service`: you may not "Use any robot, spider or other automatic device, process or means to access the Website for any purpose, including monitoring or copying any of the material on the Website." Tier 1. | — |
| dbaion2.ru / .online, gamers4.life, aion2.app | terms (earlier) | Terms ban bots/automated collection (`2026-10-source-vetting.md` §1, §5.1). Not re-requested. | — |
| aion2.gaming.tools | access | robots.txt allows everyone, but the home page returned **403** with a Cloudflare challenge. Same as 2026-10-14. It's named as a game-database source in CLAUDE.md, but sessions can't read it: owner hand check only. | — |
| games.gg | access | robots.txt allows (`Content-Signal: ai-input=yes`), home page **403** challenge. Same as 2026-10-16. | https://games.gg/aion-2/guides/aion-2-assassin-build-guide/ |
| mobalytics.gg | access | robots.txt allows, home page **403** challenge. | https://mobalytics.gg/gamebase/guides/aion-2-sorcerer-hellfire-pve-build |
| eloboost24.eu | access | robots.txt allows, home page **403** challenge. | https://eloboost24.eu/blog/aion-2-assassin-build |
| icy-veins.com | access | robots.txt allows everyone (no AI agent named), but the home page returned **403** with a challenge, so the terms weren't read. Checked at the owner's request, 2:20 AM ET. Search found no AION 2 section on the site. | — |
| thegameswiki.com | access | robots.txt returned **429** "Vercel Security Checkpoint". Same as 2026-10-16. | — |
| timesaver.gg | access | TLS connection reset on robots.txt, twice. Not reached. | https://timesaver.gg/blog/aion-2-tier-list-best-class-october-2026 |
| aion2.th.gl, Game8 | rule | Never fetched (CLAUDE.md). | — |

## 4. Allowed domains to add (owner)

The ten "worth adding" sites from §1. `metabot.gg` and `aion2hub.com` are already on the list:

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
```

## 5. Owner decisions (none block the build dropdown)

1. **"Names Claude" reading.** This file treats a robots.txt that names Claude only to allow it (GamerBlurb, expcarry,
   aion2quest.pro, daevaguides.com) as not opting out. The specialty-picks research skipped GamerBlurb and expcarry
   under a stricter reading. If the stricter reading is wanted, aion2quest.pro and daevaguides.com drop out of §4,
   even though both explicitly allow Claude.
2. **Sites that block ClaudeBot but allow Claude-User** (metaroad.gg, keengamer.com; aionbuilds.com and aion2tierlist.com
   don't name Claude-User). ClaudeBot is Anthropic's training crawler, and Claude-User is the agent for user-directed
   fetches like ours. CLAUDE.md fails them today and so does this file. metaroad.gg has per-class build guides, so it is
   the one worth an owner decision.
3. **Monetization.** Metabot, GamerBlurb and Inven allow only personal or non-commercial use of their content. We take
   facts and link, which is how Metabot is used today. Whether that still holds once the app earns money is a question
   for the owner, not one this vetting can settle.

## 6. Next step (not done here)

Vetting covers checklist items 1 and 2 only. Before any site feeds the build dropdown, run items 3 to 8 (data origin,
game build shown, agreement test, update speed, rate limits, independence) on the guide pages themselves, with the
claims labels from `claims.json`.
