/* The Build drawer (0.4 P4b: moved verbatim from src/main.js; markup build.html): stat priority, rotation and key
   setup at your level, what's new on your keys. Drawn by the Skills card (renderNext calls renderRotation), so it
   registers with update: null; its mount places the drawer and wires its tab. */
import { char } from "../../../core/state.js";
import { setHTML } from "../../../core/cards.js";
import { activePack, packClasses } from "../../../core/pack.js";
import { E_ORDER, GUIDE_KEYS, HAS_KEYS, KEYS, KEYS_ST, SP_ICONS, STAT_NOTE, STAT_SRC, STAT_TIERS, STIGMA_ICON } from "../data/build.js";
import { stTag } from "../data/markup.js";
import { rotKeys } from "../requirements.js";
import { aion2State as state, aion2Save as save, aion2Update as update, aion2STIGMA_SLOTS as STIGMA_SLOTS, aion2StIco as stIco, aion2SpMini as spMini, aion2Ini as ini } from "./page.js";

const statSeqHTML = () => STAT_TIERS.map((t, i) => `<div class="tier"><span class="tier-n">Tier ${i + 1}</span><div class="seq">${t.map(x => `<span>${x}<em class="src">${STAT_SRC[x] || ""}</em></span>`).join("")}</div></div>`).join("");
/* The keys at lv hold only what the guide says you have there (rotKeys, src/core/requirements.js: the Skills card's
   unlock rule for skills, the slot levels for stigmas). E_STACK marks stigmas with "*". */
const E_STACK = lv => rotKeys(char(state), lv).e.map(n => n + "*");
/* What's on your keys now, and what's been added since you last looked at the key setup (char(state).rotSeen). single: a
   key without rows (the Assassin's Q; a default key with one row). */
const rotNow = lv => { const out = [], k = rotKeys(char(state), lv);
  if (k.keys) { k.keys.forEach(x => x.rows.forEach((n, r) => { if (n) out.push({ n, key: x.key, r, single: x.single }); })); return out; }
  k.rmb.forEach((n, r) => out.push({ n, key: "Right click", at: "T", r })); /* seen as "Right click" (saves' rotSeen), shown on T */ k.q.forEach(n => out.push({ n, key: "Q", r: 0, single: true }));
  k.e.forEach((n, r) => out.push({ n, key: "E", r, stig: true })); return out; };
const rotNew = lv => { const seen = char(state).rotSeen; if (!seen) return []; return rotNow(lv).filter(x => !seen.includes(x.key + ":" + x.n + ":" + x.r)); }; /* moved rows count too */
const rotMarkSeen = () => { char(state).rotSeen = rotNow(char(state).level).map(x => x.key + ":" + x.n + ":" + x.r); save(); };
/* A Key setup cell's icon: the skill's (or stigma's) art, else the initials square. Decorative; the initials sit in an
   attribute so the cell's text stays the name. */
const gridIco = (n, stig) => { const src = (stig ? STIGMA_ICON : SP_ICONS)[n];
  return src ? `<img class="kv-ico" src="${src}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">` : `<span class="kv-ico ini" aria-hidden="true" data-ini="${ini(n)}"></span>`; };
const rotWhere = x => `${x.at || x.key}${x.single ? "" : `, row ${x.r}${x.r === 0 ? " (fires first)" : ""}`}`;
function renderStacks(lv) {
  if (!char(state).rotSeen || !char(state).rotSeen.every(k => k.split(":").length === 3)) rotMarkSeen(); /* first run: nothing counts as new */
  const fresh = new Set(rotNew(lv).map(x => x.n));
  /* Each filled cell is a labelled group naming its key and row, so a screen reader needn't wait for the key chips
     after the last cell to learn which column a skill is in. */
  const cell = (n, key, r) => { if (!n) return `<span class="sk empty"></span>`; const nm = n.replace(/\*/g, ""), stig = n.includes("*");
    return `<span class="sk${stig ? " stig" : ""}${fresh.has(nm) ? " new" : ""}" role="group" aria-label="${nm}, ${key}${r === 0 ? ", row 0 (fires first)" : ", row " + r}">${gridIco(nm, stig)}<span class="nm">${nm}</span></span>`; };
  if (KEYS.length && !GUIDE_KEYS) return renderDefaultKeys(lv, fresh, cell);
  /* One grid (0.6.2 P18, like the game's K window): shared row numbers on the left, one column per key, each cell the
     skill's icon with its name under it, and the key chips under their columns (row 0 at the bottom, as in the game's bar).
     The columns follow the game's (0.8 P14, research-387-macro): Q, E and T, the stack the macro on right click fires; the
     mouse slot (left click) is the line under them, as its one row. Q, E and T hold the guide's suggested binding, said
     once in a muted line heading the grid (Design Lead on #565: one note, no mark per chip); left click is the game's
     default. The game's defaults for the skills learned by lv are listed under the grid. */
  const k = rotKeys(char(state), lv), lmb = (KEYS.find(x => x.key === "Left click") || { rows: [] }).rows.filter(r => lv >= r.lv).map(r => r.n);
  const cols = [["Q", k.q], ["E", E_STACK(lv)], ["T", k.rmb]];
  setHTML(document.getElementById("stackViz"),
    `<p class="fine muted kv-sugg">Suggested keys: Q, E and T (T holds the stack the right-click macro fires). Move the skills there yourself.</p>` +
    [3, 2, 1, 0].map(r => `<i class="rn">${r}</i>` + cols.map(([key, rows]) => cell(rows[r], key, r).replace('class="sk', `class="sk${r === 0 ? " r0" : ""}`)).join("")).join("") +
    `<span></span>` + cols.map(([key]) => `<span class="kv-key">${key}</span>`).join("") +
    lmb.map(n => `<p class="lmb">Left click: <span class="sk">${gridIco(n)}<span class="nm">${n}</span></span></p>`).join("") + defaultKeysNote(lv) + stLaterHTML());
}
/* Under the guide's grid: the game's default keys of the skills learned by lv (KEYS), one line per key with the grid's
   key chip (Design Lead on #565: a list, not a paragraph), then the macro's place. That the macro moves the default
   right-click skill (Savage Roar) off right click is inferred (C21a). */
function defaultKeysNote(lv) {
  const on = KEYS.map(x => ({ key: x.key, n: x.rows.filter(r => lv >= r.lv).map(r => r.n) })).filter(x => x.n.length);
  const rc = on.find(x => x.key === "Right click");
  return `<div class="kv-note kv-defs">` +
    (on.length ? `<span class="khead">Game default keys${stTag(KEYS_ST)}</span><ul>${on.map(x => `<li><span class="kv-key${/ click$/.test(x.key) ? " mouse" : ""}">${x.key}</span> ${x.n.join(", ")}</li>`).join("")}</ul>` : "") +
    (rc ? `<p class="fine">The macro takes right click from ${rc.n.join(", ")} (inferred).</p>` : "") + `</div>`;
}
/* The game's default keys (0.7 P11, KEYS: the Ranger, the Gladiator), drawn like the Assassin's grid: one column per key
   with rows, as deep as the deepest key's data, row 0 at the bottom; a key with one row (the mouse, 1–4) gets a line under
   the grid, as the Assassin's left click does. Only skills learned by lv show. */
function renderDefaultKeys(lv, fresh, cell) {
  const k = rotKeys(char(state), lv), cols = k.keys.filter(x => !x.single), singles = k.keys.filter(x => x.single && x.rows[0]);
  const depth = Math.max(0, ...cols.map(x => x.rows.length)), el = document.getElementById("stackViz");
  el.style.gridTemplateColumns = `12px repeat(${cols.length}, minmax(0, 1fr))`;
  setHTML(el, [...Array(depth).keys()].reverse().map(r => `<i class="rn">${r}</i>` + cols.map(x => cell(x.rows[r], x.key, r).replace('class="sk', `class="sk${r === 0 ? " r0" : ""}`)).join("")).join("") +
    `<span></span>` + cols.map(x => `<span class="kv-key${/ click$/.test(x.key) ? " mouse" : ""}">${x.key}</span>`).join("") +
    singles.map(x => `<p class="lmb">${x.key}: <span class="sk${fresh.has(x.rows[0]) ? " new" : ""}">${gridIco(x.rows[0])}<span class="nm">${x.rows[0]}</span></span></p>`).join("") +
    `<p class="fine tline kv-note">The game's default keys${stTag(KEYS_ST) && "," + stTag(KEYS_ST)}. Row 0 is tried first; a skill on cooldown or not ready is skipped. A skill shows here from the level you learn it.</p>`);
}
/* Stigmas still to come: where each will go on E when you add it (in the order the slots open). */
function stLaterHTML() {
  const sl = STIGMA_SLOTS(), have = sl.filter(x => char(state).checks[x.k]).map(x => x.name), todo = sl.filter(x => !char(state).checks[x.k]).sort((a, b) => a.lv - b.lv);
  if (!todo.length) return "";
  const cur = [...have], rows = todo.map(x => { cur.push(x.name); const order = E_ORDER.filter(n => cur.includes(n)), r = order.indexOf(x.name), below = order.slice(r + 1);
    return `<li><span class="sk ghost">${stIco(x.name, "st-mini")}${x.name}</span><span class="lt-lv">Lv ${x.lv}</span><span class="lt-where">E, row ${r}${r === 0 ? " (fires first)" : ""}${below.length ? ` · ${below.join(", ")} move${below.length === 1 ? "s" : ""} down one` : ""}</span></li>`; }).join("");
  return `<div class="st-later"><span class="khead">Coming to E</span><ul>${rows}</ul></div>`;
}
/* The icon (or initials) before a name: skills as in the chain, stigmas (E) with their own art. Decorative: the name is the text. */
const ico = (n, stig) => stig ? stIco(n, "st-mini") : spMini(n);
const nameIco = (n, stig) => ico(n, stig) + n;
function renderRotation() {
  /* a build without a sourced key setup (0.6 P5, the Ranger): stat priority only, with the build's own footnote */
  if (STAT_NOTE) document.getElementById("statNote").textContent = STAT_NOTE;
  if (!HAS_KEYS) { document.querySelector("#statDrawer .sd-rot").hidden = true; setHTML(document.getElementById("statSeq"), statSeqHTML()); return; }
  const lv = char(state).level, { rmb, q, e, keys } = rotKeys(char(state), lv);
  if (keys) { renderDefaultRotation(lv, keys); return; }
  const before = e.filter(n => n === "Illusive Clone" || n === "Swift Contract"), after = e.filter(n => !before.includes(n));
  const steps = [];
  /* Q and E are the guide's suggested binding, not the game's defaults: the Key setup grid's heading line says so once */
  if (before.length) steps.push(`<b>E</b> ${before.map(n => nameIco(n, true)).join(" + ")}`);
  if (q.length) steps.push(`<b>Q</b> ${nameIco(q[0])} to get behind the target`);
  if (after.length) steps.push(`<b>E</b> ${after.map(n => nameIco(n, true)).join(", then ")}`);
  steps.push(`<b>Hold</b> right + left click`);
  document.getElementById("rotLv").textContent = `at Lv ${lv}`;
  setHTML(document.getElementById("rotPlay"), steps.map(x => `<li>${x}</li>`).join(""));
  setHTML(document.getElementById("rotChain"), rmb.map((n, i) => `<li><span class="dot"></span><span>${spMini(n)}${n}</span></li>`).join(""));
  rotNewNote(lv);
}
/* The new-placement note, the tab badges and the stacks (both kinds of build) */
function rotNewNote(lv) {
  const nw = rotNew(lv);
  setHTML(document.getElementById("rotNote"), nw.length ? `<b class="rot-new">New</b> ${nw.map(x => `put ${ico(x.n, x.stig)}<b>${x.n}</b> on ${rotWhere(x)}`).join("; ")}. The key grid below shows the full setup; closing this panel clears this note.` : "");
  const tb = document.getElementById("sdNew"); if (tb) tb.hidden = !nw.length;
  const bt = document.getElementById("tabBuild"); if (bt) bt.classList.toggle("has-new", !!nw.length);
  if (nw.length) { const ks = document.querySelector("#statDrawer details.mini"); if (ks) ks.open = true; }
  setHTML(document.getElementById("statSeq"), statSeqHTML());
  renderStacks(lv);
}
/* The Rotation section for the game's default keys (0.7 P11): what each key with rows fires, row 0 first, as the Assassin's
   "Right click fires" line. The Assassin's play steps, its left click and its macro text (build.html) are not this build's. */
function renderDefaultRotation(lv, keys) {
  const rot = document.querySelector("#statDrawer .sd-rot");
  for (const el of rot.querySelectorAll(":scope > .playsteps, :scope > .rmbline, .macro-steps, details > .tline")) el.style.display = "none";
  let box = rot.querySelector(":scope > .rot-keys");
  if (!box) { box = document.createElement("div"); box.className = "rot-keys"; rot.querySelector(":scope > .ns-head").after(box); }
  setHTML(box, keys.filter(x => !x.single && x.rows.some(Boolean)).map(x => `<div class="rmbline"><span class="khead">${x.key} fires</span><ol class="chain">${x.rows.filter(Boolean).map(n => `<li><span class="dot"></span><span>${spMini(n)}${n}</span></li>`).join("")}</ol></div>`).join(""));
  document.getElementById("rotLv").textContent = `at Lv ${lv}`;
  rotNewNote(lv);
}
/* the drawer's place and its tab (from render(), once) */
function aion2BuildMount() {
  /* the page header names the current character's class (0.6 P5: a Ranger reads "Asmodian Ranger Route"); the default
     class's header is left as the shell has it */
  { const cur = packClasses().find(x => x.pack === char(state).pack);
    if (cur && cur.class !== activePack().character.class) for (const el of document.querySelectorAll(".eyebrow > span:first-child, h1")) el.textContent = el.textContent.replace("Assassin", cur.name); }
  /* Stat priority drawer: a tab pinned to the right edge; open state remembered.
     It starts level with the top of the cards row and sticks 16px from the top once you scroll past it. */
  (() => {
    const place = () => { const g = document.querySelector("#main .top-grid"), d = document.getElementById("statDrawer");
      if (g && d) d.style.top = Math.max(16, Math.round(g.getBoundingClientRect().top)) + "px"; };
    addEventListener("scroll", place, { passive: true }); addEventListener("resize", place); requestAnimationFrame(place);
  })();
  (() => {
    const d = document.getElementById("statDrawer"), sideTab = document.getElementById("sdTab"), barTab = document.getElementById("tabBuild");
    /* <= 600 px (0.5 P5): the drawer is a bottom sheet opened from the tab bar's Build tab, which takes its label from this
       card; the side tab is hidden there. Same open state either way. */
    const sheetQ = window.matchMedia ? matchMedia("(max-width: 600px)") : { matches: false };
    barTab.textContent = sideTab.querySelector(".sd-lbl").textContent;
    const tab = { setAttribute: (k, v) => { sideTab.setAttribute(k, v); barTab.setAttribute(k, v); }, focus: o => (sheetQ.matches ? barTab : sideTab).focus(o) };
    const set = (o, viaKey) => { const was = d.classList.contains("open"); d.classList.toggle("open", o); tab.setAttribute("aria-expanded", String(o)); state.statOpen = o;
      /* Focus moves into the panel when it opens and back to the tab when it closes. */
      if (o && !was) requestAnimationFrame(() => document.getElementById("sdClose").focus({ preventScroll: true }));
      /* (also after a scrim tap, which leaves focus on the page, and after Escape with focus on Level up in the bar) */
      if (!o && was && (viaKey || d.contains(document.activeElement) || document.activeElement === document.body)) tab.focus({ preventScroll: true });
      /* Closing the panel after seeing a new key placement counts as done. */
      if (was && !o && rotNew(char(state).level).length) { rotMarkSeen(); update(); } else save(); };
    if (state.statOpen) { d.classList.add("open"); tab.setAttribute("aria-expanded", "true"); }
    for (const t of [sideTab, barTab]) t.addEventListener("click", () => set(!d.classList.contains("open")));
    for (const id of ["sdClose", "sdGrab", "sdScrim"]) document.getElementById(id).addEventListener("click", () => set(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && d.classList.contains("open")) set(false, sheetQ.matches); });
  })();
}

const aion2BuildCard = { id: "build", slot: "drawer", order: 100, root: "statDrawer", mount: aion2BuildMount, update: null };
export { renderRotation, renderStacks, E_STACK, aion2BuildCard };
