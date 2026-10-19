# 0.8 item specs

Planned in the 0.8 planning pass. Release Planner wrote it on 2026-10-19. The plan, waves and owner input are in
ROADMAP "0.8"; the Kaizen review it follows is docs/kaizen/0.7-scorecard.md.

Each item below becomes an issue titled `0.8 P<n>: …`, carrying this spec and its `After:` line. The planner adds the
issue's `- [next]` line and its #114 line only after the owner's morning OK (`owner-ok-0.8-go`). Until then, nothing here
is queued.

Every builder reads CLAUDE.md and docs/ARCHITECTURE.md first.

Rules for every item:
- `npm test` is green.
- A visible change commits before and after shots and a `scrapbook.json` (docs/reviews/README.md), and waits for Design
  Lead's DESIGN OK.
- An item meant to look the same says "No visible change".
- Acceptance lines are a review checklist: each one is marked pass or fail, with evidence.

## P1: Gladiator and Spiritmaster icons

- **Problem.** The Skills, Stigmas, Next up and Build panel show letter squares for the 14 Gladiator and 15 Spiritmaster
  skills and stigmas (#441-4; `docs/ISSUES.md`, sections "initials for now").
- **Result.** Each record points at its Metabot icon. Game Data Check commits the files in `research-gl-sm-icons`, with
  their provenance rows. The two ISSUES.md sections are closed.
- **No-gos.**
  - No fetching.
  - No icon without a provenance row.
  - No layout change.
- **Acceptance.**
  - [ ] No letter square in a Gladiator or Spiritmaster build at Lv 1, 30 and 45 (shots, both sizes).
  - [ ] Every new `src/assets/icons` file has an ISSUES.md row.
  - [ ] gen and golden are green, with the golden diff limited to icon references.
- **Files.** The icon fields in `data/packs/aion2/classes/{gladiator,spiritmaster}/{skills,stigmas}.json`, and
  `docs/ISSUES.md`.
- **Lanes:** gen, golden. **Model:** Sonnet, S (44 min).
- **After:** `research-gl-sm-icons`.

## P2: Templar class data (hidden)

- **Model.** Follow 0.7 P3 (docs/plans/0.7/P3-second-class-data.md), the same shape for the Templar.
- **Input.** Read `docs/research/2026-10-templar-pack.md` and the owner's Templar key screens
  (`/mnt/project-files/owner-screens/2026-10-18/templar/NOTES.md`).
- **Result.**
  - `data/packs/aion2/classes/templar/**`, each field with its source;
  - `sources.json` updated;
  - icons as research saved them.
  The class is not offered yet.
- **Acceptance.**
  - [ ] gen is green, and record counts match the research CSVs.
  - [ ] Golden and equiv are unchanged. No visible change.
- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** `research-templar`.

## P3: Templar guide pack and picker

- **Model.** Follow 0.7 P4 (docs/plans/0.7/P4-second-class-guide.md).
- **Result.**
  - `data/packs/aion2/asmodian/templar/**`: build steps, stigma picks and key setup from the owner's screens;
  - a golden master;
  - the class offered in the site picker;
  - its skill and stigma icons shown.
- **Acceptance.**
  - [ ] The Templar route runs from Lv 1 to 45 with no other class's skills in it (golden).
  - [ ] No letter square appears (shots).
  - [ ] ISSUES.md lists what is still missing.
- **Lanes:** gen, golden. **Model:** Opus, L (120 min).
- **After:** P2.

## P4: Cleric class data (hidden)

The same as P2, for the Cleric. It reads `docs/research/2026-10-cleric-pack.md`.

- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** `research-cleric`.

## P5: Cleric guide pack and picker

The same as P3, for the Cleric. It runs after P3 because both edit `pack.js`.

- **Lanes:** gen, golden. **Model:** Opus, L (120 min).
- **After:** P4, P3.

## P6: Sync UI loads on demand

- **Problem.** The site page's gzip budget is at 95% (189,634 / 200,000 B). The sync card, its client, styles and texts
  ship to every visitor, yet stay hidden while `SYNC_LIVE` is false.
- **Result.**
  - The sync UI (`src/cards/sync.*`, `src/core/sync-client.js`, `src/styles/sync.css`, `data/ui/sync-texts.json`) is a
    separate chunk, loaded only when sync is shown.
  - `src/core/sync.js` `stamp` stays in the page.
  - The service worker precaches the chunk, so offline works.
  - gzip is ≤ 90% of the limit.
- **No-gos.**
  - No sync behaviour change.
  - No budget raised.
  - No change to the save or the sync key.
- **Acceptance.**
  - [ ] Build output: gzip ≤ 180,000 B. Paste the before and after.
  - [ ] `site` and `save` suites green, with the sync tests passing when `SYNC_LIVE` is forced on in the test.
  - [ ] It works offline after a first visit (perf/site suite).
  - [ ] No visible change.
- **Files.** `scripts/build.mjs` (chunking), `src/site.js`, `src/cards/sync.js`, `src/sw` precache list if separate,
  `tests/site.js`, ARCHITECTURE §4.
- **Lanes:** site. **Model:** Opus, M (80 min).
- **After:** none.

## P7: Phone overlaps

- **Problem.** At 390×844, the Undo toast overlaps the tab bar by 6 px (#321-2 rest). The level-up chip
  ("Lv 6 +2 skill pts") briefly covers the right edge of the character-name box (#441-7).
- **Result.** At 390 px, neither one overlaps another control at any moment. The toast sits fully above the tab bar,
  and the chip stays inside its own row.
- **No-gos.**
  - No desktop change.
  - No new animation.
- **Acceptance.**
  - [ ] A site/a11y test measures both boxes at 390 px. The chip is measured during its transition.
  - [ ] Phone shots.
- **Files.** The layout rules in `src/styles/app.css` for the toast and the level-up chip, and `tests/a11y.js`.
- **Lanes:** app.css, a11y. **Model:** Sonnet, S (44 min).
- **After:** none.

## P8: Two "Start at Lv 1" buttons

- **Problem.** A new character's "Your level" step shows a green and a grey "Start at Lv 1". They behave differently: the
  green one uses the slider and quest, and the grey one skips to Lv 1. A player can't tell them apart (#333-1;
  `src/cards/welcome.js` relabels Back for new characters).
- **Result.** The two read differently. The grey button says what it does, for example "Skip, start at Lv 1". Design
  Lead picks the words in the shot review.
- **No-gos.**
  - No flow change.
  - The first-visit welcome is unchanged.
- **Acceptance.**
  - [ ] No two buttons on that step share a label (a11y test).
  - [ ] Shots at both sizes.
- **Files.** `src/cards/welcome.html`, `src/cards/welcome.js`, `data/ui` texts if the label lives there, and
  `tests/a11y.js`.
- **Lanes:** welcome, a11y. **Model:** Sonnet, S (44 min).
- **After:** none.

## P9: Key setup follow-ups (#424 review)

- **Problem.** Three gaps:
  - The key-grid fit test runs at 390 px only.
  - Screen readers read the key chips after all 12 cells, with nothing tying a chip to its column.
  - A long skill name in a new class can overflow its cell.
- **Result.**
  - The fit test also runs at 1500 px.
  - Each column's cells carry the key in their accessible name, or the column is a labelled group.
  - Long names wrap inside the cell, up to two lines.
- **Acceptance.**
  - [ ] The test fails on today's code for the 1500 px case only if it actually overflows. Paste the run.
  - [ ] An a11y test reads a cell's name with its key.
  - [ ] Shots show a long-name fixture.
- **Files.** `src/packs/aion2/cards/build.js`, `src/packs/aion2/cards/build.html`, `src/styles/packs/aion2/build.css`,
  `tests/a11y.js`, `tests/site.js`.
- **Lanes:** build-card, a11y. **Model:** Sonnet, S (44 min).
- **After:** none.

## P10: Icons sit tight in Next up cards

- **Spec.** `docs/design/0.6.2-icon-fit-mockup.md` (#421): one CSS change in `nextup.css` (`.ns-mhead`). The tile lines up
  with the title only, and the lines under it run the card's full width.
- **Acceptance.**
  - [ ] The shots match the mockup at both sizes.
  - [ ] Golden is unchanged.
- **Files.** `src/styles/cards/nextup.css`.
- **Lanes:** nextup.css. **Model:** Sonnet, S (44 min).
- **After:** `owner-ok-0.8-icon-fit` (met, DECISIONS 2026-10-19).

## P11: Map markers sized by their emblem

- **Spec.** `/mnt/project-files/tracker/mockups/0.8-map-marker-size/README.md`, Design Lead, DESIGN OK 2026-10-19
  4:47 AM ET. `img.mk-tile` goes from 70% to 100% of the tile. The emblem shows at about 27–29 CSS px, like the story
  card's ready ring, and nothing is clipped.
- **Acceptance.**
  - [ ] The README's measurement check passes. Paste it.
  - [ ] Shots of the Sealed Dungeon and Stronghold cards at 1500 and 390 px.
- **Files.** `src/styles/cards/nextup.css`.
- **Lanes:** nextup.css. **Model:** Sonnet, S (44 min).
- **After:** `owner-ok-0.8-marker-size`.

## P12: Class choice on the welcome card

- **Problem.** A first-time player lands on the Assassin route. The other classes are only under the character name,
  then New character (#333-3, still open in #441).
- **Result.** Design Lead's mockup, `/mnt/project-files/tracker/mockups/0.8-welcome-class-and-crop-icons/README.md` §1 (DESIGN OK 2026-10-19 6:23 AM ET):
  - a "Your class" chip row on the welcome's first step, above the buttons, with Assassin pre-selected;
  - the pick carries into Start and into the join form, with no extra screen;
  - on desktop, one row of chips; on phone, a 2-column grid of 44 px buttons;
  - a muted hint points to the name button for more characters.
  An Assassin player still makes one tap.
- **No-gos.**
  - No save shape change: the class is already a character field.
  - No new step for the Assassin default.
- **Acceptance.**
  - [ ] A first visit can start as each offered class (site test).
  - [ ] Assassin start clicks are unchanged.
  - [ ] Shots at both sizes, in Basic, matching the mockup.
- **Files.** `src/cards/welcome.html`, `src/cards/welcome.js`, `src/styles` welcome rules, `tests/site.js`, and
  `tests/a11y.js`.
- **Lanes:** welcome, a11y. **Model:** Sonnet, M (80 min).
- **After:** `owner-ok-0.8-welcome-class`.

## P13: Regional quest state tiles and the extract flask

- **Problem.** The Next up "Regional quests" card and the extract tip don't show the game's icons.
- **Result.** Design Lead's mockup, `/mnt/project-files/tracker/mockups/0.8-welcome-class-and-crop-icons/README.md` §2a and §2c (DESIGN OK 2026-10-19 6:23 AM ET):
  - The regional tile turns dark like the place tiles. "To pick up" shows the owner's teal star crop, and "In progress"
    shows Metabot's `quest_district`. It reuses the story card's state logic (#409).
  - The extract flask sits inline at 1.25 em before "beaker icon" in step 3 of the extract tip.
  Each file gets an ISSUES.md provenance row: the owner screen for the crop, the source page and file URL for
  `quest_district`.
- **No-gos.**
  - No campsite or point-of-interest markers. They are held (§2b) until places carry a kind.
  - No other new art.
- **Acceptance.**
  - [ ] Shots of both tile states and the tip at both sizes.
  - [ ] Golden diff limited to the icon references.
  - [ ] Every file has a provenance row.
- **Files.** `src/assets/icons/*` (the crops and `quest_district`), `src/packs/aion2/cards/nextup-kinds.js`,
  `src/styles/cards/nextup.css`, the extract tip data, and `docs/ISSUES.md`.
- **Lanes:** golden, nextup.css. **Model:** Sonnet, M (80 min).
- **After:** `owner-ok-0.8-crop-icons`.

## P14: Key setup and macro steps match the game (#387)

- **Spec.** The issue #387 body and its comments, plus Game Data Check's `research-387-macro` answers. Default keys follow
  the game:
  - the stack on T;
  - Shadowstrike on E;
  - the macro on right click, with the steps starting at Add Macro.
  The Rotation and the macro stay separate.
- **Result.**
  - The Build pop-out's grid and steps match the owner's Lv 4 screens.
  - Game facts move from `src/` to `data/`.
- **No-gos.**
  - No player-chosen keys (#388, 0.9).
  - No change to the Ranger and Gladiator default keys from 0.7 P11.
- **Acceptance.**
  - [ ] The grid shows the columns Q, E, the mouse slot and T at both sizes (shots).
  - [ ] The steps text matches the claims in `claims.json`.
  - [ ] gen and golden are green.
- **Files.** `src/packs/aion2/cards/build.html`, `src/packs/aion2/requirements.js` (rotKeys), `src/packs/aion2/cards/rows.js`,
  the Assassin `builds.json` `keyStacks`, `claims.json`, and the a11y and golden tests.
- **Lanes:** build-card, a11y. **Model:** Opus, M (80 min).
- **After:** `research-387-macro`.

## P15: Auto level-up uses the level at turn-in (#401)

- **Spec.** #401, planner's option (a): a story quest stores the level it is turned in at (for example
  `levelsUp: { from: 3 }`), sourced from the owner's notes. A quest without a sourced from-level doesn't auto-level.
  This keeps to DECISIONS `owner-ok-autolevel` (verified 100% EXP quests only, undoable).
- **Acceptance.**
  - [ ] Shadow Forest ticked at Lv 3 goes to Lv 4. Undo goes back to Lv 3.
  - [ ] A quest with no from-level never changes the level (core test).
  - [ ] Schema and gen are green.
- **Files.** `data/schema/quests` (levelsUp), the story quest records, the auto-level rule in `src/core/**`,
  `tests/core`.
- **Lanes:** golden. **Model:** Opus, M (80 min).
- **After:** `research-401-levels` (Game Data Check records the owner's level notes).

## R: Release 0.8.0

- **What it does.** Version bump and the CHANGELOG section, as `docs/plans/0.7/R-release-0.7.0.md` did.
- **K17.** The CHANGELOG draft is up before `PRE-RELEASE CHECK 0.8.0`. Game Data Check reads it against `docs/ISSUES.md`
  and the live build.
- **Lanes:** release, alone. **Model:** Sonnet, S (44 min).
- **After:** every item above, or moved to 0.8.x; `DATA OK 0.8.0`.
