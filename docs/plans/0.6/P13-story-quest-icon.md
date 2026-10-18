# 0.6 P13: The game's yellow story-quest icon instead of 📜 (#254 note 7)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md ("No new game art"), #254 note 7 (the
owner's OK for this one icon), docs/team/icon-provenance.md, docs/ISSUES.md (icon records) and `src/cards/nextup.js`
lines 59–71 first.

## Problem

Story objectives show a 📜 emoji; the owner finds the game's yellow story-quest icon easier to recognise and gave his OK
for it (#254, 2026-10-17). The standing icon OK covers skill, stigma and item icons only, so this icon needs an approved
source: Metabot first, or a file the owner supplies.

## Result

The story kind's icon is the game's story-quest icon from the source the `research-story-icon` gate found (its page,
file URL and date in docs/ISSUES.md); the site and the artifact (`/_blob/`) both show it; the emoji stays as the
fallback when the icon can't load.

## Appetite

S.

## No-gos

- No icon without a recorded approved source; no other quest-kind icons; no aion2.th.gl or Game8.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] docs/ISSUES.md has the icon's source page, file URL and date (paste).
- [ ] Golden `nextup/` changes only in the story icon (paste summary); the artifact build lists it as a `/_blob/` icon.
- [ ] Before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/nextup.js` (icon map only), `src/assets/icons/` (the file), `docs/ISSUES.md`, `tests/golden/snapshots/**`,
`docs/reviews/0.6-p13-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: golden. Model: Opus (golden). Stall limit: 16 min (S).

After: owner-ok-story-icon (the owner's icon crop, recorded in DECISIONS and docs/ISSUES.md). Re-spec 2026-10-18 (Release Planner): P11 and P12 merged; `research-story-icon` ran (PR #289, no Metabot source). Moved to 0.7.

- [next] #? opus lanes:golden
