/* 0.9 P36 (#783): the Respec tooltips match the owner's screens. A browser draws a title tooltip outside the page, so
   each case draws it as a box above the element (the element's own title text, nothing typed here). A fresh Lv 39
   Assassin on "An Ill Fate's Resolution" (as 0.9-p20-shots), Advanced, at 1500 and 390 px.
   "st": Triniel's Dagger at Lv 4 in slot 1, the Stigmas card with its Respec tip (before: "Costs Kinah in game …",
   after: free when checked at Lv 39). "dv": Nezekan marked bought (the strip's menu closed again), Respec ▾ open, the tip of its first board row
   (before: "remove the nodes one by one", after: a reset button on each board).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p36-shots */
const fresh = { level: 39, welcomed: 1, quest: "An Ill Fate's Resolution", dvTotal: 140 };
const st = { ...fresh, stPick: { 1: "Triniel's Dagger" }, stLv: { "Triniel's Dagger": 4 } };
/* click each selector in turn, then draw the title of `tip` as a tooltip box just above it, inside the shot `box` */
const act = (box, tip, ...sels) => new Function(`for (const s of ${JSON.stringify(sels)}) { const b = document.querySelector(s); if (b) b.click(); }
  const el = document.querySelector(${JSON.stringify(tip)}), r = el.getBoundingClientRect(), c = document.querySelector(${JSON.stringify(box)}).getBoundingClientRect(), d = document.createElement('div');
  d.textContent = el.title;
  d.style.cssText = 'position:absolute;z-index:9999;box-sizing:border-box;padding:4px 7px;font:12px/1.35 system-ui,sans-serif;background:#fff;color:#111;border:1px solid #777;box-shadow:0 2px 6px rgba(0,0,0,.35)';
  d.style.maxWidth = Math.min(300, c.width - 16) + 'px';
  document.body.appendChild(d);
  d.style.left = (Math.max(c.left + 8, Math.min(r.left, c.right - d.offsetWidth - 8)) + scrollX) + 'px';
  d.style.top = (r.top + scrollY - d.offsetHeight - 4) + 'px';`);
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { mode: 'advanced', width: w, height: h };
  cases.push({ name: `st-${w}`, ...a, save: st, act: act('#stCard', '#stRespec'), shots: [{ sel: '#stCard' }] });
  cases.push({ name: `dv-${w}`, ...a, save: fresh, act: act('#dvBox', '#dvRsMenu [data-dvrs]', '#dvCuBtn', '#dvCuMenu [data-dvmark]', '#dvCuBtn', '#dvRespec'), shots: [{ sel: '#dvBox' }] });
}
export default cases;
