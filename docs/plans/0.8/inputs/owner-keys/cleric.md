# Owner's Cleric skill window (K), Lv 4 character, 2026-10-19 1:30 PM ET

Posted by Isaac in the project chat. Filed by Release Planner (Walter). Not yet checked: Game Data Check (Gretchen)
checks it against Metabot (unlock levels, icon ids, default keys) and updates this file. Input for 0.8 P4 (Cleric class
data): its `defaultKeys` come from this screen, as the Templar's came from the 2026-10-18 screen.

## Checked by Game Data Check (Gretchen), 2026-10-19 1:40 PM ET
Checked against `docs/research/2026-10-cleric-pack.md`, `data/research/cleric-*-metabot-2026-10.csv` (Metabot, client build 0.0.4387.0) and the Metabot icons staged in `docs/research/icons-2026-10-19-cleric/`. No new fetch.

- **Unlock levels match the pack (§2.1, two-source):**
  - Actives: 1 Earth's Retribution, 1 Debilitating Mark, 1 Judgment Thunder, 3 Divine Aura, 4 Chain of Torment, 5 Lightning Strike Scattershot, 7 Light of Regeneration, 8 Condemnation, 10 Healing Light, 12 Radiant Recovery, 14 Bolt, 16 Defiance.
  - Passives: 1, 6, 9, 11, 13, 15, 17, 21, 23, 25. All match.
  - The pack's optional owner spot check (§11.2) is covered. Lightning Strike Scattershot shows locked "Lv 5" and Bolt "Lv 14". Divine Aura is unlocked at this Lv 4 character, which fits 3 but can't tell 3 from 4. That is enough, because it is already two-source.
- **Identification:** the five unlocked icons were matched by eye to Metabot's Earth's Retribution 17010000, Judgment Thunder 17040000, Debilitating Mark 17080000, Divine Aura 17150000 and Chain of Torment 17070000. The locked ones were matched by unlock level: Lightning Strike Scattershot 17370000, Light of Regeneration 17090000, Condemnation 17350000, Healing Light 17100000, Radiant Recovery 17120000, Bolt 17060000, Defiance 17240000.
- **Default keys** (owner:2026-10-19-cleric-keys-01). Row 0 fires first.
  - Left click: Earth's Retribution. Right click: Judgment Thunder. Both are read from the badge halves on the screen.
  - 1: Debilitating Mark · 2: Divine Aura · 3: Radiant Recovery (12) · 4: Bolt (14)
  - E: r0 Lightning Strike Scattershot (5, needs Stagger), r1 Condemnation (8, needs Chain of Torment on the target), r2 Chain of Torment (4)
  - Q: r0 Light of Regeneration (7), r1 Healing Light (10). Both are heals, so the Q stack is the heal key.
  - Defiance (16): no key
- **Specialty text:** Earth's Retribution's five specialties on screen match the CSV word for word: +20% MP restored, +20% [Discharge] Chain Skill trigger chance, +50% Multi-Hit on hit, −7s [Bolt] cooldown on landing [Discharge], Ignores Block and Evasion.

### Against the pack's disputed items
- **§9 stack order (disputed): the game default supports the majority.** daevaguides puts Chain of Torment above Condemnation. mmo-codex says Chain of Torment "has to be last". The game's default E stack puts Condemnation (r1) above Chain of Torment (r2). That is mmo-codex's order and the pack's default. Inferred: the default is NCSoft's layout, not a player's, so it backs the order without proving the daevaguides variant fails.
- **§9 is a player macro, not the default.** Both sources' right-click stack (Divine Aura → Condemnation → Chain of Torment) is a key setup players build. By default, right click is Judgment Thunder and Divine Aura sits alone on 2. P4 should present `defaultKeys` (this screen) and the right-click stack as separate things, as #387 does for the Assassin.
- The disputed Lv 8 picks for Earth's Retribution and Judgment Thunder (§4): the screen shows both options at skill Lv 8 but not which one players pick, so the dispute stands.
- Nothing on the screen contradicts a CONFIRMED item in the pack.
