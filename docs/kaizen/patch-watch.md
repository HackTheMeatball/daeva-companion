# Patch watch (data freshness)

Owner: Game Data Check. Game patches don't line up with our releases, so data freshness is checked on a weekly
schedule (Isaac's OK, 2026-10-19), not per release. The release kaizen review only checks that a row exists since the
last release, or that the scheduled task ran.

- Signal: the client build Metabot prints on its quest pages ("global client (build …)"). Official patch notes are on
  aion2.plaync.com, which is never fetched (NC's EULA bans automated access; `docs/research/SOURCES.md`).
- Only build changes get a row here. On a new build, the guide's sourced records are re-checked against Metabot, and
  the row lists the records checked, any value diffs, and the issues or data-fix PRs for values that moved. Weeks with
  the same build add no row; the scheduled task's run history shows those runs.
- Schedule: Thursdays 12:47 PM ET, the day after the usual Global maintenance (Wednesday from 06:30 UTC, about
  3.5–4 h; single source: mein-mmo.de quoting NC's Steam and Discord posts, seen Oct 7 and Oct 14, 2026; NC hasn't
  announced a fixed slot, and extra windows happen). Game Data Check sends Kaizen `REPORT READY <minor>` with the
  runs since the last release after each release ships.

| Date (ET) | Build | Records checked (count + list or query) | Diffs | Issues / PRs |
|---|---|---|---|---|
| 2026-10-19 | 0.0.4387.0 | baseline; every `build` field in `data/**` already reads 0.0.4387.0 | none | none |
