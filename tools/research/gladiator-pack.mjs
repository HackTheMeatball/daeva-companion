/* 0.6 P4 (#263): writes data/packs/aion2/classes/gladiator/{class,skills,stigmas,board-nodes}.json from the research CSVs
   (data/research/gladiator-*-metabot-2026-10.csv, docs/research/2026-10-gladiator-pack.md). Values are copied, never
   computed: each record cites the Metabot page its CSV row was read from, with the row's build and checkedAt. Fields the
   research marks single source carry that label (fieldStatus). Run once: node tools/research/gladiator-pack.mjs, then npm run gen.
   0.6 P22 (#303): the same for the Ranger (data/research/ranger-*.csv, docs/research/2026-10-ranger-pack.md):
   node tools/research/gladiator-pack.mjs ranger.
   0.7 P3 (#346): the Spiritmaster (data/research/spiritmaster-*.csv, docs/research/2026-10-spiritmaster-pack.md), hidden:
   node tools/research/gladiator-pack.mjs spiritmaster.
   0.8 P4 (#493): the Cleric (data/research/cleric-*.csv, docs/research/2026-10-cleric-pack.md), hidden:
   node tools/research/gladiator-pack.mjs cleric. Research §10's text fix replaces Metabot's misprint; the six passives
   whose screen cells don't match their staged icons (Game Data Check, #493) get learnLv and icon owner-check. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../..');
const CLS = process.argv[2] || 'gladiator', CHECKED = CLS === 'cleric' ? '2026-10-19' : '2026-10-18';
const NAME = { gladiator: 'Gladiator', ranger: 'Ranger', spiritmaster: 'Spiritmaster', cleric: 'Cleric' }[CLS];
if (!NAME) throw new Error('unknown class: ' + CLS);
const OUT = join(ROOT, 'data/packs/aion2/classes', CLS);
mkdirSync(OUT, { recursive: true });
/* what each class's skill note adds: the Gladiator research read the page's Class field; the Ranger research names the slug */
const skillNote = (r) => CLS === 'gladiator' ? ' (the Metabot page\'s Class field reads Gladiator).'
  : ` (Metabot page slug ${r.page_url.split('/').pop()}).`;

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
for (const r of [...csv(`${CLS}-skills-metabot-2026-10.csv`), ...csv(`${CLS}-stigmas-metabot-2026-10.csv`)]) if (r.checkedAt !== CHECKED || r.status !== 'verified') throw new Error('unexpected row ' + r.id);

/* specialty choices by owner (skill or stigma id), in n order */
const specs = {};
for (const r of csv(`${CLS}-specialties-metabot-2026-10.csv`)) (specs[r.skill] = specs[r.skill] || []).push({ id: r.id, n: int(r.n), skillLv: int(r.skillLv), text: r.text, url: r.page_url });
const choicesOf = (id, url) => (specs[id] || []).sort((a, b) => a.n - b.n).map(c => {
  if (c.url !== url) throw new Error(`${c.id}: specialty page ${c.url} is not the record's page ${url}`);
  return { id: c.id, n: c.n, skillLv: c.skillLv, text: c.text };
});

/* boardNodes "Nezekan 2 Vaizel 1 Triniel 1" -> { board:nezekan: 2, … } */
const perBoard = s => Object.fromEntries([...s.matchAll(/([A-Z][a-z]+) (\d+)/g)].map(m => ['board:' + m[1].toLowerCase(), int(m[2])]));

/* research text fixes (#358 pattern): Metabot prints the percent x 100 into an unfilled template; the game text goes in,
   and the pages that print it become the record's refs (fetched per data/research/cleric-second-sources-2026-10.requests.log;
   build unknown, so left out, DATA-FORMAT §5.2) */
const TEXT_FIX = {
  cleric: {
    'spec:cleric:lightning-strike-scattershot:1': ['Absorbs 500, 500% HP', 'Absorbs 5% HP', 'aion2turkiye and daevaguides (cleric research §10)',
      ['https://daevaguides.com/en/cleric/', 'https://aion2turkiye.com/en/class/cleric/']],
  },
}[CLS] || {};
/* Game Data Check (#493, 2026-10-20): the owner's Lv 4 Cleric screen shows other art in these passives' cells than their
   staged Metabot files, so the files may be mislabelled or the CSV may put passives at the wrong levels */
const OWNER_CHECK = {
  cleric: {
    'skill:cleric:healing-enhancement': 'teal arcs around a flare; no staged file matches',
    'skill:cleric:immortal-veil': 'a figure under a green dome; no staged file matches',
    'skill:cleric:heal-block': 'the art of the file staged as Immortal Veil',
    'skill:cleric:prayer-of-concentration': 'the art of the file staged as Heal Block',
    'skill:cleric:survival-willpower': 'plate armour, hands on the helmet (the Templar Lv 23 art); no staged file matches',
    'skill:cleric:radiant-benediction': 'the art of the file staged as Prayer of Concentration',
  },
}[CLS] || {};
const skills = csv(`${CLS}-skills-metabot-2026-10.csv`).map(r => {
  const conflicts = [], fixRefs = [];
  const choices = choicesOf(r.id, r.page_url).map(c => {
    const fix = TEXT_FIX[c.id];
    if (!fix) return c;
    if (c.text !== fix[0]) throw new Error(`${c.id}: expected Metabot text ${fix[0]}, read ${c.text}`);
    conflicts.push(`${c.id} text: Metabot's skill page prints "${fix[0]}" (an unfilled template; its number is the percent x 100). Game text "${fix[1]}" per ${fix[2]} (${CHECKED}, #493).`);
    for (const url of fix[3]) fixRefs.push({ url, fields: ['specialtyChoices'], checkedAt: CHECKED, note: `Class guide shows the specialty text for ${c.id} (Game Data Check, #493)` });
    return { ...c, text: fix[1] };
  });
  const screen = OWNER_CHECK[r.id];
  return {
    id: r.id, key: r.key, name: r.name, type: r.type, learnLv: int(r.learnLv), levelGate: r.levelGate,
    boardNodes: { perBoard: perBoard(r.boardNodes), cost: int(r.boardNodeCost) },
    ...(choices.length ? { specialtyChoices: choices } : {}),
    sources: [src(r), ...fixRefs], verifiedAt: r.checkedAt, status: 'verified',
    ...(screen ? { fieldStatus: { learnLv: 'owner-check', icon: 'owner-check' } } : {}),
    ...(r.notes || screen ? { notes: [
      ...(r.notes ? [r.notes + skillNote(r)] : []),
      ...(screen ? [`learnLv ${r.learnLv} and icon: owner-check. The owner's Lv 4 Cleric screen (2026-10-19) shows ${screen} in the locked Lv ${r.learnLv} passive cell, so either the staged Metabot icon is mislabelled or Metabot puts this passive at the wrong level (Game Data Check, #493). No icon until the owner's tooltip screenshot names the cell (docs/ISSUES.md).`] : []),
    ] } : {}),
    ...(conflicts.length ? { conflicts } : {}),
  };
}).sort(byId);
for (const id of [...Object.keys(TEXT_FIX), ...Object.keys(OWNER_CHECK)]) if (!skills.some(s => s.id === id || (s.specialtyChoices || []).some(c => c.id === id))) throw new Error('no record ' + id);

const stigmas = csv(`${CLS}-stigmas-metabot-2026-10.csv`).map(r => {
  const fs = Object.fromEntries(r.fieldStatus.split(';').filter(Boolean).map(x => x.split(':').map(y => y.trim())));
  return {
    id: r.id, key: r.key, name: r.name, availableLv: int(r.availableLv), maxLevel: int(r.maxLevel),
    specialtyChoices: choicesOf(r.id, r.page_url),
    sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
    ...(Object.keys(fs).length ? { fieldStatus: fs } : {}),
    notes: [CLS === 'gladiator'
      ? `maxLevel ${r.maxLevel}: Metabot only (this page and the class page's stigma header); owner check pending (owner-check-gladiator).`
      : CLS === 'ranger'
        ? `maxLevel ${r.maxLevel}: Metabot only (this skill page); Metabot's Ranger class page text says 25. A leveling guide does not reach it, so no owner check is asked (ranger research §4).`
        : `maxLevel ${r.maxLevel}: Metabot only (this skill page and the class page agree). A leveling guide does not reach it, so no owner check is asked (${CLS} research §2.2${CLS === 'spiritmaster' ? ', §4' : ''}).`],
  };
}).sort(byId);

const nodes = csv(`${CLS}-board-nodes-metabot-2026-10.csv`).map(r => ({
  id: r.id, key: r.key, board: r.board, row: int(r.row), col: int(r.col), type: r.type,
  ...(r.grade ? { grade: r.grade } : {}), cost: int(r.cost), label: r.label,
  ...(r.skill ? { skill: r.skill, adds: int(r.adds) } : {}), gameId: r.gameId,
  sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
})).sort(byId);

const cls = {
  id: `class:${CLS}`, class: CLS, name: NAME, release: 'hidden', defaultBuild: `build:${CLS}:guide`,
  sources: [{ url: `https://metabot.gg/en/aion-2/classes/${CLS}`, checkedAt: CHECKED, build: { scheme: 'metabot', value: '0.0.4387.0' } }],
  verifiedAt: CHECKED, status: 'verified',
  notes: [CLS === 'gladiator'
    ? 'Hidden until 0.6 P5 adds its guide pack (data/packs/aion2/asmodian/gladiator/, which defines build:gladiator:guide) and lists it in the class picker.'
    : CLS === 'ranger'
      ? 'Hidden until 0.6 P5 adds its guide pack (data/packs/aion2/asmodian/ranger/, which defines build:ranger:guide) and lists it in the class picker.'
      : CLS === 'spiritmaster'
        ? 'Hidden until a 0.7 guide item adds its guide pack (data/packs/aion2/asmodian/spiritmaster/, which defines build:spiritmaster:guide) and lists it in the class picker.'
        : `Hidden until a 0.8 guide item adds its guide pack (data/packs/aion2/asmodian/${CLS}/, which defines build:${CLS}:guide) and lists it in the class picker.`],
};

write('class.json', doc('classes', 'classes', [cls]));
write('skills.json', doc('skills', 'skills', skills));
write('stigmas.json', doc('stigmas', 'stigmas', stigmas));
write('board-nodes.json', doc('board-nodes', 'boardNodes', nodes));
console.log(`${CLS}: ${skills.length} skills, ${stigmas.length} stigmas, ${nodes.length} board nodes, ${Object.values(specs).flat().length} specialty choices`);
