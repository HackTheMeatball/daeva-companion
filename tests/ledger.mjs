#!/usr/bin/env node
/* Rules and decisions ledger checks (docs/kaizen/LEDGER.md), Node only, no browser, no build. checkLedger() returns a
   list of problems; tests/schema.mjs runs it (so the CI data job fails on any), and `node tests/ledger.mjs` runs it alone.
   Checks: the exact header; unique ids; non-empty summary, owner and home; kind and status from their fixed sets; every
   repo-file home exists and its #anchor text is in that file (case-insensitive, backticks and runs of whitespace
   ignored); a DECISIONS home `docs/DECISIONS.md#YYYY-MM-DD / <Topic>` names a real `## YYYY-MM-DD` heading with a row of
   that Topic under it; issue homes are `#<n>`; every replaced_by is an existing id; and there is one decision row per
   DECISIONS table row (matched by date and topic, both ways), so a new decision without a ledger row fails CI. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HEADER = ['id', 'kind', 'area', 'summary', 'owner', 'home', 'status', 'since', 'ok_by', 'last_change', 'grade', 'replaced_by'];
const KINDS = new Set(['safety', 'owner-rule', 'process', 'decision']);
const STATUSES = new Set(['active', 'retired', 'trial', 'pending', 'superseded']);

/* RFC 4180 CSV: quoted fields, doubled quotes, newlines inside quotes */
export function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const norm = s => s.replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/* DECISIONS.md table rows under each `## YYYY-MM-DD` heading: Map date -> [topic, ...] */
export function decisionRows(md) {
  const byDate = new Map(); let date = null;
  for (const line of md.split('\n')) {
    const h = line.match(/^## (\d{4}-\d{2}-\d{2})\b/);
    if (h) { date = h[1]; if (!byDate.has(date)) byDate.set(date, []); continue; }
    if (line.startsWith('## ')) { date = null; continue; }
    if (!date || !line.startsWith('|')) continue;
    if (/^\|[\s|:-]*$/.test(line.trim()) || /^\|\s*#\s*\|/.test(line)) continue;
    byDate.get(date).push(line.trim().replace(/^\||\|$/g, '').split('|')[1].trim());
  }
  return byDate;
}

export function checkLedger(root = ROOT, { csvText } = {}) {
  const problems = [], file = join(root, 'docs/kaizen/ledger.csv');
  if (csvText == null && !existsSync(file)) return ['docs/kaizen/ledger.csv is missing'];
  const rows = parseCsv(csvText ?? readFileSync(file, 'utf8')).filter(r => r.some(c => c !== ''));
  const head = rows.shift() || [];
  if (head.join(',') !== HEADER.join(',')) problems.push(`header is "${head.join(',')}", expected "${HEADER.join(',')}"`);
  const recs = rows.map((r, i) => ({ line: i + 2, n: r.length, ...Object.fromEntries(HEADER.map((k, j) => [k, r[j] ?? ''])) }));
  const ids = new Set(), cache = new Map();
  const text = p => { if (!cache.has(p)) cache.set(p, readFileSync(join(root, p), 'utf8')); return cache.get(p); };
  const decMd = existsSync(join(root, 'docs/DECISIONS.md')) ? text('docs/DECISIONS.md') : '';
  const decs = decisionRows(decMd);
  for (const r of recs) {
    const at = `line ${r.line} (${r.id || 'no id'})`;
    if (r.n !== HEADER.length) problems.push(`${at}: ${r.n} fields, expected ${HEADER.length}`);
    if (!r.id) problems.push(`${at}: empty id`);
    else if (ids.has(r.id)) problems.push(`${at}: duplicate id`);
    ids.add(r.id);
    for (const k of ['summary', 'owner', 'home']) if (!r[k].trim()) problems.push(`${at}: empty ${k}`);
    if (!KINDS.has(r.kind)) problems.push(`${at}: kind "${r.kind}" not in ${[...KINDS].join('/')}`);
    if (!STATUSES.has(r.status)) problems.push(`${at}: status "${r.status}" not in ${[...STATUSES].join('/')}`);
    if (r.since && !/^\d{4}-\d{2}-\d{2}$/.test(r.since)) problems.push(`${at}: since "${r.since}" is not YYYY-MM-DD`);
    const home = r.home.trim();
    if (!home) continue;
    if (home.startsWith('#')) { if (!/^#\d+$/.test(home)) problems.push(`${at}: issue home "${home}" is not #<number>`); continue; }
    const k = home.indexOf('#'), path = k < 0 ? home : home.slice(0, k), anchor = k < 0 ? '' : home.slice(k + 1);
    if (!existsSync(join(root, path))) { problems.push(`${at}: home file ${path} does not exist`); continue; }
    if (!anchor) continue;
    const dm = path === 'docs/DECISIONS.md' && anchor.match(/^(\d{4}-\d{2}-\d{2}) \/ (.+)$/);
    if (dm) {
      if (!decs.has(dm[1])) problems.push(`${at}: DECISIONS has no "## ${dm[1]}" heading`);
      else if (!decs.get(dm[1]).some(t => norm(t) === norm(dm[2]))) problems.push(`${at}: no DECISIONS row "${dm[2]}" under ## ${dm[1]}`);
    } else if (!norm(text(path)).includes(norm(anchor))) problems.push(`${at}: anchor "${anchor}" not found in ${path}`);
  }
  for (const r of recs) if (r.replaced_by && !ids.has(r.replaced_by)) problems.push(`line ${r.line} (${r.id}): replaced_by "${r.replaced_by}" is not a ledger id`);
  /* one ledger row per DECISIONS row, both ways: (date, topic) pairs as multisets, not just a count */
  const left = new Map(), key = (d, t) => d + ' / ' + norm(t);
  for (const [d, ts] of decs) for (const t of ts) left.set(key(d, t), (left.get(key(d, t)) || 0) + 1);
  for (const r of recs.filter(r => r.kind === 'decision')) {
    const m = r.home.trim().match(/^docs\/DECISIONS\.md#(\d{4}-\d{2}-\d{2}) \/ (.+)$/);
    if (!m) { problems.push(`line ${r.line} (${r.id}): a decision's home must be docs/DECISIONS.md#YYYY-MM-DD / <Topic>`); continue; }
    const k = key(m[1], m[2]), c = left.get(k) || 0;
    if (c) left.set(k, c - 1); else if (decs.has(m[1]) && decs.get(m[1]).some(t => norm(t) === norm(m[2]))) problems.push(`line ${r.line} (${r.id}): a second ledger row for DECISIONS "${m[1]} / ${m[2]}"`);
  }
  for (const [k, c] of left) if (c) problems.push(`DECISIONS row "${k}" has no ledger row` + (c > 1 ? ` (${c} missing)` : ''));
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const problems = checkLedger();
  if (problems.length) { console.log(`LEDGER CHECKS FAILED (${problems.length})`); for (const p of problems) console.log('  - ' + p); process.exit(1); }
  console.log('LEDGER CHECKS PASSED');
}
