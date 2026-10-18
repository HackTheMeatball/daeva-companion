# Gladiator research pack (0.6, `research-gladiator`)

Research, 18 Oct 2026 (fetched 11:13–11:19 PM ET on 17 Oct). **Docs and research files only: no file under
`data/packs/`, `data/schema/` or `src/` was changed.** This is the input ROADMAP 0.6 "Alongside" names for P4
(Gladiator class data) and P5 (Gladiator guide). Read [`2026-10-next-class.md`](2026-10-next-class.md) §2.3 for the
record shapes; this file gives the values.

CONFIRMED below means read from a Metabot game-database field on this run (rated B, client build 0.0.4387.0), which
CLAUDE.md accepts as verified. GUESS means inferred and labelled for P4/P5.

## 1. Summary

- **Everything P4 needs is here, from Metabot, row by row with its page URL.** 22 skills, 13 stigmas, 112
  specialization options and 537 board nodes, in five CSVs under `data/research/` (§2). The parser found no row that
  breaks the rules the app already uses: every skill costs 1 / 2 / 4 points in the usual bands, and every skill
  page's Daevanion list matches the boards page (CONFIRMED).
- **The Gladiator boards are the Assassin boards with different skills on the round nodes.** All 537 positions have the
  same type, grade, cost and stat label as `data/packs/aion2/classes/assassin/board-nodes.json`: 0 differences, checked
  by script (CONFIRMED). Only the 88 skill nodes (8 carry a skill with the same name) and `gameId` differ.
- **Three Gladiator passives use a flat level gate:** Experienced Counterstrike (21), Survival Willpower (23) and
  Murderous Burst (25). Every skill level 2–10 needs only the learn level. The other 19 skills are stepped (learn level
  + 3 per skill level). All 22 are read from the skill pages, so P4 needs no "inferred" gate (CONFIRMED).
- **Found an Assassin data bug on the way.** Assassin's Revitalization Contract is marked `stepped` (labelled
  inferred) in our data. Its Metabot page shows a **flat** gate at Lv 23 (CONFIRMED, one extra request). Stepped puts
  skill Lv 9 and 10 at character Lv 44 and 47, so the guide gates them too late or never. This is outside P4's files;
  §5 proposes a separate fix.
- **Stigma max level 25 now shows on all 13 Gladiator stigma pages and in the class page's stigma header.** That is
  still one source (Metabot), so `maxLevel` stays `single-source` until the owner's in-game check (§4).
- **The build advice has one voice.** Metabot's editorial "Leveling 1–45" build and its top-player pick rates disagree
  on stigma order (§3). Both are Metabot, so P5 has to label every advice field `single-source` unless the owner or a
  second source settles it.

## 2. Files

All rows carry `page_url`, `build` (0.0.4387.0), `checkedAt` 2026-10-18 and `status`.

| File | Rows | What P4 takes from it |
|---|---|---|
| [`gladiator-skills-metabot-2026-10.csv`](../../data/research/gladiator-skills-metabot-2026-10.csv) | 22 | `skills.json`: `id`, `key`, `name`, `type`, `learnLv`, `levelGate`, plus board nodes per skill and the level-10 gate as a check |
| [`gladiator-specialties-metabot-2026-10.csv`](../../data/research/gladiator-specialties-metabot-2026-10.csv) | 112 | `specialtyChoices[]` for 12 actives (5 each, skill Lv 8 / 8 / 8 / 12 / 16) and 13 stigmas (4 each, stigma Lv 5 / 10 / 15 / 20). Passives have none, as on Assassin |
| [`gladiator-stigmas-metabot-2026-10.csv`](../../data/research/gladiator-stigmas-metabot-2026-10.csv) | 13 | `stigmas.json`: all 13 (Assassin ships only the guide's 4; P4 picks how many), `availableLv` 22, `maxLevel` 25 (single source) |
| [`gladiator-board-nodes-metabot-2026-10.csv`](../../data/research/gladiator-board-nodes-metabot-2026-10.csv) | 537 | `board-nodes.json`: ready `id` / `key` in the §2.3 pattern, `board`, `row`, `col`, `type`, `grade`, `cost`, `label`, `skill` + `adds`, `gameId` |
| [`gladiator-builds-metabot-2026-10.csv`](../../data/research/gladiator-builds-metabot-2026-10.csv) | 37 | P5 only: advice rows (skill targets, stigma slots, stat order, board path), all `single-source` |
| [`gladiator-metabot-2026-10.requests.log`](../../data/research/gladiator-metabot-2026-10.requests.log) | 42 | Every request, time (UTC) and status |

Scripts that produced them: `data/research/scripts-2026-10/gladiator_{skills,boards,csvs}.py` (they read a scratchpad
cache that is not committed; no page copy is kept).

### 2.1 Skills (CONFIRMED, Metabot skill pages)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Keen Strike | active | 1 | stepped | 25 | Nezekan, Zikel, Vaizel, Triniel | 149 of 151 |
| Rending Blow | active | 1 | stepped | 25 | same | 149 of 151 |
| Leaping Slam | active | 1 | stepped | 25 | same | 149 of 151 |
| Mocking Blade | active | 3 | stepped | 27 | same | 145 of 151 |
| Overhead Slam | active | 4 | stepped | 28 | same | 149 of 151 |
| Sword Aura Rampage | active | 5 | stepped | 29 | same | 143 of 151 |
| Ankle Slice | active | 7 | stepped | 31 | same | 142 of 151 |
| Crushing Wave | active | 8 | stepped | 32 | same | 141 of 151 |
| Rush Strike | active | 10 | stepped | 34 | same | 149 of 151 |
| Aerial Snare | active | 12 | stepped | 36 | same | 134 of 151 |
| Ruinous Blow | active | 14 | stepped | 38 | same | 149 of 151 |
| Defiance | active | 16 | stepped | 40 | same | not shown |
| Survival Stance | passive | 1 | stepped | 25 | Nezekan ×2, Vaizel, Triniel | 149 of 151 |
| Protection Armor | passive | 6 | stepped | 30 | Nezekan ×2, Vaizel, Triniel | 149 of 151 |
| Blood Absorption | passive | 9 | stepped | 33 | Nezekan ×2, Vaizel, Triniel | 149 of 151 |
| Identify Weakness | passive | 11 | stepped | 35 | Nezekan ×2, Vaizel, Triniel | 149 of 151 |
| Attack Preparation | passive | 13 | stepped | 37 | Nezekan ×2, Vaizel, Triniel | 149 of 151 |
| Impact Hit | passive | 15 | stepped | 39 | Zikel ×2, Vaizel, Triniel | 149 of 151 |
| Destructive Impulse | passive | 17 | stepped | 41 | Zikel ×2, Vaizel, Triniel | 149 of 151 |
| Experienced Counterstrike | passive | 21 | **flat** | 21 | Zikel ×2, Vaizel, Triniel | 149 of 151 |
| Survival Willpower | passive | 23 | **flat** | 23 | Zikel ×2, Vaizel, Triniel | 149 of 151 |
| Murderous Burst | passive | 25 | **flat** | 25 | Zikel ×2, Vaizel, Triniel | 149 of 151 |

Active nodes cost 3, passive nodes 2. Every skill's max level is 40; skill points reach 10, the rest comes from nodes
and gear (as on Assassin). The learn levels equal the shared skeleton in next-class §2.2.

Four display names are shared with Assassin skills: Defiance, Impact Hit, Attack Preparation, Survival Willpower. The
skill pages for these are the Gladiator versions (the page's "Class" field reads Gladiator). Progress keys are
`sp:<name>:<L>`, which is fine while each character holds one class (next-class §2.3); P4 should keep `id`s
class-scoped (`skill:gladiator:defiance`) as the CSV does.

### 2.2 Stigmas (Metabot stigma pages)

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 stigma points per level in bands of five for levels 1–20 (CONFIRMED, same as
`ST_COST`), and list specializations at stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Levels 21–25 show no point cost on the
page. Max level 25 is **single source** (Metabot only; Assassin's is 40).

Top-player picks (of 151): Lunge Stance 138, Zikel's Blessing 137, Rage Burst 110, Focused Block 93, Lifestealing Blade
63, Wrath Wave 40, Tenaciousness 25, Blade Toss 16, Wave Armor 8, Forced Restraint 5, Assault Strike 1; Fracturing Rush
and Armor of Balance show none.

### 2.3 Boards (CONFIRMED, `daevanion/gladiator`)

| Board | Opens | Nodes | Points | Skill nodes |
|---|---|---|---|---|
| Nezekan | 12 | 89 | 134 | 22 |
| Zikel | 20 | 89 | 134 | 22 |
| Vaizel | 30 | 89 | 134 | 22 |
| Triniel | 40 | 117 | 168 | 22 |
| Azphel | 45 | 153 | 232 | 0 |

Counts by type: 418 stat, 88 skill, 26 unique, 5 start, the same as Assassin. `gameId`s are 11xxxx–16xxxx. The start
node of each board is the one with `auto` true on Metabot (type `start` in the CSV).

## 3. Build advice for P5 (single source)

Metabot has three Gladiator builds on [`classes/gladiator/build`](https://metabot.gg/en/aion-2/classes/gladiator/build),
an editorial row in the [class-builds guide](https://metabot.gg/en/aion-2/guides/class-builds-guide) and an editorial
stat order and board path on the [class page](https://metabot.gg/en/aion-2/classes/gladiator). These are all one
independence group, so none of them is a second source for another.

| Field | Leveling 1–45 (editorial) | Endgame PvE (top-player pick rates) |
|---|---|---|
| Stigma slot 1 (Lv 22) | Zikel's Blessing | Lunge Stance 91% |
| Slot 2 (Lv 27) | Lunge Stance | Zikel's Blessing 91% |
| Slot 3 (Lv 32) | Lifestealing Blade | Rage Burst 73% |
| Slot 4 (Lv 37) | Rage Burst | Focused Block 62% |
| Skills to Lv 10 | Keen Strike, Rending Blow, Leaping Slam, Overhead Slam, Rush Strike, Ruinous Blow; passives Survival Stance, Identify Weakness, Attack Preparation. Crushing Wave 7, Mocking Blade 5 | Core: Keen Strike, Ruinous Blow, Rending Blow, Leaping Slam, Rush Strike (99%) |

The class-builds guide agrees with the leveling build's stigma order. Stat order (class page, editorial): Attack,
Critical Hit, Accuracy Bonus, HP, Block. Board path (class page, editorial): Nezekan Attack Preparation and Survival
Stance pairs first, then Zikel's Murderous Burst pair, routing through Ruinous Blow and Rending Blow.

**Default for P5 (GUESS, my pick):** use the leveling build, since our guide is a leveling guide to Lv 45 and the
top-player rates describe max-level play. Label every advice claim `single-source` and mention that top players at 45
swap Lifestealing Blade for Focused Block. The leveling build lists skill targets, not a training order; P5 must not
present its listed order as a point-by-point order without a second source.

Two cautions for P5: Murderous Burst is learned at Lv 25, so its Zikel pair is not usable at Zikel's Lv 20 opening
(the board path implies it, so plan it from 25). And the page's rotation text is Metabot's wording: P5 writes its own.

## 4. What depends on the owner (`owner-check-gladiator`, not duplicated here)

Isaac's To-do covers "who levels which class" (D8) and a quick in-game check. This pack does not ask him anything;
it only narrows what the check needs to cover:

1. **D8 answer.** If he names a class other than Gladiator, P4 and P5 for Gladiator stop and this pack waits for 0.7;
   a new research pack for that class is about 40 requests (this run's size).
2. **Stigma max level** on any Gladiator stigma: 25 or 40? Decides `maxLevel` and whether the `single-source` label
   comes off.
3. **Three learn levels** in the Skills window, suggested: Mocking Blade 3, Rush Strike 10, Ruinous Blow 14.
4. **One flat gate (optional, cheap):** at Lv 21 or higher, is Experienced Counterstrike's skill Lv 3 open? (Yes =
   flat, as Metabot says.) The same check on Assassin's Revitalization Contract at Lv 23 settles §5.

## 5. Proposed follow-up outside this pack

**Assassin Revitalization Contract gate.** `data/packs/aion2/classes/assassin/skills.json` has `levelGate: "stepped"`
with `fieldStatus.levelGate: "inferred"`. [Metabot](https://metabot.gg/en/aion-2/skills/revitalization-contract) shows
character Lv 23 for skill levels 2–10 (flat), the same pattern as Assassin's Defense Break (21) and Determination (25)
and the Gladiator's three late passives. Every passive learned at Lv 21 or later is flat on both classes (CONFIRMED
for the five pages read). Proposed fix: set it to `flat`, cite that page, drop the `inferred` label; this changes which
steps the Assassin guide shows from Lv 23, so it needs golden updates and before / after shots. It is a separate item
for the pipeline, not part of P4 (P4 owns only Gladiator files).

## 6. Fetching record

Policy followed (CLAUDE.md "Fetching"): robots.txt and the terms page first, User-Agent
`DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`, one request at a time, at least 6 s apart (under 12 per
minute), stop on 403 / 429 / a challenge page. **42 requests, all to metabot.gg, all 200**, 11:13–11:19 PM ET on
17 Oct. Pages cached in the session scratchpad only.

- robots.txt still allows `/en/aion-2/` (disallows `/api/`, `/private/`, profile pages). Terms (re-read) still allow
  reuse with a dofollow link to the specific page, no implied endorsement, a reasonable request rate. The
  `src:metabot` entry in `data/packs/aion2/sources.json` matches.
- Pages: class page, build page, Daevanion page, class-builds guide, 35 Gladiator skill pages, 1 Assassin skill page
  (Revitalization Contract, for §5).
- Not touched: aion2.th.gl, Game8, thegameswiki, GamesFuze, aion2hub (its names-only coverage was recorded on 15 Oct in
  next-class §3.3 and adds nothing for numbers).
