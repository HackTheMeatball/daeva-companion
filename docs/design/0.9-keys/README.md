# 0.9: Key setup with room, your own keys, icons that fill the boxes

Isaac's Lv 39 play-test notes, 2026-10-20 (triage notes 11 and 12), with #388 (players set their own keys). Design Lead
(Jane) mockups: docs and screenshots only. Respec and catch-up (notes 9 and 10) are in `docs/design/0.9-catchup/`, which
also holds the shared `common.mjs`.

- Frames: `*.png` here, from `cases.mjs` (`npm run build && node tests/support/shots.mjs docs/design/0.9-keys
  --after-only`), quantized to 256 colours. Widths are 1500 and 390, plus 360 for the filled grid. The Assassin has the
  guide's suggested grid. The Gladiator (`12-sheet-gladiator-*`) shows a class with only the game's default keys.
- Review: Holly and the fresh critic, answered below. The look OK is mine after both reviews.

| Note | What | Pick | Size |
|---|---|---|---|
| 11 | Key setup with room to read | Desktop: a wide panel in the drawer's place. Phone: it stays a fold in the Build drawer | M |
| #388 | Players set their own keys | Key chips are buttons: press a key (desktop) or pick one (phone) | M |
| 12 | Icons fill each key box, the name in a tooltip | As drawn | S |

## 11. Key setup with room

Today Key setup is a fold at the bottom of the Build drawer. On desktop that's a 320 px column, so the grid's boxes are
small and the macro steps run long. Isaac asked whether it should pop up from the bottom on desktop.

**Desktop, picked** (`11-sheet-names-1500`, `12-sheet-fill-1500`): Key setup opens where the drawer sits, wider (up to 820
px, 60% of the window), with no dimming. The page beside it stays readable, as with the drawer today.
- Left: the grid with the key chips under it, the left-click line and "Coming to E".
- Right: "Set the macro once" (the three steps), Game default keys and the row-order note.
- The header is "Key setup · Lv 39" with a close button; Esc closes it. The drawer's Key setup fold becomes a "Key setup ↑"
  button.
- The sheet scrolls inside itself (`12-sheet-end-390` shows the end).

**Phone, option B, picked** (`11-drawer-b-390`): no second sheet. The Build drawer is already a bottom sheet on a phone, so
Key setup stays a fold in it, with the filled boxes. The Level up bar and the tab bar stay in view, as today.

**Phone, option A** (`*-390` sheet frames): a sheet that rises above the tab bar, over the drawer. Not picked: a sheet on a
sheet, and it covers the Level up bar (fresh critic 4).

**Cost:** desktop, one panel component, the first in the app. Phone, CSS only.

## #388. Your own keys

Each key chip under a column is a button with a small caret.
- **Desktop** (`388-key-listen-1500`): clicking a chip changes it to "Press a key", with "Press the key you use for this
  stack in game. Esc cancels." under the grid. The next key pressed becomes that column's key.
- **Phone** (`388-key-listen-390`): tapping a chip opens a picker of the keys AION 2 lets you bind (D3). Keys another stack
  of yours holds are marked with that stack ("Q · Shadowstrike", "T · right click"). Picking one of those swaps the two.
- **A clash** (`388-key-clash-*`): giving a column a key another column holds says "T already holds the right-click
  stack." with "Swap them" and "Pick another".
- **After** (`388-key-mine-*`): your keys get an accent edge, and "Back to suggested keys" appears. Every line that names a
  key follows: the suggestion line ("Your keys: E, R and T …"), "Coming to R", "R, row 0 (fires first)", the Rotation lines
  and the Next up hint chips.
- The guide's own keys already replace some of the game's defaults (E is Storm Rampage by default), which is why the line
  keeps "Move the skills there yourself."
- **Basic** (`12-sheet-basic-*`): the suggested keys, with no carets and no rebinding, as #388 says. This stands only if
  Basic stays (see "Depends on").

**Cost:** one save field (`keys`: column → key, defaulting to the suggestion). Adding a field with a default needs no key
bump before 1.0.

**Data (Game Data Check, `docs/research/2026-10-bindable-keys.md`, #614):** D3 answered, and it changes the picker.
- A key binds a skill slot, not a skill. Each slot holds up to 4 skills (rows 0–3). Defaults: slots 1–2 on left and right
  click (or R and T), 3–6 on 1–4, 7–8 on Q and E, and the stigma slots 9–12 on 5–8. The macro has no key by default.
- Any keyboard key or mouse button can be bound. Mouse buttons don't work for skills or the macro in AION 1 control mode.
- So on desktop "press a key" stays as drawn. On a phone the picker lists 1–8, Q, E, R, T, the mouse buttons and
  "Other key…" (type it). Picking a mouse button adds "Needs AION 2 control mode".
- Not promised until the owner checks it in game: Ctrl + mouse, the mouse wheel, and a second key per slot.

**D4, stigma slots** (Game Data Check, `docs/research/2026-10-stigma-slots.md`): not settled. Metabot says a stigma
works only while it's registered to a stigma slot (9–12, keys 5–8). Two other guides stack stigmas with regular skills,
but neither says on which slot. So the build shows the safe reading: **each stigma on its own key, 5–8 (the game's
default)**, and the guide's E stack labelled "check in game", until the owner tries it (to-do T-61). The frames here draw the
E stack; that's what changes if the check fails. "Coming to E" becomes "Stigma keys 5–8".

## 12. Icons fill the key boxes

(`12-sheet-fill-*`, `12-sheet-tip-*`; 360 in `12-sheet-fill-360`)
- Each box is the skill's icon, filling the box edge to edge: 96 px on desktop, up to 112 px on a phone. The grid sets its
  own width, so on desktop the left column is the grid's width.
- The name leaves the box, as Isaac asked. It stays in the Rotation, in each box's accessible name ("Illusive Clone, E, row
  0 (fires first)") and in the tooltip on hover or tap: "Illusive Clone · E, row 0 (fires first)".
- Row 0 keeps its light edge and stigmas keep their accent edge. An empty row stays dashed.
- Icons are 128 px at the source, so a 112 px box on a 2× phone is drawn at about 1.75×. That is the trade for a box that
  reads at a glance. The cap stops it growing further.

**Cost:** CSS only, plus the tap tooltip on phones.

## Depends on

- **Basic vs Advanced**: being decided now (owner, 2026-10-20). If there's one view, the Basic frame goes.

## Removed against today

| What | Status |
|---|---|
| "Suggested keys: Q, E and T (T holds the stack the right-click macro fires). Move the skills there yourself." (Holly 1, critic 5) | Brought back word for word, with the rebinding hint after it |
| Skill names inside the boxes (Holly 4, critic 6) | Removed at Isaac's request (note 12); the name is in the tooltip and the accessible name |
| The page beside Key setup on desktop (critic 4) | Brought back: no dimming, the panel sits where the drawer does |

## Review answers

**Holly**

| # | Answer |
|---|---|
| 1 | Fixed: the suggestion line is back |
| 4 | Listed above |
| 5 | Fixed: every key line follows (`388-key-mine-*`; the frame's rename was broken by an escape bug, now fixed) |
| 6 | Fixed: the phone picker |
| 10 | Fixed: the Basic sheet and the sheet's end |
| 13 | Fixed: the sheet scrolls inside; `12-sheet-end-390` |

**Fresh critic**

| # | Answer |
|---|---|
| 4 | Fixed: desktop panel without dimming; on a phone, option B keeps Key setup in the drawer, so the tab bar and the Level up bar stay |
| 5 | Fixed |
| 6 | Listed above |
| 8 | Fixed |
| 9 | Fixed: the phone picker |
| 10 | Fixed: the clash state. The game's defaults aren't a clash: the guide asks you to move skills, and the line says so |
| 16 | Fixed: the header is "Key setup · Lv 39" on one line, with no repeat of "press K" |
| 17 | Fixed: "click" on desktop, "tap" on a phone |
| 18 | Fixed: 96 px boxes and the column hugs the grid; the phone cap and the upscaling are noted under 12 |
| 19 | Fixed: your keys get the accent edge, not gold |
| 20 | Fixed: hints are left-aligned with the grid |
| Tip frame "E, row 0" | Correct there: that frame shows the suggested keys |
| Checklist | "Tap a key" on desktop: fixed. Tap targets: "Back to suggested keys" is 24 px tall. Options on mobile: now two. |

## Found while mocking

- F1 (with Walter, 0.8.1 candidate). On a fresh Lv 39 save with no stigmas equipped, the grid's E column already shows
  all four stigmas, and "Coming to E" lists the same four as still to come.
- F2. The Gladiator's grid shows initials ("AS", "SA") for three skills with no icon. That's today's build, not the mock;
  it's for the class icon work (0.8.1 F5, #598).
- F3. Skills card, after the catch-up at Lv 39 (`10-skills-done-*`): the header says "1 pt to spend", and the hero hint
  says "63 more unlocked · 0 pts left". Both describe today's build. The hint counts points after the hero, which you can't
  buy. Fix: count from the points you have when the hero is short. For Walter as a 0.8.1 candidate.
