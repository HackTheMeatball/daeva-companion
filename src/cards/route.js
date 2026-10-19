/* Route rules (0.4 P4c: moved verbatim from src/main.js; markup route.html): the STEPS cards, drawn with the milestone
   cards' cardHTML (rows of a kind the pack lists by its row renderers, 0.4 P5b), and their counts. */
import { char } from "../core/state.js";
import { gatesOf, levelMetOf } from "../core/requirements.js";
import { cardHTML } from "./milestones.js";
import { pageState as state, pageUpdate as update, pageSTEPS as STEPS, pageCounts as counts } from "./page.js";

/* A step whose gate has a level atom (its requires.level) is left out until the character reaches it, as the evaluator
   decides (levelMetOf); the other kinds of requires on these steps are not read here. */
const shown = () => { const c = char(state), ev = gatesOf(c);
  return STEPS.map(s => ({ ...s, items: s.items.filter((it, j) => levelMetOf(c, it.k || s.id + ":" + j, ev)) })); };
let drawn = "";
const sig = list => list.map(s => s.items.length).join();

/* the cards: render() draws them on every call, after the milestone cards */
function renderRoute() {
  const stepsEl = document.getElementById("steps"), list = shown();
  stepsEl.innerHTML = list.map((s, i) => cardHTML(s, i + 1, "")).join("");
  drawn = sig(list);
}
function updateRoute() {
  const list = shown();
  if (sig(list) !== drawn) { /* the level moved a step in or out: redraw, keeping which cards are open */
    const open = Object.fromEntries(STEPS.map(s => [s.id, document.getElementById(s.id)?.open]));
    renderRoute();
    STEPS.forEach(s => { if (open[s.id] !== undefined) document.getElementById(s.id).open = open[s.id]; });
  }
  let total = 0, done = 0; /* kept from update(), where they summed the milestones too (unused) */
  list.forEach(s => {
    const d = document.getElementById(s.id), [c, n] = counts(s);
    total += n; done += c;
    d.querySelector(".count").textContent = `${c}/${n}`;
    d.querySelector(".bar span").style.width = (n ? c / n * 100 : 100) + "%";
    d.classList.toggle("done", c === n);
    if (state.open[s.id] !== undefined) d.open = state.open[s.id];
  });
}

const routeRulesCard = { id: "route", slot: "foot", order: 100, root: "routeCard", mount: null, update: () => updateRoute() };
export { renderRoute, routeRulesCard };
