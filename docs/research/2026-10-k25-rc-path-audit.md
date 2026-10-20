# K25: every fact on the 0.8 RC play path (#586), sourced or labelled (owner note 16)

Game Data Check, 2026-10-20, for the 0.8 kaizen review (#599, K25). The question: does every game fact the player saw on
Player Testing's RC path (#586) have a source, or a label that reaches the page?

## Result

- **Game facts:** 1,057 visible fields. 770 are game-db, owner or 2+ sources, and 258 are labelled in the data. 29 were
  defects (15 mislabelled, 14 unsourced), all listed in (b) below. One more is a **wrong fact** the field audit couldn't
  see, because its source looked fine.
- **Wrong fact, fixed here:** Assassin Defiance cited `metabot.gg/en/aion-2/skills/defiance`, which is the *Gladiator's*
  Defiance. Metabot gives each class its own page; the Assassin's is `/skills/defiance-assassin`. So the Assassin record
  carried the Gladiator's specialty 1, "Adds [Wrath Burst] Chain Skill". The Assassin page says "Adds [Storm Slice] Chain
  Skill". The other four choices and the learn level (16) are the same on both pages. The text isn't compiled into the
  build (the guide has no Defiance pick), so the player never saw it. I checked every skill name shared between classes
  (armor-of-balance, attack-preparation, defiance, impact-hit, revitalization-contract, survival-willpower): every other
  record cites its own class's page.
- **Fixed here (data only, no visible change):**
  - The 11 Assassin `learnLv` values now cite each skill's Metabot page. I fetched all 11 on 2026-10-20 and each matches.
    Before, they rested only on the class page.
  - The `lv` of Prepare to Escape (2), The Being Beneath the Lake (5) and Spread Your Wings (6) now cites its Metabot
    quest page ("Episode · Asmodian · Lv. N", fetched 2026-10-20). Before, they rested on aion2hub alone.
- **Not fixed here:**
  - **The 13 Assassin icons with no provenance row** (ISSUES "Icon provenance not recorded"). This needs a file-by-file match
    against Metabot. Next item.
  - **The name "Shugo-of-All-Trades: Asmodian" (rq:2202044).** Metabot's page title is "Shugo-of-All-Trades" (its URL slug
    has `-asmodian`). No source has the ": Asmodian" suffix, so it's listed for an owner in-game check.
  - **`rule:stigma-slots`.** It rests on Metabot's content-unlocks page. Whether that counts as a game-db page is a
    policy question for the audit.
  - **Labels that never reach the page (230 fields: plan rows, stigma plan, picks, core skill order, story turn-in zones).**
    This is a build gap for 0.9: the data has the label, but the renderers drop it.
  - **Choice points with no recommendation** (section d). These are the input to `2026-10-choice-points.md` (Release
    Planner, 0.9).

## Audit (read-only pass over main at bc6c9ad)

Path checked: the Ishalgen story from "A Village in the Fog" to "Finding Nemon" (11 quests, shared Asmodian data);
"Shugo-of-All-Trades: Asmodian" (rq:2202044); all 8 classes up to Lv 30 (skills learned by 30, icons, specialty picks,
stigma plan, boardPlan rows to Lv 30 and their nodes, boards that open by 30, stat priority, key setup). Also the shared
rules these screens use (node costs, specialty slots, skill point costs, level points, stigma slots and shards).
Read-only pass over the data (no fetching); the scripts were scratch and are not kept.

## Method and assumptions

- Each field's refs are the record's `sources` whose `fields` name it (prefix match both ways: `giver` covers `giver.npc`),
  plus refs that have no `fields` (they cover the whole record). Status = `fieldStatus[f]`, else the sub-item's own
  `status` (skillOrder rows, boardPlan rows, statPriority, keyStacks), else the record's `status`. These are the
  generator's rules (`tools/gen/gen.mjs` `unverified`).
- Order of checks: a status that isn't `verified` → **labelled**. Otherwise owner ref → **owner**; a game-db URL →
  **game-db**; 2+ independence groups (`sources.json independenceGroup`) → **verified-2src**; one non-game-db URL or only
  `inferred` refs → **MISLABELLED**; nothing → **UNSOURCED**.
- Game-db = aion2.gaming.tools, or the Metabot paths `/quests /skills /daevanion /map /dungeons /zones /items /stats`.
  Metabot `/classes/…` and `/guides/…` count as guide pages (editorial). `/content-unlocks` is a borderline case and I
  counted it as a guide page (see rule:stigma-slots below).
- Icons: game art, not a fact, but CLAUDE.md requires a provenance row for each one. An icon counts as sourced when
  `docs/ISSUES.md` has a table row with a URL for the file name, or for its staged name (the Cleric files were logged as
  `sk-bolt.png` and shipped as `sk-cleric-bolt.png`: 17 icons matched only that way).
- What is visible, taken from the renderers (where I had to assume, it says so):
  - Story: `QUESTS` (name, lv, levelsUp), `QUEST_STEPS` (objective text, including "(Kibelisk: X)"), `QUEST_LOC`
    (turn-in NPC, place, Kibelisk, meters, turn-in zone), `STORY_UNLOCKS`, map and place points (`steps[].at`, coords),
    gates (`requires`). Giver fields feed only the place / travel graph (assumed visible as map pins). Story `rewards`
    aren't compiled, so they aren't shown.
  - Regional quest: the `RQ` row (name, rec, unlock level, zone with `zoneSt`, giver NPC / place / Kibelisk / m, reward
    line, XP, Wisdom / Crystal), steps, requires.
  - Skills: every skill learned by 30 that is in `skillOrder` or the key data. 3 Assassin skills in neither (Apply
    Poison, Defiance, Revitalization Contract) are counted but are probably not shown.
  - Stigma record `availableLv` is assumed shown. `maxLevel` is never rendered, so it is left out.
  - Class guide step prose (`g12:0` … `g30:0`, `build:triggers`, `build:rotation`) is checked separately (section e):
    its facts come from claims and from other records.
- UI tags that exist (`src/packs/aion2/data/markup.js stTag`): "check in game" (disputed, owner-check) and "inferred",
  but only on a skill's `learnLv` (`learnSt`), a regional quest's zone (`zoneSt`), a stronghold's level and a dungeon
  entrance. There's a "single source" tag only on non-core skill-order rows (`SP_EXTRA single`). Nothing else carries
  a status to the page. The last column of table (a) counts labelled fields whose label never reaches the page.

## (a) Counts

Per scope (1,057 visible fields; 17 skills without an icon show initials and aren't counted):

| scope | verified-2src | game-db | owner | labelled | UNSOURCED | MISLABELLED | total | labelled, no tag in UI |
|---|---|---|---|---|---|---|---|---|
| story (11 quests) | 0 | 157 | 58 | 12 | 0 | 3 | 230 | 12 |
| rq:2202044 | 0 | 20 | 1 | 2 | 1 | 0 | 24 | 1 (turn-in zone, not shown) |
| shared rules + boards | 2 | 5 | 2 | 2 | 0 | 1 | 12 | 2 |
| templar | 9 | 64 | 0 | 30 | 0 | 0 | 103 | 26 |
| cleric | 11 | 53 | 8 | 22 | 0 | 0 | 94 | 19 |
| sorcerer | 8 | 58 | 2 | 24 | 0 | 0 | 92 | 20 |
| chanter | 8 | 61 | 2 | 26 | 0 | 0 | 97 | 22 |
| assassin | 11 | 55 | 4 | 62 | 13 | 11 | 156 | 58 |
| gladiator | 11 | 56 | 1 | 22 | 0 | 0 | 90 | 20 |
| ranger | 0 | 52 | 1 | 29 | 0 | 0 | 82 | 26 |
| spiritmaster | 0 | 50 | 0 | 27 | 0 | 0 | 77 | 24 |
| **total** | **60** | **631** | **79** | **258** | **14** | **15** | **1057** | **230** |

Per category (all classes together):

| category | verified-2src | game-db | owner | labelled | UNSOURCED | MISLABELLED |
|---|---|---|---|---|---|---|
| story fields | 0 | 157 | 58 | 12 | 0 | 3 |
| regional quest fields | 0 | 20 | 1 | 2 | 1 | 0 |
| rules (values) | 2 | 2 | 2 | 2 | 0 | 1 |
| boards (open level) | 0 | 3 | 0 | 0 | 0 | 0 |
| skill.learnLv | 0 | 159 | 6 | 0 | 0 | 11 |
| skill.levelGate | 0 | 23 | 0 | 11 | 0 | 0 |
| skill.specialtyText (picked choices) | 0 | 43 | 0 | 0 | 0 | 0 |
| skill.icon | 0 | 93 | 0 | 0 | 9 | 0 |
| stigma.record | 3 | 29 | 0 | 0 | 0 | 0 |
| stigma.icon | 0 | 28 | 0 | 0 | 4 | 0 |
| board.node (plan nodes to Lv 30) | 0 | 74 | 2 | 0 | 0 | 0 |
| build.statPriority | 1 | 0 | 0 | 7 | 0 | 0 |
| build.skillOrder | 46 | 0 | 0 | 46 | 0 | 0 |
| build.specialtyPick | 7 | 0 | 1 | 35 | 0 | 0 |
| build.stigmaSlots | 0 | 0 | 0 | 32 | 0 | 0 |
| build.stigmaTargets | 0 | 0 | 0 | 30 | 0 | 0 |
| build.boardPlan (rows to Lv 30) | 1 | 0 | 0 | 74 | 0 | 0 |
| build.keys | 0 | 0 | 9 | 7 | 0 | 0 |

Game facts (story, regional quest, skills, stigmas, nodes, boards) are almost all game-db or owner. Build choices are
almost all labelled in the data. Only 60 fields reach two independent sources, all of them build choices.

## (b) Every UNSOURCED and MISLABELLED item (29)

| class | file | record id | field | exact value | why |
|---|---|---|---|---|---|
| MISLABELLED | data/packs/aion2/asmodian/story-quests.json | sq:2101020 | lv | 2 | `status: verified`. lv rests on aion2hub alone (`fields: [name, lv]`). The owner ref (owner:2026-10-14-unlocks-02, "Shop and Closet: complete …") has no `fields` and doesn't show the level. The Metabot ref covers only gameId / next / levelsUp / giver / turnin / steps |
| MISLABELLED | same | sq:2101050 | lv | 5 | same pattern (owner:2026-10-14-unlocks-12, the Wings screen) |
| MISLABELLED | same | sq:2101060 | lv | 6 | same pattern (owner:2026-10-14-unlocks-08, the Titles screen) |
| UNSOURCED | data/packs/aion2/asmodian/regional-quests.json | rq:2202044 | name | Shugo-of-All-Trades: Asmodian | no ref lists `name`. The Metabot quest ref lists gameId, rec, unlocksAt, giver, turnin, steps, rewards. Trivial fix: add `name` to that ref |
| MISLABELLED | data/packs/aion2/rules.json | rule:stigma-slots | value | [22, 27, 32, 37] | verified on one page (metabot.gg/en/aion-2/content-unlocks). It's game-db only if content-unlocks counts as a database page, which is borderline. Shown as "Slot N opens at Lv …" |
| MISLABELLED | data/packs/aion2/classes/assassin/skills.json | skill:assassin:ambush | learnLv | 3 | `status: verified`. The only ref for the whole record is metabot.gg/en/aion-2/classes/assassin (a class page). The skill page is cited only with `fields: [specialtyChoices]`. Record note: "skill page not fetched" |
| MISLABELLED | same | skill:assassin:apply-poison | learnLv | 9 | same (probably not shown: not in the plan or the key data) |
| MISLABELLED | same | skill:assassin:defiance | learnLv | 16 | same (probably not shown) |
| MISLABELLED | same | skill:assassin:exploit-weakness | learnLv | 6 | same |
| MISLABELLED | same | skill:assassin:infiltrate | learnLv | 10 | same |
| MISLABELLED | same | skill:assassin:rear-smite | learnLv | 11 | same |
| MISLABELLED | same | skill:assassin:revitalization-contract | learnLv | 23 | same (probably not shown) |
| MISLABELLED | same | skill:assassin:savage-roar | learnLv | 1 | same |
| MISLABELLED | same | skill:assassin:shadow-fall | learnLv | 12 | same |
| MISLABELLED | same | skill:assassin:shadowstrike | learnLv | 1 | same |
| MISLABELLED | same | skill:assassin:whirlwind-slice | learnLv | 7 | same |
| UNSOURCED | data/packs/aion2/classes/assassin/skills.json | skill:assassin:ambush | icon | sk-ambush.png | ISSUES.md "Icon provenance not recorded" row is empty; docs/team/icon-provenance.md: "none recorded" |
| UNSOURCED | same | skill:assassin:assault-stance | icon | sk-assault-stance.png | same |
| UNSOURCED | same | skill:assassin:defense-break | icon | sk-defense-break.png | same |
| UNSOURCED | same | skill:assassin:exploit-weakness | icon | sk-exploit-weakness.png | same |
| UNSOURCED | same | skill:assassin:heart-gore | icon | sk-heart-gore.png | same |
| UNSOURCED | same | skill:assassin:insignia-explosion | icon | sk-insignia-explosion.png | same |
| UNSOURCED | same | skill:assassin:quick-slice | icon | sk-quick-slice.png | same |
| UNSOURCED | same | skill:assassin:rear-smite | icon | sk-rear-smite.png | same |
| UNSOURCED | same | skill:assassin:savage-roar | icon | sk-savage-roar.png | same |
| UNSOURCED | data/packs/aion2/classes/assassin/stigmas.json | stigma:assassin:triniels-dagger | icon | st-triniels-dagger.png | same |
| UNSOURCED | same | stigma:assassin:illusive-clone | icon | st-illusive-clone.png | same |
| UNSOURCED | same | stigma:assassin:swift-contract | icon | st-swift-contract.png | same |
| UNSOURCED | same | stigma:assassin:savage-fang | icon | st-savage-fang.png | same |

Notes on (b):
- The same 11 Assassin skills carry `fieldStatus.levelGate: inferred` ("stepped" assumed). The fix is probably one
  data change: cite each skill's Metabot page for the whole record (or `fields: [learnLv, levelGate]`), as the other 7
  classes already do.
- The 13 Assassin icons are a known issue (ISSUES.md L108). It is still open and is the only icon gap on the path.

### Labelled in the data, but the page shows no label (the play tester saw these as plain facts)

These aren't UNSOURCED (each one has a status), but the label stops at the generator:
1. **Story zones.** In sq:2101040, 2101050, 2101060, 2101070, 2101080 and 2101100, `turnin.zone = zone:ishalgen` has
   `fieldStatus: owner-check` and no ref. In sq:2102010 (Finding Nemon), `turnin.zone = zone:dredgion-crash-site` is
   `inferred`. gen.mjs `LOC` blanks a turn-in zone only when the **zone record's** status is owner-check, never when the
   quest's own `fieldStatus` is. So "Ishalgen" and "Dredgion Crash Site" reach `turninZone` ("near your story step")
   with no tag. Giver zones that are owner-check (5) only feed the place graph.
2. **boardPlan rows (74, all classes).** `dvItem` carries no status. Every Daevanion plan row is single-source, disputed
   or inferred in the data (Cleric has one verified row) and shows no tag.
3. **Stigma plan and targets (62), specialty picks (35), core skill-order rows (27).** `SP_SKILLS_CORE`, `STIGMA_PLAN`
   and `ST_TARGETS` carry no status. Examples: all 9 Ranger and 9 Spiritmaster core rows are single-source, and all 8
   Assassin core rows are inferred. None shows a tag.
4. **SP_EXTRA wording.** 11 non-core rows with `status: disputed` are tagged "single source (…)". Example: Templar's
   "single source (Annihilate to 7)", where the data says disputed (C82).
5. **Key setup.** Templar `defaultKeys.status: inferred` (the mouse buttons, C88) shows as "The game's default keys"
   with no tag. The Assassin's inferred grid is labelled in build.html prose ("the guide's inference"), which is fine.
6. **Stat priority.** Labelled only through the `stat-note` text ("Metabot's X ranking only (one site)"). That works
   for the 6 single-source classes. Cleric (disputed) gets a descriptive note that doesn't say "disputed".

## (c) Labelled items per class (data status ≠ verified)

| scope | labelled | by status |
|---|---|---|
| story | 12 | owner-check 11 (zones), inferred 1 (Finding Nemon turn-in zone) |
| rq:2202044 | 2 | inferred 2 (zone, shown with a tag; turn-in zone, not shown) |
| rules | 2 | single-source 2 (rule:level-points, rule:crystals-per-level; the latter's only ref is `inferred`) |
| templar | 30 | disputed 17, single-source 11, inferred 2 |
| cleric | 22 | disputed 22 |
| sorcerer | 24 | disputed 22, single-source 2 |
| chanter | 26 | disputed 25, single-source 1 |
| assassin | 62 | inferred 55 (build status `inferred`, inherited by plan, picks, stigmas), legacy 4, single-source 3 |
| gladiator | 22 | disputed 20, single-source 1, inferred 1 |
| ranger | 29 | single-source 28, inferred 1 |
| spiritmaster | 27 | single-source 26, inferred 1 |

- Assassin `legacy` (4): boardPlan `requires` for node:assassin:nezekan:r13c7 and r5c8 (Lv 20), and
  node:assassin:zikel:r6c7 and r12c11 (Lv 21), have `basis: legacy` with no source ("the guide's level for this
  node"). They're gates, not facts, but they're unsourced levels shown as "opens at Lv 20/21".
- Templar, Cleric, Sorcerer and Gladiator notes say "Lv 8 picks are two-source where marked", but no pick is marked
  (there's no `specialtyEvidence` for slot 1 in those builds). Every slot-1 pick therefore inherits the build's
  `disputed`, and the data can't show which picks are actually two-source.

## (d) Choice points to Lv 30, and whether the data recommends

| class | choice point | recommendation in data? |
|---|---|---|
| all 8 | Stigma slot 1 (Lv 22) and slot 2 (Lv 27): "change" dropdown / Other… | yes: the stigma plan (all 4 shown). Slot order is disputed for Templar (C81), Cleric, Sorcerer, Chanter and Gladiator, and inferred for the Assassin; none of this shows |
| templar | Judgment, Vicious Strike, Pummel, Shield Smite, Warding Strike, Punishment: specialty slot 2 (and slot 3) | **none**: "pick a specialty" |
| cleric | **Earth's Retribution, Judgment Thunder** (core, learned Lv 1): slots 1-3 | **none, and no row at all**: `SP_STEPS` adds a slot row only when slot 1 has a pick (`s.spec`), so the choice is silently missing |
| cleric | Chain of Torment, Divine Aura, Healing Light, Light of Regeneration: slot 2; Condemnation: slot 3 | **none** ("pick a specialty"). Condemnation slot 2 has a pick (`:4`, 2+ sources) |
| sorcerer | **Ice Chain** (core, Lv 1): slots 1-3 | **none, no row** |
| sorcerer | Flame Arrow, Firestorm, Blaze, Bittercold Wind, Hellfire, Winter's Shackles: slot 2 | **none** |
| chanter | Dark Crush, Onslaught, Spinning Strike, Recuperation, Incandescent Blow, Rushing Smash: slot 2 | **none** |
| assassin | Insignia Explosion, Savage Roar, Ambush, Shadowstrike: slot 2 | **none** (Heart Gore and Quick Slice have slot 2 and 3 picks) |
| assassin | boardPlan "any one of" rows: "Cooldown Reduction or Combat Speed corner" (Lv 12, 4 nodes), "Damage Boost corner" (Lv 20, 2), "Critical Damage Boost corner" (Lv 30, 2) | **none**: any node counts, and the data doesn't say which node or (for the first row) which stat |
| gladiator | Ruinous Blow: slot 2 | **none** (the other three have slot 2 picks) |
| ranger | **Snipe, Tempest Shot, Marking Shot, Drill Dart, Gale Arrow, Burst Arrow, Deadshot** (7 core actives by Lv 14): slots 1-3 | **none, no rows**: `specialtyPicks: {}` ("no source names any"), so the app never mentions specialties for the Ranger |
| spiritmaster | **Cold Shock, Combustion, Summon: Fire Spirit, Summon: Water Spirit, Jointstrike: Curse, Dimensional Control, Elemental Fusion**: slots 1-3 | **none, no rows**: `specialtyPicks: {}` |
| spiritmaster | Key setup / rotation | **none**: no `defaultKeys` and no `rightClick`, so `HAS_KEYS` is false and the drawer shows only the stat priority |
| templar, cleric, sorcerer, chanter, gladiator, ranger, spiritmaster | **Vaizel board opens at Lv 30** (step g30:0: "Vaizel … opens. … buy its nodes from the Daevanion board card") | **none**: no boardPlan row on Vaizel before Lv 40 (only the Assassin has Lv 30 rows), and the Daevanion card leaves out boards without plan rows. The milestone points at nodes the card doesn't list |
| all | specialty slot 3 on every skill with a pick | none, by design: never reachable inside Lv 45 (Q5), listed in the Skills card only |

Core skills without a pick that are passive (no specialty choices) are left out, for example Templar Punishing Benediction.
Slot-2 rows appear in the Skills card for every core skill with a slot-1 pick. They reach the Next up hero only when
the plan can bring the skill to effective level 12 (`planReachOf`). Picked choices whose own text is disputed: none on
the path (Templar Pummel choices 4/5 are disputed but the pick is choice 1).

## (e) Other checks

- **Node costs (owner: green 2, blue 3, orange 4).** All 8 board-node files agree: 40 passive skill nodes cost 2, 48
  active skill nodes cost 3, 26 unique/corner nodes cost 4, and so do all 84 boardPlan nodes on the path.
  rule:node-costs is verified on 3 independent sources. One gap: every board has 16 stat nodes costing 3, and the rule
  lists only `stat: 1` and `rareStat: 2`. Path costs come from the grid, so nothing displayed is wrong.
- **Story levelsUp.** 8 of 11 quests carry it (owner screens + Metabot EXP). sq:2101050 (Lv 5) and sq:2101060 (Lv 6)
  have none, so the 5→6 step needs a manual Level up, even though the owner wrote on 2026-10-17 that "every story quest
  to Lv 10 gives 100% EXP". Finding Nemon has none (it's the end of the path). This is settled, not a defect: the owner's own reward screens show
  both at 50% EXP (DECISIONS `owner-ok-autolevel`, refined 2026-10-20 by `2026-10-research-401-levels.md`).
- **rq:2202044.** The giver (Dari, Temporary Investigation Base, 18 m), the step (Creion Campsite, 81 m), the rewards
  (14,599 XP, 10k Kina, 1 Wisdom, 1 Crystal, Cube Expansion Voucher, Title) and `unlocksAt` 10 are all from the Metabot
  quest page. The story gate (Contaminated Area turned in) is from the owner (owner:2026-10-15-alt-04). Zone: inferred,
  with a tag. Its `conflicts` notes Metabot's NPC table gives the turn-in as "Calderon Canyon" while the steps say Quai
  Campsite. Turn-in zone is inferred and not displayed.
- **Class guide step prose to Lv 30.** The `build:triggers` / `build:rotation` / `build:hellfire` steps (Templar,
  Cleric, Sorcerer, Chanter, Spiritmaster) all rest on verified claims, except Sorcerer triggers, which also carries an
  `inferred` claim. `build:3` ("Stat priority …") points at single-source or disputed claims. `g22:0` ("The One Who
  Hears the Voice" unlocks Stigmas) rests on claim C39, single-source, with no tag on the milestone row. `g12:0`
  (Urgent Pursuit unlocks the Daevanion) is backed by unlock:daevanion (owner). `g22:1`, `g27:0` and `g27:1` carry no
  claim: their facts come from the stigma plan and the slot levels (rule:stigma-slots).
- **Stigma slot 1 gate.** `g22:1` requires `{story: sq:2102185 "Daeva in a Dream", is: reached, basis: legacy}`, a
  legacy atom with no source, in every class (owner check 3 still open, prereq-gates §8).
