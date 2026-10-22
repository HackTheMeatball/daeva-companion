# Assassin build: re-sourced from Metabot and the build witnesses (0.9, P38 #829)

Research, 22 Oct 2026 (fetched 05:01–05:02 UTC). **Docs only: nothing under `data/`, `src/` or `tests/` changed.** Four
Assassin files cite games.gg, gamesfuze, skycoach and corpus: `builds.json` (status `inferred`, verifiedAt 2026-10-16),
`guide/claims.json`, `guide/confidence.json` and `claims-notes.md`. None of those four sites may back a fact any more.
games.gg is on SOURCES.md's Fail list (a 403 challenge; owner browser only). gamesfuze, skycoach and corpus are "No new
use" (audit 2026-10-21). Since then the rule has been that build picks cite top-player pick rates from Metabot
(gamewith.ai is Spot), plus the three build witnesses daevaguides, mmo-codex and aion2turkiye (SOURCES.md, "Build
guides"). aion2-meta is a Korean preview and is no witness either. This file redoes each part of the build against
those sources, in the [Templar pack](2026-10-templar-pack.md) §4 format (§3–§8). §9 maps every citation of the four
sites in the four files to its replacement. §10 says what the data PR should change.

CONFIRMED means at least two independent permitted sources agree. Disputed means they disagree, and the file names the
default it suggests. GUESS means my inference, for the data PR to accept or change. Creator names in brackets are the ones a
compiler site credits.

## 1. Summary

- **Core skills to 10: CONFIRMED.** Heart Gore, Insignia Explosion, Savage Roar, Quick Slice, Rear Smite and Exploit
  Weakness are at 10 in all three leveling builds. Assault Stance is at 10 in two. They can drop `inferred` and cite
  Metabot, daevaguides and aion2turkiye instead.
- **Ambush and Shadowstrike to 10: disputed.** Only Metabot takes them to 10; daevaguides and aion2turkiye stop at 8.
- **Our Impact Hit is unsupported inside Lv 45, and Flash Slice is missing.** Our order spends the last 13 points on
  Impact Hit (to 8). No leveling source takes Impact Hit before 45. Flash Slice is at 10 (Metabot) or 8 (aion2turkiye),
  and we leave it at 1.
- **Stigma set: CONFIRMED** (the same four everywhere). **Slot 1 is wrong:** we put Triniel's Dagger in at 22. Metabot,
  daevaguides and mmo-codex all put Illusive Clone first. Our upgrade targets (Triniel's Dagger 10 → Illusive Clone 20)
  are an after-45 order from one creator (Grobs, via daevaguides and mmo-codex). Inside Lv 45 the sources say "all to 5,
  then Illusive Clone".
- **Specialties:** slots 2 and 3 of our core picks are CONFIRMED. Three slot-1 picks differ from what most sources
  advise *while leveling*: Heart Gore, Quick Slice and Ambush. Ours match aion2turkiye's dungeon panel.
- **Right-click stack:** all three witnesses put Insignia Explosion in row 0. Our stack has Heart Gore in row 0.
- **Stat priority:** Critical Hit and Attack are the top two in every source, but the order is disputed. Back Attack
  Damage Boost and Combat Speed are two-source each.
- **Other citations (§9):** every Assassin build citation gets a permitted replacement. Of the shared-guide claims that
  `claims-notes.md` logs, four drop below two permitted sources once the four sites go: C08, C17, C19 and the Lv 32
  gauge line. They are labelled for Isaac in §9.2.

## 2. Sources read

| Source | Page | What it gives | Independence |
|---|---|---|---|
| Metabot build planner | https://metabot.gg/en/aion-2/classes/assassin/build | Editorial "Leveling 1–45" build (skill levels, stigma per slot); top players (150 characters, share with each skill and average level; stigma per slot) | Main source |
| Metabot class page | https://metabot.gg/en/aion-2/classes/assassin | Top-player Daevanion node pick rates | Same site as above |
| Metabot class-builds guide | https://metabot.gg/en/aion-2/guides/class-builds-guide | Core skills, stat order, board path | Same site |
| daevaguides | https://daevaguides.com/en/assassin/ | Point plan by character level, specialty picks (gold), stigmas by level, stats, right-click rows | Compiler: couga54, GunghoGuns, Grobs, aLuckyRO, Antochi and others. Counts once. Some lines also cite Game8, which we don't use, so those lines are not used here. |
| aion2turkiye | https://aion2turkiye.com/en/class/assassin/ | Leveling / Dungeon / PvP panels: point order (slider data), Lv 45 targets, stigma order, specialty picks; top 25 by Combat Power (stigma shares) | Own sample of 25, separate from Metabot's 150 |
| mmo-codex (Spot, one page) | https://mmo-codex.com/games/aion-2/classes/assassin/ | Client data via aion2.app; Korean top-10% specialty sets (aion2t); stigma order; passive order; stats | Korean data: a preview for Global |

## 3. Skill targets by Lv 45

Budget: 203 points at Lv 45 (`rule:level-points`); a skill costs 21 points from 1 to 10 (1/1/1, 2/2/2, 4/4/4).
"Ours" is what the current `skillOrder` reaches at Lv 45 when its open steps are taken in rank order. I simulated this
with `rule:level-points` and the learn gates (202 of 203 points spent). aion2turkiye's value is where its own point order
reaches at 203 points; its panel's targets assume 261 points ("quests and Sealed Dungeons give more").

| Skill | Ours | Metabot leveling | daevaguides | aion2turkiye leveling (at 203) | Metabot top players, avg Lv | Verdict |
|---|---|---|---|---|---|---|
| Heart Gore | 10 | 10 | 10 (at 28) | 10 | 13.9 | CONFIRMED 10 |
| Insignia Explosion | 10 | 10 | 10 (at 38) | 10 | 13.6 | CONFIRMED 10 |
| Savage Roar | 10 | 10 | 10 (at 25) | 10 | 13.0 | CONFIRMED 10 |
| Quick Slice | 10 | 10 | 10 (at 25) | 10 | 13.9 | CONFIRMED 10 |
| Rear Smite | 10 | 10 | 10 (at 40) | 10 | 13.7 | CONFIRMED 10 |
| Exploit Weakness | 10 | 10 | 10 (at 38) | 10 | 13.5 | CONFIRMED 10 |
| Assault Stance | 10 | 5 | 10 (at 40) | 10 | 13.6 | two-source 10 |
| Shadowstrike | 10 | 10 | 8 (at 22) | 8 | 11.6 | disputed: 10 or 8 |
| Ambush | 10 | 10 | 8 (at 40) | 8 | 11.6 | disputed: 10 or 8 |
| Flash Slice | 1 | 10 | – (on the bar from 8, no points) | 8 | 11.5 | two-source ≥ 8 |
| Impact Hit | 8 | – | – | – (5, after 45 in its order) | 12.7 | not supported inside 45 |
| Storm Rampage | 1 | – | 8 at 34, 10 at 40 | 4 (8 is next) | 11.3 | disputed |
| Infiltrate | 1 | 7 | – | – | 11.3 | single-source |
| Whirlwind Slice | 1 | – | – | 8 | 9.8 | single-source |

Metabot's leveling build costs exactly 203 (nine skills × 21, Infiltrate to 7 = 9, Assault Stance to 5 = 5).
daevaguides' plan comes to 215 and aion2turkiye's to 261, so both expect points from quests and Sealed Dungeons.
Metabot's top-player pick shares are 95–99% for every listed skill. They show which skills players use, not what to
level first, so the average level is the useful signal here.

**Default for the guide (GUESS):**
1. The seven CONFIRMED / two-source skills to 10 (147 points).
2. Shadowstrike and Ambush to 8 (26), the lower value that all three sources reach.
3. Flash Slice to 8 (13).

That makes 186, leaving 17. Spend them on Shadowstrike and Ambush 8 → 9 (4 + 4) and Flash Slice 8 → 9 (4), for 198,
with 5 spare. Or stop at 186 and let the extra points from quests and dungeons finish them. Label Shadowstrike, Ambush
and Flash Slice as disputed, with Metabot's 10 as the alternative. Drop Impact Hit, Defense Break, Determination and
Heightened Sixth Sense from the leveling order, or move them after 45. No permitted source puts them inside the 203 points.
Their current backing is games.gg (Defense Break, Determination, Heightened Sixth Sense) and gamesfuze / skycoach /
games.gg (Impact Hit), and none of those may be cited now.

## 4. Training order

Metabot gives targets only. Two sources give an order:

- **daevaguides** [GunghoGuns, couga54]: Quick Slice and Savage Roar first, then Heart Gore, Shadowstrike and Ambush,
  all in step with the 3-level gate. Then Exploit Weakness from 6 and Rear Smite from 11. Insignia Explosion goes to
  the game limit every time it opens (2 at 14, 4 at 20, … 10 at 38). Assault Stance starts at 19, Heart Gore and
  Shadowstrike reach 8 at 22, Quick Slice and Savage Roar reach 10 at 25, and Heart Gore 10 at 28.
- **aion2turkiye leveling**: Quick Slice, Savage Roar and Heart Gore to 5, then to 8. Next come Rear Smite and Exploit
  Weakness to 5, Whirlwind Slice, Ambush and Insignia Explosion to 8, Assault Stance to 5 and Flash Slice to 8. After
  that the core goes to 10.

Both agree on four points:
- **Quick Slice, Savage Roar and Heart Gore lead.**
- **Insignia Explosion goes up as soon as the gate allows.**
- **The passives (Rear Smite, Exploit Weakness, Assault Stance) come after the actives' first steps.**

Our rank order (Heart Gore, Insignia Explosion, Savage Roar, Quick Slice, Ambush, Rear Smite, Exploit Weakness,
Shadowstrike) is compatible with this. The 3-level gate means rank order changes little before 25. Its `inferred` basis
can be replaced with these two sources and labelled two-source.

## 5. Stigmas

| Slot | Ours | Metabot leveling | Metabot top players (slot, share) | daevaguides | aion2turkiye leveling | aion2turkiye dungeon | mmo-codex (PvE order to level) |
|---|---|---|---|---|---|---|---|
| 1 (Lv 22) | Triniel's Dagger | Illusive Clone | Illusive Clone 95% | Illusive Clone | Savage Fang | Illusive Clone | Illusive Clone |
| 2 (Lv 27) | Illusive Clone | Swift Contract | Swift Contract 90% | Swift Contract | Illusive Clone | Swift Contract | Swift Contract |
| 3 (Lv 32) | Swift Contract | Savage Fang | Savage Fang 77% | Triniel's Dagger | Swift Contract | Triniel's Dagger | Savage Fang |
| 4 (Lv 37) | Savage Fang | Triniel's Dagger | Triniel's Dagger 71% | Savage Fang | Triniel's Dagger | Savage Fang | Triniel's Dagger |

**Set: CONFIRMED.** Illusive Clone, Swift Contract, Savage Fang and Triniel's Dagger appear in every column.
aion2turkiye's top 25 back this up: Illusive Clone 100%, Swift Contract 100%, Triniel's Dagger 80%, Savage Fang 68%.
mmo-codex's Korean meter has all four at 89–96%.

**Order:**
- **Slot 1 = Illusive Clone and slot 2 = Swift Contract: CONFIRMED** (Metabot, daevaguides, mmo-codex).
- **Ours is wrong at slot 1.** Triniel's Dagger at 22 appears in no source.
- **Slots 3 and 4 are disputed.**
  - Savage Fang then Triniel's Dagger: Metabot and mmo-codex.
  - Triniel's Dagger then Savage Fang: daevaguides and aion2turkiye dungeon.
- Default (GUESS): Metabot's order, `stigmaSlots` labelled `disputed` for slots 3 and 4.

**Levels inside Lv 45** (29 stigma shards by 45: Metabot, aion2turkiye):
- Metabot leveling: Illusive Clone 8, Swift Contract 7, Savage Fang 5, Triniel's Dagger 4.
- daevaguides: "All Stigmas to 5, then Illusive Clone to 10."
- aion2turkiye dungeon: all to 5, then Illusive Clone to 10, and Illusive Clone "first and furthest".

So **all four to 5, then Illusive Clone** is CONFIRMED.

Our `stigmaTargets` (Triniel's Dagger 10, then Illusive Clone 20) is daevaguides' and mmo-codex's *after-45* order. Both
credit Grobs, so it counts as one source. It can stay as an after-45 note, but not as the leveling target.

## 6. Specialty picks

Numbers are the specialty positions (`spec:assassin:<skill>:n`). They match daevaguides' and mmo-codex's lists. "Lev"
is a source's leveling advice, "Dun" its dungeon or endgame advice. Slot 1 opens at skill Lv 8, slot 2 at 12, slot 3 at 20.

| Skill | Ours (slot 1, 2, 3) | daevaguides (gold) | aion2turkiye Lev | aion2turkiye Dun | mmo-codex | Verdict |
|---|---|---|---|---|---|---|
| Heart Gore | 3, 4, 5 | 1, 4, 5 | 1, 4, 5 | 3, 4, 5 | top 10% KR: 1·4·5; start: 1; third pick "taste": 1, 3 [Grobs] or 2 | 4 and 5 CONFIRMED; slot 1 while leveling: **1** (three sources), 3 the dungeon alternative |
| Insignia Explosion | 2, 3, 5 | 2, 3, 5 | 2, 3, 5 | 3, 2, 5 | 2·3·5 | set CONFIRMED; order 2 → 3 two-source (aion2turkiye Lev, mmo-codex later picks start with 2) |
| Quick Slice | 3, 4, 5 | 1, 4, 5 | 2, 4, 5 | 3, 4, 5 | top: 3·4·5 (2·4·5 common); start: 1 or 2 | 4 and 5 CONFIRMED; slot 1 while leveling: **1 or 2** (mana or life drain), disputed between them; 3 is the endgame pick |
| Savage Roar | 2, 4 | 2, 3 | 2, 4, 5 | 2, 4, 3 | 2·3·4 | 2 CONFIRMED; 4 as slot 2 two-source (aion2turkiye, mmo-codex has it in the set); daevaguides takes 3 |
| Ambush | 1, 2 | 2, 5 | 2 | 1, 2 | start: 2 | slot 1 while leveling: **2** (three sources); ours (1 then 2) is aion2turkiye's dungeon order |
| Shadowstrike | 2, 1 | 2 | – | 2 | PvE 2, then 3 at 16 | 2 CONFIRMED; our slot 2 (1, inferred) has no source |

Our slot-1 picks for Heart Gore, Quick Slice and Ambush follow aion2turkiye's dungeon panel. The leveling advice in
the three witnesses is mana and life drain first. Whether the leveling guide should show the leveling pick or the
endgame pick is a guide decision, not a data question. I suggest the leveling pick, with the endgame one as the
labelled alternative (GUESS).

The current `specialtyEvidence` cites skycoach, corpus and aion2-meta. Rewrite it against daevaguides, aion2turkiye
and mmo-codex; every CONFIRMED row above already has two of them.

## 7. Stat priority and board path

| Stat | Ours | Metabot class-builds guide | daevaguides | mmo-codex | Verdict |
|---|---|---|---|---|---|
| Critical Hit | tier 1 | 2nd | 1st ("Heart Gore only resets on a crit") | 2nd | top two, CONFIRMED |
| Attack | tier 2 | 1st | 2nd (with PvE Damage, Crit Damage) | 1st | top two, CONFIRMED; order vs Crit disputed |
| Back Attack Damage Boost | tier 2 | 3rd | – | "Korean players collect +back attack damage" | two-source |
| Combat Speed | tier 2 | – | with Cooldown Reduction | 3rd | two-source |
| Accuracy | – | 4th | "first, if you miss often" | "only up to the minimum you need" | conditional, leave out |

Default (GUESS): tier 1 Critical Hit and Attack (disputed order), tier 2 Back Attack Damage Boost and Combat Speed.
Replace games.gg and gamesfuze in `statPriority.sources` with the Metabot guide, daevaguides and mmo-codex.

**Board path:** this is already corroborated
(`/mnt/project-files/game-data-check/metaroad-builds-2026-10-22.md`, the Assassin trial).
- The Metabot guide runs Nezekan's Assault Stance and Exploit Weakness node pairs first, then Zikel's Defense Break.
- Metabot's top players pick Heart Gore on Nezekan and Insignia Explosion on Zikel at 98% each.
- aion2turkiye opens Nezekan then Zikel, through the +1 Heart Gore, Insignia Explosion and Quick Slice nodes (95%+ of
  its top players).

Our plan's nodes are in all of these. The node costs are the owner's (2026-10-20) and stay.

## 8. Rotation: right-click stack

| Row | Ours (from Lv 14) | daevaguides | aion2turkiye dungeon | mmo-codex |
|---|---|---|---|---|
| 0 | Heart Gore | Insignia Explosion | Insignia Explosion | Insignia Explosion |
| 1 | Ambush | Heart Gore | Ambush (optional) | Heart Gore |
| 2 | Insignia Explosion | Ambush | Heart Gore | Savage Roar |
| 3 | Savage Roar | Savage Roar | Savage Roar | – |

**Insignia Explosion in row 0 and Savage Roar last: CONFIRMED** (three witnesses). Ours puts Heart Gore in row 0.
Heart Gore only fires after a crit, so a row-0 Heart Gore that isn't lit is skipped, and the difference is smaller
than it looks. Still, no source orders it that way. Heart Gore against Ambush in rows 1–2 is disputed. Stigmas stay
manual (aion2turkiye: "putting them in the macro loses damage"; daevaguides: "manually, never in a macro"), as the
guide already says. `keyStacks.status` stays `inferred` for the binding. The row order can cite these three sources
once it is changed.

## 9. Every citation of the four sites in the four files

### 9.1 Build citations (Assassin files)

| File, entry | Cites today | Replacement (this research) | Outcome |
|---|---|---|---|
| `builds.json` `statPriority` | Metabot, games.gg, gamesfuze | Metabot class-builds guide, daevaguides, mmo-codex (§7) | still verified; Attack joins tier 1 (pick change, §7) |
| `builds.json` `skillOrder` (Assault Stance, Impact Hit, Flash Slice, Storm Rampage, Defense Break, Determination, Heightened Sixth Sense) | gamesfuze, skycoach, games.gg, Metabot guide | Metabot leveling build, daevaguides, aion2turkiye (§3) | Assault Stance two-source; Flash Slice two-source ≥ 8; Storm Rampage disputed; Impact Hit, Defense Break, Determination, Heightened Sixth Sense **unsupported inside Lv 45** (pick change, §3) |
| `builds.json` `skillOrderNotes.skip` | games.gg, skycoach | Metabot leveling build and aion2turkiye leave Apply Poison, Ambush Stance, Shadow Fall out of 1–45; daevaguides levels none of them | skip list stays, re-sourced; Infiltrate is Metabot 7 (single), Defiance aion2turkiye 8 at the end (single) |
| `builds.json` `specialtyEvidence` and `sources[]` | skycoach, corpus, aion2-meta, aion2turkiye | daevaguides, aion2turkiye (both panels), mmo-codex (§6) | slots 2 and 3 CONFIRMED by the witnesses; slot 1 changes are picks (§6) |
| `builds.json` `conflicts` and `notes` (stigma order, upgrade plan) | Metabot, gamesfuze, skycoach | §5 | set CONFIRMED; slots 1–2 CONFIRMED (differs from ours); slots 3–4 disputed; leveling targets "all to 5, then Illusive Clone" |
| `builds.json` `keyStacks.sources` | daevaguides, aion2turkiye, Metabot (no banned site) | unchanged; right-click rows §8 | – |
| `claims.json` C20 (stat tiers) | Metabot class page, games.gg, gamesfuze, Metabot stats | as `statPriority` | verdict stays `disputed` until the data PR rewrites it with §7 |
| `claims.json` C28c (Build tab text: "GamesFuze ranks Heart Gore first") | thegameswiki, gamesfuze | The sentence names GamesFuze. Rewrite it without the name: "Leveling order from Metabot, daevaguides and aion2turkiye" (§4) | text change |
| `claims.json` C40a (slot-2 picks) | skycoach, corpus, aion2-meta, aion2turkiye | daevaguides, aion2turkiye, mmo-codex (§6): Insignia Explosion 3 and Savage Roar 4 become two-source; Ambush 2 is CONFIRMED as a pick (three sources) but is our slot **2**, while the witnesses take it at slot 1; Shadowstrike 1 stays `inferred` | re-label |
| `confidence.json` `conf:first-nodes` | Metabot, couga54, GamesFuze, games.gg, ExpCarry | Board: Metabot guide and top players, aion2turkiye (§7). "Which core skill first": Quick Slice and Savage Roar (daevaguides, aion2turkiye; §4) | group can move from `disputed` to verified for "which skill first"; the board blend stays as it is |
| `confidence.json` `conf:skill-order-single` | games.gg | §3 | the four skills it names leave the leveling order (§3) |
| `confidence.json` `conf:skill-order-two-source` | GamesFuze, Skycoach | Metabot, daevaguides, aion2turkiye | text change |
| `confidence.json` `conf:stat-tiers` | Metabot, games.gg, GamesFuze | Metabot, daevaguides, mmo-codex | text change |
| `confidence.json` `conf:stigma-order` | Metabot, Skycoach, GamesFuze | Metabot and mmo-codex vs daevaguides and aion2turkiye dungeon (§5) | stays `disputed` |
| `confidence.json` `conf:stigmas` (upgrade plan) | Metabot, allthings.how, GamesFuze, Skycoach | Slots and shard cost: Metabot (unchanged). Upgrade plan: §5 | verified for "all to 5, then Illusive Clone"; the after-45 order is single-origin (Grobs) |
| `claims-notes.md` C03, C20 lines | Skycoach, games.gg, GamesFuze | C03: Metabot build planner ("8, 12, and 20") and mmo-codex ("Lv 8 · Lv 12 · Lv 20"); C20: §7 | C03 stays verified |

### 9.2 Shared-guide claims logged in `claims-notes.md`

These claims live in `data/packs/aion2/asmodian/guide/claims.json`, not in an Assassin file. The Assassin notes file is
only where the evidence was logged. The table drops the four sites and shows what is left. I didn't fetch anything new
for these. A new source for each "needs a source" row is a follow-up (a Metabot spot check first), and the owner check
is the fallback.

| Claim (shared) | Verdict today | Left after dropping the four sites | Outcome |
|---|---|---|---|
| C06 Ascension Trial 1,000 / 1,500 | verified | thegameswiki, mein-mmo | still two sources (mein-mmo's SOURCES.md row is narrow: worth a look) |
| C07 Abyss Points spending | single-source | KeenGamer (owner browser only) | stays single-source |
| C08 Krao Cave Normal gear score 700 | verified | thegameswiki only | **needs a source**: drops to single-source. Metabot's Krao Cave page is the first place to check |
| C09 Shugo Festival keys | wrong | Metabot, mein-mmo | still backed |
| C11 Expedition 7×/week | disputed | KeenGamer, Metabot, thegameswiki | stays disputed |
| C15 Duty Quests | verified | thegameswiki, KeenGamer, mein-mmo, allthings.how (neonsect is No new use) | still two sources |
| C16 Supply Requests | single-source | allthings.how, KeenGamer, mein-mmo | stays single-source |
| C17 Marketplace needs the subscription | verified | playnews.gg (owner browser only), massivelyop.com (not in SOURCES.md) | **needs a source**: no vetted source left. Owner check |
| C18 Cash shop cosmetic | disputed | playnews.gg, massivelyop.com | stays disputed |
| C19 Command scrolls vendor | verified | mein-mmo only | **needs a source**: drops to single-source |
| Lv 32 ascension gauge at 100% (C36–C38 note) | verified | allthings.how only (Spot) | **needs a source**: drops to single-source |
| Lesser Daeva Wings on The Being Beneath the Lake | DB field | Metabot game-database field | still verified (a DB field); the Skycoach dissent just goes |

The same four sites are also cited outside the Assassin files. A search of `data/**` finds them in the shared guide
(`claims.json`, `tips.json`, `unlocks.json`), `sources.json`, `boards.json`, `rules.json`, `terms.json`, the Gladiator, Templar and Cleric
packs, and `classes/assassin/skills.json`. That is outside P38's four files
and is listed here so it isn't lost.

## 10. What the data PR should change

1. `skillOrder`: cite Metabot (leveling build), daevaguides and aion2turkiye.
   - Mark the six CONFIRMED skills `verified` and Assault Stance two-source.
   - Mark Shadowstrike and Ambush disputed with a target of 8.
   - Add Flash Slice at 8.
   - Move Impact Hit, Defense Break, Determination and Heightened Sixth Sense out of the leveling order (or after 45).
   - Rewrite `skillOrderNotes` (skip list, budget).
2. `stigmaSlots`: Illusive Clone, Swift Contract, Savage Fang, Triniel's Dagger (slots 3 and 4 disputed).
3. `stigmaTargets`: all four to 5, then Illusive Clone. Keep the after-45 order (Triniel's Dagger 10, Illusive Clone 20)
   as a labelled note.
4. `specialtyPicks` slot 1: Heart Gore 1, Ambush 2, Quick Slice 1 or 2 (disputed). Rewrite `specialtyEvidence` against
   the witnesses. Shadowstrike slot 2 stays `inferred` or is dropped.
5. `statPriority`: Critical Hit and Attack in tier 1, plus the new sources.
6. `keyStacks` right-click rows from Lv 14: Insignia Explosion, Heart Gore, Ambush, Savage Roar. Also drop the last
   sentence of the Assassin's `tip:rotation-play` (#826: "This guide's stack tries Heart Gore before Insignia
   Explosion") and C57's note about it.
7. `sources` and `conflicts`: remove games.gg, gamesfuze, skycoach, corpus and aion2-meta, and add the URLs in §2. The
   generator carries them to the Sources card and `data/DATA_SOURCES.md`.

Every item except the pure re-sourcing in item 7 (and the text-only rows of §9.1) changes a pick. I'm sending those changes
to Isaac to decide: Impact Hit out and Flash Slice in, stigma slot 1, the slot-1 specialties and Attack in tier 1. The
right-click row order (item 6) is a fact correction, not a pick. Three witnesses agree on it, against an `inferred` value
that has no source, so it's Game Data Check's call (ruled on #826, 2026-10-22). The citations can be swapped whatever he decides. A pick he keeps against this research keeps its
label (`disputed` or `inferred`) and names the dissenting sources.

Items 1–6 change what the player sees, so the data PR needs before / after shots and Jane's DESIGN OK. Items 2 and 6
change the opener (E order and right-click rows), and the keyStacks checks from #787 will need their expectations
updated. Saves: these keys are item keys (`sp:<skill>:<L>`, stigma keys), not positions, so no save break is expected.
This is inferred, and the data PR should run `e2-migtest`.

## 11. Fetching record

Policy: `CLAUDE.md` and `docs/research/SOURCES.md`. Every host used is already listed there, so SOURCES.md is unchanged.
- User-Agent: `DaevaCompanionResearch/0.1 (+https://daevacompanion.com; research probe)`.
- Requests went one at a time per host, and stopped on 403 / 429 / a challenge (none happened).
- Six pages in all, 05:01:21–05:01:48 UTC: three Metabot, one daevaguides, one aion2turkiye, and one mmo-codex (Spot:
  one page for this task).
- Each request is logged in `/mnt/project-files/legal/fetch-log/gretchen.md`.
- Facts only: no wording or page copy is kept, and the local copies were deleted after reading.
