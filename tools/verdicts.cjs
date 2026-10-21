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
// line, in order, with the name lower-cased. These are never the bot review's verdict (review below skips them).
const TAGGED = /^VERDICT:\s*(APPROVE|OK|CHANGES)\b.*?\(reviewer:\s*([^)]+?)\s*\)/;
const tagged = (body) => lines(body).map((l) => l.match(TAGGED)).filter(Boolean)
  .map(([, verdict, who]) => ({ reviewer: who.toLowerCase(), verdict }));

// The coordinator's deadlock exit for a reviewer who has ended: "REVIEW CLEAR (reviewer: <name>; trigger: <n|none>): <reason>",
// the reason at least 10 characters. Whether a clear is allowed (never on some triggers) stays in the workflow.
const CLEAR = /^REVIEW CLEAR \(reviewer:\s*([^;)]+?)\s*;\s*trigger:\s*([0-9a-z]+)\s*\):\s*(\S.{9,})$/;
const clears = (body) => lines(body).map((l) => l.match(CLEAR)).filter(Boolean)
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

module.exports = { clean, lines, design, data, tagged, clears, review, reviewOf, needsOpus, stuck };
