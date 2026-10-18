# Spiritmaster research pack (0.7, `research-spiritmaster`)

Research, 18 Oct 2026 (fetched 7:17–7:24 AM ET). **Docs and research files only: no file under `data/packs/`,
`data/schema/` or `src/` was changed.** The Release Planner asked for this pack as a 0.7 research gate ("Research packs
for 0.7's two classes", ROADMAP 0.6 Alongside). It gives the Spiritmaster the same input the
[Ranger pack](2026-10-ranger-pack.md) gave P22, with the same method, file layout and labels. Read the
[Gladiator pack](2026-10-gladiator-pack.md) §2 for column meanings and §4.1 for why the stigma max level doesn't matter
for a leveling guide.

CONFIRMED means read from a Metabot game-database field on this run (rated B, client build 0.0.4387.0). GUESS means
inferred.

## 1. Summary

- **Everything a Spiritmaster class pack needs is here, from Metabot, row by row with its page URL:** 22 skills, 13
  stigmas, 112 specialization options and 537 board nodes. As on the three classes read before, every skill costs
  1 / 2 / 4 points in the usual bands, and every skill page's Daevanion list matches the boards page; the parser found
  no exceptions (CONFIRMED).
- **The boards are again the Assassin grid.** All 537 positions have the same type, grade, cost and stat label as the
  Assassin file, compared by board, row and column: 0 differences by script (CONFIRMED). Only the 88 skill nodes
  (8 with a same-named skill) and `gameId` (51xxxx–56xxxx) differ. The comparison now runs inside the script and writes
  each row's `notes`, instead of a fixed note (§2).
- **The same three late passives are flat-gated:** Spirit Communion (21), Revitalization Contract (23) and Element
  Unification (25). The other 19 are stepped (CONFIRMED). Every passive learned at Lv 21 or later is now flat on all
  four classes read.
- **The learn levels are the shared skeleton** (actives 1, 1, 1, 3, 4, 5, 7, 8, 10, 12, 14, 16; passives 1, 6, 9, 11,
  13, 15, 17, 21, 23, 25). All 22 also match mmo-codex's level-by-level unlock table (§6).
- **Stigma max level 25** on all 13 stigma pages, and the class page agrees ("level up to 25"), unlike Ranger, where
  the two disagreed. Still one site, so `maxLevel` stays `single-source`; it does not change a leveling guide.
- **The build advice agrees with itself, as on Ranger.** Metabot's leveling build, its top-player picks and its
  class-builds guide give the same four stigmas in the same order: Summon: Ancient Spirit, Enhance: Spirit's
  Benediction, Jointstrike: Corrode, Flame Blessing. That is one site, so advice stays `single-source`.
- **Two shared skill names with Assassin:** Defiance and Revitalization Contract (the same two as Ranger). Their pages
  use `-spiritmaster` slugs; the CSV ids drop the suffix (`skill:spiritmaster:defiance`), and `page_url` keeps the real
  address.
- **New for a guide: three skills don't fire on demand** (CONFIRMED, skill text): Dimensional Control "is triggered
  briefly each time a Spirit uses its skill", Rapid Scattershot only hits a target in Stagger, and Elemental Fusion
  needs four element stacks from spirit skills. A new summon replaces the spirit on the field. Guide steps that say
  "press X" need to account for this; the class page and mmo-codex both describe it.

## 2. Files

Same columns as the Gladiator and Ranger CSVs.

| File | Rows |
|---|---|
| [`spiritmaster-skills-metabot-2026-10.csv`](../../data/research/spiritmaster-skills-metabot-2026-10.csv) | 22 |
| [`spiritmaster-specialties-metabot-2026-10.csv`](../../data/research/spiritmaster-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`spiritmaster-stigmas-metabot-2026-10.csv`](../../data/research/spiritmaster-stigmas-metabot-2026-10.csv) | 13 |
| [`spiritmaster-board-nodes-metabot-2026-10.csv`](../../data/research/spiritmaster-board-nodes-metabot-2026-10.csv) | 537 |
| [`spiritmaster-builds-metabot-2026-10.csv`](../../data/research/spiritmaster-builds-metabot-2026-10.csv) | 36, all `single-source` |
| [`spiritmaster-metabot-2026-10.requests.log`](../../data/research/spiritmaster-metabot-2026-10.requests.log) | 40 requests |

Script: `data/research/scripts-2026-10/spiritmaster_csvs.py` (the Ranger script with the class swapped). Run it as
`spiritmaster_csvs.py <cache dir> <out dir> data/packs/aion2/classes/assassin/board-nodes.json`. Unlike the Ranger
script, it compares each node with the Assassin node at the same board, row and column and writes `DIFFERS from the
Assassin node` into `notes` if any field differs (it compares by position because 24 Assassin skill nodes keep legacy
short keys such as `dv:hg`). The input `skills.json` and `boards.json` come from `gladiator_skills.py` and
`gladiator_boards.py` as before; the boards page now arrives as an escaped Next.js payload, so it goes through
`extract.flight()` first. The builds CSV is transcribed by hand from the three pages in its `page_url` column.

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Cold Shock | active | 1 | stepped | 25 | Nezekan, Zikel, Vaizel, Triniel | 150 of 151 |
| Combustion | active | 1 | stepped | 25 | same | 149 of 151 |
| Summon: Fire Spirit | active | 1 | stepped | 25 | same | 150 of 151 |
| Summon: Water Spirit | active | 3 | stepped | 27 | same | 148 of 151 |
| Jointstrike: Curse | active | 4 | stepped | 28 | same | 150 of 151 |
| Rapid Scattershot | active | 5 | stepped | 29 | same | 135 of 151 |
| Summon: Earth Spirit | active | 7 | stepped | 31 | same | 145 of 151 |
| Dimensional Control | active | 8 | stepped | 32 | same | 150 of 151 |
| Summon: Wind Spirit | active | 10 | stepped | 34 | same | 126 of 151 |
| Soul's Cry | active | 12 | stepped | 36 | same | 128 of 151 |
| Elemental Fusion | active | 14 | stepped | 38 | same | 150 of 151 |
| Defiance | active | 16 | stepped | 40 | same | not shown |
| Spirit Strike | passive | 1 | stepped | 25 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Spirit Protection | passive | 6 | stepped | 30 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Spirit's Descent | passive | 9 | stepped | 33 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Corrode | passive | 11 | stepped | 35 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Spirit Revitalization | passive | 13 | stepped | 37 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Mental Focus | passive | 15 | stepped | 39 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Consecutive Countercurrent | passive | 17 | stepped | 41 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Spirit Communion | passive | 21 | **flat** | 21 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Revitalization Contract | passive | 23 | **flat** | 23 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Element Unification | passive | 25 | **flat** | 25 | Zikel ×2, Vaizel, Triniel | 150 of 151 |

Active nodes cost 3, passive nodes 2. Every skill's max level is 40. The class page's own active-skill table gives the
same 12 unlock levels as the skill pages (same site, so a consistency check, not a second source).

Skill names with a colon (`Summon: Fire Spirit`, `Jointstrike: Curse`) slug to `summon-fire-spirit`,
`jointstrike-curse`, which is also Metabot's URL slug; no id needed a special case besides the two `-spiritmaster`
suffixes.

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 points per level in bands of five for levels 1–20 and list specializations
at stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 25 (single source; stigma pages and class page agree). Top-player
picks (of 151): Summon: Ancient Spirit 145, Enhance: Spirit's Benediction 144, Jointstrike: Corrode 126, Flame
Blessing 112, Jointstrike: Destructive Attack 45, Siphon 21, Command: Proxy 7, then four with 3 or fewer; Assault
Terror and Cursed Cloud show none.

## 3. Build advice (single source, one site)

| Field | Leveling 1–45 (editorial) | Endgame PvE (top players) | Class-builds guide |
|---|---|---|---|
| Slot 1 (Lv 22) | Summon: Ancient Spirit | Summon: Ancient Spirit 96% | Summon: Ancient Spirit |
| Slot 2 (Lv 27) | Enhance: Spirit's Benediction | Enhance: Spirit's Benediction 95% | Enhance: Spirit's Benediction |
| Slot 3 (Lv 32) | Jointstrike: Corrode | Jointstrike: Corrode 83% | Jointstrike: Corrode |
| Slot 4 (Lv 37) | Flame Blessing | Flame Blessing 74% | Flame Blessing |

Leveling build skills to Lv 10: Cold Shock, Combustion, Summon: Fire Spirit, Summon: Water Spirit, Jointstrike: Curse,
Dimensional Control, Elemental Fusion; passives Spirit Strike, Corrode. Summon: Earth Spirit to 7, Spirit's Descent to
5. Stat order (class page, editorial; the class-builds guide gives the same five): Attack, Critical Hit, Accuracy
Bonus, HP, MP. Board path (class page and class-builds guide, editorial): Nezekan's Spirit Strike node pair, then
Zikel's Consecutive Countercurrent and Element Unification. Element Unification is learned at Lv 25, after Zikel opens
at Lv 20, so plan it from 25. The PvP build swaps slot 4 to Cry of Terror (not in the CSV; outside a leveling guide).

**Default for the guide item (GUESS, my pick):** the leveling build. Every advice claim is `single-source`; the skill
list is skill targets, not a training order. The rotation text on Metabot is its own wording, so the guide writes its
own.

## 4. What depends on the owner

1. **Which two classes 0.7 ships** (owner input 5 / audit 1). This pack assumes Spiritmaster is one; if Walter or the
   owner picks another, the same method applies.
2. **No learn-level check needed.** On Ranger the owner was asked for three learn levels from the Skills window. Here
   all 22 learn levels have Metabot plus mmo-codex's unlock table (§6), so the screenshot is optional. If the owner
   wants a spot check anyway, the three to look at on a level 1 Spiritmaster are **Summon: Water Spirit 3, Summon: Wind
   Spirit 10, Elemental Fusion 14**.
3. No stigma check (Gladiator pack §4.1).

## 5. Fetching record

Policy and User-Agent as in the Gladiator run (`DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`), one
request at a time, at least 5 s apart, cache 24 h, stop on 403 / 429 / a challenge. metabot.gg robots.txt re-read at
7:17 AM ET (allows everything except `/api/`, `/private/` and profile pages); its terms were read for SOURCES.md on 18 Oct
(within 24 h). **40 requests, all to metabot.gg, all 200**, 7:17–7:22 AM ET on 18 Oct: robots.txt, the class page, the
build page, the Daevanion page, the class-builds guide and 35 skill pages. No page copy is committed.

## 6. Second sources for learn levels

Run 18 Oct 2026, 7:23–7:24 AM ET, under the SOURCES.md rows for each host. robots.txt re-read on both hosts (mmo-codex
blocks only `/api/`; daevaguides allows Claude-User explicitly). mmo-codex is a **Spot** site (its terms ban scraping
and republication), so one page only. Facts only; no page copies kept.

| What | Metabot | [mmo-codex](https://mmo-codex.com/games/aion-2/classes/spiritmaster/) | [daevaguides](https://daevaguides.com/en/elementalist/) |
|---|---|---|---|
| All 22 learn levels | §2.1 | same 22 values ("What unlocks at each character level" table) | not stated as unlock levels |
| Summon: Water Spirit 3 | 3 | 3 ("from level 3") | consistent: "8 from character level 21", "10 from 27" |
| Jointstrike: Curse 4 | 4 | 4 | consistent: "8 from character level 22" |
| Rapid Scattershot 5 | 5 | 5 | consistent: "8 from 23" |
| Elemental Fusion 14 | 14 | 14 ("learned at 14, reaches skill level 8 only at character level 32") | not stated |
| Stepped gate (+3 per skill level) | read per skill | stated ("three more character levels") | stated ("+1 level every 3 character levels") |
| Elemental Fusion specialization 5 | skill Lv 16, "25% chance to regain Four Elements" | same | not checked |

daevaguides files the class under `/en/elementalist/` ("Elementalist is its internal name in the game data"). Its
"consistent" rows are learn levels worked back from "skill level 8 from character level X" (X − 18), so they are
GUESS-grade support, not stated values.

**How independent these are (inferred, not proven):**

- mmo-codex says its numbers come from the game client through aion2.app (a site we don't read by script). That is
  client data at second hand, not a copy of Metabot, so it counts as the second source for all 22 learn levels.
- daevaguides says it is "collected from several guides and videos" (and cites Game8, which we don't use), so it
  doesn't count as its own source.

**Verdict:** all 22 learn levels and the stepped / flat gates are two-source (Metabot + mmo-codex). The owner's Skills
screenshot is optional.

**One disagreement, for Game Data Check, not acted on:** mmo-codex quotes a creator's pre-launch global test (18 Sep)
saying stigma slots open "at levels 22, 27 and ≈36, the fourth later". Metabot's build page and class-builds guide say
22 / 27 / 32 / 37, which our Assassin data already holds as verified ([classes-and-gaps](2026-10-classes-and-gaps.md) §2.2, grade A). The "≈" and the
test date suggest an estimate from before launch; no change proposed.

Requests: [`spiritmaster-second-sources-2026-10.requests.log`](../../data/research/spiritmaster-second-sources-2026-10.requests.log),
6 requests: two robots.txt files, the mmo-codex Spiritmaster page, a guessed daevaguides `/en/spiritmaster/` (404),
the daevaguides sitemap to find the right page, and the daevaguides Elementalist page. Nothing else on these hosts was
read.
