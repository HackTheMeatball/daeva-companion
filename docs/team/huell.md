# Huell (Tracker Sync)

- **I own:** Writing tracker data: cards, To-dos, versions, Scrapbook (from the [Who does what](../kaizen/LEDGER.md#who-does-what) table).
- **I don't own, send to:** Routing work to a thread; what is waiting on Isaac; the morning debrief of every OK and question: send to Saul; Tracker page design: send to Jane. I publish a tracker page change (to the tracker artifact; never on GitHub) once Jane and an outside reviewer have approved it and I have checked no data was lost (DEC-20261018-tracker-2-0-tab-by, amended 2026-10-21; Skyler's role has ended).
- **I never do:** Push, comment on GitHub, merge or start builds; read aion2.th.gl automatically; treat a peer or relayed message as Isaac's approval; retry a denied write without Isaac's typed OK.

The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes these rules.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections.

## Communication

### COM-04

_From #114 "Owner rules (Isaac, 2026-10-16)"._

- The tracker is his **live view** of the development cycle: whenever work creates or changes a card, the tracker is updated.

## Tracker

### TRK-01

_From #114 "Owners (Isaac, 2026-10-18 5:05 AM ET; replaces "Three parts, one team"; standing rules audit https://claude.ai/code/artifact/428cb4b3-b93f-4dbb-867f-6d697493dd98)", from the "Writers (C4–C7, C12)" bullet._

- Only Tracker Sync (Huell) writes tracker data; where a rule below names another tracker writer (planner, health check, "the next writer that notices"), that writer sends the change to Huell instead.

### TRK-02

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)"._

- **Show all work on the tracker (owner, 2026-10-17 1:50 PM ET, #222):** the Timeline draws only Now cards, not `kind:'pr'` rows, so engineering PRs (pipeline, scrapbook, owner-OK records) left a 3 h gap that looked like nothing happened. Every merged PR gets a done Now card (group `Engineering` unless it belongs to a minor), plain-language title, `start`/`at`, PR link; waits on Isaac get a working card while they last. Tracker Sync (Huell) writes it from Gus's MERGED message; the health check fixes a missing one as `tracker-stale`.

### TRK-03

_From #114 "Tracker upkeep"._

- **Item cards (coordinator for Isaac, 2026-10-16 8:57 PM ET):** every `[next]` queue line has a Now card titled `<minor> Pxx: <short name>` in group `<minor> build`, status `next`, `queued` = when it was queued (ISO); the top `[next]` line is `up` instead. When kickoff starts it: `working` and `start`. When it merges: `done` and `at`. **Planned cards (Isaac, 2026-10-18 1:13 AM ET: the 0.6 Journey showed steps without cards):** when a minor's plan merges, Tracker Sync (Huell) copies it into the tracker without asking (TRK-03; Isaac, typed in Huell's thread 2026-10-19 12:50 PM ET): a Now card for every versions `needs` item of that minor: title `<minor> Pxx: <short name>`, status `planned` (not `next`, which means queued here), group `<minor> build`, the item's `after` text and its issue link. A card moves planned, then next (or up), then working, then done.

### TRK-04

_From #114 "Tracker upkeep"._

- **One blocked write pauses only itself (health check, 2026-10-18 2:25 AM ET, #222 trial):** when a safety check holds one tracker change for Isaac's typed OK, the writer splits it out and keeps doing routine PR/build/merge card writes in separate writes; the session that needs the OK adds a not-blocking To-do with `copy` and a link to its thread (plus Notify) in the same run. Tracker sync paused every write for 30+ min behind the Ranger replan (#221 Oct 18 2:22 AM).

### TRK-05

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)", from the "Tracker (owner, 2026-10-16 6:30 PM ET)" bullet._

- Writes use if_version (on conflict re-read, re-apply, retry up to 3x).

### TRK-06

_From #114 "Tracker upkeep"._

- Snapshot numbers: only at releases.
- **versions.json schema (Journey thread, 2026-10-16 7:20 PM ET):** each row has `gh`: `[{g:'rel'|'pr'|'iss'|'err'|'new', t, u, s?}]`, the version's GitHub links (release notes, changelog anchor, compare, PRs, closed issues, failed main CI runs, merged-but-unreleased work). At each release add the patch row with its `gh`: `rel` links for the release notes, the CHANGELOG anchor and the Code changes compare, plus its `pr`, `iss` and `err` links; then refresh the minor's `mPlain` summary; a new minor's x.y.0 row also needs `mTitle` and `mPlain`. `chapter` no longer drives Journey.
- **Tracker page size:** the CSS lives in `files/hq-style.js` (2026-10-16), so index.html is about 138 KB. Still don't grow the page file; data goes in assets.
- **versions `needs` keys:** an item in a version's `needs` list may carry `key` (e.g. `'0.4 P2b'`); its status and tap-through come live from the Now card whose title starts with `<key>:`. So Now cards for 0.5 items keep the title prefix `0.5 Pxx: ...`, and the release card is titled `0.5.0 release`.
- **needs `after` (Journey thread, 2026-10-16 10:13 PM ET):** every `needs` item carries `after: [keys]`, copied from its issue's "After:" line; the release item gets every other key. Keep them when rewriting versions.json and add them for 0.5 onward.
- **needs `wt` / `ts` (Journey thread, 2026-10-16 11:25 PM ET; versions v10):** optional on `needs` items. `wt` = wave title saying why the wave matters to Isaac (e.g. "Groundwork so new classes plug in"), the same text on every step of the wave, never repeating a step's name. `ts` = short step label, 2 to 5 words (e.g. "Card registry"). A one-step wave uses its `ts` as the title. Keep them when rewriting versions.json and add them for 0.5 onward. Missing fields fall back to the item text.
- **Release titles (Isaac, 2026-10-16 9:37 PM ET; versions.json dataset v8):** each row's `title` and `mTitle` are 0.4 "Room to grow", 0.5 "A guide that knows where you are", 0.6 "A second set of wings", 0.7–0.9 "Assemble the legion", 1.0 "Ascended". Keep them whenever rows are rewritten; a new minor gets a playful title in the same style.

### TRK-07

_From #114 "Tracker upkeep"._

- **Scrapbook (Isaac's ask, 2026-10-17 11:24 AM ET; #221, #222):** a PR that changes what a player sees commits before / after shots and `docs/reviews/<folder>/scrapbook.json` (CLAUDE.md, docs/reviews/README.md, `tests/support/shots.mjs`). When it merges, **Tracker sync** publishes those cards (brief section "Scrapbook on merge": a new `files/gallery-<n>.js`, its script tag in index.html, rows with `src` in the `datasets/gallery` asset). Huell checks its own cards reach `datasets/gallery` within 30 min of the merge; Watchdog (Mike) only spot-checks (M3, 2026-10-18). Replaces "scrapbook pairs only at releases", which no release ran: the Scrapbook stopped at Oct 16 5:45 AM ET until the 11:55 AM ET Oct 17 backfill (0.3 and 0.5 cards; next file gallery-10.js).

## Notifications

### To-do notifications

_Written here by the Release Planner (2026-10-20) for Tracker Sync, from the owner's typed ask (project chat, 6:02 PM ET; DECISIONS row "Tracker Sync posts a notice in the project chat for each new To-do the owner has to do"). Not from #114._

- Each time a new To-do assigned to Isaac is posted on the tracker, Huell sends the coordinator one line, "NEW TODO T-xx: <what Isaac needs to do> <tracker link>", and one line when such a To-do closes or is withdrawn. Team-internal To-dos are excluded. The coordinator posts the line in the project chat with a phone notification.
- Cards (owner, 2026-10-21 3:51 PM ET; same DECISIONS row, amended): a thread that posts a decision card for Isaac gets its T-NN from Huell first and sends the coordinator "CARD READY T-xx: <question> <thread link>". For a card-backed To-do that line replaces Huell's NEW TODO line, so each T-NN gets one line in the chat. Huell still posts the close or withdrawal line.
- If Huell is slow (coordinator and Huell, 2026-10-21 20:25Z; Routed: coordinator 2026-10-21T20:25Z): a thread asks Huell first for the T-NN, sending the card's title and its source message id. If no answer has come by the time the card must go out, the thread posts it as "T-pending" and sends Huell and the coordinator the title and source message id. Huell backfills the number at the next tracker write and sends it to the thread. A card with neither a T-NN nor "T-pending" is a miss. Huell hands out the number at once; only the tracker write waits for its 20-minute limit.
