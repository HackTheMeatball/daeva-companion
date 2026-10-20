/* Sync client (0.6 P21, docs/design/sync.md §1–§3; pure: no DOM, no storage, no clock, no network of its own). It turns
   the save into the encrypted cloud copy and back with the sync code, and runs one sync round against a host adapter:
   pull, merge(), push with the host's conditional write, retry a lost race. No UI (0.7) and site build only: nothing
   the page bundle loads imports this module, and the build checks the claude.ai file holds none of it (sync.md S4).

   env: what the browser lends the client, passed in so the core names no browser global:
     crypto                                   WebCrypto (getRandomValues, subtle)
     CompressionStream, DecompressionStream   optional; without them the payload goes uncompressed (flag bit 0 clear)
   host: the adapter (src/shell/sync-host-http.js; tests/fixtures/fake-host.mjs in tests). Every method is async, answers
   with the HTTP status of sync.md §4 and rejects only when the host can't be reached:
     get(id, token)              → { status: 200, body: Uint8Array, etag } | { status: 404 | 401 | … }
     put(id, token, body, cond)  → { status: 200 | 201, etag } | { status: 412 | 401 | 413 | 429 | … }
                                   cond { etag } = If-Match: etag; cond {} = If-None-Match: * (first upload)
     remove(id, token)           → { status: 204 | … }
   The host only ever sees the sync id, the write token and ciphertext: the name, the label, slot ids, class and every
   JSON key stay inside the encrypted payload (sync.md §3; the canary test in tests/core/sync-client.test.mjs). This module
   never logs. */
import { merge, syncedPart } from "./merge.js";
import { CHAR_META, SAVE_V, isRemoved } from "./state.js";
import { hasProgress } from "./backup.js";

/* this device's sync record (0.7 writes it, next to the save, never inside it or an export): { code, lastSyncAt, etag } */
export const SYNC_KEY = "companion-sync-v1";
export const SYNC_FORMAT = "dc-sync";
/* the code: "DC1" (format 1, not secret), the 16 random bytes as 26 Crockford base32 symbols, one check symbol (mod 37) */
const SC_SYMBOLS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ", SC_CHECK = SC_SYMBOLS + "*~$=U", SC_PREFIX = "DC1";
/* HKDF salt (sync.md §1; tests/core/sync-client.test.mjs pins it): the product name in lower case, hyphenated, then
   " sync v1". Spelled from the product name because src/core/ names no game term (the purity term scan). */
const SC_SALT = "Daeva Companion".toLowerCase().replace(" ", "-") + " sync v1";
const SC_PAD = 4096, SC_HEAD = 14, SC_TRIES = 4, SC_BACKOFF = [500, 1000, 2000];
const scText = new TextEncoder(), scUtf8 = new TextDecoder("utf-8", { fatal: true });

const scBigOf = bytes => bytes.reduce((n, b) => (n << 8n) | BigInt(b), 0n);
/* A new sync code from 16 random bytes: "DC1-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XX" (the last symbol is the check) */
export function newSyncCode(env) {
  const n = scBigOf(env.crypto.getRandomValues(new Uint8Array(16)));
  let s = "";
  for (let i = 25; i >= 0; i--) s += SC_SYMBOLS[Number((n >> BigInt(5 * i)) & 31n)];
  s += SC_CHECK[Number(n % 37n)];
  return [SC_PREFIX, ...s.match(/.{1,5}/g)].join("-");
}
/* The 16 code bytes from what the player typed or pasted (case, "-" and spaces ignored; I L → 1, O → 0), or null on a
   typo: a wrong length, a symbol outside the alphabet or a check symbol that doesn't match. No request is made then. */
export function parseSyncCode(text) {
  const s = String(text || "").toUpperCase().replace(/[\s-]/g, "").replace(/[IL]/g, "1").replace(/O/g, "0");
  if (s.length !== SC_PREFIX.length + 27 || !s.startsWith(SC_PREFIX)) return null;
  let n = 0n;
  for (const ch of s.slice(SC_PREFIX.length, -1)) { const v = SC_SYMBOLS.indexOf(ch); if (v < 0) return null; n = (n << 5n) | BigInt(v); }
  if (n >> 128n || SC_CHECK[Number(n % 37n)] !== s.slice(-1)) return null;
  return Uint8Array.from({ length: 16 }, (_, i) => Number((n >> BigInt(8 * (15 - i))) & 255n));
}

const scB64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
/* base64url without padding */
export function b64urlOf(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0), k = Math.min(3, bytes.length - i) + 1;
    for (let j = 0; j < k; j++) s += scB64[(n >> (18 - 6 * j)) & 63];
  }
  return s;
}
/* The sync id (22 characters), the write token (43 characters) and the content key (AES-256-GCM, not extractable) from
   the code bytes: HKDF-SHA-256 with the salt above and info "id" / "auth" / "enc" (sync.md §1). */
export async function syncKeys(env, code) {
  const S = env.crypto.subtle, ikm = await S.importKey("raw", code, "HKDF", false, ["deriveBits", "deriveKey"]);
  const hk = info => ({ name: "HKDF", hash: "SHA-256", salt: scText.encode(SC_SALT), info: scText.encode(info) });
  const id = b64urlOf(new Uint8Array(await S.deriveBits(hk("id"), ikm, 128)));
  const token = b64urlOf(new Uint8Array(await S.deriveBits(hk("auth"), ikm, 256)));
  const key = await S.deriveKey(hk("enc"), ikm, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  return { id, token, key };
}

/* What travels (sync.md §2): per slot the synced part of the character and its identity (CHAR_META), or the tombstone;
   v and savedAt. View settings, current, backup and the pack's local fields stay on the device. */
export function syncPayload(save) {
  const sp = syncedPart(save), chars = {};
  Object.entries(sp.chars).forEach(([id, o]) => {
    const c = save.chars[id];
    chars[id] = isRemoved(c) ? { id, deletedAt: o.deletedAt } : { ...Object.fromEntries(CHAR_META.filter(f => c[f] !== undefined).map(f => [f, c[f]])), ...o };
  });
  return { format: SYNC_FORMAT, v: sp.v, ...("savedAt" in sp ? { savedAt: sp.savedAt } : {}), chars };
}
/* canonical JSON (object keys sorted), to compare two saves or payloads */
const scCanon = v => JSON.stringify(v, (k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(y => [y, x[y]])) : x);

const scJoin = parts => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; parts.forEach(p => { out.set(p, i); i += p.length; }); return out; };
async function scStream(bytes, Stream) {
  const s = new Stream("gzip"), w = s.writable.getWriter(), r = s.readable.getReader(), parts = [];
  w.write(bytes).catch(() => {}); w.close().catch(() => {});
  for (;;) { const { done, value } = await r.read(); if (done) return scJoin(parts); parts.push(value); }
}
const scAad = id => scText.encode(`${SYNC_FORMAT}|1|${id}`);
/* The envelope (sync.md §1): 1 byte version 0x01, 1 byte flags (bit 0 = gzip), 12 bytes IV (fresh each time), then
   AES-256-GCM of [4-byte length][payload JSON, gzipped if the browser can][zero bytes up to the next multiple of 4096], 128-bit tag,
   with the additional data "dc-sync|1|<sync id>". opts.iv pins the IV (test vector only). */
export async function sealSave(env, keys, save, opts = {}) {
  let data = scText.encode(JSON.stringify(syncPayload(save)));
  const gz = !!env.CompressionStream;
  if (gz) data = await scStream(data, env.CompressionStream);
  const plain = new Uint8Array(Math.ceil((data.length + 4) / SC_PAD) * SC_PAD);
  new DataView(plain.buffer).setUint32(0, data.length); plain.set(data, 4);
  const iv = opts.iv || env.crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await env.crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: scAad(keys.id), tagLength: 128 }, keys.key, plain));
  return scJoin([Uint8Array.of(1, gz ? 1 : 0), iv, ct]);
}
/* The payload of a cloud copy: { ok: true, payload } or { ok: false, status }: "unreadable" (another envelope version, a
   damaged copy, a copy moved to another id, not a payload), "update" (a newer save version: update the app to sync). */
export async function openSave(env, keys, bytes) {
  const bad = { ok: false, status: "unreadable" };
  if (!(bytes instanceof Uint8Array) || bytes.length < SC_HEAD + 16 + 4 || bytes[0] !== 1 || bytes[1] & ~1) return bad;
  let data;
  try {
    const plain = new Uint8Array(await env.crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(2, SC_HEAD), additionalData: scAad(keys.id), tagLength: 128 }, keys.key, bytes.slice(SC_HEAD)));
    const n = new DataView(plain.buffer).getUint32(0);
    if (n > plain.length - 4) return bad;
    data = plain.slice(4, 4 + n);
    if (bytes[1] & 1) { if (!env.DecompressionStream) return bad; data = await scStream(data, env.DecompressionStream); }
    data = JSON.parse(scUtf8.decode(data));
  } catch (e) { return bad; }
  if (!data || data.format !== SYNC_FORMAT || typeof data.v !== "number" || !data.chars || typeof data.chars !== "object" || Array.isArray(data.chars)) return bad;
  if (data.v > SAVE_V) return { ok: false, status: "update" };
  return data.v === SAVE_V ? { ok: true, payload: data } : bad;
}

/* The save a payload stands for, as merge() reads it */
const scRemoteSave = p => ({ v: p.v, ...(p.savedAt !== undefined ? { savedAt: p.savedAt } : {}), chars: p.chars });
const scGet = async (o, keys) => { try { return await o.host.get(keys.id, keys.token); } catch (e) { return null; } };

/* One sync round (sync.md §2), never throws: { status, save, etag }.
     o { save, keys, host, env, store?(merged), wait?(ms) → Promise }
   GET the cloud copy; merge it into the local save (store(merged) when that changed the save); PUT the merged payload
   when it differs from the cloud copy's, with If-Match (or If-None-Match: * on the first upload). A 412 (another device
   wrote in between) starts the round again after a backoff (wait), at most 3 times. status:
     "synced"      the cloud copy and this save agree
     "offline"     the host can't be reached; the local save is untouched apart from a merge already stored
     "unreadable"  the cloud copy doesn't open with this code: nothing is written to it
     "update"      the cloud copy has a newer save version: nothing written
     "conflict"    still losing the race after the retries: the next trigger tries again
     "error"       another status (401, 413, 429, 5xx): `http` has it */
export async function syncOnce(o) {
  let save = o.save;
  for (let attempt = 0; attempt < SC_TRIES; attempt++) {
    if (attempt) await (o.wait || (() => Promise.resolve()))(scBackoff(o.env, attempt));
    const got = await scGet(o, o.keys);
    if (!got) return { status: "offline", save };
    if (got.status !== 200 && got.status !== 404) return { status: "error", http: got.status, save };
    let remote = null;
    if (got.status === 200) {
      const r = await openSave(o.env, o.keys, got.body);
      if (!r.ok) return { status: r.status, save };
      remote = r.payload;
      const merged = merge(save, scRemoteSave(remote));
      if (scCanon(merged) !== scCanon(save)) { save = merged; if (o.store) o.store(merged); }
    }
    const mine = syncPayload(save);
    if (remote && scCanon(mine) === scCanon(remote)) return { status: "synced", save, etag: got.etag };
    let put;
    try { put = await o.host.put(o.keys.id, o.keys.token, await sealSave(o.env, o.keys, save), remote ? { etag: got.etag } : {}); }
    catch (e) { return { status: "offline", save }; }
    if (put.status === 200 || put.status === 201) return { status: "synced", save, etag: put.etag };
    if (put.status !== 412) return { status: "error", http: put.status, save };
  }
  return { status: "conflict", save };
}
/* backoff before retry n (1–3): 500, 1000, 2000 ms plus up to half again at random, so racing devices spread out */
const scBackoff = (env, n) => { const ms = SC_BACKOFF[n - 1]; return ms + Math.floor(env.crypto.getRandomValues(new Uint8Array(1))[0] / 256 * ms / 2); };

/* The local save with the cloud copy's characters in place of its own (sync.md §1 "adopt"): view settings, backup and
   other top-level fields stay this device's; current is the first remaining character. The page copies the local save to
   ":before-import" first when it had progress ("Use the cloud copy"). */
export function adoptRemote(local, payload) {
  const out = JSON.parse(JSON.stringify(local)), rs = JSON.parse(JSON.stringify(scRemoteSave(payload)));
  out.v = rs.v; out.chars = rs.chars;
  if ("savedAt" in rs) out.savedAt = rs.savedAt; else delete out.savedAt;
  if (!out.chars[out.current] || isRemoved(out.chars[out.current])) { const first = Object.keys(out.chars).find(id => !isRemoved(out.chars[id])); if (first) out.current = first; }
  return out;
}
/* A device joining with a code (sync.md §1, "A second device joins"), never throws; nothing is ever written to the host:
     "not-found"   no cloud copy for this code (nothing created, nothing local changes)
     "unreadable" / "update" / "offline" / "error"   as in syncOnce, nothing changes
     "adopt"       this device had no progress: save is the cloud copy's characters (store(save) was called)
     "ask"         this device has progress: the page asks "Keep both" (syncOnce on the local save merges) or "Use the
                   cloud copy" (adoptRemote(save, payload)) */
export async function joinSync(o) {
  const got = await scGet(o, o.keys);
  if (!got) return { status: "offline", save: o.save };
  if (got.status === 404) return { status: "not-found", save: o.save };
  if (got.status !== 200) return { status: "error", http: got.status, save: o.save };
  const r = await openSave(o.env, o.keys, got.body);
  if (!r.ok) return { status: r.status, save: o.save };
  const local = o.save, mine = Object.keys(local.chars).filter(id => !isRemoved(local.chars[id]));
  if (mine.some(id => hasProgress({ current: id, chars: local.chars }))) return { status: "ask", save: local, payload: r.payload, etag: got.etag };
  const save = adoptRemote(local, r.payload);
  if (o.store) o.store(save);
  return { status: "adopt", save, payload: r.payload, etag: got.etag };
}
/* "Delete cloud copy": true when the host removed it (or it was already gone) */
export async function deleteCloudCopy(o) {
  try { const r = await o.host.remove(o.keys.id, o.keys.token); return r.status === 204 || r.status === 404; } catch (e) { return false; }
}
