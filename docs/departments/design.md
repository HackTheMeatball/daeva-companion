# Design

## Purpose

Own how the app and the tracker page look and feel: mockups, the design system, DESIGN OK on visible changes and the
tracker page itself.

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Jane (head) | Design Lead | Product design lead | rows naming Jane in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/design.md](../team/design.md) | [team.csv](../kaizen/team.csv), Jane's row |

Tracker page builds are one-off threads or pipeline runs; Skyler's role ended on 2026-10-20 (team.csv: closed).

## Lanes

- **Jane** changes `docs/design/` (mockups, the design system) and [docs/team/design.md](../team/design.md), and posts
  DESIGN OK or DESIGN CHANGES on PRs with shots. Writes the mock harness code under `docs/design/` (such as `cases.mjs`
  and `common.mjs`), but no app or tracker code. Hands builds to the Release Planner (the queue) or a
  one-off tracker build, and tracker data to Huell.
- Holly (independent) reviews Jane's designs against the checklist; an outside reviewer reviews a tracker build's code
  (Howard consulted), and Huell checks no tracker data was lost, then publishes it (FLOW-22).

## SOPs it owns

- Jane: [FLOW-22](../sops/FLOW-22-tracker-page-change.md)
- [FLOW-05](../sops/FLOW-05-design-review.md) Design review is Holly's (independent) end to end; Jane keeps the final
  look OK and DESIGN OK / DESIGN CHANGES ([MRG-06](../reviews/README.md)).

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); game art rules in [CLAUDE.md](../../CLAUDE.md) above all.
- Rules: [MRG-06](../reviews/README.md), [MRG-08](../DECISIONS.md), [PLN-12](https://github.com/HackTheMeatball/daeva-companion/issues/222), and every ledger row whose owner is Jane ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Jane reads this file, then its handover (design/handover.md in the shared folder), then its
  charter.

## Gaps

None; Jane confirmed this doc on #681.
