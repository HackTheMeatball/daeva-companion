# allthings.how wording in plain note strings (0.8.1 F10, #690)

Game Data Check, 2026-10-21, for the F10 build (Walter's kickoff key) and Legal (Chuck). No pages were fetched; this note
reads the repository only (main at 148ab0a, after #685). It follows `2026-10-allthings-paraphrases.md` (F9), which covered
`quote` fields and the notes on allthings.how source refs. F9's builder found that allthings.how wording also sits in
plain strings that F9's walk didn't reach (`notes[]`, `conflicts[]` and similar). This note lists **every** string in
`data/packs/**` that names allthings.how outside a source ref: 162 strings, 128 distinct.

- **Change (F1–F23):** 23 strings carry allthings.how's wording (a quoted fragment, or a sentence after
  "allthings.how:"). Replace the "Now" text with the "Replace with" text, exactly. Only that part of the string changes;
  everything else in it stays, including Metabot, aion2.gaming.tools and in-game quotes. Several are story context
  (the quest's own description, which allthings.how repeats); none of these strings reaches the page.
- **No change (K1–K105):** the string only cites the site (credit lists, "from allthings.how"), or names a place, a
  number or an in-game name (achievement and title names are NC's, not the site's).
- **Second source** counts a permitted source (SOURCES.md tier Full, a game database, or the owner's screen) for the
  same fact. "Not shown" means the fact is research context and the app doesn't display it, so no label changes.
  No verdict or label changes come out of this note.

A check for the build (suggested): extend F9's walk in `tests/schema.mjs` to every string in `data/packs/**`, and fail on
"allthings…: '" or "allthings… ('" followed by a fragment that isn't in this note's "Replace with" column.

## Change

| # | Where (file under `data/packs/aion2/`, record, field) | Now | Replace with | Second permitted source |
|---|---|---|---|---|
| F1 | asmodian/regional-quests.json rq:2202016 `notes[0]` | allthings.how: next quest 'picks up straight after' this one; the two Menrik quests 'tell one story' | allthings.how: the next quest follows straight on from this one, and the two Menrik quests are one storyline | Order: yes (aion2.gaming.tools Required Quests on rq:2202017). Storyline: no; context only, not shown |
| F2 | asmodian/regional-quests.json rq:2202017 `notes[0]` | allthings.how: picks up straight after Blade of Vengeance | allthings.how: follows straight on from Blade of Vengeance | Yes: aion2.gaming.tools Required Quests (as F9 note row N1) |
| F3 | asmodian/regional-quests.json rq:2202018 `notes[0]` | allthings.how: With the Poison Blood now cleared from the tree's roots, Reden fears the barrier protecting the children has weakened. | allthings.how: once the Poison Blood is gone from the tree's roots, Reden worries the barrier shielding the children is weaker. | No; story context, not shown |
| F4 | asmodian/regional-quests.json rq:2202020 `notes[0]` | allthings.how: Hadala reluctantly passes along another letter from Derk | allthings.how: Hadala, unwillingly, hands over another letter from Derk | No; story context, not shown |
| F5 | asmodian/regional-quests.json rq:2202021 `notes[1]` | allthings.how: completes when Hallina 'asks you back for the final act' | allthings.how: it completes when Hallina invites you back for the last act | Yes: aion2.gaming.tools Required Quests and Metabot quest dialogue (as F9 note row N2) |
| F6 | asmodian/regional-quests.json rq:2202022 `notes[0]` | allthings.how: second act of Part 1; 'Enter the second stage to play through the final act.' | allthings.how: the second act of Part 1; you go into the second stage to play the last act | Yes: as F9 note row N2 |
| F7 | asmodian/regional-quests.json rq:2202026 `notes[0]` | allthings.how: Uru sends you through instead across three quests, each given and turned in at the Collapsed Chasm | allthings.how: Uru sends you through the rift instead, over three quests that are all given and handed in at the Collapsed Chasm | Giver place: Metabot quest pages (Full) name Uru; the Chasm place is allthings.how only (already in conflicts) |
| F8 | asmodian/regional-quests.json rq:2202026 `notes[1]`<br>asmodian/regional-quests.json rq:2202030 `notes[1]`<br>asmodian/regional-quests.json rq:2202031 `notes[0]`<br>asmodian/regional-quests.json rq:2202032 `notes[1]`<br>asmodian/regional-quests.json rq:2202033 `notes[0]`<br>asmodian/regional-quests.json rq:2202034 `notes[1]`<br>asmodian/regional-quests.json rq:2202035 `notes[0]` | allthings 244366 'Level 45') plus a rift that 'opens at random spots at set times' (allthings 244371) | allthings 244366 gives Lv 45) plus a rift that appears at random places on a fixed schedule (allthings 244371) | Lv 45: yes (Metabot 'Unlocks at 45' on all 7). The rift schedule: no; single source, not shown |
| F9 | asmodian/regional-quests.json rq:2202030 `notes[0]` | allthings.how: After Uru discovers beings in Altgard unlike any he has seen | allthings.how: it follows Uru finding creatures in Altgard he has never seen before | No; story context, not shown |
| F10 | asmodian/regional-quests.json rq:2202032 `notes[0]` | allthings.how: rift opens at random spots at set times | allthings.how: the rift appears at random places on a fixed schedule | No; single source, not shown |
| F11 | asmodian/regional-quests.json rq:2202037 `notes[0]` | allthings.how: After reassembling the last piece of Minusha's Heart | allthings.how: it starts once the last piece of Minusha's Heart is put back together | No; story context, not shown |
| F12 | asmodian/regional-quests.json rq:2202039 `notes[0]` | allthings.how: Though the dust crisis has been resolved, Nemon still mourns Ulgorn. | allthings.how: the dust crisis is over, but Nemon is still grieving for Ulgorn. | No; story context, not shown |
| F13 | asmodian/regional-quests.json rq:2202042 `notes[1]` | allthings.how: The Lagta Brigade is searching for Amunta, who was taken to the hideout for safety before contact was lost. | allthings.how: the Lagta Brigade is looking for Amunta, who was moved to the hideout to keep safe and then stopped answering. | No; story context, not shown |
| F14 | asmodian/regional-quests.json rq:2202043 `notes[0]` | allthings.how: After the Daybreak Society escaped from prison | allthings.how: it follows the Daybreak Society's escape from prison | No; story context, not shown |
| F15 | asmodian/regional-quests.json rq:2202045 `conflicts[0]` | allthings.how 244363 (Baba 'at the Assembly') | allthings.how 244363 (Baba at Nornir Assembly) | Yes: Metabot quest page names the start 'Baba · Nornir Assembly' (same string) |
| F16 | asmodian/regional-quests.json rq:2202047 `notes[0]` | allthings.how: Tefra is now Snotra's assistant. | allthings.how: Tefra has become Snotra's assistant. | No; story context, not shown |
| F17 | asmodian/regional-quests.json rq:2202053 `notes[0]` | allthings.how: Surprised by your speed, she points you to Battlescar Mound Cliff for the next wonder. | allthings.how: Tina, impressed by how quickly you got there, sends you to Battlescar Mound Cliff for the next wonder. | Order: yes (aion2.gaming.tools, as N3). The cliff: allthings.how only (as F9 note row N3) |
| F18 | asmodian/regional-quests.json rq:2202061 `notes[0]` | allthings.how: Finish the route at the Wind Altar after checking all four. | allthings.how: the route ends at the Wind Altar once all four are checked. | No; single source, not shown |
| F19 | asmodian/regional-quests.json rq:2202061 `conflicts[0]` | allthings.how 244371 ('Finish the route at the Wind Altar after checking all four') | allthings.how 244371 (the route ends at the Wind Altar once all four are checked) | No; as the row above |
| F20 | asmodian/regional-quests.json rq:2202070 `notes[1]` | allthings.how: 'continues Tina's tour of Altgard's landmarks'; Tina points you toward 'the next leg' at the end of the Basfelt Ruins cliff | allthings.how: carries on Tina's tour of Altgard's landmarks; at the Basfelt Ruins cliff she sends you on to the following leg | Order: yes (aion2.gaming.tools, as N4) |
| F21 | asmodian/regional-quests.json rq:2202071 `conflicts[0]` | consistent with allthings 2nd-Leg text ('the next leg' at the end of the Basfelt Ruins cliff) | consistent with allthings.how's 2nd Leg page (it ends with Tina sending you on from the Basfelt Ruins cliff) | Order: yes (as F9 note row N4). Pickup place: Metabot quest page 'Tina · Basfelt Ruins' (already noted) |
| F22 | asmodian/regional-quests.json rq:2202071 `conflicts[1]` | allthings states 'unlocks at level 10' only for the Verteron (Elyos) Final Stretch | allthings.how gives Lv 10 as the unlock only for the Verteron (Elyos) Final Stretch | Lv 10: yes (aion2.gaming.tools header) |
| F23 | asmodian/sealed-dungeons.json sd:ascetic-s-cave `notes[0]` | allthings.how gives 'roughly 160 m' to the Outskirts Stall teleport statue | allthings.how gives about 160 m to the Outskirts Stall teleport statue | No; single source (the dungeon isn't on Metabot's list) |

## No change

| # | Where | Why |
|---|---|---|
| K1 | asmodian/assassin/guide/claims.json C28b `claim`<br>asmodian/chanter/guide/claims.json C28b `claim`<br>asmodian/cleric/guide/claims.json C28b `claim`<br>asmodian/gladiator/guide/claims.json C28b `claim`<br>asmodian/ranger/guide/claims.json C28b `claim`<br>asmodian/sorcerer/guide/claims.json C28b `claim`<br>asmodian/spiritmaster/guide/claims.json C28b `claim`<br>asmodian/templar/guide/claims.json C28b `claim` | cites the site for a fact, number or name; no wording |
| K2 | asmodian/assassin/guide/confidence.json conf:stigmas `text` | cites the site for a fact, number or name; no wording |
| K3 | asmodian/assassin/guide/tips.json tip:stigma `credit`<br>asmodian/chanter/guide/tips.json tip:stigma `credit`<br>asmodian/cleric/guide/tips.json tip:stigma `credit`<br>asmodian/gladiator/guide/tips.json tip:stigma `credit`<br>asmodian/ranger/guide/tips.json tip:stigma `credit`<br>asmodian/sorcerer/guide/tips.json tip:stigma `credit`<br>asmodian/spiritmaster/guide/tips.json tip:stigma `credit`<br>asmodian/templar/guide/tips.json tip:stigma `credit` | credit list: names the site |
| K4 | asmodian/chanter/guide/confidence.json conf:stigmas `text`<br>asmodian/cleric/guide/confidence.json conf:stigmas `text`<br>asmodian/gladiator/guide/confidence.json conf:stigmas `text`<br>asmodian/ranger/guide/confidence.json conf:stigmas `text`<br>asmodian/sorcerer/guide/confidence.json conf:stigmas `text`<br>asmodian/spiritmaster/guide/confidence.json conf:stigmas `text`<br>asmodian/templar/guide/confidence.json conf:stigmas `text` | cites the site for a fact, number or name; no wording |
| K5 | asmodian/guide/claims.json C03 `note` | cites the site for a fact, number or name; no wording |
| K6 | asmodian/guide/claims.json C13 `note` | cites the site for a fact, number or name; no wording |
| K7 | asmodian/guide/claims.json C16 `note` | cites the site for a fact, number or name; no wording |
| K8 | asmodian/guide/claims.json C23 `note` | cites the site for a fact, number or name; no wording |
| K9 | asmodian/guide/claims.json C24 `note` | cites the site for a fact, number or name; no wording |
| K10 | asmodian/guide/claims.json C25 `note` | cites the site for a fact, number or name; no wording |
| K11 | asmodian/guide/claims.json C26 `note` | cites the site for a fact, number or name; no wording |
| K12 | asmodian/guide/claims.json C28e `newText` | cites the site for a fact, number or name; no wording |
| K13 | asmodian/guide/claims.json C28e `note` | cites the site for a fact, number or name; no wording |
| K14 | asmodian/guide/claims.json C36 `note` | cites the site for a fact, number or name; no wording |
| K15 | asmodian/guide/confidence.json conf:regional `text` | cites the site for a fact, number or name; no wording |
| K16 | asmodian/guide/confidence.json conf:respec `text` | cites the site for a fact, number or name; no wording |
| K17 | asmodian/guide/confidence.json conf:sealed-dungeons `text` | cites the site for a fact, number or name; no wording |
| K18 | asmodian/guide/confidence.json conf:strongholds `text` | cites the site for a fact, number or name; no wording |
| K19 | asmodian/guide/tips.json tip:duty `credit` | credit list: names the site |
| K20 | asmodian/guide/tips.json tip:expedition `credit` | credit list: names the site |
| K21 | asmodian/guide/tips.json tip:hideout `credit` | credit list: names the site |
| K22 | asmodian/guide/tips.json tip:regional `credit` | credit list: names the site |
| K23 | asmodian/guide/tips.json tip:respec `body` | cites the site for a fact, number or name; no wording |
| K24 | asmodian/guide/tips.json tip:respec `credit` | credit list: names the site |
| K25 | asmodian/guide/tips.json tip:stcost `body` | cites the site for a fact, number or name; no wording |
| K26 | asmodian/guide/tips.json tip:stcost `credit` | credit list: names the site |
| K27 | asmodian/guide/tips.json tip:stronghold `credit` | credit list: names the site |
| K28 | asmodian/guide/tips.json tip:supply `credit` | credit list: names the site |
| K29 | asmodian/guide/tips.json tip:traces `credit` | credit list: names the site |
| K30 | asmodian/regional-quests.json rq:2202010 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K31 | asmodian/regional-quests.json rq:2202010 `conflicts[1]`<br>asmodian/regional-quests.json rq:2202012 `conflicts[1]`<br>asmodian/regional-quests.json rq:2202050 `conflicts[2]` | names a place the site gives; no wording |
| K32 | asmodian/regional-quests.json rq:2202012 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K33 | asmodian/regional-quests.json rq:2202013 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K34 | asmodian/regional-quests.json rq:2202014 `conflicts[0]` | names a place the site gives; no wording |
| K35 | asmodian/regional-quests.json rq:2202015 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K36 | asmodian/regional-quests.json rq:2202016 `conflicts[3]` | names a place the site gives; no wording |
| K37 | asmodian/regional-quests.json rq:2202016 `conflicts[4]` | names a place the site gives; no wording |
| K38 | asmodian/regional-quests.json rq:2202017 `conflicts[1]` | names a place the site gives; no wording |
| K39 | asmodian/regional-quests.json rq:2202018 `conflicts[1]` | names a place the site gives; no wording |
| K40 | asmodian/regional-quests.json rq:2202019 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K41 | asmodian/regional-quests.json rq:2202019 `conflicts[3]` | names a place the site gives; no wording |
| K42 | asmodian/regional-quests.json rq:2202023 `conflicts[0]` | names a place the site gives; no wording |
| K43 | asmodian/regional-quests.json rq:2202023 `conflicts[1]`<br>asmodian/regional-quests.json rq:2202052 `conflicts[1]` | names a place the site gives; no wording |
| K44 | asmodian/regional-quests.json rq:2202023 `conflicts[2]`<br>asmodian/regional-quests.json rq:2202052 `conflicts[5]` | names a place the site gives; no wording |
| K45 | asmodian/regional-quests.json rq:2202028 `conflicts[1]` | names a place the site gives; no wording |
| K46 | asmodian/regional-quests.json rq:2202031 `conflicts[3]` | names a place the site gives; no wording |
| K47 | asmodian/regional-quests.json rq:2202032 `conflicts[1]` | names a place the site gives; no wording |
| K48 | asmodian/regional-quests.json rq:2202033 `conflicts[2]` | names a place the site gives; no wording |
| K49 | asmodian/regional-quests.json rq:2202037 `conflicts[1]` | names a place the site gives; no wording |
| K50 | asmodian/regional-quests.json rq:2202040 `conflicts[1]` | names a place the site gives; no wording |
| K51 | asmodian/regional-quests.json rq:2202041 `conflicts[1]` | names a place the site gives; no wording |
| K52 | asmodian/regional-quests.json rq:2202042 `conflicts[0]` | names a place the site gives; no wording |
| K53 | asmodian/regional-quests.json rq:2202043 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K54 | asmodian/regional-quests.json rq:2202046 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K55 | asmodian/regional-quests.json rq:2202046 `conflicts[1]` | cites the site for a fact, number or name; no wording |
| K56 | asmodian/regional-quests.json rq:2202050 `conflicts[1]` | names a place the site gives; no wording |
| K57 | asmodian/regional-quests.json rq:2202052 `conflicts[4]` | names a place the site gives; no wording |
| K58 | asmodian/regional-quests.json rq:2202053 `sources[5].note` | cites the site for a fact, number or name; no wording |
| K59 | asmodian/regional-quests.json rq:2202053 `conflicts[1]` | names a place the site gives; no wording |
| K60 | asmodian/regional-quests.json rq:2202053 `conflicts[2]` | names a place the site gives; no wording |
| K61 | asmodian/regional-quests.json rq:2202054 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K62 | asmodian/regional-quests.json rq:2202054 `conflicts[2]` | names a place the site gives; no wording |
| K63 | asmodian/regional-quests.json rq:2202057 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K64 | asmodian/regional-quests.json rq:2202059 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K65 | asmodian/regional-quests.json rq:2202065 `sources[4].note` | cites the site for a fact, number or name; no wording |
| K66 | asmodian/regional-quests.json rq:2202065 `conflicts[0]` | names a place the site gives; no wording |
| K67 | asmodian/regional-quests.json rq:2202065 `conflicts[1]` | names a place the site gives; no wording |
| K68 | asmodian/regional-quests.json rq:2202068 `conflicts[0]` | cites the site for a fact, number or name; no wording |
| K69 | asmodian/regional-quests.json rq:2202068 `conflicts[1]` | cites the site for a fact, number or name; no wording |
| K70 | asmodian/regional-quests.json rq:2202069 `sources[5].note` | cites the site for a fact, number or name; no wording |
| K71 | asmodian/regional-quests.json rq:2202069 `conflicts[2]` | names a place the site gives; no wording |
| K72 | asmodian/regional-quests.json rq:2202070 `conflicts[1]` | names a place the site gives; no wording |
| K73 | asmodian/regional-quests.json rq:2202070 `conflicts[2]` | names a place the site gives; no wording |
| K74 | asmodian/sealed-dungeons.json sd:ascetic-s-cave `rewardBasis` | cites the site for a fact, number or name; no wording |
| K75 | asmodian/sealed-dungeons.json sd:closed-hideout `notes[0]`<br>asmodian/sealed-dungeons.json sd:den-of-exiles `notes[0]`<br>asmodian/sealed-dungeons.json sd:place-of-rest `notes[0]`<br>asmodian/sealed-dungeons.json sd:twisted-pit `notes[0]` | cites the site for a fact, number or name; no wording |
| K76 | asmodian/sealed-dungeons.json sd:dratona-assembly-area `notes[0]` | cites the site for a fact, number or name; no wording |
| K77 | asmodian/sealed-dungeons.json sd:library-of-wisdom `notes[0]` | cites the site for a fact, number or name; no wording |
| K78 | asmodian/sealed-dungeons.json sd:odylium-marauder-den `rewards.items[0]` | cites the site for a fact, number or name; no wording |
| K79 | asmodian/sealed-dungeons.json sd:odylium-marauder-den `rewardBasis` | cites the site for a fact, number or name; no wording |
| K80 | asmodian/sealed-dungeons.json sd:odylium-marauder-den `notes[0]` | cites the site for a fact, number or name; no wording |
| K81 | asmodian/strongholds.json sh:detlef-thieves-camp `notes[1]` | cites the site for a fact, number or name; no wording |
| K82 | asmodian/strongholds.json sh:flauke-legion-outpost `notes[1]` | cites the site for a fact, number or name; no wording |
| K83 | asmodian/strongholds.json sh:granach-s-hideout `notes[1]` | cites the site for a fact, number or name; no wording |
| K84 | asmodian/unlocks.json unlock:sealed-dungeons-25 `credit` | credit list: names the site |
| K85 | asmodian/unlocks.json unlock:sealed-dungeons-30 `credit` | credit list: names the site |
| K86 | asmodian/unlocks.json unlock:supply-requests `credit` | credit list: names the site |
| K87 | asmodian/unlocks.json unlock:supply-requests `sources[1].inferred` | cites the site for a fact, number or name; no wording |
| K88 | asmodian/unlocks.json unlock:urugugu-canyon `credit` | credit list: names the site |
| K89 | asmodian/unlocks.json unlock:urugugu-canyon `timeLimit` | cites the site for a fact, number or name; no wording |
| K90 | asmodian/unlocks.json unlock:urugugu-canyon `sources[5].inferred` | cites the site for a fact, number or name; no wording |
| K91 | rules.json rule:sd-first-clear-asmodian `value.evidence[4].src` | cites the site for a fact, number or name; no wording |
| K92 | rules.json rule:sd-first-clear-asmodian `value.evidence[5].src` | cites the site for a fact, number or name; no wording |
| K93 | rules.json rule:sd-first-clear-asmodian `value.evidence[6].src` | cites the site for a fact, number or name; no wording |
| K94 | rules.json rule:sd-first-clear-asmodian `notes[2]` | cites the site for a fact, number or name; no wording |
| K95 | rules.json rule:sd-first-clear-asmodian `notes[4]` | cites the site for a fact, number or name; no wording |
| K96 | rules.json rule:stigma-shard-cost `notes[1]` | cites the site for a fact, number or name; no wording |
| K97 | rules.json rule:stigma-slots `notes[0]` | cites the site for a fact, number or name; no wording |
| K98 | rules.json rule:stigma-slots `notes[1]` | cites the site for a fact, number or name; no wording |
| K99 | sources.json src:allthings-how `id` | the source record itself |
| K100 | sources.json src:allthings-how `name`<br>sources.json src:allthings-how `hosts[0]` | the source record itself |
| K101 | sources.json src:allthings-how `independenceGroup` | the source record itself |
| K102 | world-bosses.json clock:server `conflicts[0]` | cites the site for a fact (one UTC+9 clock); no wording |
| K103 | world-bosses.json wb:guardian-lord-nahma `notes[0]` | names the site's boss label ("Abyss Siege Boss"); no other wording |
| K104 | world-bosses.json wb:silent-dartan `notes[0]` | cites the site (aion2vault repeats it); no wording |
| K105 | world-bosses.json wb:watcher-kaira `notes[1]` | cites the site for a number (up 30 min); no wording |
