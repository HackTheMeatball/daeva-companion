/* The generated data modules, shared by scripts/build.mjs and the Node core tests (tests/core.mjs): an esbuild plugin that
   serves src/packs/aion2/data/generated.js (by any relative path that resolves there: "./generated.js" from the pack's
   data folder, "./data/generated.js" from the pack) as the module tools/gen/gen.mjs compiles from data/** (data format
   v2, 0.2 step 5b), src/packs/aion2/data/gate-graph.js as GATE_GRAPH (the live gates, 0.3 E1) and
   src/packs/aion2/data/gate-proposed.js as GATE_PROPOSED (the 0.3 proposals compiled, 0.3 E4). They are pack data (0.4
   P2b): the pack object (src/packs/aion2/pack.js) hands GATE_GRAPH and GATE_PROPOSED to the engine, which never imports
   them. src/packs/aion2/data/place.js serves NODE_PLACE and KIBELISKS (0.5 P8, the place and Kibelisk tables)
   and TRAVEL_RULES (0.5 P10), for the pack's travel code (src/packs/aion2/travel.js). The modules are never stored: not in src/, not in tools/. A schema error or a failed data check stops the build. */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classChunk as chunkOf, generate, generateAll } from '../tools/gen/gen.mjs';
import { DEFAULT_PACK } from '../tools/gen/packs.mjs';
import { dataFiles } from '../tools/gen/validate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...p) => join(ROOT, ...p);

/* the module text (generated once per process); throws on a schema error or a failed check */
let cached = null;
export const genResult = () => {
  if (cached) return cached;
  const g = generate();
  if (g.failed.length) throw new Error(`data checks failed (${g.failed.length}): ` + g.failed.slice(0, 5).map(c => c.check).join('; ') + ' (run npm run gen)');
  return (cached = g);
};
export const genModule = () => genResult().module;
export const generatedNames = () => [...Object.keys(genResult().constants), 'GATE_GRAPH', 'GATE_PROPOSED'];
/* where the modules resolve (the AION 2 pack's data folder), and file name -> module text */
const DATA_DIR = 'src/packs/aion2/data';
/* `node scripts/build.mjs --sizes` measures what a table costs the page by bundling it as null (never for a real build) */
let dropped = new Set(), pruned = new Set();
export const dropTables = names => { dropped = new Set(names); };
/* The page bundle leaves out a table no file under src/ names (0.6 P1): the build calls pruneTables(unusedTables()). The
   Node core tests don't, so they still see every table. A name in a comment or a string counts as used (kept). */
export const unusedTables = () => {
  const text = srcFiles().map(f => readFileSync(f, 'utf8')).join('\n');
  return [...Object.keys(genResult().constants)].filter(n => !new RegExp(`\\b${n}\\b`).test(text));
};
export const pruneTables = names => { pruned = new Set(names); };
const srcFiles = () => { const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : /\.(js|html)$/.test(e.name) ? [join(d, e.name)] : []); return walk(P('src')); };
const served = text => !dropped.size && !pruned.size && !perClass.size ? text : text.replace(/^export const (\w+) = .*;\n?/gm, (line, n) => pruned.has(n) ? '' : dropped.has(n) ? `export const ${n} = null;\n`
  : perClass.has(n) ? `export const ${n} = DAEVA_CLASS.${n};\n` : line);
/* Per-class loading (0.6 P2, tools/gen/gen.mjs generateAll): every guide pack compiled on its own. The page build calls
   splitClasses(): the modules then serve a per-class table as `export const X = DAEVA_CLASS.X;` (a page global the class
   chunk sets) and classChunk(id) is that class's tables as one classic script, which sets DAEVA_CLASS only when the
   loader chose it (self.DAEVA_PACK). The Node core tests don't split, so they still see every table's value. */
let all = null, perClass = new Set();
export const genAll = () => {
  if (all) return all;
  const a = generateAll({ done: { [DEFAULT_PACK]: genResult() } });
  if (a.failed.length) throw new Error(`data checks failed (${a.failed.length}): ` + a.failed.slice(0, 5).map(c => `${c.pack}: ${c.check}`).join('; ') + ' (run npm run gen)');
  return (all = a);
};
export const splitClasses = () => { perClass = new Set(genAll().perClass); };
/* Tables loaded on demand (0.9 P23: SOURCES, the Sources card's link lists): lazyTables({ NAME: id => stub }) leaves NAME out
   of the class chunk, which sets it to the stub instead (for SOURCES: { n: the link count, src: the file holding the table }). */
let lazy = {};
export const lazyTables = m => { lazy = m; };
export const classChunk = id => chunkOf(genAll(), id, { omit: new Set([...pruned, ...Object.keys(lazy)]), nulls: dropped }) +
  Object.entries(lazy).filter(([n]) => !pruned.has(n)).map(([n, stub]) => `if(self.DAEVA_PACK===${JSON.stringify(id)})self.DAEVA_CLASS.${n}=${JSON.stringify(stub(id))};\n`).join('');
/* The tables of generated.js are served in name order (0.6 P1). They are independent `export const` lines, so the order is
   free; gzip only matches text within 32 KB, and of the orders tried (generator, name, size up, size down) this one came out
   smallest. Re-check with `node scripts/build.mjs --sizes` if a data change moves the page gzip size by more than ~100 B. */
const arrange = text => { const L = text.split('\n'), isTable = l => l.startsWith('export const ');
  return [...L.filter(l => !isTable(l)), ...L.filter(isTable).sort((a, b) => a.localeCompare(b))].join('\n'); };
const MODULES = { 'generated.js': () => served(arrange(genResult().module)), 'gate-graph.js': () => served(genResult().gateModule), 'gate-proposed.js': () => served(genResult().proposedModule), 'place.js': () => served(genResult().placeModule) };
/* a stored copy of a generated module (in the pack's data folder, or the pre-0.4 src/data), else null */
export const staleGenerated = () => [DATA_DIR, 'src/data'].flatMap(d => Object.keys(MODULES).map(f => d + '/' + f)).find(f => existsSync(P(f))) || null;
export const generatedData = {
  name: 'generated-data',
  setup(b) {
    b.onResolve({ filter: /^(\.\.?\/)+([\w-]+\/)*(generated|gate-graph|gate-proposed|place)\.js$/ }, a => {
      const f = Object.keys(MODULES).find(f => join(a.resolveDir, a.path) === P(DATA_DIR, f));
      return f ? { path: 'data/' + f, namespace: 'generated' } : undefined;
    });
    b.onLoad({ filter: /.*/, namespace: 'generated' }, a => ({ contents: MODULES[a.path.slice('data/'.length)](), loader: 'js', resolveDir: P(DATA_DIR), watchFiles: dataFiles() }));
  },
};
