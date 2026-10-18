/* Default keys (0.6 P14, docs/design/0.6-onboarding-mockup.md §1.3): the key that opens a card's game window, from the
   owner's unlock screens (unlocks.json `hotkey`, compiled to HOTKEYS). A key shows only once its unlock is open, so never
   for a locked window: on the card it opens (a key chip in the header) and on the Next up rows that send you there
   ("Open Skills: press K"). Default keys only: no rebinding. */
import { char } from "../../core/state.js";
import { gatesOf } from "../../core/requirements.js";
import { HOTKEYS } from "./data/story.js";
import { pageState as state } from "../../cards/page.js";

/* card → the unlock that opens its window, and the window's name in the hint */
const CARDS = { skills: ["unlock:skills-window", "Skills"], daevanion: ["unlock:daevanion", "Daevanion"] };
/* the card's key once its unlock is open, else "" */
export const keyOf = card => { const [id] = CARDS[card], k = HOTKEYS[id]; if (!k) return "";
  const n = gatesOf(char(state)).node(id); return n && n.open ? k : ""; };
const chip = k => `<kbd class="keychip" title="Default key">${k}</kbd>`;
/* a Next up row's hint line, under its text and above its action, or "" */
export const keyHint = card => { const k = keyOf(card); return k ? `<p class="ns-key">Open ${CARDS[card][1]}: press ${chip(k)}</p>` : ""; };
/* the card's own chip, at the right end of its first line (the points / crystals line): the header has no room for it
   beside the number control at desktop widths, it would wrap the control onto a line of its own. "" while locked. */
export const keyChip = card => { const k = keyOf(card); return k ? `<kbd class="keychip" aria-label="Key ${k}" title="Default key">${k}</kbd>` : ""; };
