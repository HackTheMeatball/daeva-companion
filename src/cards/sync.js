/* The sync line in the footer's save strip and its panel (0.7 P6; docs/design/0.7-sync-mockup.md, frames n1–o1, §4a).
   Site only: src/site.js mounts it with the texts (data/ui/sync-texts.json), the host adapter and the page's save; the
   claude.ai build has none of it (sync.md S4). The sync code lives only in this device's record (SYNC_KEY), never in the
   save, an Export file, the Report link, a URL or a log (sync.md §1, §3).
     o { T          texts by key (§4)
         host, env  the client's host adapter and browser env (src/shell/sync-host-http.js)
         store      get / set / remove by key (the page's storage adapter)
         save()     the page's save now;  write(save) stores a save as it is (true when stored);  reload()
         saveKey    the save's key (":before-import" keeps the save "Use the cloud copy" replaces)
         note       a session store for the one line shown after a reload (get / set / remove)
         now(), wait(ms) } */
import { SYNC_KEY, adoptRemote, deleteCloudCopy, joinSync, newSyncCode, parseSyncCode, syncKeys, syncOnce } from "../core/sync-client.js";

const SYNC_NOTE = "companion-sync-note", SYNC_DEBOUNCE = 30000;
const SYNC_TONE = { synced: "ok", offline: "warn", conflict: "warn", update: "warn", unreadable: "bad", error: "bad" };
/* "2 min ago" (§4 status.synced) */
export function syncAgo(T, ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return T["ago.now"];
  const [k, n] = s < 3600 ? ["ago.min", s / 60] : s < 86400 ? ["ago.h", s / 3600] : ["ago.d", s / 86400];
  return T[k].replace("{n}", Math.floor(n));
}
/* the last group of a code ("FF" in DC1-…-FF), what t2 asks the player to type back */
export const syncLastGroup = code => code.split("-").pop();

export function mountSync(o) {
  const T = o.T, $ = id => document.getElementById(id);
  const sw = $("syncSw"), st = $("syncSt"), now = $("syncNow"), opts = $("syncOpts"), menu = $("syncMenu"), panel = $("syncPanel"),
    msg = $("syncMsg"), reload = $("syncReload"), strip = document.querySelector("#xfer .xfer-text > span");
  if (!sw || !panel || !strip) return null;
  const stripOff = strip.textContent;
  const readRec = () => { try { const r = JSON.parse(o.store.get(SYNC_KEY)); return r && typeof r.code === "string" && parseSyncCode(r.code) ? r : null; } catch (e) { return null; } };
  const writeRec = r => o.store.set(SYNC_KEY, JSON.stringify(r));
  /* ui: the status shown ("never" | "syncing" | a client status | null = off); pending: a step on the way to "on" */
  let rec = readRec(), status = rec ? (rec.lastSyncAt ? "synced" : "never") : null, pending = false, running = null, again = false, timer = 0;

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const btn = (text, cls, fn) => { const b = el("button", "sync-btn" + (cls ? " " + cls : ""), text); b.type = "button"; b.addEventListener("click", fn); return b; };
  /* a code: each group unbreakable, a break allowed only after a hyphen, in inline flow (§4a 3) */
  const codeBox = code => { const box = el("div", "sync-code"); code.split("-").forEach((g, i) => { if (i) box.append("-", el("wbr")); box.append(el("span", "sync-grp", g)); }); return box; };
  const statusText = () => status === "synced" ? T["status.synced"].replace("{ago}", syncAgo(T, o.now() - ((rec && rec.lastSyncAt) || o.now()))) : T["status." + status];

  function paint() {
    const on = !!rec;
    sw.setAttribute("aria-checked", String(on || pending));
    strip.textContent = on ? T["strip.on"] : stripOff;
    const shown = (on || pending) && status ? statusText() : "";
    if (st.textContent !== shown) st.textContent = shown;
    st.className = "sync-st" + (shown && SYNC_TONE[status] ? " " + SYNC_TONE[status] : "");
    reload.hidden = !(on && status === "update");
    now.hidden = opts.hidden = !on;
    now.disabled = status === "syncing";
    if (!on) closeMenu();
  }
  function closeMenu() { menu.hidden = true; opts.setAttribute("aria-expanded", "false"); }
  /* one panel at a time; it takes focus and gives it back to the switch on close (§1) */
  function open(title, parts) {
    closeMenu();
    panel.replaceChildren(el("h2", "", title), ...parts);
    panel.querySelector("h2").id = "syncPanelH";
    panel.hidden = false; panel.focus();
  }
  function close() { panel.hidden = true; panel.replaceChildren(); pending = false; if (!rec) status = null; paint(); sw.focus(); }
  const say = text => { msg.textContent = text || ""; };
  const row = (...b) => { const r = el("div", "sync-row"); r.append(...b); return r; };
  const copyBtn = code => btn(T["code.copy"], "", () => { try { navigator.clipboard.writeText(code).catch(() => {}); } catch (e) { /* no clipboard: the code is on screen */ } });

  /* t1: two choices, no code made yet */
  function stepOn() {
    pending = true; status = null; say(""); paint();
    open(T["on.title"], [el("p", "", T["on.body"]), (() => { const c = el("div", "sync-choices"); c.append(btn(T["on.new"], "primary", () => stepNew(null)), btn(T["on.have"], "", stepJoin), btn(T.cancel, "quiet", close)); return c; })()]);
  }
  /* t2 / t3: the new code, shown once; "I've saved it" once the last group is typed back. old: the record a new code
     replaces (m3), whose cloud copy is deleted only then */
  function stepNew(old) {
    const code = newSyncCode(o.env), last = syncLastGroup(code);
    pending = !old; if (!old) status = "never"; paint();
    const id = "syncConfirm", lab = el("label", "sync-field", T["code.confirm"]), inp = el("input", "sync-input");
    lab.htmlFor = id; inp.id = id; inp.placeholder = T["code.confirmHint"]; inp.autocomplete = "off"; inp.spellcheck = false; inp.setAttribute("autocapitalize", "characters");
    const ok = btn(T["code.saved"], "primary", async () => {
      if (old) await deleteCloudCopy({ host: o.host, keys: await syncKeys(o.env, parseSyncCode(old.code)) });
      rec = { code }; writeRec(rec); pending = false; status = "never"; close(); round();
    });
    ok.disabled = true;
    inp.addEventListener("input", () => { ok.disabled = inp.value.trim().toUpperCase() !== last; });
    open(T["code.title"], [el("p", "", T["code.save"]), codeBox(code), row(copyBtn(code)), lab, inp, row(ok, btn(T.cancel, "quiet", close))]);
  }
  /* j1–j4: join with a code; a typo is caught here, before any request */
  function stepJoin() {
    pending = true; status = null; paint();
    const inp = el("input", "sync-input sync-codein"), err = el("p", "sync-note err"), go = btn(T["join.button"], "primary", join);
    inp.setAttribute("aria-label", T["join.field"]); inp.autocomplete = "off"; inp.spellcheck = false; inp.setAttribute("autocapitalize", "characters");
    go.disabled = true;
    const check = () => {
      const bytes = parseSyncCode(inp.value), typed = inp.value.replace(/[\s-]/g, "").length;
      go.disabled = !bytes;
      err.textContent = !bytes && typed >= 30 ? T["join.typo"] : "";
      inp.classList.toggle("err", !!err.textContent);
    };
    inp.addEventListener("input", check);
    async function join() {
      const bytes = parseSyncCode(inp.value); if (!bytes) return;
      const code = newCodeText(bytes, inp.value);
      go.disabled = true; err.textContent = "";
      const keys = await syncKeys(o.env, bytes), save = o.save();
      const r = await joinSync({ save, keys, host: o.host, env: o.env, store: s => o.write(s) });
      go.disabled = false;
      if (r.status === "adopt") { rec = { code, lastSyncAt: o.now(), etag: r.etag }; writeRec(rec); o.note.set(SYNC_NOTE, "join.adopted"); o.reload(); return; }
      if (r.status === "ask") return stepAsk(code, save, r.payload);
      err.textContent = r.status === "not-found" ? T["join.notFound"] : T["status." + r.status];
      inp.classList.toggle("err", false);
    }
    open(T["join.title"], [inp, err, row(go, btn(T.cancel, "quiet", close))]);
    inp.focus();
  }
  /* the code as the player typed it, normalized to its groups (parseSyncCode accepted it) */
  function newCodeText(bytes, typed) {
    const s = String(typed).toUpperCase().replace(/[\s-]/g, "").replace(/[IL]/g, "1").replace(/O/g, "0");
    return ["DC1", ...s.slice(3).match(/.{1,5}/g)].join("-");
  }
  /* j3: this device has progress too */
  function stepAsk(code, save, payload) {
    open(T["join.askTitle"], [el("p", "", T["join.askBody"]), row(
      btn(T["join.keepBoth"], "primary", () => { rec = { code }; writeRec(rec); pending = false; status = "never"; close(); round(); }),
      btn(T["join.useCloud"], "", () => {
        o.store.set(o.saveKey + ":before-import", JSON.stringify(save));
        if (!o.write(adoptRemote(save, payload))) return;
        rec = { code }; writeRec(rec); o.reload();
      }),
      btn(T.cancel, "quiet", close))]);
  }
  /* o1 / d1 / m3: ask before anything is lost */
  const confirmStep = (title, body, goText, cls, fn) => open(title, [el("p", "", body), row(btn(goText, cls, fn), btn(T.cancel, "quiet", close))]);
  function turnOff(text) { o.store.remove(SYNC_KEY); rec = null; status = null; clearTimeout(timer); close(); say(text); }
  async function deleteCopy() {
    const ok = await deleteCloudCopy({ host: o.host, keys: await syncKeys(o.env, parseSyncCode(rec.code)) });
    if (ok) turnOff(T["delete.done"]); else { status = "error"; close(); }
  }
  const MENU = [
    ["opt.show", "", () => open(T["code.title"], [codeBox(rec.code), row(copyBtn(rec.code), btn(T["code.hide"], "quiet", close))])],
    ["opt.new", "", () => confirmStep(T["new.title"], T["new.body"], T["new.go"], "primary", () => stepNew(rec))],
    ["opt.delete", "danger", () => confirmStep(T["delete.title"], T["delete.body"], T["opt.delete"], "danger", deleteCopy)],
    ["opt.off", "", () => confirmStep(T["off.title"], T["off.body"], T["opt.off"], "danger", () => turnOff(""))],
  ];
  menu.setAttribute("aria-label", T.options);
  menu.append(...MENU.map(([k, cls, fn]) => btn(T[k], cls, () => { if (rec) fn(); })));

  /* one sync round at a time (sync.md §2); a trigger during a round runs one more after it */
  async function round() {
    if (!rec) return;
    if (running) { again = true; return running; }
    running = (async () => {
      const mine = rec;
      status = "syncing"; paint();
      let merged = null;
      const keys = await syncKeys(o.env, parseSyncCode(mine.code));
      const r = await syncOnce({ save: o.save(), keys, host: o.host, env: o.env, store: s => { merged = s; }, wait: o.wait });
      if (rec !== mine) return;
      if (merged) o.write(r.save);
      status = r.status;
      if (r.status === "synced") { rec = { ...rec, lastSyncAt: o.now(), etag: r.etag }; writeRec(rec); }
      paint();
      /* another device's progress came in: reload so every card shows it (as Import and the character switch do) */
      if (merged) o.reload();
    })();
    try { await running; } finally { running = null; }
    if (again) { again = false; return round(); }
  }
  /* triggers (sync.md §1): load, 30 s after a progress save, the page hidden, back online, Sync now */
  const later = () => { if (!rec) return; clearTimeout(timer); timer = setTimeout(round, SYNC_DEBOUNCE); };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") round(); });
  addEventListener("online", () => round());
  now.addEventListener("click", () => round());
  reload.addEventListener("click", () => o.reload());
  sw.addEventListener("click", () => {
    say("");
    if (!panel.hidden) return close();
    if (rec) confirmStep(T["off.title"], T["off.body"], T["opt.off"], "danger", () => turnOff("")); else stepOn();
  });
  opts.addEventListener("click", () => { const show = menu.hidden; menu.hidden = !show; opts.setAttribute("aria-expanded", String(show)); if (show) panel.hidden = true; });
  panel.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); close(); } });
  menu.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); opts.focus(); } });
  setInterval(() => { if (status === "synced") paint(); }, 60000);

  $("syncLbl").textContent = T.label;
  now.textContent = T.now; opts.textContent = T.options + " ▾"; reload.textContent = T["status.reload"];
  const note = o.note.get(SYNC_NOTE); if (note) { o.note.remove(SYNC_NOTE); say(T[note]); }
  paint();
  round();
  return { round, later };
}
