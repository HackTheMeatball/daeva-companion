/* The sync server (0.7 P5, #348): a Cloudflare Worker over one R2 bucket, docs/design/sync.md §4 exactly (§10 is the
   as-built note). Small, dumb, content-blind: it stores the request body's bytes under the sync id and never parses them.
     GET    /v1/s/{id}   200 + body + ETag | 404; the bearer token must match (401)
     PUT    /v1/s/{id}   If-None-Match: * → 201 (create) | 412; If-Match: <etag> → 200 | 412; neither → 428
     DELETE /v1/s/{id}   204 (also when already gone)
     OPTIONS             CORS preflight for https://daevacompanion.com only; anything else 404, fixed body
   R2 keys (the sync id is the only name; sync.md §3):
     s/<id>   the cloud copy: the body as sent; customMetadata th = base64url SHA-256(token), c = created ms,
              d / n = the UTC day of the last writes and how many there were (500 PUT / day)
     r/<id>   empty marker, rewritten at most once a day by a GET: its `uploaded` is the last-read time (writing s/<id>
              would change the ETag every device holds)
     m/total  empty, customMetadata bytes = the stored total the last scheduled run counted (the storage ceiling)
   makeWorker(opts) is the handler with its clock, log sink and limits injectable (tests/core/sync-server.test.mjs runs it
   in Node over server/sync/test/memory-r2.mjs); the default export is the Worker as deployed. */

export const ORIGIN = "https://daevacompanion.com";
const ID = /^[A-Za-z0-9_-]{22}$/, TOKEN = /^[A-Za-z0-9_-]{43}$/, ROUTE = /^\/v1\/s\/([^/]+)$/;
const KIB = 1024, DAY = 86400000;
/* envelope: 1 + 1 + 12 header bytes, the padded plaintext in 4 KiB steps, the 16-byte GCM tag (sync.md §1) */
const HEAD = 14, TAG = 16, PAD = 4 * KIB;
export const LIMITS = {
  maxBody: 256 * KIB,
  retentionDays: 180,
  ceilingBytes: 1024 * 1024 * KIB,
  ipWindowMs: 10 * 60000, ipRequests: 60, ipNewIdsPerDay: 5,
  idPutGapMs: 10000, idPutsPerDay: 500,
  readMarkMs: DAY,
};
const METHODS = new Set(["GET", "PUT", "DELETE", "OPTIONS", "HEAD", "POST", "PATCH"]);
const TEXT = { 200: "ok", 201: "created", 204: "", 400: "bad request", 401: "unauthorized", 403: "forbidden", 404: "not found",
  405: "method not allowed", 412: "precondition failed", 413: "too large", 428: "precondition required",
  429: "too many requests", 500: "server error", 507: "storage full" };

const b64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const sha256 = async text => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
/* constant time over the fixed 43-character base64url of a SHA-256: no early exit on the first difference */
const sameHash = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
/* the size bucket of a log line: never the exact size */
const bucket = n => n <= 0 ? "0" : n <= 8 * KIB ? "<=8K" : n <= 32 * KIB ? "<=32K" : n <= 128 * KIB ? "<=128K" : n <= 256 * KIB ? "<=256K" : ">256K";

export function makeWorker(opts = {}) {
  const now = opts.now || (() => Date.now());
  const log = opts.log || (line => console.log(line));
  const L = { ...LIMITS, ...(opts.limits || {}) };
  /* per-IP counters, in this isolate's memory only (sync.md §3 "rate limits keep counters by IP in memory"); never logged */
  const ips = new Map();

  const cors = origin => origin === ORIGIN ? { "Access-Control-Allow-Origin": ORIGIN, "Access-Control-Expose-Headers": "ETag", "Vary": "Origin" } : { "Vary": "Origin" };
  const reply = (status, origin, extra = {}, body) => new Response(status === 204 ? null : body !== undefined ? body : TEXT[status],
    { status, headers: { "Cache-Control": "no-store", ...(body === undefined && status !== 204 ? { "Content-Type": "text/plain; charset=utf-8" } : {}), ...cors(origin), ...extra } });
  const tooMany = (origin, ms) => reply(429, origin, { "Retry-After": String(Math.max(1, Math.ceil(ms / 1000))) });

  /* the IP's fixed windows: 60 requests per 10 min, 5 new ids per UTC day. Returns the ms to wait, or 0. */
  const ipEntry = ip => {
    const t = now();
    let e = ips.get(ip);
    if (!e) { e = { w: 0, n: 0, d: 0, ids: 0 }; ips.set(ip, e); }
    const w = Math.floor(t / L.ipWindowMs), d = Math.floor(t / DAY);
    if (e.w !== w) { e.w = w; e.n = 0; }
    if (e.d !== d) { e.d = d; e.ids = 0; }
    if (ips.size > 10000) for (const [k, v] of ips) if (v.w !== w && v.d !== d) ips.delete(k);
    return e;
  };

  async function route(request, env) {
    const url = new URL(request.url), origin = request.headers.get("Origin"), method = request.method;
    const m = ROUTE.exec(url.pathname);
    if (method === "OPTIONS") {
      if (!m || origin !== ORIGIN) return { res: reply(403, null), tpl: m ? "/v1/s/:id" : "other" };
      return { res: reply(204, origin, { "Access-Control-Allow-Methods": "GET, PUT, DELETE", "Access-Control-Allow-Headers": "Authorization, Content-Type, If-Match, If-None-Match", "Access-Control-Max-Age": "600" }), tpl: "/v1/s/:id" };
    }
    if (!m || url.search || !["GET", "PUT", "DELETE"].includes(method)) return { res: reply(404, origin), tpl: m ? "/v1/s/:id" : "other" };
    const tpl = "/v1/s/:id", id = m[1];
    const auth = request.headers.get("Authorization") || "", token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    /* validation before any store access */
    if (!ID.test(id) || !TOKEN.test(token)) return { res: reply(400, origin), tpl };
    const ip = request.headers.get("CF-Connecting-IP") || "unknown", e = ipEntry(ip);
    if (++e.n > L.ipRequests) return { res: tooMany(origin, (e.w + 1) * L.ipWindowMs - now()), tpl };
    const th = b64url(await sha256(token)), key = `s/${id}`, B = env.SYNC;

    if (method === "GET") {
      const o = await B.get(key);
      if (!o) return { res: reply(404, origin), tpl };
      if (!sameHash(o.customMetadata && o.customMetadata.th, th)) return { res: reply(401, origin), tpl };
      const body = new Uint8Array(await o.arrayBuffer());
      const mark = await B.head(`r/${id}`), t = now();
      if (!mark || t - mark.uploaded.getTime() >= L.readMarkMs) await B.put(`r/${id}`, new Uint8Array(0));
      return { res: reply(200, origin, { "ETag": o.httpEtag, "Content-Type": "application/octet-stream" }, body), tpl, size: body.length };
    }

    if (method === "DELETE") {
      const o = await B.head(key);
      if (o && !sameHash(o.customMetadata && o.customMetadata.th, th)) return { res: reply(401, origin), tpl };
      await B.delete([key, `r/${id}`]);
      return { res: reply(204, origin), tpl };
    }

    /* PUT: size first (Content-Length, then the bytes read), then the envelope's shape, then the precondition */
    const ifMatch = request.headers.get("If-Match"), create = !ifMatch && request.headers.get("If-None-Match") === "*";
    const declared = Number(request.headers.get("Content-Length"));
    if (declared > L.maxBody) return { res: reply(413, origin), tpl, size: declared };
    const body = new Uint8Array(await request.arrayBuffer());
    if (body.length > L.maxBody) return { res: reply(413, origin), tpl, size: body.length };
    if (body.length < HEAD + PAD + TAG || (body.length - HEAD - TAG) % PAD) return { res: reply(400, origin), tpl, size: body.length };
    if (!ifMatch && !create) return { res: reply(428, origin), tpl, size: body.length };
    const o = await B.head(key), t = now(), day = Math.floor(t / DAY);
    if (o && !sameHash(o.customMetadata && o.customMetadata.th, th)) return { res: reply(401, origin), tpl, size: body.length };

    if (create) {
      if (o) return { res: reply(412, origin), tpl, size: body.length };
      if (e.ids >= L.ipNewIdsPerDay) return { res: tooMany(origin, (day + 1) * DAY - t), tpl, size: body.length };
      const total = await B.head("m/total"), stored = total ? Number(total.customMetadata.bytes) || 0 : 0;
      if (stored + body.length > L.ceilingBytes) return { res: reply(507, origin), tpl, size: body.length };
      const put = await B.put(key, body, { onlyIf: new Headers({ "If-None-Match": "*" }), customMetadata: { th, c: String(t), d: String(day), n: "1" } });
      if (!put) return { res: reply(412, origin), tpl, size: body.length };
      e.ids++;
      return { res: reply(201, origin, { "ETag": put.httpEtag }), tpl, size: body.length };
    }

    if (!o || o.httpEtag !== ifMatch) return { res: reply(412, origin), tpl, size: body.length };
    const cm = o.customMetadata, gap = t - o.uploaded.getTime();
    if (gap < L.idPutGapMs) return { res: tooMany(origin, L.idPutGapMs - gap), tpl, size: body.length };
    const n = Number(cm.d) === day ? Number(cm.n) || 0 : 0;
    if (n >= L.idPutsPerDay) return { res: tooMany(origin, (day + 1) * DAY - t), tpl, size: body.length };
    const put = await B.put(key, body, { onlyIf: new Headers({ "If-Match": ifMatch }), customMetadata: { th: cm.th, c: cm.c, d: String(day), n: String(n + 1) } });
    if (!put) return { res: reply(412, origin), tpl, size: body.length };
    return { res: reply(200, origin, { "ETag": put.httpEtag }), tpl, size: body.length };
  }

  return {
    async fetch(request, env) {
      let r;
      try { r = await route(request, env); }
      catch (err) {
        let tpl = "other";
        try { if (ROUTE.test(new URL(request.url).pathname)) tpl = "/v1/s/:id"; } catch (e) { /* tpl stays "other" */ }
        r = { res: reply(500, request.headers.get("Origin")), tpl, size: Number(request.headers.get("Content-Length")) || 0 };
      }
      /* the one log line (sync.md §3): method, route template, status, size bucket; never the id, token, body or IP */
      log(`${METHODS.has(request.method) ? request.method : "OTHER"} ${r.tpl} ${r.res.status} ${bucket(r.size || 0)}`);
      return r.res;
    },
    /* Retention and the stored total (sync.md §4): a cloud copy neither read nor written for retentionDays is deleted
       with its read marker; read markers without a copy go too; m/total gets what remains. */
    async scheduled(event, env) {
      const B = env.SYNC, t = now(), cut = t - L.retentionDays * DAY;
      const list = async prefix => {
        const out = [];
        let cursor;
        do { const r = await B.list({ prefix, cursor, limit: 1000 }); out.push(...r.objects); cursor = r.truncated ? r.cursor : undefined; } while (cursor);
        return out;
      };
      const reads = new Map((await list("r/")).map(o => [o.key.slice(2), o.uploaded.getTime()]));
      const gone = [];
      let bytes = 0, kept = 0;
      for (const o of await list("s/")) {
        const id = o.key.slice(2), last = Math.max(o.uploaded.getTime(), reads.get(id) || 0);
        reads.delete(id);
        if (last < cut) gone.push(o.key, `r/${id}`); else { bytes += o.size; kept++; }
      }
      for (const id of reads.keys()) gone.push(`r/${id}`);
      for (let i = 0; i < gone.length; i += 1000) await B.delete(gone.slice(i, i + 1000));
      await B.put("m/total", new Uint8Array(0), { customMetadata: { bytes: String(bytes) } });
      log(`CRON retention kept ${kept} removed ${gone.filter(k => k.startsWith("s/")).length}`);
    },
  };
}

const worker = makeWorker();
export default {
  fetch: (request, env, ctx) => worker.fetch(request, env, ctx),
  scheduled: (event, env, ctx) => worker.scheduled(event, env, ctx),
};
