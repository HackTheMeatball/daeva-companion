/* 0.6.2 mockup (Design Lead): skill icons in the Key setup grid, and locked-card shells in Basic on desktop.
   Drawn on the real built page: each case's act() rewrites the DOM and adds one <style> to show the proposal.
   Nothing here is app code. Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-icons-locks --after-only
   Doc: docs/design/0.6.2-icons-locks-mockup.md. Only existing tokens; icons are the app's own (assets/icons). */
const css = `
.stackviz.kv-ico { grid-template-columns: 12px repeat(3, minmax(0, 1fr)); }
.stackviz.kv-ico > .sk { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: var(--space-4);
  min-height: 72px; padding: var(--space-6) var(--space-4); text-align: center; overflow-wrap: normal; word-break: normal; hyphens: none; }
.stackviz.kv-ico > .sk.empty { min-height: 72px; }
.stackviz.kv-ico > .sk img, .stackviz.kv-ico > .sk .ini { width: 32px; height: 32px; border-radius: var(--radius-6); flex: none; margin: 0; }
.stackviz.kv-ico > .sk .ini { display: grid; place-items: center; background: var(--line); font: 600 12px var(--mono); color: var(--fg); }
.stackviz.kv-ico > .sk .nm { font: 500 11px/1.25 var(--mono); }
.stackviz.kv-ico .lmb .sk { display: inline-flex; flex-direction: row; min-height: 0; gap: var(--space-6); vertical-align: middle; }
.stackviz.kv-ico .lmb .sk img { width: 24px; height: 24px; }
.lockcard .lockto { margin: var(--space-2) 0 0; font: 500 12px var(--mono); color: var(--muted); }

.stackviz.kv-ico .kv-keys { display: contents; }
.stackviz.kv-ico .kv-key { justify-self: center; min-width: 32px; padding: var(--space-2) var(--space-8); border: 1px solid var(--line); border-bottom-width: 2px; border-radius: var(--radius-6); background: var(--panel-2); font: 600 12px var(--mono); color: var(--fg); text-align: center; }
.stackviz.kv-ico .kv-key.mouse { font-size: 11px; }
.kv-change { display: block; margin: var(--space-8) 0 0 auto; background: none; border: 1px solid var(--line); border-radius: var(--radius-6); color: var(--muted); font: 600 11px var(--mono); padding: var(--space-4) var(--space-8); }
.mw { list-style: none; margin: var(--space-14) 0 0; padding: 0; display: grid; gap: var(--space-12); counter-reset: mw; }
.mw-h { font: 600 10px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: var(--space-14) 0 0; }
.mw li { counter-increment: mw; display: grid; grid-template-columns: 24px 1fr; gap: var(--space-4) var(--space-8); font-size: 13px; color: var(--fg); }
.mw li::before { content: counter(mw); grid-row: span 2; width: 22px; height: 22px; border-radius: var(--radius-round); border: 1px solid var(--line); display: grid; place-items: center; font: 600 11px var(--mono); color: var(--muted); }
.mw .path { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); }
.mw .path b { font: 500 12px var(--mono); padding: var(--space-2) var(--space-6); border: 1px solid var(--line); border-radius: var(--radius-6); background: var(--panel-2); font-weight: 500; }
.mw .path kbd { font: 600 12px var(--mono); padding: var(--space-2) var(--space-6); border: 1px solid var(--gold-55); border-bottom-width: 2px; border-radius: var(--radius-6); color: var(--gold-light); }
.mw .path i { color: var(--muted); font-style: normal; }
.mw .see { color: var(--muted); font-size: 12px; }
.mw .see q { color: var(--fg); }
.mw .macro { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.mw .macro span { display: flex; align-items: center; gap: var(--space-4); font: 500 12px var(--mono); padding: var(--space-2) var(--space-6); border: 1px solid var(--line); border-radius: var(--radius-6); }
.mw .macro img { width: 20px; height: 20px; border-radius: var(--radius-4); }
`;
const keys = new Function(`{ const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); } (${(() => {
  document.getElementById('sdTab')?.click();
  const d = document.querySelector('#statDrawer details.mini'); if (d) d.open = true;
  const map = {};
  document.querySelectorAll('#statDrawer img.spmini, #statDrawer img.st-mini').forEach(i => { const t = i.parentElement.textContent.trim().split(' ·')[0].trim(); if (t) map[t] = i.getAttribute('src'); });
  const v = document.getElementById('stackViz'); v.classList.add('kv-ico');
  v.querySelectorAll(':scope > .sk:not(.empty), .lmb .sk').forEach(c => {
    const n = c.textContent.trim(), src = map[n] || Object.entries(map).find(([k]) => k.startsWith(n))?.[1];
    const ini = n.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2);
    c.innerHTML = (src ? `<img src="${src}" alt="">` : `<span class="ini" aria-hidden="true">${ini}</span>`) + `<span class="nm">${n}</span>`;
  });
}).toString()})();`);
const locks = new Function(`{ const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); } (${(() => {
  const seg = m => document.querySelector(`.modeseg [data-mode="${m}"]`)?.click();
  seg('advanced'); seg('basic');
  document.querySelectorAll('.lockcard').forEach(s => {
    s.hidden = false;
    const line = s.querySelector('.lockline'), m = line && line.textContent.match(/Lv (\d+)/), lv = +document.getElementById('lvlNum')?.value || 0;
    if (m && !s.querySelector('.lockto')) { const left = +m[1] - (lv || 4); const p = document.createElement('p'); p.className = 'lockto'; p.textContent = left === 1 ? '1 level to go' : `${left} levels to go`; line.after(p); }
  });
}).toString()})();`);

/* k4/k5: key labels under the columns like the game's bar (player can change them), and the macro walk-through */
const keysWalk = new Function(`(${keys.toString()})(); (${(() => {
  const v = document.getElementById('stackViz');
  const heads = [...v.querySelectorAll(':scope > .khead')]; heads.forEach(h => h.remove()); v.firstElementChild?.tagName === 'SPAN' && !v.firstElementChild.className && v.firstElementChild.remove();
  const lmb = v.querySelector('.lmb');
  const row = document.createElement('div'); row.className = 'kv-keys';
  row.innerHTML = '<span></span><span class="kv-key mouse">Right click</span><span class="kv-key">Q</span><span class="kv-key">E</span>';
  v.insertBefore(row, lmb);
  const src = n => [...document.querySelectorAll('#statDrawer img')].find(i => i.closest('li, .sk')?.textContent.includes(n))?.getAttribute('src') || '';
  const ol = document.querySelector('#statDrawer .macro-steps');
  ol.outerHTML = `<p class="mw-h">Right-click macro · one-time setup</p><ol class="mw">
    <li><span class="path"><kbd>Esc</kbd><i>→</i><b>Settings</b><i>→</i><b>Key Settings</b><i>→</i><b>General</b></span><span class="see">Scroll down to Gameplay.</span></li>
    <li><span class="path"><b>Macro</b><i>→</i>press <kbd>Right click</kbd><i>→</i><b>Confirm</b></span><span class="see">You'll see <q>Already in use for [Skill Quickslot: Quick Use 2]</q>. That's expected; confirm.</span></li>
    <li><span class="path"><kbd>Esc</kbd><i>→</i><kbd>K</kbd><i>→</i><b>Macro</b> <i>(above Active)</i></span><span class="see">The first time it's empty: <q>No macros available.</q></span></li>
    <li><span class="path">Click <b>Quick Slice</b><i>→</i>set it to <b>Quickslot 2</b></span><span class="see">Quickslot 2 is the one right click now uses.</span></li>
    <li><span class="path"><b>Add Macro</b><i>→</i>add the right-click stack in order</span><span class="macro"><span><img src="${src('Heart Gore')}" alt="">1 Heart Gore</span><span><img src="${src('Ambush')}" alt="">2 Ambush</span><span><img src="${src('Savage Roar')}" alt="">3 Savage Roar</span></span></li>
    <li><span class="path">Hold <kbd>Right click</kbd> + <kbd>Left click</kbd> in a fight</span><span class="see">Right click alone drains MP; left click keeps it full.</span></li>
  </ol>`;
}).toString()})();`);
export default [
  { name: 'k1-keys-lv4-1500', width: 1500, height: 1100, mode: 'advanced', save: { level: 4 }, act: keys, shots: [{ sel: '#stackViz' }] },
  { name: 'k2-keys-lv30-1500', width: 1500, height: 1100, mode: 'advanced', save: { level: 30 }, act: keys, shots: [{ sel: '#stackViz' }] },
  { name: 'k3-keys-lv30-390', height: 1100, mode: 'advanced', save: { level: 30 }, act: keys, shots: [{ sel: '#stackViz' }] },
  { name: 'k4-keys-walk-lv4-1500', width: 1500, height: 1600, mode: 'advanced', save: { level: 4 }, act: keysWalk, shots: [{ sel: '#statDrawer details.mini' }] },
  { name: 'k5-keys-walk-lv4-390', height: 1800, mode: 'advanced', save: { level: 4 }, act: keysWalk, shots: [{ sel: '#statDrawer details.mini' }] },
  { name: 'l1-basic-lv4-1500', width: 1500, height: 900, mode: 'basic', save: { level: 4 }, act: locks },
  { name: 'l2-basic-lv2-1500', width: 1500, height: 900, mode: 'basic', save: { level: 2 }, act: locks },
];
