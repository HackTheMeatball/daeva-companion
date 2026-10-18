# Ranger skill and stigma icons (gate `research-ranger-icons`, 0.6.1 F5)

**Result.** All 15 icons the Ranger guide plans for (11 skills, 4 stigmas, docs/ISSUES.md) were found on Metabot and
fetched on 2026-10-18 between 7:17 and 7:21 AM ET. **No icon is missing an approved source.**

The files are staged in `data/packs/aion2/asmodian/ranger/icons/`, named and sized like the Assassin's
(`sk-<slug>.png` for skills, `st-<slug>.png` for stigmas, 128 x 128 RGB PNG from Metabot's 256 px WebP, Lanczos).
They are **not wired into the app**: `scripts/build.mjs` fails on any PNG in `src/assets/icons/` that `src/` does not
reference, so F5 moves them there in the same change that references them (and adds their `/_blob/` ids, or leaves
them as quoted strings so `dist-artifact` shows the initials square, per DECISIONS D4). The generator only reads
`.json` under `data/packs/`, so the PNGs there change nothing in the build. Slugs match the record ids in
`data/research/ranger-*-metabot-2026-10.csv` (`skill:ranger:<slug>`, `stigma:ranger:<slug>`).

## Provenance

| File | Name | Source page | File URL | Retrieved |
|---|---|---|---|---|
| sk-snipe.png | Snipe | <https://metabot.gg/en/aion-2/skills/snipe> | <https://metabot.gg/web/aion2/skills/14020000.webp> | 2026-10-18 |
| sk-tempest-shot.png | Tempest Shot | <https://metabot.gg/en/aion-2/skills/tempest-shot> | <https://metabot.gg/web/aion2/skills/14340000.webp> | 2026-10-18 |
| sk-marking-shot.png | Marking Shot | <https://metabot.gg/en/aion-2/skills/marking-shot> | <https://metabot.gg/web/aion2/skills/14090000.webp> | 2026-10-18 |
| sk-drill-dart.png | Drill Dart | <https://metabot.gg/en/aion-2/skills/drill-dart> | <https://metabot.gg/web/aion2/skills/14050000.webp> | 2026-10-18 |
| sk-gale-arrow.png | Gale Arrow | <https://metabot.gg/en/aion-2/skills/gale-arrow> | <https://metabot.gg/web/aion2/skills/14110000.webp> | 2026-10-18 |
| sk-burst-arrow.png | Burst Arrow | <https://metabot.gg/en/aion-2/skills/burst-arrow> | <https://metabot.gg/web/aion2/skills/14080000.webp> | 2026-10-18 |
| sk-deadshot.png | Deadshot | <https://metabot.gg/en/aion-2/skills/deadshot> | <https://metabot.gg/web/aion2/skills/14010000.webp> | 2026-10-18 |
| sk-focused-eye.png | Focused Eye | <https://metabot.gg/en/aion-2/skills/focused-eye> | <https://metabot.gg/web/aion2/skills/14740000.webp> | 2026-10-18 |
| sk-hunters-resolve.png | Hunter's Resolve | <https://metabot.gg/en/aion-2/skills/hunters-resolve> | <https://metabot.gg/web/aion2/skills/14750000.webp> | 2026-10-18 |
| sk-snare-shot.png | Snare Shot | <https://metabot.gg/en/aion-2/skills/snare-shot> | <https://metabot.gg/web/aion2/skills/14130000.webp> | 2026-10-18 |
| sk-concentrated-fire.png | Concentrated Fire | <https://metabot.gg/en/aion-2/skills/concentrated-fire> | <https://metabot.gg/web/aion2/skills/14720000.webp> | 2026-10-18 |
| st-vaizels-authority.png | Vaizel's Authority | <https://metabot.gg/en/aion-2/skills/vaizels-authority> | <https://metabot.gg/web/aion2/skills/14310000.webp> | 2026-10-18 |
| st-bow-of-blessing.png | Bow of Blessing | <https://metabot.gg/en/aion-2/skills/bow-of-blessing> | <https://metabot.gg/web/aion2/skills/14220000.webp> | 2026-10-18 |
| st-supporting-fire.png | Supporting Fire | <https://metabot.gg/en/aion-2/skills/supporting-fire> | <https://metabot.gg/web/aion2/skills/14380000.webp> | 2026-10-18 |
| st-griffon-arrow.png | Griffon Arrow | <https://metabot.gg/en/aion-2/skills/griffon-arrow> | <https://metabot.gg/web/aion2/skills/14060000.webp> | 2026-10-18 |

Each page links exactly one file under `/web/aion2/skills/` (5 references, all the same id), and each page's
`<title>` names the skill ("<Name> – Ranger Skill | AION 2 | MetaBot.GG"), so the page-to-file match is read from the
page, not guessed. A contact sheet of the 15 files was checked by eye: each is a distinct skill icon, none is a
placeholder.

## Method

- **Rules:** docs/research/SOURCES.md row `metabot.gg` (Full; not `/api/` or profile pages) and the owner's standing
  icon OK (CLAUDE.md, 2026-10-14).
- **robots.txt** re-read first (7:17 AM ET): `User-Agent: *`, `Allow: /`, disallows only `/api/`, `/private/` and
  profile paths. Nothing blocks Claude-User or our User-Agent. **Terms of Service** re-read (7:17 AM ET): effective date
  04/01/2026, unchanged; "personal, non-commercial use", and the "Data Usage & Attribution (AI Agents & Automated
  Tools)" section requires credit to MetaBot.GG. F5 credits each icon with a plain link to its page, like the Assassin's.
- **Requests:** 32 in total (robots, terms, 15 skill pages, 15 image files), User-Agent
  `DaevaCompanionResearch/0.1 (+https://daevacompanion.com; research probe)`, one at a time, at least 6 s apart
  (under 12/min), every one 200, no challenge. Log: `data/research/ranger-icons-metabot-2026-10.requests.log` (UTC).
  No page or WebP is kept; only the converted PNGs are committed.

## For F5

- Move the 15 PNGs to `src/assets/icons/` and reference them from the Ranger skill / stigma records. The provenance
  rows are already in docs/ISSUES.md (Ranger bullet); F5 only updates that bullet's status line.
- Uncertainty: the WebP sizes and file ids are what Metabot served on 2026-10-18 (game build 0.0.4387.0 per the
  Ranger CSVs). If Metabot reissues an icon, the file URL here may stop resolving; the page URL is the stable credit.
