/* Load-time steps (0.2 P3, pure: no DOM, no storage), in load order (docs/ARCHITECTURE.md §1). Save v6 (0.9 P2) is a
   clean break, so no step reads an old shape: what is left is the fresh start, the pack's load hook (onLoad), the
   story-end move-on (data growth) and the flagged steps (MIG_STEPS, none yet). store() is the page's storeState(), called
   where a step changed saved progress. */
import { activePack } from "./pack.js";
import { char, liveChars } from "./state.js";
import { stamp } from "./sync.js";

/* The flagged steps (0.9 P9, the rules from 1.0 on): each { flag, run(c) } runs once per character, then sets
   c.migs[flag] = 1 so it never runs again for that character, on this device or (merge() keeps the union of migs) on
   another. A step only adds (it copies or ticks, never removes or renames), is idempotent, and keeps the old data, so an
   older build can still read the save. None yet. */
export const MIG_STEPS = [];

/* Run each step not yet flagged on every character of the save (tombstones skipped). Returns the number of steps run. */
export function runSteps(s, steps = MIG_STEPS) {
  let n = 0;
  liveChars(s).forEach(c => steps.forEach(({ flag, run }) => {
    const m = c.migs && typeof c.migs === "object" && !Array.isArray(c.migs) ? c.migs : null;
    if (m && m[flag]) return;
    run(c);
    c.migs = { ...m, [flag]: 1 };
    n++;
  }));
  return n;
}

export function migrate(s, hadSave, store, now = 0, steps = MIG_STEPS) {
  const c = char(s), p = activePack(), quests = p.data.story.quests;
  /* A fresh browser starts where a new character does (owner, 2026-10-15): Lv 1, on the first story quest; cleared
     milestones start folded (Filters → Cleared milestones). Its values are stamped at time 0 (unknown), so the default
     first quest never outranks another device's progress in merge(); backup.since (ms; now is in seconds) is the
     baseline of the export nudge (src/core/backup.js). Only here, not in loadState: a save is never re-defaulted. */
  if (!hadSave) {
    c.level = 1; if (quests.length) c.quest = quests[0][1];
    s.hideCards = true; s.backup = { since: now * 1000 };
    if (!c.created) c.created = now * 1000;
    stamp(c, 0);
  }
  /* The pack's own load step (in memory; it never writes storage). */
  p.onLoad(s, c, { fresh: !hadSave });
  /* "Turned in" on the last covered quest is remembered (storyEnd); once later quests are added, move on to the next. */
  if (c.storyEnd && c.storyEnd === c.quest) { const i = quests.findIndex(([, n]) => n === c.quest); if (i >= 0 && i < quests.length - 1) { c.quest = quests[i + 1][1]; delete c.storyEnd; store(); } }
  /* The flagged steps, last; the save is written only when one ran on a loaded save (a fresh start writes on its first change). */
  if (runSteps(s, steps) && hadSave) store();
}
