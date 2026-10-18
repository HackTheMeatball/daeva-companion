# 0.6 P17: First-run welcome and joining above Lv 1 (old 0.7 P1, P3)

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane A). Read CLAUDE.md, the approved S1 mockup, docs/ARCHITECTURE.md
§1 (save v5), `src/cards/characters.js`, `src/cards/journey.js` and the 0.5 catch-up ranking (P13) first.

## Problem

A fresh browser drops the player at Lv 1 on the first story quest with no word on what the app is; a player who is
already Lv 20 must click Level up 19 times and tick every earlier quest, or live with Next up's catch-up.

## Result

- A one-time welcome as S1 draws it (what the guide is, unofficial, how ticking and Level up work), dismissed for good
  per browser.
- An "I'm already Lv N" path that sets the level through the existing level setter and marks earlier story quests done
  the way S1 says (derived from the story, as 0.3's completion does), so Next up starts at the right place.

## Appetite

M–L.

## No-gos

- Level still changes only through Level up / − / + / slider and this one-time setter the owner approved in S1
  (CLAUDE.md "Manual progress"); no save break; the "not affiliated with or endorsed by NCSoft" phrase stays in the
  welcome.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Fresh browser: welcome once; reload: not again (test, paste).
- [ ] Join at Lv 20: Next up equals a played-through Lv 20 state's (golden or invariant, paste).
- [ ] `site` (unofficial wording), `save`, `a11y` green; before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/welcome.js` / `.html` (new), its stylesheet, `src/main.js` (mount), `src/index.html`, `src/cards/characters.js`
(new-character path), `tests/save.js`, `tests/site.js`, `docs/reviews/0.6-p17-shots/`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: main.js. Model: Opus (save, > 300 lines likely). Stall limit: 80 min (M–L). Commit and push after the welcome
and after the join path (scorecard K1).

After: S1, owner-ok-S1, P16 (main.js), P7 (characters card).

- [next] #? opus lanes:main.js
