/* 0.10 world boss timers mockup (docs/design/0.10-world-boss-timers.md): a rail card at Lv 45, and a Next up card for
   the Executors or Nahma from 30 min before they spawn until their up window ends (only once the owner has confirmed the
   server clock). Design Lead (Jane); mockup only, injected into today's build. Reworked after the outside critic
   (design-review/critic-0.10-world-boss-timers.md).
   Run: npm run build && node tests/support/shots.mjs docs/design/0.10-world-boss-timers --after-only
   Times are for a player on US Eastern (UTC-4) with the research's server clock (UTC+9, #652), at a fixed "now" per frame. */
const lv45 = { level: 45, welcomed: 1 };

const COMMON = `
const $ = s => document.querySelector(s);
if (!document.getElementById("mk-wb-css")) { const st = document.createElement("style"); st.id = "mk-wb-css"; st.textContent = \`
.wb ul { list-style: none; margin: 0 0 var(--space-6); padding: 0; }
.wb li { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: var(--space-2) var(--space-10); align-items: center; padding: var(--space-8) 0; border-top: 1px solid var(--line); }
.wb li:first-child { border-top: 0; }
.wb .n { font: 600 14px var(--body); color: var(--fg); min-width: 0; }
.wb .n .ss-tag { margin-left: var(--space-4); font-size: 11px; }
.wb .c { font: 600 13px var(--mono); color: var(--fg); text-align: right; white-space: nowrap; }
.wb .s, .wb .t { font: 400 12px var(--body); color: var(--muted); }
.wb .t { text-align: right; white-space: nowrap; font-family: var(--mono); font-size: 11px; }
.wb li.up .c { color: var(--good); }
.wb li.soon .c { color: var(--accent-text); }
.wb .sub { display: flex; align-items: center; gap: var(--space-8); }
.wb .chk { margin-left: auto; font: 600 10px var(--mono); letter-spacing: .06em; text-transform: none; color: var(--warn); border: 1px solid var(--warn); border-radius: var(--radius-pill); padding: 2px var(--space-8); background: none; cursor: pointer; min-height: 24px; white-space: nowrap; flex: none; }
.wb .chk-why { font: 400 12px var(--body); color: var(--muted); margin: 0 0 var(--space-6); padding: var(--space-6) var(--space-10); border-left: 2px solid var(--warn); }
.wb .kb { font: 600 11px var(--mono); padding: var(--space-4) var(--space-10); min-height: 32px; border-radius: var(--radius-pill); border: 1px solid var(--line); background: var(--panel); color: var(--fg); cursor: pointer; }
.wb .kb.go { color: var(--fg); }
.wb .ud { grid-column: 1 / -1; justify-self: end; }
.wb .wb-foot { font: 400 11.5px var(--body); color: var(--muted); margin: var(--space-6) 0 0; }
.wb .wb-menu { grid-column: 1 / -1; display: grid; gap: var(--space-8); margin-top: var(--space-6); padding: var(--space-8) var(--space-10); border: 1px solid var(--line); border-radius: var(--radius-8); background: var(--panel-2); font: 400 12.5px var(--body); color: var(--fg); }
.wb .wb-menu .row { display: flex; flex-wrap: wrap; gap: var(--space-6); align-items: center; }
.wb .wb-menu label { display: flex; flex-wrap: wrap; gap: var(--space-6); align-items: center; }
.wb .wb-menu input { width: 3.4em; font: 600 13px var(--mono); padding: var(--space-4); min-height: 32px; border: 1px solid var(--line); border-radius: var(--radius-6); background: var(--panel); color: var(--fg); text-align: right; }
.wb .wb-menu input[type=time] { width: auto; }
.wb .wb-menu small { color: var(--muted); font-size: 11.5px; }
.wb .wb-menu .x { margin-left: auto; }
@media (max-width: 700px) { .wb .kb, .wb .chk, .wb .wb-menu input { min-height: 44px; } .wb .kb { padding: 0 var(--space-12, 12px); font-size: 12px; } }
.ns-card.mk-boss .num { font-size: 20px; }
.ns-card.mk-boss .ns-mhead { align-items: start; }
.ns-card.mk-boss .num, .ns-card.mk-boss .meta { align-self: start !important; }
.wb .nsx { grid-column: 1 / -1; font: 400 12px var(--body); color: var(--muted); display: flex; gap: var(--space-8); align-items: center; }
.ns-card.mk-boss .ns-btn { background: var(--panel) !important; color: var(--fg) !important; border: 1px solid var(--line) !important; box-shadow: none !important; font-size: 13px; min-height: 44px; padding: 0 var(--space-12, 12px); }
.mk-menu { z-index: 5; min-width: 240px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-10); box-shadow: var(--shadow-float); padding: var(--space-6); display: grid; gap: var(--space-2); }
.mk-menu button { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: var(--space-10); align-items: baseline; text-align: left; background: transparent; border: 0; border-radius: var(--radius-6); padding: var(--space-8) var(--space-10); min-height: 44px; color: var(--fg); font: 500 13px var(--body); cursor: pointer; }
.mk-menu button span { font: 500 11px var(--mono); color: var(--muted); }
#nsqWrap, #nowStar { overflow: visible !important; }
\`; document.head.append(st); }
const row = (n, s, c, t, cls = "", lbl = "") => '<li class="' + cls + '"' + (lbl ? ' aria-label="' + lbl + '"' : '') + '><span class="n">' + n + '</span><span class="c">' + c + '</span><span class="s">' + s + '</span><span class="t">' + t + '</span></li>';
const card = (o) => {
  const sec = document.createElement("section"); sec.className = "card wb"; sec.setAttribute("aria-label", "World bosses");
  sec.innerHTML = '<h2>World bosses</h2>' +
    '<p class="where-sub sub"><span>Abyss · Chaotic Lower Reshanta</span>' + (o.ok ? '' : '<button type="button" class="chk" aria-expanded="' + (o.why ? 'true' : 'false') + '">check in game</button>') + '</p>' +
    (o.why ? '<p class="chk-why">These times assume one server clock (UTC+9) for every Global region. One source says each region keeps its own. Until that&rsquo;s checked in game, they don&rsquo;t go in Next up.</p>' : '') +
    '<ul>' + o.abyss + '</ul>' +
    '<p class="where-sub">Field bosses · Altgard</p><ul>' + o.field + '</ul>' +
    '<p class="wb-foot">In your time zone (Eastern). Field bosses count from the kill you mark.</p>';
  const rail = $("aside.rail"), j = rail.querySelector("section.where") || rail.querySelector("section"); j.after(sec);
  if (innerWidth < 700) { const ns = $("#nowStar"); ns.after(sec); }
  if (o.keep) { if (innerWidth >= 700) rail.scrollTop = sec.offsetTop - 12; else { sec.scrollIntoView({ block: "start" }); scrollBy(0, -90); } }
  else { sec.scrollIntoView({ block: o.block || "start" }); if (innerWidth < 700) scrollBy(0, -90); }
  return sec;
};
const watcher = (c, t, cls) => row('Watcher Kaira', 'Every 3 h · up 30 min', c, t, cls, 'Watcher Kaira, ' + c + ', ' + t);
const exec = (c, t, cls) => row('Executors', 'Argo, Kaira, Tamasa · Mon, Thu, Sat', c, t, cls, 'Executors, ' + c + ', ' + t);
const nahma = (c, t) => row('Guardian Lord Nahma<span class="ss-tag" title="Two sources list an Abyss Siege Boss in this slot; that it is Nahma is inferred.">inferred</span>', 'Reshanta&rsquo;s Root · Fri, Sun', c, t, '', 'Guardian Lord Nahma, ' + c + ', ' + t);
const killed = '<button type="button" class="kb" aria-haspopup="true" aria-expanded="false">Killed ▾</button>';
/* field boss states: blank (Killed), counting (time + Undo), may be up (since + Killed); a row resets one cooldown after "may be up" */
const fb = (n, h, st) => {
  if (st && st[0] === 'may') return row(n, 'May be up since ' + st[1] + ' · respawns ' + h + ' after a kill', killed, '', '', n + ', may be up since ' + st[1]);
  return row(n, 'Respawns ' + h + ' after a kill', !st ? killed : st[1], !st ? '' : st[2], '', '').replace('</li>', st ? '<span class="ud"><button type="button" class="kb">Undo kill</button></span></li>' : '</li>');
};
`;
const mk = body => new Function(COMMON + body);

/* Wed 7:42 PM ET: nothing close; field bosses not marked */
const base = mk(`card({ abyss: watcher('in 1 h 18 min', 'today 9:00 PM') + exec('in 12 h 48 min', 'tomorrow 8:30 AM') + nahma('in 1 d 12 h', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h') + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });`);
/* "check in game" opened: one line, inline, so it works on touch */
const why = mk(`card({ why: true, abyss: watcher('in 1 h 18 min', 'today 9:00 PM') + exec('in 12 h 48 min', 'tomorrow 8:30 AM') + nahma('in 1 d 12 h', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h') + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });`);
/* the Killed menu open on Silent Dartan: Just now, a time, or the game's Time Left; Cancel */
const menu = mk(`const s = card({ abyss: watcher('in 1 h 18 min', 'today 9:00 PM') + exec('in 12 h 48 min', 'tomorrow 8:30 AM') + nahma('in 1 d 12 h', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h') + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h'), block: 'center' });
  const li = s.querySelectorAll('ul')[1].children[0], b = li.querySelector('.kb'); b.setAttribute('aria-expanded', 'true'); b.textContent = 'Killed ▴';
  const m = document.createElement('div'); m.className = 'wb-menu'; m.setAttribute('role', 'group'); m.setAttribute('aria-label', 'When was Silent Dartan killed');
  m.innerHTML = '<div class="row"><button type="button" class="kb">Just now</button><label>At <input type="time" value="19:30" aria-label="Kill time"></label></div>' +
    '<label>Or the game&rsquo;s Time Left <span><input inputmode="numeric" value="4" aria-label="Hours left"> h <input inputmode="numeric" value="12" aria-label="Minutes left"> min</span></label>' +
    '<small>Exploration → Field Boss shows Time Left on your server.</small>' +
    '<div class="row"><button type="button" class="kb">Save</button><button type="button" class="kb x">Cancel</button></div>';
  li.append(m);`);
/* Wed 9:12 PM: Silent Dartan marked (counting), Watcher Kaira up now */
const running = mk(`card({ abyss: watcher('up · 18 min left', 'until 9:30 PM', 'up') + exec('in 11 h 18 min', 'tomorrow 8:30 AM') + nahma('in 1 d 10 h', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h', ['count', 'in 4 h 12 min', 'tomorrow ~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });`);
/* Thu 8:12 AM, clock confirmed by the owner: the Executors lead Next up from 30 min before until their window ends; the
   card row is a button to Next up, with no countdown of its own. Silent Dartan's cooldown has passed: "may be up". */
const nuCard = (h3, p) => `
  const a = $("#nsqWrap article.ns-card.first"); a.classList.add("mk-boss");
  a.querySelector(".ns-band").textContent = "Abyss · Lv 45+";
  a.querySelector(".num").innerHTML = "◷";
  a.querySelector(".title").innerHTML = '${h3}<p>${p}</p>';
  a.querySelector(".meta").innerHTML = '<button type="button" class="ns-btn" aria-haspopup="true">Skip ▾</button>';`;
const soon = mk(nuCard('<h3>Executors spawn in <b>18 min</b></h3>', '8:30 AM · Argo, Kaira and Tamasa in Chaotic Lower Reshanta') + `
  card({ ok: true, keep: true, abyss: watcher('in 48 min', 'today 9:00 AM') + row('Executors', 'Argo, Kaira, Tamasa · Mon, Thu, Sat', '<button type="button" class="kb go">In Next up</button>', '', '', 'Executors, in Next up') + nahma('in 23 h 48 min', 'Fri 8:00 AM'),
    field: fb('Silent Dartan', '6 h', ['may', '~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });
  $("#nowStar").scrollIntoView({ block: "start" }); scrollBy(0, -60);`);
/* Thu 8:41 AM: the Executors are up; Next up keeps them until the window ends (30 min, inferred) */
const upNow = mk(nuCard('<h3>Executors are up</h3>', 'Since 8:30 AM · about 19 min left (inferred) · Argo, Kaira and Tamasa in Chaotic Lower Reshanta') + `
  card({ ok: true, keep: true, abyss: watcher('in 19 min', 'today 9:00 AM') + row('Executors', 'Argo, Kaira, Tamasa · Mon, Thu, Sat', '<button type="button" class="kb go">In Next up</button>', '', '', 'Executors, in Next up') + nahma('in 23 h 19 min', 'Fri 8:00 AM'),
    field: fb('Silent Dartan', '6 h', ['may', '~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });
  $("#nowStar").scrollIntoView({ block: "start" }); scrollBy(0, -60);`);
/* Skip ▾ open: this spawn, or never suggest this boss (undoable from the card) */
const skip = mk(nuCard('<h3>Executors spawn in <b>18 min</b></h3>', '8:30 AM · Argo, Kaira and Tamasa in Chaotic Lower Reshanta') + `
  const m = document.createElement('div'); m.className = 'mk-menu'; m.setAttribute('role', 'menu'); m.style.cssText = 'margin-top: var(--space-8); max-width: 360px;';
  m.innerHTML = '<button type="button" role="menuitem">Skip this spawn<span>8:30 AM</span></button><button type="button" role="menuitem">Don&rsquo;t suggest the Executors<span>undo in the card</span></button>';
  a.querySelector('.title').append(m); a.querySelector('.ns-btn').setAttribute('aria-expanded', 'true'); a.querySelector('.ns-btn').textContent = 'Skip ▴';
  card({ ok: true, keep: true, abyss: watcher('in 48 min', 'today 9:00 AM') + row('Executors', 'Argo, Kaira, Tamasa · Mon, Thu, Sat', '<button type="button" class="kb go">In Next up</button>', '', '', 'Executors, in Next up') + nahma('in 23 h 48 min', 'Fri 8:00 AM'),
    field: fb('Silent Dartan', '6 h', ['may', '~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });
  $("#nowStar").scrollIntoView({ block: "start" }); scrollBy(0, -60);`);

/* after "Skip this spawn": Next up is back to its own list; the row shows the countdown again with an Undo */
const skipped = mk(`card({ ok: true, keep: true, abyss: watcher('in 48 min', 'today 9:00 AM') + exec('in 18 min', 'today 8:30 AM', 'soon').replace('</li>', '<span class="nsx">Skipped in Next up <button type="button" class="kb">Undo</button></span></li>') + nahma('in 23 h 48 min', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h', ['may', '~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });`);
/* after "Don't suggest the Executors": lasting, said once on the row, undone there */
const nosug = mk(`card({ ok: true, keep: true, abyss: watcher('in 48 min', 'today 9:00 AM') + exec('in 18 min', 'today 8:30 AM', 'soon').replace('</li>', '<span class="nsx">Not suggested in Next up <button type="button" class="kb">Suggest again</button></span></li>') + nahma('in 23 h 48 min', 'Fri 8:00 AM'),
  field: fb('Silent Dartan', '6 h', ['may', '~1:24 AM']) + fb('Soul Ruler Kashapa', '6 h') + fb('High Commander Lagta', '12 h') });`);

const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { save: lv45, mode: 'advanced', width: w, height: h };
  cases.push({ name: `wb-card-${w}`, ...a, act: base });
  cases.push({ name: `wb-check-why-${w}`, ...a, act: why });
  cases.push({ name: `wb-killed-menu-${w}`, ...a, act: menu });
  cases.push({ name: `wb-running-${w}`, ...a, act: running });
  cases.push({ name: `wb-nextup-soon-${w}`, ...a, act: soon });
  cases.push({ name: `wb-nextup-up-${w}`, ...a, act: upNow });
  cases.push({ name: `wb-nextup-skip-${w}`, ...a, act: skip });
  cases.push({ name: `wb-skipped-${w}`, ...a, act: skipped });
  cases.push({ name: `wb-not-suggested-${w}`, ...a, act: nosug });
}
cases.push({ name: 'wb-card-360', save: lv45, mode: 'advanced', width: 360, height: 800, act: base });
export default cases;
