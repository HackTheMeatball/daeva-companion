/* Shared by the 0.9 mockups (docs/design/0.9-catchup/README.md, docs/design/0.9-keys/README.md): the saves, the mock CSS
   and the acts that inject each mockup into today's build, so every frame is the real page with real data.
   Design Lead (Jane); mockup only. Each act is built with new Function so it can share COMMON once it runs in the page
   (tests/support/shots.mjs serializes acts). Frames: run each folder's cases.mjs (see its header). */

/* a fresh Lv 39 Assassin on "An Ill Fate's Resolution", the owner's test (notes file, 2026-10-20) */
export const fresh = { level: 39, welcomed: 1, quest: "An Ill Fate's Resolution" };
/* the same character part way: four stigmas equipped (Triniel's Dagger Lv 10, Illusive Clone Lv 5), Nezekan done and
   three Zikel nodes ticked. Seed state for the respec frames only; the counts below come from it. */
const dvN = ['dv:hg', 'dv:ew', 'dv:amb', 'dv:qs', 'dv:ew2', 'dv:as', 'dv:as2', 'dv:corner', 'dv:ie', 'dv:ss'], dvZ = ['dv:z:hg', 'dv:z:ie', 'dv:z:qs'];
export const mid = { ...fresh, stShards: 3, dvTotal: 140, stLv: { "Triniel's Dagger": 10, 'Illusive Clone': 5, 'Swift Contract': 1, 'Savage Fang': 1 },
  checks: Object.fromEntries(['g22:0', 'g22:1', 'g27:0', 'g32:0', 'g37:0', ...dvN, ...dvZ].map(k => [k, true])) };
/* the same save just after each respec, so the card behind the toast shows the result: Nezekan unticked; stigmas at 1 with 18 shards back */
export const afterDv = { ...mid, checks: Object.fromEntries(Object.entries(mid.checks).filter(([k]) => !dvN.includes(k))) };
export const afterSt = { ...mid, stShards: 21, stLv: { "Triniel's Dagger": 1, 'Illusive Clone': 1, 'Swift Contract': 1, 'Savage Fang': 1 } };
/* after marking Nezekan in the Daevanion catch-up: its guide nodes ticked; Total is still the player's own number (140,
   the seed's), so Crystals left counts Nezekan's 52 as spent */
export const nezDone = { ...fresh, dvTotal: 140, checks: Object.fromEntries(dvN.map(k => [k, true])) };
/* after marking all four stigma slots equipped */
export const stAll = { ...fresh, checks: Object.fromEntries(['g22:0', 'g22:1', 'g27:0', 'g32:0', 'g37:0'].map(k => [k, true])) };

const COMMON = `
const css = \`
.mk-note { font: 600 11px var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--gold); margin: 0 0 var(--space-8); }
/* note 9: one Respec control per card footer */
.tfoot .mk-rs { font: 600 11px var(--mono); padding: var(--space-3) var(--space-10); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--muted); background: transparent; cursor: pointer; margin-left: auto; }
.tfoot .mk-rs[aria-expanded="true"] { color: var(--fg); border-color: var(--muted); }
.tfoot { position: relative; }
.mk-menu { position: absolute; right: 0; bottom: calc(100% + var(--space-6)); z-index: 5; min-width: 240px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-10); box-shadow: var(--shadow-float); padding: var(--space-6); display: grid; gap: var(--space-2); }
.mk-menu button { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: var(--space-10); align-items: baseline; text-align: left; background: transparent; border: 0; border-radius: var(--radius-6); padding: var(--space-8) var(--space-10); color: var(--fg); font: 500 13px var(--body); cursor: pointer; }
.mk-menu button span { font: 500 11px var(--mono); color: var(--muted); }
.mk-menu button:hover, .mk-menu button.hov { background: var(--panel-2); }
.mk-menu button:disabled { color: var(--muted); cursor: default; }
.mk-menu hr { border: 0; border-top: 1px solid var(--line); margin: var(--space-2) var(--space-4); }
.mk-menu .mk-all { font-weight: 600; }
.mk-sub-rs { margin-left: auto; flex: none; font: 600 11px var(--mono); padding: var(--space-3) var(--space-8); min-height: 24px; border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--muted); background: transparent; }
li.sub-h .sub-txt { flex: 1; min-width: 8em; }
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
.mk-cu-foot { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-10); font-size: 12px; color: var(--muted); padding-top: var(--space-8); border-top: 1px solid var(--line); }
.mk-cu-foot button, .sphint .mk-allsp { font: 600 11px var(--mono); background: transparent; border: 0; padding: var(--space-4) 0; min-height: 24px; color: var(--muted); text-decoration: underline dotted; cursor: pointer; }
/* note 11 + #388: Key setup sheet */
.mk-scrim { display: none; }
.mk-sheet { position: fixed; top: 0; right: 0; bottom: 0; width: min(820px, 60vw); overflow: auto; z-index: 61; box-sizing: border-box;
  background: var(--panel); border-left: 1px solid var(--line); box-shadow: var(--shadow-drawer); padding: var(--space-16) var(--space-20) var(--space-20); }
.mk-grab { display: none; }
.mk-sh-head { display: flex; align-items: baseline; gap: var(--space-12); margin-bottom: var(--space-12); }
.mk-sh-head h2 { margin: 0; font: 600 12px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--fg); }
.mk-sh-head .lvtag { font: 500 11px var(--mono); color: var(--muted); }
.mk-sh-head .x { margin-left: auto; width: 32px; height: 32px; border-radius: var(--radius-8); border: 1px solid var(--line); background: transparent; color: var(--fg); font-size: 18px; cursor: pointer; }
.mk-sh-body { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--space-20) var(--space-24); align-items: start; }
.mk-sh-body .fine { font-size: 12.5px; color: var(--muted); line-height: 1.45; }
.mk-sh-body .khead { display: block; margin: 0 0 var(--space-8); }
.mk-l .st-later { margin-top: var(--space-16); max-width: 340px; }
.mk-sh-body ol.macro-steps { padding-left: 18px; margin: var(--space-8) 0 0; }
.mk-sh-body ol.macro-steps li { margin-bottom: var(--space-6); }
.mk-open-ks { font: 600 11px var(--mono); padding: var(--space-3) var(--space-10); border-radius: var(--radius-pill); border: 1px solid var(--line); color: var(--fg); background: transparent; }
/* #388: the key chips under the columns are buttons */
.mk-sheet .mk-l .stackviz .kv-key { cursor: pointer; display: inline-flex; gap: var(--space-4); align-items: center; }
.mk-sheet .mk-l .stackviz .kv-key::after { content: ""; width: 0; height: 0; border: 4px solid transparent; border-top-color: var(--muted); margin-top: 4px; }
.mk-sheet .mk-l .stackviz .kv-key.listen { border-color: var(--accent); color: var(--accent-text); background: var(--accent-soft); }
.mk-sheet .mk-l .stackviz .kv-key.listen::after { display: none; }
.mk-sheet .mk-l .stackviz .kv-key.mine { border-color: var(--accent); }
.mk-keyhint { grid-column: 1 / -1; margin: var(--space-4) 0 0; font-size: 12px; color: var(--muted); text-align: left; }
.mk-clash { grid-column: 1 / -1; margin: var(--space-6) 0 0; font-size: 12.5px; color: var(--fg); display: flex; flex-wrap: wrap; gap: var(--space-6) var(--space-12); align-items: center; }
.mk-clash button { font: 600 11px var(--mono); padding: var(--space-4) var(--space-10); min-height: 24px; border-radius: var(--radius-pill); border: 1px solid var(--line); background: var(--panel-2); color: var(--fg); }
.mk-keyhint b { color: var(--fg); }
.mk-reset { font: 600 11px var(--mono); background: transparent; border: 0; padding: var(--space-4) 0; min-height: 24px; color: var(--muted); text-decoration: underline dotted; }
/* note 12: the icon fills the box; the name is the tooltip */
.mk-fill .stackviz { grid-template-columns: 12px repeat(3, 96px); justify-content: start; gap: var(--space-6) var(--space-8); }
.mk-fill .stackviz > .sk { padding: 0; height: 96px; min-height: 96px; overflow: hidden; position: relative; border-width: 2px; }
.mk-fill .stackviz > .sk .kv-ico { width: 100%; height: 100%; border-radius: 0; }
.mk-fill .stackviz > .sk .nm { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.mk-fill .stackviz > .sk.empty { border-width: 1px; }
.mk-fill .stackviz .lmb .sk { padding: 0 var(--space-8) 0 0; overflow: hidden; }
.mk-fill .stackviz .lmb .sk .kv-ico { width: 32px; height: 32px; border-radius: 0; }
.mk-tip { position: absolute; z-index: 70; transform: translate(-50%, calc(-100% - 8px)); background: var(--panel-2); border: 1px solid var(--line); border-radius: var(--radius-6); padding: var(--space-4) var(--space-8); font: 500 12px var(--body); color: var(--fg); white-space: nowrap; box-shadow: var(--shadow-toast); pointer-events: none; }
.mk-tip span { color: var(--muted); }
@media (max-width: 600px) {
  .mk-scrim { display: block; position: fixed; inset: 0 0 var(--mk-bot, 0px) 0; background: var(--shade-88); z-index: 60; }
  .mk-sheet { top: auto; left: 0; bottom: var(--mk-bot, 0px); width: 100vw; max-height: calc(100vh - var(--mk-bot, 0px) - 48px); border-left: 0; border-top: 1px solid var(--line); border-radius: 14px 14px 0 0; box-shadow: var(--shadow-float); padding: var(--space-8) 16px var(--space-20); }
  .mk-grab { display: block; width: 44px; height: 4px; border-radius: 9px; background: var(--line); margin: 0 auto var(--space-10); }
  .mk-sh-body { grid-template-columns: minmax(0, 1fr); }
  .mk-fill .stackviz { grid-template-columns: 12px repeat(3, minmax(0, 112px)); }
  .mk-sh-head h2 { white-space: nowrap; }
  .mk-fill .stackviz > .sk { height: auto; aspect-ratio: 1; min-height: 0; }
}
/* catch-up in Basic (UX audit 4): the card foot stays, with the catch-up tools only */
body.basic #spCard .tfoot.mk-keep, body.basic #dvBox .tfoot.mk-keep, body.basic #stCard .tfoot.mk-keep { display: flex !important; }
.tfoot.mk-keep .mk-hide { display: none !important; }
/* Daevanion and Stigmas catch-up (fresh review of 4bafe69): a one-line strip above today's hero, with a menu to mark what
   you already have; the hero, cost field and lists stay */
.mk-strip { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-10); padding: var(--space-8) var(--space-10); margin: 0 0 var(--space-10); border: 1px solid var(--line); border-radius: var(--radius-8); background: var(--panel-2); font-size: 12.5px; color: var(--muted); }
.mk-strip > span { flex: 1 1 13em; }
.mk-strip b { color: var(--fg); font-weight: 600; }
.mk-strip .mk-sb { margin-left: auto; flex: none; font: 600 11px var(--mono); padding: var(--space-4) var(--space-10); min-height: 24px; border-radius: var(--radius-pill); border: 1px solid var(--line); background: var(--panel); color: var(--fg); cursor: pointer; }
.mk-strip .mk-menu { top: calc(100% + var(--space-6)); bottom: auto; min-width: min(300px, 100%); }
.mk-menu label { display: grid; grid-template-columns: 18px minmax(0,1fr) auto; gap: var(--space-10); align-items: baseline; padding: var(--space-8) var(--space-10); border-radius: var(--radius-6); color: var(--fg); font: 500 13px var(--body); }
.mk-menu label span { font: 500 11px var(--mono); color: var(--muted); }
.mk-menu label.off { color: var(--muted); }
.mk-menu .mk-mnote { margin: var(--space-4) var(--space-10) var(--space-6); font-size: 12px; color: var(--muted); line-height: 1.4; }
/* the board and slot catch-up rows reuse the skill rows */
.mk-cu li.lock .t, .mk-cu li.lock .s { color: var(--muted); }
.mk-cu .ini2 { width: 28px; height: 28px; grid-row: span 2; align-self: start; border-radius: var(--radius-6); }
/* folded early chores in Next up (UX audit 8) */
.mk-fold summary { list-style: none; cursor: pointer; }
/* the catch-up view leaves the shared row-height fit (fitSkills): no band under the list */
.mk-cu-on, .mk-cu-on .tmain, .mk-cu-on #spHero, .mk-cu-on #dvNextList, .mk-cu-on #stBody { min-height: 0 !important; }
@media (max-width: 860px) { .mk-cu-on { height: auto !important; } }
.mk-more { font: 600 11px var(--mono); background: transparent; border: 0; padding: var(--space-8) 0 var(--space-4); min-height: 24px; color: var(--muted); text-decoration: underline dotted; cursor: pointer; }
.tfoot summary.mk-info { width: 28px; height: 28px; padding: 0; display: inline-grid; place-items: center; border-radius: 50%; font: italic 600 13px var(--body); }
.mk-picker { position: fixed; left: 0; right: 0; bottom: 0; z-index: 75; background: var(--panel-2); border-top: 1px solid var(--line); border-radius: 14px 14px 0 0; padding: var(--space-12) 16px 24px; box-shadow: var(--shadow-toast); }
.mk-picker h3 { margin: 0 0 var(--space-8); font: 600 13px var(--body); color: var(--fg); }
.mk-picker ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-8); }
.mk-picker li { text-align: center; padding: var(--space-10) 0; border: 1px solid var(--line); border-bottom-width: 2px; border-radius: var(--radius-8); font: 600 14px var(--mono); color: var(--fg); background: var(--panel); }
.mk-picker li.on { border-color: var(--accent); color: var(--accent-text); }
.mk-picker li.used { color: var(--muted); }
.mk-picker li small { display: block; font: 500 10.5px var(--body); color: var(--muted); margin-top: var(--space-2); }
.mk-picker p { margin: var(--space-10) 0 0; font-size: 12px; color: var(--muted); }
\`;
const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
const $ = s => document.querySelector(s);
const toast = html => { let t = document.getElementById("rwToast"); if (!t) { t = document.createElement("div"); t.id = "rwToast"; document.body.appendChild(t); } t.innerHTML = html; t.className = "mk-show"; };
const frame = el => { el.scrollIntoView({ block: "center" }); };
/* note 12: filled boxes, 96 px on desktop, up to 112 px on a phone (the grid sets its columns inline, so set them here) */
const fill = el => { el.classList.add("mk-fill"); el.querySelectorAll(".stackviz").forEach(g => { const n = (g.style.gridTemplateColumns.match(/repeat\\((\\d+)/) || [0, 3])[1]; g.style.gridTemplateColumns = "12px repeat(" + n + ", " + (innerWidth > 600 ? "96px" : "minmax(0, 112px)") + ")"; }); };
if (document.body.classList.contains("basic")) { document.querySelectorAll("#spCard .tfoot, #dvBox .tfoot, #stCard .tfoot").forEach(f => { f.classList.add("mk-keep"); f.querySelectorAll("details.mini").forEach(d => { if (!/Sync|Slots/.test(d.textContent)) d.classList.add("mk-hide"); }); }); const ab = $("#dvAllBtn"); if (ab) ab.classList.add("mk-hide"); }
const stRs = () => { const f = $("#stCard .tfoot"); if (!f.querySelector(".mk-rs")) f.insertAdjacentHTML("beforeend", '<button type="button" class="mk-rs" title="Set every stigma back to level 1; they stay equipped and the shards come back">Respec</button>'); };
/* "How points work" / "How shards work" become one round info button, so Respec stays on the foot's one row at every width */
document.querySelectorAll(".tfoot details.mini > summary").forEach(x => { if (/^How (points|shards) work$/.test(x.textContent.trim())) { x.setAttribute("aria-label", x.textContent.trim()); x.title = x.textContent.trim(); x.textContent = "i"; x.classList.add("mk-info"); } });
`;
export const mk = body => new Function(COMMON + body);

/* ---- note 9: respec ---- */
/* Option A (recommended): Daevanion's Respec opens a menu: one row per board with something to respec, then All boards */
export const dvMenu = mk(`
  const b = $("#dvRespec"); b.textContent = "Respec ▾"; b.setAttribute("aria-expanded", "true");
  const m = document.createElement("div"); m.className = "mk-menu"; m.setAttribute("role", "menu");
  m.innerHTML = '<button role="menuitem" class="hov">Nezekan board<span>10 nodes</span></button>' +
    '<button role="menuitem">Zikel board<span>3 nodes</span></button>' +
    '<button role="menuitem" disabled>Vaizel board<span>none yet</span></button>' +
    '<hr><button role="menuitem" class="mk-all">All boards<span>13 nodes</span></button>';
  b.parentNode.appendChild(m); frame($("#dvBox"));`);
/* nothing to respec yet (a fresh save): the button stays, greyed, and says why */
export const dvNone = mk(`
  const b = $("#dvRespec"); b.textContent = "Respec ▾"; b.disabled = true; b.title = "Nothing to respec yet"; b.style.opacity = ".5"; frame($("#dvBox"));`);
/* Option B: a Respec chip on each board's line in All nodes, and Respec all boards in the footer */
export const dvPerBoard = mk(`
  $("#dvAllBtn").click();
  document.querySelectorAll("#dvAllList ul:not(.shut) li.sub-h").forEach((li, i) => { if (i < 2) li.insertAdjacentHTML("beforeend", '<button type="button" class="mk-sub-rs">Respec</button>'); });
  document.querySelectorAll("#dvAllList ul").forEach((u, i) => { u.querySelectorAll("li:not(.sub-h)").forEach((li, j) => { if (j > 1) li.style.display = "none"; }); if (i > 2) u.style.display = "none"; });
  $("#dvRespec").textContent = "Respec all boards"; frame($("#dvBox"));`);
/* every respec works the same way on all three cards: it happens at once and the toast offers Undo (replaces "Click again to respec") */
export const dvUndo = mk(`
  toast('Nezekan reset · 10 nodes back <button type="button" class="mk-undo">Undo</button>'); frame($("#dvBox"));`);
export const stRespec = mk(`stRs(); frame($("#stCard"));`);
export const stUndo = mk(`stRs();
  toast('Stigmas reset · 18 shards back <button type="button" class="mk-undo">Undo</button>'); frame($("#stCard"));`);
export const spUndo = mk(`
  toast('Skills reset · 164 pts back <button type="button" class="mk-undo">Undo</button>'); frame($("#spCard"));`);
/* Basic: the three feet with Respec (COMMON keeps them); frame one card */
export const footBasic = sel => mk(`stRs(); frame($("${sel}"));`);

/* ---- note 10: catch-up (real numbers: the guide's own spend, measured by buying every open upgrade in today's build at
   Lv 27, 39 and 45; specialty picks from builds.json). Rows: [skill, type, level reached, points, specialty]. ---- */
const CU = `
const icon = n => "assets/icons/sk-" + n.toLowerCase().replace(/'/g, "").replace(/ /g, "-") + ".png";
const SP = { "Heart Gore": "Up to +20% Critical Hit when fewer targets are hit", "Insignia Explosion": "+50% Multi-Hit on hit", "Savage Roar": "+20% Skill Speed",
  "Quick Slice": "+50% Multi-Hit on hit", "Ambush": "Engraves 2 Insignias when it lands as a Back attack", "Shadowstrike": "+20% Critical Damage Boost for 10s on hit" };
const pts = L => [0, 0, 1, 2, 3, 5, 7, 9, 13, 17, 21][L];
const row = (n, t, L) => [n, t, L, pts(L), t === "Active" && L >= 8 ? (SP[n] || "") : ""];
const A = lv => lv === 27 ? [["Heart Gore", 8], ["Insignia Explosion", 4], ["Savage Roar", 9], ["Quick Slice", 9], ["Ambush", 8], ["Rear Smite", 5, "Passive"], ["Exploit Weakness", 7, "Passive"], ["Shadowstrike", 9]]
  : lv === 45 ? [["Heart Gore", 10], ["Insignia Explosion", 10], ["Savage Roar", 10], ["Quick Slice", 10], ["Ambush", 10], ["Rear Smite", 10, "Passive"], ["Exploit Weakness", 10, "Passive"], ["Shadowstrike", 10], ["Assault Stance", 10, "Passive"], ["Impact Hit", 8, "Passive"]]
  : [["Heart Gore", 10], ["Insignia Explosion", 9], ["Savage Roar", 10], ["Quick Slice", 10], ["Ambush", 10], ["Rear Smite", 10, "Passive"], ["Exploit Weakness", 10, "Passive"], ["Shadowstrike", 10]];
const SETS = { 27: A(27).map(r => row(r[0], r[2] || "Active", r[1])), 39: A(39).map(r => row(r[0], r[2] || "Active", r[1])), 45: A(45).map(r => row(r[0], r[2] || "Active", r[1])),
  /* the Ranger at Lv 39, measured the same way; ranger/builds.json has no specialtyPicks yet (UX audit 3) */
  R39: [["Snipe", 10], ["Tempest Shot", 10], ["Marking Shot", 10], ["Drill Dart", 10], ["Gale Arrow", 10], ["Burst Arrow", 9], ["Deadshot", 8], ["Focused Eye", 9, "Passive"], ["Hunter's Resolve", 8, "Passive"]].map(r => { const x = row(r[0], r[2] || "Active", r[1]); if (x[1] === "Active" && x[2] >= 8) x[4] = null; return x; }) };
/* what the points leave short, said on the row it lands on (fresh review 21): the build buys by unlock level, so a skill
   learned later is bought last */
const NOTE = { 27: "", 39: "Insignia Explosion stops at 9 for now: it is learned later, so it is bought last. Lv 10 needs 3 more pts.", 45: "Impact Hit stops at 8 for now. Lv 9 needs 3 more pts.", R39: "" };
const LEFT = { 27: 2, 39: 1, 45: 1, R39: 0 };
const spec = r => r[4] === null ? "Specialty slot 1 opens · no sourced pick yet" : r[4] ? "Then pick its specialty: <b>" + r[4] + "</b>" : "";
const cuList = (rows, done, unit, cap = 99) => '<div class="dvbh"><div class="dvbh-top"><span class="dvbh-k">Catch up</span><span class="dvbh-n">' + done + ' of ' + rows.filter(r => !r.lock).length + ' ' + unit + '</span></div><span class="dvbh-bar"><span style="width:' + (done / rows.filter(r => !r.lock).length * 100) + '%"></span></span></div>' +
  '<ul class="mk-cu">' + rows.slice(0, Math.max(cap, done + 1)).map((r, i) => '<li class="' + (r.lock ? "lock" : i < done ? "done" : "") + '">' + r.ico + '<span class="t">' + r.t + '</span>' +
    (r.lock ? '<span></span>' : i < done ? '<span class="ok" aria-label="Marked">✓</span>' : '<button type="button" class="d" aria-label="' + (r.btn || "Mark done") + ': ' + r.name + '">' + (r.btn || "Mark done") + '</button>') + '<span class="s">' + r.s + '</span></li>').join("") + '</ul>' + (rows.length > Math.max(cap, done + 1) ? '<button type="button" class="mk-more">' + (rows.length - Math.max(cap, done + 1)) + ' more</button>' : '');
`;
/* Skills (fresh reviews 2 and 11, Holly 2, 3, 8): catch-up keeps today's card. The hero is the next skill's whole jump
   (1 → 10 in one Mark spent), with its chip, priority and points bar; Coming up lists the rest of the jumps with the
   N of 141 spent bar. Nothing new in the card's shape, so no dead space. */
export const cuCard = (doneN, set = 39) => mk(CU + `
  const R = SETS["${set}"], i = ${doneN}, h = R[i], hero = $("#spHero .sphero");
  hero.querySelector(".dvico img").src = icon(h[0]);
  const nm = hero.querySelector(".spname"); nm.firstChild.textContent = h[0] + " "; nm.querySelector(".sptype").textContent = h[1]; nm.querySelector(".lvarr").textContent = "1 → " + h[2];
  const sm = hero.querySelector(".dvtext small"); sm.innerHTML = 'Available now · <span class="nw">priority #' + (i + 1) + '</span> · catch up ' + (i + 1) + ' of ' + R.length; sm.title = sm.textContent;
  hero.querySelector(".dvtrack span").style.width = "100%"; hero.querySelector(".dvbar-l").innerHTML = '<b>' + h[3] + '</b> of ' + h[3] + ' pts';
  $("#spBuy").textContent = "Mark spent · " + h[3] + " pts";
  hero.querySelectorAll(".sphint").forEach(x => x.remove());
  hero.insertAdjacentHTML("beforeend", (spec(h) ? '<p class="sphint">' + spec(h) + '</p>' : '') + (R.length - i - 1 ? '<p class="sphint">+' + (R.length - i - 1) + ' more your points cover · <button type="button" class="mk-allsp">Mark all spent</button></p>' : ''));
  const steps = R.slice(0, i).reduce((t, r) => t + r[2] - 1 + (r[1] === "Active" && r[2] >= 8 && r[4] !== "" ? 1 : 0), 0), N = 141;
  $("#spAfter").innerHTML = '<div class="dvbh"><div class="dvbh-top"><span class="dvbh-k">Coming up</span><span class="dvbh-n">' + steps + ' of ' + N + ' spent</span></div><span class="dvbh-bar"><span style="width:' + (steps / N * 100) + '%"></span></span></div><ul class="soonlist" id="spSoon">' +
    R.slice(i + 1).map(r => '<li title="' + r[3] + ' pts · available now · points covered"><span class="sname"><img class="spmini" src="' + icon(r[0]) + '" alt="">' + r[0] + ' <span class="sptype">' + r[1] + '</span> <span class="lvarr">1 → ' + r[2] + '</span></span><span class="slv now">now</span><span class="sst ok">✓</span></li>').join("") + '</ul>' +
    '';
  const lo = LEFT["${set}"] ? LEFT["${set}"] + ' pt' + (LEFT["${set}"] === 1 ? ' is' : 's are') + ' left over after these.' : 'These use every point.';
  hero.insertAdjacentHTML("beforeend", '<p class="sphint">' + (NOTE["${set}"] && i < R.length - 1 ? NOTE["${set}"] + ' ' : '') + lo + '</p>');
  $("#spBig").firstChild.textContent = 165 + (${JSON.stringify(set)} === 27 ? -69 : ${JSON.stringify(set)} === 45 ? 38 : 0) - R.slice(0, i).reduce((t, r) => t + r[3], 0);
  dispatchEvent(new Event("resize")); frame($("#spCard"));`);
/* catch-up finished (or Mark all spent): the card hands back to today's hero by itself, here by buying every open line */
export const cuDone = mk(`for (let k = 0; k < 200; k++) { const b = $("#spBuy"); if (!b) break; b.click(); } frame($("#spCard"));`);
/* Daevanion catch-up (UX audit 6; reworked after the fresh review of 4bafe69): today's card stays whole (hero next node,
   cost field, Need N more, Crystals left, node list). A strip above it says how many boards opened before you joined, and
   Mark bought ▾ lists them; marking one ticks its guide nodes (Total stays the number you type). Counts from #602. */
export const dvCatch = (doneN, open = true) => mk(`
  const B = [["Nezekan", 10, 52], ["Zikel", 6, 47], ["Vaizel", 8, 39]], done = ${doneN};
  const sp = document.createElement("div"); sp.className = "mk-strip";
  sp.innerHTML = '<span><b>' + (3 - done) + ' board' + (3 - done === 1 ? '' : 's') + '</b> opened before you joined' + (done ? ' · ' + done + ' marked' : '') + '</span><button type="button" class="mk-sb" aria-expanded="${open}">Mark bought ▾</button>' +
    (${open} ? '<div class="mk-menu" role="menu">' + B.map((b, i) => '<label' + (i < done ? ' class="off"' : '') + '><input type="checkbox"' + (i < done ? ' checked disabled' : '') + '> ' + b[0] + ' board<span>' + b[1] + ' nodes · ' + b[2] + '</span></label>').join("") + '<p class="mk-mnote">Ticks the board&rsquo;s guide nodes, so Crystals left counts them as spent. Triniel opens at Lv 40.</p></div>' : '');
  const h = $("#dvNextList"); h.parentNode.insertBefore(sp, h); $("#dvRespec").textContent = "Respec ▾";
  frame($("#dvBox"));`);
/* Stigmas catch-up: today's next-stigma block and "change" stay; the strip's Mark equipped ▾ lists the slots opened before
   you joined. Plan levels stay in the card's own lines. */
export const stCatch = (doneN, open = true) => mk(`
  const S = [["Triniel's Dagger", 22], ["Illusive Clone", 27], ["Swift Contract", 32], ["Savage Fang", 37]], done = ${doneN};
  const sp = document.createElement("div"); sp.className = "mk-strip";
  sp.innerHTML = '<span><b>' + (4 - done) + ' stigma slots</b> opened before you joined</span><button type="button" class="mk-sb" aria-expanded="${open}">Mark equipped ▾</button>' +
    (${open} ? '<div class="mk-menu" role="menu">' + S.map((x, i) => '<label' + (i < done ? ' class="off"' : '') + '><input type="checkbox"' + (i < done ? ' checked disabled' : '') + '> ' + x[0] + '<span>slot ' + (i + 1) + ' · Lv ' + x[1] + '</span></label>').join("") + '<p class="mk-mnote">Marks the slot equipped. Set its level in Slots.</p></div>' : '');
  const pb = $("#stBody .ptbig"); if (pb) pb.after(sp); else $("#stBody").prepend(sp); stRs();
  frame($("#stCard"));`);
/* the 1500 top row with all three catch-ups (Holly 9): what the row does when the Skills card is in catch-up */
export const cuRow = mk(CU + `$("#spCard").parentElement.classList.add("mk-row");`);
/* Next up keeps its level band (fresh review 3) and its button names the action the card names today */
/* option A (recommended): one card per skill, in the list's order */
export const nuStep = mk(CU + `
  const c = $("#nowStar .ns-card");
  c.querySelector("h3").innerHTML = 'Catch up: level <b>Heart Gore 1 → 10</b>';
  const ps = c.querySelectorAll(".title > p"); ps[0].innerHTML = '21 pts · then pick the specialty <b>Up to +20% Critical Hit when fewer targets are hit</b>';
  c.querySelector(".ns-btn").textContent = "Mark spent"; frame(c);`);
/* option B: one card for the whole catch-up, sending you to the Skills card */
export const nuOne = mk(CU + `
  const c = $("#nowStar .ns-card");
  c.querySelector("h3").innerHTML = 'Catch up <b>8 skills</b>';
  const ps = c.querySelectorAll(".title > p"); ps[0].innerHTML = '164 of your 165 pts · Heart Gore first';
  c.querySelector(".ns-btn").textContent = "Show in Skills"; c.querySelector(".ns-btn").classList.remove("primary"); frame(c);`);

/* ---- notes 11 and 12, with #388: the Key setup sheet. Option A (recommended): at 1500 it opens where the drawer sits,
   wider, and the page beside it stays readable (fresh review 4); on a phone it rises from the bottom and stops above the
   Level up bar and the tab bar. ---- */
const SHEET = `
  const tap = innerWidth > 600 ? "click" : "tap";
  const bot = Math.max(0, ...[...document.querySelectorAll("body *")].filter(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.position === "fixed" && e.offsetHeight && e.offsetHeight < 200 && r.bottom >= innerHeight - 1 && r.width > innerWidth * .8; }).map(e => innerHeight - e.getBoundingClientRect().top));
  document.documentElement.style.setProperty("--mk-bot", bot + "px");
  document.getElementById("sdTab").click();
  const det = [...document.querySelectorAll("#sdPanel details")].find(x => /Key setup/.test(x.textContent));
  const steps = det.querySelector("ol.macro-steps"), grid = document.getElementById("stackViz"), notes = [...det.querySelectorAll("p.tline")];
  det.insertAdjacentHTML("afterend", '<button type="button" class="mk-open-ks">Key setup ↑</button>'); det.hidden = true;
  const scrim = document.createElement("div"); scrim.className = "mk-scrim"; document.body.appendChild(scrim);
  const sh = document.createElement("section"); sh.className = "mk-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-label", "Key setup");
  sh.innerHTML = '<span class="mk-grab"></span><div class="mk-sh-head"><h2>Key setup</h2><span class="lvtag">Lv 39</span><button type="button" class="x" aria-label="Close">×</button></div><div class="mk-sh-body"><div class="mk-l"></div><div class="mk-r"></div></div>';
  document.body.appendChild(sh);
  const L = sh.querySelector(".mk-l"), R = sh.querySelector(".mk-r");
  L.appendChild(grid); R.className = "mk-r stackviz"; R.style.display = "block"; R.style.marginTop = "0";
  const sg = grid.querySelector(".kv-sugg"); if (sg) sg.textContent = "Suggested keys: Q, E and T (T holds the stack the right-click macro fires). Move the skills there yourself. Row 0 fires first; " + tap + " a key to set your own."; else grid.insertAdjacentHTML("afterbegin", '<p class="fine muted kv-sugg">Default keys. Row 0 fires first. ' + (tap === "tap" ? "Tap" : "Click") + ' a key to set your own.</p>');
  const defs = grid.querySelector(".kv-defs"), later = grid.querySelector(".st-later");
  if (steps && /Macro/.test(steps.textContent) && grid.querySelector(".kv-defs")) { R.innerHTML = '<span class="khead">Set the macro once</span>'; R.appendChild(steps); }
  if (later) L.appendChild(later); if (defs) R.appendChild(defs);
  const gn = grid.querySelector(".kv-note:not(.kv-defs)"); if (gn) R.appendChild(gn); else if (notes[0]) R.insertAdjacentHTML("beforeend", '<p class="fine">' + notes[0].textContent + '</p>');
  document.getElementById("sdTab").click();
`;
export const sheet = mk(SHEET);
export const sheetFill = mk(SHEET + `fill(sh);`);
/* option B on a phone: no sheet; Key setup stays a fold in the Build drawer, with the filled boxes */
export const sheetInDrawer = mk(`
  document.getElementById("sdTab").click();
  const det = [...document.querySelectorAll("#sdPanel details")].find(x => /Key setup/.test(x.textContent)); det.open = true; fill(det);
  det.scrollIntoView({ block: "start" });`);
/* hover (desktop) or tap (phone) on a box: the name, its key and row */
export const sheetFillTip = mk(SHEET + `fill(sh);
  const cell = [...sh.querySelectorAll(".stackviz > .sk")].find(x => /Illusive Clone/.test(x.textContent)); const r = cell.getBoundingClientRect();
  const tip = document.createElement("div"); tip.className = "mk-tip"; tip.innerHTML = 'Illusive Clone <span>· E, row 0 (fires first)</span>';
  tip.style.left = (r.left + r.width / 2 + scrollX) + "px"; tip.style.top = (r.top + scrollY) + "px"; document.body.appendChild(tip); cell.style.outline = "2px solid var(--muted)";`);
/* #388: the player picks a new key for the E stack: on a desktop by pressing it, on a phone from a picker of the keys the
   game lets you bind (D3); keys another stack of yours holds are marked */
export const sheetKey = mk(SHEET + `fill(sh);
  const keys = sh.querySelectorAll(".mk-l .kv-key"); const e = [...keys].find(k => k.textContent.trim() === "E"); e.classList.add("listen");
  if (innerWidth > 600) { e.textContent = "Press a key"; sh.querySelector(".stackviz").insertAdjacentHTML("beforeend", '<p class="mk-keyhint">Press the key you use for this stack in game. <b>Esc</b> cancels.</p>'); }
  else { const pk = document.createElement("div"); pk.className = "mk-picker"; pk.setAttribute("role", "listbox"); pk.style.bottom = "var(--mk-bot, 0px)";
    pk.innerHTML = '<h3>Key for the E stack</h3><ul>' + ["Q", "E", "R", "T", "F", "1", "2", "3", "4", "Z", "X", "C"].map(k => '<li' + (k === "E" ? ' class="on"' : k === "Q" || k === "T" ? ' class="used"' : '') + '>' + k + (k === "Q" ? '<small>Shadowstrike</small>' : k === "T" ? '<small>right click</small>' : '') + '</li>').join("") + '</ul><p>The keys you can bind in game (to check, D3). Picking a used key swaps the two.</p>';
    document.body.appendChild(pk); }`);
/* a clash: the player gives the Q stack the key T, which the right-click stack already holds (fresh review 10) */
export const sheetClash = mk(SHEET + `fill(sh);
  const keys = sh.querySelectorAll(".mk-l .kv-key"); const q = [...keys].find(k => k.textContent.trim() === "Q"); q.classList.add("listen"); q.textContent = "T";
  sh.querySelector(".stackviz").insertAdjacentHTML("beforeend", '<p class="mk-clash">T already holds the right-click stack. <button type="button">Swap them</button><button type="button">Pick another</button></p>');`);
/* after setting Shadowstrike to E and the stigma stack to R: every line that named a key follows */
export const sheetKeyDone = mk(SHEET + `fill(sh);
  const keys = sh.querySelectorAll(".mk-l .kv-key"); const q = [...keys].find(k => k.textContent.trim() === "Q"), e = [...keys].find(k => k.textContent.trim() === "E");
  q.textContent = "E"; e.textContent = "R"; q.classList.add("mine"); e.classList.add("mine");
  const sg2 = sh.querySelector(".kv-sugg"); if (sg2) sg2.textContent = "Your keys: E, R and T (T holds the stack the right-click macro fires). Move the skills there yourself. Row 0 fires first; " + tap + " a key to change it.";
  sh.querySelectorAll(".st-later .khead, .st-later .lt-where, .st-later *").forEach(x => { if (!x.children.length) x.textContent = x.textContent.replace(/\\bE\\b/g, "R"); });
  sh.querySelector(".stackviz").insertAdjacentHTML("beforeend", '<p class="mk-keyhint"><button type="button" class="mk-reset">Back to suggested keys</button></p>');`);
/* Basic: the suggested keys only, no carets, no rebinding (#388) */
export const sheetBasic = mk(SHEET + `fill(sh); sh.querySelectorAll(".mk-l .kv-key").forEach(k => { k.style.cursor = "default"; k.classList.add("nocar"); });
  const st2 = document.createElement("style"); st2.textContent = ".mk-sheet .mk-l .stackviz .kv-key.nocar::after { display: none; }"; document.head.appendChild(st2);
  const sg2 = sh.querySelector(".kv-sugg"); if (sg2) sg2.textContent = "Suggested keys: Q, E and T (T holds the stack the right-click macro fires). Move the skills there yourself. Row 0 fires first.";`);
/* the sheet scrolls inside itself; its end */
export const sheetEnd = mk(SHEET + `fill(sh); sh.scrollTop = sh.scrollHeight;`);
