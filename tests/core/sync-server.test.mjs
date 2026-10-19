/* 0.7 P5 (#348): the sync server (server/sync/src/worker.js) in Node: its fetch and scheduled handlers over an R2 bucket
   in memory (server/sync/test/memory-r2.mjs), every row of docs/design/sync.md §4 and the §7 server list, then the
   client (syncOnce / joinSync / deleteCloudCopy through the HTTP adapter) against the handler end to end, through a
   fetch that applies the browser's CORS rules. No network, no account, no real host. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { makeWorker, ORIGIN, LIMITS } from '../../server/sync/src/worker.js';
import { memoryR2 } from '../../server/sync/test/memory-r2.mjs';

const { httpSyncHost } = await import('data:text/javascript;base64,' + readFileSync(new URL('../../src/shell/sync-host-http.js', import.meta.url)).toString('base64'));
const WORKER_SRC = readFileSync(new URL('../../server/sync/src/worker.js', import.meta.url), 'utf8');
const { toStored, TEST_SLOT } = createRequire(import.meta.url)('../support/save.js');

const ENV = { crypto: globalThis.crypto, CompressionStream: globalThis.CompressionStream, DecompressionStream: globalThis.DecompressionStream };
const CODE_BYTES = Uint8Array.from({ length: 16 }, (_, i) => i * 7 + 3);
const DAY = 86400000, T0 = Date.UTC(2026, 9, 1, 12);
const ID = 'AbCdEfGhIjKlMnOpQrStUv', TOKEN = 'T'.repeat(42) + '0', OTHER = 'O'.repeat(42) + '1', IP = '203.0.113.7';
const clone = o => JSON.parse(JSON.stringify(o));
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(y => [y, x[y]])) : x);
const latin1 = b => Buffer.from(b).toString('latin1');
/* an envelope-shaped body: 14 + k × 4096 + 16 bytes */
const envelope = (k = 1, fill = 7) => Uint8Array.from({ length: 30 + k * 4096 }, (_, i) => (i * 31 + fill) & 255);
const LOG_LINE = /^(GET|PUT|DELETE|OPTIONS|HEAD|POST|PATCH|OTHER) (\/v1\/s\/:id|other) \d{3} (0|<=8K|<=32K|<=128K|<=256K|>256K)$/;

/* one server: the worker with a test clock, its bucket and its log lines; req() sends one request */
function rig() {
  const clock = { ms: T0 }, now = () => clock.ms, bucket = memoryR2(now), logs = [];
  const worker = makeWorker({ now, log: l => logs.push(l) }), env = { SYNC: bucket };
  const req = (method, id = ID, o = {}) => {
    const headers = new Headers(o.headers || {});
    if (o.token !== null) headers.set('Authorization', `Bearer ${o.token || TOKEN}`);
    if (o.origin !== null) headers.set('Origin', o.origin || ORIGIN);
    headers.set('CF-Connecting-IP', o.ip || IP);
    return worker.fetch(new Request(`https://sync.daevacompanion.com${o.path || `/v1/s/${id}`}`, { method, headers, body: o.body }), env);
  };
  const put = (body, cond, o = {}) => req('PUT', o.id, { ...o, body, headers: cond === undefined ? {} : cond === '*' ? { 'If-None-Match': '*' } : { 'If-Match': cond } });
  return { clock, bucket, logs, worker, env, req, put, storeOps: () => bucket.ops.length };
}
/* the browser's fetch for a page on ORIGIN: adds Origin, refuses a response without the CORS grant, and lets the page
   read only the CORS-safelisted response headers plus those in Access-Control-Expose-Headers */
function browserFetch(R, step = 11000) {
  const f = async (url, init = {}) => {
    R.clock.ms += step;
    f.requests.push({ url, init });
    const h = new Headers(init.headers); h.set('Origin', ORIGIN); h.set('CF-Connecting-IP', IP);
    const res = await R.worker.fetch(new Request(url, { method: init.method, headers: h, body: init.body }), R.env);
    if (res.headers.get('Access-Control-Allow-Origin') !== ORIGIN) throw new TypeError('Failed to fetch (CORS)');
    const exposed = new Set(['cache-control', 'content-language', 'content-length', 'content-type', 'expires', 'last-modified', 'pragma',
      ...(res.headers.get('Access-Control-Expose-Headers') || '').toLowerCase().split(/\s*,\s*/)]);
    return { status: res.status, headers: { get: k => exposed.has(k.toLowerCase()) ? res.headers.get(k) : null }, arrayBuffer: () => res.arrayBuffer() };
  };
  f.requests = [];
  return f;
}
const saveWith = (M, flat, sec) => { const s = toStored({ checks: {}, level: 5, hide: false, open: {}, quest: '', ...flat }); M.stampSave(s, sec * 1000); return s; };
const freshSave = (M, id) => { const { state, hadSave } = M.loadState(null, { now: 0, newId: () => id }); M.migrate(state, hadSave, () => {}, 0); return state; };
const device = (M, save, keys, host) => {
  const d = { save };
  d.round = async (o = {}) => { const r = await M.syncOnce({ save: d.save, keys, host, env: ENV, store: m => { d.save = clone(m); }, ...o }); d.save = r.save; return r; };
  d.edit = (sec, fn) => { fn(M.char(d.save)); M.stampSave(d.save, sec * 1000); };
  return d;
};

export default (test, M) => {
  test('server API: create with If-None-Match: * → 201 + ETag, again → 412; GET → 200, the stored bytes equal the body exactly, same ETag, no-store', async () => {
    const R = rig(), body = envelope(2);
    const c = await R.put(body, '*');
    assert.equal(c.status, 201); assert.match(c.headers.get('ETag'), /^"[^"]+"$/);
    assert.equal(c.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(R.bucket.store.get(`s/${ID}`).bytes, body, 'stored as sent');
    R.clock.ms += 20000;
    assert.equal((await R.put(envelope(1), '*')).status, 412, 'it exists');
    const g = await R.req('GET');
    assert.equal(g.status, 200); assert.equal(g.headers.get('ETag'), c.headers.get('ETag'));
    assert.equal(g.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(new Uint8Array(await g.arrayBuffer()), body);
    assert.equal(R.bucket.store.get(`s/${ID}`).customMetadata.th, Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(TOKEN))).toString('base64url'), 'only SHA-256(token) is kept');
    assert.ok(![...R.bucket.store.values()].some(o => JSON.stringify(o.customMetadata).includes(TOKEN)), 'never the token');
    assert.equal((await R.req('GET', 'AbCdEfGhIjKlMnOpQrStUw')).status, 404);
  });
  test('server API: update with If-Match → 200 + new ETag; a stale ETag → 412; no precondition → 428; If-Match with no copy → 412', async () => {
    const R = rig(), e1 = (await R.put(envelope(1), '*')).headers.get('ETag');
    R.clock.ms += 20000;
    const u = await R.put(envelope(1, 9), e1);
    assert.equal(u.status, 200); const e2 = u.headers.get('ETag'); assert.notEqual(e2, e1);
    R.clock.ms += 20000;
    assert.equal((await R.put(envelope(1, 11), e1)).status, 412, 'stale ETag');
    assert.deepEqual(R.bucket.store.get(`s/${ID}`).bytes, envelope(1, 9), 'nothing written on 412');
    assert.equal((await R.put(envelope(1), undefined)).status, 428);
    assert.equal((await R.put(envelope(1), undefined, { headers: { 'If-None-Match': '"x"' } })).status, 428, 'If-None-Match other than * is no precondition');
    assert.equal((await R.put(envelope(1), e2, { id: 'ZZZZZZZZZZZZZZZZZZZZZZ' })).status, 412);
    assert.equal((await R.put(envelope(1), e2)).status, 200);
  });
  test('server API: a wrong token → 401 on GET, PUT (update and create) and DELETE; nothing changes', async () => {
    const R = rig(), e1 = (await R.put(envelope(1), '*')).headers.get('ETag');
    R.clock.ms += 20000;
    assert.equal((await R.req('GET', ID, { token: OTHER })).status, 401);
    assert.equal((await R.put(envelope(1, 3), e1, { token: OTHER })).status, 401);
    assert.equal((await R.put(envelope(1, 3), '*', { token: OTHER })).status, 401);
    assert.equal((await R.req('DELETE', ID, { token: OTHER })).status, 401);
    assert.deepEqual(R.bucket.store.get(`s/${ID}`).bytes, envelope(1));
    assert.equal((await R.req('GET')).status, 200);
  });
  test('server API: DELETE with the token → 204 (copy and read marker gone), then GET → 404, DELETE again → 204', async () => {
    const R = rig();
    await R.put(envelope(1), '*'); await R.req('GET');
    assert.ok(R.bucket.store.has(`r/${ID}`));
    const d = await R.req('DELETE');
    assert.equal(d.status, 204); assert.equal(await d.text(), '');
    assert.ok(!R.bucket.store.has(`s/${ID}`) && !R.bucket.store.has(`r/${ID}`));
    assert.equal((await R.req('GET')).status, 404);
    assert.equal((await R.req('DELETE')).status, 204, 'already gone');
  });
  test('server API: a malformed id or token → 400 before any store access', async () => {
    const R = rig();
    for (const id of ['short', 'AbCdEfGhIjKlMnOpQrStUvW', 'AbCdEfGhIjKlMnOpQrSt.v', 'AbCdEfGhIjKlMnOpQrSt%2F'])
      for (const m of ['GET', 'PUT', 'DELETE']) assert.equal((await R.req(m, id, m === 'PUT' ? { body: envelope(1), headers: { 'If-None-Match': '*' } } : {})).status, 400, `${m} ${id}`);
    for (const token of ['x', TOKEN + 'A', TOKEN.slice(1) + '+', TOKEN.slice(1) + '=']) assert.equal((await R.req('GET', ID, { token })).status, 400, token);
    assert.equal((await R.req('GET', ID, { token: null })).status, 400, 'no Authorization');
    assert.equal((await R.req('GET', ID, { headers: { Authorization: `Basic ${TOKEN}` }, token: null })).status, 400, 'not Bearer');
    assert.equal(R.storeOps(), 0, 'no store read');
  });
  test('server API: anything else → 404 with a fixed body (other paths, a query string, POST / PATCH)', async () => {
    const R = rig();
    for (const path of ['/', '/v1/s/', `/v1/s/${ID}/x`, `/v2/s/${ID}`, `/v1/s/${ID}?label=x`]) {
      const r = await R.req('GET', ID, { path });
      assert.equal(r.status, 404, path); assert.equal(await r.text(), 'not found');
    }
    for (const m of ['POST', 'PATCH']) assert.equal((await R.req(m, ID, { body: envelope(1) })).status, 404, m);
    assert.equal(R.storeOps(), 0);
  });
  test('server limits: body 256 KiB + 1 → 413; the largest envelope under 256 KiB → 201; not envelope-shaped (wrong length step, too short, empty) → 400', async () => {
    const R = rig();
    assert.equal((await R.put(new Uint8Array(256 * 1024 + 1), '*')).status, 413);
    for (const n of [0, 30, 4096, 30 + 4096 + 1, 30 + 4096 - 1, 14 + 4096]) assert.equal((await R.put(new Uint8Array(n), '*')).status, 400, `${n} bytes`);
    assert.equal(R.storeOps(), 0, 'rejected before the store');
    const max = Math.floor((256 * 1024 - 30) / 4096);
    assert.equal((await R.put(envelope(max), '*')).status, 201, `${30 + max * 4096} bytes`);
  });
  test('server limits: per IP 60 requests / 10 min and 5 new ids / day → 429 with Retry-After; the next window is open again', async () => {
    const R = rig();
    for (let i = 0; i < 60; i++) assert.equal((await R.req('GET')).status, 404);
    const r = await R.req('GET');
    assert.equal(r.status, 429); const ra = Number(r.headers.get('Retry-After')); assert.ok(ra >= 1 && ra <= 600, `Retry-After ${ra}`);
    assert.equal((await R.req('GET', ID, { ip: '198.51.100.1' })).status, 404, 'another IP is not limited');
    R.clock.ms += ra * 1000;
    assert.equal((await R.req('GET')).status, 404, 'next window');
    const ids = Array.from({ length: 6 }, (_, i) => 'NewId' + String(i).padStart(17, '0'));
    for (let i = 0; i < 5; i++) assert.equal((await R.put(envelope(1), '*', { id: ids[i] })).status, 201);
    const sixth = await R.put(envelope(1), '*', { id: ids[5] });
    assert.equal(sixth.status, 429); assert.ok(Number(sixth.headers.get('Retry-After')) > 0);
    assert.ok(!R.bucket.store.has(`s/${ids[5]}`));
    R.clock.ms += DAY;
    assert.equal((await R.put(envelope(1), '*', { id: ids[5] })).status, 201, 'next day');
  });
  test('server limits: per id 1 PUT / 10 s and 500 PUT / day → 429 with Retry-After', async () => {
    const R = rig();
    let etag = (await R.put(envelope(1), '*')).headers.get('ETag');
    R.clock.ms += 4000;
    const fast = await R.put(envelope(1, 2), etag);
    assert.equal(fast.status, 429); assert.equal(fast.headers.get('Retry-After'), '6');
    R.clock.ms += 6000;
    const u = await R.put(envelope(1, 2), etag); assert.equal(u.status, 200); etag = u.headers.get('ETag');
    R.clock.ms = Date.UTC(2026, 9, 2);
    for (let i = 0; i < 500; i++) {
      R.clock.ms += 10000;
      const r = await R.put(envelope(1, i), etag, { ip: `10.0.${i >> 8}.${i & 255}` });
      assert.equal(r.status, 200, `put ${i}`); etag = r.headers.get('ETag');
    }
    R.clock.ms += 10000;
    const over = await R.put(envelope(1, 1), etag, { ip: '10.9.9.9' });
    assert.equal(over.status, 429); assert.ok(Number(over.headers.get('Retry-After')) > 0);
    R.clock.ms = Date.UTC(2026, 9, 3, 0, 0, 1);
    assert.equal((await R.put(envelope(1, 1), etag, { ip: '10.9.9.9' })).status, 200, 'next day');
  });
  test('server limits: above the storage ceiling a new id gets 507; an existing copy still updates', async () => {
    const R = rig();
    const e = (await R.put(envelope(1), '*')).headers.get('ETag');
    await R.bucket.put('m/total', new Uint8Array(0), { customMetadata: { bytes: String(LIMITS.ceilingBytes - 4000) } });
    assert.equal((await R.put(envelope(1), '*', { id: 'ZZZZZZZZZZZZZZZZZZZZZZ' })).status, 507);
    assert.ok(!R.bucket.store.has('s/ZZZZZZZZZZZZZZZZZZZZZZ'));
    R.clock.ms += 20000;
    assert.equal((await R.put(envelope(1, 5), e)).status, 200);
  });
  test('server retention: last activity 181 days ago → removed by the scheduled job, 179 days → kept, a read keeps a copy; m/total counts what stays', async () => {
    const R = rig(), id = n => n.padEnd(22, 'x');
    await R.put(envelope(1), '*', { id: id('old') });
    await R.put(envelope(2), '*', { id: id('readlater') });
    R.clock.ms += 2 * DAY;
    await R.put(envelope(3), '*', { id: id('young') });
    R.clock.ms = T0 + 100 * DAY;
    assert.equal((await R.req('GET', id('readlater'))).status, 200);
    await R.bucket.put('r/' + id('orphan'), new Uint8Array(0));
    R.clock.ms = T0 + 181 * DAY;
    await R.worker.scheduled({}, R.env);
    assert.deepEqual([...R.bucket.store.keys()].sort(), ['m/total', 'r/' + id('readlater'), 's/' + id('readlater'), 's/' + id('young')]);
    assert.equal(R.bucket.store.get('m/total').customMetadata.bytes, String(envelope(2).length + envelope(3).length));
    R.clock.ms = T0 + 281 * DAY + 1;
    await R.worker.scheduled({}, R.env);
    assert.deepEqual([...R.bucket.store.keys()], ['m/total']);
    assert.equal(LIMITS.retentionDays, 180);
  });
  test('server retention: a GET refreshes last-read at most once a day (the copy itself and its ETag stay)', async () => {
    const R = rig(), e = (await R.put(envelope(1), '*')).headers.get('ETag');
    const marks = () => R.bucket.ops.filter(o => o.op === 'put' && o.key === `r/${ID}`).length;
    await R.req('GET'); R.clock.ms += DAY - 1; await R.req('GET'); await R.req('GET');
    assert.equal(marks(), 1);
    R.clock.ms += 1; await R.req('GET');
    assert.equal(marks(), 2);
    assert.equal((await R.req('GET')).headers.get('ETag'), e, 'reading never changes the ETag');
  });
  test('server CORS: https://daevacompanion.com gets the grant and ETag in Access-Control-Expose-Headers; other origins get no CORS headers and their preflight fails', async () => {
    const R = rig();
    await R.put(envelope(1), '*');
    const g = await R.req('GET');
    assert.equal(g.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    assert.ok(g.headers.get('Access-Control-Expose-Headers').split(/\s*,\s*/).includes('ETag'));
    assert.match(g.headers.get('Vary'), /Origin/);
    const pre = await R.req('OPTIONS', ID, { token: null, headers: { 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'authorization, content-type, if-match' } });
    assert.equal(pre.status, 204); assert.equal(pre.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    for (const m of ['GET', 'PUT', 'DELETE']) assert.ok(pre.headers.get('Access-Control-Allow-Methods').includes(m));
    for (const h of ['Authorization', 'Content-Type', 'If-Match', 'If-None-Match']) assert.ok(pre.headers.get('Access-Control-Allow-Headers').includes(h));
    for (const origin of ['https://evil.example', 'http://daevacompanion.com', 'https://www.daevacompanion.com', 'https://daevacompanion.com.evil.example', 'null']) {
      const p = await R.req('OPTIONS', ID, { token: null, origin, headers: { 'Access-Control-Request-Method': 'GET' } });
      assert.equal(p.status, 403, origin); assert.equal(p.headers.get('Access-Control-Allow-Origin'), null, origin);
      const r = await R.req('GET', ID, { origin });
      assert.equal(r.headers.get('Access-Control-Allow-Origin'), null, origin); assert.equal(r.headers.get('Access-Control-Expose-Headers'), null, origin);
    }
    assert.equal((await R.req('OPTIONS', ID, { token: null, origin: null })).status, 403, 'no Origin');
  });
  test('server: ciphertext only (no JSON parse or text decode on any path, a source check); a store failure → 500 with a fixed body, nothing logged but the line', async () => {
    for (const bad of ['JSON.parse', '.json(', '.text(', 'TextDecoder', 'eval(', 'new Function']) assert.ok(!WORKER_SRC.includes(bad), bad);
    const R = rig();
    R.bucket.head = async () => { throw new Error(`boom ${ID} ${TOKEN}`); };
    const r = await R.put(envelope(1), '*');
    assert.equal(r.status, 500); assert.equal(await r.text(), 'server error');
    /* the size bucket comes from Content-Length, which Node's Request leaves to the sender (the Workers runtime has it) */
    assert.equal(R.logs.length, 1); assert.match(R.logs[0], /^PUT \/v1\/s\/:id 500 (0|<=8K)$/);
  });

  test('client ↔ server: create, update, a lost race (412) and its retry, conflict, join, delete, through the HTTP adapter and the browser\'s CORS rules', async () => {
    const R = rig(), http = httpSyncHost('https://sync.daevacompanion.com', browserFetch(R)), k = await M.syncKeys(ENV, CODE_BYTES);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true }, level: 10 }, 100), k, http);
    const created = await A.round();
    assert.equal(created.status, 'synced'); assert.match(created.etag, /^"[^"]+"$/, 'the ETag reached the page cross-origin');
    const B = device(M, clone(A.save), k, http);
    assert.equal((await B.round()).status, 'synced');
    A.edit(200, c => { c.checks['rq:2'] = true; c.level = 12; });
    const updated = await A.round();
    assert.equal(updated.status, 'synced'); assert.notEqual(updated.etag, created.etag, 'updated');
    /* B's upload loses a race: A writes between B's GET and B's PUT */
    A.edit(300, c => { c.checks['rq:3'] = true; });
    B.edit(310, c => { c.checks['rq:1'] = false; });
    const statuses = [], waits = [];
    R.bucket.beforePut = async key => { if (key.startsWith('s/')) { R.bucket.beforePut = null; await A.round(); } };
    const fetch0 = R.logs.length;
    const r = await B.round({ wait: async ms => { waits.push(ms); } });
    R.logs.slice(fetch0).forEach(l => statuses.push(l.split(' ')[2]));
    assert.equal(r.status, 'synced'); assert.equal(waits.length, 1);
    assert.ok(statuses.includes('412'), `a 412 on the way: ${statuses.join(' ')}`);
    await A.round();
    assert.equal(canon(M.syncPayload(A.save)), canon(M.syncPayload(B.save)));
    assert.deepEqual(['rq:1', 'rq:2', 'rq:3'].map(q => M.char(A.save).checks[q]), [false, true, true], 'nothing lost, the later un-tick kept');
    assert.equal(canon((await M.openSave(ENV, k, R.bucket.store.get(`s/${k.id}`).bytes)).payload), canon(M.syncPayload(A.save)), 'the cloud copy too');
    /* still losing after 3 retries → conflict, the local edit kept */
    B.edit(400, c => { c.level = 30; });
    let n = 0;
    R.bucket.beforePut = async key => { if (key.startsWith('s/') && n++ < 4) R.bucket.store.get(key).etag = `x${n}`; };
    const lost = await B.round({ wait: async () => {} });
    assert.equal(lost.status, 'conflict'); assert.equal(M.char(lost.save).level, 30);
    R.bucket.beforePut = null;
    assert.equal((await B.round()).status, 'synced', 'the next trigger');
    /* join: a fresh device adopts; delete; then the code finds nothing */
    const j = await M.joinSync({ save: freshSave(M, 'fresh-slot'), keys: k, host: http, env: ENV });
    assert.equal(j.status, 'adopt'); assert.deepEqual(Object.keys(j.save.chars), [TEST_SLOT]);
    assert.equal(M.char(j.save).level, 30);
    assert.equal(await M.deleteCloudCopy({ keys: k, host: http }), true);
    assert.ok(!R.bucket.store.has(`s/${k.id}`));
    assert.equal((await M.joinSync({ save: freshSave(M, 'x'), keys: k, host: http, env: ENV })).status, 'not-found');
    assert.equal(await M.deleteCloudCopy({ keys: k, host: http }), true, 'already gone');
  });
  test('client ↔ server: without ETag in Access-Control-Expose-Headers the page would read no ETag (the check is not vacuous)', async () => {
    const R = rig(), k = await M.syncKeys(ENV, CODE_BYTES), f = browserFetch(R);
    const strip = async (url, init) => { const r = await f(url, init); return { ...r, headers: { get: h => h.toLowerCase() === 'etag' ? null : r.headers.get(h) } }; };
    const http = httpSyncHost('https://sync.daevacompanion.com', strip);
    const A = device(M, saveWith(M, { checks: { 'rq:1': true } }, 100), k, http);
    await A.round();
    A.edit(200, c => { c.level = 20; });
    assert.equal((await A.round({ wait: async () => {} })).status, 'conflict', 'every update falls back to If-None-Match: * and gets 412');
  });
  test('client ↔ server privacy canary: no log line carries the canary, a sync id, a token or the IP; every line is method, route template, status, size bucket', async () => {
    const R = rig(), http = httpSyncHost('https://sync.daevacompanion.com', browserFetch(R)), k = await M.syncKeys(ENV, CODE_BYTES.map(b => b ^ 0x5a));
    const s = saveWith(M, { checks: { 'rq:1': true }, level: 37 }, 100);
    M.char(s).name = 'Zq_Canary'; M.stampSave(s, 101000);
    const A = device(M, s, k, http);
    assert.equal((await A.round()).status, 'synced');
    assert.equal((await M.joinSync({ save: freshSave(M, 'b-slot'), keys: k, host: http, env: ENV })).status, 'adopt');
    A.edit(200, x => { x.level = 38; }); await A.round();
    await R.req('GET', k.id, { token: OTHER }); await R.req('GET', 'bad');
    await R.req('OPTIONS', k.id, { token: null }); await R.req('POST', k.id);
    assert.equal(await M.deleteCloudCopy({ keys: k, host: http }), true);
    await R.worker.scheduled({}, R.env);
    assert.ok(R.logs.length >= 10);
    const BAD = ['Zq_Canary', 'assassin', 'lvl', TEST_SLOT, 'b-slot', k.id, k.token, TOKEN, OTHER, IP, 'daevacompanion'];
    for (const line of R.logs) {
      assert.ok(LOG_LINE.test(line) || /^CRON retention kept \d+ removed \d+$/.test(line), line);
      for (const w of BAD) assert.ok(!line.includes(w), `${w} in "${line}"`);
    }
    for (const key of R.bucket.store.keys()) assert.match(key, /^(s|r)\/[A-Za-z0-9_-]{22}$|^m\/total$/, 'the id is the only name');
  });
};
