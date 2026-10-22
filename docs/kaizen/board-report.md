# Board report (one page per minor release)

The owner's ask (Isaac, 2026-10-21 6:56 PM ET): "I also want to measure and creep or drift in roles, who's pulling
weight or not etc. I need you to present board level reports to me as I'm essentially the owner and the board. The
reports tab should be updated with all these findings each release cycle". Proposal: Org Design, v2 (Fresh governance
review PROCESS REVIEW board-report OK with 3 changes); plan: Release Planner (Fresh governance review PLAN REVIEW
board-report OK with 2 conditions). Routed: coordinator 2026-10-21T23:02Z. This file is the spec's one home. The role
review it draws on lives in [gale.md "Role review"](../team/gale.md#role-review).

## When

Every minor (0.X.0), with the kaizen review after `RELEASE SHIPPED`. A patch (0.X.Y) gets a short report with red
flags only: an escape, a failed seeded test, or a creep flag. Reading "each release cycle" as each minor is the team's
inference; the first report asks the owner to confirm it.

## Steps

1. **Data pull:** Kaizen (Gale) collects, from the sources listed in the brief below and no others, and grades nothing.
   Output: `kaizen/role-review-<minor>/data.md` in the shared folder.
2. **Scorer:** a one-off session with no history, on Opus. The coordinator pastes the brief below, word for word, at the
   top of `kaizen/role-review-<minor>/rows.md` and starts the session with it. The scorer drafts every row, Kaizen's,
   Org Design's and the coordinator's included, and may request any other record directly.
3. **Replies:** within 24 h of the rows, heads add evidence lines and each role may reply. A missed reply is recorded as
   "no reply", never as a hold. The head of an ended or capped thread may reply instead.
4. **Decisions:** the coordinator decides each row except its own, which stands as the scorer wrote it (the
   coordinator may reply; a change or cut of the coordinator role goes to the owner as a To-do).
5. **Report:** the coordinator assembles it in `docs/kaizen/reports/board-<minor>.md` by PR, copying the role rows
   verbatim. Tracker Sync (Huell) publishes it as a `board` row on the Reports tab.
6. **Independent check (C2):** before the report's PR merges, a one-off with no history checks it against the
   Checklist below, from the fixed brief there, and signs a check file the report links. Tracker Sync publishes only
   after `BOARD CHECK <release> PASS` (Publishing gate below). Tracker Sync's write check for the `board` row also
   enforces B3's sum and that B7 matches the release's CHANGELOG text exactly, once Tracker Sync's validator follow-up
   lands (#808, owner Tracker Sync); a row that fails isn't written. **Interim, until #808 lands:** the C2 brief below
   re-derives B3's sum and compares B7 to the CHANGELOG character for character. The PR that lands #808 removes this
   interim text and the matching sentence in the brief.

## The report's six sections

Written for a non-technical owner (the Reports tab writing rule).

1. **Headline and verdict:** good, heads-up or needs-you, in one sentence.
2. **Delivery against plan:** planned against shipped, and each slip with its reason (the Release Planner's #232 log).
3. **Practice-gap scorecard:** the done, partial and missing counts, and the top 3 gaps with a proposal each (Kaizen).
4. **Role health:** one row per role, roles needing the owner first: keep, change or cut; a creep or drift flag; the 2
   or 3 numbers behind it; a one-line evidence link.
5. **Risks:** the top 3, each with its owner.
6. **Decisions for the owner:** each a To-do (T-NN) with "Open in To do".

## Scorer brief (fixed; paste word for word)

> You score every role on the Daeva Companion team for minor `<minor>`. You have no history with this team, and that
> is the point. Score each role in `docs/kaizen/team.csv` that was active during the minor, including Kaizen, Org Design
> and the coordinator.
>
> Read, in this order: `docs/kaizen/team.csv`; each role's charter in `docs/team/`; the measures in
> `docs/team/gale.md` "Role review"; and the data pull in this folder (`data.md`). The data pull comes only from these
> sources: the minor's merged PRs and their reviews; `state.md` assignments; `docs/kaizen/ledger.csv` rows changed in the
> minor; stall log #221 rows; planner log #232; kaizen log #222; escapes (defects found after release by the owner or
> players); seeded-test catches; owner touches (To-dos and cards); and each role's cost share. You may ask for any
> other record directly; say which and why in your rows.
>
> For each role write one row: keep, change or cut; output against plan; first-pass rate and CHANGES received; escapes;
> reviews done and seeded-test catches (control roles); owner touches; cost share; dependency; and scope against charter:
> creep (the share of the role's items outside its "I own" list, with the items listed), drift ("I own" duties with no
> activity for two minors running), unrecorded duties and missed duties. In 0.9 creep is measured, not flagged.
>
> Every keep, change or cut cites at least one outcome: something shipped, caught or escaped. Every flag lists its
> items. Don't soften a row for any role, including the one that briefed you. Your rows are copied into the owner's
> report verbatim.

## Checks (each minor's kaizen review)

- The report is published within 48 h of `RELEASE SHIPPED` (target; no baseline yet).
- Every role row cites an outcome and every flag lists its items: counted by that minor's practice-gap scorer or the
  Rules Steward (Francesca).
- Creep shares are recorded for every role; 0.10 sets the flag threshold from 0.9's data.

## Checklist

Every release report meets this before it publishes (Isaac, 2026-10-21 7:08 PM ET: "You get a team together and figure
out what the board is going to expect to see and make sure you have that each release please"). Plan: Amendment 1,
PLAN REVIEW board-report-amendment-1 OK with 7 conditions (fresh one-off), all applied here. Routed:
coordinator 2026-10-21T23:18Z (checklist) and 23:22Z (publishing gate). The six sections above carry A1 (1), B3 (2), B9
(5) and A2 (6); the rest are new lines and folds (Design Lead's v2 in the shared folder's `design/reports-board-row.md`).
Where this checklist and the sections differ, the checklist wins.

Derived by a four-lens panel of no-history reviewers (owner/investor, product, engineering governance, risk and
compliance; 55 expectations from board-deck, investor-update, DORA, control-deficiency and COSO/ISO 31000 risk-reporting
practice), merged into 18 checks and gap-checked against the plan and design (shared folder `board-report/release-checklist-draft.md`, which keeps the trace to the panel's items).

**M** = the report doesn't publish without it. **S** = should; a miss is written into the Data gaps line (C1).
Every number is pulled from the record (generated output, logs, #221, #232, ledger, CHANGELOG, the Kaizen scorecard) and
names its source; nothing is typed from memory.

**First report:** every "previous value" or "same as last report" test (A4, B1, B9, B11) passes when it shows "baseline,
no previous". That isn't a failed M.

### A. Open on the card

| # | | Check | Pass test |
|---|---|---|---|
| A1 | M | **The verdict can't be greener than the facts.** The verdict line names the release and says whether 1.0 got closer. | "Good" is impossible while any of these holds: an owner-held limit touched without Isaac's quoted OK, a player-facing escape, a failed seeded test, an incident on the live site. |
| A2 | M | **Owner actions first.** | Each item is a live T-NN with what, where, rough time and what it blocks. With none, it reads "Nothing needs you" (never hidden). Nothing in it is a call the team could make. |
| A3 | M | **Owner-held limits attestation.** | One line per limit (1)–(7) of the docs/DECISIONS.md row starting "Pipeline, settings and permission changes are the team's; seven owner-only limits", cited by number, never copied: untouched, touched with Isaac's OK (the message id resolves to him), or breached (links the incident). It collapses to "All 7 untouched" when true; any other state opens it and sets A1. Renumbering: see Publishing gate. |
| A4 | M | **Key numbers, the same six every release**, each beside last release's value: weekly usage % at release (Settings → Usage, with its time; read from #232, not a second reading) and pace against the budget line; usage per shipped item; owner touches; escapes; first-pass review rate; median lead time go → merge. | Each number names its source (a Kaizen scorecard row, or the query or script). Names and definitions match last report, or carry a "definition changed" note with the old value recomputed. A missing reading shows "missing", never an estimate. Counts sit beside rates. |

### B. In folds (the count in each fold label)

| # | | Check | Pass test |
|---|---|---|---|
| B1 | M | **Progress to 1.0**, by the frozen definitions below. | Same rows as last report: previous, now, delta. A removed or redefined row is explained. Fails while the definitions below lack the Release Planner's OK. |
| B2 | M | **What players got:** the top 3–5 changes in player words, each linked to its CHANGELOG entry, and one before/after shot from the scrapbook or "No visible change". | At most 5 bullets, no ids or jargon, every link resolves. |
| B3 | M | **Plan against shipped adds up and names who decided.** | planned + added − dropped − slipped = shipped, and every slip is listed with its reason; every added, dropped or rescoped item names its decider (DECISIONS row or role). Numbers match the plan PR and the release PR. Tracker Sync's write check enforces the sum (step 6). |
| B4 | M | **Quality and incidents:** escapes after the tag by severity, each with the gate that missed it; incidents in #221 for the window with their fix status; Player Testing's verdict on the live build. | Every #221 incident in the window appears, or it reads "none in #221 for <dates>". Every escape links an issue and a "missed by". |
| B5 | M | **Lowlights:** at least one, with impact, cause and the fix's owner. | Present every release, or "None, checked against #221 and #222". |
| B6 | M | **Data trust:** shipped facts by label (verified, single source, inferred, disputed) with the delta; facts that changed label; open owner in-game checks. | Counts from `npm run gen` output. Until gen prints label counts, the line is labelled inferred, never hand-counted. |
| B7 | M | **Player-facing breaks:** whether saves reset and why; the Action required and Known issues lines. | Matches that release's CHANGELOG text exactly; Tracker Sync's write check enforces it (step 6). |
| B8 | M | **Compliance, exceptions only:** one line "All checks passed" or the failing items. Checks: only hosts SOURCES.md permits for that use were fetched, none of aion2.th.gl or an opt-out site; 403 / 429 / challenge stops listed; the NCSoft disclaimer test passes; LICENSE unchanged and no outside licence headers; every new icon has its docs/ISSUES.md row; every new URL is in DATA_SOURCES.md; PRIVACY.md still true (no new third-party requests in the built HTML); `npm audit` high or critical; deploys only from a release or a quoted "now". | Each check is tagged "test" or "attested by <role>", and an attested line says what it rests on (for example "searched session and PR transcripts and the repo for th.gl hosts, <date>"). A check not run reads "not run", never "passed". Fetch-log evidence for B8 goes into the 0.10 planning pass as a candidate. |
| B9 | S | **Risks carried over:** the top 3 keep stable ids, each with its trend (↑ → ↓) and a reason for any change. | Last report's risks are present or marked closed with a reason. |
| B10 | S | **Decided for you:** material team decisions under a standing OK (scope, process, rules), each with its DECISIONS or ledger row and its outside reviewer. A loosening of an owner-held limit goes in A3, not here. | Matches the ledger.csv diff since the last tag. |
| B11 | S | **Next:** the next minor's theme, 1–3 checkable goals and expected usage. "Pending" with an ETA while its planning pass isn't written. | Every goal from last report appears with met or missed. |

### C. Before publishing

| # | | Check | Pass test |
|---|---|---|---|
| C1 | M | **Every number is labelled counted or inferred**, and the report ends with one Data gaps line: what couldn't be measured and which S checks were missed. | No unlabelled number. |
| C2 | M | **Independent check against this checklist** (brief below). | The signed check file exists and the report links it before the report's PR merges. A failed M blocks publishing. |
| C3 | M | **The open part fits one phone screen.** | A 390×844 shot from `tests/support/shots.mjs` shows the verdict through the key numbers without scrolling. If it doesn't, the open part shrinks in this order: A4 shows only the numbers that changed, with "all six ›" in a fold; then the roles that need attention move into the All roles fold. No appendix (that would be a second view). Until the board card is live on the Reports tab, C3 reads "not run (tab not built)" in Data gaps and doesn't block; from the first report after the card PR is published, C3 runs. |

### Patch releases (0.X.Y)

A patch report carries A1, A2, A3, B4, B5 (when there is one), B7, B8 (exceptions only) and C2; no key numbers, role
health or practice gaps. Under PLN-17 patches are rare until 1.0; whether every patch gets a report is asked in the first
report's Decisions.

### Progress to 1.0: definitions (B1)

**Frozen by the Release Planner's OK on the merged head of the PR that adds them** (`RELEASE PLANNER OK <sha>`); before
that OK they are a draft. From ROADMAP's 1.0 line and its `### 1.0` section: "all eight classes, Asmodian only, Lv 1–45, and
the endgame guide past Lv 45. Every class meets the bar the Assassin guide sets today: verified data only (see CLAUDE.md), Next up
always correct, saved progress never broken." Once frozen, a change needs a "definition changed" note with the old value
recomputed (A4's rule).

| Row | Counts | Source |
|---|---|---|
| 1.0 must-ship list | n / m: entries shipped, m fixed at freeze. Entries, each linked when frozen: world boss timers (ROADMAP `### 1.0`: "1.0 does not ship without the timers"; scope set by the owner 2026-10-20 7:02 PM ET); the build choice (a guide build per class, credited alternatives where sourced, a custom build, the switch warning; DECISIONS "1.0 ships up to three builds per class…"); one frozen save fixture per class (`tests/fixtures/saves-1.0/`); the strict save rule restored; the full architecture, performance and UX audit; the docs pass. An entry the owner adds later carries A4's "definition changed" note. | ROADMAP `### 1.0` at the tag (C) |
| Classes at the bar: data | n / 8: classes shipping no unlabelled unverified value | gen's checks (C) |
| Classes at the bar: Next up | n / 8: classes whose journey and golden coverage (where it exists) pass and whose last Player Testing class pass found no wrong Next up step | test runs and Player Testing's play issue; inferred (I) until per-class test evidence exists, never counted. First to confirm: whether golden and journey run per class |
| Classes at the bar: saves | n / 8: classes whose saves load: the save suite now, the class's frozen fixture from 1.0 | test runs (C) |
| Endgame guide past Lv 45 | "not started (sections not yet planned)" until 0.10's plan PR merges and fixes m; then n of m sections live, or complete | 0.10's plan and the CHANGELOG (C) |
| Classes with a Lv 1–45 guide live | n / 8: classes whose Lv 1–45 guide is in the released build. Already 8 / 8; expected to stay flat | class packs in `data/packs/aion2/` at the tag (C) |

Microscope-pass findings (from 0.11) are a separate count, not part of these rows. Out of scope, never counted toward
progress: Elyos (1.1) and anything ROADMAP lists after 1.0.

### C2: the check's fixed brief

The coordinator pastes this word for word at the top of the check file and adds nothing else.

> You are a one-off checker with no history on this report. Independence is decided from the record (DECISIONS row
> "Process changes are decided by the team after an outside review", item 1): you are not the coordinator, not the
> role-health scorer, not a role that produced a number in this report, and not an author of this checklist or spec.
> Inputs: the report draft, docs/kaizen/board-report.md, and read access to its sources; for C3, the 390×844 shot when
> the card exists. Tick every M and S line pass, fail or "not run", with one line of evidence each. Re-derive from the
> sources A1's verdict rule and every A3 and A4 value. Until #808 lands, also re-derive B3's sum (planned + added −
> dropped − slipped = shipped, every slip listed) and compare B7 to the release's CHANGELOG section character for
> character. Then pick three numbers from section B yourself, write down how
> you picked them, and re-derive them. Sign with the date. Any failed M: write `BOARD CHECK <release> FAIL` and the
> lines; otherwise `BOARD CHECK <release> PASS`.

### Publishing gate

- **A board report publishes only after the C2 check passes every M line.** C2 is the independent check against this
  checklist: a no-history one-off ticks every M and S line and signs a check file, which the report links. A failed M
  line blocks publishing. A missed S line is listed in the report's Data gaps line and doesn't block.
- **Limit (7):** the C2 gate and its token are gate criteria under owner-only limit (7) (docs/DECISIONS.md row "Pipeline,
  settings and permission changes are the team's; seven owner-only limits"). Removing C2, or turning one of its M lines
  into an S, goes to Isaac. Changing what an M line contains, with A4's "definition changed" note, is the team's,
  through the process-change procedure.
- **Renumbering:** A3 cites that DECISIONS row by its item numbers. If the row is ever renumbered, A3, KZ-19
  (`docs/team/team-wide.md`) and COM-18 (`docs/team/team-wide.md`) change in the same PR.
