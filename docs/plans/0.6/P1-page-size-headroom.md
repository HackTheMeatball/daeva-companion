# 0.6 P1: Page-size headroom before the second class

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", audit and budget trend). Read CLAUDE.md, docs/ARCHITECTURE.md §4
(build), `scripts/build.mjs`, `scripts/generated-data.mjs` and docs/plans/0.5/P20-page-script-size.md first.

## Problem

`dist/index.html` gzip -9 is 182,302 B of its 200,000 B blocking budget (91%, `npm run build` on `aab1032`; CI showed
181,602 B on 2026-10-17). Every lane A item adds text and markup, and the Gladiator pack (P4, P5) adds a second class's
data before P2's per-pack loading can leave it out. Without headroom the first 0.6 item that grows the page fails CI.

## Result

1. Measure first: the build prints (behind a flag, e.g. `node scripts/build.mjs --sizes`) the gzip share of each part
   of the page: the generated data module by table, each card module, each stylesheet, inlined assets. The PR pastes
   the table.
2. Cut the largest share that can shrink with **no visible change and no data loss**, e.g. compact the generated data
   module (records as arrays or JSON strings parsed once, fields the page never reads left out of the page bundle),
   whatever the table shows is biggest. Target: gzip ≤ 170,000 B (85%).

## Appetite

S–M.

## No-gos

- No visible change (golden, `site` and the pixel checks identical); no change to `data/**` or the generator's
  validation; no raised budget; no change to the artifact rules (one file, `/_blob/` icons, no service worker).
- No identifier minification (0.5 P20: names stay readable in errors).

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] The size table, before and after (paste both).
- [ ] `budget dist/index.html gzip -9 bytes` ≤ 170,000 (paste the build line).
- [ ] Golden identical; `site`, `a11y` and `perf` green (paste the suite lines).
- [ ] ARCHITECTURE §4 describes the change and the `--sizes` flag.
- [ ] `npm test` green.

## Files (owns)

`scripts/build.mjs`, `scripts/generated-data.mjs`, `docs/ARCHITECTURE.md` §4.

Ownership check: every acceptance line passes with these files (if the cut needs `tools/gen/`, the build hands up to
Opus and takes lane gen; say so in the PR).

## Lanes, model, order

Lanes: none. Model: Sonnet (build options, like 0.5 P20). Stall limit: 20 min (S–M).

After: nothing.

- [next] #? sonnet lanes:none
