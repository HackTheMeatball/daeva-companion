# Assassin E stigma stack: one key, and in which order (0.9 note 13)

Game Data Check, 2026-10-20, for the 0.9 planning pass (triage row 13). The owner asked whether Illusive Clone >
Swift Contract > Triniel's Dagger > Savage Fang "really should be on the same key". Research only; no data changed.

Fetched 2026-10-20 with our User-Agent, ≥ 9 s apart: Metabot's four stigma pages, daevaguides `/en/assassin/`,
aion2turkiye `/en/class/assassin/` (both "Full" in `docs/research/SOURCES.md`). Facts only; no copies kept.

## Today's data

`assassin/builds.json` `keyStacks.eOrder`: Illusive Clone, Swift Contract, Triniel's Dagger, Savage Fang, row 0 first
(`requirements.js` "Row 0 first"). A stack fires the lowest ready row first (claim C21, two sources), so pressing E
repeatedly gives exactly that order. Status `inferred`: "buffs first, then damage … no source gives an order".

## What the game data says (Metabot, max-level tooltips)

| Stigma | Learned | Cooldown | Effect | Moving |
|---|---|---|---|---|
| Illusive Clone | 22 | 90 s | Removes [Heart Gore] cooldown, 20% of damage dealt as extra damage, 30 s (buff) | yes |
| Swift Contract | 22 | 60 s | Combat Speed +20%, 30 s (buff) | yes |
| Triniel's Dagger | 22 | 45 s | Single target, 4 m, +30% from behind; target's cooldowns +5%. Specialization 2 (skill Lv 10): **−10% all skill cooldowns on hit** | no |
| Savage Fang | 22 | 60 s | Up to 4 enemies, 4 m, engraves 5 Insignias, 50 Stagger | no |

All four have a cooldown, so none blocks the stack (the C21 filler rule does not bite).

## What the guides say

- **daevaguides**: "Buffs together and only on bosses: Illusive Clone + Swift Contract, then Shadowstrike and Savage
  Fang, and only after them Triniel's Dagger, which shortens their cooldowns." Lv 37 opener: buffs → Shadowstrike →
  Savage Fang → Triniel's Dagger; Triniel's Dagger is pressed "after your buffs and Savage Fang". The two buffs sit in one
  line ("press twice = both buffs … the line fires Illusive Clone first"); some players press Swift Contract first
  ("the speed shortens the Clone cast"), and the page says to swap the rows if you want that. Buffs "manually, never in
  a macro". Its general rule: only rotation attacks in a line; buffs and area attacks on keys of their own.
- **aion2turkiye**, dungeon build rotation opener: Swift Contract › Illusive Clone › Shadowstrike › Savage Fang ›
  Triniel's Dagger › Insignia Explosion. Its leveling rotation has no buffs (Shadowstrike › Savage Fang › Insignia
  Explosion).

## Findings

1. **Triniel's Dagger goes after Savage Fang: 2 sources, plus the game's mechanism.** Both guides press Savage Fang
   before Triniel's Dagger, and Metabot's specialization 2 explains why: its −10% cuts the cooldowns already running,
   so it should land after the other three are used. Our stack fires Triniel's Dagger before Savage Fang. Proposed
   `eOrder`: Illusive Clone, Swift Contract, **Savage Fang, Triniel's Dagger**. The order then matches both openers
   (Shadowstrike stays on Q between the presses).
2. **One shared E key is supported for the two buffs** (daevaguides puts them in one line). For all four, no source
   binds them to one key; both give the four as a pressed sequence. A shared stack yields that sequence press by press,
   and nothing in it blocks, so keeping one key is a sound **inferred** pick. The counter-case is daevaguides' general
   rule (buffs and AoE on their own keys, used by situation): a player who wants Savage Fang on trash without spending
   the buffs needs it on its own key. That is a play-style choice, not an error.
3. **Illusive Clone vs Swift Contract first: disputed.** daevaguides fires Illusive Clone first and names players who
   press Swift Contract first; aion2turkiye has Swift Contract first. Keep today's row and label it `disputed`.
4. **"Buffs on bosses and elites, not trash"**: daevaguides says it outright; aion2turkiye agrees by leaving the buffs
   out of its leveling rotation. Worth one line on the Rotation card next to E.
5. Gap found on the way: the Assassin's 4 stigma records have no `specialtyChoices`; Metabot lists 5 per stigma
   (see `2026-10-choice-points.md` §5).

## Proposed 0.9 item (not queued)

`eOrder` → Illusive Clone, Swift Contract, Savage Fang, Triniel's Dagger, with sources daevaguides + aion2turkiye
(+ Metabot for the cooldown mechanism); the first two rows labelled `disputed`; the E stack's one-key status stays
`inferred`; a "bosses and elites" note. Visible change (Rotation card), so before / after shots.
