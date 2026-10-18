/* The first-run welcome (0.6 P17; drawn in docs/design/0.6-onboarding-mockup.md §1.1, W1 / W2, owner-ok-S1): one card
   above Next up on a fresh browser. It says what the guide is, how ticking and Level up work, and that it is unofficial,
   with two buttons: Start at Lv 1, and I'm already Lv …, which swaps in the join step (a level slider, the story quest
   the player is on, pre-filled with the first story quest at that level, and what the button will do). Either way the
   welcome is gone for good on this browser. Markup in src/cards/welcome.html, put above the page's columns by the
   build's @card line.

   The card changes no save itself: Start at Lv 1 calls the shell's onStart(), Start at Lv N onJoin(level, quest); the
   shell writes `welcomed` (a top-level per-device field, never synced) and, for a join, the character's level (through
   Journey's level setter) and quest. A new character (0.5 P18) gets the join step straight away (welcomed 0, set by the
   shell), its Back being "Skip: start at Lv 1" (never the same label as the green Start at Lv N). */
import { char } from "../core/state.js";
import { pageQUESTS as QUESTS } from "./page.js";

const welEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

/* the card spec; the shell hands over what the buttons do */
export function welcomeCard({ onStart, onJoin }) {
  let el = null, intro = null, form = null;
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
      $("welQuest").innerHTML = QUESTS.map(([l, n]) => `<option value="${welEsc(n)}">Lv ${l} · ${welEsc(n)}</option>`).join("");
      /* a new character (welcomed 0) opens on the join step, whose second button then skips to Lv 1 */
      const newChar = ctx.state.welcomed === 0;
      $("welBack").textContent = newChar ? "Skip: start at Lv 1" : "Back";
      showStep(newChar, false);
      el.hidden = false;
      $("welStart").addEventListener("click", () => { onStart(); close(); });
      $("welJoin").addEventListener("click", () => showStep(true, true));
      $("welBack").addEventListener("click", () => { if (newChar) { onStart(); close(); } else showStep(false, true); });
      $("welLv").addEventListener("input", drawLevel);
      form.addEventListener("submit", e => { e.preventDefault(); onJoin(lvOf(), $("welQuest").value); close(); });
    },
  };
}
