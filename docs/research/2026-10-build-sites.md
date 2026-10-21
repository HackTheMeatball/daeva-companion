# Most popular AION 2 build sites, 2026-10-21 (Lydia, with Gretchen)

Isaac asked for this (13:59Z, project chat): "Lydia can research the most popular build sites and resources with Gretchen".
It feeds the Builds & Macros role (top 3 builds per class) and Gretchen's Autopilot (pick rates, cooldowns).
**Method:** 10 web searches, then terms → robots.txt → one content page per new host, logged in
`/mnt/project-files/legal/fetch-log/lydia.md` (14:00–14:01Z lines). "Popular" means a site shows up repeatedly in searches for AION 2 builds or tier
lists. That's inferred: no traffic numbers were measured. Nothing was copied.

## Summary

| Site | Status for us | Pick rates | Cooldowns | Next |
|---|---|---|---|---|
| metabot.gg | Full (main source) | Yes: top-player class pages (`/classes/<class>/build`), leaderboards, armory | **Yes**: every skill page has the cooldown per skill level plus specialization changes (e.g. Rush Strike 20s, spec 4 −10s; read 2026-10-21) | Gretchen's Autopilot source for both |
| daevacompass.com | Full | No | Partly: ability pages show specialization cooldown changes (e.g. 18120000 "−3s cooldown"); base cooldown not seen in this read | Second witness for cooldown changes |
| **gamewith.ai** (new) | **Spot**, facts only (Legal ruling 2026-10-21: single facts with a link, never its tables, never the only source; ends if the project monetises) | **Yes**: `/aion2/en/build-stats/<region>/<class>`: per region (KR, TW, Global EU/NA/Asia/LA), top characters by combat power out of a stated sample (Assassin EU: 1,298 of 3,859 Lv 45); share per gear slot, skill levels, Daevanion, titles, pets and wings, stats; a "How this is collected" section | Not seen on build-stats | Row added; second pick-rate source (Global regions only) per Game Data Check |
| aion2.app | Spot, never the only source | Build simulator, not pick rates (search only) | Skill DB (not checked today) | No change |
| daevaguides / mmo-codex / aion2turkiye | The three build witnesses | No (opinion builds) | — | No change |
| mobalytics.gg | Owner browser only (403 challenge, 2026-10-18) | No: opinion guides (Gladiator, Cleric, Ranger, Sorcerer; updated 2026-10-10, search only) | — | **Owner upload** (To-do) |
| keengamer.com | Owner browser only (403 challenge) | No: one PvE build table for all 8 classes | — | **Owner upload** (To-do) |
| games.gg, icy-veins.com, aion2.gaming.tools | Owner browser only (403 challenge) | Not found in searches for build pages | — | Not needed now |
| maxroll.gg | Fail: robots.txt blocks Claude-User | No AION 2 build page found in search | — | — |
| **noping.com** (new) | **403 on our terms request** (2026-10-21): owner browser only | No: opinion blog (dated 2025-11, likely pre-Global) | — | Not worth an upload (stale) |
| **guildorder.com** (new) | **Not fetched further**: its Acceptable Use Policy bans "Using automated tools (bots) to interact with the Platform without authorization" | No: a planner (character, 5 boards, skill bar) | Not known | Legal: opt-out, never fetched (2026-10-21) |
| **neonsect.com** (new) | **Not fetched further**: the terms page didn't render to a script (JS app), so the terms are unread; the site is a boosting shop (Trenapiq LTD) | Search only: a top-30 by combat power armory read per class (2026-10-04, e.g. Assassin Illusive Clone and Swift Contract 28/30) | — | Owner browser check of its terms, or leave it out. A boosting shop is at most "No new use" under the audit |
| u4n.com | Spot (bans scraping), gold shop | Search only: a "top 40" Gladiator meta article (2026-10-10) | — | No new use. It's a shop, and the article is derived from an index |

## What this means

- **Pick rates:** Metabot, and from 2026-10-21 gamewith.ai build-stats (Global regions only), as the second
  pick-rate source. Game Data Check amended "Build sources" after Legal's ruling. A pick rate is still never "verified",
  an endgame pick still needs one witness, and two pick rates that disagree make it "disputed".
- **Cooldowns:** Metabot skill pages carry them per level, from game data. For a two-source fact, daevacompass shows
  the specialization changes, and thegameswiki (Fail for us: 429; CC BY-NC-SA, facts only) shows level-1 cooldowns.
  Base cooldown on daevacompass is unchecked.
- **Top 3 builds per class:** among the witnesses that cover all 8 classes, daevaguides and aion2turkiye are already allowed.
  The only popular site we can't read that covers all 8 classes is KeenGamer, so it's the first owner upload.
  Mobalytics covers 4 classes.

## Owner uploads (sent to Tracker Sync for an owner To-do)

1. KeenGamer, "AION 2 best PvE builds for every class":
   https://www.keengamer.com/articles/guides/aion-2-best-pve-builds-for-every-class/ (one page, all 8 classes).
2. Mobalytics build hub https://mobalytics.gg/gamebase/guides/aion-2-builds and each class build page it links
   (Gladiator, Cleric, Ranger and Sorcerer at least, plus any others it lists).

Screenshot or save as PDF, with the page date visible. Done when the files are in uploads and Gretchen has an entry.
