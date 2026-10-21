# FLOW-23: Architecture change

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Change the state model, save keys, data format, build or module structure without breaking saves, the generator or the single-file build.

## Trigger

A planned item's files include `src/core/`, saves or storage, `tools/gen`, `data/schema/`, the build scripts or the module layout; or a planning pass finds a performance budget within 20% of its limit (PLN-05).

## Owner

**Gus** (accountable for this flow end to end; each step names who does it), from when Gus's relay work moves to Actions (coordinator's decision, on Org Design's evidence). Howard reviews changes against it; the data rules stay with Gretchen. Until then Who does what has no architecture row; Francesca adds it when the change takes effect, and Walter writes the DECISIONS row (DEC-01).

## Inputs

- [docs/ARCHITECTURE.md](../ARCHITECTURE.md)
- [docs/DATA-FORMAT-V2.md](../DATA-FORMAT-V2.md) and `data/schema/`
- The saves rule in [CLAUDE.md](../../CLAUDE.md)

## Steps

1. **Walter**: In the planning pass, audits architecture and budgets (PLN-05) and shapes the item with its owned files (PLN-06); a save or storage key change is tagged `fresh-review` (KZ-16).
2. **Kickoff**: Starts it on Opus when its files hit an Opus path (PIP-06). A change only to `src/*.js` (module layout, a performance budget) hits no Opus path: `src/*.js` stays off the Opus paths (Gus, 2026-10-21); an architecture item is to start on Opus by its lane once Gus's pipeline change for it lands (not on main yet).
3. **Builder**: Builds it per ARCHITECTURE.md; a save break bumps the key and notes it in the CHANGELOG (REPO-04); runs `npm test` (REPO-01).
4. **Reviewer**: Reviews it ([FLOW-04](FLOW-04-code-review.md)); Howard briefs a fresh reviewer for a tagged item.
5. **Gus**: Keeps ARCHITECTURE.md and the code-readability standard current with what merged, and answers architecture questions from builders and reviewers (from when the owner change in the Owner section takes effect).

## Gates

- Code review APPROVE ([FLOW-04](FLOW-04-code-review.md)), and a fresh review for a save or storage key change (KZ-16).
- Tests green, including the save suites (REPO-01).

## Records

- docs/ARCHITECTURE.md
- CHANGELOG "Saves reset in this version" line, when saves break

## Failure and escalation

- A save that fails to load must start fresh, never crash (REPO-04); a regression goes to [FLOW-12](FLOW-12-incident-and-stall.md).

## Rules it runs on

- [PLN-05](../../ROADMAP.md): architecture and budget audit
- [PLN-06](../../ROADMAP.md): item shape
- [PIP-06](../team/gus.md): Opus paths
- [KZ-16](../../ROADMAP.md): fresh review for key changes
- [REPO-04](../../CLAUDE.md): saves before 1.0
- [REPO-01](../../CLAUDE.md): tests
- [DEC-20261016-saved-progress-before-1-0](../DECISIONS.md): clean breaks allowed

## Open questions for the owner of this flow

- Who covers this flow until the relay work moves to Actions?

## Last confirmed by owner

Not yet.
