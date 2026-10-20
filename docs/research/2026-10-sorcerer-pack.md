# Sorcerer research pack (0.8 class research)

Research, 19 Oct 2026 (fetched 8:33–8:45 PM ET; the request logs are in UTC, 20 Oct 00:33–00:45). **Docs, research
files and staged icons only: no JSON under `data/packs/`, nothing under `data/schema/` or `src/` was changed;** the only
files under `data/packs/` are the 35 icon PNGs (§7), which the generator does not read. The Release Planner asked for
this pack after the owner picked all four classes for 0.8. It has the same shape as the
[Templar pack](2026-10-templar-pack.md): class data (§2), learn levels (§3), guide advice with second sources (§4),
Metabot text bugs (§5), the owner's default keys (§6) and every skill and stigma icon (§7). It starts from Game Data
Check's notes on the owner's Sorcerer screen (`/mnt/project-files/owner-screens/2026-10-19/sorcerer/NOTES.md`). Read the
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
  label, 0 differences by script (CONFIRMED), as on the five classes before.
- **All 22 learn levels have three sources:** Metabot, the owner's Sorcerer skill window (2026-10-19, the source of
  truth; checked against Metabot by Game Data Check) and mmo-codex's unlock table (§3). No owner check is needed.
- **Same flat-gated late passives as the other classes:** Grace of Enhancement (21), Revitalization Contract (23) and
  Vitality Evaporation (25). The other 19 are stepped (CONFIRMED).
- **Guide advice has second sources** (mmo-codex, daevaguides, aion2turkiye; §4). Five skills to Lv 10 are CONFIRMED by
  every source (Flame Arrow, Firestorm, Blaze, Bittercold Wind, Hellfire); four more are two-source. Wish of
  Concentration is disputed (Metabot 7, two others 10). Element Enhancement in slot 1 and Fire Wall and Cold Storm in
  the set are CONFIRMED; the fourth stigma (Delayed Explosion or Steel Barrier) and the slot order are disputed. Five Lv
  8 specialty picks are CONFIRMED, three more are two-source.
- **Three actives only fire on a condition** (CONFIRMED, skill text plus two guides): Blaze needs a Fire Mark target,
  Flame Scattershot a Staggered one, Frost Burst a Frosted one. Hellfire is a charged skill (hold for up to 3 charge
  levels; full charge is ×3 charge 1); daevaguides and mmo-codex both say a macro fires it at charge 1 only.
- **The global client already has Korea's 16 Sep Sorcerer patch.** Metabot's Fire Mark text has no proc chance ("Inflicts
  Fire Mark for 5s on landing a Fire attack") and Flame Arrow's specialty 4 is the new "+5% Fire Damage Boost … on
  activating [Pyroclasm]". mmo-codex's own numbers are from the older client (20% mark chance) and say so; daevaguides
  says the same. So on global every Fire hit marks the target, and Blaze is usable after any Fire hit (CONFIRMED).
- **Metabot prints five "Absorbs N% HP" specialties wrong** (the #358 pattern): "Absorbs 100, 100% HP" where the game
  says "Absorbs 1% HP", and the same for 3, 5, 7 and 10% (§5). Each has the owner's screen or two guides for the game
  text.
- **All 35 icons are saved** with provenance rows in `docs/ISSUES.md` (§7). The 12 active icon ids match the ones Game
  Data Check read.

## 2. Files

Same columns as the Templar, Cleric and Spiritmaster CSVs. All rows carry `page_url`, `build`, `checkedAt`
2026-10-19 and `status`.

| File | Rows |
|---|---|
| [`sorcerer-skills-metabot-2026-10.csv`](../../data/research/sorcerer-skills-metabot-2026-10.csv) | 22 |
| [`sorcerer-specialties-metabot-2026-10.csv`](../../data/research/sorcerer-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`sorcerer-stigmas-metabot-2026-10.csv`](../../data/research/sorcerer-stigmas-metabot-2026-10.csv) | 13 |
| [`sorcerer-board-nodes-metabot-2026-10.csv`](../../data/research/sorcerer-board-nodes-metabot-2026-10.csv) | 537 |
| [`sorcerer-builds-metabot-2026-10.csv`](../../data/research/sorcerer-builds-metabot-2026-10.csv) | 41, all `single-source` (Metabot only; second sources are in §4) |
| [`sorcerer-metabot-2026-10.requests.log`](../../data/research/sorcerer-metabot-2026-10.requests.log) | 41 requests |
| [`sorcerer-icons-metabot-2026-10.requests.log`](../../data/research/sorcerer-icons-metabot-2026-10.requests.log) | 35 requests |
| [`sorcerer-second-sources-2026-10.requests.log`](../../data/research/sorcerer-second-sources-2026-10.requests.log) | 9 requests |

Script: `data/research/scripts-2026-10/sorcerer_csvs.py` (the Templar script with the class name swapped, nothing
else). Run it as `sorcerer_csvs.py <cache dir> <out dir> data/packs/aion2/classes/assassin/board-nodes.json`, after
`gladiator_skills.py` (35 skill pages → `skills.json`) and `extract.flight()` + `gladiator_boards.py` (boards page →
`boards.json`). A Metabot slug ending in `-sorcerer` (a name another class also uses) sets that row's `notes`: Defiance
and Revitalization Contract. The CSV ids drop the suffix (`skill:sorcerer:defiance`); `page_url` keeps the real
address. The builds CSV is transcribed by hand from the three pages in its `page_url` column; its rotation row is our
summary, not Metabot's wording.

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 8 / 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Flame Arrow | active | 1 | stepped | 19 / 25 | Nezekan, Zikel, Vaizel, Triniel | 150 of 150 |
| Ice Chain | active | 1 | stepped | 19 / 25 | same | 147 of 150 |
| Firestorm | active | 1 | stepped | 19 / 25 | same | 150 of 150 |
| Bittercold Wind | active | 3 | stepped | 21 / 27 | same | 150 of 150 |
| Blaze | active | 4 | stepped | 22 / 28 | same | 150 of 150 |
| Flame Scattershot | active | 5 | stepped | 23 / 29 | same | 147 of 150 |
| Frost | active | 7 | stepped | 25 / 31 | same | 144 of 150 |
| Winter's Shackles | active | 8 | stepped | 26 / 32 | same | 147 of 150 |
| Frost Burst | active | 10 | stepped | 28 / 34 | same | 146 of 150 |
| Wish of Concentration | active | 12 | stepped | 30 / 36 | same | 150 of 150 |
| Hellfire | active | 14 | stepped | 32 / 38 | same | 150 of 150 |
| Defiance | active | 16 | stepped | 34 / 40 | same | not shown |
| Fire Mark | passive | 1 | stepped | 19 / 25 | Nezekan ×2, Vaizel, Triniel | 150 of 150 |
| Robe of Earth | passive | 6 | stepped | 24 / 30 | Nezekan ×2, Vaizel, Triniel | 150 of 150 |
| Cold Snap | passive | 9 | stepped | 27 / 33 | Nezekan ×2, Vaizel, Triniel | 150 of 150 |
| Robe of Flame | passive | 11 | stepped | 29 / 35 | Nezekan ×2, Vaizel, Triniel | 150 of 150 |
| Absorb Essence | passive | 13 | stepped | 31 / 37 | Nezekan ×2, Vaizel, Triniel | 150 of 150 |
| Grace of Resistance | passive | 15 | stepped | 33 / 39 | Zikel ×2, Vaizel, Triniel | 150 of 150 |
| Robe of Cold | passive | 17 | stepped | 35 / 41 | Zikel ×2, Vaizel, Triniel | 150 of 150 |
| Grace of Enhancement | passive | 21 | **flat** | 21 / 21 | Zikel ×2, Vaizel, Triniel | 150 of 150 |
| Revitalization Contract | passive | 23 | **flat** | 23 / 23 | Zikel ×2, Vaizel, Triniel | 150 of 150 |
| Vitality Evaporation | passive | 25 | **flat** | 25 / 25 | Zikel ×2, Vaizel, Triniel | 150 of 150 |

Active nodes cost 3, passive nodes 2; every skill's max level is 40. Robe of Cold reaches 10 only at character Lv 41.
Weapon: Spellbook (Metabot class page; daevaguides agrees). 203 skill points and 29 stigma points by Lv 45 (Metabot
build page; aion2turkiye gives both numbers). Specialization slots open at skill Lv 8, 12 and 20, with a fifth option at
16 but no new slot (Metabot build page, mmo-codex, aion2turkiye agree). Every active has five specialties at 8 / 8 / 8 /
12 / 16, which matches the owner's screen for Flame Arrow.

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 points per level in bands of five for levels 1–20 and list specializations at
stigma Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 25 (single source; mmo-codex says the fifth specialty at 25 is not in
the client data, and daevaguides that the global cap is 20 for now). Slots open at Lv 22 / 27 / 32 / 37 (Metabot build
page; daevaguides agrees). Top-player picks (of 150): Element Enhancement 139, Delayed Explosion 124, Fire Wall 114,
Cold Storm 65, Steel Barrier 53, Divine Burst 51, Glacial Smite 27, Arctic Armor 14, Soul Freeze 11, Hibernation 8,
Curse: Tree 5, Assault Bombardment 2, Lumiel's Space 2.

## 3. Learn levels: three sources, no owner check needed

| Source | What it shows |
|---|---|
| Metabot skill pages | all 22 (§2.1) |
| Owner's skill window, Lv 4 Sorcerer, 2026-10-19 1:04 PM ET (`/mnt/project-files/owner-screens/2026-10-19/sorcerer/`) | 5 actives unlocked (Lv 1 ×3, Lv 3, Lv 4), 1 passive unlocked; locked actives 5, 7, 8, 10, 12, 14, 16, locked passives 6, 9, 11, 13, 15, 17, 21, 23, 25. Game Data Check matched all 22 to Metabot (1:15 PM ET), the five unlocked icons by eye, the locked ones by level |
| [mmo-codex class page](https://mmo-codex.com/games/aion-2/classes/sorcerer/) | "What unlocks at each character level": the same 22 values |

**Verdict:** all 22 learn levels CONFIRMED, with the owner's screen as the source of truth. The stepped / flat gates
come from Metabot's level tables (a game-database field); mmo-codex states the same rule ("every level bought with
points also needs three more character levels": Hellfire 8 at 32, Wish 8 at 30, both match §2.1). Same caveat as the
Ranger (#313): mmo-codex credits "the Aion 2 client via aion2.app", so it and Metabot may share upstream client data. The
owner's screen does not.

## 4. Guide advice

### 4.1 Skill targets by Lv 45

| Skill | Metabot leveling | aion2turkiye leveling | daevaguides [couga54 plan] | mmo-codex leveling [berdugz] | Verdict |
|---|---|---|---|---|---|
| Flame Arrow | 10 | 10 | 10 at ~25 | first five to 8 | CONFIRMED 10 |
| Firestorm | 10 | 10 | 10 at ~25 | first five to 8 | CONFIRMED 10 |
| Blaze | 10 | 10 | 10 at ~27–28 | first five to 8 | CONFIRMED 10 |
| Bittercold Wind | 10 | 10 | 10 at ~27–28 | first five to 8 | CONFIRMED 10 |
| Hellfire | 10 | 10 | 8 at ~32, 10 at ~38 | core; 8 at 32 | CONFIRMED 10 |
| Ice Chain | 10 | 3 | 10 at ~25 | first five to 8 | two-source 10; aion2turkiye 3 |
| Winter's Shackles | 10 | 8 | 8 at ~26, then 10 | specialty 3 at 8 | two-source 10; aion2turkiye 8 |
| Robe of Flame | 10 | 5 | first passive, to 10 | second passive [berdugz] | two-source 10; aion2turkiye 5 |
| Fire Mark | 10 | 5 | third passive, "passives to 10" | early [aLuckyRO] | two-source 10 (daevaguides by its general line); aion2turkiye 5 |
| Wish of Concentration | **7** | 10 | 10 at ~36 | specialty 2 | **disputed**: two sources 10, Metabot 7 |
| Frost | 5 | 0 ("don't spend points here") | to 8 only if short on mana | used from 7 for Frost Burst | disputed |
| Robe of Earth | – | 5 | to 10 (fourth passive) | early [aLuckyRO] | disputed |
| Grace of Enhancement | – | 5 | to 10 (second passive) | 1 point is enough at first [berdugz] | disputed |
| Flame Scattershot | – | 6 | to 8 if short on mana | – | single-source |
| Absorb Essence | – | – | berdugz puts it first while leveling | first passive [berdugz] | one creator (berdugz) via two compilers: single-source |
| Defiance, Robe of Cold | – | 3 each | not on the bar / last | – | single-source |

Metabot's leveling build costs exactly 203 points (nine skills × 21, Wish to 7 = 9, Frost to 5 = 5). aion2turkiye budgets
172. daevaguides' plan needs more than 203 and says Sealed Dungeons give 2 skill points each; aion2turkiye says "quests
and Sealed Dungeons give more". Whether the guide's budget should count those is the guide item's call (not checked
here).

**Default for the guide (GUESS):** Metabot's build as it stands: the five CONFIRMED skills to 10 (105), Ice Chain,
Winter's Shackles, Robe of Flame and Fire Mark to 10 (84), Wish to 7 (9), Frost to 5 (5) = 203. Label Wish `disputed`
with a note that two sources take it to 10 (it is the first place for any extra points), and Frost `disputed`. The four
two-source skills can be labelled two-source.

### 4.2 Training order

Metabot gives targets only. Two sources give an order, from different creators:

- **mmo-codex** [berdugz, 23 Sep]: first to 8: Flame Arrow, Ice Chain, Firestorm, Bittercold Wind and Blaze; Hellfire and
  Wish as they arrive; passives Absorb Essence, then Robe of Flame.
- **daevaguides** [couga54, checked 7 Oct]: Flame Arrow and Ice Chain, then Firestorm; Firestorm and Blaze as soon as the
  game allows from Lv 4–6; Bittercold Wind after them; Hellfire and Wish whenever allowed from 12–14; spare points from
  Lv 20 into Robe of Flame, then Grace of Enhancement and Fire Mark.

Agreed by both: **Flame Arrow, Ice Chain and Firestorm are the first point sinks, Blaze and Bittercold Wind next, Hellfire
and Wish from when they are learned.** Not agreed: the first passive (Absorb Essence for berdugz, Robe of Flame for
couga54). The guide's `skillOrderNotes` should say so.

### 4.3 Stigmas

| Slot | Metabot leveling, top players and class-builds guide | daevaguides solo / leveling | aion2turkiye leveling | mmo-codex leveling [berdugz] |
|---|---|---|---|---|
| 1 (Lv 22) | Element Enhancement | Element Enhancement | Element Enhancement | Element Enhancement, Delayed Explosion, Fire Wall, Cold Storm (no slot order) |
| 2 (Lv 27) | Delayed Explosion | Fire Wall | Fire Wall | |
| 3 (Lv 32) | Fire Wall | Cold Storm | Steel Barrier | |
| 4 (Lv 37) | Cold Storm | Steel Barrier (group: Delayed Explosion) | Cold Storm | |

**Verdict:** Element Enhancement in slot 1 is CONFIRMED (every source, and 139 of 150 top players). Fire Wall and Cold
Storm are in every set (CONFIRMED). The fourth is Delayed Explosion (Metabot, mmo-codex, daevaguides for groups) or Steel
Barrier (daevaguides solo, aion2turkiye): disputed for a solo leveling guide. **The order of slots 2–4 is disputed**:
Metabot puts Delayed Explosion at 27, the two other ordered sources put Fire Wall there. Default (GUESS): Metabot's set
and order, with `stigmaSlots` labelled `disputed` for the order and a note that two sources take Steel Barrier when
solo. Stigma levels: Element Enhancement is raised first in every source (Metabot leveling 8, aion2turkiye 10,
daevaguides "your shards go into it first") = two-source; the rest single-source each (Metabot: Delayed Explosion 7,
Fire Wall 5, Cold Storm 4 = 29 points).

### 4.4 Specialty picks at skill Lv 8

| Skill | Pick (spec id) | Sources that take it | Dissent | Verdict |
|---|---|---|---|---|
| Flame Arrow | +20% MP restored (`:1`) | mmo-codex [aLuckyRO, berdugz], daevaguides [couga54 and others], aion2turkiye | swap to `:3` (+50% Multi-Hit) once mana holds, at 45 | CONFIRMED |
| Firestorm | −50% MP Cost (`:1`) | mmo-codex [berdugz], daevaguides [couga54], aion2turkiye | mmo-codex credits aLuckyRO with `:2` (speed), daevaguides credits aLuckyRO with `:1` | CONFIRMED |
| Hellfire | +30% Skill Speed (`:1`) | mmo-codex, daevaguides ("everyone takes it"), aion2turkiye | – | CONFIRMED |
| Wish of Concentration | +10% additional Attack (`:2`) | mmo-codex, daevaguides ("every source agrees"), aion2turkiye | – | CONFIRMED |
| Winter's Shackles | +20% PvE / +10% PvP Damage Boost for 5 s (`:3`) | mmo-codex, daevaguides ("every source"), aion2turkiye | – | CONFIRMED |
| Ice Chain | −20% MP Cost (`:1`) | daevaguides [couga54] | mmo-codex [berdugz] `:2` at 12–14 | single-source |
| Blaze | Absorbs 3% HP (`:1`) | aion2turkiye, daevaguides (solo) [aLuckyRO] | `:3` Delayed Damage: mmo-codex [berdugz], daevaguides (group) | two-source for solo leveling |
| Bittercold Wind | Pull effect (`:3`) | aion2turkiye, daevaguides' specialty notes ("good for leveling" [couga54]), mmo-codex's levelling text ("specialty 3 pulls them in") | `:1` +1 s: mmo-codex's point list [berdugz], daevaguides' level plan ("+1s … for farming Pull effect", ambiguous) | two-source `:3` for leveling, with dissent |
| Frost | Restores 200 MP (`:1`) | daevaguides [couga54, berdugz] | mmo-codex AoE build `:2` | single-source |
| Flame Scattershot | – | daevaguides: `:1` [berdugz] or `:2` [aLuckyRO] | – | disputed |
| Frost Burst | Absorbs 7% HP (`:1`) | daevaguides [berdugz, aLuckyRO], mmo-codex (boss build) | – | two-source, but no leveling build takes Frost Burst to 8 |
| Defiance | Restores 20% HP (`:3`) | mmo-codex | – | single-source; reaches 8 only at Lv 34 |

Lv 12 and 16 options need skill Lv 12+, which points alone don't reach before Lv 45 (max 10); a leveling guide can leave
them out, as the Ranger's and Templar's did.

### 4.5 Stat priority and board path (single source)

Metabot's class page and class-builds guide (one site): **Attack > Critical Hit > MP > Accuracy Bonus > HP** (MP because
Robe of Earth's Critical Hit needs 50% MP and Grace of Enhancement's +20% PvE needs 25%). daevaguides says the same about
mana ("mana is damage, not comfort") without a full order. Board path: Metabot says Zikel first for the doubled Grace of
Enhancement nodes, then Nezekan's Fire Mark and Robe of Earth; daevaguides and aion2turkiye take Nezekan first (Combat
Speed and Cooldown Reduction, then Hellfire, Firestorm, Bittercold Wind nodes). Nezekan opens at 12, Zikel at 20, so a
leveling player meets Nezekan first either way. Label the stat order `single-source` and the board path `disputed`.

### 4.6 Rotation (two-source)

Metabot's leveling build, mmo-codex's "Levelling 1–30" tab and daevaguides give the same leveling loop in different
words: Bittercold Wind roots the target (100% on NPCs), Firestorm and Blaze on the marked target, Flame Arrow as the
filler that restores MP; on packs Ice Chain and Winter's Shackles slow, Frost freezes (100% on NPCs) for Frost Burst;
from 14 a fully charged Hellfire while the pack is rooted; from 12 Wish of Concentration, from 22 Element Enhancement
first. The conditions are CONFIRMED by the skill text (§1). Two cautions for the guide item:

- **Hellfire must be held to charge.** daevaguides [berdugz, EUTOPIA] and mmo-codex both say a macro fires it at charge 1
  (about a third of the damage). A rotation line that says "press Hellfire" should say "hold".
- **daevaguides and mmo-codex disagree on the key layout** they recommend (core line on Q vs E; ice line on RMB vs
  key 2). That is advice, not the default (§6). The Build drawer's Rotation section shows the game's default keys
  (ISSUES.md, Gladiator rotation), so it needs only §6.

## 5. Specialty texts that Metabot prints wrong

| Spec id | Metabot page | Game text | Game-text sources |
|---|---|---|---|
| `spec:sorcerer:flame-arrow:2` | Absorbs 100, 100% HP | Absorbs 1% HP | owner's screen (2026-10-19), mmo-codex, daevaguides, aion2turkiye |
| `spec:sorcerer:blaze:1` | Absorbs 300, 300% HP | Absorbs 3% HP | mmo-codex, daevaguides, aion2turkiye |
| `spec:sorcerer:flame-scattershot:1` | Absorbs 500, 500% HP | Absorbs 5% HP | mmo-codex, daevaguides |
| `spec:sorcerer:frost-burst:1` | Absorbs 700, 700% HP | Absorbs 7% HP | mmo-codex, daevaguides |
| `stigma:sorcerer:divine-burst` spec 2 (`spec:sorcerer:divine-burst:2`) | Absorbs 1000, 1000% HP | Absorbs 10% HP | mmo-codex, daevaguides |

The CSV keeps Metabot's text as read; the class-data item writes the game text (Game Data Check notes that gen's check
enforces this). Every other specialty text was read as printed. The two with a thousands comma ("Restores 1,000 Stamina" on Defiance,
"-1,000 Stamina" on Soul Freeze) are a plain number, not this bug: daevaguides gives Defiance's as "1000 Stamina"
(Soul Freeze's not checked).

## 6. Default keys (owner's screen)

From `/mnt/project-files/owner-screens/2026-10-19/sorcerer/NOTES.md` (`owner:2026-10-19-sorcerer-keys-01`, read by Game
Data Check). Row 0 fires first.

| Key | Skill(s) |
|---|---|
| Left click | Flame Arrow |
| Right click | Ice Chain (read from the screen: the right half of the mouse badge is lit) |
| 1 | Firestorm |
| 2 | Bittercold Wind (3) |
| 3 | Winter's Shackles (8) |
| 4 | Hellfire (14) |
| E | r0 Flame Scattershot (5), r1 Blaze (4), r2 Wish of Concentration (12) |
| Q | r0 Frost Burst (10), r1 Frost (7) |
| none | Defiance (16); daevaguides says the game keeps it on Space |

Same shape as the Ranger, Gladiator and Templar: conditional skills sit in row 0. That Blaze (also conditional) sits at
r1 under Flame Scattershot is read from the screen only. The key grid needs no other data.

## 7. Icons

All 35 skill and stigma icons, from Metabot, under the standing icon OK (owner, 2026-10-14). All 35 rather than only the
build plan's, because the picks are not settled (§4) and the key grid shows actives no build targets. Provenance rows
(file, name, source page, file URL, date) are in `docs/ISSUES.md` under "Sorcerer skill and stigma icons".

- **Where:** `data/packs/aion2/asmodian/sorcerer/icons/`, not wired into the app. `scripts/build.mjs` fails on any PNG in
  `src/assets/icons/` that `src/` does not reference, so the guide item moves the ones it shows there in the change that
  references them. The generator only reads `.json` under `data/packs/`.
- **Format:** 256 px WebP → 128 × 128 RGB PNG (Lanczos), like the other classes.
- **Names:** `sk-sorcerer-<slug>.png` and `st-sorcerer-<slug>.png`. The class is in the name because Defiance and
  Revitalization Contract are names other classes use. Slugs match the CSV ids.
- **Match:** each skill page links exactly one file under `/web/aion2/skills/` (5 references, all the same id) and its
  `<title>` names the skill ("<Name> – Sorcerer Skill | AION 2 | MetaBot.GG"), so the page-to-file match is read, not
  guessed. The 12 active ids are the ones Game Data Check listed on 2026-10-19. A contact sheet of all 35 was checked by
  eye: each file is distinct (no two hashes equal) and none is a placeholder. Frost and Frost Burst look alike (the same
  ice figure; Frost's icon adds a slash), which is the game's art, not a mix-up: they are different file ids on their own
  pages.
- **Uncertainty:** the file ids are what Metabot served on 2026-10-19. If Metabot reissues an icon the file URL may stop
  resolving; the page URL is the stable credit.

## 8. What depends on the owner

Nothing blocks the guide item. No learn-level check (§3), no stigma check, no icon fallback (§7), and every Metabot text
bug has the game text from two sources (§5).

## 9. Fetching record

Policy: `CLAUDE.md` and `docs/research/SOURCES.md` (every host used is listed there; no new site, so SOURCES.md is
unchanged). User-Agent `DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`, one request at a time, at least 5 s
apart on every host, cache 24 h, stop on 403 / 429 / a challenge (none happened). No page copy or WebP is committed;
only the CSVs and the converted PNGs.

- **metabot.gg (Full):** robots.txt and terms of service re-read first, before any content page (8:33–8:34 PM ET; robots
  first, terms 4 s later). robots.txt disallows only `/api/`, `/private/` and profile paths; nothing blocks Claude-User
  or our UA. Terms unchanged (effective 04/01/2026: "personal, non-commercial use", attribution required, "a reasonable
  request rate"). 76 requests in all (41 pages: robots, terms, class page, 35 skill pages, boards, build page,
  class-builds guide; 35 icon files), 8:33–8:45 PM ET, about 10 a minute.
- **Second sources, 8:39–8:40 PM ET:** mmo-codex terms re-read first (last updated 29 Aug 2026, unchanged: **Spot**, it
  bans "automated republication and scraped copies"), so one content page. robots.txt re-read on mmo-codex (blocks only
  `/api/`), daevaguides (allows Claude-User explicitly), skycoach (blocks only query-string paths) and aion2turkiye
  (allows all). One page each on mmo-codex, daevaguides and aion2turkiye. skycoach's Sorcerer guide URL was a guess
  (`/blog/aion-2/articles/sorcerer-guide`, by analogy with the Templar's) and returned 404; I did not search further,
  since three second sources were enough. Facts only, no wording kept.

**How independent the second sources are (inferred, not proven):** mmo-codex reads client data through aion2.app,
second-hand client data, not a copy of Metabot, and credits creators (berdugz, aLuckyRO, DankRNG) for its leveling
advice. daevaguides compiles creators (couga54, EUTOPIA, berdugz, aLuckyRO, ExpCarry and others; it also cites Game8 and
Metabot, which we don't count), so it counts once, for the creators it names. Where both name berdugz for the same
claim, I count it once (Absorb Essence, §4.1). aion2turkiye says its Lv 45 targets come from "the class's 25 most
developed players", a different sample from Metabot's 150.
