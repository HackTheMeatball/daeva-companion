/* #721 item 1: Daevanion plan costs computed from the board for the classes with no owner costs (costBasis 'path'),
   shown pre-filled with an "inferred" tag. A Gladiator at Lv 20 with All nodes open (Nezekan and Zikel lists)  and the Assassin's Triniel list at Lv 40 (format: tests/support/shots.mjs). */
const GLAD = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
const glad20 = { level: 20, quest: 'Cemetery Cleanup', open: {}, hideCards: false, checks: {}, dvTotal: 40, dvAllOpen: true };
const asn45 = { level: 40, quest: 'Cemetery Cleanup', open: {}, hideCards: false, checks: {}, dvTotal: 140, dvAllOpen: true };
export default [1500, 390].flatMap(w => [
  ...['Nezekan', 'Zikel'].map(b => ({ name: `gladiator-${b.toLowerCase()}-${w}`, save: glad20, char: GLAD, mode: 'advanced', width: w, height: 1000,
    shots: [{ sel: '#dvAllList ul.dv-board', text: `${b} ·` }] })),
  { name: `assassin-triniel-${w}`, save: asn45, mode: 'advanced', width: w, height: 1000, shots: [{ sel: '#dvAllList ul.dv-board', text: 'Triniel ·' }] },
]);
