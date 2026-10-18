# 0.6 P20: A removed character stays removed through `merge()`

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane C; the finding from 0.5 P17 / P19). Read CLAUDE.md,
docs/design/sync.md (§ slots and merge, line ~111), docs/ARCHITECTURE.md §1, `src/core/sync.js` and `src/core/chars.js`
first.

## Problem

`merge()` keeps a slot that exists on one side only, so a character removed on one device comes back when another
device's save (or an older backup) is merged. Sync (P21) would make that happen on every merge.

## Result

- `removeChar` leaves a tombstone (`chars[id] = { id, deletedAt }` or the shape sync.md recommends) inside
  `companion-save-v5`; `merge()` drops a slot whose tombstone is newer than its last change, and keeps the tombstone.
- Every reader of `chars` skips tombstones (switcher, label, export).

## Appetite

M.

## No-gos

- No save break: an additive field inside v5 (pre-1.0 rule allows it; no key bump needed since old saves have no
  tombstones); no network code; no UI change.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Core cases: remove on A, merge B's older save → stays removed; edit on B after the removal → the CLAUDE.md-safe
      outcome sync.md picks (paste test names).
- [ ] Property test: merge is commutative and idempotent with tombstones (paste).
- [ ] `core`, `save`, `sync` green; golden identical; term scan green; `npm test` green.

## Files (owns)

`src/core/sync.js`, `src/core/chars.js`, `src/core/state.js` (readers), `src/cards/characters.js` (skip tombstones),
`tests/core/sync*.test.mjs`, `tests/core/chars.test.mjs`, `docs/design/sync.md` (decision recorded),
`docs/ARCHITECTURE.md` §1.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Opus (saves, `src/core`). Stall limit: 80 min (M).

After: P7 (characters card).

- [next] #? opus lanes:none
