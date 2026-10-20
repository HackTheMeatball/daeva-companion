# Chanter research pack (0.8 class research)

Research, 19 Oct 2026 (fetched 8:33–8:43 PM ET). **Docs, research files and staged icons only: no JSON under
`data/packs/`, nothing under `data/schema/` or `src/` was changed;** the only files under `data/packs/` are the 32
staged icon PNGs (§7), which the generator does not read. The Release Planner asked for this pack as 0.8 class
research. Same shape as the [Templar pack](2026-10-templar-pack.md): class data (§2), learn levels (§3), guide advice
with second sources (§4), Metabot text fixes (§5), the owner's default keys (§6) and the icons (§7). Read the
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
- **Learn levels are the shared skeleton** (actives 1, 1, 1, 3, 4, 5, 7, 8, 10, 12, 14, 16; passives 1, 6, 9, 11, 13,
  15, 17, 21, 23, 25). All 22 agree between Metabot and mmo-codex's unlock table; the owner's Lv 4 Chanter screen
  shows the same lock level on every one of the 22 (§3). No learn-level check is needed. Same three flat-gated late
  passives as every class: Earth's Promise (21), Survival Willpower (23), Wind's Promise (25).
- **Guide advice has three second sources** (mmo-codex, daevaguides, aion2turkiye; §4). Seven skills to Lv 10 are
  CONFIRMED (Onslaught, Dark Crush, Spinning Strike, Recuperation, Incandescent Blow, Rushing Smash, Attack
  Preparation); Wind's Promise to 10 is two-source though Metabot's leveling build leaves it out. The four stigmas
  (Undefeated Mantra, Sprint Mantra, Power of the Storm, Marchutan's Wrath) are in every source and Undefeated Mantra
  first is CONFIRMED; **the order of slots 2–4 is disputed** (two sources each way). Seven Lv 8 specialty picks are
  two-source or better.
- **Metabot's community-builds list for the Chanter is empty** ("No one has published a Chanter build yet"), unlike
  some other classes. Its editorial leveling build and its top-player aggregate exist and are used here, but each is
  one site: everything that rests on Metabot alone is labelled `single-source` (§4).
- **Four skills only fire on a condition** (CONFIRMED, skill text plus two guides): Dark Crush only inside a window
  that Impactful Crush or Spinning Strike opens for 2 s (Marchutan's Wrath and Ensnaring Mark for 3 s), Wave Blow
  only on a stunned target, Gust Rampage only on a staggered one, Tremor Crush only after a Dodge or in flight. Guide
  steps that say "press X" have to allow for this, as on the Spiritmaster (claim C74) and Templar.
- **Metabot prints five specialty texts wrong (the #358 pattern)**, plus two base texts (§5). Onslaught's specialty 2
  reads "Absorbs 70, 70% HP" where the game says "Absorbs 0.7% HP" (owner's screen). Blessing of Life's Heal Boost
  number is wrong in every client-derived source and has no game reading yet.
- **Icons: 32 of 35 saved, but the owner's screen shows that Metabot's icon files are wrong for five passives and one
  active** (§7). Earth's Promise and Wind's Promise are swapped, Metabot's Blessing of Life art is the game's
  Protection Circle, and Recuperation and Blessing of Life show art Metabot doesn't have. Metabot has no icon at all
  for Survival Willpower. Staged files follow the owner's screen; three icons (Blessing of Life, Recuperation,
  Survival Willpower) go to the owner list. The earlier "icon ids agree" check (Gretchen's NOTES) compared ids and
  unlocked icons only, so it could not see this.

## 2. Files

Same columns as the Gladiator, Ranger, Spiritmaster, Templar and Cleric CSVs. All rows carry `page_url`, `build`,
`checkedAt` 2026-10-19 and `status`.

| File | Rows |
|---|---|
| [`chanter-skills-metabot-2026-10.csv`](../../data/research/chanter-skills-metabot-2026-10.csv) | 22 |
| [`chanter-specialties-metabot-2026-10.csv`](../../data/research/chanter-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`chanter-stigmas-metabot-2026-10.csv`](../../data/research/chanter-stigmas-metabot-2026-10.csv) | 13 |
| [`chanter-board-nodes-metabot-2026-10.csv`](../../data/research/chanter-board-nodes-metabot-2026-10.csv) | 537 |
| [`chanter-builds-metabot-2026-10.csv`](../../data/research/chanter-builds-metabot-2026-10.csv) | 42, all `single-source` (Metabot only; second sources are in §4) |
| [`chanter-metabot-2026-10.requests.log`](../../data/research/chanter-metabot-2026-10.requests.log) | 41 requests |
| [`chanter-icons-metabot-2026-10.requests.log`](../../data/research/chanter-icons-metabot-2026-10.requests.log) | 35 requests (one 403, §7) |
| [`chanter-second-sources-2026-10.requests.log`](../../data/research/chanter-second-sources-2026-10.requests.log) | 10 requests |

Script: `data/research/scripts-2026-10/chanter_csvs.py` (the Templar script with the class swapped; the `-chanter`
slug suffix sets `notes` on Attack Preparation, Defiance, Impact Hit and Survival Willpower). Run it as
`chanter_csvs.py <cache dir> <out dir> data/packs/aion2/classes/assassin/board-nodes.json`, after `gladiator_skills.py`
(skill pages → `skills.json`) and `extract.flight()` + `gladiator_boards.py` (boards page → `boards.json`), as for the
Templar. The builds CSV is transcribed by hand from the three pages in its `page_url` column; its rotation row is our
summary, not Metabot's wording.

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Onslaught | active | 1 | stepped | 25 | Nezekan, Zikel, Vaizel, Triniel | 149 of 150 |
| Incandescent Blow | active | 1 | stepped | 25 | same | 149 of 150 |
| Rushing Smash | active | 1 | stepped | 25 | same | 149 of 150 |
| Impactful Crush | active | 3 | stepped | 27 | same | 149 of 150 |
| Dark Crush | active | 4 | stepped | 28 | same | 149 of 150 |
| Gust Rampage | active | 5 | stepped | 29 | same | 132 of 150 |
| Heat Wave Blow | active | 7 | stepped | 31 | same | 139 of 150 |
| Recuperation | active | 8 | stepped | 32 | same | 149 of 150 |
| Tremor Crush | active | 10 | stepped | 34 | same | 149 of 150 |
| Wave Blow | active | 12 | stepped | 36 | same | 141 of 150 |
| Spinning Strike | active | 14 | stepped | 38 | same | 149 of 150 |
| Defiance | active | 16 | stepped | 40 | same | not shown |
| Blessing of Life | passive | 1 | stepped | 25 | Nezekan ×2, Vaizel, Triniel | 149 of 150 |
| Crossguard | passive | 6 | stepped | 30 | Nezekan ×2, Vaizel, Triniel | 149 of 150 |
| Protection Circle | passive | 9 | stepped | 33 | Nezekan ×2, Vaizel, Triniel | 149 of 150 |
| Inspiring Spell | passive | 11 | stepped | 35 | Nezekan ×2, Vaizel, Triniel | 149 of 150 |
| Attack Preparation | passive | 13 | stepped | 37 | Nezekan ×2, Vaizel, Triniel | 149 of 150 |
| Impact Hit | passive | 15 | stepped | 39 | Zikel ×2, Vaizel, Triniel | 149 of 150 |
| Raging Spell | passive | 17 | stepped | 41 | Zikel ×2, Vaizel, Triniel | 149 of 150 |
| Earth's Promise | passive | 21 | **flat** | 21 | Zikel ×2, Vaizel, Triniel | 149 of 150 |
| Survival Willpower | passive | 23 | **flat** | 23 | Zikel ×2, Vaizel, Triniel | 149 of 150 |
| Wind's Promise | passive | 25 | **flat** | 25 | Zikel ×2, Vaizel, Triniel | 149 of 150 |

Active nodes cost 3, passive nodes 2; every skill's max level is 40. Weapon: Staff (Metabot class page; the owner's
screen shows "Weapon Condition: Staff"). 203 skill points and 29 stigma points by Lv 45 (Metabot build page;
aion2turkiye gives the same two numbers). Specialization slots open at skill Lv 8, 12 and 20, with a fifth option at
16 but no new slot (Metabot class page, daevaguides, aion2turkiye, mmo-codex agree). Spinning Strike learns at 14
(Metabot, mmo-codex, the owner's screen); daevaguides notes couga54's plan says 13, which the screen rules out.

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 points per level in bands of five for levels 1–20 and list specializations at
stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 25 (single source: stigma pages and class page agree; mmo-codex says
the fifth specialty at 25 comes from gear bonuses). Slots open at Lv 22 / 27 / 32 / 37 (Metabot build page;
daevaguides agrees). Top-player picks (of 150): Undefeated Mantra 148, Sprint Mantra 142, Power of the Storm 97,
Marchutan's Wrath 71, Focused Defense 55, Obliterate 44, Healing Touch 20, Fracturing Blow 16, Impeding Authority 14,
Guardian Blessing 11, Ensnaring Mark 6, Barrier Spell 2; Assault Shock shows none.

Guardian Blessing's cooldown is 120 s on Metabot and aion2turkiye but 300 s on daevaguides; mmo-codex says Korea
changed it to 2 minutes on 16 Sep (inferred: daevaguides carries an older client). No leveling build uses it.

## 3. Learn levels: three sources, no owner check needed

| Source | What it shows |
|---|---|
| Metabot skill pages | all 22 (§2.1) |
| Owner's skill window, Lv 4 Chanter, 2026-10-19 1:36 PM ET (`/mnt/project-files/owner-screens/2026-10-19/chanter/`) | unlocked: Onslaught, Incandescent Blow, Rushing Smash, Impactful Crush, Dark Crush, Blessing of Life; locked skills carry their level: actives 5, 7, 8, 10, 12, 14, 16; passives 6, 9, 11, 13, 15, 17, 21, 23, 25 |
| [mmo-codex class page](https://mmo-codex.com/games/aion-2/classes/chanter/) | "What unlocks at each character level": the same 22 values |

**Verdict:** all 22 learn levels CONFIRMED, with the owner's screen as the source of truth. Game Data Check's notes
left the passives "unchecked"; I read the passive grid from the same screenshot: ten cells, locked at exactly the ten
Metabot levels, one per level, so the level-to-skill match is one-to-one (inferred for the locked ones, as Gretchen
noted for the actives). The stepped / flat gates come from Metabot's level tables (a game-database field); mmo-codex
states the same rule ("every level bought with points also needs three more character levels"), and daevaguides
[notXeon] says Attack Preparation's higher levels open at roughly 17, 22, 34 while Wind's Promise has no such gate,
which matches. Same caveat as the Ranger (#313): mmo-codex credits "the Aion 2 client via aion2.app", so it and
Metabot may share upstream client data. The owner's screen does not.

## 4. Guide advice

### 4.1 Skill targets by Lv 45

| Skill | Metabot leveling | aion2turkiye leveling | daevaguides | mmo-codex levelling | Verdict |
|---|---|---|---|---|---|
| Dark Crush | 10 | 10 | 10 from points ("14 by 45" with nodes) | first, to 8 then 10 | CONFIRMED 10 |
| Onslaught | 10 | 10 | 10 "as early as possible" | second, to 8 then 10 | CONFIRMED 10 |
| Spinning Strike | 10 | 10 | 10 | third, to 8 then 10 | CONFIRMED 10 |
| Recuperation | 10 | 10 | 10 | fourth, to 8 then 10 | CONFIRMED 10 |
| Incandescent Blow | 10 | 10 | 10 | not stated | CONFIRMED 10 |
| Rushing Smash | 10 | 10 | 10 | not stated | CONFIRMED 10 |
| Attack Preparation | 10 | 10 | 10 ("first place" for six creators) | not stated | CONFIRMED 10 |
| Wind's Promise | **not listed** | 10 | 10 "straight to 10" at 25 [couga54] | not stated | two-source 10, **Metabot silent** |
| Impactful Crush | 10 | 8 ("level to 8 only") | 8–10 (aLuckyRO 8, couga54 12) | not stated | disputed (8 or 10) |
| Tremor Crush | 7 | 8 | 8–12 | not stated | two-source 8; Metabot 7 |
| Blessing of Life | 10 | 6 | "spare points" [couga54] | not stated | disputed |
| Inspiring Spell | 5 | – | 10 [couga54 2nd passive] | not stated | disputed |
| Heat Wave Blow | – | 8 | 8 | not stated | two-source 8, Metabot silent |
| Impact Hit | – | 8 | 10 | not stated | disputed |
| Earth's Promise | – | 5 | 10 | not stated | disputed |
| Wave Blow | – | 5 | 8 | not stated | disputed |
| Defiance | – | 8 | "the minimum is enough" | not stated | disputed |
| Gust Rampage | – | 5 | 1 ("not worth points in season 1", couga54) | not stated | disputed |
| Protection Circle | – | – | 10 [couga54 "best defensive passive"] | not stated | single-source |

Metabot's leveling build costs exactly 203 points (nine skills × 21, Tremor Crush to 7 = 9, Inspiring Spell to 5 =
5). aion2turkiye budgets 255 ("quests and Sealed Dungeons give more").

**Default for the guide (GUESS):** the seven CONFIRMED skills to 10 (147 points), Wind's Promise to 10 at Lv 25 (21; it
is flat-gated, so all 21 points can go in on the day it is learned) = 168. That leaves 35 of the 203: Impactful Crush
to 8 (13, the lower value; it only opens Dark Crush), Tremor Crush to 8 (13, two-source) and Blessing of Life to 6 (7,
the lower value) = 201, 2 spare. Label Wind's Promise two-source with a note that Metabot's build leaves it out, and
Impactful Crush and Blessing of Life as disputed. This drops Metabot's Inspiring Spell 5 (disputed; daevaguides wants
10, aion2turkiye nothing).

### 4.2 Training order

Metabot gives targets only. Three sources give an order:

- **mmo-codex** (its own levelling scenario): Dark Crush → Onslaught → Spinning Strike → Recuperation, each to 8 (the
  first specialty) and then to 10.
- **daevaguides** [couga54, aLuckyRO]: Onslaught and Incandescent Blow first (Lv 1–3); Dark Crush as far as the game
  allows from Lv 4; Rushing Smash and Recuperation from Lv 8; Attack Preparation from 13; Spinning Strike from 14;
  Onslaught and Incandescent Blow to 8 around Lv 19; Wind's Promise to 10 at 25.
- **aion2turkiye** (its dungeon build, the only one with an order): Dark Crush 8 › Onslaught 8 › Incandescent Blow 8 ›
  Spinning Strike 8 › Impactful Crush 8 › Rushing Smash 8.

Agreed by all three: **Dark Crush is the top point sink from Lv 4 and Onslaught is raised early.** Not agreed: whether
Incandescent Blow or Recuperation comes next. The guide's `skillOrderNotes` should say so.

### 4.3 Stigmas

| Slot | Metabot leveling, top players and class-builds guide | aion2turkiye leveling | daevaguides [couga54] | mmo-codex levelling order |
|---|---|---|---|---|
| 1 (Lv 22) | Undefeated Mantra | Undefeated Mantra | Undefeated Mantra | Undefeated Mantra to 5 |
| 2 (Lv 27) | Sprint Mantra | Sprint Mantra | Power of the Storm | Power of the Storm to 5 |
| 3 (Lv 32) | Power of the Storm | Power of the Storm | Marchutan's Wrath | Sprint Mantra to 5 |
| 4 (Lv 37) | Marchutan's Wrath | Marchutan's Wrath | Sprint Mantra (with a Cleric: Focused Defense; without: Healing Touch) | Marchutan's Wrath to 5 |

**Verdict:** the set of four is in every source (CONFIRMED), and Undefeated Mantra first is CONFIRMED (daevaguides: "7
of 7 sources"). **Slots 2–4 are disputed**: Metabot and aion2turkiye give Sprint, Storm, Marchutan; daevaguides and
mmo-codex put Power of the Storm second (mmo-codex gives a level order, not a slot order, which I read as the same
thing: inferred). Default (GUESS): Metabot's order, with `stigmaSlots` labelled `disputed` for slots 2–4.

**Stigma levels by Lv 45 (29 points):** Metabot 8 / 7 / 5 / 4; aion2turkiye 10 / 5 / 5 / 5. Power of the Storm to 5
(its −30 s cooldown) is in Metabot, aion2turkiye, daevaguides and mmo-codex: CONFIRMED. Undefeated Mantra gets the
most in every source (daevaguides and mmo-codex: to 20 after 45). The rest single-source each.

### 4.4 Specialty picks at skill Lv 8

| Skill | Pick (spec id) | Sources that take it | Dissent | Verdict |
|---|---|---|---|---|
| Dark Crush | Critical Hit on hit (`:3`) | aion2turkiye, daevaguides ("everyone"), mmo-codex | – | CONFIRMED |
| Spinning Strike | −5 s cooldown (`:1`) | aion2turkiye, daevaguides, mmo-codex | – | CONFIRMED |
| Recuperation | +1 consecutive use, HoT stacks ×2 (`:1`) | aion2turkiye, daevaguides, mmo-codex | – | CONFIRMED |
| Tremor Crush | +10 m range (`:2`) | aion2turkiye, mmo-codex, daevaguides [couga54] | – | CONFIRMED |
| Impactful Crush | Changes to mobile skill (`:3`) | aion2turkiye, mmo-codex (its Lv 8 pick), daevaguides [couga54] | – (mmo-codex adds `:1`, AoE stun, as an option for small packs) | CONFIRMED (three sources) |
| Onslaught | +20% MP restored (`:1`) | daevaguides [aLuckyRO: "don't trade mana for damage"], mmo-codex | aion2turkiye leveling `:2` (Absorbs 0.7% HP) | two-source |
| Incandescent Blow | −20% MP consumed (`:1`) | daevaguides [aLuckyRO], mmo-codex | aion2turkiye leveling `:3` | two-source |
| Heat Wave Blow | Up to +20% damage on more targets (`:3`) | aion2turkiye, mmo-codex | – | two-source |
| Defiance | Restores 10% HP (`:3`) | aion2turkiye, mmo-codex | – | two-source |
| Rushing Smash | 50% chance to trigger Heat Wave Blow (`:3`) | aion2turkiye leveling, mmo-codex farming | mmo-codex boss `:2`; daevaguides "never take" `:2` | two-source for leveling |
| Wave Blow | – | aion2turkiye `:1`, mmo-codex `:2` | – | disputed |
| Gust Rampage | – | aion2turkiye and daevaguides [aLuckyRO, Nightmare] `:1`; mmo-codex and daevaguides [aLuckyRO, outside Nightmare] `:2` | – | disputed |

Lv 12 and 16 options need skill Lv 12+, which points alone don't reach before Lv 45 (max 10); they need Daevanion
nodes, so a leveling guide can leave them out, as the Ranger's did. Note for the guide: every source names Rushing
Smash's Lv 12 cooldown reset on a kill (`:4`) and Dark Crush's Lv 16 "Removes cooldown" (`:5`) as the real goals; both
come only after 45.

### 4.5 Stat priority and board path

- **Stat priority (single source):** Metabot's class page and class-builds guide (one site): **HP > Attack > Defense >
  Critical Hit > Accuracy Bonus**. None of the second sources ranks stats for leveling. Label `single-source`.
- **Board path (two-source):** Metabot (class page, class-builds guide) and aion2turkiye's leveling build: Nezekan's
  Attack Preparation and Protection Circle node pairs first, then Zikel's Earth's Promise. aion2turkiye adds the +1
  Dark Crush and Onslaught nodes on Nezekan; daevaguides puts those active nodes first (Dark Crush → Onslaught →
  Spinning Strike → Incandescent Blow). The passive pairs first is two-source; the exact node order is disputed.

### 4.6 Rotation (four sources)

Metabot, mmo-codex, daevaguides and aion2turkiye give the same leveling loop in different words: dash in with Rushing
Smash, Impactful Crush (100% stun on NPCs) to open the Dark Crush window, Dark Crush inside it, Heat Wave Blow for the
seal (mmo-codex), from Lv 14 Spinning Strike (its own window and a +15% crit-damage buff), Incandescent Blow as the
filler, Onslaught on the left button for MP, Recuperation when HP drops. The window rule is CONFIRMED by Metabot's skill
text ("[Dark Crush] becomes available for 2s on skill use" on Impactful Crush and Spinning Strike, "for 3s" on
Marchutan's Wrath and Ensnaring Mark). Mana is the leveling bottleneck in mmo-codex and daevaguides, which is why both
take the MP specialties on Onslaught and Incandescent Blow (§4.4). Mantras are toggles: turn them on once (daevaguides,
mmo-codex; Metabot's text gives them a 5 s cooldown). Whether the Chanter's Build drawer shows a Rotation section is the
guide item's call; the data supports it.

## 5. Text that Metabot prints wrong

| Id | Metabot page | Game text | Game-text sources |
|---|---|---|---|
| `spec:chanter:onslaught:2` | Absorbs 70, 70% HP | Absorbs 0.7% HP | owner's screen (2026-10-19), mmo-codex, daevaguides, aion2turkiye |
| `spec:chanter:dark-crush:1` | Absorbs 70, 70% HP | Absorbs 0.7% HP | two-source (guides): mmo-codex, daevaguides, aion2turkiye; not on the owner's screen |
| `spec:chanter:gust-rampage:1` | Absorbs 500, 500% HP | Absorbs 5% HP | two-source (guides): mmo-codex, daevaguides, aion2turkiye; not on the owner's screen |
| `spec:chanter:recuperation:2` | Removes up to 2, 2 debuffs | Removes up to 2 debuffs | daevaguides, aion2turkiye |
| `spec:chanter:healing-touch:3` (stigma) | Removes 5, 5 debuff(s) | Removes 5 debuff(s) | daevaguides, aion2turkiye |
| Recuperation, base text | … removes 1, 1 debuff(s) … | … removes 1 debuff(s) … | daevaguides, aion2turkiye |
| Blessing of Life, base text | … Heal Boost by 15,300% of Attack | **unknown** | none: see below |

The specialties CSV keeps Metabot's text as read in `text`, puts the game text in `game_text` and marks those five rows `disputed`; the class-data item writes `game_text`. Only Onslaught's row is game-confirmed (the owner's screen); mmo-codex reads its data through aion2.app, so the guides' agreement is partly shared upstream (§9). The owner's screen also confirms the
other four Onslaught texts word for word (+20% MP restored, +50% Multi-Hit on hit, −1s [Spinning Strike] cooldown on
hit, Adds [Storm Chain] Chain Skill).

**Blessing of Life's Heal Boost is disputed and has no game reading.** Metabot: "15,300% of Attack"; mmo-codex and
daevaguides print the raw client template "15300% of Attack" (and "HP by 15300"); aion2turkiye prints "15.3% of
Attack". mmo-codex says the percentage "is a template error" and that Korea uses 18 / 21 / 24% of Attack since 12 Aug.
So the true Lv 1 number is not known from any permitted source. The guide shouldn't need it (no source raises Blessing
of Life for its heal). If the class data must carry the text, it is an owner check: hover Blessing of Life on any
Chanter (it is learned at Lv 1) and screenshot the tooltip.

## 6. Default keys (owner's screen)

From `/mnt/project-files/owner-screens/2026-10-19/chanter/NOTES.md` (read by Game Data Check). Row 0 fires first.

| Key | Skill(s) |
|---|---|
| Left click | Onslaught |
| Right click | Incandescent Blow |
| 1 | Rushing Smash |
| 2 | Impactful Crush |
| 3 | Recuperation (8) |
| 4 | Spinning Strike (14) |
| E | r0 Gust Rampage (5), r1 Heat Wave Blow (7), r2 Dark Crush (4) |
| Q | r0 Tremor Crush (10), r1 Wave Blow (12) |
| none | Defiance (16); daevaguides says the game keeps it on Space |

This is the layout a new player has. The conditional skill sits in Q row 1 (Wave Blow), not row 0 as on other classes
(Gretchen's note 1; inferred that Tremor Crush takes row 0 because it unlocks first). daevaguides and mmo-codex
recommend rearranging it (Dark Crush first on the right mouse button so its window fires it, Impactful Crush on E),
which is advice, not the default.

## 7. Icons

Skill and stigma icons from Metabot under the standing icon OK (owner, 2026-10-14). Provenance rows (file, name, source
page, file URL, date, how it was matched) are in `docs/ISSUES.md` under "Chanter skill and stigma icons".

- **Where:** `data/packs/aion2/asmodian/chanter/icons/`, not wired into the app (as for the Templar). The guide item
  moves the ones it shows to `src/assets/icons/` in the change that references them. The generator only reads `.json`
  under `data/packs/`.
- **Format:** 256 px WebP → 128 × 128 RGB PNG (Lanczos), like the Templar's. **Names:** `sk-chanter-<slug>.png` and
  `st-chanter-<slug>.png`; the class is in the name because Impact Hit, Defiance and Survival Willpower are shared names.
- **Match:** each skill page links exactly one file under `/web/aion2/skills/` (5 references, all the same id, named by
  the game skill id) and its `<title>` names the skill. The 12 active ids match Gretchen's checked notes.

**What the owner's screen shows (new this pack).** I compared every one of the 22 cells on the owner's Lv 4 screen with
the files, locked cells brightened (`/mnt/project-files/owner-screens/2026-10-19/chanter/skills-lv4-locked.png`). Locked
icons are greyed but keep their hue and shape. Result:

| Skill (screen cell) | Metabot file | Screen shows | Staged as |
|---|---|---|---|
| 11 actives and Crossguard, Inspiring Spell, Raging Spell | their own page's file | the same art (5 actives unlocked; the rest by shape and hue) | their own name |
| Earth's Promise (Lv 21 cell) | 18780000 (red swirl) | the purple blade, which is Metabot's Wind's Promise file 18800000 | `sk-chanter-earths-promise.png` = 18800000 |
| Wind's Promise (Lv 25 cell) | 18800000 (purple blade) | the red swirl, Metabot's Earth's Promise file 18780000 | `sk-chanter-winds-promise.png` = 18780000 |
| Protection Circle (Lv 9 cell) | 18730000 (bound fists) | the hooded figure in a gold arch, Metabot's Blessing of Life file 18710000 | `sk-chanter-protection-circle.png` = 18710000 |
| Blessing of Life (Lv 1, unlocked) | 18710000 (hooded figure) | green light with gold ornaments: no Metabot file has it | **not staged; owner list** |
| Recuperation (key 3, Lv 8 cell) | 18120000 (green four-point star) | one open hand with light: no Metabot file has it | **not staged; owner list** |
| Survival Willpower (Lv 23 cell) | none (`"icon":null` in Metabot's data; the file 18790000 returns 403 AccessDenied) | an armoured figure, hands to the head | **not staged; owner list** |
| Attack Preparation (Lv 13), Impact Hit (Lv 15) | their own page's file | the same shapes, but red and purple where the files are blue | staged under their own name, **unconfirmed** |
| 13 stigmas | their own page's file | not on the screen (Stigma tab locked at Lv 4) | staged under their own name, Metabot match only |

Corroboration: mmo-codex notes that aion2.app "has no icon for Recuperation or Blessing of Life" and takes those two
from NCSOFT's guidebook, the same two skills whose game art Metabot lacks here. The 18730000 (bound fists) file matches
no cell on the screen and is not staged. The two Metabot files I did not stage under their page's name are listed in
`docs/ISSUES.md` with the reason.

**Uncertainty and a test:** the swaps rest on greyed icons read by eye; Earth's / Wind's Promise and Protection Circle
are clear shape matches, Attack Preparation and Impact Hit are not. Test: at Chanter Lv 25+ every passive is unlocked
and in full colour; one screenshot of the passive grid settles all ten. The same Metabot mix-up may exist on the
Templar's and Cleric's passives, whose packs matched only the unlocked icons (inferred risk, not checked here; the
owner's Templar screen in `/mnt/project-files/owner-screens/2026-10-18/templar/` would show it).

## 8. What depends on the owner

Nothing blocks the guide item's data. For icons, three are missing (Blessing of Life, Recuperation, Survival
Willpower: owner crops are the fallback, as for T-47), and Attack Preparation and Impact Hit are unconfirmed (§7).
Optional: Blessing of Life's tooltip text (§5), only if the class data must carry it. No learn-level check (§3), no
stigma check (Gladiator pack §4.1).

## 9. Fetching record

Policy: `CLAUDE.md` and `docs/research/SOURCES.md` (every host used is listed there; no new site, so SOURCES.md is
unchanged), under ROL-03 as amended 2026-10-19 (research threads fetch inside their pack; Game Data Check verifies).
User-Agent `DaevaCompanionResearch/0.1 (+https://daevacompanion.com)` (set in the fetch script; the logs don't record
it), one request at a time per host, cache 24 h, stop on 403 / 429 / a challenge. The script waits 6 s after the
previous request's start before sending, but the logs record finish times, so they show gaps as short as 2 s where a
slow response finished late; what they do show is at most 11 metabot.gg requests in any 60 s, one at a time. No page copy or WebP is committed; only the CSVs
and the converted PNGs.

- **metabot.gg (Full):** robots.txt re-read, then the terms, both before any content page (CLAUDE.md asks for terms
  first; noted for next time) (8:33 PM ET; disallows only `/api/`, `/private/` and profile paths,
  nothing blocks Claude-User or our UA); terms of service re-read (effective 04/01/2026, unchanged: "personal,
  non-commercial use", attribution with a dofollow link to the page the data came from). 76 requests in all (41 pages:
  robots, terms, class page, 35 skill pages, boards, build page, class-builds guide; 35 icon files), 8:33–8:43 PM ET,
  at most 11 in any 60 s by the log's times. The last request, the unlinked Survival Willpower file `18790000.webp`, returned 403 with an
  S3 `AccessDenied` body (a missing object, inferred, not a challenge); I stopped there as the policy says, and it was
  the last planned request anyway. That URL was guessed from the id pattern, not linked by any page; next time, stick to linked asset URLs.
- **Second sources, 8:35–8:36 PM ET:** robots.txt re-read on mmo-codex (blocks only `/api/`), daevaguides (allows
  Claude-User explicitly), aion2turkiye (allows all), skycoach and gamesfuze (block only search, account and tracking
  paths). mmo-codex is **Spot** (its terms ban "automated republication and scraped copies"; re-read after its robots.txt but before the content page, unchanged), so one
  content page. One page each on daevaguides and aion2turkiye. skycoach's `chanter-guide` URL (the pattern of its
  Templar and Cleric guides) returned 404; I did not guess further URLs, and gamesfuze has no Chanter guide page that a
  search shows. Facts only, no wording kept.

**How independent the second sources are (inferred, not proven):** mmo-codex reads client data through aion2.app,
second-hand client data, not a copy of Metabot. daevaguides compiles creators (couga54, aLuckyRO, notXeon, ExpCarry,
Fextralife and others; it also cites Game8, which we don't use), so it counts once, for the creators it names.
aion2turkiye says its Lv 45 targets come from "the class's 25 most developed players", a different sample from
Metabot's 150; its build tabs are "based on game knowledge".
