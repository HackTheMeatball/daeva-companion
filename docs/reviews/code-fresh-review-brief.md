# Code fresh-review brief (fixed template)

Code Review (Howard) owns this template (DECISIONS 2026-10-20, K24). A `fresh-review` code item is a pipeline,
merge-gate or workflow change, a save or storage key change, or a release PR (ROADMAP "Fresh review"). It gets one
review from a thread with no history on the work, briefed with exactly the text below and nothing else: no opinion
from the author, from Code Review or from anyone who built or reviewed the work. Code Review fills in only the
`<...>` fields, copied from the PR and its spec, and changes no other word. A change to this template is a change to
the review criteria: if it drops or narrows a check, it needs the owner's typed OK.

## The brief

> You are a fresh code reviewer for Daeva Companion. You have no history on this work, and that is the point.
>
> **Work:** PR #`<number>` at head `<sha7>`: `<PR title>`. Spec: `<link to the item spec, or "none">`.
> **Acceptance line:** `<the spec's acceptance checklist, copied as is>`.
> **Baseline:** `<main at the PR's merge base, plus the owner's own words that asked for this work, quoted with a link>`.
>
> 1. Read `CLAUDE.md`, then the PR's diff and the files it touches.
> 2. Check it against the review criteria: the `Check:` line of the review prompt in `.github/workflows/pipeline.yml`
>    and every rule in `CLAUDE.md`.
> 3. Compare it with the baseline. Name everything that is missing, removed or changed relative to it, even if the
>    change looks intended. Never assume a removal is justified: name it.
> 4. For a pipeline, gate or parser change: name each gate it interacts with and say whether a test runs them
>    together (Kaizen K21).
> 5. For a save or storage key change: say whether the CLAUDE.md save rule holds (key bump, CHANGELOG line, no old-shape
>    read, a fresh-start test).
>
> Reply with one note: first line `FRESH REVIEW #<number> <sha7>`, then findings, majors first, each marked `MAJOR` or
> `MINOR` with `file:line`, then a line `Missing against baseline:` listing each item (or `none`). Never write a line
> that a merge gate reads: no `VERDICT`, no line starting `DESIGN OK` or `DESIGN CHANGES`, and no
> `Game Data Check (ROL-03)` line. Don't push, merge or comment on GitHub.

## After the review

- The note goes to the work's owner and a copy goes to Code Review. Code Review posts it on the PR as one comment
  that starts `FRESH REVIEW #<number> <sha7>`. That comment is the fresh-review note that Watchdog (Mike)'s
  `review-skipped` check looks for.
- A finding the owner disputes is not settled by Code Review or the fresh reviewer. It goes to the owner in the
  morning debrief.
- Code Review logs each major finding the standing review missed, for K24's check at the 0.9 review.
