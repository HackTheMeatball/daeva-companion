/* The 0.7 S2 sync mockup: node docs/design/mockups/shoot-0.7-sync.mjs
   Writes 0.7-sync.html (every state once for a phone frame and once for a desktop frame, from the list below) and one PNG
   per frame into 0.7-sync/ (<id>-390.png, <id>-1500.png). Uses the repo's Playwright and the preinstalled Chromium.
   Every sentence is the proposed text in docs/design/0.7-sync-mockup.md §4; the code shown is a placeholder, not a real code. */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));

const CODE = 'DC1-AAAAA-BBBBB-CCCCC-DDDDD-EEEEE-FF';
// A code only wraps between groups (Design Lead fix 3): each group is one unbreakable span.
const grouped = c => c.split('-').map(g => `<span class="grp">${g}</span>`).join('-<wbr>');
const sw = on => `<span class="sw${on ? ' on' : ''}" role="switch" aria-checked="${on}" aria-label="Sync"></span>`;
const btn = (t, c = '') => `<span class="btn ${c}">${t}</span>`;
const line = (on, st, kind = '', extra = '') => `<div class="syncline"><span class="lbl">Sync</span>${sw(on)}${st ? `<span class="st ${kind}">${st}</span>` : ''}${extra}</div>`;
// While sync is on, "this browser only" would be false (Design Lead fix 1): strip.on replaces it.
const strip = l => `<div class="foot-demo"><div class="xfer"><span>${l.includes('sw on') ? 'Progress is saved in this browser; sync keeps a copy for your other devices.' : 'Progress is saved in this browser only.'}</span><span class="xfer-btn">Export progress</span><span class="xfer-btn">Import progress</span>${l}</div></div>`;
const card = (h, inner) => `<section class="card panel"><h2>${h}</h2>${inner}</section>`;
const opt = (t = 'Sync options ▾') => `<span class="xfer-btn" aria-haspopup="menu">${t}</span>`;
const syncNow = `<span class="xfer-btn">Sync now</span>`;
const advOn = (st, kind) => line(true, st, kind, syncNow + opt());
const basicOn = (st, kind) => line(true, st, kind);

const S = [
  ['n1', 'Off, Basic and Advanced alike: the label and the switch, nothing else', 'Basic', strip(line(false, ''))],
  ['t1', 'Switch flipped on: two choices, no code made yet', 'Both', strip(line(true, '')) + card('Turn on sync',
    '<p>Sync keeps your progress on your other devices. It is end-to-end encrypted; no account, no email.</p><div class="choices">' + btn('Make a new sync code', 'primary') + btn('I have a sync code') + btn('Cancel', 'quiet') + '</div>')],
  ['t2', 'New code, shown once: copy it, then type the last group back', 'Both', strip(line(true, 'Not synced yet')) + card('Your sync code',
    `<p>Save this code (a password manager works). Without it, the cloud copy can’t be opened.</p><div class="codebox">${grouped(CODE)}</div><div class="row2">${btn('Copy')}</div>` +
    '<div class="field"><label>Type the last group to confirm</label></div><div class="input"><span class="ph-t">Last group</span></div><div class="row2">' + btn('I’ve saved it', 'primary dis') + btn('Cancel', 'quiet') + '</div>')],
  ['t3', 'Last group typed: “I’ve saved it” enables, sync starts', 'Both', strip(line(true, 'Not synced yet')) + card('Your sync code',
    `<p>Save this code (a password manager works). Without it, the cloud copy can’t be opened.</p><div class="codebox">${grouped(CODE)}</div><div class="row2">${btn('Copy')}</div>` +
    '<div class="field"><label>Type the last group to confirm</label></div><div class="input">FF</div><div class="row2">' + btn('I’ve saved it', 'primary') + btn('Cancel', 'quiet') + '</div>')],
  ['j1', 'Join: paste the code; a typo is caught on the device, before any request', 'Both', strip(line(true, '')) + card('Use a sync code',
    `<div class="input code err">${grouped('DC1-AAAAA-BBBBB-CCCCC-DDDDD-EEEEE-FG')}</div><p class="msg err">That code has a typo. Check the last group.</p><div class="row2">${btn('Join', 'primary dis')}${btn('Cancel', 'quiet')}</div>`)],
  ['j2', 'Join, answer not-found: nothing created, nothing changed', 'Both', strip(line(true, '')) + card('Use a sync code',
    `<div class="input code">${grouped(CODE)}</div><p class="msg err">No cloud copy for this code. Check the code.</p><div class="row2">${btn('Join', 'primary')}${btn('Cancel', 'quiet')}</div>`)],
  ['j3', 'Join, answer ask: this device has progress of its own', 'Both', strip(line(true, '')) + card('This device already has progress',
    `<p>The cloud copy has progress too. Keep both merges the characters of both. Use the cloud copy replaces this device’s progress; the current save is kept as a backup first.</p><div class="row2">${btn('Keep both', 'primary')}${btn('Use the cloud copy')}${btn('Cancel', 'quiet')}</div>`)],
  ['j4', 'Join, answer adopt (this device had no progress): no question, one confirmation line', 'Both', strip(line(true, 'Synced · just now', 'ok')) + '<p class="msg ok" role="status" style="padding:0 var(--space-4)">Joined. This device now has the cloud copy’s characters.</p>'],
  ['s1', 'Status: synced (Basic: status and switch only)', 'Basic', strip(basicOn('Synced · 2 min ago', 'ok'))],
  ['s2', 'Status: synced (Advanced adds Sync now and Sync options)', 'Advanced', strip(advOn('Synced · 2 min ago', 'ok'))],
  ['s3', 'Status: a round is running', 'Both', strip(basicOn('Syncing…', ''))],
  ['s4', 'Status: not synced yet (on, no round has finished)', 'Both', strip(basicOn('Not synced yet', ''))],
  ['s5', 'Status: offline (the host can’t be reached; local saves go on)', 'Both', strip(basicOn('Offline · will sync when you’re back online', 'warn'))],
  ['s6', 'Status: conflict (three 412 retries lost; the next trigger tries again)', 'Both', strip(basicOn('Another device is syncing · trying again soon', 'warn'))],
  ['s7', 'Status: unreadable (the code doesn’t open the cloud copy; nothing is written)', 'Both', strip(basicOn('This code doesn’t open the cloud copy', 'bad')) ],
  ['s8', 'Status: update (the copy is from a newer build)', 'Both', strip(basicOn('Update the app to sync', 'warn') .replace('</div>', btn('Reload', 'quiet').replace('btn', 'xfer-btn') + '</div>'))],
  ['s9', 'Status: error (401, 413, 429, 5xx; one text for all)', 'Both', strip(basicOn('Sync failed, will retry', 'bad'))],
  ['m1', 'Sync options (Advanced): the four actions', 'Advanced', strip(advOn('Synced · 2 min ago', 'ok')) + `<div class="menu" role="menu">${btn('Show sync code')}${btn('New sync code')}${btn('Delete cloud copy', 'danger')}${btn('Turn off sync')}</div>`],
  ['m2', '“Show sync code” (S5 recommendation): the code again, with Copy', 'Advanced', strip(advOn('Synced · 2 min ago', 'ok')) + card('Your sync code', `<div class="codebox">${grouped(CODE)}</div><div class="row2">${btn('Copy')}${btn('Hide', 'quiet')}</div>`)],
  ['m3', '“New sync code”: a new id, the old cloud copy is deleted', 'Advanced', strip(advOn('Synced · 2 min ago', 'ok')) + card('Make a new sync code?',
    `<p>Other devices stop syncing until you give them the new code. The old cloud copy is deleted; your progress on this device stays.</p><div class="row2">${btn('Make a new code', 'primary')}${btn('Cancel', 'quiet')}</div>`)],
  ['d1', '“Delete cloud copy”: confirm', 'Advanced', strip(advOn('Synced · 2 min ago', 'ok')) + card('Delete the cloud copy?',
    `<p>The encrypted copy is removed from the server and sync turns off on this device. Other devices stop syncing. Your progress on this device stays.</p><div class="row2">${btn('Delete cloud copy', 'danger')}${btn('Cancel', 'quiet')}</div>`)],
  ['d2', '“Delete cloud copy”: done (the line is back to off)', 'Advanced', strip(line(false, '')) + '<p class="msg ok" role="status" style="padding:0 var(--space-4)">Cloud copy deleted. Sync is off.</p>'],
  ['o1', 'Switch turned off (Basic and Advanced): the code leaves this device, so it asks', 'Both', strip(basicOn('Synced · 2 min ago', 'ok')) + card('Turn off sync on this device?',
    `<p>The sync code is removed from this device. The cloud copy stays until it has gone unused for 180 days; without the code nobody can open it. Save the code first if you want to join again.</p><div class="row2">${btn('Turn off sync', 'danger')}${btn('Cancel', 'quiet')}</div>`)],
  ['a1', 'Artifact build (claude.ai): no sync line, no code, no option', 'Artifact', '<div class="foot-demo"><div class="xfer"><span>Progress is saved in this browser only.</span><span class="xfer-btn">Export progress</span><span class="xfer-btn">Import progress</span></div></div>'],
];

const frame = (id, cap, mode, body, wide) => `<div class="fr${wide ? ' dk-fr' : ''}"><p class="cap">${id.toUpperCase()} · ${wide ? 1500 : 390} · ${mode} · ${cap}</p><div class="${wide ? 'dk' : 'ph'}">${body}</div></div>`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>0.7 S2 sync mockup (static; layout only; the code shown is a placeholder)</title>
<link rel="stylesheet" href="0.7-sync.css">
</head><body>
<!-- Generated by shoot-0.7-sync.mjs. Static mockup, not the product. Sentences are the proposals in docs/design/0.7-sync-mockup.md §4. -->
<div class="frames" id="phones">
${S.map(([id, cap, mode, body]) => frame(id, cap, mode, body, false)).join('\n')}
</div>
<div class="frames" id="desktop">
${S.map(([id, cap, mode, body]) => frame(id, cap, mode, body, true)).join('\n')}
</div>
</body></html>
`;
writeFileSync(join(here, '0.7-sync.html'), html);
mkdirSync(join(here, '0.7-sync'), { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1700, height: 1000 } });
await p.goto(pathToFileURL(join(here, '0.7-sync.html')).href);
for (const f of await p.$$('.fr')) {
  const id = (await (await f.$('.cap')).innerText()).split(' ')[0].toLowerCase();
  const wide = await f.$('.dk');
  await (await f.$('.ph, .dk')).screenshot({ path: join(here, '0.7-sync', id + (wide ? '-1500' : '-390') + '.png') });
}
await b.close();
