/* The browser side of the sync client (0.6 P21, docs/design/sync.md §3–§4): the host adapter over fetch, and the env the
   client (src/core/sync-client.js) takes from the browser. Site build only, in the sync chunk (src/sync-ui.js, loaded
   only when sync is shown; 0.8 P6); the claude.ai build has none of it (sync.md S4). Whether sync is shown at all:
   SYNC_LIVE in src/shell/sync-live.js.
   httpSyncHost(base, fetchFn): base is the host's origin (0.7: the Cloudflare Worker, DECISIONS "Sync hosting"); every
   request goes to <base>/v1/s/<sync id> with no query string, sends only the allowlisted headers (Authorization,
   Content-Type, If-Match / If-None-Match), no cookies and no referrer, and reads back only the status, the ETag and the
   body. A request that can't reach the host rejects (the client reports "offline"). */
/* the sync host's origin (0.7 P6; the one place it is written) */
export const SYNC_BASE = "https://sync.daevacompanion.com";
export function httpSyncHost(base, fetchFn) {
  const send = (method, id, token, headers = {}, body) => fetchFn(`${base}/v1/s/${id}`, {
    method, headers: { Authorization: `Bearer ${token}`, ...headers }, body,
    credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store", mode: "cors",
  });
  return {
    async get(id, token) {
      const r = await send("GET", id, token);
      return r.status === 200 ? { status: 200, body: new Uint8Array(await r.arrayBuffer()), etag: r.headers.get("ETag") } : { status: r.status };
    },
    async put(id, token, body, cond) {
      const r = await send("PUT", id, token, { "Content-Type": "application/octet-stream", ...(cond && cond.etag ? { "If-Match": cond.etag } : { "If-None-Match": "*" }) }, body);
      return { status: r.status, etag: r.headers.get("ETag") };
    },
    async remove(id, token) { return { status: (await send("DELETE", id, token)).status }; },
  };
}
/* the browser's WebCrypto and compression streams, for the client */
export const webSyncEnv = () => ({ crypto, CompressionStream: self.CompressionStream, DecompressionStream: self.DecompressionStream });
