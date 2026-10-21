#!/usr/bin/env node
/* Build the site from src/ (dev dependency: esbuild; Node 22). The claude.ai artifact was frozen
   (owner, 2026-10-18, DECISIONS `owner-ok-0.7-artifact-freeze`; 0.7 P9 removed its build) and is deleted (owner, 2026-10-20).

   Source layout (0.2 P1–P3):
     src/index.html            the page shell: head, markup, and tags naming the files the build inlines
     src/styles/*.css          the styles: fonts.css (the @font-face rules), index.css (0.4 P4d: @imports app.css, the page
                               frame and shared rules, then one file per card from styles/cards/ and styles/packs/<game>/,
                               in cascade order) and brand.css; inlined verbatim
     src/main.js               the app script (ES module entry)
     src/core/*.js             the engine (0.2 P3, 0.4 P2b): state, migrations, the pack holder, evaluator, requirements,
                               Next up ranking; no DOM, no game term (it reaches the game through the pack object)
     src/shell/*.js            the browser side of core interfaces (0.4 P3b): storage-web.js, the localStorage adapter
     src/packs/aion2/          the AION 2 pack (0.4 P2b): pack.js (the pack object), rules, requirements, catalog, …
     src/packs/aion2/data/*.js the hand-written data tables (and the text helpers they use)
     src/packs/aion2/data/generated.js   not a file: the build makes this module (and gate-graph.js, gate-proposed.js)
                               from data/** (data format v2) with tools/gen/gen.mjs, in memory, on every build
     src/site.js               the standalone site's own script (persistent storage, service worker); site only
   The shell's <link rel="stylesheet" href="styles/X.css"> lines become <style> elements holding the file as it is (its
   '@import "Y.css";' lines replaced by those files), and
   its <script type="module" src="X.js"></script> lines become one classic <script> each holding the esbuild bundle of
   that entry (whitespace and syntax minified, local names shortened, top-level names never renamed, no tree shaking, so every top-level name stays a page global, as before modules).
   src/index.html is not runnable on its own: build, then `npm run serve`.

   dist/                       GitHub Pages site
     index.html                the shell with styles and scripts inlined
     assets/icons/*.png        the icons the page references (src/assets/icons)
     assets/fonts/*            the self-hosted fonts (WOFF2) and their OFL license texts (src/assets/fonts)
     public/*                  CNAME, robots.txt, sitemap.xml, 404.html, favicon.svg, manifest, manifest icons
     sw.js                     src/sw.js with the build id and precache list filled in

   Card markup: a line "<!-- @card cards/X.html -->" in src/index.html is replaced by src/cards/X.html (0.4 P4a).
   Placeholders anywhere in the page: __APP_VERSION__ becomes package.json's version, __APP_BUILD__ the build's name
   ("site"), so the version is never written by hand in the page.
   Usage: node scripts/build.mjs [--out <dir>] [--sizes]
     --out               write dist/ below <dir> instead of the repo root */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build, transform } from 'esbuild';
import { classChunk, dropTables, genAll, genModule, genResult, generatedData, generatedNames, pruneTables, splitClasses, staleGenerated, unusedTables } from './generated-data.mjs';
import { DEFAULT_PACK } from '../tools/gen/packs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...p) => join(ROOT, ...p);

const die = msg => { console.error('build: ' + msg); process.exit(1); };
const argOf = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1] || die(`--${n} needs a value`); };
const OUT_DIR = argOf('out') ? resolve(ROOT, argOf('out')) : ROOT;
const DIST = join(OUT_DIR, 'dist');
const walk = dir => readdirSync(dir).flatMap(n => { const f = join(dir, n); return statSync(f).isDirectory() ? walk(f) : [f]; });

/* card markup (0.4 P4a, docs/design/0.4-engine-contract.md §4): a shell line "<!-- @card cards/X.html -->" is replaced by
   that file under src/ as it is, before anything else reads the shell, so the page is byte-identical to the
   markup standing in the shell. A missing file, a card file that holds an @card line, or a leftover @card line fails. */
const CARD_TAG = /^[ \t]*<!-- @card ((?:cards|packs\/[\w-]+\/cards)\/[\w-]+\.html) -->\n/gm;
const withCards = html => html.replace(CARD_TAG, (_, f) => {
  if (!existsSync(P('src', f))) die(`src/index.html: @card file src/${f} is missing`);
  const part = readFileSync(P('src', f), 'utf8');
  if (part.includes('@card')) die(`src/${f}: a card file can't include another (@card)`);
  return part.endsWith('\n') ? part : part + '\n';
});
const shell = withCards(readFileSync(P('src/index.html'), 'utf8'));
if (shell.includes('@card')) die('src/index.html: an @card line the build can\'t include (one per line: <!-- @card cards/<id>.html -->)');

/* inlining: styles verbatim, scripts as esbuild bundles. esbuild's CSS printer rewrites values (unquoted url(), one
   unicode-range per line), which the test font blocker reads, so CSS is not passed
   through it; it can be once the styles are split into @import partials. */
const STYLE_TAG = /^<link rel="stylesheet" href="(styles\/[\w.-]+\.css)">\n/gm;
const SCRIPT_TAG = /^<script type="module" src="([\w.-]+\.js)"><\/script>\n/gm;

/* the generated data module (0.2 step 5b): compiled from data/** by tools/gen/gen.mjs at build time, never stored (a stale
   copy in src/ would shadow nothing but mislead, so the build refuses it). The esbuild plugin is shared with the Node
   core tests. A schema error or a failed data check stops the build. */
if (staleGenerated()) die(`${staleGenerated()} exists: the build makes that module from data/** (tools/gen/gen.mjs); delete the file`);
try { genModule(); genAll(); } catch (e) { die(e.message); }
pruneTables(unusedTables());
/* per-class loading (0.6 P2, docs/ARCHITECTURE.md §4): the page bundle holds the shared tables; each playable class (guide
   pack) gets a chunk of its own tables (classChunk), and a small loader before the app script picks the current
   character's class from the stored save (its `pack`; the default pack when there is none or it isn't shipped) and sets
   self.DAEVA_PACK. The site loads that one chunk as its own file (packs/<id>.<hash>.js, precached; document.write keeps
   it before the app script, which reads it at once). */
splitClasses();
const CLASS_PACKS = genAll().packs;
if (!CLASS_PACKS.includes(DEFAULT_PACK)) die(`the default pack ${DEFAULT_PACK} is not a guide pack below data/packs`);
const SAVE_KEY = (readFileSync(P('src/core/state.js'), 'utf8').match(/^export const KEY = "([\w-]+)";$/m) || [])[1] || die('src/core/state.js: no `export const KEY = "…";`');
const minChunk = async id => (await transform(classChunk(id), { loader: 'js', minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: false, charset: 'utf8', legalComments: 'inline' })
  .catch(x => die(`class chunk ${id}: ${x.message}`))).code;
let chunks = Object.fromEntries(await Promise.all(CLASS_PACKS.map(async id => [id, await minChunk(id)])));
for (const [id, js] of Object.entries(chunks)) if (/<\/script/i.test(js)) die(`class chunk ${id} contains "</script"`);
const chunkFile = id => `packs/${id.replace(/\//g, '-')}.${createHash('sha256').update(chunks[id]).digest('hex').slice(0, 8)}.js`;
const pickClass = files => `(()=>{const F=${JSON.stringify(files)};let p;try{const s=JSON.parse(localStorage.getItem(${JSON.stringify(SAVE_KEY)}));p=s.chars[s.current].pack}catch(e){}` +
  `if(!F[p])p=${JSON.stringify(DEFAULT_PACK)};self.DAEVA_PACK=p;`;
/* what goes before the app script: the site's loader, or (the checks below and --sizes) a loader with every chunk inlined */
const siteClasses = () => `<script>\n${pickClass(Object.fromEntries(CLASS_PACKS.map(id => [id, chunkFile(id)])))}document.write('<script src="'+F[p]+'"><\\/script>')})();\n</script>\n`;
const allClasses = ids => `<script>\n${pickClass(Object.fromEntries(ids.map(id => [id, 1])))}})();\n</script>\n<script>\n${ids.map(id => chunks[id]).join('')}</script>\n`;
/* the game pack the page loads (0.4 P8): src/main.js imports it as the module "pack", the pack's shell.js, so the shell
   names no game (docs/design/0.4-engine-contract.md §5); one game's code, always loaded; its class data comes per class
   (the chunks above) */
const PAGE_PACK = 'aion2';
/* site.js and the sync chunk (src/sync-ui.js, 0.8 P6) run after main.js's bundle, as IIFEs so their names stay their own.
   A src/core/ module they reach (through the sync client) is not bundled a second time: it stands for main.js's copy,
   whose top-level names are page globals, so all scripts share one engine (one active pack, one save). Only the core
   modules main.js doesn't import, the sync client and merge(), are bundled (into the sync chunk). */
const CHUNK_CORE = new Set(['src/core/sync-client.js', 'src/core/merge.js']);
const pageCore = {
  name: 'page-core',
  setup(b) {
    b.onResolve({ filter: /^\.\.?\// }, a => {
      const f = relative(ROOT, join(a.resolveDir, a.path)).split('\\').join('/');
      return /^src\/core\/[\w-]+\.js$/.test(f) && !CHUNK_CORE.has(f) ? { path: f, namespace: 'page-core' } : undefined;
    });
    b.onLoad({ filter: /.*/, namespace: 'page-core' }, a => ({ loader: 'js', contents: [...readFileSync(P(a.path), 'utf8').matchAll(DECL)]
      .filter(m => m[0].startsWith('export ')).map(m => m[1]).map(n => `const page$${n} = ${n};\nexport { page$${n} as ${n} };`).join('\n') }));
  },
};
/* the sync chunk (0.8 P6, docs/ARCHITECTURE.md §4): src/sync-ui.js, bundled like site.js (an IIFE over main.js's core) into
   a file of its own, sync.<hash>.js (precached), which site.js loads only when sync is shown, so the page doesn't carry the
   sync line's code, texts, styles or markup. Its stylesheet (styles/X.css, shipped as plainCss writes it) and markup
   (cards/X.html, as tightHtml writes it) come in as strings. */
const SYNC_ENTRY = 'sync-ui.js';
const syncText = {
  name: 'sync-text',
  setup(b) {
    b.onLoad({ filter: /[\\/]src[\\/]styles[\\/][\w-]+\.css$/ }, a => ({ loader: 'text', contents: readCss(relative(P('src'), a.path).split('\\').join('/'), new Set()) }));
    b.onLoad({ filter: /[\\/]src[\\/]cards[\\/][\w-]+\.html$/ }, a => {
      const html = readFileSync(a.path, 'utf8');
      if (/<(pre|textarea)\b/i.test(html)) die(`${relative(ROOT, a.path)} has a <pre> or <textarea>: tightHtml would change its text`);
      return { loader: 'text', contents: tightHtml(html).trim() };
    });
  },
};
const bundleOne = async entry => {
  const site = entry === 'site.js' || entry === SYNC_ENTRY;
  const r = await build({ absWorkingDir: ROOT, entryPoints: ['src/' + entry], bundle: true, write: false, format: site ? 'iife' : 'esm', platform: 'browser',
    treeShaking: false, minify: false, charset: 'utf8', legalComments: 'inline', logLevel: 'silent', plugins: entry === SYNC_ENTRY ? [pageCore, generatedData, syncText] : site ? [pageCore, generatedData] : [generatedData],
    alias: { pack: `./src/packs/${PAGE_PACK}/shell.js` } })
    .catch(e => die(`src/${entry}: ${e.errors ? e.errors.map(x => x.text + (x.location ? ` (${x.location.file}:${x.location.line})` : '')).join('; ') : e.message}`));
  for (const w of r.warnings) console.warn(`build: esbuild warning in src/${entry}: ${w.text}` + (w.location ? ` (${w.location.file}:${w.location.line})` : ''));
  const js = r.outputFiles[0].text;
  if (/^\s*(import|export)\b/m.test(js)) die(`src/${entry}: the bundle still has an import/export statement (it is inlined as a classic script)`);
  if (/<\/script/i.test(js)) die(`src/${entry}: the bundle contains "</script"`);
  return js;
};
/* one global namespace until P3: esbuild would silently rename one of two same-named top-level declarations in different
   modules, breaking the globals the page, site.js and the tests use. Checks every declaration that starts a line
   (the first name of a multi-name declaration) in every .js file under src/ the page bundle can include (main.js,
   core, cards, shell, packs/**; 0.4 P2b), so a name moved into a pack stays unique. esbuild also renames a declaration
   when another bundled module uses the same name without importing it (a free global reference); the check after
   bundling catches that: no declared name may come out of a bundle as name2, name3, … */
const DECL = /^(?:export )?(?:const|let|var|function\*?|async function|class) +([\w$]+)/gm, PAGE_NAMES = new Map(generatedNames().map(n => [n, 'the generated data module']));
{
  const NOT_PAGE = new Set(['src/site.js', 'src/sw.js', 'src/' + SYNC_ENTRY]);
  for (const f of walk(P('src')).map(f => relative(ROOT, f).split('\\').join('/')).filter(f => f.endsWith('.js') && !NOT_PAGE.has(f) && !f.startsWith('src/assets/')).sort())
    for (const m of readFileSync(P(f), 'utf8').matchAll(DECL)) {
      if (PAGE_NAMES.has(m[1]) && PAGE_NAMES.get(m[1]) !== f) die(`top-level name "${m[1]}" is declared in both ${PAGE_NAMES.get(m[1])} and ${f} (the bundle would rename one)`);
      PAGE_NAMES.set(m[1], f);
    }
}
const bundles = Object.fromEntries(await Promise.all([...new Set([...shell.matchAll(SCRIPT_TAG)].map(m => m[1]))].map(async e => [e, await bundleOne(e)])));
const checkRenames = (e, js) => {
  const out = new Set([...js.matchAll(DECL)].map(m => m[1]));
  for (const n of out) { const base = n.replace(/\d+$/, ''); if (base !== n && !out.has(base) && PAGE_NAMES.has(base) && !PAGE_NAMES.has(n))
    die(`src/${e}: esbuild renamed "${base}" (${PAGE_NAMES.get(base)}) to "${n}": a module uses "${base}" without importing it`); }
};
for (const [e, js] of Object.entries(bundles)) checkRenames(e, js);
/* whitespace and syntax minification of each checked bundle (0.5 P20): a separate transform, since minifySyntax inside
   the bundling step renames top-level names (update → update3). Local names are shortened (0.8.1 F6): a transform
   without a format never renames a top-level name (each stays a page global) nor a free reference to one. */
const minifyAll = bs => Promise.all(Object.entries(bs).map(async ([e, js]) =>
  [e, (await transform(js, { loader: 'js', minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: true, charset: 'utf8', legalComments: 'inline' }).catch(x => die(`src/${e}: minify: ${x.message}`))).code])).then(Object.fromEntries);
let minified = await minifyAll(bundles);
const bundle = entry => minified[entry];
/* @import lines (0.4 P4d): a line '@import "X.css";' in a stylesheet is replaced by that file (path relative to the importing
   file) as it is, recursively, so src/styles/index.css (app.css, then one file per card) inlines as one stylesheet. A
   missing file or one imported twice stops the build; so does a .css file under src/styles/ that nothing links or imports. */
const IMPORT = /^@import "([\w./-]+\.css)";\n/gm, cssUsed = new Set();
/* comments, the last ; of a rule and the white space around { } ; , > and after : in a stylesheet are not shipped (0.6 P1; no value, selector or
   string is rewritten; quoted strings are skipped; @import lines keep their own line). styles/fonts.css only loses its
   comments (0.8.1 F6): the test font blocker reads its lines. */
const plainCss = (f, css) => f === 'styles/fonts.css' ? css.replace(/\/\*[\s\S]*?\*\/\n?/g, '') : css.replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|^@import [^\n]*\n|\s*;\s*\}\s*|\s*([{};,>~])\s*|\s+!important|:\s+/gm, (m, str, p) => str ? str : m.startsWith('@import') ? m : p ? p : m.includes('}') ? '}' : m.includes('!') ? '!important' : ':').trim() + '\n';
const readCss = (f, seen) => {
  if (!existsSync(P('src', f))) die(`src/${f} is missing (an @import or <link> names it)`);
  if (seen.has(f)) die(`src/${f} is imported twice`);
  seen.add(f); cssUsed.add(f);
  return plainCss(f, readFileSync(P('src', f), 'utf8')).replace(IMPORT, (_, g) => { const css = readCss(join(dirname(f), g).split('\\').join('/'), seen); return css.endsWith('\n') ? css : css + '\n'; });
};
/* classes: the class loader (and chunks) placed before the app script, main.js */
const inline = (html, classes = allClasses(CLASS_PACKS), seen = new Set()) => html
  .replace(STYLE_TAG, (_, f) => { const css = readCss(f, seen); if (/<\/style/i.test(css)) die(`src/${f} contains "</style"`); if (/^\s*@import\b/m.test(css)) die(`src/${f}: an @import the build can't inline (one per line: @import "X.css";)`); return `<style>\n${css}</style>\n`; })
  .replace(SCRIPT_TAG, (_, f) => (f === 'main.js' ? classes : '') + `<script>\n${bundle(f)}</script>\n`);
if (!shell.includes('<script type="module" src="main.js"></script>\n')) die('src/index.html: no <script type="module" src="main.js"> (the class loader goes before it)');
if (!shell.match(STYLE_TAG) || !shell.match(SCRIPT_TAG)) die('src/index.html: no <link rel="stylesheet" href="styles/…"> or <script type="module" src="…"> to inline');
for (const m of shell.matchAll(/<(link rel="stylesheet"|script)[^>]*>/g)) if (!/^<(link rel="stylesheet" href="styles\/[\w.-]+\.css"|script type="module" src="[\w.-]+\.js")>$/.test(m[0]) && m[0] !== '<script>')
  die(`src/index.html: "${m[0]}" is not a tag the build inlines (one per line, styles/X.css or X.js)`);
const src = inline(shell); /* the whole page, markers kept: what the checks below read */
/* markup outside <style> and <script> loses its indentation and blank lines (0.6 P1): a line break renders as the same
   single space as a line break plus indent (the page has no <pre> or <textarea>; the build checks) */
const tightHtml = html => html.split(/(<(style|script)\b[\s\S]*?<\/\2>)/).filter((_, i) => i % 3 !== 2)
  .map((part, i) => i % 2 ? part : part.replace(/^[ \t]+|[ \t]+$/gm, '').replace(/\n{2,}/g, '\n')).join('');
/* SVG path data in the markup (0.8.1 F6): a path whose numbers all have at most one decimal (the header wordmark,
   tools/brand/build.py) ships as relative commands with repeated command letters left out, so the glyphs that repeat
   compress. The numbers are counted in exact tenths and decoding what ships must give back every point of the source,
   or the build stops: the shape is the same point for point. A path with an arc, more decimals or anything else is left
   as written. */
const PATH_ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, Z: 0 };
const pathPoints = d => {
  if (!/^[MLHVCSQTZmlhvcsqtz\d\s.,-]*$/.test(d)) return null;
  const t = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g) || [], out = [];
  let i = 0, x = 0, y = 0, sx = 0, sy = 0, c = null;
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) c = t[i++]; else if (!c || c === 'Z' || c === 'z') return null; else if (c === 'M') c = 'L'; else if (c === 'm') c = 'l';
    const C = c.toUpperCase(), n = PATH_ARGS[C], r = c !== C, raw = t.slice(i, i + n), a = raw.map(v => Math.round(Number(v) * 10));
    i += n;
    if (raw.length < n || raw.some((v, k) => /[A-Za-z]/.test(v) || Math.abs(a[k] - Number(v) * 10) > 1e-6)) return null;
    let p;
    if (C === 'Z') { p = []; x = sx; y = sy; }
    else if (C === 'H') { p = [a[0] + (r ? x : 0)]; x = p[0]; }
    else if (C === 'V') { p = [a[0] + (r ? y : 0)]; y = p[0]; }
    else { p = a.map((v, k) => v + (r ? (k % 2 ? y : x) : 0)); x = p[n - 2]; y = p[n - 1]; if (C === 'M') { sx = x; sy = y; } }
    out.push([C, ...p]);
  }
  return out;
};
const tenths = v => (v < 0 ? '-' : '') + (Math.abs(v) % 10 ? (Math.abs(v) / 10).toFixed(1) : String(Math.abs(v) / 10)).replace(/^0\./, '.');
const relPath = pts => {
  let x = 0, y = 0, sx = 0, sy = 0, prev = null, s = '';
  for (const [C, ...p] of pts) {
    const c = C.toLowerCase(), o = C === 'Z' ? [] : C === 'H' ? [p[0] - x] : C === 'V' ? [p[0] - y] : p.map((v, k) => v - (k % 2 ? y : x)), nums = o.map(tenths);
    if (C === 'Z') { x = sx; y = sy; } else if (C === 'H') x = p[0]; else if (C === 'V') y = p[0]; else { x = p[p.length - 2]; y = p[p.length - 1]; if (C === 'M') { sx = x; sy = y; } }
    s += (c === prev && c !== 'm' && c !== 'z' ? (nums[0].startsWith('-') ? '' : ' ') : c) + nums.map((v, k) => (k && !v.startsWith('-') ? ' ' : '') + v).join('');
    prev = c;
  }
  return s;
};
const tightPaths = html => html.split(/(<(style|script)\b[\s\S]*?<\/\2>)/).filter((_, i) => i % 3 !== 2)
  .map((part, i) => i % 2 ? part : part.replace(/(<path\b[^>]*? d=")([^"]*)"/g, (m, pre, d) => {
    const pts = pathPoints(d), rel = pts && relPath(pts);
    if (!rel || rel.length >= d.length) return m;
    if (JSON.stringify(pathPoints(rel)) !== JSON.stringify(pts)) die(`svg path "${d.slice(0, 40)}…": its relative form decodes to other points`);
    return pre + rel + '"';
  })).join('');
if (/<(pre|textarea)\b/i.test(src)) die('src/ has a <pre> or <textarea>: tightHtml would change its text');
/* the sync chunk (see syncText): bundled and checked like the page's scripts, then named by its hash in site.js */
if (!bundles['site.js'] || !bundles['site.js'].includes('__SYNC_CHUNK__')) die('src/site.js: no __SYNC_CHUNK__ (the sync chunk\'s file name goes there)');
const syncRaw = await bundleOne(SYNC_ENTRY);
checkRenames(SYNC_ENTRY, syncRaw);
const syncJs = (await minifyAll({ [SYNC_ENTRY]: syncRaw }))[SYNC_ENTRY];
const SYNC_FILE = `sync.${createHash('sha256').update(syncJs).digest('hex').slice(0, 8)}.js`;
minified['site.js'] = minified['site.js'].replace('__SYNC_CHUNK__', SYNC_FILE);
for (const f of walk(P('src/styles')).map(f => relative(P('src'), f).split('\\').join('/')).filter(f => f.endsWith('.css')))
  if (!cssUsed.has(f)) die(`src/${f} is not linked from src/index.html, imported by a stylesheet (src/styles/index.css lists the card styles) or imported by src/${SYNC_ENTRY}`);
const VERSION = JSON.parse(readFileSync(P('package.json'), 'utf8')).version;
if (!/^\d+\.\d+\.\d+$/.test(VERSION || '')) die(`package.json version "${VERSION}" is not X.Y.Z`);
if (!src.includes('__APP_VERSION__') || !src.includes('__APP_BUILD__')) die('src/ lacks the __APP_VERSION__ / __APP_BUILD__ placeholders');
const stamp = (html, build) => html.replaceAll('__APP_VERSION__', VERSION).replaceAll('__APP_BUILD__', build);

/* the @web-only markers are gone (0.9 P4): there is one build, so one is never added back */
if (shell.includes('@web-only') || shell.includes('@end-web-only')) die('src/index.html: @web-only markers are retired (one build since 0.7 P9)');

/* icons: every referenced icon exists; every shipped icon is referenced. PNG, and WebP (0.8 P12: the class emblems, kept
   as the bytes Metabot served) */
const ICON_RE = /assets\/icons\/([\w-]+\.(?:png|webp))/g;
const used = new Set([...src.matchAll(ICON_RE)].map(m => m[1]));
const shipped = readdirSync(P('src/assets/icons')).filter(f => /\.(png|webp)$/.test(f));
for (const n of used) if (!shipped.includes(n)) die(`src/ references assets/icons/${n}, which is missing`);
for (const n of shipped) if (!used.has(n)) die(`src/assets/icons/${n} is not referenced by src/`);
for (const n of readdirSync(P('src/assets/icons'))) if (!/\.(png|webp)$/.test(n)) die(`src/assets/icons/${n}: an icon is .png or .webp`);

/* fonts (self-hosted since 0.1.5): every referenced file exists, every shipped file is referenced, each family ships its
   OFL text; no request may go to a font service. */
const FONT_RE = /assets\/fonts\/([\w-]+\.woff2)/g;
const fontsUsed = new Set([...src.matchAll(FONT_RE)].map(m => m[1]));
const fontsShipped = readdirSync(P('src/assets/fonts')).filter(f => f.endsWith('.woff2'));
for (const f of fontsUsed) if (!fontsShipped.includes(f)) die(`src/ references assets/fonts/${f}, which is missing`);
for (const f of fontsShipped) if (!fontsUsed.has(f)) die(`src/assets/fonts/${f} is not referenced by src/`);
if (readdirSync(P('src/assets/fonts')).filter(f => /^OFL-.+\.txt$/.test(f)).length < 3) die('src/assets/fonts: an OFL license text is missing');
for (const [f, html] of [['src/', src], ['public/404.html', readFileSync(P('public/404.html'), 'utf8')]])
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) die(`${f} still requests Google Fonts`);

/* web page */
const web = tightPaths(tightHtml(stamp(inline(shell, siteClasses()), 'site')));
if (/__APP_(VERSION|BUILD)__|__SYNC_CHUNK__/.test(web)) die('dist/index.html still contains a placeholder');
if (!web.includes(SYNC_FILE)) die(`dist/index.html does not name the sync chunk ${SYNC_FILE}`);
if (!web.startsWith('<!doctype html>')) die('dist/index.html must start with <!doctype html>');

/* output */
rmSync(DIST, { recursive: true, force: true }); mkdirSync(DIST, { recursive: true });
cpSync(P('public'), DIST, { recursive: true });
cpSync(P('src/assets'), join(DIST, 'assets'), { recursive: true });
writeFileSync(join(DIST, 'index.html'), web);
mkdirSync(join(DIST, 'packs'));
for (const id of CLASS_PACKS) writeFileSync(join(DIST, chunkFile(id)), chunks[id]);
writeFileSync(join(DIST, SYNC_FILE), syncJs);

/* service worker: build id = hash of everything it caches; the class chunks and the sync chunk are precached (offline after
   the first visit) */
const files = walk(DIST).map(f => relative(DIST, f).split('\\').join('/')).sort();
const precache = ['./', ...files.filter(f => f === 'index.html' || f === 'manifest.webmanifest' || f === 'favicon.svg' || /^(assets\/icons|icons)\/.+\.png$/.test(f) || /^assets\/icons\/.+\.webp$/.test(f) || /^assets\/fonts\/.+\.woff2$/.test(f) || /^packs\/[\w.-]+\.js$/.test(f) || f === SYNC_FILE)];
for (const id of CLASS_PACKS) if (!precache.includes(chunkFile(id))) die(`class chunk ${chunkFile(id)} is not precached`);
if (!precache.includes(SYNC_FILE)) die(`sync chunk ${SYNC_FILE} is not precached`);
const h = createHash('sha256');
for (const f of files) h.update(f + '\0').update(readFileSync(join(DIST, f)));
h.update(readFileSync(P('src/sw.js')));
const BUILD = h.digest('hex').slice(0, 12);
const sw = readFileSync(P('src/sw.js'), 'utf8').replace('__BUILD__', BUILD).replace('__PRECACHE__', JSON.stringify(precache, null, 1).replace(/\n\s*/g, ' '));
if (/__(BUILD|PRECACHE)__/.test(sw)) die('sw.js placeholders not filled');
writeFileSync(join(DIST, 'sw.js'), sw);
writeFileSync(join(DIST, 'build.json'), JSON.stringify({ build: BUILD }) + '\n');

const kb = f => (statSync(f).size / 1024).toFixed(1) + ' KB';
console.log(`build ${BUILD} · v${VERSION}`);
console.log(`  dist/index.html            ${kb(join(DIST, 'index.html'))} · ${walk(DIST).length} files · precache ${precache.length}`);
for (const id of CLASS_PACKS) console.log(`  ${('dist/' + chunkFile(id)).padEnd(26)} ${kb(join(DIST, chunkFile(id)))} · class chunk of ${id} (${genAll().perClass.length} tables; ${genAll().shared.length} shared in index.html)`);
console.log(`  ${('dist/' + SYNC_FILE).padEnd(26)} ${kb(join(DIST, SYNC_FILE))} · sync chunk (src/${SYNC_ENTRY}; loaded only when sync is shown, not in the page budget)`);

/* page budgets (0.4 P7): about 1.3x the 0.3.0 numbers; a PR that raises one says why (docs/ARCHITECTURE.md §4). The element
   budget is checked by the `site` suite. The site page is dist/index.html plus its largest class chunk (0.6 P2): what a
   visit loads. */
const bigChunk = CLASS_PACKS.map(id => chunks[id]).sort((a, b) => Buffer.byteLength(b) - Buffer.byteLength(a))[0];
const BUDGETS = [
  ['site page bytes (index + chunk)', Buffer.byteLength(web) + Buffer.byteLength(bigChunk), 870000],
  ['site page gzip -9 bytes', gzipSync(web, { level: 9 }).length + gzipSync(bigChunk, { level: 9 }).length, 200000],
];
/* node scripts/build.mjs --sizes (0.6 P1): where the page's gzip bytes go. A generated data table's row is its marginal cost:
   the page's gzip -9 size minus the size with that table bundled as null. Every other row is the part gzipped on its own,
   so those rows overlap (gzip shares repeated text across parts) and don't add up to the page. */
if (process.argv.includes('--sizes')) {
  const gz = s => gzipSync(s, { level: 9 }).length;
  const rows = [];
  const add = (group, name, text) => rows.push([group, name, Buffer.byteLength(text), gz(text)]);
  const gen = genResult();
  /* measured on the page with every class chunk inlined (with one class: the site's index.html plus its chunk) */
  const whole = gz(inline(shell)), keep = minified, keepChunks = chunks;
  const tables = [gen.module, gen.gateModule, gen.proposedModule, gen.placeModule].flatMap(m => [...m.matchAll(/^export const (\w+) = (.*);$/gm)].map(x => [x[1], x[2].length]));
  for (const [name, raw] of tables) {
    dropTables([name]);
    minified = await minifyAll(Object.fromEntries(await Promise.all(Object.keys(bundles).map(async e => [e, await bundleOne(e)]))));
    chunks = Object.fromEntries(await Promise.all(CLASS_PACKS.map(async id => [id, await minChunk(id)])));
    rows.push(['data table', name, raw, whole - gz(inline(shell))]);
  }
  dropTables([]); minified = keep; chunks = keepChunks;
  for (const f of walk(P('src')).map(f => relative(P('src'), f).split('\\').join('/')).sort()) {
    if (f.endsWith('.css')) add('stylesheet', f, plainCss(f, readFileSync(P('src', f), 'utf8')));
    else if (f.endsWith('.js') && !/^(site|sw)\.js$/.test(f) && !f.startsWith('assets/')) add('script module', f, readFileSync(P('src', f), 'utf8'));
    else if (f.startsWith('cards/') || /^packs\/[\w-]+\/cards\//.test(f)) add('card markup', f, readFileSync(P('src', f), 'utf8'));
  }
  add('page', 'src/index.html shell', shell);
  add('page', 'dist/index.html (whole)', web);
  console.log('\n  gzip -9 bytes per part of the page (data tables: marginal cost; other rows: alone, so they overlap)\n');
  console.log('  ' + 'group'.padEnd(14) + 'part'.padEnd(52) + 'raw B'.padStart(9) + 'gzip B'.padStart(9));
  for (const [g, n, raw, z] of rows.sort((a, b) => a[0].localeCompare(b[0]) || b[3] - a[3]).filter(r => r[3] >= 300 || r[0] === 'page'))
    console.log('  ' + g.padEnd(14) + n.padEnd(52) + String(raw).padStart(9) + String(z).padStart(9));
}
for (const [name, n, max] of BUDGETS) console.log(`  budget ${name.padEnd(32)} ${String(n).padStart(9)} / ${max} (${(100 * n / max).toFixed(0)}%)`);
for (const [name, n, max] of BUDGETS) if (n > max) die(`budget "${name}": ${n} is over the limit ${max}`);
if (!existsSync(join(DIST, 'CNAME'))) die('dist/CNAME missing');
