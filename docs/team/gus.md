# Gus (Build Pipeline)

- **I own:** Workflows, kickoff, auto-merge, shipping a release; The #114 body (owners edit only their own status line) (from the [Who does what](../kaizen/LEDGER.md#who-does-what) table).
- **I don't own, send to:** ROADMAP, planning passes, item specs, the queue, #232: send to Walter.
- **I never do:** Merge by hand; write a #114 rule change without Isaac's OK typed in the Gus thread; start a build during a hold; loosen a safety rule; read th.gl or use Game8; add license headers; put model ids in repo files.

The ledger ([docs/kaizen/ledger.csv](../kaizen/ledger.csv)) indexes these rules.

Each rule below is copied word for word from issue #114 (its body as of Oct 20, 3:48 PM ET); in it, "this issue", "here", "above" and "below" mean #114 and its sections.

## Merging

### MRG-02

_From #114 "Merge rule (AUTO since 2026-10-16 10:32Z, #115)"._

- `.github/workflows/auto-merge.yml` squash-merges any open `claude/*` PR to main when `ci-ok` is green on its head AND the latest claude[bot] comment says `VERDICT: APPROVE`, is newer than the head commit and (after #125) names the head's short SHA, e.g. first line `Review of abc1234`; then it dispatches CI on main (deploy, smoke, release).

### MRG-01 and MRG-09

_From #114 "Merge rule (AUTO since 2026-10-16 10:32Z, #115)"._

- Don't merge yourself and don't add merge To-dos, unless auto-merge fails. To hold a PR, add the label `hold`. A person who adds `hold` posts `HOLD: <condition> (owner: <name>)` on its own line in a plain PR comment at or after the last `hold` labeled event (not in the PR body or a review; if there are several, the last counts), and lifts it when the condition is met; with no HOLD comment, or when the owner has ended, the Release Planner (Walter) resolves it. The owner is a name to ping, not a verified identity: every session posts as the owner account. Auto-merge lifts only a hold it added itself (MRG-12); lifting a person's hold automatically would be a later Build Pipeline gate change with its own external review. Watchdog (Mike) pings the owner at the first health check after the condition has been met for 30 min, and Walter at 2 h; a condition Mike can check is one from the closed list `FRESH REVIEW OK`, `DESIGN OK`, Game Data Check `VERIFIED` or `VERDICT: APPROVE (reviewer: <name>)`, each naming the head's sha7; for any other condition (free text), the owner when the hold is 2 h old with no comment from them, and Walter at 4 h. Each ping is a #221 row (Fresh governance review, `fresh-governance-review/hold-owner-verdict.md`, 2026-10-21).

### MRG-03

_From #114 "Merge rule (AUTO since 2026-10-16 10:32Z, #115)"._

- Every review request must ask for first line `Review of <head sha7>` and last line `VERDICT: APPROVE` or `VERDICT: CHANGES`. The author reports that sha7 only after `git ls-remote origin refs/heads/<branch>` shows it as the branch tip (for an MCP push, the commit the tool returned); this catches mis-reports, not lag. Pushing without `-q` is optional; it keeps git's `old..new` line as a record of what moved (Gale; Fresh governance review, `fresh-governance-review/push-verify-verdict.md`, 2026-10-21).

### MRG-04

_From the ledger summary (no #114 text held it; written here 2026-10-20 at the Rules Steward's ask)._

- A separate reviewer that didn't write the work reviews every PR, on Opus: the pipeline's review run, never the build session itself. Code Review (Howard) sets what the review checks and what counts as BLOCKING; Gus sets when it runs, the model, and the verdict format and parser (2026-10-20 split). A criteria edit that drops or narrows a check is a loosening and needs Isaac's typed OK.

### MRG-12

_Named reviewers. Written here by Gus; the coordinator's incident fast path for automerge-race (#553, #615, #653, #664), 2026-10-20 8:37 PM ET, with Fresh governance review's conditions as the coordinator relayed them at 8:38 PM ET (sticky CHANGES, the pipeline review only in its own form, and the deadlock exit); Code Review (Howard) consulted; #665 (implied `lydia`) from the Rules Steward and Kaizen (Gale), 9:23 PM ET._

- A named reviewer writes `VERDICT: APPROVE`, `OK` or `CHANGES` with `(reviewer: <name>)` on the line, and names the head's short SHA in the comment. A named CHANGES blocks auto-merge until a later APPROVE or OK from the same name names the current head; a push does not clear it. Reviewers keep the marks the gates already parse: DESIGN OK / CHANGES is the Design Lead's (also `jane`), Game Data Check (ROL-03) VERIFIED / CHANGES / HOLD is Game Data Check's (also `gretchen`), and FRESH REVIEW OK / CHANGES is `fresh review` (a `FRESH REVIEW #<n>` note without a `FRESH REVIEW OK <sha7>` line counts as CHANGES); everyone else tags the VERDICT line, and only a comment's last tagged line counts. Verdicts are ordered by when they were posted, not when they were last edited. Tagged lines, FRESH REVIEW marks and clears are read only from the owner account (the account sessions post as), never from a claude[bot] comment, and never from a quoted line; a tagged verdict or a FRESH REVIEW OK counts for the head only when the head's short SHA is on that line. Every fresh reviewer shares the name `fresh review`, so the latest fresh note on a PR decides; a PR has one fresh reviewer, and a second fresh reviewer on the same PR posts a tagged `VERDICT: … (reviewer: <name>) on <sha7>` line, not a second FRESH REVIEW note, so one fresh OK can't clear another reviewer's CHANGES (Fresh governance review, 2026-10-21). DESIGN and Game Data Check marks count here only from the owner account and unquoted, like the tags. A PR body line `Reviewers: <name>, <name>` makes each named reviewer's approval of the head required, so that PR needs no `hold`. A body `Review:` line naming fresh, blind or external review does the same for `fresh review`: the PR waits for a `FRESH REVIEW OK <sha7>` on the head whether or not it carries `hold` (#695). When that line names external or blind review, no `REVIEW CLEAR` stands in for `fresh review`: only a real `FRESH REVIEW OK <sha7>` on the head meets it, and a stuck fresh reviewer goes to the coordinator, who takes it to Isaac (coordinator, #705). The deadlock exit stays for every other reviewer. The trigger is read from the whole `Review:` line, ROADMAP's `Review: external — 2` included; only a reviewer count such as `2 reviewers` is dropped first. Both reads match loose words and fail safe: any "fresh", "blind" or "external" on the line adds the fresh wait (even "standing (no fresh review needed)"), and any stray 2, 4b, 5 or 6 ("2 rounds") refuses a clear, so write the line as ROADMAP's form `Review: standing | blind | external — <trigger # or reason>` and nothing else. Game Data Check's own PRs (`claude/game-data-check-*`) that touch data, research or icon files skip the data check, so they always need Source Vetting (`lydia`) to approve the head, as if the body named Lydia (#665). A tagged APPROVE never counts as the pipeline review, which is only the claude[bot] comment that starts `Review of <sha7>`. A verdict sent only as a message to a session is not read. A reviewer reviews the SHA the author reported (MRG-03): fetch the branch and confirm its tip equals it (if the branch is ahead, review the newer tip or ask the author), and before reading the PR diff or files through the API confirm the PR head equals it, because GitHub updates `refs/pull/<n>/head` minutes after the branch. Re-check about once a minute; a lag past 10 min goes to Build Pipeline (Gus), as under PIP-04.
- Known limit: sessions post as the owner's account, so the tag is a trust marker, not authentication.
- Deadlock exit: for a reviewer who has ended, the coordinator posts `REVIEW CLEAR (reviewer: <name>; trigger: <n|none>): <reason>` on the PR. It is refused on triggers 2, 4b, 5 and 6, both when the clear names one and when the PR shows one (its body's `Review:` line names it, it carries `hold` or `fresh-review`, or it changes the save key or CHANGELOG.md); Watchdog (Mike) flags every clear and Kaizen (Gale) counts them. Like the tags, a clear is the comment's word, not a checked identity.
- Hold automation (#709, Isaac's typed OK 2026-10-21 9:37 AM ET: "auto-merge may add and lift hold per #709 and anything else like this moving forward"): auto-merge adds `hold` to a PR whose `Review:` line names external or blind review while a review it needs is missing on the head, and posts why with a marker comment. A `Reviewers:` line alone adds no hold, because the named check already blocks the merge. A hold that anyone ever removed is never added back. Auto-merge lifts only a hold it added itself: its last `hold` labeled event is by github-actions[bot] and its marker comment was posted at or after that event. A person's hold always stays with people (Watchdog, planner judgment, interim holds), whatever lines the PR has (Fresh governance review on #737). It lifts its own hold only when ci-ok is green on the head, a `FRESH REVIEW OK <sha7>` names the head, and every `Reviewers:` name approves the head with no CHANGES open. No `REVIEW CLEAR` counts while the hold is on. After a lift, auto-merge asks the pipeline for its review, and the merge still needs that APPROVE on the head and every other gate. A note in parentheses in the `Reviewers:` line, as in `Francesca (records, plan text)`, is ignored, commas included. To keep an auto-added hold past its reviews, a person removes it and adds it back: it is then a person's hold, and auto-merge never lifts it (Fresh governance review on #737). If the review auto-merge asks for after a lift dies without a comment, the Restart sweep starts it once more for that head; after that it is left for the Release Planner.

### MRG-10

_From #114 "Merge rule (AUTO since 2026-10-16 10:32Z, #115)"._

- Bot triggers: `@claude` = Opus, `@sonnet` = Sonnet. Bot runs end silently, so read their last comment.

From the queue marker comment under #114 "Next up (queue; the planner fills it, kickoff.yml starts from the top after each merge; live since #128)" (the comment stays in #114, kickoff reads it): "Never also start a queued item with an @ comment."

## Pipeline

### PIP-01

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)"._

- **Events, not polling.** `pipeline.yml` (after #125 merges) moves a claude/ PR the moment GitHub reports something: green CI -> review; red CI -> one re-run, then a fix run; VERDICT: CHANGES or "Needs @claude (Opus)" -> a fix run; max 3 fix rounds (models: Effort below), then label `stuck`. Bots open their own PRs. Auto-merge merges. The hourly planner does not nudge these steps.

### PIP-03

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)"._

- **Workflow PRs** (.github/workflows/) are driven by Build Pipeline (Gus), which has git push (bots can't push them); the pipeline labels them `stuck` instead of running a fix.

### PIP-04

_From #114 "Health check (owner design, 2026-10-17 5:51 AM ET; replaces the planner's stall failsafe)", from the "Restart is not a 15-min net (health check, 2026-10-17 11:24 AM ET, #222)" bullet._

- **No-CI PRs (PIP-04, Isaac, typed in the Gus thread 2026-10-19 12:50 PM ET):** Build Pipeline (Gus)'s PR check (every 20 min while a claude/ PR is open) dispatches Restart and catches an open claude/ PR whose head has no pull_request CI run 10 min after the push, and fixes it with a real push (update-branch), not a ci.yml dispatch, which doesn't satisfy branch protection. Check at the 0.8 review: 0 no-CI PRs over 15 min.

### PIP-05

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)"._

- **Usage cap:** the owner's plan limit is shared by the planner, the bots and his own chats. On a usage/rate-limit failure: set "Usage: capped (seen <time>)" above, start nothing new. After it clears: dispatch pipeline.yml (`pr`, `step`) for each PR whose step failed. Nothing is lost; state lives in GitHub.

### PIP-06 and PIP-02

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)", the Effort bullet; its last sentence ("Label `opus` forces Opus; `hold` stops a PR.") is part of MRG-09._

- **Effort:** mechanical steps = Actions, no model. Sonnet: docs, research, small data/UI fixes, fix round 1, the hourly planner. Opus (Max 20x, owner 2026-10-17 11:43 AM ET): every PR review, every minor planning pass, and src/core, saves/storage/migrations, gates, golden/mig1, tools/gen, data/schema, workflows, > 300 lines, fix rounds 2-3 (0.6 kaizen K7, PR #285), anything Sonnet hands up. Fix round 1 Sonnet, rounds 2-3 Opus (pipeline.yml). Before starting a Sonnet build, kickoff compares the issue's Files list with the Opus paths in `.github/routing/opus-paths.json` (the same list every Sonnet prompt stops on, PR #544); a match, or no readable Files list, starts it on Opus and logs a notice (PIP-06, PR #450). So does gen or golden work: a `gen` or `golden*` lane, or a spec that runs `npm run gen` or re-records goldens (PR #535). Label `opus` forces Opus; `hold` stops a PR.

### PIP-07 and PIP-08

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)"._

- **Parallel:** up to 3 builds in flight when independent (no shared serial files, docs/team/DISPATCH.md). Usage budget (owner, 2026-10-20 5:17 PM ET; readings once per minor, 5:20 PM ET): 3 is a fixed cap until the next minor's usage reading; a reading over the line drops it to 1 and the owner is told what paused (Kaizen (Gale) and Gus, 2026-10-20). Was 5 from 2026-10-17 11:43 AM ET (Isaac's Max 20x plan, PR #233). Raise one step at a time, only with a usage reading behind it. Releases run alone, after every item of the version is merged.

### PIP-15

_From #114 "Smart mode (owner, 2026-10-16 18:22 ET; replaces low power mode)", the "Plan to avoid failed or redone runs" bullet (moved 2026-10-20 at the Rules Steward's ask)._

- **One waste record (PIP-15, which merged PIP-13/14; Isaac, typed in the Gus thread 2026-10-19 4:56 PM ET):** the #114 Waste comments, one per failed or redone run with its link and cause, plus Build Pipeline (Gus)'s live `CI:` and `BUILD:` lines; Watchdog (Mike) totals them per release. Status notes no longer carry a `Waste:` count. A cause seen twice goes to Kaizen (Gale) as KIND RECURRED.

## Queue

### Q-05

_From #114 "Health check (owner design, 2026-10-17 5:51 AM ET; replaces the planner's stall failsafe)"._

- **After checks and versioned owner-ok keys (K12, Kaizen (Gale) 2026-10-18; kickoff PR #368, merged 8:22 AM ET):** kickoff runs the After check on every `[next]` line before it starts it and leaves an unmet or not-understood item in place with a log line. From 0.7 on an owner-ok key is `owner-ok-<minor>-<slug>` (patch items `owner-ok-<x.y.z>-<slug>`); any other owner-ok key on a 0.7+ item is not understood. A stalled item shows up in the health check's normal not-queued check. Retires the "Lane-only After key found: send it to Walter" special case (change 1, 5:34 AM ET).

### Q-10

_From #114 "0.6 kaizen changes (release kaizen review, PR #258; put in place 2026-10-17 11:30 PM ET, #222 rows K1–K9)"._

- **K9 golden lanes:** `golden-<folder>` per snapshot folder, `golden` for the rest (kickoff.yml and DISPATCH in PR #285). The planner uses the narrow lane on queue lines when an item only re-records one card.

### Q-13

_From #114 "Owners (Isaac, 2026-10-18 5:05 AM ET; replaces "Three parts, one team"; standing rules audit https://claude.ai/code/artifact/428cb4b3-b93f-4dbb-867f-6d697493dd98)", from the "Writers (C4–C7, C12)" bullet._

- only Build Pipeline (Gus) rewrites this issue's whole body; scheduled tasks and threads edit only their own status line (one PATCH changing just that line, on a body read right before) or send changes to Gus.

## Roles

### ROL-01

_From #114 "Owners (Isaac, 2026-10-18 5:05 AM ET; replaces "Three parts, one team"; standing rules audit https://claude.ai/code/artifact/428cb4b3-b93f-4dbb-867f-6d697493dd98)"._

Each rule lives in one place, owned by one thread; others point to it instead of copying it.
| Thread | Owns |
| --- | --- |
| Coordinator (Saul) | Routing. The morning debrief (K15): every OK and question waiting on Isaac, with copy boxes and the thread to type in. Hard-blocker alerts. Keeping the Notify id current |
| Build Pipeline (Gus) | GitHub workflows, auto-merge, kickoff, restart, the merge rule. The PR check (PR OPENED and MERGED notices, the no-CI catch). Shipping releases under the standing ship OK. Sole whole-body writer of this issue. Sends any owner decision it hears about to Release Planner (Walter). Build limits: lanes, 3 in flight, model routing, fix rounds |
| Release Planner (Walter) | ROADMAP and the path to 1.0, per-item plans, planning passes, the planner task and its instructions (sole editor), the queue, the planner log (#232), stall limits, starting research gates, owner questions at plan merge, recording owner decisions in docs/DECISIONS.md (owner, typed 2026-10-18 11:13 AM ET in the Gus thread) |
| Watchdog (Mike) | The hourly health check: what counts as a stall, the checks (gates, Restart misses, lane-only keys, owner questions that gate a merge), first fix, checking that every clock and owner thread is alive; the stall log (#221): row format, kinds, cause tags, waste rows, per-release error reports |
| Kaizen (Gale) | The kaizen log (#222), the kaizen reviews (release-based), rule changes by Isaac's rule (evidence, a check the next review tests, one per kind of problem, a graded rule audit each review: keep / tighten / loosen / merge / retire, with evidence), the usage scorecard, verifying and reverting changes |
| Rules Steward (Francesca) | The rules and decisions ledger (docs/kaizen/ledger.csv, LEDGER.md): each rule's one home and owner, the work-type-to-owner routing table, the memory-drift sweep and roster check on each merge that changes a rule or decision (Isaac, Kaizen thread 2026-10-19 3:04 PM ET) |
| Team Audit for 1.0 (Gomez) | The 1.0 team audit: every thread's role, overlap, ownership and routing, graded against real-world equivalents (Isaac, 2026-10-19 1:57 PM ET) |
| Design Lead (Jane) | Mockups, look-and-feel rules, DESIGN OK and DESIGN CHANGES |
| Tracker Design (Skyler) | Tracker page design and code, the checker script, page size |
| Tracker Sync (Huell) | Sole writer of tracker data: cards, To-dos, decisions and acks, versions, Scrapbook. The field formats, release titles, one status rule, "one blocked write pauses only itself" |
| Source Vetting (Lydia) | The only open-web thread. The sources list, the fetching policy, robots and terms checks, the allowed-domains list |
| Game Data Check (Gretchen) | Fact checks against allowed sources, the two-source and claims-labelling rules, spot audits of the guide to Lv 45 |
| Player Testing (Jesse) | Playing daevacompanion.com on phone and desktop: a full play per minor release, a delta check per patch (full play at 3+ visible items), no weekly run; confusing steps, dead ends, layout bugs; the live-version check |
