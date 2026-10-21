/* 0.6 P21: the sync client (src/core/sync-client.js) against the fake host in memory (tests/fixtures/fake-host.mjs) and
   the HTTP adapter (src/shell/sync-host-http.js) over a fake fetch: the code, the keys, the envelope, rounds between
   devices that converge, conflicts, join, offline and the privacy canary (docs/design/sync.md §7). No real host. */
import { createDecipheriv, hkdfSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { fakeHost, fakeFetch } from '../fixtures/fake-host.mjs';
import { genSave } from './sync.test.mjs';

/* the HTTP adapter as an ES module (src/ has no package.json "type"; it imports nothing) */
const { httpSyncHost } = await import('data:text/javascript;base64,' + readFileSync(new URL('../../src/shell/sync-host-http.js', import.meta.url)).toString('base64'));

const { toStored, TEST_SLOT } = createRequire(import.meta.url)('../support/save.js');
const clone = o => JSON.parse(JSON.stringify(o));
const ENV = { crypto: globalThis.crypto, CompressionStream: globalThis.CompressionStream, DecompressionStream: globalThis.DecompressionStream };
const PLAIN_ENV = { crypto: globalThis.crypto };
/* a fixed code: bytes 0x00..0x0f */
const CODE_BYTES = Uint8Array.from({ length: 16 }, (_, i) => i);
const latin1 = b => Buffer.from(b).toString('latin1');
/* canonical JSON, to compare payloads */
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(y => [y, x[y]])) : x);
/* a save with progress, stamped at sec */
const saveWith = (M, flat, sec) => { const s = toStored({ checks: {}, level: 5, hide: false, open: {}, quest: '', ...flat }); M.stampSave(s, sec * 1000); return s; };
/* a fresh browser as the page starts it (Lv 1, first quest, no progress) */
const freshSave = (M, id, nowMs = 0) => { const { state, hadSave } = M.loadState(null, { now: nowMs, newId: () => id }); M.migrate(state, hadSave, () => {}, nowMs); return state; };
/* a device: its save and a round that stores the merge as the page would */
const device = (M, save, keys, host, env = ENV) => {
  const d = { save, stores: 0 };
  d.round = async () => { const r = await M.syncOnce({ save: d.save, keys, host, env, store: m => { d.save = clone(m); d.stores++; } }); d.save = r.save; return r; };
  d.edit = (sec, fn) => { fn(M.char(d.save)); M.stampSave(d.save, sec * 1000); };
  /* a rename as the page does it (renameChar with Date.now(), then the write's stampSave) */
  d.rename = (sec, name) => { d.save = M.renameChar(d.save, d.save.current, name, sec * 1000); M.stampSave(d.save, sec * 1000); };
  return d;
};

export default (test, M) => {
  const keysOf = code => M.syncKeys(ENV, code);

  test('sync code: "DC1-" + 26 data symbols + 1 check symbol in groups; parses back to the same 16 bytes', async () => {
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const code = M.newSyncCode(ENV);
      assert.match(code, /^DC1-[0-9A-HJKMNP-TV-Z]{5}(-[0-9A-HJKMNP-TV-Z]{5}){4}-[0-9A-HJKMNP-TV-Z][0-9A-HJKMNP-TV-Z*~$=U]$/);
      const b = M.parseSyncCode(code); assert.equal(b.length, 16);
      assert.equal(M.parseSyncCode(code.toLowerCase().replace(/-/g, ' ')).join(), b.join(), 'case and spaces ignored');
      seen.add(code);
    }
    assert.equal(seen.size, 100, 'no code repeats');
  });
  test('sync code: a typo (one symbol changed, a symbol dropped, a wrong prefix) is caught before any request; I L O read as 1 1 0', async () => {
    const env = { crypto: { getRandomValues: a => a.set(CODE_BYTES) || a } };
    const code = M.newSyncCode(env);
    assert.equal(M.parseSyncCode(code).join(), CODE_BYTES.join());
    const body = code.replace(/-/g, '');
    let caught = 0;
    for (let i = 3; i < body.length - 1; i++) for (const s of '0123456789ABCDEFGHJKMNPQRSTVWXYZ') {
      if (s === body[i]) continue;
      const t = body.slice(0, i) + s + body.slice(i + 1), b = M.parseSyncCode(t);
      if (b === null) caught++; else assert.notEqual(b.join(), CODE_BYTES.join());
    }
    assert.ok(caught / (26 * 31) > 0.95, `single-symbol typos caught: ${caught} of ${26 * 31}`);
    assert.equal(M.parseSyncCode(body.slice(0, -2) + body.slice(-1)), null);
    assert.equal(M.parseSyncCode('DC2' + body.slice(3)), null);
    assert.equal(M.parseSyncCode(''), null);
    const withO = body.replace(/0/g, 'o').replace(/1/g, 'l');
    assert.equal(M.parseSyncCode(withO).join(), CODE_BYTES.join());
  });
  test('keys: HKDF-SHA-256 (salt "daeva-companion sync v1", info id / auth / enc) matches node:crypto; id and token pinned for a fixed code', async () => {
    const k = await keysOf(CODE_BYTES), salt = 'daeva-companion sync v1';
    const node = info => Buffer.from(hkdfSync('sha256', Buffer.from(CODE_BYTES), salt, info, info === 'id' ? 16 : 32));
    assert.equal(k.id, node('id').toString('base64url'));
    assert.equal(k.token, node('auth').toString('base64url'));
    assert.match(k.id, /^[A-Za-z0-9_-]{22}$/); assert.match(k.token, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(k.id, 'DgN25GtYLXfRdJSxrah9zA');
    assert.equal(k.key.extractable, false, 'the content key is not extractable');
    assert.deepEqual(k.key.algorithm, { name: 'AES-GCM', length: 256 });
  });
  test('envelope: 0x01, flags, IV, AES-256-GCM of the padded payload with AAD "dc-sync|1|<id>"; node:crypto decrypts it with the HKDF "enc" key', async () => {
    const k = await keysOf(CODE_BYTES), save = saveWith(M, { checks: { 'rq:1': true }, level: 12 }, 100);
    const iv = Uint8Array.from({ length: 12 }, (_, i) => 0xa0 + i);
    const box = await M.sealSave(PLAIN_ENV, k, save, { iv });
    assert.equal(box[0], 1); assert.equal(box[1], 0, 'no gzip without CompressionStream');
    assert.deepEqual([...box.slice(2, 14)], [...iv]);
    assert.equal((box.length - 30) % 4096, 0, 'padded to 4 KiB steps');
    const enc = Buffer.from(hkdfSync('sha256', Buffer.from(CODE_BYTES), 'daeva-companion sync v1', 'enc', 32));
    const d = createDecipheriv('aes-256-gcm', enc, iv); d.setAAD(Buffer.from('dc-sync|1|' + k.id)); d.setAuthTag(Buffer.from(box.slice(-16)));
    const plain = Buffer.concat([d.update(Buffer.from(box.slice(14, -16))), d.final()]);
    const n = plain.readUInt32BE(0), json = JSON.parse(plain.subarray(4, 4 + n).toString('utf8'));
    assert.deepEqual(json, M.syncPayload(save));
    assert.ok(plain.subarray(4 + n).every(b => b === 0), 'zero padding');
    assert.equal(plain.length % 4096, 0);
    const gz = await M.sealSave(ENV, k, save);
    assert.equal(gz[1], 1, 'gzip where the runtime has CompressionStream');
    assert.deepEqual((await M.openSave(ENV, k, gz)).payload, M.syncPayload(save));
    assert.deepEqual((await M.openSave(ENV, k, box)).payload, M.syncPayload(save));
  });
  test('envelope: a fresh IV on every upload (100 seals, no repeat); a copy moved to another id, a flipped byte or another version does not open', async () => {
    const k = await keysOf(CODE_BYTES), save = saveWith(M, { checks: { 'rq:1': true } }, 100), ivs = new Set();
    /* uncompressed (the IV doesn't depend on it; keeps the core suite inside its time limit) */
    for (let i = 0; i < 100; i++) ivs.add(latin1((await M.sealSave(PLAIN_ENV, k, save)).slice(2, 14)));
    assert.equal(ivs.size, 100);
    const box = await M.sealSave(ENV, k, save);
    assert.deepEqual(await M.openSave(ENV, { ...k, id: (await keysOf(CODE_BYTES.map(b => b ^ 1))).id }, box), { ok: false, status: 'unreadable' });
    const flip = box.slice(); flip[40] ^= 1;
    assert.deepEqual(await M.openSave(ENV, k, flip), { ok: false, status: 'unreadable' });
    const v2 = box.slice(); v2[0] = 2;
    assert.deepEqual(await M.openSave(ENV, k, v2), { ok: false, status: 'unreadable' });
    assert.deepEqual(await M.openSave(ENV, await keysOf(CODE_BYTES.map(b => b ^ 1)), box), { ok: false, status: 'unreadable' }, 'another code');
  });
  test('payload: identity and progress per slot, tombstones; no view settings, current, backup or local fields', async () => {
    const s = saveWith(M, { checks: { 'rq:1': true }, mode: 'advanced', open: { g22: true }, dvLast: 'dv:x' }, 100);
    s.savedAt = 100000; s.backup = { since: 5 }; s.chars.gone = { id: 'gone', deletedAt: 9000 };
    const p = M.syncPayload(s);
    assert.deepEqual(Object.keys(p).sort(), ['chars', 'format', 'savedAt', 'v']);
    assert.equal(p.format, 'dc-sync');
    const c = p.chars[TEST_SLOT];
    for (const f of ['id', 'pack', 'class', 'name', 'created', 'checks', 'mt']) assert.ok(f in c, f);
    assert.ok(!('dvLast' in c));
    assert.deepEqual(p.chars.gone, { id: 'gone', deletedAt: 9000 });
  });

  test('round trip: two devices converge after concurrent edits (A ticks, B un-ticks later, both edit before syncing)', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true }, level: 10 }, 100), k, host);
    assert.equal((await A.round()).status, 'synced');
    assert.equal(host.objects.size, 1);
    const B = device(M, clone(A.save), k, host);
    assert.equal((await B.round()).status, 'synced');
    A.edit(200, c => { c.checks['rq:2'] = true; c.level = 12; });
    B.edit(210, c => { c.checks['rq:1'] = false; c.checks['rq:3'] = true; });
    await A.round(); await B.round(); await A.round();
    assert.equal(canon(M.syncPayload(A.save)), canon(M.syncPayload(B.save)));
    const c = M.char(A.save);
    assert.deepEqual([c.checks['rq:1'], c.checks['rq:2'], c.checks['rq:3'], c.level], [false, true, true, 12], 'the un-tick, both ticks, the level');
    assert.equal(canon((await M.openSave(ENV, k, host.objects.get(k.id).body)).payload), canon(M.syncPayload(A.save)), 'the cloud copy too');
    const puts = host.calls.filter(x => x.op === 'put').length;
    assert.equal((await A.round()).status, 'synced'); assert.equal((await B.round()).status, 'synced');
    assert.equal(host.calls.filter(x => x.op === 'put').length, puts, 'no upload when nothing changed');
  });
  test('round trip: a rename reaches the other device, the later of two renames wins, and then nothing is uploaded again', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true } }, 100), k, host); await A.round();
    const B = device(M, clone(A.save), k, host); await B.round();
    A.rename(200, 'Ann');
    await A.round(); await B.round();
    assert.deepEqual([M.char(A.save).name, M.char(B.save).name], ['Ann', 'Ann'], 'B takes A\'s rename');
    let puts = host.calls.filter(x => x.op === 'put').length;
    for (let i = 0; i < 3; i++) { assert.equal((await A.round()).status, 'synced'); assert.equal((await B.round()).status, 'synced'); }
    assert.equal(host.calls.filter(x => x.op === 'put').length, puts, 'no upload when nothing changed (the name doesn\'t flip)');
    A.rename(300, 'Early'); B.rename(310, 'Late');
    await A.round(); await B.round(); await A.round();
    assert.deepEqual([M.char(A.save).name, M.char(B.save).name], ['Late', 'Late'], 'the later rename');
    assert.equal(canon(M.syncPayload(A.save)), canon(M.syncPayload(B.save)));
    assert.equal(canon((await M.openSave(ENV, k, host.objects.get(k.id).body)).payload), canon(M.syncPayload(A.save)), 'the cloud copy too');
    puts = host.calls.filter(x => x.op === 'put').length;
    await A.round(); await B.round();
    assert.equal(host.calls.filter(x => x.op === 'put').length, puts, 'converged');
  });
  test('round trip: B\'s clock 1 h behind still wins with a newer edit (Lamport bump); view settings stay per device', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true }, mode: 'advanced' }, 5000), k, host);
    await A.round();
    const B = device(M, { ...clone(A.save), mode: 'basic' }, k, host); await B.round();
    B.edit(5000 - 3600, c => { c.checks['rq:1'] = false; });
    await B.round(); await A.round();
    assert.equal(M.char(A.save).checks['rq:1'], false);
    assert.deepEqual([A.save.mode, B.save.mode], ['advanced', 'basic']);
  });
  test('conflict: B\'s upload loses the race (412), it pulls again, merges and wins on retry; nothing is lost', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES), waits = [];
    const A = device(M, saveWith(M, { checks: { 'rq:1': true } }, 100), k, host); await A.round();
    const B = device(M, clone(A.save), k, host); await B.round();
    A.edit(200, c => { c.checks['rq:2'] = true; });
    B.edit(201, c => { c.checks['rq:3'] = true; });
    let once = true;
    const puts0 = host.calls.filter(x => x.op === 'put').length;
    host.beforePut = async () => { if (once) { once = false; host.beforePut = null; await A.round(); } };
    const r = await M.syncOnce({ save: B.save, keys: k, host, env: ENV, store: m => { B.save = m; }, wait: async ms => { waits.push(ms); } });
    B.save = r.save;
    assert.equal(r.status, 'synced');
    assert.equal(host.calls.filter(x => x.op === 'put').length - puts0, 3, 'A once, B twice (412, then the retry)');
    assert.deepEqual(host.calls.filter(x => x.op === 'put').slice(puts0).map(x => x.cond.etag), ['"e1"', '"e1"', '"e2"'], 'B\'s first try carried the ETag A replaced; its retry the new one');
    assert.equal(waits.length, 1); assert.ok(waits[0] >= 500 && waits[0] < 750, `backoff ${waits[0]}`);
    await A.round();
    assert.equal(canon(M.syncPayload(A.save)), canon(M.syncPayload(B.save)));
    assert.deepEqual(['rq:1', 'rq:2', 'rq:3'].map(q => M.char(A.save).checks[q]), [true, true, true]);
  });
  test('conflict: still losing after 3 retries → "conflict", local save kept; the first upload of two devices races on If-None-Match', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES), waits = [];
    const A = device(M, saveWith(M, { checks: { 'rq:1': true } }, 100), k, host);
    const B = device(M, saveWith(M, { checks: { 'rq:2': true } }, 110), k, host);
    host.beforePut = async () => { host.beforePut = null; await A.round(); };
    assert.equal((await B.round()).status, 'synced', 'B\'s create got 412, it merged A\'s copy and updated');
    assert.deepEqual([M.char(B.save).checks['rq:1'], M.char(B.save).checks['rq:2']], [true, true]);
    const C = device(M, clone(B.save), k, host);
    C.edit(300, c => { c.level = 30; });
    let n = 0;
    host.beforePut = async id => { if (n++ < 4) { const o = host.objects.get(id); host.objects.set(id, { ...o, etag: `"x${n}"` }); } };
    const r = await M.syncOnce({ save: C.save, keys: k, host, env: ENV, wait: async ms => { waits.push(ms); } });
    assert.equal(r.status, 'conflict'); assert.equal(waits.length, 3);
    assert.equal(M.char(r.save).level, 30, 'the local edit is kept for the next trigger');
  });
  test('convergence: 3 devices, random edits and round orders (generated saves), all equal at the end', async () => {
    /* 6 seeds: merge()'s algebra over many generated saves is sync.test.mjs's; this checks the rounds over the wire, and
       the core suite has a 5 s limit */
    for (let seed = 1; seed <= 6; seed++) {
      const host = fakeHost(), k = await keysOf(CODE_BYTES.map(b => b ^ seed));
      /* uncompressed: the merge logic is what varies here; the gzip path runs in the other round-trip tests */
      const ds = [0, 1, 2].map(i => device(M, genSave(M, seed * 10 + i), k, host, PLAIN_ENV));
      let x = seed;
      const r = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let step = 0; step < 8; step++) {
        const d = ds[Math.floor(r() * 3)];
        if (r() < 0.4) d.edit(20 + step, c => { c.checks['rq:' + Math.floor(r() * 4)] = r() < 0.6; });
        if (r() < 0.3) d.rename(20 + step, ['Ann', 'Bo', 'Cy', ''][Math.floor(r() * 4)]);
        if (r() < 0.3) { const other = ds[Math.floor(r() * 3)]; host.beforePut = async () => { host.beforePut = null; await other.round(); }; }
        await d.round();
        host.beforePut = null;
      }
      for (const d of ds) await d.round();
      for (const d of ds) await d.round();
      const puts = host.calls.filter(c => c.op === 'put').length;
      for (const d of ds) assert.equal((await d.round()).status, 'synced');
      assert.equal(host.calls.filter(c => c.op === 'put').length, puts, `seed ${seed}: no upload once converged`);
      const want = canon(M.syncPayload(ds[0].save));
      ds.forEach((d, i) => assert.equal(canon(M.syncPayload(d.save)), want, `seed ${seed} device ${i}`));
      assert.equal(canon((await M.openSave(ENV, k, host.objects.get(k.id).body)).payload), want, `seed ${seed} cloud copy`);
    }
  });

  test('join: a device with no progress adopts the cloud copy (no empty extra slot); one with progress is asked; nothing is uploaded', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true }, level: 20 }, 100), k, host); await A.round();
    const putsBefore = host.calls.filter(x => x.op === 'put').length;
    const fresh = freshSave(M, 'fresh-slot', 5000);
    fresh.mode = 'basic'; fresh.backup = { since: 5000 };
    let stored = null;
    const j = await M.joinSync({ save: fresh, keys: k, host, env: ENV, store: s => { stored = s; } });
    assert.equal(j.status, 'adopt');
    assert.deepEqual(Object.keys(j.save.chars), [TEST_SLOT], 'the fresh slot is dropped, not merged');
    assert.equal(j.save.current, TEST_SLOT); assert.equal(stored, j.save);
    assert.deepEqual([j.save.mode, j.save.backup], ['basic', { since: 5000 }], 'view settings and backup stay this device\'s');
    assert.equal(canon(M.syncPayload(j.save)), canon(M.syncPayload(A.save)));
    const mine = saveWith(M, { checks: { 'rq:9': true } }, 300); mine.chars = { other: { ...M.char(mine), id: 'other' } }; mine.current = 'other';
    const ask = await M.joinSync({ save: mine, keys: k, host, env: ENV, store: () => assert.fail('no store when asking') });
    assert.equal(ask.status, 'ask'); assert.equal(ask.save, mine);
    const both = await M.syncOnce({ save: mine, keys: k, host, env: ENV });
    assert.deepEqual(Object.keys(both.save.chars).sort(), ['other', TEST_SLOT].sort(), '"Keep both" keeps both characters');
    assert.deepEqual(Object.keys(M.adoptRemote(mine, ask.payload).chars), [TEST_SLOT], '"Use the cloud copy"');
    assert.equal(host.calls.filter(x => x.op === 'put').length, putsBefore + 1, 'only "Keep both" uploaded');
  });
  test('wrong code: no copy → "not-found", nothing created; a damaged copy → "unreadable" and no PUT follows; a newer version → "update"', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES), s = saveWith(M, { checks: { 'rq:1': true } }, 100);
    assert.equal((await M.joinSync({ save: s, keys: k, host, env: ENV })).status, 'not-found');
    assert.equal(host.objects.size, 0); assert.ok(host.calls.every(x => x.op === 'get'));
    await M.syncOnce({ save: s, keys: k, host, env: ENV });
    const o = host.objects.get(k.id), bad = o.body.slice(); bad[100] ^= 0x10; host.objects.set(k.id, { ...o, body: bad });
    const n = host.calls.length, before = clone(s);
    for (const f of ['joinSync', 'syncOnce']) {
      const r = await M[f]({ save: s, keys: k, host, env: ENV, store: () => assert.fail('nothing stored') });
      assert.equal(r.status, 'unreadable', f); assert.deepEqual(r.save, before);
    }
    assert.ok(host.calls.slice(n).every(x => x.op === 'get'), 'no PUT after a failed decrypt');
    assert.deepEqual(host.objects.get(k.id).body, bad, 'the cloud copy is never overwritten');
    const newer = { ...clone(s), v: M.SAVE_V + 1 };
    host.objects.set(k.id, { ...o, body: await (async () => { const b = await M.sealSave(ENV, k, newer); return b; })() });
    const u = await M.syncOnce({ save: s, keys: k, host, env: ENV, store: () => assert.fail('nothing stored') });
    assert.equal(u.status, 'update');
  });
  test('offline: the host can\'t be reached → "offline", the save is unchanged, nothing throws; online again → synced', async () => {
    const host = fakeHost(), k = await keysOf(CODE_BYTES), s = saveWith(M, { checks: { 'rq:1': true } }, 100), before = clone(s);
    host.down = true;
    for (const f of ['syncOnce', 'joinSync']) { const r = await M[f]({ save: s, keys: k, host, env: ENV }); assert.equal(r.status, 'offline', f); assert.deepEqual(r.save, before); }
    assert.equal(await M.deleteCloudCopy({ keys: k, host }), false);
    host.down = false;
    assert.equal((await M.syncOnce({ save: s, keys: k, host, env: ENV })).status, 'synced');
    assert.equal(await M.deleteCloudCopy({ keys: k, host }), true);
    assert.equal((await M.joinSync({ save: s, keys: k, host, env: ENV })).status, 'not-found', 'deleted');
  });
  test('privacy canary: no request (URL, headers, body) and no stored byte carries the name, label, class, level, slot id, pack, code or a JSON key', async () => {
    for (const env of [ENV, PLAIN_ENV]) {
      const host = fakeHost(), fetch = fakeFetch(host), http = httpSyncHost('https://sync.test', fetch);
      const codeText = M.newSyncCode({ crypto: { getRandomValues: a => { a.set(CODE_BYTES.map(b => b ^ 0x5a)); return a; } } }), k =await M.syncKeys(ENV, M.parseSyncCode(codeText));
      const s = saveWith(M, { checks: { 'rq:1': true, 'sd:twisted-pit': true }, level: 37 }, 100);
      const c = M.char(s); c.name = 'Zq_Canary'; M.stampSave(s, 101000);
      assert.equal(M.labelOf(c), 'Zq_Canary-assassin-lvl37');
      const A = device(M, s, k, http, env); assert.equal((await A.round()).status, 'synced');
      const B = device(M, freshSave(M, 'b-slot'), k, http, env);
      assert.equal((await M.joinSync({ save: B.save, keys: k, host: http, env })).status, 'adopt');
      A.edit(200, x => { x.level = 38; }); await A.round();
      assert.equal(await M.deleteCloudCopy({ keys: k, host: http }), true);
      /* URL and headers (fixed code, so deterministic): case-insensitive, short words too. Bodies are random ciphertext:
         exact matches of words of 4+ bytes (plaintext would be exact), so a chance hit stays below 1e-5 */
      const BAD = ['Zq_Canary', 'Zq_Canary-assassin-lvl37', 'assassin', 'aion2/', TEST_SLOT, 'b-slot', codeText, codeText.replace(/-/g, ''), '"chars"', '"checks"', 'savedAt', 'format', 'deletedAt', 'dc-sync', 'rq:1', 'twisted', '"level"'];
      assert.ok(fetch.requests.length >= 5);
      for (const { url, init } of fetch.requests) {
        assert.match(url, /^https:\/\/sync\.test\/v1\/s\/[A-Za-z0-9_-]{22}$/);
        assert.equal(init.credentials, 'omit'); assert.equal(init.referrerPolicy, 'no-referrer');
        assert.ok(Object.keys(init.headers).every(h => ['Authorization', 'Content-Type', 'If-Match', 'If-None-Match'].includes(h)), Object.keys(init.headers).join());
        const text = (url + JSON.stringify(init.headers)).toLowerCase();
        for (const w of [...BAD, 'lvl', 'class', 'name', '37']) assert.ok(!text.includes(w.toLowerCase()), `${w} in a ${init.method} request's URL or headers`);
        if (init.body) for (const w of BAD) assert.ok(!latin1(init.body).includes(w), `${w} in a ${init.method} body`);
      }
      const bodies = host.calls.filter(x => x.op === 'put').map(x => x.body);
      assert.ok(bodies.length >= 2);
      for (const b of bodies) for (const w of BAD) assert.ok(!latin1(b).includes(w), `${w} in the stored bytes`);
    }
  });
};
