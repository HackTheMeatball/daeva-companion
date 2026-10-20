/* The AION 2 pack object (0.4 P2b, docs/design/0.4-engine-contract.md §2): everything the engine reads of AION 2, handed
   over in one place. The shell imports it and calls usePack(aion2Pack) before it loads the save (src/main.js); the Node
   test bundle does the same (tests/support/core-bundle.mjs). The compiled data modules (gate-graph.js, gate-proposed.js;
   scripts/generated-data.mjs) are imported here and nowhere in the engine. */
import { definePack } from "../../core/pack.js";
import { GATE_GRAPH } from "./data/gate-graph.js";
import { GATE_PROPOSED } from "./data/gate-proposed.js";
import { QUESTS, QUEST_STEP_NOTES } from "./data/story.js";
import { GAME_CLASSES } from "./data/classes.js";
import { GATES, STEPS } from "./data/milestones.js";
import { GATE_CHANGES, KEPT_RULES, aion2Transforms } from "./rules.js";
import { hopName, isAscensionKey, objLow, objSubs, storyHereOf, storyRecGate, zoneOfKey } from "./requirements.js";
import { aion2OnLoad } from "./load.js";
import { aion2Meanwhile, aion2NextUp, aion2RouteOf, aion2StoryFields } from "./nextup.js";
import { aion2Cards } from "./cards/index.js";
import { aion2Text } from "./text.js";
import { aion2NowRenderers } from "./cards/nextup-kinds.js";
import { aion2RowHooks, aion2RowRenderers } from "./cards/rows.js";
import { aion2Place, stepsShownOf } from "./travel.js";

/* The default guide pack (data/packs/aion2/asmodian/assassin/pack.json) and its class (data/packs/aion2/classes/assassin):
   what a fresh save starts with; tests/core/state.test.mjs checks both against data/. Every class with a guide pack is
   playable (`classes`): the Assassin, since 0.6 P5 the Ranger (data/packs/aion2/asmodian/ranger), since 0.7 P2 the
   Gladiator (data/packs/aion2/asmodian/gladiator), since 0.7 P4 the Spiritmaster (data/packs/aion2/asmodian/spiritmaster) and
   since 0.8 P3 the Templar (data/packs/aion2/asmodian/templar), since 0.8 P5 the Cleric (data/packs/aion2/asmodian/cleric)
   and since 0.8 P17 the Sorcerer (data/packs/aion2/asmodian/sorcerer).
   A character of another class is shown after the reload a switch does (the page loads one class's tables,
   docs/ARCHITECTURE.md §4). */
export const PACK = "aion2/asmodian/assassin";
export const CLASS = "assassin";
const RANGER = { class: "ranger", pack: "aion2/asmodian/ranger", name: "Ranger" };
const GLADIATOR = { class: "gladiator", pack: "aion2/asmodian/gladiator", name: "Gladiator" };
const SPIRITMASTER = { class: "spiritmaster", pack: "aion2/asmodian/spiritmaster", name: "Spiritmaster" };
const TEMPLAR = { class: "templar", pack: "aion2/asmodian/templar", name: "Templar" };
const CLERIC = { class: "cleric", pack: "aion2/asmodian/cleric", name: "Cleric" };
const SORCERER = { class: "sorcerer", pack: "aion2/asmodian/sorcerer", name: "Sorcerer" };

/* the class emblems (0.8 P12: Metabot's, the exact fetched bytes; docs/ISSUES.md "Class emblems") */
const CLASS_EMBLEM = { gladiator: "assets/icons/class-gladiator.webp", templar: "assets/icons/class-templar.webp", assassin: "assets/icons/class-assassin.webp",
  ranger: "assets/icons/class-ranger.webp", sorcerer: "assets/icons/class-sorcerer.webp", spiritmaster: "assets/icons/class-spiritmaster.webp",
  cleric: "assets/icons/class-cleric.webp", chanter: "assets/icons/class-chanter.webp" };

/* the objectives as shown: no mention of a Kibelisk bind that happens at the objective (0.6 P12, travel.js stepsShownOf) */
const SHOWN = stepsShownOf(GATE_GRAPH);

export const aion2Pack = definePack({
  id: "aion2",
  data: { graph: GATE_GRAPH, proposed: GATE_PROPOSED, story: { quests: QUESTS, steps: SHOWN.steps, notes: QUEST_STEP_NOTES } },
  catalog: {
    milestones: GATES, routes: STEPS,
    /* Sealed Dungeons (and their heading) and board nodes are tracked in their own cards, not as milestone rows; regional
       quests (and their headings) are side content: listed last, not in the main counts */
    rowKind: it => { const k = it.kind || it.group; return k === "hideout" || it.dv ? "none" : k === "quest" ? "side" : "main"; },
    /* skill and board lines have their own cards, the Stigmas card covers stigma equips and "Put … on E" */
    offered: (it, k) => !/^(sp|dv):/.test(k) && !(it && (it.stig || it.eput)),
    /* skill and board lines have their own Buy / Later cards; a stigma-only milestone's Later card shows its title */
    promised: (it, k) => !/^(sp|dv):/.test(k),
    /* a record's route label, for Next up's fastest / completionist tracks (src/core/nextup.js routeOf, 0.5 P14) */
    route: aion2RouteOf,
  },
  /* the character's fields beside the engine's, in the order sync stamps them (src/core/sync.js) */
  charFields: {
    areaRun: "map", rqSnooze: "map", stLv: "map", stPick: "map",
    stones: "register", pendSt: "register", pendCr: "register", stShards: "register", dvTotal: "register", dvCost: "map", dvAdj: "register",
    /* the 10-second undo of a board node (local), and two retired fields */
    dvLast: "local", dvLastAt: "local", dvPts: "local", crystals: "local",
    rotSeen: "register",
  },
  character: { pack: PACK, class: CLASS },
  /* the names are the class records' (data/packs/aion2/classes/<class>/class.json; tests/core/chars.test.mjs) */
  classes: [{ class: CLASS, pack: PACK, name: "Assassin" }, RANGER, GLADIATOR, SPIRITMASTER, TEMPLAR, CLERIC, SORCERER],
  /* every class of the game, guide or not (0.8 P12: the welcome card's class picker shows the others as "Soon") */
  gameClasses: GAME_CLASSES.map(e => ({ ...e, icon: CLASS_EMBLEM[e.class] })),
  keptRules: KEPT_RULES,
  gateChanges: GATE_CHANGES,
  graphTransforms: aion2Transforms,
  story: { levelGate: storyRecGate, isTalkOnly: t => objLow(t) || SHOWN.only.has(t), subs: objSubs, here: storyHereOf, meanwhile: aion2Meanwhile, cardFields: aion2StoryFields },
  hopName,
  locate: zoneOfKey,
  skipLocation: isAscensionKey,
  onLoad: aion2OnLoad,
  /* where a stamp says the player was (0.5 P10: src/core/place.js whereNow; the place data is NODE_PLACE / KIBELISKS) */
  place: aion2Place,
  nextUpProducers: aion2NextUp,
  /* its cards (0.4 P4b): the shell registers each (src/main.js) */
  cards: aion2Cards,
  /* its Next up and Later kinds and their hooks (0.4 P5a): the engine cards call them (src/cards/nextup.js, ahead.js) */
  nowRenderers: aion2NowRenderers,
  /* its rows in the milestone and Route rules cards, and what they do (0.4 P5b) */
  rowRenderers: aion2RowRenderers,
  rowHooks: aion2RowHooks,
  /* the words the engine cards may not hold (0.4 P5d) */
  text: aion2Text,
});
