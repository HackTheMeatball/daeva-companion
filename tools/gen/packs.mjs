/* Pack chain (0.4 P1, DATA-FORMAT-V2 §2.1): a pack is a folder below the packs root with a pack.json (pack.schema.json)
   whose id is that folder. resolvePacks() starts at one pack, visits its parent, then its `uses`, then the pack itself
   (so a pack loads after everything it reads), and returns the listed files in that order. It throws on a manifest that
   fails its schema or names another folder, an unknown parent / uses, a cycle, a listed file that is missing and a JSON
   file in a pack folder that no manifest lists (a nested pack's folder belongs to that pack). */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { ROOT, validateDoc } from './validate.mjs';

export const DEFAULT_ROOT = join(ROOT, 'data/packs');
export const DEFAULT_PACK = 'aion2/asmodian/assassin';

const rel = f => (f.startsWith(ROOT + sep) ? f.slice(ROOT.length + 1) : relative(ROOT, f)).split(sep).join('/');

/* The files the generator reads (0.9 P6). realFs is the disk. fsView() is the disk seen through test edits, all in memory
   (nothing is written, so tests/schema.mjs no longer copies data/packs for each broken copy): mutate(rel, doc) edits any
   JSON doc read (data files and pack.json manifests; rel is repo-relative, "/"-separated); drop: rel paths (files or whole
   folders) that read as absent; add: { rel: text } files that read as present. read() returns text, edit() runs mutate. */
const listDisk = d => readdirSync(d, { withFileTypes: true }).map(e => ({ name: e.name, dir: e.isDirectory() }));
export const realFs = { real: true, exists: existsSync, isDir: f => statSync(f).isDirectory(), list: listDisk, read: f => readFileSync(f, 'utf8'), edit: (f, doc) => doc };
export function fsView({ mutate = null, drop = [], add = {} } = {}) {
  const gone = r => drop.some(d => r === d || r.startsWith(d + '/')), added = Object.keys(add), below = r => added.some(a => a.startsWith(r + '/'));
  /* one generate() resolves ~10 pack chains over the same folders: the view looks each disk path up once (0.9 P32) */
  const memo = fn => { const m = new Map(); return f => { if (!m.has(f)) m.set(f, fn(f)); return m.get(f); }; };
  const diskExists = memo(existsSync), diskDir = memo(f => statSync(f).isDirectory()), diskList = memo(listDisk);
  const onDisk = f => !gone(rel(f)) && diskExists(f);
  return {
    real: false,
    exists: f => rel(f) in add || onDisk(f) || below(rel(f)),
    isDir: f => !(rel(f) in add) && (onDisk(f) ? diskDir(f) : below(rel(f))),
    list: d => {
      const r = rel(d), out = onDisk(d) ? diskList(d).filter(e => !gone(r + '/' + e.name)) : [];
      for (const a of added) if (a.startsWith(r + '/')) { const rest = a.slice(r.length + 1), name = rest.split('/')[0]; if (!out.some(e => e.name === name)) out.push({ name, dir: rest.includes('/') }); }
      return out;
    },
    read: f => { const r = rel(f); if (r in add) return add[r]; if (gone(r)) throw new Error(`ENOENT: no such file (dropped in memory): ${r}`); return readFileSync(f, 'utf8'); },
    edit: (f, doc) => { if (mutate) mutate(rel(f), doc); return doc; },
  };
}
/* the view for a generator's options: the disk unless a test passes mutate, drop or add */
export const fsOf = ({ fs, mutate, drop, add } = {}) => fs || (mutate || drop || add ? fsView({ mutate, drop, add }) : realFs);

/* the JSON files of one pack folder: not pack.json, not inside a nested pack */
const ownJson = (fs, dir, base = dir) => fs.list(dir).map(e => e.name).sort().flatMap(n => {
  const f = join(dir, n);
  if (fs.isDir(f)) return fs.exists(join(f, 'pack.json')) ? [] : ownJson(fs, f, base);
  return n.endsWith('.json') && f !== join(base, 'pack.json') ? [relative(base, f).split(sep).join('/')] : [];
});

/* validateDoc is pure in (path, doc): a manifest that serializes the same as one validated before has the same errors
   (0.9 P32: the tests' many generate() calls resolve ~10 chains each, every one re-reading the same manifests) */
const manifestMemo = new Map(), validManifest = (f, m) => { const k = f + '\0' + JSON.stringify(m); if (!manifestMemo.has(k)) manifestMemo.set(k, validateDoc(f, m)); return manifestMemo.get(k); };

export function resolvePacks({ root = DEFAULT_ROOT, pack = DEFAULT_PACK, fs = realFs } = {}) {
  const manifests = new Map(), state = new Map(), stack = [], chain = [];
  const load = id => {
    if (manifests.has(id)) return manifests.get(id);
    const f = join(root, ...id.split('/'), 'pack.json');
    let m = null;
    if (/^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*$/.test(id) && fs.exists(f)) {
      try { m = JSON.parse(fs.read(f)); } catch (e) { throw new Error(`${rel(f)}: not JSON: ${e.message}`); }
      fs.edit(f, m);
      const errs = validManifest(f, m);
      if (errs.length) throw new Error(`${rel(f)}: pack manifest fails pack.schema.json: ${errs.slice(0, 5).join('; ')}`);
      if (m.id !== id) throw new Error(`${rel(f)}: id "${m.id}" is not its folder "${id}"`);
    }
    manifests.set(id, m); return m;
  };
  const visit = (id, via) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'open') throw new Error(`pack cycle: ${[...stack.slice(stack.indexOf(id)), id].join(' -> ')}`);
    const m = load(id);
    if (!m) throw new Error(via ? `${via}: unknown pack "${id}"` : `unknown pack "${id}" (no pack.json in ${rel(join(root, id))})`);
    state.set(id, 'open'); stack.push(id);
    if (m.parent) visit(m.parent, `${id} parent`);
    for (const u of m.uses || []) visit(u, `${id} uses`);
    stack.pop(); state.set(id, 'done'); chain.push(m);
  };
  visit(pack, null);
  const files = [];
  for (const m of chain) {
    const dir = join(root, ...m.id.split('/'));
    for (const f of m.files) if (!fs.exists(join(dir, f))) throw new Error(`pack ${m.id}: listed file ${f} does not exist`);
    const unlisted = ownJson(fs, dir).filter(f => !m.files.includes(f));
    if (unlisted.length) throw new Error(`pack ${m.id}: JSON file(s) in the pack folder not listed in pack.json: ${unlisted.join(', ')}`);
    for (const f of m.files) files.push({ pack: m.id, abs: join(dir, f), rel: rel(join(dir, f)) });
  }
  return { chain, files };
}
