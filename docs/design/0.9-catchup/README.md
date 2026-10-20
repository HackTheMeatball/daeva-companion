# 0.9: respec on every card, catch-up for late starts

Isaac's Lv 39 play-test notes, 2026-10-20 (project files, `release/owner-notes-2026-10-20-lv39.txt`; triage notes 9 and 10; UX audit
`plan-0.9/audit-ux.md` items 1 and 3–8). Isaac tested a fresh Lv 39 Assassin. Key setup (notes 11, 12 and #388) is in
`docs/design/0.9-keys/`. Design Lead (Jane) mockups: docs and screenshots only. Every frame is today's build with the mockup
injected, so the page, data and icons are real.

- Frames: `*.png` here, from `cases.mjs` (`npm run build && node tests/support/shots.mjs docs/design/0.9-catchup
  --after-only`), quantized to 256 colours. The acts and the mock CSS are shared in `common.mjs`. Widths are 1500 and 390,
  plus 360 where a row gains a button or a count.
- Today's look, for comparison: `design-review/0.9-loadout-baseline/` in the project files (main `ef0bb3a`, same saves).
- Review: Holly (Design Review) and a fresh outside critic reviewed `6347ae3`. Their items are answered below. Under the
  owner's 2026-10-20 hand-off, the look OK is mine after both reviews. A disputed removal follows the charter tie-break:
  it stays removed only if an outside reviewer with no history on that look agrees.

| Note | What | Pick | Size |
|---|---|---|---|
| 9 | Respec on Stigmas; Daevanion respec per board and all | A: Respec in every card's foot, a board menu on Daevanion, "Click again" kept plus Undo on all three | M |
| 10 | Catch-up for late starts, per skill | Today's Skills card, with each skill's whole jump as one step; one Next up card per skill | M |

## 9. Respec on every card

Today Skills and Daevanion have a Respec button that needs a second click within 3 s and can't be undone. Stigmas have
no Respec. Daevanion's clears every board.

**Option A, picked** (`09-dv-menu-*`): Daevanion's foot button reads "Respec ▾" and opens a short menu. It has one row per
open board, with how many nodes it would untick, then a divider and "All boards". A board with nothing ticked is greyed
out ("none yet"), and a board that isn't open isn't listed. With nothing ticked anywhere, the button is greyed with "Nothing
to respec yet" (`09-dv-none-*`).
- All three cards keep one foot row: the folds on the left, Respec at the right end. "How points work" and "How shards work"
  become a round "i" button with that name, so the row fits at 1500, where each card is 228 px wide inside.
- Every respec keeps today's second click ("Click again to respec", 3 s), and then shows a toast with Undo, on all three
  cards: "Nezekan reset · 10 nodes back · Undo"
  (`09-dv-undo-*`), "Stigmas reset · 18 shards back · Undo" (`09-st-undo-*`), "Skills reset · 164 pts back · Undo"
  (`09-sp-undo-*`). Undo matches the owner's "undoable" rule for anything that changes progress. The second click stays
  because Undo lives only while the toast is up (about 5 s, one shared slot, not saved), and a Daevanion respec also
  clears the node costs you typed from the game (outside tie-break review, below).

**Option B** (`09-dv-perboard-*`): a Respec chip on each board's line in All nodes, with "Respec all boards" in the foot.
Not picked: the per-board control is hidden until you open All nodes, the longest list in the app, and it adds a second
control style.

**Stigmas** (`09-st-respec-*`): a plain Respec at the right end of the foot. It sets every stigma back to Lv 1, keeps them
equipped and returns the shards. In the seed save that's Triniel's Dagger Lv 10 (14 shards) and Illusive Clone Lv 5 (4).

**Basic** (`09-*-basic-390`): each card's foot stays, with Respec (and Sync levels, Slots). This was the first half of note 9.
It stands only if Basic stays; see "Depends on" below.

**Cost:** no new height; the menu is a popover with the light `--shadow-float`. Build work is one shared foot control and
the Undo toast, which exists for rewards (`rewardToast`). No new save field.

**Data (Game Data Check, `docs/research/2026-10-respec.md`, #614):**
- D1. A stigma reset refunds the shards (Metabot) and costs Kinah, and the Global price is unknown. No source says that
  unequipping resets levels (inferred: it doesn't). So the Stigmas Respec tooltip says "Costs Kinah in game; check the
  price there", and the slots stay ticked.
- D2. In game, Daevanion nodes come off one at a time, each for its point, for Kinah. No source names a per-board or
  whole-board reset. The menu still fits, because it fixes the app's record, and each row's tooltip says "In the app.
  In game, remove the nodes one by one." The owner checks three screens (both prices, and whether the board has a
  reset-all).

## 10. Catch-up for late starts

Isaac: at Lv 39 the app "steps me through leveling up skills in the same order i would have unlocked them in game … rather
than just saying 'level this skill from 1-x, pick x,y,z specialty' then moving to the next skill". Today that's 77
one-level steps.

**Numbers are measured.** I bought every open upgrade in today's build for fresh saves at Lv 27, 39 and 45. At Lv 39 the
guide's own spend ends with 7 skills at 10 and Insignia Explosion at 9, with 1 point left. Insignia Explosion falls short
because it is learned later, and the build buys by unlock level, so its lines come last. Specialty picks are from
`builds.json`; the Ambush pick is "contested" (`docs/research/2026-10-specialty-picks.md`), so its row keeps that
label when built.

**When it shows:** when your points cover upgrades on 3 or more skills at once: a late start, the state after a Skills
respec, or a long break. Otherwise today's one-step hero stays.
- The threshold is my inference. **Test:** count how often a level-by-level player hits 3 or more at once, from the
  Lv 1–45 journey suite. If it ever happens on a normal path, raise it.

**Skills card** (`10-skills-start-*`, `10-skills-mid-*`): today's card, unchanged in shape. The hero is the next skill's
whole jump instead of one level.
- The hero shows "Heart Gore ACTIVE 1 → 10", "Available now · priority #1 · catch up 1 of 8", the bar "21 of 21 pts" and the
  button "Mark spent · 21 pts". It ticks that skill's lines to its level and its slot 1 specialty.
- Under it: "Then pick its specialty: …", then "+7 more your points cover · Mark all spent" for a player who already set
  everything in game. A shortfall is named where it lands: "Insignia Explosion stops at 9 for now … Lv 10 needs 3 more pts.
  1 pt is left over after these."
- Coming up lists the other jumps ("Insignia Explosion ACTIVE 1 → 9 · now ✓") with today's "N of 141 spent" bar, and
  scrolls inside the card as today.
- After the last one (`10-skills-done-*`) the card is simply today's hero again.
- Other levels: `10-skills-lv27-390` (96 pts, 8 skills at 4–9), `10-skills-lv45-390` (203 pts, 10 skills). Another class:
  `10-skills-ranger-*`, where specialties have no sourced pick yet ("Specialty slot 1 opens · no sourced pick yet").

**Daevanion** (`10-boards-*`): one row per open board, with its plan nodes and crystals ("Nezekan board · 10 nodes · 52
crystals · Have them"). Triniel is listed, greyed: "Opens at Lv 40". The crystal counts come from #602. Isaac's Zikel
screen reads "Total: 42" against 47 here, so that one is with Game Data Check before the build. **Stigmas** (`10-stigmas-*`): the four slots in the
same row pattern, with "Have it" and their plan levels. Each button's name says which row it marks ("Have them: Zikel
board").

**The 1500 row** (`10-row-1500`): all three cards in catch-up together. The Skills card sets the row's height, Daevanion
and Stigmas fill it, and the three foot rows line up.

**Next up, option A, picked** (`10-nextup-a-*`): one card per skill, in the list's order. It keeps its level band (LV
37–39), so it still looks like a milestone card. Title "Catch up: level Heart Gore 1 → 10", then "21 pts · then pick the
specialty …", and Mark spent. This is what Isaac described.

**Next up, option B** (`10-nextup-b-*`): one card for the whole catch-up ("Catch up 8 skills · 164 of your 165 pts · Heart
Gore first", Show in Skills). Not picked: Next up stops naming the next action, which is its job.

**Folded chores** (`10-nextup-fold-*`, UX audit 8): the four Missed chores from more than 10 levels back (Lv 4–16) fold into
one card, "4 early steps you have probably done", with Review and All done.

**Cost:** no new card height: the Skills card keeps its shape, and the hero and Coming up only change what they count.
Build work is a jump step in the Skills hero, a catch-up kind in Next up, and two row lists. No save field: a jump is done
when its lines are ticked.

**Out of scope, but it touches this:** slot 2 specialties (0.8.1 notes 5 and 6). Once they land, a jump whose board nodes
take the skill to 12 adds "· slot 2: …" to its line.

## Depends on

- **Basic vs Advanced.** On 2026-10-20 the owner asked whether two views need to exist at all. That decision is being
  made now, with outside review. If there's one view, the Basic frames here go, and so does Basic-only build work.
- **Faction and class themes** (1.0): the accent in these frames will follow the character's faction and class.

## Removed against today (charter tie-break)

| What | Status |
|---|---|
| Skills hero, its ACTIVE chip, "priority #1", "Mark spent", "+N more your points cover", Coming up and "N of 141 spent" in catch-up (Holly 2, 3; critic 2) | Brought back: catch-up now uses today's hero |
| Next up's level band in catch-up (critic 3) | Brought back |
| Daevanion's and Stigmas' heroes (next node, next stigma level) while their catch-up is open (Holly re-review) | Brought back after the catch-up: once the last "Have them" / "Have it" is marked, each card returns to today's hero, as Skills does (`10-skills-done-*`). During the catch-up the list is the card's next step. These two catch-up looks and the folded chores are new since the critic's pass, so they get one fresh look (K24) before the build |
| "How points work" / "How shards work" labels | Kept, as the name and tooltip of the "i" button |
| The two-step "Click again to respec" (critic 7) | Brought back, with Undo added. A fresh outside reviewer said bring back: the Undo toast lasts about 5 s, isn't saved, and sits a card away from the button on a phone, while a Daevanion respec also clears typed node costs. Undo alone would do only if it were kept in the save until the next change. |

## Review answers

**Holly** (`design-review/review-0.9-loadout-holly.md`), items 1–16. The key-sheet items are answered in
`docs/design/0.9-keys/README.md`.

| # | Answer |
|---|---|
| 2, 3 | Fixed: catch-up keeps the hero chips, priority and the points bar |
| 7 | Fixed: Basic frames for all three feet (`09-*-basic-390`) |
| 8 | Fixed: no dead band; the card keeps today's shape (the old view left `fitSkills`' min-height) |
| 9 | Fixed: `10-row-1500` |
| 10 | Fixed: Basic catch-up frames and the hand-back (`10-skills-done-*`) |
| 11 | Fixed: "Mark spent", "Have them", "Have it"; Next up "Mark spent" |
| 12 | Fixed: one foot row on all three cards (the "i" button) |
| 14 | Fixed: "Nezekan reset · 10 nodes back · Undo" |
| 15 | No data issue: specialty slot 1 opens at skill Lv 8 (`rule:specialty-slots`), so a pick at 9 is open |
| 16 | F1 is with Walter as a 0.8.1 candidate |

**Fresh critic** (`design-review/fresh-review-0.9-loadout.md`), items 1–24, B1–B3 and the checklist. Items 4–6, 8–10 and
16–20 are about Key setup, in `docs/design/0.9-keys/README.md`.

| # | Answer |
|---|---|
| 1 | Fixed: Basic keeps each foot with Respec (`09-sp-respec-basic-390`, `09-dv-menu-basic-390`, `09-st-respec-basic-390`) |
| 2 | Fixed: see "Removed against today" |
| 3 | Fixed: the band stays |
| 7 | Fixed: the three respec the same way, the second click plus Undo (tie-break, see the table) |
| 11 | Fixed: no dead space |
| 12 | Fixed: one row |
| 13 | Fixed: the frame hides rows past two per board and boards past three, as meant; the board name keeps a min width so it doesn't break per word |
| 14 | Fixed: one toast pattern, "<what> reset · <what came back> · Undo" |
| 15 | Fixed: "Respec ▾" with "All boards" (A); "Respec all boards" (B) |
| 21 | Answered: the build buys by unlock level, so Insignia Explosion (learned later) takes the shortfall; the hint says so (test run at Lv 27, 39 and 45 in the build) |
| 22 | Fixed: option B's title no longer repeats a band; buttons are actions |
| 23 | Inferred, not proven: the halo is the menu's `--shadow-toast` falling on the board art. The menu now uses `--shadow-float` (item 24). Test: compare the board art in `09-dv-menu-1500` with `09-dv-none-1500`, which has no menu |
| 24 | Fixed: `--shadow-float` |
| B1, B2 | For Holly's brief template, not the design |
| B3 | Fixed: Lv 27 and Lv 45 frames, 360 frames for the menu and the board chip |
| Checklist | Names: each row button names its row; the ✓ is "Marked". Tap targets: Mark all spent, N more and the board chip are 24 px tall. Text: nothing under 11 px. Missing states drawn: Basic, nothing to respec, Lv 27 / 45, catch-up done. Not drawn: the Undo toast timing out (it leaves, and the respec stays); focus rings (the build's own `:focus-visible` applies; checked in the build PR). Saved progress: no new field. |
