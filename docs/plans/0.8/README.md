# 0.8 item specs

Planned in the 0.8 planning pass. Release Planner wrote it on 2026-10-19, and redrew it at 8:30 PM ET when the owner
chose all four remaining classes (P16–P19) and the label item P20 joined. The plan, waves and owner input are in
ROADMAP "0.8"; the Kaizen review it follows is docs/kaizen/0.7-scorecard.md.

Each item below becomes an issue titled `0.8 P<n>: …`, carrying this spec and its `After:` line. The planner adds the
issue's `- [next]` line and its #114 line only after the owner's go (`owner-ok-0.8-go`: given 2026-10-19 8:55 PM ET, effective when this plan merges). Until
then, nothing here is queued.

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
- **Result.** Each record points at its Metabot icon. Game Data Check saved all 29 files in `research-gl-sm-icons`
  (PR #444): `docs/research/icons-2026-10-19/` as `sk-`/`st-<slug>.png`, 128 px, named like the Ranger's, with no
  collisions. Their provenance rows are already in the ISSUES.md "initials for now" tables. P1 moves the 29 to
  `src/assets/icons/`, sets each record's `icon`, and changes both ISSUES.md bullets from "initials for now" to "in
  the site".
- **No-gos.**
  - No fetching.
  - No icon without a provenance row.
  - No layout change.
- **Acceptance.**
  - [ ] No letter square in a Gladiator or Spiritmaster build at Lv 1, 30 and 45 (shots, both sizes).
  - [ ] Every new `src/assets/icons` file has an ISSUES.md row.
  - [ ] gen and golden are green, with the golden diff limited to icon references.
- **Files.** `src/assets/icons/` (the 29, moved), the icon fields in
  `data/packs/aion2/classes/{gladiator,spiritmaster}/{skills,stigmas}.json`, and `docs/ISSUES.md`.
- **Lanes:** gen, golden. **Model:** Sonnet, S (44 min).
- **After:** `research-gl-sm-icons`.

## P2: Templar class data (hidden)

- **Model.** Follow 0.7 P3 (docs/plans/0.7/P3-second-class-data.md), the same shape for the Templar.
- **Input.** Read `docs/research/2026-10-templar-pack.md` and the owner's Templar key screens
  (`docs/plans/0.8/inputs/owner-keys/templar.md`).
- **Result.**
  - `data/packs/aion2/classes/templar/**`, each field with its source;
  - `sources.json` updated;
  - icons as research saved them (`data/packs/aion2/asmodian/templar/icons/`, named `sk-templar-*`, with ISSUES.md
    rows; P3 moves the ones the guide shows to `src/assets/icons/`).
  The class is not offered yet.
- **Watch.** Metabot's page text prints some "Absorbs N% HP" specialties as "Absorbs 100, 100% HP" when the game says
  1% (research §5). Write the game text. gen already fails on any "N, N%" specialty (`checks.mjs`, #358), and the
  live Gladiator and Spiritmaster data carry the game text.
- **Passive icons and levels.** Metabot's passive icon files don't match the owner's screens for some passives (Game
  Data Check compared them, `docs/plans/0.8/inputs/passive-icons-templar-cleric-2026-10-20.md`). Use that
  file, not Metabot's file names: a passive whose art matches the screen gets that art (Templar Lv 15 Impact Hit is the
  Assassin's `13760000`, already shipped); a passive with no matching file gets no icon, an ISSUES.md row for the owner,
  and `fieldStatus` "owner-check" on its icon until the owner's tooltip screenshots name it. P4, P16 and P18 do the same
  for their class (Badger found the same mix-up on five Chanter passives).
- **Acceptance.**
  - [ ] gen is green, and record counts match the research CSVs.
  - [ ] Every passive icon matches the owner-screen comparison, or is listed in ISSUES.md as owner-check.
  - [ ] Golden and equiv are unchanged. No visible change.
- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** `research-templar`.

## P3: Templar guide pack and picker

- **Model.** Follow 0.7 P4 (docs/plans/0.7/P4-second-class-guide.md).
- **Input.** The owner's key screen for the class, `docs/plans/0.8/inputs/owner-keys/<class>.md` (P5, P17 and P19 use
  theirs), and the passive-icon comparison in `docs/plans/0.8/inputs/`. Builds can't read the shared folder: every input
  is in the repo (`docs/plans/0.8/inputs/README.md`).
- **Result.**
  - `data/packs/aion2/asmodian/templar/**`: build steps, stigma picks and key setup from the owner's screens;
  - a golden master;
  - the class offered in the site picker;
  - its skill and stigma icons shown.
- **Acceptance.**
  - [ ] The Templar route runs from Lv 1 to 45 with no other class's skills in it (golden).
  - [ ] No letter square appears (shots), except for a passive ISSUES.md lists as owner-check.
  - [ ] ISSUES.md lists what is still missing.
- **Lanes:** gen, golden. **Model:** Opus, L (120 min).
- **After:** P2.

## P4: Cleric class data (hidden)

The same as P2, for the Cleric. It reads `docs/research/2026-10-cleric-pack.md`. Six Cleric passives (Lv 11, 13, 15,
17, 23, 25) don't match the screens, which may mean the CSV maps passives to the wrong levels, so their learn levels
also get `fieldStatus` "owner-check" until the owner's tooltip screenshots settle it (Game Data Check, 2026-10-20).

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
- **Result.** The two read differently. The grey button says what it does, "Skip, start fresh" (chosen by the Design
  Lead in the shot review).
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

- **Problem.** On phones the place icon floats mid-card with empty space above and below it (#421), and the owner asked
  to balance the card and cut the empty space (2026-10-19 2:39 PM ET).
- **Result.** Design Lead's round 2, `docs/plans/0.8/inputs/design-v2/README.md` §1 option A and its "Owner answers" (`1c-icon-balance.png`), owner A
  2026-10-19 2:39 PM ET:
  - on phones (≤ 520 px) the 44 px icon box sits beside the title in the title row (`.ns-mhead`
    `grid-template-columns: 44px 1fr`; the README has the CSS sketch);
  - the location and progress lines run the card's full width under it;
  - Show moves into the title row, so the card is about 30 % shorter (the board's measurements);
  - desktop is unchanged (the card is already one line).
- **No-gos.** No change to the icon size (P11 owns it), the card's content or its order on desktop.
- **Acceptance.**
  - [ ] Shots of the Stronghold and Sealed Dungeon cards at 390 px match `1c-icon-balance.png`; the 1500 px shots are
        unchanged.
  - [ ] Before and after shots at 360 and 390 px, in Basic and Advanced, with the card's third detail line ("+2 crystals
        … · ~5 min · … m away"); the "about 30 % shorter" figure re-measured from them (Design Critic 11, Design Lead).
  - [ ] Show stays a 44 px target and keeps its accessible name (a11y suite).
  - [ ] Golden is unchanged.
- **Files.** `src/styles/cards/nextup.css`, and the Next up card markup only if Show can't move with CSS alone
  (`src/packs/aion2/cards/nextup-kinds.js`).
- **Lanes:** nextup.css. **Model:** Sonnet, S (44 min).
- **After:** `owner-ok-0.8-icon-fit` (met), `owner-ok-0.8-icon-box`.

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
- **Result.** Design Lead's round 2, `docs/plans/0.8/inputs/design-v2/README.md` §3 option A, owner A 2026-10-19 2:35 PM ET:
  - "Your class" on the welcome's first step, above the buttons: 8 badges, each the class emblem plus its name,
    4 × 2 on phones and one row of 8 on desktop, a `radiogroup`, Assassin pre-selected;
  - classes with no guide yet show "Soon" and can't be picked (the list comes from the packs, not hard-coded; with all
    four classes in 0.8, "Soon" shows only for a class whose guide hasn't merged yet when P12 builds or that moved to
    0.8.x);
  - the selected class is marked by its highlight only, no check mark (owner, 2026-10-19 8:28 PM ET, T-58);
  - the pick carries into Start and into the join form, with no extra screen;
  - the muted hint points to the name button for more characters.
  An Assassin player still makes one tap.
- **Art.** The 8 Metabot class emblems, `https://metabot.gg/web/aion2/classes/<class>.webp`, listed on
  https://metabot.gg/en/aion-2/classes; the owner's class answer is their OK (DECISIONS 2026-10-19). Fetched at plan
  time by Design Lead; the build commits them as files and adds one `docs/ISSUES.md` row each (source page, file URL,
  date). A bot build doesn't fetch and can't read the shared folder: the emblems go in `docs/plans/0.8/inputs/emblems/`
  first, and if they aren't there the build stops and asks.
- **No-gos.**
  - No save shape change: the class is already a character field.
  - No new step for the Assassin default.
  - No other new art.
- **Acceptance.**
  - [ ] A first visit can start as each class that has a guide; a "Soon" class can't be picked (site test).
  - [ ] Assassin start clicks are unchanged.
  - [ ] Arrow keys move through the radiogroup and skip "Soon" classes (a11y suite).
  - [ ] Shots at both sizes, in Basic, matching `3-class-picker.png` option A, plus 360 px: 4 × 2 badges with
        "Spiritmaster" fitting its badge, not cut off.
  - [ ] "Soon" text is at least 12 px and 4.5:1 against the badge (Design Critic 4).
  - [ ] Every emblem file has a provenance row.
- **Files.** `src/cards/welcome.html`, `src/cards/welcome.js`, `src/styles` welcome rules, `src/assets/icons/*` (the
  emblems), `docs/ISSUES.md`, `tests/site.js`, and `tests/a11y.js`.
- **Lanes:** welcome, a11y. **Model:** Sonnet, M (80 min).
- **After:** `owner-ok-0.8-welcome-class`.

## P13: Regional quest state icons, marking button and the extract flask

- **Problem.** The Next up "Regional quests" card and the extract tip don't show the game's icons. A regional quest is
  marked by clicking its checkbox twice: the first click shows a "−" box (the mixed checkbox state) and nothing says a
  second click exists.
- **Result.** Design Lead's round 2, `docs/plans/0.8/inputs/design-v2/README.md` §2 option A and
  §4, with its "Owner answers" (`2b-check-fix.png`, `2c-map-pin.png`), owner A 2026-10-19 2:36–2:40 PM ET:
  - the state icon replaces the regional quest checkbox, in milestone rows and in the Next up card: the owner's teal
    star crop (`docs/research/owner-crops-2026-10-18/regional-available-owner-crop.png`) for to pick up, Metabot's `quest_district` for in progress, and a green check for turned in, drawn as a 22 px
    circle with a centred SVG check (never a ✓ text glyph);
  - one button says the next step as a verb: "Pick up" (neutral outline), then "Turn in" (filled green, the old
    `.go` style), then "Undo" (a neutral button); all three the same width in a fixed action column (owner,
    2026-10-19 8:25 PM ET, T-58; `docs/plans/0.8/inputs/design-v4/`, which supersedes v2 for these
    buttons);
  - the Regional quests tile in Next up shows today's ❖ glyph in white on a #3ba281 tile with a border of the same
    colour and no dark panel (owner, 8:44 PM ET, option A, T-58; frames `nu-390-quad.png`, `nu-360-quad.png` and
    `2-card-tile-board-v4.png` in the v4 folder); the ❖ stays a glyph, not new game art;
  - a one-line legend under "Regional quests" teaches the three icons (15 px check);
  - in the Next up card every quest row also shows its map pin left of the button, and a long name is cut with "…";
  - "Not in game yet" / "In my game" stay as they are;
  - the extract flask (`docs/research/owner-crops-2026-10-18/extract-flask-owner-crop.png`; placement in
    `docs/plans/0.8/inputs/design-extract/4-extract-icon.png`) sits inline at 1.25 em before "beaker icon" in step 3 of the extract tip (first round, unchanged).
  Each art file gets an ISSUES.md provenance row: the owner screen for the crop, the source page and file URL for
  `quest_district`.
- **No-gos.**
  - No save change: the same `started` / `checks` data drives it (`aion2QuestSync` in `rows.js`).
  - Dungeon rows keep their own control: they share the click-twice comment in `rows.js`, not this change.
  - No campsite or point-of-interest markers. They are held until places carry a kind.
  - No other new art.
- **Acceptance.**
  - [ ] Each state is reachable from each state's button and Undo returns to the previous one; saves are byte-identical
        to the checkbox flow for the same steps (save or e2 suite).
  - [ ] The button's accessible name says the next step; the icons have text alternatives (a11y suite).
  - [ ] Shots of all three states in a milestone row and in the Next up card, and the tip, at 1500 and 390 px, matching
        the boards; a long name is cut with "…" at 390 px.
  - [ ] The check, the in-progress diamond and the to-pick-up star share one centre line in the list (owner, 8:25 PM
        ET; they were up to 7 px off in the v2 mock).
  - [ ] A fixed button column and a fixed pin column (32 px desktop, 36 px phone), so left edges line up; a cut name
        keeps the full name in `title` and in the accessible name (Design Critic 3, Design Lead).
  - [ ] The in-progress marker reads at 1× on a phone; if its body doesn't, it sits on a 1 px `--c-line` disc
        (Design Critic 8). 360 px shots added (Design Critic 6).
  - [ ] Golden diff limited to the icon references.
  - [ ] Every file has a provenance row.
- **Files.** `src/assets/icons/*` (the crop and `quest_district`), `src/packs/aion2/cards/rows.js`,
  `src/packs/aion2/cards/areas.js`, `src/styles/packs/aion2/areas.css`, `src/packs/aion2/cards/nextup-kinds.js`,
  `src/styles/cards/nextup.css`, the extract tip data, `docs/ISSUES.md`, and the tests that click the regional checkbox.
- **Lanes:** gen, golden, nextup.css, rows (the extract tip data and a new source URL regenerate `DATA_SOURCES.md`).
  **Model:** Opus, L (120 min): #114 routes L items to Opus.
- **After:** `owner-ok-0.8-crop-icons`.

## P14: Key setup and macro steps match the game (#387)

- **Spec.** The issue #387 body and its comments, plus Game Data Check's `research-387-macro` answers. Default keys follow
  the game:
  - the stack on T;
  - Shadowstrike on 1 (re-spec 2026-10-20 from the owner's Lv 4 key window; `docs/research/2026-10-research-387-macro.md` wins; built in #565);
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
- **Lanes:** gen, golden, build-card, a11y, rows (after P13). **Model:** Opus, M (80 min).
- **After:** `research-387-macro`. Game Data Check found (c) and (d) need the owner's game (her #387 comment). Her one
  new point on (d): the default K windows for the Ranger, Gladiator and Templar each put a stack on both Q and E, so the
  owner's grid, with Shadowstrike alone on E, may be his own layout. P14 stays in 0.8 only if his two checks come in
  before its wave; otherwise it moves to 0.8.x.

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
- **Lanes:** gen, golden. **Model:** Opus, M (80 min).
- **After:** `research-401-levels` (Game Data Check records the owner's level notes).

## P16: Sorcerer class data (hidden)

The same as P2, for the Sorcerer. It reads `docs/research/2026-10-sorcerer-pack.md` and the owner's checked Sorcerer
screen (`docs/plans/0.8/inputs/owner-keys/sorcerer.md`: unlock levels, icon ids, default keys).
Write the game text for the five "Absorbs" specialty rows, not the CSV's Metabot text (pack §5; #487 review).

- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** `research-sorcerer`.

## P17: Sorcerer guide pack and picker

The same as P3, for the Sorcerer. It runs after P5 because both edit `pack.js`.
The default build is Metabot's leveling build (203 points). Labels from the pack and its review (#487): Wish of
Concentration's target (7 vs 10) and the stigma slot order and fourth stigma (Delayed Explosion vs Steel Barrier) are
"disputed"; the 16 Sep Fire Mark change stays "inferred"; Fire Mark's Lv 10 target is "single source"; the §4.6
rotation is two-source through Metabot. Hellfire's key step says to hold the key to charge (pack §4.6; a macro fires it at
charge 1).

- **Lanes:** gen, golden. **Model:** Opus, L (120 min).
- **After:** P16, P5.

## P18: Chanter class data (hidden)

The same as P2, for the Chanter. It reads `docs/research/2026-10-chanter-pack.md` and
`docs/plans/0.8/inputs/owner-keys/chanter.md`. Wave Blow sits in Q row 1 although it is conditional
(needs Stun), unlike every other class; keep the screen's order and label it as the notes say.

- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** `research-chanter`.

## P19: Chanter guide pack and picker

The same as P3, for the Chanter. Metabot has no Chanter build sample, so advice with one source is labelled as
`claims.json` decides, never presented as verified.

- **Lanes:** gen, golden. **Model:** Opus, L (120 min).
- **After:** P18, P17.

## P20: Unverified values carry their label

- **Problem.** The compiler (`tools/gen/gen.mjs`) drops each record's `fieldStatus`, so a disputed, owner-check or
  inferred value shows in the app with no label. CLAUDE.md requires unverified data to be left out or labelled (Game
  Data Check, #472 review; 3 regional quest zones are disputed today).
- **Result.**
  - gen carries `fieldStatus` (and record-level status) for the fields players see: quest `zone`, `giver.zone` and
    `turnin.zone`; Sealed Dungeon `entrance` and `xp`; stronghold `levelRange`; a skill's learn level in the
    Skills card (P4 marks six Cleric passives owner-check);
  - where such a field renders (milestone rows, Next up), a small tag follows it in the existing `ss-tag` style:
    "check in game" for disputed and owner-check, "inferred" for inferred; single source keeps its current tag;
  - the tag's text is at least 12 px (Design Critic checklist), which also lifts the existing `ss-tag`.
- **Input.** The labels in `data/packs/**` themselves (every record `fieldStatus` and record `status`); Game Data Check's
  2026-10-19 count was 448, most never render.
- **No-gos.** Guide-text claims are out of scope (already tagged from `claims.json`). No pinned counts: #325 batches keep
  changing them. No new art.
- **Acceptance.**
  - [ ] A test reads the labels from the data and checks each rendered disputed / owner-check / inferred field shows its
        tag, and no verified field does.
  - [ ] Shots of a disputed regional quest zone in a milestone row and in Next up, at 1500 and 390 px.
  - [ ] Golden diff limited to the tags.
- **Files.** `tools/gen/gen.mjs`, `src/packs/aion2/cards/rows.js`, `src/packs/aion2/cards/nextup-kinds.js`,
  `src/packs/aion2/cards/skills.js`, `src/styles/cards/nextup.css`, `src/styles/packs/aion2/areas.css`,
  `src/styles/packs/aion2/skills.css`, the tests. `ss-tag` lives in `nextup.css` today; P20 moves it to a style the rows
  and the Skills card share.
- **Lanes:** gen, golden, nextup.css, rows. **Model:** Opus, S (44 min). Opus because it edits `tools/gen` and
  re-records golden (routing rule; the Sonnet start stopped with "Needs @claude (Opus)" on 2026-10-20).
- **After:** P19 (gen lane order).

## R: Release 0.8.0

- **What it does.** Version bump and the CHANGELOG section, as `docs/plans/0.7/R-release-0.7.0.md` did.
- **K17.** The CHANGELOG draft is up before `PRE-RELEASE CHECK 0.8.0`. Game Data Check reads it against `docs/ISSUES.md`
  and the live build.
- **Lanes:** release, alone. **Model:** Sonnet, S (44 min).
- **After:** every item above, or moved to 0.8.x; `RC PLAY DONE 0.8` read; `DATA OK 0.8.0`.
