# Cleric research pack (0.8 class research)

Research, 19 Oct 2026 (fetched 6:20–6:35 AM ET). **Docs, research files and staged icons only: no file under
`data/packs/`, `data/schema/` or `src/` was changed.** The Release Planner asked for this pack as 0.8 class research
(Cleric picked for best coverage, `2026-10-classes-and-gaps.md` §2.2). It does in one file what the 0.7 classes needed
two for: the class data, as in the [Spiritmaster pack](2026-10-spiritmaster-pack.md), and the leveling-guide research
with second sources, as in the [Gladiator guide research](2026-10-gladiator-guide.md). New this time (issue #441 item 4):
every skill and stigma icon is saved, with provenance rows in `docs/ISSUES.md` (§7). Read the
[Gladiator pack](2026-10-gladiator-pack.md) §2 for the CSV column meanings.

Labels: CONFIRMED = read from a Metabot game-database field on this run (rated B, client build 0.0.4387.0), or agreed
by two sources whose upstream differs; GUESS = my inference, for the guide item to accept or change. Names in brackets
are the creators a compiler site credits (§8).

## 1. Summary

- **Class data is complete, from Metabot, row by row with its page URL:** 22 skills, 13 stigmas, 112 specialization
  options, 537 board nodes. Every skill costs 1 / 2 / 4 points in the usual bands and every skill page's Daevanion list
  matches the boards page; the parser found no exceptions (CONFIRMED). All 537 board positions have the same type,
  grade, cost and stat label as the Assassin file: 0 differences by script (CONFIRMED), as on the four classes before.
- **Learn levels are the shared skeleton and two-source.** Actives 1, 1, 1, 3, 4, 5, 7, 8, 10, 12, 14, 16; passives
  1, 6, 9, 11, 13, 15, 17, 21, 23, 25. All 22 match mmo-codex's unlock table (§6.1). The same three late passives are
  flat-gated: Earth's Grace (21), Survival Willpower (23), Radiant Benediction (25). No owner check needed.
- **The guide has more second-source material than any class so far**: daevaguides (a full 1–45 plan), aion2turkiye
  (a separate leveling build), mmo-codex (a levelling rotation and point order) and skycoach all write about the Cleric
  as a damage dealer while leveling. With them:
  - **Six skills to Lv 10 are CONFIRMED** (Earth's Retribution, Judgment Thunder, Chain of Torment, Condemnation,
    Divine Aura, Healing Light), plus Earth's Grace, Empyrean Lord's Grace and Light of Regeneration with two
    sources; Bolt to 10 has two sources but Metabot leaves it out (§3).
  - **Specialty picks: nine skills have a two-source Lv 8 pick**, and Condemnation's Lv 12 cooldown reset is agreed
    by every source (§4).
  - **Stigma set is CONFIRMED with one swap disputed**: Earth Punishment, Light of Protection and Noble Aura in every
    leveling source; the fourth is Prayer of Amplification (four sources) or Summon Resurrection (Metabot). **Slot
    order is disputed**: Metabot puts Earth Punishment third, every other source first (§5).
  - **A right-click stack exists in two sources** (mmo-codex, aion2turkiye; Korean upstream likely shared), with
    daevaguides disagreeing on row order (§9).
  - **Stat priority is disputed**: Metabot ranks HP > Defense > MP for a party healer, while its own leveling build
    and three other sources build attack and crit while leveling (§6.2).
- **Two Metabot text bugs** of the kind the Gladiator had (`2026-10-gladiator-guide.md` §11), here on Metabot's own
  pages: Lightning Strike Scattershot specialty 1 reads "Absorbs 500, 500% HP" (aion2turkiye and daevaguides: "Absorbs
  5% HP"), and Healing Enhancement reads "22,400% of Attack" (aion2turkiye and skycoach: "22.4% of Attack"). The CSVs
  keep Metabot's text as read; the class item must use the corrected text (§10).
- **All 35 icons are saved** (22 skills, 13 stigmas), staged in `docs/research/icons-2026-10-19-cleric/` (§7).

## 2. Files

Same columns as the Gladiator, Ranger and Spiritmaster CSVs.

| File | Rows |
|---|---|
| [`cleric-skills-metabot-2026-10.csv`](../../data/research/cleric-skills-metabot-2026-10.csv) | 22 |
| [`cleric-specialties-metabot-2026-10.csv`](../../data/research/cleric-specialties-metabot-2026-10.csv) | 112 (12 actives × 5, 13 stigmas × 4) |
| [`cleric-stigmas-metabot-2026-10.csv`](../../data/research/cleric-stigmas-metabot-2026-10.csv) | 13 |
| [`cleric-board-nodes-metabot-2026-10.csv`](../../data/research/cleric-board-nodes-metabot-2026-10.csv) | 537 |
| [`cleric-builds-metabot-2026-10.csv`](../../data/research/cleric-builds-metabot-2026-10.csv) | 43, all `single-source` |
| [`cleric-metabot-2026-10.requests.log`](../../data/research/cleric-metabot-2026-10.requests.log) | 41 requests |
| [`cleric-second-sources-2026-10.requests.log`](../../data/research/cleric-second-sources-2026-10.requests.log) | 11 requests |
| [`cleric-icons-metabot-2026-10.requests.log`](../../data/research/cleric-icons-metabot-2026-10.requests.log) | 35 requests |

Script: `data/research/scripts-2026-10/cleric_csvs.py` (the Spiritmaster script with the class swapped and a per-name
note for shared skill names). Run it as `cleric_csvs.py <cache dir> <out dir>
data/packs/aion2/classes/assassin/board-nodes.json`. Its inputs come from the same steps as the Spiritmaster run:
`gladiator_skills.py` over the 35 skill pages gives `skills.json`; the Daevanion page goes through `extract.flight()`
and then `gladiator_boards.py` for `boards.json`. The builds CSV is transcribed by hand from the three pages in its
`page_url` column.

### 2.1 Skills (CONFIRMED)

| Skill | Type | Learn Lv | Gate | Char Lv for skill Lv 8 / 10 | Board nodes (+1 each) | Top-player pick |
|---|---|---|---|---|---|---|
| Earth's Retribution | active | 1 | stepped | 19 / 25 | Nezekan, Zikel, Vaizel, Triniel | 150 of 151 |
| Judgment Thunder | active | 1 | stepped | 19 / 25 | same | 150 of 151 |
| Debilitating Mark | active | 1 | stepped | 19 / 25 | same | 147 of 151 |
| Divine Aura | active | 3 | stepped | 21 / 27 | same | 150 of 151 |
| Chain of Torment | active | 4 | stepped | 22 / 28 | same | 150 of 151 |
| Lightning Strike Scattershot | active | 5 | stepped | 23 / 29 | same | 136 of 151 |
| Light of Regeneration | active | 7 | stepped | 25 / 31 | same | 150 of 151 |
| Condemnation | active | 8 | stepped | 26 / 32 | same | 150 of 151 |
| Healing Light | active | 10 | stepped | 28 / 34 | same | 150 of 151 |
| Radiant Recovery | active | 12 | stepped | 30 / 36 | same | 150 of 151 |
| Bolt | active | 14 | stepped | 32 / 38 | same | 147 of 151 |
| Defiance | active | 16 | stepped | 34 / 40 | same | not shown |
| Warm Benediction | passive | 1 | stepped | 19 / 25 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Empyrean Lords' Benediction | passive | 6 | stepped | 24 / 30 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Empyrean Lord's Grace | passive | 9 | stepped | 27 / 33 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Healing Enhancement | passive | 11 | stepped | 29 / 35 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Immortal Veil | passive | 13 | stepped | 31 / 37 | Nezekan ×2, Vaizel, Triniel | 150 of 151 |
| Heal Block | passive | 15 | stepped | 33 / 39 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Prayer of Concentration | passive | 17 | stepped | 35 / 41 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Earth's Grace | passive | 21 | **flat** | 21 / 21 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Survival Willpower | passive | 23 | **flat** | 23 / 23 | Zikel ×2, Vaizel, Triniel | 150 of 151 |
| Radiant Benediction | passive | 25 | **flat** | 25 / 25 | Zikel ×2, Vaizel, Triniel | 150 of 151 |

Active nodes cost 3, passive nodes 2. Every skill's max level is 40; specialty options open at skill Lv 8 / 8 / 8 / 12
/ 16 and slots at 8 / 12 / 20 (Metabot build page; mmo-codex, daevaguides and skycoach say the same, CONFIRMED). The
class page's active-skill table gives the same 12 unlock levels (same site: a consistency check).

Names to watch: **Empyrean Lords' Benediction** (apostrophe after the s) and **Empyrean Lord's Grace** (before it) are
two different passives; Metabot, mmo-codex, daevaguides and aion2turkiye all spell them this way. Two names are shared
with other classes: Defiance (Assassin, Ranger, Gladiator, Spiritmaster) and Survival Willpower (Gladiator). Their pages
use `-cleric` slugs; the CSV ids drop the suffix (`skill:cleric:defiance`), and `page_url` keeps the real address.

### 2.2 Stigmas

All 13 learn at Lv 22, cost 1 / 2 / 4 / 8 shards per level in bands of five for levels 1–20 and list effects at stigma
Lv 5 / 10 / 15 / 20 (CONFIRMED). Max level 25 on every stigma page and on the class page ("level up to 25"); one site,
so `maxLevel` stays `single-source` (it does not change a leveling guide). Top-player picks (of 151): Light of
Protection 131, Noble Aura 120, Earth Punishment 98, Summon Resurrection 96, Prayer of Amplification 75, Absolution 34,
Power Burst 30, Salvation 24, Benevolence 20, Yustiel's Power 14, Voice of Doom 7, Root 2; Assault Mark shows none.

## 3. Skill points

203 skill points and 29 stigma shards by Lv 45 from levels alone (Metabot build page; aion2turkiye: "Levelling to Lv45
gives 203 points", "about 29 Stigma Shards by Lv45"). CONFIRMED. Sealed Dungeons give 2 skill points each
(daevaguides, single source here).

### 3.1 Targets by Lv 45

| Skill | Metabot leveling | daevaguides plan [couga54] | aion2turkiye leveling | mmo-codex levelling | Verdict |
|---|---|---|---|---|---|
| Earth's Retribution | 10 | 10 (by 19–25) | 10 | 10 (first three) | CONFIRMED 10 |
| Chain of Torment | 10 | 10 (at 28) | 10 | 10 (first three) | CONFIRMED 10 |
| Condemnation | 10 | 10 (at 32) | 10 | 10 (first three) | CONFIRMED 10 |
| Judgment Thunder | 10 | 10 | 10 | packs only | CONFIRMED 10 |
| Divine Aura | 10 | 10 (32–38) | 10 | "after that" | CONFIRMED 10 |
| Healing Light | 10 | 10 (32–38) | 10 | "the heals" after | CONFIRMED 10 |
| Earth's Grace | 10 | 10 at 21 | 10 | passive priority 1 | CONFIRMED 10 |
| Empyrean Lord's Grace | 10 | 10 (from ~30, skill card) | 10 | passive priority 2 | CONFIRMED 10 |
| Light of Regeneration | 10 | 8 (38–45) | 10 | – | two-source 10, daevaguides 8 |
| Bolt | not listed | 10 (at 38) | 10 | after the first three | two-source 10, **Metabot silent** |
| Debilitating Mark | 7 | 8 (38+) | 10 | – | disputed (7, 8, 10) |
| Radiant Recovery | 5 | 8 (32–38) | 10 | – | disputed |
| Lightning Strike Scattershot | – | 8 (38+) | 8 | – | two-source 8, Metabot silent |
| Defiance | – | 8 (38+) | 8 | – | two-source 8, Metabot silent |
| Radiant Benediction | – | "raise" at 25 | 5 | – | disputed |
| Healing Enhancement | – | "raise" at 25 | 6 | – | disputed |
| Immortal Veil, Warm Benediction | – | – | 8, 8 | – | single source |

**Budget.** A skill at 10 costs 21 points (levels 2–10: 1+1+1+2+2+2+4+4+4). Metabot's build spends exactly 203:
nine skills to 10 (189) + Debilitating Mark 7 (9) + Radiant Recovery 5 (5). aion2turkiye's leveling build spends 321
("quests and Sealed Dungeons give more"), so it is a target, not a levels-only plan.

**Default for the guide (GUESS):** Metabot's nine at 10 (the six CONFIRMED plus Earth's Grace, Empyrean Lord's Grace
and Light of Regeneration, all two-source) = 189 points, then Debilitating Mark 7 and Radiant Recovery 5 to fill the
203, labelled `disputed`. Add a claim that two sources raise Bolt to 10 by 38 with quest and Sealed Dungeon points;
the levels-only budget can't fit it on top. Bolt can only reach 10 at character level 38 anyway (stepped from 14).

### 3.2 Training order

Metabot gives targets only. Three sources give an order:

- **daevaguides** (couga54's plan): Lv 1–5 all points into Earth's Retribution and Judgment Thunder; Chain of Torment
  (from 4) and Condemnation (from 8) "up as far as the game allows"; Earth's Retribution and Judgment Thunder to 8 at
  ~19 and 10 by 25; Earth's Grace straight to 10 at 21; Chain of Torment 10 at 28, Condemnation 10 at 32, Bolt 10 at
  38; heals to 10 at 32–38. "While leveling, points go into attacks, not heals."
- **mmo-codex** (levelling 1–30): "Condemnation → Chain of Torment → Earth's Retribution: first to level 8, then to
  10. After that Bolt, Divine Aura and the heals." "The first dungeons need almost no healing, so build for damage."
- **skycoach**: "While leveling up, it's best to go for damage skills." Metabot's leveling build says the same in its
  own notes ("while leveling you kill more than you heal").

Agreed by at least two: **attack skills before heals while leveling** (four sources); **Chain of Torment and
Condemnation are raised as fast as their gates allow** (daevaguides, mmo-codex); **Earth's Grace goes to 10 the level
it is learned** (daevaguides; mmo-codex ranks it the first passive; it is flat-gated, so all 21 points fit at 21).
Not agreed: whether Earth's Retribution and Judgment Thunder (daevaguides) or Condemnation's pair (mmo-codex) take
the first points. Before Lv 8 Condemnation doesn't exist, so the two orders only differ from Lv 8 to ~19; the guide's
`skillOrderNotes.interleave` should say the rules above are two-source and the order between them is inferred.

## 4. Specialty picks

Spec ids from the Metabot specialties CSV (`spec:cleric:<skill>:<n>`, n = Metabot's list position). mmo-codex and
skycoach number options the same way (top to bottom of the game's list); where a site wrote text instead, it was
matched to Metabot's text. The character level each Lv 8 pick opens at is in §2.1.

| Skill | Lv 8 pick (spec id) | Sources that take it | Dissent | Verdict |
|---|---|---|---|---|
| Chain of Torment | +3s Damage over Time (`:2`) | mmo-codex, daevaguides plan, aion2turkiye (both builds), skycoach | daevaguides: Lucia, couga54 since Oct 7 take Knockdown (`:3`) for hard dungeons | CONFIRMED |
| Healing Light | +2 consecutive uses (`:1`) | daevaguides ("every source agrees"), mmo-codex, aion2turkiye, skycoach | – | CONFIRMED |
| Bolt | +30% Skill Speed (`:3`) | mmo-codex, daevaguides ("everyone takes this"), aion2turkiye, skycoach | daevaguides: Lucia pairs it with +300 Accuracy (`:2`) | CONFIRMED |
| Radiant Recovery | −3s cooldown (`:3`) | mmo-codex, daevaguides plan, aion2turkiye (both), skycoach | – | CONFIRMED |
| Light of Regeneration | +20% healed at 50% HP or less (`:2`) | mmo-codex, aion2turkiye (both), daevaguides majority [Lucia, aLuckyRO, Th3Ruthless] | couga54, skycoach: +5% Defense (`:1`) | CONFIRMED (majority) |
| Debilitating Mark | −15% target Defense (`:2`) | daevaguides plan, aion2turkiye (both), skycoach | mmo-codex: free + 150 MP (`:1`) "at the start" | CONFIRMED (majority) |
| Lightning Strike Scattershot | Restores 120 MP (`:2`) | mmo-codex, aion2turkiye ("uncertain lv8 pick") | daevaguides [aLuckyRO]: MP or mobile (`:3`) | CONFIRMED, weak |
| Divine Aura, leveling | Changes to AoE Skill (`:2`) | daevaguides plan [aLuckyRO], aion2turkiye leveling | – | CONFIRMED for leveling |
| Divine Aura, bosses | +50% attacking speed (`:3`) | mmo-codex, aion2turkiye dungeon, skycoach, daevaguides majority | – | CONFIRMED for dungeons |
| Earth's Retribution | – | +20% MP restored (`:1`): mmo-codex, daevaguides majority [aLuckyRO, KaidWOW, Th3Ruthless]; +20% Discharge (`:2`): aion2turkiye (both), skycoach | | **disputed** (2 vs 2) |
| Judgment Thunder | – | −20% MP (`:1`): mmo-codex, aion2turkiye leveling; +12% fewer targets (`:2`): daevaguides plan, aion2turkiye dungeon, skycoach | | **disputed** |
| Condemnation | Up to +12% vs fewer targets (`:2`) | mmo-codex, aion2turkiye dungeon, skycoach | aion2turkiye leveling: +100 MP (`:1`) | CONFIRMED (majority) |
| Defiance | – | +10% HP (`:3`): aion2turkiye; Lucia via daevaguides: "doesn't matter" | | leave out |
| **Condemnation Lv 12** | Resets cooldown on a Critical Hit (`:4`) | every source (daevaguides: "Every source agrees") | – | CONFIRMED |
| Chain of Torment Lv 12 | +10% PvE Damage Tolerance reduction (`:4`) | mmo-codex, skycoach, daevaguides [aLuckyRO "priority number one"] | – | CONFIRMED |
| Bolt Lv 12 | Up to +20% vs fewer targets (`:4`) | mmo-codex, skycoach | – | CONFIRMED |

**Condemnation Lv 12 is the guide's key moment** (every source): skill Lv 10 from points (character Lv 32) plus the
two Condemnation board nodes, Nezekan and Zikel (daevaguides; node ids in §6.3). With Earth Punishment Lv 5 on the
target (§5), every Condemnation crits and resets itself. Before 12 it is a 3 s cooldown skill (mmo-codex). The
Earth's Retribution and Judgment Thunder rows are the two the guide should show both options for, or leave out.

## 5. Stigmas

### 5.1 Which four

| Source | Slot 1 (22) | Slot 2 (27) | Slot 3 (32) | Slot 4 (37) |
|---|---|---|---|---|
| Metabot leveling (editorial) | Light of Protection | Noble Aura | Earth Punishment | Summon Resurrection |
| Metabot top players (Lv 45) | Light of Protection 87% | Noble Aura 79% | Earth Punishment 65% | Summon Resurrection 64% |
| Metabot class-builds guide | same as leveling | | | |
| daevaguides plan [couga54] | Earth Punishment (+1 point Summon Resurrection, swap-in) | Noble Aura | Prayer of Amplification | Light of Protection |
| aion2turkiye leveling | Earth Punishment, Light of Protection, Noble Aura, Prayer of Amplification (listed, not slot-ordered) | | | |
| mmo-codex levelling | "From level 22: Earth Punishment and Light of Protection first, then Prayer of Amplification and Noble Aura" | | | |
| skycoach (random dungeon groups) | Earth Punishment, Prayer of Amplification, Light of Protection, Summon Resurrection (not slot-ordered) | | | |

**Earth Punishment, Light of Protection and Noble Aura are CONFIRMED** (every leveling source above; skycoach swaps Noble
Aura in when a Chanter is present). **The fourth is disputed:** Prayer of Amplification (daevaguides, aion2turkiye,
mmo-codex, skycoach) or Summon Resurrection (Metabot; skycoach for random groups). Summon Resurrection for dungeons
has three voices: Metabot (slot 4), skycoach (random groups) and daevaguides (1 point as a swap-in).

**Slot order is disputed.** Earth Punishment first at 22 has four voices (daevaguides, aion2turkiye's listing, mmo-codex,
and the mechanics: its Lv 5 effect makes Condemnation always crit, which every source calls the core of the class);
Metabot puts it third. **Default (GUESS):** Earth Punishment (22), Light of Protection (27), Noble Aura (32), Prayer of
Amplification (37), status `disputed`, with a claim listing Metabot's order and a tip that Summon Resurrection takes a
slot in dungeons. The Chanter conflicts (Light of Protection doesn't stack with Undefeated Mantra; Earth's Blessing
doesn't stack with Power of the Storm) are in Metabot's class-builds guide, daevaguides and mmo-codex: a tip, not a
leveling step.

### 5.2 Target levels

29 shards by Lv 45 (§3). **Earth Punishment 5 at 22 is CONFIRMED** (daevaguides "every source", aion2turkiye, mmo-codex:
the Lv 5 crit effect is the reason). Targets: Metabot 8 / 7 / 5 / 4 (Light of Protection, Noble Aura, Earth Punishment,
Summon Resurrection = 11 + 9 + 5 + 4 = 29); aion2turkiye 10 / 5 / 5 / 10 (Earth Punishment, Light of Protection, Noble
Aura, Prayer of Amplification = 40, beyond levels alone); daevaguides Prayer of Amplification "5, then 10".
**Default (GUESS):** Earth Punishment 9, the other three 5 = 13 + 5 + 5 + 5 = **28 shards**, within the 29.

## 6. Second sources, stats and board

### 6.1 Learn levels

| What | Metabot | [mmo-codex](https://mmo-codex.com/games/aion-2/classes/cleric/) | [daevaguides](https://daevaguides.com/en/cleric/) |
|---|---|---|---|
| All 22 learn levels | §2.1 | same 22 values ("What unlocks at each character level") | consistent where stated: Chain of Torment 4, Condemnation 8, Healing Light 10, Bolt 14, Defiance 16, Earth's Grace 21, Radiant Benediction 25 |
| Stepped gate (+3 per skill level) | read per skill | stated ("Condemnation reaches 8 at character level 26, Bolt at 32") | stated ("raises a skill's cap by 1 level every 3 character levels") |
| Specialty unlocks 8 / 12 / 16, slots 8 / 12 / 20 | build page | stated | stated |

**Verdict:** all 22 learn levels two-source (Metabot + mmo-codex). Same caveat as the Ranger (#313): mmo-codex credits
client data published by aion2.app, so the two may share upstream client data; label as the Ranger's claim C54 does.

### 6.2 Stat priority (disputed)

Metabot class page and class-builds guide (editorial, one site): HP > Defense > MP > Critical Hit Resist > Attack, for
"a party healer". Against it, for leveling: Metabot's own leveling build ("Crit and crit-damage passives over
heal-boost"), aion2turkiye leveling ("Prefer Attack and Crit nodes over HP while leveling"), daevaguides ("points go
into attacks"), skycoach (Accuracy, Critical Hit, Attack, Damage Boost, Combat Speed; gear stats). GamesFuze splits a
healer list (HP, Defense) from a hybrid list (Attack, Critical Hit). **Default (GUESS):** don't show Metabot's HP-first
order as the leveling stat priority; show it `disputed` with a claim that the leveling sources build attack and crit,
or leave the field out for the Cleric. The Ranger and Gladiator kept Metabot's order because nothing contradicted it;
here something does.

### 6.3 First Daevanion nodes

Node ids from the board-nodes CSV, checked by script.

| Option | Nezekan (Lv 12) | Zikel (Lv 20) | Sources |
|---|---|---|---|
| A: orange nodes, then skill nodes | Cooldown Reduction `node:cleric:nezekan:r3c13`, `…:r13c3`; Combat Speed `…:r13c13`, `…:r3c3`; Condemnation `…:nezekan:r5c11`, Divine Aura `…:r11c8`, Bolt `…:r13c7`, Chain of Torment `…:r4c5`, Light of Regeneration `…:r12c11` on the way | Earth's Grace `…:zikel:r6c7`, Divine Aura `…:r7c5`, Condemnation `…:zikel:r9c3`, Radiant Benediction `…:r10c9` | daevaguides [couga54] (route node by node), aion2turkiye leveling (Combat Speed corners, then Condemnation, Judgment Thunder `…:nezekan:r7c5`, Light of Regeneration; Zikel Earth's Retribution `…:zikel:r5c3`, Judgment Thunder `…:zikel:r7c13`) |
| B: passive pairs | Healing Enhancement `…:nezekan:r5c13`, `…:r9c6`; Warm Benediction `…:r5c3`, `…:r13c9` | Radiant Benediction `…:zikel:r4c5`, `…:r10c9` | Metabot class page and class-builds guide |

Metabot's top players point to option A too: their most-picked skill nodes are Light of Regeneration (98%),
Condemnation (95%) and Judgment Thunder (93%) on Nezekan, and Earth's Retribution (92%) on Zikel (build page, a pick
rate, not a path). I traced daevaguides' arrows on our grid from the start `r8c8`: Immortal Veil `r7c10`, Condemnation
`r5c11`, Empyrean Lord's Grace `r3c11` and `r13c5`, Divine Aura `r11c8`, Light of Regeneration `r12c11`, Chain of
Torment `r4c5`, Bolt `r13c7`, the two Cooldown Reduction and two Combat Speed corners on Nezekan; Earth's Grace `r6c7`,
Divine Aura `r7c5`, Condemnation `r9c3` and Radiant Benediction `r10c9` on Zikel. All land on the node it names, so
its board layout and ours agree (CONFIRMED for those nodes).

**The Condemnation node on Nezekan is CONFIRMED** (daevaguides, aion2turkiye, Metabot top players). **Default
(GUESS):** option A, status `disputed`, claim lists Metabot's passive-pair path; the Zikel Condemnation node gets
`requires.level: 20` and is the one that, with skill Lv 10 at 32, opens the Lv 12 reset (§4). Radiant Benediction (B)
is learned at 25, after Zikel opens at 20: `requires.level: 25` (basis `sourced`), the Spiritmaster's Element
Unification pattern.

## 7. Icons

All 35 skill and stigma icons, fetched 19 Oct 2026, 6:31–6:35 AM ET, under the standing icon OK (CLAUDE.md, owner
2026-10-14) and the `metabot.gg` row in SOURCES.md. Saved as `sk-<slug>.png` (22 skills) and `st-<slug>.png` (13
stigmas), 128 × 128 RGB PNG from Metabot's 256 px WebP (Lanczos), like the Assassin's and Ranger's, in
[`icons-2026-10-19-cleric/`](icons-2026-10-19-cleric/). Provenance rows (source page, file URL, date) are in
`docs/ISSUES.md`, Cleric icons bullet. Slugs match the CSV record ids.

- Each skill page links exactly one file under `/web/aion2/skills/`, all 35 ids differ, and each page's `<title>`
  names the skill ("<Name> – Cleric Skill | AION 2 | MetaBot.GG"), so the page-to-file match is read, not guessed.
- A contact sheet was checked by eye: 35 distinct icons, no placeholder, same art style as the shipped Assassin and
  Ranger icons from the same path. Not compared with an owner screen (there is no Cleric screen yet), so that each
  file is the in-game icon is inferred from the source, as for the Ranger.
- They are staged, not wired in: `scripts/build.mjs` fails on a PNG in `src/assets/icons/` that `src/` doesn't
  reference, so the class item moves the ones its build plan shows. All 35 are kept so any plan has its files; the
  unused ones stay in `docs/research/`.

## 8. Independence (inferred, not proven)

- **Metabot** is one group (editorial builds, top-player panel, class page, class-builds guide).
- **daevaguides** compiles couga54's plan (itself Kaeria's build) and a dozen creators (aLuckyRO, Lucia, Antochi,
  Th3Ruthless, KaidWOW …). It lists MMO Codex among its sources and Metabot only for Arcana. It also cites Game8; **no
  value above is taken from a row daevaguides credits only to Game8** (CLAUDE.md: no Game8), e.g. Power Burst as the
  fourth stigma. Where daevaguides and mmo-codex agree and daevaguides credits only MMO Codex, the row says so.
- **mmo-codex** compiles Korean guides, the aion2t.com meter and aLuckyRO; client numbers via aion2.app.
- **aion2turkiye** says its builds come from "a community PvE guide prepared for the Global launch" (upstream not named)
  and its targets from the 25 most developed players. Its macro is "Korean-style", like mmo-codex's, so their shared
  right-click stack (§9) may have one upstream.
- **skycoach**: one named author (Dallon Avery), updated 19.10.2026; a boosting shop's blog, editorial (SOURCES.md).
- **GamesFuze**: generic healer/hybrid advice, not leveling-specific; used only as colour, never as a counted source.

## 9. Rotation and key stacks

Game-data facts every source repeats (CONFIRMED, Metabot skill text plus at least two of daevaguides, mmo-codex,
aion2turkiye, skycoach): Condemnation only hits a target under Chain of Torment; Lightning Strike Scattershot only hits a
Staggered target; Earth Punishment Lv 5 makes Condemnation on its target a Critical Hit; Earth's Retribution restores
110 MP per use; Bolt charges in three levels. Light of Protection is a toggle that a second press turns off
(daevaguides, mmo-codex; not in the game text Metabot shows).

**Right-click stack (the Assassin's `keyStacks.rightClick` shape), two sources:**

| From Lv | Rows, highest priority first | Sources |
|---|---|---|
| 4 | Chain of Torment | all |
| 8 | Divine Aura, Condemnation, Chain of Torment | mmo-codex ("Until character level 22 the right mouse button stack is Divine Aura → Condemnation → Chain of Torment"); aion2turkiye leveling macro (same three below Earth Punishment) |
| 22 | Earth Punishment, Divine Aura, Condemnation, Chain of Torment | mmo-codex, aion2turkiye (both builds); daevaguides mentions it as Antochi's Korean variant |

Left click: Earth's Retribution, held (every source: it is the mana). Bolt and the heals stay off the stack (every
source). aion2turkiye adds Judgment Thunder at the bottom for packs; mmo-codex keeps it on its own key.

**Disputed:** daevaguides (couga54 after Lucia) puts Chain of Torment above Condemnation and moves Divine Aura to a
second chain with Light of Regeneration and Judgment Thunder, then adds Prayer of Amplification at the top from 32.
mmo-codex says Chain of Torment "has to be last", or Condemnation never fires. Both work in game per their authors; the
majority shape above is the default (GUESS). Same caveat as the Gladiator: the Build drawer's Rotation section is
written for the Assassin's keys (ISSUES.md), so whether this can be shown is the class item's call.

**Steps agreed by two or more** (wording is ours): single target: Chain of Torment, Condemnation while it holds, Divine
Aura on cooldown, Earth's Retribution between (daevaguides, mmo-codex, Metabot leveling paraphrase in the builds CSV);
packs: Chain of Torment on the pack, then Condemnation and Judgment Thunder (daevaguides, mmo-codex, aion2turkiye); from
22, Earth Punishment before Condemnation on bosses (daevaguides, mmo-codex, aion2turkiye, skycoach); heal by hand only
when HP drops (Metabot, daevaguides, mmo-codex).

## 10. Text fixes the class item needs

| Record | Metabot text (as in the CSVs) | Corrected | Sources for the correction |
|---|---|---|---|
| `spec:cleric:lightning-strike-scattershot:1` | Absorbs 500, 500% HP | Absorbs 5% HP | aion2turkiye, daevaguides |
| Healing Enhancement passive (skill text, not a CSV field) | Heal Boost by 22,400% of Attack | Heal Boost by 22.4% of Attack | aion2turkiye, skycoach |
| `spec:cleric:radiant-recovery:2` | +1 consecutive use | keep | Metabot is current: mmo-codex's 18 Sep client data still had "+20% Skill Speed"; daevaguides, aion2turkiye and skycoach have "+1 consecutive use" (changed in Korea 16 Sep, on global from launch) |

Same pattern as the Gladiator's five (`2026-10-gladiator-guide.md` §11): Metabot prints a basis-point value into a
percent template (inferred). The class item should grep its Cleric `specialtyChoices` for `NNN, NNN%` before shipping.

## 11. What depends on the owner

1. **Which two classes 0.8 ships** (Release Planner and owner). This pack assumes the Cleric is one.
2. **No learn-level check needed** (§6.1). If the owner wants a spot check on a level 1 Cleric anyway: **Divine Aura 3,
   Lightning Strike Scattershot 5, Bolt 14**.
3. No stigma check (Gladiator pack §4.1). No icon needs the owner (§7).
4. Optional: the stat priority (§6.2) is a product call if the guide wants one at all; the default is to show it
   `disputed` or leave it out.

## 12. Fetching record

Policy: CLAUDE.md "Fetching" and `docs/research/SOURCES.md` (every host is on the allowed list; no new site was
vetted, so SOURCES.md is unchanged). User-Agent `DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`, one
request at a time, at least 5 s apart across all hosts, cache 24 h, stop on 403 / 429 / a challenge (none seen).
**87 requests, all 200.** No page copy is committed; pages were cached in the session scratchpad only.

- **Metabot** (6:20–6:25 AM ET): robots.txt re-read (allows everything except `/api/`, `/private/` and profile pages;
  nothing blocks Claude-User or our UA); terms of service re-read (effective 04/01/2026, unchanged; "Data Usage &
  Attribution (AI Agents & Automated Tools)" requires a dofollow link to the page the data came from); the class page,
  35 skill pages, the Daevanion page, the build page, the class-builds guide. 41 requests.
- **Second sources** (6:27–6:28 AM ET): robots.txt re-read on mmo-codex (blocks only `/api/`), daevaguides (allows
  Claude-User explicitly), aion2turkiye (allows all), gamesfuze (blocks only search) and skycoach (blocks `/en/` and query-string
  patterns, not `/blog/`); mmo-codex `/terms/` re-read (Spot: "Automated republication and scraped copies are not
  permitted"), so one content page there; then the Cleric pages on mmo-codex, daevaguides, aion2turkiye, gamesfuze
  and skycoach. 11 requests.
- **Icons** (6:31–6:35 AM ET): the 35 WebP files linked from the skill pages already read. 35 requests.

Not touched: aion2.th.gl, Game8, thegameswiki, aion2.app, aion2.gaming.tools, games.gg, mobalytics, maxroll. The
candidate guides in `2026-10-classes-and-gaps.md` §2.2 that aren't on the allowed list (ExitLag, pixelnitro, OSLink)
weren't needed; games.gg and Mobalytics are Fail rows.
