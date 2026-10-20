/* World boss data (1.0, research #652): the Sources card gains a "World bosses" group listing the pages behind the boss
   timers (Metabot, AION2HUB, aion2atlas, allthings.how). The timers themselves come with the 0.10 build item; nothing
   else on the page changes. Run: npm run build && node tests/support/shots.mjs docs/reviews/1.0-world-bosses-data-shots */
const open = () => { const c = document.getElementById('srcCard'); c.open = true; c.scrollIntoView(); };
export default [
  { name: 'sources-card-1400', width: 1400, height: 1400, mode: 'advanced', act: open, shots: [{ sel: '#srcCard' }] },
];
