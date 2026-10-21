# 0.9 item specs

Planned in the 0.9 planning pass. The Release Planner wrote it on 2026-10-20, after Kaizen's `KAIZEN REVIEW DONE 0.8`
(4:39 PM ET; [docs/kaizen/0.8-scorecard.md](../../kaizen/0.8-scorecard.md)) and the owner's yes to the review batch
(K19, K23, K24 and the outside audit trial; DECISIONS 2026-10-20). The audit, waves and owner asks are in ROADMAP "0.9".
The audits behind it are the step-2 architecture, UX and performance audits of 2026-10-20. They sit in the project's
shared folder, outside the repo, and every fact a builder needs from them is copied into the spec below.

Each item below becomes an issue titled `0.9 P<n>: …`, carrying this spec and its `After:` line. The owner's standing OK
until 1.0 (DECISIONS 2026-10-20, 5:13 and 5:15 PM ET) is the build go (`owner-ok-0.9-go`). The planner adds each issue's
`- [next]` line and its #114 line once this plan is reviewed and merged.

Every builder reads CLAUDE.md and docs/ARCHITECTURE.md first.

Rules for every item:
- `npm test` is green.
- A visible change commits before and after shots and a `scrapbook.json` (docs/reviews/README.md), and waits for Design
  Lead's DESIGN OK.
- An item meant to look the same says "No visible change".
- Acceptance lines are a review checklist: each one is marked pass or fail, with evidence.
- A data item pings Game Data Check on its PR ("PR #n ready at <sha7>"); `data/**` PRs merge only on her VERIFIED (#520).
- Items tagged **fresh review** carry the GitHub label `fresh-review` on their issue (K24). Code Review (Howard) or
  Design Review (Holly) briefs a reviewer with no history on the work before merge.
- **Pipeline items (S1–S4)** edit `.github/workflows/`, which bots don't. Build Pipeline (Gus) builds them in his own
  thread, one PR each. They have no queue line, and Code Review's fresh reviewer reads each one before merge.

## P1: Every unverified value on the page carries its label

- **Problem.** Game Data Check's K25 audit of the 0.8 release-candidate path (#607) found 230 fields the player sees
  that the data marks as not verified, shown with no label: board plans (74), stigma plans (62), specialty picks (35),
  core skill order (27), turn-in zones (7), 11 non-core rows tagged "single source" by mistake, and the Templar's
  inferred default keys. 0.8 P20 labelled only quest zones, Sealed Dungeon entrance and XP, stronghold level ranges and
  learn levels. CLAUDE.md: unverified data is left out or labelled. This is a policy gap, so it is first in the queue.
- **Result.**
  - gen carries `fieldStatus` and record `status` for the record kinds the audit lists: board plan nodes, stigma plan
    slots, specialty picks, core skill order, turn-in zones, default keys;
  - each such value renders with the existing P18 tag ("check in game" for disputed and owner-check, "inferred" for
    inferred; single source keeps its tag) in the Skills, Daevanion and Stigmas cards, Next up and the Build drawer;
  - where a whole list shares one status (a class's stigma plan, a class's default keys), one tag on the list's heading
    replaces per-row tags;
  - the 11 mis-tagged rows are fixed in the data.
- **Inputs.** `docs/research/2026-10-k25-rc-path-audit.md` (lands with #607; kickoff holds this item until it is on
  main).
- **Files.** `tools/gen/gen.mjs`, `src/packs/aion2/cards/rows.js`, `src/packs/aion2/cards/skills.js`,
  `src/packs/aion2/cards/daevanion.js`, `src/packs/aion2/cards/stigmas.js`, `src/packs/aion2/cards/build.js`,
  `src/packs/aion2/cards/nextup-kinds.js`, `data/packs/aion2/asmodian/*/builds.json` (the 11 rows), the tests.
- **No-gos.** No pinned counts (the audit's numbers move with every data fix). No new tag style. No data value changes
  beyond the 11 tags.
- **Acceptance.**
  - [ ] The P18 test is widened: it reads every status from the data and checks each rendered non-verified value shows
        its tag (row or list heading), and no verified value does, for all eight classes.
  - [ ] Shots of a labelled stigma plan, board plan and specialty pick at 1500 and 390 px, Basic and Advanced.
  - [ ] Golden diff limited to the tags.
- **Lanes:** gen, golden, rows, skills-card, build-card, nextup-card, daevanion-card. **Model:** Opus, M (90 min).
- **After:** none.

## P2: Save v6, the last clean break: stable keys for story, objectives, skills and stigmas

**Fresh review** (save key change).

- **Problem.** Save keys still come from names and positions. The story quest key is its `name` (gen.mjs:108),
  objective ticks are array positions (gen.mjs:438; journey.js:106,113), skill point keys use the skill `name`
  (gen.mjs:183), and stigma levels and picks the stigma name. A typo fix or an inserted objective silently moves or
  drops a player's ticks. CLAUDE.md forbids position keys within a key version. From 1.0 saves are strict, so this is
  the last chance to fix it with a clean break (architecture audit F1, top 1.0 blocker).
- **Result.**
  - story progress is keyed `sq:<id>`; `qsteps` / `qsub` by story key; each objective and sub-step has an explicit `i`
    in the data, unique and never reused, and gen checks that instead of setting `i` from the position;
  - skill points are `sp:<skillKey>`, stigma levels and picks by stigma key; skills and stigmas join the save-key
    uniqueness check;
  - the localStorage key moves to `companion-save-v6`; old saves are ignored and the app starts fresh (CLAUDE.md
    pre-1.0 rule); `mig1`, `mig2`, `journey` or `tests/e2-migtest.js` checks the break makes obsolete are removed or
    replaced, with the reason in the commit;
  - the 0.9.0 CHANGELOG draft gets "Saves reset in this version".
- **Files.** `tools/gen/gen.mjs`, `data/schema/*.schema.json` (objective `i`), `data/packs/**/story-quests.json` (ids),
  `src/core/state.js`, `src/core/migrations.js`, `src/core/merge.js`, `src/cards/journey.js`, `src/cards/nextup.js`,
  `src/packs/aion2/requirements.js`, `src/packs/aion2/nextup.js`, `src/packs/aion2/travel.js`,
  `src/packs/aion2/cards/nextup-kinds.js`, `src/packs/aion2/data/build.js`, `tests/support/save.js`,
  `tests/e2-migtest.js`, golden snapshots.
- **No-gos.** No migration from v5 (pre-1.0 rule). No other key renamed. No visible change beyond a fresh start.
- **Acceptance.**
  - [ ] New core test: on a data copy, renaming a story quest's `name` and inserting an objective with a new `i`
        mid-list leave a save's progress identical.
  - [ ] Core test: a renamed skill `name` keeps its `sp:` ticks; gen negative control for a duplicate skill key fails.
  - [ ] A v5 save in localStorage is ignored, not read and not deleted; the app starts fresh (browser `save` suite).
  - [ ] `golden --explain` table pasted and reviewed.
- **Lanes:** gen, golden, mig, nextup-card, journey-card. **Model:** Opus, L (120 min).
- **After:** none.

## P3: Tests read the class list from the data

- **Problem.** Every class release edited hand-kept lists in the tests: allowed and hidden classes in
  `tests/e2test.js` (around lines 202–204) and per-class counts and leak words in `tests/schema.mjs` (around 205–272),
  plus filters in `chars.test` and the equivalence test (architecture audit F4; Kaizen K22). Those are the files where
  0.8's parallel class builds collided.
- **Result.**
  - e2 asserts hidden URLs are in DATA_SOURCES and off the card for whatever `hiddenDirs` holds; the other classes are
    `pack.json` `classes` minus the default;
  - schema runs one loop over the guide packs, with counts read from each class's files and leak words from its own
    records (class id, skill names, game ids); an idle-pack test uses the fake-game fixture (`tests/fixtures/packs`);
  - `chars.test` and the equivalence test filter from the class list; the PR-history comments go.
- **Files.** `tests/e2test.js`, `tests/support/v1view.js`, `tests/schema.mjs`, `tests/core/chars.test.mjs`,
  `tests/equiv/evaluator-equivalence.test.mjs`.
- **No-gos.** No `src/` or data change. No check dropped: each per-class assertion becomes a loop assertion.
- **Acceptance.**
  - [ ] A packs copy with a ninth fake class (or one class flipped to hidden) passes e2 and schema with zero test-file
        edits (pasted run).
  - [ ] Negative control: a leaked record still fails.
- **Lanes:** schema, e2. **Model:** Sonnet, M (90 min).
- **After:** none.

## P4: Dead code and a wider term scan

- **Problem.** 33 hand-over names and their `main.js` imports are unused, plus the claude.ai export branch (the artifact
  is deleted; owner, 2026-10-20), `site.js`'s `window.claude`, inert `@web-only` markers, a dead `lists` loop and the
  retired local `dvPts` / `crystals`. The term scan that keeps AION 2 words out of the engine skips `src/cards/`,
  `src/shell/` and `main.js` (architecture audit F6).
- **Result.** The dead code is gone; `tests/core/terms.test.mjs` scans `src/cards/`, `src/shell/` and `main.js` too
  (0 hits today).
- **Files.** `src/cards/page.js`, `src/main.js`, `src/site.js`, `src/index.html`, `scripts/build.mjs` (marker code),
  `tests/core/terms.test.mjs`.
- **No-gos.** No behaviour change. No visible change.
- **Acceptance.**
  - [ ] dom-snapshot and golden identical.
  - [ ] Negative control: a planted term in `main.js` fails the term scan.
- **Lanes:** main.js, page-card. **Model:** Opus, S (44 min). Opus because it edits `scripts/`.
- **After:** none.

## P5: Measure the page right, and skip identical writes

- **Problem.** The page is at 89% of its gzip budget and 89% of its element budget, `update()` at about 84% of its
  advisory limit, and growth is about +8 K gzip a release, so 0.9 has even odds of tripping a blocking budget mid-minor
  (performance audit §5). `--sizes` overstates per-class tables about eightfold because it counts all eight chunks.
  ARCHITECTURE §4 still says identifiers are never minified (#597 turned it on). About 90% of the `innerHTML` writes in
  a no-change `update()` repeat the same HTML. The budget trend in ROADMAP lost its element and `update()` rows.
- **Result.**
  - `--sizes` computes marginals on the budgeted page (`index.html` plus the largest chunk); ARCHITECTURE §4 matches
    the build;
  - one helper (`setHTML(el, html)`, last string in a `WeakMap`) used by the renderers `update()` calls, except where
    code changes the same subtree after the write (each such call site keeps `innerHTML`, with the reason in a
    comment);
  - `tests/site.js` also logs, without gating, the element count at 1500 px, Advanced, Lv 39;
  - the ROADMAP planning step's budget trend gets its element and `update()` rows back.
- **Files.** `scripts/build.mjs` (`--sizes` only), `src/core/cards.js` or a new `src/shell/html.js`,
  `src/packs/aion2/cards/{skills,progress,build,daevanion,page}.js`, `src/cards/{nextup,milestones}.js`,
  `tests/site.js`, `docs/ARCHITECTURE.md` §4, ROADMAP step 2's budget line.
- **No-gos.** No budget raise. No lazy loading (P23). No visible change.
- **Acceptance.**
  - [ ] `node scripts/build.mjs --sizes` shows SOURCES at about 9.6 K, and chunk rows add up to within 1% of the chunk.
  - [ ] A blocking count check: a second `update()` with no state change makes at most N real writes.
  - [ ] `npm run test:perf` run alone three times: median down at least 25% against a same-day baseline (pasted).
  - [ ] Golden and regress pinned diffs unchanged.
- **Lanes:** site, skills-card, nextup-card, page-card, architecture, build-card, daevanion-card. **Model:** Opus, M (90 min).
- **After:** none.

## P6: Faster test suites

**Fresh review** (merge-gate change: what CI runs).

- **Problem.** The data suite takes 12.7 s, the invariant suite 89.3 s and golden 287 s. The ledger check lives inside
  the data suite, so a DECISIONS-only edit can red `schema`. Schema mutations copy the data tree 14 times. P12 will
  multiply the invariant suite by eight classes (architecture audit F8).
- **Result.**
  - the ledger check is its own `ledger` suite in the `checks` shard;
  - schema mutations run in memory through `loadBundle({ mutate })`;
  - the invariant check "1, 2, 6" (27 s) is profiled and made faster before P12;
  - data counts live in one reviewed `expected-counts.json`, written by `npm run gen -- --counts`.
- **Files.** `tests/schema.mjs`, `tests/ledger.mjs`, `tests/run.mjs`, `tests/invariant/next-up.test.mjs`,
  `data/packs/aion2/checks.mjs`, `tools/gen/gen.mjs`.
- **No-gos.** No check removed or loosened; every negative control still fails. No workflow edit (S1 splits the golden
  shard).
- **Acceptance.**
  - [ ] `--check-shards` passes; schema under 4 s and invariant under 60 s locally (pasted timings, before and after).
  - [ ] Every negative control still fails (pasted list).
  - [ ] A DECISIONS-only edit no longer reds `schema`.
- **Lanes:** gen, schema, run-mjs. **Model:** Opus, M (90 min).
- **After:** none.

## P7: Raising the level by hand asks for the story quest

- **Problem.** A player who moves the level slider or + from Lv 2 to Lv 39 keeps the story at Lv 2, so Daevanion and
  Stigmas stay locked ("Opens after "Urgent Pursuit""), while Next up tells them to use the board card ("Zikel board
  opens … Missed"). The cards contradict each other (UX audit finding 2, verified on the Assassin; the code path is
  shared, so the other classes are inferred).
- **Result.**
  - when the level jumps more than 5 levels past the current story quest's level, Journey shows an inline prompt:
    "You're Lv 39 but your story is at Lv 2. Which story quest are you on?", reusing the welcome card's quest select
    (`joinQuestOf`);
  - Next up never points at a locked card.
- **Files.** `src/cards/journey.js`, `src/cards/journey.html`, `src/cards/welcome.js`, `src/packs/aion2/nextup.js`,
  the tests.
- **No-gos.** The level is still changed only by Level up, − / +, the slider and verified auto level-up (owner rule);
  the prompt never changes the story by itself.
- **Acceptance.**
  - [ ] Browser test: slider 2 → 39, answer the prompt, Daevanion and Stigmas open; skip it, and Next up names no locked
        card.
  - [ ] Shots at 1500 and 390 px.
- **Lanes:** journey-card, nextup-card, golden-journey, golden-nextup. **Model:** Opus, M (90 min).
- **After:** none.

## P8: Small text and colour fixes

- **Problem.** UX audit finding 13 (verified): Skills says "1 PT TO SPEND" and two lines lower "0 pts left"; an info
  button's accessible name reads "What is Respec is free?"; Next up's hero "Spent" button is green at 1500 px and pink
  at 390 px in the same state; at 390 px Next up cuts the key hint before its row placement. Design Lead found (#610, F1)
  that the E grid shows stigmas not yet equipped while "Coming to E" lists them too.
- **Result.** The point counts agree; the info button has its own name; one colour for the "Spent" state at both
  widths; the key hint keeps its row placement at 390 px (the start of the line is shortened instead); the E grid shows
  only equipped stigmas.
- **Files.** `src/packs/aion2/cards/skills.js`, `src/data/markup.js`, `src/styles/app.css`,
  `src/packs/aion2/cards/nextup-kinds.js`, `src/packs/aion2/cards/build.js`, the tests.
- **No-gos.** No new colour or token.
- **Acceptance.**
  - [ ] a11y test: no accessible name contains "is … is".
  - [ ] Shots of each fix at 1500 and 390 px.
- **Lanes:** app.css, a11y, skills-card, build-card, nextup-card, golden-nextup. **Model:** Opus, S (44 min). Opus because golden-nextup may need a re-record (the key hint).
- **After:** none.

## P9: Saves can't be lost from 1.0 on

**Fresh review** (save and storage).

- **Problem.** From 1.0 a newer save opened by an older build (a stale tab, a cached service worker) is overwritten,
  and unreadable save text is replaced without a copy. There are no per-character migration flags (`state.js:85,95`;
  architecture audit F2).
- **Result.**
  - a save with `v` above the build's `SAVE_V` opens read-only with a banner and is never written;
  - unreadable text is copied to `<KEY>:unreadable` before the fresh start;
  - per-character `migs` flags, with a union rule in `merge()`;
  - ARCHITECTURE §1 "from 1.0" steps rewritten.
- **Files.** `src/core/state.js`, `src/core/migrations.js`, `src/core/merge.js`, `src/main.js` (banner),
  `tests/core/state.test.mjs`, `tests/core/migrations.test.mjs`, `tests/save.js`, `docs/ARCHITECTURE.md` §1.
- **No-gos.** No save key change (P2 made the break). No migration runs yet.
- **Acceptance.**
  - [ ] Core: a v7 save under a v6 reader is left byte-identical; unreadable text is kept; a flagged step runs once per
        character and survives `merge()`.
  - [ ] Browser `save`: a newer save is not overwritten after a tick.
  - [ ] Shot of the read-only banner at 390 px.
- **Lanes:** mig, main.js, save, architecture. **Model:** Opus, M (90 min).
- **After:** P2.

## P10: A ledger of every save key

**Fresh review** (save keys).

- **Problem.** Nothing fails when a data edit removes a key a save still holds (architecture audit F2).
- **Result.** gen writes `data/packs/<guide>/save-keys.json` (committed, like DATA_SOURCES.md): story keys, objective
  ids, `rq` / `sd` / `sh` / `dv` / `sp` / milestone keys. `gen:check` fails when a key disappears without a `retired`
  entry; `retired.json` gains `renamedTo` and a faction-level file.
- **Files.** `tools/gen/gen.mjs`, `data/schema/retired.schema.json`, `data/schema/save-keys.schema.json` (new),
  `tests/schema.mjs`, `data/packs/**/save-keys.json` (generated, committed).
- **No-gos.** No key renamed.
- **Acceptance.**
  - [ ] Schema negative controls: a removed key fails; a retired one passes; a rename without `renamedTo` fails.
- **Lanes:** gen, schema. **Model:** Opus, M (90 min).
- **After:** P2.

## P11: The class roster and golden groups come from the data

- **Problem.** `pack.js` `classes`, `tests/golden/states.js` and the per-class blocks in `tests/save.js` are written by
  hand for each class (architecture audit F4).
- **Result.** gen emits `GUIDE_CLASSES` (released guide packs with names); `pack.js` reads it; golden states loop over
  it with the same ids, so snapshots stay identical; `tests/save.js` per-class blocks become one loop.
- **Files.** `tools/gen/gen.mjs`, `src/packs/aion2/pack.js`, `tests/golden/states.js`, `tests/save.js`.
- **No-gos.** No snapshot change. No visible change.
- **Acceptance.**
  - [ ] Golden identical; `tests/core/chars.test.mjs` green.
  - [ ] A dry run adding a fake class touches only `data/`, snapshots and `DATA_SOURCES.md` (pasted diff stat).
- **Lanes:** gen, golden, save. **Model:** Opus, M (90 min).
- **After:** P2, P3.

## P12: Runtime invariants for every class

- **Problem.** The invariant oracle and the Node gates sweep run on the Assassin only (architecture audit F3). Seven
  classes have no correctness test beyond golden.
- **Result.** A core bundle per guide pack; the invariant oracle and gates sweep run on every class, sampling about
  1,000 states per class with ticks drawn from that class's catalog; golden gets per-class states with ticks.
- **Files.** `tests/support/core-bundle.mjs`, `tests/invariant*.mjs`, `tests/invariant/states.mjs`,
  `tests/core/nextup.test.mjs`, `tests/golden/states.js`, golden snapshots.
- **No-gos.** The invariant suite stays under its time limit (P6 makes room). No `src/` change; a disagreement found is
  filed as its own bug, not fixed here.
- **Acceptance.**
  - [ ] Invariant reports 8 chains and 0 disagreements, under its limit (pasted).
  - [ ] A bug seeded in one non-Assassin class is caught (negative control).
- **Lanes:** golden. **Model:** Opus, L (120 min).
- **After:** P11, P6.

## P13: Class facts out of the code

- **Problem.** Some game facts live in code: the E-before-Q key order (`build.js:88`), unlock rows matched by text
  (`nextup.js:201`), and the map base `altgard` (architecture audit F7). CLAUDE.md: game facts go in `data/`.
- **Result.** The key order is a `keyStacks` field; unlock rows are matched by id or flag; the map base is per faction
  in the zones data.
- **Files.** `src/packs/aion2/cards/build.js`, `src/packs/aion2/nextup.js`, `src/packs/aion2/cards/maps.js`,
  `src/packs/aion2/cards/areas.js`, `data/packs/**`, `data/schema/builds.schema.json`, `tools/gen/gen.mjs`.
- **No-gos.** No visible change.
- **Acceptance.**
  - [ ] Golden identical.
  - [ ] A grep finds no skill or quest name literal in `src/packs/aion2/**/*.js` outside comments (pasted).
- **Lanes:** gen, golden, build-card, nextup-card. **Model:** Opus, M (90 min).
- **After:** P2.

## P14: ARCHITECTURE matches the code

- **Problem.** ARCHITECTURE's numbers have drifted, P5 and P8 of its own plan are open, and it doesn't describe the 1.0
  save contract (architecture audit F10).
- **Result.** Numbers from a fresh run; its open P items closed or re-planned; the 1.0 save contract after P2, P9 and
  P10 described; `tests/run.mjs` header matches.
- **Files.** `docs/ARCHITECTURE.md`, `tests/run.mjs` (header comment).
- **No-gos.** No code change.
- **Acceptance.**
  - [ ] Every number in it matches a run pasted in the PR.
- **Lanes:** architecture, run-mjs. **Model:** Sonnet, S (44 min).
- **After:** P9, P10.

## P15: Every choice point has a recommendation

- **Problem.** The guide still shows choices with no pick: Ranger and Spiritmaster have empty `specialtyPicks`, so no
  specialty step ever shows (UX audit finding 3, verified in data); specialty slots 2 and 3 open with "pick a
  specialty" (owner note 5); picks ignore the effective skill level that board nodes add (owner note 6). The owner's
  rule: a choice always carries a recommendation from Game Data Check's data (Kaizen K25).
- **Result.**
  - a `choicePoints` hook in the pack checks: gen fails on a choice site with no pick and no `noPick.reason`; the first
    sites are specialty slots 1–3 of core actives, stigma slots, and specialty slots reachable by Lv 45;
  - the picks Game Data Check sourced are in the data for all eight classes, with their labels;
  - a pick that opens earlier through board nodes shows at the effective level.
  - the census's data issues are fixed (Game Data Check, #614: 166 choice points, 79 without a pick, 5 data issues, e.g.
    the Gladiator's Ruinous Blow pick ships unlabelled though its verdict is disputed).
- **Inputs.** `docs/research/` file named with `choice-points` (Game Data Check).
- **Files.** `data/packs/aion2/checks.mjs`, `tools/gen/gen.mjs`, `data/schema/builds.schema.json` (`noPick`),
  `data/packs/aion2/asmodian/*/builds.json`, `src/packs/aion2/requirements.js`, `src/packs/aion2/cards/nextup-kinds.js`,
  `src/packs/aion2/cards/skills.js`, the tests.
- **No-gos.** No pick without a source or label. No new art.
- **Acceptance.**
  - [ ] Schema negative control: removing one `specialtyPicks` entry fails gen, naming the site.
  - [ ] All eight classes pass or carry a `noPick.reason`.
  - [ ] Shots of a Ranger specialty step and a slot-2 pick.
- **Lanes:** gen, golden, skills-card, nextup-card. **Model:** Opus, M (90 min).
- **After:** research-choice-points.

## P16: Board paths and node costs for every class

- **Problem.** The owner's Lv 39 notes found the Assassin's board advice incomplete: costs per board (note 1, fixed for
  the Assassin in 0.8.1), the corner choice (note 2), Zikel's order and corner path (note 3), and nodes the Vaizel crit
  corner unlocks on the way (note 4). They asked for the same audit of every class (note 14).
- **Result.** The board plans and node costs Game Data Check's audit sources are in the data for all eight classes, each
  path choice with a reason, and the cost box pre-filled per board.
- **Inputs.** `docs/research/` file named with `node-paths` (Game Data Check).
- **Files.** `data/packs/aion2/asmodian/*/builds.json`, `data/packs/aion2/boards.json`, `tools/gen/gen.mjs` (if a field
  is added), `src/packs/aion2/cards/daevanion.js`, the tests.
- **No-gos.** No path without a source or label.
- **Acceptance.**
  - [ ] Each class's board totals match the research file (a test reads the totals from the data and checks them
        against the per-node costs).
  - [ ] No plan asks for more points than the player has: at each row's level, the cumulative cost is at most the
        level points plus the crystals the data says are earned by then (a test checks every class). Game Data Check's
        corrected count (#614, 3d48d2f): 106, 181, 262 and 314 points at Lv 20, 30, 40 and 45 for a player who does the
        regional quests and Sealed Dungeons, so the Assassin's 184 by Lv 40 fits; for a player who skips that side
        content, row order decides what they can afford, so the cheapest high-value rows come first. Two rows cost 0
        because an earlier path buys the node (Ranger Focused Eye, Templar Guarding Seal); move them earlier.
  - [ ] Shots of one non-Assassin board.
- **Lanes:** gen, golden, daevanion-card. **Model:** Opus, M (90 min).
- **After:** research-node-paths.

## P17: The Assassin's E stigma stack

- **Problem.** The owner asked whether Illusive Clone > Swift Contract > Triniel's Dagger > Savage Fang really belong
  on one key (note 13).
- **Result.** Game Data Check's answer is applied to the Assassin's `keyStacks` and default keys; if the stack is
  right, the research file says so and this item closes with no change.
- **Inputs.** `docs/research/` file named with `e-stack` (Game Data Check).
- **Files.** `data/packs/aion2/asmodian/assassin/builds.json`, `data/packs/aion2/asmodian/assassin/guide/*.json`.
- **No-gos.** Other classes are not changed here.
- **Acceptance.**
  - [ ] Shot of the Assassin's key setup before and after (or the research line that closes it).
- **Lanes:** gen, golden. **Model:** Opus, S (44 min).
- **After:** research-e-stack.

## P18: How the rotation plays out

- **Problem.** The owner wants more detail on how the rotation actually plays (note 15). The Build drawer lists the
  order but not the strategy.
- **Result.** For each class Game Data Check sourced, a short "how it plays" text under the rotation (opener, the loop,
  what to hold for), in the guide data.
- **Inputs.** `docs/research/` file named with `rotation-play` (Game Data Check).
- **Files.** `data/packs/aion2/asmodian/*/guide/*.json`, `src/packs/aion2/cards/build.js`, `src/packs/aion2/cards/build.html`,
  the tests.
- **No-gos.** Facts only, never a source's wording (thegameswiki is CC BY-NC-SA). No text without a source or label.
- **Acceptance.**
  - [ ] Shots of the Assassin's drawer at 1500 and 390 px.
- **Lanes:** gen, golden, build-card. **Model:** Opus, M (90 min).
- **After:** research-rotation-play.

## P19: Catch-up for late starts: Skills

**Fresh review** (new look).

- **Problem.** A player who joins at Lv 39 is walked through skill levels in unlock order: 70–77 "Mark spent" clicks,
  with no per-skill target (UX audit finding 1; owner note 10: "level this skill from 1-x, pick x,y,z specialty").
- **Result.** As Design Lead's approved mock shows: for a joined save (or when skill lines behind the level exceed a
  threshold), the Skills card and Next up show one row per build skill, "Heart Gore → Lv 10 · specialty: <name>", in
  the build's priority order, with one "Done" per skill that ticks its lines up to the target (one tap per skill,
  undoable); "Missed" skill lines in milestones fold behind it.
- **Inputs.** `docs/design/0.9-catchup/` (Design Lead's mocks, #619 and #656; merged with Design Lead's look OK after the fresh review; owner 2026-10-20 5:21 and 5:24 PM ET). Kickoff holds the item until they are on main.
- **Files.** `src/packs/aion2/cards/skills.js`, `src/packs/aion2/cards/skills.html`, `src/packs/aion2/nextup.js`,
  `src/packs/aion2/cards/nextup-kinds.js`, `src/packs/aion2/requirements.js`, `src/core/nextup.js`,
  `src/packs/aion2/cards/journey-sections.js`, `src/styles/app.css`, the tests.
- **No-gos.** Progress stays manual: nothing is ticked without a tap. No save key change.
- **Acceptance.**
  - [ ] Browser test: a Lv 39 join reaches every skill's target in one tap per skill; Undo reverses a tap.
  - [ ] Endgame case (beta tester T1, owner report 2026-10-20 10:07 PM ET: "pretty clunky getting his skills caught
        up"), measurement only: the same test on a Lv 45 join holding 180 stones, one tap per skill and no per-line
        "Mark spent" clicks. Baseline on live 0.8.0 (Player Testing's endgame catch-up
        script, 2026-10-21): 141 clicks for skills including specialty picks; paste the new count with the same script.
        Per-class baselines (8-class sweep #721, main 26c76f3): Templar 114, Cleric 104, Sorcerer 105, Chanter 105,
        Ranger 99, Gladiator 94, Spiritmaster 99; paste every class's new count.
  - [ ] Shots at 1500 and 390 px, Basic and Advanced, against the mock.
- **Lanes:** skills-card, nextup-card, app.css, golden, golden-nextup. **Model:** Opus, L (120 min).
- **After:** P15.

## P20: Catch-up for Daevanion and Stigmas, with respec per board and for Stigmas

**Fresh review** (new look).

- **Problem.** At Lv 39 Daevanion opens on the first Nezekan node with blank totals and takes about 22 ticks; there is no
  per-board catch-up or respec (UX finding 6; owner note 9). The Stigmas card has no Respec and about 190 px of empty
  space, with its four planned stigmas hidden in the collapsed "Slots" (UX finding 7; owner note 9).
- **Result.** As Design Lead's approved mock shows: one row per open board ("Nezekan · 10 guide nodes", "Have them",
  "Respec this board") plus "Respec all"; the Stigmas card lists its slots like Skills' and Daevanion's "Coming up", with
  a Respec in its foot.
- **Inputs.** `docs/design/0.9-catchup/` (Design Lead's mocks, #619 and #656; merged with Design Lead's look OK after the fresh review; owner 2026-10-20 5:21 and 5:24 PM ET). Kickoff holds the item until they are on main.
- **Files.** `src/packs/aion2/cards/daevanion.js`, `src/packs/aion2/cards/daevanion.html`,
  `src/packs/aion2/cards/stigmas.js`, `src/packs/aion2/cards/stigmas.html`, `src/styles/app.css`, the tests.
- **No-gos.** No save key change. Respec costs and whether a Stigma reset refunds or unequips only from sourced data
  (Game Data Check's `respec` research file: Design Lead's asks D1 and D2).
- **Acceptance.**
  - [ ] Browser test: "Have them" ticks one board's guide nodes, "Respec this board" clears only that board, Undo
        reverses both; Stigmas Respec clears the slots.
  - [ ] Endgame case (beta tester T1, owner report 2026-10-20 10:07 PM ET), measurement only: a Lv 45 join holding the
        tester's 336 Daevanion crystals and 90 stigma shards catches up every open board and the stigma slots in one tap
        each.
        Baseline on live 0.8.0 (the same script): 31 clicks for stigmas and 24 for Daevanion; paste the new counts.
        The other 7 classes (sweep #721): 24 stigma clicks each; paste their new counts. Their Daevanion count is 0
        because no path costs exist yet (1.0 scope, owner screens via Game Data Check), so only the Assassin's is measured.
        Stigmas past Lv 45 ("didn't seem to scale well with endgame") are 0.10's endgame scope, not this item.
  - [ ] Shots at 1500 and 390 px against the mock.
- **Lanes:** app.css, golden, daevanion-card. **Model:** Opus, M (90 min).
- **After:** P16, research-respec.

## P21: One view: the essentials by default, the rest in folds; early chores fold away

**Fresh review** (save field no longer read, bug-report payload, owner-approved looks rewritten; Code Review the code half, Design Review the design half).

- **Problem.** Basic and Advanced are two views to maintain: about 20 `body.basic` CSS rules and 22 mode branches
  (`main.js`, `nextup.js`, `page.js`, `nextup-kinds.js`, `daevanion.js`, `milestones.js`), and Basic gaps keep turning
  up as bugs (no Respec in Basic, owner note 7; the rail race, #105; the locked shells). Basic also hides the late
  starter's tools (UX finding 4), and a Lv 39 join's Next up leads with Lv 4–16 "Missed" chores (UX finding 8). The owner
  asked whether two views need to exist (2026-10-20 5:45 PM ET); DECISIONS "One view" (team, after the outside critic).
- **Result.** As Design Lead's hide list and mock show: no mode switch. Each card shows its headline step and main button;
  what only Advanced showed is a fold, closed by default, that remembers being opened. For a joined save, "Missed" chores
  more than 10 levels old fold into one row ("12 early steps you probably did · Review") with one undoable "All done".
  The critic's conditions, each a stated line in the PR body:
  1. Next up shows one list, as the hide list names it (Basic's filtered list leads; adv and later cards move to the
     line the hide list gives them). `rankNext`'s `basic` option and the forced Fastest track go.
  2. The default flips for saves that open in Advanced today (`src/main.js` reads no `mode` as Advanced): the PR names
     each thing those players stop seeing first.
  3. The Fastest / Completionist toggle ends as the hide list says (kept as a "Main path only" control with its
     drawbacks text, or removed with that text moved), never silently.
  4. Every rule that names Basic is rewritten in the same PR from the owner's 5:45 PM words: CLAUDE.md "Basic mode =
     essentials only", the review checklist's Basic and Advanced line, and the DECISIONS rows the "One view" row lists
     (the Release Planner writes the DECISIONS text; the build proposes it in the PR body).
  Also: fold state lives in the save's existing `open` map (per fold id; no new field); the save's `mode` field stops
  being read and leaves the bug-report payload (no key bump, pre-1.0 rule); the rail
  keeps one behaviour on purpose (Basic's rail styles in `app.css` are layout, not hiding).
- **Inputs.** `docs/design/0.9-one-view.md` (Design Lead's hide list: every element Basic hides today marked default
  open, fold or drop, with the drops named), `docs/design/0.9-catchup/`
  (Design Lead's mocks with the look OK; owner 2026-10-20 5:21 and 5:24 PM ET). Kickoff holds the item until they are on
  main.
- **Files.** `src/main.js`, `src/core/nextup.js`, `src/cards/nextup.js`, `src/packs/aion2/nextup.js`,
  `src/packs/aion2/cards/{nextup-kinds,daevanion,milestones,page}.js`, `src/styles/app.css`, `src/styles/sync.css`,
  `CLAUDE.md` (the Basic line only), `docs/reviews/README.md` (the checklist line), the tests.
- **No-gos.** Nothing the hide list marks "drop" goes without its line in the PR body. No save key change. No new motion.
- **Acceptance.**
  - [ ] A test fails if any `body.basic` rule or `basic` / `mode` branch is left in `src/`.
  - [ ] A test: a save with `mode: 'advanced'` and one with no `mode` open the same page.
  - [ ] Browser test: "All done" ticks the folded chores and Undo reverses it; a fold opened stays open after reload.
  - [ ] Before / after shots at 1500 and 390 px of a fresh Lv 1, a Lv 39 join and a Lv 39 Advanced save, `scrapbook.json`.
- **Lanes:** main.js, nextup-card, page-card, daevanion-card, app.css, golden, golden-nextup. **Model:** Opus, L (120 min).
  Steps (K1): the hide-list test, then the folds card by card, then Next up's one list, then the rule rewrites.
- **After:** none.

## P22: Key setup as a sheet: icons fill each box, and players choose their keys

**Fresh review** (new look; a new save field).

- **Problem.** The owner asked for key setup to rise from the bottom of the screen on desktop (note 11), and for the
  icons to fill each key box with the name in a tooltip, since the rotation already names them (note 12). Players can't
  set their own keys (#388). The Gladiator's and Ranger's key setups are bare next to the Assassin's (UX finding 11).
  Design Lead made 11, 12 and #388 one design (#610). Beta (owner, 2026-10-20 10:07 PM ET): the skill bar must match
  the game exactly, and today's macro model is wrong (right-click can cycle more than 4 keys); the owner also asked for
  a simple "autopilot" layout (hold left / right click plus Q / E / R / F) next to the advanced split. Game Data Check
  ruled that a macro steps through slots, so it can cycle more than 4 skills, and that the macro is drawn as steps; the
  ruling lands as a `skill-bar` research file (`research-skill-bar`). The grid follows the game, row 0 at the bottom
  (DECISIONS `owner-ok-0.9-key-grid`, 2026-10-20 10:16 PM ET). Design Lead writes `docs/design/0.9-keys-macro.md`:
  whether the simple layout and the macro steps change the keys mock, with the updated mock in `docs/design/0.9-keys/`
  if they do.
- **Result.** As Design Lead's approved mock shows: key setup is a bottom sheet; icons fill each box with a tap or
  focus tooltip; each key chip can be tapped to rebind; one `keys` save field with the class default when empty (no key
  bump); every class in the same layout. The right-click macro is a list of steps, each naming a slot (a slot holds at
  most 4 skills; a macro can step through several), replacing the flat `keyStacks.rightClick` stack in the data and
  its schema for every class, per the skill-bar research file; its step limit comes from that file or is labelled
  unknown.
- **Inputs.** `docs/design/0.9-keys/` (Design Lead's mocks, #619 and #656; merged with Design Lead's look
  OK after the fresh review; owner 2026-10-20 5:21 and 5:24 PM ET), `docs/design/0.9-keys-macro.md` (Design Lead's
  call on the simple layout and macro steps). Kickoff holds the item until both are on main.
- **Files.** `src/packs/aion2/cards/build.js`, `src/packs/aion2/cards/build.html`, `data/schema/` (the key stacks),
  `data/schema/examples/**/builds.json`, `data/packs/aion2/asmodian/*/builds.json` (`keyStacks`), `tools/gen/*`,
  `src/packs/aion2/data/build.js`, `src/core/state.js` (`keys`
  default), `src/core/merge.js`, `src/styles/app.css`, `tests/a11y.js`, `tests/save.js`, the tests.
- **No-gos.** Only keys AION 2 can bind (Game Data Check's `bindable-keys` file: Design Lead's ask D3). No save key bump;
  an empty or unknown `keys` value falls back to the default. Names stay reachable by keyboard and screen reader.
- **Acceptance.**
  - [ ] a11y: each key box has an accessible name; the tooltip opens on focus; rebinding works by keyboard.
  - [ ] Core: a save without `keys` loads with the default; `merge()` keeps the newer `keys`.
  - [ ] `npm run gen` passes with the stepped macro for every class; Game Data Check's `DATA OK` on the head.
  - [ ] Shots at 1500 and 390 px against the mock.
- **Lanes:** gen, build-card, app.css, a11y, golden, mig, save. **Model:** Opus, L (120 min).
- **After:** research-bindable-keys, research-skill-bar, owner-ok-0.9-key-grid.

## P23: The Sources lists load when the card opens

- **Problem.** SOURCES is 9.6 K gzip and its card 1,088 collapsed elements, both out of view until the card opens
  (performance audit F6). Without it the page likely crosses its gzip and element budgets at 1.0.
- **Result.** The per-page link lists move to an on-demand chunk (precached by `sw.js`, like the sync chunk), rendered on
  the card's first open; the page keeps the count line and, if the owner chooses it, one plain link per source site.
- **Files.** `scripts/build.mjs`, `scripts/generated-data.mjs`, `src/cards/sources.js`, `src/sw.js`, `tests/site.js`,
  `tests/regress.js`, `tests/e2test.js`.
- **Gate.** Source Vetting (Lydia) and an outside reviewer check that per-page credit links rendered on open still meet
  CLAUDE.md's "plain dofollow links" credit and Metabot's terms; their verdict is a `docs/research/` file named with
  `sources-credit` (owner, 2026-10-20 5:24 PM ET: the team decides after an outside review).
- **No-gos.** Every URL still reaches the Sources card and `data/DATA_SOURCES.md`.
- **Acceptance.**
  - [ ] Budget lines show gzip about 169 K and elements about 4.4 K (pasted).
  - [ ] An offline reload opens Sources from the cache (new `site` check).
  - [ ] Every URL check passes after the card is opened. No visible change in before / after shots.
- **Lanes:** site, page-card, e2. **Model:** Opus, M (90 min).
- **After:** research-sources-credit.

## P24: Terms of Use, and robots.txt blocks AI training crawlers

- **Problem.** The site has no Terms of Use, and `public/robots.txt` allows every crawler, AI training crawlers included,
  while LICENSE reserves the guide text, data selection, name and art. Source Vetting drafted both (coordinator routing,
  2026-10-20). Published terms are legal text in the owner's name, so the final text is the owner's
  (`owner-ok-0.9-terms`).
- **Result.**
  - `TERMS.md` at the repo root: the owner-approved text from `docs/legal/TERMS.md`, verbatim, with its date.
  - The footer links "Terms" next to "Privacy", in the same form (a GitHub link, new tab).
  - `public/robots.txt`: the training crawlers in `docs/legal/robots-policy.md` get `Disallow: /`; `*` stays allowed
    (search engines and user-triggered assistants); the AI search crawlers as the owner chose; the sitemap line stays;
    the comment points at the Terms' GitHub URL (the site serves no `/TERMS.md`).
  - CHANGELOG notes the new Terms.
  - LICENSE part 2 gains one sentence matching the Terms' quotes line (a sentence or two, with a link back to the page),
    per the owner's quotes call (DECISIONS `owner-ok-0.9-terms`).
- **Inputs.** `docs/legal/TERMS.md`, `docs/legal/robots-policy.md` (land with the owner-ok row; kickoff holds the item
  until they are on main).
- **Files.** `TERMS.md`, `LICENSE` (the one part 2 sentence), `src/index.html` (the footer line only), `public/robots.txt`,
  `tests/site.js`, `CHANGELOG.md`.
- **No-gos.** No wording change to the approved text. The footer keeps "unofficial" and "not affiliated with or endorsed
  by NCSoft". Search engines stay allowed.
- **Acceptance.**
  - [ ] `tests/site`: robots.txt blocks `GPTBot` and `ClaudeBot` with `Disallow: /`, keeps `User-agent: *` / `Allow: /` and
        the sitemap line; the footer has a Terms link to `TERMS.md`; `TERMS.md` matches `docs/legal/TERMS.md` except the
        "Effective:" field. Robots R2 asserts (`docs/legal/robots-policy.md`): `Claude-User` and `ChatGPT-User` are in the
        blocked group; `OAI-SearchBot`, `Claude-SearchBot` and the four preview bots are not.
  - [ ] Code Review checks the Terms' code-licence sentence against LICENSE (T-62 fix 3), and the new part 2 sentence
        against the Terms' quotes line.
  - [ ] Source Vetting's live crawler re-check runs before the robots text freezes, noted on the PR.
  - [ ] Before / after shots of the footer at 1500 and 390 px, `scrapbook.json`; Design Lead's DESIGN OK.
- **Review:** blind (owner-held legal text; Code Review the code).
- **Lanes:** site, page-card. **Model:** Sonnet, S (45 min).
- **After:** P23, owner-ok-0.9-terms. If the owner's OK isn't in by 0.9's release gate, P24 moves to 0.10.
- **Planner notes (2026-10-21).** The owner's three Terms calls are in (DECISIONS `owner-ok-0.9-terms`). The owner
  approved the full text as drafted ("Ship as drafted", 2026-10-21 12:18 PM ET, same row), so the item ships it word for
  word once its reviews pass. Not in this item: the Report a problem warning (a
  visible change with shots, own item) and the Terms Contact line plus the site line naming the private address (P33).

## P25–P27: compliance checks (Legal's CK-1 to CK-3)

Legal & Compliance (Chuck) found three rules with no test (compliance register C4, C6, C10; sent 2026-10-20) and
routed them here as build items. Each turns an existing rule into a check and loosens nothing. They share one new file,
`tests/compliance.mjs`, which the `schema` suite runs after the ledger checks, so they run in order on the schema lane.

## P25: A licence header or file other than ours fails CI (CK-1)

- **Problem.** Code is PolyForm Strict 1.0.0 and CLAUDE.md bans MIT or other licence headers or files, but nothing
  checks it (register C4: "no test for stray licence headers or files").
- **Result.**
  - `tests/compliance.mjs` exports `checkCompliance(root, overrides)` returning a list of problems, in the shape of
    `tests/ledger.mjs`. Its first check fails on: an `SPDX-License-Identifier` naming any licence but
    PolyForm Strict 1.0.0 (`PolyForm-Strict-1.0.0`), an `MIT License` or `Permission is hereby granted, free of charge` text, or a `LICENSE*` /
    `COPYING*` file other than the root `LICENSE`, in tracked files outside `node_modules/`. Exempt: the root `LICENSE` (its line 72 names the MIT
    License of earlier versions), `docs/**` (plans and research quote the patterns), `tests/compliance.mjs` itself, and
    the font folders (`src/assets/fonts/`, `tools/brand/fonts/`), which keep their own licence files.
  - `tests/schema.mjs` runs it after the ledger checks, with one negative fixture per pattern (each passed as an override,
    never written to the repo).
- **Inputs.** none.
- **Files.** `tests/compliance.mjs` (new), `tests/schema.mjs`, `tests/run.mjs` (the schema line of the help text only).
- **No-gos.** No change to LICENSE or any licence text. No new dependency.
- **Acceptance.**
  - [ ] `npm test` green on main as is (paste the compliance count).
  - [ ] Each negative fixture (an MIT header, a foreign SPDX id, a stray `LICENSE.md`) makes the check fail; paste the
        three messages.
- **Review:** standing (a new check; it tightens).
- **Lanes:** schema, compliance, run-mjs. **Model:** Sonnet, S (45 min).
- **After:** none.

## P26: PRIVACY.md names the save key the code uses (CK-3)

- **Problem.** PRIVACY.md says progress is stored under `companion-save-v5`. A save-key bump (allowed before 1.0)
  would leave it stale, and nothing checks it (register C10).
- **Result.** A second check in `tests/compliance.mjs`: the `KEY` exported by `src/core/state.js` appears in PRIVACY.md,
  and every `companion-save-v<n>` that PRIVACY.md names equals it (the `:before-import` suffix allowed). A negative
  fixture in `tests/schema.mjs` (a PRIVACY text naming `-v4`) fails it. P2 bumps the key to `companion-save-v6` and
  doesn't list PRIVACY.md, so this item also brings PRIVACY.md's key lines to the code's key (those lines only).
- **Inputs.** none.
- **Files.** `tests/compliance.mjs`, `tests/schema.mjs`, `PRIVACY.md` (the key lines only).
- **No-gos.** No other change to PRIVACY.md; no change to the save key.
- **Acceptance.**
  - [ ] Passes on this branch after P2; the fixture fails with a message naming both keys; the PRIVACY.md diff touches
        only key names.
- **Review:** standing.
- **Lanes:** schema, compliance. **Model:** Sonnet, S (45 min).
- **After:** P2, P25.

## P27: Every shipped icon has its provenance row (CK-2)

- **Problem.** The standing icon OK (2026-10-14) requires each icon's source page, file URL and date in
  `docs/ISSUES.md`, but nothing checks it (register C6). On main on 2026-10-21, 29 of the 234 files in
  `src/assets/icons/` have no row naming them (matched by base name), all of them `sk-*` skill icons.
- **Result.**
  - Game Data Check commits `docs/research/2026-10-icon-provenance.md`: one row per icon with no ISSUES.md row (file,
    source page, file URL, date), from the batch records already in the repo or the shared folder; an icon with no
    record is listed for the owner instead, never guessed.
  - This item adds those rows to `docs/ISSUES.md` verbatim, and a third check in `tests/compliance.mjs`: every file in
    `src/assets/icons/` has an ISSUES.md row naming it with a source page, a file URL and a date, or an entry on the
    owner list section the research file names. A negative fixture (an extra icon file name) fails it.
- **Inputs.** `docs/research/2026-10-icon-provenance.md`.
- **Files.** `tests/compliance.mjs`, `tests/schema.mjs`, `docs/ISSUES.md`.
- **No-gos.** No icon added, removed or replaced. No provenance invented: a row comes from the research file only.
- **Acceptance.**
  - [ ] The check passes on this branch and fails on the fixture; paste the count of icons with rows before and after.
  - [ ] Every new ISSUES.md row matches the research file byte for byte.
- **Review:** standing (Game Data Check confirms the rows).
- **Lanes:** schema, compliance. **Model:** Sonnet, S (45 min).
- **After:** P25, research-icon-provenance.

## P28–P29: hiding a class takes one data edit (P3's acceptance run)

P3 (#650) merged with its acceptance run unproven. Player Testing ran it at ea42e07 (#689) against the line in #622 and
found it NOT PROVEN: flipping one class to `release: "hidden"` still needs test edits, and the hidden class stays in the
picker and opens from a stored save. P28 finishes P3's own goal in the tests; P29 is the `src/` half P3's no-go kept out.

## P28: The tests read hidden classes from the data (P3's remainder)

- **Problem.** With only `data/packs/aion2/classes/chanter/class.json` flipped to `hidden`, e2 fails: `hiddenDirs` in
  `tests/support/v1view.js` covers `classes/<class>/` but not the guide pack `asmodian/<class>/` (its `otherDirs` covers
  both), so 14 Chanter URLs still count as "must be on the card". With the Chanter made idle (guide pack removed),
  schema fails on a hand-kept assertion in `tests/schema.mjs` that names the Chanter ("no idle class pack is left").
  Source: #689, set-ups A and B.
- **Result.**
  - `tests/support/v1view.js`: `hiddenDirs` holds both folders of each hidden class, derived the way `otherDirs` is.
  - `tests/schema.mjs`: the idle-pack assertion reads the data (every idle pack's class is `hidden`) and names no class.
  - The PR pastes both of #689's set-ups run on a scratch copy, with zero test-file edits between them and main: set-up A
    (one class flipped) passes e2 and schema; set-up B (one class idle) passes schema and fails only
    `tests/core/chars.test.mjs` "the AION 2 pack lists the classes with a guide pack", which is correct until P29.
- **Inputs.** none.
- **Files.** `tests/support/v1view.js`, `tests/schema.mjs`, `tests/e2test.js` (only if a derived name changes).
- **No-gos.** No `src/` or data change. No check dropped or loosened: the idle assertion still fails when an idle pack's
  class is released.
- **Acceptance.**
  - [ ] Set-ups A and B as above, pasted, zero test-file edits.
  - [ ] Negative control: on set-up A, one leaked Chanter URL added to a shipped data file still fails e2.
  - [ ] `npm test` green.
- **Review:** standing.
- **Lanes:** schema, e2. **Model:** Sonnet, S (45 min).
- **After:** none.

## P29: A hidden class is not offered and no save opens it

- **Problem.** The playable class list is hand-kept in `src/packs/aion2/pack.js` (one constant per class and the
  `classes` array), and nothing in `src/` reads `release`. So a class flipped to `hidden` is still in the welcome
  picker and New character, and a stored save of it opens a working route (#689 set-up A, all suites green). With its
  guide pack gone, the build's loader falls back to the default pack and the page shows Assassin skills under a
  "Chanter" title (set-up B; core goes red there, but nothing blocks set-up A). No class is hidden on live today, so no
  player is affected; this is the switch that 1.1's Elyos packs and any pulled class will rely on.
- **Result.**
  - The playable classes come from the data: P11's generated `GUIDE_CLASSES`, which `src/packs/aion2/pack.js` already
    reads, leaves out any class whose `release` is `hidden` (a hidden class's guide pack stays in the data and
    `DATA_SOURCES.md`). The emblem map may stay hand-kept (it is art, not a class list).
  - The build makes a class chunk only for those classes (a hidden class's guide pack stays in `DATA_SOURCES.md` and
    the data, never in a served file).
  - A stored save whose current character's class is not playable never shows another class's tables: the loader and
    the app open that save on the character list with the hidden character's row marked unavailable, the save left
    unchanged (no write, no migration), and the player can switch to or create a playable character. Same for Import.
  - Visible change only on that edge (no class is hidden on live): shots of the unavailable row from a set-up A copy
    and `scrapbook.json`; Design Review (Holly) checks the row.
- **Inputs.** `docs/ARCHITECTURE.md` (§4, per-class loading).
- **Files.** `src/packs/aion2/pack.js`, `src/core/pack.js`, `src/core/state.js`, `src/cards/characters.js`,
  `scripts/build.mjs`, `tools/gen/packs.mjs`, `tools/gen/*` (the generated class export), `docs/ARCHITECTURE.md` (§4),
  `tests/core/chars.test.mjs`, `tests/core/state.test.mjs`, `tests/regress.js` (a new check),
  `docs/reviews/0.9-p29-shots/`.
- **No-gos.** No save-key bump and no change to the save shape. No class's release changed on main. No URL parameter
  for a class (#689: the app reads none; keep it so).
- **Acceptance.**
  - [ ] On a copy with one class flipped to `hidden` (set-up A): it is absent from the welcome picker and New
        character, its chunk is not built, and a stored save of it opens on the character list with the row marked
        unavailable and the stored bytes unchanged (paste the before / after hash). Same on set-up B and via Import.
  - [ ] On main as is: every class is offered as before ("No visible change" outside the edge; golden green).
  - [ ] Player Testing (Jesse) re-runs #689's set-ups, the negative control and Import: `P3 PROVEN <sha>`.
  - [ ] Engineering (Gus) reviews the architecture change (ownership since 2026-10-20). `npm test` green.
- **Review:** standing, plus Engineering for the architecture and Design Review for the row.
- **Lanes:** gen, e2, architecture. **Model:** Opus, M (90 min). (`src/core/state.js` and `tests/core/state.test.mjs`
  are shared with P9 on **architecture**; `scripts/build.mjs`'s other 0.9 items, P4 and P5, have merged.)
- **After:** P11, P28.

## P30: Skip identical writes in the cards P5 left out

- **Problem.** P5 (#627, build #684) moved the main renderers to `setHTML` and cut the no-change `update()` cost by 17%
  against its 25% target (Build Pipeline, 2026-10-21). The Stigmas, Journey and Areas cards and the Daevanion
  `dvNextList` / `dvAllList` writes still repeat identical `innerHTML` on every `update()`.
- **Result.** Those renderers call P5's `setHTML` helper, except where code changes the same subtree after the write
  (each such call site keeps `innerHTML`, with the reason in a comment, as in P5). P5's blocking count check covers them.
- **Inputs.** none.
- **Files.** `src/packs/aion2/cards/stigmas.js`, `src/cards/journey.js`, `src/packs/aion2/cards/journey-sections.js`,
  `src/packs/aion2/cards/areas.js`, `src/packs/aion2/cards/daevanion.js`, `tests/site.js` (the count check's limit only).
- **No-gos.** No budget raise, no lazy loading (P23), no visible change.
- **Acceptance.**
  - [ ] `npm run test:perf` run alone three times on this branch and on the commit before P5 merged, same day: median
        down at least 25% (P5 and P30 together; both runs pasted).
  - [ ] The count check's N goes down by the writes removed (pasted before / after).
  - [ ] Golden and regress pinned diffs unchanged; "No visible change".
- **Review:** standing.
- **Lanes:** stigmas-card, journey-card, daevanion-card, nextup-card, site. **Model:** Opus, M (90 min).
  (`journey-sections.js` is shared with P19 and `areas.js` with P13, both on **nextup-card**; `tests/site.js` with P23
  and P24 on **site**.)
- **After:** P5.

## P31: Quotes from other hosts: credited or paraphrased (Legal's C7)

- **Problem.** Legal's quotes ruling (C7, v2, outside review Gomez, 2026-10-21) found `quote` fields that don't meet
  their hosts' terms: 26 from thegameswiki whose credit doesn't name and link CC BY-NC-SA, 15 of Metabot's 33 that
  should be paraphrased, and 65 on 14 other hosts. Legal's ruling puts it before 0.9 ships, so unlike other gated items
  (Q-09) it doesn't move to 0.10: the release waits on it. It follows 0.8.1's allthings.how batch (F9 #662, F10 #690),
  which ships first; Game Data Check writes these tables after F10's.
- **Result.**
  - Game Data Check commits `docs/research/2026-10-quotes-c7.md` with one table per group, in F9's form: (a)
    thegameswiki: each credit completed with the licence named and linked, or a paraphrase where the credit can't be
    completed; (b) Metabot: the 15 tagged quotes paraphrased, after Legal's blind 10-sample of the tags; (c) the 65 other
    quotes paraphrased; and (d) the hosts the ruling allows short credited quotes from, each with the credit it needs
    (for thegameswiki: the licence named and linked).
  - This item applies the tables byte for byte and adds the gen check (ruling item 7): a `quote` field fails unless its
    host is in table (d) and its credit has what (d) requires. All tables apply in this item, so the check ships
    complete, with no exception list.
  - `npm run gen` rewrites `data/DATA_SOURCES.md`.
- **Inputs.** `docs/research/2026-10-quotes-c7.md`.
- **Files.** `data/packs/aion2/**/claims.json`, `data/packs/aion2/asmodian/regional-quests.json`,
  `data/packs/aion2/asmodian/strongholds.json` (only rows the tables name), `data/schema/examples/**/claims.json`,
  `data/DATA_SOURCES.md`, `tools/gen/*` (the check), the tests.
- **No-gos.** No fetching, no fact or URL removed, no schema change, no verdict weakened.
- **Acceptance.**
  - [ ] Every table row applied byte for byte; paste the counts per group before and after.
  - [ ] The gen check fails on a fixture (a thegameswiki quote with its licence link removed) and passes on this branch.
  - [ ] "No visible change", or shots and `scrapbook.json` if a label shows in the app; Game Data Check's `DATA OK`.
- **Review:** standing.
- **Lanes:** gen, golden. **Model:** Opus, M (90 min).
- **After:** research-quotes-c7.

## P32: The rest of P6: schema under 4 s and one counts file

- **Problem.** P6 (#629, PR #717) merged with two acceptance lines unmet: `schema` takes 8–10 s against its < 4 s target
  (about 45 full `generate()` runs for the negative controls, ~110 ms each), and `expected-counts.json` was not built,
  so data counts are still pinned in `tests/schema.mjs` and `checks.mjs`. Reviews also asked for a test that an
  in-memory view with no edits compiles byte-identical modules, and for the ARCHITECTURE `schema` row to match.
- **Result.**
  - the generator negative controls in `tests/schema.mjs` run in worker threads (or a faster `generate()`), and
    `schema` alone runs under 4 s locally;
  - data counts live in one reviewed `data/expected-counts.json`, written by `npm run gen -- --counts`, and
    `tests/schema.mjs` and `checks.mjs` read it;
  - a test pins that `generate({ mutate: () => {} })` compiles byte-identical modules to the real file system;
  - the ARCHITECTURE suite table gives the measured `schema` time and the `--root` copy that remains.
- **Files.** `tests/schema.mjs`, `tools/gen/gen.mjs`, `tools/gen/packs.mjs`, `data/packs/aion2/checks.mjs`,
  `data/expected-counts.json`, `docs/ARCHITECTURE.md`.
- **No-gos.** No check removed or loosened; every negative control still fails (the 155 `schema` checks stay). No
  workflow edit. A faster invariant "1, 2, 6" needs `rankNext` (src/) and is not this item.
- **Acceptance.**
  - [ ] `schema` alone under 4 s locally (pasted timings, before and after) and `--check-shards` passes.
  - [ ] Every negative control still fails (pasted list), and a count changed in the data without
        `npm run gen -- --counts` fails `schema`.
  - [ ] The no-edit view test passes.
- **Review:** standing.
- **Lanes:** gen, schema. **Model:** Opus, M (90 min).
- **After:** none.

## P33: A private contact for legal notices (T-63)

- **Problem.** The only contact is a public GitHub issue, so a rights holder (NCSoft, a source site) has no private way
  to send a takedown or notice (Legal's review A5, register C14). The owner named `legal@daevacompanion.com` the official
  contact for legal notices (DECISIONS `owner-ok-0.9-terms`, amended 2026-10-21, T-63).
- **Result.**
  - The Terms "Contact" section names the address for legal notices, next to the GitHub issue line, in Legal's wording.
  - One "Rights holders" line on the site names the address, in Legal's wording; Design Lead places it.
  - CHANGELOG notes the change.
- **Inputs.** Legal's (Chuck) wording for both lines, in `docs/legal/` (`docs/legal/TERMS.md` updated, plus the site
  line), reviewed by Team Audit.
- **Gate.** The address is published only after one test email to it has been confirmed received; Legal asks the owner
  on a card once the mailbox is set up. The Release Planner opens this item's issue only when the gate and the inputs
  are met, so no `[next]` line exists before then.
- **Files.** `TERMS.md`, `docs/legal/TERMS.md`, `src/index.html` or the card Design Lead picks (the one line only),
  `tests/site.js`, `CHANGELOG.md`.
- **No-gos.** No other change to the approved Terms text. No personal name or personal address anywhere. The footer
  keeps "unofficial" and "not affiliated with or endorsed by NCSoft".
- **Acceptance.**
  - [ ] `tests/site`: the Terms Contact section and the site line both carry the address; `TERMS.md` still matches
        `docs/legal/TERMS.md` except "Effective:".
  - [ ] The test email confirmation is linked on the PR.
  - [ ] Before / after shots at 1500 and 390 px, `scrapbook.json`; Design Lead's DESIGN OK.
- **Review:** blind (owner-held legal text; Code Review the code).
- **Lanes:** site, page-card. **Model:** Sonnet, S (45 min).
- **After:** P24, the gate above. If the gate isn't met by 0.9's release gate, P33 moves to 0.10.

## S1–S4: pipeline items (Build Pipeline builds them; no queue line)

- **S1: Split the golden shard.** Golden alone; a11y, save and site in their own shard. Files `tests/run.mjs`,
  `.github/workflows/ci.yml`. Done when `--check-shards` passes and CI wall time per PR drops (Actions timing). After
  P6 and P14 (both edit `tests/run.mjs`; plan review, #609).
- **S2: A scripted check of the live site after every deploy, and on a timer.** The journey path (start, tick a quest,
  level up, reload, progress kept) runs against daevacompanion.com after smoke and every 6 h. It needs no player data,
  so the privacy rule holds (team audit §8b). Done when a broken deploy fails it (a planted break on a test URL) and a
  red run opens a Watchdog incident.
- **S3: The sync server ships through CI.** A workflow tests `server/sync` and runs `wrangler deploy --dry-run` on every
  PR that touches it; the real deploy step runs only when the owner's Cloudflare token is set (team audit §8a). Done when
  the dry run is required for `server/**` PRs.
- **S4: Staging at `/staging/`.** Main deploys to `daevacompanion.com/staging/` and a release tag to the root (Gus's
  option B): its own save-key prefix, `noindex`, a "Staging" banner, smoke on both. DEPLOY.md, the deploy, smoke and
  release job order, and CLAUDE.md's site line are rewritten. After `owner-ok-0.9-staging`. Then the rollback drill
  (below) runs on staging.
- **S5: Automatic hold-lift.** `auto-merge.yml` lifts `hold` only when the PR body has a `Reviewers:` line, every
  named reviewer approves the current head and `ci-ok` is green, then starts the pipeline review (pipeline.yml skips
  held PRs, so the review can't be a lift condition). The merge still needs the pipeline APPROVE on the head and every
  other check. A `Review:` line naming external or blind review adds `hold` automatically until FRESH REVIEW OK names
  the head; a hold someone removed is never re-added, and a manual hold on a PR without a `Reviewers:` line stays manual. Lanes: auto-merge.yml, `tests/automerge.mjs`, gus.md; Opus; trigger-1
  outside review. After #705 merges (owner OK 2026-10-21 03:34Z, "Sure let's do it").

Alongside, not builds: Watchdog and Build Pipeline write the incident runbook (severity levels, one incident lead,
blameless postmortem with dated fixes; team audit §8d); Build Pipeline writes the owner-settings checklist it reads
through the API (branch protection, Pages domain, DNS, Workers alert; §8f), and runs the rollback drill on staging
once S4 is live, timed, with the service-worker cache checked (§8c). Tracker Sync and Tracker Design replace the
tracker's per-thread reads with one GitHub poll every 20 min (Kaizen's 0.8 scorecard: tracker threads used 28% of the
project's tokens, the pipeline 18%; check at the 0.9 review: tracker share below the pipeline's).

## R: Release 0.9.0

**Fresh review** (release PR).

- **What it does.** Version bump and the CHANGELOG section ("Saves reset in this version", from P2).
- **K17.** The CHANGELOG section is written into the release issue before `PRE-RELEASE CHECK 0.9.0`.
- **Release.** `RC READY 0.9 <sha>` to Player Testing with `PRE-RELEASE CHECK 0.9.0`; the Release Planner posts
  `GO 0.9.0` only after `DATA OK 0.9.0` and `RC PLAY DONE 0.9` name the same build (K19). With S4 live, the release
  candidate is the staging build.
- **Lanes:** release, alone. **Model:** Sonnet, S (44 min).
- **After:** every item above, or moved to 0.9.x or 0.10; GO 0.9.0.
