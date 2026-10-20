#!/usr/bin/env node
/* Tiny static server for dist/ (no dependencies). Used by `npm run serve` and by the test runner.

     /                  dist/ (404s get dist/404.html, like GitHub Pages)
     /__baselines/*     tests/baselines/* (only when started with { baselines: true }, i.e. by the tests)

   Usage: node scripts/serve.mjs [--port 8080] [--host 127.0.0.1] */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

/* resolve a URL path inside a directory; null if it escapes or doesn't exist */
function inside(dir, urlPath) {
  const f = normalize(join(dir, decodeURIComponent(urlPath)));
  if (f !== dir && !f.startsWith(dir + sep)) return null;
  if (existsSync(f) && statSync(f).isDirectory()) return existsSync(join(f, 'index.html')) ? join(f, 'index.html') : null;
  return existsSync(f) ? f : null;
}

export function startServer({ port = 0, host = '127.0.0.1', baselines = false, quiet = true } = {}) {
  const DIST = join(ROOT, 'dist'), BASE = join(ROOT, 'tests', 'baselines');
  const server = createServer((req, res) => {
    let path = new URL(req.url, 'http://x').pathname, file = null;
    if (baselines && path.startsWith('/__baselines/')) file = inside(BASE, path.slice('/__baselines'.length));
    else file = inside(DIST, path);
    const status = file && existsSync(file) ? 200 : 404;
    if (status === 404) file = join(DIST, '404.html');
    if (!quiet) console.log(status, req.method, req.url);
    if (!existsSync(file)) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('not found'); return; }
    res.writeHead(status, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
  });
  return new Promise(resolve => server.listen(port, host, () => {
    const a = server.address();
    resolve({ server, url: `http://${host.includes(':') ? `[${host}]` : host}:${a.port}`, port: a.port });
  }));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
  if (!existsSync(join(ROOT, 'dist', 'index.html'))) { console.error('dist/ is missing: run `npm run build` first'); process.exit(1); }
  const { port } = await startServer({ port: +arg('port', 8080), host: arg('host', '127.0.0.1'), quiet: false });
  console.log(`serving dist/ at http://localhost:${port}/`);
}
