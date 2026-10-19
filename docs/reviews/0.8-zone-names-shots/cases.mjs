/* #325 (data audit): 25 zone names now cite each zone's own Metabot page instead of an inference from v1 data,
   so the Sources card's Metabot row lists 25 more pages. No guide value changed.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-zone-names-shots */
const open = () => { const c = document.getElementById('srcCard'); c.open = true; c.querySelector('details.srcg').open = true; c.scrollIntoView(); };
export default [
  { name: 'sources-metabot', width: 1400, height: 1000, mode: 'advanced', act: open, shots: [{ sel: '#srcCard details.srcg > summary' }] },
];
