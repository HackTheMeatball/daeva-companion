# 0.6 P3: Split the guide text both classes share out of the Assassin pack

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane B). Read CLAUDE.md, docs/DATA-FORMAT-V2.md,
`data/packs/aion2/asmodian/` (pack.json and the `assassin/` guide), docs/research/2026-10-next-class.md §2 and
`data/packs/aion2/asmodian/assassin/guide/claims.json` first.

## Problem

Guide records that hold for every Asmodian class (story route, milestones that aren't class build steps, route rules,
general tips) live under `data/packs/aion2/asmodian/assassin/guide/`, so a Gladiator guide would copy them.

## Result

- Records that name no class skill, stigma or node move, verbatim, to a shared Asmodian guide pack
  (`data/packs/aion2/asmodian/guide/`, its own manifest); the Assassin guide pack depends on it and keeps only class
  records. A record that is unclear stays in the Assassin pack, listed in the PR.
- Compiled output for the Assassin is byte-identical apart from record order the generator documents.

## Appetite

M–L (moves count once).

## No-gos

- No wording change, no new data, no visible change; no Gladiator files (P4).
- No change to ids or keys (`rq:<id>`, `sd:<slug>` stay), so saves are untouched.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `npm run gen` green; `DATA_SOURCES.md` regenerated with no lost URL (paste the diff stat).
- [ ] Golden identical; `gates` and `schema` green (paste).
- [ ] A check in `checks.mjs` fails if a shared guide record names a class skill, stigma or node (paste the test).
- [ ] The PR lists every record that moved and every one left behind with its reason.
- [ ] `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/guide/**` (new), `data/packs/aion2/asmodian/assassin/guide/**`, pack manifests,
`data/packs/aion2/checks.mjs`, `tools/gen/` (pack chain), `data/DATA_SOURCES.md`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: gen. Model: Opus (data layout, generator). Stall limit: 80 min (M–L, scorecard). Commit and push after the move and after the check (scorecard K1).

After: P2.

- [next] #? opus lanes:gen
