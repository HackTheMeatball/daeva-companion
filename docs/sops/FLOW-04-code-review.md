# FLOW-04: Code review

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Every PR is reviewed by a session that did not write it, against Howard's criteria, and fixed until it is approved or marked stuck.

## Trigger

The pipeline sees green CI on a claude/ PR head (PIP-01).

## Owner

**Howard** (accountable for the criteria, steps 4–5 and the brief; Gus owns the pipeline steps; each step names who does it).

## Inputs

- The PR diff and its item spec
- Howard's review criteria: the `Check:` line of the review prompt in [.github/workflows/pipeline.yml](../../.github/workflows/pipeline.yml)
- For a `fresh-review` item: Howard's fixed brief, [docs/reviews/code-fresh-review-brief.md](../reviews/code-fresh-review-brief.md)
- Howard's charter, [docs/team/howard.md](../team/howard.md)

## Steps

1. **Gus**: The pipeline requests a review from a separate Opus session (MRG-04), asking for `Review of <sha7>` first and the VERDICT last (MRG-03).
2. **Reviewer**: Reviews against the criteria and posts `VERDICT: APPROVE` or `VERDICT: CHANGES`; never starts a line with DESIGN OK or DESIGN CHANGES (MRG-07). A visible change without shots is CHANGES (MRG-05).
3. **Gus**: On CHANGES, the pipeline starts a fix run on the models PIP-02 sets; after three rounds labels the PR `stuck` (MRG-09).
4. **Howard**: For a code item at review level `blind` (trigger 6, or any item raised to blind; KZ-16), writes the fresh note as one PR comment starting `FRESH REVIEW #<n> <sha7>`, ending `FRESH REVIEW OK <sha7>` when clean. A trigger-1 item is `external`: an outside reviewer writes the note and Howard is consulted. Findings go to the work's owner. Only automation or Walter removes `hold` ([FLOW-09](FLOW-09-merge.md)).
5. **Howard**: Logs patterns that repeat across PRs in Howard's findings log.

## Gates

- `VERDICT: APPROVE` naming the head sha7, newer than the head (MRG-02, checked in [FLOW-09](FLOW-09-merge.md)).
- For a held item, or any PR with a FRESH REVIEW note, `FRESH REVIEW OK <sha7>` naming the head (MRG-12).

## Records

- PR review comments
- Howard's cross-PR findings log (`code-review/findings-log.md` in the project's shared folder)
- Howard's handover (`code-review/handover.md` in the project's shared folder; state only)
- #114 Waste comment for each redone run (PIP-15)

## Failure and escalation

- `stuck` after three rounds: Mike flags it (HC-01); a push that answers the findings clears it (MRG-09).
- Reviewers disagree on a fresh-review item: the outside-review route in KZ-16's home; only an UNSURE, or a disagreement after one revision, reaches Isaac as one card from the coordinator (KZ-16).
- A merged `fresh-review` item with no fresh-review note: Mike flags it as `review-skipped` (KZ-16).
- Workflow PRs get `stuck`, not a fix run; Gus drives them (PIP-03).

## Rules it runs on

- [MRG-04](../team/gus.md): separate reviewer
- [MRG-03](../team/gus.md): review request format
- [MRG-07](../reviews/README.md): no design lines
- [MRG-05](../reviews/README.md): shots required
- [PIP-01](../team/gus.md): event pipeline
- [PIP-02](../team/gus.md): fix-round models
- [MRG-09](../team/gus.md): labels
- [MRG-12](../team/gus.md): named reviewers
- [PIP-03](../team/gus.md): workflow PRs
- [KZ-16](../../ROADMAP.md): fresh review
- [DEC-20261020-k24-design-and-code-review](../DECISIONS.md): Code Review thread
- [HC-01](../team/mike.md): stuck PRs flagged

## Last confirmed by owner

2026-10-21, by Howard.
