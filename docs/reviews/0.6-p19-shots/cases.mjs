/* 0.6 P19: turning in a quest that gives a full level levels up (owner-ok-autolevel, 2026-10-17). A new character at
   Lv 1 on "A Village in the Fog" presses Next up's "Turned in": before, the story moves on and the level stays 1; after,
   it is Lv 2 with an Undo in the toast. Desktop, Advanced; the act clicks the button and waits out the card's exit.
   Format: tests/support/shots.mjs. */
const save = { level: 1, quest: 'A Village in the Fog', checks: {}, welcomed: 1 };
const turnIn = async () => { document.querySelector('#nowStar [data-now="story"]')?.click(); await new Promise(r => setTimeout(r, 900)); window.scrollTo(0, 0); };
export default [
  { name: 'village-turned-in-advanced-1500', save, mode: 'advanced', width: 1500, height: 1000, act: turnIn },
];
