# 0.9 P22: Key setup as a sheet: icons fill each box, and players choose their keys

Planned in the 0.9 planning pass (Release Planner, 2026-10-20). Plan: `docs/plans/0.9/README.md` §P22 (#609, amended in #687). Build go: the owner's standing OK until 1.0 (DECISIONS 2026-10-20, `owner-ok-0.9-go`). Read CLAUDE.md and docs/ARCHITECTURE.md first; the plan's "Rules for every item" apply.

Re-spec 2026-10-21 (Release Planner): this body now matches the plan's §P22 as amended in #687. The build at 04:28Z stopped because the old body lacked the macro-steps input and the skill-bar gate.

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
  `src/packs/aion2/data/build.js`, `src/core/state.js` (`keys` default), `src/core/merge.js`, `src/styles/app.css`,
  `tests/a11y.js`, `tests/save.js`, the tests.
- **No-gos.** Only keys AION 2 can bind (Game Data Check's `bindable-keys` file: Design Lead's ask D3). No save key bump;
  an empty or unknown `keys` value falls back to the default. Names stay reachable by keyboard and screen reader.
- **Planner notes.** Also (Game Data Check, D4 `stigma-slots`, 2026-10-20): the key sheet shows stigmas on keys 5–8 (stigma quickslots 9–12), which is safe under every source; the E stack shows "check in game" until To-do T-61 is answered.
- **Acceptance.**
  - [ ] a11y: each key box has an accessible name; the tooltip opens on focus; rebinding works by keyboard.
  - [ ] Core: a save without `keys` loads with the default; `merge()` keeps the newer `keys`.
  - [ ] `npm run gen` passes with the stepped macro for every class; Game Data Check's `DATA OK` on the head.
  - [ ] Shots at 1500 and 390 px against the mock.
- **Lanes:** gen, build-card, app.css, a11y, golden, mig, save. **Model:** Opus, L (120 min).
- **After:** research-bindable-keys, research-skill-bar, owner-ok-0.9-key-grid.

- [next] #644 opus lanes:gen,build-card,app.css,a11y,golden,mig,save

