/* AION 2 travel (0.5 P10, pure: no DOM; docs/design/0.4-smart-next-up.md §4, §8): what a stamp in the save says about
   where the player was (aion2Place, the pack's `place` for src/core/place.js whereNow), which Kibelisks are bound (§8.1),
   the one-time "Bind X" row (§8.2) and teleport vs walk (§8.3). All derived from the save and the rules
   (TRAVEL_RULES: rule:kibelisk-bind-radius, rule:kibelisk-nudge-radius, rule:teleport-gain), never stored. The story card's
   "Bind X" row (0.5 P15, nextup.js aion2StoryFields) calls nudgeOf, its travel line (0.5 P16) teleportOf.

   Points are NODE_PLACE's { map, x, y, anchor, m }: anchor = the nearest Kibelisk's registry id, m = the source's metres
   to it. Story objectives have no points yet (design §3, S1), so an objective places the player only by its Kibelisk's
   zone, and the story card's target is the current quest's turn-in once its other objectives are ticked. */
import { KIBELISKS, NODE_PLACE, TRAVEL_RULES } from "./data/place.js";
import { QUEST_LOC, QUEST_STEPS } from "./data/story.js";
import { isAscensionKey } from "./requirements.js";
import { activePack, perPack } from "../../core/pack.js";
import { placeDist } from "../../core/place.js";
import { gatesOf, qProgOf } from "../../core/requirements.js";

/* the gate graph is the pack object's (data.graph; only pack.js imports GATE_GRAPH); lookups built once per pack: save
   key → node id, quest name → story index, Kibelisk name → id */
const travelGraph = () => activePack().data.graph;
const travelIx = () => perPack("travelIx", p => ({
  idOfKey: new Map(Object.entries(p.data.graph.nodes).filter(([, n]) => n.key !== undefined).map(([id, n]) => [n.key, id])),
  storyIdx: new Map(p.data.graph.story.map(([, name], i) => [name, i])),
  kibByName: new Map(Object.entries(KIBELISKS).map(([id, k]) => [k.name, id])),
}));
const travelNode = k => { const id = travelIx().idOfKey.get(k); return id ? { id, n: travelGraph().nodes[id], P: NODE_PLACE[id] } : null; };
const travelMapOf = p => p ? p.map || (KIBELISKS[p.anchor] || {}).map || null : null;
const travelSpot = (zone, pt) => zone || pt ? { zone: zone || null, pt: pt || null } : null;
const TRAVEL_MARK = /\(Kibelisk: ([^)]+)\)/;

/* ---------- Where a stamp says the player was (design §4) ---------- */
/* A done regional quest: its turn-in (the Kibelisk's zone, the record's zone being the giver's); picked up: its giver; a
   Sealed Dungeon or stronghold done or run: its entrance; a "bind:<kib>" tick: that Kibelisk's zone (no position);
   an objective: its Kibelisk's zone, else the quest's; the story position: the current quest's giver, which sits at the
   previous quest's turn-in on a same-map hop (location research §7), or its turn-in once turned in. Ascension steps
   never place the player (owner, 2026-10-14). */
export const aion2Place = {
  fields: ["areaRun"],
  at(path, v) {
    const [f, k, i] = path;
    if (f === "checks") {
      if (k.startsWith("bind:")) { const K = KIBELISKS[k.slice(5)]; return K ? travelSpot(K.zone, null) : null; }
      const x = !isAscensionKey(k) && travelNode(k); if (!x || !x.P) return null;
      if (x.n.kind === "rq") { const p = x.P.pts.turnin; return travelSpot((p && KIBELISKS[p.anchor] || {}).zone || x.P.zone, p); }
      return x.n.kind === "sd" || x.n.kind === "sh" ? travelSpot(x.P.zone, x.P.pts.entrance) : null;
    }
    if (f === "started") { const x = travelNode(k); return x && x.P && x.n.kind === "rq" ? travelSpot(x.P.zone, x.P.pts.giver) : null; }
    if (f === "areaRun") { const x = travelNode(k); return x && x.P && (x.n.kind === "sd" || x.n.kind === "sh") ? travelSpot(x.P.zone, x.P.pts.entrance) : null; }
    if (f === "qsteps") {
      const x = travelNode(k), m = ((QUEST_STEPS[k] || [])[+i] || "").match(TRAVEL_MARK), K = m && KIBELISKS[travelIx().kibByName.get(m[1])];
      return travelSpot(K ? K.zone : x && x.P ? x.P.zone : null, null);
    }
    if (f === "quest") {
      const [q, end] = Array.isArray(v) ? v : [], si = travelIx().storyIdx.get(q), x = q ? travelNode(q) : null;
      if (si === undefined || !x || !x.P) return null;
      if (end === q) return travelSpot(x.P.zone, x.P.pts.turnin);
      const prev = si > 0 ? NODE_PLACE[travelGraph().story[si - 1][0]] : null, g = x.P.pts.giver, pm = prev && travelMapOf(prev.pts.turnin);
      return travelSpot(prev && pm && pm === travelMapOf(g) ? prev.zone : x.P.zone, g);
    }
    return null;
  },
};

/* ---------- Bound Kibelisks (design §8.1) ---------- */
/* quests turned in: the index of the current quest, one more once it is turned in (storyEnd) */
const turnedInCount = c => { const i = c.quest ? travelIx().storyIdx.get(c.quest) : undefined; return i === undefined ? 0 : i + (c.storyEnd === c.quest ? 1 : 0); };
/* Every point the player has visited: a story giver once the quest is turned in or one of its objectives ticked, a story
   turn-in once turned in; a regional quest's giver once picked up or done, its turn-in once done; an entrance once done or
   run. Done = ticked or derived (the evaluator, so a follow-up's pick-up counts). */
function visitedPoints(c) {
  const out = [], add = p => { if (p) out.push(p); }, ti = turnedInCount(c), qs = c.qsteps || {}, run = c.areaRun || {};
  travelGraph().story.forEach(([id, name], i) => { const P = NODE_PLACE[id]; if (!P) return;
    if (i < ti || (qs[name] || []).length) add(P.pts.giver);
    if (i < ti) add(P.pts.turnin); });
  const ev = gatesOf(c);
  Object.entries(travelGraph().nodes).forEach(([id, n]) => { const P = NODE_PLACE[id]; if (!P || n.kind === "story") return;
    const r = ev.byKey(n.key), done = !!(c.checks || {})[n.key] || !!(r && r.done);
    if (n.kind === "rq") { if (done || qProgOf(c, n.key) > 0) add(P.pts.giver); if (done) add(P.pts.turnin); }
    else if (done || run[n.key]) add(P.pts.entrance); });
  return out;
}
/* The bound Kibelisks (a Set of ids): a visited point within R metres of it, a "bind:<kib>" tick, or a `binds` fact on a
   visited objective (ticked, or its quest turned in). o.R = the bind radius (rule:kibelisk-bind-radius), o.kibs = the
   registry (tests swap both). Ticking more never unbinds: every clause only grows with ticks and story progress. */
export function boundSet(c, { R = TRAVEL_RULES.bindRadius, kibs = KIBELISKS } = {}) {
  const out = new Set(), ti = turnedInCount(c), qs = c.qsteps || {};
  visitedPoints(c).forEach(p => { if (p.anchor && p.anchor in kibs && p.m != null && p.m <= R) out.add(p.anchor); });
  Object.entries(c.checks || {}).forEach(([k, v]) => { if (v === true && k.startsWith("bind:") && k.slice(5) in kibs) out.add(k.slice(5)); });
  Object.entries(kibs).forEach(([id, K]) => { if ((K.binds || []).some(b => { const n = travelGraph().nodes[b.node], si = n ? travelIx().storyIdx.get(n.key) : undefined;
    return si !== undefined && (si < ti || (qs[n.key] || []).includes(b.i)); })) out.add(id); });
  return out;
}
export const bound = (c, kib, o) => boundSet(c, o).has(kib);

/* ---------- The "Bind X" row (design §8.2) ---------- */
/* On the story card while its target (the current quest's turn-in) is more than R and at most the nudge radius from its
   Kibelisk K, K is not bound and this is the first point in story order with K in that band: { kib, name, m, key, via,
   npc } (key = the tick that binds it, via = the quest's node id, npc = the turn-in's NPC or null), else null.
   "One-time" comes from the data: past that point the row is gone. */
export function nudgeOf(c, { R = TRAVEL_RULES.bindRadius, nudge = TRAVEL_RULES.nudgeRadius, kibs = KIBELISKS } = {}) {
  if (!c.quest || c.storyEnd === c.quest) return null;
  const x = travelNode(c.quest), T = x && x.P && x.P.pts.turnin;
  const inBand = p => !!p && p.anchor in kibs && p.m != null && p.m > R && p.m <= nudge;
  if (!inBand(T)) return null;
  let first = null;
  for (const [id] of travelGraph().story) { const P = NODE_PLACE[id];
    first = P && [P.pts.giver, P.pts.turnin].find(p => inBand(p) && p.anchor === T.anchor); if (first) break; }
  if (first !== T || boundSet(c, { R, kibs }).has(T.anchor)) return null;
  return { kib: T.anchor, name: kibs[T.anchor].name, m: T.m, key: "bind:" + T.anchor, via: x.id, npc: (QUEST_LOC[c.quest] || {}).turnin || null };
}

/* ---------- Binds that happen at an objective (0.6 P12; owner 2026-10-17, #254 note 6) ---------- */
/* The game binds a Kibelisk on its own at an objective within R of it, so the app doesn't tell the player to: a step's
   "(Kibelisk: X)" marker is dropped from what it shows when the step's point (steps[].at) is within R of X; a step that is
   only "Bind with the X Kibelisk" is hidden (done on arrival, counted done like a talk-only step) when the next step's
   point is within R of X. Derived from the data, which keeps the source's text; logic (storyHereOf, aion2Place) still
   reads the raw QUEST_STEPS. graph: the gate graph (pack.js passes it: the pack isn't set yet when it is built). →
   [{ quest, i, kib (its name), m, only }] in story-graph order; checks.mjs prints the same list for the owner. */
const BIND_ONLY = /^Bind with the (.+) Kibelisk(?: \(Kibelisk: ([^)]+)\))?$/;
export function autoBindsOf(graph, { R = TRAVEL_RULES.bindRadius, kibs = KIBELISKS } = {}) {
  const out = [];
  for (const [id, n] of Object.entries(graph.nodes)) {
    const L = n.kind === "story" && QUEST_STEPS[n.key], pts = ((NODE_PLACE[id] || {}).pts || {}).steps || []; if (!L) continue;
    const at = i => pts.find(p => p.i === i), near = (p, name) => !!p && p.anchor in kibs && kibs[p.anchor].name === name && p.m != null && p.m <= R;
    L.forEach((t, i) => { const b = t.match(BIND_ONLY), m = t.match(TRAVEL_MARK), p = at(i) || (b ? at(i + 1) : null);
      if (b && (!b[2] || b[2] === b[1]) && near(p, b[1])) out.push({ quest: n.key, i, kib: b[1], m: p.m, only: true });
      else if (!b && m && near(at(i), m[1])) out.push({ quest: n.key, i, kib: m[1], m: at(i).m, only: false }); });
  }
  return out;
}
/* What the checklists show (the pack's data.story.steps): QUEST_STEPS with those markers dropped, same indices; and the
   bind-only steps' texts (the pack's story.isTalkOnly hides them). */
export function stepsShownOf(graph, o) {
  const steps = Object.fromEntries(Object.entries(QUEST_STEPS).map(([q, L]) => [q, [...L]])), only = new Set();
  autoBindsOf(graph, o).forEach(x => { if (x.only) only.add(QUEST_STEPS[x.quest][x.i]); else steps[x.quest][x.i] = steps[x.quest][x.i].replace(/\s*\(Kibelisk: [^)]+\)/, ""); });
  return { steps, only };
}
/* Is this source text (a QUEST_STEPS line) one whose "(Kibelisk: X)" the checklists drop? For the pack's hooks that get the
   source text (the Journey card's sub-checklist place, journey-sections.js subPlace). */
export const markerDropped = t => perPack("autoBindDropped", p => new Set(autoBindsOf(p.data.graph).filter(x => !x.only).map(x => QUEST_STEPS[x.quest][x.i]))).has(t);

/* ---------- Teleport vs walk (design §8.3) ---------- */
/* The story card's target (design §3): the next open objective's point, else the turn-in. Objectives have no points
   yet, so the target is the current quest's turn-in once every objective the card shows (o.shown: their indices, the
   card's objIdxOf; default all), other than its "Turn in" step, is ticked and it isn't turned in: { zone (its
   Kibelisk's, else the quest's), pt, to (the quest's node id: what "I'll walk" hides), npc (the turn-in's NPC or null) };
   else null (an open objective: the target is unknown). Hidden talk-only steps don't count: they can't be ticked. */
const TURN_IN_STEP = /^Turn in\b/i;
export function storyTargetOf(c, { shown } = {}) {
  if (!c.quest || c.storyEnd === c.quest) return null;
  const L = QUEST_STEPS[c.quest] || [], done = (c.qsteps || {})[c.quest] || [];
  if ((shown || L.map((t, i) => i)).some(i => !TURN_IN_STEP.test(L[i]) && !done.includes(i))) return null;
  const x = travelNode(c.quest), T = x && x.P && x.P.pts.turnin; if (!T) return null;
  return { zone: (KIBELISKS[T.anchor] || {}).zone || x.P.zone, pt: T, to: x.id, npc: (QUEST_LOC[c.quest] || {}).turnin || null };
}
/* For a target { zone, pt } (pt a NODE_PLACE point) from here (whereNow): teleport when the target's Kibelisk is bound and
   either the walk is known and at least the teleport gain longer than the run from the Kibelisk, or the walk is unknown
   (another map, or no position) and here is a known zone other than the target's. o.preferRun (the view setting) and
   o.walk (the player chose to walk this card) turn it off. → { kib, name, m, walk } (walk: metres or null), else null. */
export function teleportOf(c, target, here, { preferRun = false, walk: walkThis = false, gain = TRAVEL_RULES.teleportGain, R, kibs = KIBELISKS } = {}) {
  const T = target && target.pt;
  if (preferRun || walkThis || !here || !T || !(T.anchor in kibs) || T.m == null) return null;
  const walk = placeDist(here.pt, T);
  const go = walk === null ? !!here.zone && here.zone !== (target.zone || null) : walk - T.m >= gain;
  /* the bound check last: it walks the save (the geometry is cheap) */
  return go && boundSet(c, { R, kibs }).has(T.anchor) ? { kib: T.anchor, name: kibs[T.anchor].name, m: T.m, walk } : null;
}
