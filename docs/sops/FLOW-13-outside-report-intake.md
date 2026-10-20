# FLOW-13: Outside report intake

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Take in everything players and beta testers report, route each item to its owner, and tell the reporter what happened, without exposing tester data.

## Trigger

A new GitHub issue from *Report a problem* (`.github/ISSUE_TEMPLATE/`), or a beta tester report through a channel Isaac named.

## Owner

**Ernesto** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/team/support.md](../team/support.md) (checklist)
- [PRIVACY.md](../../PRIVACY.md) "Beta testers"
- Beta program charter (project files)

## Steps

1. **Ernesto**: Reads, dedupes and labels it (`bug`, `data`, `feature`, `ux`); reproduces a bug at the reported version, level and quest.
2. **Ernesto**: Routes it: data to Gretchen with the reporter's source ([FLOW-06](FLOW-06-data-fact-verification.md)), bugs and saves to Gus with a reproduction, look and layout to Jane, ideas to Walter as planning inputs ([FLOW-01](FLOW-01-idea-to-plan-item.md), PLN-16).
3. **Ernesto**: Replies to the reporter without promising dates or features, and closes the loop when the owner acts.
4. **Ernesto**: Keeps tester data out of public places: testers are T1, T2 in public; raw reports only in the private repo, deleted on schedule (PRIVACY.md).
5. **Ernesto**: Once per release, summarises counts by label and anything urgent for Saul's debrief.

## Gates

- A tester's data claim ships only after Gretchen's check (REPO-05).

## Records

- Issue labels and replies
- Private repo for raw beta reports
- The beta program log (project files)

## Failure and escalation

- Urgent breakage (saves, site down): to Gus at once and to Mike as a stall.
- Personal data posted publicly by a reporter: hide or edit it and follow PRIVACY.md.

## Rules it runs on

- [PLN-16](https://github.com/HackTheMeatball/daeva-companion/issues/222): ideas decided at planning
- [REPO-05](../../CLAUDE.md): verified data
- [REPO-14](../team/team-wide.md): no monetization in public
- [REPO-10](../../CLAUDE.md): unofficial wording

## Open questions for the owner of this flow

- support.md and PRIVACY.md are the homes of this flow's rules but have no ledger rows; should they?

## Last confirmed by owner

Not yet.
