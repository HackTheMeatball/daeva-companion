#!/usr/bin/env node
/* Data format v2 checks in Node, no browser, no build (0.2 step 5b): every data file and every schema example against
   data/schema/ with ajv 8 Ajv2020 { strict: true, allErrors: true }; broken copies of real records must be rejected
   (so a relaxed schema can't pass silently); then the generator's cross-record checks, and data/DATA_SOURCES.md must be
   what the generator writes; last, licence compliance. The rules and decisions ledger is its own suite (tests/ledger.mjs,
   0.9 P6), so a DECISIONS-only edit can't red this one.
   The generator's negative controls (each a generate() on an in-memory view, ~110 ms) are jobs that run in worker threads
   while the main thread runs the rest (0.9 P32, 4-vCPU box: 7.7 s before, ~7 s after; P32b: ~5.4 s locally;
   target < 4 s not yet met, moved to 0.10); their lines print after the
   main thread's, in job order. Data counts are read from data/expected-counts.json (`npm run gen -- --counts`), not pinned here.
   node tests/schema.mjs  (also in `npm test` and the fast CI job) */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { availableParallelism } from 'node:os';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { ROOT, validateAll, validateDoc } from '../tools/gen/validate.mjs';
import { COUNTS_FILE, countsJson, dataSourcesMd, generate, guidePacks, readExpected } from '../tools/gen/gen.mjs';
import { checkCompliance } from './compliance.mjs';
import { checkPlanCosts } from '../tools/gen/board-path.mjs';

const read = p => JSON.parse(readFileSync(join(ROOT, 'data', p), 'utf8'));
const E = readExpected() || {};
const SQ = 'data/packs/aion2/asmodian/story-quests.json', KIB = 'data/packs/aion2/asmodian/kibelisks.json', PK = 'data/packs/';
const stepWith = (d, f) => d.records.flatMap(r => r.steps).find(f);
const sqStep = (d, id, i) => d.records.find(r => r.id === id).steps.find(x => x.i === i);
const classDoc = (c, f) => JSON.parse(readFileSync(join(ROOT, 'data/packs/aion2/classes', c, f), 'utf8'));

/* ------------------------------------------------------------------ the generator's negative controls (worker jobs) */
/* job(fn): fn(ok, G) runs in a worker; ok(name, c, d) records a line, G() is that thread's generate() on the disk (lazy).
   The list is built the same way in every thread, so a job index means the same job everywhere. */
const JOBS = [], job = fn => JOBS.push(fn);
const runs = (ok, label, view) => { try { return generate(view); } catch (e) { ok('generator runs: ' + label, false, e.message); return null; } };
/* proposals never reach the page's data module: it is byte-identical without them (0.2 behaviour unchanged) */
job((ok, G) => { const g = G(); let g0 = null; try { g0 = generate({ dropProposed: true }); } catch (e) { ok('generator runs without proposals', false, e.message); return; }
  ok(`proposed 0.3 gates are not in the data module: identical without the ${g.report.proposed.length} proposals`, g0.module === g.module && g.report.proposed.length > 0);
  /* GATE_GRAPH (0.3 E1) compiles the live gates only: proposals off */
  ok('GATE_GRAPH identical without the proposals (live requires / completesWith only)', g0.gateModule === g.gateModule);
  /* GATE_PROPOSED (0.3 E4) holds exactly the proposals, compiled (the evaluator applies one only when asked, per id) */
  ok('GATE_PROPOSED: one entry per proposal, empty without them', Object.keys(g.gateProposed).sort().join() === g.report.proposed.map(p => p.id).sort().join() && Object.keys(g0.gateProposed).length === 0,
    [Object.keys(g.gateProposed).length, g.report.proposed.length, Object.keys(g0.gateProposed).length]); });
/* 0.9 P32: an in-memory view with no edits (packs.mjs fsView) compiles byte-identical modules to the real file system, so
   every control below differs from the real data by its edit only */
job((ok, G) => { const g = G(), gv = runs(ok, 'an in-memory view with no edits', { mutate: () => {} }); if (!gv) return;
  ok('an in-memory view with no edits (generate({ mutate: () => {} })) compiles byte-identical modules and the same checks', gv.module === g.module && gv.gateModule === g.gateModule
    && gv.proposedModule === g.proposedModule && gv.placeModule === g.placeModule && JSON.stringify(gv.report.checks) === JSON.stringify(g.report.checks), [gv.module === g.module, gv.report.checks.length, g.report.checks.length]); });
/* 0.3 E7 guard: a specialty pick beyond slot 1 needs a 2+ source slot witness in specialtyEvidence (owner on #75) */
const genFails = (label, mutate, re) => job(ok => { const g1 = runs(ok, label, { mutate: (rel, d) => rel === 'data/packs/aion2/asmodian/assassin/builds.json' && mutate(d.records[0]) }); if (!g1) return;
  ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check)); });
/* 0.8.1 F2 made Savage Roar 4 a labelled slot 2 pick (contested): the guard now uses a pick no entry backs, Storm Rampage 4 */
genFails('slot 2 pick without evidence (Storm Rampage 4)', r => { r.specialtyPicks['skill:assassin:storm-rampage'] = [...(r.specialtyPicks['skill:assassin:storm-rampage'] || ['spec:assassin:storm-rampage:1']), 'spec:assassin:storm-rampage:4'].slice(-2); }, /storm-rampage:4 \(slot 2\) has 2\+ source/);
genFails('labelled slot 2 pick without a note naming the alternative (Savage Roar 4, contested)', r => { delete r.specialtyEvidence['spec:assassin:savage-roar:4'].note; }, /savage-roar:4 \(slot 2\) has 2\+ source/);
genFails('slot witness not cited for specialtyPicks (GamesFuze)', r => { r.specialtyEvidence['spec:assassin:quick-slice:4'].sources[0] = 'https://gamesfuze.com/guides/aion-2-assassin-build-best-skills-stigmas-and-rotation/'; }, /quick-slice:4 \(slot 2\) has 2\+ source/);
genFails('evidence from one publisher only', r => { r.specialtyEvidence['spec:assassin:heart-gore:5'].sources = ['https://skycoach.gg/blog/aion-2/articles/assassin-guide', 'https://skycoach.gg/blog/aion-2/articles/assassin-guide']; }, /heart-gore:5 \(slot 3\) has 2\+ source/);
genFails('evidence for the wrong slot', r => { r.specialtyEvidence['spec:assassin:heart-gore:5'].slot = 2; }, /heart-gore:5 \(slot 3\) has 2\+ source/);
/* builds & macros (owner facts 2026-10-21; quickslots T-106): a macro sits on Quick Use 2–12, never Quick Use 1 (left click);
   the base attack (the Left click default) may only be a macro's last step (claim C21); at most 20 steps; a skill or stigma in
   one quickslot at a time; Quick Use 1 holds only the base attack; a lone-skill step needs a build guide's page */
const QU2_MACRO = steps => r => { r.keyStacks.macros = [{ quickslot: 'Quick Use 7', rows: [{ minLv: 1, steps }] }]; };
job(ok => { let msg = null; try { generate({ mutate: (rel, d) => { if (rel === 'data/packs/aion2/asmodian/assassin/builds.json') { QU2_MACRO([{ slot: 'Quick Use 2' }])(d.records[0]); d.records[0].keyStacks.macros[0].quickslot = 'Quick Use 1'; } } }); } catch (e) { msg = e.message; }
  ok('generator rejects: a macro on Quick Use 1 (left click)', !!msg && /keyStacks\/macros\/0\/quickslot must be equal to one of the allowed values/.test(msg), msg); });
job(ok => { let msg = null; try { generate({ mutate: (rel, d) => { if (rel === 'data/packs/aion2/asmodian/assassin/builds.json') QU2_MACRO(Array.from({ length: 21 }, () => ({ slot: 'Quick Use 2' })))(d.records[0]); } }); } catch (e) { msg = e.message; }
  ok('generator rejects: a macro of 21 steps', !!msg && /must NOT have more than 20 items/.test(msg), msg); });
genFails('the base attack before another macro step', QU2_MACRO([{ skill: 'skill:assassin:quick-slice' }, { slot: 'Quick Use 2' }]), /basic attack skill:assassin:quick-slice is the last step/);
genFails('a lone-skill step with no build guide page', r => { QU2_MACRO([{ skill: 'skill:assassin:ambush' }])(r); r.keyStacks.sources = r.keyStacks.sources.filter(x => !x.url); }, /lone-skill step skill:assassin:ambush has a cited page/);
/* C21 on what a macro fires, not only its skill steps (#787 review): the base attack inside a fired stack must be last too */
const QU_BASE = slot => r => { r.keyStacks.slots.push({ slot, rows: [{ minLv: 1, skills: ['skill:assassin:quick-slice'] }] }); };
genFails('the base attack fired first through a Quick Use 1 step', r => { QU_BASE('Quick Use 1')(r); QU2_MACRO([{ slot: 'Quick Use 1' }, { slot: 'Quick Use 2' }])(r); }, /basic attack skill:assassin:quick-slice is the last skill fired/);
genFails('the base attack fired first through another stack', r => { QU_BASE('Quick Use 3')(r); QU2_MACRO([{ slot: 'Quick Use 3' }, { slot: 'Quick Use 2' }])(r); }, /basic attack skill:assassin:quick-slice is the last skill fired/);
genFails('a macro for a class with no base attack (no Left click default)', r => { QU2_MACRO([{ slot: 'Quick Use 2' }])(r); r.keyStacks.defaultKeys.keys = r.keyStacks.defaultKeys.keys.filter(k => k.key !== 'Left click'); }, /macro Quick Use 7 needs the class's base attack/);
genFails('an E stigma also in a quickslot', r => { r.keyStacks.slots.push({ slot: 'Quick Use 3', rows: [{ minLv: 1, skills: [r.keyStacks.eOrder[0]] }] }); }, /no skill or stigma sits in two quickslots/);
/* the positive side: the base attack as the last fired skill, and a stigma in a quickslot row, are accepted */
const KS_FAIL = /keyStacks|quickslot|macro|Quick Use|base attack|basic attack/;
job(ok => { const g1 = runs(ok, 'the base attack last, a stigma in a quickslot', { mutate: (rel, d) => { if (rel !== 'data/packs/aion2/asmodian/assassin/builds.json') return; const r = d.records[0];
  QU_BASE('Quick Use 1')(r); QU2_MACRO([{ slot: 'Quick Use 2' }, { slot: 'Quick Use 1' }])(r);
  r.keyStacks.slots.push({ slot: 'Quick Use 9', rows: [{ minLv: 1, skills: [r.keyStacks.eOrder.pop()] }] }); } }); if (!g1) return;
  const bad = g1.failed.filter(x => KS_FAIL.test(x.check)).map(x => x.check);
  ok('generator accepts: the base attack as the last fired skill and a stigma in a quickslot row', bad.length === 0, bad); });
/* T-123 (owner 2026-10-22): a new step's Delay is 10 ms, so only another value needs a guide's page */
genFails('a step delay other than 10 ms with no cited page', r => { QU2_MACRO([{ slot: 'Quick Use 2', delayMs: 50 }])(r); r.keyStacks.sources = r.keyStacks.sources.filter(x => !x.url); }, /a step delay other than the game's 10 ms has a cited page/);
job(ok => { const g1 = runs(ok, 'the 10 ms default delay without a page', { mutate: (rel, d) => { if (rel !== 'data/packs/aion2/asmodian/assassin/builds.json') return; const r = d.records[0];
  QU2_MACRO([{ slot: 'Quick Use 2', delayMs: 10 }])(r); r.keyStacks.sources = r.keyStacks.sources.filter(x => !x.url); } }); if (!g1) return;
  const bad = g1.failed.filter(x => /delay/.test(x.check)).map(x => x.check);
  ok('generator accepts: the game\'s 10 ms default delay with no cited page', bad.length === 0, bad); });
genFails('a step that names an undefined quickslot', QU2_MACRO([{ slot: 'Quick Use 9' }]), /slot Quick Use 9 is defined in keyStacks\.slots/);
genFails('one skill in two quickslots', r => { r.keyStacks.slots.push({ slot: 'Quick Use 7', rows: [{ minLv: 1, skills: ['skill:assassin:savage-roar'] }] }); }, /no skill or stigma sits in two quickslots/);
genFails('Quick Use 1 holding something other than the base attack', r => { r.keyStacks.slots.push({ slot: 'Quick Use 1', rows: [{ minLv: 1, skills: ['skill:assassin:shadowstrike'] }] }); }, /Quick Use 1 \(left click\) from Lv 1 holds only the base attack/);
const genFailsIn = (label, rel, mutate, re) => job(ok => { const g1 = runs(ok, label, { mutate: (p, d) => p === rel && mutate(d) }); if (!g1) return;
  ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check)); });
/* 0.9 P15 choice points: a choice in reach with neither a pick nor a noPick reason fails, naming the site; so does a noPick
   entry for a site that has a pick or is out of reach, and a labelled slot 1 pick without its note */
const genFailsFor = (label, cls, mutate, re) => job(ok => { const rel = `data/packs/aion2/asmodian/${cls}/builds.json`;
  const g1 = runs(ok, label, { pack: 'aion2/asmodian/' + cls, mutate: (p, d) => p === rel && mutate(d.records[0]) }); if (!g1) return;
  ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check)); });
genFails('a core skill\'s slot 1 pick removed (Heart Gore)', r => { delete r.specialtyPicks['skill:assassin:heart-gore']; }, /choice point build:assassin:guide skill:assassin:heart-gore#1 \(Heart Gore specialty slot 1/);
genFailsFor('a Ranger specialty pick removed (Snipe)', 'ranger', r => { delete r.specialtyPicks['skill:ranger:snipe']; }, /choice point build:ranger:guide skill:ranger:snipe#1 /);
genFailsFor('a reachable slot 2 with neither a pick nor a noPick (Cleric Divine Aura)', 'cleric', r => { delete r.noPick; }, /choice point build:cleric:guide skill:cleric:divine-aura#2 /);
genFailsFor('a noPick beside a pick (Gladiator Ruinous Blow slot 1)', 'gladiator', r => { r.noPick['skill:gladiator:ruinous-blow#1'] = { reason: 'no-source', note: 'x' }; }, /choice point build:gladiator:guide skill:gladiator:ruinous-blow#1 /);
genFailsFor('a noPick for a slot out of reach (Ranger Snipe slot 2)', 'ranger', r => { r.noPick = { 'skill:ranger:snipe#2': { reason: 'no-source', note: 'x' } }; }, /noPick build:ranger:guide skill:ranger:snipe#2: a choice point in reach/);
genFailsFor('a stigma slot emptied', 'templar', r => { r.stigmaSlots.pop(); }, /choice point build:templar:guide stigma#4 /);
genFailsFor('a labelled slot 1 pick without its note (Ranger Deadshot)', 'ranger', r => { delete r.specialtyEvidence['spec:ranger:deadshot:1'].note; }, /deadshot:1 \(slot 1\) has 2\+ source/);
/* 0.2.4 villages as zones (issue #98): the checks that keep places and Kibelisks in the village zone */
genFailsIn('Aldelle Village Kibelisk in two zones', 'data/packs/aion2/asmodian/zones.json', d => { d.records.find(z => z.id === 'zone:ishalgen').kibelisks = ['Aldelle Village']; }, /Kibelisk Aldelle Village resolves to one zone/);
genFailsIn('a giver placed in Aldelle Village but zoned Ishalgen', SQ, d => { d.records.find(r => r.id === 'sq:2101010').giver.zone = 'zone:ishalgen'; }, /sq:2101010: place Aldelle Village is in zone:aldelle-village/);
genFailsIn('a giver placed in Black Claw Village but zoned elsewhere', SQ, d => { d.records.find(r => r.id === 'sq:2102781').giver.zone = 'zone:impetusium-square'; }, /sq:2102781: place Black Claw Village is in zone:black-claw-village/);
/* 0.5 P8: every Kibelisk name resolves to one registry record; ids, zones, binds and rules are checked */
genFailsIn('an unknown Kibelisk name on a story giver', SQ, d => { d.records.find(r => r.id === 'sq:2102015').giver.kibelisk = 'Safe Haven Plaza'; }, /Kibelisk "Safe Haven Plaza" resolves to a registry record/);
genFailsIn('an unknown Kibelisk name in an objective marker', SQ, d => { d.records.find(r => r.id === 'sq:2102015').steps[0].text = 'Receive additional supplies — go to VeKauf (Kibelisk: Safe Havn)'; }, /Kibelisk "Safe Havn" resolves/);
genFailsIn('a duplicate Kibelisk id', KIB, d => { d.records.splice(1, 0, { ...d.records[0], name: 'Abandoned Barracks Site 2' }); }, /id unique repo-wide: kib:abandoned-barracks-site/);
genFailsIn('a Kibelisk name twice in the registry', KIB, d => { d.records.push({ ...d.records[0], id: 'kib:zz-copy' }); }, /Kibelisk name unique in the registry: Abandoned Barracks Site/);
genFailsIn('a registry zone against the points\' majority', KIB, d => { d.records.find(k => k.id === 'kib:safe-haven').zone = 'zone:crypt'; }, /kib:safe-haven: zone zone:crypt is the majority zone zone:dredgion-crash-site/);
genFailsIn('zones[].kibelisks naming a Kibelisk filed elsewhere', 'data/packs/aion2/asmodian/zones.json', d => { d.records.find(z => z.id === 'zone:crypt').kibelisks.push('Safe Haven'); }, /zone:crypt: Kibelisk Safe Haven is a registry record filed in this zone/);
genFailsIn('binds naming an id not in the registry', SQ, d => { stepWith(d, x => x.binds).binds.kibelisk = 'kib:safe-haven-plaza'; }, /binds kib:safe-haven-plaza is a registry id/);
genFailsIn('a step-text bind whose text does not say bind', SQ, d => { const x = stepWith(d, x => x.binds && x.binds.basis === 'step-text'); x.text = 'Remember Aldelle Village'; }, /a step-text bind says "bind"/);
genFailsIn('binds on a regional quest objective', 'data/packs/aion2/asmodian/regional-quests.json', d => { d.records.find(r => (r.steps || []).length).steps[0].binds = { kibelisk: 'kib:safe-haven', basis: 'step-text' }; }, /binds only on story objectives/);
genFailsIn('a bind radius not inside the nudge radius', 'data/packs/aion2/rules.json', d => { d.records.find(x => x.id === 'rule:kibelisk-bind-radius').value = 100; d.records.find(x => x.id === 'rule:kibelisk-nudge-radius').value = 100; }, /rule:kibelisk-bind-radius < rule:kibelisk-nudge-radius/);
/* 0.6 P3: the shared Asmodian guide names no class, skill, stigma or board node and points at no class guide record */
const SG = 'data/packs/aion2/asmodian/guide/', sgStep = (d, id) => d.records.find(r => r.id === id);
genFailsIn('a shared guide step naming a class skill', SG + 'steps.json', d => { sgStep(d, 'story:1').text += ' Then use Heart Gore.'; }, /^shared guide story:1 .*names no class, skill, stigma or board node$/);
genFailsIn('a shared guide step naming a stigma id', SG + 'steps.json', d => { sgStep(d, 'story:1').loc = 'stigma:assassin:savage-fang'; }, /^shared guide story:1 .*names no class, skill, stigma or board node$/);
genFailsIn('a shared guide step naming a board node key', SG + 'steps.json', d => { sgStep(d, 'story:1').text += ' (dv:azphel:r10c1)'; }, /^shared guide story:1 .*names no class, skill, stigma or board node$/);
genFailsIn('a shared guide tip naming the class', SG + 'tips.json', d => { d.records.find(r => r.id === 'tip:kibelisk').credit += ', an assassin guide'; }, /^shared guide tip:kibelisk .*names no class/);
genFailsIn('a shared guide confidence line naming a stigma', SG + 'confidence.json', d => { d.records[0].text += ' Savage Fang first.'; }, /^shared guide conf:abyss-points .*names no class/);
genFailsIn('a shared guide step linking a class guide tip', SG + 'steps.json', d => { sgStep(d, 'story:1').text += ' [[tip:wisdom|Skill Points]]'; }, /^shared guide story:1 .*points at no guide or class record$/);
genFailsIn('a shared guide step in a class guide milestone', SG + 'steps.json', d => { sgStep(d, 'story:1').milestone = 'g28'; }, /^shared guide story:1 .*points at no guide or class record$/);
/* 0.5 P9: story objective points: the marker equals the point's Kibelisk, story objectives only, the Kibelisk's map */
genFailsIn('a (Kibelisk: X) marker that differs from at.kibelisk', SQ, d => { sqStep(d, 'sq:2102235', 1).at.kibelisk = 'Guide Rest Stop'; }, /sq:2102235 #1: \(Kibelisk: X\) marker = at\.kibelisk/);
genFailsIn('an objective point naming an unknown Kibelisk', SQ, d => { sqStep(d, 'sq:2102590', 1).at.kibelisk = 'Alert Observation Tower'; }, /Kibelisk "Alert Observation Tower" resolves to a registry record/);
genFailsIn('an objective point on another map than its Kibelisk', SQ, d => { sqStep(d, 'sq:2102235', 1).at.map = 'ishalgen'; }, /sq:2102235 #1: at\.map is its Kibelisk's map/);
genFailsIn('an objective point on a regional quest', 'data/packs/aion2/asmodian/regional-quests.json', d => { const r = d.records.find(r => (r.steps || []).length);
  r.steps[0].at = { map: 'altgard', x: 1, y: 1, kibelisk: 'Safe Haven', meters: 1, sources: [{ url: 'https://metabot.gg/en/aion-2/quests/survival-supplies' }] }; }, /#0: at only on story objectives/);
/* 0.9 P2 (save v6): save keys are stable ids. An objective's i is unique in its quest (an inserted one takes a new i; the
   old "i = position" rule is gone on purpose), a sub-step's index unique, a story key is its id, a skill or stigma key its
   id's last segment and unique */
genFailsIn('a duplicate objective i', SQ, d => { const r = d.records.find(r => r.steps.length > 1); r.steps[1].i = r.steps[0].i; }, /: objective i unique$/);
genFailsIn('a duplicate sub-step index', SQ, d => { d.records.find(r => r.steps.length).steps[0].sub = [0, 0]; }, /: sub-step i unique$/);
genFailsIn('a story save key that is the quest name, not its id', SQ, d => { const r = d.records.find(r => r.id === 'sq:2101010'); r.key = r.name; }, /^story save key is its id: sq:2101010$/);
genFailsIn('a duplicate skill key', 'data/packs/aion2/classes/assassin/skills.json', d => { d.records[1].key = d.records[0].key; }, /^save key unique: sp:/);
genFailsIn('a skill key that is the skill name', 'data/packs/aion2/classes/assassin/skills.json', d => { d.records[0].key = d.records[0].name; }, /: save key is the id's last segment$/);
genFailsIn('a duplicate stigma key', 'data/packs/aion2/classes/assassin/stigmas.json', d => { d.records[1].key = d.records[0].key; }, /^save key unique: stigma /);
/* 0.9 P10: the save-key ledger (<pack>/save-keys.json). A key that leaves the data with no retired entry fails, one with its
   entry passes; a key whose record now carries another key (a rename) needs renamedTo as well */
const SH = 'data/packs/aion2/asmodian/strongholds.json', FRET = 'data/packs/aion2/asmodian/retired.json', SHK = 'sh:blades-temporary-outpost';
const LEDGER_OK = 'aion2/asmodian/assassin/save-keys.json: every key that left the data is retired';
const ledgerJob = (label, edits, rejects, re) => job(ok => { const g1 = runs(ok, label, { mutate: (rel, d) => edits[rel] && edits[rel](d) }); if (!g1) return;
  const hit = g1.failed.filter(x => re.test(x.check));
  ok((rejects ? 'generator rejects: ' : 'generator accepts: ') + label, rejects ? hit.length > 0 : !hit.length && g1.report.checks.some(x => x.check === LEDGER_OK && x.pass),
    g1.failed.map(x => x.check).slice(0, 5)); });
const dropSh = d => { d.records = d.records.filter(r => r.key !== SHK); };
const renameSh = d => { d.records.find(r => r.key === SHK).key = 'sh:blades-outpost'; };
const retireSh = (extra = {}) => d => { d.keys.push({ key: SHK, retired: '2026-10-21', ...extra }); };
const SHRE = /^save key sh:blades-temporary-outpost |^aion2\/asmodian\/assassin\/save-keys\.json: every key that left the data is retired$/;
ledgerJob('a save key removed from the data with no retired entry', { [SH]: dropSh }, true, /^save key sh:blades-temporary-outpost \(sh: Blades Temporary Outpost\) left the data without a retired entry/);
ledgerJob('an objective removed from the data with no retired entry', { [SQ]: d => { d.records.find(r => r.id === 'sq:2101010').steps.pop(); } }, true, /^save key sq:2101010#\d+ \(objectives: .*\) left the data without a retired entry/);
ledgerJob('a removed save key with its retired entry (faction retired.json)', { [SH]: dropSh, [FRET]: retireSh() }, false, SHRE);
ledgerJob('a renamed save key retired without renamedTo', { [SH]: renameSh, [FRET]: retireSh() }, true, /^save key sh:blades-temporary-outpost .* was renamed to sh:blades-outpost: its retired entry needs renamedTo$/);
ledgerJob('a renamed save key with no retired entry', { [SH]: renameSh }, true, /^save key sh:blades-temporary-outpost .*left the data without a retired entry/);
ledgerJob('a renamed save key retired with renamedTo', { [SH]: renameSh, [FRET]: retireSh({ renamedTo: 'sh:blades-outpost' }) }, false, SHRE);
ledgerJob('a renamedTo that is no save key', { [SH]: dropSh, [FRET]: retireSh({ renamedTo: 'sh:nowhere' }) }, true, /^retired sh:blades-temporary-outpost: renamedTo sh:nowhere is a save key/);
ledgerJob('a retired key back in use', { [FRET]: d => { d.keys.push({ key: 'rq:2202010', retired: '2026-10-21' }); } }, true, /^save-keys: no retired key is in use$/);
ledgerJob('a key retired in both the faction and the class file', { [FRET]: d => { d.keys.push({ key: 'g45:1', retired: '2026-10-21' }); } }, true, /^retired key listed once: g45:1$/);
/* 0.9 P32: a count that changes in the data without `npm run gen -- --counts` fails, and so does a stale counts file */
genFailsIn('a Sealed Dungeon dropped from the data without npm run gen -- --counts', 'data/packs/aion2/asmodian/sealed-dungeons.json', d => { d.records.pop(); }, /^count sealedDungeons = \d+: as in data\/expected-counts\.json/);
genFailsIn('a story objective point dropped from the data without npm run gen -- --counts', SQ, d => { delete stepWith(d, x => x.at && !x.binds).at; }, /^count storyObjectivePoints = \d+: as in data\/expected-counts\.json/);
job(ok => { const g1 = runs(ok, 'a counts file with a stale count', { expected: { ...E, regionalQuests: E.regionalQuests + 1 } }); if (!g1) return;
  ok('generator rejects: a counts file with a stale count (regionalQuests + 1)', g1.failed.some(x => /^count regionalQuests = \d+: as in data\/expected-counts\.json/.test(x.check)), g1.failed.map(x => x.check)); });
job(ok => { const g1 = runs(ok, 'no counts file', { expected: null }); if (!g1) return;
  ok('generator rejects: no counts file (every count fails)', Object.keys(E).length > 0 && Object.keys(E).every(k => g1.failed.some(x => x.check.startsWith(`count ${k} = `))), g1.failed.length); });
/* 0.4 P1 pack manifests: a broken copy of data/packs must stop the generator (packs.mjs). Since 0.9 P6 each broken copy
   is an in-memory view of data/packs (generate({ mutate, drop, add }), packs.mjs fsView): nothing is copied or written */
const editManifest = (id, f) => ({ mutate: (rel, d) => { if (rel === PK + id + '/pack.json') f(d); } });
const packFails = (label, view, re) => job(ok => { let msg = null; try { generate(view); } catch (e) { msg = e.message; }
  ok('generator rejects: ' + label, !!msg && re.test(msg), msg); });
const guide = 'aion2/asmodian/assassin';
packFails('manifest without id', editManifest(guide, m => { delete m.id; }), /pack manifest fails pack\.schema\.json/);
packFails('manifest id that is not its folder', editManifest('aion2/asmodian', m => { m.id = 'aion2/elyos'; }), /id "aion2\/elyos" is not its folder/);
packFails('a listed file that does not exist', { drop: [PK + 'aion2/items.json'] }, /pack aion2: listed file items\.json does not exist/);
packFails('a JSON file in a pack folder that is not listed', { add: { [PK + 'aion2/asmodian/extra.json']: '{}' } }, /pack aion2\/asmodian: .*not listed in pack\.json: extra\.json/);
packFails('an unknown parent', editManifest(guide, m => { m.parent = 'aion2/elyos'; }), /aion2\/asmodian\/assassin parent: unknown pack "aion2\/elyos"/);
packFails('an unknown pack in uses', editManifest(guide, m => { m.uses = ['aion2/classes/no-such-class']; }), /uses: unknown pack "aion2\/classes\/no-such-class"/);
packFails('a cycle (the class uses the guide that uses it)', editManifest('aion2/classes/assassin', m => { m.uses = [guide]; }), /pack cycle: /);
/* 0.9 P16: plan costs computed from the board path. An inferred source without the label, the label on an owner's number,
   an inferred cost on a pick-one (anyNode) row, and a tied row's inferred cost without a via naming its path all fail */
const planFails = (label, pack, edit, re) => job(ok => { const g1 = runs(ok, label, { pack, mutate: (rel, d) => { if (rel === `data/packs/${pack}/builds.json`) edit(d.records.find(r => r.boardPlan).boardPlan); } });
  if (g1) ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check).slice(0, 5)); });
const inferredRef = { inferred: 'test', fields: ['cost'], checkedAt: '2026-10-21' };
planFails('an inferred cost source without fieldStatus.cost', guide, p => { delete p.find(e => e.node === 'node:assassin:triniel:r9c10').fieldStatus; }, /triniel:r9c10: cost has its source/);
planFails('fieldStatus.cost inferred on an owner\'s cost', guide, p => { p.find(e => e.cost !== undefined && !e.fieldStatus).fieldStatus = { cost: 'inferred' }; }, /cost has its source/);
planFails('an inferred cost on a pick-one corner row', guide, p => Object.assign(p.find(e => e.key === 'dv:t:corner'), { cost: 15, fieldStatus: { cost: 'inferred' }, sources: [inferredRef] }), /Multi-Hit Chance corner: its inferred cost is the row's only one/);
planFails('a tied inferred cost with no via naming its path', 'aion2/asmodian/cleric', p => { delete p.find(e => e.label === 'Light of Regeneration').via; }, /Light of Regeneration: its inferred cost is the row's only one/);
/* --root is the one real copy left (tests/out/, not committed): it proves another packs root compiles the same */
job((ok, G) => { const g = G(), copyRoot = join(ROOT, 'tests/out/packs-copy'); rmSync(copyRoot, { recursive: true, force: true }); cpSync(join(ROOT, 'data/packs'), copyRoot, { recursive: true });
  let gc = null; try { gc = generate({ root: copyRoot, pack: guide }); } catch (e) { ok('generator runs on a copied packs root', false, e.message); return; }
  ok('--root / --pack: an unchanged copy of data/packs, pack ' + guide + ', compiles the same modules', gc.module === g.module && gc.gateModule === g.gateModule && gc.proposedModule === g.proposedModule); });
/* An idle class pack (one no guide pack uses: checked and cited, compiled into no module). 0.6 P4's Gladiator, then 0.7
   P3's Spiritmaster were the idle pack here; 0.7 P4 gave the Spiritmaster its guide pack, so data/packs has none left.
   The idle checks run on a view where the Spiritmaster is idle again: its guide pack dropped, its class hidden. Its counts
   are the reviewed ones in data/expected-counts.json (0.9 P32b; aion2/checks.mjs counts them), not read from the files
   they check, so a dropped Spiritmaster record fails here and in the generator's count check. */
/* the generated module without its GUIDE_CLASSES line (0.9 P11: the one table that follows which guide packs exist) */
const noGuideClasses = m => m.replace(/^export const GUIDE_CLASSES = .*;$/m, '');
const SM = 'aion2/classes/spiritmaster', editJson = (f, fn) => ({ rel: PK + SM + '/' + f, fn });
const idleView = (...edits) => { const all = [editJson('class.json', d => { d.records[0].release = 'hidden'; }), ...edits];
  return { drop: [PK + 'aion2/asmodian/spiritmaster'], mutate: (rel, d) => { for (const e of all) if (rel === e.rel) e.fn(d); } }; };
job((ok, G) => { const g = G(), gi = runs(ok, 'on a copy with an idle Spiritmaster', idleView());
  const sm = gi && (gi.idle || []).find(x => x.pack === SM), smColl = f => sm ? sm.all.filter(x => x.file.endsWith('/' + f)).length : 0;
  const want = f => ({ 'skills.json': E.spiritmasterSkills, 'stigmas.json': E.spiritmasterStigmas, 'board-nodes.json': E.spiritmasterBoardNodes })[f], triniel = E.spiritmasterTrinielNodes;
  ok(`idle class pack aion2/classes/spiritmaster (copy): 1 class, ${want('skills.json')} skills, ${want('stigmas.json')} stigmas, ${want('board-nodes.json')} board nodes, checked by the generator, modules unchanged`,
    !!sm && smColl('class.json') === 1 && ['skills.json', 'stigmas.json', 'board-nodes.json'].every(f => want(f) > 0 && smColl(f) === want(f))
    && gi.report.checks.some(x => x.check.startsWith(`aion2/classes/spiritmaster: board:triniel: ${triniel} nodes`)) && !gi.failed.length
    && noGuideClasses(gi.module) === noGuideClasses(g.module) && gi.gateModule === g.gateModule, sm && [smColl('skills.json'), smColl('board-nodes.json'), gi.failed.slice(0, 5)]);
  /* 0.9 P11: the playable classes are read from the data, so the copy's GUIDE_CLASSES is the real one without the Spiritmaster */
  const gu = m => JSON.parse((m.match(/^export const GUIDE_CLASSES = (.*);$/m) || [])[1] || 'null');
  ok('idle class pack aion2/classes/spiritmaster (copy): GUIDE_CLASSES is the real list less the Spiritmaster (its guide pack dropped)', !!gi && JSON.stringify(gu(gi.module)) === JSON.stringify((gu(g.module) || []).filter(e => e.class !== 'spiritmaster'))
    && gu(g.module).some(e => e.class === 'spiritmaster'), gi && gu(gi.module)); });
const idleFails = (label, edit, re) => job(ok => { const g1 = runs(ok, label, idleView(edit)); if (!g1) return;
  ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check).slice(0, 5)); });
const zikel = read('packs/aion2/boards.json').records.find(b => b.id === 'board:zikel').points;
idleFails('idle-node-cost', editJson('board-nodes.json', d => { d.records.find(n => n.board === 'board:zikel' && n.type === 'stat').cost += 1; }), new RegExp(`spiritmaster: board:zikel: .*points \\(${zikel}\\)`));
idleFails('idle-node-skill', editJson('board-nodes.json', d => { d.records.find(n => n.type === 'skill').skill = 'skill:spiritmaster:bogus'; }), /skill node names its skill/);
idleFails('idle-released', editJson('class.json', d => { d.records[0].release = 'released'; }), /spiritmaster: one class record, hidden/);
idleFails('idle-spec-level', editJson('stigmas.json', d => { d.records[0].specialtyChoices[0].skillLv = 4; }), /stigma:spiritmaster:.*specialty levels \[5,10,15,20\]/);
/* 0.9 P32b: a dropped Spiritmaster record fails its pinned count, in the Assassin's generate() and on the idle copy */
const SMF = f => PK + SM + '/' + f, oneLess = k => new RegExp(`^count ${k} = ${E[k] - 1}: as in data/expected-counts\\.json`);
genFailsIn('a Spiritmaster skill dropped', SMF('skills.json'), d => { d.records.pop(); }, oneLess('spiritmasterSkills'));
genFailsIn('a Spiritmaster stigma dropped', SMF('stigmas.json'), d => { d.records.pop(); }, oneLess('spiritmasterStigmas'));
genFailsIn('a Spiritmaster Triniel node dropped', SMF('board-nodes.json'), d => { d.records.splice(d.records.findIndex(n => n.board === 'board:triniel'), 1); }, oneLess('spiritmasterTrinielNodes'));
idleFails('a Spiritmaster board node dropped (idle copy)', editJson('board-nodes.json', d => { d.records.pop(); }), oneLess('spiritmasterBoardNodes'));
packFails('an idle class file that fails its schema', idleView(editJson('skills.json', d => { delete d.records[0].levelGate; })),/schema validation failed:\n  .*aion2\/classes\/spiritmaster\/skills\.json: .*levelGate/);

/* a worker: claim jobs off the shared counter until none is left, then post its lines */
if (!isMainThread) {
  const next = new Int32Array(workerData.next), lines = [];
  let g = null; const G = () => g || (g = generate());
  for (let i; (i = Atomics.add(next, 0, 1)) < JOBS.length;) {
    const ok = (name, c, d) => lines.push({ i, name, c: !!c, d: !c && d !== undefined ? JSON.stringify(d).slice(0, 900) : undefined });
    try { JOBS[i](ok, G); } catch (e) { ok(`generator control job ${i} runs`, false, e.message); }
  }
  parentPort.postMessage(lines);
} else {

let n = 0, fail = 0;
const line = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + d : '')); if (!c) fail++; };
const ok = (name, c, d) => line(name, c, d === undefined ? undefined : JSON.stringify(d).slice(0, 900));
const t0 = Date.now();
/* the workers start first and run beside everything below; at most one per spare core, at least two (--workers=N to measure) */
const W = +(process.argv.find(a => a.startsWith('--workers=')) || '=0').split('=')[1] || Math.max(2, Math.min(4, availableParallelism() - 1)), next = new SharedArrayBuffer(4);
const workers = Array.from({ length: W }, () => new Promise(res => { const w = new Worker(new URL(import.meta.url), { workerData: { next } }); let got = null;
  w.on('message', m => { got = m; }); w.on('error', e => { got = got || [{ i: -1, name: 'a control worker runs', c: false, d: JSON.stringify(e.message) }]; }); w.on('exit', () => res(got || [{ i: -1, name: 'a control worker posts its lines', c: false }])); }));

const { files, bad } = validateAll();
ok(`every data file and schema example validates (${files} files)`, !bad.length, bad.map(b => `${b.file}: ${b.errors.slice(0, 3).join('; ')}`));

/* negative controls on real records: each broken copy must fail validation */
const broken = (label, p, mutate) => {
  const doc = read(p); mutate((doc.records || [])[0], doc);
  ok('rejects: ' + label, validateDoc(join(ROOT, 'data', p), doc).length > 0);
};
broken('unknown field on a regional quest', 'packs/aion2/asmodian/regional-quests.json', r => { r.bogus = 1; });
broken('location without a zone', 'packs/aion2/asmodian/regional-quests.json', r => { delete r.giver.zone; });
broken('story atom without "is"', 'packs/aion2/asmodian/regional-quests.json', r => { r.requires = { story: 'sq:2102105' }; });
broken('done on a story quest', 'packs/aion2/asmodian/assassin/guide/steps.json', r => { r.completesWith = ['tick', { done: 'sq:2102105' }]; });
broken('http:// source URL', 'packs/aion2/asmodian/strongholds.json', r => { r.sources[0].url = r.sources[0].url.replace('https', 'http'); });
broken('owner ref that is a URL', 'packs/aion2/asmodian/strongholds.json', r => { r.sources.push({ owner: { ref: 'https://example.com/x.png', checkedAt: '2026-10-14', build: { scheme: 'client', value: 'unrecorded' }, what: 'x' } }); });
broken('story id as a slug', 'packs/aion2/asmodian/story-quests.json', r => { r.id = 'sq:ishalgen'; });
broken('<span> in guide text', 'packs/aion2/asmodian/assassin/guide/steps.json', r => { r.text += '<span class="loc">x</span>'; });
broken('unknown text token', 'packs/aion2/asmodian/assassin/guide/steps.json', r => { r.text += ' [[bogus:1]]'; });
broken('schemaVersion 3', 'packs/aion2/rules.json', (r, d) => { d.schemaVersion = 3; });
broken('stigma without maxLevel', 'packs/aion2/classes/assassin/stigmas.json', r => { delete r.maxLevel; });
broken('skill node without its skill', 'packs/aion2/classes/assassin/board-nodes.json', (r, d) => { const x = d.records.find(y => y.type === 'skill'); delete x.skill; });
broken('specialty pick that is not a choice id', 'packs/aion2/asmodian/assassin/builds.json', r => { r.specialtyPicks['skill:assassin:heart-gore'] = ['Up to +20% Critical Hit']; });
/* a milestone's own items never get a gate node (0.4 P2a; openSteps relies on it) */
broken('milestone item with a gate node', 'packs/aion2/asmodian/assassin/guide/milestones.json', (r, d) => { d.records.find(x => x.items).items[0].gateNode = true; });
broken('milestone item with requires', 'packs/aion2/asmodian/assassin/guide/milestones.json', (r, d) => { d.records.find(x => x.items).items[0].requires = { level: 28 }; });
broken('Ascension quest with a giver', 'packs/aion2/asmodian/ascension-quests.json', r => { r.giver = { zone: 'zone:moslan-forest' }; });
/* world bosses (1.0): a respawn boss can't carry a schedule, a schedule boss needs one, times are HH:MM */
broken('respawn boss with a schedule', 'packs/aion2/world-bosses.json', (r, d) => { d.records.find(x => x.kind === 'respawn').schedule = [{ everyHours: 3, from: '01:00' }]; });
broken('schedule boss without a schedule', 'packs/aion2/world-bosses.json', (r, d) => { delete d.records.find(x => x.kind === 'schedule').schedule; });
broken('world boss time that is not HH:MM', 'packs/aion2/world-bosses.json', (r, d) => { d.records.find(x => x.kind === 'schedule' && x.schedule[0].at).schedule[0].at = '9:30pm'; });
/* zone records (0.2.4 villages as zones: records[0] is zone:aldelle-village) */
broken('zone id that is a name, not zone:<slug>', 'packs/aion2/asmodian/zones.json', r => { r.id = 'Aldelle Village'; });
broken('zone without a region', 'packs/aion2/asmodian/zones.json', r => { delete r.region; });
broken('zone with an unknown field (parent)', 'packs/aion2/asmodian/zones.json', r => { r.parent = 'zone:ishalgen'; });
broken('zone with a Kibelisk listed twice', 'packs/aion2/asmodian/zones.json', r => { r.kibelisks.push(r.kibelisks[0]); });
broken('site that bans automation read by script', 'packs/aion2/sources.json', r => { r.access = { ...r.access, terms: 'bans-automation', mode: 'scripted' }; });
/* 0.3 proposals (`proposed`, docs/design/0.3-requirement-engine.md §7) */
const P = { requires: { level: 10 }, status: 'ready', change: 'x', basis: 'prereq-gates §6' };
broken('proposal without status', 'packs/aion2/asmodian/regional-quests.json', r => { r.proposed = { ...P, status: undefined }; delete r.proposed.status; });
broken('owner-check proposal without its check number', 'packs/aion2/asmodian/regional-quests.json', r => { r.proposed = { ...P, status: 'owner-check' }; });
broken('proposal with neither requires nor completesWith', 'packs/aion2/asmodian/regional-quests.json', r => { r.proposed = { status: 'ready', change: 'x', basis: 'y' }; });
broken('proposal naming a story quest in done', 'packs/aion2/asmodian/assassin/guide/steps.json', r => { r.proposed = { ...P, completesWith: ['tick', { done: 'sq:2102105' }] }; });
broken('unknown field in a proposal', 'packs/aion2/asmodian/assassin/builds.json', r => { r.boardPlan[0].proposed = { ...P, apply: true }; });

/* 0.9 P10: the save-key ledger and retired entries */
broken('retired entry with an empty renamedTo', 'packs/aion2/asmodian/assassin/retired.json', (r, d) => { d.keys[0].renamedTo = ''; });
broken('retired entry with an unknown field (renamed)', 'packs/aion2/asmodian/assassin/retired.json', (r, d) => { d.keys[0].renamed = 'g45:2'; });
broken('save-key ledger with an unknown group', 'packs/aion2/asmodian/assassin/save-keys.json', (r, d) => { d.keys.titles = {}; });
broken('save-key ledger without its story group', 'packs/aion2/asmodian/assassin/save-keys.json', (r, d) => { delete d.keys.story; });
broken('save-key ledger name that is not a string', 'packs/aion2/asmodian/assassin/save-keys.json', (r, d) => { d.keys.sh[SHK] = 1; });

/* 0.5 P8: the Kibelisk registry, binds facts and the travel rules */
broken('binds without basis', 'packs/aion2/asmodian/story-quests.json', (r, d) => { delete stepWith(d, x => x.binds).binds.basis; });
broken('owner binds without its note', 'packs/aion2/asmodian/story-quests.json', (r, d) => { delete stepWith(d, x => x.binds && x.binds.basis === 'owner').binds.note; });
broken('binds naming a Kibelisk by name, not kib:<slug>', 'packs/aion2/asmodian/story-quests.json', (r, d) => { stepWith(d, x => x.binds).binds.kibelisk = 'Safe Haven'; });
broken('bind radius out of range (0 m)', 'packs/aion2/rules.json', (r, d) => { d.records.find(x => x.id === 'rule:kibelisk-bind-radius').value = 0; });
broken('nudge radius out of range (5000 m)', 'packs/aion2/rules.json', (r, d) => { d.records.find(x => x.id === 'rule:kibelisk-nudge-radius').value = 5000; });
broken('teleport gain that is not a number', 'packs/aion2/rules.json', (r, d) => { d.records.find(x => x.id === 'rule:teleport-gain').value = '400 m'; });
broken('Kibelisk id that is not kib:<slug>', 'packs/aion2/asmodian/kibelisks.json', r => { r.id = 'kib:Safe Haven'; });
broken('Kibelisk without a zone field', 'packs/aion2/asmodian/kibelisks.json', r => { delete r.zone; });
broken('Kibelisk with an unknown field', 'packs/aion2/asmodian/kibelisks.json', r => { r.pos = { x: 1, y: 2 }; });
/* 0.5 P9: story objective points */
broken('objective point without sources', 'packs/aion2/asmodian/story-quests.json', (r, d) => { delete stepWith(d, x => x.at).at.sources; });
broken('objective point with empty sources', 'packs/aion2/asmodian/story-quests.json', (r, d) => { stepWith(d, x => x.at).at.sources = []; });
broken('objective point without its Kibelisk', 'packs/aion2/asmodian/story-quests.json', (r, d) => { delete stepWith(d, x => x.at).at.kibelisk; });
broken('objective point with a Metabot map id, not a map slug', 'packs/aion2/asmodian/story-quests.json', (r, d) => { stepWith(d, x => x.at).at.map = 'World_D_A'; });
broken('objective point with fractional metres', 'packs/aion2/asmodian/story-quests.json', (r, d) => { stepWith(d, x => x.at).at.meters = 12.5; });

/* the generator: cross-record checks pass, and the committed DATA_SOURCES.md is current */
let g = null;
try { g = generate(); } catch (e) { ok('generator runs', false, e.message); }
if (g) {
  ok(`generator: ${g.report.checks.length} cross-record checks pass`, !g.failed.length, g.failed.slice(0, 10));
  /* 0.6 P5: it lists every guide pack's pages (the Ranger's too) */
  const otherIds = guidePacks().filter(id => id !== 'aion2/asmodian/assassin'), others = otherIds.map(id => generate({ pack: id }));
  ok('data/DATA_SOURCES.md is current (npm run gen)', readFileSync(join(ROOT, 'data/DATA_SOURCES.md'), 'utf8') === dataSourcesMd(g, others));
  /* 0.9 P10: every guide pack has its save-key ledger committed, and it is what npm run gen writes */
  for (const [id, x] of [[guide, g], ...otherIds.map((id, i) => [id, others[i]])]) {
    const f = x.saveKeysFile, cur = f && existsSync(f) ? readFileSync(f, 'utf8') : null;
    ok(`${id}/save-keys.json is committed and current (npm run gen): ${x.saveKeys ? Object.values(x.saveKeys).reduce((t, m) => t + Object.keys(m).length, 0) : 0} keys`, !!cur && cur === x.saveKeysJson);
  }
  /* #476: zone and Sealed Dungeon refs take their record's name as label, not the URL slug ("Calderon canyon") */
  const dsMd = dataSourcesMd(g, others);
  ok('Sources labels zone and dungeon pages by record name', ['[Metabot: Calderon Canyon]', "[Metabot: High Priest's Ruins]"].every(s => dsMd.includes(s)));
  others.forEach((o, i) => ok(`guide pack ${otherIds[i]}: ${o.report.checks.length} cross-record checks pass`, !o.failed.length, o.failed.slice(0, 10)));
  /* 0.9 P16: every class's board plan has its costs. (1) Each board's total in the data is the research file's
     (docs/research/2026-10-node-paths.md "Per class", read from its table, not pinned here), and each row's cost is a
     cost its cheapest path in plan order gives (board-path.mjs; the generator's own listed exceptions aside).
     (2) No row asks for more than the player has: rows in the order the guide opens them (level, then plan order), the
     running total fits the level's points (rule:crystals-per-level) plus the crystals the data says are earned by then
     (regional quests by recommended level, Sealed Dungeon first clears by band) at the row's level or a later one before
     the next board opens; the rows that wait are named in the line. */
  { const md = readFileSync(join(ROOT, 'docs/research/2026-10-node-paths.md'), 'utf8');
    const want = Object.fromEntries([...md.matchAll(/^\| (\w+) \| \d+ \| [^|]+ \| ([^|]+) \| (\d+) \|$/gm)].map(m => [m[1].toLowerCase(), { boards: Object.fromEntries(m[2].trim().split(', ').map(s => s.split(' ')).map(([b, n]) => [b, +n])), total: +m[3] }]));
    const rules = read('packs/aion2/rules.json').records, cpl = rules.find(r => r.id === 'rule:crystals-per-level').value;
    const sdCrystal = rules.find(r => r.id === 'rule:sd-first-clear-asmodian').value.rewards.crystal;
    const rqs = read('packs/aion2/asmodian/regional-quests.json').records, sds = read('packs/aion2/asmodian/sealed-dungeons.json').records;
    const points = L => cpl[L] + rqs.filter(q => q.rec <= L).reduce((a, q) => a + (q.rewards.crystal || 0), 0) + sdCrystal * sds.filter(d => d.band <= L).length;
    const boardLv = read('packs/aion2/boards.json').records.map(b => b.lv);
    const EXCEPT = new Set(['node:assassin:vaizel:r5c13']);   /* gen.mjs PATH_COST_EXCEPTIONS: the owner's 5 stands */
    const packs = guidePacks();
    ok(`board costs: the research file lists every guide class (${packs.length})`, packs.every(id => want[id.split('/').pop()]), Object.keys(want));
    for (const id of packs) {
      const cls = id.split('/').pop(), plan = read(`packs/aion2/asmodian/${cls}/builds.json`).records.find(r => r.id === `build:${cls}:guide`).boardPlan;
      const nodes = classDoc(cls, 'board-nodes.json').records, boardOf = e => (e.node || e.anyNode[0]).split(':')[2];
      const name = Object.fromEntries(read('packs/aion2/boards.json').records.map(b => [b.id.split(':')[1], b.name]));
      /* an anyNode row (the player picks one of several nodes, each its own cost) takes no computed cost (Game Data
         Check on #749): it has the owner's number or stays blank. A blank one counts here at its first node's path cost,
         as the research file counts it, and spends the most of its picks' path costs in the points check below */
      const got = {}, bad = [], spend = new Map();
      for (const b of [...new Set(plan.map(boardOf))]) {
        const es = plan.filter(e => boardOf(e) === b).sort((x, y) => x.order - y.order);
        const path = checkPlanCosts(nodes.filter(n => n.board === 'board:' + b), es.map(e => ({ node: e.node || e.anyNode[0], cost: e.cost })));
        const blank = e => e.anyNode && e.cost === undefined;
        es.forEach((e, i) => { if (!blank(e) && (e.cost === undefined || !(path[i].includes(e.cost) || EXCEPT.has(e.node)) || (e.anyNode && (e.fieldStatus || {}).cost))) bad.push(`${b} ${e.label}: ${e.cost} vs ${path[i]}`); });
        es.forEach((e, i) => { if (!blank(e)) return;
          const picks = e.anyNode.map(n => checkPlanCosts(nodes.filter(x => x.board === 'board:' + b), [...es.slice(0, i).map(x => ({ node: x.node || x.anyNode[0], cost: x.cost })), { node: n }])[i]).flat();
          spend.set(e, Math.max(...picks)); });
        got[name[b]] = es.reduce((a, e, i) => a + (blank(e) ? path[i][0] : e.cost || 0), 0);
      }
      const w = want[cls] || { boards: {}, total: NaN }, total = Object.values(got).reduce((a, n) => a + n, 0);
      ok(`board costs ${cls}: every row has a cost its cheapest path gives (a pick-one row: the owner's, or blank); totals by board ${JSON.stringify(got)} = ${total}, as the research file`, !bad.length
        && Object.keys({ ...got, ...w.boards }).every(b => got[b] === w.boards[b]) && total === w.total, { bad, got, want: w });
      /* a board's rows all open with it (Nezekan's at Lv 12-13), so a row can wait a few levels for its points (Next up
         gates each tick on the points left, dvGateOf); it must fit before the next board opens (Lv 45 for the last) */
      let run = 0; const over = [], waits = [];
      for (const e of plan.slice().sort((x, y) => x.requires.level - y.requires.level || x.order - y.order)) {
        run += spend.has(e) ? spend.get(e) : e.cost || 0;
        const lv = e.requires.level, nextOpen = Math.min(45, ...boardLv.filter(l => l > lv)), fit = cpl.findIndex((_, L) => L >= lv && run <= points(L));
        if (fit < 0 || fit > nextOpen || (fit === nextOpen && nextOpen < 45)) over.push(`${e.label} (Lv ${lv}): ${run} points, ${points(lv)} at Lv ${lv}, fits at Lv ${fit < 0 ? 'none' : fit}, next board Lv ${nextOpen}`);
        else if (fit > lv) waits.push(`${e.label} Lv ${lv}→${fit}`);
      }
      ok(`board costs ${cls}: no row asks for more points than the player has before the next board opens (${run} by the last row${waits.length ? '; waits for points: ' + waits.join(', ') : ''})`, !over.length, over);
    }
  }
  /* 0.9 P32: the counts file is what `npm run gen -- --counts` writes, so it has no stale or missing key */
  ok(`${COUNTS_FILE} is current (npm run gen -- --counts): ${Object.keys(g.counts).length} counts`, Object.keys(g.counts).length > 0 && readFileSync(join(ROOT, COUNTS_FILE), 'utf8') === countsJson(g.counts),
    Object.keys(g.counts).filter(k => g.counts[k] !== E[k]).concat(Object.keys(E).filter(k => !(k in g.counts))));
  /* 0.2.4 villages as zones (issue #98): the village zone record */
  const zs = read('packs/aion2/asmodian/zones.json').records, av = zs.find(z => z.id === 'zone:aldelle-village');
  ok('zone:aldelle-village: Aldelle Village, region Ishalgen, verified, its Kibelisk, no trace count', !!av && av.name === 'Aldelle Village' && av.region === 'Ishalgen' && av.status === 'verified'
    && av.kibelisks.join() === 'Aldelle Village' && av.traces === null, av);
  ok('zone:aldelle-village: a Metabot quest-page ref and an owner screen (two independent sources)', !!av && av.sources.some(s => /^https:\/\/metabot\.gg\/en\/aion-2\/quests\//.test(s.url || '') && s.checkedAt && s.build)
    && av.sources.some(s => s.owner && /^owner:/.test(s.owner.ref)), av && av.sources);
  ok('zone:ishalgen no longer lists the Aldelle Village Kibelisk', !(zs.find(z => z.id === 'zone:ishalgen').kibelisks || []).includes('Aldelle Village'));
  const sq = read('packs/aion2/asmodian/story-quests.json').records, sides = sq.flatMap(r => ['giver', 'turnin'].map(k => ({ id: r.id, k, l: r[k] })));
  ok(`story: every giver / turn-in placed in Aldelle Village is in zone:aldelle-village (${E.storyAldelleVillageSides} sides), and only those`, sides.filter(x => x.l.zone === 'zone:aldelle-village').length === E.storyAldelleVillageSides
    && sides.every(x => (x.l.place === 'Aldelle Village') === (x.l.zone === 'zone:aldelle-village')), sides.filter(x => x.l.place === 'Aldelle Village' || x.l.zone === 'zone:aldelle-village').map(x => `${x.id} ${x.k} ${x.l.zone}`));
  ok('story: a re-pointed village side cites the Metabot quest page for its zone, with no owner-check label left', sq.every(r => ['giver', 'turnin'].every(k => r[k].zone !== 'zone:aldelle-village'
    || (r.sources.some(s => (s.url || '').includes('metabot.gg') && (s.fields || []).includes(k + '.zone')) && !(r.fieldStatus || {})[k + '.zone']))));
  { const ats = sq.flatMap(r => r.steps.filter(x => x.at).map(x => ({ r, x })));
    ok(`story objective points: ${E.storyObjectivePoints} on ${E.storyQuestsWithObjectivePoints} quests (research CSV, confirmed rows), each from its Metabot quest page checked 2026-10-17 on build 0.0.4387.0`, ats.length === E.storyObjectivePoints && new Set(ats.map(a => a.r.id)).size === E.storyQuestsWithObjectivePoints
      && ats.every(({ x }) => x.at.sources.length === 1 && /^https:\/\/metabot\.gg\/en\/aion-2\/quests\//.test(x.at.sources[0].url) && x.at.sources[0].checkedAt === '2026-10-17' && x.at.sources[0].build.value === '0.0.4387.0'),
      [ats.length, new Set(ats.map(a => a.r.id)).size]);
    ok('story objective points: none on a turn-in line or a "via Selvis" line; Finding Nemon (no objective lines) has none', ats.every(({ x }) => !/^Turn in/.test(x.text) && !/via Selvis/.test(x.text))
      && !sq.find(r => r.id === 'sq:2102010').steps.some(x => x.at)); }
  /* the compiled tables (src/packs/aion2/data/place.js): one place per story / regional / dungeon / stronghold node */
  const np = g.nodePlace, kb = g.kibelisks, nodes = Object.entries(g.gateGraph.nodes);
  ok(`NODE_PLACE: ${E.storyQuests} story + ${E.regionalQuests} regional + ${E.sealedDungeons} Sealed Dungeon + ${E.strongholds} stronghold nodes, keyed by GATE_GRAPH id`, Object.keys(np).length === E.nodePlace
    && E.nodePlace === E.storyQuests + E.regionalQuests + E.sealedDungeons + E.strongholds && nodes.filter(([, n]) => ['story', 'rq', 'sd', 'sh'].includes(n.kind)).every(([id]) => id in np), Object.keys(np).length);
  ok('NODE_PLACE: Survival Supplies turn-in is VeKauf\'s point, 32 m from Safe Haven', JSON.stringify(np['sq:2102015'].pts.turnin) === JSON.stringify({ map: 'altgard', x: 3183, y: 2881, anchor: 'kib:safe-haven', m: 32 })
    && np['sq:2102015'].route === 'core' && np['sq:2102015'].zone === 'zone:dredgion-crash-site', np['sq:2102015']);
  ok('NODE_PLACE: a point with no Kibelisk and no coords is left out; a placeholder zone is null', Object.values(np).every(p => Object.entries(p.pts).flatMap(([k, v]) => k === 'steps' ? v : [v]).every(x => x.anchor || x.map))
    && Object.values(np).every(p => p.zone !== 'zone:altgard-unplaced'));
  ok('NODE_PLACE: a story quest\'s objective points in pts.steps, in objective order, none for the "via Selvis" lines (Preparations for Restoration: objectives 1–6)',
    JSON.stringify(np['sq:2102235'].pts.steps.map(p => p.i)) === '[1,2,3,4,5,6]' && JSON.stringify(np['sq:2102235'].pts.steps[0]) === JSON.stringify({ i: 1, map: 'altgard', x: 4997, y: 3852, anchor: 'kib:nornir-assembly', m: 143 })
    && Object.values(np).reduce((n, p) => n + (p.pts.steps || []).length, 0) === E.storyObjectivePoints && Object.values(np).every(p => !p.pts.steps || p.pts.steps.length > 0), np['sq:2102235'].pts.steps);
  /* 73 at 0.5 P9 = P8's 72 + Alert Observation Post, which only a story objective point names */
  ok(`KIBELISKS: ${E.kibelisks} records; binds facts Survival Supplies #0 → Safe Haven (owner), A Village in the Fog #1 → Aldelle Village (step text)`, Object.keys(kb).length === E.kibelisks
    && JSON.stringify(kb['kib:safe-haven'].binds) === JSON.stringify([{ node: 'sq:2102015', i: 0, basis: 'owner' }])
    && JSON.stringify(kb['kib:aldelle-village'].binds) === JSON.stringify([{ node: 'sq:2101010', i: 1, basis: 'step-text' }])
    && Object.values(kb).reduce((n, k) => n + (k.binds || []).length, 0) === E.kibeliskBinds, Object.keys(kb).length);
  ok('place module: NODE_PLACE, KIBELISKS and TRAVEL_RULES (25 / 150 / 400 m) only, not in the page\'s data module', /^export const NODE_PLACE = /m.test(g.placeModule) && /^export const KIBELISKS = /m.test(g.placeModule)
    && g.placeModule.includes('export const TRAVEL_RULES = {"bindRadius":25,"nudgeRadius":150,"teleportGain":400};')
    && (g.placeModule.match(/^export const /gm) || []).length === 3 && !/NODE_PLACE|KIBELISKS|TRAVEL_RULES/.test(g.module));
  const kr = g.report.kibelisks;
  /* 0.5 P9: the objective points cite 3 more story Kibelisks (56) and 2 more in all (71: Alert Observation Post, Silent
     Hill Coastal Cliff); every story Kibelisk now has a point (P8: 15 were cited only by objective markers) */
  const kS = E.bindReportStoryKibelisks, kA = E.bindReportCitedKibelisks;
  ok(`bind report: R = 25 (working value) / 32 / 35 / 40 m over ${kS} story and ${kA} cited Kibelisks, none without a point; the owner check list is the story ones not bound at 25 m and with no binds fact`,
    !!kr && kr.split.map(s => s.r).join() === '25,32,35,40' && kr.split[0].working && kr.noPoint === 0 && kr.split.every(s => s.story.n === kS && s.all.n === kA && s.story.bound + s.story.nudge + s.story.none === kS)
    && kr.ownerCheck.length === kr.split[0].story.nudge + kr.split[0].story.none - 1 && !kr.ownerCheck.some(c => c.name === 'Safe Haven'), kr && kr.split);
  /* 0.4 P1 pack manifests: a broken manifest fails pack.schema.json (the generator's broken copies are worker jobs above) */
  const manifest = id => JSON.parse(readFileSync(join(ROOT, 'data/packs', id, 'pack.json'), 'utf8'));
  ok('rejects: pack manifest without id (pack.schema.json)', validateDoc(join(ROOT, 'data/packs', guide, 'pack.json'), (m => (delete m.id, m))(manifest(guide))).length > 0);
  ok('rejects: a faction pack without a parent (pack.schema.json)', validateDoc(join(ROOT, 'data/packs/aion2/asmodian/pack.json'), (m => (delete m.parent, m))(manifest('aion2/asmodian'))).length > 0);
  ok('rejects: a game pack with a parent (pack.schema.json)', validateDoc(join(ROOT, 'data/packs/aion2/pack.json'), { ...manifest('aion2'), parent: 'aion2' }).length > 0);
  /* 0.8 P16 (#505) adds the Sorcerer, 0.8 P4 (#493) the Cleric and P18 (#507) the Chanter as idle packs again (their
     guide items come later), so the check names the classes that may be idle, not a count; 0.8 P2 (#491) added the
     Templar idle and 0.8 P3 (#492) gave it its guide pack, so it is no longer among them; 0.8 P5 (#494) did the same for
     the Cleric, 0.8 P17 (#506) for the Sorcerer and 0.8 P19 (#508) for the Chanter, the last idle one: data/packs has
     none left, so the idle checks run on the Spiritmaster copy below */
  const idle = (g.idle || []).map(x => x.pack);
  /* read from the data: every idle pack's class is hidden (no class named), so a released class with no guide pack fails */
  const idleReleased = (g.idle || []).filter(x => !x.all.some(({ r, file }) => /\/class\.json$/.test(file) && r.release === 'hidden'));
  ok('data/packs: every idle class pack\'s class is hidden (none is released without a guide pack)', !idleReleased.length, idleReleased.map(x => x.pack));
  /* 0.8 P12 (#501): every bundle carries GAME_CLASSES, the game's class list ({ class, name } per class, for the welcome's
     class picker), so the class words below are read in the module without that one line; the line itself holds
     exactly the class ids and names of data/packs/aion2/pack.json `classes` and the class records, nothing else */
  /* 0.9 P11 (#632): GUIDE_CLASSES, the playable classes ({ class, pack, name } per released class with a guide pack, in
     releaseOrder), is read the same way: the leak words below are looked for without that line, and the line itself holds
     exactly the guide packs below data/packs, their class ids and the class records' names, nothing else */
  const GC_LINE = /^export const GAME_CLASSES = (.*);$/m, GU_LINE = /^export const GUIDE_CLASSES = (.*);$/m, recordsOnly = m => m.replace(GC_LINE, '').replace(GU_LINE, '');
  {
    const gc = JSON.parse((g.module.match(GC_LINE) || [])[1] || 'null'), ids = JSON.parse(readFileSync(join(ROOT, 'data/packs/aion2/pack.json'), 'utf8')).classes;
    ok('GAME_CLASSES: the game\'s classes in pack.json order, each { class, name } from its class record, nothing else', Array.isArray(gc) && JSON.stringify(gc.map(e => e.class)) === JSON.stringify(ids)
      && gc.every(e => JSON.stringify(Object.keys(e)) === '["class","name"]' && JSON.parse(readFileSync(join(ROOT, `data/packs/aion2/classes/${e.class}/class.json`), 'utf8')).records[0].name === e.name), gc);
    const gu = JSON.parse((g.module.match(GU_LINE) || [])[1] || 'null'), rec = c => JSON.parse(readFileSync(join(ROOT, `data/packs/aion2/classes/${c}/class.json`), 'utf8')).records[0];
    ok('GUIDE_CLASSES: every guide pack once, each { class, pack, name } with its class record\'s name, released, in releaseOrder (the Assassin first), nothing else', Array.isArray(gu)
      && JSON.stringify(gu.map(e => e.pack).sort()) === JSON.stringify(guidePacks()) && gu[0].pack === guide
      && gu.every((e, i) => JSON.stringify(Object.keys(e)) === '["class","pack","name"]' && e.pack === 'aion2/asmodian/' + e.class && rec(e.class).name === e.name && rec(e.class).release === 'released' && (!i || rec(gu[i - 1].class).releaseOrder < rec(e.class).releaseOrder)), gu);
  }
  /* every other guide pack (0.9 P3, #622): the class list is read from the data, so a new class or a flipped release needs
     no edit here. For each guide pack in `others`: its class pack is no longer idle, the guide pack compiles 1 class and
     the counts of that class's own files (skills, stigmas, board nodes), and the Assassin bundle carries none of its
     records: the leak words are read from the class's own records (its prefixed ids, skill and stigma names, board-node
     game ids) minus any word that also occurs elsewhere in data/packs (other classes, quest text). Quest text names NPC Rangers, so the class id matches only in its
     record-id form. */
  const classFiles = ['class.json', 'skills.json', 'stigmas.json', 'board-nodes.json'];
  const allClasses = JSON.parse(readFileSync(join(ROOT, 'data/packs/aion2/pack.json'), 'utf8')).classes;
  const classNames = c => classDoc(c, 'skills.json').records.concat(classDoc(c, 'stigmas.json').records).map(r => r.name);
  const classGameIds = c => classDoc(c, 'board-nodes.json').records.map(r => r.gameId).filter(Boolean);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dataFiles = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? dataFiles(join(d, e.name)) : e.name.endsWith('.json') ? [join(d, e.name)] : []);
  const corpus = dataFiles(join(ROOT, 'data/packs')).map(f => ({ f: f.split('\\').join('/'), t: readFileSync(f, 'utf8') }));
  /* a game id occurs in a text when it stands as a whole digit run: an all-digit id is looked up in the text's set of digit
     runs (0.9 P6: one pass a class instead of one regex scan of the corpus per board node; the same words) */
  const leakWords = c => { const rest = corpus.filter(x => !x.f.includes(`/aion2/classes/${c}/`) && !x.f.includes(`/aion2/asmodian/${c}/`)).map(x => x.t).join('\n').toLowerCase();
    const runs = new Set(rest.match(/\d+/g)), inRest = x => /^\d+$/.test(x) ? runs.has(x) : new RegExp(`(?<!\\d)${esc(x)}(?!\\d)`).test(rest);
    return [`(class|skill|stigma|spec|node|build):${esc(c)}\\b`, ...(c === 'ranger' ? [] : [`\\b${esc(c)}\\b`]),...classNames(c).filter(x => !rest.includes(x.toLowerCase())).map(esc), ...classGameIds(c).filter(x => !inRest(String(x))).map(x => `(?<!\\d)${esc(x)}(?!\\d)`)]; };
  const guideClasses = otherIds.map(id => ({ id, cls: id.split('/').pop(), pack: others[otherIds.indexOf(id)] }));
  ok(`every guide pack other than the Assassin's is a class of pack.json (${guideClasses.map(x => x.cls).join(', ')})`, guideClasses.every(x => allClasses.includes(x.cls)), guideClasses.map(x => x.cls));
  for (const { cls, pack } of guideClasses) {
    const cdir = `data/packs/aion2/classes/${cls}/`, coll = f => pack ? pack.all.filter(x => x.file.startsWith(cdir) && x.file.endsWith('/' + f)).length : 0;
    const want = { 'class.json': 1, 'skills.json': classDoc(cls, 'skills.json').records.length, 'stigmas.json': classDoc(cls, 'stigmas.json').records.length, 'board-nodes.json': classDoc(cls, 'board-nodes.json').records.length };
    ok(`the ${cls} class pack is not idle; its guide pack compiles 1 class, ${want['skills.json']} skills, ${want['stigmas.json']} stigmas, ${want['board-nodes.json']} board nodes (counts of its own files)`,
      !idle.includes('aion2/classes/' + cls) && !!pack && classFiles.every(f => want[f] > 0 && coll(f) === want[f]), classFiles.map(f => [f, want[f], coll(f)]));
    const words = new RegExp(leakWords(cls).join('|'), 'i'), inn = [recordsOnly(g.module), g.gateModule, g.proposedModule, g.placeModule].filter(m => words.test(m)).map(m => m.match(words)[0]);
    ok(`the Assassin bundle carries no ${cls} record (generated, gate, proposed and place modules)`, !inn.length, inn);
    ok(`rejects: a leaked ${cls} record (negative control: its skill id appended to the bundle is found)`, words.test(g.module + `\nskill:${cls}:leaked`));
  }
  const c = g.constants;
  /* the story tables are keyed by the quest's save key (save v6, 0.9 P2); QUEST_NAME gives the name */
  const locOf = n => c.QUEST_LOC[Object.keys(c.QUEST_NAME).find(k => c.QUEST_NAME[k] === n)] || {};
  ok('compiled: story turn-in zones: Aldelle Village where the turn-in is in the village, else Ishalgen', locOf('A Village in the Fog').turninZone === 'Aldelle Village'
    && locOf('Brigade Prison Compound Infiltration Operation').turninZone === 'Aldelle Village' && locOf('Isolated Lake').turninZone === 'Ishalgen',
    ['A Village in the Fog', 'Brigade Prison Compound Infiltration Operation', 'Isolated Lake'].map(n => locOf(n).turninZone));
  ok('compiled: QUESTS hold the story key (sq:<gameId>), QUEST_NAME its name, every story table is keyed by it', c.QUESTS.every(q => /^sq:\d+$/.test(q[1]) && typeof c.QUEST_NAME[q[1]] === 'string')
    && [c.QUEST_STEPS, c.QUEST_LOC, c.STORY_UNLOCKS, c.UNLOCK_GATE].every(t => Object.keys(t).every(k => k in c.QUEST_NAME)), c.QUESTS.slice(0, 2));
  ok(`compiled: ${E.storyQuests} story quests (Ishalgen is the starting map, not a quest), ${E.regionalQuests} regional quests, ${E.strongholds} strongholds, ${E.sealedDungeons} Sealed Dungeons`,
    c.QUESTS.length === E.storyQuests && c.RQ.length === E.regionalQuests && c.SH_DATA.length === E.strongholds && Object.keys(c.HIDEOUT_AREA).length === E.sealedDungeons,
    [c.QUESTS.length, c.RQ.length, c.SH_DATA.length, Object.keys(c.HIDEOUT_AREA).length]);
}
/* allthings.how wording (0.8.1 F9, #662): its terms ban copying, so no source ref on an allthings.how URL keeps a `quote`
   unless the quote is in Game Data Check's paraphrase table, and every paraphrase in that table is applied to data/ */
{ const TABLE = 'docs/research/2026-10-allthings-paraphrases.md', table = readFileSync(join(ROOT, TABLE), 'utf8');
  const facts = table.split('\n').filter(l => /^\| N?\d+ \|/.test(l)).map(l => l.split('|')[5].trim()).filter(f => !/^As row \d+\.$/.test(f));
  const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.json') ? [join(d, e.name)] : []);
  const refs = [], refsIn = (v, file) => { if (Array.isArray(v)) v.forEach(x => refsIn(x, file)); else if (v && typeof v === 'object') { if (typeof v.url === 'string' && /^https:\/\/allthings\.how\//.test(v.url)) refs.push({ file, ...v }); Object.values(v).forEach(x => refsIn(x, file)); } };
  for (const f of walk(join(ROOT, 'data'))) refsIn(JSON.parse(readFileSync(f, 'utf8')), f.slice(ROOT.length + 1));
  const strayOf = rs => rs.filter(r => 'quote' in r && !table.includes(r.quote)), quoted = refs.filter(r => 'quote' in r), stray = strayOf(refs);
  ok(`no allthings.how quote outside the paraphrase table (${TABLE}): ${quoted.length} quote fields on ${refs.length} allthings.how refs, ${stray.length} not in the table`, !stray.length, stray.map(r => [r.file, r.quote]));
  ok('rejects: an allthings.how quote not in the table (negative control: the old C01 quote)', strayOf([{ url: 'https://allthings.how/?p=215236', quote: 'Resets are free and unlimited' }]).length === 1);
  ok(`the paraphrase table has its 20 distinct facts (16 quote rows less 1 "as row 2", N1 to N5)`, facts.length === 20, facts.length);
  const missing = facts.filter(f => !refs.some(r => typeof r.note === 'string' && r.note.includes(f)));
  ok('every paraphrase in the table is applied to an allthings.how source note in data/', !missing.length, missing);
  { const isGuideClaims = f => /^data\/packs\/aion2\/asmodian\/[a-z]+\/guide\/claims\.json$/.test(f);
    const guides = walk(join(ROOT, 'data')).map(f => f.slice(ROOT.length + 1).split('\\').join('/')).filter(isGuideClaims).length; /* the class guides present, read from the data */
    ok(`C02 carries the row 1 paraphrase in all ${guides} class guides`, guides > 0 && refs.filter(r => isGuideClaims(r.file) && r.note && r.note.startsWith(facts[0])).length === guides); }
  const shared = read('packs/aion2/asmodian/guide/claims.json').records, byId = Object.fromEntries(shared.map(x => [x.id, x]));
  ok('C24 (Noble Belt never fails: allthings.how alone) is single source, C23 no longer says its belt costs are verified',
    byId.C24.verdict === 'single-source' && byId.C23.verdict === 'single-source' && !/Belt costs verified/.test(byId.C23.note), [byId.C24.verdict, byId.C23.verdict]);
}
/* allthings.how wording in plain strings (0.8.1 F10, #690): F9's walk reads `quote` fields only. This one reads every string
   in data/packs (string arrays included) that names allthings.how outside an allthings.how source ref, bare URLs aside.
   Each must be where Game Data Check's notes table puts it: an F row's string carries its "Replace with" text, any other
   string is one of the K ("no change") strings that table counts for that record field. Fields are keyed without array
   indices, so reordering a notes array doesn't red this; a string added or put back where the table has none does. A
   quoted fragment right after an allthings.how mention ("allthings.how: '…" or "allthings.how 244371 ('…") fails anywhere. */
{ const NOTES = 'docs/research/2026-10-allthings-notes.md', md = readFileSync(join(ROOT, NOTES), 'utf8');
  const rows = md.split('\n').filter(l => /^\| [FK]\d+ \|/.test(l)).map(l => l.split('|').map(c => c.trim()));
  const keyOf = loc => { const m = /^(\S+) (\S+) `([^`]+)`$/.exec(loc); return m ? `${m[1]} ${m[2]} ${m[3].replace(/\[\d+\]/g, '')}` : null; };
  const F = [], K = {}, badLocs = [];
  for (const [, n, where, third] of rows) for (const loc of where.split('<br>')) { const k = keyOf(loc); if (!k) badLocs.push([n, loc]); else if (n[0] === 'F') F.push({ n, k, text: third }); else K[k] = (K[k] || 0) + 1; }
  ok(`the notes table (${NOTES}) parses: ${rows.filter(r => r[1][0] === 'F').length} change rows (${F.length} strings), ${rows.filter(r => r[1][0] === 'K').length} no-change rows`,
    !badLocs.length && F.length === 29 && rows.length === 23 + 105, badLocs.length ? badLocs : [F.length, rows.length]);
  const isAt = v => v && typeof v === 'object' && typeof v.url === 'string' && /^https:\/\/allthings\.how\//.test(v.url);
  const strings = (v, path, acc) => { if (typeof v === 'string') acc.push([path, v]); else if (Array.isArray(v)) v.forEach(x => strings(x, path, acc)); else if (v && typeof v === 'object' && !isAt(v)) for (const [k, x] of Object.entries(v)) strings(x, path ? `${path}.${k}` : k, acc); };
  const SHAPE = /allthings(?:\.how)?[^.;:(,]*(?:: '|\(')/;
  const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.json') ? [join(d, e.name)] : []);
  const docs = walk(join(ROOT, 'data/packs')).map(f => [f.slice(ROOT.length + 1).split('\\').join('/').replace(/^data\/packs\/aion2\//, ''), JSON.parse(readFileSync(f, 'utf8'))]);
  /* audit(docs, edit?): edit(file, id, path, s) may return a replacement string, for the negative controls (nothing written) */
  const audit = (edit = null, extra = []) => { const used = new Set(), seen = {}, stray = [], shaped = []; let n = 0;
    for (const [file, doc] of docs) for (const r of doc.records || [{ id: '-', ...doc }]) { const acc = []; strings(r, '', acc);
      for (const [x, y, path, s0] of extra) if (x === file && y === r.id) acc.push([path, s0]);
      for (let [path, s] of acc) { if (edit) s = edit(file, r.id, path, s) ?? s;
        if (!/allthings/i.test(s) || /^https?:\/\/\S+$/.test(s)) continue;
        n++; const k = `${file} ${r.id} ${path}`, f = F.find(x => !used.has(x) && x.k === k && s.includes(x.text));
        if (SHAPE.test(s) && !f) shaped.push([k, s]);
        if (f) { used.add(f); continue; }
        seen[k] = (seen[k] || 0) + 1; if (seen[k] > (K[k] || 0)) stray.push([k, s]); } }
    return { n, stray, shaped, missing: F.filter(x => !used.has(x)).map(x => [x.n, x.k]) }; };
  const a = audit();
  ok(`every allthings.how string in data/packs is in the notes table: ${a.n} strings, ${a.stray.length} not in it, ${a.shaped.length} with a quoted fragment`, a.n > 0 && !a.stray.length && !a.shaped.length, [...a.stray, ...a.shaped]);
  ok(`every change row of the notes table is applied (${F.length} strings carry their "Replace with" text)`, !a.missing.length, a.missing);
  const RQ = 'asmodian/regional-quests.json';
  const put = audit(null, [[RQ, 'rq:2202018', 'notes', 'allthings.how: rift opens at random spots at set times']]);
  ok('rejects: an allthings.how sentence put back into a notes array (negative control: rq:2202018 notes)', put.stray.length === 1, put.stray);
  const back = audit((file, id, path, s) => file === RQ && id === 'rq:2202032' && path === 'notes' && s.startsWith('allthings.how: the rift') ? 'allthings.how: rift opens at random spots at set times' : null);
  ok('rejects: a change row reverted to its old wording (negative control: rq:2202032, F10)', back.missing.length === 1 && back.stray.length === 1, [back.missing, back.stray]);
  const quoted = audit((file, id, path, s) => file === RQ && id === 'rq:2202014' && path === 'conflicts' && /allthings/.test(s) ? s.replace('allthings.how', "allthings.how ('a copied line')") : null);
  ok('rejects: a quoted fragment after allthings.how in a no-change string (negative control: rq:2202014 conflicts)', quoted.shaped.length === 1 && !quoted.stray.length, quoted.shaped);
}
/* licence compliance (tests/compliance.mjs): ours only; each fixture is passed as an override, never written. The patterns
   are split in the source so this file does not trip the check it tests. */
{ const problems = checkCompliance(); ok(`licence compliance checks (${problems.length} problems)`, !problems.length, problems);
  const fails = (label, files, re) => { const p = checkCompliance(ROOT, { files }); ok('compliance check rejects: ' + label, p.some(x => re.test(x)), p.slice(0, 3)); };
  fails('an MIT header', { 'src/x.js': '/* ' + 'MIT Li' + 'cense\n\nPermission is hereby ' + 'granted, free of charge, to any person */' }, /src\/x\.js: contains an "MIT Li/);
  fails('an MIT permission text alone', { 'src/x.js': '// Permission is hereby ' + 'granted, free of charge, to any person' }, /contains a "Permission is hereby granted/);
  fails('a foreign SPDX id', { 'src/x.js': '// SPDX-License-' + 'Identifier: Apache-2.0\n' }, /SPDX-License-Identifier "Apache-2\.0"/);
  fails('a stray LICENSE.md', { 'tools/LICENSE.md': 'All rights reserved.\n' }, /tools\/LICENSE\.md: a licence file other than the root LICENSE/);
  { const priv = readFileSync(join(ROOT, 'PRIVACY.md'), 'utf8'), key = /export const KEY\s*=\s*"([^"]+)"/.exec(readFileSync(join(ROOT, 'src/core/state.js'), 'utf8'))[1];
    fails('a PRIVACY.md naming companion-save-v4 (CK-3)', { 'PRIVACY.md': priv.replaceAll(key, 'companion-save-v4') }, new RegExp(`PRIVACY\\.md names the save key companion-save-v4, but src/core/state\\.js uses ${key}`));
    fails('a PRIVACY.md naming no save key (CK-3)', { 'PRIVACY.md': 'Progress is stored in localStorage.\n' }, new RegExp(`does not name the save key ${key}`)); }
  { /* CK-2 (0.9 P27): every icon file has a complete ISSUES.md row */
    const issues = readFileSync(join(ROOT, 'docs/ISSUES.md'), 'utf8'), rowOf = f => issues.split('\n').find(l => l.startsWith(`  | ${f} | `));
    const ambush = rowOf('sk-ambush.png'), upload = rowOf('blue-off.png');
    ok('the fixtures find their ISSUES.md rows', !!ambush && !!upload && ambush !== upload, [ambush, upload]);
    fails('an icon file with no ISSUES.md row (CK-2)', { 'src/assets/icons/zz-extra-icon.png': '' }, /zz-extra-icon\.png: no docs\/ISSUES\.md row/);
    fails('a blank placeholder row (CK-2)', { 'docs/ISSUES.md': issues.replace(ambush, '  | sk-ambush.png | | |') }, /sk-ambush\.png: no docs\/ISSUES\.md row/);
    fails('an owner-upload row with no owner source (CK-2)', { 'docs/ISSUES.md': issues.replace(upload, upload.replace(/owner upload `[^`]*`/, 'an upload')) }, /blue-off\.png: no docs\/ISSUES\.md row/); }
  const ours = checkCompliance(ROOT, { files: { 'src/x.js': '/* SPDX-License-' + 'Identifier: PolyForm-Strict-1.0.0 */' } });
  ok('compliance check accepts our own SPDX id', !ours.length, ours.slice(0, 3)); }
/* the generator's negative controls, from the workers, in job order; every job must have run */
{ const tMain = Date.now() - t0, lines = (await Promise.all(workers)).flat().sort((a, b) => a.i - b.i);
  console.log(`-- generator negative controls: ${JOBS.length} jobs in ${W} worker threads (main thread done at ${tMain} ms)`);
  for (const l of lines) line(l.name, l.c, l.d);
  const missing = JOBS.map((_, i) => i).filter(i => !lines.some(l => l.i === i));
  ok(`every generator control job ran and reported (${JOBS.length})`, !missing.length, missing); }
console.log(`${n - fail} ok, ${fail} failed (${Date.now() - t0} ms)`);
console.log(fail ? `SCHEMA CHECKS FAILED (${fail})` : 'SCHEMA CHECKS PASSED');
process.exit(fail ? 1 : 0);
}
