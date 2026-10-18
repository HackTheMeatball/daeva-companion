# 0.7 P5: Sync server (Cloudflare Worker + R2), tested offline

Planned in the 0.7 planning pass (Release Planner, 2026-10-18; ROADMAP "0.7"; Kaizen review docs/kaizen/0.6-scorecard.md). Lane C. Hosting decided (DECISIONS 2026-10-18 12:57 AM ET: "Sync hosting OK: Cloudflare Workers + R2, free tier,
usage alert"). Read CLAUDE.md, docs/design/sync.md §4 (the contract), §6, §7 and §8, PRIVACY.md and
`src/core/sync-client.js` first.

## Problem

0.6 P21 built the client against a fake host; there is no server.

## Result

- `server/sync/`: a Worker implementing sync.md §4 exactly: `GET` / `PUT` / `DELETE /v1/s/{id}`, validation, size and
  padding checks, conditional writes on R2's etag, token hash and constant-time compare, abuse limits, the retention
  rule from owner input 3 (default 180 days), the storage ceiling, CORS for `https://daevacompanion.com` only,
  `Cache-Control: no-store` and `ETag` in `Access-Control-Expose-Headers` (§8).
- Tests in Node against the Worker's fetch handler with an in-memory R2 stand-in (no network, no account), plus the
  client's `syncOnce` / `joinSync` against the Worker handler end to end.
- A wrangler config with placeholders only (no account id, no secrets); deploy is not part of this item.

## Appetite

L.

## No-gos

- No deploy, no secrets, no `.github/workflows/` edits; no change to the page bundles; nothing in `dist-artifact`.

## Acceptance (review checklist: each line pass / fail with evidence)

- [ ] Every row of sync.md §4 and the §7 server list has a passing test (paste the list).
- [ ] The client round trip (create, update, 412 retry, conflict, delete) passes against the Worker handler (paste).
- [ ] A cross-origin `GET` exposes the ETag (test, paste); `npm test` green; the build's no-sync-in-artifact check
      still passes. No visible change.

## Files (owns)

`server/sync/**` (new), `tests/core/sync-server.test.mjs` (new), docs/design/sync.md §9 (server as built), PRIVACY.md
(retention line).

## Lanes, model, order

Lanes: none. Model: Opus. Stall limit: 120 min (L).

After: owner-ok-sync-rules.

- [next] #348 opus lanes:none
