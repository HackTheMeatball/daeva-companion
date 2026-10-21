# Product

## Purpose

Decide what the app does next and get it to players: plans, the queue, releases, player testing, outside reports and
the privacy notice.

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Walter (head) | Release Planner | Product and release manager | rows naming Walter in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/walter.md](../team/walter.md) | [team.csv](../kaizen/team.csv), Walter's row |
| Jesse | Player Testing | Acceptance tester | rows naming Jesse in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/jesse.md](../team/jesse.md) | [team.csv](../kaizen/team.csv), Jesse's row |
| Ernesto | Beta Program | Beta program manager | rows naming Ernesto in [Who does what](../kaizen/LEDGER.md#who-does-what) | Gap: only in the shared folder (beta-program/charter.md) | [team.csv](../kaizen/team.csv), Ernesto's row |

## Lanes

- **Walter** changes [ROADMAP.md](../../ROADMAP.md), [docs/DECISIONS.md](../DECISIONS.md), `docs/plans/`, item specs and
  the queue lines in #114. Hands builds to Gus (the queue), facts to Gretchen, design asks to Jane.
- **Jesse** changes only player findings issues and its own reports. Hands findings to Walter (planning) or Mike (a stall).
- **Ernesto** changes [PRIVACY.md](../../PRIVACY.md) and [docs/team/support.md](../team/support.md), and replies to
  reporters. Hands each report to Gus, Gretchen, Jane or Walter, as its Who does what row says.

## SOPs it owns

- Walter: [FLOW-01](../sops/FLOW-01-idea-to-plan-item.md), [FLOW-02](../sops/FLOW-02-planning-pass-and-queue.md),
  [FLOW-10](../sops/FLOW-10-minor-release.md), [FLOW-11](../sops/FLOW-11-patch-release.md)
- Ernesto: [FLOW-13](../sops/FLOW-13-outside-report-intake.md)
- Jesse: [FLOW-20](../sops/FLOW-20-player-testing.md)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); Decisions and Privacy are kept in this department.
- Rules: [DEC-01](../DECISIONS.md), [PLN-01](../../ROADMAP.md), [Q-01](../team/walter.md), [PLN-21](../team/jesse.md), and every ledger row whose owner is Walter, Jesse or Ernesto
  ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Walter reads this file, then its handover (release/walter-handover-2026-10-21.md in the shared
  folder), then its charter.
- A fresh session for Jesse reads this file, then its handover (player-testing/handover.md in the shared folder), then
  its charter.
- A fresh session for Ernesto reads this file, then its handover (beta-program/handover.md in the shared folder), then
  its charter.

## Gaps

- Ernesto's charter is not in the repo yet (docs/team/ernesto.md was asked for).
- Lanes are read from Who does what and the role docs, not confirmed by each role yet.
