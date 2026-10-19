/* Helpers only the AION 2 cards use (0.4 P4b: out of src/main.js): the "how to get more" popovers of the Skills and
   Daevanion cards and the Stigmas card's shard tip; the skill / stigma icons and the board node's short name (0.4 P8: out
   of src/main.js too; the shell hands them to the engine cards by these names, src/cards/page.js). tipSeq numbers every "i" popover on the page (aria-controls ids),
   these and the shell's milestone tips (aion2TipId), so the ids stay one sequence. */
import { char } from "../../../core/state.js";
import { RQ } from "../data/generated.js";
import { AREA_ITEMS } from "../catalog.js";
import { areaOpen } from "../requirements.js";
import { SP_ICONS, STIGMA_ICON } from "../data/build.js";
import { aion2State as state, aion2RqAvail as rqAvail } from "./page.js";

/* A board node's short name (Next up, Undo, the Daevanion card). */
const dvShort = t => t.replace("Cooldown Reduction or Combat Speed corner", "1 corner: CDR or Speed").replace("Critical Damage Boost corner", "Crit Damage corner").replace("Multi-Hit Chance corner", "Multi-Hit corner");
/* Small icon before a skill name; an empty slot of the same size when there's no art yet, so names line up. */
/* No art for a skill/stigma: a small initials square (same look for both). */
const ini = n => n.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join("").slice(0, 2) || n.slice(0, 2);
const spMini = n => SP_ICONS[n] ? `<img class="spmini" src="${SP_ICONS[n]}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">` : `<span class="spmini ini" aria-hidden="true">${ini(n)}</span>`;
const stIco = (name, cls) => STIGMA_ICON[name] ? `<img class="${cls}" src="${STIGMA_ICON[name]}" alt="">` : cls === "st-mini" ? `<span class="st-mini ini" aria-hidden="true">${ini(name)}</span>` : "";
/* The game's map markers (0.6.2 P21, DECISIONS owner-ok-0.6.2-map-icons, docs/design/0.6.2-map-icons-mockup.md; sources in
   docs/ISSUES.md): shown where the page names that kind of place, never on rows already in a list of it. cls "mk-map" =
   inline (1.25 em before the word), "mk-map hd" = a heading's 18 px marker, "mk-tile" = a Next up tile's icon. A label
   (alt) doubles as the tooltip. A file that can't load leaves its label as text, or nothing. */
const MAP_MK = { sealed: "assets/icons/map-sealed.png", stronghold: "assets/icons/map-stronghold.png", kibelisk: "assets/icons/map-kibelisk.png", trace: "assets/icons/map-trace.png" };
const mapMk = (k, cls = "mk-map", label = "") => `<img class="${cls}" src="${MAP_MK[k]}" alt="${label}"${label ? ` title="${label}"` : ""} onerror="this.replaceWith('${label}')">`;
/* The first "Kibelisk" in a card's html (text only, never inside a tag) gets its crest, kept on one line with the word. */
const kibMark = html => { let hit = false;
  return html.split(/(<[^>]*>)/).map((p, i) => i % 2 || hit ? p : p.replace(/\bKibelisk\b/, m => { hit = true; return `<span class="mk-nw">${mapMk("kibelisk")}${m}</span>`; })).join(""); };

let tipSeq = 0; /* ids for the "i" popovers (aria-controls) */
/* the next popover id number (the shell's milestone tips) */
const aion2TipId = () => ++tipSeq;
/* "i" next to a "need more" status: where more Wisdom Stones / Daevanion Crystals come from, plus what's open now.
   Regional quest: 1 stone + 1 crystal; Sealed Dungeon first clear: 2 + 2; levels: +4 crystals each. Items count once used from the Cube. */
function tipPop(kind) {
  const lv = char(state).level;
  let rq = 0; RQ.forEach(q => { if (!char(state).checks["rq:" + q.id] && rqAvail(q, lv).ok) rq++; });
  const sd = AREA_ITEMS.filter(x => x.it.kind === "hideout" && areaOpen(char(state), x) && !char(state).checks[x.k]).length, gain = rq + 2 * sd;
  const open = gain ? `<button type="button" class="tiplink" data-tipgo="${rq ? "quest" : "sd"}">${rq ? `${rq} quest${rq === 1 ? "" : "s"}` : ""}${rq && sd ? " + " : ""}${sd ? `${sd} dungeon${sd === 1 ? "" : "s"}` : ""} open now → +${gain}</button>` : "";
  const body = kind === "stones" ? "<b>More Wisdom Stones</b>1 per regional quest · 2 per Sealed Dungeon (first clear). Use them from the Cube."
    : "<b>More crystals</b>+4 per level · 1 per regional quest · 2 per Sealed Dungeon (first clear). Use them from the Cube.";
  const id = "tipPop" + (++tipSeq);
  return `<span class="tipwrap"><button type="button" class="tipbtn" aria-label="How to get more" aria-expanded="false" aria-controls="${id}">i</button><span class="tippop" id="${id}" role="tooltip">${body}${open ? `<span class="tipopen">${open}</span>` : ""}</span></span>`;
}
/* Grey "i" with a popover, same as the Skills/Daevanion "need more" tips. */
const stTip = () => `<span class="tipwrap"><button type="button" class="tipbtn" aria-label="Stigma shard costs" aria-expanded="false" aria-controls="tipPop${++tipSeq}">i</button><span class="tippop" id="tipPop${tipSeq}" role="tooltip"><b>Shards per level</b>1–5: 1 each · 6–10: 2 · 11–15: 4 · 16–20: 8 (75 to reach 20). Learning a stigma is its level 1. Bonuses at 5, 10, 15, 20.<br><br><b>More shards</b>1 per character level from 23 to 39 (2 from 40), plus achievements and shops.<br><br><b>Plan</b>Triniel's Dagger to 10, then Illusive Clone toward 20.<span class="tipopen">Costs from Metabot and allthings.how; not yet checked in game.</span></span></span>`;

export { aion2TipId, tipPop, stTip, dvShort, ini, spMini, stIco, mapMk, kibMark };
