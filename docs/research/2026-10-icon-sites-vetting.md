# Icon sites vetting (questlog.gg, 6sword.com, daevacompass.com; gamers4.life re-check), 2026-10-20

Owner's ask (Game Data Check thread, 2026-10-20 12:02 PM ET): could any of these sites supply the Chanter
"Recuperation" skill icon (Lv 8 active; in game, an open hand under light)? Game8 was not checked (CLAUDE.md: never
Game8). Source Vetting. Terms read first, then robots.txt; our User-Agent, one request at a time, at least 5 s apart;
nothing kept beyond what is listed here.

| Site | Terms (read first) | robots.txt | Verdict |
|---|---|---|---|
| questlog.gg | `/terms` answered with a Cloudflare "Just a moment..." challenge (403). Stopped there | Not read | Fail; owner browser only |
| 6sword.com | <https://6sword.com/terms> (in force 2026-04-13), 제7조 1-나: no automated collection or scraping of the service without 6Sword's prior written consent. Footer: no unauthorised copying; game data and image copyright belongs to NCSOFT | `User-Agent: *` / `Disallow: /` (only Googlebot, Daum, DuckDuckBot and a calendar importer allowed) | Fail |
| daevacompass.com | <https://daevacompass.com/terms> (French, updated 2026-08-23), "Utilisation acceptable": no disrupting the service, bypassing its protections or abusive automated requests. "Propriété intellectuelle": its own content and interface are protected; AION names, images and game elements belong to NCSOFT | `User-Agent: *`, `Allow: /`; disallows `/api/`, `/admin`, `/design-system`, `/login`, `/settings`, `/setup`, `/continue` | Pass (Full, reuse unknown). Not on the network allowlist |
| gamers4.life (re-check, owner's add-on 12:07 PM ET) | <https://gamers4.life/terms> ("Last updated: 2026-05-29", unchanged), §2: "personal, non-commercial use. Not allowed: … Using bots, scrapers, or automated tools" | Not re-read (terms fail) | Fail stays; owner browser only |

## The Recuperation icon (off-domain spot check)

- daevacompass.com: <https://daevacompass.com/en/db/abilities/18120000> (record ID 18120000, Recuperation) shows
  <https://daevacompass.com/images/skills/icon_ch_skill_013.webp>, 72×72: an open hand under a green
  light beam, which matches the owner's description. The kept copy (WebP, 72×72) hashes to sha256
  `babb0e1085b8fd4239f93ba6da25edecc62bd320fa177ee7792cb0dd2d6bcfa1` (re-hashed by Game Data Check, 2026-10-20). An
  earlier note gave `0467a008…afb86`; it doesn't match the kept copy, so either the copy was re-encoded or that hash
  came from another file, and it can't be re-checked (daevacompass.com isn't on the allowlist). Treat the hash above
  as the kept copy's, not as proof of the original server response.
- Metabot's file for the same ID, <https://metabot.gg/web/aion2/skills/18120000.webp> (256×256), shows a green
  four-point star, not the hand. Metabot is not a match for this skill.
- Copies for review: `/mnt/project-files/icons-hq/dc_icon_ch_skill_013_recuperation.webp` and
  `mb_18120000_recuperation.webp`. daevacompass isn't an approved source, so the standing icon OK doesn't cover it:
  using it in the app needs the owner's OK.

Requests: daevacompass.com 6 (terms, robots.txt, sitemap, the Chanter class page, the ability page, the icon);
6sword.com 2 (terms, robots.txt); questlog.gg 1; gamers4.life 1 (terms); metabot.gg 2 (skill page, icon).
