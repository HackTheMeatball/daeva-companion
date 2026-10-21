# 0.9 P22: Key setup as a sheet: icons fill each box, and players choose their keys

Planned in the 0.9 planning pass (Release Planner, 2026-10-20). Plan: `docs/plans/0.9/README.md` §P22 (#609). Build go: the owner's standing OK until 1.0 (DECISIONS 2026-10-20, `owner-ok-0.9-go`). Read CLAUDE.md and docs/ARCHITECTURE.md first; the plan's "Rules for every item" apply.

**Fresh review** (new look; a new save field).

- **Problem.** The owner asked for key setup to rise from the bottom of the screen on desktop (note 11), and for the
  icons to fill each key box with the name in a tooltip, since the rotation already names them (note 12). Players can't
  set their own keys (#388). The Gladiator's and Ranger's key setups are bare next to the Assassin's (UX finding 11).
  Design Lead made 11, 12 and #388 one design (#610).
- **Result.** As Design Lead's approved mock shows: key setup is a bottom sheet; icons fill each box with a tap or
  focus tooltip; each key chip can be tapped to rebind; one `keys` save field with the class default when empty (no key
  bump); every class in the same layout.
- **Inputs.** `docs/design/0.9-keys/` (Design Lead's mocks, #619 and #656; merged with Design Lead's look
  OK after the fresh review; owner 2026-10-20 5:21 and 5:24 PM ET). Kickoff holds the item until they are on main.
- **Files.** `src/packs/aion2/cards/build.js`, `src/packs/aion2/cards/build.html`, `src/core/state.js` (`keys`
  default), `src/core/merge.js`, `src/styles/app.css`, `tests/a11y.js`, `tests/save.js`, the tests.
- **No-gos.** Only keys AION 2 can bind (Game Data Check's `bindable-keys` file: Design Lead's ask D3). No save key bump;
  an empty or unknown `keys` value falls back to the default. Names stay reachable by keyboard and screen reader.
- **Acceptance.**
  - [ ] a11y: each key box has an accessible name; the tooltip opens on focus; rebinding works by keyboard.
  - [ ] Core: a save without `keys` loads with the default; `merge()` keeps the newer `keys`.
  - [ ] Shots at 1500 and 390 px against the mock.
- **Lanes:** build-card, app.css, a11y, golden, mig, save. **Model:** Opus, L (120 min).
- **After:** research-bindable-keys.

- [next] #644 opus lanes:build-card,app.css,a11y,golden,mig,save
