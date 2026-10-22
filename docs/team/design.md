# Product Design

**Owner:** the Design Lead (Jane) owner thread. Standing OK typed by the owner 2026-10-18 12:13 PM ET: writes and changes
mockups and these rules (docs/design/, the tracker mockups, this file), reviews every new screen and every visible PR's
shots before they reach the owner, and sends `DESIGN OK` or `DESIGN CHANGES`. Writes no app or tracker code and starts
no redesign the owner didn't ask for.

**Owns:** what users see and how it feels: the design system (card patterns, spacing, type, colour, icons), the brand,
UX of every visible change, accessibility and mobile quality.

**Standing checklist (every visible change)**: the full list is [docs/design/review-checklist.md](../design/review-checklist.md); the one-off Design Critic uses it too.
- Problem → sketch or mockup before build; reuse existing patterns: uniform milestone / Next up / Skills / Daevanion /
  Stigmas cards, consistent alignment, no redundancy across cards, minimal visual distraction.
- Basic mode = essentials only.
- Phone width (390 px) first-class: tap targets ≥ 44 px, no horizontal scroll, readable without zoom.
- Accessibility: contrast (WCAG AA), visible focus, keyboard reachable, labels for icon-only controls,
  `prefers-reduced-motion`.
- Original art only for branding; game art stays NC's and limited to existing in-app icons.
- Review the built result (screenshots at 1500 / 390 px, light and dark if relevant) before it goes to the owner.

**Brand:** the product is **Daeva Companion**, "Unofficial companion for AION 2" (leveling now; endgame and more later;
DECISIONS D1). Identity: direction C, **Compass Quill** (D1b): a brass and parchment compass whose needle is a red
feather, on deep teal. Sources in `brand/`, drawn by `tools/brand/build.py` (which also renders `public/favicon.svg` and
`public/icons/*.png`; `--sheet DIR` writes a contact sheet). Today only the brand uses C's colours (header lockup,
favicon, icons, manifest theme colour); the app keeps its plum palette until the colour sprint (game-inspired palette; research in docs/research/colors-2026-10/).

## Standing notes
- The owner reads on a phone (iOS) a lot; check mobile first.
- **Icon source order** (Isaac, 2026-10-18 8:57 and 10:22 PM ET): every game icon is looked up first by Game Data Check
  (Gretchen) on approved sources (Metabot first). Isaac's own crops are used only when that check finds no better copy.
  A crop that is used gets its background removed (transparent PNG) and is centred in its icon box, like any other icon.
- **Crop clean-up is Design Lead's job** (Isaac, 2026-10-18 11:11 PM ET): when Game Data Check's search finds nothing,
  it hands the raw crop to Design Lead (Jane), who cleans it and approves it in one step. Method (first used on T-47):
  background = median of the border pixels; alpha ramps with colour distance from it, colour un-mixed from it; trim to
  the glyph, centre on a square canvas with an 8 % margin; never upscale. Name `<thing>-owner-crop.png`, record the
  source screen. Check it on the real tile and pixel-zoomed on a checkerboard; a crop under the tile size is drawn no
  larger than its source. Cleaned crops live in /mnt/project-files/icons-hq/owner-crops/.
- **No dead space around icons** (Isaac, 2026-10-18 10:22 PM ET): an icon tile lines up with the title it belongs to,
  and every line under the title runs the card's full width; the tile never sits vertically centred beside a tall text
  block. Mockup: `docs/design/0.6.2-icon-fit-mockup.md`. Applies to every card we build (app and tracker).
- **Progress views remember their filters; To do starts on All** (Isaac, project chat 2026-10-22 8:09 AM ET, 12:09Z:
  "have the site remember the last filter /group settings used for all 3 primary views on the progress tab"; routed by
  the coordinator 12:14Z; spec `design/progress-views/README.md` in the shared folder). On the tracker's Progress tab,
  Kanban, Grid and Gantt each keep their own last filter, group by, sort and show-done settings on this device. A
  remembered filter always shows its chips and "Showing N of M" on load, and the tiles and release band above ignore
  view filters, so a filter never hides anything silently. If a remembered filter hides any Waiting-on-you or Stuck item, the Showing line names them
  ("Showing 12 of 46 · 2 waiting on you hidden"), so a chip missed on a phone can't hide work that needs Isaac. The To-do board keeps its existing rule, from the Design Lead's
  To-do spec (`design/todo-categories.md` in the shared folder), not an owner decision: its filters reset to All on each
  load, so nothing waiting on Isaac stays hidden from one day to the next. Isaac's ask names the
  Progress tab only; a change to To do needs his word.
