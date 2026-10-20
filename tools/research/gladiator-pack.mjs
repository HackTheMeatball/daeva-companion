/* 0.6 P4 (#263): writes data/packs/aion2/classes/gladiator/{class,skills,stigmas,board-nodes}.json from the research CSVs
   (data/research/gladiator-*-metabot-2026-10.csv, docs/research/2026-10-gladiator-pack.md). Values are copied, never
   computed: each record cites the Metabot page its CSV row was read from, with the row's build and checkedAt. Fields the
   research marks single source carry that label (fieldStatus). Run once: node tools/research/gladiator-pack.mjs, then npm run gen.
   0.6 P22 (#303): the same for the Ranger (data/research/ranger-*.csv, docs/research/2026-10-ranger-pack.md):
   node tools/research/gladiator-pack.mjs ranger.
   0.7 P3 (#346): the Spiritmaster (data/research/spiritmaster-*.csv, docs/research/2026-10-spiritmaster-pack.md), hidden:
   node tools/research/gladiator-pack.mjs spiritmaster.
   0.8 P2 (#491): the Templar (data/research/templar-*.csv, docs/research/2026-10-templar-pack.md), hidden:
   node tools/research/gladiator-pack.mjs templar. Its five "Absorbs N, N% HP" specialties get the game text (GAME_TEXT).
   0.8 P4 (#493): the Cleric (data/research/cleric-*.csv, docs/research/2026-10-cleric-pack.md), hidden:
   node tools/research/gladiator-pack.mjs cleric. Research §10's text fix replaces Metabot's misprint; the six passives
   whose screen cells don't match their staged icons (Game Data Check, #493) get learnLv and icon owner-check.
   0.8 P5 (#494): the Cleric is released with its guide pack, and its records name their icons (clericIcon). */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../..');
const CLS = process.argv[2] || 'gladiator', CHECKED = CLS === 'templar' || CLS === 'cleric' ? '2026-10-19' : '2026-10-18';
const NAME = { gladiator: 'Gladiator', ranger: 'Ranger', spiritmaster: 'Spiritmaster', templar: 'Templar', cleric: 'Cleric' }[CLS];
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

/* Specialty texts the sources dispute (templar research §5): the record keeps Metabot's text, labelled disputed per choice
   (fieldStatus specialtyChoices.<array index>.text), with the other sources' text in conflicts. */
const DISPUTED = CLS !== 'templar' ? {} : {
  'spec:templar:pummel:4': { metabot: '-1s [Punishment] cooldown on hit', other: '…on landing [Punishing Strike]', by: ['mmo-codex', 'daevaguides'] },
  'spec:templar:pummel:5': { metabot: '[Punishing Strike] grants extra damage on hit', other: 'Activates [Punishing Strike] 1 extra time', by: ['mmo-codex', 'daevaguides'],
    why: '; mmo-codex says Korea changed this specialty on 16 Sep, so one side may be newer (inferred)' },
};
const disputed = new Set();
const disputedStatus = choices => Object.fromEntries(choices.map((c, i) => [c, i]).filter(([c]) => DISPUTED[c.id]).map(([c, i]) => {
  if (c.text !== DISPUTED[c.id].metabot) throw new Error(`${c.id}: CSV text ${c.text} is not the disputed Metabot text ${DISPUTED[c.id].metabot}`);
  disputed.add(c.id);
  return [`specialtyChoices.${i}.text`, 'disputed'];
}));
const disputedConflicts = choices => choices.filter(c => DISPUTED[c.id]).map(c => {
  const d = DISPUTED[c.id];
  return `${c.id} text (disputed): Metabot's skill page prints "${d.metabot}"; ${d.by.join(' and ')} give "${d.other}"${d.why || ''}. Needs skill Lv ${c.skillLv}, past a leveling guide; the owner can read it on any Templar's skill window (templar research §5).`;
});

/* boardNodes "Nezekan 2 Vaizel 1 Triniel 1" -> { board:nezekan: 2, … } */
const perBoard = s => Object.fromEntries([...s.matchAll(/([A-Z][a-z]+) (\d+)/g)].map(m => ['board:' + m[1].toLowerCase(), int(m[2])]));

/* Templar passive icons (0.8 P2): Metabot's passive files don't match the owner's screens for some passives. Impact Hit's
   art on the owner's screen is the Assassin's 13760000, already shipped. Game Data Check matched eight Metabot files
   against the owner's screen (PR #518): those name their staged sk-templar-<slug>.png, which P3 moves into src/assets/icons
   with the guide pack. Survival Willpower matches no file and waits on the owner (ISSUES.md, "Templar passive icons"). */
const ICON = CLS !== 'templar' ? {} : {
  'skill:templar:impact-hit': 'assets/icons/sk-impact-hit.png',
  ...Object.fromEntries(['enhance-health', 'warding-shield', 'punishing-benediction', 'ironclad-defense', 'guarding-seal', 'insulting-roar', 'fury', 'block-pain']
    .map(s => ['skill:templar:' + s, `assets/icons/sk-templar-${s}.png`])),
};
/* Cleric icons (0.8 P5, #494): the guide pack ships every active and stigma file (research §7, Metabot pages) and the four
   passives whose files match the owner's Lv 4 screen (Warm Benediction, Empyrean Lords' Benediction, Empyrean Lord's
   Grace, Earth's Grace; Game Data Check, #493); the other six passives stay owner-check (OWNER_CHECK below). Files are
   named sk-cleric-<slug>.png / st-cleric-<slug>.png, as the Templar's, because Defiance and Survival Willpower are shared names. */
const CLERIC_PASSIVE_ICONS = new Set(['warm-benediction', 'empyrean-lords-benediction', 'empyrean-lords-grace', 'earths-grace']);
const clericIcon = (r, kind) => {
  const slug = r.id.split(':')[2];
  return kind === 'st' || r.type === 'active' || CLERIC_PASSIVE_ICONS.has(slug) ? `assets/icons/${kind}-cleric-${slug}.png` : null;
};
const iconFields = r => {
  if (CLS === 'cleric') return clericIcon(r, 'sk') ? { icon: clericIcon(r, 'sk') } : {};
  if (CLS !== 'templar' || r.type !== 'passive') return {};
  return ICON[r.id] ? { icon: ICON[r.id] } : { fieldStatus: { icon: 'owner-check' } };
};

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
  const choices = choicesOf(r.id, r.page_url).map(gameText).map(c => {
    const fix = TEXT_FIX[c.id];
    if (!fix) return c;
    if (c.text !== fix[0]) throw new Error(`${c.id}: expected Metabot text ${fix[0]}, read ${c.text}`);
    conflicts.push(`${c.id} text: Metabot's skill page prints "${fix[0]}" (an unfilled template; its number is the percent x 100). Game text "${fix[1]}" per ${fix[2]} (${CHECKED}, #493).`);
    for (const url of fix[3]) fixRefs.push({ url, fields: ['specialtyChoices'], checkedAt: CHECKED, note: `Class guide shows the specialty text for ${c.id} (Game Data Check, #493)` });
    return { ...c, text: fix[1] };
  });
  const screen = OWNER_CHECK[r.id];
  conflicts.push(...fixConflicts(choices), ...disputedConflicts(choices));
  const fieldStatus = { ...(screen ? { learnLv: 'owner-check', icon: 'owner-check' } : {}), ...iconFields(r).fieldStatus, ...disputedStatus(choices) };
  const notes = [
    ...(r.notes ? [r.notes + skillNote(r)] : []),
    ...(screen ? [`learnLv ${r.learnLv} and icon: owner-check. The owner's Lv 4 Cleric screen (2026-10-19) shows ${screen} in the locked Lv ${r.learnLv} passive cell, so either the staged Metabot icon is mislabelled or Metabot puts this passive at the wrong level (Game Data Check, #493). No icon until the owner's tooltip screenshot names the cell (docs/ISSUES.md).`] : []),
  ];
  /* key order as each class's pack was first written (Cleric: notes before conflicts) */
  const notesFirst = CLS === 'cleric';
  return {
    id: r.id, key: r.key, name: r.name, type: r.type, learnLv: int(r.learnLv), levelGate: r.levelGate,
    ...(iconFields(r).icon ? { icon: iconFields(r).icon } : {}),
    boardNodes: { perBoard: perBoard(r.boardNodes), cost: int(r.boardNodeCost) },
    ...(choices.length ? { specialtyChoices: choices } : {}),
    sources: [src(r), ...fixSources(choices), ...fixRefs], verifiedAt: r.checkedAt, status: 'verified',
    ...(Object.keys(fieldStatus).length ? { fieldStatus } : {}),
    ...(notesFirst && notes.length ? { notes } : {}),
    ...(conflicts.length ? { conflicts } : {}),
    ...(!notesFirst && notes.length ? { notes } : {}),
  };
}).sort(byId);
for (const id of [...Object.keys(TEXT_FIX), ...Object.keys(OWNER_CHECK)]) if (!skills.some(s => s.id === id || (s.specialtyChoices || []).some(c => c.id === id))) throw new Error('no record ' + id);

const stigmas = csv(`${CLS}-stigmas-metabot-2026-10.csv`).map(r => {
  const fs = Object.fromEntries(r.fieldStatus.split(';').filter(Boolean).map(x => x.split(':').map(y => y.trim())));
  return {
    id: r.id, key: r.key, name: r.name, availableLv: int(r.availableLv), ...(CLS === 'cleric' ? { icon: clericIcon(r, 'st') } : {}), maxLevel: int(r.maxLevel),
    specialtyChoices: choicesOf(r.id, r.page_url),
    sources: [src(r)], verifiedAt: r.checkedAt, status: 'verified',
    ...(Object.keys(fs).length ? { fieldStatus: fs } : {}),
    notes: [CLS === 'gladiator'
      ? `maxLevel ${r.maxLevel}: Metabot only (this page and the class page's stigma header); owner check pending (owner-check-gladiator).`
      : CLS === 'ranger'
        ? `maxLevel ${r.maxLevel}: Metabot only (this skill page); Metabot's Ranger class page text says 25. A leveling guide does not reach it, so no owner check is asked (ranger research §4).`
        : `maxLevel ${r.maxLevel}: Metabot only (this skill page and the class page agree). A leveling guide does not reach it, so no owner check is asked (${CLS} research §2.2${CLS === 'spiritmaster' ? ', §4' : ''}).`,
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
  id: `class:${CLS}`, class: CLS, name: NAME, release: CLS === 'cleric' ? 'released' : 'hidden', defaultBuild: `build:${CLS}:guide`,
  sources: [{ url: `https://metabot.gg/en/aion-2/classes/${CLS}`, checkedAt: CHECKED, build: { scheme: 'metabot', value: '0.0.4387.0' } }],
  verifiedAt: CHECKED, status: 'verified',
  notes: [CLS === 'gladiator'
    ? 'Hidden until 0.6 P5 adds its guide pack (data/packs/aion2/asmodian/gladiator/, which defines build:gladiator:guide) and lists it in the class picker.'
    : CLS === 'ranger'
      ? 'Hidden until 0.6 P5 adds its guide pack (data/packs/aion2/asmodian/ranger/, which defines build:ranger:guide) and lists it in the class picker.'
      : CLS === 'spiritmaster'
        ? 'Hidden until a 0.7 guide item adds its guide pack (data/packs/aion2/asmodian/spiritmaster/, which defines build:spiritmaster:guide) and lists it in the class picker.'
        : CLS === 'templar'
          ? 'Hidden until 0.8 P3 adds its guide pack (data/packs/aion2/asmodian/templar/, which defines build:templar:guide) and lists it in the class picker.'
          : CLS === 'cleric'
            ? 'Released in 0.8 P5 (#494): its guide pack (data/packs/aion2/asmodian/cleric/) defines build:cleric:guide and the class picker lists it.'
            : `Hidden until a 0.8 guide item adds its guide pack (data/packs/aion2/asmodian/${CLS}/, which defines build:${CLS}:guide) and lists it in the class picker.`],
};
for (const id of Object.keys(GAME_TEXT)) if (!fixed.has(id)) throw new Error('game-text fix not applied: ' + id);
for (const id of Object.keys(DISPUTED)) if (!disputed.has(id)) throw new Error('disputed label not applied: ' + id);

write('class.json', doc('classes', 'classes', [cls]));
write('skills.json', doc('skills', 'skills', skills));
write('stigmas.json', doc('stigmas', 'stigmas', stigmas));
write('board-nodes.json', doc('board-nodes', 'boardNodes', nodes));
console.log(`${CLS}: ${skills.length} skills, ${stigmas.length} stigmas, ${nodes.length} board nodes, ${Object.values(specs).flat().length} specialty choices`);
