/* The fake game's pack object (0.4 P6, docs/design/0.4-engine-contract.md §2): a game that isn't AION 2, run on the engine
   in Node only (tests/core/conformance.test.mjs), never in a page build. Only the required keys (id, data, catalog) and
   one Next up producer and one gated card (0.6 P16); every other hook keeps the engine's default. "fakegame:data" is the module tools/gen/gen.mjs
   compiles from this folder's packs (the test serves it), the way the AION 2 pack gets its generated data. */
import { definePack } from "../../../../src/core/pack.js";
import { GATE_GRAPH, GATE_PROPOSED, GUIDE_GATES, GUIDE_STEPS, QUESTS, QUEST_STEPS, QUEST_STEP_NOTES } from "fakegame:data";

export const fakegamePack = definePack({
  id: "fakegame",
  data: { graph: GATE_GRAPH, proposed: GATE_PROPOSED, story: { quests: QUESTS, steps: QUEST_STEPS, notes: QUEST_STEP_NOTES } },
  catalog: { milestones: GUIDE_GATES, routes: GUIDE_STEPS },
  /* on the last story quest: a card of the pack's own kind, ranked late (after the story card) */
  nextUpProducers: [{ id: "fakegame-end", produce: (state, ctx) => ctx.story.qi === QUESTS.length - 1 ? [{ phase: "late", card: { kind: "fakeEnd", act: "" } }] : [] }],
  /* one card that opens with the game (0.6 P16): locked until its gate, the step "f2:1" (Lv 2, "sq:10002" turned in), opens */
  cards: [{ id: "fakegame-bell", slot: "top", order: 100, root: "fakeBell", name: "Bell tower", key: "B", opensWith: "f2:1", mount: null, update: null }],
});
