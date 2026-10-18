# 0.6 P5: Gladiator guide and the class picker

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane B). Read CLAUDE.md, the Assassin guide pack
(`data/packs/aion2/asmodian/assassin/guide/`), P3's shared guide, P4's class data, the Gladiator research file and the
owner's Gladiator spot-check record in docs/DECISIONS.md (`owner-check-gladiator`) first.

## Problem

With P4's data in place the Gladiator still has no build advice (skill order, four stigmas, first Daevanion nodes),
no icons and no golden state, and the picker shows only the Assassin.

## Result

- `data/packs/aion2/asmodian/gladiator/` guide pack: build steps, stigma picks and first nodes, each claim with two
  sources or labelled per `claims.json`; facts the owner's spot check confirmed cite it.
- Skill and stigma icons from Metabot under the standing icon OK, recorded in docs/ISSUES.md (source page, file URL,
  date); missing ones listed for the owner.
- The AION 2 pack lists the Gladiator in `classes`; a new character can pick it; golden gets Gladiator states at Lv 1,
  10, 22, 30 and 45.

## Appetite

L.

## No-gos

- No advice without sources; editorial build pages (Metabot "builds", rated C) are one source, never two.
- No change to the Assassin's output (golden identical for every Assassin state); no save break.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every guide claim has two sources or a label (paste the generator's claims count).
- [ ] Golden: new Gladiator states recorded, every Assassin state identical (paste).
- [ ] The picker offers Assassin and Gladiator; switching characters switches the guide (save suite test, paste).
- [ ] Icons recorded in docs/ISSUES.md; `dist-artifact` icons as `/_blob/` (paste the build line).
- [ ] Before / after shots and `scrapbook.json` committed; `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/gladiator/**` (new), `src/packs/aion2/pack.js` (`classes`), `src/assets/icons/**` (new
icons), `docs/ISSUES.md`, `tests/golden/**` (new states), `tests/save.js`, `docs/reviews/0.6-p5-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: gen, golden. Model: Opus (golden, guide data). Stall limit: 120 min (L).

After: P4, owner-check-gladiator.

- [next] #? opus lanes:gen,golden
