/* merge(a, b) of two saves (per character slot, save v6) and the part of a save it syncs (0.2 step 5c, pure: no DOM, no
   storage, no clock); the change times it reads are src/core/sync.js's (stamp, the mt walkers). Only the sync client
   (src/core/sync-client.js) calls it, so it ships in the sync chunk (0.8 P6, src/sync-ui.js), not in the page.
   docs/DATA-FORMAT-V2.md §13 is the spec; docs/ARCHITECTURE.md §1 the save rules. */
import { isRemoved, mergeName } from "./state.js";
import { activePack } from "./pack.js";
import { mtCanon, mtSecOf, mtSetIn, mtStampsOf, mtValuesOf, syncMaps, syncRegs } from "./sync.js";

const MT_RANK = v => v === true ? 5 : typeof v === "number" ? 4 : typeof v === "string" ? 3 : v && typeof v === "object" ? 2 : v === false ? 1 : 0;
/* Order of two stamps: later time wins; a tie breaks on the value (true > number > string > list/object > false > null),
   then on the value itself, so every pair has one winner and merge() is commutative, associative and idempotent. */
export const cmpStamp = ([ta, va], [tb, vb]) => {
  if (ta !== tb) return ta < tb ? -1 : 1;
  const ra = MT_RANK(va), rb = MT_RANK(vb); if (ra !== rb) return ra < rb ? -1 : 1;
  if (ra === 4) return va === vb ? 0 : va < vb ? -1 : 1;
  const ca = mtCanon(va), cb = mtCanon(vb); return ca === cb ? 0 : ca < cb ? -1 : 1;
};

/* The story position register (mt.quest = [t, [quest, storyEnd]]): on a time tie, the position further along the story
   wins (storyRank: the untouched first quest lowest, then unset or unknown, then later quests; "turned in" over not),
   and only then cmpStamp's value order. Two time-0 stamps (saves from before change times, or a fresh browser's
   default first quest) mean "unknown when", and further progress is the safe pick: a fresh browser's default never
   resets or clears another device's story position. The ranking reads this build's story order (fine before sync
   ships; sync must merge with the same data). */
/* Rank of a story position on a time tie: removed (tombstone) -3 < the first quest not turned in -2 (a fresh browser's
   default, which says nothing about progress) < unset or unknown -1 < any later quest (its index). */
const storyPosOf = q => { const i = typeof q === "string" && q ? activePack().data.story.quests.findIndex(([, n]) => n === q) : -1; return i; };
const storyRank = p => { const i = storyPosOf(p[0]); return i === 0 && p[1] == null ? -2 : i; };
const QUEST_KEY = JSON.stringify(["quest"]);
const cmpQuestStamp = (a, b) => {
  if (a[0] !== b[0]) return cmpStamp(a, b);
  const pa = Array.isArray(a[1]) ? a[1] : [null, null], pb = Array.isArray(b[1]) ? b[1] : [null, null];
  const ia = a[1] === null ? -3 : storyRank(pa), ib = b[1] === null ? -3 : storyRank(pb);
  if (ia !== ib) return ia < ib ? -1 : 1;
  const ea = pa[1] != null ? 1 : 0, eb = pb[1] != null ? 1 : 0;
  if (ea !== eb) return ea < eb ? -1 : 1;
  return cmpStamp(a, b);
};
export const cmpItem = (key, a, b) => key === QUEST_KEY ? cmpQuestStamp(a, b) : cmpStamp(a, b);

/* The character's timed items for merging: Map "path" → [path, [t, value]]; a value with no matching stamp counts as
   time 0 (never stamped), or its stamp's time if it changed since without a new stamp. */
function mtItemsOf(c) {
  const vals = mtValuesOf(c), st = mtStampsOf(c.mt), out = new Map();
  st.forEach(([p, s0], key) => { const cur = vals.has(key) ? vals.get(key)[1] : null; out.set(key, [p, [s0[0], cur]]); });
  vals.forEach(([p, v], key) => { if (!out.has(key)) out.set(key, [p, [0, v]]); });
  return out;
}

/* merge(local, remote): the local save with the remote one's progress folded in, per character slot (by slot id): a
   slot on one side only is kept (merged with itself: the same values, unstamped ones filled in at time 0, so merge()
   stays idempotent); a slot on both sides merges per item (mergeChar). v and savedAt: the larger.
   A removed character (0.6 P20, docs/design/sync.md §2 "Removed characters") is a tombstone { id, deletedAt } (ms): the
   newest removal of the slot on either side (a tombstone, or a character's removedAt) cuts every item changed at or
   before it (in seconds), so a copy from before the removal never brings it back. Items changed after the removal (an
   edit on a device that hadn't seen it) survive: the character comes back with those, and keeps removedAt so a later
   merge with an older copy cuts that copy too. A slot left with no item stays the tombstone. If no character is left
   at all (each side removed the other's), the result has none: loadState() then adds a new one (src/core/state.js).
   current, the view settings, backup and unknown top-level fields stay the local save's (current moves to the first
   remaining character if the merge removed it): the synced part (syncedPart) is commutative, associative and
   idempotent. Neither input is changed, and the result shares no objects with them. */
const clone = x => JSON.parse(JSON.stringify(x));
const charsOf = s => (s && s.chars && typeof s.chars === "object" ? s.chars : {});
const num = x => typeof x === "number" && Number.isFinite(x) && x > 0 ? x : 0;
export function merge(a, b) {
  const out = clone(a), ac = charsOf(a), bc = charsOf(b);
  ["v", "savedAt"].forEach(f => { const v = Math.max(num(a[f]), num(b[f])); if (v || f in a || f in b) out[f] = v; });
  out.chars = {};
  [...new Set([...Object.keys(ac), ...Object.keys(bc)])].forEach(id => {
    const sides = [ac[id], bc[id]].filter(c => c && typeof c === "object"), copies = sides.filter(c => !isRemoved(c));
    const cut = sides.some(c => isRemoved(c) || "removedAt" in c) ? Math.max(...sides.map(c => num(isRemoved(c) ? c.deletedAt : c.removedAt))) : null;
    const co = copies.length ? mergeChar(copies[0], copies[1] || copies[0], cut) : null;
    out.chars[id] = co || { id, deletedAt: cut };
  });
  if (!out.chars[out.current] || isRemoved(out.chars[out.current])) {
    const first = Object.keys(out.chars).find(id => !isRemoved(out.chars[id])); if (first) out.current = first;
  }
  return out;
}
/* Two copies of one character: per item, the later change wins (an un-tick dated after a tick survives), and the later
   rename (mt.name). The rest of the identity (id, pack, class, created) and the pack's "local" fields stay the local copy's. cut (ms, or null = none): the
   slot's newest removal; items changed at or before it are left out, and the result is null if none is left. */
function mergeChar(ca, cb, cut) {
  const co = clone(ca);
  const ia = mtItemsOf(ca), ib = mtItemsOf(cb), win = new Map(ia);
  ib.forEach((x, key) => { const y = win.get(key); if (!y || cmpItem(key, y[1], x[1]) < 0) win.set(key, x); });
  delete co.removedAt;
  if (cut !== null) {
    const s = mtSecOf(cut); win.forEach((x, key) => { if (x[1][0] <= s) win.delete(key); });
    if (!win.size) return null;
    co.removedAt = cut;
  }
  /* rebuild every timed field from the winners; containers that either side had stay (possibly empty). After a removal
     (cut) only the winners make containers (and checks, the one every character has): an empty container of a copy from
     before the removal says nothing, and keeping it would make the result depend on the order of merges. */
  const has = f => cut !== null ? f === "checks" : (ca[f] && typeof ca[f] === "object") || (cb[f] && typeof cb[f] === "object");
  syncMaps().forEach(f => { if (has(f)) co[f] = {}; else delete co[f]; });
  ["qsteps", "qsub"].forEach(f => {
    if (!has(f)) { delete co[f]; return; }
    co[f] = {};
    [ca[f], cb[f]].forEach(o => Object.entries(o || {}).forEach(([q, v]) => { if (!(q in co[f])) co[f][q] = f === "qsteps" ? [] : {}; if (f === "qsub") Object.keys(v || {}).forEach(i => { co[f][q][i] = co[f][q][i] || []; }); }));
  });
  syncRegs().forEach(f => { delete co[f]; });
  delete co.quest; delete co.storyEnd;
  const mt = {};
  [...win.keys()].sort().forEach(key => {
    /* a copy: the result shares no objects with the inputs (a register's value can be a list or an object) */
    const [p, s1] = win.get(key), s0 = JSON.parse(JSON.stringify(s1)), v = s0[1], f = p[0];
    mtSetIn(mt, p, s0);
    if (v === null) return;
    if (syncMaps().includes(f)) { co[f] = co[f] || {}; co[f][p[1]] = v; }
    else if (f === "qsteps") { co.qsteps = co.qsteps || {}; (co.qsteps[p[1]] = co.qsteps[p[1]] || []).push(+p[2]); }
    else if (f === "qsub") { co.qsub = co.qsub || {}; const q = co.qsub[p[1]] = co.qsub[p[1]] || {}; (q[p[2]] = q[p[2]] || []).push(+p[3]); }
    else if (f === "quest") { co.quest = v[0]; if (v[1] != null) co.storyEnd = v[1]; }
    else co[f] = v;
  });
  Object.values(co.qsteps || {}).forEach(a => a.sort((x, y) => x - y));
  Object.values(co.qsub || {}).forEach(o => Object.values(o).forEach(a => a.sort((x, y) => x - y)));
  co.mt = mt;
  /* the later rename wins, so both devices end with the same name and the same payload */
  mergeName(co, ca, cb, cmpStamp);
  /* the load-time steps run (migs, 0.9 P9): the union, so a step that ran on either copy never runs again */
  const migs = migsOf(ca, cb);
  if (migs) co.migs = migs; else delete co.migs;
  return co;
}
/* The union of two copies' migs flags ({ <flag>: 1 }, keys sorted), or null when neither has one. */
const migsOf = (...cs) => {
  const keys = [...new Set(cs.flatMap(c => c.migs && typeof c.migs === "object" && !Array.isArray(c.migs) ? Object.keys(c.migs).filter(k => c.migs[k]) : []))].sort();
  return keys.length ? Object.fromEntries(keys.map(k => [k, 1])) : null;
};
/* The part of a save that merge() syncs (for tests and, later, the sync layer): per slot, the character's progress, mt,
   migs and removedAt, or the tombstone; v and savedAt. */
export function syncedPart(save) {
  const out = { chars: {} };
  Object.entries(charsOf(save)).forEach(([id, c]) => { const o = out.chars[id] = {};
    if (isRemoved(c)) { o.deletedAt = c.deletedAt; return; }
    [...syncMaps(), ...syncRegs(), "qsteps", "qsub", "quest", "storyEnd", "mt", "migs", "removedAt"].forEach(f => { if (c[f] !== undefined) o[f] = c[f]; }); });
  ["v", "savedAt"].forEach(f => { if (save[f] !== undefined) out[f] = save[f]; });
  return out;
}
