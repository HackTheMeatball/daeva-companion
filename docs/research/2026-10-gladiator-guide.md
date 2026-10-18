# Gladiator guide research (0.7 gate, `research-gladiator-guide`)

Research, 18 Oct 2026, 7:19–7:20 AM ET (fetches), written 7:20–7:45 AM ET. **Docs and research files only: no file
under `data/packs/`, `data/schema/` or `src/` was changed.** Input for a future Gladiator guide item (the Gladiator
equivalent of 0.6 P5, the Ranger guide). It checks [`2026-10-gladiator-pack.md`](2026-10-gladiator-pack.md) (the
"pack", PR #291, written before P4 and the P3 shared-guide split) against what the Ranger guide build actually needed
(`data/packs/aion2/asmodian/ranger/builds.json`, `guide/claims.json`) and adds what was missing, with second sources.

Labels as in the pack: CONFIRMED = read from a game-database field or agreed by two independent sources on this run;
GUESS = my inference, for the guide item to accept or change. Source names in brackets are the creators a compiler
site credits (see §9 for why that matters).

## 1. Summary

- **The pack is complete for the class data and has one voice for the advice.** Every advice field the Ranger guide
  filled (skill order, stigma slots and targets, stat priority, first nodes, key stacks) has a Metabot value in the
  pack, but all of it is `single-source` (three Metabot pages, one site), the training order is the page's list
  order, the board path is in words with no node ids, and there are no specialty picks and no rotation steps.
- **This run found second sources for most of it**, on four sites already allowed in `SOURCES.md`: mmo-codex.com
  (spot check), daevaguides.com, aion2turkiye.com, skycoach.gg. 13 requests (§10). With them:
  - **Learn levels Mocking Blade 3, Rush Strike 10, Ruinous Blow 14: two sources beyond Metabot** (§2). The pack's
    owner check item 2 can be dropped, as the Ranger's was.
  - **Specialty picks: eight skills have a two-source Lv 8 pick** (§4). The Ranger guide shipped none.
  - **Rotation: two-source steps exist** for single targets, packs and, from the Rage Burst stigma, a right-click
    stack (§8). The Ranger guide had no Rotation section; the Gladiator can have one.
  - **Stigma set two-source, slot order disputed** (§5). Metabot leveling, aion2turkiye leveling and daevaguides (solo
    option) take the same four: Lunge Stance, Zikel's Blessing, Lifestealing Blade, Rage Burst. Every source orders
    them differently.
  - **Skill targets: seven skills to Lv 10 are two-source** (§3), but two of them (Experienced Counterstrike,
    Murderous Burst) are absent from Metabot's build, and Metabot's Identify Weakness / Survival Stance at 10 is not
    backed by anyone else.
  - **Board path disputed** (§7): two sources start Nezekan on the Overhead Slam, Rending Blow and Ruinous Blow skill
    nodes; Metabot starts on the Attack Preparation and Survival Stance passive pairs.
  - **Stat priority stays single-source** (§6): the other sources rank post-45 gear stats, a different question.
- **New finding, P4 data bug:** five specialty texts in `data/packs/aion2/classes/gladiator/skills.json` carry an
  unfilled number, e.g. Crushing Wave "Absorbs 200, 200% HP" where the game reads "Absorbs 2% HP" (§11). Not visible
  today (the Gladiator is hidden); it would be the moment a guide shows these picks.
- **LEVEL_POINTS[45] = 203 now has a second source:** aion2turkiye's build panel says "Levelling to Lv45 gives 203
  points; quests and Sealed Dungeons give more".

## 2. Learn levels (closes pack §4 item 2)

| Skill | Metabot | [mmo-codex class page](https://mmo-codex.com/games/aion-2/classes/gladiator/) | [mmo-codex guide](https://mmo-codex.com/articles/aion-2-gladiator-guide/) | [daevaguides](https://daevaguides.com/en/gladiator/) |
|---|---|---|---|---|
| Mocking Blade | 3 | 3 ("Active learned at Lv 3", unlock list "Lv 3") | 3 | not stated (its bar layout changes at Lv 3; GUESS that is this skill) |
| Rush Strike | 10 | 10 | 10 | 10 ("You learn it at level 10") |
| Ruinous Blow | 14 | 14 | 14 | 14 ("You learn it at level 14") |

mmo-codex's unlock list matches Metabot for all 22 skills and the three flat gates (Experienced Counterstrike 21,
Survival Willpower 23, Murderous Burst 25; its guide: "Three late passives have no such gate in the game data").
**Verdict:** Rush Strike and Ruinous Blow are two-source plus a game-database field; Mocking Blade is Metabot plus
mmo-codex. Same caveat as the Ranger (#313): mmo-codex credits "the game client data published by aion2.app", so
the two may share upstream client data. Label it as the Ranger's claim C54 does.

## 3. Skill points

### 3.1 Targets by Lv 45

| Skill | Metabot leveling | daevaguides [couga54] | mmo-codex [aLuckyRO's fresh 45] | aion2turkiye leveling | Verdict |
|---|---|---|---|---|---|
| Rending Blow | 10 | 10 (core) | 10 | 10 | CONFIRMED 10 |
| Overhead Slam | 10 | 10 (core, 20 later) | 8 | 10 | CONFIRMED 10 |
| Ruinous Blow | 10 | 10 (core) | 10 | 10 | CONFIRMED 10 |
| Keen Strike | 10 | 10 at Lv 25 | 8 | 8 | 10, weak: Metabot + daevaguides (which cites Metabot, §9); two say 8 |
| Attack Preparation | 10 | 10 | 10 | 10 | CONFIRMED 10 |
| Experienced Counterstrike | not listed | 10 at Lv 21 | 10 | not listed (dungeon build: 10) | two-source 10, **Metabot silent** |
| Murderous Burst | not listed | 10 at Lv 25 | 11 (incl. +1) | not listed (dungeon build: 10) | two-source 10, **Metabot silent** |
| Leaping Slam | 10 | 8 | 8 | 10 | disputed (8 or 10) |
| Rush Strike | 10 | 8 | 8 | 8 | 8 (three sources); Metabot 10 |
| Crushing Wave | 7 | 8 | 8 | 10 | 8 (two sources) |
| Mocking Blade | 5 | 1 while leveling, 8 later | 8 | 0 ("don't spend") | disputed |
| Identify Weakness | 10 | "later" | 2–4 | 8 | single-source 10; disputed |
| Survival Stance | 10 | "when you have points left" | 2–4 | 8 | single-source 10; disputed |
| Blood Absorption | – | "no investment" (works at 1) | 10 | 10 | disputed |
| Impact Hit | – | 10 | 2–4 | 5 | disputed |
| Defiance | – | 1 (couga54) or 8 (Grobs, aLuckyRO) | 8 | 8 | disputed |

aLuckyRO's levels include bonus levels from outside the skill window (mmo-codex says so), so his column is an upper
bound. Experienced Counterstrike and Murderous Burst are flat-gated: each can take all 21 points the moment it is
learned (pack §2.1, CONFIRMED), which is why daevaguides and mmo-codex both say "straight to 10 when learned".

**Default for the guide (GUESS):** the seven skills to 10 (Rending Blow, Overhead Slam, Ruinous Blow, Keen
Strike, Attack Preparation, Experienced Counterstrike, Murderous Burst) = 7 × 21 = **147 points**; Rush Strike and
Crushing Wave to 8 (13 each, two-source); Leaping Slam to 8 (13, the lower of the disputed values) = **186**. That
leaves 17 of the 203 levelling points, plus Sealed Dungeon and quest points (daevaguides: 2 skill points per Sealed
Dungeon; aion2turkiye budgets 235 for its leveling build), for the disputed passives. Label Experienced Counterstrike
and Murderous Burst as two-source with a note that Metabot's build leaves them out.

### 3.2 Training order

Metabot gives targets only (pack §3). Two sources now give an order:

- **daevaguides** (from couga54's plan) gives point-by-point steps per character level: Rending Blow first, Overhead
  Slam from 4, then Keen Strike and Leaping Slam; Crushing Wave from 8; Rush Strike at 10 "low priority"; Ruinous Blow
  "right away" from 14; Experienced Counterstrike straight to 10 at 21 with Attack Preparation as the level allows;
  Murderous Burst straight to 10 at 25 with Impact Hit.
- **mmo-codex** (Inven, Society of Gaming, aLuckyRO) gives level blocks: Keen Strike and Rending Blow "to the highest
  level your character allows" first; Experienced Counterstrike and Murderous Burst to 10 when learned; Ruinous Blow
  to 8 at 32 and 10 at 38.
- **mmo-codex class page** (its own editorial): Overhead Slam → Rending Blow → Ruinous Blow → Crushing Wave, each to 8
  first, then to 10.

Agreed by at least two: **Rending Blow is the first point sink**; Keen Strike and Overhead Slam follow as soon as each
allows; **Ruinous Blow is raised as fast as its gate allows from 14**; **Experienced Counterstrike (21) and Murderous
Burst (25) go to 10 on the level they are learned** (the cheapest, since flat). Not agreed: whether Overhead Slam
or Keen Strike comes second (daevaguides and the mmo-codex class page say Overhead Slam; the mmo-codex guide says Keen
Strike), and where Leaping Slam and Crushing Wave sit. The guide's `skillOrderNotes.interleave` should say the order
above is two-source for those four rules and inferred between them.

## 4. Specialty picks (none in the pack)

Spec ids from `data/packs/aion2/classes/gladiator/skills.json`. All picks below are at skill Lv 8 unless shown; skill
Lv 12 needs Daevanion nodes on top of points (daevaguides: Rending Blow reaches 12 around Lv 25, Overhead Slam around
28 with two boards), so the Lv 12 rows are reachable before 45 but depend on the board plan.

| Skill | Pick (spec id) | Sources that take it | Dissent | Verdict |
|---|---|---|---|---|
| Rending Blow | Changes to mobile skill (`:3`) | daevaguides [Grobs, couga54], skycoach, aion2turkiye | mmo-codex [aLuckyRO]: −20% MP for mobs, mobile for bosses | CONFIRMED |
| Keen Strike | +20% MP restored (`:1`) | daevaguides ("everyone"), mmo-codex [aLuckyRO], skycoach, aion2turkiye | – | CONFIRMED |
| Leaping Slam | Resets cooldown on defeating an enemy (`:3`) | daevaguides, mmo-codex, skycoach, aion2turkiye | bosses: Prepare for Battle (`:1`) | CONFIRMED |
| Overhead Slam | Adds Upward Strike chain (`:3`) | daevaguides [couga54, Grobs, aLuckyRO], skycoach, mmo-codex class page | aion2turkiye leveling: AoE (`:2`); mmo-codex [aLuckyRO]: HP absorb (`:1`) | CONFIRMED (majority), note dissent |
| Crushing Wave | Absorbs 2% HP (`:1`) | daevaguides, mmo-codex [aLuckyRO], aion2turkiye | – | CONFIRMED |
| Rush Strike | +10 m range (`:2`) | mmo-codex [aLuckyRO], skycoach, daevaguides plan text | daevaguides skill card: 300 Stamina (`:1`, couga54) | CONFIRMED (majority) |
| Defiance | Restores 20% HP on use (`:3`) | daevaguides [Grobs, aLuckyRO], mmo-codex, skycoach, aion2turkiye | couga54: 1 point only while leveling | CONFIRMED (if Defiance gets 8) |
| Mocking Blade | HP absorb (`:1`) | mmo-codex [aLuckyRO], skycoach, daevaguides [couga54] | – | CONFIRMED (if it gets 8) |
| Ruinous Blow | – | +20% Skill Speed (`:1`): daevaguides majority, skycoach; +30% Skill Crit (`:3`): aion2turkiye, couga54, aLuckyRO; +12.5 m (`:2`): mmo-codex [aLuckyRO] | | **disputed**: leave out or show both |
| Rending Blow Lv 12 | +12% vs fewer targets (`:4`) | daevaguides, skycoach, mmo-codex | – | CONFIRMED |
| Overhead Slam Lv 12 | Critical Hit on hit (`:4`) | daevaguides [Grobs, aLuckyRO], skycoach, mmo-codex | – | CONFIRMED |
| Keen Strike Lv 12 | −1 s Ruinous Blow cooldown (`:4`) | daevaguides majority [incl. aLuckyRO, couga54], mmo-codex end game [Storyteller, xMontu] | Grobs, skycoach: Multi-Hit | CONFIRMED |

Several of these sources credit the same creators (aLuckyRO appears on daevaguides and mmo-codex), so the
"independent" count is lower than the column suggests; every CONFIRMED row still has at least two sources whose
upstream differs (e.g. couga54 vs aLuckyRO vs skycoach's own author). §9 has the independence notes.

## 5. Stigmas

### 5.1 Which four (two-source)

| Source | Slot 1 (22) | Slot 2 (27) | Slot 3 (32) | Slot 4 (37) |
|---|---|---|---|---|
| Metabot leveling (editorial) | Zikel's Blessing | Lunge Stance | Lifestealing Blade | Rage Burst |
| Metabot top players (Lv 45) | Lunge Stance | Zikel's Blessing | Rage Burst | Focused Block |
| daevaguides [couga54, Grobs] | Lunge Stance | Rage Burst | Zikel's Blessing | Focused Block (group) / Lifestealing Blade (solo) |
| aion2turkiye leveling | Lifestealing Blade | Lunge Stance | Zikel's Blessing | Rage Burst |
| aion2turkiye dungeon | Lunge Stance | Zikel's Blessing | Rage Burst | Focused Block |
| mmo-codex [Storyteller, Chopy; aLuckyRO] | Lunge Stance first; the six: Lunge, Zikel's, Focused Block, Lifestealing, Rage Burst, Wave Armor | | | |
| skycoach (endgame) | Rage Burst, Lunge Stance, Zikel's Blessing, Focused Block (not slot-ordered) | | | |

Daevaguides confirms the slot levels 22 / 27 / 32 / 37 (CONFIRMED with the shared rule). **The leveling set
{Lunge Stance, Zikel's Blessing, Lifestealing Blade, Rage Burst} is CONFIRMED** (Metabot leveling, aion2turkiye
leveling, daevaguides' solo option); Focused Block replaces Lifestealing Blade in group play in four sources.

**Slot order is disputed.** Lunge Stance first at 22 has four voices (Metabot top players, daevaguides, aion2turkiye
dungeon, mmo-codex); the two leveling builds disagree (Zikel's first, Lifestealing first). Rage Burst last at 37 has
both leveling builds. **Default (GUESS):** Lunge Stance (22), Zikel's Blessing (27), Lifestealing Blade (32), Rage
Burst (37), status `disputed`, with a claim listing each source's order (DATA-FORMAT-V2 §7 "a claim for each disputed
build choice"). If the guide wants Rage Burst's Overhead Slam window earlier (§8), daevaguides' order is the
alternative.

### 5.2 Target levels

About 30 shards by Lv 45 (pack §4.1; aion2turkiye "about 29 Stigma Shards by Lv45", same 1 / 2 / 4 / 8 bands on
mmo-codex). Targets: Metabot 8 / 7 / 5 / 4 (Zikel's, Lunge, Lifestealing, Rage Burst = 29); aion2turkiye Lifestealing
10, the others 5 (30); daevaguides Rage Burst 5 at 27 for its −15 s cooldown perk. **Rage Burst 5 is CONFIRMED**
(daevaguides, aion2turkiye, skycoach: the Lv 5 perk is the reason). **Default (GUESS):** Lunge Stance 8, Zikel's
Blessing 6, Lifestealing Blade 5, Rage Burst 5 = 11 + 7 + 5 + 5 = **28 shards**, within the 29 from levels alone.

## 6. Stat priority (stays single-source)

Metabot's class page and class-builds guide: Attack > Critical Hit > Accuracy Bonus (pack §3). The other sources rank
gear stats for after 45: skycoach (Cooldown Reduction, Double Chance very high; Critical Hit, Attack high; Accuracy
situational), daevaguides [KaidGames2, ExpCarry] (Combat Speed, Weapon Damage, Damage Boost, Front Damage), mmo-codex
[xMontu] (Might, Precision first). Different question, so not a contradiction and not a second source. Keep
Metabot's top three, `single-source`, as the Ranger does. Skycoach adds a caution worth a tip if a second source
appears: "There's a 50% critical hit ceiling in the Global client" (single source, not checked).

## 7. First Daevanion nodes (disputed)

Node ids from `data/packs/aion2/classes/gladiator/board-nodes.json` (checked by script on this run).

| Option | Nezekan (Lv 12) | Zikel (Lv 20) | Sources |
|---|---|---|---|
| A: active skill nodes | Overhead Slam `node:gladiator:nezekan:r4c5`, Rending Blow `…:nezekan:r7c5`, Ruinous Blow `…:nezekan:r13c7` | same order: Overhead Slam `…:zikel:r13c5`, Rending Blow `…:zikel:r7c13`, Ruinous Blow `…:zikel:r3c11` | daevaguides [couga54, Sen, Grobs] (full route, node by node), aion2turkiye ("Rending/Overhead/Ruinous +1 nodes" first) |
| B: passive pairs | Attack Preparation `…:nezekan:r11c3`, `…:nezekan:r7c10`; Survival Stance `…:nezekan:r5c3`, `…:nezekan:r13c9` | Murderous Burst `…:zikel:r4c5`, `…:zikel:r10c9` | Metabot class page (pack §3) |

I traced daevaguides' Nezekan route on our node grid: "↑ ← ↑ ↑ ↑ ← ←" from the start `r8c8` ends on `r4c5` (Overhead
Slam), "← ←" from its second node `r7c7` ends on `r7c5` (Rending Blow), "↓ ← ↓ ↓ ↓ ↓" from the start ends on
`r13c7` (Ruinous Blow). All three match our data, so its board layout and ours agree (CONFIRMED for those nodes).

**Default (GUESS):** option A, status `disputed`, claim lists Metabot's path. Two cautions: Ruinous Blow is learned at
14, after Nezekan opens at 12, so its node gets `requires.level: 14` (basis `sourced`, the skill's learn level), the
same pattern as the Ranger's Hunter's Soul; and Murderous Burst (option B) waits for 25 (pack §3). Whether a +1 node
on a not-yet-learned skill does anything is not stated by any source (owner in-game check if it matters).

## 8. Rotation and key stacks (two sources exist)

Game-data facts that every source repeats (CONFIRMED, game-database text on Metabot, aion2turkiye, daevaguides,
skycoach): Overhead Slam only hits a knocked-down target, with a 7% chance on a target with Incapacitated Immunity;
Rage Burst lets Overhead Slam be used on its target for 10 s; Ruinous Blow grants Prepare for Battle (+20% PvE damage)
for 20 s; Mocking Blade always knocks down for 3 s; Rush Strike after a dodge always knocks down NPCs; Sword Aura
Rampage only hits a Staggered target.

**Steps agreed by two or more sources** (wording is ours; facts only):

| Situation | Steps | Sources |
|---|---|---|
| Single target, any level | Close in with Leaping Slam → knock down (Mocking Blade, or dodge + Rush Strike from Lv 10) → Overhead Slam → Ruinous Blow whenever ready (from 14) → Rending Blow and Keen Strike until Overhead Slam is back | daevaguides, mmo-codex class page ("Levelling 1–25"), Metabot (paraphrase in the pack's builds CSV) |
| Packs | Leaping Slam → Crushing Wave → Rending Blow; Leaping Slam's reset on kill jumps to the next pack | daevaguides, mmo-codex class page; aion2turkiye opens Leaping Slam › Crushing Wave › Ruinous Blow |
| Mana | Keen Strike restores MP, Rending Blow spends it: alternate them (hold left button, right button when MP allows) | daevaguides, mmo-codex, skycoach |
| Bosses, from the buffs | Lunge Stance + Zikel's Blessing before the pull, then gap closer and the right-click line | daevaguides, skycoach |

**Right-click stack (the Assassin's `keyStacks.rightClick` shape), GUESS from two sources:**

| From Lv | Rows, highest priority first | Sources |
|---|---|---|
| 1 | Rending Blow | all |
| 5 | Sword Aura Rampage, Rending Blow | daevaguides [Antochi, Ulfhednar], mmo-codex class page (RMB "1st Sword Aura Rampage, 2nd Rending Blow") |
| Rage Burst's slot | Rage Burst, Overhead Slam, Sword Aura Rampage, Rending Blow | daevaguides [couga54, LuKKyLT, The_KentC] (Rage Burst / Overhead Slam / Sword Aura Rampage / Rending Blow); mmo-codex end-game macro (Ruinous Blow › Rage Burst › Overhead Slam › Rending Blow) |

Disputed: Overhead Slam in the right-click line before Rage Burst (daevaguides yes, mmo-codex puts it on its own key);
Ruinous Blow in the line (mmo-codex and skycoach yes; daevaguides keeps it on its own key or a separate macro line).
Keep Ruinous Blow and the buffs off the line, as the majority does. The `eOrder` analogue is the buff line Lunge
Stance → Zikel's Blessing (daevaguides) and stays `inferred` past that. With the §5.1 default Rage Burst joins at 37,
so the last row starts at 37; with daevaguides' order it starts at 27.

## 9. Independence (inferred, not proven)

- **Metabot** is one group (editorial builds, top-player panel, class page). Daevaguides lists metabot.gg among its
  sources ("general, low weight"), so a daevaguides value that only Metabot also has may be a copy; none of the
  CONFIRMED rows above rests on Metabot plus daevaguides alone except Keen Strike 10.
- **daevaguides** is a compiler: its plan is couga54's (aion2-guides.info, itself a compilation, SOURCES.md "credit
  the creator") and it cites a dozen YouTube creators. It also cites Game8; **no value above is taken from a row that
  daevaguides attributes only to Game8** (CLAUDE.md: no Game8), e.g. Overhead Slam AoE and Wrath Wave are left out.
- **mmo-codex** compiles creators too (aLuckyRO, xMontu, Storyteller, Sen, Inven) and takes client numbers from
  aion2.app. aLuckyRO is on both mmo-codex and daevaguides, so where only those two agree and both cite him, the row
  says so.
- **aion2turkiye** bases targets on "the class's 25 most developed players" plus its own leveling build; upstream not
  stated.
- **skycoach**: one named author's own play (boosting shop blog; SOURCES.md "guides are editorial").

## 10. Fetching record

Policy: CLAUDE.md "Fetching" and `docs/research/SOURCES.md` (all five hosts are on the allowed list; no new site
vetted, so `SOURCES.md` is unchanged, and K11 leaves it to Source Vetting anyway). User-Agent
`DaevaCompanionResearch/0.1 (+https://daevacompanion.com)`, one request at a time, at least 6 s apart per host, stop
on 403 / 429 / challenge (none seen). **13 requests, all 200, 7:19–7:20 AM ET 18 Oct**:
[`gladiator-guide-2026-10.requests.log`](../../data/research/gladiator-guide-2026-10.requests.log).

- robots.txt re-read on mmo-codex, daevaguides, skycoach, corpus.gg, aionbuilds, aion2turkiye. All allow our UA and
  Claude-User. Skycoach disallows `/en/`, not `/blog/`. Aionbuilds blocks ClaudeBot / Claude-Web / anthropic-ai only
  (training crawlers, not an opt-out per the owner's 2026-10-18 rule); no content page read there.
- mmo-codex `/terms/` re-read (Spot: "Automated republication and scraped copies are not permitted"): two content
  pages, 6 s apart, facts only.
- Content pages: mmo-codex Gladiator guide and class page, daevaguides Gladiator, skycoach Gladiator guide,
  aion2turkiye Gladiator; corpus.gg sitemap index only (its Gladiator page wasn't needed).
- Pages cached in the session scratchpad only; no copies committed. Not touched: aion2.th.gl, Game8, thegameswiki,
  aion2.app, metaroad, maxroll, sportskeeda.

## 11. Found on the way: P4 specialty texts with an unfilled number

`data/packs/aion2/classes/gladiator/skills.json`, compared with the game text on mmo-codex, daevaguides and
aion2turkiye (all three agree):

| Spec id | Ours | Game text |
|---|---|---|
| `spec:gladiator:crushing-wave:1` | Absorbs 200, 200% HP | Absorbs 2% HP |
| `spec:gladiator:keen-strike:2` | Absorbs 100, 100% HP | Absorbs 1% HP |
| `spec:gladiator:overhead-slam:1` | Absorbs 70, 70% HP | Absorbs 0.7% HP |
| `spec:gladiator:mocking-blade:1` | Absorbs 400, 400% HP, absorbs 1500, 1500% HP of target with … | Absorbs 4% HP, absorbs 15% HP of target with Incapacitated Immunity |
| `spec:gladiator:sword-aura-rampage:1` | Absorbs 500, 500% HP | Absorbs 5% HP |

Looks like the P4 parser printed a basis-point value where the page has a percent template (inferred). Proposed
follow-up, outside this research PR: fix the five texts, cite the Metabot skill pages, and grep the Ranger and Assassin
`specialtyChoices` for the same `NNN, NNN%` pattern. No visible change today (the Gladiator is hidden).

## 12. What this changes for the guide item

| Ranger P5 field | Gladiator: pack only | With this file |
|---|---|---|
| `skillOrder` | single-source targets, list order | 7 skills to 10 two-source, 4 order rules two-source (§3) |
| `specialtyPicks` | none | 11 picks two-source, Ruinous Blow disputed (§4) |
| `stigmaSlots` / `stigmaTargets` | single-source | set two-source, order disputed, Rage Burst 5 two-source (§5) |
| `statPriority` | single-source | unchanged (§6) |
| `boardPlan` | words only | node ids, disputed between two paths (§7) |
| `keyStacks` | none | right-click rows and steps, two sources, gaps marked (§8) |
| learn levels 3 / 10 / 14 | owner check | two sources (§2) |

Owner input left for the Gladiator guide: none required. Optional in-game look: whether a Daevanion +1 node on a
skill not yet learned counts (§7), and the five specialty texts (§11) if a screenshot is handy.
