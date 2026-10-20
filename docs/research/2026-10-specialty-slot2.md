# Specialty slot 2: a pick for every guide skill (owner note 5, 2026-10-20)

Game Data Check, 2026-10-20, for 0.8.1. Owner's Lv 39 play-test (`/mnt/project-files/release/owner-notes-2026-10-20-lv39.txt`):
"no specialty was recommended for slot 2 when it unlocked it just says 'pick a specialty' (this always needs to be a
recommendation based on gretchens data)".

## Why the app says "pick a specialty"

Not a bug in the evaluator: it is the 0.3 E7 data rule. `builds.json` `specialtyPicks` carries a slot 2 pick only where
`docs/research/2026-10-specialty-picks.md` found 2+ slot-specific sources (Heart Gore 4, Quick Slice 4); every other
slot was left empty on purpose (design Q6, `skillOrderNotes`), and an empty slot renders "pick a specialty"
(`src/packs/aion2/requirements.js`, `nextup-kinds.js`). The owner now wants a pick in every slot 2, labelled.

Four core skills in the guide build have no slot 2 pick today: Insignia Explosion, Savage Roar, Ambush, Shadowstrike.

## Proposal: one labelled pick per slot 2

Sources and counts are the ones in `2026-10-specialty-picks.md` §3 (no new fetching). Labels follow `claims.json`:
the pick ships with its label, and the label text names the alternative.

| Skill | Slot 2 pick | Label | Alternative | Reason |
|---|---|---|---|---|
| Heart Gore | 4 Multi-Hit on hit (unchanged) | 2+ sources | — | — |
| Quick Slice | 4 -1s Insignia Explosion cooldown on hit (unchanged) | 2+ sources | — | — |
| Insignia Explosion | **3** Keeps 2 Insignia stacks | disputed | 5 -3s cooldown (AM-PvE; CP-Grobs from skill 16) | SC, TR-L and CP-Grobs (before skill 16) put 3 second; 5 needs effective skill 16, so as a slot 2 pick it would sit empty from 12 to 16. The guide then moves 5 to slot 3 (SC, TR-L put 5 third). This reverses the old proposal (5 in slot 2, 3 in slot 3), which counted CP-Grobs only for 5. |
| Savage Roar | **4** -1s Shadowstrike cooldown on hit | contested | 1 -20% MP (SC, CP put it first, then our slot 1 pick 2 second) | TR-L / TR-D are the only sources whose order starts like ours (2 first); 4 is their second. SC / CP's alternative is the MP pick they take before ours. |
| Ambush | **2** Absorbs 300, 300% HP | disputed | 4 50% chance to trigger Whirlwind Slice (AM-PvE) | Every PvE guide takes Absorb on Ambush; TR places it second. 4 triggers Whirlwind Slice, which the guide doesn't level (not core). |
| Shadowstrike | **1** +1s Stun duration | inferred (gap) | 3 Seal 50%, 4 Root 50% (PvP picks; no PvE source) | No PvE source names a second pick. A longer stun on a guaranteed hit is more PvE value than a 50% Seal or Root (inferred, the guide's reasoning). |

Slot 3 is unchanged (never offered inside Lv 45, design Q5), except Insignia Explosion slot 3 becomes 5 to follow the swap.

## For the build item (Walter)

- Data only: add the four picks to `specialtyPicks` (position = slot), each with a `specialtyEvidence` entry naming its
  label and sources; the generator check that slot 2+ picks carry 2+ witnesses needs a labelled exception (disputed /
  contested / inferred), or the label moves into the evidence record. That is a schema / gen change, not only data.
- UI: the specialty row shows the label the way other labelled values do (0.8 P20). No row may say "pick a specialty"
  for a guide skill; a test should assert that for every core skill's slot 2.
- Visible change: before / after shots of the slot 2 row for each of the four skills.
