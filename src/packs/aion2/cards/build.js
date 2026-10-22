/* The Build drawer (0.4 P4b: moved verbatim from src/main.js; markup build.html): stat priority, rotation and key
   setup at your level, what's new on your keys. Drawn by the Skills card (renderNext calls renderRotation), so it
   registers with update: null; its mount places the drawer and wires its tab. */
import { char } from "../../../core/state.js";
import { setHTML } from "../../../core/cards.js";
import { activePack, packClasses } from "../../../core/pack.js";
import { E_BEFORE_Q, E_NOTE, E_ORDER, E_ST, GUIDE_KEYS, HAS_KEYS, KEYS, KEYS_ST, MACROS, SLOT_KEYS, SP_ICONS, STAT_NOTE, STAT_SRC, STAT_TIERS, STIGMA_ICON, macroStepsAt } from "../data/build.js";
import { eShift, stTag } from "../data/markup.js";
import { TIPS } from "../data/tips.js";
import { rotKeys } from "../requirements.js";
import { aion2State as state, aion2Save as save, aion2Update as update, aion2STIGMA_SLOTS as STIGMA_SLOTS, aion2StIco as stIco, aion2SpMini as spMini, aion2Ini as ini } from "./page.js";

/* Your own keys (0.9 P22, #388; docs/design/0.9-keys/README.md): char.keyBinds maps a Key setup column's suggested key (Q, E,
   T; a default-keys build's own keys) to the key the player uses for it. Absent, empty, not a string or holding a character
   HTML would read (KV_BAD; the key goes into markup and attributes): the suggestion. */
const KV_BAD = /[<>&"'`]/;
const kvKeyOf = col => { const m = char(state).keyBinds, k = m && typeof m === "object" && !Array.isArray(m) ? m[col] : null;
  return typeof k === "string" && k.trim() && k.length <= 12 && !KV_BAD.test(k) ? k : col; };
const kvMine = col => kvKeyOf(col) !== col;
/* the chip being rebound (its column) and a pending kvClash { col, key, other }; neither is saved */
let kvListen = null, kvClash = null;
const chipHTML = (col, cls = "") => kvListen === col
  ? `<button type="button" class="kv-key listen${cls}" data-col="${col}" aria-label="${col} stack: press a key">Press a key</button>`
  : `<button type="button" class="kv-key${cls}${kvMine(col) ? " mine" : ""}" data-col="${col}" aria-label="${kvKeyOf(col)}: change the key for this stack">${kvKeyOf(col)}<span class="kv-caret" aria-hidden="true">▾</span></button>`;
/* the hint under the grid: listening, a kvClash, or "Back to suggested keys" once a key is yours */
function hintHTML(cols) {
  if (kvClash) return `${kvClash.key} already holds the ${GUIDE_KEYS && kvClash.other === "T" ? "right-click" : kvClash.other} stack. <button type="button" class="linkbtn" data-kv="swap">Swap them</button> <button type="button" class="linkbtn" data-kv="other">Pick another</button>`;
  if (kvListen) return "Press the key you use for this stack in game. Esc cancels.";
  return cols.some(kvMine) ? `<button type="button" class="linkbtn" data-kv="reset">Back to suggested keys</button>` : "";
}
let kvCols = [];
const setKeys = m => { const keys = Object.fromEntries(Object.entries(m).filter(([c, k]) => k !== c));
  if (Object.keys(keys).length) char(state).keyBinds = keys; else delete char(state).keyBinds; save(); };
/* a key pressed while listening: Esc cancels; a key another column holds asks first (the kvClash state); Tab moves focus
   on, which cancels (onKeysFocusOut); a modifier alone or a key KV_BAD refuses is skipped */
function onListenKey(e) {
  if (!kvListen || e.key === "Tab") return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (["Shift", "Control", "Alt", "Meta"].includes(e.key) || KV_BAD.test(e.key)) return;
  const col = kvListen; kvListen = null;
  if (e.key !== "Escape") {
    const key = e.key === " " ? "Space" : e.key.length === 1 ? e.key.toUpperCase() : e.key;
    const other = kvCols.find(c => c !== col && kvKeyOf(c) === key);
    if (other) kvClash = { col, key, other };
    else setKeys({ ...(char(state).keyBinds || {}), [col]: key });
  }
  renderRotation(); focusChip(col);
}
function onKeysClick(e) {
  const chip = e.target.closest("[data-col]"), act = e.target.closest("[data-kv]");
  if (chip) { kvListen = chip.dataset.col; kvClash = null; renderRotation(); focusChip(kvListen); return; }
  if (!act) return;
  const a = act.dataset.kv, c = kvClash; kvClash = null;
  if (a === "swap" && c) setKeys({ ...(char(state).keyBinds || {}), [c.col]: c.key, [c.other]: kvKeyOf(c.col) });
  if (a === "other" && c) kvListen = c.col;
  if (a === "reset") setKeys({});
  renderRotation(); focusChip(c ? c.col : kvCols[0]);
}
/* listening ends when focus leaves the listening chip (a click elsewhere, Tab) or the drawer closes, so no later key press
   anywhere is taken. Focus moving to another chip is left to its click (a re-render now would swallow it); otherwise
   checked a tick later, as a re-render replaces the chip and focusChip refocuses its successor. */
const kvCancel = () => { if (!kvListen && !kvClash) return; kvListen = null; kvClash = null; renderRotation(); };
function onKeysFocusOut(e) {
  if (!kvListen || (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("#stackViz [data-col]"))) return;
  setTimeout(() => { const a = document.activeElement;
    if (kvListen && !(a && a.matches && a.matches(`#stackViz [data-col="${kvListen}"]`))) { kvListen = null; renderRotation(); } }, 0);
}
const focusChip = col => { const el = col && document.querySelector(`#stackViz [data-col="${col}"]`); if (el) el.focus({ preventScroll: true }); };
const statSeqHTML = () => STAT_TIERS.map((t, i) => `<div class="tier"><span class="tier-n">Tier ${i + 1}</span><div class="seq">${t.map(x => `<span>${x}<em class="src">${STAT_SRC[x] || ""}</em></span>`).join("")}</div></div>`).join("");
/* The keys at lv hold only what the guide says you have there (rotKeys, src/core/requirements.js: the Skills card's
   unlock rule for skills, the slot levels for stigmas). E_STACK marks stigmas with "*". The grid's E holds only the
   stigmas you have equipped (#610 F1): before the first one, rotKeys falls back to the open slots' stigmas, which
   "Coming to E" under the grid already lists. */
const E_STACK = lv => { const eq = STIGMA_SLOTS().filter(x => char(state).checks[x.k]).map(x => x.name);
  return rotKeys(char(state), lv).e.filter(n => eq.includes(n)).map(n => n + "*"); };
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
const rotWhere = x => `${kvKeyOf(x.at || x.key)}${x.single ? "" : `, row ${x.r}${x.r === 0 ? " (fires first)" : ""}`}`;
function renderStacks(lv) {
  if (!char(state).rotSeen || !char(state).rotSeen.every(k => k.split(":").length === 3)) rotMarkSeen(); /* first run: nothing counts as new */
  const fresh = new Set(rotNew(lv).map(x => x.n));
  /* Each filled cell is a labelled group naming its key and row, so a screen reader needn't wait for the key chips
     after the last cell to learn which column a skill is in. */
  /* The icon fills the box (0.9 P22, note 12); the name is the box's accessible name and its tooltip, on hover or focus
     (tap focuses it on a phone) */
  const cell = (n, key, r) => { if (!n) return `<span class="sk empty"></span>`; const nm = n.replace(/\*/g, ""), stig = n.includes("*"), where = `${kvKeyOf(key)}${r === 0 ? ", row 0 (fires first)" : ", row " + r}`;
    return `<span class="sk${stig ? " stig" : ""}${fresh.has(nm) ? " new" : ""}" role="group" tabindex="0" aria-label="${nm}, ${where}" data-tip="${nm} · ${where}">${gridIco(nm, stig)}<span class="nm">${nm}</span></span>`; };
  if (KEYS.length && !GUIDE_KEYS) return renderDefaultKeys(lv, fresh, cell);
  /* One grid (0.6.2 P18, like the game's K window): shared row numbers on the left, one column per key, each cell the
     skill's icon with its name under it, and the key chips under their columns (row 0 at the bottom, as in the game's bar).
     The columns follow the game's (0.8 P14, research-387-macro): Q, E and T, the stack the macro on right click fires; the
     mouse slot (left click) is the line under them, as its one row. Q, E and T hold the guide's suggested binding, said
     once in a muted line heading the grid (Design Lead on #565: one note, no mark per chip); left click is the game's
     default. The game's defaults for the skills learned by lv are listed under the grid. */
  const k = rotKeys(char(state), lv), lmb = (KEYS.find(x => x.key === "Left click") || { rows: [] }).rows.filter(r => lv >= r.lv).map(r => r.n);
  const cols = [["Q", k.q], ["E", E_STACK(lv)], ["T", k.rmb]];
  kvCols = cols.map(([key]) => key);
  const yours = kvCols.some(kvMine), ks = kvCols.map(kvKeyOf);
  setHTML(document.getElementById("stackViz"),
    `<p class="fine muted kv-sugg">${yours ? "Your keys" : "Suggested keys"}: ${ks[0]}, ${ks[1]} and ${ks[2]} (${ks[2]} holds the stack the right-click macro fires). Move the skills there yourself.${E_ST ? ` The stigma order on ${ks[1]} is unsure:` + stTag(E_ST) : ""}</p>` +
    [3, 2, 1, 0].map(r => `<i class="rn">${r}</i>` + cols.map(([key, rows]) => cell(rows[r], key, r).replace('class="sk', `class="sk${r === 0 ? " r0" : ""}`)).join("")).join("") +
    `<span></span>` + cols.map(([key]) => chipHTML(key)).join("") +
    lmb.map(n => `<p class="lmb">Left click: <span class="sk">${gridIco(n)}<span class="nm">${n}</span></span></p>`).join("") + defaultKeysNote(lv) + stLaterHTML());
  setHTML(document.getElementById("kvHint"), hintHTML(kvCols));
  renderMacro(lv);
}
/* The macro as steps (0.9 P22, docs/design/0.9-keys-macro.md §2): one block per macro in the data (MACROS), headed with
   the key it sits on; one numbered row per step at lv: a slot step fires that slot's whole stack (its key chip and the
   slot's game name), a skill step one skill. A step whose slot holds nothing yet isn't drawn; a Delay shows only when the
   data carries another value than the game's 10 ms (skill-bar facts 5–7, 12, 12a). No macro in the data, no block. */
const MACRO_DELAY_MS = 10, MACRO_MAX = 20;
const keyWord = k => / click$/.test(k) ? k.toLowerCase() : k;
/* Test hook (tests/a11y.js): fixture macros (MACROS' shape) set by the runner before the page loads, for the cases no
   class's data has yet (a Delay other than 10 ms, 2+ steps, a macro off right click); the page runs with MACROS. */
const macrosNow = () => Array.isArray(window.__macros) ? window.__macros : MACROS;
function renderMacro(lv) {
  const el = document.getElementById("kvMacro"); if (!el) return;
  const k = rotKeys(char(state), lv);
  /* the grid column a slot step fires: the slot's second key when the macro takes its first (right click → T) */
  const colOf = (slot, m) => { const [a, b] = SLOT_KEYS(slot); return slot === m.quickslot && b ? b : a; };
  /* the stack a slot step fires: the guide's grid columns (Quick Use 2 / 7 / 8 = right click / Q / E, the Assassin's
     keyStacks), else the game's default keys (KEYS). A class whose own stacks sit on other slots needs them added here. */
  const stackOf = slot => slot === "Quick Use 2" ? k.rmb : slot === "Quick Use 7" ? k.q : slot === "Quick Use 8" ? E_STACK(lv)
    : ((KEYS.find(x => x.key === SLOT_KEYS(slot)[0]) || { rows: [] }).rows.filter(r => lv >= r.lv).map(r => r.n));
  const delay = st => st.delayMs !== undefined && st.delayMs !== MACRO_DELAY_MS ? ` <span class="muted">· Delay ${st.delayMs} ms</span>` : "";
  setHTML(el, macrosNow().map(m => {
    const steps = macroStepsAt(m, lv).filter(st => st.skill || stackOf(st.slot).length).map(st => {
      if (st.skill) return `<li>${spMini(st.skill)}${st.skill} <span class="muted">· one skill</span>${delay(st)}</li>`;
      const key = kvKeyOf(colOf(st.slot, m));
      return `<li><b>${key}</b><span class="vh">: </span>${st.slot} <span class="muted">· the whole ${key} stack, row 0 first</span>${delay(st)}</li>`; });
    if (!steps.length) return "";
    const on = keyWord(SLOT_KEYS(m.quickslot)[0]), n = steps.length;
    return `<div class="kv-mac"><span class="khead">Macro on ${on}${n > 1 ? ` · ${n} steps` : ""}</span><ol class="playsteps">${steps.join("")}</ol>` +
      `<p class="fine tline">Make it in game: press K, open Macro (top right), then Add Macro, one step per line above. Each step's Delay starts at ${MACRO_DELAY_MS} ms, the game's default; if ready skills get skipped, raise it there.${n > 1 ? ` Up to ${MACRO_MAX} steps. Left click can only be the last step.` : ""}</p>` +
      `<p class="fine tline">Put the macro on ${on} (this guide's choice, not a rule): Esc, Key Settings, General, Gameplay, Macro (no key by default, single source), press ${on} and confirm moving it from its current key (only in the current control mode, not AION 1 mode).</p></div>`;
  }).join(""));
}
/* Under the guide's grid: the game's default keys of the skills learned by lv (KEYS), one line per key with the grid's
   key chip (Design Lead on #565: a list, not a paragraph), then the macro's place. That the macro moves the default
   right-click skill (Savage Roar) off right click is inferred (C21a). */
function defaultKeysNote(lv) {
  const on = KEYS.map(x => ({ key: x.key, n: x.rows.filter(r => lv >= r.lv).map(r => r.n) })).filter(x => x.n.length);
  const rc = on.find(x => x.key === "Right click");
  return `<div class="kv-note kv-defs">` +
    (on.length ? `<span class="khead">Game default keys${stTag(KEYS_ST)}</span><ul>${on.map(x => `<li><span class="kv-key${/ click$/.test(x.key) ? " mouse" : ""}">${x.key}</span> ${x.n.join(", ")}</li>`).join("")}</ul>` : "") +
    (rc ? `<p class="fine">This guide's macro on right click (its choice, not a rule) takes right click from ${rc.n.join(", ")} (inferred).</p>` : "") + `</div>`;
}
/* The game's default keys (0.7 P11, KEYS: the Ranger, the Gladiator), drawn like the Assassin's grid: one column per key
   with rows, as deep as the deepest key's data, row 0 at the bottom; a key with one row (the mouse, 1–4) gets a line under
   the grid, as the Assassin's left click does. Only skills learned by lv show. */
function renderDefaultKeys(lv, fresh, cell) {
  const k = rotKeys(char(state), lv), cols = k.keys.filter(x => !x.single), singles = k.keys.filter(x => x.single && x.rows[0]);
  const depth = Math.max(0, ...cols.map(x => x.rows.length)), el = document.getElementById("stackViz");
  el.style.gridTemplateColumns = `12px repeat(${cols.length}, minmax(0, 1fr))`;
  kvCols = cols.map(x => x.key);
  setHTML(el, [...Array(depth).keys()].reverse().map(r => `<i class="rn">${r}</i>` + cols.map(x => cell(x.rows[r], x.key, r).replace('class="sk', `class="sk${r === 0 ? " r0" : ""}`)).join("")).join("") +
    `<span></span>` + cols.map(x => chipHTML(x.key, / click$/.test(kvKeyOf(x.key)) ? " mouse" : "")).join("") +
    singles.map(x => `<p class="lmb">${x.key}: <span class="sk${fresh.has(x.rows[0]) ? " new" : ""}">${gridIco(x.rows[0])}<span class="nm">${x.rows[0]}</span></span></p>`).join("") +
    `<p class="fine tline kv-note">The game's default keys${stTag(KEYS_ST) && "," + stTag(KEYS_ST)}. Row 0 is tried first; a skill on cooldown or not ready is skipped. A skill shows here from the level you learn it.</p>`);
  setHTML(document.getElementById("kvHint"), hintHTML(kvCols));
  renderMacro(lv);
}
/* Stigmas still to come: where each will go on E when you add it (in the order the slots open). */
function stLaterHTML() {
  const sl = STIGMA_SLOTS(), have = sl.filter(x => char(state).checks[x.k]).map(x => x.name), todo = sl.filter(x => !char(state).checks[x.k]).sort((a, b) => a.lv - b.lv);
  if (!todo.length) return "";
  const cur = [...have], rows = todo.map(x => { cur.push(x.name); const order = E_ORDER.filter(n => cur.includes(n)), r = order.indexOf(x.name), shift = eShift(order, r);
    return `<li><span class="sk ghost">${stIco(x.name, "st-mini")}${x.name}</span><span class="lt-lv">Lv ${x.lv}</span><span class="lt-where">${kvKeyOf("E")}, row ${r}${r === 0 ? " (fires first)" : ""}${shift ? ` · ${shift}` : ""}</span></li>`; }).join("");
  return `<div class="st-later"><span class="khead">Coming to ${kvKeyOf("E")}</span><ul>${rows}</ul></div>`;
}
/* The icon (or initials) before a name: skills as in the chain, stigmas (E) with their own art. Decorative: the name is the text. */
const ico = (n, stig) => stig ? stIco(n, "st-mini") : spMini(n);
const nameIco = (n, stig) => ico(n, stig) + n;
/* How the rotation plays (0.9 P18): the guide's tip "rotation" (tip:rotation-play, the macro line both sources agree on
   and what stays off it), under the rotation with its source; false when the guide has none */
function renderHow() {
  const el = document.getElementById("rotHow"), t = TIPS.rotation;
  el.hidden = !t;
  if (t) setHTML(el, `<span class="khead">${t.h}</span>${t.b}<p class="fine">Source: ${t.src}</p>`);
  return !!t;
}
function renderRotation() {
  /* a build without a sourced key setup (0.6 P5, the Spiritmaster): stat priority, with the build's own footnote, and only
     the how-it-plays text in the Rotation section (no section without it) */
  if (STAT_NOTE) document.getElementById("statNote").textContent = STAT_NOTE;
  const how = renderHow();
  if (!HAS_KEYS) { const rot = document.querySelector("#statDrawer .sd-rot"); rot.hidden = !how;
    for (const el of rot.querySelectorAll(":scope > :not(.ns-head, .rot-how)")) el.style.display = "none";
    setHTML(document.getElementById("statSeq"), statSeqHTML()); return; }
  const lv = char(state).level, { rmb, q, e, keys } = rotKeys(char(state), lv);
  if (keys) { renderDefaultRotation(lv, keys); return; }
  /* the E stigmas fired before Q (E_BEFORE_Q, keyStacks.eBeforeQ), then Q, then the rest of E */
  const before = e.filter(n => E_BEFORE_Q.includes(n)), after = e.filter(n => !before.includes(n));
  const steps = [];
  /* Q and E are the guide's suggested binding, not the game's defaults: the Key setup grid's heading line says so once */
  /* the buffs' order is the disputed part of the E stack (0.9 P17, C21b): its label sits on this step */
  if (before.length) steps.push(`<b>${kvKeyOf("E")}</b> ${before.map(n => nameIco(n, true)).join(" + ")}${E_NOTE ? " " + E_NOTE : ""}${stTag(E_ST)}`);
  if (q.length) steps.push(`<b>${kvKeyOf("Q")}</b> ${nameIco(q[0])} to get behind the target`);
  if (after.length) steps.push(`<b>${kvKeyOf("E")}</b> ${after.map(n => nameIco(n, true)).join(", then ")}`);
  /* the warning the Key setup fold's old third line held (0.9 P22, docs/design/0.9-keys-macro.md §1; skill-bar fact 10) */
  steps.push(`<b>Hold</b> right + left click <span class="muted">· right click alone drains MP (your test)</span>`);
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
  for (const el of rot.querySelectorAll(":scope > .playsteps, :scope > .rmbline, details > .tline")) el.style.display = "none";
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
  /* rebinding (0.9 P22, #388): a chip listens for the next key; capture, so Esc cancels here before it closes the drawer */
  document.getElementById("statDrawer").addEventListener("click", onKeysClick);
  document.getElementById("statDrawer").addEventListener("focusout", onKeysFocusOut);
  addEventListener("keydown", onListenKey, true);
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
      if (!o) kvCancel();
      if (was && !o && rotNew(char(state).level).length) { rotMarkSeen(); update(); } else save(); };
    if (state.statOpen) { d.classList.add("open"); tab.setAttribute("aria-expanded", "true"); }
    for (const t of [sideTab, barTab]) t.addEventListener("click", () => set(!d.classList.contains("open")));
    for (const id of ["sdClose", "sdGrab", "sdScrim"]) document.getElementById(id).addEventListener("click", () => set(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && d.classList.contains("open")) set(false, sheetQ.matches); });
  })();
}

const aion2BuildCard = { id: "build", slot: "drawer", order: 100, root: "statDrawer", mount: aion2BuildMount, update: null };
export { renderRotation, renderStacks, E_STACK, aion2BuildCard };
