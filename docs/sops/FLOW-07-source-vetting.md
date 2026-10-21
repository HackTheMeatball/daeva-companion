# FLOW-07: Source vetting

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Decide, before anyone reads it, whether and how a website may be used, and record the verdict in one place.

## Trigger

A thread needs a site that has no row in SOURCES.md, a site's terms or robots.txt change, or a thread asks Lydia for outside research (DEC-20261020-lydia-research-any-topic).

## Owner

**Lydia** (accountable for this flow end to end; each step names who does it).

## Inputs

- [docs/research/SOURCES.md](../research/SOURCES.md)
- The fetching policy in [CLAUDE.md](../../CLAUDE.md)

## Steps

1. **Requesting thread**: Asks Lydia to vet the site, saying what it is needed for. It reads nothing from the site meanwhile.
2. **Lydia**: Reads the terms page first, then robots.txt, before any content page (REPO-06), and writes the fetch-log line (terms URL, robots.txt, verdict) before the first content request to a new host; Chuck confirms it (ROL-08).
3. **Lydia**: Classifies it: opts out (never fetched; the owner checks by hand, REPO-07), bans scraping only (spot checks), or no restriction.
4. **Lydia**: Adds or updates its row in SOURCES.md in a PR, with the date and the evidence note ("Keeping this current"). A new or stricter row goes straight to a PR under Isaac's standing OK (ROL-04).
5. **Lydia**: If the site must be added to the environment's allowed network list, or a use is looser than today, asks Isaac through [FLOW-14](FLOW-14-owner-decision.md) (ROL-04). Isaac's OK counts only when typed in the Source Vetting thread; a relayed or inferred OK doesn't count.

## Gates

- A row in SOURCES.md before any session fetches a content page.
- Network-list changes and looser use need Isaac (ROL-04).
- One open PR touching SOURCES.md at a time (Q-12).
- A site in the [Fail table](../research/SOURCES.md#fail-never-read-by-a-session) is never fetched.

## Records

- docs/research/SOURCES.md row and its research note
- The fetch log (`legal/fetch-log.md` in the project's shared folder)

## Failure and escalation

- A 403, 429 or challenge page: stop, never work around it (REPO-06).
- Unclear terms: treat as the stricter reading and record why.
- Content read before the terms: close it out in the fetch log (delete what was kept, then re-source or label the fact) (ROL-08).

## Rules it runs on

- [REPO-06](../../CLAUDE.md): fetching rules
- [REPO-07](../../CLAUDE.md): opt-outs and bans
- [ROL-04](../DECISIONS.md): Lydia's standing OK
- [ROL-08](../research/SOURCES.md#keeping-this-current): fetch log
- [Q-12](https://github.com/HackTheMeatball/daeva-companion/issues/222): one open PR per shared doc
- [ROL-03](../DECISIONS.md): who looks up
- [DEC-20261020-lydia-research-any-topic](../DECISIONS.md): research for any thread

## Last confirmed by owner

Not yet.
