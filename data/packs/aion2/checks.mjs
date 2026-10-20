/* AION 2 pack checks (0.4 P6a): the cross-record checks that know this game, declared by data/packs/aion2/pack.json
   (`checks`) and called by tools/gen/gen.mjs after its engine checks as checks(ctx, check). ctx: the loaded bundle and the
   compiled tables (gen.mjs, "pack-declared checks"); check(name, ok, detail) is the generator's. Names and order are the
   ones these checks had inside gen.mjs (0.4 P6a moved them unchanged). No imports: a copied packs root runs as is. */
export function checks(ctx, check) {
  const { zones, chain, rqs, skills, stigmas, nodeById, boards, sds, shs, rules, builds, build, milestones, steps, asc, all, RQ, STORY_END, SH_DATA, atomsOf, byNum, refCheck } = ctx;
  const sk = id => { if (!ctx.skById[id]) throw new Error('unknown skill ' + id); return ctx.skById[id]; };

  /* ---------------------------------------------------------------- story */
  for (const s of chain) if (s.steps.length) check('story steps end with a turn-in: ' + s.name, /^Turn in/.test(s.steps[s.steps.length - 1].text));
  /* 0.3 E10: the data ends at "Daeva Trapped in a Nightmare"; the game's next story quest unlocks past the Lv 45 cap */
  check('story end names the next story quest past the cap', !!STORY_END.next && STORY_END.nextLv > 45, [STORY_END.next, STORY_END.nextLv]);
  /* 0.6 P6 (#265, owner note #254 11): a step text is the source's title + " — " + its objective line, and the objective
     line must name its object, not point back at the title with a bare pronoun ("Search Munihelle Forest — investigate it
     with Maard"; in game: "Investigate Munihelle Forest with Maard"). PRONOUN_OK lists real uses by "<record id> #<i>". */
  { const PRONOUN = /\b(it|them|there)\b/i, PRONOUN_OK = new Set([]);
    for (const r of [...chain, ...rqs, ...shs, ...asc]) for (const x of r.steps || []) {
      const obj = x.text.includes(' — ') ? x.text.slice(x.text.indexOf(' — ') + 3).replace(/\s*\(Kibelisk: [^)]+\)/g, '') : '';
      check(`${r.id} #${x.i}: objective line names its object, not "it" / "them" / "there"`, PRONOUN_OK.has(`${r.id} #${x.i}`) || !PRONOUN.test(obj), x.text);
    } }

  /* ---------------------------------------------------------------- regional quests (in RQ order) */
  for (const q of rqs.slice().sort(byNum('order'))) {
    check('regional: at most one story gate: ' + q.name, atomsOf(q.requires).filter(a => a.story).length <= 1);
    check('regional: zone = giver zone: ' + q.name, q.zone === q.giver.zone);
    check('regional: id = key = rq:<gameId>: ' + q.name, q.id === 'rq:' + q.gameId && q.key === q.id);
  }
  check('58 regional quests', RQ.length === 58, RQ.length);
  check('every regional quest has unlocksAt and rec', RQ.every(x => x.unlocksAt && x.rec));
  /* a camp (giver place, or a Kibelisk within 100 m of the giver) belongs to one zone; a nearest Kibelisk further away
     may lie across a zone border (Pain Unending: Basfelt Waterfall 309 m) */
  { const cz = {}; for (const q of rqs) for (const a of [q.giver.meters != null && q.giver.meters <= 100 ? q.giver.kibelisk : null, q.giver.place]) if (a) (cz[a] = cz[a] || new Set()).add(q.zone);
    check('same giver camp/Kibelisk -> one zone', Object.values(cz).every(v => v.size === 1), Object.entries(cz).filter(([, v]) => v.size > 1).map(([k, v]) => [k, [...v]])); }
  check('Nine Wonders of Altgard: 2nd Leg is in Battlescar Mound (E4)', (RQ.find(x => x.name === 'Nine Wonders of Altgard: 2nd Leg') || {}).zone === 'Battlescar Mound');

  /* ---------------------------------------------------------------- strongholds, Sealed Dungeons, zones */
  check('15 strongholds', SH_DATA.length === 15);
  check('every stronghold has zone, range and Kibelisk', SH_DATA.every(x => x.zone && x.lo && x.hi && x.kib));
  for (const s of shs) check('stronghold pays no stones/crystals: ' + s.name, !s.rewards.wisdom && !s.rewards.crystal);
  const mapSlug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  for (const d of sds) check('Sealed Dungeon key = <band prefix>:<slug>: ' + d.name, d.key === `${d.band === 10 ? 'g10h' : 'sd'}:${mapSlug(d.name)}` && d.id === 'sd:' + mapSlug(d.name));
  check('60 Sealed Dungeons', sds.length === 60, sds.length);
  const sdRule = rules['rule:sd-first-clear-asmodian'];
  check('Sealed Dungeon reward is 2 Wisdom Stones + 2 crystals in every sampled band', !!sdRule && sdRule.value.evidence.every(b => b.wisdom === 2 && b.crystal === 2));
  for (const z of Object.values(zones)) for (const c of [...(z.camps || []), ...(z.kibelisks || [])]) {
    const other = Object.values(zones).find(o => o !== z && [...(o.camps || []), ...(o.kibelisks || [])].includes(c));
    check(`camp/Kibelisk ${c} resolves to one zone`, !other, [z.id, other && other.id]);
  }

  /* ---------------------------------------------------------------- Kibelisks (0.5 P8) */
  /* the registry (kibelisks.json): one record per name; every Kibelisk name a story / regional / Sealed Dungeon / stronghold
     record uses (location fields, objective fields, "(Kibelisk: X)" markers) and every zones[].kibelisks name resolves to it */
  { const kibs = ctx.kibs, byName = {}, kibById = Object.fromEntries(kibs.map(k => [k.id, k]));
    for (const k of kibs) { check('Kibelisk name unique in the registry: ' + k.name, !(k.name in byName), [byName[k.name], k.id]); byName[k.name] = k.id; }
    const MARK = /\(Kibelisk: ([^)]+)\)/g, uses = new Map(), use = (n, id) => { if (!uses.has(n)) uses.set(n, new Set()); uses.get(n).add(id); };
    for (const r of [...chain, ...rqs, ...sds, ...shs]) {
      for (const l of [r.giver, r.turnin, r.entrance, r.location]) if (l && l.kibelisk) use(l.kibelisk, r.id);
      for (const x of r.steps || []) { if (x.kibelisk) use(x.kibelisk, r.id); if (x.at) use(x.at.kibelisk, r.id); for (const m of x.text.matchAll(MARK)) use(m[1], r.id); }
    }
    for (const [n, ids] of uses) check(`Kibelisk "${n}" resolves to a registry record`, n in byName, [...ids].slice(0, 5));
    /* 71 = P8's 69 + two that only story objective points name (0.5 P9): Alert Observation Post (new to the registry) and
       Silent Hill Coastal Cliff (a listed registry name no record cited before) */
    check('Kibelisk names in story, regional, Sealed Dungeon and stronghold records: 71, all in the registry', uses.size === 71 && [...uses.keys()].every(n => n in byName), uses.size);
    for (const z of Object.values(zones)) for (const n of z.kibelisks || []) check(`${z.id}: Kibelisk ${n} is a registry record filed in this zone`, n in byName && kibById[byName[n]].zone === z.id, n in byName ? kibById[byName[n]].zone : 'not in the registry');
    for (const k of kibs) if (k.zone) check(`${k.id}: listed in ${k.zone}'s kibelisks`, !!zones[k.zone] && (zones[k.zone].kibelisks || []).includes(k.name));
    /* a registry zone agrees with the record points that name it: the strict majority zone of the points within 100 m (a
       placeholder zone doesn't vote); a Kibelisk left without a zone while such a majority exists says why (conflicts) */
    for (const k of kibs) {
      const near = [...chain, ...rqs, ...sds, ...shs].flatMap(r => [r.giver, r.turnin, r.entrance, r.location])
        .filter(l => l && l.kibelisk === k.name && l.meters != null && l.meters <= 100 && zones[l.zone].status !== 'owner-check');
      const n = {}; for (const l of near) n[l.zone] = (n[l.zone] || 0) + 1;
      const maj = Object.keys(n).find(z => n[z] * 2 > near.length);
      if (maj) check(`${k.id}: zone ${k.zone} is the majority zone ${maj} of its points within 100 m, or empty with a conflicts note`, k.zone === maj || (k.zone === null && (k.conflicts || []).length > 0), n);
    }
    /* binds facts: on story objectives only, naming a registry id; a scripted bind's own text tells the player to bind */
    for (const r of [...rqs, ...shs, ...asc]) for (const x of r.steps || []) check(`${r.id} #${x.i}: binds only on story objectives`, !x.binds);
    for (const s of chain) for (const x of s.steps.filter(x => x.binds)) {
      check(`${s.id} #${x.i}: binds ${x.binds.kibelisk} is a registry id`, x.binds.kibelisk in kibById);
      if (x.binds.basis === 'step-text') check(`${s.id} #${x.i}: a step-text bind says "bind"`, /\bbind\b/i.test(x.text), x.text);
    }
    /* objective points (0.5 P9): on story objectives only; the text's "(Kibelisk: X)" marker, when it has one, is the
       point's nearest Kibelisk; the point is on its Kibelisk's map where the registry records one */
    for (const r of [...rqs, ...shs, ...asc]) for (const x of r.steps || []) check(`${r.id} #${x.i}: at only on story objectives`, !x.at);
    for (const s of chain) for (const x of s.steps.filter(x => x.at)) {
      const marks = [...x.text.matchAll(MARK)].map(m => m[1]), K = kibById[byName[x.at.kibelisk]];
      check(`${s.id} #${x.i}: (Kibelisk: X) marker = at.kibelisk`, marks.every(m => m === x.at.kibelisk), [marks, x.at.kibelisk]);
      check(`${s.id} #${x.i}: at.map is its Kibelisk's map`, !K || K.map === null || K.map === x.at.map, [x.at.map, K && K.map]);
    }
    /* the travel rules (design §8): the bind radius lies inside the nudge radius */
    const rv = id => rules[id] ? rules[id].value : null;
    /* binds that happen at an objective (0.6 P12; owner 2026-10-17, #254 note 6): the app drops a step's "(Kibelisk: X)"
       when its point is within the bind radius of X, and hides a "Bind with the X Kibelisk" step when the next step's point
       is (src/packs/aion2/travel.js autoBindsOf). The list for the owner, one check per trimmed step (gen-report.json):
       quest, step, Kibelisk, metres; none over the radius */
    { const R = rv('rule:kibelisk-bind-radius'), ONLY = /^Bind with the (.+) Kibelisk(?: \(Kibelisk: ([^)]+)\))?$/, MK = /\(Kibelisk: ([^)]+)\)/;
      const trims = [];
      for (const s of chain) s.steps.forEach((x, j) => { const b = x.text.match(ONLY), m = x.text.match(MK), p = x.at || (b ? (s.steps[j + 1] || {}).at : null);
        if (b && (!b[2] || b[2] === b[1]) && p && p.kibelisk === b[1] && p.meters != null && p.meters <= R) trims.push({ s, x, kib: b[1], m: p.meters, what: 'bind-only step hidden' });
        else if (!b && m && x.at && x.at.kibelisk === m[1] && x.at.meters != null && x.at.meters <= R) trims.push({ s, x, kib: m[1], m: x.at.meters, what: '"(Kibelisk: X)" dropped' }); });
      for (const t of trims) check(`auto-bind (0.6 P12): ${t.s.id} #${t.x.i} ${t.s.name}: ${t.what}, ${t.kib} at ${t.m} m (≤ ${R} m)`, t.m <= R, t.m);
      check(`auto-bind (0.6 P12): ${trims.length} steps trimmed, ${trims.filter(t => t.what !== '"(Kibelisk: X)" dropped').length} hidden; none over ${R} m`, R !== null && trims.every(t => t.m <= R), trims.length); }
    check('rule:kibelisk-bind-radius < rule:kibelisk-nudge-radius', rv('rule:kibelisk-bind-radius') !== null && rv('rule:kibelisk-nudge-radius') !== null
      && rv('rule:kibelisk-bind-radius') < rv('rule:kibelisk-nudge-radius'), [rv('rule:kibelisk-bind-radius'), rv('rule:kibelisk-nudge-radius')]);
    check('rule:teleport-gain is set', rv('rule:teleport-gain') !== null);
    /* the place table: one entry per story / regional / Sealed Dungeon / stronghold node, every anchor a registry id */
    const placed = Object.entries(ctx.GATE_GRAPH.nodes).filter(([, x]) => ['story', 'rq', 'sd', 'sh'].includes(x.kind)).map(([id]) => id);
    check('NODE_PLACE: one entry per story, regional, Sealed Dungeon and stronghold node', placed.length === Object.keys(ctx.NODE_PLACE).length && placed.every(id => id in ctx.NODE_PLACE), [placed.length, Object.keys(ctx.NODE_PLACE).length]);
    for (const [id, p] of Object.entries(ctx.NODE_PLACE)) for (const [side, pt] of Object.entries(p.pts).flatMap(([k, v]) => k === 'steps' ? v.map(x => ['objective ' + x.i, x]) : [[k, v]]))
      check(`NODE_PLACE ${id} ${side}: anchor is null or a registry id`, pt.anchor === null || pt.anchor in kibById, pt.anchor); }

  /* ---------------------------------------------------------------- the guide build */
  const spSlots = rules['rule:specialty-slots'] ? rules['rule:specialty-slots'].value : { slots: [] };
  /* specialties (owner F4, Metabot): every active skill has the 5 choices at effective skill level 8 / 8 / 8 / 12 / 16 */
  for (const s of skills) if (s.type === 'active') check(`specialty choices 8/8/8/12/16: ${s.name}`, JSON.stringify((s.specialtyChoices || []).map(c => c.skillLv)) === '[8,8,8,12,16]', (s.specialtyChoices || []).map(c => c.skillLv));
    else check(`passive skill has no specialty choices: ${s.name}`, !s.specialtyChoices);
  check('specialty slots at effective level 8 / 12 / 20', JSON.stringify(spSlots.slots) === '[8,12,20]' && spSlots.levelBasis === 'effective');
  for (const [sid, picks] of Object.entries(build.specialtyPicks)) for (const p of picks) check(`specialty pick ${p} is a choice of ${sid}`, (sk(sid).specialtyChoices || []).some(c => c.id === p));
  check('specialty picks: at most 3 slots', Object.values(build.specialtyPicks).every(p => p.length <= spSlots.slots.length));
  /* one choice never fills two slots */
  for (const [sid, picks] of Object.entries(build.specialtyPicks)) check(`specialty picks of ${sid} are distinct`, new Set(picks).size === picks.length, picks);
  /* a pick beyond slot 1 needs an entry in specialtyEvidence for that slot, its sources cited by the build for specialtyPicks:
     '2+ sources' witnessed by two or more publishers (hosts) (owner on #75; research #77 at 8dd047d), or a labelled pick
     (disputed / contested / inferred) with a note naming the alternative (0.8.1 F2, owner note 5: every slot 2 gets a
     pick, research 2026-10-specialty-slot2.md); no stale entries */
  const spEv = build.specialtyEvidence || {}, spSrc = new Set((build.sources || []).filter(r => r.url && (r.fields || []).includes('specialtyPicks')).map(r => r.url));
  const SP_LABELS = ['disputed', 'contested', 'inferred'];
  for (const [sid, picks] of Object.entries(build.specialtyPicks)) picks.forEach((p, i) => { if (!i) return; const ev = spEv[p];
    check(`specialty pick ${p} (slot ${i + 1}) has 2+ source evidence or a labelled reason`, ev && ev.slot === i + 1 && ev.sources.length > 0 && ev.sources.every(u => spSrc.has(u))
      && (ev.label === '2+ sources' ? new Set(ev.sources.map(u => new URL(u).hostname.replace(/^www\./, ''))).size >= 2 : SP_LABELS.includes(ev.label) && !!ev.note),
      ev || 'no specialtyEvidence entry'); });
  for (const p of Object.keys(spEv)) check(`specialtyEvidence ${p} backs a pick in its slot`, Object.values(build.specialtyPicks).some(ps => ps[spEv[p].slot - 1] === p));
  /* game rules the build tables use (0.4 P2a): cost bands [{ from, to, cost }] run without a gap over the levels they
     price; node costs by node type are numbers */
  const bands = (id, lo, hi) => { const v = rules[id] ? rules[id].value : null;
    check(`${id}: bands run ${lo}–${hi} without a gap`, !!v && v.length > 0 && v[0].from === lo && v[v.length - 1].to === hi && v.every((b, i) => b.from <= b.to && (!i || b.from === v[i - 1].to + 1)), v); };
  bands('rule:skill-point-cost', 2, rules['rule:skill-level-gate'].value.maxFromPoints);
  bands('rule:stigma-shard-cost', 1, 20);
  const nc = rules['rule:node-costs'] ? rules['rule:node-costs'].value : {}, nodeCosts = { passive: nc.passive, active: nc.active, corner: nc.corner };
  check('rule:node-costs: passive / active / corner are numbers', Object.values(nodeCosts).every(Number.isInteger), nodeCosts);
  check('exactly one guide build, at most two community builds', builds.filter(b => b.origin === 'guide').length === 1 && builds.filter(b => b.origin === 'community').length <= 2);
  for (const e of build.boardPlan) if (e.anyNode) check('board plan any-of nodes on one board: ' + e.key, new Set(e.anyNode.map(n => nodeById[n].board)).size === 1);

  /* ---------------------------------------------------------------- Ascension */
  for (const a of asc) {
    if (a.guideStep) check(`ascension ${a.id}: guideStep ${a.guideStep} is a step`, steps.some(s => s.key === a.guideStep));
    for (const s of steps.filter(s => s.ascensionQuest === a.id)) check(`ascension ${a.id}: guideStep is ${s.key} (its ascensionQuest)`, a.guideStep === s.key, a.guideStep);
  }

  /* ---------------------------------------------------------------- Daevanion */
  /* one window gate, defined once on unlock:daevanion ("Urgent Pursuit" turned in, owner screen); every board inherits
     it (live since 0.3 E5; plan nodes inherit their board's), so no plan node repeats the story atom */
  { const ud = ctx.unlocks.find(u => u.id === 'unlock:daevanion');
    check('unlock:daevanion opens with "Urgent Pursuit" turned in', !!ud && atomsOf(ud.at).some(a => a.story === 'sq:2102065' && a.is === 'turnedIn'));
    for (const b of boards) check(`${b.id}: inherits the Daevanion window gate (done unlock:daevanion)`, !!b.requires && atomsOf(b.requires).some(a => a.done === 'unlock:daevanion'));
    for (const bl of builds) for (const e of bl.boardPlan) check(`${bl.id} boardPlan ${e.node || e.key}: no own copy of the window gate`,
      ![e.requires, e.proposed && e.proposed.requires].some(g => g && atomsOf(g).some(a => a.story === 'sq:2102065'))); }
  for (const e of build.boardPlan) check('board plan milestone resolves: ' + (e.node || e.key), milestones.some(m => m.id === e.milestone));
  for (const s of build.skillOrder) refCheck(build.id, s.skill);

  /* ---------------------------------------------------------------- class content */
  /* choice n: dense from 1, never renumbered (positions are save indices) */
  for (const { r } of all) if (r.specialtyChoices) check(`${r.id}: choice n = position + 1`, r.specialtyChoices.every((c, i) => c.n === i + 1));
  /* #358: Metabot prints some percents unfilled ("Absorbs 500, 500% HP" for the game's 5%); the game text goes in instead */
  for (const { r } of all) for (const c of r.specialtyChoices || []) check(`${c.id}: no unfilled "N, N%" specialty text`, !/\d+, \d+%/.test(c.text), c.text);
  /* shared steps carry no class content outside build tokens: no skill or stigma name of this class */
  const classWords = [...stigmas.map(s => s.name)];
  for (const s of steps) for (const w of classWords) check(`shared step ${s.id} names no stigma outside a build token`, !(s.text + (s.loc || '')).includes(w));
  /* the shared guide (0.6 P3): a guide record (milestone, step, tip, claim, confidence line) from a pack that is neither a
     guide nor a class pack (aion2/asmodian/guide) holds for every class. Outside [[…]] tokens no string of it names the
     chain's class (any case: also the class's page URLs), a skill or stigma (name or id) or a board node (id or save key);
     and it points at no record of a guide or class pack (milestone, claims, appliesTo, [[tip:…]] links, done atoms), so
     another class's chain compiles it unchanged. A record that fails stays in the class's guide pack. */
  { const kindOf = Object.fromEntries(ctx.packs.map(m => [m.id, m.kind])), isClass = x => ['guide', 'class'].includes(kindOf[x.pack]);
    const GUIDE = ['milestones', 'steps', 'tips', 'claims', 'confidence'], shared = all.filter(x => GUIDE.includes(x.coll) && !isClass(x));
    const classIds = new Set(all.filter(isClass).map(x => x.r.id)), classTips = new Set(all.filter(x => x.coll === 'tips' && isClass(x)).map(x => x.r.key));
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), strs = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strs) : v && typeof v === 'object' ? Object.values(v).flatMap(strs) : [];
    const words = [...skills, ...stigmas].map(s => ({ s, re: new RegExp('\\b' + esc(s.name) + '\\b') })), nodeRefs = Object.values(nodeById).flatMap(n => [n.id, n.key]);
    const clsRe = ctx.cls ? new RegExp('\\b' + esc(ctx.cls.name) + '\\b', 'i') : null;
    for (const { r, file } of shared) {
      const hits = new Set();
      for (const t of strs(r).map(s => s.replace(/\[\[[^\]]*\]\]/g, ''))) {
        if (clsRe && clsRe.test(t)) hits.add(ctx.cls.name);
        for (const { s, re } of words) { if (re.test(t)) hits.add(s.name); if (t.includes(s.id)) hits.add(s.id); }
        for (const k of nodeRefs) if (t.includes(k)) hits.add(k);
      }
      check(`shared guide ${r.id} (${file}): names no class, skill, stigma or board node`, !hits.size, [...hits]);
      const gates = [r.requires, ...(r.completesWith || []), ...(r.proposed ? [r.proposed.requires, ...(r.proposed.completesWith || [])] : [])].filter(g => g && typeof g === 'object');
      const refs = [r.milestone, ...(r.claims || []), ...(r.appliesTo || []), ...gates.flatMap(atomsOf).map(a => a.done)].filter(x => x && classIds.has(x));
      const tipRefs = strs(r).flatMap(t => [...t.matchAll(/\[\[tip:([a-z0-9-]+)/g)].map(m => m[1])).filter(k => classTips.has(k));
      check(`shared guide ${r.id} (${file}): points at no guide or class record`, !refs.length && !tipRefs.length, [...refs, ...tipRefs.map(k => 'tip:' + k)]);
    } }
  /* zone adjacency symmetric */
  for (const z of Object.values(zones)) for (const n of z.neighbours || []) check(`zone adjacency symmetric: ${z.id} - ${n.zone}`, (zones[n.zone] && (zones[n.zone].neighbours || []).some(x => x.zone === z.id)));

  /* ---------------------------------------------------------------- GATE_GRAPH */
  for (const q of rqs.slice().sort(byNum('order'))) {
    const lv = atomsOf(q.requires).filter(a => a.level !== undefined).map(a => a.level);
    check('GATE_GRAPH: regional level atom = unlocksAt: ' + q.id, lv.length === 1 && lv[0] === q.unlocksAt, lv);
  }
}
