#!/usr/bin/env node
/* The fetch-log check (tools/fetchlog/check.mjs) on fixtures, no network and no shared folder: every rule it enforces fails
   a line that breaks it, and a clean log passes (guardrails §4–5; Build Pipeline owns the script, Watchdog runs it). < 1 s. */
import { checkLog, parseTime } from '../tools/fetchlog/check.mjs';

let n = 0, fail = 0;
const check = (ok, what) => { n++; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };
const HEAD = '| Time (UTC) | Host | URL / path | Purpose / thread | Status | Terms then robots first? | Terms URL read (first content request to a new host) | Verdict (terms OK / scraping-only / opt-out) |\n|---|---|---|---|---|---|---|---|';
const row = (...c) => `| ${c.join(' | ')} |`;
const log = (...rows) => [HEAD, ...rows].join('\n');
const rules = (text, opts) => checkLog(text, opts).findings.filter((f) => f.level === 'FAIL').map((f) => f.rule);
const warns = (text, opts) => checkLog(text, opts).findings.filter((f) => f.level === 'WARN').map((f) => f.rule);
const C = { file: 'legal/fetch-log/chuck.md' }, L = { file: 'legal/fetch-log/lydia.md' };

const TERMS = row('2026-10-21 14:00:00', 'example.org', '/terms', 'T-70 ruling on example.org reuse', '200', 'n/a (terms page)', 'https://example.org/terms', 'terms OK');
const ROBOTS = row('2026-10-21 14:00:10', 'example.org', '/robots.txt', 'T-70 ruling on example.org reuse', '200', 'yes', 'https://example.org/terms', 'terms OK');
const PAGE = (t, p = '/page', purpose = 'T-70 ruling on example.org reuse') => row(t, 'example.org', p, purpose, '200', 'yes', 'https://example.org/terms', 'terms OK');
const clean = log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:20'));

check(parseTime('2026-10-21 13:44:30') && parseTime('2026-10-21T03:29:20Z') && parseTime('2026-10-21 ~13:47').approx && !parseTime('14:00'), 'time: the three logged forms parse; a bare clock time does not');
check(rules(clean, C).length === 0 && warns(clean, C).length === 0, 'a clean Chuck log passes');
check(rules(log(row('14:00', 'example.org', '/terms', 'T-70', '200', '', 'x', 'terms OK')), C).includes('format'), 'format: a time with no date fails');
check(rules(log('| 2026-10-21 14:00:00 | example.org | /terms | T-70 |'), C).includes('format'), 'format: a line with fewer than 8 columns fails');
check(rules(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:20', '/page', 'checking a page')), C).includes('purpose'), 'purpose: a Chuck line naming no ruling, register row or T-NN fails');
check(rules(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:20', '/page', 'checking a page')), L).length === 0, 'purpose: the ruling rule is Chuck-only; another thread only needs a purpose');
check(rules(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:20', '/page', 'same, back-filled')), C).length === 0, 'purpose: "same" carries the line above');
check(warns(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:20', '/page', 'T-70, back-filled ~14:05Z')), C).includes('before'), 'before: a back-filled line warns');
check(rules(log(row('2026-10-21 14:00:00', 'example.org', '/page', 'T-70', '200', 'no', '', '')), C).includes('terms'), 'terms: a first content request with no terms URL read fails');
check(rules(log(row('2026-10-21 14:00:00', 'metabot.gg', '/en/aion-2/skills/x', 'T-70', '200', 'yes', 'SOURCES.md row', 'Full')), C).length === 0, 'terms: a vetted host citing its SOURCES.md row passes');
check(rules(log(row('2026-10-21 14:00:00', 'example.org', '/terms', 'T-70', '200', '', '', 'opt-out'), PAGE('2026-10-21 14:00:30')), C).includes('opt-out'), 'opt-out: a content request after an opt-out verdict fails');
check(rules(log(row('2026-10-21 14:00:00', 'example.org', '/terms', 'T-70', '200', '', '', 'opt-out'), row('2026-10-21 14:00:30', 'example.org', '/page', 'T-70', '200', 'yes', 'https://example.org/terms', 'opt-out')), C).includes('opt-out'), 'opt-out: a content line that repeats the opt-out verdict still fails');
check(rules(log(row('2026-10-21 14:00:00', 'aion2.th.gl', '/terms', 'T-70', '200', '', 'https://aion2.th.gl/terms', 'opt-out')), C).includes('banned'), 'banned: aion2.th.gl is never fetched');
check(rules(log(row('2026-10-21 14:00:00', 'game8.co', '/terms', 'T-70', '200', '', 'https://game8.co/terms', 'terms OK')), C).includes('banned'), 'banned: Game8 is never fetched');
const STOP = row('2026-10-21 14:00:20', 'example.org', '/page', 'result', '429', '', '', '');
check(rules(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:15'), STOP, PAGE('2026-10-21 14:30:00')), C).includes('stop'), 'stop: a request within 24 h after a 429 result fails');
check(rules(log(TERMS, ROBOTS, PAGE('2026-10-21 14:00:15'), STOP, PAGE('2026-10-22 15:00:00')), C).length === 0, 'stop: the host may be asked again after 24 h');
const burst = Array.from({ length: 13 }, (_, i) => PAGE(`2026-10-21 14:01:${String(10 + i * 4).padStart(2, '0')}`));
check(rules(log(TERMS, ROBOTS, ...burst), C).includes('rate'), 'rate: 13 requests to one host within 60 s fails');
check(!rules(log(TERMS, ROBOTS, ...burst.slice(0, 12)), C).includes('rate'), 'rate: 12 a minute passes');
check(rules(log(row('2026-10-21 14:00:00', '(web search tool)', '—', 'T-70', 'n/a', 'n/a', 'n/a', 'n/a')), C).includes('search'), 'search: a web-search line with no query fails');
check(rules(log(row('2026-10-21 14:00:00', '(web search tool)', 'query "fan site terms"', 'T-70', 'n/a', 'n/a', 'n/a', 'n/a')), C).length === 0, 'search: a web-search line with its query passes');
const many = Array.from({ length: 21 }, (_, i) => row(`2026-10-21 1${4 + Math.floor(i / 6)}:${String((i % 6) * 9).padStart(2, '0')}:00`, '(web search tool)', `query "q${i}"`, 'T-71 lawyer brief', 'n/a', 'n/a', 'n/a', 'n/a'));
check(warns(log(...many), C).includes('budget') && rules(log(...many), C).length === 0, 'budget: 21 requests for one T-NN warn (a #221 kind), not fail');
check(warns(log(PAGE('2026-10-21 14:05:00'), TERMS), C).includes('order'), 'order: a line earlier than the one above warns');
check(rules(log(PAGE('2026-10-21 13:00:00', '/page', 'Isaac asked'), TERMS, ROBOTS), { ...C, since: Date.parse('2026-10-21T13:30:00Z') }).length === 0, '--since: lines before the rule took effect are skipped');

console.log(`\n${n - fail}/${n} fetch-log checks passed`);
console.log(fail ? 'FETCHLOG CHECKS FAILED' : 'FETCHLOG CHECKS PASSED');
process.exit(fail ? 1 : 0);
