# 0.6 P21: Sync client on `merge()` (old Y1), behind the owner's hosting decision

Planned in the 0.6 planning pass (#257, ROADMAP "0.6", lane C). **Queued only after the owner decides hosting
(docs/design/sync.md §6 S1, token `owner-ok-sync-hosting`).** Read CLAUDE.md, docs/design/sync.md (all), PRIVACY.md,
`src/core/sync.js`, `src/core/storage.js` and P20 first.

## Problem

The anonymous, end-to-end encrypted sync code (DECISIONS "Accounts / sign-in") has a design and a `merge()` but no
client: nothing encrypts the save, talks to a host or resolves a conflicting write.

## Result

- `src/core/sync-client.js`: encrypt / decrypt the save with the sync code (WebCrypto, sync.md's scheme), push and pull
  with the host's conditional write, merge on conflict, retry with backoff; a host adapter interface and a fake host
  for tests. No UI (0.7).
- The site build only; the artifact gets no sync code (sync.md S4 default).

## Appetite

L. Split at the adapter if it runs past 300 lines of core code: P21a crypto + adapter interface, P21b push / pull /
conflict.

## No-gos

- The server never sees the name, label or any plaintext (0.4 review note 5); no account; no UI; no server code (0.7);
  no real host contacted in tests.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Round trip through the fake host: two devices converge after concurrent edits (test names, paste).
- [ ] The fake host's stored bytes contain no name, label or JSON key in plaintext (test, paste).
- [ ] `dist-artifact` has no sync code (build check, paste); term scan green; `npm test` green.

## Files (owns)

`src/core/sync-client.js` (new), `src/shell/sync-host-*.js` (adapter), `tests/core/sync-client*.test.mjs`,
`tests/fixtures/fake-host.mjs`, `scripts/build.mjs` (`@web-only` exclusion), `PRIVACY.md`, `docs/design/sync.md`.

Ownership check: every acceptance line passes with these files.

## Lanes, model, order

Lanes: none. Model: Opus (saves, `src/core`, > 300 lines). Stall limit: 120 min (L); commit and push after each part
(scorecard K1).

After: P2 (`scripts/build.mjs`), P20, owner-ok-sync-hosting. If the token isn't recorded by the time P5 merges, P21 moves to 0.7 with the server
and 0.6 ships without it (ROADMAP 0.6).

- [next] #? opus lanes:none
