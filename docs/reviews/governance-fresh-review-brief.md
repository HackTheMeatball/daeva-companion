# Governance fresh-review brief (fixed template)

Owner: Fresh governance review (Ted). Drafted by Ted on 2026-10-22 in the shared folder
(`fresh-governance-review/verdicts.md`, DRAFT 1 with DRAFT 2's changes, after the Review Broker's feedback); homed here
by the Rules Steward (Francesca) as neutral writer. The template gap was raised in the Review Broker's log
(`reviews/broker-log.md`, shared folder).
Evidence it answers (broker-log backfill B1–B5, C): 4 of 5 briefs carried an opinion or an unverified claim. B1 relayed
the author's pushback and a "known flake" claim. B3 relayed a third party's finding. B5 told the reviewer to consult
the standing reviewer. All five summarized the work in the router's words. None had a baseline slot, and one reviewer was
reused across unrelated works.

### Rules for whoever fills it (broker, or coordinator for a planned item)
1. Fill only the `<...>` slots and change no other word. Each slot is **copied** from the record (PR body, diff, ledger,
   DECISIONS, the owner's message by id), never summarized or paraphrased.
2. Never put in the brief: anyone's view or finding on the work (author, standing reviewer, Rules Steward, a bot, a
   prior reviewer, the router), any claim about tests or CI ("known flake", "main CI is the reference"), any instruction
   to consult or agree with a person, or any word of emphasis ("note that", "watch for", "weigh"). If you think something
   matters, it either fits a slot from the record or it stays out.
3. A one-off gets **one work**. The same reviewer may re-review that same PR at a new head. Any other PR, follow-up
   PRs that apply its own nits included, gets a new no-history reviewer (trigger 5).
   For an audit or re-check, the work is the one audit its Items slot names; its items aren't separate works.
4. Code inside the change (workflows, scripts, tests) also gets a code review from Code Review's fixed brief, unchanged
   and as a separate review. The Review Broker briefs it on an unplanned change; Code Review (Howard) briefs it on a
   planned item.
5. Lint before sending. The brief text outside the slots must match this template byte for byte, and the slots must hold
   only copied text plus links. The broker logs "template-only: yes" in broker-log.md, or the brief doesn't go out.

### The brief

> You are a fresh governance reviewer for Daeva Companion. You have no history on this work, and that is the point. If
> the record shows you authored, reviewed, briefed or commented on it or the rules it changes, stop and say so.
>
> **Work:** `<PR #number at head sha7, title; or the proposal/plan file path and version>`.
> **Kind:** `<rule change | process change | plan | decision record | role or hire | audit or re-check>` (one or more).
> **Triggers that applied:** `<numbers from ROADMAP "How a minor is planned" step 3 Review level, copied>`.
> **Rules it touches:** `<each ledger id with its row, copied from docs/kaizen/ledger.csv; and each home file:section>`.
> **Owner's own words behind it:** `<each quote with its message id, or "none: a team rule">`.
> **Baseline:** `<main at the merge base (sha7); for a rule edit, the rule's text on main, copied>`.
> **Files to skip until your list is sent:** `<paths: the author's notes, rationale files, the PR conversation, prior reviews of this work; or "none">`.
> **Items to check** (audit or re-check only): `<the list, copied from the record (PR numbers with head sha7, ledger ids or file:line), and who asked for the check>`.
>
> 1. Read `CLAUDE.md`, ROADMAP "How a minor is planned", `docs/DECISIONS.md` (the "seven owner-only limits" row first),
>    `docs/kaizen/ledger.csv`, then the diff or file and every file it touches.
> 2. Read each owner quote by its message id. Say whether it matches word for word and whether the work claims more
>    than the words say (a question read as an OK, a hedge dropped, team wording presented as the owner's).
> 3. Check every change against the full rule set for overlap **and** conflict, not only duplicates. For each, name the
>    rule ids you checked it against.
> 4. Say whether it loosens, narrows or removes anything under an owner-only limit. If it does, it goes to Isaac and
>    can't pass here.
> 5. Check that what the text says exists does exist: files, ids, scripts, tests, CI checks. A rule that depends on
>    mechanics not yet built must say what happens until they are.
> 6. Compare with how a well-run real company would handle it, facts only. Label each fact counted (from a cited
>    record) or inferred (with the reason).
> 7. Read CI on the head yourself. Don't take anyone's word for it.
> 8. When your list is written, you may open the skipped files. Anything you add after that is marked "added after
>    reading the record".
>
> Reply as one GitHub comment (PR work) or one message (file work):
> - First line `FRESH REVIEW #<number> <sha7>`, or `PROCESS REVIEW <id>` / `PLAN REVIEW <id>`.
> - **Blocking**, then **Non-blocking**, each with file:line or the rule id.
> - `Conflicts checked:` the rule ids.
> - `Owner-held limits:` untouched, or what is touched.
> - Last line `FRESH REVIEW OK|CHANGES <sha7>` (or `PROCESS REVIEW <id> OK|CHANGES|UNSURE`, `PLAN REVIEW <id> OK|CHANGES`),
>   then the Claude Code footer.
>
>
> For the audit or re-check kind, write instead to `<output file path>`: first line `AUDIT <id>`; one row per item (item,
> finding, counted or inferred, evidence link); last line `AUDIT <id> DONE`; no gate line (no `FRESH REVIEW OK|CHANGES`),
> since merged work has no gate.
>
> Never write a line a merge gate reads other than that last line: no `VERDICT`, no `DESIGN OK` / `DESIGN CHANGES`, no
> `HOLD:`. Don't push, merge or label, and edit no file other than the audit's output file.

### After the review
- The verdict goes to the work's owner, with a copy to the broker for broker-log.md. A finding the owner disputes isn't
  settled by the reviewer or the broker. Each side writes its view, the work is revised once and re-reviewed, and Isaac
  sees it only on UNSURE, as one card (DECISIONS row "Every review is triaged…", amended 2026-10-20 10:19 PM ET,
  kz16-disagreement-route).
- Changing this template is a change to review criteria. Dropping or narrowing a slot, a rule or a step is under owner-only
  limit (7) and goes to Isaac. Tightening one goes through the process-change procedure, with an outside review by someone other than the owner.
