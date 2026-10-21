/* The first-run welcome (0.6 P17; drawn in docs/design/0.6-onboarding-mockup.md §1.1, W1 / W2, owner-ok-S1): one card
   above Next up on a fresh browser. It says what the guide is, how ticking and Level up work, and that it is unofficial,
   with two buttons: Start at Lv 1, and I'm already Lv …, which swaps in the join step (a level slider, the story quest
   the player is on, pre-filled with the first story quest at that level, and what the button will do). Either way the
   welcome is gone for good on this browser. Markup in src/cards/welcome.html, put above the page's columns by the
   build's @card line.

   The card changes no save itself: Start at Lv 1 calls the shell's onStart(), Start at Lv N onJoin(level, quest); the
   shell writes `welcomed` (a top-level per-device field, never synced) and, for a join, the character's level (through
   Journey's level setter) and quest. A new character (0.5 P18) gets the join step straight away (welcomed 0, set by the
   shell), its Back being "Skip, start fresh" (never the same label as the green Start at Lv N).

   Your class (0.8 P12, design-v2 §3 option A, owner A 2026-10-19): on the first step, a radiogroup of the game's classes
   (classChoices, from the pack), each its emblem (the pack's icon) and name, the current character's class picked. A class
   with no guide yet says "Soon" and can't be picked; arrow keys skip it. The pick goes to onStart(cls) and
   onJoin(level, quest, cls); each new pick also goes to onPick(cls) at once (0.8.1 F4: the page header follows it). */
import { char } from "../core/state.js";
import { classChoices } from "../core/pack.js";
import { questNameOf } from "../core/blockers.js";
import { pageQUESTS as QUESTS } from "./page.js";

const welEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* one badge: a radio (roving tabindex: only the picked one is a tab stop), or a "Soon" one that can't be picked; a class
   without an icon shows its name alone */
const classBadge = (e, on) => {
  const img = e.icon ? `<img src="${welEsc(e.icon)}" alt="" width="32" height="32">` : "";
  return e.pack
    ? `<button type="button" class="welclass" role="radio" data-class="${welEsc(e.class)}" aria-checked="${on}" tabindex="${on ? 0 : -1}">${img}<span>${welEsc(e.name)}</span></button>`
    : `<button type="button" class="welclass welsoon" role="radio" data-class="${welEsc(e.class)}" aria-checked="false" aria-disabled="true" tabindex="-1">${img}<span>${welEsc(e.name)}</span><small>Soon</small></button>`;
};

/* Whether the welcome shows (S1 §1.1, Q2): never once welcomed (1) on this browser; else only for a character at Lv 1
   with nothing ticked, so an existing player without the field (a save from before 0.6) never gets the card. */
export function showWelcome(state) {
  if (state.welcomed === 1) return false;
  const c = char(state);
  return (+c.level || 1) === 1 && !Object.values(c.checks || {}).some(Boolean);
}
/* the story quest the join step pre-fills for a level: the first one at that level or above, else the story's last */
export function joinQuestOf(lv) {
  const q = QUESTS.find(([l]) => l >= lv) || QUESTS[QUESTS.length - 1];
  return q ? q[1] : "";
}
/* the quest select's options, "Lv N · name", the value its key (the join step's, and Journey's "which story quest are you on?", 0.9 P7) */
export const questOptionsHTML = () => QUESTS.map(([l, n]) => `<option value="${welEsc(n)}">Lv ${l} · ${welEsc(questNameOf(n))}</option>`).join("");

/* the card spec; the shell hands over what the buttons do */
export function welcomeCard({ onStart, onJoin, onPick }) {
  let el = null, intro = null, form = null, cls;
  const $ = id => el.querySelector("#" + id);
  const lvOf = () => Math.max(1, Math.min(45, parseInt($("welLv").value, 10) || 1));
  /* the slider's level in the output, the list and the button; the quest pick follows the level (a pick made after the
     last move of the slider stays) */
  const drawLevel = () => {
    const lv = lvOf();
    $("welLvOut").textContent = `Lv ${lv}`;
    $("welWillLv").textContent = `Level set to ${lv}`;
    $("welGo").textContent = `Start at Lv ${lv}`;
    $("welQuest").value = joinQuestOf(lv);
  };
  /* which step shows: the intro, or the join form (fresh: the slider back at Lv 1) */
  const showStep = (join, focus) => {
    intro.hidden = join; form.hidden = !join;
    if (join) { $("welLv").value = "1"; drawLevel(); }
    if (focus) (join ? $("welLv") : $("welJoin")).focus();
  };
  /* the class pick: the badge's highlight only (aria-checked), and the one tab stop */
  const pick = (b, focus) => {
    if (cls !== b.dataset.class && onPick) onPick(b.dataset.class);
    cls = b.dataset.class;
    for (const x of $("welClasses").querySelectorAll(".welclass:not(.welsoon)")) { const on = x === b; x.setAttribute("aria-checked", String(on)); x.tabIndex = on ? 0 : -1; }
    if (focus) b.focus();
  };
  /* arrow keys move through the pickable badges (wrapping), Home / End to the first / last; "Soon" ones are skipped */
  const classKey = e => {
    const all = [...$("welClasses").querySelectorAll(".welclass:not(.welsoon)")], i = all.indexOf(e.target);
    if (i < 0) return;
    const n = all.length, j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    pick(all[(j + n) % n], true);
  };
  /* the card goes; focus lands on Next up's first button (the player's next move) */
  const close = () => {
    el.hidden = true;
    const b = document.querySelector("#nowStar button");
    if (b) b.focus();
  };
  return {
    id: "welcome", slot: "main", order: 40, root: "welcomeCard",
    mount(root, ctx) {
      el = root; intro = $("welIntro"); form = $("welForm");
      if (!showWelcome(ctx.state)) { el.hidden = true; return; }
      $("welQuest").innerHTML = questOptionsHTML();
      const choices = classChoices(ctx.pack);
      cls = (choices.find(e => e.pack && e.class === ctx.c.class) || choices.find(e => e.pack) || {}).class;
      $("welClasses").innerHTML = choices.map(e => classBadge(e, e.class === cls)).join("");
      $("welClasses").addEventListener("click", e => { const b = e.target.closest(".welclass"); if (b && !b.classList.contains("welsoon")) pick(b, false); });
      $("welClasses").addEventListener("keydown", classKey);
      /* a new character (welcomed 0) opens on the join step, whose second button then skips to Lv 1 */
      const newChar = ctx.state.welcomed === 0;
      $("welBack").textContent = newChar ? "Skip, start fresh" : "Back";
      showStep(newChar, false);
      el.hidden = false;
      $("welStart").addEventListener("click", () => { onStart(cls); close(); });
      $("welJoin").addEventListener("click", () => showStep(true, true));
      /* a new character's class was picked in its own form: no class goes with its buttons */
      $("welBack").addEventListener("click", () => { if (newChar) { onStart(); close(); } else showStep(false, true); });
      $("welLv").addEventListener("input", drawLevel);
      form.addEventListener("submit", e => { e.preventDefault(); onJoin(lvOf(), $("welQuest").value, newChar ? undefined : cls); close(); });
    },
  };
}
