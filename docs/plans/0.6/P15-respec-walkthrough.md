# 0.6 P15: Respec walk-through and the tutorial-skill refund (#254 note 2)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, #254 note 2, the owner's answer to
ROADMAP 0.6 owner input 3 (`owner-keys` in DECISIONS: stigma key, skill reset / refund button, tutorial-skill refund,
Daevanion and stigma respec steps), P14 and docs/ISSUES.md:49 (respec cost after Lv 31, disputed) first.

## Problem

The first skill is used in the tutorial and must be refunded, and the guide should call for a respec of skills, the
Daevanion board and stigmas when the build changes, and say how. None of these steps is in the data, and the
private-repo screens couldn't be read by the planning run.

## Result

- A one-time Next up row after the Skills unlock: refund the tutorial skill, with the owner's button path.
- Where the guide's build changes enough to need it, a respec row for skills / Daevanion / stigmas with the owner's
  steps; the respec cost after Lv 31 shown only if the dispute is settled, else labelled "disputed".
- All steps as guide data (`data/`), cited to the owner's answer.

## Appetite

S–M.

## No-gos

- No step the owner's answer doesn't give; no cost figure from a single source without its label; no new card.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Each new text line cites `owner-keys` (DECISIONS date) (paste).
- [ ] Golden shows the refund row once after the Skills unlock and never again once ticked (paste).
- [ ] `gen` green; before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

The Assassin guide pack's milestone / guide records, `data/packs/aion2/asmodian/unlocks.json` (hotkeys the answer adds),
`src/packs/aion2/cards/nextup-kinds.js`, `tests/golden/snapshots/**`, `data/DATA_SOURCES.md`,
`docs/reviews/0.6-p15-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (guide data, golden). Stall limit: 20 min (S–M).

After: P14, owner-keys.

- [next] #? opus lanes:golden
