/* 0.6 P4 (#263): writes data/packs/aion2/classes/gladiator/{class,skills,stigmas,board-nodes}.json from the research CSVs
   (data/research/gladiator-*-metabot-2026-10.csv, docs/research/2026-10-gladiator-pack.md). Values are copied, never
   computed: each record cites the Metabot page its CSV row was read from, with the row's build and checkedAt. Fields the
   research marks single source carry that label (fieldStatus). Run once: node tools/research/gladiator-pack.mjs, then npm run gen.
   0.6 P22 (#303): the same for the Ranger (data/research/ranger-*.csv, docs/research/2026-10-ranger-pack.md):
   node tools/research/gladiator-pack.mjs ranger.
   0.7 P3 (#346): the Spiritmaster (data/research/spiritmaster-*.csv, docs/research/2026-10-spiritmaster-pack.md), hidden:
   node tools/research/gladiator-pack.mjs spiritmaster.
   0.8 P2 (#491): the Templar (data/research/templar-*.csv, docs/research/2026-10-templar-pack.md), hidden:
   node tools/research/gladiator-pack.mjs templar. Its five "Absorbs N, N% HP" specialties get the game text (GAME_TEXT). */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../..');
const CLS = process.argv[2] || 'gladiator', CHECKED = CLS === 'templar' ? '2026-10-19' : '2026-10-18';
const NAME = { gladiator: 'Gladiator', ranger: 'Ranger', spiritmaster: 'Spiritmaster', templar: 'Templar' }[CLS];
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

/* Metabot's page template prints some "Absorbs N% HP" texts as "Absorbs 100N, 100N% HP" (the percent x 100). The CSV keeps
   Metabot's text as read; the record carries the game text, cited to the pages that show it (templar research §5). */
const SECOND = {
  'mmo-codex': 'https://mmo-codex.com/games/aion-2/classes/templar/',
  daevaguides: 'https://daevaguides.com/en/templar/',
  aion2turkiye: 'https://aion2turkiye.com/en/class/templar/',
};
const GAME_TEXT = CLS !== 'templar' ? {} : {
  'spec:templar:vicious-strike:2': { metabot: 'Absorbs 100, 100% HP', text: 'Absorbs 1% HP', by: ['mmo-codex', 'daevaguides'], owner: true },
  'spec:templar:judgment:1': { metabot: 'Absorbs 100, 100% HP', text: 'Absorbs 1% HP', by: ['mmo-codex', 'daevaguides'] },
  'spec:templar:pummel:2': { metabot: '[Punishing Strike] absorbs 300, 300% HP', text: '[Punishing Strike] absorbs 3% HP', by: ['mmo-codex', 'daevaguides'] },
  'spec:templar:punishment:1': { metabot: 'Absorbs 1000, 1000% HP', text: 'Absorbs 10% HP', by: ['mmo-codex', 'daevaguides', 'aion2turkiye'] },
  'spec:templar:flash-rampage:1': { metabot: 'Absorbs 500, 500% HP', text: 'Absorbs 5% HP', by: ['daevaguides', 'aion2turkiye'] },
};
const fixed = new Set();
const gameText = c => {
  const g = GAME_TEXT[c.id];
  if (!g) return c;
  if (c.text !== g.metabot) throw new Error(`${c.id}: CSV text ${c.text} is not the Metabot text ${g.metabot}`);
  fixed.add(c.id);
  return { ...c, text: g.text };
};
const fixSources = choices => choices.filter(c => GAME_TEXT[c.id]).flatMap(c => GAME_TEXT[c.id].by.map(s => ({
  url: SECOND[s], fields: ['specialtyChoices'], checkedAt: CHECKED,
  note: `Class guide shows the specialty text for ${c.id} (templar research §5)`,
})));
const fixConflicts = choices => choices.filter(c => GAME_TEXT[c.id]).map(c => {
  const g = GAME_TEXT[c.id];
  return `${c.id} text: Metabot's skill page prints "${g.metabot}" (an unfilled template; its number is the percent x 100). Game text "${g.text}" per ${g.by.join(' and ')}${g.owner ? ', and the owner\'s Templar skill window (2026-10-18)' : ''} (templar research §5).`;
});

/* boardNodes "Nezekan 2 Vaizel 1 Triniel 1" -> { board:nezekan: 2, … } */
const perBoard = s => Object.fromEntries([...s.matchAll(/([A-Z][a-z]+) (\d+)/g)].map(m => ['board:' + m[1].toLowerCase(), int(m[2])]));

/* Templar passive icons (0.8 P2): Metabot's passive files don't match the owner's screens for some passives. Impact Hit's
   art on the owner's screen is the Assassin's 13760000, already shipped; Enhance Health was unlocked on the owner's Lv 4
   screen and matched by eye (templar research §3). The others wait on the owner (ISSUES.md, "Templar passive icons"). */
const ICON = CLS !== 'templar' ? {} : { 'skill:templar:impact-hit': 'assets/icons/sk-impact-hit.png' };
const ICON_SEEN = CLS !== 'templar' ? [] : ['skill:templar:enhance-health', 'skill:templar:impact-hit'];
const iconFields = r => {
  if (CLS !== 'templar' || r.type !== 'passive') return {};
  if (ICON[r.id]) return { icon: ICON[r.id] };
  return ICON_SEEN.includes(r.id) ? {} : { fieldStatus: { icon: 'owner-check' } };
};

const skills = csv(`${CLS}-skills-metabot-2026-10.csv`).map(r => {
  const choices = choicesOf(r.id, r.page_url).map(gameText), conflicts = fixConflicts(choices);
  return {
    id: r.id, key: r.key, name: r.name, type: r.type, learnLv: int(r.learnLv), levelGate: r.levelGate,
    ...(iconFields(r).icon ? { icon: iconFields(r).icon } : {}),
    boardNodes: { perBoard: perBoard(r.boardNodes), cost: int(r.boardNodeCost) },
    ...(choices.length ? { specialtyChoices: choices } : {}),
    sources: [src(r), ...fixSources(choices)], verifiedAt: r.checkedAt, status: 'verified',
    ...(iconFields(r).fieldStatus ? { fieldStatus: iconFields(r).fieldStatus } : {}),
    ...(conflicts.length ? { conflicts } : {}),
    ...(r.notes ? { notes: [r.notes + skillNote(r)] } : {}),
  };
}).sort(byId);

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
        : `maxLevel ${r.maxLevel}: Metabot only (this skill page and the class page agree). A leveling guide does not reach it, so no owner check is asked (${CLS} research §2.2${CLS === 'templar' ? '' : ', §4'}).`,
      ...(CLS === 'templar' && r.notes ? [r.notes + skillNote(r)] : [])],
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
      : CLS === 'templar'
        ? 'Hidden until 0.8 P3 adds its guide pack (data/packs/aion2/asmodian/templar/, which defines build:templar:guide) and lists it in the class picker.'
        : 'Hidden until a 0.7 guide item adds its guide pack (data/packs/aion2/asmodian/spiritmaster/, which defines build:spiritmaster:guide) and lists it in the class picker.'],
};
for (const id of Object.keys(GAME_TEXT)) if (!fixed.has(id)) throw new Error('game-text fix not applied: ' + id);

write('class.json', doc('classes', 'classes', [cls]));
write('skills.json', doc('skills', 'skills', skills));
write('stigmas.json', doc('stigmas', 'stigmas', stigmas));
write('board-nodes.json', doc('board-nodes', 'boardNodes', nodes));
console.log(`${CLS}: ${skills.length} skills, ${stigmas.length} stigmas, ${nodes.length} board nodes, ${Object.values(specs).flat().length} specialty choices`);
