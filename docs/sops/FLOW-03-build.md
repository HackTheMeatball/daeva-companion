# FLOW-03: Build (kickoff to PR)

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Start the next queued item on the right model, build it on its own claude/ branch and open a tested PR.

## Trigger

Kickoff runs after each merge to main and when a thread dispatches it (`kickoff.yml`).

## Owner

**Gus** (accountable for this flow end to end; each step names who does it).

## Inputs

- The #114 queue (`[next]` lines)
- The item issue and its spec
- `.github/routing/opus-paths.json`

## Steps

1. **Kickoff**: Checks the top `[next]` line's After keys and owner-ok tokens (Q-05) and the spec's inputs on main (PIP-19); an unmet item stays in place with a log line.
2. **Kickoff**: Picks the model (PIP-06), respects the builds-in-flight cap (PIP-07), starts the build and rewrites the line to `[started <time>]` (Q-01).
3. **Requesting thread**: Any thread that dispatched kickoff by hand sends Huell `KICKOFF DISPATCHED` (PIP-16) and reports the hand dispatch to Mike, who logs it (NEW-02).
4. **Builder**: Builds on a `claude/` branch, runs `npm test` green before each commit (REPO-01), pushes after each step of a long item (PIP-11), and keeps to run hygiene (PIP-18).
5. **Builder**: Opens the PR (MRG-11) with before/after shots and `scrapbook.json`, or "No visible change" (MRG-05).
6. **Gus**: Gus's PR check sees the new PR (CLK-01) and fixes a PR with no CI run by a real push (PIP-04).
7. **Huell**: Moves the item card to working (TRK-03).

## Gates

- After check and versioned owner-ok (Q-05, Q-04).
- Tests green before every commit (REPO-01).
- No build starts during a hold or a usage cap (PIP-05).

## Records

- #114 queue line (`[started]`)
- The Kickoff and build runs in Actions
- The PR
- #114 Waste comment for a failed or redone run (PIP-15)

## Failure and escalation

- Build past its stall limit (PIP-09) or no PR: Mike's health check ([FLOW-12](FLOW-12-incident-and-stall.md)).
- Usage cap: mark capped, start nothing, re-dispatch after (PIP-05).
- Spec unclear or blocked: a "Blocked:" comment; Walter re-specs.

## Rules it runs on

- [Q-05](../team/gus.md): After check
- [Q-04](../../ROADMAP.md): owner-ok tokens
- [PIP-19](../plans/SPEC-TEMPLATE.md): spec inputs on main
- [PIP-06](../team/gus.md): model routing
- [PIP-07](../team/gus.md): builds in flight
- [Q-01](../team/walter.md): queue line rewrite
- [PIP-16](../team/team-wide.md): KICKOFF DISPATCHED
- [NEW-02](https://github.com/HackTheMeatball/daeva-companion/issues/221): hand edits logged
- [REPO-01](../../CLAUDE.md): tests before commit
- [REPO-02](../../CLAUDE.md): own claude/ branch
- [PIP-11](../team/walter.md): long builds
- [PIP-18](https://github.com/HackTheMeatball/daeva-companion/issues/222): run hygiene
- [MRG-11](../team/team-wide.md): opening the PR
- [MRG-05](../reviews/README.md): shots or "No visible change"
- [CLK-01](../DECISIONS.md): Gus's PR check
- [PIP-04](../team/gus.md): no-CI PRs
- [PIP-05](../team/gus.md): usage cap
- [PIP-09](../team/walter.md): stall limits
- [PIP-15](../team/gus.md): waste record
- [TRK-03](../team/huell.md): item cards

## Last confirmed by owner

Not yet.
