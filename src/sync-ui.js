/* The sync chunk (0.8 P6, docs/ARCHITECTURE.md §4): the sync line (0.7 P6, docs/design/0.7-sync-mockup.md) with its markup
   (src/cards/sync.html), styles (src/styles/sync.css), texts (data/ui/sync-texts.json), client and HTTP host. The build
   makes it its own file (sync.<hash>.js, precached), and src/site.js loads it only when sync is shown (SYNC_LIVE or the
   test flag), so the page doesn't carry it. It runs right after site.js, as an IIFE over the page globals of main.js's
   bundle (state, webStorage, KEY), like site.js. A progress save (webStorage.set of the save's key, from main.js's
   storeState) schedules a round 30 s later; the card's own writes of a merged save don't. */
import { mountSync } from "./cards/sync.js";
import { SYNC_BASE, httpSyncHost, webSyncEnv } from "./shell/sync-host-http.js";
import SYNC_TEXTS from "../data/ui/sync-texts.json";
import SYNC_CSS from "./styles/sync.css";
import SYNC_HTML from "./cards/sync.html";
{
  /* the styles after the page's own (where the stylesheet stood), the markup at the end of the save strip (where
     cards/sync.html stood) */
  const css = document.createElement("style");
  css.textContent = SYNC_CSS;
  document.head.append(css);
  const strip = document.getElementById("xfer");
  if (strip) strip.insertAdjacentHTML("beforeend", SYNC_HTML);
  const host = httpSyncHost(SYNC_BASE, (url, init) => fetch(url, init));
  const pageSet = webStorage.set;
  let own = false;
  const ui = mountSync({
    T: SYNC_TEXTS.texts, host, env: webSyncEnv(), store: webStorage, saveKey: KEY,
    save: () => state,
    write: s => { own = true; try { return pageSet.call(webStorage, KEY, JSON.stringify(s)); } finally { own = false; } },
    reload: () => location.reload(),
    note: { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} }, remove: k => { try { sessionStorage.removeItem(k); } catch (e) {} } },
    now: () => Date.now(), wait: ms => new Promise(r => setTimeout(r, ms)),
  });
  if (ui) webStorage.set = (k, text) => { const r = pageSet.call(webStorage, k, text); if (k === KEY && !own) ui.later(); return r; };
}
