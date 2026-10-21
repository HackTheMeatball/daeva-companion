# FLOW-01: Idea to plan item

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Turn an idea, a design ask, a player finding or a reported problem into a planning input that is decided at the next planning pass, so nothing is built straight from a comment.

## Trigger

Any of: a design or product ask from Isaac; a player finding issue from a play ([FLOW-20](FLOW-20-player-testing.md)); an idea or bug routed by Beta Program ([FLOW-13](FLOW-13-outside-report-intake.md)); a gap found by a review or audit. A data correction is not an idea: it goes to [FLOW-06](FLOW-06-data-fact-verification.md).

## Owner

**Walter** (accountable for this flow end to end; each step names who does it).

## Inputs

- The ask, finding or report, with its link
- ROADMAP.md (where the path to 1.0 stands)
- [docs/plans/SPEC-TEMPLATE.md](../plans/SPEC-TEMPLATE.md) when it becomes an item

## Steps

1. **Requesting thread**: Sends the idea to Walter, with its source link. A research ask from any thread goes into Walter's single ranked research queue. A design ask from Isaac goes to Walter and Jane together (PLN-12).
2. **Walter**: Files it as a planning input (an issue, or a line in the next minor's ROADMAP section) with a target version. It is not queued.
3. **Walter**: At the next planning pass ([FLOW-02](FLOW-02-planning-pass-and-queue.md)), decides every open input: plan it, fold it into an item, defer it or close it, with a reason (PLN-16).
4. **Walter**: For a planned input, writes the item in the shape the pass requires (PLN-06, PLN-25), naming any live dependency (NEW-01). A new look goes in the next minor unless Isaac says "now" (PLN-15).
5. **Walter**: Tells the requesting thread what was decided.

## Gates

- Nothing is queued outside a reviewed planning pass (PLN-01).
- A player finding is never queued directly (PLN-22).

## Records

- The planning-input issue or ROADMAP line
- The decision on it in the planning pass (ROADMAP.md, the minor's section)

## Failure and escalation

- An input left undecided for two passes: Gale raises it at the kaizen review ([FLOW-17](FLOW-17-kaizen-review.md)).
- An ask that is really a rule or team change goes to [FLOW-15](FLOW-15-process-change.md) instead.

## Rules it runs on

- [PLN-12](https://github.com/HackTheMeatball/daeva-companion/issues/222): design asks
- [PLN-16](https://github.com/HackTheMeatball/daeva-companion/issues/222): every finding decided
- [PLN-22](../team/jesse.md): findings are inputs, not queue lines
- [PLN-15](../DECISIONS.md): new looks wait for a minor
- [PLN-06](../../ROADMAP.md): item shape
- [PLN-25](../../ROADMAP.md): how an objective is worked
- [NEW-01](../../ROADMAP.md): live dependencies
- [PLN-01](../../ROADMAP.md): nothing queued before the pass

## Last confirmed by owner

2026-10-21, by Walter.
