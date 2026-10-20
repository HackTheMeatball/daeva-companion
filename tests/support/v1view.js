/* The v1-shaped view of the v2 data (data/**) that the older suites read as their oracle (e2, regress): the same fields
   data/rq.json, rq-chains.json, story-40-45.json, claims.json and build.json gave them before 0.2 step 5b, computed from
   the v2 records (not from the page). Synchronous, no dependencies. */
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const walk = d => fs.readdirSync(d).flatMap(n => { const f = path.join(d, n); return fs.statSync(f).isDirectory() ? walk(f) : [f]; });
const DATA_FILES = walk(path.join(ROOT, 'data')).filter(f => f.endsWith('.json') && !/[\\/]data[\\/](schema|research)[\\/]/.test(f));
const docs = DATA_FILES.map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const recs = c => docs.filter(d => d.collection === c).flatMap(d => d.records);
const atoms = c => !c ? [] : c.all ? c.all.flatMap(atoms) : c.any ? c.any.flatMap(atoms) : [c];
const zones = Object.fromEntries(recs('zones').map(z => [z.id, z.name]));
const story = recs('storyQuests'), sq = Object.fromEntries(story.map(s => [s.id, s]));
const rqs = recs('regionalQuests').slice().sort((a, b) => a.order - b.order), rqById = Object.fromEntries(rqs.map(q => [q.id, q]));
const rq = rqs.map(q => { const none = q.requiresBasis === 'unresearched';
  return { name: q.name, id: q.gameId, rec: q.rec, unlocksAt: q.unlocksAt, zone: zones[q.zone], requiresStory: none ? null : [], requiresRegional: none ? null : [] }; });
const chains = rqs.flatMap(q => atoms(q.requires).flatMap(a => a.done ? [{ quest: q.name, after: rqById[a.done].name, kind: 'regional' }]
  : a.story ? [{ quest: q.name, after: sq[a.story].name, kind: 'story', storyId: sq[a.story].gameId, is: a.is }] : []));
const story45 = Object.fromEntries(story.filter(s => s.lv > 40).map(s => [s.name, { lv: s.lv, next: s.next && sq[s.next] && sq[s.next].lv > 40 ? sq[s.next].name : null }]));
const edits = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'claims-v1-edits.json'), 'utf8')).claims;
const claims = recs('claims').map(c => ({ ...c, edits: (edits.find(e => e.id === c.id) || {}).edits || [] }));
const build = recs('builds').find(b => b.origin === 'guide'), skills = Object.fromEntries(recs('skills').map(s => [s.id, s.name]));
/* the URLs the page's Sources card must list. A class pack whose class is hidden (release "hidden": data only, not
   offered, 0.6 P4 Gladiator) ships nothing to the page, so its URLs are hiddenUrls instead (in DATA_SOURCES.md, never
   on the card); the class becomes checked here when its release flips. */
const hiddenDirs = DATA_FILES.filter((f, i) => docs[i].collection === 'classes' && docs[i].records.every(r => r.release === 'hidden')).map(f => path.dirname(f) + path.sep);
const isHidden = f => hiddenDirs.some(d => f.startsWith(d));
/* another released class (0.6 P5: the Ranger) ships its class and guide packs to its own characters' page only: the
   Assassin page these suites open lists none of their own URLs (otherUrls; they are in DATA_SOURCES.md) */
const otherClasses = DATA_FILES.filter((f, i) => docs[i].collection === 'classes' && docs[i].records.some(r => r.release !== 'hidden' && r.class !== 'assassin')).map(f => path.basename(path.dirname(f)));
const otherDirs = otherClasses.flatMap(c => [`classes${path.sep}${c}${path.sep}`, `asmodian${path.sep}${c}${path.sep}`]);
const isOther = f => otherDirs.some(d => f.includes(path.sep + 'packs' + path.sep + 'aion2' + path.sep + d));
const urlsOf = keep => { const urls = new Set(); const w = v => { if (typeof v === 'string') (v.match(/https?:\/\/[^\s)\]'"]+/g) || []).forEach(u => urls.add(u.replace(/[.,;]+$/, ''))); else if (v && typeof v === 'object') Object.values(v).forEach(w); };
  docs.forEach((d, i) => { if (!keep(DATA_FILES[i])) return; if (d.collection !== 'sources') w(d.records); else w(d.pages || []); }); return urls; };
const urls = urlsOf(f => !isHidden(f) && !isOther(f)), shownUrls = new Set(urls), hiddenUrls = new Set([...urlsOf(isHidden)].filter(u => !shownUrls.has(u)));
const otherUrls = new Set([...urlsOf(isOther)].filter(u => !shownUrls.has(u)));
module.exports = { rq, chains, story45, claims, build: { spOrderAfterCore: { order: build.skillOrder.filter(e => !e.core).map(e => skills[e.skill]) } }, dataUrls: urls, hiddenUrls, hiddenDirs, otherUrls, otherClasses };
