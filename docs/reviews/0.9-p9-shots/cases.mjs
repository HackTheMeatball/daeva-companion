/* 0.9 P9: the read-only banner of a save written by a newer build (v 7 under this v6 build), at 390 px. A new screen. */
import { createRequire } from 'node:module';
const { SAVE_KEY, toStored } = createRequire(import.meta.url)('../../../tests/support/save.js');

const v7 = toStored({ checks: { 'g6:0': true }, level: 22, quest: 'Daeva in a Dream', open: {}, hideCards: false, mode: 'basic', welcomed: 1 });
v7.v = 7;

export default [
  { name: '1-newer-save-390', afterOnly: true, save: { level: 1, quest: '' }, storage: { [SAVE_KEY]: JSON.stringify(v7) } },
];
