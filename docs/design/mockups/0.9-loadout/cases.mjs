/* 0.9 mockups for the owner's Lv 39 notes 9–12 (docs/design/0.9-loadout-mockup.md): respec for every card, the
   catch-up flow for late starts, Key setup as its own sheet with player-chosen keys (#388), and icon-filled key boxes.
   Design Lead (Jane); mockup only, injected into today's build so every frame is the real page with real data.
   Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.9-loadout --after-only
   Each act is built with new Function so it can share COMMON (the mock's CSS and helpers) once it runs in the page. */

/* a fresh Lv 39 Assassin on "An Ill Fate's Resolution", the owner's test (notes file, 2026-10-20) */
const fresh = { level: 39, welcomed: 1, quest: "An Ill Fate's Resolution" };
/* the same character part way: four stigmas equipped (Triniel's Dagger Lv 10, Illusive Clone Lv 5), Nezekan done and
   three Zikel nodes ticked. Seed state for the respec frames only; the counts below come from it. */
const dvN = ['dv:hg', 'dv:ew', 'dv:amb', 'dv:qs', 'dv:ew2', 'dv:as', 'dv:as2', 'dv:corner', 'dv:ie', 'dv:ss'], dvZ = ['dv:z:hg', 'dv:z:ie', 'dv:z:qs'];
const mid = { ...fresh, stShards: 3, dvTotal: 140, stLv: { "Triniel's Dagger": 10, 'Illusive Clone': 5, 'Swift Contract': 1, 'Savage Fang': 1 },
  checks: Object.fromEntries(['g22:0', 'g22:1', 'g27:0', 'g32:0', 'g37:0', ...dvN, ...dvZ].map(k => [k, true])) };
/* the same save just after each respec, so the card behind the toast shows the result: Nezekan unticked; stigmas at 1 with 18 shards back */
const afterDv = { ...mid, checks: Object.fromEntries(Object.entries(mid.checks).filter(([k]) => !dvN.includes(k))) };
const afterSt = { ...mid, stShards: 21, stLv: { "Triniel's Dagger": 1, 'Illusive Clone': 1, 'Swift Contract': 1, 'Savage Fang': 1 } };

const COMMON = `
const css = \`
.mk-note { font: 600 10px var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--gold); margin: 0 0 var(--space-8); }
/* note 9: one Respec control per card footer */
.tfoot .mk-rs { font: 600 11px var(--mono); padding: var(--space-3) var(--space-10); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--muted); background: transparent; cursor: pointer; margin-left: auto; }
.tfoot .mk-rs[aria-expanded="true"] { color: var(--fg); border-color: var(--muted); }
.tfoot { position: relative; }
.mk-menu { position: absolute; right: 0; bottom: calc(100% + var(--space-6)); z-index: 5; min-width: 240px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-10); box-shadow: var(--shadow-toast); padding: var(--space-6); display: grid; gap: var(--space-2); }
.mk-menu button { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: var(--space-10); align-items: baseline; text-align: left; background: transparent; border: 0; border-radius: var(--radius-6); padding: var(--space-8) var(--space-10); color: var(--fg); font: 500 13px var(--body); cursor: pointer; }
.mk-menu button span { font: 500 11px var(--mono); color: var(--muted); }
.mk-menu button:hover, .mk-menu button.hov { background: var(--panel-2); }
.mk-menu button:disabled { color: var(--muted); cursor: default; }
.mk-menu hr { border: 0; border-top: 1px solid var(--line); margin: var(--space-2) var(--space-4); }
.mk-menu .mk-all { font-weight: 600; }
.mk-sub-rs { margin-left: auto; font: 600 10.5px var(--mono); padding: 0 var(--space-8); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--muted); background: transparent; }
li.sub-h .sub-txt { flex: 1; }
li.sub-h { display: flex; align-items: center; }
#rwToast.mk-show { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; display: flex; gap: var(--space-14); align-items: center; animation: none; }
#rwToast .mk-undo { font: 600 12.5px var(--body); color: var(--accent-text); background: transparent; border: 0; padding: 0; text-decoration: underline; cursor: pointer; }
/* note 10: catch-up list in the Skills card */
.mk-cu-sub { font-size: 12.5px; color: var(--muted); margin: var(--space-4) 0 var(--space-10); }
.mk-cu { list-style: none; margin: 0; padding: 0; }
.mk-cu li { display: grid; grid-template-columns: 28px minmax(0,1fr) auto; gap: var(--space-4) var(--space-10); align-items: center; padding: var(--space-8) 0; border-top: 1px solid var(--line); }
.mk-cu li > img { width: 28px; height: 28px; border-radius: var(--radius-6); grid-row: span 2; align-self: start; }
.mk-cu .t { font: 600 13.5px var(--body); color: var(--fg); }
.mk-cu .t .lvarr { font-weight: 600; }
.mk-cu .s { grid-column: 2 / 4; font-size: 12px; color: var(--muted); line-height: 1.35; }
.mk-cu .s b { color: var(--fg); font-weight: 500; }
.mk-cu .d { font: 600 11px var(--mono); padding: var(--space-3) var(--space-10); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--fg); background: var(--panel-2); cursor: pointer; }
.mk-cu li.done .t, .mk-cu li.done .s { color: var(--muted); }
.mk-cu li.done .t { text-decoration: line-through; text-decoration-color: var(--muted-strike); }
.mk-cu li .ok { color: var(--good); font: 600 14px var(--body); padding-right: var(--space-10); }
.mk-cu li.cur { }
.mk-cu-foot { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-10); font-size: 12px; color: var(--muted); padding-top: var(--space-8); border-top: 1px solid var(--line); }
.mk-cu-foot button { font: 600 11px var(--mono); background: transparent; border: 0; padding: 0; color: var(--muted); text-decoration: underline dotted; cursor: pointer; }
/* note 11 + #388: Key setup sheet */
.mk-scrim { position: fixed; inset: 0; background: var(--shade-88); z-index: 60; }
.mk-sheet { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); width: min(1080px, calc(100vw - 48px)); max-height: 78vh; overflow: auto; z-index: 61; box-sizing: border-box;
  background: var(--panel); border: 1px solid var(--line); border-bottom: 0; border-radius: 16px 16px 0 0; box-shadow: var(--shadow-toast); padding: var(--space-10) var(--space-24, 24px) var(--space-24, 24px); }
.mk-grab { display: block; width: 44px; height: 4px; border-radius: 9px; background: var(--line); margin: 0 auto var(--space-12); }
.mk-sh-head { display: flex; align-items: baseline; gap: var(--space-12); margin-bottom: var(--space-12); }
.mk-sh-head h2 { margin: 0; font: 600 12px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--fg); }
.mk-sh-head .lvtag { font: 500 11px var(--mono); color: var(--muted); }
.mk-sh-head .x { margin-left: auto; width: 32px; height: 32px; border-radius: var(--radius-8); border: 1px solid var(--line); background: transparent; color: var(--fg); font-size: 18px; cursor: pointer; }
.mk-sh-body { display: grid; grid-template-columns: minmax(0, 460px) minmax(0, 1fr); gap: var(--space-24, 24px) 40px; align-items: start; }
.mk-sh-body .fine { font-size: 12.5px; color: var(--muted); line-height: 1.45; }
.mk-sh-body .khead { display: block; margin: 0 0 var(--space-8); }
.mk-l .st-later { margin-top: var(--space-16, 16px); }
.mk-sh-body ol.macro-steps { padding-left: 18px; margin: var(--space-8) 0 0; }
.mk-sh-body ol.macro-steps li { margin-bottom: var(--space-6); }
.mk-open-ks { font: 600 11px var(--mono); padding: var(--space-3) var(--space-10); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--fg); background: transparent; }
/* #388: the key chips under the columns are buttons */
.mk-sheet .mk-l .stackviz .kv-key { cursor: pointer; display: inline-flex; gap: var(--space-4); align-items: center; }
.mk-sheet .mk-l .stackviz .kv-key::after { content: ""; width: 0; height: 0; border: 4px solid transparent; border-top-color: var(--muted); margin-top: 4px; }
.mk-sheet .mk-l .stackviz .kv-key.listen { border-color: var(--accent); color: var(--accent-text); background: var(--accent-soft); }
.mk-sheet .mk-l .stackviz .kv-key.listen::after { display: none; }
.mk-sheet .mk-l .stackviz .kv-key.mine { border-color: var(--gold-66); }
.mk-keyhint { grid-column: 1 / -1; margin: var(--space-4) 0 0; font-size: 12px; color: var(--muted); text-align: center; }
.mk-keyhint b { color: var(--fg); }
.mk-reset { font: 600 11px var(--mono); background: transparent; border: 0; padding: 0; color: var(--muted); text-decoration: underline dotted; }
/* note 12: the icon fills the box; the name is the tooltip */
.mk-fill .stackviz { grid-template-columns: 12px repeat(3, 76px); justify-content: start; gap: var(--space-6) var(--space-8); }
.mk-fill .stackviz > .sk { padding: 0; height: 76px; min-height: 76px; overflow: hidden; position: relative; border-width: 2px; }
.mk-fill .stackviz > .sk .kv-ico { width: 100%; height: 100%; border-radius: 0; }
.mk-fill .stackviz > .sk .nm { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.mk-fill .stackviz > .sk.empty { border-width: 1px; }
.mk-fill .stackviz .lmb .sk { padding: 0 var(--space-8) 0 0; overflow: hidden; }
.mk-fill .stackviz .lmb .sk .kv-ico { width: 32px; height: 32px; border-radius: 0; }
.mk-tip { position: absolute; z-index: 70; transform: translate(-50%, calc(-100% - 8px)); background: var(--panel-2); border: 1px solid var(--line); border-radius: var(--radius-6); padding: var(--space-4) var(--space-8); font: 500 12px var(--body); color: var(--fg); white-space: nowrap; box-shadow: var(--shadow-toast); pointer-events: none; }
.mk-tip span { color: var(--muted); }
@media (max-width: 600px) {
  .mk-sheet { width: 100vw; max-height: 92vh; border-radius: 16px 16px 0 0; padding: var(--space-10) 16px 24px; }
  .mk-sh-body { grid-template-columns: minmax(0, 1fr); }
  .mk-fill .stackviz { grid-template-columns: 12px repeat(3, minmax(0, 88px)); }
  .mk-sh-head { flex-wrap: wrap; } .mk-sh-head h2 { white-space: nowrap; } .mk-sh-head .lvtag { order: 3; flex-basis: 100%; }
  .mk-fill .stackviz > .sk { height: auto; aspect-ratio: 1; min-height: 0; }
}
\`;
const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
const $ = s => document.querySelector(s);
const toast = html => { let t = document.getElementById("rwToast"); if (!t) { t = document.createElement("div"); t.id = "rwToast"; document.body.appendChild(t); } t.innerHTML = html; t.className = "mk-show"; };
const frame = el => { el.scrollIntoView({ block: "center" }); };
`;
const mk = body => new Function(COMMON + body);

/* ---- note 9: respec ---- */
/* Option A (recommended): Daevanion's Respec opens a menu: one row per board with something to respec, then All boards */
const dvMenu = mk(`
  const b = $("#dvRespec"); b.textContent = "Respec ▾"; b.setAttribute("aria-expanded", "true");
  const m = document.createElement("div"); m.className = "mk-menu"; m.setAttribute("role", "menu");
  m.innerHTML = '<button role="menuitem" class="hov">Nezekan board<span>10 nodes</span></button>' +
    '<button role="menuitem">Zikel board<span>3 nodes</span></button>' +
    '<button role="menuitem" disabled>Vaizel board<span>none yet</span></button>' +
    '<hr><button role="menuitem" class="mk-all">All boards<span>13 nodes</span></button>';
  b.parentNode.appendChild(m); frame($("#dvBox"));`);
/* Option B: a Respec chip on each board's line in All nodes, and Respec (all) stays in the footer */
const dvPerBoard = mk(`
  $("#dvAllBtn").click();
  document.querySelectorAll("#dvAllList ul:not(.shut) li.sub-h").forEach((li, i) => { if (i < 2) li.insertAdjacentHTML("beforeend", '<button type="button" class="mk-sub-rs">Respec</button>'); });
  document.querySelectorAll("#dvAllList ul").forEach((u, i) => { u.querySelectorAll("li:not(.sub-h)").forEach((li, j) => { if (j > 1) li.hidden = true; }); if (i > 2) u.hidden = true; });
  $("#dvRespec").textContent = "Respec all"; frame($("#dvBox"));`);
/* after a board respec: the menu closes and the toast offers Undo (replaces "Click again to respec") */
const dvUndo = mk(`
  toast('Respecced Nezekan: 10 nodes unticked <button type="button" class="mk-undo">Undo</button>'); frame($("#dvBox"));`);
/* Stigmas get the same footer button; one action, so a plain button and the same Undo toast */
const stRespec = mk(`
  const f = $("#stCard .tfoot"); f.insertAdjacentHTML("beforeend", '<button type="button" class="mk-rs" title="Set every stigma back to level 1; they stay equipped and the shards come back">Respec</button>');
  frame($("#stCard"));`);
const stUndo = mk(`
  const f = $("#stCard .tfoot"); f.insertAdjacentHTML("beforeend", '<button type="button" class="mk-rs">Respec</button>');
  toast('Stigmas reset · 18 shards back <button type="button" class="mk-undo">Undo</button>'); frame($("#stCard"));`);

/* ---- note 10: catch-up (real Lv 39 numbers: the guide's own spend of 165 points, measured by buying every open upgrade in
   today's build: 7 skills to 10, Insignia Explosion to 9, 1 point left; specialty picks from builds.json) ---- */
const CU = `
const icon = n => "assets/icons/sk-" + n.toLowerCase().replace(/'/g, "").replace(/ /g, "-") + ".png";
const ROWS = [
  ["Heart Gore", "Active", 10, 21, "Up to +20% Critical Hit when fewer targets are hit"],
  ["Insignia Explosion", "Active", 9, 17, "+50% Multi-Hit on hit"],
  ["Savage Roar", "Active", 10, 21, "+20% Skill Speed"],
  ["Quick Slice", "Active", 10, 21, "+50% Multi-Hit on hit"],
  ["Ambush", "Active", 10, 21, "Engraves 2 Insignias when it lands as a Back attack"],
  ["Rear Smite", "Passive", 10, 21, ""],
  ["Exploit Weakness", "Passive", 10, 21, ""],
  ["Shadowstrike", "Active", 10, 21, "+20% Critical Damage Boost for 10s on hit"]];
`;
const cuCard = (doneN) => mk(CU + `
  const done = ${doneN}, left = ROWS.slice(done).reduce((t, r) => t + r[3], 0) + 1;
  $("#spBig").firstChild.textContent = left;
  $("#spHero").innerHTML = '<div class="dvbh"><div class="dvbh-top"><span class="dvbh-k">Catch up</span><span class="dvbh-n">' + done + ' of 8 skills</span></div><span class="dvbh-bar"><span style="width:' + (done / 8 * 100) + '%"></span></span></div>' +
    '<p class="mk-cu-sub">Your 165 points cover these. In game, raise each skill to its level and pick its specialty, then mark it done.</p>' +
    '<ul class="mk-cu">' + ROWS.map((r, i) => '<li class="' + (i < done ? "done" : i === done ? "cur" : "") + '"><img src="' + icon(r[0]) + '" alt=""><span class="t">' + r[0] + ' <span class="lvarr">1 → ' + r[2] + '</span></span>' +
      (i < done ? '<span class="ok" aria-label="Done">✓</span>' : '<button type="button" class="d">Done</button>') +
      '<span class="s">' + r[1] + ' · ' + r[3] + ' pts' + (r[4] ? ' · specialty: <b>' + r[4] + '</b>' : '') + (r[2] < 10 ? ' · Lv 10 needs 3 more pts' : '') + '</span></li>').join("") + '</ul>' +
    '<div class="mk-cu-foot"><span>1 pt left over</span><button type="button">Mark all done</button></div>';
  $("#spAfter").innerHTML = ""; frame($("#spCard"));`);
/* Next up, option A (recommended): one card per skill, in the list's order */
const nuStep = mk(CU + `
  const c = $("#nowStar .ns-card"); c.querySelector(".ns-band").textContent = "Catch up · skill 1 of 8";
  c.querySelector("h3").innerHTML = 'Level <b>Heart Gore 1 → 10</b>';
  const ps = c.querySelectorAll(".title > p"); ps[0].innerHTML = '21 pts · then pick the specialty <b>Up to +20% Critical Hit when fewer targets are hit</b>';
  c.querySelector(".ns-btn").textContent = "Done"; frame(c);`);
/* Next up, option B: one card for the whole catch-up, sending you to the Skills card's list */
const nuOne = mk(CU + `
  const c = $("#nowStar .ns-card"); c.querySelector(".ns-band").textContent = "Catch up";
  c.querySelector("h3").innerHTML = 'Catch up <b>8 skills</b>';
  const ps = c.querySelectorAll(".title > p"); ps[0].innerHTML = '164 of your 165 pts · Heart Gore first';
  c.querySelector(".ns-btn").textContent = "Show list"; c.querySelector(".ns-btn").classList.remove("primary"); frame(c);`);

/* ---- notes 11 and 12, with #388: the Key setup sheet ---- */
const SHEET = `
  document.getElementById("sdTab").click();
  const det = [...document.querySelectorAll("#sdPanel details")].find(x => /Key setup/.test(x.textContent));
  const steps = det.querySelector("ol.macro-steps"), grid = document.getElementById("stackViz"), notes = [...det.querySelectorAll("p.tline")];
  /* the drawer keeps a button where the Key setup fold was */
  det.insertAdjacentHTML("afterend", '<button type="button" class="mk-open-ks">Key setup ↑</button>'); det.hidden = true;
  const scrim = document.createElement("div"); scrim.className = "mk-scrim"; document.body.appendChild(scrim);
  const sh = document.createElement("section"); sh.className = "mk-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-label", "Key setup");
  sh.innerHTML = '<span class="mk-grab"></span><div class="mk-sh-head"><h2>Key setup</h2><span class="lvtag">Lv 39 · press K in game to open this grid</span><button type="button" class="x" aria-label="Close">×</button></div><div class="mk-sh-body"><div class="mk-l"></div><div class="mk-r"></div></div>';
  document.body.appendChild(sh);
  const L = sh.querySelector(".mk-l"), R = sh.querySelector(".mk-r");
  L.appendChild(grid); R.className = "mk-r stackviz"; R.style.display = "block"; R.style.marginTop = "0"; grid.querySelector(".kv-sugg").textContent = "Row 0 fires first. Tap a key to set your own.";
  const defs = grid.querySelector(".kv-defs"), later = grid.querySelector(".st-later");
  R.innerHTML = '<span class="khead">Set the macro once</span>'; R.appendChild(steps);
  if (later) L.appendChild(later); if (defs) R.appendChild(defs);
  R.insertAdjacentHTML("beforeend", '<p class="fine">' + notes[0].textContent + '</p>');
  document.getElementById("sdTab").click();
`;
const sheet = mk(SHEET);
const sheetFill = mk(SHEET + `sh.classList.add("mk-fill");`);
/* hover (desktop) or tap (phone) on a box: the name, its key and row */
const sheetFillTip = mk(SHEET + `sh.classList.add("mk-fill");
  const cell = [...sh.querySelectorAll(".stackviz > .sk")].find(x => /Illusive Clone/.test(x.textContent)); const r = cell.getBoundingClientRect();
  const tip = document.createElement("div"); tip.className = "mk-tip"; tip.innerHTML = 'Illusive Clone <span>· E, row 0 (fires first)</span>';
  tip.style.left = (r.left + r.width / 2 + scrollX) + "px"; tip.style.top = (r.top + scrollY) + "px"; document.body.appendChild(tip); cell.style.outline = "2px solid var(--muted)";`);
/* #388: the player taps E and presses a key; every place that names E follows (Rotation, Next up hints) */
const sheetKey = mk(SHEET + `sh.classList.add("mk-fill");
  const keys = sh.querySelectorAll(".stackviz .kv-key"); const e = [...keys].find(k => k.textContent.trim() === "E"); e.textContent = "Press a key"; e.classList.add("listen");
  e.insertAdjacentHTML("afterend", ''); sh.querySelector(".stackviz").insertAdjacentHTML("beforeend", '<p class="mk-keyhint">Press the key you use for this stack in game · <b>Esc</b> cancels</p>');`);
const sheetKeyDone = mk(SHEET + `sh.classList.add("mk-fill");
  const keys = sh.querySelectorAll(".stackviz .kv-key"); const q = [...keys].find(k => k.textContent.trim() === "Q"), e = [...keys].find(k => k.textContent.trim() === "E");
  q.textContent = "E"; e.textContent = "R"; q.classList.add("mine"); e.classList.add("mine");
  sh.querySelector(".stackviz").insertAdjacentHTML("beforeend", '<p class="mk-keyhint">Your keys · <button type="button" class="mk-reset">Back to suggested</button></p>');`);

const cases = [];
const W = [[1500, 1000], [390, 844]];
for (const [w, h] of W) {
  cases.push({ name: `09-dv-menu-${w}`, save: mid, mode: 'advanced', width: w, height: h, act: dvMenu, shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `09-dv-perboard-${w}`, save: mid, mode: 'advanced', width: w, height: h, act: dvPerBoard, shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `09-dv-undo-${w}`, save: afterDv, mode: 'advanced', width: w, height: h, act: dvUndo });
  cases.push({ name: `09-st-respec-${w}`, save: mid, mode: 'advanced', width: w, height: h, act: stRespec, shots: [{ sel: '#stCard' }] });
  cases.push({ name: `09-st-undo-${w}`, save: afterSt, mode: 'advanced', width: w, height: h, act: stUndo });
  cases.push({ name: `10-skills-start-${w}`, save: fresh, mode: 'advanced', width: w, height: 1400, act: cuCard(0), shots: [{ sel: '#spCard' }] });
  cases.push({ name: `10-skills-mid-${w}`, save: fresh, mode: 'advanced', width: w, height: 1400, act: cuCard(3), shots: [{ sel: '#spCard' }] });
  cases.push({ name: `10-nextup-a-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: nuStep, shots: [{ sel: '#nowStar .ns-card' }] });
  cases.push({ name: `10-nextup-b-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: nuOne, shots: [{ sel: '#nowStar .ns-card' }] });
  cases.push({ name: `11-sheet-today-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: sheet });
  cases.push({ name: `12-sheet-fill-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: sheetFill });
  cases.push({ name: `12-sheet-tip-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: sheetFillTip });
  cases.push({ name: `388-key-listen-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: sheetKey });
  cases.push({ name: `388-key-mine-${w}`, save: fresh, mode: 'advanced', width: w, height: h, act: sheetKeyDone });
}
/* 360: the rows that gain a button (catch-up) and the filled grid */
cases.push({ name: '10-skills-start-360', save: fresh, mode: 'advanced', width: 360, height: 1400, act: cuCard(0), shots: [{ sel: '#spCard' }] });
cases.push({ name: '12-sheet-fill-360', save: fresh, mode: 'advanced', width: 360, height: 800, act: sheetFill });
/* Basic mode: Respec shows there too (note 7, 0.8.1); the menu is the same */
cases.push({ name: '09-dv-menu-basic-390', save: mid, mode: 'basic', width: 390, height: 844, act: dvMenu, shots: [{ sel: '#dvBox' }] });
export default cases;
