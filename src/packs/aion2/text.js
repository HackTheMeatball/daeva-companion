/* The AION 2 pack's words for the engine cards (0.4 P5d; aion2Pack.text): the Sources intro and the Undo button's
   title, which src/cards/ may not hold. "{n}" in sourcesIntro is the number of links. terms (0.6 P18): the game words
   explained, { "term:<id>": { t: the term, x: one sentence } }, compiled from data/packs/aion2/terms.json (TERMS);
   src/packs/aion2/terms.js opens them from the marks in the card markup. */
import { TERMS } from "./data/generated.js";

export const aion2Text = {
  sourcesIntro: "Every sourced value in the guide comes from one of these pages ({n} links, checked Oct 2026); values seen in game or worked out by the guide are marked in Confidence. Metabot data is used with credit: each item links to its Metabot page.",
  undoTitle: "Untick the last node you acquired",
  terms: TERMS,
};
