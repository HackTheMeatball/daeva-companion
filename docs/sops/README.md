# Flows and SOPs

How work moves through the team, one standard operating procedure (SOP) per flow. The ledger answers *which rule* and
*who owns it*; this folder answers *in what order things happen, and who does each step*. Built 2026-10-20 by a
one-off Process Mapper for Rules Steward (Francesca), who keeps it current.

- **Who does what** stays in [LEDGER.md](../kaizen/LEDGER.md) ("Who does what"). A flow's owner must own a row there.
  The department map (Org Design) groups those owners by department; this index groups their work by flow. Neither
  repeats the other.
- **Rules have one home** ([Q-14](../kaizen/LEDGER.md)). An SOP links each rule it runs on and never restates it; where an
  SOP and a rule's home differ, the home wins and the SOP is fixed.
- **Status:** `draft` until the flow's owner confirms the SOP matches what they actually do; then `confirmed`, with the
  date in its "Last confirmed by owner" section.
- **Checked by CI:** `tests/ledger.mjs` (`checkSops`) fails when a file in this folder isn't named `FLOW-NN-<slug>.md`;
  an index row has no file or a file has no row; an owner isn't an active team member leading a Who does what Owner
  cell; a section is missing or empty; a step's doer is unknown; a cited rule id is missing or not active or trial; a
  "Rules it runs on" line isn't a link to that rule's ledger home, or the index's "Runs on" names a rule the SOP doesn't
  list; or a relative link or #anchor is dead.

## Flows

| Id | Flow | Trigger | Owner | SOP | Runs on | Status |
|---|---|---|---|---|---|---|
| FLOW-01 | Idea to plan item | An idea, ask or finding arrives | Walter | [FLOW-01-idea-to-plan-item.md](FLOW-01-idea-to-plan-item.md) | PLN-12, PLN-16, PLN-22, PLN-15, PLN-06 | confirmed |
| FLOW-02 | Planning pass and queue | KAIZEN REVIEW DONE <minor> | Walter | [FLOW-02-planning-pass-and-queue.md](FLOW-02-planning-pass-and-queue.md) | PLN-01, KZ-10, PLN-11, Q-01, KZ-16 | confirmed |
| FLOW-03 | Build (kickoff to PR) | A merge, or a kickoff dispatch | Gus | [FLOW-03-build.md](FLOW-03-build.md) | Q-05, PIP-06, PIP-07, REPO-01, PIP-04 | confirmed |
| FLOW-04 | Code review | Green CI on a claude/ PR | Howard | [FLOW-04-code-review.md](FLOW-04-code-review.md) | MRG-04, MRG-03, PIP-01, KZ-16 | confirmed |
| FLOW-05 | Design review | A minor's mockups, or a PR with shots | Holly | [FLOW-05-design-review.md](FLOW-05-design-review.md) | MRG-06, MRG-05, KZ-16, DEC-20261019-design-critic-reviews-a-minor | confirmed |
| FLOW-06 | Data fact intake and verification | A fact to add or correct | Gretchen | [FLOW-06-data-fact-verification.md](FLOW-06-data-fact-verification.md) | REPO-05, ROL-03, REPO-06, REPO-07 | confirmed |
| FLOW-07 | Source vetting | A thread needs a site not yet vetted | Lydia | [FLOW-07-source-vetting.md](FLOW-07-source-vetting.md) | REPO-06, REPO-07, ROL-04 | confirmed |
| FLOW-08 | Icon intake | A card needs a game icon | Gretchen | [FLOW-08-icon-intake.md](FLOW-08-icon-intake.md) | ROL-05, REPO-08, DEC-20261020-daevacompass-icon-source | confirmed |
| FLOW-09 | Merge | A PR meets every gate | Gus | [FLOW-09-merge.md](FLOW-09-merge.md) | MRG-01, MRG-02, MRG-06, DEC-20261020-release-manager-and-freeze | confirmed |
| FLOW-10 | Minor release | Every item of a minor has merged | Walter | [FLOW-10-minor-release.md](FLOW-10-minor-release.md) | PLN-17, KZ-11, DEC-20261020-release-manager-and-freeze, PLN-19 | confirmed |
| FLOW-11 | Patch release | A patch's items have merged | Walter | [FLOW-11-patch-release.md](FLOW-11-patch-release.md) | PLN-20, PLN-17, KZ-11, PLN-21 | confirmed |
| FLOW-12 | Incident and stall handling | The hourly health check, or a report | Mike | [FLOW-12-incident-and-stall.md](FLOW-12-incident-and-stall.md) | HC-01, HC-02, HC-06, LOG-01, Q-15 | confirmed |
| FLOW-13 | Outside report intake | A Report a problem issue or a beta report | Ernesto | [FLOW-13-outside-report-intake.md](FLOW-13-outside-report-intake.md) | PLN-16, REPO-05, REPO-14 | confirmed |
| FLOW-14 | Owner decision | Work needs something only Isaac can give | Saul | [FLOW-14-owner-decision.md](FLOW-14-owner-decision.md) | DEC-02, DEC-01, DEC-03, COM-02, COM-05 | confirmed |
| FLOW-15 | Process change | A rule, team or permission change is proposed | Gale | [FLOW-15-process-change.md](FLOW-15-process-change.md) | DEC-20261020-process-change-procedure, KZ-01, KZ-02, DEC-01 | draft |
| FLOW-16 | Hire and consultant | A workload needs a thread | Saul | [FLOW-16-hire-and-consultant.md](FLOW-16-hire-and-consultant.md) | DEC-20261020-hiring, DEC-20261020-coordinator-creates-threads, DEC-20261020-usage-budget | confirmed |
| FLOW-17 | Kaizen review | Every report owner has sent REPORT READY | Gale | [FLOW-17-kaizen-review.md](FLOW-17-kaizen-review.md) | KZ-01, KZ-10, PLN-03, PLN-04, KZ-05 | draft |
| FLOW-18 | Tracker sync | Work creates or changes a card | Huell | [FLOW-18-tracker-sync.md](FLOW-18-tracker-sync.md) | TRK-01, TRK-02, TRK-03, TRK-05, TRK-09 | confirmed |
| FLOW-19 | Rule and roster upkeep | A merge changes a rule, decision, owner or thread | Francesca | [FLOW-19-rule-and-roster-upkeep.md](FLOW-19-rule-and-roster-upkeep.md) | Q-14, ROL-07 | draft |
| FLOW-20 | Player testing | RC READY, a release, or a patch | Jesse | [FLOW-20-player-testing.md](FLOW-20-player-testing.md) | PLN-21, PLN-22, KZ-17 | draft |
| FLOW-21 | Game patch re-check | AION 2 patches | Gretchen | [FLOW-21-game-patch-recheck.md](FLOW-21-game-patch-recheck.md) | REPO-05, REPO-06 | confirmed |
| FLOW-22 | Tracker page change | A tracker design is approved | Jane | [FLOW-22-tracker-page-change.md](FLOW-22-tracker-page-change.md) | TRK-10, DEC-20261018-tracker-2-0-tab-by | confirmed |
| FLOW-23 | Architecture change (Gus, effective once relay work moves to Actions) | An item touches state, saves, data format or build | Gus | [FLOW-23-architecture-change.md](FLOW-23-architecture-change.md) | REPO-04, PIP-06, KZ-16, PLN-05 | draft |

"Runs on" names the main gates; each SOP lists every rule it uses.

## Policies

Policies are indexed here, not rewritten. Each keeps its own home and owner.

| Policy | What it governs | Home | Kept by |
|---|---|---|---|
| Working rules | Saves, tests before commits, data and source policy, licensing, what Isaac wants | [CLAUDE.md](../../CLAUDE.md) | Each rule's ledger owner |
| Privacy | What the app and the beta program collect, and how long it is kept | [PRIVACY.md](../../PRIVACY.md) | Ernesto |
| Licence | Code under PolyForm Strict 1.0.0; guide text, data selection, name and art reserved | [LICENSE](../../LICENSE) | Isaac |
| Source access | Which website may be used for what | [docs/research/SOURCES.md](../research/SOURCES.md) | Lydia |
| Decisions | Isaac's decisions, and team decisions after an outside review | [docs/DECISIONS.md](../DECISIONS.md) | Walter |
| Rules ledger | Every active rule, its owner and its one home | [docs/kaizen/ledger.csv](../kaizen/ledger.csv), [LEDGER.md](../kaizen/LEDGER.md) | Francesca |

## Keeping this current

- A change to a rule, an owner or a thread updates every SOP it touches in the same PR ([FLOW-19](FLOW-19-rule-and-roster-upkeep.md)). The ledger test
  catches a stale owner or rule id; it can't catch a step that no longer happens, so each owner re-confirms their SOP at
  the kaizen review after it changes.
- A new flow gets the next FLOW number (two digits, so up to FLOW-99), a row here and a file in the same shape (the
  sections `checkSops` lists). Numbers are never reused.
- Step doers are team names or one of the per-run actors in `SOP_ACTORS` (`tests/ledger.mjs`): Kickoff, Pipeline,
  Auto-merge, CI, Builder, Reviewer, Fresh reviewer, Research thread, Design Critic, Requesting thread, Recorder,
  Proposer, Outside reviewer, Rule owner, Every report owner, New thread.
