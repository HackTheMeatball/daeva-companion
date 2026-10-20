# FLOW-22: Tracker page change

Index and status: [README.md](README.md). Steps say who does what; each rule is linked to its one home and never restated
here. Where this page and a rule's home differ, the home wins and this page is fixed.

## Purpose

Change the tracker page's code or look one tab at a time, only from an approved design and without losing data.

## Trigger

Jane approves a tracker design (an ask from Isaac, or a fix).

## Owner

**Skyler** (accountable for this flow end to end; each step names who does it).

## Inputs

- Jane's approved mockup
- The tracker page and its checker script

## Steps

1. **Jane**: Designs the tab and gives DESIGN OK.
2. **Skyler**: Builds the tab only from that design, with Isaac's typed OK in Skyler's thread where TRK-10 asks it.
3. **Huell**: Checks that no data was lost.
4. **Skyler**: Publishes the tab, keeping the page size limit (TRK-06).

## Gates

- Jane's DESIGN OK and Huell's data check, tab by tab (DEC-20261018-tracker-2-0-tab-by).

## Records

- The tracker artifact's published versions

## Failure and escalation

- A data mismatch: Huell holds the tab; Skyler fixes it.
- Skyler never writes tracker data (TRK-01).

## Rules it runs on

- [TRK-10](../team/skyler.md): approved designs only
- [DEC-20261018-tracker-2-0-tab-by](../DECISIONS.md): tab by tab
- [DEC-20261019-tracker-sync-and-tracker-design](../DECISIONS.md): split pages
- [DEC-20261019-the-tracker-may-change-how](../DECISIONS.md): storage and loading
- [TRK-06](../team/huell.md): page size
- [TRK-01](../team/huell.md): data is Huell's
- [COM-14](../DECISIONS.md): no unrequested redesign

## Open questions for the owner of this flow

- TRK-10 asks for Isaac's typed OK on every build, while DEC-20261020-owner-steps-away moves look OKs to Jane after an outside review. Which holds for tracker tabs?

## Last confirmed by owner

Not yet.
