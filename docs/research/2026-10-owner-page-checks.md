# Owner page checks: regional quest prerequisites on aion2.gaming.tools (2026-10-20)

Game Data Check, 2026-10-20. aion2.gaming.tools serves our requests a challenge page, so it is owner-browser-only
(`docs/research/SOURCES.md`). The owner opened each page and sent screenshots of the "Required Quests" /
"Requirements" / "Dependent quests" boxes (Game Data Check thread, 2026-10-20 9:21–9:43 AM ET). The screenshots are
not archived in the repo (they are images of a third-party site); this note is the text record.

gaming.tools uses two kinds of prerequisite box:

- **Required Quests: X** means the whole quest, so in our data `{story: X, is: "turnedIn"}` (owner check 1, 2026-10-15).
- **Requirements: Step completed, X** means one step of X. The "Dependent quests" box on X's page names the step
  ("Step N", 1-based, matching our `steps[].i` + 1). The data has no step gate in `requires` (`storyStep` is
  completesWith-only, DATA-FORMAT-V2 §6), so these use `{story: X, is: "reached"}`. That opens them while X is current,
  at most a few steps early, instead of after X's turn-in.

## Results

| # | Regional quest | gaming.tools box | Before | After |
|---|---|---|---|---|
| A1 | Her Last Favor (2202018) | Required Quests: Canyon's Secret | Lv 10 only (check 7 proposal) | Canyon's Secret turned in |
| A2 | Pain Unending (2202040) | Required Quests: Last of the Destruction Archons | Lv 10 only (check 7 proposal) | Last of the Destruction Archons turned in |
| A3 | Traveling Merchant's Conundrum (2202029) | Step completed: Blood Monument; Blood Monument's Dependent quests: Step 2 | Blood Monument turned in | Blood Monument reached (Step 2: talk to Dixie at Graverobber Campsite) |
| A4 | Herb Pouch Heist (2202066) | Required Quests: Daybreak Society Rescue Operation | Lv 10 only (check 7 proposal) | Daybreak Society Rescue Operation turned in |
| A5 | Lest We Forget (2202046) | Step completed: Zikel's Core; Zikel's Core's Dependent quests: Step 1 | Zikel's Core turned in | Zikel's Core reached (Step 1: talk to Hort's Apparition) |
| A6 | Spacetime Rift: Unknown Species (2202030) | none; Required level 45 | Lv 45, unresearched (check 8 proposal) | Lv 45, verified none |
| A7 | Spacetime Rift: Proof (2202035) | none (owner: "same as A6") | Lv 45, unresearched (check 8 proposal) | Lv 45, verified none |
| B8 | Fight Poison with Poison (2202062) | Step completed: A Collective Effort; its Dependent quests: Step 4 | A Collective Effort turned in | A Collective Effort reached (Step 4: meet Ulgorn at Guide Rest Stop) |

Also confirmed, no data change:

- Blood Monument (2102370): required Lv 10, recommended 33, Ulgorn → Nemon, previous Scripture in the Ruins, next
  Impending Threat, EP. 5.
- Blood Barrier (2102770): Lingering Apparitions → Blood Barrier → Zikel's Core, EP. 6; Start and End Nemon (our turn-in
  Kibelisk, Collapsed Hall of Fame, stays from Metabot's marker).
- Ravenous Recluse (2202065): Lv 10, Fiona at the Abandoned Campsite, no prerequisite; the map legend's five steps match
  ours.
- Spacetime Rift text: the rift "appears at random locations at specific times and can be tracked via the map", with a
  server-wide message (second source to allthings.how). The app does not tell the player yet; follow-up.

## Still open (owner map pass)

- Ravenous Recluse giver zone: Metabot "Fafnite Deposit" vs allthings.how "Western Gribade Highland" (gaming.tools says
  only "Altgard").
- Spirit Isle, Where Time Has Stopped giver zone: Basfelt Waterfall vs Basfelt Ruins.
- Fafnite Storage Room entrance: is the nearest Kibelisk Fang Hideout (Sanctum Outpost)?
