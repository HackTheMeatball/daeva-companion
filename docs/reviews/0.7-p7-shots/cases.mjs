/* 0.7 P7 (#379): the join field shows the whole code on a phone (a 2-row textarea that wraps after hyphens; it was a
   one-line input that cut the code off). j1 at 390 and 1500 are the change; m1 (the Advanced options menu) is shot at 390 for
   the Design Lead, who found #378 had none. The shot script has no fake host and must never reach the real one, so m1 stubs
   fetch to fail before the code is confirmed (the line then reads offline). s2 (the synced line) needs a host that answers,
   so it stays with tests/site.js and is not shot here. Format: tests/support/shots.mjs. */
const strip = [{ sel: '#xfer' }];
const join = () => {
  document.getElementById('dcsSw')?.click(); [...document.querySelectorAll('#dcsPanel button')].find(b => b.textContent === 'I have a sync code')?.click();
  const i = document.querySelector('.sync-codein'); if (i) { i.value = 'DC1-AAAAA-BBBBB-CCCCC-DDDDD-EEEEE-F0'; i.dispatchEvent(new Event('input', { bubbles: true })); }
};
export default [
  { name: 'j1-typo-390', height: 1100, shots: strip, act: join },
  { name: 'j1-typo-1500', width: 1500, height: 1000, mode: 'advanced', save: { level: 27 }, shots: strip, act: join },
  { name: 'm1-options-advanced-390', height: 1100, mode: 'advanced', save: { level: 27 }, shots: strip,
    act: () => {
      window.fetch = () => Promise.reject(new TypeError('offline (shot script: no host)'));
      document.getElementById('dcsSw')?.click(); [...document.querySelectorAll('#dcsPanel button')].find(b => b.textContent === 'Make a new sync code')?.click();
      const code = document.querySelector('#dcsPanel .sync-code')?.textContent.replace(/\s/g, ''), c = document.getElementById('dcsConfirm');
      if (c && code) { c.value = code.split('-').pop(); c.dispatchEvent(new Event('input', { bubbles: true })); }
      [...document.querySelectorAll('#dcsPanel button')].find(b => /saved/i.test(b.textContent))?.click();
      document.getElementById('dcsOpts')?.click();
    } },
];
