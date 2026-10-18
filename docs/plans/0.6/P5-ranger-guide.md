# 0.6 P5: Ranger guide and the class picker

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane B); retargeted from the Gladiator to the Ranger on
2026-10-18 (owner's choice, DECISIONS 2026-10-18; ROADMAP 0.6 "Replan"). Read CLAUDE.md, the Assassin guide pack
(`data/packs/aion2/asmodian/assassin/guide/`), P3's shared guide, P22's Ranger class data, the Ranger research file
(`docs/research/2026-10-ranger-pack.md`) and the owner's Ranger spot-check record in docs/DECISIONS.md
(`owner-check-ranger`) first. The hidden Gladiator class pack (P4) stays as it is.

## Problem

With P22's data in place the Ranger still has no build advice (skill order, four stigmas, first Daevanion nodes),
no icons and no golden state, and the picker shows only the Assassin.

## Result

- `data/packs/aion2/asmodian/ranger/` guide pack: build steps, stigma picks and first nodes, each claim with two
  sources or labelled per `claims.json`; facts the owner's spot check confirmed cite it.
- Skill and stigma icons from Metabot under the standing icon OK, recorded in docs/ISSUES.md (source page, file URL,
  date); missing ones listed for the owner.
- The AION 2 pack lists the Ranger in `classes`; a new character can pick it; golden gets Ranger states at Lv 1,
  10, 22, 30 and 45.

## Appetite

L.

## No-gos

- No advice without sources; editorial build pages (Metabot "builds", rated C) are one source, never two.
- No change to the Assassin's output (golden identical for every Assassin state); no save break.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every guide claim has two sources or a label (paste the generator's claims count).
- [ ] Golden: new Ranger states recorded, every Assassin state identical (paste).
- [ ] The picker offers Assassin and Ranger (not the Gladiator); switching characters switches the guide (save suite
      test, paste).
- [ ] Icons recorded in docs/ISSUES.md; `dist-artifact` icons as `/_blob/` (paste the build line).
- [ ] Before / after shots and `scrapbook.json` committed; `npm test` green.

## Files (owns)

`data/packs/aion2/asmodian/ranger/**` (new), `src/packs/aion2/pack.js` (`classes`), `src/assets/icons/**` (new
icons), `docs/ISSUES.md`, `tests/golden/**` (new states), `tests/save.js`, `docs/reviews/0.6-p5-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: gen, golden. Model: Opus (golden, guide data). Stall limit: 120 min (L).

After: P22, owner-check-ranger.

- [next] #264 opus lanes:gen,golden
