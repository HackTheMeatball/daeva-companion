/* A sync host in memory for the sync client tests (0.6 P21): the API of docs/design/sync.md §4 at the adapter level
   (src/core/sync-client.js lists the adapter interface), no network. It keeps, per sync id, the body bytes as sent,
   an ETag and SHA-256(token), like the real server will. No real host is ever contacted in tests.
     fakeHost()           → host: get / put / remove, plus
       .objects           Map id → { body, etag, tokenHash }
       .calls             every call: { op, id, token, cond, body } (the body as sent)
       .beforePut         optional async (id) => {}: runs before a PUT is decided (interleave another device's round)
       .down              true: every call rejects (offline)
     fakeFetch(host)      → fetch(url, init) over the same host, recording every request in .requests ({ url, init }),
                            for the HTTP adapter (src/shell/sync-host-http.js) */
import { createHash, timingSafeEqual } from 'node:crypto';

const ID = /^[A-Za-z0-9_-]{22}$/, TOKEN = /^[A-Za-z0-9_-]{43}$/;
const hash = t => createHash('sha256').update(t).digest();

export function fakeHost() {
  let n = 0;
  const host = { objects: new Map(), calls: [], beforePut: null, down: false };
  const gate = (op, id, token, cond, body) => {
    host.calls.push({ op, id, token, cond, body });
    if (host.down) throw new TypeError('Failed to fetch');
    if (!ID.test(id) || !TOKEN.test(token)) return { status: 400 };
    const o = host.objects.get(id);
    if (o && !timingSafeEqual(o.tokenHash, hash(token))) return { status: 401 };
    return null;
  };
  host.get = async (id, token) => {
    const bad = gate('get', id, token); if (bad) return bad;
    const o = host.objects.get(id);
    return o ? { status: 200, body: new Uint8Array(o.body), etag: o.etag } : { status: 404 };
  };
  host.put = async (id, token, body, cond = {}) => {
    const bad = gate('put', id, token, cond, body); if (bad) return bad;
    if (host.beforePut) await host.beforePut(id);
    if (!(body instanceof Uint8Array) || (body.length - 30) % 4096 || body.length < 30 + 4096) return { status: 400 };
    if (body.length > 256 * 1024) return { status: 413 };
    const o = host.objects.get(id);
    if (!cond.etag) { if (o) return { status: 412 }; }
    else if (!o || o.etag !== cond.etag) return { status: 412 };
    const etag = `"e${++n}"`;
    host.objects.set(id, { body: new Uint8Array(body), etag, tokenHash: o ? o.tokenHash : hash(token) });
    return { status: o ? 200 : 201, etag };
  };
  host.remove = async (id, token) => {
    const bad = gate('remove', id, token); if (bad) return bad;
    host.objects.delete(id); return { status: 204 };
  };
  return host;
}

export function fakeFetch(host) {
  const f = async (url, init = {}) => {
    f.requests.push({ url, init });
    const m = /^https:\/\/sync\.test\/v1\/s\/([^/?#]+)$/.exec(url);
    const h = init.headers || {}, token = String(h.Authorization || '').replace(/^Bearer /, '');
    let r = { status: 404 };
    if (m && init.method === 'GET') r = await host.get(m[1], token);
    else if (m && init.method === 'PUT') r = h['If-Match'] ? await host.put(m[1], token, init.body, { etag: h['If-Match'] }) : h['If-None-Match'] === '*' ? await host.put(m[1], token, init.body, {}) : { status: 428 };
    else if (m && init.method === 'DELETE') r = await host.remove(m[1], token);
    return { status: r.status, headers: { get: k => (k.toLowerCase() === 'etag' ? r.etag ?? null : null) }, arrayBuffer: async () => (r.body || new Uint8Array()).slice().buffer };
  };
  f.requests = [];
  return f;
}
