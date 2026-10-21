/* 0.9 P20 (#642): catch-up and respec for Daevanion and Stigmas. Design Lead's mock: docs/design/0.9-catchup/
   (10-boards-*, 10-stigmas-*, 09-dv-menu-*, 09-st-respec-*). A fresh Lv 39 Assassin on "An Ill Fate's Resolution" (the
   owner's test, 2026-10-20), at 1500 and 390 px. Before: Daevanion opens on the first Nezekan node; Stigmas have no
   Respec. After: a strip above each hero ("3 boards opened before you joined · Mark bought ▾", "4 stigma slots …
   Mark equipped ▾", here opened); "dvmenu" marks Nezekan, then opens Respec ▾ (one row per board, then All boards);
   "stdone" marks every slot from the strip, the card is today's with Respec in its foot.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.9-p20-shots */
const fresh = { level: 39, welcomed: 1, quest: "An Ill Fate's Resolution", dvTotal: 140 };
const click = (...sels) => new Function(`for (const s of ${JSON.stringify(sels)}) { const b = document.querySelector(s); if (b) b.click(); }`);
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { mode: 'advanced', width: w, height: h, save: fresh };
  cases.push({ name: `dv-${w}`, ...a, act: click('#dvCuBtn'), shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `st-${w}`, ...a, act: click('#stCuBtn'), shots: [{ sel: '#stCard' }] });
  cases.push({ name: `dvmenu-${w}`, ...a, act: click('#dvCuBtn', '#dvCuMenu [data-dvmark]', '#dvRespec'), shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `stdone-${w}`, ...a, act: click('#stCuBtn', '#stCuMenu [data-stmark]:not(:disabled)', '#stCuMenu [data-stmark]:not(:disabled)', '#stCuMenu [data-stmark]:not(:disabled)', '#stCuMenu [data-stmark]:not(:disabled)'), shots: [{ sel: '#stCard' }] });
}
export default cases;
