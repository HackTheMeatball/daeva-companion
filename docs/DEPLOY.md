# Deploying

Two targets, built from the same source by `npm run build`.

## GitHub Pages (daevacompanion.com)

Every push to `main` runs `.github/workflows/ci.yml`: the blocking tests (**data** and the **browser** shards, summed
up by **ci-ok**, see *CI jobs* below). **Only a release deploys** (PLN-17; Fresh governance review, deploy-cadence OK,
2026-10-21). Before that, every merge went live at once, so 0.9's save reset reached players under the 0.8.0 label. The
**gate** job decides:

- **A push whose own diff changes `package.json`'s `version`** (the release commit, see *Releases*) deploys once its tests
  pass. Any other merge stops at ci-ok and the live site stays on the last release. A `before` sha of all zeros counts as
  no change.
- **A dispatch at a release commit** (Actions → CI → Run workflow on `main`, input `sha` = a commit whose version differs
  from its parent's) deploys exactly that commit. That's how a failed release is re-run, and how to roll back to an older
  release. The next merge never deploys a failed release.
- **The escape hatch: a dispatch at any other commit**, for a fix the owner wants live now, or a legal remedy on Legal's
  ruling plus the owner's "now" (PLN-17). Needs input `now_comment`, the id of a #114 comment holding the line
  `DEPLOY NOW <sha7>: "<Isaac's quote>" (verified by id <message id>)`. The coordinator reads Isaac's message by id and
  posts that line, and the thread that wants the deploy never dispatches it itself (two-person dispatch). The run lists
  the commits since the last tag in its summary. It refuses if they change the save key or add a "Saves reset" CHANGELOG
  line, unless the quote says "save" or "reset". Every session posts as the owner account, so the line is a trust marker,
  not proof. Watchdog (Mike) re-checks each quote by id and flags any deploy with neither a version change nor a logged
  quote.
- Any dispatch needs the sha on `main` with **ci-ok** green on it. A dispatch without `sha`, or on a branch, runs the tests
  only.

Then the **deploy** job builds that sha's `dist/` and publishes it with `actions/configure-pages`,
`actions/upload-pages-artifact` and `actions/deploy-pages`. The **smoke** job checks the live site really serves that
build (see *Smoke check* below). Only after it passes, the **release** job tags and publishes a GitHub Release for every
CHANGELOG version that has none yet (see *Releases* below).

Order on `main`: data + browser shards → ci-ok, and gate → deploy → smoke → release. Pull requests run the same tests
(data, browser shards, perf, ci-ok) and never deploy. Pushes to other branches run CI only through their pull request (no
duplicate run per push); to test a branch without a PR, run the workflow by hand on it (Actions → CI → Run workflow, no
`sha`).

### CI jobs

| Job | Blocking | What | Time (job, 2026-10-15) |
|---|---|---|---|
| `data` | yes | no browser: data schemas + cross-record checks, `DATA_SOURCES.md` current, pure core, CHANGELOG format, shard list (`node tests/run.mjs --check-shards`), build | ≈ 10 s |
| `browser (journey)` | yes | `node tests/run.mjs --shard journey` | ≈ 4 min |
| `browser (regress)` | yes | `--shard regress` | ≈ 4 min |
| `browser (golden)` | yes | `--shard golden`: golden, a11y, save, site | ≈ 2.5 min |
| `browser (checks)` | yes | `--shard checks`: e1, e2, gates, e4, e3 | ≈ 2 min |
| `perf` | **no** | `update()` median < 15 ms (`tests/perf.js`); a slow run is a `::warning` annotation, the job stays green | ≈ 1 min |
| `ci-ok` | the required check | succeeds only if every blocking job succeeded (see below) | seconds |
| `gate` | main only | decides whether this run deploys and which sha (see above; tests/deploy.mjs) | seconds |
| `deploy` → `smoke` → `release` | main, release only | see above | |

Jobs start together, so a PR's result arrives after the slowest shard: ≈ 4 min (was ≈ 13 min with one `test` job).

The shards are defined once, in `SHARDS` in `tests/run.mjs`; the matrix in `ci.yml` lists the same names and the data
job fails if the two differ or a suite is in no shard (or two). To add a suite: add it to `SUITES`, `ALL` and `ORDER` in
`tests/run.mjs` and to one shard (rebalance by the shard times in the run); add a shard only together with its
`shard:` matrix entry. Each shard uploads its `tests/out/` as the artifact `test-output-<shard>`.

**ci-ok** runs with `if: always()` after `data` and every `browser` shard, prints each one's result, and fails unless
all of them are `success`: a failed, cancelled or skipped blocking job fails it (with an `::error` annotation naming
the job). It runs on pull requests and on `main`; `deploy` needs it (and `data` and `browser` directly), so nothing
deploys unless every blocking test passed. `perf` is deliberately not in its `needs`. A new blocking job must be added
to ci-ok's `needs:` (and to deploy's).

### Turn on branch protection (owner, once, after this CI has run once)

So nothing reaches `main` without green tests. GitHub only offers `ci-ok` in the list after it has run at least once.

1. Repository **Settings → Branches → Add classic branch protection rule** (not "Add branch ruleset": rulesets have
   different steps).
2. **Branch name pattern:** `main`.
3. Tick **Require a pull request before merging**. Untick **Require approvals** (0 approvals: you merge your own PRs).
4. Tick **Require status checks to pass before merging**. In the search box type `ci-ok` and pick it. Add nothing
   else (the shard names can change; ci-ok covers them all). Leave **Require branches to be up to date before
   merging** unticked.
5. Leave **Do not allow bypassing the above settings** unticked, so you (admin) can still bypass in an emergency.
   Leave **Allow force pushes** and **Allow deletions** unticked (the default: both blocked).
6. **Create** / **Save changes**.
7. Check: open any pull request; the merge box lists **ci-ok** as *Required*, and Merge stays disabled until it passes.

CI keeps working with the rule on: it never pushes to `main` (the release job only creates tags and releases).

Runners are pinned to `ubuntu-24.04` rather than `ubuntu-latest`, so a GitHub image change can't silently change test
results. Move to a newer image on purpose, in its own commit, with a green run.

## Releases

1. In one commit: set `version` in `package.json` (`npm version X.Y.Z --no-git-tag-version`) and add a
   section at the top of CHANGELOG.md in the house format (docs/team/qa-release.md, "Changelog format").
2. Push to `main` (through a PR). The data job fails early if the version has no CHANGELOG section or any section
   breaks the format (`node scripts/release-notes.mjs`).
3. That push is the release: the gate deploys it (no other merge does). After the deploy, the release job creates tag `vX.Y.Z` and the GitHub Release (title "X.Y.Z — summary", notes =
   that CHANGELOG section, marked latest). Older CHANGELOG versions without a tag are backfilled at the commit that first set them in
   `package.json`. Releases that already exist get their title and notes updated whenever their CHANGELOG section
   changes. Don't create or edit tags or releases by hand.

### One-time setup (repository settings)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Custom domain:** `daevacompanion.com` → Save. (`public/CNAME` carries the same name; with Actions deploys the
   setting in the UI is what counts.) DNS (Cloudflare, grey cloud / DNS only): `CNAME @ → hackthemeatball.github.io` and `CNAME www → hackthemeatball.github.io`
   for daevacompanion.com. Since 2026-10-14 the old address aion2.ishkabytes.com and daevapath.com forward here with
   Cloudflare Redirect Rules (proxied records).
3. Wait for the DNS check to pass, then tick **Enforce HTTPS** (the certificate can take a few minutes to an hour).
4. Optional, recommended: verify `daevacompanion.com` under **Settings → Pages → Verified domains** (account settings) so
   nobody else can claim the subdomain.
5. The `github-pages` environment is created by the first deploy. If it has deployment-branch rules, allow `main`.

### Smoke check (CI)

`scripts/smoke.mjs` runs in the **smoke** job after every deploy. The deploy job passes its `dist/build.json` as a job
output (`build_json`); the script:

1. polls `https://daevacompanion.com/build.json` every 10 s for up to 5 min, each request with a fresh `?smoke=…` query
   and `Cache-Control: no-cache` (so neither the Pages CDN nor a proxy can answer from cache), until it equals that
   build.json (compared as parsed JSON);
2. fetches the page the same way and checks the footer version link (`#verLink`, filled in at build time) reads
   `v<package.json version>`.

Either failure is an `::error` annotation on the run (titles start with "Smoke:") and fails the job, so **release**
doesn't run: no tag or GitHub Release for a version that isn't live. A failed smoke means the site is still on the old
build or a stale CDN copy: check the deploy job and `/build.json`, then re-run the failed jobs (re-running smoke alone
is enough if the deploy did go live late).

Run it by hand: `node scripts/smoke.mjs --expect '{"build":"<id>"}'` against the live site (default `--expect` is the
local `dist/build.json`), or `npm run build && npm run serve`, then
`node scripts/smoke.mjs --url http://localhost:8080 --timeout 0`. Options: `--url`, `--expect`, `--version`,
`--timeout` (s), `--interval` (s). Behind a proxy, Node 22's `fetch` needs `NODE_USE_ENV_PROXY=1`.

### Checking a deploy

- The run's **deploy** job links the live URL.
- `https://daevacompanion.com/build.json` shows the build id; the service worker cache is named `aion2-route-<id>`.
- Returning visitors get the new page on their next load (network-first); the service worker swaps the icon cache at
  the same time.

### Rolling back

Dispatch CI on `main` with `sha` = the release commit to go back to (for example the commit tagged `v0.8.0`). That's a
release commit, so no quote is needed. A revert pushed to `main` no longer redeploys by itself: it goes out with the next
release, or through the escape hatch. Saved progress is unaffected either way, except that going back to a release with an
older save key starts players fresh, as that release did.

## claude.ai artifact

Deleted (owner, 2026-10-20). It was frozen on 2026-10-18 (DECISIONS `owner-ok-0.7-artifact-freeze`) and `dist-artifact/` has been gone since 0.7 P9; there is nothing to publish.
