# Allowed-domains audit, 2026-10-21 (Lydia)

Isaac asked for this (03:23Z, in Chuck's thread) to get cleaner data, better sources and fewer conflicts. This note is
the evidence for the SOURCES.md changes of 2026-10-21. Gretchen (Game Data Check) backed it up at 03:28Z (section below).

## How the numbers were made (read this before the table)

All counts come from `origin/main` on 2026-10-21, measured by script.
- **Data refs**: how many times the host's URLs appear in `data/packs/**` (not claims or sources).
- **Claims**: the verdicts of the claims (all 9 `claims.json` files) that list the host as a source.
- A "disputed" count does **not** mean the site was wrong. For builds it nearly always means guides disagree with
  each other: builds are opinion. Disputes come from having many build opinions, not from any one site.
- **Known errors** are cases in docs/ or data/ where the site was the source that turned out wrong.

## Grades

| Site | Data refs | Claims (verdicts) | Known errors | Grade | Proposal |
|---|---|---|---|---|---|
| metabot.gg | 6227 | 51 verified, 34 single, 20 disputed, 18 wrong | Template prints some specialty texts wrong (#358 pattern, 5+ per class); several icon files swapped (Chanter #486 §7, 18120000) | **A** | Keep as the main source. The owner's screen stays the check for specialty text and icons (as now). |
| daevacompass.com | 0 (16 icon rows in ISSUES) | none | One ID-to-icon mapping can be wrong (noted in its row) | **A−** | Keep: second database and icon source. |
| aion2.app | 0 | none | none | **B** | Keep as **Spot**, never the only source: an independent database witness. |
| daevaguides.com | 90 | 7 verified, 18 disputed | none | **B** | Keep as a build witness (named creators). |
| mmo-codex.com | 46 | 13 verified, 15 disputed | One superseded pre-launch quote, not used | **B** | Keep as **Spot** build witness. It also caught a template error. |
| aion2turkiye.com | 88 | 3 verified, 20 disputed | none | **B−** | Keep as a build witness (separate leveling, dungeon and PvP panels). It's the most frequent dissenting source, but on opinion, not facts. |
| aion2-meta.com | 7 | 1 verified, 1 disputed | none | **C** | Keep as the one KR preview, never proof of a global fact. |
| aion2quest.pro | 0 (icons used in 6 `src/` files) | none | none; its desktop app reads game traffic | **C** | Narrow it to the map-marker icons and crest already approved. No new facts. |
| aion2hub.com | 75 | 1 verified, 1 disputed | Stigma unlock Lv 23 wrong (owner: Lv 22); pre-launch snapshot (2026-09-19); terms field mismatch in sources.json | **D** | **Demote** to "existing citations only". No new use. Its 75 refs stay, as labelled. |
| skycoach.gg | 24 | 2 verified, 5 disputed, 1 wrong | Wings / flight-tutorial line wrong; a boosting shop | **D** | **Demote** to Passed: no new use. Its builds page is a paid service. |
| gamesfuze.com | 6 | 2 verified, 2 disputed, 1 single, 1 wrong | Picks aren't slot-ordered | **D** | **Demote** to Passed: no new use. |
| corpus.gg | 4 | 1 disputed | none; human-only read | **D** | **Demote** to Passed (low use, can't be read by a script). |
| aion2.inven.co.kr | 0 | none | — | **E** | **Cut**: unused, and its KR preview overlaps aion2-meta. |
| aion2-guides.info | 0 | none | — | **E** | **Cut**: an aggregator, not independent, unused. |
| aion2t.com | 0 | none | — | **E** | **Cut**: collected guides (aion2.app's sister site), unused. |
| aionbuilds.com | 0 | none | — | **E** | **Cut**: player-shared builds (noise), unused. |
| aion2maps.com | 0 | none | — | **E** | **Cut**: unused; its macro guides overlap daevaguides. |

daevacompanion.com and daevapath.com are our own sites and are out of scope.

## The rule change that cuts most of the noise

Cutting sites alone won't stop build disputes, because they come from comparing opinions. Proposal, with Gretchen's two
corrections (03:28Z):
- **Endgame picks:** Metabot's top-player pick rate plus **one** of the three build witnesses (daevaguides, mmo-codex,
  aion2turkiye). Other build sites are never cited for picks.
- **Leveling picks, Lv 1–45** (skill order, first stigmas, early Daevanion): pick rate doesn't measure these. They keep
  the current standard: two of the three witnesses, labelled "two sources, independence inferred".
- **Pick rate is not a game fact.** It never makes a pick "verified". A pick it supports is labelled "two sources". Each
  citation records the pick rate's date, region (Global or KR) and game build. A KR rate counts as disputed for Global
  by default (the Builds & Macros standard).
- **Key setups and macros** aren't picks. They stay with the three witnesses plus the owner's screens.
- Where the sources disagree, the pick is labelled "disputed" and nobody goes looking for a tie-break source.

## Backup (Gretchen, 2026-10-21 03:28Z, main e5d57c5)

- The grades are BACKED. No field in data/packs/** and no claim rests only on a demoted or cut host: each has a second
  source, the owner, or a label already.
- #685 (world bosses, written before this audit) adds 14 aion2hub refs, all next to Metabot. They are grandfathered in,
  and the 0.10 timer item removes them (Lydia's call: option a).

## Who decides

- Demotions, cuts and the build rule only tighten our use, so they come under Lydia's standing OK (ROL-04). Gretchen
  backs them up first, as asked.
- The environment's network list is set by Isaac. Taking the cut hosts off it is his change in the environment
  settings; nothing here does that.
- Existing data is not rewritten by this PR. Citations to demoted hosts stay as they are, and Gretchen's next pack
  re-check re-labels any that rested on them alone.

## Not covered

- Owner-browser-only sites (games.gg, mobalytics, keengamer, icy-veins, aion2.gaming.tools) and allthings.how (Spot)
  aren't on the allowed list. They are graded separately if Isaac wants them.
- Chuck owns our own robots.txt and terms (Isaac's first point).
