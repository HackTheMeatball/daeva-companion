/* 0.9 Key setup mockups (README.md here): the sheet (note 11) with player-chosen keys (#388) and icon-filled boxes
   (note 12), for the Assassin's suggested grid and a default-keys class (the Gladiator).
   Run: npm run build && node tests/support/shots.mjs docs/design/0.9-keys --after-only */
import { fresh, sheet, sheetFill, sheetInDrawer, sheetFillTip, sheetKey, sheetClash, sheetKeyDone, sheetBasic, sheetEnd } from '../0.9-catchup/common.mjs';

const glad = { pack: 'aion2/asmodian/gladiator', class: 'gladiator' };
const cases = [];
for (const [w, h] of [[1500, 1000], [390, 844]]) {
  const a = { save: fresh, mode: 'advanced', width: w, height: h };
  cases.push({ name: `11-sheet-names-${w}`, ...a, act: sheet });
  cases.push({ name: `12-sheet-fill-${w}`, ...a, act: sheetFill });
  cases.push({ name: `12-sheet-tip-${w}`, ...a, act: sheetFillTip });
  cases.push({ name: `388-key-listen-${w}`, ...a, act: sheetKey });
  cases.push({ name: `388-key-clash-${w}`, ...a, act: sheetClash });
  cases.push({ name: `388-key-mine-${w}`, ...a, act: sheetKeyDone });
  cases.push({ name: `12-sheet-gladiator-${w}`, ...a, char: glad, act: sheetFill });
  cases.push({ name: `12-sheet-basic-${w}`, ...a, mode: 'basic', act: sheetBasic });
}
/* phone: option B, Key setup stays a fold in the Build drawer (fresh review: one option only on mobile) */
cases.push({ name: '11-drawer-b-390', save: fresh, mode: 'advanced', width: 390, height: 844, act: sheetInDrawer });
cases.push({ name: '12-sheet-end-390', save: fresh, mode: 'advanced', width: 390, height: 844, act: sheetEnd });
cases.push({ name: '12-sheet-fill-360', save: fresh, mode: 'advanced', width: 360, height: 800, act: sheetFill });
export default cases;
