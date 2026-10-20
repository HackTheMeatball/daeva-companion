/* 0.8 P15: auto level-up uses the level a quest is turned in at (#401, research-401-levels). A character at Lv 3 on
   "Shadow Forest" presses Next up's "Turned in": before, only A Village in the Fog levelled, so the level stays 3; after,
   it is Lv 4 with an Undo in the toast. Desktop, Advanced; the act clicks the button and waits out the card's exit.
   Format: tests/support/shots.mjs. */
const save = { level: 3, quest: 'Shadow Forest', checks: {}, welcomed: 1 };
const turnIn = async () => { document.querySelector('#nowStar [data-now="story"]')?.click(); await new Promise(r => setTimeout(r, 900)); window.scrollTo(0, 0); };
export default [
  { name: 'shadow-forest-turned-in-advanced-1500', save, mode: 'advanced', width: 1500, height: 1000, act: turnIn },
];
