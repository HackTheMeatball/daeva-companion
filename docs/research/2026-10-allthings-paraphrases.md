# allthings.how quotes in data/** (0.8.1 F9, #662)

Game Data Check, 2026-10-21, for Legal (Chuck) and Walter. No pages were fetched for this note; it reads the repository
only. allthings.how's terms are at `/terms-and-conditions/` (its footer's `/terms/` is 404; found by web search
2026-10-20, `SOURCES.md`, Spot). They ban copying, reproducing or downloading its material without written permission,
but not reading it, so its rule is facts and a link only, and quoting its wording in `data/` is copying. This note lists every `quote` field in `data/**` that sits on an allthings.how citation, with the
fact in my own words, so a data PR can replace the quotes with paraphrases or drop them.

Found with a walk of every JSON file under `data/` (each object with an allthings.how `url`, then its `quote`):
**23 quote fields, 15 distinct quotes**. 21 are in the shipped packs and 2 in `data/schema/examples/` (not shipped).
The C02 quote is the same in all 8 class guides. Walter counted 21 / 14 plus 1 example; Chuck counted 23 / 16. The
difference is the two example files, and C12, which has two allthings.how quotes. The same walk also found **5 short
quoted fragments inside `note` fields** on allthings.how citations, which a `quote` search misses (second table).

## How these were fetched (for Chuck's question)

- **When.** Every allthings.how URL in `data/` was in the repository by 2026-10-13, with no new page since. They came in
  with the first import (`de17312d`, `3fd5fb1d`, 2026-10-12), plus `?p=232647` in `5e8517c6` (2026-10-13). `5a531ef`
  doesn't touch them. `d24ff57` moved records verbatim into the shared Asmodian pack (+44 / −44 lines). `5f7b415`,
  and each later class pack, copied C02 into the new class. Checked with `git log -G'allthings'` on a full clone.
- **How.** `tools/research/README.md` (commit `968f9add`) says the R1 to R3 and V1 research passes (October 2026) were
  done "by hand / with WebFetch" in claude.ai sessions, before the repository and its fetch rules existed (rules
  2026-10-14). Nothing records the User-Agent, rate, or a robots.txt or terms check for those reads.
  `sources.json` had allthings.how as `robots: unchecked`, `terms: unread`.
- **Inferred: the quotes may not be verbatim.** WebFetch returns a model's summary of a page, not its text, and
  `tools/research/r1/partial.json` has a note on a "fetch summary" that mixed up two pages. So a `quote` here is
  either a short extract or a summary of the page. The owner or Chuck can only tell which by opening the page.
- **Since then.** The only scripted reads of allthings.how were Source Vetting's (Lydia) on 2026-10-20 for the
  world-boss research: one article, then the terms search, with our User-Agent, at least 5 s apart
  (`docs/research/2026-10-world-boss-sources.md`; the article was read before its terms were found, disclosed there). It added no quote under `data/` on main.

## Quotes

"Second source" counts only another source that states **the same fact**, with its tier in `SOURCES.md` today. Full =
a source we may read. Owner = the owner's in-game screen. Sites the register lists as Fail or owner-browser-only
(thegameswiki, games.gg, keengamer, playnews, wikily), and sites it doesn't list (exitlag, fandomwire, neonsect,
selphie1999), are named but don't count. The exception is aion2.gaming.tools, which CLAUDE.md names as a game database,
so its quest fields count even though we now read it only in the owner's browser. Every fetch date is **unknown**. The claims carry `verifiedAt: 2026-10-12`,
and the sources carry no `checkedAt`.

| # | File (under `data/packs/aion2/`) | Claim | URL | Fact, in my words | Second permitted source |
|---|---|---|---|---|---|
| 1 | `asmodian/{assassin,chanter,cleric,gladiator,ranger,sorcerer,spiritmaster,templar}/guide/claims.json` (8 files) | C02 | https://allthings.how/?p=215236 | You earn skill points by gaining character levels; nothing else hands them out. | **Partly.** Metabot skill pages (Full) and the owner screen `owner:2026-10-15-alt-03` back the level gates and point costs. No other source says levels are where points come from (single source for that part). |
| 2 | `asmodian/guide/claims.json` | C01 | https://allthings.how/?p=215236 | Undoing spent skill points costs nothing, and you can do it any number of times. | **No.** exitlag (unlisted) agrees; thegameswiki says a fee applies. The claim is already `disputed`. |
| 3 | `asmodian/guide/claims.json` | C03 | https://allthings.how/?p=215236 | Specialty slots open at skill levels 8, 12 and 16, with more at 20. | **No, and it is the outlier.** thegameswiki and gameplay.tips put the third slot at 20, and the app shows 20. allthings.how is cited only as the dissent. |
| 4 | `asmodian/guide/claims.json` | C12 | https://allthings.how/?p=244925 | Each Sealed Dungeon's first clear gives 15,000 Kina, 1,250 Enhance Stones, two each of bound Daevanion Crystals and Wisdom Stones, and a title. | **Yes.** aion2hub (Full, weak corroboration), and Metabot's dungeon pages (Full) show the same amounts per band (claim note; `dungeons.json`). |
| 5 | `asmodian/guide/claims.json` | C12 | https://allthings.how/aion-2/map/library-of-wisdom/ | Library of Wisdom's clear gives the same Kina and stones, plus two each of the bound wing feathers, statue scraps, crystals and Wisdom Stones. | **Yes**, as row 4. |
| 6 | `asmodian/guide/claims.json` | C13 | https://allthings.how/?p=234622 | A Stronghold clear gives two Noble Belt Enhance Scrolls and 15,000 Kina; green quests and the "?" map markers drop more scrolls. | **Rewards: yes** (aion2hub, Full). **Extra scrolls elsewhere: no**, allthings.how only; it is why the claim is `disputed`, and the app says "main source", not "only source". |
| 7 | `asmodian/guide/claims.json` | C15 | https://allthings.how/?p=234744 | A Duty mission pays 2,000 Abyss Points and some Kina at base, plus between one and five random items. | **No** (single source). The app's Duty text doesn't use these figures. |
| 8 | `asmodian/guide/claims.json` | C16 | https://allthings.how/?p=234744 | The Supply board has four tabs: Emergency, Weekly, and two standing ones for crafting and bosses. One hand-in pays 380 to 6,000 Abyss Points. | **Tabs: no permitted one** (keengamer and games.gg are owner-browser only, mein-mmo is passed but not allowed). **AP range: no**, and the app's text dropped it. The claim is `single-source`. |
| 9 | `asmodian/guide/claims.json` | C23 | https://allthings.how/?p=234622 | Taking the belt to +10 at Rare costs 232,000 Kina and 9,280 Enhance Stones; a Substance Morph sends it back to +0 with better base stats. | **Costs: no permitted one** (fandomwire, unlisted). **Reset to +0: no**, allthings.how only, and the app dropped it. The claim is `single-source`. |
| 10 | `asmodian/guide/claims.json` | C24 | https://allthings.how/?p=234622 | Enhancing the Noble Belt never fails. | **No permitted one** (fandomwire, unlisted). The claim is `verified` on these two sources. |
| 11 | `asmodian/guide/claims.json` | C25 | https://allthings.how/aion-2/map/empyrean-traces/ | Altgard's map has 560 Empyrean Trace spots. | **Yes.** Metabot's Altgard trace map (Full): 560. |
| 12 | `asmodian/guide/claims.json` | C28e | https://allthings.how/?p=244925 | A Sealed Dungeon is a one-player instance that you clear a single time. | **Solo: yes.** Metabot (Full) lists 1 player (claim note; Wikily is Fail and counts with Metabot). |
| 13 | `asmodian/guide/claims.json` | C28g | https://allthings.how/?p=234744 | Supply Requests and their four tabs are a different system from Duty missions. | **Inferred yes.** No permitted source says it directly. They open at different levels: Supply at Lv 25 on Metabot's unlock table (Full, C16 note), Duty at Lv 45 (thegameswiki, neonsect). |
| 14 | `asmodian/guide/claims.json` | C36 | https://allthings.how/?p=232647 | The story stops at Lv 22 and Lv 32 for an Ascension quest, which opens only once the Ascension Gauge is full. | **Yes.** skycoach (Full), the owner screen `owner:2026-10-15-alt-26`, and Metabot's quest pages (Full). |
| 15 | `../schema/examples/packs/aion2/asmodian/assassin/guide/claims.json` | C01 (example) | https://allthings.how/?p=215236 | As row 2. | Example file, not shipped. Replace it with the same paraphrase as row 2. |
| 16 | `../schema/examples/packs/aion2/asmodian/regional-quests.json` | rq:2202017 (example) | https://allthings.how/?p=244377 | "In the Fang Legion's Name" comes right after "Blade of Vengeance". | Example file, not shipped. The live record has the same words in a `note` (second table). |

Rows 1 to 14 hold the 21 shipped quotes (row 1 covers 8 files). Rows 15 and 16 are the 2 example files.

### Quoted fragments in `note` fields

| # | File (under `data/packs/aion2/`) | Record | URL | Fact, in my words | Second permitted source |
|---|---|---|---|---|---|
| N1 | `asmodian/regional-quests.json` | rq:2202017, `requires` (done rq:2202016) | https://allthings.how/?p=244377 | "In the Fang Legion's Name" opens once "Blade of Vengeance" is done. | **Yes.** aion2.gaming.tools Required Quests (game database). |
| N2 | `asmodian/regional-quests.json` | rq:2202022, `requires` (done rq:2202021) | https://allthings.how/?p=244363 | Part 1 of "An Invitation to the Past" ends by sending you on to Part 2. | **Yes.** aion2.gaming.tools Required Quests, and the Metabot quest dialogue (Full). |
| N3 | `asmodian/regional-quests.json` | rq:2202070, `requires` (done rq:2202053) | https://allthings.how/?p=244384 | The 1st Leg of "Nine Wonders of Altgard" ends by sending you to Battlescar Mound Cliff for the 2nd. | **Order: yes**, aion2.gaming.tools Required Quests. **The cliff:** a second allthings.how page only, so not independent. |
| N4 | `asmodian/regional-quests.json` | rq:2202071, `requires` (done rq:2202070) | https://allthings.how/aion-2-every-impetusium-square-regional-quest-and-reward-asmodian/ | The Final Stretch follows the 2nd Leg, which ends at the Basfelt Ruins cliff. | **Order: yes**, aion2.gaming.tools Required and Dependent Quests. |
| N5 | `asmodian/strongholds.json` | sh:graverobber-den, `rewards.xp` source | https://allthings.how/?p=247483 | Graverobber Den is a small stronghold beside the Nameless Cemetery. | **Its place: yes.** Metabot's quest page (Full) gives its map position. The app doesn't show the cemetery remark. |

## What this suggests (for the data PR, not done here)

- Replace each `quote` above with the paraphrase. One option is a `note` field, since the schema has no `paraphrase`
  field; the schema owner decides. That removes allthings.how wording from `data/` without losing the citation.
- Rows 2, 7, 8 (tabs), 9 and 10 have no permitted second source. Rows 1 and 6 lack one for part of the fact. Two
  shipped claims rest on these: C24 (`verified`) and C23's belt costs. Per CLAUDE.md, they need a "single source"
  label in a data PR Lydia verifies, or an owner check. The rest are already labelled or not shown.
- Only allthings.how quotes and quoted note fragments are covered here. The other allthings.how citations (82 pages in `data/DATA_SOURCES.md`) are URLs and plain notes, so
  they need no paraphrase. Whether their facts have a second source is the separate question for Chuck.
