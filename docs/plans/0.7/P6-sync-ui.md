# 0.7 P6: Sync UI on the site

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Lane C. Read CLAUDE.md, the approved S2 mockup (`docs/design/0.7-sync-mockup.md`, `owner-ok-S2` in DECISIONS),
docs/design/sync.md §1, §2, §6 S4 / S5, §8, and `src/core/sync-client.js` first.

## Problem

The client exists but nothing in the page uses it.

## Result

The S2 drawings, built: turn sync on, join, status line, "Show sync code" (per S5), "Delete cloud copy", the `online`
retry; the record key `companion-sync-v1`; base URL `https://sync.daevacompanion.com` in one constant. Site only
(`@web-only`, S4): `dist-artifact` holds none of the client's marks. Texts in `data/`.

## Appetite

M–L.

## No-gos

- Nothing beyond the approved drawings; no save break (`companion-sync-v1` is a separate key); no sync in the artifact.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Each S2 state reachable in a Playwright test against the fake host (paste).
- [ ] The build's artifact check passes (no sync marks) and both builds look identical apart from the sync UI (paste).
- [ ] Export and *Report a problem* never include the sync code (`site` suite, paste).
- [ ] `a11y` green; before / after shots and `scrapbook.json`; `npm test` green.

## Files (owns)

`src/cards/sync.*` or the settings card's sync section, `src/main.js` (mount only), `src/shell/sync-host-http.js`
(base URL), sync texts in `data/`, `tests/site.js`, a sync UI test, `docs/reviews/0.7-p6-shots/`.

## Lanes, model, order

Lanes: main.js, a11y. Model: Opus. Stall limit: 80 min (M–L).

After: S2, owner-ok-S2.

- [next] #349 opus lanes:main.js,a11y
