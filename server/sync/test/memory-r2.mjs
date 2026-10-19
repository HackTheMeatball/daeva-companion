/* An R2 bucket in memory (0.7 P5, #348) for the Worker's tests in Node: the part of the Workers R2 binding the handler
   uses (head, get, put with onlyIf, delete, list), no network, no account. Behaviour modelled on the R2 binding's
   documented API: an object has key, size, etag (unquoted), httpEtag (quoted), uploaded (Date) and customMetadata; a
   put whose onlyIf (a Headers with If-Match / If-None-Match) fails stores nothing and returns null. To confirm against
   the real binding (Miniflare / wrangler dev) when the server is deployed (docs/design/sync.md §10).
     memoryR2(now)      → bucket, plus
       .store           Map key → { bytes, etag, uploaded, customMetadata }
       .ops             every call: { op, key }
       .beforePut       optional async (key) => {}: runs before a put's condition is decided (another device's round) */
export function memoryR2(now = () => Date.now()) {
  let n = 0;
  const b = { store: new Map(), ops: [], beforePut: null };
  const meta = (key, o) => ({ key, size: o.bytes.length, etag: o.etag, httpEtag: `"${o.etag}"`, uploaded: new Date(o.uploaded), customMetadata: { ...o.customMetadata } });
  b.head = async key => { b.ops.push({ op: 'head', key }); const o = b.store.get(key); return o ? meta(key, o) : null; };
  b.get = async key => {
    b.ops.push({ op: 'get', key });
    const o = b.store.get(key);
    return o ? { ...meta(key, o), arrayBuffer: async () => o.bytes.slice().buffer } : null;
  };
  b.put = async (key, value, opts = {}) => {
    b.ops.push({ op: 'put', key });
    if (b.beforePut) await b.beforePut(key);
    const o = b.store.get(key), c = opts.onlyIf;
    if (c) {
      const im = c.get('If-Match'), inm = c.get('If-None-Match');
      if (im !== null && (!o || im.replace(/"/g, '') !== o.etag)) return null;
      if (inm === '*' && o) return null;
    }
    const bytes = new Uint8Array(value instanceof ArrayBuffer ? value : value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
    const rec = { bytes, etag: `e${(++n).toString(16).padStart(8, '0')}`, uploaded: now(), customMetadata: { ...(opts.customMetadata || {}) } };
    b.store.set(key, rec);
    return meta(key, rec);
  };
  b.delete = async keys => { for (const k of [].concat(keys)) { b.ops.push({ op: 'delete', key: k }); b.store.delete(k); } };
  b.list = async ({ prefix = '', cursor, limit = 1000 } = {}) => {
    b.ops.push({ op: 'list', key: prefix });
    const keys = [...b.store.keys()].filter(k => k.startsWith(prefix)).sort(), start = cursor ? Number(cursor) : 0;
    const page = keys.slice(start, start + limit);
    return { objects: page.map(k => meta(k, b.store.get(k))), truncated: start + limit < keys.length, cursor: String(start + limit) };
  };
  return b;
}
