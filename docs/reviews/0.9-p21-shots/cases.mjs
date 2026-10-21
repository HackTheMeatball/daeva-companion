/* 0.9 P21 (#643) one view: before (Basic / Advanced) and after (one view, folds closed) at 1500 and 390 px.
   fresh: no save (opened in Advanced before); join39: a late starter's save at Lv 39 with nothing ticked (Basic, the
   shots' default mode); adv39: a Lv 39 save in Advanced with the early milestones ticked.
   7- to 14-: each fold open (the spec's "folds open" check, docs/design/0.9-one-view.md), next to today's Advanced, so
   every Advanced element can be found one tap away. Each shoots the card that holds the fold. */
const adv39 = { level: 39, quest: 'Inevitable Encounter', checks: { 'g6:0': true, 'g9:0': true, 'g12:0': true, 'g22:0': true } };
const join39 = { level: 39, quest: 'Inevitable Encounter', checks: {} };
/* a sync record with a well-formed code (all-zero bytes); the sync server is offline in shots (`sync: true`) */
const syncOn = { 'companion-sync-v1': JSON.stringify({ code: 'DC1-00000-00000-00000-00000-00000-00' }) };
/* open the first "Done and optional (N)" fold of a shown step (the after build only: the before build has none); in
   adv39 that is g6 (Lv 6, its first row ticked), the step 9- shoots. Every step under Lv 40 shows: they are overdue */
const openDone = () => { const b = [...document.querySelectorAll('#gates .done-fold:not([hidden])')].find(x => x.offsetParent); if (b) b.click(); };
const open = (name, o, extra = {}) => [1500, 390].map(width => ({ name: `${name}-${width}`, width, height: width > 900 ? 1700 : 2600, mode: 'advanced', ...extra, save: { ...adv39, ...(extra.save || {}), open: o } }));
/* adv39's Next up has nothing to fold (all 13 cards lead); at Lv 1 the Later and advice cards fill "More you could do (4)" */
const lv1 = { level: 1, quest: undefined, checks: {} };
export default [
  { name: '1-fresh-1500', width: 1500, height: 1700 },
  { name: '2-fresh-390', width: 390, height: 2600 },
  { name: '3-join39-1500', width: 1500, height: 1700, save: join39, mode: 'basic' },
  { name: '4-join39-390', width: 390, height: 2600, save: join39, mode: 'basic' },
  { name: '5-adv39-1500', width: 1500, height: 1700, save: adv39, mode: 'advanced' },
  { name: '6-adv39-390', width: 390, height: 2600, save: adv39, mode: 'advanced' },
  ...open('7-more-open', { nsMore: true }, { save: lv1, shots: [{ sel: '#nowStar' }] }),
  ...open('8-allsteps-open', { allSteps: true }, { shots: [{ sel: '#gates' }] }),
  ...open('9-done-open', {}, { act: openDone, shots: [{ sel: '#g6' }] }),
  ...open('10-tools-open', { msTools: true }, { shots: [{ sel: '.sec:has(#btnExpand)' }] }),
  ...open('11-areanotes-open', { areaNotes: true }, { save: { fold_areasFold: true }, shots: [{ sel: '#areas' }] }),
  ...open('12-sync-open', { syncSet: true }, { sync: true, storage: syncOn, shots: [{ sel: '#xfer' }] }),
  ...open('13-route-open', { routeFold: true }, { shots: [{ sel: '#routeCard' }] }),
  ...open('14-rail-open', { mapFold: true }, { save: { fold_progFold: true, trackOpen: true }, shots: [{ sel: '.rail' }, { sel: '.card:has(#progRows)', suffix: '-progress' }] }),
];
