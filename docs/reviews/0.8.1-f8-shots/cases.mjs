/* 0.8.1 F8 (#605, owner note 8): the recommended specialty in Next up's skill steps, also after a Skills Respec; the
   Skills hero hint counts from the header's points when the hero is short.
   nextup-step: Heart Gore at line 7, every other line and slot bought, at the level its line 8 opens: "Buy Heart Gore
   7 → 8" takes it to skill Lv 8, slot 1, and now names the pick.
   nextup-respec: a fresh Lv 39, Mark all spent, then Skills Respec (picks kept): the catch-up steps that level the
   skills back up now say each pick is kept.
   skills-hint: a fresh Lv 39 after Mark all spent: the hero (Insignia Explosion 9 → 10) is short; the hint counted as if
   it were bought ("0 pts left" beside "1 pt to spend").
   Format: tests/support/shots.mjs. Each act runs alone in the page (serialized), so it holds its own unroll style. */
const step = () => { const c = char(state), hg = SP_STEPS.find(x => x.s.n === 'Heart Gore').s;
  c.level = SP_STEPS.find(x => x.s === hg && x.L === 8).req;
  SP_STEPS.forEach(x => { c.checks[x.k] = x.s !== hg || (!x.spec && x.L <= 7); });
  SP_SLOTS.forEach(x => { c.checks[x.k] = x.s !== hg && x.slot === 2; });
  c.stones = 2000; save(); render(); update();
  const s = document.createElement('style'); s.textContent = '#nowStar .ns-stack { height: auto !important; overflow: visible !important; mask-image: none !important; -webkit-mask-image: none !important; transition: none !important; }'; document.head.append(s); };
const respec = async () => { document.getElementById('spBuyAll').click(); await new Promise(r => setTimeout(r, 300));
  const b = document.getElementById('spRespec'); b.click(); b.click(); await new Promise(r => setTimeout(r, 300));
  const s = document.createElement('style'); s.textContent = '#nowStar .ns-stack { height: auto !important; overflow: visible !important; mask-image: none !important; -webkit-mask-image: none !important; transition: none !important; }'; document.head.append(s); };
const allSpent = async () => { document.getElementById('spBuyAll').click(); await new Promise(r => setTimeout(r, 300)); };
const fresh39 = { level: 39, welcomed: 1, checks: {}, quest: "An Ill Fate's Resolution" };

export default [
  { name: 'nextup-step-1500', width: 1500, height: 1200, mode: 'advanced', save: { level: 20, welcomed: 1, checks: {} }, act: step, shots: [{ sel: '#nowStar' }] },
  { name: 'nextup-step-390', width: 390, height: 1400, mode: 'advanced', save: { level: 20, welcomed: 1, checks: {} }, act: step, shots: [{ sel: '#nowStar' }] },
  { name: 'nextup-respec-1500', width: 1500, height: 1400, mode: 'advanced', save: fresh39, act: respec, shots: [{ sel: '#nowStar' }] },
  { name: 'nextup-respec-390', width: 390, height: 1600, mode: 'advanced', save: fresh39, act: respec, shots: [{ sel: '#nowStar' }] },
  { name: 'skills-hint-390', width: 390, height: 1400, mode: 'advanced', save: fresh39, act: allSpent, shots: [{ sel: '#spCard' }] },
];
