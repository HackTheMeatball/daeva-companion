# FLOW-04: Code review

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Every PR is reviewed by a session that did not write it, against Howard's criteria, and fixed until it is approved or marked stuck.

## Trigger

The pipeline sees green CI on a claude/ PR head (PIP-01).

## Owner

**Howard** (accountable for this flow end to end; each step names who does it).

## Inputs

- The PR diff and its item spec
- Howard's review criteria (what earns APPROVE or CHANGES, what is blocking)
- For a `fresh-review` item: Howard's fixed brief

## Steps

1. **Pipeline**: Requests a review from a separate Opus session (MRG-04), asking for `Review of <sha7>` first and the VERDICT last (MRG-03).
2. **Reviewer**: Reviews against the criteria and posts `VERDICT: APPROVE` or `VERDICT: CHANGES`; never starts a line with DESIGN OK or DESIGN CHANGES (MRG-07). A visible change without shots is CHANGES (MRG-05).
3. **Pipeline**: On CHANGES, starts a fix run (round 1 Sonnet, rounds 2 and 3 Opus: PIP-02); after three rounds labels the PR `stuck` (MRG-09).
4. **Howard**: For an item tagged `fresh-review` (KZ-16), briefs a reviewer with no history on the work from the fixed template, and sends findings to the work's owner.
5. **Howard**: Logs patterns that repeat across PRs in his findings log.

## Gates

- `VERDICT: APPROVE` naming the head sha7, newer than the head (MRG-02, checked in [FLOW-09](FLOW-09-merge.md)).

## Records

- PR review comments
- Howard's cross-PR findings log (project files, code-review/findings-log.md)
- #114 Waste comment for each redone run (PIP-15)

## Failure and escalation

- `stuck` after three rounds: Mike flags it (HC-01); a push that answers the findings clears it (MRG-09).
- Reviewers disagree on a fresh-review item: the owner of the work decides; a remaining disagreement goes to Saul's morning debrief (KZ-16).
- Workflow PRs get `stuck`, not a fix run; Gus drives them (PIP-03).

## Rules it runs on

- [MRG-04](../team/gus.md): separate reviewer
- [MRG-03](../team/gus.md): review request format
- [MRG-07](../reviews/README.md): no design lines
- [MRG-05](../reviews/README.md): shots required
- [PIP-01](../team/gus.md): event pipeline
- [PIP-02](../team/gus.md): fix-round models
- [MRG-09](../team/gus.md): labels
- [PIP-03](../team/gus.md): workflow PRs
- [KZ-16](../../ROADMAP.md): fresh review
- [DEC-20261020-k24-design-and-code-review](../DECISIONS.md): Code Review thread
- [HC-01](../team/mike.md): stuck PRs flagged

## Open questions for the owner of this flow

- Howard's criteria have no repo home yet (the charter and log are in project files). Where should the SOP link for them?

## Last confirmed by owner

Not yet.
