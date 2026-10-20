/* 0.8 P20 (#509): unverified values carry their label. Nine Wonders of Altgard: 1st Leg (Lv 22) has a disputed zone
   (Tranein Highland), so its milestone row reads "Tranein Highland  check in game"; Next up's regional quest list shows a
   quest's zone only in its tooltip, so the label is there (a still shot shows no change, so it has no case). Strongholds' level ranges are
   all inferred, so the Strongholds note says "levels inferred" once and the rows carry no tag.
   The wide rail is a sticky scroll box one viewport tall; the strongholds case lets it grow so the shot holds the whole
   open card (same for both builds).
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-p20-shots */
const save = { level: 22, quest: 'Daeva in a Dream', checks: {} };
const row = 'li.qrow:has(input[data-k="rq:2202053"])';
const openRow = () => { const li = document.querySelector('#gates li.qrow:has(input[data-k="rq:2202053"])'); const d = li.closest('details'); if (d) { d.hidden = false; d.open = true; } li.scrollIntoView({ block: 'center' }); };
const openSh = () => { const c = document.getElementById('areas'); const f = c.querySelector('details.foldcard'); if (f) f.open = true;
  const r = c.closest('aside.rail'); if (r) Object.assign(r.style, { position: 'static', maxHeight: 'none', overflow: 'visible' });
  /* a phone's sticky top bar and tab bar would be painted over a card taller than the screen */
  document.querySelectorAll('body *').forEach(e => { if (!c.contains(e) && !e.contains(c) && /fixed|sticky/.test(getComputedStyle(e).position)) e.style.visibility = 'hidden'; });
  c.scrollIntoView(); };
export default [
  { name: 'milestone-row-1500', width: 1500, height: 1000, mode: 'advanced', save, act: openRow, shots: [{ sel: '#gates ' + row }] },
  { name: 'milestone-row-390', width: 390, height: 844, mode: 'advanced', save, act: openRow, shots: [{ sel: '#gates ' + row }] },
  { name: 'strongholds-1500', width: 1500, height: 1000, mode: 'advanced', save: { ...save, areaLv: 'sh' }, act: openSh, shots: [{ sel: '#areas' }] },
  { name: 'strongholds-390', width: 390, height: 844, mode: 'advanced', save: { ...save, areaLv: 'sh' }, act: openSh, shots: [{ sel: '#areas' }] },
];
