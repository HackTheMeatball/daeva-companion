# Templar research pack (0.8, `research-templar`)

Research, 19 Oct 2026 (fetched 6:20–6:30 AM ET). **Docs and research files only: no JSON under `data/packs/`, nothing
under `data/schema/` or `src/` was changed;** the only files under `data/packs/` are the 35 staged icon PNGs (§7), which
the generator does not read. The Release Planner asked for this pack as 0.8 class research. It gives the Templar what
the [Spiritmaster pack](2026-10-spiritmaster-pack.md) and the [Gladiator guide research](2026-10-gladiator-guide.md)
gave those classes, in one file: class data (§2), learn levels (§3), guide advice with second sources (§4), plus two
things those packs lacked: the owner's default key layout (§6) and every skill and stigma icon, saved (§7). Read the
[Gladiator pack](2026-10-gladiator-pack.md) §2 for column meanings and §4.1 for why the stigma max level doesn't matter
for a leveling guide.

CONFIRMED means read from a Metabot game-database field on this run (client build 0.0.4387.0), read from the owner's
in-game screen, or agreed by two independent sources. GUESS means my inference, for the guide item to accept or change.
Creator names in brackets are the ones a compiler site credits.

## 1. Summary

- **All class data is here, from Metabot, row by row with its page URL:** 22 skills, 13 stigmas, 112 specialization
  options and 537 board nodes. Every skill costs 1 / 2 / 4 points in the usual bands and every skill page's Daevanion
  list matches the boards page; the parser found no exceptions (CONFIRMED).
- **The boards are the Assassin grid again:** all 537 positions match the Assassin file by type, grade, cost and stat
  label, 0 differences by script (CONFIRMED). Only the 88 skill nodes (22 skills × 4) and `gameId` differ.
- **All 22 learn levels have three sources:** Metabot, the owner's Templar skill window (2026-10-18, the source of
  truth; it shows the lock level of every skill) and mmo-codex's unlock table (§3). No owner check is needed.
- **Same flat-gated late passives as the other classes:** Fury (21), Survival Willpower (23) and Block Pain (25). The
  other 19 are stepped (CONFIRMED).
- **Guide advice now has second sources** (mmo-codex, daevaguides, aion2turkiye, skycoach; §4). Seven skills to Lv 10
  and Ironclad Defense to 5 are two-source or better; Fury to 10 is two-source although Metabot's leveling build leaves
  it out. The stigma set (Taunt, Empyrean Lord's Punishment, Battlefield Banner, Doom Shield) is two-source; the slot
  order is disputed. Eight Lv 8 specialty picks are two-source.
- **Five skills only fire on a condition** (CONFIRMED, skill text plus two guides): Judgment needs a 2 s window that a
  shield skill opens, Annihilate needs a stunned or knocked-down target, Flash Rampage a staggered one, Debilitating
  Smash a Block, Shield Rush a Dodge or flight. Guide steps that say "press X" have to allow for this, as on the
  Spiritmaster (claim C74).
- **Metabot prints five "Absorbs N% HP" specialties wrong.** Its pages say "Absorbs 100, 100% HP" where the game says
  "Absorbs 1% HP" (owner screen for Vicious Strike; mmo-codex and daevaguides for the others; §5). This is Metabot's own
  page text, not our parser, which corrects the guess in the Gladiator guide research §11. Any class pack that copies
  specialty text from Metabot needs the same fix.
- **All 35 icons are saved** with provenance rows in `docs/ISSUES.md` (§7), so the Templar can ship with real icons,
  unlike the Gladiator and Spiritmaster in 0.7 (#441 item 4).

## 2. Files

Same columns as the Gladiator, Ranger and Spiritmaster CSVs. All rows carry `page_url`, `build`, `checkedAt`
2026-10-19 and `status`.

| File | Rows |
|---|---|
| [`templar-skills-metabot-2026-10.csv`](../../data/research/templar-skills-metabot-2026-10.csv) | 22 |
| [`templar-specialties-metabot-2026-10.csv`](../../data/research/templar-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`templar-stigmas-metabot-2026-10.csv`](../../data/research/templar-stigmas-metabot-2026-10.csv) | 13 |
| [`templar-board-nodes-metabot-2026-10.csv`](../../data/research/templar-board-nodes-metabot-2026-10.csv) | 537 |
| [`templar-builds-metabot-2026-10.csv`](../../data/research/templar-builds-metabot-2026-10.csv) | 36, all `single-source` (Metabot only; second sources are in §4) |
| [`templar-metabot-2026-10.requests.log`](../../data/research/templar-metabot-2026-10.requests.log) | 42 requests |
| [`templar-icons-metabot-2026-10.requests.log`](../../data/research/templar-icons-metabot-2026-10.requests.log) | 35 requests |
| [`templar-second-sources-2026-10.requests.log`](../../data/research/templar-second-sources-2026-10.requests.log) | 9 requests |

Script: `data/research/scripts-2026-10/templar_csvs.py` (the Spiritmaster script with the class swapped). Run it as
`templar_csvs.py <cache dir> <out dir> data/packs/aion2/classes/assassin/board-nodes.json`, after `gladiator_skills.py`
(skill pages → `skills.json`) and `extract.flight()` + `gladiator_boards.py` (boards page → `boards.json`), as for the
Spiritmaster. One change: a Metabot slug ending in `-templar` (a name another class also uses) now sets that row's
`notes` instead of a fixed list of names. Four rows have it: Defiance, Impact Hit, Survival Willpower and the stigma
Armor of Balance. The CSV ids drop the suffix (`skill:templar:defiance`); `page_url` keeps the real address. The builds
CSV is transcribed by hand from the three pages in its `page_url` column; its rotation row is our summary, not
Metabot's wording.

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Vicious Strike | active | 1 | stepped | 25 | Nezekan, Zikel, Vaizel, Triniel | 150 of 153 |
| Pummel | active | 1 | stepped | 25 | same | 145 of 153 |
| Poach | active | 1 | stepped | 25 | same | 150 of 153 |
| Shield Smite | active | 3 | stepped | 27 | same | 147 of 153 |
| Judgment | active | 4 | stepped | 28 | same | 150 of 153 |
| Flash Rampage | active | 5 | stepped | 29 | same | 134 of 153 |
| Debilitating Smash | active | 7 | stepped | 31 | same | 144 of 153 |
| Warding Strike | active | 8 | stepped | 32 | same | 150 of 153 |
| Shield Rush | active | 10 | stepped | 34 | same | 150 of 153 |
| Annihilate | active | 12 | stepped | 36 | same | 149 of 153 |
| Punishment | active | 14 | stepped | 38 | same | 150 of 153 |
| Defiance | active | 16 | stepped | 40 | same | not shown |
| Enhance Health | passive | 1 | stepped | 25 | Nezekan ×2, Vaizel, Triniel | 150 of 153 |
| Warding Shield | passive | 6 | stepped | 30 | Nezekan ×2, Vaizel, Triniel | 150 of 153 |
| Punishing Benediction | passive | 9 | stepped | 33 | Nezekan ×2, Vaizel, Triniel | 150 of 153 |
| Ironclad Defense | passive | 11 | stepped | 35 | Nezekan ×2, Vaizel, Triniel | 150 of 153 |
| Guarding Seal | passive | 13 | stepped | 37 | Nezekan ×2, Vaizel, Triniel | 150 of 153 |
| Impact Hit | passive | 15 | stepped | 39 | Zikel ×2, Vaizel, Triniel | 150 of 153 |
| Insulting Roar | passive | 17 | stepped | 41 | Zikel ×2, Vaizel, Triniel | 150 of 153 |
| Fury | passive | 21 | **flat** | 21 | Zikel ×2, Vaizel, Triniel | 150 of 153 |
| Survival Willpower | passive | 23 | **flat** | 23 | Zikel ×2, Vaizel, Triniel | 150 of 153 |
| Block Pain | passive | 25 | **flat** | 25 | Zikel ×2, Vaizel, Triniel | 150 of 153 |

Active nodes cost 3, passive nodes 2; every skill's max level is 40. Weapon: Longsword with a shield (Metabot class
page; the owner's screen shows "Weapon Condition: Longsword"). 203 skill points and 29 stigma points by Lv 45 (Metabot
build page; aion2turkiye gives the same two numbers). Specialization slots open at skill Lv 8, 12 and 20, with a fifth
option at 16 but no new slot (Metabot build page, daevaguides, skycoach, aion2turkiye agree).

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 points per level in bands of five for levels 1–20 and list specializations at
stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 25 (single source: stigma pages and class page agree; mmo-codex says
the fifth specialty at 25 comes from gear bonuses). Slots open at Lv 22 / 27 / 32 / 37 (Metabot build page; daevaguides
agrees). Top-player picks (of 153): Taunt 117, Empyrean Lord's Punishment 103, Battlefield Banner
100, Doom Shield 93, Shield of Protection 93, Noble Armor 56, Nezekan's Shield 37, Executing Blade 29, Second Skin 15,
Grapple 12, Assault Fury 3, Comrade in Arms 3; Armor of Balance shows none.

## 3. Learn levels: three sources, no owner check needed

| Source | What it shows |
|---|---|
| Metabot skill pages | all 22 (§2.1) |
| Owner's skill window, Lv 4 Templar, 2026-10-18 10:30 PM ET (`/mnt/project-files/owner-screens/2026-10-18/templar/`) | unlocked: Vicious Strike, Pummel, Poach, Shield Smite, Judgment, Enhance Health; locked skills carry their level: actives 5, 7, 8, 10, 12, 14, 16, passives 6, 9, 11, 13, 15, 17, 21, 23, 25. Game Data Check matched the unlocked icons against Metabot's files and the locked ones by level; the icons saved in §7 match the unlocked ones by eye |
| [mmo-codex class page](https://mmo-codex.com/games/aion-2/classes/templar/) | "What unlocks at each character level": the same 22 values |

**Verdict:** all 22 learn levels CONFIRMED, with the owner's screen as the source of truth. The stepped / flat gates
come from Metabot's level tables (a game-database field); mmo-codex states the same rule ("every level bought with
points also needs three more character levels"). Same caveat as the Ranger (#313): mmo-codex credits "the Aion 2
client via aion2.app", so it and Metabot may share upstream client data. The owner's screen does not.

## 4. Guide advice

### 4.1 Skill targets by Lv 45

| Skill | Metabot leveling | aion2turkiye leveling | daevaguides | mmo-codex leveling | Verdict |
|---|---|---|---|---|---|
| Judgment | 10 | 10 | core, 10 from points | first, to 8 then 10 | CONFIRMED 10 |
| Vicious Strike | 10 | 10 | 10 by Lv 25 | second, to 8 then 10 | CONFIRMED 10 |
| Pummel | 10 | 10 | 10 by Lv 25 | not listed while leveling ("leave Pummel off the stack, it eats mana") | CONFIRMED 10 |
| Punishment | 10 | 10 | 8 at 32, 10 at 38 [couga54] | after the first four | CONFIRMED 10 |
| Punishing Benediction | 10 | 10 | 10 | not stated | CONFIRMED 10 |
| Shield Smite | 10 | 8 | endgame 12–16 | third, to 10 | 10 (Metabot + mmo-codex); aion2turkiye 8 |
| Warding Strike | 10 | 8 | endgame 12–16 | fourth, to 10 | 10 (Metabot + mmo-codex); aion2turkiye 8 |
| Fury | **not listed** | 10 | 10 at Lv 21 [couga54] | passive no. 1 | two-source 10, **Metabot silent** |
| Ironclad Defense | 5 | 5 | 10 (endgame) | not stated | two-source 5 |
| Annihilate | 7 | not listed | endgame 16–20 | after the first four | disputed |
| Enhance Health | 10 | 8 | "as points allow" | not stated | disputed |
| Poach | 10 | 5 | endgame 8–12 | not stated | disputed |
| Insulting Roar | – | 5 | 10 | passive no. 2 | disputed |
| Flash Rampage, Shield Rush, Debilitating Smash | – | 8 each | low priority / 12 / 12 | not stated | single-source |
| Defiance | – | 5 | 1 ("1 point is enough") [couga54, trueeevil] | not stated | disputed |

Metabot's leveling build costs exactly 203 points (nine skills × 21, Annihilate to 7 = 9, Ironclad Defense to 5 = 5).
aion2turkiye budgets 224 ("quests and Sealed Dungeons give more").

**Default for the guide (GUESS):** the five CONFIRMED skills to 10 (105 points), Shield Smite and Warding Strike to 10
(42), Fury to 10 at Lv 21 (21; it is flat-gated, so all 21 points can go in on the day it is learned), Ironclad
Defense to 5 (5) = 173. That leaves 30 of the 203: Annihilate to 7 (9, Metabot), Enhance Health to 8 (13, the lower of
the two values) and Poach to 5 (5, the lower) = 200, 3 spare. Label Fury as two-source with a note that Metabot's build
leaves it out, and the last three as disputed.

### 4.2 Training order

Metabot gives targets only. Two sources give an order:

- **mmo-codex** (its own leveling scenario): Judgment → Vicious Strike → Shield Smite → Warding Strike, each to 8 (the
  first specialty) and then to 10; then Punishment and Annihilate.
- **daevaguides** [couga54, SolAshur]: Judgment, Pummel and Vicious Strike first; Punishment from about Lv 14 (8 at 32,
  10 at 38); Fury to 10 at 21; Vicious Strike and Pummel to 10 at 25.

Agreed by both: **Judgment is the first point sink, Vicious Strike is raised early, Punishment comes later.** Not
agreed: where Pummel, Shield Smite and Warding Strike sit. The guide's `skillOrderNotes` should say so.

### 4.3 Stigmas

| Slot | Metabot leveling, top players and class-builds guide | daevaguides [couga54] | aion2turkiye leveling | mmo-codex leveling keys |
|---|---|---|---|---|
| 1 (Lv 22) | Taunt | Doom Shield | Battlefield Banner | Taunt, Empyrean Lord's Punishment and Battlefield Banner on key 5, Doom Shield on E (no slot order) |
| 2 (Lv 27) | Empyrean Lord's Punishment | Battlefield Banner | Doom Shield | |
| 3 (Lv 32) | Battlefield Banner | Taunt for dungeons (solo: Executing Blade) | Empyrean Lord's Punishment | |
| 4 (Lv 37) | Doom Shield | Empyrean Lord's Punishment or Noble Armor | Noble Armor | |

**Verdict:** Battlefield Banner, Doom Shield and Empyrean Lord's Punishment are in every set (CONFIRMED). The fourth is
Taunt (Metabot, mmo-codex, daevaguides for dungeons) or Noble Armor (aion2turkiye, daevaguides' alternative): Taunt is
two-source. **The slot order is disputed**: no two sources give the same one. Metabot itself calls Taunt the dungeon
pick, and both other orders put Doom Shield or Battlefield Banner first. Default (GUESS): Metabot's set and order, with
`stigmaSlots` labelled `disputed` for the order. Stigma levels: Metabot leveling Taunt 8, Empyrean 7, Banner 5, Doom
Shield 4; aion2turkiye Banner 10, the rest 5; single-source each.

### 4.4 Specialty picks at skill Lv 8

| Skill | Pick (spec id) | Sources that take it | Dissent | Verdict |
|---|---|---|---|---|
| Vicious Strike | +20% MP restored (`:1`) | daevaguides ("everyone agrees: Templar runs short of mana while leveling"), aion2turkiye, mmo-codex (L8 pick) | – | CONFIRMED |
| Pummel | −20% MP consumed (`:1`) | daevaguides [couga54, from ~Lv 19], aion2turkiye, mmo-codex (L8 pick) | daevaguides [SolAshur]: `:3` for bosses | CONFIRMED |
| Judgment | Extra damage on hit (`:3`) | mmo-codex, aion2turkiye | skycoach names only the Lv 12 / 16 picks | CONFIRMED |
| Shield Smite | Removes MP cost, restores 200 MP (`:2`) | mmo-codex ("take specialty 2… your main source of mana"), daevaguides, aion2turkiye, skycoach | – | CONFIRMED |
| Warding Strike | −5 s cooldown (`:1`) | mmo-codex, aion2turkiye | – | CONFIRMED |
| Poach | Resets cooldown on defeating an enemy (`:3`) | daevaguides [couga54] "for leveling", aion2turkiye | mmo-codex L8 pick `:1` (bosses) | CONFIRMED for leveling |
| Annihilate | +100% damage vs Incapacitated Immunity (`:3`) | mmo-codex, daevaguides (bosses) | – | two-source, a boss pick |
| Punishment | Absorbs 10% HP (`:1`) | aion2turkiye, daevaguides [trueeevil, "at the start"] | mmo-codex `:3` (+30% Skill Speed) | two-source for leveling |
| Flash Rampage | – | aion2turkiye `:1`, mmo-codex `:2` | – | disputed |
| Shield Rush | – | aion2turkiye `:3`, mmo-codex `:2` | – | disputed |
| Debilitating Smash | +3 s Debilitate (`:2`) | aion2turkiye | – | single-source |

Lv 12 and 16 options need skill Lv 12+, which points alone don't reach before Lv 45 (max 10); they need Daevanion
nodes, so a leveling guide can leave them out, as the Ranger's did.

### 4.5 Stat priority and board path (single source)

Metabot's class page and class-builds guide (one site): **Block > Defense > HP > Critical Hit Resist > Attack**; board
path: Nezekan's Enhance Health, Ironclad Defense and Guarding Seal node pairs first, then Zikel's Fury and Insulting
Roar (Zikel opens at 20, Fury is learned at 21). The other sources rank post-45 gear or endgame passives (mmo-codex:
Fury ≫ Insulting Roar ≥ Impact Hit), a different question. Label both `single-source`.

### 4.6 Rotation (two-source)

Metabot, mmo-codex and daevaguides give the same leveling loop, in different words: pull with Poach (100% root on NPCs), Shield Smite
(100% stun on NPCs, opens Judgment for 2 s), Judgment in the window, Annihilate on the stunned target from Lv 12,
Punishment on the pull from Lv 14 (Executor: +20% PvE damage for 20 s), Warding Strike for a second window and a heal,
Vicious Strike as the filler that restores MP (Metabot leveling build, mmo-codex leveling scenario, daevaguides). The window rule is CONFIRMED by Metabot's skill text ("Triggers [Judgment] for 2s" on Shield Smite, Warding
Strike and Shield Rush). The Build drawer's Rotation section is written for the Assassin's keys (ISSUES.md, Spiritmaster
rotation), so whether the Templar shows one is the guide item's call; the data supports it.

## 5. Specialty texts that Metabot prints wrong

| Spec id | Metabot page | Game text | Game-text sources |
|---|---|---|---|
| `spec:templar:vicious-strike:2` | Absorbs 100, 100% HP | Absorbs 1% HP | owner's screen (2026-10-18), mmo-codex, daevaguides |
| `spec:templar:judgment:1` | Absorbs 100, 100% HP | Absorbs 1% HP | mmo-codex, daevaguides |
| `spec:templar:pummel:2` | [Punishing Strike] absorbs 300, 300% HP | [Punishing Strike] absorbs 3% HP | mmo-codex, daevaguides |
| `spec:templar:punishment:1` | Absorbs 1000, 1000% HP | Absorbs 10% HP | mmo-codex, daevaguides, aion2turkiye |
| `spec:templar:flash-rampage:1` | Absorbs 500, 500% HP | Absorbs 5% HP | daevaguides, aion2turkiye |

The raw page HTML has the wrong text (`<p class="…specText">Absorbs 100, 100% HP</p>`), so the error is Metabot's
template, not our parser. This corrects the inference in the Gladiator guide research §11 ("the P4 parser printed a
basis-point value", inferred). The CSV keeps Metabot's text as read; the class-data item writes the game text. The
owner's screen also confirms the other four Vicious Strike texts word for word.

**Disputed, not needed for leveling:** Metabot gives Pummel `:4` as "−1s [Punishment] cooldown on hit" and `:5` as
"[Punishing Strike] grants extra damage on hit"; mmo-codex and daevaguides give "…on landing [Punishing Strike]" and
"Activates [Punishing Strike] 1 extra time". mmo-codex says Korea changed Pummel's fifth specialty on 16 Sep, so one
side may be newer (inferred). Both need skill Lv 12+, so a leveling guide doesn't show them. If the class data must
carry them, the owner can read Pummel's list on any Templar (the window lists locked specialties, as the screen shows
for Vicious Strike).

## 6. Default keys (owner's screen)

From `/mnt/project-files/owner-screens/2026-10-18/templar/NOTES.md` (`owner:2026-10-18-templar-keys-01`, read by Game
Data Check). Row 0 fires first.

| Key | Skill(s) |
|---|---|
| Left click | Vicious Strike |
| Right click | Pummel (inferred: mouse badges follow the left-then-right order checked on Ranger and Gladiator) |
| 1 | Poach |
| 2 | Shield Smite |
| 3 | Warding Strike |
| 4 | Punishment |
| E | r0 Flash Rampage (5), r1 Debilitating Smash (7), r2 Judgment (4) |
| Q | r0 Shield Rush (10), r1 Annihilate (12) |
| none | Defiance (16); daevaguides says the game keeps it on Space |

This is the layout a new player has; mmo-codex and daevaguides recommend rearranging it (Judgment first on the right
mouse button, so a shield skill's window fires it), which is advice, not the default. The key grid needs no other data.

## 7. Icons

All 35 skill and stigma icons, from Metabot, under the standing icon OK (owner, 2026-10-14). I saved all 35 rather than
only the build plan's because the plan's picks are not settled (§4) and the key grid (0.6.2 P18) shows actives that no
build targets. Provenance rows (file, name, source page, file URL, date) are in `docs/ISSUES.md` under "Templar skill
and stigma icons".

- **Where:** `data/packs/aion2/asmodian/templar/icons/`, not wired into the app. `scripts/build.mjs` fails on any PNG
  in `src/assets/icons/` that `src/` does not reference, so the guide item moves the ones it shows there in the change
  that references them, as 0.6.1 F5 did for the Ranger. The generator only reads `.json` under `data/packs/`.
- **Format:** 256 px WebP → 128 × 128 RGB PNG (Lanczos), like the Assassin's and Ranger's.
- **Names:** `sk-templar-<slug>.png` and `st-templar-<slug>.png`. The class is in the name because `sk-impact-hit.png`
  (Assassin) already exists and three more names are shared with other classes (Defiance, Survival Willpower, Armor of
  Balance). Slugs match the CSV ids.
- **Match:** each skill page links exactly one file under `/web/aion2/skills/` (5 references, all the same id) and its
  `<title>` names the skill ("<Name> – Templar Skill | AION 2 | MetaBot.GG"), so the page-to-file match is read, not
  guessed. A contact sheet of all 35 was checked by eye: each is a distinct icon, none a placeholder, and the six the
  owner's screen shows unlocked match.
- **Uncertainty:** the file ids are what Metabot served on 2026-10-19. If Metabot reissues an icon the file URL may
  stop resolving; the page URL is the stable credit.

## 8. What depends on the owner

Nothing blocks the guide item. Optional: Pummel's specialty texts at 12 and 16 (§5), only if the class data must
carry them. No learn-level check (§3), no stigma check (Gladiator pack §4.1), no icon fallback (§7).

## 9. Fetching record

Policy: `CLAUDE.md` and `docs/research/SOURCES.md` (every host used is listed there; no new site, so SOURCES.md is
unchanged). User-Agent `DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`, one request at a time per host,
cache 24 h, stop on 403 / 429 / a challenge (none happened). No page copy or WebP is committed; only the CSVs and the
converted PNGs.

- **metabot.gg (Full):** robots.txt re-read first (6:20 AM ET; disallows only `/api/`, `/private/` and profile paths,
  nothing blocks Claude-User or our UA); terms of service re-read (effective 04/01/2026, unchanged: "personal,
  non-commercial use", attribution required for automated tools). One guessed terms URL returned 404. 77 requests in
  all (42 pages: robots, terms, class page, 35 skill pages, boards, build page, class-builds guide, plus the 404; 35
  icon files), 6:20–6:30 AM ET, at most 11 in any 60 s.
- **Second sources, 6:27–6:28 AM ET:** robots.txt re-read on mmo-codex (blocks only `/api/`), daevaguides (allows
  Claude-User explicitly), skycoach (`Crawl-delay: 1`, blocks only search, account and tracking paths) and aion2turkiye
  (allows all). mmo-codex is **Spot** (its terms ban "automated republication and scraped copies"; re-read, unchanged),
  so one content page. One page each on the other three. Facts only, no wording kept.

**How independent the second sources are (inferred, not proven):** mmo-codex reads client data through aion2.app,
second-hand client data, not a copy of Metabot. daevaguides compiles creators (couga54, SolAshur, trueeevil,
aLuckyRO; it also lists Game8, which we don't use), so it counts once, for the creators it names. skycoach is a
boosting shop's editorial guide and endgame-focused. aion2turkiye says its Lv 45 targets come from "the class's 25 most
developed players", a different sample from Metabot's 153.
