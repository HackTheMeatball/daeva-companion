/* The AION 2 pack's cards (0.4 P4b): the pack object lists them (aion2Pack.cards) and the shell registers each with
   the card registry (src/core/cards.js; slots and orders: docs/ARCHITECTURE.md §2).
   Cards that open with the game (0.6 P16): opensWith names the unlock that opens the card's game window, from the
   owner-verified unlocks (unlocks.json; docs/research/2026-10-owner-unlocks.md): Skills at Lv 4, Daevanion after
   "Urgent Pursuit", Stigmas with the first slot at Lv 22. key is the window's default key (the owner's screens, HOTKEYS),
   shown in the faded shell's line; Stigmas have none on record. Dungeons & Strongholds (areas) stay open: no verified
   unlock record opens the card as a whole (the 0.6 S1 mockup §1.2). */
import { HOTKEYS } from "../data/story.js";
import { aion2ProgressCard } from "./progress.js";
import { aion2AreasCard } from "./areas.js";
import { aion2SkillsCard } from "./skills.js";
import { aion2DaevanionCard } from "./daevanion.js";
import { aion2CubeCard } from "./cube.js";
import { aion2StigmasCard } from "./stigmas.js";
import { aion2BuildCard } from "./build.js";

const opens = (card, unlock, name) => ({ ...card, opensWith: unlock, name, key: HOTKEYS[unlock] || null });

export const aion2Cards = [aion2ProgressCard, aion2AreasCard, opens(aion2SkillsCard, "unlock:skills-window", "Skills"),
  opens(aion2DaevanionCard, "unlock:daevanion", "Daevanion"), aion2CubeCard, opens(aion2StigmasCard, "unlock:stigma-slot-1", "Stigmas"), aion2BuildCard];
