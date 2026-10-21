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
