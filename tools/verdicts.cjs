/* The one reader of reviewer verdict lines in PR comments, for every CI gate (auto-merge.yml, pipeline.yml; tests in
   tests/automerge.mjs). Each workflow used to keep its own regex, and a writer's format the parser didn't expect broke a
   gate four times in a day (the last: bold "**DESIGN OK on <sha>**" went unseen, #559); Kaizen (Gale), 2026-10-20, asked
   for one parser. A line is read the way it renders: a leading "> " quote, emphasis (** * __ _) and backticks are
   dropped before matching. Struck text (~~...~~) is removed first, so a struck verdict never counts. Who may post a
   verdict stays in the workflows. CommonJS so actions/github-script can require it from a sparse checkout. */
'use strict';

// Struck spans may wrap lines but not cross a blank line (a GFM strike stays inside one paragraph).
const STRUCK = /~~(?:(?!\n[ \t]*\n)[\s\S])*?~~/g;
const clean = (line) => line.replace(/^(?:[ \t]*>[ \t]?)+/, '').replace(/\*+|_+|`+/g, '');
const lines = (body) => String(body || '').replace(STRUCK, '').split(/\r?\n/).map(clean);
// The same, without quoted lines ("> ..."): a named reviewer's verdict quoted in someone else's comment is not theirs.
const own = (body) => String(body || '').replace(STRUCK, '').split(/\r?\n/).filter((l) => !/^[ \t]*>/.test(l)).map(clean);

// Design Lead's mark: a line starting "DESIGN OK" or "DESIGN CHANGES". 'CHANGES' when any line says so, else 'OK', else null.
const DESIGN = /^DESIGN (OK|CHANGES)\b/;
const design = (body) => {
  const words = lines(body).map((l) => (l.match(DESIGN) || [])[1]).filter(Boolean);
  return words.includes('CHANGES') ? 'CHANGES' : words.length ? 'OK' : null;
};

// Game Data Check (ROL-03): every line starting "Game Data Check (ROL-03) on <sha>: VERIFIED|CHANGES|HOLD", in order.
const DATA = /^Game Data Check \(ROL-03\) on ([0-9a-f]{7,40}): (VERIFIED|CHANGES|HOLD)\b/;
const data = (body) => lines(body).map((l) => l.match(DATA)).filter(Boolean).map(([, sha, verdict]) => ({ sha, verdict }));

// A named reviewer's verdict: a line starting "VERDICT: APPROVE|OK|CHANGES" that carries "(reviewer: <name>)". Every such
// unquoted line, in order, with the name lower-cased and the line itself (the gate wants the head's sha on it); the gate reads
// only a comment's last one (Code Review, 2026-10-21). These are never the bot review's verdict (review below skips them).
const TAGGED = /^VERDICT:\s*(APPROVE|OK|CHANGES)\b.*?\(reviewer:\s*([^)]+?)\s*\)/;
const tagged = (body) => own(body).map((l) => [l, l.match(TAGGED)]).filter(([, m]) => m)
  .map(([line, [, verdict, who]]) => ({ reviewer: who.toLowerCase(), verdict, line }));
// The sha a tagged verdict line names: the head's short SHA when the line has it (the gate's own test), else the first other
// 7-40 hex word, else null. Only the line counts, never the comment's header (#768: a "Review of <sha>" header was read as on-head).
const lineSha = (line, sha) => (line.includes(sha.slice(0, 7)) ? sha.slice(0, 7) : ((line.match(/\b[0-9a-f]{7,40}\b/) || [])[0] || null));

// A fresh reviewer's mark: a line starting "FRESH REVIEW OK" or "FRESH REVIEW CHANGES". 'CHANGES' when any line says so, else
// 'OK'. A "FRESH REVIEW #<n> <sha7>" note with neither line is findings, so 'CHANGES' (Code Review, 2026-10-21: a sign-off
// ends "FRESH REVIEW OK <sha7>"). Otherwise null.
const FRESH = /^FRESH REVIEW (OK|CHANGES)\b/;
const fresh = (body) => {
  const all = own(body), words = all.map((l) => (l.match(FRESH) || [])[1]).filter(Boolean);
  if (words.includes('CHANGES')) return 'CHANGES';
  if (words.length) return 'OK';
  return all.some((l) => /^FRESH REVIEW #\d+/.test(l)) ? 'CHANGES' : null;
};
// The "FRESH REVIEW OK <sha>" lines of a note, unquoted (the gate wants the head's sha on one of them).
const freshOk = (body) => own(body).filter((l) => /^FRESH REVIEW OK\b/.test(l));

// A PR body's "Reviewers: <name>, <name>" line: the named reviewers whose approval of the head the merge needs. A note in
// parentheses after a name is dropped before the split, so "Francesca (records, plan text)" stays one name. A name written
// only in parentheses, "(Gale)", is kept as that name, and an unclosed "(" drops the rest of its entry only, so neither
// loses a reviewer or leaves one that can never approve (#745 review).
const reviewers = (body) => {
  const l = lines(body).find((x) => /^Reviewers:/.test(x));
  if (!l) return [];
  return l.replace(/^Reviewers:/, '').replace(/([^\s(,;])\s*\([^)]*\)/g, '$1').split(/[,;]/)
    .map((x) => x.trim().replace(/^\(\s*/, '').replace(/\s*\)$/, '').replace(/\s*\(.*$/, '').trim().toLowerCase()).filter(Boolean);
};

// The team roster (#741, Walter): the active rows of docs/kaizen/team.csv, the authoritative record of who is on the team
// (Org Design, Nacho, 2026-10-21: a closed or folded role such as Skyler or Hank is off it), plus the names the gates answer
// to. A Reviewers: entry outside it ("Legal sign-off per Chuck's ruling", #741, 84 min) can never be matched by a verdict,
// so auto-merge names it instead of waiting silently; it still blocks.
const GATES = ['design lead', 'game data check', 'fresh review'];
// One CSV row into fields: quoted fields may hold commas and "" for a quote.
const csvRow = (l) => {
  const out = []; let f = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(f); f = ''; } else f += ch;
  }
  out.push(f); return out;
};
const roster = (csv) => {
  const [head, ...rows] = String(csv).split(/\r?\n/).filter((l) => l.trim()).map(csvRow);
  const name = head.indexOf('name'), status = head.indexOf('status');
  // A team.csv without either column throws, so auto-merge skips the note rather than flag every name (#759 review).
  if (name < 0 || status < 0) throw new Error('team.csv needs name and status columns');
  return new Set([...GATES, ...rows.filter((r) => (r[status] || '').trim() === 'active').map((r) => r[name].trim().toLowerCase()).filter(Boolean)]);
};
const unknownReviewers = (body, names) => reviewers(body).filter((n) => !names.has(n));
// A person's hold line (MRG-09, #744): "HOLD: <condition> (owner: <name>)" on its own line, unquoted. Every such line, in
// order, as { cond, owner, reviewer }: reviewer is the gate name the condition waits on when it is one of the closed list
// (FRESH REVIEW OK, DESIGN OK, Game Data Check VERIFIED, VERDICT: APPROVE|OK (reviewer: <name>); "until …" and "… on head" or
// "… on <sha7>" allowed; the review must still name the head), else null, and a free-text condition is for its owner to judge.
const HOLD = /^HOLD:\s*(.+?)\s*\(owner:\s*([^)]+?)\s*\)\s*$/;
const HOLDCONDS = [
  [/^FRESH REVIEW OK$/, () => 'fresh review'],
  [/^DESIGN OK$/, () => 'design lead'],
  [/^(?:Game Data Check(?: \(ROL-03\))? )?VERIFIED$/, () => 'game data check'],
  [/^VERDICT:\s*(?:APPROVE|OK)\s*\(reviewer:\s*([^)]+?)\s*\)$/, (m) => m[1].toLowerCase()],
];
const holds = (body) => own(body).map((l) => l.trim().match(HOLD)).filter(Boolean).map(([, cond, owner]) => {
  const c = cond.replace(/^until\s+/i, '').replace(/\s+on (?:head|[0-9a-f]{7,40})$/i, '').trim();
  for (const [re, name] of HOLDCONDS) { const m = c.match(re); if (m) return { cond, owner, reviewer: name(m) }; }
  return { cond, owner, reviewer: null };
});

// The coordinator's deadlock exit for a reviewer who has ended: "REVIEW CLEAR (reviewer: <name>; trigger: <n|none>): <reason>",
// the reason at least 10 characters. Whether a clear is allowed (never on some triggers) stays in the workflow.
const CLEAR = /^REVIEW CLEAR \(reviewer:\s*([^;)]+?)\s*;\s*trigger:\s*([0-9a-z]+)\s*\):\s*(\S.{9,})$/;
const clears = (body) => own(body).map((l) => l.match(CLEAR)).filter(Boolean)
  .map(([, who, trigger, reason]) => ({ reviewer: who.toLowerCase(), trigger: trigger.toLowerCase(), reason: reason.trim() }));

// The bot review's "VERDICT: APPROVE|CHANGES", anywhere in the comment except a named reviewer's tagged line. 'CHANGES' when
// the text says it at all (an APPROVE that also says VERDICT: CHANGES doesn't count), else 'APPROVE', else null.
const review = (body) => {
  const text = lines(body).filter((l) => !TAGGED.test(l)).join('\n');
  return /VERDICT:\s*CHANGES/.test(text) ? 'CHANGES' : /VERDICT:\s*APPROVE/.test(text) ? 'APPROVE' : null;
};

// The pipeline review's own form: its first non-empty line is "Review of <sha7>" (MRG-03). Returns the sha or null.
const reviewOf = (body) => { const l = lines(body).find((x) => x.trim()); const m = l && l.match(/^Review of ([0-9a-f]{7,40})\b/); return m ? m[1] : null; };

// A Sonnet run handing over to Opus, and a run that reports it is stuck: a line starting with the marker.
const needsOpus = (body) => lines(body).some((l) => /^\s*Needs @claude \(Opus\):/.test(l));
const stuck = (body) => lines(body).some((l) => /^\s*Pipeline stuck:/.test(l));

module.exports = { clean, lines, own, design, data, tagged, lineSha, fresh, freshOk, reviewers, roster, unknownReviewers, holds, clears, review, reviewOf, needsOpus, stuck };
