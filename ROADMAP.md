# Roadmap

**1.0.0 = all eight classes, Asmodian only, Lv 1–45.** Every class meets the bar the Assassin guide sets today:
verified data only (see CLAUDE.md), Next up always correct, saved progress never broken. Elyos is after 1.0.

Classes (per [Metabot](https://metabot.gg/en/aion-2/classes)): Gladiator, Templar, Assassin, Ranger, Sorcerer,
Spiritmaster, Cleric, Chanter.

**Direction (owner, 2026-10-16):** Daeva Companion is an engine that AION 2 happens to be the first game for. The engine
knows no game; AION 2 is a game pack, each class a content pack, each feature a module. Modules are what make parallel
work real: two items run at the same time only when they touch different modules. The audit behind this plan, with
evidence: [Daeva Companion: audit and plan to 1.0](https://claude.ai/code/artifact/37732d7b-6100-47ba-b191-fb3fe9d69f96)
(repo copy for sessions that can't open it: [docs/audits/2026-10-16-audit-and-plan-to-1.0.md](docs/audits/2026-10-16-audit-and-plan-to-1.0.md)).

## Versioning

[Semantic versioning](https://semver.org/); 0.x is beta. Each part is its own counter (0.9 → 0.10 → 0.11), so there is
no running out before 1.0: 1.0 ships when its scope is done.

- **Minor (0.X.0)**: a theme, i.e. one or more related objectives. New ideas join a theme that fits before they start a
  new one.
- **Patch (0.X.Y)**: fixes, data corrections, small polish and upkeep. No new features.
- **Releasing**: bump `version` in `package.json` and add a `## X.Y.Z` section to CHANGELOG.md in the same commit. After
  tests and the deploy pass on `main`, CI tags `vX.Y.Z` and publishes the GitHub Release with that section as its notes.
  CI fails early if the version has no CHANGELOG section.

## How a minor is planned (every 0.X.0)

Every minor opens with a planning and audit pass, and it is most of the work: like painting, about 90% prep and 10%
execution (owner, 2026-10-17). It runs on Opus and has two halves that work as a team: step 1 is the **release kaizen
review, the "how"** (is the way we build optimal?), and steps 2–6 are the **plan, the "what"** (which items, in what
order). The "how" goes first because its findings change the rules the plan is made under. The pass that redrew the plan
after 0.3 is the model: it audited the whole path to 1.0 before planning the next minor
([audit and plan to 1.0](docs/audits/2026-10-16-audit-and-plan-to-1.0.md)). Nothing in the minor is queued in #114
until the pass is written down and reviewed. Patches (0.X.Y) skip it.

1. **Release kaizen review: the "how" (owner, 2026-10-17).** The daily kaizen task's review, over the whole minor
   just shipped, aimed at the workflow itself, not at the product. Raised usage caps don't change the goal: the least
   waste per item shipped (owner, 2026-10-17 3:00 PM ET).
   - **Data.** Combine the **stall log (#221)**: stalls and idle minutes by Kind, and the Kinds that came back after a
     fix; the **planner log (#232)**: what each planner run queued and whether it worked out, plus the usage
     checkpoints (bot runs by model and outcome against the owner's weekly usage %); the **kaizen log (#222)**: which
     changes helped, which didn't (revert them), which are still `trial` or `needs Isaac`; the `Waste:` lines in #114;
     and the Actions runs (build minutes, kickoff start to PR open, PR open to merge, per item).
   - **Audit the workflow.** Lanes (did two builds collide, or did a lane hold work that could have run?); model
     routing (Opus runs that Sonnet would have done, Sonnet runs that handed up or were redone); redone runs and their
     causes (review CHANGES, fix rounds, merge runs, restarts, Blocked); idle time on the critical path; handoffs
     between the planner, the health check, kaizen, Tracker sync and the workflows (who noticed late, who waited on
     whom); and owner waits (To-dos, typed OKs).
   - **Scorecard.** Write `docs/kaizen/<minor>-scorecard.md`: items shipped; bot runs by model and outcome; redone runs
     and waste %; stalls and idle minutes by Kind; median build and review-to-merge times; owner-wait hours; weekly
     usage % per item shipped. Each row is set beside the previous minor's scorecard with the change marked better or
     worse. The first scorecard (0.5) takes 0.4's numbers from #221 and the `Waste:` lines where they exist and marks
     the rest "no baseline".
   - **Changes.** Each cause that repeated, and each metric that got worse, becomes one concrete process change: a
     #222 row, put in place before the minor's first item is queued (a #114 rule, a planner-instruction change, or a
     workflow PR). The stall limits, build cap and model routing in #114 are re-derived from this minor's build times
     and usage. The plan in steps 2–6 is made under these changes and cites the scorecard where it relies on it.
2. **Audit the whole path to 1.0, then this minor.** First re-read the plan from this minor to 1.0 against the code
   and what the look-back found: is any later minor stale, in the wrong order, too big, or blocked on something
   nobody has started (research, owner input, hosting)? Change the later minors here, in this pass, before planning
   this one. Then audit this minor's section the same way. Read the budget trend (page size, element count,
   `update()` time); schedule a performance item only when a budget is within 20% of its limit. Before 1.0 and before
   any store app, this step is a full architecture and performance audit.
3. **Shape each item:** problem; appetite (S < 100 changed lines, M 100–300, L 300–1,000; bigger = split it); no-gos
   (what it will not do); the module(s) and files it owns (every acceptance line needs an owning file); the test that
   proves it done; builder model (routing rule in #114, as step 1 left it); its stall limit from step 1's build times. An item with an
   unknown is a research item first, not a build.
4. **Waves and lanes for the whole minor.** Lay every item out in waves before anything is queued: items in the same
   module or serial file run one after another; items in different modules may run at the same time, at most five
   builds (the cap in kickoff.yml). Name the critical path, put the items that unblock the most first, and give each item an `After:` line so
   kickoff can queue it the moment its dependencies merge. Check every wave for two items that touch the same file:
   that is where bots step on each other's toes, so split the file's owner or move one item. Shared files
   (`docs/team/DISPATCH.md` "Serial files") count as one module.
5. **Owner input.** List what needs the owner (in-game checks, mockups, money, legal). Only a true blocker becomes a
   tracker To-do; everything else follows the recommendation. Every decision is recorded on the tracker as
   **user remediated** (the owner chose) or **Claude remediated** (the recommendation applied under a standing
   approval), so the owner can see which calls were whose.
6. **Write and review.** The plan goes into this file and the #114 queue in one PR, written by one session and
   reviewed by a separate one that didn't write it. Then the planner queues the items, top of the lane map first.

## How an objective is worked

1. **Problem**: what's wrong or missing, in a sentence or two.
2. **Acceptance**: how we know it's done, as a test where possible.
3. **UX pass**: what the user sees and does, sketched and reviewed *before* building. Visual polish comes after the
   feature works. New UI reuses the existing card patterns (uniform milestone / Next up / Skills / Stigmas cards).
4. **Build → test → release.**
5. **Play with it** in game; what you notice feeds the next objective.

## Released

- **0.1.0** — repository, standalone site (aion2.ishkabytes.com), offline/PWA, CI. App identical to artifact v291.
- **0.1.1** — CI upkeep, automatic tags and GitHub Releases, this roadmap.
- **0.1.2** — licensing (PolyForm Strict code, original content reserved) and unofficial-guide wording.
- **0.1.3** — Ascension hotfix: story gates for "The One Who Dreams" and the Lv 45 Hero/Ascension step, story steps
  already passed no longer offered, text fixes, `gates` suite and golden master.
- **0.1.4** — version in the footer, *Report a problem* link with prefilled issue form, issue forms and labels.
- **0.1.5** — persistent storage request, save-failure warning, self-hosted fonts.
- **0.1.6** — accessibility fixes with no visible change (screen-reader names, focus, reduced motion, touch), `a11y` suite.
- **0.1.7** — rebrand to Daeva Companion (name, mark, icons; palette unchanged).
- **0.1.8** — new address: daevacompanion.com.
- **0.1.9** — touch, contrast and page-zoom fixes (visible accessibility batch from the mobile audit).
- **0.2.0** — Foundations: pure core, data format v2 with JSON Schemas and a Node generator, owner-verified unlocks and
  Metabot locations, aion2.th.gl withdrawn, per-item change times and `merge()` in the save.
- **0.2.1** — a fresh browser starts at Lv 1 on the first story quest instead of Lv 5 with no quest.
- **0.2.2** — Daevanion up arrow starts at 1, rotation pop-out lists only unlocked skills, missing skill icons.
- **0.2.3** — story-quest zones for 34 more quest sides (Metabot), stigma unlock cost check.
- **0.2.4** — Active / Passive skill labels, specialty slots, villages as zones, clearer lock text (most of the 0.3
  engine steps went live here).
- **0.2.5** — backup line, 14-day backup reminder, iPhone home-screen tip.
- **0.2.6** — phone layout fixes, Route rules card moved, one gate evaluation per update.
- **0.3.0** — Next up correctness: one requirement check per card, completion derived from the story, blocker
  chains, the story's last quest (Lv 45).
- **0.4.0** — Engine and packs: the engine holds no AION 2 term, AION 2 is a game pack, save v5 shaped for several
  characters (saves reset once), blocking page budgets.

## Plan (redrawn 2026-10-16)

Redrawn after the engine audit, with the owner's go-ahead to re-plan the path to 1.0. Before: eleven minors after 0.3
(0.4–0.14), one class per release, the class framework late. After: six minors (0.4–0.9), the engine split first, then
three lanes per minor. The minor numbers below replace the ones in older decisions, reports, specs and DISPATCH; read an
old "0.4 Smart Next up" as 0.5 here, an old "0.5 characters" as 0.4 (save shape) plus 0.6 (picker).

**Decided (owner, 2026-10-16, 4:30 PM ET):** the Engine split comes right after 0.3.0. Engine code carries no AION 2 or
Assassin reference; all game data lives outside the engine, in packs. 0.3.0 ships first and nothing here competes with
it (owner, 4:34 PM ET); 0.3.0 went live 2026-10-16, 5:11 PM ET.

**Risk, called out:** two classes per minor assumes a tester (the owner or another player) can do each class's in-game
spot check. If only one class can be checked per minor, 0.7–0.9 become one class each and 1.0 moves out by three
minors. Research packs for every class start early (below) so data is never the bottleneck.

### 0.3.x — patches while 0.4 is planned (0.3.0 released 2026-10-16)

- Bug #105: `fitRail()` race at load (Basic rail width differs between loads). Planned as 0.5 P1.
- #136: the 0.3.0 CHANGELOG's Lv 45 quest name and its saved-progress note (docs/reviews/0.3-lookback.md). Done in
  #163.
- Data corrections from issues; owner checks as they arrive (C41 Koro at Lv 45; the Home Screen storage check).

### 0.4 — Engine and packs (invisible; released 2026-10-17)

Look back: [docs/reviews/0.4-lookback.md](docs/reviews/0.4-lookback.md).

Goal: the engine holds no AION 2 term, the Assassin guide shows the same in the golden master, and a second game
could be added as a pack. One clean save break (CLAUDE.md pre-1.0 rule), so the save is shaped for several characters
once and no migration is carried.

Planning pass written 2026-10-16 (#135): look back in [docs/reviews/0.3-lookback.md](docs/reviews/0.3-lookback.md),
one spec per item in [docs/plans/0.4/](docs/plans/0.4/) (the issue body the planner creates, verbatim), audit evidence
in [docs/audits/2026-10-16-audit-and-plan-to-1.0.md](docs/audits/2026-10-16-audit-and-plan-to-1.0.md) (the repo copy
of the audit, PR #137).

**Process rule from the look back (0.4 on):** an issue's *Acceptance* list is the review checklist. The reviewer
answers every line with pass / fail and its evidence; one missing line is `VERDICT: CHANGES`.

#### Audit (step 2), against `main` at `acf4c8e`

Stale, cut-able or in the wrong order in the plan as #134 drew it:

1. **P2's named gates are stale.** "Lest We Forget" and the Daevanion gate are data since E5 (#78). What is still
   AION 2 in `src/core/requirements.js` is the five `KEPT_RULES` (lines 19–29) and the record ids in the
   `GATE_CHANGES` switches (71–80, 107, 116). The other hard-coded spots moved a little: `catalog.js:52-57` (two
   milestones), `build.js:15,17,44,45` (costs, slot levels, node minimum). The values themselves are already data
   (`rule:skill-point-cost`, `rule:stigma-shard-cost`, `rule:specialty-slots`, `rule:node-costs`); only the code copies
   are left. The one-player seed in `migrations.js:30` goes with the save break (P3c), not P2.
2. **P2 has an unknown.** Nothing says where pack *code* lives (AION 2 card templates, Next up producers, the kept rules
   can't be data) or how the engine calls it. That's a design question, so it becomes **P0**, a docs item, first.
3. **P2 is over 1,000 lines as one item.** About half of `src/core/` names AION 2 (requirements 106 of 442 lines,
   nextup 59 of 158, catalog 37 of 118). Split: P2a (code copies of data rules), P2b (pack code out of the core),
   P2c (Next up producers).
4. **P3 is over 1,000 lines as one item.** The v4 key is written in 43 files, 32 of them under `tests/`. The `e1`, `mig1`, `mig2`,
   `regress` and `journey` fixtures are v4-shaped saves. Split: P3a (tests write saves through one helper), P3b
   (storage adapter, no save change), P3c (save v5).
5. **P3 misses one case:** a pre-0.4 *export file* has the v4 shape. Import must refuse it with a message, never read it.
6. **"`src/main.js` holds no AION 2 term" doesn't need twelve card PRs.** The AION 2 cards (Skills, Stigmas, Daevanion,
   Cube, areas, rotation) are the game pack's own cards: P4 moves them into the pack unchanged. Only the engine's cards
   (Next up, milestones and Route rules, Journey, Sources and Confidence) are made neutral, so **P5 shrinks to four
   items**. A pack card is rewritten when a later feature touches it, not as a batch now.
7. **P7's per-pack loading is in the wrong minor.** With one class there's nothing to leave out. It moves to 0.6 lane B,
   before the Gladiator pack lands. The blocking budgets stay in 0.4.
8. **The done check needs an owner:** **P8** adds the term scan that proves "no AION 2 term" (P6 proves the fake game).
9. **"Byte-identical golden" can't hold through P3c.** The snapshots record the stored save, and its shape changes
   once, on purpose. What must not change, in every 0.4 item, is Next up, milestones, Journey and the Dungeons card.
10. **The kickoff lanes have no `core` lane.** Two `src/core/` items would start together, so each item below names the
    files it owns (review note 1 on #134).
11. **No input for the player name exists.** The save label is `<playername>-<class>-lvl<level>` (owner); until 0.5 lane
    C adds the name, the label leaves the name part out.

**Budget trend** (`npm run build`; elements at 390 px in a fresh browser; `tests/perf.js`, 45 states):

| | 0.2.0 | 0.2.3 | 0.2.5 | 0.2.6 / 0.3.0 | Limit | Use |
|---|---|---|---|---|---|---|
| `dist/index.html` | 498,891 B | 507,536 B | 665,735 B | 669,290 B (153,871 gz) | none yet (P7) | — |
| Page elements | — | 4,658 | — | 4,741 | none yet (P7) | — |
| `update()` median / worst | — | — | — | 6.8 / 8.5 ms | 15 ms, advisory | 57% |
| Inlined fonts (artifact) | — | — | — | 126.2 KB | 150 KB, blocking | **84%** |

The fonts are the only budget within 20% of a limit. They don't grow with packs or features, and no 0.4 item adds a
font, so there's no performance item. A new font needs the cap raised in the same PR, with a reason. `update()` time is
at 57% of its limit. The page grew 34% in 0.2 (0.2.4 villages and 0.2.5); P7 sets the first byte and element limits.

#### Items (step 3)

Appetite counts hand-written changed lines: a verbatim move counts once, deleted files and regenerated
fixtures or snapshots don't count. Models follow the routing rule in #114. The full spec of each item, with its
acceptance tests, is its plan file.

| Item | Problem → result | Size | Owns (files) | Model | Lanes |
|---|---|---|---|---|---|
| [P0](docs/plans/0.4/P0-engine-contract.md) | No written contract for packs → design doc: code layout, pack hooks, card registry interface, AION 2 term list | M (docs) | `docs/design/0.4-engine-contract.md` | Opus | none |
| [P1](docs/plans/0.4/P1-pack-folders.md) | Data has no pack boundaries → `data/packs/…` with manifests; the generator builds a pack chain; compiled output byte-identical | M | `data/**` (moves), `data/schema/pack.schema.json`, `tools/gen/`, `tests/schema.mjs`, `tests/support/oracle.mjs` paths | Opus | gen, gates |
| [P2a](docs/plans/0.4/P2a-rules-from-data.md) | Code copies of data rules → costs and slot levels read from `rule:*`; two milestones into the guide data | S–M | `src/data/build.js`, `src/core/catalog.js`, the pack's `guide/milestones.json`, `tools/gen/` | Opus | gen, gates |
| [P2b](docs/plans/0.4/P2b-pack-code.md) | AION 2 code inside the engine → moved to `src/packs/aion2/` behind P0's hooks | L | `src/core/{catalog,requirements,ascension,blockers,migrations,evaluator}.js`, `src/data/*.js`, `src/packs/aion2/**`, `src/main.js` imports, module paths in `scripts/`, `tests/core/` | Opus | main.js |
| [P2c](docs/plans/0.4/P2c-nextup-producers.md) | Next up ranks AION 2 kinds in the engine → engine ranks, pack produces cards | M | `src/core/nextup.js`, `src/packs/aion2/nextup.js`, `tests/core/nextup*` | Opus | none |
| [P3a](docs/plans/0.4/P3a-test-save-helper.md) | Save key and v4 shape spread over 32 test files, old fixtures fed through the migrations → one helper writes and reads every test save; migrated flat fixtures | M | `tests/**` except snapshots, baselines and existing fixtures | Opus | golden, mig |
| [P3b](docs/plans/0.4/P3b-storage-adapter.md) | `localStorage` called from the page → storage adapter; same key, same bytes | S–M | `src/core/storage.js`, `src/shell/storage-web.js`, `src/main.js` save area, `src/site.js` | Opus | main.js |
| [P3c](docs/plans/0.4/P3c-save-v5.md) | Save shaped for one Assassin → save v5: neutral key, character slots, clean break | L | `src/core/{state,migrations,sync,backup}.js`, `src/data/migrations.js` (deleted), `src/main.js` save area, save tests, golden snapshots, `PRIVACY.md`, `docs/ARCHITECTURE.md` §1 | Opus | main.js, mig, golden |
| [P4a](docs/plans/0.4/P4a-card-registry.md) | Every card hard-wired in the page script → registry; first two cards mounted through it | M | `src/core/cards.js`, `src/main.js`, `src/index.html`, `src/cards/sources.js`, `tests/support/dom-snapshot.mjs` | Opus | main.js |
| [P4b](docs/plans/0.4/P4b-pack-cards.md) | AION 2 cards in the page script → moved verbatim to `src/packs/aion2/cards/` | L | `src/main.js`, `src/index.html`, `src/packs/aion2/cards/**` | Opus | main.js |
| [P4c](docs/plans/0.4/P4c-engine-cards.md) | Engine cards in the page script → moved verbatim to `src/cards/`; `main.js` is the shell | L | `src/main.js`, `src/index.html`, `src/cards/**` | Opus | main.js |
| [P4d](docs/plans/0.4/P4d-card-styles.md) | All card styles in one `app.css` → one stylesheet per card, verbatim, proven by a computed-style snapshot (owner idea, added 2026-10-16) | L | `src/styles/**`, `src/index.html` links | Opus | app.css |
| [P4e](docs/plans/0.4/P4e-card-golden.md) | Golden shards hold every card together → snapshots stored per card, `--record --card` (owner idea, added 2026-10-16) | M | `tests/golden.js`, `tests/golden/snapshots/**` | Opus | golden |
| [P5a](docs/plans/0.4/P5a-nextup-card.md) | Next up and Later cards neutral | M | `src/cards/nextup.js`, `src/cards/ahead.js`, pack renderers | Opus | none |
| [P5b](docs/plans/0.4/P5b-milestone-cards.md) | Milestone and Route rules cards neutral | M | `src/cards/milestones.js`, `src/cards/route.js`, pack row renderers | Opus | none |
| [P5c](docs/plans/0.4/P5c-journey-card.md) | Journey card neutral (Ascension bar becomes a pack section) | M | `src/cards/journey.js`, `src/packs/aion2/cards/ascension.js` | Opus | none |
| [P5d](docs/plans/0.4/P5d-sources-cards.md) | Sources, Confidence and Undo cards neutral | S | `src/cards/sources.js`, `src/cards/undo.js` | Sonnet | none |
| [P6](docs/plans/0.4/P6-fake-pack.md) | Nothing proves the engine is game-neutral → a fake game pack + conformance suite in Node | M | `tests/fixtures/packs/fakegame/`, `tests/conformance.mjs`, `tests/run.mjs` | Opus | none |
| [P7](docs/plans/0.4/P7-budgets.md) | Nothing stops the page growing → blocking byte and element budgets | S | `scripts/build.mjs`, `tests/site.js` | Sonnet | none |
| [P8](docs/plans/0.4/P8-done-check.md) | "No AION 2 term" is a claim, not a test → term scan over engine, engine cards and shell | S | `tests/core/purity.test.mjs` | Sonnet | none |
| [S0](docs/plans/0.4/S0-sync-design.md) | Sync needs a design and an owner hosting decision before 0.6 → design doc (old Y0) | M (docs) | `docs/design/sync.md` | Opus | none |
| [R](docs/plans/0.4/R-release-0.4.0.md) | Release 0.4.0 (CHANGELOG: saves reset) | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | release, alone |

No-gos for the whole minor: no visible change except the save reset (no new UI, no new text on screen, no restyle);
no new game data; no `.github/workflows/` edits (bots can't push them); no change to the artifact rules (one file,
`/_blob/` icons, no service worker).

#### Lane map (step 4)

At most three builds at a time (five since 2026-10-17, PR #233). Kickoff checks lanes, not order, so **the planner queues an item only once everything
in its "After" has merged**.

| Wave | Builds | After |
|---|---|---|
| 1 | P1 (gen, gates) ∥ P3a (golden, mig) ∥ P3b (main.js) | — |
| 2 | P0 (none) ∥ P2a (gen, gates) ∥ P7 (none) | P2a: P1 |
| 3 | P3c (main.js, mig, golden) ∥ S0 (none) | P3c: P1, P3a, P3b |
| 4 | P2b (main.js) | P0, P2a, P3c |
| 5 | P2c (none) ∥ P4a (main.js) | P2b |
| 6 | P6 (none) ∥ P4b (main.js) | P6: P2c, P3c · P4b: P4a |
| 7 | P4c (main.js) | P4b |
| 8 | P5a ∥ P5b ∥ P5c, then P5d, P4d (app.css), P4e (golden) as slots free | P4c; P5a also P2c |
| 9 | P8 (none) | P5a–P5d, P6 |
| 10 | R, alone | everything above |

How the review notes on #134 are settled:

1. **P2 and P3 both touch `src/core/`:** split by file. P3b and P3c own `state.js`, `migrations.js`, `sync.js`,
   `backup.js`, the new `storage.js` and the save area of `main.js`; P2a owns `catalog.js` and `src/data/build.js`. The
   two P2 items that move core code (P2b, P2c) run after P3c, in sequence.
2. **P4 owns `src/main.js` until the registry and the moves merge** (P4a → P4b → P4c, one at a time). The P5 card
   items wait for P4c; after it, each card is its own file, so three run at once.
3. **Gladiator follows the P1 pack layout:** see 0.6 lane B.
4. **The audit copy** is `docs/audits/2026-10-16-audit-and-plan-to-1.0.md` (PR #137), linked above and in Direction.
5. **The player name never reaches a server unencrypted.** No-go on P3c: no name or label in a storage key, file name,
   URL, the *Report a problem* link or a log, and the slot id is random, never derived from the name. Requirement on S0:
   the name and label travel only inside the encrypted payload; the server sees opaque ids, sizes and times.

Done when: golden shows no change in Next up, milestones, Journey or the Dungeons card for the Assassin (the stored save
changes once, in P3c); P6's fake game passes conformance; P8's term scan finds no AION 2 term in `src/core/`,
`src/cards/` or `src/main.js`.

#### Owner input (step 5)

Nothing in 0.4 needs an in-game check, a mockup, money or a legal answer, so **no To-do**. For the owner's
information (the recommendation applies unless the owner says otherwise):

- **Your own progress resets at 0.4.0** (decision #2). Export a backup before 0.4.0 if you want a record; 0.4 can't
  import it (P3c refuses old files rather than reading them).
- **Storage key `companion-save-v5`**: neutral, no game or class name.
- **The save label shows no player name until 0.5** (the name field comes with the character switcher).
- **S0 ends in a hosting and cost decision** for the owner; that decision blocks 0.6 lane C, not 0.4.

Alongside 0.4 (docs only, no code, any time): **class research packs** for all seven classes, two at a time, in cloud
research sessions under the fetching rules (old R1). They need the web, so they are not bot items in the #114 queue; the
coordinator starts them. **Sync design** is S0 above.

### 0.5 — Smart Next up and the phone layout

| Lane | What | Module |
|---|---|---|
| A | Smart Next up (old 0.4 N1–N5): travel data, location tie-break, derived Kibelisk binds, fastest / completionist with level bands, travel UI, catch-up ranking | ranking module, Next up card |
| B | Phone layout (audit #81 / PR #87 mockup): Next up near the top, a touch-friendly stack, Build as a bottom sheet | shell layout, styles |
| C | Character switcher and class picker (old 0.5 C2), Assassin the only visible class; the player-name field that completes the save label (0.4 P3c) | header, character module |

Lane A's travel UI and lane B both touch the Next up card's layout: B lands first, A's UI step builds on it.

Planning pass written 2026-10-17 (#191): look back in [docs/reviews/0.4-lookback.md](docs/reviews/0.4-lookback.md), one
spec per item in [docs/plans/0.5/](docs/plans/0.5/) (the issue body the planner creates, verbatim). Item keys are
`P<n>` / `S<n>` so kickoff's After-line queueing (#173) reads them; an After line with a token that isn't a key
(`owner-ok-…`, `research-…`) is left to the planner, who queues the item once that input is recorded.

**Process rule from the look back (0.5 on):** before an item is queued, each acceptance line has a file that makes it
pass, owned by the item or by one on its After line, and no no-go forbids it; a check a later item turns green is run
on `main` at planning time and every hit gets an owner. Each plan file has an "Ownership check" line; the reviewer of
the pass checks it. (0.4: P6 Blocked on the generator, P8 needed a fix round.)

#### Audit (step 2), against `main` at `f1d38e5` (0.4.0)

1. **This file was stale:** the released list ended at 0.3.0; 0.3.x still listed #136 (done in #163) and #105 (now
   P1). Fixed here.
2. **The smart Next up design predates the engine split** ([docs/design/0.4-smart-next-up.md](docs/design/0.4-smart-next-up.md),
   PR #85). Its paths are gone (`src/data/node-place.js`, `nextup.js` tiers and line numbers, `renderNow` in
   `main.js`), and its place layer would put AION 2 terms (Kibelisk, teleport, scroll) in the engine, which the 0.4 P8
   term scan fails. Re-cut: the engine gets the neutral parts (where the player is, the nearest-first comparator,
   tracks, catch-up, the switch table); the AION 2 pack gets Kibelisks, binding, the Bind row and the teleport line
   (its producers and `nowRenderers`). Its tiers are P2c's phases now; location only reorders inside a phase. Design
   steps S1–S8 become P8–P16; S9 (filler XP, F9) stays moved out.
3. **The design's data step needs the web** (Metabot step markers for the story objectives), and a bot build has none
   (DISPATCH checklist 7). Split: P8 builds the Kibelisk registry and rules from the research already in the repo
   (`docs/research/2026-10-kibelisks.md`, `data/research/`); P9 adds the objective points after a cloud research
   session (below, "Alongside").
4. **The phone layout plan** ([docs/design/phone-layout.md](docs/design/phone-layout.md), PR #87): patches A, B and D
   shipped in 0.2.6 (#121, #126); C (195 / 640 px page zoom) is still open, and the CHANGELOG has listed its known
   issue since 0.1.9; E–I remain. Its file references are stale: card code is in `src/cards/` (P4c), styles are per
   card (P4d; `app.css` is the shell's 747 lines), the Build drawer is the AION 2 pack's card, Level up lives in
   `src/cards/journey.html`. Its §5 owner questions were never answered (owner input 1).
5. **Lane C has its save:** v5 already holds slots, random slot ids and `labelOf` (P3c). Missing: functions that add,
   switch, rename and remove a character; a class list (`newChar` takes the pack's one `character`); any place that
   shows the label. Finding for 0.6 (sync): `merge()` keeps a slot present on one side only, so a removed character
   can come back from another device's save; 0.5 doesn't change `merge()`, P17 and P19 say so.
6. **A stale comment:** `src/main.js` says `updateAll` takes over once P5a–d make the cards independent; P5a–d merged
   and `update()` still calls each card by name in the old order. Not scheduled (no user value); P2 keeps the order.
7. **Order:** lane A's ranking steps (P12, P13) don't touch the card's layout and can go before lane B's P3; its UI
   steps (P14–P16) wait for P3. Nothing in the 0.5 table is cut-able: each lane answers an owner decision (DECISIONS
   2026-10-14 / 15) or an audit finding.

**Budget trend** (`npm run build`; elements at 390 px in a fresh browser; `tests/perf.js`, 45 states, run alone):

| | 0.2.0 | 0.2.3 | 0.2.5 | 0.2.6 / 0.3.0 | 0.4.0 | Limit | Use |
|---|---|---|---|---|---|---|---|
| `dist/index.html` | 498,891 B | 507,536 B | 665,735 B | 669,290 B | 705,008 B | 870,000 B, blocking | **81%** |
| same, gzip -9 | — | — | — | 153,871 B | 164,936 B | 200,000 B, blocking | **82%** |
| `dist-artifact/index.html` | — | — | — | 790,763 B | 826,481 B | 1,030,000 B, blocking | **80%** |
| Page elements | — | 4,658 | — | 4,741 | 4,741 | 6,200, blocking | 76% |
| `update()` median / worst | — | — | — | 6.8 / 8.5 ms | 8.7 / 10.3 ms | 15 ms, advisory | 58% / 69% |
| Inlined fonts (artifact) | — | — | — | 126.2 KB | 126.2 KB | 150 KB, blocking | **84%** |

The three byte budgets entered the 20% band in 0.4 (+5.3% with no visible feature: module boundaries and pack hooks),
and 0.5 adds the place data and new UI, so **P20 is a performance item**: whitespace and syntax minification of the page
script, measured here at −84 KB raw and −8.6 KB gzip. The fonts are unchanged at 84% and no 0.5 item adds a font. The
0.3.0 `update()` figures were measured in another session, possibly on other hardware, so the rise to 8.7 ms isn't a
trend yet (the next pass re-measures both on one machine); `perf` also fails its limit when it runs beside `site`
(16–18 ms, look back), and stays advisory.

#### Items (step 3)

Appetite counts hand-written changed lines as in 0.4 (data records count; regenerated fixtures and snapshots don't).
The full spec of each item, with its acceptance tests and ownership check, is its plan file.

| Item | Problem → result | Size | Owns (files) | Model | Lanes |
|---|---|---|---|---|---|
| [P1](docs/plans/0.5/P1-fitrail-race.md) | Basic rail height differs between loads (#105) → cause found, `fitRail()` re-runs when it settles | S | `src/main.js` (`fitRail()`), one `regress` check | Sonnet | main.js |
| [P2](docs/plans/0.5/P2-phone-order.md) | Next up 2.5–4.4 screens down on phones → Next up first at ≤ 860 px | M | `src/main.js` (placement), `app.css` phone block, 390 px expectations | Sonnet | main.js, app.css |
| [P3](docs/plans/0.5/P3-nextup-phone-card.md) | Next up wraps badly on phones, nested scroll stack → full-width first card, "1 of N", compact later cards | M | `src/cards/nextup.js`, `ahead.js`, their stylesheets, golden `nextup/` | Opus | golden |
| [P4](docs/plans/0.5/P4-level-bar.md) | Level up out of reach on phones → sticky bar holding the one `#lvlUpBig` | M | `src/index.html`, `src/main.js`, `app.css`, `src/cards/journey.js` | Sonnet | main.js, app.css |
| [P5](docs/plans/0.5/P5-tab-bar-build-sheet.md) | Build drawer behind a thin edge tab → bottom tab bar, Build as a bottom sheet | M | the pack's `build` card and stylesheet, `src/main.js`, `src/index.html`, `app.css`, `tests/a11y.js` | Sonnet | main.js, app.css, a11y |
| [P6](docs/plans/0.5/P6-phone-folds.md) | Long cards push the page down on phones → folded by default, choice saved as `fold_<id>` | M | three card `.html` files, `src/main.js`, card stylesheets | Opus | main.js |
| [P7](docs/plans/0.5/P7-zoom-195.md) | Headers overflow at 195 px (known issue since 0.1.9) → fixed, checked at 195 / 260 / 640 px | S | `tests/a11y.js` §8, stylesheets | Sonnet | app.css, a11y |
| [P8](docs/plans/0.5/P8-place-data.md) | Kibelisks are names only, travel numbers only in DECISIONS → registry, rules, `binds`, place table | M–L | AION 2 pack data (`kibelisks.json` new, zones, story `binds`, rules), schemas, `checks.mjs`, `tools/gen/` | Opus | gen |
| [P9](docs/plans/0.5/P9-step-points.md) | 0 of 432 objectives have a point → `steps[].at` from the research | M–L | story-quests data and schema, `checks.mjs`, `tools/gen/` | Opus | gen |
| [P10](docs/plans/0.5/P10-place-module.md) | Nothing knows where the player is → `whereNow`, `byPlace` (engine), `bound` / nudge / teleport (pack), not wired | M | `src/core/place.js`, `src/core/pack.js`, `src/packs/aion2/travel.js`, core tests | Opus | none |
| [P11](docs/plans/0.5/P11-ranking-families.md) | Golden and invariant states have no dated ticks → `loc` / `behind` / `bind` families, oracle, invariants, switches off | M–L | `tests/golden/**` (new states), oracle, `tests/invariant/**`, switch tables | Opus | golden |
| [P12](docs/plans/0.5/P12-place-rank.md) | Location ignored, Ascension not always first → `ascensionFirst`, `placeRank` on | M | `src/core/nextup.js`, `src/packs/aion2/nextup.js`, golden `nextup/` | Opus | golden |
| [P13](docs/plans/0.5/P13-catch-up.md) | A player ahead of their ticks sees 2 missed steps → catch-up, Later by when it opens | M | same as P12, core cases | Opus | golden |
| [P14](docs/plans/0.5/P14-tracks-bands.md) | No fastest / completionist, no level bands → tracks, band labels, toggle as the owner decides | M | `src/core/nextup.js`, `src/cards/nextup.js`, its stylesheet, golden `nextup/` | Opus | golden |
| [P15](docs/plans/0.5/P15-bind-row.md) | No Kibelisk binding → derived binds, one-time "Bind X" row (`bind:<kib>` on tick) | M | the pack's `nextup.js`, `travel.js`, `nextup-kinds.js`, a pack stylesheet, golden | Opus | golden |
| [P16](docs/plans/0.5/P16-travel-line.md) | No teleport-or-walk advice → travel line, "I'll walk", `preferRun` | M | same as P15, `src/cards/nextup.js` (setting) | Opus | golden |
| [P17](docs/plans/0.5/P17-character-ops.md) | Slots exist, nothing manages them → add / switch / rename / remove, pack `classes` | M | `src/core/chars.js`, `state.js`, `pack.js`, the AION 2 pack's `classes` | Opus | none |
| [P18](docs/plans/0.5/P18-character-switcher.md) | One character per browser, no name → header switcher, class picker (Assassin), name field | M–L | `src/cards/characters.*`, `src/index.html`, `src/main.js`, `tests/save.js` | Opus | main.js |
| [P19](docs/plans/0.5/P19-rename-remove.md) | Names fixed at creation, no remove → rename, remove with confirmation | S–M | the characters card, `tests/save.js` | Opus | main.js |
| [S1](docs/plans/0.5/S1-nextup-mockup.md) | Lane A's rows not drawn yet → mockup on P3's phone card and desktop, owner questions | M (docs) | `docs/design/0.5-nextup-mockup.md`, `docs/design/mockups/0.5-nextup*` | Sonnet | none |
| [S2](docs/plans/0.5/S2-characters-mockup.md) | Switcher not drawn yet → mockup, owner questions | S–M (docs) | `docs/design/0.5-characters-mockup.md`, `docs/design/mockups/0.5-characters*` | Sonnet | none |
| [P20](docs/plans/0.5/P20-page-script-size.md) | Byte budgets at 80–82% → page script minified (whitespace and syntax, names kept) | S | `scripts/build.mjs` (esbuild options), ARCHITECTURE §4 | Sonnet | none |
| [R](docs/plans/0.5/R-release-0.5.0.md) | Release 0.5.0 | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | release, alone |

No-gos for the whole minor: no save break (0.5 adds keys inside `companion-save-v5` only: `bind:<kib>` checks,
`track`, `preferRun`, `fold_<id>`, more character slots); no AION 2 term in the engine, engine cards or shell (term
scan); no new game data except P8 / P9's, each with its source; no `.github/workflows/` edits (bots can't push them);
no change to the artifact rules (one file, `/_blob/` icons, no service worker); no new game art (class icons need the
owner's OK).

#### Lane map (step 4)

At most three builds at a time (five since 2026-10-17, PR #233); kickoff queues an item once everything on its After line has merged, and the planner
queues the ones whose After line names an owner input or the research. Serial lanes (DISPATCH "Serial files", the
names kickoff knows): **golden** P11 → P3 → P12 → P13 → P14 → P15 → P16 (the critical path; P3 and P12 in whichever
order they are ready); **main.js** P1 → P2 → P4 → P5 → P6 → P18 → P19; **gen** P8 → P9; **app.css** P2, P4, P5, P7;
**a11y** P5, P7. The Next up card is shared by lanes A and B: B first (P14–P16 are After P3).

| Wave | Builds | After |
|---|---|---|
| 1 | S1 (none) ∥ S2 (none) ∥ P8 (gen) | — |
| 2 | P1 (main.js) ∥ P10 (none) ∥ P17 (none) | P10: P8 |
| 3 | P2 (main.js, app.css) ∥ P11 (golden) ∥ P20 (none) | P2: P1 + owner input 1 · P11: P10 |
| 4 | P3 (golden) ∥ P4 (main.js, app.css) ∥ P9 (gen) | P3, P4: P2 · P9: P8 + the step-points research |
| 5 | P12 (golden) ∥ P5 (main.js, app.css, a11y) | P12: P11 + owner input 1 · P5: P4 |
| 6 | P13 (golden) ∥ P6 (main.js) ∥ P7 (app.css, a11y) | P13: P12 · P6, P7: P2 |
| 7 | P14 (golden) ∥ P18 (main.js) | P14: P3, P13 + owner input 2 · P18: P17 + owner input 3 |
| 8 | P15 (golden) ∥ P19 (main.js) | P15: P3, P9, P12 + owner input 2 · P19: P18 |
| 9 | P16 (golden) | P15 |
| 10 | R, alone | everything above |

Waves are the expected order, not gates: an item starts when its After line has merged and its lanes are free.

#### Owner input (step 5)

Three To-dos, each a true blocker for visible work; the recommendation is in each, so the owner can answer "yes":

1. **Phone layout and 0.5's visible steps** (blocks P2–P7 and P12–P16; token `owner-ok-phone`, `owner-ok-visible`).
   Answer the phone mockup's open questions (phone-layout §5); recommended: Basic opens on Next up with Journey still
   open (it holds Level − / + and the slider) and Progress folded; tabs Route · Gear · Build; the level bar and tab bar
   in both modes; Dungeons & Strongholds folded on phones in both modes; "1 of N" in Advanced only; Milestones stays
   where it is; the `before-*` shots are already in the repo, no action. And a **standing approval** like 0.3's: a
   visible 0.5 step that follows an approved mockup or the smart Next up design merges on a separate reviewer's
   APPROVE and green CI, with its before / after shots and `--explain` table kept for you to check afterwards (undo by
   a follow-up patch).
2. **S1 mockup** (written when S1 merges; blocks P14–P16; token `owner-ok-S1`): approve the drawn rows and its
   questions. One needs your OK because it differs from your 2026-10-14 decision ("fastest, with a completionist
   toggle"): the toggle stays hidden until at least one milestone has approved non-core labels (today every record is
   `core`, so the toggle would change nothing).
3. **S2 mockup** (written when S2 merges; blocks P18–P19; token `owner-ok-S2`): approve the switcher, the one-class
   picker and the name field.

Not blockers (the recommendation applies unless the owner says otherwise):

- **Bind radius:** your working value, 25 m, stays (DECISIONS 2026-10-15). P8 prints the bound / nudge split for 25,
  32, 35 and 40 m (the Kibelisk research finds the data fit at least 32 m); changing it later is one data line.
- **In-game checks, when convenient:** the Kibelisk check list P8 / P9 generate (which objective binds which
  Kibelisk), a timed walk vs teleport on two routes (`rule:teleport-gain`, 400 m to start), C41 (Koro at Lv 45). None
  blocks a build.
- **Route labels:** Data & Research proposes `filler` / `completionist` labels milestone by milestone for your approval;
  until then fastest = today's order.
- **Sync hosting** (S0's decision) blocks 0.6 lane C, not 0.5.

#### Alongside (not #114 items)

- **Story step-points research** (gates P9; token `research-step-points`): a cloud research session (it needs the web)
  reads the Metabot quest pages of the 51 story quests with step markers (about 185 points) under the fetching rules
  (terms and robots.txt first, ≤ 12 requests / min, one at a time, our User-Agent, 24 h cache, facts only), and writes
  `docs/research/2026-10-story-step-points.md` plus a CSV under `data/research/`, each point with its page URL. The
  coordinator starts it; no aion2.th.gl.
- **Route label proposals** for P14's toggle (Data & Research, docs only).
- **Class research packs** for 0.6 lane B continue as in 0.4.

### 0.6 — New players and the first new class

| Lane | What | Module |
|---|---|---|
| A | First-run welcome, Lv 1–10 tuning, terms explained, join mid-level (old 0.7 P1–P3) | onboarding module, guide text |
| B | Ranger pack (the owner's choice, 2026-10-18; first planned as the Gladiator, see Replan below), from its research pack: data, guide build, icons, golden snapshot, in-game spot check. It follows the 0.4 P1 pack layout: class data in `data/packs/aion2/classes/ranger/`, its Asmodian guide in `data/packs/aion2/asmodian/ranger/`, each with a manifest. First step: per-pack loading (moved from 0.4 P7), so the page carries only the chosen class; then the guide text both classes share is split out of the Assassin pack | its two pack folders only, after the loading step |
| C | Sync client on `merge()` (old 0.6 Y1), if the owner approved the sync design and hosting | sync module |

**Replan (pipeline thread, 2026-10-18 1:50 AM ET): the Ranger replaces the Gladiator in lane B.** Isaac chose the Ranger
(DECISIONS 2026-10-18, D8). P4 (Gladiator class data, PR #300) had already merged; that hidden pack stays on main,
unchanged, for a later class release. New item P22 builds the Ranger class data from a `research-ranger` session (the
same method as `research-gladiator`, PR #291); P5 becomes the Ranger guide and picker, after P22 and
`owner-check-ranger`. Lane B's gen lane is now P2 → P3 → P4 (done) → P22 → P5. Audit text below that names the
Gladiator describes the plan as first written; the item table, waves and owner input are updated.

Planning pass written 2026-10-18 (#257): release kaizen review in [docs/kaizen/0.5-scorecard.md](docs/kaizen/0.5-scorecard.md)
(the first scorecard), one spec per item in [docs/plans/0.6/](docs/plans/0.6/) (the issue body the planner creates,
verbatim), owner notes from #254 placed below. Item keys are `P<n>` / `S<n>` for kickoff's After-line queueing; tokens
that aren't keys (`owner-*`, `research-*`) are listed under "Owner input" and "Alongside" with who clears them.

**Process changes from the scorecard (in place before the first 0.6 item is queued):** K1 builds expected past 45
min commit and push after each step (the 1 h token killed P6); K2 / K4 every research gate and owner question of the
minor goes out the hour this plan merges; K5 / K6 per-item times and Waste lines are kept for the next scorecard; K7
fix round 2 on Opus; K3 and K9 (Kickoff writes the build card; golden split by snapshot folder) need the pipeline
thread. Re-derived #114 limits: M code 80 min, M–L 80 min, L 120 min, S 16, S–M 20, M docs 41; build cap 5; build
routing unchanged. The rows are in the scorecard and in the PR of this pass for #222.

#### Audit (step 2), against `main` at `aab1032` (0.5.0)

Path to 1.0 first:

1. **0.7–0.9 are blocked on research nobody started.** "Class research packs for all seven classes, two at a time"
   (0.4 "Alongside") produced only the Gladiator groundwork ([docs/research/2026-10-next-class.md](docs/research/2026-10-next-class.md)).
   Changed: the research packs for 0.7's two classes run alongside 0.6 (below), chosen by D8's rule once the owner says
   who levels which class (owner input 5).
2. **The artifact can't carry eight classes.** P2 (per-pack loading) leaves other classes out of the site page, but the
   claude.ai artifact can't fetch, so it inlines every class: at 84% of its byte budget with one class, it fails
   before the fourth. Added to 0.7: decide (in its planning pass, with the owner) between an artifact that carries one
   class chosen at build time and a raised budget with a reason.
3. **0.7 lane C (sync server and UI) waits on the same owner decision as 0.6 P21** (sync.md §6 S1 hosting, S2 money);
   it is asked now (owner input 4), so 0.7 isn't held by it.
4. **The two-classes-per-minor risk stands** (Plan, "Risk, called out"); D8 (which class first) is still "decided
   later" in DECISIONS. Gladiator stays the default (next-class research §5); owner input 5 asks once.
5. 1.0 and 1.1 are unchanged; 1.1's reset and boss research can still run any time.

Then 0.6:

6. **Lane A was vague** ("Lv 1–10 tuning" has no acceptance). It becomes the #254 notes plus the old 0.7 P1–P3:
   tuning is what P6, P12, P14, P15 and P16 do for the first ten levels; no separate item.
7. **Lane A's visible work needs one drawing first** (S1), and #254 note 1 needs an owner choice (hidden vs faded), so
   S1 asks it with both drawn.
8. **Lane B needs the web** (Gladiator data from Metabot) and a bot build has none: a cloud research session
   (`research-gladiator`) writes the files P4 reads, started when this plan merges.
9. **Lane C is conditional:** P20 (removed characters stay removed through `merge()`, the 0.5 P17 finding) needs no
   host and runs now; P21 (client) waits for the hosting decision and moves to 0.7 if it isn't recorded by the time P5
   merges.
10. **#254 note 3 changes a CLAUDE.md rule**, so P19 is queued only on Isaac's typed OK.
11. **The private screens (`daevacompanion-private`) couldn't be read from this run** (no credentials). The keys they
    were mined for are in [docs/research/2026-10-owner-unlocks.md](docs/research/2026-10-owner-unlocks.md) (Journal J,
    Stats P, Skills K, Daevanion U, Legion L, Shop H, …); owner input 3 asks only what that table doesn't show, and the
    coordinator, who can read the private repo, answers from the screens first if they show it.

**Budget trend** (`npm run build`; elements and `update()` not re-measured: no item in this pass changes the page):

| | 0.2.6 / 0.3.0 | 0.4.0 | 0.5.0 | Limit | Use |
|---|---|---|---|---|---|
| `dist/index.html` | 669,290 B | 705,008 B | 741,479 B | 870,000 B, blocking | 85% |
| same, gzip -9 | 153,871 B | 164,936 B | 182,302 B | 200,000 B, blocking | **91%** |
| `dist-artifact/index.html` | 790,763 B | 826,481 B | 863,343 B | 1,030,000 B, blocking | **84%** |
| Inlined fonts (artifact) | 126.2 KB | 126.2 KB | 126.2 KB | 150 KB, blocking | **84%** |

All three byte budgets are within 20% of their limits, gzip at 91% (+10.5% in 0.5 even after 0.5 P20's minification).
**P1 is a performance item** and goes first in lane B: lane A adds text and markup, and P4 / P5 add a second class.
Fonts unchanged; no 0.6 item adds one.

#### Items (step 3)

Appetite counts hand-written changed lines (data records count; regenerated fixtures and snapshots don't). Models
follow #114's routing as the scorecard left it; stall limits are the scorecard's re-derived ones.

| Item | Problem → result | Size | Owns (files) | Model | Stall | Lanes |
|---|---|---|---|---|---|---|
| [S1](docs/plans/0.6/S1-onboarding-mockup.md) | Lane A not drawn → mockup: welcome, mid-level join, locked cards hidden vs faded, key hints, terms | M (docs) | `docs/design/0.6-onboarding-mockup.md`, mockups | Sonnet | 41 | none |
| [P1](docs/plans/0.6/P1-page-size-headroom.md) | gzip at 91% → size table, largest share cut, ≤ 170,000 B | S–M | `scripts/build.mjs`, `scripts/generated-data.mjs`, ARCHITECTURE §4 | Sonnet | 20 | none |
| [P2](docs/plans/0.6/P2-per-pack-loading.md) | Every class in every page → per-class chunks, site loads the current class | M–L | `tools/gen/`, build scripts, `src/packs/aion2/load.js`, `src/sw.js`, fake pack, conformance | Opus | 80 | gen |
| [P3](docs/plans/0.6/P3-shared-guide-split.md) | Shared guide text inside the Assassin pack → shared Asmodian guide pack | M–L | `data/packs/aion2/asmodian/guide/**`, Assassin guide, `checks.mjs`, `tools/gen/` | Opus | 80 | gen |
| [P4](docs/plans/0.6/P4-gladiator-class-data.md) | No Gladiator pack → class data from the research files, not offered yet (merged, PR #300; kept hidden after the Replan) | L | `data/packs/aion2/classes/gladiator/**`, `sources.json` | Opus | 120 | gen |
| [P22](docs/plans/0.6/P22-ranger-class-data.md) | No Ranger pack → class data from the Ranger research files, not offered yet | L | `data/packs/aion2/classes/ranger/**`, `sources.json` | Opus | 120 | gen |
| [P5](docs/plans/0.6/P5-ranger-guide.md) | Ranger has no advice → guide pack, icons, golden states, in the picker | L | `data/packs/aion2/asmodian/ranger/**`, pack `classes`, icons, golden | Opus | 120 | gen, golden |
| [P6](docs/plans/0.6/P6-step-text-pronouns.md) | "investigate it with Maard" (#254 n11) → 4 texts fixed, pronoun check | S | `story-quests.json` (4 texts), `checks.mjs`, golden | Opus | 16 | golden |
| [P7](docs/plans/0.6/P7-character-sort.md) | Characters in save order (#254 n10) → sorted by name | S | `src/cards/characters.js`, `tests/save.js` | Sonnet | 16 | none |
| [P8](docs/plans/0.6/P8-skills-respec.md) | No Respec on Skills (#254 n8) → button like Daevanion's | S | the pack's `skills.*` | Sonnet | 16 | none |
| [P9](docs/plans/0.6/P9-daevanion-skill-bonus.md) | No node bonus shown (#254 n9) → green (+x) | M | the pack's `skills.*`, node-bonus helper | Opus | 80 | none |
| [P10](docs/plans/0.6/P10-build-step-icons.md) | Play steps are names only (#254 n5) → icons | S | the pack's `build.*` | Sonnet | 16 | none |
| [P11](docs/plans/0.6/P11-popout-rounded.md) | Square pop-out (#254 n4) → app styling inside; frame is the browser's | S | `src/cards/nextup.js` pop-out area | Sonnet | 16 | none |
| [P12](docs/plans/0.6/P12-auto-bind-mentions.md) | Binds that happen at an objective still mentioned (#254 n6) → trimmed within 25 m | M | the pack's `travel.js`, `nextup.js`, `nextup-kinds.js`, golden | Opus | 80 | golden |
| [P13](docs/plans/0.6/P13-story-quest-icon.md) | 📜 for story (#254 n7) → the game's yellow icon | S | `src/cards/nextup.js` icon map, icon file, `docs/ISSUES.md`, golden | Opus | 16 | golden |
| [P14](docs/plans/0.6/P14-key-hints.md) | No "press K" (#254 n2) → `hotkey` on unlocks, hints | M | unlock schema and data, `nextup-kinds.js`, golden | Opus | 80 | golden |
| [P15](docs/plans/0.6/P15-respec-walkthrough.md) | No refund / respec steps (#254 n2) → rows from the owner's answer | S–M | guide records, `unlocks.json`, golden | Opus | 20 | golden |
| [P16](docs/plans/0.6/P16-cards-on-unlock.md) | Every card from Lv 1 (#254 n1) → cards open with their unlock | M–L | `src/core/cards.js`, `src/main.js`, pack card index, golden | Opus | 80 | main.js, golden |
| [P17](docs/plans/0.6/P17-welcome-join-mid-level.md) | No welcome, no mid-level start → both, per S1 | M–L | `src/cards/welcome.*`, `src/main.js`, characters card | Opus | 80 | main.js |
| [P18](docs/plans/0.6/P18-terms-explained.md) | Game words unexplained → `terms.json`, explanations on cards | M | `terms.json`, schema, `text.js`, golden, `tests/a11y.js` | Opus | 80 | golden, a11y |
| [P19](docs/plans/0.6/P19-auto-level-up.md) | Tick + Level up for a full-level quest (#254 n3) → tick levels up (verified quests only) | S–M | quest schema, one record, `journey.js`, `state.js`, golden, CLAUDE.md line | Opus | 20 | golden |
| [P20](docs/plans/0.6/P20-removed-characters-merge.md) | A removed character returns through `merge()` → tombstones | M | `src/core/sync.js`, `chars.js`, `state.js`, characters card | Opus | 80 | none |
| [P21](docs/plans/0.6/P21-sync-client.md) | No sync client → encrypted push / pull / merge on a fake host | L | `src/core/sync-client.js`, host adapter, build exclusion, PRIVACY.md | Opus | 120 | none |
| [R](docs/plans/0.6/R-release-0.6.0.md) | Release 0.6.0 | S | `package.json`, `package-lock.json`, `CHANGELOG.md` | Sonnet | 16 | release, alone |

No-gos for the whole minor: no save break (0.6 adds fields inside `companion-save-v5` only); no AION 2 term in the
engine, engine cards or shell (term scan); no game data without its source (P4, P22, P5 from the research files; keys,
refund and respec from the owner); no `.github/workflows/` edits; no change to the artifact rules; no new game art beyond
the standing icon OK and the owner's OK for the story-quest icon (#254 note 7).

#### Waves and lane map (step 4)

At most five builds at a time (kickoff.yml). Serial lanes: **gen** P2 → P3 → P4 → P22 → P5 (lane B's critical path, gated
by `research-ranger` and `owner-check-ranger`; P4 merged before the Replan); **golden** P6 → P12 → P13 → P14 → P16 → P15 → P18 → P19 → P5 (lane
A's critical path, gated by `owner-ok-S1`); **main.js** P16 → P17; **a11y** P18. Shared files outside the lanes are
ordered by After lines: build scripts P1 → P2 → P21; the Skills card P8 → P9 → P14; `src/cards/nextup.js` P11 → P13;
the characters card P7 → P20 and P7 → P17. Critical path: P1 → P2 → P3 → P22 → P5 → R, so P1 and the
research session start first (`research-ranger` since the Replan).

| Wave | Builds | After |
|---|---|---|
| 1 | S1 (none) ∥ P1 (none) ∥ P6 (golden) ∥ P7 (none) ∥ P8 (none) | — |
| 2 | P2 (gen) ∥ P12 (golden) ∥ P10 (none) ∥ P11 (none) ∥ P20 (none) | P2: P1 · P12: P6 · P20: P7 |
| 3 | P3 (gen) ∥ P13 (golden) ∥ P9 (none) ∥ P21 (none) | P3: P2 · P13: P11, P12 + `research-story-icon` · P9: P8 · P21: P2, P20 + `owner-ok-sync-hosting` |
| 4 | P4 (gen, merged) → P22 (gen) ∥ P14 (golden) | P4: P3 + `research-gladiator` · P22: P3 + `research-ranger` · P14: S1, P9, P13 + `owner-ok-S1` |
| 5 | P16 (main.js, golden) | P14 + `owner-ok-S1` |
| 6 | P15 (golden) ∥ P17 (main.js) | P15: P14 + `owner-keys` (after P16 frees golden) · P17: P7, P16 |
| 7 | P18 (golden, a11y) | P15 |
| 8 | P19 (golden) | P18 + `owner-ok-autolevel` |
| 9 | P5 (gen, golden) | P22 + `owner-check-ranger` |
| 10 | R, alone | everything above, or moved out here |

Checked: no two items in one wave own the same file (P4, P22 and P14 touch different schema files; P13 and P11 are in
different waves). Waves are the expected order, not gates. An item whose owner token isn't recorded when its wave
comes is skipped, not waited on; if it is still missing when everything else has merged, it moves to 0.7 in this file
and R ships without it.

#### Owner input (step 5)

To-dos the hour this plan merges (scorecard K4), each with its recommendation and the exact words to type (`copy`):

1. **S1 mockup** (`owner-ok-S1`, blocks P14, P16, P17, P18; red once S1 merges): approve the drawings and choose hidden
   vs faded for locked cards (#254 note 1). Recommended: faded with "Opens at …" on desktop and hidden on phones, if
   S1's drawing reads well; otherwise faded everywhere.
2. **Auto level-up** (`owner-ok-autolevel`, blocks P19 only, not red): it changes CLAUDE.md's "Level changes only via
   Level up / − / + / slider". Recommended: yes, for quests with a verified 100% EXP reward only (today one: A Village
   in the Fog), undoable.
3. **In-game keys and steps** (`owner-keys`, blocks P15 only, not red): the keys the owner-unlocks table doesn't show
   (Stigmas, Dungeons, Strongholds), where the skill reset / refund button is and what the tutorial-skill refund looks
   like, how to respec the Daevanion board and stigmas, where the auto-use slots are set. A screen of each is enough.
4. **Sync hosting and money** (`owner-ok-sync-hosting`, docs/design/sync.md §6 S1 + S2; blocks P21 and 0.7's server,
   not red): recommended Cloudflare Workers + R2 in the existing account, free tier with a usage alert.
5. **Ranger spot check** (`owner-check-ranger`, blocks P5, not red until P22 merges; replaced the Gladiator spot check
   at the Replan): who levels which class is answered (the Ranger, DECISIONS 2026-10-18). Left: one Skills-window
   screen from a Lv 1 Ranger to check three skill learn levels the Ranger research names. Not asked: the stigma max
   level. A leveling guide doesn't reach it (the Gladiator research session counted about 30 stigma points by Lv 45
   against 75 for stigma Lv 20; not re-checked here), so `maxLevel` ships labelled single source unless the Ranger
   research finds otherwise.

Not blockers (the recommendation applies unless the owner says otherwise):

- **#254 note 5:** P10 puts icons on the play steps; an explanation of auto-use waits for owner input 3's screen of the
  auto-use slots.
- **#254 note 11, full objective audit:** owner spot checks when convenient; P6's check catches the pronoun class.
- **#254 note 4:** after P11 the owner checks the pop-out on his machine; the frame stays the browser's.

Decisions this pass recorded (for the tracker, each as a done To-do with its remediation):

- **User remediated:** bind radius stays 25 m (#254, 7:55 PM ET; note 6 means objective binds only); the story-quest
  icon may be added (#254 note 7, still needs an approved source).
- **Claude remediated:** Gladiator stays the 0.6 class (D8 default; superseded 2026-10-18, the owner chose the Ranger); lane C splits into P20 now and P21 on the hosting
  OK; "Lv 1–10 tuning" folds into P6 / P12 / P14–P16; note 6 trimmed by derived distance, data text kept; note 5 read as
  the play steps; note 4's frame moved out; P1 scheduled from the 91% budget.

#### #254 notes placed

| Note | Placed as |
|---|---|
| 1 Cards only when they unlock | P16, choice in S1 (owner input 1) |
| 2 Keys, tutorial refund, respec walk-through | P14 (known keys), P15 (refund and respec, owner input 3) |
| 3 Auto level-up on 100% EXP quests | P19, behind `owner-ok-autolevel` (owner input 2) |
| 4 Rounded pop-out | P11 (inside); the window frame moved out: the browser draws it |
| 5 Icons in the rotation setup | P10 (play steps); auto-use explanation waits on owner input 3 |
| 6 Kibelisk binds that happen on their own | P12, R = 25 m kept |
| 7 Yellow story-quest icon | P13, gated by `research-story-icon` |
| 8 Respec on the Skills card | P8 |
| 9 Green (+x) from Daevanion nodes | P9 |
| 10 Character list by name | P7 |
| 11 Wrong step subtext, objective audit | P6; the full audit moved out to owner spot checks |

#### Alongside (not #114 items)

- **Gladiator research** (gated P4; token `research-gladiator`): done, PR #291
  (`docs/research/2026-10-gladiator-pack.md` plus CSVs under `data/research/`).
- **Ranger research** (gates P22; token `research-ranger`, added at the Replan): the same session type and method reads
  Metabot's Ranger class, skill, stigma and Daevanion pages under the fetching rules and writes
  `docs/research/2026-10-ranger-pack.md` plus CSVs under `data/research/` (file names with `ranger`), each row with its
  page URL, and names three skill learn levels for owner input 5. Started 2026-10-18 by the pipeline thread through
  the coordinator.
- **Story-quest icon source** (gates P13; token `research-story-icon`): the same kind of session looks for the game's
  story-quest icon on Metabot and records page, file URL and date in docs/ISSUES.md; if none, the owner supplies the
  file.
- **Research packs for 0.7's two classes** (audit 1), after owner input 5 names them.

### 0.7, 0.8, 0.9 — two classes each

Each minor: two class packs side by side (lanes A and B; order by the D8 rule: a class someone will level to 45, then
data coverage, then overlap with Assassin), plus one other module in lane C: sync server and UI (old Y2, Y3) in 0.7, the
1.0 audit's fixes in 0.8–0.9 as found. 0.7's planning pass also settles how the artifact carries several classes (0.6
audit 2) and takes P21 if 0.6 moved it out.

### 1.0

Full architecture, performance and UX audit (the planning pass in its full form), docs pass, all eight classes on the
engine, Asmodian, Lv 1–45. The strict save rule returns (CLAUDE.md).

### 1.1 — End-game tracker (owner, 2026-10-16)

A new module for max-level play: daily and weekly checklists with their resets, world boss timers. Built on the engine
with no page-script edits. Scope, reset times and boss schedules need verified data first; that research can run any
time before. From 1.0 saves are strict, so its saved data is additive.

### Any time (patches)

- Game patch watch: weekly after Global maintenance (Korean patch notes as early warning), report only; a PR only
  when a claim is affected. Re-verification driven by `verifiedAt`.
- Data corrections from issues.

## Moved out of the path to 1.0

Kept as ideas; each comes back through a planning pass when its time comes.

- **Filler XP ranking** (old 0.4 N6): needs the owner's XP-per-minute measurements; after 1.0 unless they arrive early.
- **Whole-app UX review every second minor**: replaced by the planning pass (step 2) and the full audit at 1.0.
- **Colour sprint** (owner wants its own sprint): CSS-only on the design tokens, so it can run as a lane in any minor
  after 0.5 once the owner has time for the research walk-through and one in-game check session; research in
  docs/research/colors-2026-10.
- **Store app (iPhone / Android)** (owner, 2026-10-15: "eventually"): after sync and 1.0. Likely the same web code
  wrapped (e.g. Capacitor) on the storage adapter from 0.4. Questions first: App Store review of an unofficial app
  using NCSoft's game name and icons, Apple developer account (~$99 / year), Metabot's non-commercial condition if the
  app is ever paid.
- **Lv 45 weekly/daily reset checklist**: folded into 1.1.
- **Rounded pop-out window frame** (#254 note 4, 0.6 pass): the Document Picture-in-Picture frame is drawn by the
  browser, so the page can't round it (inferred; P11 records the test). Back only if a browser API allows it.
- **Full story-objective wording audit** (#254 note 11, 0.6 pass): only the owner's screens show the in-game text, so
  it runs as owner spot checks reported as data issues; 0.6 P6 fixes the pronoun cases and adds the check.
- **Item level as an input** (gates Krao Cave 200, Ascension Trial 1,000 / 1,500), **post-Altgard (Reshanta / Abyss)**,
  **Elyos** (a faction pack after 1.0).
- **Preview deploys** with a move to Cloudflare Pages; **release tooling** (release-please / changesets) if other
  contributors join.
