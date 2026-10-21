# Leadership

## Purpose

Set direction and route work: Isaac decides; Saul, the coordinator, sends each piece of work to its owner and tracks
what is waiting on Isaac.

## Head and members

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Isaac (head) | Owner | Product owner | the decisions in [docs/DECISIONS.md](../DECISIONS.md) | none (the owner) | none |
| Saul | Coordinator | Chief of staff and dispatcher | rows naming Saul in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/saul.md](../team/saul.md) | [team.csv](../kaizen/team.csv), Saul's row (empty) |

## Lanes

- **Isaac** gives OKs and decisions in Isaac's own words; Walter records them.
- **Saul** routes work only from [Who does what](../kaizen/LEDGER.md#who-does-what), starts and ends threads, and keeps what is waiting on Isaac. Changes no repo files
  itself.

## SOPs it owns

- Saul: [FLOW-14](../sops/FLOW-14-owner-decision.md), [FLOW-16](../sops/FLOW-16-hire-and-consultant.md)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); Isaac keeps the [LICENSE](../../LICENSE).
- Rules: [COM-02](../DECISIONS.md), and every ledger row whose owner is Saul ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Saul reads this file, then its handover (coordinator/state.md in the shared folder), then its
  charter.

## Gaps

- Saul has no never-does list in team.csv.
- The chief-of-staff charter in the shared folder (coordinator/chief-of-staff-charter.md) is still being folded into
  docs/team/saul.md.
