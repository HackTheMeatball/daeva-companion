# Known issues and gaps

Open items carried over from the polish passes (E1–E4, QA2/QA3) and the move to this repo. Data gaps are left as gaps
on purpose: the guide shows nothing rather than an unverified value.

## Data gaps

- **Regional quests without prerequisite data** (7): Her Last Favor, Pain Unending, Traveling Merchant's Conundrum,
  Herb Pouch Heist, Lest We Forget, Spacetime Rift: Unknown Species / Proof. They open at their recommended level
  (`noPre`); *Not in game yet* is the fallback if the game disagrees. The `regress` soft check "no prerequisite data
  (open from Lv 10)" reports these by design. Shugo-of-All-Trades, Spooky Specters and The Great Curse-Breaking Caper
  got their story gate from the owner's in-game checks (2026-10-15, #69).
- **Kibelisks missing**: 32 regional quest givers, Fafnite Storage Room (Metabot lists only the entrance zone, Sanctum
  Outpost), the Blood Barrier turn-in.
- **Story gate semantics**: whether a story gate means "quest accepted" or "quest reached" was not re-checked against
  aion2.gaming.tools (polish pass E4 #9, not 0.3 E4). Example: Fight Poison with Poison at "Preparations for Restoration" (data says it needs
  "A Collective Effort"); the *In my game* pill is the one-click override.
  **Answered 2026-10-15 (owner, in game, #69): "turned in"** for regional quests (Shugo-of-All-Trades after Contaminated
  Area, Spooky Specters after Cemetery Cleanup). Every regional story gate now says `turnedIn`. Confirmed by the Lv 16
  Empyrean Monolith check (20:12 ET): all 6 of its regional quests appeared only after it was turned in.
- **Owner refs of 2026-10-15 (alt character, #69)**: the screens are in the private repo, one code per finding,
  numbered in the order the alt reached them. Build is unrecorded for all of them.

  | Ref | Finding | Cited in |
  |---|---|---|
  | `owner:2026-10-15-alt-01` | Skill points earned at Lv 4 / 7 / 10 / 11 = 1 / 7 / 16 / 20 (matches the table) | `rule:level-points` |
  | `owner:2026-10-15-alt-02` | "Signs of a Crash Landing" (Lv 6) gives 1,000 Power Shards (Bound) | claim C25, `tip:traces` |
  | `owner:2026-10-15-alt-03` | Skill window at Lv 7: skill-level gate (Savage Roar Lv 5 needs Lv 10, Storm Rampage Lv 3 needs Lv 8) and the 2-point cost of Lv 5 | claim C02, `rule:skill-level-gate`, `rule:skill-point-cost` |
  | `owner:2026-10-15-alt-04` | Shugo-of-All-Trades is not offered while Contaminated Area is current, appears once it is turned in | `rq:2202044` |
  | `owner:2026-10-15-alt-05` | Spooky Specters is not offered while Cemetery Cleanup is current, appears once it is turned in | `rq:2202051` |
  | `owner:2026-10-15-alt-06` | Cemetery Cleanup step 4 clears the Graverobber Den stronghold (map check mark) | `sh:graverobber-den` |
  | `owner:2026-10-15-alt-07` | Disturbed Balance / Canyon's Secret / Mirror of Greed investigation steps are the first Krao Cave / Urugugu Canyon / Fire Temple Expedition runs (from memory) | `g20:exp`, `g35:exp`, the three story step notes |
  | `owner:2026-10-15-alt-08` | Empyrean Monolith (Lv 16): all 6 regional quests it gates appear only once it is turned in | `rq:2202010`, `-12`, `-13`, `-14`, `-15`, `-23` |

  `owner:2026-10-15-alt-26` (#68, Lv 2–6 checks) is an earlier code of the same set.
- **Owner refs of 2026-10-16 (0.2.4 checks, #107)**: given in chat at 03:02 ET. Build is unrecorded. The schema's ref
  pattern needs a number, so the codes carry `-01`.

  | Ref | Finding | Cited in |
  |---|---|---|
  | `owner:2026-10-16-hugo-01` | Turned in Hugo Mercenaries: Past and Present (screenshot); Deep Shadow was not offered afterwards, so Past and Present alone does not open it | `rq:2202011` (prereq-gates §11 check 9) |
  | `owner:2026-10-16-hugo-02` | Owner, by hand on th.gl + in-game observation (screenshot, 03:07 ET): Deep Shadow needs Canyon's Secret + Past and Present and unlocks An Old Promise; both edges owner-confirmed. th.gl is not cited | `rq:2202011` (check 9 answered) |
  | `owner:2026-10-16-quickslice-01` | Quick Slice tooltip (screenshot, 03:05 ET), Lv 7 (+1), slot 1 open, two slots locked: +20% MP restored; Absorbs 0.7% HP; +50% Multi-Hit on hit; Lv 12: −1s [Insignia Explosion] cooldown on hit; Lv 16: "Ignores Block and Evasion and lands a…" (cut off, not completed) | `specialtyEvidence` `spec:assassin:quick-slice:4`, claim C40 |
  | `owner:2026-10-16-daeva-trapped-01` | Owner's own lookup (03:14 ET, #108; th.gl checked by hand, not cited): Daeva Trapped in a Nightmare is given by Koro at the Abyss Base; objectives: complete The One Who Witnesses the Nightmare, then talk to Nemon at the Outskirts Stall; previous Forgotten Commander, next Waiting for the Next Journey (story 89/89) | `sq:2102810` giver (single source), claim C41 |
  | `owner:2026-10-16-zikel-01` | Zikel board is 11×11; its two Defense Break +1 nodes are at row 10 column 9 and row 4 column 5 (1-based), i.e. `r12c11` and `r6c7` in Metabot's 15×15 frame | `dv:z:db`, `dv:z:db2` |
- **Unverified, left out**: Kibelisk and Command mission unlock levels.
- **Dungeon XP**: removed from the UI; known for only a few dungeons.
- **Inferred (labelled in the app)**: core skill-point order, right-click row order and E stack, Vaizel / Triniel
  corner stats, Daevanion path costs, stronghold level bands. **Disputed (both sides shown)**: respec cost after 31,
  expedition weekly cap, stigma slot 3/4 order, first Daevanion nodes, cash-shop scope. See the Confidence card.
- **Zone assumption**: Safe Haven → Dredgion Crash Site has no strict map majority (Hidden Vein Cave, 460 m away, votes
  Nameless Cemetery). Chosen from the Safe Haven Cliff stronghold and allthings.how's filing (E3 P1-9).
- **"Daeva Trapped in a Nightmare" (`sq:2102810`) is the last story quest in the data since 0.3 E10** (#108; owner decision
  Q7, `owner:2026-10-16-daeva-trapped-01`). Metabot confirms everything except the giver: **Koro at the Abyss Base is single
  source** (the owner's own lookup, claim C41; Metabot's page names no giver, though Forgotten Commander turns in at Koro,
  marker "Abyss Base"). Owner check at Lv 45: the giver and where he stands (zone `zone:altgard-unplaced` until then).
  The owner's lookup shows "Steps: 1" but two numbered lines; the second (talk to Nemon at the Outskirts Stall) is
  Metabot's turn-in, so the record has one objective plus the turn-in.
- **"Waiting for the Next Journey" is not in the data** (story quest 89/89 on the owner's lookup). Metabot's Asmodian page:
  chapter 7 "Shadows Cast Everywhere", recommended and unlocks at **Lv 46**, one step "Wait for the right time" (Altgard),
  no giver, turn-in or id. It is past the Lv 45 cap, so it is only named in the end-of-story text ("next in game … at Lv
  46", `end.next` / `end.nextLv`). Owner check if the guide ever goes past Lv 45: its giver, turn-in and id.
- C27 (optional board re-check prompt at Lv 20/30/40) not added; the board card already flags a total below the
  level formula.

## App / UX

- **Story-implied completion is display-only** (0.1.3). Next up no longer offers a `byStory` step once the story is
  past that quest, but the tick is still written only by *Turned in*, so a save whose story position was set by hand
  (Journey input, mid-level onboarding) keeps those steps unticked in their milestone (x/y count, "Missed" tag). Same
  for ascension steps the story implies (e.g. `g32:dreams` once "A Daeva Dreaming Anew" is turned in). Derived
  completion (`completesWith` in the architecture audit's target model) is planned for the 0.3 requirement audit.
- **Home Screen hint, one sentence held back** (0.2.5, owner check on an iPhone). The hint would end with "The Home
  Screen copy starts empty: import your file there." No permitted source says whether a Home Screen web app shares the
  Safari tab's storage (docs/design/0.2.5-save-safety.md §2), so the sentence is left out until checked: add the site to
  the Home Screen from a Safari tab with progress, open it, and see whether the progress is there.
- **`g45:witness` story chip** (`g45:0` until 0.3 E10) says "your current quest" while "Forgotten Commander" is open;
  the step itself waits in Next up until that quest is turned in.

- **Sources card has 300 links** (collapsed per site). The `regress` soft check "<= 60 links" fails by design: `e2`
  requires every source URL to be listed.
- **Brand art is original** (not game art): `public/favicon.svg`, `public/icons/*.png` and `brand/*.svg` are drawn as code
  by `tools/brand/build.py` (Daeva Companion, direction C), 2026-10-13. No NC material in them.
- **Icon provenance not recorded** for the first 23 PNGs. All PNGs in `src/assets/icons/` are NC Corporation's art. Record
  where each file came from (site + page URL + file URL + date), so any permission request or takedown can be answered
  quickly. Fill in, then keep:

  | File | Source page | Retrieved |
  |---|---|---|
  | sk-impact-hit.png | <https://metabot.gg/en/aion-2/skills/impact-hit-assassin> · file <https://metabot.gg/web/aion2/skills/13760000.webp> (256 px WebP → 128 px PNG) | 2026-10-15 |
  | sk-flash-slice.png | <https://metabot.gg/en/aion-2/skills/flash-slice> · file <https://metabot.gg/web/aion2/skills/13050000.webp> (256 px WebP → 128 px PNG) | 2026-10-15 |
  | sk-storm-rampage.png | <https://metabot.gg/en/aion-2/skills/storm-rampage> · file <https://metabot.gg/web/aion2/skills/13340000.webp> (256 px WebP → 128 px PNG) | 2026-10-15 |
  | sk-determination.png | <https://metabot.gg/en/aion-2/skills/determination> · file <https://metabot.gg/web/aion2/skills/13800000.webp> (256 px WebP → 128 px PNG) | 2026-10-15 |
  | sk-heightened-sixth-sense.png | <https://metabot.gg/en/aion-2/skills/heightened-sixth-sense> · file <https://metabot.gg/web/aion2/skills/13710000.webp> (256 px WebP → 128 px PNG) | 2026-10-15 |
  | blue-off.png, blue-on.png, green-off2.png, green-on2.png, orange-off.png, orange-on.png | | |
  | daevanion-crystal.png, enhance-stone.png, wisdom-stone.png | | |
  | sk-ambush.png, sk-assault-stance.png, sk-defense-break.png, sk-exploit-weakness.png, sk-heart-gore.png | | |
  | sk-insignia-explosion.png, sk-quick-slice.png, sk-rear-smite.png, sk-savage-roar.png | | |
  | sk-shadowstrike.png | <https://metabot.gg/en/aion-2/skills/shadowstrike> · file <https://metabot.gg/web/aion2/skills/13070000.webp> (256 px WebP → 128 px PNG; matches the 256 px copy in docs/research/map-icons-2026-10-18/ scaled down, mean pixel difference under 3 of 255) | 2026-10-18 (match checked) |
  | st-illusive-clone.png, st-savage-fang.png, st-swift-contract.png, st-triniels-dagger.png | | |
- **Ranger skill and stigma icons: in the site, initials in the claude.ai artifact** (0.6 P5 shipped without them, #264;
  fetched 2026-10-18 7:17–7:21 AM ET for 0.6.1 F5, gate `research-ranger-icons`, docs/research/2026-10-ranger-icons.md).
  All 15 planned icons (11 skills, 4 stigmas: every Ranger skill and stigma the build plan shows) came from Metabot; none
  lacks an approved source, so no Ranger placeholder is left for the owner. 0.6.1 F5 (#338) moved them to
  `src/assets/icons/` (256 px WebP → 128 px PNG, like the Assassin's) and set each record's `icon` in
  `data/packs/aion2/classes/ranger/{skills,stigmas}.json`. The frozen claude.ai artifact never got them (it shows the
  initials square); since 0.7 P9 it is not built, so no `/_blob/` id is needed. Ranger skills outside the plan show no
  icon slot, so need none.

  | File | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|
  | sk-snipe.png | Snipe | <https://metabot.gg/en/aion-2/skills/snipe> | <https://metabot.gg/web/aion2/skills/14020000.webp> | 2026-10-18 |
  | sk-tempest-shot.png | Tempest Shot | <https://metabot.gg/en/aion-2/skills/tempest-shot> | <https://metabot.gg/web/aion2/skills/14340000.webp> | 2026-10-18 |
  | sk-marking-shot.png | Marking Shot | <https://metabot.gg/en/aion-2/skills/marking-shot> | <https://metabot.gg/web/aion2/skills/14090000.webp> | 2026-10-18 |
  | sk-drill-dart.png | Drill Dart | <https://metabot.gg/en/aion-2/skills/drill-dart> | <https://metabot.gg/web/aion2/skills/14050000.webp> | 2026-10-18 |
  | sk-gale-arrow.png | Gale Arrow | <https://metabot.gg/en/aion-2/skills/gale-arrow> | <https://metabot.gg/web/aion2/skills/14110000.webp> | 2026-10-18 |
  | sk-burst-arrow.png | Burst Arrow | <https://metabot.gg/en/aion-2/skills/burst-arrow> | <https://metabot.gg/web/aion2/skills/14080000.webp> | 2026-10-18 |
  | sk-deadshot.png | Deadshot | <https://metabot.gg/en/aion-2/skills/deadshot> | <https://metabot.gg/web/aion2/skills/14010000.webp> | 2026-10-18 |
  | sk-focused-eye.png | Focused Eye | <https://metabot.gg/en/aion-2/skills/focused-eye> | <https://metabot.gg/web/aion2/skills/14740000.webp> | 2026-10-18 |
  | sk-hunters-resolve.png | Hunter's Resolve | <https://metabot.gg/en/aion-2/skills/hunters-resolve> | <https://metabot.gg/web/aion2/skills/14750000.webp> | 2026-10-18 |
  | sk-snare-shot.png | Snare Shot | <https://metabot.gg/en/aion-2/skills/snare-shot> | <https://metabot.gg/web/aion2/skills/14130000.webp> | 2026-10-18 |
  | sk-concentrated-fire.png | Concentrated Fire | <https://metabot.gg/en/aion-2/skills/concentrated-fire> | <https://metabot.gg/web/aion2/skills/14720000.webp> | 2026-10-18 |
  | st-vaizels-authority.png | Vaizel's Authority | <https://metabot.gg/en/aion-2/skills/vaizels-authority> | <https://metabot.gg/web/aion2/skills/14310000.webp> | 2026-10-18 |
  | st-bow-of-blessing.png | Bow of Blessing | <https://metabot.gg/en/aion-2/skills/bow-of-blessing> | <https://metabot.gg/web/aion2/skills/14220000.webp> | 2026-10-18 |
  | st-supporting-fire.png | Supporting Fire | <https://metabot.gg/en/aion-2/skills/supporting-fire> | <https://metabot.gg/web/aion2/skills/14380000.webp> | 2026-10-18 |
  | st-griffon-arrow.png | Griffon Arrow | <https://metabot.gg/en/aion-2/skills/griffon-arrow> | <https://metabot.gg/web/aion2/skills/14060000.webp> | 2026-10-18 |

- **Gladiator skill and stigma icons: initials for now** (0.7 P2 shipped without them, #345). The Gladiator research
  (docs/research/2026-10-gladiator-pack.md, docs/research/2026-10-gladiator-guide.md) saved no icon files, and bot
  builds have no web, so the Gladiator's build plan shows the initials square for each skill and stigma. Metabot is the
  approved source for all of them (standing icon OK, owner 2026-10-14), so none needs the owner: a research or fetch
  session takes the 14 files from each record's Metabot page, as 0.6.1 F5 did for the Ranger, and records source page,
  file URL and date here. The 14 the plan shows:

  **Files fetched 2026-10-19** (gate `research-gl-sm-icons`, 0.8): all 14 found on Metabot, none needs the owner. Staged in
  `docs/research/icons-2026-10-19/` (128 px RGB PNG from Metabot's 256 px WebP, Lanczos, like the Ranger's), not wired
  yet: 0.8 P1 moves them to `src/assets/icons/` and sets each record's `icon`. That folder's README has the method.

  | File | Kind | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|---|
  | sk-rending-blow.png | skill | Rending Blow | <https://metabot.gg/en/aion-2/skills/rending-blow> | <https://metabot.gg/web/aion2/skills/11010000.webp> | 2026-10-19 6:20 AM ET |
  | sk-overhead-slam.png | skill | Overhead Slam | <https://metabot.gg/en/aion-2/skills/overhead-slam> | <https://metabot.gg/web/aion2/skills/11170000.webp> | 2026-10-19 6:20 AM ET |
  | sk-keen-strike.png | skill | Keen Strike | <https://metabot.gg/en/aion-2/skills/keen-strike> | <https://metabot.gg/web/aion2/skills/11020000.webp> | 2026-10-19 6:21 AM ET |
  | sk-ruinous-blow.png | skill | Ruinous Blow | <https://metabot.gg/en/aion-2/skills/ruinous-blow> | <https://metabot.gg/web/aion2/skills/11100000.webp> | 2026-10-19 6:21 AM ET |
  | sk-attack-preparation.png | skill | Attack Preparation | <https://metabot.gg/en/aion-2/skills/attack-preparation> | <https://metabot.gg/web/aion2/skills/11750000.webp> | 2026-10-19 6:21 AM ET |
  | sk-experienced-counterstrike.png | skill | Experienced Counterstrike | <https://metabot.gg/en/aion-2/skills/experienced-counterstrike> | <https://metabot.gg/web/aion2/skills/11780000.webp> | 2026-10-19 6:21 AM ET |
  | sk-murderous-burst.png | skill | Murderous Burst | <https://metabot.gg/en/aion-2/skills/murderous-burst> | <https://metabot.gg/web/aion2/skills/11800000.webp> | 2026-10-19 6:21 AM ET |
  | sk-crushing-wave.png | skill | Crushing Wave | <https://metabot.gg/en/aion-2/skills/crushing-wave> | <https://metabot.gg/web/aion2/skills/11050000.webp> | 2026-10-19 6:22 AM ET |
  | sk-rush-strike.png | skill | Rush Strike | <https://metabot.gg/en/aion-2/skills/rush-strike> | <https://metabot.gg/web/aion2/skills/11360000.webp> | 2026-10-19 6:22 AM ET |
  | sk-leaping-slam.png | skill | Leaping Slam | <https://metabot.gg/en/aion-2/skills/leaping-slam> | <https://metabot.gg/web/aion2/skills/11190000.webp> | 2026-10-19 6:22 AM ET |
  | st-lunge-stance.png | stigma | Lunge Stance | <https://metabot.gg/en/aion-2/skills/lunge-stance> | <https://metabot.gg/web/aion2/skills/11400000.webp> | 2026-10-19 6:22 AM ET |
  | st-zikels-blessing.png | stigma | Zikel's Blessing | <https://metabot.gg/en/aion-2/skills/zikels-blessing> | <https://metabot.gg/web/aion2/skills/11250000.webp> | 2026-10-19 6:22 AM ET |
  | st-lifestealing-blade.png | stigma | Lifestealing Blade | <https://metabot.gg/en/aion-2/skills/lifestealing-blade> | <https://metabot.gg/web/aion2/skills/11340000.webp> | 2026-10-19 6:23 AM ET |
  | st-rage-burst.png | stigma | Rage Burst | <https://metabot.gg/en/aion-2/skills/rage-burst> | <https://metabot.gg/web/aion2/skills/11390000.webp> | 2026-10-19 6:23 AM ET |

- **Spiritmaster skill and stigma icons: initials for now** (0.7 P4 shipped without them, #347). The Spiritmaster
  research (docs/research/2026-10-spiritmaster-pack.md) saved no icon files, and bot builds have no web, so the
  Spiritmaster's build plan shows the initials square for each skill and stigma. Metabot is the approved source for all
  of them (standing icon OK, owner 2026-10-14), so none needs the owner: a research or fetch session takes the 15 files
  from each record's Metabot page and records source page, file URL and date here. The 15 the plan shows:

  **Files fetched 2026-10-19** (gate `research-gl-sm-icons`, 0.8): all 15 found on Metabot, none needs the owner. Staged in
  `docs/research/icons-2026-10-19/` (128 px RGB PNG from Metabot's 256 px WebP, Lanczos, like the Ranger's), not wired
  yet: 0.8 P1 moves them to `src/assets/icons/` and sets each record's `icon`. That folder's README has the method.

  | File | Kind | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|---|
  | sk-cold-shock.png | skill | Cold Shock | <https://metabot.gg/en/aion-2/skills/cold-shock> | <https://metabot.gg/web/aion2/skills/16010000.webp> | 2026-10-19 6:23 AM ET |
  | sk-combustion.png | skill | Combustion | <https://metabot.gg/en/aion-2/skills/combustion> | <https://metabot.gg/web/aion2/skills/16040000.webp> | 2026-10-19 6:23 AM ET |
  | sk-summon-fire-spirit.png | skill | Summon: Fire Spirit | <https://metabot.gg/en/aion-2/skills/summon-fire-spirit> | <https://metabot.gg/web/aion2/skills/16100000.webp> | 2026-10-19 6:23 AM ET |
  | sk-summon-water-spirit.png | skill | Summon: Water Spirit | <https://metabot.gg/en/aion-2/skills/summon-water-spirit> | <https://metabot.gg/web/aion2/skills/16110000.webp> | 2026-10-19 6:24 AM ET |
  | sk-jointstrike-curse.png | skill | Jointstrike: Curse | <https://metabot.gg/en/aion-2/skills/jointstrike-curse> | <https://metabot.gg/web/aion2/skills/16140000.webp> | 2026-10-19 6:24 AM ET |
  | sk-dimensional-control.png | skill | Dimensional Control | <https://metabot.gg/en/aion-2/skills/dimensional-control> | <https://metabot.gg/web/aion2/skills/16330000.webp> | 2026-10-19 6:24 AM ET |
  | sk-elemental-fusion.png | skill | Elemental Fusion | <https://metabot.gg/en/aion-2/skills/elemental-fusion> | <https://metabot.gg/web/aion2/skills/16300000.webp> | 2026-10-19 6:24 AM ET |
  | sk-spirit-strike.png | skill | Spirit Strike | <https://metabot.gg/en/aion-2/skills/spirit-strike> | <https://metabot.gg/web/aion2/skills/16710000.webp> | 2026-10-19 6:24 AM ET |
  | sk-corrode.png | skill | Corrode | <https://metabot.gg/en/aion-2/skills/corrode> | <https://metabot.gg/web/aion2/skills/16740000.webp> | 2026-10-19 6:25 AM ET |
  | sk-summon-earth-spirit.png | skill | Summon: Earth Spirit | <https://metabot.gg/en/aion-2/skills/summon-earth-spirit> | <https://metabot.gg/web/aion2/skills/16130000.webp> | 2026-10-19 6:25 AM ET |
  | sk-spirits-descent.png | skill | Spirit's Descent | <https://metabot.gg/en/aion-2/skills/spirits-descent> | <https://metabot.gg/web/aion2/skills/16730000.webp> | 2026-10-19 6:25 AM ET |
  | st-summon-ancient-spirit.png | stigma | Summon: Ancient Spirit | <https://metabot.gg/en/aion-2/skills/summon-ancient-spirit> | <https://metabot.gg/web/aion2/skills/16250000.webp> | 2026-10-19 6:25 AM ET |
  | st-enhance-spirits-benediction.png | stigma | Enhance: Spirit's Benediction | <https://metabot.gg/en/aion-2/skills/enhance-spirits-benediction> | <https://metabot.gg/web/aion2/skills/16190000.webp> | 2026-10-19 6:26 AM ET |
  | st-jointstrike-corrode.png | stigma | Jointstrike: Corrode | <https://metabot.gg/en/aion-2/skills/jointstrike-corrode> | <https://metabot.gg/web/aion2/skills/16150000.webp> | 2026-10-19 6:26 AM ET |
  | st-flame-blessing.png | stigma | Flame Blessing | <https://metabot.gg/en/aion-2/skills/flame-blessing> | <https://metabot.gg/web/aion2/skills/16370000.webp> | 2026-10-19 6:26 AM ET |

- **Templar skill and stigma icons: saved before the guide item** (0.8 research, gate `research-templar`,
  docs/research/2026-10-templar-pack.md §7; lesson from #441 item 4, where the Gladiator and Spiritmaster shipped with
  initials squares because no research session saved their icons). All 35 (22 skills, 13 stigmas: every icon a Templar
  build plan or key grid could show, since the guide's picks are not settled yet) came from Metabot under the standing
  icon OK (owner, 2026-10-14) on 2026-10-19, 6:26–6:30 AM ET; none lacks an approved source, so nothing goes to the owner.
  Staged in `data/packs/aion2/asmodian/templar/icons/` (256 px WebP → 128 px RGB PNG, Lanczos, like the Assassin's and
  Ranger's), not wired into the app. Names carry the class (`sk-templar-<slug>.png`) because `sk-impact-hit.png`
  (Assassin) already exists and Defiance, Survival Willpower and Armor of Balance are shared names too. The guide item
  moves the ones it shows to `src/assets/icons/` (the build rejects unreferenced PNGs there) and sets each record's `icon`.

  | File | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|
  | sk-templar-annihilate.png | Annihilate | <https://metabot.gg/en/aion-2/skills/annihilate> | <https://metabot.gg/web/aion2/skills/12300000.webp> | 2026-10-19 |
  | sk-templar-block-pain.png | Block Pain | <https://metabot.gg/en/aion-2/skills/block-pain> | <https://metabot.gg/web/aion2/skills/12800000.webp> | 2026-10-19 |
  | sk-templar-debilitating-smash.png | Debilitating Smash | <https://metabot.gg/en/aion-2/skills/debilitating-smash> | <https://metabot.gg/web/aion2/skills/12270000.webp> | 2026-10-19 |
  | sk-templar-defiance.png | Defiance | <https://metabot.gg/en/aion-2/skills/defiance-templar> | <https://metabot.gg/web/aion2/skills/12260000.webp> | 2026-10-19 |
  | sk-templar-enhance-health.png | Enhance Health | <https://metabot.gg/en/aion-2/skills/enhance-health> | <https://metabot.gg/web/aion2/skills/12710000.webp> | 2026-10-19 |
  | sk-templar-flash-rampage.png | Flash Rampage | <https://metabot.gg/en/aion-2/skills/flash-rampage> | <https://metabot.gg/web/aion2/skills/12340000.webp> | 2026-10-19 |
  | sk-templar-fury.png | Fury | <https://metabot.gg/en/aion-2/skills/fury> | <https://metabot.gg/web/aion2/skills/12780000.webp> | 2026-10-19 |
  | sk-templar-guarding-seal.png | Guarding Seal | <https://metabot.gg/en/aion-2/skills/guarding-seal> | <https://metabot.gg/web/aion2/skills/12750000.webp> | 2026-10-19 |
  | sk-templar-impact-hit.png | Impact Hit | <https://metabot.gg/en/aion-2/skills/impact-hit-templar> | <https://metabot.gg/web/aion2/skills/12760000.webp> | 2026-10-19 |
  | sk-templar-insulting-roar.png | Insulting Roar | <https://metabot.gg/en/aion-2/skills/insulting-roar> | <https://metabot.gg/web/aion2/skills/12770000.webp> | 2026-10-19 |
  | sk-templar-ironclad-defense.png | Ironclad Defense | <https://metabot.gg/en/aion-2/skills/ironclad-defense> | <https://metabot.gg/web/aion2/skills/12740000.webp> | 2026-10-19 |
  | sk-templar-judgment.png | Judgment | <https://metabot.gg/en/aion-2/skills/judgment> | <https://metabot.gg/web/aion2/skills/12240000.webp> | 2026-10-19 |
  | sk-templar-poach.png | Poach | <https://metabot.gg/en/aion-2/skills/poach> | <https://metabot.gg/web/aion2/skills/12130000.webp> | 2026-10-19 |
  | sk-templar-pummel.png | Pummel | <https://metabot.gg/en/aion-2/skills/pummel> | <https://metabot.gg/web/aion2/skills/12040000.webp> | 2026-10-19 |
  | sk-templar-punishing-benediction.png | Punishing Benediction | <https://metabot.gg/en/aion-2/skills/punishing-benediction> | <https://metabot.gg/web/aion2/skills/12730000.webp> | 2026-10-19 |
  | sk-templar-punishment.png | Punishment | <https://metabot.gg/en/aion-2/skills/punishment> | <https://metabot.gg/web/aion2/skills/12090000.webp> | 2026-10-19 |
  | sk-templar-shield-rush.png | Shield Rush | <https://metabot.gg/en/aion-2/skills/shield-rush> | <https://metabot.gg/web/aion2/skills/12430000.webp> | 2026-10-19 |
  | sk-templar-shield-smite.png | Shield Smite | <https://metabot.gg/en/aion-2/skills/shield-smite> | <https://metabot.gg/web/aion2/skills/12100000.webp> | 2026-10-19 |
  | sk-templar-survival-willpower.png | Survival Willpower | <https://metabot.gg/en/aion-2/skills/survival-willpower-templar> | <https://metabot.gg/web/aion2/skills/12790000.webp> | 2026-10-19 |
  | sk-templar-vicious-strike.png | Vicious Strike | <https://metabot.gg/en/aion-2/skills/vicious-strike> | <https://metabot.gg/web/aion2/skills/12010000.webp> | 2026-10-19 |
  | sk-templar-warding-shield.png | Warding Shield | <https://metabot.gg/en/aion-2/skills/warding-shield> | <https://metabot.gg/web/aion2/skills/12720000.webp> | 2026-10-19 |
  | sk-templar-warding-strike.png | Warding Strike | <https://metabot.gg/en/aion-2/skills/warding-strike> | <https://metabot.gg/web/aion2/skills/12350000.webp> | 2026-10-19 |
  | st-templar-armor-of-balance.png | Armor of Balance | <https://metabot.gg/en/aion-2/skills/armor-of-balance-templar> | <https://metabot.gg/web/aion2/skills/12200000.webp> | 2026-10-19 |
  | st-templar-assault-fury.png | Assault Fury | <https://metabot.gg/en/aion-2/skills/assault-fury> | <https://metabot.gg/web/aion2/skills/12700000.webp> | 2026-10-19 |
  | st-templar-battlefield-banner.png | Battlefield Banner | <https://metabot.gg/en/aion-2/skills/battlefield-banner> | <https://metabot.gg/web/aion2/skills/12450000.webp> | 2026-10-19 |
  | st-templar-comrade-in-arms.png | Comrade in Arms | <https://metabot.gg/en/aion-2/skills/comrade-in-arms> | <https://metabot.gg/web/aion2/skills/12250000.webp> | 2026-10-19 |
  | st-templar-doom-shield.png | Doom Shield | <https://metabot.gg/en/aion-2/skills/doom-shield> | <https://metabot.gg/web/aion2/skills/12070000.webp> | 2026-10-19 |
  | st-templar-empyrean-lords-punishment.png | Empyrean Lord's Punishment | <https://metabot.gg/en/aion-2/skills/empyrean-lords-punishment> | <https://metabot.gg/web/aion2/skills/12310000.webp> | 2026-10-19 |
  | st-templar-executing-blade.png | Executing Blade | <https://metabot.gg/en/aion-2/skills/executing-blade> | <https://metabot.gg/web/aion2/skills/12410000.webp> | 2026-10-19 |
  | st-templar-grapple.png | Grapple | <https://metabot.gg/en/aion-2/skills/grapple> | <https://metabot.gg/web/aion2/skills/12220000.webp> | 2026-10-19 |
  | st-templar-nezekans-shield.png | Nezekan's Shield | <https://metabot.gg/en/aion-2/skills/nezekans-shield> | <https://metabot.gg/web/aion2/skills/12320000.webp> | 2026-10-19 |
  | st-templar-noble-armor.png | Noble Armor | <https://metabot.gg/en/aion-2/skills/noble-armor> | <https://metabot.gg/web/aion2/skills/12230000.webp> | 2026-10-19 |
  | st-templar-second-skin.png | Second Skin | <https://metabot.gg/en/aion-2/skills/second-skin> | <https://metabot.gg/web/aion2/skills/12190000.webp> | 2026-10-19 |
  | st-templar-shield-of-protection.png | Shield of Protection | <https://metabot.gg/en/aion-2/skills/shield-of-protection> | <https://metabot.gg/web/aion2/skills/12110000.webp> | 2026-10-19 |
  | st-templar-taunt.png | Taunt | <https://metabot.gg/en/aion-2/skills/taunt> | <https://metabot.gg/web/aion2/skills/12120000.webp> | 2026-10-19 |

- **Chanter skill and stigma icons: saved before the guide item, three missing** (0.8 class research, 2026-10-19
  8:39–8:43 PM ET, docs/research/2026-10-chanter-pack.md §7). 32 of 35 (19 skills, 13 stigmas) came from Metabot under
  the standing icon OK (owner, 2026-10-14). Staged in `data/packs/aion2/asmodian/chanter/icons/` (256 px WebP → 128 px
  RGB PNG, Lanczos), not wired into the app; names carry the class (`sk-chanter-<slug>.png`) because Impact Hit,
  Defiance and Survival Willpower are shared names. **Matched to the owner's Lv 4 screen, not only to Metabot's pages**
  (owner-screens/2026-10-19/chanter/skills-lv4-locked.png): Metabot's files are swapped for Earth's Promise and Wind's
  Promise, and its Blessing of Life file is the game's Protection Circle, so three files below carry another page's
  file URL. **For the owner (no approved source):** Blessing of Life (game: green light with gold ornaments), Recuperation
  (game: one open hand with light) and Survival Willpower (Metabot has none; `18790000.webp` returns 403). Not staged:
  Metabot's Recuperation file 18120000 and Protection Circle file 18730000, which match no cell on the screen.
  Attack Preparation and Impact Hit are unconfirmed until a Lv 25+ screen shows the passives in colour. The guide item
  moves the ones it shows to `src/assets/icons/` and sets each record's `icon`.

  | File | Name | Source page | File URL | Retrieved | Matched by |
  |---|---|---|---|---|---|
  | sk-chanter-attack-preparation.png | Attack Preparation | <https://metabot.gg/en/aion-2/skills/attack-preparation-chanter> | <https://metabot.gg/web/aion2/skills/18750000.webp> | 2026-10-19 | Metabot page; owner's screen: same shape, different hue (unconfirmed) |
  | sk-chanter-crossguard.png | Crossguard | <https://metabot.gg/en/aion-2/skills/crossguard> | <https://metabot.gg/web/aion2/skills/18720000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-dark-crush.png | Dark Crush | <https://metabot.gg/en/aion-2/skills/dark-crush> | <https://metabot.gg/web/aion2/skills/18100000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-defiance.png | Defiance | <https://metabot.gg/en/aion-2/skills/defiance-chanter> | <https://metabot.gg/web/aion2/skills/18200000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-earths-promise.png | Earth's Promise | <https://metabot.gg/en/aion-2/skills/winds-promise> | <https://metabot.gg/web/aion2/skills/18800000.webp> | 2026-10-19 | owner's screen: the Lv 21 cell shows Metabot's Wind's Promise art (§7) |
  | sk-chanter-gust-rampage.png | Gust Rampage | <https://metabot.gg/en/aion-2/skills/gust-rampage> | <https://metabot.gg/web/aion2/skills/18300000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-heat-wave-blow.png | Heat Wave Blow | <https://metabot.gg/en/aion-2/skills/heat-wave-blow> | <https://metabot.gg/web/aion2/skills/18150000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-impact-hit.png | Impact Hit | <https://metabot.gg/en/aion-2/skills/impact-hit-chanter> | <https://metabot.gg/web/aion2/skills/18760000.webp> | 2026-10-19 | Metabot page; owner's screen: same shape, different hue (unconfirmed) |
  | sk-chanter-impactful-crush.png | Impactful Crush | <https://metabot.gg/en/aion-2/skills/impactful-crush> | <https://metabot.gg/web/aion2/skills/18060000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-incandescent-blow.png | Incandescent Blow | <https://metabot.gg/en/aion-2/skills/incandescent-blow> | <https://metabot.gg/web/aion2/skills/18040000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-inspiring-spell.png | Inspiring Spell | <https://metabot.gg/en/aion-2/skills/inspiring-spell> | <https://metabot.gg/web/aion2/skills/18740000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-onslaught.png | Onslaught | <https://metabot.gg/en/aion-2/skills/onslaught> | <https://metabot.gg/web/aion2/skills/18010000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-protection-circle.png | Protection Circle | <https://metabot.gg/en/aion-2/skills/blessing-of-life> | <https://metabot.gg/web/aion2/skills/18710000.webp> | 2026-10-19 | owner's screen: the Lv 9 cell shows Metabot's Blessing of Life art (§7) |
  | sk-chanter-raging-spell.png | Raging Spell | <https://metabot.gg/en/aion-2/skills/raging-spell> | <https://metabot.gg/web/aion2/skills/18770000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-rushing-smash.png | Rushing Smash | <https://metabot.gg/en/aion-2/skills/rushing-smash> | <https://metabot.gg/web/aion2/skills/18090000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-spinning-strike.png | Spinning Strike | <https://metabot.gg/en/aion-2/skills/spinning-strike> | <https://metabot.gg/web/aion2/skills/18290000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-tremor-crush.png | Tremor Crush | <https://metabot.gg/en/aion-2/skills/tremor-crush> | <https://metabot.gg/web/aion2/skills/18210000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-wave-blow.png | Wave Blow | <https://metabot.gg/en/aion-2/skills/wave-blow> | <https://metabot.gg/web/aion2/skills/18080000.webp> | 2026-10-19 | Metabot page; owner's screen agrees |
  | sk-chanter-winds-promise.png | Wind's Promise | <https://metabot.gg/en/aion-2/skills/earths-promise> | <https://metabot.gg/web/aion2/skills/18780000.webp> | 2026-10-19 | owner's screen: the Lv 25 cell shows Metabot's Earth's Promise art (§7) |
  | st-chanter-assault-shock.png | Assault Shock | <https://metabot.gg/en/aion-2/skills/assault-shock> | <https://metabot.gg/web/aion2/skills/18700000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-barrier-spell.png | Barrier Spell | <https://metabot.gg/en/aion-2/skills/barrier-spell> | <https://metabot.gg/web/aion2/skills/18440000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-ensnaring-mark.png | Ensnaring Mark | <https://metabot.gg/en/aion-2/skills/ensnaring-mark> | <https://metabot.gg/web/aion2/skills/18230000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-focused-defense.png | Focused Defense | <https://metabot.gg/en/aion-2/skills/focused-defense> | <https://metabot.gg/web/aion2/skills/18140000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-fracturing-blow.png | Fracturing Blow | <https://metabot.gg/en/aion-2/skills/fracturing-blow> | <https://metabot.gg/web/aion2/skills/18130000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-guardian-blessing.png | Guardian Blessing | <https://metabot.gg/en/aion-2/skills/guardian-blessing> | <https://metabot.gg/web/aion2/skills/18420000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-healing-touch.png | Healing Touch | <https://metabot.gg/en/aion-2/skills/healing-touch> | <https://metabot.gg/web/aion2/skills/18170000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-impeding-authority.png | Impeding Authority | <https://metabot.gg/en/aion-2/skills/impeding-authority> | <https://metabot.gg/web/aion2/skills/18240000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-marchutans-wrath.png | Marchutan's Wrath | <https://metabot.gg/en/aion-2/skills/marchutans-wrath> | <https://metabot.gg/web/aion2/skills/18330000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-obliterate.png | Obliterate | <https://metabot.gg/en/aion-2/skills/obliterate> | <https://metabot.gg/web/aion2/skills/18220000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-power-of-the-storm.png | Power of the Storm | <https://metabot.gg/en/aion-2/skills/power-of-the-storm> | <https://metabot.gg/web/aion2/skills/18250000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-sprint-mantra.png | Sprint Mantra | <https://metabot.gg/en/aion-2/skills/sprint-mantra> | <https://metabot.gg/web/aion2/skills/18160000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |
  | st-chanter-undefeated-mantra.png | Undefeated Mantra | <https://metabot.gg/en/aion-2/skills/undefeated-mantra> | <https://metabot.gg/web/aion2/skills/18190000.webp> | 2026-10-19 | Metabot page only (stigmas not on the owner screen) |

- **Chanter passive icons: five for the owner** (0.8 P18, #507). The class data
  (`data/packs/aion2/classes/chanter/skills.json`, written by `tools/research/chanter-pack.mjs`) follows the owner's Lv 4
  screen (chanter research §7), not Metabot's file names. No record sets `icon` yet (the staged files are not in
  `src/assets/icons/`; P19 moves them). Earth's Promise, Wind's Promise and Protection Circle carry a note naming the
  other page's file the screen shows. The five below carry `fieldStatus` `icon: owner-check`; P19 must not wire an icon
  for them until the owner's tooltip screenshot names the art. **Owner:** at Chanter Lv 25+, one screenshot of the passive
  grid in full colour settles all four passives; Recuperation's art is on its key 3 / Lv 8 cell.

  | Skill | Learn Lv | Why |
  |---|---|---|
  | Blessing of Life (passive) | 1 | screen: green light with gold ornaments; no Metabot file has it (its page's 18710000 is the Protection Circle art) |
  | Recuperation (active) | 8 | screen: one open hand with light; no Metabot file has it (its page's 18120000 matches no cell) |
  | Attack Preparation (passive) | 13 | same shape as 18750000, but red and purple where the file is blue: unconfirmed |
  | Impact Hit (passive) | 15 | same shape as 18760000, but red and purple: unconfirmed; may be the Assassin's shipped `13760000` (`sk-impact-hit.png`, purple, same shape), as on the Templar (inferred) |
  | Survival Willpower (passive) | 23 | screen: an armoured figure, hands to the head; Metabot has no icon (18790000 returns 403) |

- **Cleric skill and stigma icons: fetched before the class ships** (0.8 class research, 2026-10-19 6:31–6:35 AM ET,
  docs/research/2026-10-cleric-pack.md §7; issue #441 item 4: the Gladiator and Spiritmaster shipped letter squares
  because their research saved no icon files). All 35 Cleric icons (22 skills, 13 stigmas) came from Metabot under the
  standing icon OK; none lacks an approved source. They are staged in `docs/research/icons-2026-10-19-cleric/` (256 px
  WebP → 128 px RGB PNG, Lanczos, like the Assassin's and Ranger's), not wired into the app: the class item moves the
  ones its plan shows to `src/assets/icons/` (the build fails on an unreferenced PNG there) and sets each record's
  `icon`. All 35 are kept so any build plan the guide picks has its files.

  | File | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|
  | sk-bolt.png | Bolt | <https://metabot.gg/en/aion-2/skills/bolt> | <https://metabot.gg/web/aion2/skills/17060000.webp> | 2026-10-19 |
  | sk-chain-of-torment.png | Chain of Torment | <https://metabot.gg/en/aion-2/skills/chain-of-torment> | <https://metabot.gg/web/aion2/skills/17070000.webp> | 2026-10-19 |
  | sk-condemnation.png | Condemnation | <https://metabot.gg/en/aion-2/skills/condemnation> | <https://metabot.gg/web/aion2/skills/17350000.webp> | 2026-10-19 |
  | sk-debilitating-mark.png | Debilitating Mark | <https://metabot.gg/en/aion-2/skills/debilitating-mark> | <https://metabot.gg/web/aion2/skills/17080000.webp> | 2026-10-19 |
  | sk-defiance.png | Defiance | <https://metabot.gg/en/aion-2/skills/defiance-cleric> | <https://metabot.gg/web/aion2/skills/17240000.webp> | 2026-10-19 |
  | sk-divine-aura.png | Divine Aura | <https://metabot.gg/en/aion-2/skills/divine-aura> | <https://metabot.gg/web/aion2/skills/17150000.webp> | 2026-10-19 |
  | sk-earths-grace.png | Earth's Grace | <https://metabot.gg/en/aion-2/skills/earths-grace> | <https://metabot.gg/web/aion2/skills/17780000.webp> | 2026-10-19 |
  | sk-earths-retribution.png | Earth's Retribution | <https://metabot.gg/en/aion-2/skills/earths-retribution> | <https://metabot.gg/web/aion2/skills/17010000.webp> | 2026-10-19 |
  | sk-empyrean-lords-grace.png | Empyrean Lord's Grace | <https://metabot.gg/en/aion-2/skills/empyrean-lords-grace> | <https://metabot.gg/web/aion2/skills/17730000.webp> | 2026-10-19 |
  | sk-empyrean-lords-benediction.png | Empyrean Lords' Benediction | <https://metabot.gg/en/aion-2/skills/empyrean-lords-benediction> | <https://metabot.gg/web/aion2/skills/17720000.webp> | 2026-10-19 |
  | sk-heal-block.png | Heal Block | <https://metabot.gg/en/aion-2/skills/heal-block> | <https://metabot.gg/web/aion2/skills/17760000.webp> | 2026-10-19 |
  | sk-healing-enhancement.png | Healing Enhancement | <https://metabot.gg/en/aion-2/skills/healing-enhancement> | <https://metabot.gg/web/aion2/skills/17740000.webp> | 2026-10-19 |
  | sk-healing-light.png | Healing Light | <https://metabot.gg/en/aion-2/skills/healing-light> | <https://metabot.gg/web/aion2/skills/17100000.webp> | 2026-10-19 |
  | sk-immortal-veil.png | Immortal Veil | <https://metabot.gg/en/aion-2/skills/immortal-veil> | <https://metabot.gg/web/aion2/skills/17750000.webp> | 2026-10-19 |
  | sk-judgment-thunder.png | Judgment Thunder | <https://metabot.gg/en/aion-2/skills/judgment-thunder> | <https://metabot.gg/web/aion2/skills/17040000.webp> | 2026-10-19 |
  | sk-light-of-regeneration.png | Light of Regeneration | <https://metabot.gg/en/aion-2/skills/light-of-regeneration> | <https://metabot.gg/web/aion2/skills/17090000.webp> | 2026-10-19 |
  | sk-lightning-strike-scattershot.png | Lightning Strike Scattershot | <https://metabot.gg/en/aion-2/skills/lightning-strike-scattershot> | <https://metabot.gg/web/aion2/skills/17370000.webp> | 2026-10-19 |
  | sk-prayer-of-concentration.png | Prayer of Concentration | <https://metabot.gg/en/aion-2/skills/prayer-of-concentration> | <https://metabot.gg/web/aion2/skills/17770000.webp> | 2026-10-19 |
  | sk-radiant-benediction.png | Radiant Benediction | <https://metabot.gg/en/aion-2/skills/radiant-benediction> | <https://metabot.gg/web/aion2/skills/17800000.webp> | 2026-10-19 |
  | sk-radiant-recovery.png | Radiant Recovery | <https://metabot.gg/en/aion-2/skills/radiant-recovery> | <https://metabot.gg/web/aion2/skills/17120000.webp> | 2026-10-19 |
  | sk-survival-willpower.png | Survival Willpower | <https://metabot.gg/en/aion-2/skills/survival-willpower-cleric> | <https://metabot.gg/web/aion2/skills/17790000.webp> | 2026-10-19 |
  | sk-warm-benediction.png | Warm Benediction | <https://metabot.gg/en/aion-2/skills/warm-benediction> | <https://metabot.gg/web/aion2/skills/17710000.webp> | 2026-10-19 |
  | st-absolution.png | Absolution | <https://metabot.gg/en/aion-2/skills/absolution> | <https://metabot.gg/web/aion2/skills/17290000.webp> | 2026-10-19 |
  | st-assault-mark.png | Assault Mark | <https://metabot.gg/en/aion-2/skills/assault-mark> | <https://metabot.gg/web/aion2/skills/17700000.webp> | 2026-10-19 |
  | st-benevolence.png | Benevolence | <https://metabot.gg/en/aion-2/skills/benevolence> | <https://metabot.gg/web/aion2/skills/17160000.webp> | 2026-10-19 |
  | st-earth-punishment.png | Earth Punishment | <https://metabot.gg/en/aion-2/skills/earth-punishment> | <https://metabot.gg/web/aion2/skills/17400000.webp> | 2026-10-19 |
  | st-light-of-protection.png | Light of Protection | <https://metabot.gg/en/aion-2/skills/light-of-protection> | <https://metabot.gg/web/aion2/skills/17410000.webp> | 2026-10-19 |
  | st-noble-aura.png | Noble Aura | <https://metabot.gg/en/aion-2/skills/noble-aura> | <https://metabot.gg/web/aion2/skills/17440000.webp> | 2026-10-19 |
  | st-power-burst.png | Power Burst | <https://metabot.gg/en/aion-2/skills/power-burst> | <https://metabot.gg/web/aion2/skills/17280000.webp> | 2026-10-19 |
  | st-prayer-of-amplification.png | Prayer of Amplification | <https://metabot.gg/en/aion-2/skills/prayer-of-amplification> | <https://metabot.gg/web/aion2/skills/17430000.webp> | 2026-10-19 |
  | st-root.png | Root | <https://metabot.gg/en/aion-2/skills/root> | <https://metabot.gg/web/aion2/skills/17190000.webp> | 2026-10-19 |
  | st-salvation.png | Salvation | <https://metabot.gg/en/aion-2/skills/salvation> | <https://metabot.gg/web/aion2/skills/17270000.webp> | 2026-10-19 |
  | st-summon-resurrection.png | Summon Resurrection | <https://metabot.gg/en/aion-2/skills/summon-resurrection> | <https://metabot.gg/web/aion2/skills/17390000.webp> | 2026-10-19 |
  | st-voice-of-doom.png | Voice of Doom | <https://metabot.gg/en/aion-2/skills/voice-of-doom> | <https://metabot.gg/web/aion2/skills/17300000.webp> | 2026-10-19 |
  | st-yustiels-power.png | Yustiel's Power | <https://metabot.gg/en/aion-2/skills/yustiels-power> | <https://metabot.gg/web/aion2/skills/17420000.webp> | 2026-10-19 |

  **Passive icons vs the owner's Lv 4 Cleric screen** (Game Data Check, 2026-10-20, comment on #493; owner-screens
  2026-10-19 `cleric/skills-lv4-locked.png`; locked cells have no tooltip, so each cell is tied to a passive by unlock
  level only). Verified, the cell shows the same art: Warm Benediction (Lv 1), Empyrean Lords' Benediction (6), Empyrean
  Lord's Grace (9), Earth's Grace (21). **Owner-check, no icon:** Healing Enhancement (11: teal arcs around a flare, no
  staged file matches), Immortal Veil (13: a figure under a green dome, no file matches), Heal Block (15: shows the
  `sk-immortal-veil.png` art), Prayer of Concentration (17: shows `sk-heal-block.png`), Survival Willpower (23: plate
  armour, hands on the helmet, the Templar Lv 23 art; no file matches), Radiant Benediction (25: shows
  `sk-prayer-of-concentration.png`). Either the files are mislabelled (as in the Chanter pack) or Metabot puts these
  passives at the wrong levels, so the class data (0.8 P4, #493) marks both `learnLv` and `icon` `owner-check` on these
  six, and no file moves to another level until a tooltip names it. **Owner:** hover the locked Cleric passives at
  Lv 11, 13, 15, 17, 23 and 25 and screenshot each name.

- **Sorcerer skill and stigma icons: saved before the guide item** (0.8 class research, docs/research/2026-10-sorcerer-pack.md
  §7; lesson from #441 item 4). All 35 (22 skills, 13 stigmas) came from Metabot under the standing icon OK (owner,
  2026-10-14) on 2026-10-19, 8:41–8:45 PM ET (00:41–00:45 UTC on 10-20 in the request log);
  none lacks an approved source, so nothing goes to the owner. Staged in `data/packs/aion2/asmodian/sorcerer/icons/`
  (256 px WebP → 128 px RGB PNG, Lanczos, like the other classes), not wired into the app. Names carry the class
  (`sk-sorcerer-<slug>.png`) because Defiance and Revitalization Contract are names other classes use too. The 12 active
  icon ids match the ones Game Data Check read on 2026-10-19 (owner-screens/2026-10-19/sorcerer/NOTES.md). The guide item
  moves the ones it shows to `src/assets/icons/` (the build rejects unreferenced PNGs there) and sets each record's `icon`.
  Passive icons (0.8 P16, #505): unlike the Templar and Cleric (Game Data Check's
  `passive-icons-templar-cleric-2026-10-20.md`), research compared all ten Sorcerer passives with the owner's Lv 4
  screen, the locked cells brightened one by one (§7), and found every Metabot file matches; so
  `data/packs/aion2/classes/sorcerer/skills.json` carries no `icon: owner-check`. Fire Mark is the only passive unlocked
  on that screen; the nine locked ones rest on that by-eye comparison of greyed cells. If Game Data Check's review finds a
  mismatch, that passive gets `fieldStatus` `icon: owner-check` and a row here, as the Templar's did.

  | File | Name | Source page | File URL | Retrieved |
  |---|---|---|---|---|
  | sk-sorcerer-absorb-essence.png | Absorb Essence | <https://metabot.gg/en/aion-2/skills/absorb-essence> | <https://metabot.gg/web/aion2/skills/15760000.webp> | 2026-10-19 |
  | sk-sorcerer-bittercold-wind.png | Bittercold Wind | <https://metabot.gg/en/aion-2/skills/bittercold-wind> | <https://metabot.gg/web/aion2/skills/15280000.webp> | 2026-10-19 |
  | sk-sorcerer-blaze.png | Blaze | <https://metabot.gg/en/aion-2/skills/blaze> | <https://metabot.gg/web/aion2/skills/15050000.webp> | 2026-10-19 |
  | sk-sorcerer-cold-snap.png | Cold Snap | <https://metabot.gg/en/aion-2/skills/cold-snap> | <https://metabot.gg/web/aion2/skills/15730000.webp> | 2026-10-19 |
  | sk-sorcerer-defiance.png | Defiance | <https://metabot.gg/en/aion-2/skills/defiance-sorcerer> | <https://metabot.gg/web/aion2/skills/15240000.webp> | 2026-10-19 |
  | sk-sorcerer-fire-mark.png | Fire Mark | <https://metabot.gg/en/aion-2/skills/fire-mark> | <https://metabot.gg/web/aion2/skills/15710000.webp> | 2026-10-19 |
  | sk-sorcerer-firestorm.png | Firestorm | <https://metabot.gg/en/aion-2/skills/firestorm> | <https://metabot.gg/web/aion2/skills/15040000.webp> | 2026-10-19 |
  | sk-sorcerer-flame-arrow.png | Flame Arrow | <https://metabot.gg/en/aion-2/skills/flame-arrow> | <https://metabot.gg/web/aion2/skills/15210000.webp> | 2026-10-19 |
  | sk-sorcerer-flame-scattershot.png | Flame Scattershot | <https://metabot.gg/en/aion-2/skills/flame-scattershot> | <https://metabot.gg/web/aion2/skills/15010000.webp> | 2026-10-19 |
  | sk-sorcerer-frost-burst.png | Frost Burst | <https://metabot.gg/en/aion-2/skills/frost-burst> | <https://metabot.gg/web/aion2/skills/15220000.webp> | 2026-10-19 |
  | sk-sorcerer-frost.png | Frost | <https://metabot.gg/en/aion-2/skills/frost> | <https://metabot.gg/web/aion2/skills/15150000.webp> | 2026-10-19 |
  | sk-sorcerer-grace-of-enhancement.png | Grace of Enhancement | <https://metabot.gg/en/aion-2/skills/grace-of-enhancement> | <https://metabot.gg/web/aion2/skills/15780000.webp> | 2026-10-19 |
  | sk-sorcerer-grace-of-resistance.png | Grace of Resistance | <https://metabot.gg/en/aion-2/skills/grace-of-resistance> | <https://metabot.gg/web/aion2/skills/15770000.webp> | 2026-10-19 |
  | sk-sorcerer-hellfire.png | Hellfire | <https://metabot.gg/en/aion-2/skills/hellfire> | <https://metabot.gg/web/aion2/skills/15060000.webp> | 2026-10-19 |
  | sk-sorcerer-ice-chain.png | Ice Chain | <https://metabot.gg/en/aion-2/skills/ice-chain> | <https://metabot.gg/web/aion2/skills/15090000.webp> | 2026-10-19 |
  | sk-sorcerer-revitalization-contract.png | Revitalization Contract | <https://metabot.gg/en/aion-2/skills/revitalization-contract-sorcerer> | <https://metabot.gg/web/aion2/skills/15790000.webp> | 2026-10-19 |
  | sk-sorcerer-robe-of-cold.png | Robe of Cold | <https://metabot.gg/en/aion-2/skills/robe-of-cold> | <https://metabot.gg/web/aion2/skills/15750000.webp> | 2026-10-19 |
  | sk-sorcerer-robe-of-earth.png | Robe of Earth | <https://metabot.gg/en/aion-2/skills/robe-of-earth> | <https://metabot.gg/web/aion2/skills/15720000.webp> | 2026-10-19 |
  | sk-sorcerer-robe-of-flame.png | Robe of Flame | <https://metabot.gg/en/aion-2/skills/robe-of-flame> | <https://metabot.gg/web/aion2/skills/15740000.webp> | 2026-10-19 |
  | sk-sorcerer-vitality-evaporation.png | Vitality Evaporation | <https://metabot.gg/en/aion-2/skills/vitality-evaporation> | <https://metabot.gg/web/aion2/skills/15800000.webp> | 2026-10-19 |
  | sk-sorcerer-winters-shackles.png | Winter's Shackles | <https://metabot.gg/en/aion-2/skills/winters-shackles> | <https://metabot.gg/web/aion2/skills/15110000.webp> | 2026-10-19 |
  | sk-sorcerer-wish-of-concentration.png | Wish of Concentration | <https://metabot.gg/en/aion-2/skills/wish-of-concentration> | <https://metabot.gg/web/aion2/skills/15310000.webp> | 2026-10-19 |
  | st-sorcerer-arctic-armor.png | Arctic Armor | <https://metabot.gg/en/aion-2/skills/arctic-armor> | <https://metabot.gg/web/aion2/skills/15230000.webp> | 2026-10-19 |
  | st-sorcerer-assault-bombardment.png | Assault Bombardment | <https://metabot.gg/en/aion-2/skills/assault-bombardment> | <https://metabot.gg/web/aion2/skills/15700000.webp> | 2026-10-19 |
  | st-sorcerer-cold-storm.png | Cold Storm | <https://metabot.gg/en/aion-2/skills/cold-storm> | <https://metabot.gg/web/aion2/skills/15200000.webp> | 2026-10-19 |
  | st-sorcerer-curse-tree.png | Curse: Tree | <https://metabot.gg/en/aion-2/skills/curse-tree> | <https://metabot.gg/web/aion2/skills/15140000.webp> | 2026-10-19 |
  | st-sorcerer-delayed-explosion.png | Delayed Explosion | <https://metabot.gg/en/aion-2/skills/delayed-explosion> | <https://metabot.gg/web/aion2/skills/15320000.webp> | 2026-10-19 |
  | st-sorcerer-divine-burst.png | Divine Burst | <https://metabot.gg/en/aion-2/skills/divine-burst> | <https://metabot.gg/web/aion2/skills/15360000.webp> | 2026-10-19 |
  | st-sorcerer-element-enhancement.png | Element Enhancement | <https://metabot.gg/en/aion-2/skills/element-enhancement> | <https://metabot.gg/web/aion2/skills/15400000.webp> | 2026-10-19 |
  | st-sorcerer-fire-wall.png | Fire Wall | <https://metabot.gg/en/aion-2/skills/fire-wall> | <https://metabot.gg/web/aion2/skills/15390000.webp> | 2026-10-19 |
  | st-sorcerer-glacial-smite.png | Glacial Smite | <https://metabot.gg/en/aion-2/skills/glacial-smite> | <https://metabot.gg/web/aion2/skills/15120000.webp> | 2026-10-19 |
  | st-sorcerer-hibernation.png | Hibernation | <https://metabot.gg/en/aion-2/skills/hibernation> | <https://metabot.gg/web/aion2/skills/15410000.webp> | 2026-10-19 |
  | st-sorcerer-lumiels-space.png | Lumiel's Space | <https://metabot.gg/en/aion-2/skills/lumiels-space> | <https://metabot.gg/web/aion2/skills/15300000.webp> | 2026-10-19 |
  | st-sorcerer-soul-freeze.png | Soul Freeze | <https://metabot.gg/en/aion-2/skills/soul-freeze> | <https://metabot.gg/web/aion2/skills/15130000.webp> | 2026-10-19 |
  | st-sorcerer-steel-barrier.png | Steel Barrier | <https://metabot.gg/en/aion-2/skills/steel-barrier> | <https://metabot.gg/web/aion2/skills/15160000.webp> | 2026-10-19 |

- **Spiritmaster rotation: one source, not shown** (0.7 P4, #347). Metabot's leveling build gives a rotation (one site,
  `data/research/spiritmaster-builds-metabot-2026-10.csv`), but the Build drawer's Rotation section is written for the
  Assassin's keys, so the guide shows none. The three skills that fire only on a condition are a Build plan step instead
  (claim C74).

- **Gladiator rotation: the Build panel's Rotation section shows the game's default keys, not the guide's line**
  (0.7 P2, #345; heading reworded 2026-10-19 after #441-5). docs/research/2026-10-gladiator-guide.md §8
  has a two-source right-click line (Rending Blow from Lv 1, Sword Aura Rampage above it from 5), but the Build
  drawer's Rotation section is written for the Assassin's keys (left click Quick Slice, Q Shadowstrike, the Assassin's
  buff names in `src/packs/aion2/cards/build.js`, `requirements.js` rotKeys). So the Gladiator's build carries no
  `keyStacks.rightClick`. Since 0.7 P11 (#418) the drawer shows the game's default keys instead (`keyStacks.defaultKeys`,
  owner screens, claim C66; the Ranger's too, C55); the guide's own right-click line is still not shown.

- **Story-quest icon: in the site** (0.6 P13, #272; owner OK: #254 note 7 and DECISIONS `owner-ok-story-icon`). The Next
  up story card shows the game's **active** story-quest icon on a dark tile; the 📜 emoji is the fallback when it can't
  load. Per the owner's icon source rule (DECISIONS, 2026-10-18 8:57 PM ET: a better online copy first, his crop as the
  fallback), it is Metabot's copy, found by Source Vetting after the first search below and committed as
  `docs/research/icons-2026-10-18/story-quest-active-metabot.png` (52×52, transparent; WebP → PNG, pixels unchanged).
  It matches the owner's crop `docs/research/owner-screens-2026-10-18/story-quest-active.png` (owner's crop, 2026-10-18),
  which stays the fallback source and is not shipped. Site only: the claude.ai artifact is frozen, so no `/_blob/` id.

  | File | Source page | File URL | Retrieved |
  |---|---|---|---|
  | story-quest-active.png | <https://metabot.gg/en/aion-2/map/altgard> (as Source Vetting reported) | <https://metabot.gg/web/aion2/mapicons/quest_hero.webp> | 2026-10-18 9:41 PM ET |

  Since 0.6.2 P20 (#391; DECISIONS `owner-ok-0.6.2-story-icons`, owner OK typed 2026-10-18 10:04 PM ET) the icon follows
  the quest's state (`docs/design/0.6.2-story-states-mockup.md`): active as above, **ready to turn in** once every
  objective but the quest's "Turn in" step is ticked, and the journal check on the "story complete" card. Both new files
  are committed copies of `docs/research/map-icons-2026-10-18/` (byte for byte; that folder's README has their rows):

  | File | Source page | File URL | Retrieved |
  |---|---|---|---|
  | story-quest-ready.png (64×64, transparent; aion2quest `UT_Marker_Quest_Hero_Complete`, WebP → PNG, pixels unchanged) | <https://aion2quest.pro/en/map/altgard> (marker set; requested by name) | <https://aion2quest.pro/img/map/markers/UT_Marker_Quest_Hero_Complete.webp> | 2026-10-18 10:26 PM ET |
  | story-complete.png (50×50, transparent; owner crop, no online copy on approved sites, Source Vetting 10:59 PM ET) | owner screen `docs/research/owner-screens-2026-10-18/quest-complete-check.png`, cleaned (border-median background removal, trimmed, centred with an 8% margin, not upscaled), Design Lead DESIGN OK 2026-10-18 11:09 PM ET, committed as `docs/research/map-icons-2026-10-18/journal-complete-check-owner-crop.png` | — | 2026-10-18 10:55 PM ET |

  The first search (gate `research-story-icon`, 2026-10-18 3:12–3:21 AM ET) found nothing; kept for the record:

  - **Checked (CONFIRMED, none of these has a quest-type icon):** a story quest page
    (<https://metabot.gg/en/aion-2/quests/a-daeva-dreaming-anew>: only the NPC portrait, map tiles and site art), the
    quest list (<https://metabot.gg/en/aion-2/quests>: item and currency icons only), the map
    (<https://metabot.gg/en/aion-2/map>), a zone page (<https://metabot.gg/en/aion-2/zones/abandoned-campsite>), the
    leveling guide (<https://metabot.gg/en/aion-2/guides/leveling-guide>: one banner image, not an icon), and the 31
    script files those pages load. No file under `/web/aion2/` is named for a quest type or a map marker.
  - **Not checked (GUESS):** the map draws its markers from code loaded later or from `/api/`, which robots.txt
    disallows, so a marker icon may exist there; it was not looked for. aion2.gaming.tools is owner hand check only
    (docs/research/2026-10-source-vetting.md §5), aion2.th.gl and Game8 are excluded.
  - **Fetching:** robots.txt and the terms (effective 04/01/2026, unchanged) re-read first; own User-Agent, one request
    at a time, at least 6 s apart, 39 requests, no 403 / 429 / challenge. Nothing was kept.
  - **Not checked then:** the map's marker files (`/web/aion2/mapicons/`), where Source Vetting later found the icon.

- **Game map markers: in the site** (0.6.2 P21, #404; DECISIONS `owner-ok-0.6.2-map-icons`, owner OK typed 2026-10-18
  10:04 PM ET, Q1–Q5 as recommended; `docs/design/0.6.2-map-icons-mockup.md`). Sealed Dungeon and Stronghold Next up tiles
  (dark tile, ⛏ / 🏰 the fallback) and the Dungeons card's two headings; the Kibelisk crest before a Next up card's first
  "Kibelisk"; the Empyrean Trace feather on region rows ("29 [feather]") and the legend line. Map markers are not covered
  by the standing icon OK; the owner's OK above covers these four. Each is a byte-for-byte copy of
  `docs/research/map-icons-2026-10-18/` (WebP → PNG, pixels unchanged; that folder's README has their rows):

  | File | Source page | File URL | Retrieved |
  |---|---|---|---|
  | map-sealed.png (52×52, transparent; Metabot `sealed`, from `sealed.png`) | <https://metabot.gg/en/aion-2/map/altgard> (as Source Vetting reported) | <https://metabot.gg/web/aion2/mapicons/sealed.webp> | 2026-10-18 10:14 PM ET |
  | map-stronghold.png (52×52, transparent; Metabot `garrison`, from `garrison.png`) | <https://metabot.gg/en/aion-2/map/altgard> (as Source Vetting reported) | <https://metabot.gg/web/aion2/mapicons/garrison.webp> | 2026-10-18 10:14 PM ET |
  | map-trace.png (52×52, transparent; Metabot `trace`, from `trace.png`) | <https://metabot.gg/en/aion-2/map/altgard> (as Source Vetting reported) | <https://metabot.gg/web/aion2/mapicons/trace.webp> | 2026-10-18 10:14 PM ET |
  | map-kibelisk.png (64×64, transparent; aion2quest `UT_Marker_TeleportArtifact_Dark_Engraved`, the purple crest, Q3; from `kibelisk-purple.png`) | <https://aion2quest.pro/en/map/altgard> (as Source Vetting reported) | <https://aion2quest.pro/img/map/markers/UT_Marker_TeleportArtifact_Dark_Engraved.webp> | 2026-10-18 10:15 PM ET |

  Held back (Q5): campsite, updraft, point of interest, field boss and undiscovered wait until the data has a place type.

- **Six UI icons with no approved source: owner crops are the fallback** (T-47; owner icon rule, DECISIONS 2026-10-18
  8:57 PM ET). The Field zone label (crossed swords), the Village zone label (tent), the Journal completed-quest check,
  the regional and story "available" stars and the item tooltip's Extract flask are on neither Metabot nor aion2quest.pro,
  and the last-resort check on unlisted sites found none (docs/research/2026-10-t47-icon-check.md, 2026-10-19). Any of
  them used in the app comes from the owner's crop, with its row recorded here like `story-complete.png` above.

- **Icons not in the claude.ai artifact** (closed by 0.7 P9). The five skill icons above (added 2026-10-15) never got a
  `/_blob/` id, so the frozen artifact shows the initials square for them. The artifact is no longer built and its blob
  list (`scripts/artifact-blobs.json`) is gone, so nothing is left to do.
- **Board-cost input can be replaced while typing** (likely, not confirmed; found 2026-10-15 by a real-time
  `journey` run, which crashed at Lv 40 with `fill: Element is not attached`). A milestone tick re-renders the page
  with a deferred `update()` 1150 ms later (1650 ms when its card leaves; `src/main.js`, tick handler), which rebuilds
  `#dvNextList`. Ticking a milestone and then typing a cost into the Daevanion card within ~2 s would lose focus and
  the typed digits. Second suspect: the `boardcost` Next-up action (`src/main.js`, `a === "boardcost"`) focuses the
  input it found with `setTimeout(() => c.focus(), 300)`; if a re-render replaced that input meanwhile, focus goes to
  a detached node and the visible input is never focused. `journey` now runs on the fake clock, so it no longer hits this window; repro:
  `JOURNEY_REALTIME=1 node tests/run.mjs --only journey` (intermittent), or by hand. Fix idea: skip re-rendering a
  focused `.dvc` input in `renderNext`.
- Pop-out needs Document Picture-in-Picture (Chrome / Edge 116+); the button is hidden elsewhere.

## Tooling

- `tests/journey.js` logs one known `!! In my game click failed` line (it clicks the first `[data-ingame]` pill, which
  can be hidden). The runner ignores exactly that line; any other `!!` line fails the suite.
- Timing checks (`update()` median < 15 ms) trip on a busy machine (measured 10–17 ms for the same build on a 2-vCPU
  VM). Since 2026-10-15 they are the non-blocking `perf` suite (`tests/perf.js`, `npm run test:perf`, CI job `perf`
  warns only), not part of `npm test` or `ci-ok`. 2026-10-16: most of the slowdown was a real regression, not the machine
  (0.3 E4: every `gatesOf` built a fresh evaluator, ~500 per `update()`); `update()` now runs in one `gatesPass` and
  `regress` blocks on the machine-independent count (`gatesRuns`, at most 3 evaluators per `update()`). Same 4-vCPU
  cloud VM, perf alone: median over the 45 states 9.9 ms (perf.js added) → 17 ms (main) → 11 ms (fix). The runner still re-runs a failed suite once, reporting a pass on
  retry as `FLAKY` with the first run's failures.
- Tests block the web fonts (self-hosted files, the claude.ai build's inlined copies, Google Fonts for the baselines) and
  service workers, so layout checks are machine-independent; run `node tests/run.mjs --with-fonts` to check with the
  real fonts.
- Layout fitting (`fitSkills` etc.) runs in `requestAnimationFrame` and isn't re-run when the web fonts finish loading,
  so on a slow font load the Skills / Daevanion row can be sized for the fallback font (a few px). Seen while comparing
  builds in 0.1.5: the claude.ai build registers its inlined fonts before the first fit and comes out 3 px taller than
  with Google Fonts. Re-running the fit on `document.fonts.ready` would fix it (visible change, needs a test).
