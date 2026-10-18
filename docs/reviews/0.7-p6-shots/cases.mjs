/* 0.7 P6: the sync line in the footer's save strip (mockup docs/design/0.7-sync-mockup.md, owner-ok-0.7-S2). Only the
   steps that need no host are shot (the shot script has no fake host and must never reach the real one): n1 off, t1 the
   switch flipped, t2 a new code (a fresh random code each run), j1 a code with a typo. Before: today's strip (no sync line;
   the acts find nothing to click). Each act runs in the page on its own. Format: tests/support/shots.mjs. */
const strip = [{ sel: '#xfer' }];
export default [
  { name: 'n1-off-390', height: 1100, shots: strip },
  { name: 'n1-off-advanced-1500', width: 1500, height: 1000, mode: 'advanced', save: { level: 27 }, shots: strip },
  { name: 't1-switch-on-390', height: 1100, shots: strip, act: () => { document.getElementById('dcsSw')?.click(); } },
  { name: 't2-new-code-390', height: 1100, shots: strip,
    act: () => { document.getElementById('dcsSw')?.click(); [...document.querySelectorAll('#dcsPanel button')].find(b => b.textContent === 'Make a new sync code')?.click(); } },
  { name: 'j1-typo-390', height: 1100, shots: strip,
    act: () => { document.getElementById('dcsSw')?.click(); [...document.querySelectorAll('#dcsPanel button')].find(b => b.textContent === 'I have a sync code')?.click();
      const i = document.querySelector('.sync-codein'); if (i) { i.value = 'DC1-AAAAA-BBBBB-CCCCC-DDDDD-EEEEE-F0'; i.dispatchEvent(new Event('input', { bubbles: true })); } } },
];
