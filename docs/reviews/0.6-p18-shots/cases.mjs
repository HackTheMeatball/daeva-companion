/* 0.6 P18: game terms explained (mockup docs/design/0.6-onboarding-mockup.md §1.4, T1 / DT1, owner-ok-S1). A Lv 22
   character in Advanced: the Skills card with its two footers open, the "Daevanion" note open (phone, T1) and the
   "specialty" one (desktop, DT1); the Stigmas card's Slots with the "stigma" note open. Before: the same cards, plain
   words (the marks don't exist there, so the act only opens the footers). Format: tests/support/shots.mjs; an act runs
   in the page, so each names its card and term itself. */
const save = { level: 22, quest: 'Cemetery Cleanup', checks: {} };
export default [
  { name: 't1-skills-daevanion-advanced-390', save, mode: 'advanced', height: 1400, shots: [{ sel: '#spCard' }],
    act: () => { document.querySelectorAll('#spCard details').forEach(d => { d.open = true; }); document.querySelector('#spCard button.term[data-term="term:daevanion"]')?.click(); } },
  { name: 'dt1-skills-specialty-advanced-1500', save, mode: 'advanced', width: 1500, height: 1200, shots: [{ sel: '#spCard' }],
    act: () => { document.querySelectorAll('#spCard details').forEach(d => { d.open = true; }); document.querySelector('#spCard button.term[data-term="term:specialty"]')?.click(); } },
  { name: 'stigmas-stigma-advanced-390', save, mode: 'advanced', height: 1400, shots: [{ sel: '#stCard' }],
    act: () => { document.querySelectorAll('#stCard details').forEach(d => { d.open = true; }); document.querySelector('#stCard button.term[data-term="term:stigma"]')?.click(); } },
];
