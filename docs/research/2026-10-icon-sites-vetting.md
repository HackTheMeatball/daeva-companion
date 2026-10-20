# Icon sites vetting (questlog.gg, 6sword.com, daevacompass.com; gamers4.life re-check), 2026-10-20

Owner's ask (Game Data Check thread, 2026-10-20 12:02 PM ET): could any of these sites supply the Chanter
"Recuperation" skill icon (Lv 8 active; in game, an open hand under light)? Game8 was not checked (CLAUDE.md: never
Game8). Source Vetting. Terms read first, then robots.txt; our User-Agent, one request at a time, at least 5 s apart;
nothing kept beyond what is listed here.

| Site | Terms (read first) | robots.txt | Verdict |
|---|---|---|---|
| questlog.gg | `/terms` answered with a Cloudflare "Just a moment..." challenge (403). Stopped there | Not read | Fail; owner browser only |
| 6sword.com | <https://6sword.com/terms> (in force 2026-04-13), 제7조 1-나: no automated collection or scraping of the service without 6Sword's prior written consent. Footer: no unauthorised copying; game data and image copyright belongs to NCSOFT | `User-Agent: *` / `Disallow: /` (only Googlebot, Daum, DuckDuckBot and a calendar importer allowed) | Fail |
| daevacompass.com | <https://daevacompass.com/terms> (French, updated 2026-08-23), "Utilisation acceptable": no disrupting the service, bypassing its protections or abusive automated requests. "Propriété intellectuelle": its own content and interface are protected; AION names, images and game elements belong to NCSOFT | `User-Agent: *`, `Allow: /`; disallows `/api/`, `/admin`, `/design-system`, `/login`, `/settings`, `/setup`, `/continue` | Pass (Full). Reached by Source Vetting's off-domain spot check; the owner added it to the network list at 12:27 PM ET |
| gamers4.life (re-check, owner's add-on 12:07 PM ET) | <https://gamers4.life/terms> ("Last updated: 2026-05-29", unchanged), §2: "personal, non-commercial use. Not allowed: … Using bots, scrapers, or automated tools" | Not re-read (terms fail) | Fail stays; owner browser only |

## The Recuperation icon (off-domain spot check)

- daevacompass.com: <https://daevacompass.com/en/db/abilities/18120000> (record ID 18120000, Recuperation) shows
  <https://daevacompass.com/images/skills/icon_ch_skill_013.webp>, 72×72: an open hand under a green
  light beam, which matches the owner's description. The server's response was 1,370 bytes, sha256
  `0467a008e8d9444662f1ec93fb3261022eb1d996f498252bd99dcd15294afb86` (hashed in this session's scratch copy).
  The shared folder re-encodes WebP files after they are written. A byte-exact copy hashed `0467a008…` and was
  later re-hashed as `babb0e10…` and `0544cf5a…` (7,138 bytes). Each re-encoding stays pixel-identical (maximum
  pixel difference 0 against the original), so compare pixels, not hashes, for files in `/mnt/project-files`. The
  original bytes are kept as base64 text, which the folder leaves alone, in
  `/mnt/project-files/icons-hq/dc_icon_ch_skill_013_recuperation.webp.b64` (`base64 -d` gives back `0467a008…`).
- Metabot's file for the same ID, <https://metabot.gg/web/aion2/skills/18120000.webp> (256×256), shows a green
  four-point star, not the hand. Metabot is not a match for this skill.
- Copies for review: `/mnt/project-files/icons-hq/dc_icon_ch_skill_013_recuperation.webp` and
  `mb_18120000_recuperation.webp`. daevacompass isn't an approved source, so the standing icon OK doesn't cover it:
  using it in the app needs the owner's OK.

Requests: daevacompass.com 6 (terms, robots.txt, sitemap, the Chanter class page, the ability page, the icon);
6sword.com 2 (terms, robots.txt); questlog.gg 1; gamers4.life 1 (terms); metabot.gg 2 (skill page, icon).

## Where the icons come from (inferred)

The owner reports that gamers4.life and questlog.gg show the same Recuperation art at 256 px. daevacompass names the
file `icon_ch_skill_013` (`ch` = Chanter), which looks like a client asset name rather than a site's own name, the same
way aion2quest.pro serves client names such as `UT_Marker_*`. Inferred: all three sites extract icons from the game
client, so the art is NCSOFT's and identical across them. The only difference is resolution. Not verified: no site
states its icon source. Metabot's 18120000.webp shows different art for the same skill ID, so a site's ID-to-icon
mapping can be wrong even when the art itself comes from the client. The owner's screen is the check.

The owner approved daevacompass.com as an icon source on 2026-10-20 at 12:46 PM ET (decision card in the Source
Vetting thread; `DEC-20261020-daevacompass-icon-source`).
