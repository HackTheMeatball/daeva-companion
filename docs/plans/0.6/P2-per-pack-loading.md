# 0.6 P2: Per-pack loading: the page carries only the chosen class

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane B, first step; moved here from 0.4 P7). Read CLAUDE.md,
docs/ARCHITECTURE.md, docs/design/0.4-engine-contract.md, docs/DATA-FORMAT-V2.md (packs and manifests),
`src/packs/aion2/load.js`, `scripts/generated-data.mjs`, `tools/gen/` and docs/research/2026-10-next-class.md §1 (the
`loadBundle` pitfall) first.

## Problem

The generator and the build compile every pack under `data/packs/` into one module, so a second class's data would
land in every page (and over the byte budget), and a class folder dropped in early would show up for everyone
(next-class research §1).

## Result

- The generator compiles one table set per class pack, keyed by the pack id from its manifest; shared game and faction
  packs once.
- The build ships the shared packs plus each class pack as its own chunk; the page loads the chunk of the current
  character's class (the site: a separate file, precached; the artifact: still one file, every class inlined, since it
  can't fetch, and its own byte budget covers that).
- With only the Assassin pack the page is identical.
- The fake game pack (0.4 P6) gets a second class to prove two class packs load apart in conformance.

## Appetite

M–L.

## No-gos

- No new game data, no visible change, no save change (`companion-save-v5`).
- No artifact service worker, no artifact fetch (`/_blob/` icons stay).

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Conformance: the fake game's two classes compile to two chunks; a page state for class A never contains class
      B's records (paste the test names).
- [ ] Golden identical; the site page with one class within 1% of its size before (paste build lines).
- [ ] The site loads the class chunk offline after the first visit (`site` or `offline` suite line, paste).
- [ ] The artifact is still one file with every class inlined (paste the build line).
- [ ] ARCHITECTURE §4 and DATA-FORMAT-V2 describe the chunking; `npm test` green.

## Files (owns)

`tools/gen/`, `scripts/generated-data.mjs`, `scripts/build.mjs` (chunk output), `src/packs/aion2/load.js`,
`src/sw.js` (precache list), `tests/fixtures/packs/fakegame/` (second class), `tests/conformance.mjs`,
`docs/ARCHITECTURE.md` §4, `docs/DATA-FORMAT-V2.md`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: gen. Model: Opus (`tools/gen/`, pack loading). Stall limit: 80 min (M–L, scorecard). Expected near the 1 h token: commit and push after each Result bullet
(scorecard K1).

After: P1 (same build scripts; P1's headroom first).

- [next] #? opus lanes:gen
