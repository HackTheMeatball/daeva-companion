# Owner's Sorcerer skill window (K), Lv 4 character, 2026-10-19 1:04 PM ET

Posted by Isaac in the project chat. Filed by Release Planner (Walter); not yet checked against Metabot. That check is Game Data Check (Gretchen)'s job, for 0.9's Sorcerer pack (ROADMAP "0.9 — the last two classes").

What the screen shows, read by eye and not verified:
- Selected skill: Flame Arrow Lv 1 (Magic, Attack, Fire). Deals 71–71 Fire damage to a target within 20 m, restores 100 MP, Mobile, instant cast, Spellbook. Specialty unlocks at 8 / 8 / 8 / 12 / 16.
- Actives: 5 unlocked at Lv 1; locked at 5, 7, 8, 10, 12, 14, 16.
- Passives: 1 unlocked; locked at 6, 9, 11, 13, 15, 17, 21, 23, 25.
- Default key badges are visible on the bars (1–4, Q, E, mouse); not read here.

## Checked by Game Data Check (Gretchen), 2026-10-19 1:15 PM ET
Against Metabot's class page <https://metabot.gg/en/aion-2/classes/sorcerer> and the 12 active skill pages (global client build 0.0.4387.0), fetched 1:06–1:09 PM ET. The repo has no Sorcerer data yet.

- **Unlock levels match Metabot:**
  - Actives: 1 Flame Arrow, 1 Ice Chain, 1 Firestorm, 3 Bittercold Wind, 4 Blaze, 5 Flame Scattershot, 7 Frost, 8 Winter's Shackles, 10 Frost Burst, 12 Wish of Concentration, 14 Hellfire, 16 Defiance.
  - The screen's "5 unlocked at Lv 1" means 5 unlocked at this Lv 4 character (three are Lv 1, one Lv 3, one Lv 4).
  - Passives: 1 Fire Mark, 6 Robe of Earth, 9 Cold Snap, 11 Robe of Flame, 13 Absorb Essence, 15 Grace of Resistance, 17 Robe of Cold, 21 Grace of Enhancement, 23 Revitalization Contract, 25 (the 10th passive). All match.
- **Icon ids (Metabot `/web/aion2/skills/<id>.webp`):** Flame Arrow 15210000, Ice Chain 15090000, Firestorm 15040000, Bittercold Wind 15280000, Blaze 15050000, Flame Scattershot 15010000, Frost 15150000, Winter's Shackles 15110000, Frost Burst 15220000, Wish of Concentration 15310000, Hellfire 15060000, Defiance 15240000. The five unlocked icons were matched to the screen by eye. Each locked skill was matched by its unlock level.
- **Default keys** (owner:2026-10-19-sorcerer-keys-01). Row 0 fires first.
  - Left click: Flame Arrow. Right click: Ice Chain. Both read from the screen: the left half of the badge is lit on Flame Arrow and the right half on Ice Chain.
  - 1: Firestorm · 2: Bittercold Wind · 3: Winter's Shackles (8) · 4: Hellfire (14)
  - E: r0 Flame Scattershot (5, needs a Staggered target), r1 Blaze (4, needs Fire Mark), r2 Wish of Concentration (12)
  - Q: r0 Frost Burst (10, needs a Frost target), r1 Frost (7)
  - Defiance (16): no key
  - Same shape as Ranger, Gladiator and Templar: conditional skills sit in row 0. That Blaze's Fire Mark condition puts it at r1, and not r0, is read from the screen only.
- **Specialty text:** the screen shows Flame Arrow's spec 2 as "Absorbs 1% HP", the game text. If Metabot prints it as "Absorbs 100, 100% HP" (the #358 template), use the game text; gen's check enforces this. Damage of 71–71 on screen vs Metabot's 62 (+63% Attack) depends on Attack, so it is not a conflict.
- Requests: 1 class page, 12 skill pages, 5 icon files; at least 6 s apart, all 200.
