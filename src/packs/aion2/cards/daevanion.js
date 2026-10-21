/* Daevanion (0.4 P4b: moved verbatim from src/main.js; markup daevanion.html): crystals left, the next node with its
   in-game cost, the board list, All nodes, Respec. Drawn by the Skills card (renderNext calls renderDaevanion), so it
   registers with update: null. */
import { char } from "../../../core/state.js";
import { setHTML } from "../../../core/cards.js";
import { chainsOn, gatesOf, openOf } from "../../../core/requirements.js";
import { ITEMS } from "../data/items.js";
import { DV_TYPE, DV_TYPE_ICONS, SP_ICONS } from "../data/build.js";
import { GATES } from "../data/milestones.js";
import { DV_NODES } from "../catalog.js";
import { dvCostOf, dvNeed, dvNext, dvSpent, dvWaitOf } from "../requirements.js";
import { tipPop } from "./shared.js";
import { stTag } from "../data/markup.js";
import { keyChip } from "../hotkeys.js";
import { aion2State as state, aion2Save as save, aion2Update as update, aion2Render as render, aion2RenderNow as renderNow, aion2RenderUndo as renderUndo, aion2FitSkills as fitSkills, aion2SpMini as spMini, aion2DvShort as dvShort, aion2LayoutEl as layoutEl, aion2DvGate as dvGate, aion2RewardToast as rewardToast } from "./page.js";

/* a plan row the data labels disputed or inferred (0.9 P1) carries its tag after the name */
const dvName = it => `<span class="dvname ${DV_TYPE[it.ty][0]}">${it.t}</span>${stTag(it.st)}`;
/* board · type · via · "learned at Lv 21"; a part an earlier one already says is dropped (a via like "Fury is learned at
   Lv 21" covers the Lv 21 suffix, P16 design review) */
const dvMeta = it => [it.board, DV_TYPE[it.ty][1], it.via, it.blv === 21 && "learned at Lv 21"].filter(Boolean)
  .filter((s, i, a) => !a.slice(0, i).some(p => p.includes(s))).join(" · ");
/* Daevanion node row: "points spent" box first, then the tick (enabled once a cost is logged and the points cover it).
   No per-row "needs N, M left" line: the card's header already says how many points are missing (P16 design review). */
function refreshDvGates() {
  layoutEl.querySelectorAll('input[type=checkbox][data-k^="dv:"]').forEach(c => { c.disabled = dvGate(c.dataset.k).off; });
}
/* The cost boxes show the logged cost, else the plan's (dvCostOf: pre-filled, not saved until the player types). A plan
   cost computed from the board path, not read in game (0.9 P16), carries its tag until the player logs their own. */
const dvCostTag = it => (char(state).dvCost || {})[it.k] == null ? stTag(it.cst) : "";
const dvRowHTML = it => {
  const cost = dvCostOf(char(state), it), on = !!char(state).checks[it.k];
  return `<li class="item dvn" data-dvk="${it.k}"><label><input type="checkbox" data-k="${it.k}" ${on ? "checked" : ""} ${dvGate(it.k).off ? "disabled" : ""}><span class="txt"><img class="dvmini" src="${dvIconSrc(it)}" alt="" loading="lazy" onerror="this.remove()">${dvName(it)}<span class="loc">${dvMeta(it)}</span></span></label>` +
    `<label class="dvc-wrap" title="Points this node took, including its path">cost <input class="dvc" type="number" min="0" max="200" inputmode="numeric" data-dvc="${it.k}" value="${cost ?? ""}" placeholder="–">${dvCostTag(it)}</label></li>`;
};
/* Daevanion: the player types the board's total points and logs what each node cost (path included);
   remaining = total − logged costs. Node order lives in the milestones (Nezekan Lv 13, Zikel 20, Vaizel 30, Triniel 40). */
/* What a shut board waits for (dvWaitOf): E6's blocker text ("unlocks after "Urgent Pursuit" · N quests ahead"); the
   switch off keep the short "opens after "X"" (Basic shows chains on milestone rows only, design Q8). */
const dvWhy = w => chainsOn() && w.text ? w.text : `opens after "${w.story}"`;
function renderDaevanion() {
  /* The card stays shown before the window opens: it says what opens it. (It never hid: #dvBox's display: flex overrode
     `hidden`, so the old `box.hidden = !dvOpen(…)` was dead code; E6 removes it rather than hide the gate text.) */
  const total = char(state).dvTotal || 0, left = total - dvSpent(char(state));
  setHTML(document.getElementById("dvRemain"), dvSplitTxt(total));
  setHTML(document.getElementById("dvBig"), dvBigHTML(total, left));
  /* One node at a time: the next unbought node on an unlocked board, in the milestones' order. */
  const opts = [dvNext(char(state))].filter(Boolean), list = document.getElementById("dvNextList");
  /* setHTML (0.9 P30): dvNxUpdate, run right after on every pass (and on every cost typed), re-applies its bar, label and
     button in full; refreshDvGates and fitSkills likewise re-apply the box and the hero row's size */
  setHTML(list, opts.length
    ? opts.map(it => { const cost = dvCostOf(char(state), it);
        const st = !cost ? `<span class="dvst">enter in-game cost</span>` : cost <= (total - dvSpent(char(state))) ? `<span class="dvst ok">ready to buy</span>` : `<span class="dvst"></span>`;
        /* Next node, top to bottom: what (icon + name), progress (points left vs its cost, cost editable inline),
           action (one button whose label says exactly what's missing). The checkbox stays hidden for state sync. */
        return `<div class="dvrow nx" data-nx="${it.k}"><input type="checkbox" class="dvcb" data-k="${it.k}" hidden>` +
          `<div class="dvhead">${dvIcon(it)}<div class="dvtext">${dvName({ ...it, t: dvShort(it.t.split(" · ")[0]) })}<small title="${dvMeta(it)}">${it.board} · ${it.t.includes(" · ") ? it.t.split(" · ")[1] : DV_TYPE[it.ty][1].replace(" skill", "")}</small><div class="dvbar"><div class="dvtrack"><span></span></div><span class="dvbar-l"></span></div>` +
          `<div class="dvcost dvcost-col"><span class="dvcost-k">cost${dvCostTag(it)} <span class="dvi" tabindex="0" role="note" aria-label="Required amount of crystals to obtain selected Daevanion" data-tip="Required amount of crystals to obtain selected Daevanion">i</span></span><span class="cstep"><input class="dvc" type="number" min="0" max="200" inputmode="numeric" data-dvc="${it.k}" value="${cost ?? ""}" placeholder="?" aria-label="Cost in crystals"><span class="cstep-b"><button type="button" data-cst="1" tabindex="-1" aria-label="One more">▴</button><button type="button" data-cst="-1" tabindex="-1" aria-label="One fewer">▾</button></span></span></div></div></div>` +
          `<p class="dvstat"></p><div class="buyrow"><button type="button" class="dvbuy" data-buy="${it.k}"></button><div class="buystat" hidden></div></div></div>`; }).join("")
    : (() => { const nl = DV_NODES().find(it => !char(state).checks[it.k]); if (!nl) return null;
        const opensAt = Math.min(...DV_NODES().filter(n => n.board === nl.board).map(n => n.blv)), at = Math.max(opensAt, nl.blv), w = dvWaitOf(char(state), nl.board);
        /* Stop point: show the next node you'll buy (on the next board) and a green "all done" status in the button slot. */
        return `<div class="dvlocked"><div class="dvhead">${dvIcon(nl)}<div class="dvtext">${dvName({ ...nl, t: dvShort(nl.t.split(" · ")[0]) })}<small title="${dvMeta(nl)}">${nl.board}${w ? ` board · ${w.story ? dvWhy(w).split(" · ")[0] : `opens Lv ${at}`}` : ` · Lv ${at}`}</small></div></div>` +
          /* E6: the hero's one-line small text keeps the quest, the status below it the distance (both fit at 390 px; nothing said twice) */
          `<div class="buyrow"><div class="buystat done">✓ All open nodes acquired · ${w && w.story && dvWhy(w).split(" · ")[1] ? `<span class="nw">next: ${nl.board}</span> · <span class="nw">${dvWhy(w).split(" · ")[1]}</span>`
            : `<span class="nw">next: ${nl.board} ${w && w.story ? dvWhy(w).replace(/^opens /, "") : `at Lv ${at}`}</span>`}</div></div></div>`; })()
    || `<div class="alldone"><div class="dvhead"><span class="dvico done-ico" aria-hidden="true">✓</span><div class="dvtext"><span class="spname">All planned nodes acquired</span><small>Spare crystals: Critical Hit and Attack nodes</small></div></div></div>`);
  dvNxUpdate(); renderUndo(); requestAnimationFrame(() => typeof fitSkills === "function" && fitSkills());
  /* "Then": the next few nodes after this one (same order), like Skills' Coming up. */
  const after = DV_NODES().filter(it => !char(state).checks[it.k]).slice(opts.length || 1, (opts.length || 1) + 14);
  /* Board banner: which board you're on and how far along; a new board gets a proper announcement. */
  const heroB = opts[0] ? opts[0].board : null, nextLocked = !heroB && DV_NODES().find(it => !char(state).checks[it.k]);
  const bName = heroB || (nextLocked && nextLocked.board);
  /* Current board strip, always shown: the board you're buying on (or the last one you finished). Gold "new" right after it opens. */
  const curB = heroB || ([...DV_NODES()].reverse().find(it => char(state).checks[it.k] && openOf(char(state), it.k)) || DV_NODES()[0]).board;
  { const bl = DV_NODES().filter(it => it.board === curB), bd = bl.filter(it => char(state).checks[it.k]).length, isNew = !!heroB && bd === 0, full = bd === bl.length;
    /* Header for the list under it, styled like Skills' "Coming up": board name, bought count, a thin bar. */
    setHTML(document.getElementById("dvBoard"), `<div class="dvbh${isNew ? " new" : ""}${full ? " full" : ""}"><div class="dvbh-top"><span class="dvbh-k">${curB} board${isNew ? ` <span class="dvb-new">New</span>` : ""}</span><span class="dvbh-n">${full ? "✓&nbsp;" : ""}${bd} of ${bl.length}<span class="dvbh-w"> acquired</span></span></div>` +
      `<span class="dvbh-bar"><span style="width:${bd / bl.length * 100}%"></span></span></div>`); }
  let prevB = curB;
  setHTML(document.getElementById("dvThen"), after.length ? `<ul class="soonlist">` + after.map(it => {
    const opensAt = Math.min(...DV_NODES().filter(n => n.board === it.board).map(n => n.blv)), wB = dvWaitOf(char(state), it.board), shutB = !!wB;
    /* Not open yet: a bar from the last milestone below your level up to the board's level. */
    const fromLv = (GATES.filter(g => g.lv < char(state).level).pop() || { lv: 1 }).lv, pctB = Math.min(100, Math.max(0, (char(state).level - fromLv) / Math.max(1, opensAt - fromLv) * 100));
    const div = it.board !== prevB ? `<li class="then-board"><span>${it.board}</span><span>${!shutB ? "open" : wB.story ? dvWhy(wB) : `opens Lv ${opensAt} · ${opensAt - char(state).level} to go`}</span>${shutB && !wB.story ? `<span class="tb-bar"><span style="width:${pctB}%"></span></span>` : ""}</li>` : "";
    prevB = it.board;
    return div + `<li title="${dvMeta(it)}"><span class="sname">${SP_ICONS[dvSkill(it)] ? spMini(dvSkill(it)) : `<img class="dvmini" src="${dvIconSrc(it)}" alt="" loading="lazy" onerror="this.remove()">`}${dvName({ ...it, t: dvShort(it.t) })}</span><span class="slv">${!openOf(char(state), it.k) && it.blv !== opensAt ? `Lv ${it.blv}` : ""}</span><span class="sst"></span>${shutB ? `<span class="nb-tag" title="${it.board} board ${wB.story ? (chainsOn() && wB.text ? wB.text : `opens after "${wB.story}" is turned in`).replace(/"/g, "&quot;") : `opens at Lv ${opensAt}`}">${wB.story ? "Story" : `Lv ${opensAt}`}</span>` : ""}</li>`; }).join("") + `</ul>` : "");
  /* Full plan, grouped by board; boards not yet open are dimmed with their level. */
  const byBoard = {};
  DV_NODES().forEach(it => { (byBoard[it.board] = byBoard[it.board] || []).push(it); });
  /* innerHTML, not setHTML: its rows and boxes change after the write (milestoneFilters hides ticked rows, refreshDvGates
     and the tick and cost handlers set their boxes and art); 0.9 P30 kept it: update() runs milestoneFilters before this
     redraw, so a skipped write would leave rows as the last filters left them, not as a fresh write draws them */
  document.getElementById("dvAllList").innerHTML = Object.entries(byBoard).map(([b, list]) => {
    const opens = Math.min(...list.map(it => it.blv)), wb = dvWaitOf(char(state), b), shut = !!wb, done = list.filter(it => char(state).checks[it.k]).length;
    return `<ul class="items dv-board${shut ? " shut" : ""}"><li class="sub-h"><span class="sub-txt">${b} · ${shut ? (wb.story ? dvWhy(wb) : `opens at Lv ${opens}`) : `${done} of ${list.length} acquired`}</span></li>${list.map(dvRowHTML).join("")}</ul>`;
  }).join("");
  const inp = document.getElementById("dvIn");
  if (document.activeElement !== inp) inp.value = total || "";
  const allOpen = !!state.dvAllOpen;
  document.getElementById("dvAllList").hidden = !allOpen;
  const ab = document.getElementById("dvAllBtn"); ab.setAttribute("aria-expanded", String(allOpen)); ab.textContent = allOpen ? "Hide nodes" : "All nodes";
  /* Outline the tile when the next node is affordable (or points are waiting and its cost isn't logged yet). */
  const nx = dvNext(char(state), char(state).level);
  document.getElementById("dvBox").classList.toggle("act", !!nx && total > 0 && left >= dvNeed(char(state), nx));
  refreshDvGates();
  renderDvCatch(); renderDvRespec();
}
/* 0.9 P20 (docs/design/0.9-catchup, notes 9 and 10): per-board catch-up and respec. A board's guide nodes are its plan
   nodes; a board is open when dvWaitOf has nothing to wait for. */
const dvBoards = () => { const by = {}; DV_NODES().forEach(it => { (by[it.board] = by[it.board] || []).push(it); });
  return Object.entries(by).map(([b, its]) => ({ b, its })); };
const dvHas = (c, x) => x.its.filter(it => c.checks[it.k]).length;
/* Catch-up: the first open board you haven't finished has nothing ticked, 2 or more levels after it opened (a late start,
   or a board left alone). It lists every open board and stays until each is marked; a player who levels board by board
   has ticked the board in progress, so it doesn't show. */
function dvCatchUp(c) {
  const open = dvBoards().filter(x => !dvWaitOf(c, x.b)), first = open.find(x => dvHas(c, x) < x.its.length);
  if (!first || dvHas(c, first)) return null;
  /* "2 or more levels after it opened": a node of it was open already at your level − 2 (the evaluator asked there) */
  const ev2 = gatesOf(c, c.level - 2);
  return first.its.some(it => ev2.byKey(it.k).open) ? open : null;
}
let dvCuOpen = false, dvRsOpen = false, dvArm = null, dvArmT = 0;
function renderDvCatch() {
  const el = document.getElementById("dvCatch"), c = char(state), open = dvCatchUp(c);
  el.hidden = !open; if (!open) { dvCuOpen = false; setHTML(el, ""); return; }
  const marked = open.filter(x => dvHas(c, x) === x.its.length).length, shut = dvBoards().map(x => [x, dvWaitOf(c, x.b)]).find(([, w]) => w);
  const cost = x => { const v = x.its.map(it => dvCostOf(c, it)); return v.every(n => n != null) ? ` · ${v.reduce((a, n) => a + n, 0)}` : ""; };
  setHTML(el, `<span><b>${open.length} board${open.length === 1 ? "" : "s"}</b> opened before you joined${marked ? ` · ${marked} marked` : ""}</span>` +
    `<button type="button" class="cu-sb" id="dvCuBtn" aria-expanded="${dvCuOpen}" aria-controls="dvCuMenu">Mark bought ▾</button>` +
    (dvCuOpen ? `<div class="cu-menu" id="dvCuMenu">` + open.map(x => { const done = dvHas(c, x) === x.its.length;
      return `<label${done ? ` class="off"` : ""}><input type="checkbox" data-dvmark="${x.b}"${done ? " checked disabled" : ""}> ${x.b} board<span>${x.its.length} node${x.its.length === 1 ? "" : "s"}${cost(x)}</span></label>`; }).join("") +
      `<p class="cu-note">Ticks the board&rsquo;s guide nodes, so Crystals left counts them as spent.${shut ? ` ${shut[0].b} ${shut[1].story ? dvWhy(shut[1]) : `opens at Lv ${shut[1].lv}`}.` : ""}</p></div>` : ""));
}
/* Respec ▾: one row per board that is open or has ticks (greyed with "none yet" when nothing is ticked), then All boards.
   Each row needs a second click within 3 s, then a toast offers Undo. */
function renderDvRespec() {
  const c = char(state), btn = document.getElementById("dvRespec"), menu = document.getElementById("dvRsMenu");
  const rows = dvBoards().filter(x => dvHas(c, x) || !dvWaitOf(c, x.b)), all = rows.reduce((a, x) => a + dvHas(c, x), 0);
  btn.disabled = !all; btn.title = all ? "Untick a board's nodes, or every board's, and clear their costs; total points stay" : "Nothing to respec yet";
  if (!all) dvRsOpen = false;
  btn.setAttribute("aria-expanded", String(dvRsOpen)); menu.hidden = !dvRsOpen;
  const row = (id, label, n, cls = "") => `<button type="button" role="menuitem"${cls ? ` class="${cls}"` : ""} data-dvrs="${id}"${n ? "" : " disabled"} title="In the app. In game, remove the nodes one by one.">${dvArm === id ? "Click again to respec" : label}<span>${n ? `${n} node${n === 1 ? "" : "s"}` : "none yet"}</span></button>`;
  setHTML(menu, rows.map(x => row(x.b, `${x.b} board`, dvHas(c, x))).join("") + `<hr>` + row("*", "All boards", all, "rs-all"));
}
/* Respec a board ("*": every board, and the crystals-left correction): untick its nodes and clear their logged costs;
   Undo puts back exactly what was there */
function dvRespecDo(id) {
  const c = char(state), its = DV_NODES().filter(it => id === "*" || it.board === id);
  const was = { checks: its.map(it => [it.k, c.checks[it.k]]), cost: c.dvCost && { ...c.dvCost }, adj: c.dvAdj }, n = its.filter(it => c.checks[it.k]).length;
  its.forEach(it => { delete c.checks[it.k]; if (c.dvCost) delete c.dvCost[it.k]; });
  if (id === "*") { delete c.dvAdj; delete c.dvCost; }
  save(); render(); update();
  rewardToast(`${id === "*" ? "Daevanion" : id} reset · ${n} node${n === 1 ? "" : "s"} back`, () => { if (char(state) !== c) return;
    was.checks.forEach(([k, v]) => { if (v === undefined) delete c.checks[k]; else c.checks[k] = v; });
    if (was.cost) c.dvCost = was.cost; else delete c.dvCost;
    if (was.adj !== undefined) c.dvAdj = was.adj; save(); render(); update(); });
}
/* Mark bought: tick a board's guide nodes in one tap (the player has them in game); Undo unticks what it ticked */
function dvMarkBoard(b) {
  const c = char(state), keys = DV_NODES().filter(it => it.board === b && !c.checks[it.k]).map(it => it.k);
  if (!keys.length) return;
  keys.forEach(k => { c.checks[k] = true; });
  save(); render(); update();
  rewardToast(`${b} marked · ${keys.length} node${keys.length === 1 ? "" : "s"}`, () => { if (char(state) !== c) return; keys.forEach(k => { delete c.checks[k]; }); save(); render(); update(); });
}
const dvIconSrc = it => { const set = DV_TYPE_ICONS[it.ty]; return set ? set[char(state).checks[it.k] ? 1 : 0] : ITEMS.crystal[2]; };
const dvSkill = it => (it.t || "").split(" · ")[0];
/* The acquired art sits on top, hidden; it fades in while you hover the green "Mark acquired" button. */
const dvIcon = it => `<span class="dvico${DV_TYPE_ICONS[it.ty] ? " art" : ""}"><img src="${dvIconSrc(it)}" alt="" loading="lazy" onerror="this.remove()">${DV_TYPE_ICONS[it.ty] && !char(state).checks[it.k] ? `<img class="dvon" src="${DV_TYPE_ICONS[it.ty][1]}" alt="" loading="lazy" onerror="this.remove()">` : ""}${SP_ICONS[dvSkill(it)] ? `<img class="dvbadge" src="${SP_ICONS[dvSkill(it)]}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>`;
/* The crystals-left number (a click swaps it for a box: setHTML sees the swap and writes it back on the next pass) */
const dvBigHTML = (total, left) => `<b class="dvsync" title="Click to match the game's crystals left">${total ? left : "–"}</b><span>crystal${total && left === 1 ? "" : "s"} left</span>${char(state).dvAdj ? `<em class="dvadj" title="Correction so this matches the game">${char(state).dvAdj > 0 ? "−" : "+"}${Math.abs(char(state).dvAdj)} adj</em>` : ""}${keyChip("daevanion")}`;
/* Board total = 4 per level past 11 + 1 per Daevanion Crystal used (formula confirmed in game at Lv 16 and 17). */
function dvSplitTxt(total) {
  const fromLv = Math.max(0, 4 * (char(state).level - 11)), cr = total - fromLv;
  document.getElementById("dvCr").textContent = total && cr >= 0 ? `+${cr} from items` : "";
  document.getElementById("dvCr").title = total && cr >= 0 ? `${total} crystals = ${fromLv} from levels (4 per level past 11) + ${cr} from Daevanion Crystal items used from your Cube` : "";
  if (!total) return "Enter the board's total crystals.";
  if (cr < 0) return `<b>${total}</b> total, but Lv ${char(state).level} alone gives ${fromLv}. Check your level or the total.`;
  return "";
}
function dvNxUpdate() {
  const total = char(state).dvTotal || 0, left = Math.max(0, total - dvSpent(char(state)));
  document.querySelectorAll("#dvNextList .dvrow.nx").forEach(r => {
    const k = r.dataset.nx, it = DV_NODES().find(n => n.k === k), c = it ? dvCostOf(char(state), it) : (char(state).dvCost || {})[k], need = it ? dvNeed(char(state), it) : (c ?? 1);
    const ok = c != null && c <= left, short = left < need;
    const bar = r.querySelector(".dvtrack span"), btn = r.querySelector(".dvbuy"), st = r.querySelector(".dvstat"), lab = r.querySelector(".dvbar-l");
    bar.style.width = (need ? Math.min(100, left / need * 100) : 100) + "%";
    if (lab) lab.innerHTML = `<b>${left}</b>/${need}${c != null ? "" : "+"}`; lab.title = "Crystals left / this node's cost";
    r.classList.toggle("ok", ok); r.classList.toggle("short", short); r.classList.toggle("nocost", c == null);
    /* One state at a time, like Skills: can't afford even the minimum → what's missing; no cost yet → the gold box asks;
       affordable → the buy button. */
    const miss = need - left;
    btn.hidden = !ok; btn.disabled = !ok;
    btn.textContent = ok ? (c === 0 ? "Mark acquired · free" : `Mark acquired · ${c} crystal${c === 1 ? "" : "s"}`) : "";
    const bs = r.querySelector(".buystat");
    if (bs) { bs.hidden = ok; bs.classList.toggle("ask", !short && c == null);
      bs.innerHTML = short ? `Need ${miss}${c != null ? "" : "+"} more · +4 per level${tipPop("crystals")}` : !ok ? `Type its cost from the game` : ""; }
    st.textContent = "";
  });
}
function dvLive() {
  dvNxUpdate();
  const total = char(state).dvTotal || 0, left = total - dvSpent(char(state));
  setHTML(document.getElementById("dvBig"), dvBigHTML(total, left));
  setHTML(document.getElementById("dvRemain"), dvSplitTxt(total));
  document.querySelectorAll("#dvNextList .dvrow").forEach(r => {
    const k = r.querySelector("input[type=checkbox]").dataset.k, st = r.querySelector(".dvst");
    if (!st) return;
    const it = DV_NODES().find(n => n.k === k), c = it ? dvCostOf(char(state), it) : (char(state).dvCost || {})[k];
    st.className = "dvst" + (c != null && c <= left ? " ok" : "");
    st.textContent = c == null ? "enter in-game cost" : c <= left ? "ready to buy" : "";
  });
  const nx = dvNext(char(state), char(state).level);
  document.getElementById("dvBox").classList.toggle("act", !!nx && total > 0 && left >= dvNeed(char(state), nx));
}
/* the cost boxes, the total, the crystals-left fix, All nodes, the buy button, Respec (from render(), once) */
function aion2DaevanionMount() {
  /* Up/down arrows inside the cost box: step the value and run the normal input handler. From an empty box, up gives 1
     (no node costs 0 to buy outright) and down gives 0 ("already got it on the way to another node"), the same as the
     keyboard arrows in a number field (F6). */
  layoutEl.addEventListener("click", e => {
    const b = e.target.closest("[data-cst]"); if (!b) return;
    const i = b.closest(".cstep").querySelector("input.dvc"), cur = i.value === "" ? (b.dataset.cst > 0 ? 0 : 1) : +i.value;
    i.value = Math.max(0, Math.min(200, cur + +b.dataset.cst)); i.dispatchEvent(new Event("input", { bubbles: true }));
  });
  /* Logging a cost enables that node's tick everywhere it appears; totals update live. */
  layoutEl.addEventListener("input", e => {
    const k = e.target.dataset && e.target.dataset.dvc; if (!k) return;
    const v = parseInt(e.target.value, 10);
    char(state).dvCost = char(state).dvCost || {};
    /* 0 is a real cost: a node you already got on the way to another one. */
    const has = e.target.value.trim() !== "" && v >= 0;
    if (has) char(state).dvCost[k] = v; else delete char(state).dvCost[k];
    save();
    /* a cleared box falls back to the plan's cost (dvCostOf), in the other boxes too */
    const node = DV_NODES().find(n => n.k === k), shown = node ? dvCostOf(char(state), node) : has ? v : undefined;
    layoutEl.querySelectorAll(`[data-dvc="${k}"]`).forEach(i => { if (i !== e.target) i.value = shown ?? ""; });
    /* A logged cost swaps the node art to its filled version. */
    if (node && DV_TYPE_ICONS[node.ty]) layoutEl.querySelectorAll(`.dvrow.nx[data-nx="${k}"] .dvico img:first-child, .dvn[data-dvk="${k}"] img.dvmini`).forEach(im => { im.src = dvIconSrc(node); });
    refreshDvGates();
    dvLive();
    renderNow();
  });
  /* "Crystals left" doesn't match the game? Click the number, type what the game shows; the difference is
     kept as a correction (e.g. a path node whose cost was logged 1 short). Respec clears it. */
  document.getElementById("dvBig").addEventListener("click", e => {
    const b = e.target.closest(".dvsync"); if (!b || !(char(state).dvTotal > 0)) return;
    const cur = char(state).dvTotal - dvSpent(char(state));
    b.outerHTML = `<input class="dvsync-in" type="number" min="0" max="999" value="${cur}" aria-label="Crystals left in game">`;
    const i = document.querySelector("#dvBig .dvsync-in"); i.focus(); i.select();
    let fin = false;
    const done = ok => { if (fin) return; fin = true; if (ok) { const v = parseInt(i.value, 10); if (Number.isFinite(v)) char(state).dvAdj = (char(state).dvAdj || 0) + (cur - v); save(); } update(); };
    i.addEventListener("keydown", ev => { if (ev.key === "Enter") done(true); if (ev.key === "Escape") done(false); });
    i.addEventListener("blur", () => done(true), { once: true });
  });
  document.getElementById("dvIn").addEventListener("input", e => {
    char(state).dvTotal = Math.max(0, parseInt(e.target.value.trim(), 10) || 0);
    save(); renderDaevanion(); renderNow();
  });
  document.getElementById("dvAllBtn").addEventListener("click", () => { state.dvAllOpen = !state.dvAllOpen; save(); renderDaevanion(); });
  /* Next node's buy button ticks its (hidden) checkbox, same path as any other tick. */
  layoutEl.addEventListener("click", e => {
    const b = e.target.closest("[data-buy]"); if (!b || b.disabled) return;
    const cb = b.closest(".dvrow").querySelector("input.dvcb"); cb.checked = true;
    cb.dispatchEvent(new Event("change", { bubbles: true }));
  });
  /* Respec ▾ (0.9 P20): the menu of boards; a row arms on the first click and respecs on a second within 3 s, then the
     toast offers Undo. Total points stay, as in the game. */
  const box = document.getElementById("dvBox");
  box.addEventListener("click", e => {
    if (e.target.closest("#dvRespec")) { dvRsOpen = !dvRsOpen; dvArm = null; renderDvRespec(); return; }
    const r = e.target.closest("[data-dvrs]");
    if (r && !r.disabled) { const id = r.dataset.dvrs; clearTimeout(dvArmT);
      if (dvArm !== id) { dvArm = id; dvArmT = setTimeout(() => { dvArm = null; renderDvRespec(); }, 3000); renderDvRespec(); return; }
      dvArm = null; dvRsOpen = false; dvRespecDo(id); return; }
    if (e.target.closest("#dvCuBtn")) { dvCuOpen = !dvCuOpen; renderDvCatch(); }
  });
  box.addEventListener("change", e => { const m = e.target.dataset && e.target.dataset.dvmark; if (m && e.target.checked) dvMarkBoard(m); });
  /* the menu closes on Escape (focus back to its button) and on a click outside it */
  document.addEventListener("keydown", e => { if (e.key === "Escape" && dvRsOpen) { dvRsOpen = false; dvArm = null; renderDvRespec(); document.getElementById("dvRespec").focus(); } });
  document.addEventListener("click", e => { if (dvRsOpen && e.target.isConnected && !e.target.closest("#dvRsMenu, #dvRespec")) { dvRsOpen = false; dvArm = null; renderDvRespec(); } });
}

const aion2DaevanionCard = { id: "daevanion", slot: "top", order: 200, root: "dvBox", mount: aion2DaevanionMount, update: null };
export { renderDaevanion, aion2DaevanionCard };
