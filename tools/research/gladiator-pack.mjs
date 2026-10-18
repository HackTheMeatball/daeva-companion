/* 0.6 P4 (#263): writes data/packs/aion2/classes/gladiator/{class,skills,stigmas,board-nodes}.json from the research CSVs
   (data/research/gladiator-*-metabot-2026-10.csv, docs/research/2026-10-gladiator-pack.md). Values are copied, never
   computed: each record cites the Metabot page its CSV row was read from, with the row's build and checkedAt. Fields the
   research marks single source carry that label (fieldStatus). Run once: node tools/research/gladiator-pack.mjs, then npm run gen. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../..');
const OUT = join(ROOT, 'data/packs/aion2/classes/gladiator');
const CLS = 'gladiator', CHECKED = '2026-10-18';

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
for (const r of [...csv('gladiator-skills-metabot-2026-10.csv'), ...csv('gladiator-stigmas-metabot-2026-10.csv')]) if (r.checkedAt !== CHECKED || r.status !== 'verified') throw new Error('unexpected row ' + r.id);

/* specialty choices by owner (skill or stigma id), in n order */
const specs = {};
for (const r of csv('gladiator-specialties-metabot-2026-10.csv')) (specs[r.skill] = specs[r.skill] || []).push({ id: r.id, n: int(r.n), skillLv: int(r.skillLv), text: r.text, url: r.page_url });
const choicesOf = (id, url) => (specs[id] || []).sort((a, b) => a.n - b.n).map(c => {
  if (c.url !== url) throw new Error(`${c.id}: specialty page ${c.url} is not the record's page ${url}`);
  return { id: c.id, n: c.n, skillLv: c.skillLv, text: c.text };
});

/* boardNodes "Nezekan 2 Vaizel 1 Triniel 1" -> { board:nezekan: 2, … } */
const perBoard = s => Object.fromEntries([...s.matchAll(/([A-Z][a-z]+) (\d+)/g)].map(m => ['board:' + m[1].toLowerCase(), int(m[2])]));

const skills = csv('gladiator-skills-metabot-2026-10.csv').map(r => {
  const choices = choicesOf(r.id, r.page_url);
  return {
    id: r.id, key: r.key, name: r.name, type: r.type, learnLv: int(r.learnLv), levelGate: r.levelGate,
    boardNodes: { perBoard: perBoard(r.boardNodes), cost: int(r.boardNodeCost) },
    ...(choices.length ? { specialtyChoices: choices } : {}),
    sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
    ...(r.notes ? { notes: [r.notes + ' (the Metabot page\'s Class field reads Gladiator).'] } : {}),
  };
}).sort(byId);

const stigmas = csv('gladiator-stigmas-metabot-2026-10.csv').map(r => {
  const fs = Object.fromEntries(r.fieldStatus.split(';').filter(Boolean).map(x => x.split(':').map(y => y.trim())));
  return {
    id: r.id, key: r.key, name: r.name, availableLv: int(r.availableLv), maxLevel: int(r.maxLevel),
    specialtyChoices: choicesOf(r.id, r.page_url),
    sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
    ...(Object.keys(fs).length ? { fieldStatus: fs } : {}),
    notes: [`maxLevel ${r.maxLevel}: Metabot only (this page and the class page's stigma header); owner check pending (owner-check-gladiator).`],
  };
}).sort(byId);

const nodes = csv('gladiator-board-nodes-metabot-2026-10.csv').map(r => ({
  id: r.id, key: r.key, board: r.board, row: int(r.row), col: int(r.col), type: r.type,
  ...(r.grade ? { grade: r.grade } : {}), cost: int(r.cost), label: r.label,
  ...(r.skill ? { skill: r.skill, adds: int(r.adds) } : {}), gameId: r.gameId,
  sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
})).sort(byId);

const cls = {
  id: 'class:gladiator', class: CLS, name: 'Gladiator', release: 'hidden', defaultBuild: 'build:gladiator:guide',
  sources: [{ url: 'https://metabot.gg/en/aion-2/classes/gladiator', checkedAt: CHECKED, build: { scheme: 'metabot', value: '0.0.4387.0' } }],
  verifiedAt: CHECKED, status: 'verified',
  notes: ['Hidden until 0.6 P5 adds its guide pack (data/packs/aion2/asmodian/gladiator/, which defines build:gladiator:guide) and lists it in the class picker.'],
};

write('class.json', doc('classes', 'classes', [cls]));
write('skills.json', doc('skills', 'skills', skills));
write('stigmas.json', doc('stigmas', 'stigmas', stigmas));
write('board-nodes.json', doc('board-nodes', 'boardNodes', nodes));
console.log(`gladiator: ${skills.length} skills, ${stigmas.length} stigmas, ${nodes.length} board nodes, ${Object.values(specs).flat().length} specialty choices`);
