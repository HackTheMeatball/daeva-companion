/* 0.8.1 F3 (#593, owner note 6): specialty rows placed by effective skill level. Milestone shots: the Quick Slice and
   Shadowstrike slot 1 rows move from Lv 19 to Lv 16, Insignia Explosion slot 1 from Lv 32 to Lv 26 (milestone g27).
   Next up shot: the research check (docs/research/2026-10-effective-skill-level.md): Lv 39, Heart Gore lines 2–10 and
   its first two plan nodes ticked, so its slot 2 is open; after F3 the open specialty slots lead the skill queue.
   Format: tests/support/shots.mjs. */
const hg = Array.from({ length: 9 }, (_, i) => `sp:Heart Gore:${i + 2}`);
const research = { level: 39, stones: 200, welcomed: 1, checks: Object.fromEntries([...hg, 'dv:hg', 'dv:z:hg'].map(k => [k, true])) };
/* the whole Next up stack, so the slot 2 card below the first shows too */
const unroll = () => { const s = document.createElement('style'); s.textContent = '#nowStar .ns-stack { height: auto !important; overflow: visible !important; mask-image: none !important; -webkit-mask-image: none !important; transition: none !important; }'; document.head.append(s); };
const ms = g => ({ level: 15, welcomed: 1, open: { [g]: true } });

export default [
  { name: 'milestone-lv16-1500', width: 1500, height: 1600, mode: 'advanced', save: ms('g16'), shots: [{ sel: '#g16' }] },
  { name: 'milestone-lv26-1500', width: 1500, height: 1600, mode: 'advanced', save: ms('g27'), shots: [{ sel: '#g27' }] },
  { name: 'nextup-slot2-1500', width: 1500, height: 1200, mode: 'advanced', save: research, act: unroll, shots: [{ sel: '#nowStar' }] },
  { name: 'nextup-slot2-390', width: 390, height: 1400, mode: 'advanced', save: research, shots: [{ sel: '#nowStar' }] },
];
