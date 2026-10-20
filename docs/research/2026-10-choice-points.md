# Choice points census, all 8 Asmodian classes, Lv 1–45

Game Data Check, for the 0.9 planning pass (Walter's ask: every implicit choice, how many have no pick, a schema shape).
Read-only pass over `data/**`, `tools/gen/gen.mjs`, `src/packs/aion2/` (2026-10-20, no fetches). Extends K25 audit
§(d) (Lv 1–30) to Lv 45 and every record. A choice point: the player picks between alternatives inside Lv 1–45.

## Method and assumptions

- **Specialty slot reach.** Slots open at effective skill level 8 / 12 / 20 (`rule:specialty-slots`). Effective level =
  points (max 10 inside Lv 45) + the plan's board nodes on that skill (`adds`, default 1), the same sum as
  `planReachOf` (`src/packs/aion2/requirements.js`). A slot counts only if that sum reaches it. Slot 3 (20) never does
  (max 14, design Q5), so slot 3 is not counted.
- **Which skills.** Core actives in `skillOrder` (levelled to 10); non-core actives only if `skillOrderNotes.budget`
  takes them to 8+ on the 203 base points (no Wisdom Stones).
- **Stigma specialty slots** (stigma Lv 5 / 10 / 15 / 20) count up to each `stigmaTargets` level.
- **Boards** (Nezekan 12, Zikel 20, Vaizel 30, Triniel 40, Azphel 45): one with no `boardPlan` row is one choice.
- "Label in data" = a label on the pick itself; the build-level `status` doesn't count.

## Counts

Per kind (total / with a pick / no pick):

| # | Kind | Total | Pick | No pick | Shown by the UI? |
|---|---|---|---|---|---|
| 1 | Specialty slots in reach (slot 1 + reachable slot 2) | 63 | 40 | 23 | only core skills with a slot 1 pick |
| 2 | `boardPlan` `anyNode` rows | 4 | 0 | 4 | yes ("any one of") |
| 3 | Boards that open with no plan rows | 22 | 0 | 22 | milestone step only; Daevanion card hides them |
| 4 | Stigma slots 1–4 (Lv 22/27/32/37) | 32 | 32 | 0 | yes, with "change" / "Other…" |
| 5 | Stigma specialty slots in reach | 29 | 0 | 29 | no, never |
| 6 | Skill order (one per build) | 8 | 8 | 0 | yes |
| 7 | Key setup / rotation | 8 | 7 | 1 | yes, except Spiritmaster |
| | **All** | **166** | **87** | **79** | |

Per class:

| Class | Total | Pick | No pick | No pick, by kind |
|---|---|---|---|---|
| Assassin | 26 | 14 | 12 | 1 spec slot, 4 anyNode, 1 board (Azphel), 6 stigma spec |
| Chanter | 20 | 14 | 6 | 3 boards, 3 stigma spec |
| Cleric | 22 | 12 | 10 | 3 spec slots, 3 boards, 4 stigma spec |
| Gladiator | 23 | 12 | 11 | 4 spec slots, 3 boards, 4 stigma spec |
| Ranger | 19 | 6 | 13 | 7 spec slots, 3 boards, 3 stigma spec |
| Sorcerer | 19 | 12 | 7 | 1 spec slot, 3 boards, 3 stigma spec |
| Spiritmaster | 19 | 5 | 14 | 7 spec slots, 3 boards, 3 stigma spec, 1 keys |
| Templar | 18 | 12 | 6 | 3 boards, 3 stigma spec |

Labels: of 40 specialty picks only **5** have one in data (`specialtyEvidence`, "2+ sources", slot 2). The 35 slot 1
picks and 32 stigma slot picks have none of their own (verdicts only in research docs / build `status`).

## 1. Specialty slots

Files: `asmodian/<class>/builds.json` (`specialtyPicks`, `specialtyEvidence`), `classes/<class>/skills.json`
(`specialtyChoices`, 5 per active at skill Lv 8/8/8/12/16 = the alternatives). Verdicts: class pack doc §4
(`2026-10-specialty-picks.md` for the Assassin).

| Class | Skill (core unless noted) | Slot | Reach | Data pick | Label in data | Research verdict |
|---|---|---|---|---|---|---|
| Assassin | Heart Gore | 1 / 2 | 14 | 3 / 4 | – / 2+ sources (4) | 3 contested |
| Assassin | Quick Slice | 1 / 2 | 14 | 3 / 4 | – / 2+ sources (2) | 3 contested |
| Assassin | Insignia Explosion | 1 / **2** | 14 | 2 / **none** | – | slot 2 disputed (3 vs 5) |
| Assassin | Savage Roar, Ambush, Shadowstrike | 1 | 10, 11, 11 | 2, 1, 2 | – | 2 contested, 1 contested, 2 2+ |
| Chanter | Dark Crush, Onslaught, Spinning Strike, Recuperation, Incandescent Blow, Rushing Smash | 1 | 10 | 3, 1, 1, 1, 1, 3 | – | 3 CONFIRMED, 3 two-source |
| Chanter | Impactful Crush, Tremor Crush (**non-core**, budget to 8) | 1 | 8 | 3, 2 | – | CONFIRMED; **the UI never shows these** (`SP_EXTRA` drops `spec`) |
| Cleric | **Earth's Retribution, Judgment Thunder** | 1 | 10 | **none** | – | disputed (2 vs 2; 3 vs 2) |
| Cleric | Chain of Torment, Healing Light, Light of Regeneration | 1 | 11, 10, 11 | 2, 1, 2 | – | CONFIRMED |
| Cleric | Condemnation | 1 / 2 | 12 | 2 / 4 | – / 2+ sources (4) | CONFIRMED |
| Cleric | Divine Aura | 1 / **2** | 12 | 2 / **none** | – | slot 1 split leveling (2) vs bosses (3) |
| Gladiator | Rending Blow, Overhead Slam | 1 / 2 | 12 | 3 / 4 | – / 2+ sources (3) | CONFIRMED; Overhead Slam 1 majority |
| Gladiator | Ruinous Blow | 1 / **2** | 12 | 1 / **none** | – | slot 1 **disputed** in research, shipped as `:1` unlabelled |
| Gladiator | Keen Strike | 1 | 10 | 1 (+ slot 2 `:4`, out of reach) | – | CONFIRMED |
| Gladiator | **Crushing Wave, Rush Strike, Leaping Slam** (non-core, budget to 8) | 1 | 8 | **none** | – | research has CONFIRMED picks 1, 2, 3; not shipped |
| Ranger | **Snipe, Tempest Shot, Marking Shot, Drill Dart, Gale Arrow, Burst Arrow, Deadshot** | 1 | 10 | **none** | – | no source found (below) |
| Sorcerer | Flame Arrow, Firestorm, Blaze, Bittercold Wind, Hellfire, Winter's Shackles | 1 | 10 | 1, 1, 1, 3, 1, 3 | – | 4 CONFIRMED, 2 two-source with dissent |
| Sorcerer | **Ice Chain** | 1 | 10 | **none** | – | single-source (`:1`, daevaguides) |
| Spiritmaster | **Cold Shock, Combustion, Summon: Fire Spirit, Summon: Water Spirit, Jointstrike: Curse, Dimensional Control, Elemental Fusion** | 1 | 10 | **none** | – | no source found (below) |
| Templar | Judgment, Vicious Strike, Pummel, Shield Smite, Warding Strike, Punishment | 1 | 10 | 3, 1, 1, 2, 1, 1 | – | 5 CONFIRMED, Punishment two-source |

Shown but out of reach (not counted): slot 2 rows on 25 core skills whose reach is 10–11 (Skills card says "pick a
specialty"; Next up skips them via `planReachOf`), and slot 3 rows on all 33 core skills with a slot 1 pick (Q5).
Conditional: Sorcerer Wish of Concentration reaches 10 only with Wisdom Stones (claim C44); research has a CONFIRMED
`:2`, the data has none. Core actives with no slot 1 pick get **no row at all** (`SP_STEPS` needs `s.spec`): 17 skills
(Cleric 2, Sorcerer 1, Ranger 7, Spiritmaster 7). Core passives have no specialties and are not choices.

Against the K25 audit: Assassin Savage Roar / Ambush / Shadowstrike and Cleric Chain of Torment / Healing Light / Light
of Regeneration slot 2 are out of reach (10–11), so not choices. The non-core Chanter and Gladiator skills are new.

### Ranger and Spiritmaster: sources for specialty picks

**Ranger: no source found.** What the repo holds:
- `2026-10-ranger-pack.md` §3: build advice from Metabot only (leveling build, top-player panel, class-builds guide):
  skill targets, stigmas, stats, board path. No specialty pick.
- `data/research/ranger-builds-metabot-2026-10.csv` (38 rows): skill targets, stigma slots, "core-skill 99% pick"
  (that is a per-skill pick rate, not a specialty). No specialty row.
- `ranger-specialties-metabot-2026-10.csv`: choice texts only. `2026-10-specialty-picks.md`: "Metabot has no specialty picks".
- §6 fetched daevaguides `/en/ranger/`, aion2-guides.info `/en/ranger/`, mmo-codex `/classes/ranger/`, aion2turkiye
  `/class/ranger/` on 2026-10-18, **for learn levels only**. Picks were not recorded. `builds.json` note: "No specialty
  picks: no source names any." `2026-10-gladiator-guide.md` (summary): "The Ranger guide shipped none."

**Spiritmaster: no source found.**
- `2026-10-spiritmaster-pack.md` §3: Metabot only. §6 fetched mmo-codex `/classes/spiritmaster/` and daevaguides
  `/en/elementalist/` for learn levels; the one specialty row checks a choice text (Elemental Fusion 5), "not checked"
  on daevaguides. No pick recorded. CSVs as for the Ranger.

Independent sources per pick: **0 for all 14 skills.** The pages already fetched gave two-source picks for five other
classes, so a spot-check run on them is the likely fix (a fetching task; not done here).

## 2. `boardPlan` rows with `anyNode`

All Assassin (`assassin/builds.json`). No other class has one. Corner nodes cost 4.

| Row (key) | Lv | Alternatives | Pick | Label |
|---|---|---|---|---|
| `dv:corner` "Cooldown Reduction or Combat Speed corner" | 12 | 4 Nezekan corners: 2 × Combat Speed +1.5%, 2 × Cooldown Reduction +1.5% | none (a stat choice and a position) | no status |
| `dv:z:corner` "Damage Boost corner" | 20 | 2 Zikel corners, same stat | none (position only) | no status |
| `dv:v:corner` "Critical Damage Boost corner" | 30 | 2 Vaizel corners, same stat | none (position only) | inferred |
| `dv:t:corner` "Multi-Hit Chance corner" | 40 | 3 Triniel corners, same stat | none (position only) | inferred |

Only the Lv 12 row has an "or" label. The three single-stat rows could take "nearest the plan path" as an inferred pick.

## 3. Boards that open with no plan rows

| Board (opens) | Classes | Step that opens it | Pick |
|---|---|---|---|
| Vaizel (30) | Chanter, Cleric, Gladiator, Ranger, Sorcerer, Spiritmaster, Templar | `g30:0` (`opensBoard`) | none |
| Triniel (40) | same 7 | `g40:0` (`opensBoard`) | none |
| Azphel (45) | all 8 | `g45:2` (optional, "stat nodes only", no `opensBoard`) | none |

Only the Assassin plans Vaizel and Triniel (6 rows each). The step says to buy nodes the Daevanion card doesn't list.

## 4. Stigma slots

`stigmaSlots` (4) and `stigmaTargets` in each `builds.json`; 13 stigmas per class in `classes/<class>/stigmas.json`
(Assassin: 4). The UI offers the planned stigmas plus "Other…" (`cards/stigmas.js`). "Other…" is a player override,
not a guide choice.

| Class | Plan, slots 1–4 | Targets | Label (build-level only) |
|---|---|---|---|
| Assassin | Triniel's Dagger, Illusive Clone, Swift Contract, Savage Fang | 10, 20, –, – | inferred (order conflict in `conflicts`) |
| Chanter | Undefeated Mantra, Sprint Mantra, Power of the Storm, Marchutan's Wrath | 8, 7, 5, 4 | disputed (slots 2–4 order) |
| Cleric | Earth Punishment, Light of Protection, Noble Aura, Prayer of Amplification | 9, 5, 5, 5 | disputed |
| Gladiator | Lunge Stance, Zikel's Blessing, Lifestealing Blade, Rage Burst | 8, 6, 5, 5 | disputed |
| Ranger | Vaizel's Authority, Bow of Blessing, Supporting Fire, Griffon Arrow | 8, 7, 5, 4 | single-source |
| Sorcerer | Element Enhancement, Delayed Explosion, Fire Wall, Cold Storm | 8, 7, 5, 4 | disputed |
| Spiritmaster | Summon: Ancient Spirit, Enhance: Spirit's Benediction, Jointstrike: Corrode, Flame Blessing | 8, 7, 5, 4 | single-source |
| Templar | Taunt, Empyrean Lord's Punishment, Battlefield Banner, Doom Shield | 8, 7, 5, 4 | disputed (C81) |

## 5. Stigma specialty slots (never shown)

Open at stigma Lv 5 / 10 / 15 / 20. No build field, gen table or card handles them.

| Class | Slots in reach | Which | Choice data |
|---|---|---|---|
| Assassin | 6 | Triniel's Dagger 5, 10; Illusive Clone 5, 10, 15, 20 | **none**: the 4 stigma records have no `specialtyChoices` |
| Chanter, Ranger, Sorcerer, Spiritmaster, Templar | 3 each | slot 1 of the three stigmas with target ≥ 5 | 4 choices per stigma |
| Cleric, Gladiator | 4 each | slot 1 of all four | 4 choices per stigma |

## 6. Skill order and core skills

One `skillOrder` per build, each a pick: Assassin `inferred`; five classes verified entries, inferred interleave;
Ranger, Spiritmaster `single-source`. Core skills with no specialty pick are under kind 1.

## 7. Key setup / rotation

| Class | `rightClick` | `defaultKeys` | Pick |
|---|---|---|---|
| Assassin | yes | yes | guide binding, `keyStacks.status` inferred |
| Chanter, Cleric, Gladiator, Ranger, Sorcerer, Templar | no | yes (owner screens) | the game's default keys. That is a fact, not a recommendation; counted as a pick |
| Spiritmaster | no | **no** | **none**: `HAS_KEYS` false, no Rotation; reason given in `keyStacks.sources[0].inferred` |

## Not counted

Class picker (`cards/characters.js` radio): an account choice, not a guide choice. Stat priority (8 builds, all tiered):
a ranking, not a slot. Optional steps (`g20:exp`, `g25:0`, `g35:exp`, `g45:3`–`5`): do or skip. Spare skill points /
Wisdom Stones: only the Sorcerer names a target (C44). Daevanion points left after the plan rows: needs the points table.

## Proposed schema: `choices[]` on the build record

One array in `builds.json`, one entry per choice point. Each entry carries exactly one of `pick` or `noPick`. The
generator compiles `specialtyPicks` from it (or checks the two agree while both exist), so there is one source of truth.

```json
"choices": [
  { "id": "choice:assassin:spec:insignia-explosion:2", "kind": "specialtySlot",
    "subject": "skill:assassin:insignia-explosion", "slot": 2, "opensAt": { "effectiveSkillLv": 12 },
    "alternatives": ["spec:assassin:insignia-explosion:3", "spec:assassin:insignia-explosion:5"],
    "pick": { "value": "spec:assassin:insignia-explosion:3", "label": "disputed",
      "evidence": [{ "url": "https://skycoach.gg/blog/aion-2/articles/assassin-guide" },
                   { "url": "https://aion2turkiye.com/en/class/assassin/" }],
      "alt": "spec:assassin:insignia-explosion:5", "note": "5 needs skill 16; it would sit empty from 12 to 16" } },
  { "id": "choice:assassin:dv:corner", "kind": "boardAnyNode", "subject": "dv:corner",
    "alternatives": ["node:assassin:nezekan:r3c3", "node:assassin:nezekan:r3c13",
                     "node:assassin:nezekan:r13c3", "node:assassin:nezekan:r13c13"],
    "noPick": { "reason": "no-source", "note": "No source ranks Cooldown Reduction against Combat Speed" } },
  { "id": "choice:ranger:board:vaizel", "kind": "boardOpen", "subject": "board:vaizel", "opensAt": { "level": 30 },
    "noPick": { "reason": "no-source", "note": "Metabot's board path stops at Zikel; owner in-game check" } }
]
```

- `pick.label` enum: `2+ sources` | `disputed` | `contested` | `single source` | `inferred` (the `claims.json` set).
  `evidence`: at least one `{url}`, `{claim}` or `{owner}`. `2+ sources` needs 2 URLs on different hosts. `inferred`
  needs `{inferred: "<reasoning>"}`.
- `noPick.reason` enum: `no-source` | `disputed-left-out` | `out-of-reach` | `player-choice` (for example "Other…").
- For a `boardAnyNode` choice, `subject` is the plan row's `key`. A `pick` there would name one of the `anyNode` ids.

## Proposed gen check

The generator lists the expected choice points itself from the data, so a missing entry fails too:
- specialty slots: core actives × slots where points + plan `adds` reach 8 / 12 (20 never); non-core actives whose
  planned target is 8 or more;
- one per `anyNode` row; one per board an `opensBoard` / board step opens with no plan rows;
- 4 stigma slots; stigma specialty slots up to each `stigmaTargets` level; one key setup; one skill order.

Then, for each expected id: `check('<build>: choice <id> has exactly one of pick / noPick', ...)`. Also check that a
`pick` has a label in the enum and evidence that fits the label (above), and that `pick.value` is one of
`alternatives`. Fail on entries that match no expected point (stale ones).

**Fails today: 79** (the no-pick count), or **50** if stigma specialty slots (29) stay out of scope for now. If the check
also needs a per-pick label, add **67** unlabelled picks: 35 specialty slot 1 picks, 32 stigma slots. Those can be
filled from the existing research verdicts (class pack docs §4, `2026-10-specialty-picks.md` §1) without new fetching.
Skill order and keys already have record-level labels.

## Ranger and Spiritmaster slot 1 picks (spot check, 2026-10-20)

Fills the gap in §1 for the gate. Read 2026-10-20 with our User-Agent, 10 s apart: daevaguides `/en/ranger/` and
`/en/elementalist/`, aion2turkiye `/en/class/ranger/` and `/en/class/spiritmaster/` (both Full in SOURCES.md). mmo-codex
`/classes/ranger/` returned 404, so I stopped there (Spot site). Facts only. daevaguides gives a pick per option with the
creators it credits; its own level plan is the pick when it names one. The aion2turkiye picks are its leveling build.
Only slot 1 is counted, because §1 shows slot 2 is out of reach for both classes.

**Ranger**

| Skill | aion2turkiye | daevaguides | Label |
|---|---|---|---|
| Snipe | `:1` +20% MP restored | `:1` (Lv 19 plan) | 2+ sources |
| Tempest Shot | `:1` −20% MP consumed | `:1` (Lv 19 plan) | 2+ sources |
| Drill Dart | `:1` Absorbs 3% HP | `:1` (from Lv 22); switches to `:3` at 45 | 2+ sources |
| Burst Arrow | `:1` Absorbs 10% HP | `:1` (from Lv 28); switches to `:3` at 45 | 2+ sources |
| Marking Shot | `:3` +5s duration | `:3` credited to LordRobson; no plan line | 2+ sources (one is a credited pick) |
| Gale Arrow | `:1` +5s duration | plan `:3` mobile (couga54, Moxsy, FRESHY); `:1` credited to five others | disputed |
| Deadshot | `:1` Removes MP consumed | `:2` +30% Skill Speed (plan) | disputed |

**Spiritmaster**

| Skill | aion2turkiye | daevaguides | Label |
|---|---|---|---|
| Cold Shock | `:1` +20% MP restored | `:1` (Lv 19 plan); later `:3` once mana holds | 2+ sources |
| Combustion | `:1` −20% MP consumed | `:1` (Lv 19 plan); later `:2` | 2+ sources |
| Elemental Fusion | `:1` Changes to AoE (switch to `:2` for bosses) | `:1` "for mob packs while leveling" (couga54) | 2+ sources |
| Jointstrike: Curse | `:1` +2s Curse duration | `:1` credited to couga54, aLuckyRO; `:2` credited to Tsuruf, Hemi, Antochi | 2+ sources, contested |
| Summon: Fire Spirit | `:3` 10% chance to activate skill | `:3` credited to Tsuruf, OneTimeACraft; couga54 keeps it at 1 while leveling | 2+ sources (one is a credited pick) |
| Summon: Water Spirit | `:2` +10% Attack (dungeon build only) | `:3` (Lv 19 plan); `:2` credited to couga54, OneTimeACraft | disputed |
| Dimensional Control | `:2` Extra damage after 3s | no slot 1 pick (it credits only the Lv 12 / 16 options) | single source |

Result: all 14 skills now have a pick with a label: 10 are 2+ sources, 3 are disputed and 1 is single source. Each
label follows the `claims.json` rule. daevaguides is an aggregator, and its credited creators (couga54 and others) are
not independent of aion2-guides.info, so aion2-guides.info would not count as a third source. No owner check is needed for the 2+ source rows; for the disputed rows the guide shows both options.

The other P15 parts: effective level = points + the plan's board nodes (`planReachOf`, Method above). Slot 3 is never
reached inside Lv 45. Slot 2 has no pick in 3 places: Assassin Insignia Explosion (disputed 3 vs 5, §1), Cleric Divine
Aura and Gladiator Ruinous Blow. The last two still need a sourced pick, and the 0.9 item can fetch them.

## Data issues found (for the 0.9 queue, not fixed here)

1. Gladiator Ruinous Blow ships slot 1 pick `:1` with no label; `2026-10-gladiator-guide.md` §4 calls it **disputed**
   (`:1` daevaguides + skycoach, `:3` aion2turkiye + couga54 + aLuckyRO). Needs the `disputed` label or removal.
2. Gladiator Crushing Wave `:1`, Rush Strike `:2`, Leaping Slam `:3`: CONFIRMED in research §4, not in `specialtyPicks`.
3. Chanter Impactful Crush `:3`, Tremor Crush `:2`: in the data, never shown (`SP_EXTRA` carries no `spec`).
4. Cleric Divine Aura and Gladiator Ruinous Blow reach slot 2 with no pick (missed by the K25 audit).
5. Ranger and Spiritmaster: no specialty picks in the data; sourced picks for 14 skills are in the section above.
