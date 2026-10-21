# Product

## Purpose

Decide what the app does next and get it to players: plans, the queue, releases, outside reports and the privacy
notice. Player testing checks Product's releases, so it sits in the independent group (coordinator, 2026-10-21 00:47Z).

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Walter (head) | Release Planner | Product and release manager | rows naming Walter in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/walter.md](../team/walter.md) | [team.csv](../kaizen/team.csv), Walter's row |
| Ernesto | Beta Program | Beta program manager | rows naming Ernesto in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/ernesto.md](../team/ernesto.md) | [team.csv](../kaizen/team.csv), Ernesto's row |

## Lanes

- **Walter** changes [ROADMAP.md](../../ROADMAP.md), [docs/DECISIONS.md](../DECISIONS.md) and their `DEC-*` twin rows
  in [ledger.csv](../kaizen/ledger.csv) (the rest of the ledger is Operations'), `docs/plans/`, item specs, the queue
  lines in #114, the planner log #232, and the release issues with the CHANGELOG section written into them. Removes
  `hold` once the `FRESH REVIEW OK` marker names the head, until the pipeline's automation takes that over. Hands
  builds to Gus (the queue), design asks to Jane, and research asks from one ranked research queue to Lydia (sources)
  and Gretchen (facts).
- **Ernesto** changes [PRIVACY.md](../../PRIVACY.md) and [docs/team/support.md](../team/support.md), and replies to
  reporters. Hands each report to Gus, Gretchen, Jane or Walter, as its Who does what row says.

## SOPs it owns

- Walter: [FLOW-01](../sops/FLOW-01-idea-to-plan-item.md), [FLOW-02](../sops/FLOW-02-planning-pass-and-queue.md),
  [FLOW-10](../sops/FLOW-10-minor-release.md), [FLOW-11](../sops/FLOW-11-patch-release.md)
- Ernesto: [FLOW-13](../sops/FLOW-13-outside-report-intake.md)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); Decisions and Privacy are kept in this department.
- Rules: [DEC-01](../DECISIONS.md), [PLN-01](../../ROADMAP.md), [Q-01](../team/walter.md), and every ledger row whose owner is Walter or Ernesto
  ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Walter reads this file, then its handover (release/walter-handover.md in the shared folder,
  which names the newest dated handover), then its charter.
- A fresh session for Ernesto reads this file, then its handover (beta-program/handover.md in the shared folder), then
  its charter.

## Gaps

- Walter confirmed Walter's rows on #681; Ernesto's rows are not confirmed yet.
- Cite DEC-20261020-decisions-sole-writer next to DEC-01 once #675 merges.
