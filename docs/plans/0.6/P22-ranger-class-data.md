# 0.6 P22: Ranger class data (not shown yet)

Added to 0.6 on 2026-10-18 when the owner chose the Ranger as the second class (DECISIONS 2026-10-18; ROADMAP 0.6
"Replan", lane B). It is P4 (Gladiator class data, PR #300) done again for the Ranger: read CLAUDE.md ("Data and source
policy"), docs/research/2026-10-next-class.md (record shapes §2.3, source check §3), P4's merged Gladiator pack
(`data/packs/aion2/classes/gladiator/`, the pattern to follow) and the Ranger research output
(`docs/research/2026-10-ranger-pack.md` and its CSVs under `data/research/`, written by the `research-ranger` session,
ROADMAP 0.6 "Alongside") first.

## Problem

The Ranger has no class pack. Its game-database layer is on Metabot (counts in the research file), but a bot build has
no web, so the data comes from the research session's files.

## Result

`data/packs/aion2/classes/ranger/` with its manifest, `class.json`, `skills.json`, `stigmas.json`,
`board-nodes.json` in the shapes of next-class research §2.3, every record with its Metabot source page; the AION 2
pack's `classes` list unchanged (the Ranger is not offered until P5). Fields the research marks single source or
unverified carry that label per `claims.json` rules.

## Appetite

L (data records count).

## No-gos

- No value without a source in the research files; no aion2.th.gl, Game8 or thegameswiki wording.
- No guide text or advice (P5); not in the class picker; no icons (P5); no visible change for Assassin players.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] `npm run gen` green; every new record has a source URL that is in `DATA_SOURCES.md` and the Sources card data
      (paste the counts against the research file's: skills, stigmas, board nodes per board).
- [ ] A spot check of 10 random records against the research CSV rows (paste).
- [ ] The picker still lists only the Assassin; golden identical (paste).
- [ ] P2's chunking: the Assassin page carries no Ranger or Gladiator record (paste the check).
- [ ] `npm test` green.

## Files (owns)

`data/packs/aion2/classes/ranger/**` (new), `data/packs/aion2/sources.json`, `data/DATA_SOURCES.md`, schemas only if a
field is missing (`data/schema/`).

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: gen. Model: Opus (data/schema, gen). Stall limit: 120 min (L).

After: P3, research-ranger.

- [next] #303 opus lanes:gen
