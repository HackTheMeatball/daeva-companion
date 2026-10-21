/* 0.9 P21 (#643) one view: before (Basic / Advanced) and after (one view, folds closed) at 1500 and 390 px.
   fresh: no save (opened in Advanced before); join39: a late starter's save at Lv 39 with nothing ticked (Basic, the
   shots' default mode); adv39: a Lv 39 save in Advanced with the early milestones ticked. */
const adv39 = { level: 39, quest: 'Inevitable Encounter', checks: { 'g6:0': true, 'g9:0': true, 'g12:0': true, 'g22:0': true } };
const join39 = { level: 39, quest: 'Inevitable Encounter', checks: {} };
export default [
  { name: '1-fresh-1500', width: 1500, height: 1700 },
  { name: '2-fresh-390', width: 390, height: 2600 },
  { name: '3-join39-1500', width: 1500, height: 1700, save: join39, mode: 'basic' },
  { name: '4-join39-390', width: 390, height: 2600, save: join39, mode: 'basic' },
  { name: '5-adv39-1500', width: 1500, height: 1700, save: adv39, mode: 'advanced' },
  { name: '6-adv39-390', width: 390, height: 2600, save: adv39, mode: 'advanced' },
];
