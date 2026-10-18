# Owner's in-game screens, 2026-10-18

Isaac sent 16 screenshots in the project chat on 2026-10-18 at 7:55 PM ET from his Asmodian Assassin, Lv 3–4.
The full set is archived in the private repo under `screenshots/` (prefix `2026-10-18-`). This public folder keeps only the three
quest-state icons, cropped by the owner, and a text record of the other screens. The owner's in-game screens are the
source of truth (CLAUDE.md "Data and source policy"). His DECISIONS rows are `owner-ok-story-icon` and `owner-ok-keys`.

## Quest-state icons (owner's crops, for 0.6 P13 #272)

| File | Size | What it shows (owner's words) |
|---|---|---|
| `story-quest-available.png` | 43×48 | "the yellow diamond icon without the smaller diamond in it is what a story quest looks like before you pick it up" |
| `story-quest-active.png` | 47×50 | "the one with the smaller diamond is what it looks like when the quest is active" |
| `quest-complete-check.png` | 58×55 | "the check mark is what the journal shows a completed quest as" |

Each crop is a PNG with an opaque near-black background, not a transparent one.

## Skill window: the tutorial and the reset buttons (for 0.6 P15 #274)

These are the owner's words and the on-screen text, copied exactly.

Tutorial callouts, in the order the game shows them:
1. On the HUD skill-point icon: "As you level up, you will earn skill points which will be displayed here. Click [K] to
   open the Skill window."
2. On the first skill tile (Assassin: Quick Slice, Lv. 1): "Click to select skills to level up."
3. On the skill-point bar: "Current remaining skill points are displayed here."
4. On the Level Up button: "Click to level up the skill. [F]". The button reads "[F] Level Up", followed by the point cost.
5. On the quickslot: "The selected skill is displayed in the quickslot."
6. On the window's X: "Click to close the window."

The owner says the tutorial has you level up the base skill ("quick slice in the case of an assassin").

Resetting one skill. Owner: "hit K > click skill to reset … then click the circular arrow next to the "level up" button
to just reset that skill." The button is a square with a circular arrow, to the left of Level Up. Its confirm dialog
reads:
> Would you like to reset the skill?
> (All Skill Specialty effects will be deactivated upon reset.)
> (Current preset's skill will be reset.)
> [Cancel] [Reset]

Resetting all skills. Owner: "the smaller "recycling" looking icon resets ALL skills to 1, not just the selected one."
It is the small round icon to the right of the skill-point bar's (i) button. Its confirm dialog reads:
> Would you like to reset all skills?
> (All Skill Specialty effects will be deactivated upon reset.)
> (Current preset's skills will be reset.)
> [Cancel] [Reset]

Neither dialog shows a cost at Lv 4. The cost after Lv 31 stays "disputed" (docs/ISSUES.md).

These screens don't cover the Daevanion board or stigma respec steps, or the stigma key.

## Quest reward (bonus, for Game Data Check)

Shadow Forest, Basic Rewards: EXP 100%, Kinah 1.5K. Additional Rewards: Strange Karma Boots, Strange Karma Gloves. The
owner turned it in to reach Lv 4.

## App feedback in the same set (to Design Lead)

- The Build pop-out's "Key setup" grid shows skill names as text. The owner wants skill icons there.
- The Skills card doesn't appear until Lv 4, and the space where it goes is left blank. The owner suggests a placeholder
  card reading "unlocks at Lv X" and/or "unlocks in N levels".
