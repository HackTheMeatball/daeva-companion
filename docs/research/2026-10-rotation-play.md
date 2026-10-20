# How each class's rotation plays out (0.9 note 15, P18)

Game Data Check, 2026-10-20. Research only. Read 2026-10-20 with our User-Agent, 10 s apart: daevaguides
`/en/guides/macros/` (its "Macro for every class" section) and aion2turkiye `/en/class/<class>/` for all 8 classes (the
leveling build's macro column and rotation; both sites Full). Facts only, no wording. aion2turkiye lists a macro column
by priority, highest first; daevaguides names rows (row 0 = highest priority, claim C21).

## Rules every class shares (2+ sources)

1. One key holds a line of up to 4 skills; the highest-priority ready skill fires; the no-cooldown filler goes last
   (claim C21; daevaguides; aion2turkiye "the first ready skill in the column fires").
2. The macro steps press whole lines, 10 ms apart, and you hold it together with left click (the basic attack)
   (daevaguides; aion2turkiye on every class page).
3. **Kept out of the macro:** buffs (wasted on trash), charged skills (the macro only gets stage 1), toggles and mantras
   (a second press turns them off), and pulls (daevaguides; aion2turkiye "keep … stigmas manual", "Hellfire on its own key").
4. Skill Queue: aion2turkiye says on for every class. daevaguides reports a split (couga54, Solashur, Antochi on;
   Wakayashi, MR4KTV, GunghoGuns off) and says to test it. **Disputed**; the guide should say both.

## Per class: the macro line (leveling)

| Class | daevaguides | aion2turkiye | Agree? | By hand (both) |
|---|---|---|---|---|
| Assassin | Insignia Explosion (row 0), Heart Gore, Ambush, Savage Roar (filler) + Quick Slice | Insignia Explosion, Heart Gore, Whirlwind Slice, Savage Roar | Insignia Explosion first, Savage Roar last: yes. The middle differs (Ambush vs Whirlwind Slice) | Illusive Clone, Swift Contract, Savage Fang (`2026-10-e-stack.md`) |
| Gladiator | Rage Burst (row 0), Overhead Slam, Sword Aura Rampage, Rending Blow (filler); in the macro from 27 | Overhead Slam, Rending Blow, Keen Strike | Overhead Slam over Rending Blow: yes. Rage Burst and Sword Aura Rampage only in daevaguides (both are later skills); Keen Strike only in aion2turkiye ("only when MP is low") | Leaping Slam, stigmas |
| Templar | Judgment line (above Shield Smite, Warding Strike) + Annihilate → Debilitating Smash → Pummel line; 2 macro steps | Judgment, Pummel, Vicious Strike (one column) | Judgment first, Pummel in the macro: yes. Line split differs | Doom Shield (charge), Punishment, pulls |
| Ranger | Griffon line (Griffon/Explosive Arrow from 37, Snare Shot, Burst Arrow) then Gale line (Gale Arrow row 0, Drill Dart, Tempest Shot filler) | Gale Arrow, Drill Dart, Burst Arrow, Snare Shot, Tempest Shot + Snipe | Same skills; Gale Arrow first and Tempest Shot last: yes | Deadshot (charge, own key), Marking Shot, buffs |
| Sorcerer | Bittercold Wind (row 0), Blaze, Firestorm, Wish of Concentration (row 3); one step + Flame Arrow | Bittercold Wind, Blaze, Firestorm, Wish of Concentration + Flame Arrow | **Identical** | Hellfire (charge), the burst line |
| Spiritmaster | Jointstrike line (Corrode row 0, Curse, Dimensional Control, Combustion filler) → spirit line (Elemental Fusion row 0, Water, Earth, Fire last) | Curse, Dimensional Control, Combustion + Cold Shock | Curse > Dimensional Control > Combustion: yes. Corrode is a Lv 32 stigma; the spirit line is only in daevaguides | Buffs, Ancient Spirit, Destructive Attack; don't charge Elemental Fusion |
| Cleric | Prayer of Amplification (row 0), Earth Punishment, Chain of Torment, Condemnation; second line Scattershot, Divine Aura, Light of Regeneration, Judgment Thunder (filler) | Earth Punishment, Divine Aura, Condemnation, Chain of Torment, Judgment Thunder; left + right click = Earth's Retribution | Same skills; Judgment Thunder last: yes. Line split and middle order differ | Heals, Bolt (charge), Debilitating Mark, Light of Protection (toggle) |
| Chanter | Dark Crush (row 0), Spinning Strike, Incandescent Blow (filler) + Onslaught | Dark Crush, Spinning Strike, Incandescent Blow + Onslaught | **Identical** | Mantras, Impactful Crush (until 45), Marchutan's Wrath |

## What this means for the guide

- **2 sources, can ship as verified:** each class's line head and filler. Sorcerer and Chanter match exactly. Assassin
  matches except the 3rd row. The rest match the skills to keep out of the macro.
- **Disputed:** the middle rows where the two differ (Assassin row 2, Cleric middle order, Gladiator Keen Strike), and
  Skill Queue.
- **Level-dependent:** daevaguides adds skills learned later (Gladiator Rage Burst / Sword Aura Rampage, Spiritmaster
  Corrode, Ranger Griffon / Explosive Arrow at 37). A rotation needs a level on each row, like `keyStacks.rightClick`'s
  `minLv` for the Assassin.
- Not checked against our data per class (each class's `keyStacks` / `defaultKeys`): that is the 0.9 build item's diff,
  not research.
