# 0.8 looks, second round (Isaac's T-50 notes, 2026-10-19 2:13 PM ET)

Design Lead (Jane). Frames come from the real app at main bd09742, with the proposal injected into the page. The
sources are in the scratchpad and are rebuildable: `v2a/cases.mjs`, `v2b/rq.mjs` + `nu.mjs`, and `v2c/cases.mjs`.

## 1. Where the place icon sits (`1-icon-box.png`)
- Isaac kept the size change (the tile image at 100 %). This round only moves the box.
- **A (recommended):** on phones (≤ 520 px) the 44 px icon box sits beside the title, in the title row. The location
  and progress lines run the full card width under it, so the empty strip under the icon is gone.
  CSS sketch: `.ns-mhead { grid-template-columns: 44px 1fr }`, `.title { display: contents }`, `h3` in column 2 of
  row 1, other title children and `.meta` at `1 / -1`.
  - Height: stronghold −5 px, sealed +6 px (CSS px). The win is the reclaimed width, not height.
- **B:** keep the column, but top-align the icon with the title (`align-self: start`). Same height as today.
- **Desktop:** no change. The card is one line, so a centred icon is already right.

## 2. Marking a regional quest (`2-quest-state.png`)
**Today:** a checkbox. The first click means picked up and shows a "−" box with an IN PROGRESS tag; the second click
means turned in. Nothing on screen says a second click exists. The "−" is the standard "mixed / partly selected"
checkbox state (WAI-ARIA `aria-checked="mixed"`), not "in progress", so it reads as a half-ticked box.

Research basis: these are established UI conventions, not new sources.
- A checkbox is a binary control, and a control should say what it does.
- MMOs mark quest state with the giver's marker, so the app reuses the game's own markers for state.

- **A (recommended):** the state icon goes where the box was. That's the teal star for to pick up, Metabot's
  `quest_district` marker for in progress, and a green ✓ for turned in.
  - One button says the next thing you did: "Picked up", then "Turned in" (green), then a small "Undo".
  - A one-line legend under "Regional quests" teaches the three icons.
  - In the Next up card, the same button sits in a column right of the names.
  - The same data drives it (`started`, `checks`), so it needs no save change.
- **B:** a 3-part switch (To pick up · Picked up · Turned in) under each quest. Any state is one tap away, but each
  quest gets one row taller.
- **Note on the 0.6.2 rule** "markers never decorate rows in a list": here the marker *replaces* the box as the state
  control, so it isn't decoration. Isaac's yes on this card settles that.
- **"Not in game yet" / "In my game":** these buttons stay as they are. They're hidden in the frames because those
  rows don't show them in that state.

## 3. Choose your class, 8 classes (`3-class-picker.png`)
- **A (recommended): 8 badges.** Each is the class emblem plus its name: 4 × 2 on phone, one row of 8 on desktop. It
  takes one tap and shows every class at once, like the game's own class select.
  - Costs about 150 px of phone height over the closed dropdown.
- **B: a dropdown.** The closed field shows the picked class's emblem and name. The open list shows all 8 with
  emblems. It's the shortest card, but needs two taps and hides the choices.
- In both, Assassin is pre-selected. Classes with no guide yet show "Soon" and can't be picked: in 0.8 those are
  Sorcerer and Chanter. Accessibility: badges are a `radiogroup`, and the dropdown is a listbox button.
- **Game art:** class emblems from Metabot, `https://metabot.gg/web/aion2/classes/<class>.webp`, 256 px, fetched
  2026-10-19, listed on https://metabot.gg/en/aion-2/classes. Class emblems aren't covered by the standing icon OK, so
  option A needs Isaac's yes on the emblems too. Option B uses them as well.

## 4. Extract tip flask
Unchanged from T-50 (`../0.8-owner-ok/4-extract-icon.png`). Isaac made no note on it.

## Owner answers (2026-10-19, pinned comments in the Design Lead thread)
- Class: A, approved 2:35 PM ET.
- Quest: A, approved 2:36 PM ET. Isaac said the ✓ bubble looked odd. Fixed in `2b-check-fix.png`: a 22 px green
  circle with a centred SVG check (stroke 3.2, `#0d1a12`), centred in the 28 px state column. The legend uses a 15 px
  version. Build it as SVG, never as a ✓ text glyph, because glyph metrics shift with the font.
- Quest, map pin (2:38 PM ET, phone and desktop): every quest row in the Next up card gets a map pin (link to the
  Metabot map) in its own column left of the button: `grid-template-columns: 22px minmax(0,1fr) 32px max-content`
  (36 px pin on phone). The name truncates with an ellipsis. The pin is muted, or `--accent` when the quest is near
  your story step; that replaces today's inline `.q-near` pin. See `2c-map-pin.png`.
- Check bubble: centred with absolute positioning (`left/top: 50%; translate(-50%,-50%)`), measured within 0.5 px.
  See `2b-check-fix.png`.
- Icon: A, approved 2:39 PM ET, with "balance the card to reduce empty space". Balanced in `1c-icon-balance.png`: on
  phone the `.meta` button moves into the title row, in column 3 (`grid-template-columns: 44px minmax(0,1fr) auto
  !important`; `!important` beats `#nowStar.wide`'s 2-column rule, which would otherwise shrink the full-width lines).
  It stays 44 px tall. The cards get about 30 % shorter. Gus: check every Next up kind (story with how-to lines,
  quest objectives, skill buys) at 360 and 390 before calling it done.
