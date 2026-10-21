# FLOW-05: Design review

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Check every look against the design checklist before it reaches Isaac or players: a Design Critic pass on each minor's mockups, and Jane's DESIGN OK on every PR that changes what a player sees.

## Trigger

Two entry points: (a) Jane's mockups for a minor with visible changes are ready ([FLOW-02](FLOW-02-planning-pass-and-queue.md) step 4); (b) a PR commits a `docs/reviews/<minor>-<item>-shots/` folder.

## Owner

**Holly** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/design/review-checklist.md](../design/review-checklist.md)
- The mockups or the PR's before/after shots and `scrapbook.json`
- The baseline (what Isaac sees today)
- Holly's charter, docs/team/holly.md (in PR #668, not yet on main): the tie-break, and that Holly's review adds no new merge gate

## Steps

1. **Saul**: (a) Starts a one-off Design Critic thread that took no part in the design (DEC-20261019-design-critic-reviews-a-minor).
2. **Holly**: (a) Briefs it from the fixed template: the checklist, the work, its acceptance line and its baseline, nothing from the author.
3. **Design Critic**: (a) Reviews the mockups and sends findings to Jane and to Saul's morning debrief.
4. **Holly**: (a) and (b) After Jane's own pass, reviews the mockups or shots against the checklist from a named baseline (K26 in [docs/kaizen/0.8-scorecard.md](../kaizen/0.8-scorecard.md), section 7). Names every removal of something Isaac sees, with "bring back" as the default. Sends findings to Jane, numbered, each starting `DESIGN REVIEW:`. (a) Mockups wait for this review before Jane hands them to Walter. (b) On a PR it may land after merge; agreed findings ride the next PR.
5. **Jane**: (a) Answers each finding in writing, then gives the final look OK (ROADMAP step 5).
6. **Jane**: (b) Checks the PR's shots against the checklist and comments `DESIGN OK on <sha7>` or `DESIGN CHANGES on <sha7>` (MRG-06).
7. **Holly**: (b) For a `fresh-review` item (KZ-16), writes the fresh reviewer's brief from the same template, sends it to Saul, and logs the findings.
8. **Saul**: (b) Checks that the brief's slots hold no opinion, then starts the fresh-review thread.
9. **Huell**: After merge, publishes the PR's scrapbook cards (TRK-07).

## Gates

- `DESIGN OK on <sha7>` on a shots PR head; auto-merge waits for it (MRG-06).
- Jane's written answer to every Design Critic finding before the final look OK.

## Records

- The Design Critic's findings and Jane's answers
- PR comments (DESIGN OK / CHANGES)
- Holly's findings log
- The Scrapbook (tracker)

## Failure and escalation

- `DESIGN CHANGES` starts a fix run (MRG-06).
- A removal of something Isaac sees is named in the review summary and in Jane's decision note. A contested removal does not go ahead unless an outside reviewer with no history on that look agrees; Holly never accepts a removal because the team decided it.
- Reviewers disagree: the morning debrief (KZ-16).
- A merged `fresh-review` item with no fresh-review note: Mike flags it as `review-skipped` (KZ-16).

## Rules it runs on

- [DEC-20261019-design-critic-reviews-a-minor](../DECISIONS.md): Design Critic
- [DEC-20261020-k24-design-and-code-review](../DECISIONS.md): Design Review thread
- [KZ-16](../../ROADMAP.md): fresh review
- [MRG-05](../reviews/README.md): shots and scrapbook
- [MRG-06](../reviews/README.md): DESIGN OK hold
- [MRG-07](../reviews/README.md): code reviewers stay out
- [MRG-08](../DECISIONS.md): visible changes merge without Isaac
- [COM-14](../DECISIONS.md): no unrequested redesign
- [TRK-11](../reviews/README.md): mockups in the gallery
- [TRK-07](../team/huell.md): Scrapbook publish

## Open questions for the owner of this flow

- Reviewer disagreement: Holly's charter (docs/team/holly.md, PR #668) sends it through an outside review, with only an UNSURE reaching Isaac as one card. KZ-16's home still sends it to the morning debrief, so this page follows the home until the home changes; Holly raises it with Gale ([FLOW-15](FLOW-15-process-change.md)).

## Last confirmed by owner

2026-10-21, by Holly.
