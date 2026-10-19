# Patch watch (data freshness)

Owner: Game Data Check. Game patches don't line up with our releases, so data freshness is checked on a weekly
schedule (Isaac's OK, 2026-10-19), not per release. The release kaizen review only checks that a row exists since the
last release.

- Signal: the client build Metabot prints on its quest pages ("global client (build …)"). Official patch notes are on
  aion2.plaync.com, which is never fetched (NC's EULA bans automated access; `docs/research/SOURCES.md`).
- Same build: a no-change row. New build: re-check the guide's sourced records against Metabot, log the records
  checked and any value diffs, and file issues or data-fix PRs for values that moved.

| Date (ET) | Build | Records checked | Diffs | Issues / PRs |
|---|---|---|---|---|
| 2026-10-19 | 0.0.4387.0 | baseline; every `build` field in `data/**` already reads 0.0.4387.0 | none | none |
