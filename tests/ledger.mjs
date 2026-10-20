#!/usr/bin/env node
/* Rules and decisions ledger checks (docs/kaizen/LEDGER.md), Node only, no browser, no build. checkLedger() returns a
   list of problems; tests/schema.mjs runs it (so the CI data job fails on any), and `node tests/ledger.mjs` runs it alone.
   Checks: the exact header; unique ids; non-empty summary, plain (≤ 200 chars, no issue numbers or rule ids, no
   "Retired:"/"Superseded:" prefix), owner and
   home; owner is one known name (Isaac for a decision) and enforced_by is empty or ;-separated known names, all or
   harness, never repeating the owner; kind and status from their fixed sets; every
   repo-file home exists and its #anchor text is in that file (case-insensitive, backticks and runs of whitespace
   ignored); a DECISIONS home `docs/DECISIONS.md#YYYY-MM-DD / <Topic>` names a real `## YYYY-MM-DD` heading with a row of
   that Topic under it; issue homes are `#<n>`; every replaced_by is an existing id; and there is one decision row per
   DECISIONS table row (matched by date and topic, both ways), so a new decision without a ledger row fails CI; and
   LEDGER.md's "Who does what" Plain column is everyday words; team.csv names exactly OWNERS (a folded thread names
   the active one it folded into); team-changes.csv and audits.csv have their headers, fixed values and real ledger ids. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HEADER = ['id', 'kind', 'area', 'summary', 'plain', 'owner', 'enforced_by', 'home', 'status', 'since', 'ok_by', 'last_change', 'grade', 'replaced_by', 'note'];
/* one accountable owner per row; enforced_by lists the others (or all / harness) */
export const OWNERS = new Set(['Isaac', 'Saul', 'Walter', 'Gus', 'Jane', 'Hank', 'Mike', 'Skyler', 'Huell', 'Gretchen', 'Lydia', 'Jesse', 'Gale', 'Francesca', 'Gomez', 'Howard', 'Holly', 'Ernesto']);
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

export function checkLedger(root = ROOT, { csvText, ledgerMd, teamCsv, changesCsv, auditsCsv } = {}) {
  const problems = [], file = join(root, 'docs/kaizen/ledger.csv');
  const md = ledgerMd ?? (existsSync(join(root, 'docs/kaizen/LEDGER.md')) ? readFileSync(join(root, 'docs/kaizen/LEDGER.md'), 'utf8') : '');
  /* team.csv, team-changes.csv, audits.csv: exact headers, as records keyed by column */
  const side = (name, text, header) => {
    const f = join(root, 'docs/kaizen', name);
    if (text == null && !existsSync(f)) { problems.push(`docs/kaizen/${name} is missing`); return []; }
    const rs = parseCsv(text ?? readFileSync(f, 'utf8')).filter(r => r.some(c => c !== '')), h = rs.shift() || [];
    if (h.join(',') !== header.join(',')) problems.push(`${name}: header is "${h.join(',')}", expected "${header.join(',')}"`);
    return rs.map((r, i) => ({ at: `${name} line ${i + 2}`, n: r.length, ...Object.fromEntries(header.map((k, j) => [k, r[j] ?? ''])) }));
  };
  const team = side('team.csv', teamCsv, ['name', 'role', 'title', 'joined', 'status', 'folded_into', 'used_to_own', 'never_does']);
  const changes = side('team-changes.csv', changesCsv, ['date', 'time', 'change', 'was', 'now', 'source']);
  const audits = side('audits.csv', auditsCsv, ['audit', 'rec', 'text', 'decides', 'status', 'decision', 'note']);
  /* team.csv names exactly OWNERS; a folded thread names the active thread it folded into */
  const names = team.map(t => t.name), byName = new Map(team.map(t => [t.name, t]));
  for (const t of team) {
    if (t.n !== 8) problems.push(`${t.at} (${t.name}): ${t.n} fields, expected 8`);
    if (!OWNERS.has(t.name)) problems.push(`${t.at}: team.csv names "${t.name}", not in OWNERS`);
    if (names.indexOf(t.name) !== names.lastIndexOf(t.name)) problems.push(`${t.at}: "${t.name}" is listed twice`);
    if (!t.role || !t.title) problems.push(`${t.at} (${t.name}): empty role or title`);
    if (t.joined && !/^\d{4}-\d{2}-\d{2}$/.test(t.joined)) problems.push(`${t.at} (${t.name}): joined "${t.joined}" is not YYYY-MM-DD`);
    if (!['active', 'folded', 'closed'].includes(t.status)) problems.push(`${t.at} (${t.name}): status "${t.status}" not in active/folded/closed`);
    if ((t.status === 'folded') !== !!t.folded_into) problems.push(`${t.at} (${t.name}): folded_into is set exactly when status is folded`);
    else if (t.folded_into && byName.get(t.folded_into)?.status !== 'active') problems.push(`${t.at} (${t.name}): folded_into "${t.folded_into}" is not an active thread`);
  }
  for (const n of OWNERS) if (!names.includes(n)) problems.push(`team.csv is missing "${n}"`);
  for (const c of changes) {
    if (c.n !== 6) problems.push(`${c.at}: ${c.n} fields, expected 6`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date)) problems.push(`${c.at}: date "${c.date}" is not YYYY-MM-DD`);
    if (c.time && !/^\d{1,2}:\d{2} (AM|PM)$/.test(c.time)) problems.push(`${c.at}: time "${c.time}" is not like 4:56 PM`);
    if (!c.change) problems.push(`${c.at}: empty change`);
  }
  const recs0 = audits.map(a => a.audit + ' ' + a.rec);
  for (const a of audits) {
    if (a.n !== 7) problems.push(`${a.at}: ${a.n} fields, expected 7`);
    if (!a.audit || !a.rec || !a.text) problems.push(`${a.at}: empty audit, rec or text`);
    if (recs0.indexOf(a.audit + ' ' + a.rec) !== recs0.lastIndexOf(a.audit + ' ' + a.rec)) problems.push(`${a.at}: ${a.audit} rec ${a.rec} is listed twice`);
    if (!['done', 'partial', 'scheduled', 'waiting', 'open'].includes(a.status)) problems.push(`${a.at}: status "${a.status}" not in done/partial/scheduled/waiting/open`);
  }
  /* "Who does what": five columns, and Plain is everyday words (no backticks, issue numbers, ids or ALL-CAPS tokens;
     that rejects "OK" too, on purpose: Plain says "approves") */
  const who = (md.split(/^## Who does what\s*$/m)[1] || '').split(/^## /m)[0].split('\n').filter(l => /^\|/.test(l) && !/^\|[\s|:-]*$/.test(l)).slice(1);
  for (const l of who) { const c = l.replace(/^\||\|$/g, '').split('|').map(x => x.trim()), bad = (c[1] || '').match(/`|#\d+|\b[A-Z]{2,}(?:-\d+)?\b/);
    if (c.length !== 5 || !c[1]) problems.push(`LEDGER.md Who does what "${c[0]}": needs Work | Plain | Owner | Not | Source`);
    else if (bad) problems.push(`LEDGER.md Who does what "${c[0]}": Plain has "${bad[0]}"; use everyday words`); }
  if (csvText == null && !existsSync(file)) return [...problems, 'docs/kaizen/ledger.csv is missing'];
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
    for (const k of ['summary', 'plain', 'owner', 'home']) if (!r[k].trim()) problems.push(`${at}: empty ${k}`);
    if (r.plain.length > 200) problems.push(`${at}: plain is ${r.plain.length} chars (max 200)`);
    const ref = r.plain.match(/#\d+|\b[A-Z]{2,4}-\d+\b/);
    if (ref) problems.push(`${at}: plain names "${ref[0]}"; say what it means instead of an issue number or rule id`);
    if (/^(retired|superseded)\b/i.test(r.plain)) problems.push(`${at}: plain starts "${r.plain.split(/[:\s]/)[0]}"; state the rule itself, status already marks it`);
    if (r.kind === 'decision' && r.owner && r.owner !== 'Isaac') problems.push(`${at}: a decision's owner is Isaac, not "${r.owner}"`);
    if (r.owner && !OWNERS.has(r.owner)) problems.push(`${at}: owner "${r.owner}" is not one of ${[...OWNERS].join('/')}`);
    if (r.enforced_by) for (const e of r.enforced_by.split(';').map(x => x.trim()))
      if (!OWNERS.has(e) && e !== 'all' && e !== 'harness') problems.push(`${at}: enforced_by "${e}" is not a known name, all or harness`);
      else if (e === r.owner) problems.push(`${at}: enforced_by repeats the owner "${e}"`);
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
  for (const c of changes) if (c.source && !ids.has(c.source)) problems.push(`${c.at}: source "${c.source}" is not a ledger id`);
  for (const a of audits) if (a.decision && !ids.has(a.decision)) problems.push(`${a.at}: decision "${a.decision}" is not a ledger id`);
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
