# 0.6 P18: Terms explained (old 0.7 P2)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md ("Data and source policy"), the approved
S1 mockup (term explanation) and the guide pack's text records first.

## Problem

The guide uses game words a new player doesn't know (Daevanion, stigma, Kibelisk, Cube, specialty) with no
explanation.

## Result

- A term list in the AION 2 game pack's data (`terms.json`: id, term, one-sentence explanation ≤ 140 characters,
  sources), each explanation from two sources or the owner's screens, in our own words.
- Where S1 puts it, the term's first use on a card is marked and opens its explanation (tap / hover / keyboard).

## Appetite

M.

## No-gos

- No explanation copied from a source's wording (thegameswiki CC BY-NC-SA: facts only); no unverified mechanic; at most
  12 terms in this item.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every term has sources in `DATA_SOURCES.md` (paste the count).
- [ ] The explanation opens by keyboard and screen reader (`a11y`, paste).
- [ ] Golden diffs only in the marked terms (paste); before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`data/packs/aion2/terms.json` (new), `data/schema/` (terms schema), `src/packs/aion2/text.js`, the cards' term markup,
`tests/golden/snapshots/**`, `tests/a11y.js` (one check), `data/DATA_SOURCES.md`, `docs/reviews/0.6-p18-shots/`.

Ownership check: every acceptance line passes with these files (if the generator needs a new table, the item takes lane
gen and says so).

## Lanes, model, order

Lanes: golden, a11y. Model: Opus (data/schema, golden). Stall limit: 80 min (M).

After: S1, owner-ok-S1.

- [next] #? opus lanes:golden,a11y
