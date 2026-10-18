# Ranger research pack (0.6, replaces Gladiator)

Research, 18 Oct 2026 (fetched 2:10–2:14 AM ET). **Docs and research files only: no file under `data/packs/`,
`data/schema/` or `src/` was changed.** The owner picked Ranger over Gladiator as the next class in the research
thread at 1:41 AM ET ("let's do ranger/archer instead of gladiator"). This pack gives the Ranger the same input the
[Gladiator pack](2026-10-gladiator-pack.md) gave P4 and P5, with the same method, file layout and labels. Read that
file's §2 for column meanings and §4.1 for why the stigma max level doesn't matter for a leveling guide.

CONFIRMED means read from a Metabot game-database field on this run (rated B, client build 0.0.4387.0). GUESS means
inferred.

## 1. Summary

- **Everything a Ranger class pack needs is here, from Metabot, row by row with its page URL:** 22 skills, 13
  stigmas, 112 specialization options and 537 board nodes. As with Gladiator, every skill costs 1 / 2 / 4 points in
  the usual bands, and every skill page's Daevanion list matches the boards page; the parser found no exceptions
  (CONFIRMED).
- **The boards are again the Assassin grid.** All 537 positions have the same type, grade, cost and stat label as the
  Assassin file: 0 differences by script (CONFIRMED). Only the 88 skill nodes (8 with a same-named skill) and `gameId`
  (31xxxx–36xxxx) differ.
- **The same three late passives are flat-gated:** Melee Fire (21), Revitalization Contract (23) and Hunter's Soul
  (25). The other 19 are stepped (CONFIRMED). This matches Assassin and Gladiator: every passive learned at Lv 21 or
  later is flat on all three classes read.
- **Stigma max level 40** on all 13 Ranger stigma pages, the same as Assassin. Metabot's Ranger class page text says
  "level up to 25", so Metabot contradicts itself. The value stays `single-source`; it does not change a leveling guide
  (Gladiator pack §4.1).
- **The build advice is easier than Gladiator's.** Metabot's leveling build, its top-player picks and its class-builds
  guide all give the same four stigmas in the same order. That is still one source (one site), so P5 labels advice
  `single-source`, but there is no conflict to explain.
- **Two shared skill names with Assassin:** Defiance and Revitalization Contract. Their Metabot pages use `-ranger`
  slugs (`defiance-ranger`, `revitalization-contract-ranger`); the CSV ids drop the suffix (`skill:ranger:defiance`),
  and `page_url` keeps the real address.

## 2. Files

Same columns as the Gladiator CSVs.

| File | Rows |
|---|---|
| [`ranger-skills-metabot-2026-10.csv`](../../data/research/ranger-skills-metabot-2026-10.csv) | 22 |
| [`ranger-specialties-metabot-2026-10.csv`](../../data/research/ranger-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`ranger-stigmas-metabot-2026-10.csv`](../../data/research/ranger-stigmas-metabot-2026-10.csv) | 13 |
| [`ranger-board-nodes-metabot-2026-10.csv`](../../data/research/ranger-board-nodes-metabot-2026-10.csv) | 537 |
| [`ranger-builds-metabot-2026-10.csv`](../../data/research/ranger-builds-metabot-2026-10.csv) | 38, all `single-source` |
| [`ranger-metabot-2026-10.requests.log`](../../data/research/ranger-metabot-2026-10.requests.log) | 38 requests |

Script: `data/research/scripts-2026-10/ranger_csvs.py` (the Gladiator scripts with the class swapped).

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Snipe | active | 1 | stepped | 25 | Nezekan, Zikel, Vaizel, Triniel | 150 of 151 |
| Tempest Shot | active | 1 | stepped | 25 | same | 150 of 151 |
| Snare Shot | active | 1 | stepped | 25 | same | 145 of 151 |
| Marking Shot | active | 3 | stepped | 27 | same | 150 of 151 |
| Drill Dart | active | 4 | stepped | 28 | same | 150 of 151 |
| Arrow Scattershot | active | 5 | stepped | 29 | same | 113 of 151 |
| Gale Arrow | active | 7 | stepped | 31 | same | 150 of 151 |
| Explosion Trap | active | 8 | stepped | 32 | same | 142 of 151 |
| Burst Arrow | active | 10 | stepped | 34 | same | 149 of 151 |
| Suppressing Arrow | active | 12 | stepped | 36 | same | 125 of 151 |
| Deadshot | active | 14 | stepped | 38 | same | 150 of 151 |
| Defiance | active | 16 | stepped | 40 | same | not shown |
| Vigilant Eye | passive | 1 | stepped | 25 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Concentrated Fire | passive | 6 | stepped | 30 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Wind Vigor | passive | 9 | stepped | 33 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Focused Eye | passive | 11 | stepped | 35 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Hunter's Resolve | passive | 13 | stepped | 37 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Unyielding Resolve | passive | 15 | stepped | 39 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Rooting Eye | passive | 17 | stepped | 41 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Melee Fire | passive | 21 | **flat** | 21 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Revitalization Contract | passive | 23 | **flat** | 23 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Hunter's Soul | passive | 25 | **flat** | 25 | Zikel ×2, Vaizel, Triniel | 150 of 151 |

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 points per level in bands of five for levels 1–20 and list specializations
at stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 40 (single source; the class page says 25). Top-player picks (of
151): Vaizel's Authority 141, Bow of Blessing 131, Supporting Fire 113, Griffon Arrow 91, Explosive Arrow 56, Arrow
Storm 40, then six with 3 or fewer; Assault Smite and Ensnaring Trap show none.

## 3. Build advice for P5 (single source, one site)

| Field | Leveling 1–45 (editorial) | Endgame PvE (top players) | Class-builds guide |
|---|---|---|---|
| Slot 1 (Lv 22) | Vaizel's Authority | Vaizel's Authority 93% | Vaizel's Authority |
| Slot 2 (Lv 27) | Bow of Blessing | Bow of Blessing 87% | Bow of Blessing |
| Slot 3 (Lv 32) | Supporting Fire | Supporting Fire 75% | Supporting Fire |
| Slot 4 (Lv 37) | Griffon Arrow | Griffon Arrow 60% | Griffon Arrow |

Leveling build skills to Lv 10: Snipe, Tempest Shot, Marking Shot, Drill Dart, Gale Arrow, Burst Arrow, Deadshot;
passives Focused Eye, Hunter's Resolve. Snare Shot to 7, Concentrated Fire to 5. Stat order (class page, editorial):
Attack, Critical Hit, Accuracy Bonus, Evasion Bonus, HP. Board path (class page, editorial): Nezekan's Hunter's
Resolve and Focused Eye pairs, then Zikel's Rooting Eye and Hunter's Soul. Hunter's Soul is learned at Lv 25, after
Zikel opens at Lv 20, so plan it from 25.

**Default for P5 (GUESS, my pick):** the leveling build. Every advice claim is `single-source`; the skill list is
skill targets, not a training order. The rotation text on Metabot is its own wording, so P5 writes its own.

## 4. What depends on the owner

1. **D8: answered.** Ranger (owner, 1:41 AM ET 18 Oct). It needs recording in `docs/DECISIONS.md`; the pipeline does
   that.
2. **Three learn levels**, from a level 1 Ranger's Skills window (locked skills show their unlock level, as on the
   owner's Assassin at Lv 4). Suggested: **Marking Shot 3, Burst Arrow 10, Deadshot 14.**
3. No stigma check (Gladiator pack §4.1).

## 5. Fetching record

Same policy and User-Agent as the Gladiator run. robots.txt and the terms page were read at 11:13 PM ET on 17 Oct
(within the 24 h cache). **38 requests, all to metabot.gg, all 200**, 2:10–2:14 AM ET on 18 Oct, at least 5 s apart:
the class page, the build page, the Daevanion page and 35 skill pages. The class-builds guide row comes from the
cached Gladiator-run copy (no new request). Not touched: any other host.

## 6. Second sources for the three learn levels (owner input 5)

Run 18 Oct 2026, 2:38–2:43 AM ET, after the owner asked for the other allowed sites to be checked. Site rules for each
host are in [`2026-10-build-guide-sources.md`](2026-10-build-guide-sources.md) (#309); this run re-read robots.txt on
all 12 hosts (all allow AI readers) and mmo-codex's `/terms/` (bans scraping and republication only, so spot checks
are allowed). Facts only; no page copies kept.

| Skill | Metabot | [mmo-codex](https://mmo-codex.com/games/aion-2/classes/ranger/) | [daevaguides](https://daevaguides.com/en/ranger/) | [aion2-guides.info](https://aion2-guides.info/en/ranger/) |
|---|---|---|---|---|
| Marking Shot | 3 | 3 ("there from level 3") | not stated as a level | listed under "Lv 1" (GUESS: order met, not unlock level) |
| Burst Arrow | 10 | 10 | 10 | 10 |
| Deadshot | 14 | 14 ("unlocks only at character level 14") | 14 | 14 |

Also matching Metabot on these pages: Drill Dart 4, Gale Arrow 7, Explosion Trap 8, Defiance 16 (mmo-codex,
daevaguides), and Rooting Eye 17, Melee Fire 21, Revitalization Contract 23, Hunter's Soul 25 (mmo-codex).

**How independent these are (inferred, not proven):**

- mmo-codex says its numbers come from the game client "through aion2.app". aion2.app is a site we don't read by
  script (its terms ban bots), so this is client data at second hand, not a copy of Metabot.
- aion2-guides.info is a compilation of other creators' guides (#309), so it doesn't count as its own source.
- daevaguides doesn't say where its levels come from.

**Verdict:** Burst Arrow 10 and Deadshot 14 have Metabot plus mmo-codex and daevaguides: two-source, with the caveat
that they may share upstream data. Marking Shot 3 has Metabot plus mmo-codex only. The owner's Skills screenshot is
now optional; if it arrives, it replaces these as the second source.

Requests: [`ranger-second-sources-2026-10.requests.log`](../../data/research/ranger-second-sources-2026-10.requests.log),
45 requests, one at a time and at least 5 s apart per host (robots.txt, guessed `/terms` URLs that returned 404,
sitemaps, mmo-codex `/terms/`, and four Ranger pages). Nothing else on these hosts was read.
