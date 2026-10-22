#!/usr/bin/env node
/* Licence compliance checks, Node only, no browser, no build. checkCompliance() returns a list of problems; tests/schema.mjs
   runs it (so the CI data job fails on any), and `node tests/compliance.mjs` runs it alone. Code is PolyForm Strict 1.0.0
   (LICENSE), so in tracked files outside node_modules/ it fails on: an SPDX-License-Identifier naming any licence but
   PolyForm-Strict-1.0.0, an "MIT License" or "Permission is hereby granted, free of charge" text, and a LICENSE* /
   COPYING* file other than the root LICENSE. Exempt: the root LICENSE (line 72 names the MIT License of earlier
   versions), docs/** (plans and research quote the patterns), this file, and the font folders, which keep their own
   licence files. `overrides.files` ({ path: text }) adds or replaces files, so tests can pass fixtures without writing them. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ALLOWED_SPDX = 'PolyForm-Strict-1.0.0';
const EXEMPT_DIRS = ['docs/', 'src/assets/fonts/', 'tools/brand/fonts/'];
const EXEMPT_FILES = new Set(['LICENSE', 'tests/compliance.mjs']);
const TEXT_PATTERNS = [[/\bMIT License\b/i, 'an "MIT License" text'], [/Permission is hereby granted, free of charge/i, 'a "Permission is hereby granted, free of charge" text']];

const exempt = p => EXEMPT_FILES.has(p) || EXEMPT_DIRS.some(d => p.startsWith(d));

/* one file's problems; a file on disk is read and checked once per process (0.9 P6: the fixture runs in tests/schema.mjs
   re-read the whole tree each), an override text every time */
const diskCache = new Map();
const problemsOf = (root, p, text) => {
  const out = [];
  if (/^(LICENSE|COPYING)/i.test(basename(p))) out.push(`${p}: a licence file other than the root LICENSE`);
  if (text == null) {
    const k = root + '\0' + p;
    if (diskCache.has(k)) return [...out, ...diskCache.get(k)];
    const own = [];
    if (existsSync(join(root, p))) { const buf = readFileSync(join(root, p)); if (!buf.includes(0)) own.push(...textProblems(p, buf.toString('utf8'))); }
    diskCache.set(k, own); return [...out, ...own];
  }
  return [...out, ...textProblems(p, text)];
};
const textProblems = (p, text) => {
  const out = [];
  for (const m of text.matchAll(/SPDX-License-Identifier:[ \t]*([^\r\n]*)/g)) {
    const id = m[1].replace(/\s*(\*\/|-->|#}}|-}}).*$/, '').trim();
    if (id !== ALLOWED_SPDX) out.push(`${p}: SPDX-License-Identifier "${id}", expected ${ALLOWED_SPDX}`);
  }
  for (const [re, what] of TEXT_PATTERNS) if (re.test(text)) out.push(`${p}: contains ${what}; code is PolyForm Strict 1.0.0`);
  return out;
};
const trackedCache = new Map();
export function checkCompliance(root = ROOT, { files = {} } = {}) {
  if (!trackedCache.has(root)) trackedCache.set(root, execFileSync('git', ['ls-files', '-z'], { cwd: root, maxBuffer: 64 << 20 }).toString().split('\0').filter(Boolean));
  const paths = [...new Set([...trackedCache.get(root), ...Object.keys(files)])].filter(p => !p.startsWith('node_modules/') && !p.includes('/node_modules/') && !exempt(p));
  return [...paths.flatMap(p => problemsOf(root, p, files[p])), ...privacyKeyProblems(root, files), ...iconProvenanceProblems(root, files)];
}

/* CK-2 (0.9 P27): every file in src/assets/icons/ has a docs/ISSUES.md line naming it with a source page, a file URL and a
   date (two distinct URLs and a YYYY-MM-DD), or an entry in the "Owner list" section of the v2 research file. A row of kind
   owner-upload / owner-crop has no file URL anywhere: it needs an owner source (the screen or upload it names, in one cell)
   and a date instead. A blank placeholder row has neither, so it never counts. */
const ICON_DIR = 'src/assets/icons/', ICON_RESEARCH = 'docs/research/2026-10-icon-provenance-v2.md';
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function rowOk(line) {
  if (!/\d{4}-\d{2}-\d{2}/.test(line)) return false;
  if (/owner[- ](upload|crop)/i.test(line)) return line.split('|').some(c => /owner (upload|screen)\b[^|]*(`[^`]+`|\d{4}-\d{2}-\d{2})/i.test(c));
  return new Set(line.match(/https?:\/\/[^\s<>|)]+/g)).size >= 2;
}
function iconProvenanceProblems(root, files) {
  const issues = readText(root, files, 'docs/ISSUES.md');
  if (issues == null) return ['docs/ISSUES.md is missing; cannot check icon provenance'];
  const research = readText(root, files, ICON_RESEARCH);
  const ownerList = research == null ? '' : (/^## Owner list[^\n]*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m.exec(research)?.[1] ?? '');
  const listed = new Set(ownerList.match(/[\w-]+\.png/g));
  const tracked = [...new Set([...trackedCache.get(root), ...Object.keys(files)])];
  const icons = tracked.filter(p => p.startsWith(ICON_DIR) && !p.slice(ICON_DIR.length).includes('/') && (p in files || existsSync(join(root, p)))).map(p => p.slice(ICON_DIR.length));
  const lines = issues.split('\n');
  const out = [];
  for (const name of icons) {
    if (listed.has(name)) continue;
    const re = new RegExp('(?<![\\w.-])' + escapeRe(name) + '(?![\\w-])');
    const named = lines.filter(l => re.test(l));
    if (!named.some(rowOk)) out.push(`${ICON_DIR}${name}: no docs/ISSUES.md row with a source page, a file URL and a date (owner-upload / owner-crop: an owner source and a date), and not on the owner list in ${ICON_RESEARCH}${named.length ? ' (' + named.length + ' row(s) name it, none complete)' : ''}`);
  }
  return out;
}

/* CK-3 (0.9 P26): the save KEY exported by src/core/state.js appears in PRIVACY.md, and every companion-save-v<n> that
   PRIVACY.md names is that key (a ":before-import" suffix is fine). Read as text, so no module is loaded. */
const readText = (root, files, p) => files[p] ?? (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : null);
function privacyKeyProblems(root, files) {
  const state = readText(root, files, 'src/core/state.js'), privacy = readText(root, files, 'PRIVACY.md');
  if (state == null || privacy == null) return ['PRIVACY.md or src/core/state.js is missing; cannot check the save key'];
  const key = /export const KEY\s*=\s*["'`]([^"'`]+)["'`]/.exec(state)?.[1];
  if (!key) return ['src/core/state.js: no `export const KEY = "..."` found'];
  const named = [...new Set([...privacy.matchAll(/companion-save-v\d+/g)].map(m => m[0]))];
  const out = [];
  if (!privacy.includes(key)) out.push(`PRIVACY.md does not name the save key ${key} that src/core/state.js uses`);
  for (const n of named) if (n !== key) out.push(`PRIVACY.md names the save key ${n}, but src/core/state.js uses ${key}`);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const problems = checkCompliance();
  if (problems.length) { console.log(`COMPLIANCE CHECKS FAILED (${problems.length})`); for (const p of problems) console.log('  - ' + p); process.exit(1); }
  console.log('COMPLIANCE CHECKS PASSED');
}
