/* 0.6 P10: skill icons in the Build drawer's play steps (format: tests/support/shots.mjs). Lv 22 and 45, drawer open. */
const open = () => new Promise(r => { const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) (document.getElementById('sdTab')).click(); setTimeout(r, 600); });
const shot = [{ sel: '#statDrawer' }];
export default [
  { name: 'play-lv22', width: 1500, height: 900, mode: 'advanced', save: { level: 22, open: {} }, act: open, shots: shot },
  { name: 'play-lv45', width: 1500, height: 900, mode: 'advanced', save: { level: 45, open: {} }, act: open, shots: shot },
];
