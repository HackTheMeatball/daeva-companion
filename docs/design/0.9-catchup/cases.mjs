/* 0.9 catch-up mockups (README.md here): respec on every card (note 9), the catch-up flow for late starts (note 10, UX
   audit 1 and 3–8). Run: npm run build && node tests/support/shots.mjs docs/design/0.9-catchup --after-only */
import { fresh, mid, afterDv, afterSt, dvMenu, dvNone, dvPerBoard, dvUndo, stRespec, stUndo, spUndo, footBasic, cuCard, cuDone, cuRow, dvCatch, stCatch, nuFold, nuStep, nuOne } from './common.mjs';

const ranger = { pack: 'aion2/asmodian/ranger', class: 'ranger' };
const at = (s, level) => ({ ...s, level });
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { mode: 'advanced', width: w, height: h };
  cases.push({ name: `09-dv-menu-${w}`, save: mid, ...a, act: dvMenu, shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `09-dv-none-${w}`, save: fresh, ...a, act: dvNone, shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `09-dv-perboard-${w}`, save: mid, ...a, act: dvPerBoard, shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `09-dv-undo-${w}`, save: afterDv, ...a, act: dvUndo });
  cases.push({ name: `09-st-respec-${w}`, save: mid, ...a, act: stRespec, shots: [{ sel: '#stCard' }] });
  cases.push({ name: `09-st-undo-${w}`, save: afterSt, ...a, act: stUndo });
  cases.push({ name: `09-sp-undo-${w}`, save: fresh, ...a, act: spUndo });
  cases.push({ name: `10-skills-start-${w}`, save: fresh, ...a, act: cuCard(0), shots: [{ sel: '#spCard' }] });
  cases.push({ name: `10-skills-mid-${w}`, save: fresh, ...a, act: cuCard(3), shots: [{ sel: '#spCard' }] });
  cases.push({ name: `10-skills-done-${w}`, save: fresh, ...a, act: cuDone, shots: [{ sel: '#spCard' }] });
  cases.push({ name: `10-boards-${w}`, save: fresh, ...a, height: 1200, act: dvCatch(1), shots: [{ sel: '#dvBox' }] });
  cases.push({ name: `10-stigmas-${w}`, save: fresh, ...a, height: 1200, act: stCatch(1), shots: [{ sel: '#stCard' }] });
  cases.push({ name: `10-nextup-a-${w}`, save: fresh, ...a, act: nuStep, shots: [{ sel: '#nowStar .ns-card' }] });
  cases.push({ name: `10-nextup-b-${w}`, save: fresh, ...a, act: nuOne, shots: [{ sel: '#nowStar .ns-card' }] });
  cases.push({ name: `10-nextup-fold-${w}`, save: fresh, ...a, act: nuFold(false), shots: [{ sel: '#nowStar' }] });
}
/* the 1500 top row with all three cards in catch-up (Holly 9): one act per card, run in order */
const rowAct = new Function(`(${cuCard(0).toString()})(); (${dvCatch(0).toString()})(); (${stCatch(0).toString()})(); (${cuRow.toString()})();`);
cases.push({ name: '10-row-1500', save: fresh, mode: 'advanced', width: 1500, height: 1200, act: rowAct, shots: [{ sel: '.mk-row' }] });
/* other levels: Lv 27 and Lv 45 (fresh review B3) */
cases.push({ name: '10-skills-lv27-390', save: at(fresh, 27), mode: 'advanced', width: 390, height: 844, act: cuCard(0, 27), shots: [{ sel: '#spCard' }] });
cases.push({ name: '10-skills-lv45-390', save: at(fresh, 45), mode: 'advanced', width: 390, height: 844, act: cuCard(0, 45), shots: [{ sel: '#spCard' }] });
/* 360: the rows that gain a button or a count */
for (const [n, act, save] of [['10-skills-start', cuCard(0), fresh], ['10-boards', dvCatch(0), fresh], ['09-dv-menu', dvMenu, mid], ['09-dv-perboard', dvPerBoard, mid]])
  cases.push({ name: `${n}-360`, save, mode: 'advanced', width: 360, height: 1200, act, shots: [{ sel: n.startsWith('10-skills') ? '#spCard' : '#dvBox' }] });
/* Basic keeps each card's foot with Respec (note 9) and the catch-up tools (UX audit 4) */
const b = { mode: 'basic', width: 390, height: 1200 };
cases.push({ name: '09-sp-respec-basic-390', save: fresh, ...b, act: footBasic('#spCard'), shots: [{ sel: '#spCard' }] });
cases.push({ name: '09-dv-menu-basic-390', save: mid, ...b, act: dvMenu, shots: [{ sel: '#dvBox' }] });
cases.push({ name: '09-st-respec-basic-390', save: mid, ...b, act: footBasic('#stCard'), shots: [{ sel: '#stCard' }] });
cases.push({ name: '10-skills-basic-390', save: fresh, ...b, act: cuCard(0), shots: [{ sel: '#spCard' }] });
cases.push({ name: '10-boards-basic-390', save: fresh, ...b, act: dvCatch(0), shots: [{ sel: '#dvBox' }] });
cases.push({ name: '10-stigmas-basic-390', save: fresh, ...b, act: stCatch(0), shots: [{ sel: '#stCard' }] });
/* every class: the Ranger, with no sourced specialty picks yet (UX audit 3) */
cases.push({ name: '10-skills-ranger-1500', save: fresh, char: ranger, mode: 'advanced', width: 1500, height: 1000, act: cuCard(0, 'R39'), shots: [{ sel: '#spCard' }] });
cases.push({ name: '10-skills-ranger-390', save: fresh, char: ranger, mode: 'advanced', width: 390, height: 844, act: cuCard(0, 'R39'), shots: [{ sel: '#spCard' }] });
export default cases;
