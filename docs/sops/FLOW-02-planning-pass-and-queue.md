# FLOW-02: Planning pass and queue

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Plan the next minor (0.X.0) under the rules the kaizen review just set, get the plan reviewed, and fill the build queue.

## Trigger

Kaizen (Gale) sends `KAIZEN REVIEW DONE <minor>` naming the audit file (KZ-10). Patches skip this flow (PLN-20); see [FLOW-11](FLOW-11-patch-release.md).

## Owner

**Walter** (accountable for this flow end to end; each step names who does it).

## Inputs

- The kaizen review and its scorecard ([FLOW-17](FLOW-17-kaizen-review.md))
- Open planning inputs ([FLOW-01](FLOW-01-idea-to-plan-item.md))
- ROADMAP.md "How a minor is planned" (steps 2 to 6)
- [docs/plans/SPEC-TEMPLATE.md](../plans/SPEC-TEMPLATE.md)

## Steps

1. **Walter**: Audits the path to 1.0, then the minor (PLN-05).
2. **Walter**: Shapes each item (PLN-06) and tags `fresh-review` items (KZ-16). Research and owner gates are listed and research starts now (Q-08).
3. **Walter**: Lays out waves and lanes: real dependencies only in After lines (Q-03), the kickoff grammar (Q-07), the critical path through ungated items (Q-09), one module or serial file per lane (Q-11).
4. **Walter**: Lists owner input: only true blockers become To-dos (PLN-07), through [FLOW-14](FLOW-14-owner-decision.md). For a minor with visible changes, asks Saul to start a Design Critic ([FLOW-05](FLOW-05-design-review.md)).
5. **Walter**: Writes the plan into ROADMAP.md and the item specs in one PR (PLN-11), one open PR per shared doc (Q-12).
6. **Reviewer**: A separate session that did not write the plan reviews it, including every item key and After token (Q-07).
7. **Auto-merge**: Merges the plan PR ([FLOW-09](FLOW-09-merge.md)).
8. **Huell**: Copies the merged plan into the tracker as planned cards (TRK-03).
9. **Walter**: Queues the items in #114, top of the lane map first (Q-01, Q-02), with versioned owner-ok tokens (Q-04), and writes the #232 row for the pass.

## Gates

- `KAIZEN REVIEW DONE <minor>` before any planning (KZ-10, PLN-02).
- Plan reviewed by a separate session before anything is queued (PLN-01, PLN-11).
- The build go: before 1.0 the standing OK covers each reviewed plan (DEC-20261020-standing-ok-until-1-0).

## Records

- ROADMAP.md, the minor's section; `docs/plans/<minor>/`
- Item issues and the #114 queue lines
- Planner log #232: one row per pass
- Tracker planned cards (Huell)

## Failure and escalation

- Queue idle 10 min with nothing building: Mike sends Walter QUEUE IDLE (HC-07).
- A mid-minor question that gates a queued item: a HARD BLOCKER through [FLOW-14](FLOW-14-owner-decision.md).
- A gated item without its typed OK goes to the end of the queue and holds no lane (Q-09).

## Rules it runs on

- [KZ-10](../DECISIONS.md): starts on the kaizen review
- [PLN-02](../../ROADMAP.md): kaizen gates planning
- [PLN-01](../../ROADMAP.md): the pass
- [PLN-05](../../ROADMAP.md): step 2
- [PLN-06](../../ROADMAP.md): step 3
- [KZ-16](../../ROADMAP.md): fresh-review tags
- [Q-03](../../ROADMAP.md): After lines
- [Q-07](../../ROADMAP.md): kickoff grammar
- [Q-08](../../ROADMAP.md): research gates
- [Q-09](../../ROADMAP.md): critical path
- [Q-11](../../ROADMAP.md): lanes
- [PLN-07](../../ROADMAP.md): owner input
- [PLN-11](../../ROADMAP.md): step 6
- [Q-12](https://github.com/HackTheMeatball/daeva-companion/issues/222): one PR per shared doc
- [Q-01](../team/walter.md): queue format
- [Q-02](https://github.com/HackTheMeatball/daeva-companion/issues/222): queue line in each item issue
- [Q-04](../../ROADMAP.md): versioned owner-ok tokens
- [TRK-03](../team/huell.md): planned cards
- [PLN-20](../../ROADMAP.md): patches skip it
- [DEC-20261020-standing-ok-until-1-0](../DECISIONS.md): build go before 1.0

## Last confirmed by owner

2026-10-21, by Walter.
