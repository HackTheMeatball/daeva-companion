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
  return paths.flatMap(p => problemsOf(root, p, files[p]));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const problems = checkCompliance();
  if (problems.length) { console.log(`COMPLIANCE CHECKS FAILED (${problems.length})`); for (const p of problems) console.log('  - ' + p); process.exit(1); }
  console.log('COMPLIANCE CHECKS PASSED');
}
