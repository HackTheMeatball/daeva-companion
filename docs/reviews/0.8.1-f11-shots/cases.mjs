/* 0.8.1 F11 (#691): Next up on desktop at Lv 44 (Advanced, on Forgotten Commander), scrolled to its tallest card (the
   Regional quests card), after ticking a milestone row that leaves Next up unchanged (a Skills row). Before: the stack
   shrinks to the first card's height and clips the card shown; after: it still fits that card. Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8.1-f11-shots */
const act = async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms)), stack = () => document.getElementById('nsqWrap');
  /* scroll the stack to its tallest card after the first and let its own fit settle */
  const toTall = async () => { const w = stack(), cs = [...w.children]; let n = 1; cs.forEach((c, i) => { if (i && c.offsetHeight > cs[n].offsetHeight) n = i; });
    w.scrollTop = cs[n].offsetTop - cs[0].offsetTop; await sleep(600); };
  await toTall();
  /* the first milestone tick that doesn't redraw Next up (a redraw replaces the stack node and resets the scroll); a tick
     that does is taken back */
  for (const i of [...document.querySelectorAll('#gates input[data-k]:not(:checked)')].slice(0, 40)) {
    stack().f11 = 1; i.click(); await sleep(600); if (stack().f11 === 1) return;
    i.click(); await sleep(600); await toTall();
  }
};
export default [
  { name: 'nextup-tall-card-after-tick-1500', width: 1500, height: 1000, mode: 'advanced', save: { level: 44, checks: {}, welcomed: 1, showObj: true, showTalk: true, quest: 'Forgotten Commander' }, act, shots: [{ sel: '#nowStar' }] },
];
