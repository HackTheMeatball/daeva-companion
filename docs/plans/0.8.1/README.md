# 0.8.1 plan: data and bug fixes after 0.8.0

Release Planner, 2026-10-20, after 0.8.0 shipped (3:46 PM ET). A patch: no planning pass (ROADMAP "How a minor is
planned"). The owner's rule of 2026-10-18 10:40 PM ET applies: new looks ship in the next minor unless the owner says
"now". Every item here fixes data or a bug the owner or Player Testing hit; F7 and F8 wait on the owner's answer
(below). Inputs: the owner's Lv 39 notes (project chat 2026-10-20 12:18 PM ET; triage in the planner log), Player
Testing's RC report #586, and Game Data Check's three research files merged in #570 and #584.

Outside the queue: #585 (simpler link preview, the owner's ask) reopens after the v0.8.0 tag and merges as is.

## Items

| Item | What | Size | Model | Lanes | After |
|---|---|---|---|---|---|
| F1 | Assassin Daevanion costs pre-fill, corner picks, on-path rows (notes 1–4) | M | Opus | gen, golden | none |
| F2 | A labelled specialty pick in every guide skill's slot 2 (note 5) | M | Opus | gen, golden | none |
| F3 | Specialty rows placed by effective skill level (note 6) | M | Opus | golden, nextup | F1 |
| F4 | RC play fixes: page title on class pick, tooltip typo, one legend per card (#586 2–4) | S | Sonnet | a11y | none |
| F5 | Gladiator and Ranger rotation icons (#586 1) | S | Opus | gen | research-rotation-icons |
| F6 | Size trim: page gzip under 90% of its budget, no visible change | M | Opus | build | none |
| F7 | Respec buttons in Basic (note 7) | S | Sonnet | a11y | owner-ok-0.8.1-respec-basic |
| F8 | Recommended specialty in Next up's skill steps and after a respec (note 8) | S | Opus | golden, nextup | owner-ok-0.8.1-specialty-nextup |

F1 and F2 both edit `builds.json` and run gen: kickoff keeps them apart on the gen lane, F1 first. F3 needs F1's
on-path rows. F5 waits on Game Data Check committing the icon files (bot builds have no web). F7 and F8 are planned
only: if the owner says "now" (decision card, Release planning thread, 2026-10-20), they queue on that DECISIONS row;
otherwise they move to the 0.9 design pass with notes 9–12.

## F1: Assassin Daevanion costs, corners and on-path rows

- **Problem.** The cost box starts empty, so the player types every node's cost; the Nezekan corner row says "costs 4"
  (owner's board: 5) and leaves the corner choice open; the nodes Zikel and Vaizel paths buy on the way are invisible
  (owner notes 1–4, 2026-10-20).
- **Result.**
  - `boardPlan` rows carry `cost` from the owner's boards (Nezekan 52, Zikel 47, Vaizel 39 in total, table in
    `docs/research/2026-10-assassin-board-costs.md` §1) with an owner source per board, `fields: ["cost"]`; the
    schema allows it.
  - The Daevanion card pre-fills each cost box from `cost` when the player hasn't logged one; the box stays editable,
    and a logged value always wins.
  - Nezekan: the row becomes "Combat Speed corner" (`anyNode` r13c13 / r3c3, §2), cost 5, with a one-line reason.
  - Zikel: Defense Break 1 of 2 stays at 0 with `via` "bought on the way to Quick Slice"; the Damage Boost corner goes
    bottom-left via Attack +3, labelled contested, naming the other path (§3).
  - Vaizel: Ambush (r11c9) and Exploit Weakness (r13c11) become plan rows before the Critical Damage Boost corner, 5
    each, `via` "on the way to the Critical Damage Boost corner"; the corner row costs 5 (§4).
  - A generator check computes each row's cheapest-path cost from `board-nodes.json` (cost by colour) in plan order and
    reports any row that differs from its `cost`; Vaizel Assault Stance (path 4, owner 5) is the one listed exception,
    marked for an owner re-check.
- **Inputs.** `docs/research/2026-10-assassin-board-costs.md`, `data/packs/aion2/classes/assassin/board-nodes.json`.
- **Files.** `data/packs/aion2/asmodian/assassin/builds.json`, `data/packs/aion2/asmodian/assassin/guide/claims.json`,
  `data/schema/builds.schema.json`, `data/schema/examples/packs/aion2/asmodian/assassin/builds.json`, `tools/gen/*`,
  `src/packs/aion2/cards/daevanion.js`, `src/packs/aion2/data/build.js`, `docs/DATA-FORMAT-V2.md`, the tests, golden.
- **No-gos.** No save change (a pre-filled value isn't written to the save until the player edits or ticks). No
  other class's plan. Triniel is out (the owner is Lv 39).
- **Acceptance.**
  - [ ] `npm run gen` passes, with the path check reporting only Vaizel Assault Stance.
  - [ ] A fresh Assassin's Daevanion card shows each plan row's cost pre-filled, and the totals 52 / 47 / 39.
  - [ ] Typing a cost overrides the pre-fill and survives a reload; an untouched pre-fill isn't in the save.
  - [ ] Before / after shots of the three boards at 1500 and 390 px, `scrapbook.json`.
- **Lanes:** gen, golden. **Model:** Opus, M (90 min).
- **After:** none.

## F2: A labelled specialty pick in every slot 2

- **Problem.** At skill level 12 the Skills card says "pick a specialty" for Insignia Explosion, Savage Roar, Ambush and
  Shadowstrike, because the data only carries slot 2 picks with 2+ slot-specific sources (owner note 5: "this always
  needs to be a recommendation").
- **Result.** `specialtyPicks` gets a slot 2 pick for those four skills, as in
  `docs/research/2026-10-specialty-slot2.md`: Insignia Explosion 3 (disputed; slot 3 becomes 5), Savage Roar 4
  (contested), Ambush 2 (disputed), Shadowstrike 1 (inferred). Each has a `specialtyEvidence` entry with its label and
  sources. The generator's 2+ witnesses check for slot 2+ accepts a pick with one of those labels. The specialty row
  shows the label the way 0.8 P20 shows other labelled values.
- **Inputs.** `docs/research/2026-10-specialty-slot2.md`, `docs/research/2026-10-specialty-picks.md`.
- **Files.** `data/packs/aion2/asmodian/assassin/builds.json`, `data/packs/aion2/asmodian/assassin/guide/claims.json`,
  `data/schema/builds.schema.json`, `tools/gen/*`, `src/packs/aion2/requirements.js`, `src/packs/aion2/cards/nextup-kinds.js`,
  `src/packs/aion2/cards/skills.js`, the tests, golden.
- **No-gos.** Slot 3 stays unoffered inside Lv 45 (design Q5). Other classes unchanged.
- **Acceptance.**
  - [ ] A test asserts no core Assassin skill's slot 2 row reads "pick a specialty".
  - [ ] Each new pick shows its label (disputed / contested / inferred).
  - [ ] Before / after shots of the slot 2 row for the four skills, `scrapbook.json`.
- **Lanes:** gen, golden. **Model:** Opus, M (90 min).
- **After:** none.

## F3: Specialty rows placed by effective skill level

- **Problem.** A specialty slot that board nodes open early is tickable but listed at the milestone character level
  alone implies (`SP_STEPS`, learn + 18), so the guide recommends it late (owner note 6).
- **Result.** First the check in `docs/research/2026-10-effective-skill-level.md` ("Proposed check"), with its result
  in the PR. Then each slot row is placed where the plan's lines and nodes, in plan order, reach the slot's effective
  level; F1's on-path rows count.
- **Inputs.** `docs/research/2026-10-effective-skill-level.md`.
- **Files.** `src/packs/aion2/data/build.js`, `src/packs/aion2/requirements.js`, `src/packs/aion2/cards/nextup-kinds.js`,
  `tests/core/specialty.test.mjs`, the tests, golden.
- **No-gos.** No save change. Bought-line rules unchanged.
- **Acceptance.**
  - [ ] The research check passes in the built app (PR pastes the steps and result).
  - [ ] Heart Gore slot 2 appears in Next up once the second Heart Gore node is ticked.
  - [ ] Golden diff explained row by row; before / after shots, `scrapbook.json`.
- **Lanes:** golden, nextup. **Model:** Opus, M (90 min).
- **After:** F1.

## F4: RC play fixes

- **Problem.** Player Testing's RC report #586, findings 2–4: picking a class on the welcome card doesn't retitle the
  page until Start; a tooltip reads "back to to pick up"; the regional quest legend repeats under every Regional quests
  heading (13 times).
- **Result.** The page title follows the class pick at once; the tooltip reads "back to pick up"; the legend shows once
  per card (the first Regional quests heading in it).
- **Files.** `src/main.js`, `src/cards/welcome.js`, `src/packs/aion2/cards/shared.js`, `src/packs/aion2/cards/rows.js`,
  the tests.
- **No-gos.** No new UI.
- **Acceptance.**
  - [ ] Tests for each of the three; before / after shots of the legend at 1500 and 390 px, `scrapbook.json`.
- **Lanes:** a11y. **Model:** Sonnet, S (44 min).
- **After:** none.

## F5: Gladiator and Ranger rotation icons

- **Problem.** Five Gladiator and Ranger rotation icons still show initials (#586 finding 1; 0.8.0 Known issues).
- **Result.** Game Data Check commits the five icons from an approved source (Metabot, then daevacompass.com) under
  `docs/research/rotation-icons-2026-10-2x/` with a README; the build copies them to `src/assets/icons/` and adds the
  `docs/ISSUES.md` provenance rows (standing icon OK, 2026-10-14).
- **Inputs.** `docs/research/rotation-icons-2026-10-2x/` (Game Data Check names the folder when committing).
- **Files.** `src/assets/icons/*`, the class packs' icon fields, `docs/ISSUES.md`, the tests.
- **Lanes:** gen. **Model:** Opus, S (44 min).
- **After:** research-rotation-icons.

## F6: Size trim

- **Problem.** The page is at 185 395 / 200 000 gzip bytes (93%) at 0.8.0; ROADMAP schedules a performance item
  within 20% of a budget, and 0.9 adds more.
- **Result.** `node scripts/build.mjs --sizes` before and after in the PR; the page under 90% of its gzip budget with no
  visible change (golden unchanged, shots not needed).
- **Files.** `scripts/build.mjs`, the modules the size report names, the tests.
- **No-gos.** No budget raise. No visible change.
- **Acceptance.**
  - [ ] Build prints the page gzip under 180 000; golden verify unchanged; `npm test` green.
- **Lanes:** build. **Model:** Opus, M (90 min).
- **After:** none.

## F7, F8: owner-gated

- **F7** Respec buttons in Basic mode (note 7): Basic shows the Skills and Daevanion respec buttons Advanced has.
  After: `owner-ok-0.8.1-respec-basic`.
- **F8** The recommended specialty shows in Next up's skill-level steps and again after a respec (note 8). After:
  `owner-ok-0.8.1-specialty-nextup`.

Specs are written in full only if the owner says "now".

## Release

`0.8.1 R` once F1–F6 (and F7, F8 if approved) have merged or moved: CHANGELOG section in the release issue (K17),
`PRE-RELEASE CHECK 0.8.1` to Game Data Check; a patch has no RC play or freeze (DECISIONS 2026-10-20). The Release
Planner releases it by hand after `DATA OK 0.8.1`.
