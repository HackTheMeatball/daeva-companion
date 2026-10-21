# FLOW-08: Icon intake

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Add a skill, stigma or item icon only from an approved source, with its provenance recorded, and fall back to a cleaned owner crop only when no source has it.

## Trigger

An item spec or research pack needs an icon that is not in `src/assets/icons/`.

## Owner

**Gretchen** (accountable for this flow end to end; each step names who does it).

## Inputs

- Approved icon sources (SOURCES.md; Metabot first)
- Isaac's crops in project files (fallback only)

## Steps

1. **Gretchen**: Looks the icon up on approved sources, Metabot first (ROL-05, DEC-20261020-daevacompass-icon-source).
2. **Research thread**: Adds the file and records its source page, file URL and date in [docs/ISSUES.md](../ISSUES.md) (REPO-08).
3. **Jane**: If no approved source has it, cleans Isaac's own crop and approves it in one step (DEC-20261018-owner-crop-clean-up-is).
4. **Gretchen**: If neither exists, lists the icon for Isaac instead of guessing.
5. **Gretchen**: Verifies the icon PR before merge ([FLOW-06](FLOW-06-data-fact-verification.md) gate).

## Gates

- Provenance recorded for every icon (REPO-08).
- Game Data Check VERIFIED on the icon PR (ROL-03).

## Records

- docs/ISSUES.md provenance rows
- [docs/team/icon-provenance.md](../team/icon-provenance.md) (table built from them)

## Failure and escalation

- No approved source and no crop: an item on Isaac's list, not a guessed icon.
- Any other new game art, map icons included, needs Isaac's OK (REPO-08); the map icons in use came from DEC-20261018-map-icons.

## Rules it runs on

- [ROL-05](../DECISIONS.md): icon source order
- [REPO-08](../../CLAUDE.md): no new game art; icon standing OK
- [DEC-20261020-daevacompass-icon-source](../DECISIONS.md): daevacompass.com approved
- [DEC-20261018-owner-crop-clean-up-is](../DECISIONS.md): crop clean-up
- [ROL-03](../DECISIONS.md): Gretchen verifies
- [DEC-20261018-map-icons](../DECISIONS.md): map icons were an owner OK

## Last confirmed by owner

2026-10-21, by Gretchen.
