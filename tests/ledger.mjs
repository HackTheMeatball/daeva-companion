#!/usr/bin/env node
/* Rules and decisions ledger checks (docs/kaizen/LEDGER.md), Node only, no browser, no build. checkLedger() returns a
   list of problems; `node tests/ledger.mjs` is the `ledger` suite (tests/run.mjs, `checks` shard): the checks and their
   negative controls. It left tests/schema.mjs in 0.9 P6, so an edit to DECISIONS or the ledger can't red `schema`.
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
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HEADER = ['id', 'kind', 'area', 'summary', 'plain', 'owner', 'enforced_by', 'home', 'status', 'since', 'ok_by', 'last_change', 'grade', 'replaced_by', 'note'];
/* one accountable owner per row; enforced_by lists the others (or all / harness) */
export const OWNERS = new Set(['Isaac', 'Saul', 'Walter', 'Gus', 'Jane', 'Hank', 'Mike', 'Skyler', 'Huell', 'Gretchen', 'Lydia', 'Jesse', 'Gale', 'Francesca', 'Gomez', 'Howard', 'Holly', 'Ernesto', 'Nacho', 'Chuck', 'Ted', 'Todd']);
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

export function checkLedger(root = ROOT, { csvText, ledgerMd, teamCsv, changesCsv, auditsCsv, sopReadme, sopFiles, teamDocs } = {}) {
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
  const team = side('team.csv', teamCsv, ['name', 'role', 'title', 'joined', 'status', 'folded_into', 'used_to_own', 'never_does', 'role_id']);
  const changes = side('team-changes.csv', changesCsv, ['date', 'time', 'change', 'was', 'now', 'source']);
  const audits = side('audits.csv', auditsCsv, ['audit', 'rec', 'text', 'decides', 'status', 'decision', 'note']);
  /* team.csv names exactly OWNERS; a folded thread names the active thread it folded into */
  /* COM-20: a name may sit on two rows only when every such row has its own role_id and at most one is active;
     byName keeps the active row (else the last) */
  const names = team.map(t => t.name), byName = new Map();
  for (const t of team) if (!byName.has(t.name) || t.status === 'active') byName.set(t.name, t);
  const roleIds = team.map(t => t.role_id).filter(Boolean);
  for (const t of team) {
    if (t.n !== 9) problems.push(`${t.at} (${t.name}): ${t.n} fields, expected 9`);
    if (!OWNERS.has(t.name)) problems.push(`${t.at}: team.csv names "${t.name}", not in OWNERS`);
    if (t.role_id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.role_id)) problems.push(`${t.at} (${t.name}): role_id "${t.role_id}" is not lower-case-with-hyphens`);
    if (t.role_id && roleIds.indexOf(t.role_id) !== roleIds.lastIndexOf(t.role_id)) problems.push(`${t.at}: role_id "${t.role_id}" is listed twice`);
    const same = team.filter(u => u.name === t.name);
    if (same.length > 1 && (same.some(u => !u.role_id) || same.filter(u => u.status === 'active').length > 1)) problems.push(`${t.at}: "${t.name}" is listed twice (a reused name needs a role_id on each row and at most one active)`);
    if (!t.role || !t.title) problems.push(`${t.at} (${t.name}): empty role or title`);
    if (t.joined && !/^\d{4}-\d{2}-\d{2}$/.test(t.joined)) problems.push(`${t.at} (${t.name}): joined "${t.joined}" is not YYYY-MM-DD`);
    if (!['active', 'folded', 'closed'].includes(t.status)) problems.push(`${t.at} (${t.name}): status "${t.status}" not in active/folded/closed`);
    if ((t.status === 'folded') !== !!t.folded_into) problems.push(`${t.at} (${t.name}): folded_into is set exactly when status is folded`);
    else if (t.folded_into && byName.get(t.folded_into)?.status !== 'active') problems.push(`${t.at} (${t.name}): folded_into "${t.folded_into}" is not an active thread`);
  }
  for (const n of OWNERS) if (!names.includes(n)) problems.push(`team.csv is missing "${n}"`);
  /* a role doc docs/team/<name>.md has a "Status: ended <date>" line exactly when team.csv says the role is not active
     (team.csv is authoritative; Nacho's ruling on ending roles, 2026-10-21) */
  for (const t of team) {
    const f = join(root, 'docs/team', t.name.toLowerCase() + '.md');
    if (!existsSync(f)) continue;
    if (byName.get(t.name) !== t) continue;
    const ended = /^Status: ended \d{4}-\d{2}-\d{2}\s*$/m.test((teamDocs ?? {})[t.name] ?? readFileSync(f, 'utf8'));
    if (ended !== (t.status !== 'active')) problems.push(`docs/team/${t.name.toLowerCase()}.md: ${ended ? 'says "Status: ended" but team.csv says active' : `has no "Status: ended <date>" line but team.csv says ${t.status}`}`);
  }
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
  /* a home file normalized once, not once per row that anchors in it (0.9 P6: ~3 s of the old data suite) */
  const ncache = new Map(), ntext = p => { if (!ncache.has(p)) ncache.set(p, norm(text(p))); return ncache.get(p); };
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
    } else if (!ntext(path).includes(norm(anchor))) problems.push(`${at}: anchor "${anchor}" not found in ${path}`);
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
  /* the name that leads each Owner cell ("Walter (freeze enforced by Gus)" -> Walter) */
  const whoLeads = new Set(who.map(l => ((l.replace(/^\||\|$/g, '').split('|')[2] || '').trim().match(/^[A-Z][a-z]+/) || [''])[0]));
  return [...problems, ...checkSops(root, { recs, team, whoLeads, readme: sopReadme, files: sopFiles })];
}

/* Flow index and SOPs (docs/sops/README.md, docs/sops/FLOW-NN-<slug>.md). Checks: every file in docs/sops but the README
   is named FLOW-NN-<slug>.md; every index row has its file and every file has a row; the owner is one active team.csv
   name that leads a "Who does what" Owner cell, and matches the SOP's Owner section; status is draft (Last confirmed
   "Not yet") or confirmed (a YYYY-MM-DD date); the fixed sections are all there and not empty; each numbered step starts
   with its doer in bold, a known name or one of SOP_ACTORS; every rule id cited exists in ledger.csv and is active or
   trial; each "Rules it runs on" line is a link to that rule's ledger home, and the index's "Runs on" ids are among
   them; every relative link (inline, <angle> or reference style) resolves, #anchors included. */
export const SOP_SECTIONS = ['Purpose', 'Trigger', 'Owner', 'Inputs', 'Steps', 'Gates', 'Records', 'Failure and escalation',
  'Rules it runs on', 'Last confirmed by owner'];
/* doers that are automation or a role filled per run, not a standing thread */
export const SOP_ACTORS = new Set(['Kickoff', 'Pipeline', 'Auto-merge', 'CI', 'Builder', 'Reviewer', 'Fresh reviewer',
  'Research thread', 'Design Critic', 'Requesting thread', 'Recorder', 'Proposer', 'Outside reviewer', 'Rule owner',
  'Every report owner', 'New thread']);
const RULE_ID = /\bDEC-\d{8}-[a-z0-9-]+|\b(?:COM|MRG|PIP|Q|HC|LOG|PLN|KZ|DEC|TRK|CLK|ROL|REPO|NEW)-\d{2}\b/g;
const REPO_URL = 'https://github.com/HackTheMeatball/daeva-companion/issues/';
/* GitHub's heading anchors: lower case, punctuation dropped, spaces to hyphens */
const slugs = md => new Set(md.split('\n').filter(l => /^#{1,6} /.test(l)).map(l => l.replace(/^#+ /, '').trim().toLowerCase()
  .replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-')));
const links = md => [...md.matchAll(/\]\(<([^>]+)>\)|\]\(([^)\s]+)\)/g)].map(m => m[1] ?? m[2])
  .concat([...md.matchAll(/^ {0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?/gm)].map(m => m[1]));
export function checkSops(root = ROOT, { recs = [], team = [], whoLeads = new Set(), readme, files } = {}) {
  const dir = join(root, 'docs/sops'), problems = [];
  if (readme == null && !existsSync(join(dir, 'README.md'))) return existsSync(dir) ? ['docs/sops/README.md is missing'] : [];
  readme ??= readFileSync(join(dir, 'README.md'), 'utf8');
  files ??= Object.fromEntries(readdirSync(dir).filter(f => f !== 'README.md').map(f => [f, readFileSync(join(dir, f), 'utf8')]));
  for (const f of Object.keys(files)) if (!/^FLOW-\d{2}-[a-z0-9-]+\.md$/.test(f)) { problems.push(`docs/sops/${f}: not named FLOW-NN-<slug>.md`); delete files[f]; }
  const byId = new Map(recs.map(r => [r.id, r])), active = new Set(team.filter(t => t.status === 'active').map(t => t.name));
  const homeOf = id => { const h = byId.get(id).home.trim(); return h.startsWith('#') ? REPO_URL + h.slice(1) : join(root, h.split('#')[0]); };
  const target = to => /^https?:/.test(to) ? to : join(dir, decodeURI(to.split('#')[0]));
  const textOf = (path, self) => path === '' ? self : (files[path] ?? (existsSync(join(dir, path)) ? readFileSync(join(dir, path), 'utf8') : null));
  const cite = (at, text) => {
    for (const id of new Set(text.match(RULE_ID) || []))
      if (!byId.has(id)) problems.push(`${at}: cites ${id}, which is not in ledger.csv`);
      else if (!['active', 'trial'].includes(byId.get(id).status)) problems.push(`${at}: cites ${id}, which is ${byId.get(id).status}`);
    for (const [, id, to] of text.matchAll(/\[`?([A-Z][A-Za-z0-9-]+)`?\]\(<?([^)\s>]+)>?\)/g))
      if (byId.has(id) && target(to) !== homeOf(id)) problems.push(`${at}: ${id} links to ${to}, not its home ${byId.get(id).home.split('#')[0]}`);
    for (const to of links(text)) {
      if (/^(https?:|mailto:)/.test(to)) continue;
      const [path, frag] = decodeURI(to).split('#');
      if (path && !existsSync(join(dir, path)) && !(path in files)) { problems.push(`${at}: dead link ${to}`); continue; }
      if (frag != null && (path === '' || path.endsWith('.md')) && !slugs(textOf(path, text) ?? '').has(frag.toLowerCase())) problems.push(`${at}: dead anchor ${to}`);
    }
  };
  cite('docs/sops/README.md', readme);
  const flows = (readme.split(/^## Flows\s*$/m)[1] || '').split(/^## /m)[0].split('\n').filter(l => /^\| *FLOW-/.test(l));
  if (!flows.length) problems.push('docs/sops/README.md: no rows under "## Flows"');
  const listed = new Set();
  for (const l of flows) {
    const c = l.replace(/^\||\|$/g, '').split('|').map(x => x.trim()), [id, , , owner, sop, runsOn, status] = c, at = `docs/sops/README.md ${id}`;
    if (c.length !== 7) { problems.push(`${at}: needs Id | Flow | Trigger | Owner | SOP | Runs on | Status`); continue; }
    if (listed.has(id)) problems.push(`${at}: listed twice`);
    listed.add(id);
    const f = (sop.match(/\]\(([^)]+)\)/) || [])[1] || '';
    if (!f.startsWith(id + '-') || !(f in files)) { problems.push(`${at}: SOP link "${f}" is not a docs/sops/${id}-<slug>.md file`); continue; }
    if (!OWNERS.has(owner) || !active.has(owner)) problems.push(`${at}: owner "${owner}" is not an active team.csv name`);
    else if (!whoLeads.has(owner)) problems.push(`${at}: owner "${owner}" leads no "Who does what" Owner cell`);
    if (!['draft', 'confirmed'].includes(status)) problems.push(`${at}: status "${status}" not in draft/confirmed`);
    const md = files[f], fa = `docs/sops/${f}`, sec = name => (md.split(new RegExp(`^## ${name}\\s*$`, 'm'))[1] || '').split(/^## /m)[0].trim();
    for (const s of SOP_SECTIONS) if (!new RegExp(`^## ${s}\\s*$`, 'm').test(md)) problems.push(`${fa}: missing section "## ${s}"`);
      else if (!sec(s)) problems.push(`${fa}: section "## ${s}" is empty`);
    if (!md.startsWith(`# ${id}: `)) problems.push(`${fa}: first line must be "# ${id}: <flow name>"`);
    if ((sec('Owner').match(/^\*\*(\w+)\*\*/) || [])[1] !== owner) problems.push(`${fa}: Owner section must start with **${owner}** (the index owner)`);
    const conf = sec('Last confirmed by owner');
    if (status === 'confirmed' && !/\d{4}-\d{2}-\d{2}/.test(conf)) problems.push(`${fa}: confirmed, but "Last confirmed by owner" has no date`);
    if (status === 'draft' && !/^Not yet/.test(conf)) problems.push(`${fa}: draft, so "Last confirmed by owner" starts "Not yet"`);
    const steps = sec('Steps').split('\n').filter(x => /^\d+\. /.test(x));
    if (!steps.length) problems.push(`${fa}: no numbered steps`);
    for (const s of steps) { const d = (s.match(/^\d+\. \*\*([^*]+)\*\*/) || [])[1];
      if (!d) problems.push(`${fa}: step "${s.slice(0, 40)}" doesn't start with its doer in bold`);
      else if (!d.split(/ and |, /).every(n => (OWNERS.has(n) && (n === 'Isaac' || active.has(n))) || SOP_ACTORS.has(n))) problems.push(`${fa}: step doer "${d}" is not an active name or a known actor`); }
    const ruled = new Set();
    for (const r of sec('Rules it runs on').split('\n').filter(x => x.trim())) {
      const m = r.match(/^- \[([^\]]+)\]\([^)]+\)/);
      if (!m || !byId.has(m[1])) problems.push(`${fa}: Rules line "${r.slice(0, 40)}" is not "- [<ledger id>](<its home>): ..."`);
      else ruled.add(m[1]);
    }
    for (const r of runsOn.match(RULE_ID) || []) if (!ruled.has(r)) problems.push(`${at}: Runs on names ${r}, which ${f} doesn't list under "Rules it runs on"`);
    cite(fa, md);
  }
  for (const f of Object.keys(files)) if (!listed.has(f.slice(0, 7))) problems.push(`docs/sops/${f} has no row in the flow index`);
  return problems;
}

/* the `ledger` suite (0.9 P6: its own suite in the `checks` shard, so a DECISIONS-only edit can't red `schema`): the
   ledger and SOP checks pass, and each rejects its broken copies (passed as overrides, never written) */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let n = 0, fail = 0;
  const ok = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 900) : '')); if (!c) fail++; };
  const t0 = Date.now();
  const problems = checkLedger(); ok(`rules and decisions ledger checks (${problems.length} problems)`, !problems.length, problems);
  /* ...and it rejects broken copies: a dropped decision row, a doubled one, a bad status, a dead anchor, an empty plain,
     an owner outside the list, an unknown enforced_by or one repeating the owner, an id in plain, a "Retired:" prefix in plain, a decision not Isaac's,
     a team.csv that differs from OWNERS or folds into a non-active thread, an unknown team-change source or audit status */
  const csv = readFileSync(join(ROOT, 'docs/kaizen/ledger.csv'), 'utf8').split('\n'), dec = csv.findIndex(l => l.includes(',decision,'));
  const rule = csv.findIndex((l, i) => i > 0 && l.includes(',CLAUDE.md#'));
  const fails = (label, lines, re) => { const p = checkLedger(ROOT, { csvText: lines.join('\n') }); ok('ledger check rejects: ' + label, p.some(x => re.test(x)), p.slice(0, 3)); };
  fails('a DECISIONS row with no ledger row', csv.filter((_, i) => i !== dec), /has no ledger row/);
  fails('two ledger rows for one DECISIONS row', [...csv, csv[dec].replace(/^DEC-[^,]+/, 'DEC-dup')], /a second ledger row/);
  fails('an unknown status', csv.map((l, i) => i === dec ? l.replace(',active,', ',live,') : l), /status "live"/);
  fails('a dead anchor', csv.map((l, i) => i === rule ? l.replace(/CLAUDE\.md#[^,"]+/, 'CLAUDE.md#no such phrase anywhere') : l), /anchor "no such phrase anywhere" not found/);
  /* plain wording and one owner per row (Design Lead, Rules tab): COM-01 is owner Saul, enforced_by all */
  const com = csv.findIndex(l => l.startsWith('COM-01,'));
  fails('an empty plain', csv.map((l, i) => i === com ? l.replace(',Any time given to Isaac is written in US Eastern time.,', ',,') : l), /empty plain/);
  fails('an owner outside the list', csv.map((l, i) => i === com ? l.replace(',Saul,all,', ',Saul and Gus,all,') : l), /owner "Saul and Gus" is not one of/);
  fails('an unknown enforced_by', csv.map((l, i) => i === com ? l.replace(',Saul,all,', ',Saul,everyone,') : l), /enforced_by "everyone"/);
  fails('enforced_by repeating the owner', csv.map((l, i) => i === com ? l.replace(',Saul,all,', ',Saul,Saul,') : l), /enforced_by repeats the owner/);
  fails('an issue number in plain', csv.map((l, i) => i === com ? l.replace(',Any time given to Isaac is written in US Eastern time.,', ',Any time given to Isaac is in ET (#114).,') : l), /plain names "#114"/);
  fails('a rule id in plain', csv.map((l, i) => i === com ? l.replace(',Any time given to Isaac is written in US Eastern time.,', ',Same as COM-02.,') : l), /plain names "COM-02"/);
  fails('a status prefix in plain', csv.map((l, i) => i === com ? l.replace(',Any time given to Isaac is written in US Eastern time.,', ',Retired: times were in UTC.,') : l), /plain starts "Retired"/);
  fails('a decision not owned by Isaac', csv.map((l, i) => i === dec ? l.replace(/^([^,]*,decision,[^,]*,(?:"[^"]*"|[^,]*),(?:"[^"]*"|[^,]*),)Isaac,/, '$1Walter,') : l), /a decision's owner is Isaac/);
  const lmd = readFileSync(join(ROOT, 'docs/kaizen/LEDGER.md'), 'utf8');
  const tcsv = readFileSync(join(ROOT, 'docs/kaizen/team.csv'), 'utf8');
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/^Gomez,/gm, 'Badger,') }); ok('ledger check rejects: a team.csv that differs from OWNERS', p.some(x => /names "Badger"/.test(x)) && p.some(x => /missing "Gomez"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/^Hank,(.*),folded,Mike,/m, 'Hank,$1,folded,Badger,') }); ok('ledger check rejects: folded into a thread that is not active', p.some(x => /folded_into "Badger"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/,closed,(.*),team-audit$/m, ',active,$1,team-audit') }); ok('ledger check rejects: a reused name with two active rows', p.some(x => /"Gomez" is listed twice/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/,team-audit$/m, ',') }); ok('ledger check rejects: a reused name on a row without a role_id', p.some(x => /"Gomez" is listed twice/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/,team-audit$/m, ',review-broker') }); ok('ledger check rejects: a duplicate role_id', p.some(x => /role_id "review-broker" is listed twice/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamCsv: tcsv.replace(/,team-audit$/m, ',Team_Audit') }); ok('ledger check rejects: a role_id not lower-case-with-hyphens', p.some(x => /role_id "Team_Audit"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamDocs: { Skyler: '# Skyler\n' } }); ok('ledger check rejects: an ended role whose doc has no Status: ended line', p.some(x => /skyler\.md: has no "Status: ended/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { teamDocs: { Gus: '# Gus\n\nStatus: ended 2026-10-21\n' } }); ok('ledger check rejects: an active role whose doc says Status: ended', p.some(x => /gus\.md: says "Status: ended"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { changesCsv: readFileSync(join(ROOT, 'docs/kaizen/team-changes.csv'), 'utf8').replace('DEC-20261019-incident-log-folds-into-stall', 'DEC-nope') }); ok('ledger check rejects: a team change citing an unknown decision', p.some(x => /source "DEC-nope"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { auditsCsv: readFileSync(join(ROOT, 'docs/kaizen/audits.csv'), 'utf8').replace(',done,', ',finished,') }); ok('ledger check rejects: an unknown audit status', p.some(x => /status "finished"/.test(x)), p.slice(0, 3)); }
  { const p = checkLedger(ROOT, { ledgerMd: lmd.replace('| Only Huell changes what the tracker shows', '| Only Huell writes TRK-01 data') }); ok('ledger check rejects: a rule id in Who does what Plain', p.some(x => /Plain has "TRK-01"/.test(x)), p.slice(0, 3)); }
  /* flow index and SOPs (docs/sops): a stale owner, a dead or retired rule, a link away from a rule's home, a dead
     link, an unknown doer, an index row with no file */
  const sdir = join(ROOT, 'docs/sops'), readme = readFileSync(join(sdir, 'README.md'), 'utf8');
  const sops = Object.fromEntries(readdirSync(sdir).filter(f => /^FLOW-\d{2}-/.test(f)).map(f => [f, readFileSync(join(sdir, f), 'utf8')]));
  ok('flow index lists every SOP file (at least 23 flows)', Object.keys(sops).length >= 23 && Object.keys(sops).every(f => readme.includes(`](${f})`)), Object.keys(sops).length);
  const merge = Object.keys(sops).find(f => f.startsWith('FLOW-09-'));
  const sopFails = (label, o, re) => { const p = checkLedger(ROOT, o); ok('SOP check rejects: ' + label, p.some(x => re.test(x)), p.slice(0, 3)); };
  sopFails('an owner who left the team', { sopReadme: readme.replace('| Merge | A PR meets every gate | Gus |', '| Merge | A PR meets every gate | Hank |') }, /owner "Hank" is not an active/);
  sopFails('a retired rule', { sopFiles: { ...sops, [merge]: sops[merge] + '\nSee PIP-13.\n' } }, /cites PIP-13, which is retired/);
  sopFails('a rule id not in the ledger', { sopFiles: { ...sops, [merge]: sops[merge] + '\nSee MRG-99.\n' } }, /cites MRG-99, which is not in ledger/);
  sopFails('a rule linked away from its home', { sopFiles: { ...sops, [merge]: sops[merge].replace('[MRG-01](../team/gus.md)', '[MRG-01](../team/walter.md)') } }, /MRG-01 links to \.\.\/team\/walter\.md/);
  sopFails('a dead link', { sopFiles: { ...sops, [merge]: sops[merge] + '\n[gone](../no-such-file.md)\n' } }, /dead link \.\.\/no-such-file\.md/);
  sopFails('an unknown step doer', { sopFiles: { ...sops, [merge]: sops[merge].replace(/^1\. \*\*[^*]+\*\*/m, '1. **Hank**') } }, /step doer "Hank"/);
  { const { [merge]: _, ...rest } = sops; sopFails('an index row with no file', { sopFiles: rest }, /FLOW-09: SOP link/); }
  sopFails('a file with no index row', { sopReadme: readme.split('\n').filter(l => !l.startsWith('| FLOW-09 ')).join('\n') }, /FLOW-09-merge\.md has no row in the flow index/);
  sopFails('a file not named FLOW-NN-<slug>.md', { sopFiles: { ...sops, 'FLOW-100-x.md': sops[merge] } }, /FLOW-100-x\.md: not named/);
  sopFails('a pending rule', { sopFiles: { ...sops, [merge]: sops[merge] + '\nSee KZ-12.\n' } }, /cites KZ-12, which is pending/);
  sopFails('a missing section', { sopFiles: { ...sops, [merge]: sops[merge].replace('## Records', '## Logs') } }, /missing section "## Records"/);
  sopFails('an empty section', { sopFiles: { ...sops, [merge]: sops[merge].replace(/## Gates\n[\s\S]*?\n## Records/, '## Gates\n\n## Records') } }, /section "## Gates" is empty/);
  sopFails('a bad status', { sopReadme: readme.replace(/(\| FLOW-09 .*\| )(?:draft|confirmed) \|/, '$1done |') }, /status "done" not in draft\/confirmed/);
  sopFails('an owner who only appears mid-cell', { sopReadme: readme.replace('| Merge | A PR meets every gate | Gus |', '| Merge | A PR meets every gate | Isaac |') }, /owner "Isaac" leads no "Who does what"/);
  sopFails('a Runs on id the SOP does not list', { sopReadme: readme.replace(/(\| FLOW-09 .*\| )(MRG-01)/, '$1PIP-01, $2') }, /Runs on names PIP-01/);
  sopFails('a Rules line that is not a link', { sopFiles: { ...sops, [merge]: sops[merge].replace('- [MRG-01](../team/gus.md)', '- MRG-01') } }, /Rules line "- MRG-01/);
  sopFails('a dead anchor', { sopFiles: { ...sops, [merge]: sops[merge] + '\n[x](README.md#no-such-heading)\n' } }, /dead anchor README\.md#no-such-heading/);
  sopFails('a dead reference-style link', { sopFiles: { ...sops, [merge]: sops[merge] + '\n[x]: ../gone.md\n' } }, /dead link \.\.\/gone\.md/);
  console.log(`${n - fail} ok, ${fail} failed (${Date.now() - t0} ms)`);
  console.log(fail ? `LEDGER CHECKS FAILED (${fail})` : 'LEDGER CHECKS PASSED');
  process.exit(fail ? 1 : 0);
}
