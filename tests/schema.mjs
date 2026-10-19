#!/usr/bin/env node
/* Data format v2 checks in Node, no browser, no build (0.2 step 5b): every data file and every schema example against
   data/schema/ with ajv 8 Ajv2020 { strict: true, allErrors: true }; broken copies of real records must be rejected
   (so a relaxed schema can't pass silently); then the generator's cross-record checks, and data/DATA_SOURCES.md must be
   what the generator writes; last, the rules and decisions ledger (tests/ledger.mjs, docs/kaizen/LEDGER.md).
   node tests/schema.mjs  (also in `npm test` and the fast CI job) */
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, validateAll, validateDoc } from '../tools/gen/validate.mjs';
import { dataSourcesMd, generate, guidePacks } from '../tools/gen/gen.mjs';
import { checkLedger } from './ledger.mjs';

let n = 0, fail = 0;
const ok = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 900) : '')); if (!c) fail++; };
const t0 = Date.now();

const { files, bad } = validateAll();
ok(`every data file and schema example validates (${files} files)`, !bad.length, bad.map(b => `${b.file}: ${b.errors.slice(0, 3).join('; ')}`));

/* negative controls on real records: each broken copy must fail validation */
const read = p => JSON.parse(readFileSync(join(ROOT, 'data', p), 'utf8'));
const broken = (label, p, mutate) => {
  const doc = read(p); mutate(doc.records[0], doc);
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

/* 0.5 P8: the Kibelisk registry, binds facts and the travel rules */
const stepWith = (d, f) => d.records.flatMap(r => r.steps).find(f);
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
  others.forEach((o, i) => ok(`guide pack ${otherIds[i]}: ${o.report.checks.length} cross-record checks pass`, !o.failed.length, o.failed.slice(0, 10)));
  /* proposals never reach the page's data module: it is byte-identical without them (0.2 behaviour unchanged) */
  let g0 = null; try { g0 = generate({ dropProposed: true }); } catch (e) { ok('generator runs without proposals', false, e.message); }
  if (g0) ok(`proposed 0.3 gates are not in the data module: identical without the ${g.report.proposed.length} proposals`, g0.module === g.module && g.report.proposed.length > 0);
  /* GATE_GRAPH (0.3 E1) compiles the live gates only: proposals off */
  if (g0) ok('GATE_GRAPH identical without the proposals (live requires / completesWith only)', g0.gateModule === g.gateModule);
  /* GATE_PROPOSED (0.3 E4) holds exactly the proposals, compiled (the evaluator applies one only when asked, per id) */
  if (g0) ok('GATE_PROPOSED: one entry per proposal, empty without them', Object.keys(g.gateProposed).sort().join() === g.report.proposed.map(p => p.id).sort().join() && Object.keys(g0.gateProposed).length === 0,
    [Object.keys(g.gateProposed).length, g.report.proposed.length, Object.keys(g0.gateProposed).length]);
  /* 0.3 E7 guard: a specialty pick beyond slot 1 needs a 2+ source slot witness in specialtyEvidence (owner on #75) */
  const genFails = (label, mutate, re) => { let g1 = null; try { g1 = generate({ mutate: (rel, d) => rel === 'data/packs/aion2/asmodian/assassin/builds.json' && mutate(d.records[0]) }); } catch (e) { ok('generator runs: ' + label, false, e.message); return; }
    ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check)); };
  genFails('slot 2 pick without evidence (Savage Roar 4, contested)', r => { r.specialtyPicks['skill:assassin:savage-roar'].push('spec:assassin:savage-roar:4'); }, /savage-roar:4 \(slot 2\) has 2\+ source/);
  genFails('slot witness not cited for specialtyPicks (GamesFuze)', r => { r.specialtyEvidence['spec:assassin:quick-slice:4'].sources[0] = 'https://gamesfuze.com/guides/aion-2-assassin-build-best-skills-stigmas-and-rotation/'; }, /quick-slice:4 \(slot 2\) has 2\+ source/);
  genFails('evidence from one publisher only', r => { r.specialtyEvidence['spec:assassin:heart-gore:5'].sources = ['https://skycoach.gg/blog/aion-2/articles/assassin-guide', 'https://skycoach.gg/blog/aion-2/articles/assassin-guide']; }, /heart-gore:5 \(slot 3\) has 2\+ source/);
  genFails('evidence for the wrong slot', r => { r.specialtyEvidence['spec:assassin:heart-gore:5'].slot = 2; }, /heart-gore:5 \(slot 3\) has 2\+ source/);
  /* 0.2.4 villages as zones (issue #98): the village zone record, and the checks that keep places and Kibelisks in it */
  const zs = read('packs/aion2/asmodian/zones.json').records, av = zs.find(z => z.id === 'zone:aldelle-village');
  ok('zone:aldelle-village: Aldelle Village, region Ishalgen, verified, its Kibelisk, no trace count', !!av && av.name === 'Aldelle Village' && av.region === 'Ishalgen' && av.status === 'verified'
    && av.kibelisks.join() === 'Aldelle Village' && av.traces === null, av);
  ok('zone:aldelle-village: a Metabot quest-page ref and an owner screen (two independent sources)', !!av && av.sources.some(s => /^https:\/\/metabot\.gg\/en\/aion-2\/quests\//.test(s.url || '') && s.checkedAt && s.build)
    && av.sources.some(s => s.owner && /^owner:/.test(s.owner.ref)), av && av.sources);
  ok('zone:ishalgen no longer lists the Aldelle Village Kibelisk', !(zs.find(z => z.id === 'zone:ishalgen').kibelisks || []).includes('Aldelle Village'));
  const sq = read('packs/aion2/asmodian/story-quests.json').records, sides = sq.flatMap(r => ['giver', 'turnin'].map(k => ({ id: r.id, k, l: r[k] })));
  ok('story: every giver / turn-in placed in Aldelle Village is in zone:aldelle-village (10 sides), and only those', sides.filter(x => x.l.zone === 'zone:aldelle-village').length === 10
    && sides.every(x => (x.l.place === 'Aldelle Village') === (x.l.zone === 'zone:aldelle-village')), sides.filter(x => x.l.place === 'Aldelle Village' || x.l.zone === 'zone:aldelle-village').map(x => `${x.id} ${x.k} ${x.l.zone}`));
  ok('story: a re-pointed village side cites the Metabot quest page for its zone, with no owner-check label left', sq.every(r => ['giver', 'turnin'].every(k => r[k].zone !== 'zone:aldelle-village'
    || (r.sources.some(s => (s.url || '').includes('metabot.gg') && (s.fields || []).includes(k + '.zone')) && !(r.fieldStatus || {})[k + '.zone']))));
  const genFailsIn = (label, rel, mutate, re) => { let g1 = null; try { g1 = generate({ mutate: (p, d) => p === rel && mutate(d) }); } catch (e) { ok('generator runs: ' + label, false, e.message); return; }
    ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check)); };
  genFailsIn('Aldelle Village Kibelisk in two zones', 'data/packs/aion2/asmodian/zones.json', d => { d.records.find(z => z.id === 'zone:ishalgen').kibelisks = ['Aldelle Village']; }, /Kibelisk Aldelle Village resolves to one zone/);
  genFailsIn('a giver placed in Aldelle Village but zoned Ishalgen', 'data/packs/aion2/asmodian/story-quests.json', d => { d.records.find(r => r.id === 'sq:2101010').giver.zone = 'zone:ishalgen'; }, /sq:2101010: place Aldelle Village is in zone:aldelle-village/);
  genFailsIn('a giver placed in Black Claw Village but zoned elsewhere', 'data/packs/aion2/asmodian/story-quests.json', d => { d.records.find(r => r.id === 'sq:2102781').giver.zone = 'zone:impetusium-square'; }, /sq:2102781: place Black Claw Village is in zone:black-claw-village/);
  /* 0.5 P8: every Kibelisk name resolves to one registry record; ids, zones, binds and rules are checked */
  const KIB = 'data/packs/aion2/asmodian/kibelisks.json', SQ = 'data/packs/aion2/asmodian/story-quests.json';
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
  const sqStep = (d, id, i) => d.records.find(r => r.id === id).steps.find(x => x.i === i);
  genFailsIn('a (Kibelisk: X) marker that differs from at.kibelisk', SQ, d => { sqStep(d, 'sq:2102235', 1).at.kibelisk = 'Guide Rest Stop'; }, /sq:2102235 #1: \(Kibelisk: X\) marker = at\.kibelisk/);
  genFailsIn('an objective point naming an unknown Kibelisk', SQ, d => { sqStep(d, 'sq:2102590', 1).at.kibelisk = 'Alert Observation Tower'; }, /Kibelisk "Alert Observation Tower" resolves to a registry record/);
  genFailsIn('an objective point on another map than its Kibelisk', SQ, d => { sqStep(d, 'sq:2102235', 1).at.map = 'ishalgen'; }, /sq:2102235 #1: at\.map is its Kibelisk's map/);
  genFailsIn('an objective point on a regional quest', 'data/packs/aion2/asmodian/regional-quests.json', d => { const r = d.records.find(r => (r.steps || []).length);
    r.steps[0].at = { map: 'altgard', x: 1, y: 1, kibelisk: 'Safe Haven', meters: 1, sources: [{ url: 'https://metabot.gg/en/aion-2/quests/survival-supplies' }] }; }, /#0: at only on story objectives/);
  { const ats = sq.flatMap(r => r.steps.filter(x => x.at).map(x => ({ r, x })));
    ok('story objective points: 300 on 83 quests (research CSV, confirmed rows), each from its Metabot quest page checked 2026-10-17 on build 0.0.4387.0', ats.length === 300 && new Set(ats.map(a => a.r.id)).size === 83
      && ats.every(({ x }) => x.at.sources.length === 1 && /^https:\/\/metabot\.gg\/en\/aion-2\/quests\//.test(x.at.sources[0].url) && x.at.sources[0].checkedAt === '2026-10-17' && x.at.sources[0].build.value === '0.0.4387.0'),
      [ats.length, new Set(ats.map(a => a.r.id)).size]);
    ok('story objective points: none on a turn-in line or a "via Selvis" line; Finding Nemon (no objective lines) has none', ats.every(({ x }) => !/^Turn in/.test(x.text) && !/via Selvis/.test(x.text))
      && !sq.find(r => r.id === 'sq:2102010').steps.some(x => x.at)); }
  /* the compiled tables (src/packs/aion2/data/place.js): one place per story / regional / dungeon / stronghold node */
  const np = g.nodePlace, kb = g.kibelisks, nodes = Object.entries(g.gateGraph.nodes);
  ok('NODE_PLACE: 87 story + 58 regional + 60 Sealed Dungeon + 15 stronghold nodes, keyed by GATE_GRAPH id', Object.keys(np).length === 220
    && nodes.filter(([, n]) => ['story', 'rq', 'sd', 'sh'].includes(n.kind)).every(([id]) => id in np), Object.keys(np).length);
  ok('NODE_PLACE: Survival Supplies turn-in is VeKauf\'s point, 32 m from Safe Haven', JSON.stringify(np['sq:2102015'].pts.turnin) === JSON.stringify({ map: 'altgard', x: 3183, y: 2881, anchor: 'kib:safe-haven', m: 32 })
    && np['sq:2102015'].route === 'core' && np['sq:2102015'].zone === 'zone:dredgion-crash-site', np['sq:2102015']);
  ok('NODE_PLACE: a point with no Kibelisk and no coords is left out; a placeholder zone is null', Object.values(np).every(p => Object.entries(p.pts).flatMap(([k, v]) => k === 'steps' ? v : [v]).every(x => x.anchor || x.map))
    && Object.values(np).every(p => p.zone !== 'zone:altgard-unplaced'));
  ok('NODE_PLACE: a story quest\'s objective points in pts.steps, in objective order, none for the "via Selvis" lines (Preparations for Restoration: objectives 1–6)',
    JSON.stringify(np['sq:2102235'].pts.steps.map(p => p.i)) === '[1,2,3,4,5,6]' && JSON.stringify(np['sq:2102235'].pts.steps[0]) === JSON.stringify({ i: 1, map: 'altgard', x: 4997, y: 3852, anchor: 'kib:nornir-assembly', m: 143 })
    && Object.values(np).reduce((n, p) => n + (p.pts.steps || []).length, 0) === 300 && Object.values(np).every(p => !p.pts.steps || p.pts.steps.length > 0), np['sq:2102235'].pts.steps);
  /* 73 = P8's 72 + Alert Observation Post, which only a story objective point names (0.5 P9) */
  ok('KIBELISKS: 73 records; binds facts Survival Supplies #0 → Safe Haven (owner), A Village in the Fog #1 → Aldelle Village (step text)', Object.keys(kb).length === 73
    && JSON.stringify(kb['kib:safe-haven'].binds) === JSON.stringify([{ node: 'sq:2102015', i: 0, basis: 'owner' }])
    && JSON.stringify(kb['kib:aldelle-village'].binds) === JSON.stringify([{ node: 'sq:2101010', i: 1, basis: 'step-text' }])
    && Object.values(kb).filter(k => k.binds).length === 2, Object.keys(kb).length);
  ok('place module: NODE_PLACE, KIBELISKS and TRAVEL_RULES (25 / 150 / 400 m) only, not in the page\'s data module', /^export const NODE_PLACE = /m.test(g.placeModule) && /^export const KIBELISKS = /m.test(g.placeModule)
    && g.placeModule.includes('export const TRAVEL_RULES = {"bindRadius":25,"nudgeRadius":150,"teleportGain":400};')
    && (g.placeModule.match(/^export const /gm) || []).length === 3 && !/NODE_PLACE|KIBELISKS|TRAVEL_RULES/.test(g.module));
  const kr = g.report.kibelisks;
  /* 0.5 P9: the objective points cite 3 more story Kibelisks (56) and 2 more in all (71: Alert Observation Post, Silent
     Hill Coastal Cliff); every story Kibelisk now has a point (P8: 15 were cited only by objective markers) */
  ok('bind report: R = 25 (working value) / 32 / 35 / 40 m over 56 story and 71 cited Kibelisks, none without a point; the owner check list is the story ones not bound at 25 m and with no binds fact',
    !!kr && kr.split.map(s => s.r).join() === '25,32,35,40' && kr.split[0].working && kr.noPoint === 0 && kr.split.every(s => s.story.n === 56 && s.all.n === 71 && s.story.bound + s.story.nudge + s.story.none === 56)
    && kr.ownerCheck.length === kr.split[0].story.nudge + kr.split[0].story.none - 1 && !kr.ownerCheck.some(c => c.name === 'Safe Haven'), kr && kr.split);
  /* 0.4 P1 pack manifests: a broken copy of data/packs (tests/out/, not committed) must stop the generator (packs.mjs) */
  const packsCopy = (label, mutate) => { const root = join(ROOT, 'tests/out/packs-' + label); rmSync(root, { recursive: true, force: true });
    cpSync(join(ROOT, 'data/packs'), root, { recursive: true }); mutate(root); return root; };
  const editManifest = (root, id, f) => { const p = join(root, id, 'pack.json'), m = JSON.parse(readFileSync(p, 'utf8')); f(m); writeFileSync(p, JSON.stringify(m)); };
  const packFails = (label, mutate, re) => { let msg = null; try { generate({ root: packsCopy(label, mutate) }); } catch (e) { msg = e.message; }
    ok('generator rejects: ' + label, !!msg && re.test(msg), msg); };
  const guide = 'aion2/asmodian/assassin', manifest = id => JSON.parse(readFileSync(join(ROOT, 'data/packs', id, 'pack.json'), 'utf8'));
  ok('rejects: pack manifest without id (pack.schema.json)', validateDoc(join(ROOT, 'data/packs', guide, 'pack.json'), (m => (delete m.id, m))(manifest(guide))).length > 0);
  ok('rejects: a faction pack without a parent (pack.schema.json)', validateDoc(join(ROOT, 'data/packs/aion2/asmodian/pack.json'), (m => (delete m.parent, m))(manifest('aion2/asmodian'))).length > 0);
  ok('rejects: a game pack with a parent (pack.schema.json)', validateDoc(join(ROOT, 'data/packs/aion2/pack.json'), { ...manifest('aion2'), parent: 'aion2' }).length > 0);
  packFails('manifest without id', r => editManifest(r, guide, m => { delete m.id; }), /pack manifest fails pack\.schema\.json/);
  packFails('manifest id that is not its folder', r => editManifest(r, 'aion2/asmodian', m => { m.id = 'aion2/elyos'; }), /id "aion2\/elyos" is not its folder/);
  packFails('a listed file that does not exist', r => rmSync(join(r, 'aion2/items.json')), /pack aion2: listed file items\.json does not exist/);
  packFails('a JSON file in a pack folder that is not listed', r => writeFileSync(join(r, 'aion2/asmodian/extra.json'), '{}'), /pack aion2\/asmodian: .*not listed in pack\.json: extra\.json/);
  packFails('an unknown parent', r => editManifest(r, guide, m => { m.parent = 'aion2/elyos'; }), /aion2\/asmodian\/assassin parent: unknown pack "aion2\/elyos"/);
  packFails('an unknown pack in uses', r => editManifest(r, guide, m => { m.uses = ['aion2/classes/templar']; }), /uses: unknown pack "aion2\/classes\/templar"/);
  packFails('a cycle (the class uses the guide that uses it)', r => editManifest(r, 'aion2/classes/assassin', m => { m.uses = [guide]; }), /pack cycle: /);
  let gc = null; try { gc = generate({ root: packsCopy('copy', () => {}), pack: guide }); } catch (e) { ok('generator runs on a copied packs root', false, e.message); }
  if (gc) ok('--root / --pack: an unchanged copy of data/packs, pack ' + guide + ', compiles the same modules', gc.module === g.module && gc.gateModule === g.gateModule && gc.proposedModule === g.proposedModule);
  /* An idle class pack (one no guide pack uses: checked and cited, compiled into no module). 0.6 P4's Gladiator, then 0.7
     P3's Spiritmaster were the idle pack here; 0.7 P4 gave the Spiritmaster its guide pack, so data/packs has none left.
     The idle checks run on a copy where the Spiritmaster is idle again: its guide pack removed, its class hidden. */
  const SM = 'aion2/classes/spiritmaster', editJson = (root, f, fn) => { const p = join(root, SM, f), d = JSON.parse(readFileSync(p, 'utf8')); fn(d); writeFileSync(p, JSON.stringify(d)); };
  const makeIdle = r => { rmSync(join(r, 'aion2/asmodian/spiritmaster'), { recursive: true, force: true }); editJson(r, 'class.json', d => { d.records[0].release = 'hidden'; }); };
  ok('data/packs has no idle class pack (every class pack has its guide pack since 0.7 P4)', !(g.idle || []).length, (g.idle || []).map(x => x.pack));
  let gi = null; try { gi = generate({ root: packsCopy('idle', makeIdle) }); } catch (e) { ok('generator runs on a copy with an idle Spiritmaster', false, e.message); }
  const sm = gi && (gi.idle || []).find(x => x.pack === SM), smColl = f => sm ? sm.all.filter(x => x.file.endsWith('/' + f)).length : 0;
  ok('idle class pack aion2/classes/spiritmaster (copy): 1 class, 22 skills, 13 stigmas, 537 board nodes, checked by the generator, modules unchanged', !!sm && smColl('class.json') === 1 && smColl('skills.json') === 22
    && smColl('stigmas.json') === 13 && smColl('board-nodes.json') === 537 && gi.report.checks.some(x => x.check.startsWith('aion2/classes/spiritmaster: board:triniel: 117 nodes')) && !gi.failed.length
    && gi.module === g.module && gi.gateModule === g.gateModule, sm && [smColl('skills.json'), smColl('board-nodes.json'), gi.failed.slice(0, 5)]);
  /* 0.7 P4: the Spiritmaster class pack compiles through its guide pack (aion2/asmodian/spiritmaster), and the Assassin
     bundle still carries none of it */
  const smG = others[otherIds.indexOf('aion2/asmodian/spiritmaster')], smGColl = f => smG ? smG.all.filter(x => x.file.startsWith('data/packs/aion2/classes/spiritmaster/') && x.file.endsWith('/' + f)).length : 0;
  ok('the Spiritmaster class pack is no longer idle; its guide pack compiles 1 class, 22 skills, 13 stigmas, 537 board nodes', !(g.idle || []).some(x => x.pack === SM) && !!smG
    && smGColl('class.json') === 1 && smGColl('skills.json') === 22 && smGColl('stigmas.json') === 13 && smGColl('board-nodes.json') === 537, [smGColl('skills.json'), smGColl('board-nodes.json')]);
  const smWords = /spiritmaster|Spirit Communion|Kaisinel's Power|Cursed Cloud|560136/i, smIn = [g.module, g.gateModule, g.proposedModule, g.placeModule].filter(m => smWords.test(m)).map(m => m.match(smWords)[0]);
  ok('the Assassin bundle carries no Spiritmaster record (generated, gate, proposed and place modules)', !smIn.length, smIn);
  /* 0.7 P2: the Gladiator class pack is no longer idle; it compiles through its guide pack (aion2/asmodian/gladiator), and
     the Assassin bundle still carries none of it */
  const glG = others[otherIds.indexOf('aion2/asmodian/gladiator')], glColl = f => glG ? glG.all.filter(x => x.file.startsWith('data/packs/aion2/classes/gladiator/') && x.file.endsWith('/' + f)).length : 0;
  ok('the Gladiator class pack is no longer idle; its guide pack compiles 1 class, 22 skills, 13 stigmas, 537 board nodes', !(g.idle || []).some(x => x.pack === 'aion2/classes/gladiator') && !!glG
    && glColl('class.json') === 1 && glColl('skills.json') === 22 && glColl('stigmas.json') === 13 && glColl('board-nodes.json') === 537, [glColl('skills.json'), glColl('board-nodes.json')]);
  const glWords = /gladiator|Keen Strike|Lunge Stance|Zikel's Blessing|110113/i, glIn = [g.module, g.gateModule, g.proposedModule, g.placeModule].filter(m => glWords.test(m)).map(m => m.match(glWords)[0]);
  ok('the Assassin bundle carries no Gladiator record (generated, gate, proposed and place modules)', !glIn.length, glIn);
  /* 0.6 P22 added the Ranger class pack idle; 0.6 P5 gave it its guide pack (aion2/asmodian/ranger), so it is no longer idle
     and compiles through that guide's own chain. The leak check below still holds: the Assassin bundle carries none of it
     (quest text names NPC Rangers, so it matches record ids and skill names). */
  const rgG = others[otherIds.indexOf('aion2/asmodian/ranger')], rgColl = f => rgG ? rgG.all.filter(x => x.file.startsWith('data/packs/aion2/classes/ranger/') && x.file.endsWith('/' + f)).length : 0;
  ok('the Ranger class pack is no longer idle; its guide pack compiles 1 class, 22 skills, 13 stigmas, 537 board nodes', !(g.idle || []).some(x => x.pack === 'aion2/classes/ranger') && !!rgG
    && rgColl('class.json') === 1 && rgColl('skills.json') === 22 && rgColl('stigmas.json') === 13 && rgColl('board-nodes.json') === 537, [rgColl('skills.json'), rgColl('board-nodes.json')]);
  const rgWords = /(class|skill|stigma|spec|node|build):ranger\b|Tempest Shot|Hunter's Soul|Vaizel's Authority|Bow of Blessing/i, rgIn = [g.module, g.gateModule, g.proposedModule, g.placeModule].filter(m => rgWords.test(m)).map(m => m.match(rgWords)[0]);
  ok('the Assassin bundle carries no Ranger record (generated, gate, proposed and place modules)', !rgIn.length, rgIn);
  const idleFails = (label, mutate, re) => { let g1 = null; try { g1 = generate({ root: packsCopy(label, r => { makeIdle(r); mutate(r); }) }); } catch (e) { ok('generator runs: ' + label, false, e.message); return; }
    ok('generator rejects: ' + label, g1.failed.some(x => re.test(x.check)), g1.failed.map(x => x.check).slice(0, 5)); };
  idleFails('idle-node-cost', r => editJson(r, 'board-nodes.json', d => { d.records.find(n => n.board === 'board:zikel' && n.type === 'stat').cost += 1; }), /spiritmaster: board:zikel: .*points \(134\)/);
  idleFails('idle-node-skill', r => editJson(r, 'board-nodes.json', d => { d.records.find(n => n.type === 'skill').skill = 'skill:spiritmaster:bogus'; }), /skill node names its skill/);
  idleFails('idle-released', r => editJson(r, 'class.json', d => { d.records[0].release = 'released'; }), /spiritmaster: one class record, hidden/);
  idleFails('idle-spec-level', r => editJson(r, 'stigmas.json', d => { d.records[0].specialtyChoices[0].skillLv = 4; }), /stigma:spiritmaster:.*specialty levels \[5,10,15,20\]/);
  packFails('an idle class file that fails its schema', r => { makeIdle(r); editJson(r, 'skills.json', d => { delete d.records[0].levelGate; }); }, /schema validation failed:\n  .*aion2\/classes\/spiritmaster\/skills\.json: .*levelGate/);
  const c = g.constants;
  ok('compiled: story turn-in zones: Aldelle Village where the turn-in is in the village, else Ishalgen', c.QUEST_LOC['A Village in the Fog'].turninZone === 'Aldelle Village'
    && c.QUEST_LOC['Brigade Prison Compound Infiltration Operation'].turninZone === 'Aldelle Village' && c.QUEST_LOC['Isolated Lake'].turninZone === 'Ishalgen',
    ['A Village in the Fog', 'Brigade Prison Compound Infiltration Operation', 'Isolated Lake'].map(n => (c.QUEST_LOC[n] || {}).turninZone));
  ok('compiled: 87 story quests (Ishalgen is the starting map, not a quest; E10 added Daeva Trapped in a Nightmare), 58 regional quests, 15 strongholds, 60 Sealed Dungeons', c.QUESTS.length === 87 && c.RQ.length === 58 && c.SH_DATA.length === 15 && Object.keys(c.HIDEOUT_AREA).length === 60,
    [c.QUESTS.length, c.RQ.length, c.SH_DATA.length, Object.keys(c.HIDEOUT_AREA).length]);
}
/* rules and decisions ledger: header, ids, homes and one row per DECISIONS row (docs/kaizen/LEDGER.md) */
{ const problems = checkLedger(); ok(`rules and decisions ledger checks (${problems.length} problems)`, !problems.length, problems);
  /* ...and it rejects broken copies: a dropped decision row, a doubled one, a bad status, a dead anchor, an empty plain,
     an owner outside the list, an unknown enforced_by or one repeating the owner, an id in plain, a "Retired:" prefix in plain, a decision not Isaac's,
     an Owners table in LEDGER.md that differs from OWNERS */
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
  { const p = checkLedger(ROOT, { ledgerMd: lmd.replace('| Gomez | Team Audit |', '| Badger | Team Audit |') }); ok('ledger check rejects: an Owners table that differs from OWNERS', p.some(x => /names "Badger"/.test(x)) && p.some(x => /missing "Gomez"/.test(x)), p.slice(0, 3)); } }
console.log(`${n - fail} ok, ${fail} failed (${Date.now() - t0} ms)`);
console.log(fail ? `SCHEMA CHECKS FAILED (${fail})` : 'SCHEMA CHECKS PASSED');
process.exit(fail ? 1 : 0);
