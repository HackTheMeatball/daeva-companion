/* Sync groundwork (0.2 step 5c, pure: no DOM, no storage, no clock): per-item change times in the save, and the last
   confirmed location derived from them. merge(a, b) of two saves is src/core/merge.js (0.8 P6: only the sync client
   uses it, so it ships in the sync chunk); the walkers it shares with stamp() are exported for it.
   docs/DATA-FORMAT-V2.md §13 is the spec; docs/ARCHITECTURE.md §1 the save rules.

   mt (in the character, next to the fields it times) mirrors the character's fields: a stamp is [seconds, value].
     mt.checks{k}, mt.started{k}, and each of the pack's "map" fields: per key
     mt.qsteps{quest}{i}, mt.qsub{quest}{i}{j}: per objective (value true; null once removed)
     mt.level and each of the pack's "register" fields: registers; mt.quest = [t, [quest, storyEnd]] (one register for both)
   null is a tombstone (the entry was removed). A stamp's time is when this device saw the value change; 0 = unknown
   (a fresh browser's defaults). A v6 save is born with mt (src/core/migrations.js) and every write stamps it. */
import { char } from "./state.js";
import { activePack, perPack } from "./pack.js";

/* Character fields with change times, by shape: the engine's and the pack's (charFields: "map" / "register"; its
   "local" fields are not timed: local state such as an undo, or retired fields). buildId / customBuild don't exist yet
   (0.3, §8.4); they are timed once they do. The character's identity (id, pack, class, created) never changes; name has
   its own stamp (mt.name, src/core/state.js withName / mergeName). */
const packFieldsOf = shape => p => Object.keys(p.charFields).filter(f => p.charFields[f] === shape);
export const syncMaps = () => perPack("syncMaps", p => ["checks", "started", ...packFieldsOf("map")(p)]);
export const syncRegs = () => perPack("syncRegs", p => ["level", ...packFieldsOf("register")(p), "buildId", "customBuild"]);

/* canonical JSON (object keys sorted), for comparing values */
export const mtCanon = v => JSON.stringify(v, (k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(y => [y, x[y]])) : x);
const mtSame = (x, y) => mtCanon(x) === mtCanon(y);
/* The character's timed values, flat: Map "path" → [path, value]; absent and null are the same (not listed). */
export function mtValuesOf(c) {
  const out = new Map(), put = (p, v) => { if (v != null) out.set(JSON.stringify(p), [p, v]); };
  syncMaps().forEach(f => Object.entries(c[f] || {}).forEach(([k, v]) => put([f, k], v)));
  Object.entries(c.qsteps || {}).forEach(([q, a]) => (Array.isArray(a) ? a : []).forEach(i => put(["qsteps", q, String(i)], true)));
  Object.entries(c.qsub || {}).forEach(([q, o]) => Object.entries(o || {}).forEach(([i, a]) => (Array.isArray(a) ? a : []).forEach(j => put(["qsub", q, i, String(j)], true))));
  syncRegs().forEach(f => put([f], c[f]));
  if (c.quest != null || c.storyEnd != null) put(["quest"], [c.quest ?? null, c.storyEnd ?? null]);
  return out;
}
/* The stamps in mt, flat: Map "path" → [path, [t, value]]. Malformed entries are skipped. */
const mtDepth = () => perPack("mtDepth", () => ({ ...Object.fromEntries(syncMaps().map(f => [f, 1])), qsteps: 2, qsub: 3 }));
const isMtStamp = x => Array.isArray(x) && x.length === 2 && typeof x[0] === "number" && Number.isFinite(x[0]) && x[0] >= 0;
export function mtStampsOf(mt) {
  const out = new Map();
  const walk = (o, p, d) => { if (!o || typeof o !== "object" || Array.isArray(o)) return;
    Object.entries(o).forEach(([k, v]) => { if (d > 1) walk(v, [...p, k], d - 1); else if (isMtStamp(v)) out.set(JSON.stringify([...p, k]), [[...p, k], v]); }); };
  const D = mtDepth();
  Object.entries(mt || {}).forEach(([f, v]) => { if (D[f]) walk(v, [f], D[f]); else if ((syncRegs().includes(f) || f === "quest") && isMtStamp(v)) out.set(JSON.stringify([f]), [[f], v]); });
  return out;
}
export const mtSetIn = (o, p, v) => { let x = o; p.slice(0, -1).forEach(k => { if (!x[k] || typeof x[k] !== "object" || Array.isArray(x[k])) x[k] = {}; x = x[k]; }); x[p[p.length - 1]] = v; };

/* A new stamp is strictly later than the one it replaces (per-item Lamport bump), so an edit on a device whose clock
   went back or runs behind still beats the value it changed. Time-0 stamps (unknown) stay 0. */
const mtNext = (prev, t) => t > 0 && typeof prev === "number" ? Math.max(t, prev + 1) : t;
/* Seconds from a stored ms time; anything that isn't a positive finite number (a broken import) gives 0. */
export const mtSecOf = ms => typeof ms === "number" && Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : 0;

/* Stamp every timed value of the character that differs from its stamp (or has none) with time t; a value that is gone
   gets a tombstone. Returns the number of stamps written. Used (1) by every save, so each change carries the time it
   was saved, (2) once by the fresh start with t = 0, so a new character's defaults never outrank a dated change. */
export function stamp(c, t) {
  const vals = mtValuesOf(c), st = mtStampsOf(c.mt);
  let n = 0;
  const mt = c.mt && typeof c.mt === "object" && !Array.isArray(c.mt) ? c.mt : (c.mt = {});
  vals.forEach(([p, v], key) => { const s0 = st.get(key); if (!s0 || !mtSame(s0[1][1], v)) { mtSetIn(mt, p, [mtNext(s0 && s0[1][0], t), v]); n++; } });
  st.forEach(([p, s0], key) => { if (!vals.has(key) && s0[1] !== null) { mtSetIn(mt, p, [mtNext(s0[0], t), null]); n++; } });
  return n;
}
/* What storeState() runs before each write (the page passes Date.now()). savedAt (ms) is the time of the last saved
   progress change: writes that change only view settings (the page writes folds and filters at start-up too) leave it,
   so a reload stores the same text. Only the current character changes between writes, so only it is stamped. */
export function stampSave(save, nowMs) {
  if (stamp(char(save), mtSecOf(nowMs))) save.savedAt = nowMs;
}

/* The character's last change (seconds): its newest stamp's time; 0 = none dated. */
export const lastChangeOf = c => { let t = 0; mtStampsOf(c && c.mt).forEach(([, [s]]) => { if (s > t) t = s; }); return t; };

/* ---------- Last confirmed location (F15, §9): derived, never stored ---------- */
/* The zone of a ticked item is the pack's (hook locate: save key → zone, or null = not located); keys the pack skips
   (hook skipLocation: steps with no map location) never move the last location. */
/* The newest dated tick (time > 0, value true) of a located, not skipped item: { key, t, zone }, or null (no change
   times yet: Next up keeps today's order). Ties on time break on the key, so every device derives the same answer. */
export function lastConfirmedLocation(c, locate = activePack().locate) {
  const skip = activePack().skipLocation;
  let best = null;
  mtStampsOf(c.mt).forEach(([p, [t, v]]) => {
    if (p[0] !== "checks" || v !== true || !(t > 0)) return;
    const k = p[1]; if (skip(k)) return;
    const zone = locate(k); if (!zone) return;
    if (!best || t > best.t || (t === best.t && k > best.key)) best = { key: k, t, zone };
  });
  return best;
}
