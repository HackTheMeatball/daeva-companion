/* #325 (data audit): 49 Sealed Dungeons' band and zone (and Ascetic's Cave's) now cite each dungeon's own Metabot page
   instead of an inference from v1 data, so the Sources card's Metabot row lists 50 more pages. No guide value changed.
   Run: npm run build && node tests/support/shots.mjs docs/reviews/0.8-sd-band-zone-shots */
const open = () => { const c = document.getElementById('srcCard'); c.open = true; c.querySelector('details.srcg').open = true; c.scrollIntoView(); };
export default [
  { name: 'sources-metabot', width: 1400, height: 1000, mode: 'advanced', act: open, shots: [{ sel: '#srcCard details.srcg > summary' }] },
];
