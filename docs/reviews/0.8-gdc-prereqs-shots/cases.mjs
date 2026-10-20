/* Regional quest prerequisites from the owner's aion2.gaming.tools page checks (2026-10-20,
   docs/research/2026-10-owner-page-checks.md). Next up's Regional quests card, desktop, Advanced:
   1. Lv 30 on "Canyon's Secret": before, Her Last Favor was offered (no prerequisite data); after, it waits for
      "Canyon's Secret" to be turned in, like the other Lv 30 quests.
   2. Lv 27 on "A Collective Effort": before, Fight Poison with Poison waited for its turn-in; after, it is offered (it opens at
      Step 4 of that quest).
   The act scrolls Next up's Regional quests card to the top. Format: tests/support/shots.mjs. */
const toRq = async () => { const c = [...document.querySelectorAll('#nowStar .ns-card')].find(c => /Regional quests/.test(c.innerText)); (c || document.getElementById('nowStar')).scrollIntoView({ block: 'start' }); window.scrollBy(0, -40); await new Promise(r => setTimeout(r, 300)); };
export default [
  { name: 'lv30-canyons-secret-advanced-1500', save: { level: 30, quest: "Canyon's Secret", checks: {}, welcomed: 1 }, mode: 'advanced', width: 1500, height: 1000, act: toRq },
  { name: 'lv27-collective-effort-advanced-1500', save: { level: 27, quest: 'A Collective Effort', checks: {}, welcomed: 1 }, mode: 'advanced', width: 1500, height: 1000, act: toRq },
];
