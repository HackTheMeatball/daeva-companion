# Icon provenance: the 29 shipped icons with no ISSUES.md row (0.9 P27, CK-2)

Game Data Check, 2026-10-21. Input for P27 (#698). Research only; nothing fetched for this file.

## Method

- Every file in `src/assets/icons/` on main (f05a6bf8, 239 files) checked for an ISSUES.md row naming its base name.
  29 have none. All 29 are Cleric files (16 `sk-cleric-*`, 13 `st-cleric-*`), not only `sk-*` as the item text says.
- All 29 arrived in 0.8 P5 (#543, 3d36427b) as pure renames (git `R100`, byte-identical) of files staged in
  `docs/research/icons-2026-10-19-cleric/`, and none has changed since (one commit each in `git log`).
- Those staged files have rows in ISSUES.md ("Cleric skill and stigma icons: fetched before the class ships") under
  their staged names (`sk-<slug>.png`, `st-<slug>.png`); ISSUES.md's P5 note says the rows still apply after the rename.
  The fetches are logged in `data/research/cleric-icons-metabot-2026-10.requests.log` (2026-10-19, all 200).
- So each row below is that staged row's source page, file URL and date, under the shipped file name. Nothing guessed.

## Rows to add to docs/ISSUES.md

| File | Name | Source page | File URL | Retrieved | Staged as |
|---|---|---|---|---|---|
| sk-cleric-bolt.png | Bolt | <https://metabot.gg/en/aion-2/skills/bolt> | <https://metabot.gg/web/aion2/skills/17060000.webp> | 2026-10-19 | sk-bolt.png |
| sk-cleric-chain-of-torment.png | Chain of Torment | <https://metabot.gg/en/aion-2/skills/chain-of-torment> | <https://metabot.gg/web/aion2/skills/17070000.webp> | 2026-10-19 | sk-chain-of-torment.png |
| sk-cleric-condemnation.png | Condemnation | <https://metabot.gg/en/aion-2/skills/condemnation> | <https://metabot.gg/web/aion2/skills/17350000.webp> | 2026-10-19 | sk-condemnation.png |
| sk-cleric-debilitating-mark.png | Debilitating Mark | <https://metabot.gg/en/aion-2/skills/debilitating-mark> | <https://metabot.gg/web/aion2/skills/17080000.webp> | 2026-10-19 | sk-debilitating-mark.png |
| sk-cleric-defiance.png | Defiance | <https://metabot.gg/en/aion-2/skills/defiance-cleric> | <https://metabot.gg/web/aion2/skills/17240000.webp> | 2026-10-19 | sk-defiance.png |
| sk-cleric-divine-aura.png | Divine Aura | <https://metabot.gg/en/aion-2/skills/divine-aura> | <https://metabot.gg/web/aion2/skills/17150000.webp> | 2026-10-19 | sk-divine-aura.png |
| sk-cleric-earths-grace.png | Earth's Grace | <https://metabot.gg/en/aion-2/skills/earths-grace> | <https://metabot.gg/web/aion2/skills/17780000.webp> | 2026-10-19 | sk-earths-grace.png |
| sk-cleric-earths-retribution.png | Earth's Retribution | <https://metabot.gg/en/aion-2/skills/earths-retribution> | <https://metabot.gg/web/aion2/skills/17010000.webp> | 2026-10-19 | sk-earths-retribution.png |
| sk-cleric-empyrean-lords-benediction.png | Empyrean Lords' Benediction | <https://metabot.gg/en/aion-2/skills/empyrean-lords-benediction> | <https://metabot.gg/web/aion2/skills/17720000.webp> | 2026-10-19 | sk-empyrean-lords-benediction.png |
| sk-cleric-empyrean-lords-grace.png | Empyrean Lord's Grace | <https://metabot.gg/en/aion-2/skills/empyrean-lords-grace> | <https://metabot.gg/web/aion2/skills/17730000.webp> | 2026-10-19 | sk-empyrean-lords-grace.png |
| sk-cleric-healing-light.png | Healing Light | <https://metabot.gg/en/aion-2/skills/healing-light> | <https://metabot.gg/web/aion2/skills/17100000.webp> | 2026-10-19 | sk-healing-light.png |
| sk-cleric-judgment-thunder.png | Judgment Thunder | <https://metabot.gg/en/aion-2/skills/judgment-thunder> | <https://metabot.gg/web/aion2/skills/17040000.webp> | 2026-10-19 | sk-judgment-thunder.png |
| sk-cleric-light-of-regeneration.png | Light of Regeneration | <https://metabot.gg/en/aion-2/skills/light-of-regeneration> | <https://metabot.gg/web/aion2/skills/17090000.webp> | 2026-10-19 | sk-light-of-regeneration.png |
| sk-cleric-lightning-strike-scattershot.png | Lightning Strike Scattershot | <https://metabot.gg/en/aion-2/skills/lightning-strike-scattershot> | <https://metabot.gg/web/aion2/skills/17370000.webp> | 2026-10-19 | sk-lightning-strike-scattershot.png |
| sk-cleric-radiant-recovery.png | Radiant Recovery | <https://metabot.gg/en/aion-2/skills/radiant-recovery> | <https://metabot.gg/web/aion2/skills/17120000.webp> | 2026-10-19 | sk-radiant-recovery.png |
| sk-cleric-warm-benediction.png | Warm Benediction | <https://metabot.gg/en/aion-2/skills/warm-benediction> | <https://metabot.gg/web/aion2/skills/17710000.webp> | 2026-10-19 | sk-warm-benediction.png |
| st-cleric-absolution.png | Absolution | <https://metabot.gg/en/aion-2/skills/absolution> | <https://metabot.gg/web/aion2/skills/17290000.webp> | 2026-10-19 | st-absolution.png |
| st-cleric-assault-mark.png | Assault Mark | <https://metabot.gg/en/aion-2/skills/assault-mark> | <https://metabot.gg/web/aion2/skills/17700000.webp> | 2026-10-19 | st-assault-mark.png |
| st-cleric-benevolence.png | Benevolence | <https://metabot.gg/en/aion-2/skills/benevolence> | <https://metabot.gg/web/aion2/skills/17160000.webp> | 2026-10-19 | st-benevolence.png |
| st-cleric-earth-punishment.png | Earth Punishment | <https://metabot.gg/en/aion-2/skills/earth-punishment> | <https://metabot.gg/web/aion2/skills/17400000.webp> | 2026-10-19 | st-earth-punishment.png |
| st-cleric-light-of-protection.png | Light of Protection | <https://metabot.gg/en/aion-2/skills/light-of-protection> | <https://metabot.gg/web/aion2/skills/17410000.webp> | 2026-10-19 | st-light-of-protection.png |
| st-cleric-noble-aura.png | Noble Aura | <https://metabot.gg/en/aion-2/skills/noble-aura> | <https://metabot.gg/web/aion2/skills/17440000.webp> | 2026-10-19 | st-noble-aura.png |
| st-cleric-power-burst.png | Power Burst | <https://metabot.gg/en/aion-2/skills/power-burst> | <https://metabot.gg/web/aion2/skills/17280000.webp> | 2026-10-19 | st-power-burst.png |
| st-cleric-prayer-of-amplification.png | Prayer of Amplification | <https://metabot.gg/en/aion-2/skills/prayer-of-amplification> | <https://metabot.gg/web/aion2/skills/17430000.webp> | 2026-10-19 | st-prayer-of-amplification.png |
| st-cleric-root.png | Root | <https://metabot.gg/en/aion-2/skills/root> | <https://metabot.gg/web/aion2/skills/17190000.webp> | 2026-10-19 | st-root.png |
| st-cleric-salvation.png | Salvation | <https://metabot.gg/en/aion-2/skills/salvation> | <https://metabot.gg/web/aion2/skills/17270000.webp> | 2026-10-19 | st-salvation.png |
| st-cleric-summon-resurrection.png | Summon Resurrection | <https://metabot.gg/en/aion-2/skills/summon-resurrection> | <https://metabot.gg/web/aion2/skills/17390000.webp> | 2026-10-19 | st-summon-resurrection.png |
| st-cleric-voice-of-doom.png | Voice of Doom | <https://metabot.gg/en/aion-2/skills/voice-of-doom> | <https://metabot.gg/web/aion2/skills/17300000.webp> | 2026-10-19 | st-voice-of-doom.png |
| st-cleric-yustiels-power.png | Yustiel's Power | <https://metabot.gg/en/aion-2/skills/yustiels-power> | <https://metabot.gg/web/aion2/skills/17420000.webp> | 2026-10-19 | st-yustiels-power.png |

## Owner list (icons with no provenance record)

None. Every shipped icon now has a row, from ISSUES.md as it stands or from the table above.

## For P27's check

- Match by base name, as here. After the rows are added, 239 of 239 files have a row with a source page, a file URL
  and a date. Before: 210 of 239.
- The owner list section above is the one the check may accept as an alternative to a row; it is empty today.
