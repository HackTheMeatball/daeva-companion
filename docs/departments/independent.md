# Independent group

## Purpose

Check the departments from outside them: code and design review criteria, health and stalls, kaizen, audits, org
design and legal compliance. No role here reports to a department it checks.

## Head and members

There is no head; each role reports to the coordinator (Saul). Chuck is the second line, alongside Howard and Holly. Jesse joined this quality line on 2026-10-21 (coordinator, 00:47Z,
Org Design's reporting pass v13), because Jesse's play-throughs gate the releases Walter ships.
Lydia is listed here under Chuck, who checks Lydia's conduct, but is not part of the independent group: Lydia does
sourcing work, not checking.

| Name | Role | Title | Owns | Charter | Never does |
|---|---|---|---|---|---|
| Gale | Kaizen | Continuous-improvement lead | rows naming Gale in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/gale.md](../team/gale.md) | [team.csv](../kaizen/team.csv), Gale's row |
| Gomez | Team Audit | Internal auditor | none in [Who does what](../kaizen/LEDGER.md#who-does-what) yet | [docs/team/gomez.md](../team/gomez.md) | [team.csv](../kaizen/team.csv), Gomez's row (empty) |
| Howard | Code Review | Code review criteria owner | rows naming Howard in [Who does what](../kaizen/LEDGER.md#who-does-what) | Gap: docs/team/howard.md is in an open PR | [team.csv](../kaizen/team.csv), Howard's row |
| Holly | Design Review | Design review lead | rows naming Holly in [Who does what](../kaizen/LEDGER.md#who-does-what) | Gap: only a draft in the shared folder (design-review/charter-draft.md) | [team.csv](../kaizen/team.csv), Holly's row |
| Mike | Watchdog | On-call reliability engineer | rows naming Mike in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/mike.md](../team/mike.md) | [team.csv](../kaizen/team.csv), Mike's row |
| Nacho | Org Design | Organization design lead | rows naming Nacho in [Who does what](../kaizen/LEDGER.md#who-does-what) | Gap: only in the shared folder (org-design/charter.md) | [team.csv](../kaizen/team.csv), Nacho's row |
| Chuck | Legal & Compliance | Legal and compliance head (second line) | rows naming Chuck in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/chuck.md](../team/chuck.md) | [team.csv](../kaizen/team.csv), Chuck's row |
| Jesse | Player Testing | Acceptance tester | rows naming Jesse in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/jesse.md](../team/jesse.md) | [team.csv](../kaizen/team.csv), Jesse's row |
| Lydia (reports to Chuck; not independent) | Source Vetting | Licensing and compliance analyst | rows naming Lydia in [Who does what](../kaizen/LEDGER.md#who-does-what) | [docs/team/lydia.md](../team/lydia.md) | [team.csv](../kaizen/team.csv), Lydia's row (empty) |

## Lanes

- **Gale** changes the kaizen review, #222 and the scorecard in [docs/kaizen/](../kaizen/), and rule changes; never
  another owner's files.
- **Gomez** writes audit reports and reviews proposals (project instructions, roster changes); changes no rules.
- **Howard** changes the code review criteria and the cross-PR pattern log; never posts a gate line.
- **Holly** changes [docs/design/review-checklist.md](../design/review-checklist.md), its findings log and fresh design
  briefs; never posts DESIGN OK or CHANGES.
- **Mike** writes the stall log #221 and runs the health check; reports, never fixes another lane's work.
- **Nacho** writes roster scans and recommendations; the coordinator decides.
- **Chuck** changes the compliance register and the Terms draft only, and reviews every change with legal risk.
- **Jesse** changes only player findings issues and its own reports. Hands findings to the Release Planner (planning) or Mike (a stall).
- **Lydia** changes [docs/research/SOURCES.md](../research/SOURCES.md) and does outside research under the fetching rules.

## SOPs it owns

- Howard: [FLOW-04](../sops/FLOW-04-code-review.md)
- Holly: [FLOW-05](../sops/FLOW-05-design-review.md) (end to end; Jane keeps DESIGN OK / CHANGES)
- Lydia: [FLOW-07](../sops/FLOW-07-source-vetting.md)
- Mike: [FLOW-12](../sops/FLOW-12-incident-and-stall.md)
- Jesse: [FLOW-20](../sops/FLOW-20-player-testing.md)
- Gale: [FLOW-15](../sops/FLOW-15-process-change.md), [FLOW-17](../sops/FLOW-17-kaizen-review.md)

## Policies that apply

- All of the [Policies table](../sops/README.md#policies); Source access is kept here (Lydia).
- Rules: [HC-01](../team/mike.md), [HC-02](../team/mike.md), [KZ-01](../DECISIONS.md), [ROL-04](../DECISIONS.md), [PLN-21](../team/jesse.md), and every ledger row whose owner is in this group
  ([ledger.csv](../kaizen/ledger.csv)).

## Restart

- A fresh session for Gale reads this file, then its handover (kaizen/handover.md in the shared folder), then its charter.
- A fresh session for Gomez reads this file, then its handover (audit-1.0/handover.md in the shared folder), then its
  charter.
- A fresh session for Howard reads this file, then its handover (code-review/handover.md in the shared folder), then its
  charter.
- A fresh session for Holly reads this file, then its handover (design-review/handover.md in the shared folder), then its
  charter.
- A fresh session for Mike reads this file, then its handover (stall-log/mike-handover.md in the shared folder), then its
  charter.
- A fresh session for Nacho reads this file, then its handover (org-design/handover.md in the shared folder), then its
  charter.
- A fresh session for Chuck reads this file, then its handover (not written yet: see Gaps), then its charter.
- A fresh session for Jesse reads this file, then its handover (player-testing/handover.md in the shared folder), then
  its charter.
- A fresh session for Lydia reads this file, then its handover (research/handover.md in the shared folder), then its
  charter.

## Gaps

- Charters not in the repo yet: Howard (in an open PR), Holly, Nacho.
- Chuck has no handover file.
- Gomez and Lydia have no never-does list in team.csv.
- Lanes are read from Who does what and the role docs, not confirmed by each role yet.
