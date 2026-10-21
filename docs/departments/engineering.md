# Engineering

## Purpose

Turn queued items into merged, released code through the pipeline: kickoff, builds, CI, auto-merge and shipping.

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Gus (head) | Build Pipeline | Release and CI engineer | rows naming Gus in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/gus.md](../team/gus.md) | [team.csv](../kaizen/team.csv), Gus's row |

Builders are one-off threads and pipeline runs that kickoff starts for a queued item; they are not on the roster. Their
working rules are [CLAUDE.md](../../CLAUDE.md) and the item spec.

## Lanes

- **Gus** changes `.github/workflows/`, the #114 body (each owner edits only its own status line there) and the
  pipeline's own docs ([docs/DEPLOY.md](../DEPLOY.md)). Hands review to Howard's criteria, design shots to Jane, facts
  to Gretchen, releases to Walter.
- **Builders** change only what their item names, inside the serial lanes in
  [DISPATCH.md](../team/DISPATCH.md#routing-rule-applied-to-every-row) (one PR per lane at a time).
- Old-structure notes that are still live: the *Standing notes* in [docs/team/engineering.md](../team/engineering.md)
  and [docs/team/tech-lead.md](../team/tech-lead.md) (see [docs/team/README.md](../team/README.md)).

## SOPs it owns

- Gus: [FLOW-03](../sops/FLOW-03-build.md), [FLOW-09](../sops/FLOW-09-merge.md),
  [FLOW-23](../sops/FLOW-23-architecture-change.md) (from the relay move to Actions)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); for code, [CLAUDE.md](../../CLAUDE.md) and
  [LICENSE](../../LICENSE) above all.
- Rules: [PIP-03](../team/gus.md), [MRG-01](../team/gus.md), [Q-13](../team/gus.md), and every ledger row whose owner is Gus ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Gus reads this file, then its handover (pipeline/gus-handover.md in the shared folder), then its
  charter.
- A builder reads [CLAUDE.md](../../CLAUDE.md), [docs/ARCHITECTURE.md](../ARCHITECTURE.md) and its item spec; it has no
  handover.

## Gaps

- Who covers FLOW-23 until the relay work moves to Actions is not written down (an open question in FLOW-23).
- Lanes are read from Who does what and the role docs, not confirmed by Gus yet.
