/* 0.8 P18 (#507): writes data/packs/aion2/classes/chanter/{class,skills,stigmas,board-nodes}.json from the research CSVs
   (data/research/chanter-*-metabot-2026-10.csv, docs/research/2026-10-chanter-pack.md), hidden. The same shape as
   gladiator-pack.mjs (its own file because the Templar, Cleric and Sorcerer items edit that one in parallel). Values are
   copied, never computed: each record cites the Metabot page its CSV row was read from, with the row's build and checkedAt.
   The specialties CSV's game_text column (research §5) replaces Metabot's misprinted text; passive icons follow the owner's
   Lv 4 screen (research §7), not Metabot's file names. Run once: node tools/research/chanter-pack.mjs, then npm run gen.
   0.8 P19 (#508): the class is released with its guide pack, and every record with an approved icon names it. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../..');
const CLS = 'chanter', NAME = 'Chanter', CHECKED = '2026-10-19';
const OUT = join(ROOT, 'data/packs/aion2/classes', CLS);
mkdirSync(OUT, { recursive: true });

/* RFC 4180 rows: quoted fields may hold commas */
const csv = f => {
  const text = readFileSync(join(ROOT, 'data/research', f), 'utf8'), rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
};
const src = r => ({ url: r.page_url, checkedAt: r.checkedAt, build: { scheme: 'metabot', value: r.build } });
const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const int = v => { const n = Number(v); if (!Number.isInteger(n)) throw new Error('not an integer: ' + v); return n; };
const doc = (schema, collection, records) => ({ $schema: `../../schema/${schema}.schema.json`, schemaVersion: 2, collection, class: CLS, records });
const write = (f, d) => writeFileSync(join(OUT, f), JSON.stringify(d, null, 2) + '\n');
const skillNote = r => ` (Metabot page slug ${r.page_url.split('/').pop()}).`;
for (const r of [...csv(`${CLS}-skills-metabot-2026-10.csv`), ...csv(`${CLS}-stigmas-metabot-2026-10.csv`)]) if (r.checkedAt !== CHECKED || r.status !== 'verified') throw new Error('unexpected row ' + r.id);

/* Research §5: Metabot's page template prints some texts with the number doubled ("Absorbs 70, 70% HP"; the percent x 100
   where it is a percent). The CSV keeps Metabot's text in `text` and the game text in `game_text`; the record carries the
   game text, cited to the pages that show it. The converter fails if the CSV's fixed rows are not exactly these five. */
const SECOND = {
  'mmo-codex': 'https://mmo-codex.com/games/aion-2/classes/chanter/',
  daevaguides: 'https://daevaguides.com/en/chanter/',
  aion2turkiye: 'https://aion2turkiye.com/en/class/chanter/',
};
const GAME_TEXT = {
  'spec:chanter:onslaught:2': { by: ['mmo-codex', 'daevaguides', 'aion2turkiye'], owner: true },
  'spec:chanter:dark-crush:1': { by: ['mmo-codex', 'daevaguides', 'aion2turkiye'] },
  'spec:chanter:gust-rampage:1': { by: ['mmo-codex', 'daevaguides', 'aion2turkiye'] },
  'spec:chanter:recuperation:2': { by: ['daevaguides', 'aion2turkiye'] },
  'spec:chanter:healing-touch:3': { by: ['daevaguides', 'aion2turkiye'] },
};

/* specialty choices by owner (skill or stigma id), in n order */
const specs = {};
for (const r of csv(`${CLS}-specialties-metabot-2026-10.csv`)) {
  if (!!r.game_text !== !!GAME_TEXT[r.id] || (r.status === 'disputed') !== !!GAME_TEXT[r.id]) throw new Error(`${r.id}: game_text / status do not match research §5`);
  (specs[r.skill] = specs[r.skill] || []).push({ id: r.id, n: int(r.n), skillLv: int(r.skillLv), text: r.text, gameText: r.game_text, url: r.page_url });
}
const fixed = new Set();
const choicesOf = (id, url) => (specs[id] || []).sort((a, b) => a.n - b.n).map(c => {
  if (c.url !== url) throw new Error(`${c.id}: specialty page ${c.url} is not the record's page ${url}`);
  if (c.gameText) fixed.add(c.id);
  return { id: c.id, n: c.n, skillLv: c.skillLv, text: c.gameText || c.text };
});
const fixSources = id => (specs[id] || []).filter(c => c.gameText).flatMap(c => GAME_TEXT[c.id].by.map(s => ({
  url: SECOND[s], fields: ['specialtyChoices'], checkedAt: CHECKED,
  note: `Class guide shows the specialty text for ${c.id} (chanter research §5)`,
})));
const fixConflicts = id => (specs[id] || []).filter(c => c.gameText).map(c => {
  const g = GAME_TEXT[c.id];
  return `${c.id} text: Metabot's skill page prints "${c.text}" (an unfilled template that doubles the number). Game text "${c.gameText}" per ${g.by.join(', ')}${g.owner ? ', and the owner\'s Chanter skill window (2026-10-19)' : ''} (chanter research §5).`;
});

/* boardNodes "Nezekan 2 Vaizel 1 Triniel 1" -> { board:nezekan: 2, … } */
const perBoard = s => Object.fromEntries([...s.matchAll(/([A-Z][a-z]+) (\d+)/g)].map(m => ['board:' + m[1].toLowerCase(), int(m[2])]));

/* Icons vs the owner's Lv 4 Chanter screen (research §7; owner-screens/2026-10-19/chanter/skills-lv4-locked.png). 0.8 P19
   (#508) moved the 30 staged files the screen confirms (or, for stigmas, Metabot's page alone) into src/assets/icons/
   (sk-chanter-<slug>.png, st-chanter-<slug>.png: Impact Hit, Defiance and Survival Willpower are shared names) and every
   record except the OWNER_CHECK ones names its file. OWNER_CHECK: no approved file shows the screen's art, or the match is
   unconfirmed; no icon until the owner's tooltip screenshot names it (docs/ISSUES.md, "Chanter passive icons"); the two
   unconfirmed files stay staged in data/packs/aion2/asmodian/chanter/icons/. SWAPPED: the screen shows another Metabot
   page's file, staged under this skill's name. */
const icon = (r, kind) => `assets/icons/${kind}-chanter-${r.id.split(':')[2]}.png`;
const OWNER_CHECK = {
  'skill:chanter:blessing-of-life': 'green light with gold ornaments in the unlocked Lv 1 cell; no Metabot file has it (its page\'s file 18710000 is the game\'s Protection Circle art)',
  'skill:chanter:recuperation': 'one open hand with light in the Lv 8 cell; no Metabot file has it (its page\'s file 18120000 matches no cell)',
  'skill:chanter:survival-willpower': 'an armoured figure, hands to the head, in the Lv 23 cell; Metabot has no icon (18790000 returns 403)',
  'skill:chanter:attack-preparation': 'the shape of its page\'s file 18750000 in the Lv 13 cell, but red and purple where the file is blue (unconfirmed)',
  'skill:chanter:impact-hit': 'the shape of its page\'s file 18760000 in the Lv 15 cell, but red and purple where the file is blue (unconfirmed; may be the Assassin\'s 13760000, as on the Templar)',
};
const SWAPPED = {
  'skill:chanter:earths-promise': 'Metabot\'s Wind\'s Promise file 18800000',
  'skill:chanter:winds-promise': 'Metabot\'s Earth\'s Promise file 18780000',
  'skill:chanter:protection-circle': 'Metabot\'s Blessing of Life file 18710000',
};
/* Default keys (research §6, owner's screen NOTES.md): the conditional skill sits in Q row 1, not row 0 as on other classes */
const KEY_NOTE = {
  'skill:chanter:wave-blow': 'Default key (owner\'s Chanter screen, 2026-10-19, chanter research §6): Q row 1, under Tremor Crush in row 0. Unlike every other class, the conditional skill (Wave Blow only fires on a stunned target) is not in row 0; keep the screen\'s order and label it conditional.',
};

const skills = csv(`${CLS}-skills-metabot-2026-10.csv`).map(r => {
  const choices = choicesOf(r.id, r.page_url), conflicts = fixConflicts(r.id), screen = OWNER_CHECK[r.id];
  const notes = [
    ...(r.notes ? [r.notes + skillNote(r)] : []),
    ...(screen ? [`icon: owner-check. The owner's Lv 4 Chanter screen (2026-10-19) shows ${screen} (chanter research §7). No icon until the owner's tooltip screenshot names the art (docs/ISSUES.md).`] : []),
    ...(SWAPPED[r.id] ? [`icon: the owner's Lv 4 Chanter screen (2026-10-19) shows ${SWAPPED[r.id]} in this skill's Lv ${r.learnLv} cell, staged as sk-chanter-${r.id.split(':').pop()}.png (chanter research §7).`] : []),
    ...(KEY_NOTE[r.id] ? [KEY_NOTE[r.id]] : []),
  ];
  return {
    id: r.id, key: r.key, name: r.name, type: r.type, learnLv: int(r.learnLv), levelGate: r.levelGate, ...(screen ? {} : { icon: icon(r, 'sk') }),
    boardNodes: { perBoard: perBoard(r.boardNodes), cost: int(r.boardNodeCost) },
    ...(choices.length ? { specialtyChoices: choices } : {}),
    sources: [src(r), ...fixSources(r.id)], verifiedAt: r.checkedAt, status: 'verified',
    ...(screen ? { fieldStatus: { icon: 'owner-check' } } : {}),
    ...(conflicts.length ? { conflicts } : {}),
    ...(notes.length ? { notes } : {}),
  };
}).sort(byId);
for (const id of [...Object.keys(OWNER_CHECK), ...Object.keys(SWAPPED), ...Object.keys(KEY_NOTE)]) if (!skills.some(s => s.id === id)) throw new Error('no record ' + id);

const stigmas = csv(`${CLS}-stigmas-metabot-2026-10.csv`).map(r => {
  const fs = Object.fromEntries(r.fieldStatus.split(';').filter(Boolean).map(x => x.split(':').map(y => y.trim())));
  const choices = choicesOf(r.id, r.page_url), conflicts = fixConflicts(r.id);
  return {
    id: r.id, key: r.key, name: r.name, availableLv: int(r.availableLv), icon: icon(r, 'st'), maxLevel: int(r.maxLevel),
    specialtyChoices: choices,
    sources: [src(r), ...fixSources(r.id)], verifiedAt: r.checkedAt, status: 'verified',
    ...(Object.keys(fs).length ? { fieldStatus: fs } : {}),
    ...(conflicts.length ? { conflicts } : {}),
    notes: [`maxLevel ${r.maxLevel}: Metabot only (this skill page and the class page agree). A leveling guide does not reach it, so no owner check is asked (chanter research §2.2).`],
  };
}).sort(byId);
for (const id of Object.keys(GAME_TEXT)) if (!fixed.has(id)) throw new Error('game-text fix not applied: ' + id);

const nodes = csv(`${CLS}-board-nodes-metabot-2026-10.csv`).map(r => ({
  id: r.id, key: r.key, board: r.board, row: int(r.row), col: int(r.col), type: r.type,
  ...(r.grade ? { grade: r.grade } : {}), cost: int(r.cost), label: r.label,
  ...(r.skill ? { skill: r.skill, adds: int(r.adds) } : {}), gameId: r.gameId,
  sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
})).sort(byId);

const cls = {
  id: `class:${CLS}`, class: CLS, name: NAME, release: 'released', defaultBuild: `build:${CLS}:guide`,
  sources: [{ url: `https://metabot.gg/en/aion-2/classes/${CLS}`, checkedAt: CHECKED, build: { scheme: 'metabot', value: '0.0.4387.0' } }],
  verifiedAt: CHECKED, status: 'verified',
  notes: ['Released in 0.8 P19 (#508): its guide pack (data/packs/aion2/asmodian/chanter/) defines build:chanter:guide and the class picker lists it.'],
};

write('class.json', doc('classes', 'classes', [cls]));
write('skills.json', doc('skills', 'skills', skills));
write('stigmas.json', doc('stigmas', 'stigmas', stigmas));
write('board-nodes.json', doc('board-nodes', 'boardNodes', nodes));
console.log(`${CLS}: ${skills.length} skills, ${stigmas.length} stigmas, ${nodes.length} board nodes, ${Object.values(specs).flat().length} specialty choices`);
