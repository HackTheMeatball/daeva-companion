/* The characters of a save (0.5 P17, pure: no DOM, no storage, no clock): add, switch, rename, remove a slot of save v5
   (src/core/state.js). Each function takes a save and returns a new one; the input is never written, and every slot the
   call doesn't change is the same object as before. The slot id comes from the caller (the page's newId) and is never
   derived from the name, class or level; the name stays in the character, never in a key, a file name, a URL or a log. */
import { isRemoved, newChar } from "./state.js";
import { lastChangeOf } from "./sync.js";

/* A name: control characters and runs of white space become one space, trimmed, at most NAME_MAX characters (code points,
   so a cut never splits one). Anything that isn't a string gives "". */
export const NAME_MAX = 24;
export const cleanName = name => typeof name === "string"
  ? [...name.replace(/[\s\p{Cc}]+/gu, " ").trim()].slice(0, NAME_MAX).join("").trim() : "";

/* a removed character's tombstone (src/core/state.js isRemoved) is no slot to switch to, rename or remove; its id stays taken */
const slotOf = (state, id) => {
  if (typeof id !== "string" || !Object.prototype.hasOwnProperty.call(state.chars, id) || isRemoved(state.chars[id])) throw new Error("chars: no such slot");
  return state.chars[id];
};

/* A new character of a playable class (packClasses; none = the pack's `character`) in a new slot, which becomes current. */
export function addChar(state, { class: cls, name, now = 0, id } = {}) {
  if (typeof id === "string" && Object.prototype.hasOwnProperty.call(state.chars, id)) throw new Error("chars: the slot id is taken");
  const c = { ...newChar({ now, id, class: cls }), name: cleanName(name) };
  return { ...state, current: id, chars: { ...state.chars, [id]: c } };
}

/* Make slot id the current character. */
export function switchChar(state, id) {
  slotOf(state, id);
  return { ...state, current: id };
}

/* Give slot id a new name (cleanName; "" clears it). Only that slot changes. */
export function renameChar(state, id, name) {
  const c = slotOf(state, id);
  return { ...state, chars: { ...state.chars, [id]: { ...c, name: cleanName(name) } } };
}

/* Remove slot id; the last character is never removed. If it was current, the first remaining character (save order) is.
   The slot keeps a tombstone { id, deletedAt } (0.6 P20), so merge() doesn't bring the character back from another save
   that still has it. deletedAt (ms) is now, or the character's last change if that is later (a clock set back), so the
   removal is never older than what it removed (docs/design/sync.md §2 "Removed characters"). */
export function removeChar(state, id, now = 0) {
  const c = slotOf(state, id);
  const rest = Object.keys(state.chars).filter(k => k !== id && !isRemoved(state.chars[k]));
  if (!rest.length) throw new Error("chars: the last character can't be removed");
  const t = typeof now === "number" && Number.isFinite(now) && now > 0 ? now : 0;
  const chars = { ...state.chars, [id]: { id, deletedAt: Math.max(t, lastChangeOf(c) * 1000) } };
  return { ...state, current: state.current === id ? rest[0] : state.current, chars };
}
