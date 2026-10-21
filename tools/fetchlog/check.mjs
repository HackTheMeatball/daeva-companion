#!/usr/bin/env node
/* Mechanical check of the fetch logs in the shared folder (legal/fetch-log/<thread>.md; web-access guardrails §4–5,
   org-design/web-access-guardrails-chuck-lydia.md). Format, terms before content, rate per host, stop on 403 / 429 /
   challenge, banned hosts, a query on every web-search line and, for Chuck's log, a ruling, register row or T-NN on every
   line plus the 20-request budget per question. Judgment (scope, whether the purpose maps to legal output) stays with the
   per-minor fresh spot check. CI can't read the shared folder, so Watchdog (Mike) runs this each sweep:
     node tools/fetchlog/check.mjs [--since <ISO time>] [file …]   (default: /mnt/project-files/legal/fetch-log/chuck.md)
   A file named chuck.md gets the Chuck rules. Exit 1 on any FAIL; WARN lines don't fail. */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const BANNED = /(^|\.)th\.gl$|game8/i;
const BUDGET = 20;
// What a Chuck line must name: a T-NN, a ruling, a register row, a rule or decision id (guardrails §4, Gomez 1).
const PURPOSE = /\bT-\d+\b|\bruling\b|\bregister\b|\bROL-\d+\b|\bDEC-\d{8}|\bC\d+[a-z]?\b/i;
const KEY = /\bT-\d+\b|\bROL-\d+\b|\bDEC-[\w-]+|\bC\d+[a-z]?\b/i;
const TERMSPATH = /terms|legal|tos\b|conditions|\/policy|robots\.txt|licen[cs]e/i;
const TERMSREAD = /https?:\/\/|SOURCES\.md|known host/i;

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
// "2026-10-21 13:44:30", "2026-10-21T03:29:20Z", "2026-10-21 ~13:47" (approximate: minute only, no rate check).
export const parseTime = (s) => {
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](~)?(\d{2}:\d{2})(?::(\d{2}))?Z?$/);
  if (!m) return null;
  return { t: Date.parse(`${m[1]}T${m[3]}:${m[4] || '00'}Z`), approx: !!m[2] || !m[4] };
};

export function checkLog(text, { file = 'log.md', chuck = basename(file) === 'chuck.md', since = 0 } = {}) {
  const out = [];
  const fail = (ln, rule, msg) => out.push({ level: 'FAIL', ln, rule, msg });
  const warn = (ln, rule, msg) => out.push({ level: 'WARN', ln, rule, msg });
  const rows = [];
  text.split('\n').forEach((line, i) => {
    if (!/^\s*\|/.test(line) || /^\s*\|\s*-{3}/.test(line) || /^\s*\|\s*Time\b/i.test(line)) return;
    rows.push({ ln: i + 1, c: cells(line) });
  });
  const seen = new Map(); // host -> { optOut, stopped: time }
  const times = new Map(); // host -> exact request times
  const budget = new Map();
  let lastPurpose = '', lastT = -Infinity, lastReq = null;
  for (const { ln, c } of rows) {
    const [time = '', host = '', url = '', purpose = '', status = '', , termsRead = '', verdict = ''] = c;
    const when = parseTime(time);
    if (!when) { fail(ln, 'format', `time "${time}" is not UTC YYYY-MM-DD HH:MM[:SS]`); continue; }
    if (when.t < since) continue;
    if (c.length < 8) { fail(ln, 'format', `${c.length} columns, the header has 8`); continue; }
    if (!host) { fail(ln, 'format', 'no host'); continue; }
    if (/^result\b/i.test(purpose)) { // the outcome of the line before
      if (lastReq && /\b(403|429)\b|challenge/i.test(status)) seen.get(lastReq).stopped = when.t;
      continue;
    }
    if (/^note$/i.test(status) || (/^\(/.test(host) && !/search/i.test(host))) continue;
    if (when.t + 60e3 < lastT) warn(ln, 'order', `earlier than the line above (${time}); lines are added at the end, before the request`);
    lastT = Math.max(lastT, when.t);
    if (/back-?fill/i.test(purpose)) warn(ln, 'before', 'back-filled: written after the request, not before it');
    const p = /^same\b/i.test(purpose) ? lastPurpose : purpose;
    lastPurpose = p;
    if (!p) fail(ln, 'purpose', 'no purpose');
    else if (chuck && !PURPOSE.test(p)) fail(ln, 'purpose', 'names no ruling, register row or T-NN (guardrails §4: a line with no legal output is drift)');
    if (chuck) { const k = (p.match(KEY) || [p.slice(0, 40)])[0]; budget.set(k, (budget.get(k) || 0) + 1); }
    if (/search/i.test(host)) {
      if (!/query|"/i.test(url)) fail(ln, 'search', 'a web-search line names no query');
      continue;
    }
    const h = host.toLowerCase();
    lastReq = h;
    if (BANNED.test(h)) fail(ln, 'banned', `${h} is never fetched (CLAUDE.md: no automated reading of aion2.th.gl, no Game8)`);
    const isTerms = TERMSPATH.test(url);
    if (!seen.has(h)) {
      seen.set(h, { optOut: false, stopped: null });
      if (!isTerms && !TERMSREAD.test(termsRead)) fail(ln, 'terms', `first content request to ${h} names no terms URL already read`);
      if (!isTerms && !verdict) fail(ln, 'terms', `first content request to ${h} gives no verdict`);
    }
    const s = seen.get(h);
    if (s.optOut && !isTerms) fail(ln, 'opt-out', `${h} was ruled an opt-out above; no content request may follow`);
    if (/opt-?out/i.test(verdict) && !/terms OK|scraping-only/i.test(verdict)) s.optOut = true;
    if (s.stopped !== null && when.t - s.stopped < 24 * 3600e3) fail(ln, 'stop', `${h} answered 403 / 429 / a challenge within 24 h before this request`);
    if (/\b(403|429)\b|challenge/i.test(status)) s.stopped = when.t;
    if (!when.approx) {
      const ts = (times.get(h) || []).filter((t) => when.t - t < 60e3);
      ts.push(when.t);
      times.set(h, ts);
      if (ts.length > 12) fail(ln, 'rate', `${ts.length} requests to ${h} within 60 s (max 12/min per host)`);
    }
  }
  for (const [k, nReq] of budget) if (nReq > BUDGET) warn(0, 'budget', `${nReq} requests for "${k}" (budget ${BUDGET} before a coordinator check-in; log it as a #221 kind)`);
  return { rows: rows.length, findings: out };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const si = args.indexOf('--since');
  const since = si >= 0 ? Date.parse(args.splice(si, 2)[1]) : 0;
  if (Number.isNaN(since)) { console.error('--since needs an ISO time'); process.exit(2); }
  const files = args.length ? args : ['/mnt/project-files/legal/fetch-log/chuck.md'];
  let fails = 0;
  for (const f of files) {
    const { rows, findings } = checkLog(readFileSync(f, 'utf8'), { file: f, since });
    for (const x of findings) console.log(`${x.level} ${f}${x.ln ? ':' + x.ln : ''} ${x.rule}: ${x.msg}`);
    fails += findings.filter((x) => x.level === 'FAIL').length;
    console.log(`${f}: ${rows} lines, ${findings.filter((x) => x.level === 'FAIL').length} FAIL, ${findings.filter((x) => x.level === 'WARN').length} WARN`);
  }
  console.log(fails ? 'FETCH-LOG CHECKS FAILED' : 'FETCH-LOG CHECKS PASSED');
  process.exit(fails ? 1 : 0);
}
