/* Standalone-site checks (the parts of the repo build that the single-file suites don't cover).
   node tests/site.js  (page at AION_BASE; see tests/config.js) */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const CFG = require('./config');
let fail = 0, n = 0; const ok = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 600) : '')); if (!c) fail++; };
/* fonts are self-hosted since 0.1.5; the suites block them (tests/support/block-web-fonts.cjs), so their requests fail */
const FONT_LOCAL = /\/assets\/fonts\/[^/]+\.woff2$/;
const FONT_FAMILIES = ['Marcellus SC', 'Figtree', 'JetBrains Mono'];
const FONT_FILES = ['figtree-latin', 'figtree-latin-ext', 'jetbrains-mono-latin', 'jetbrains-mono-latin-ext', 'marcellus-sc-latin', 'marcellus-sc-latin-ext'].map(f => f + '.woff2');
/* the families whose faces actually loaded, after waiting for the fonts the page uses */
const loadedFamilies = p => p.evaluate(async () => { await document.fonts.ready; await new Promise(r => setTimeout(r, 300)); await document.fonts.ready;
  return [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')))].sort(); });
const { SAVE_KEY: KEY, TEST_SLOT, writeSave, readSave, readRaw, toStored, fromStored } = require('./support/save');
const { writeFixture } = require('./support/regress-fixture');
const VERSION = JSON.parse(fs.readFileSync(path.join(CFG.ROOT, 'package.json'), 'utf8')).version;
const REPO = 'https://github.com/hackthemeatball/daeva-companion';
/* footer version link + "Report a problem" link: the version comes from package.json; the report URL carries exactly these
   issue-form fields and nothing else from the save */
const REPORT_FIELDS = ['template', 'version', 'level', 'quest', 'mode', 'build', 'browser'];
const footerMeta = p => p.evaluate(() => { const v = document.getElementById('verLink'), r = document.getElementById('reportLink');
  r.dispatchEvent(new Event('focus'));
  return { vText: v && v.textContent, vHref: v && v.getAttribute('href'), vPrev: v && v.previousElementSibling && v.previousElementSibling.textContent,
    rText: r && r.textContent, rHref: r && r.href, rTarget: r && r.target, ua: navigator.userAgent }; });
const checkReport = (label, m, want) => {
  let u = null; try { u = new URL(m.rHref); } catch (e) { /* bad URL */ }
  const keys = u ? [...u.searchParams.keys()] : [], got = u ? Object.fromEntries(u.searchParams) : {};
  ok(`${label}: "Report a problem" opens the GitHub bug form in a new tab`, m.rText === 'Report a problem' && u && u.origin + u.pathname === REPO + '/issues/new' && m.rTarget === '_blank', m);
  ok(`${label}: report link carries only version, level, story quest, mode, build and browser`,
    JSON.stringify(keys) === JSON.stringify(REPORT_FIELDS) && Object.entries({ ...want, browser: m.ua }).every(([k, v]) => got[k] === v), { keys, got, want });
  ok(`${label}: report link has nothing else from the save`, !/g22|checks|seedLv12|migV5|stTriniel|dvReset/.test(decodeURIComponent(m.rHref)), m.rHref);
  /* save v5 (0.4 P3c): never the slot id, the character label (<name>-<class>-lvl<level>) or the class */
  ok(`${label}: report link has no slot id, label or class`, !/[0-9a-f]{8}-[0-9a-f]{4}-|lvl\d|assassin/i.test(decodeURIComponent(m.rHref).replace(m.ua, '')) && !m.rHref.includes(TEST_SLOT), m.rHref);
};

(async () => {
  const b = await chromium.launch();

  /* 1. standalone page: head, footer, no errors, export as a Blob download, service worker + offline */
  {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 }, acceptDownloads: true, serviceWorkers: 'allow' }); const p = await ctx.newPage();
    const errs = [], bad = [], reqs = [];
    p.on('request', r => reqs.push(r.url()));
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
    p.on('requestfailed', r => { if (!FONT_LOCAL.test(new URL(r.url()).pathname)) bad.push(r.url() + ' ' + (r.failure() || {}).errorText); });
    p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await p.goto(CFG.CUR); await p.waitForTimeout(600);
    /* first load, before the service worker controls the page (this context allows workers; the others block them) */
    if (process.env.AION_FONTS_BLOCKED) ok('fonts: blocked in the suites (fallback fonts render; --with-fonts lifts this)', !(await loadedFamilies(p)).length);
    const head = await p.evaluate(() => ({
      mode: document.compatMode, charset: document.characterSet, title: document.title,
      viewport: (document.querySelector('meta[name=viewport]') || {}).content, desc: !!(document.querySelector('meta[name=description]') || {}).content,
      canonical: (document.querySelector('link[rel=canonical]') || {}).href, manifest: (document.querySelector('link[rel=manifest]') || {}).href,
      icon: (document.querySelector('link[rel=icon]') || {}).href, theme: (document.querySelector('meta[name=theme-color]') || {}).content,
      og: ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:type'].every(k => !!(document.querySelector(`meta[property="${k}"]`) || {}).content),
      /* link previews just say what it is: an unofficial companion app for AION 2, no class named (owner, 2026-10-20) */
      preview: ['meta[name=description]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image:alt"]'].map(q => (document.querySelector(q) || {}).content || '').concat(document.title),
      lang: document.documentElement.lang, touch: (document.querySelector('link[rel=apple-touch-icon]') || {}).href,
      brand: !!document.querySelector('header.top .brand-name[role=img][aria-label="Daeva Companion"]') }));
    ok('head: standards mode, UTF-8, title, viewport, description, canonical, theme-color, favicon, manifest, Open Graph, lang',
      head.mode === 'CSS1Compat' && head.charset === 'UTF-8' && head.title === 'Daeva Companion · unofficial companion app for AION 2' && /width=device-width/.test(head.viewport) && head.desc &&
      head.canonical === 'https://daevacompanion.com/' && head.theme === '#110c13' && /favicon\.svg$/.test(head.icon) && /manifest\.webmanifest$/.test(head.manifest) && head.og && head.lang === 'en', head);
    head.preview.push((await p.evaluate(() => fetch('manifest.webmanifest').then(r => r.json()))).description || '');
    ok('head: link preview text and the manifest description name no class and keep the NCSoft line', head.preview.every(t => t && !/Assassin|Ranger|Gladiator|Spiritmaster|Templar|Cleric|Sorcerer|Chanter/.test(t)) && /not affiliated with or endorsed by NCSoft/i.test(head.preview[2]), head.preview);
    /* element budget (0.4 P7; docs/ARCHITECTURE.md §4): fresh browser, 390 px, no save */
    {
      const ctx390 = await b.newContext({ viewport: { width: 390, height: 800 } }), p390 = await ctx390.newPage();
      await p390.goto(CFG.CUR); await p390.waitForTimeout(600);
      const els = await p390.evaluate(() => document.querySelectorAll('*').length), ELEMENT_MAX = 6200;
      console.log(`  elements at 390 px, fresh: ${els} / ${ELEMENT_MAX} (${(100 * els / ELEMENT_MAX).toFixed(0)}%)`);
      ok(`budget: at most ${ELEMENT_MAX} elements after load at 390 px with no save`, els <= ELEMENT_MAX, els);
      /* the first-run welcome (0.6 P17) calls the guide unofficial and keeps the NCSoft line; it sits above Next up */
      const wel = await p390.evaluate(() => { const w = document.getElementById('welcomeCard'), n = document.getElementById('nowStar');
        return { shown: !!w && !w.hidden, text: w ? w.innerText : '', above: !!w && !!n && w.getBoundingClientRect().bottom <= n.getBoundingClientRect().top }; });
      ok('welcome: shown on a fresh browser above Next up, "Unofficial guide", not affiliated with or endorsed by NCSoft', wel.shown && wel.above && /Unofficial guide/.test(wel.text) && /not affiliated with or endorsed by NCSoft/i.test(wel.text), wel);
      await ctx390.close();
    }
    /* 0.9 P5: the element count of a full page (1500 px, Advanced, Lv 39; logged, not gated), and setHTML (src/core/cards.js):
       a second update() with no state change rewrites none of the boxes it draws; a level change does rewrite some */
    {
      const ctxF = await b.newContext({ viewport: { width: 1500, height: 1000 } }), pf = await ctxF.newPage();
      const ferrs = []; pf.on('pageerror', e => ferrs.push(e.message));
      await pf.goto(CFG.CUR); await pf.waitForTimeout(300);
      await writeFixture(pf, { L: 39, mode: 'advanced', fx: 'clean' }); await pf.reload(); await pf.waitForTimeout(600);
      console.log(`  elements at 1500 px, Advanced, Lv 39: ${await pf.evaluate(() => document.querySelectorAll('*').length)} (logged, not gated)`);
      const W = await pf.evaluate(() => { update(); const a = htmlWrites(); update(); const same = htmlWrites() - a;
        char(state).level = 40; update(); return { same, changed: htmlWrites() - a - same }; });
      const HTML_WRITES_MAX = 0;
      ok(`setHTML: a second update() with no state change makes at most ${HTML_WRITES_MAX} real writes`, W.same <= HTML_WRITES_MAX, W);
      ok('setHTML: an update() after a level change writes (negative control)', W.changed > 0, W);
      /* Next up moved to another window (as the pop-out does; here a same-origin iframe) redraws on the next update() with
         the same markup, and again when it comes back, so its stack's timers and observer come from the window holding it */
      const MV = await pf.evaluate(() => { const n = document.getElementById('nowStar'), home = n.parentNode, next = n.nextSibling;
        const f = document.createElement('iframe'); document.body.appendChild(f);
        update(); const s0 = n.firstChild, a = htmlWrites();
        f.contentDocument.body.appendChild(n); update(); const away = { writes: htmlWrites() - a, redrawn: n.firstChild !== s0 }, s1 = n.firstChild, b2 = htmlWrites();
        home.insertBefore(n, next); update(); const back = { writes: htmlWrites() - b2, redrawn: n.firstChild !== s1 };
        f.remove(); return { away, back }; });
      ok('setHTML: Next up moved into another window and back is redrawn both times', MV.away.redrawn && MV.away.writes > 0 && MV.back.redrawn && MV.back.writes > 0, MV);
      ok('setHTML: no page errors', !ferrs.length, ferrs);
      await ctxF.close();
    }
    /* Your class on the welcome (0.8 P12, #501): every class of the game from the pack, a class with a guide pickable, the
       rest "Soon"; a pick other than the Assassin carries into Start and the join form, leaving one character of it */
    {
      const ctxC = await b.newContext({ viewport: { width: 360, height: 800 } }), pc = await ctxC.newPage();
      const perrs = []; pc.on('pageerror', e => perrs.push(e.message));
      await pc.goto(CFG.CUR); await pc.waitForTimeout(500);
      const cl = await pc.evaluate(() => {
        const g = document.getElementById('welClasses'), bs = [...g.querySelectorAll('.welclass')];
        /* the colour behind an element: its own, else its nearest ancestor's that isn't transparent */
        const bgOf = e => { for (; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (!/rgba\(.*, 0\)$|transparent/.test(c)) return c; } return 'rgb(0, 0, 0)'; };
        const lum = c => { const [r, gg, bb] = c.match(/[\d.]+/g).slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; };
        const ratio = (a, b2) => { const [x, y] = [lum(a), lum(b2)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        const soon = bs.filter(x => x.classList.contains('welsoon')).map(x => { const s = x.querySelector('small'), cs = getComputedStyle(s);
          return { cls: x.dataset.class, text: s.textContent, px: parseFloat(cs.fontSize), ratio: ratio(cs.color, bgOf(x)), nameRatio: ratio(getComputedStyle(x.querySelector('span')).color, bgOf(x)) }; });
        const sm = bs.find(x => x.dataset.class === 'spiritmaster'), smName = sm && sm.querySelector('span');
        const rows = new Set(bs.map(x => Math.round(x.getBoundingClientRect().top))).size;
        return { role: g.getAttribute('role'), label: (document.getElementById(g.getAttribute('aria-labelledby')) || {}).textContent, n: bs.length,
          classes: bs.map(x => x.dataset.class), checked: bs.filter(x => x.getAttribute('aria-checked') === 'true').map(x => x.dataset.class), soon, rows,
          smFits: !!smName && smName.scrollWidth <= smName.clientWidth + 0.5 && smName.getBoundingClientRect().right <= sm.getBoundingClientRect().right && sm.scrollWidth <= sm.clientWidth,
          noTick: !/✓|✔/.test(g.textContent), emblems: bs.every(x => { const i = x.querySelector('img'); return i && i.complete && i.naturalWidth > 0 && /\.webp$/.test(i.getAttribute('src')); }),
          playable: packClasses().map(e => e.class), packs: Object.fromEntries(packClasses().map(e => [e.class, e.pack])), game: (activePack().gameClasses || []).map(e => e.class) };
      });
      ok('welcome class: a radiogroup "Your class" of every class of the game (the pack\'s list), emblem and name each, Assassin picked, no check mark',
        cl.role === 'radiogroup' && cl.label === 'Your class' && cl.n === 8 && JSON.stringify(cl.classes) === JSON.stringify(cl.game) && JSON.stringify(cl.checked) === '["assassin"]' && cl.noTick && cl.emblems, cl);
      ok('welcome class: exactly the classes without a guide pack say "Soon"', JSON.stringify(cl.soon.map(s => s.cls)) === JSON.stringify(cl.game.filter(c => !cl.playable.includes(c))) && cl.soon.every(s => s.text === 'Soon'), cl.soon);
      ok('welcome class: "Soon" text is at least 12 px and 4.5:1 against its badge (name too)', cl.soon.every(s => s.px >= 12 && s.ratio >= 4.5 && s.nameRatio >= 4.5), cl.soon);
      ok('welcome class: 4 × 2 at 360 px, "Spiritmaster" fits its badge', cl.rows === 2 && cl.smFits, cl);
      /* a "Soon" badge can't be picked */
      const soonCls = cl.soon.length ? cl.soon[0].cls : null;
      /* force: Playwright won't click an aria-disabled element, which is the point here */
      if (soonCls) await pc.click(`.welclass[data-class="${soonCls}"]`, { force: true });
      ok('welcome class: clicking a "Soon" class picks nothing', await pc.evaluate(() => [...document.querySelectorAll('.welclass[aria-checked="true"]')].map(x => x.dataset.class).join()) === 'assassin');
      /* 0.8.1 F4 (#586): the page header follows a pick at once, before Start; picking the Assassin again restores it */
      {
        const head = () => pc.evaluate(() => [document.querySelector('h1').textContent, document.querySelector('.eyebrow > span:first-child').textContent]);
        const h0 = await head(), other = cl.playable.find(c => c !== 'assassin');
        const otherName = await pc.evaluate(c => packClasses().find(e => e.class === c).name, other);
        await pc.click(`.welclass[data-class="${other}"]`); const h1 = await head();
        await pc.click('.welclass[data-class="assassin"]'); const h2 = await head();
        ok(`welcome class: picking ${other} renames the page header at once, the Assassin again restores it`,
          h0[0] === 'Asmodian Assassin Route' && h1[0] === `Asmodian ${otherName} Route` && h1[1].includes(` · ${otherName} · `) && !h1[1].includes('Assassin')
          && JSON.stringify(h2) === JSON.stringify(h0) && !(await pc.evaluate(() => document.getElementById('welcomeCard').hidden)), { h0, h1, h2 });
      }
      /* each class with a guide: a fresh browser starts as it, one character of that class (no leftover Assassin slot) */
      const live = () => pc.evaluate(k => Object.values(JSON.parse(localStorage.getItem(k)).chars).filter(c => !c.deletedAt).map(c => c.class), KEY).catch(e => String(e));
      for (const c of cl.playable) {
        await pc.evaluate(() => localStorage.clear()); await pc.goto(CFG.CUR); await pc.waitForTimeout(400);
        await pc.click(`.welclass[data-class="${c}"]`);
        await Promise.all([c === 'assassin' ? Promise.resolve() : pc.waitForEvent('load'), pc.click('#welStart')]); await pc.waitForTimeout(400);
        const got = await pc.evaluate(() => ({ chars: Object.values(state.chars).filter(x => !x.deletedAt).map(x => x.class), cls: char(state).class, pack: self.DAEVA_PACK, welcome: !document.getElementById('welcomeCard').hidden }));
        ok(`welcome class: Start as ${c} leaves one character, a ${c} on its own guide, welcome gone`, JSON.stringify(got.chars) === JSON.stringify([c]) && got.cls === c && got.pack === cl.packs[c] && !got.welcome
          && JSON.stringify(await live()) === JSON.stringify([c]), got);
      }
      /* the pick carries into the join form */
      await pc.evaluate(() => localStorage.clear()); await pc.goto(CFG.CUR); await pc.waitForTimeout(400);
      const joinCls = cl.playable.find(c => c !== 'assassin');
      await pc.click(`.welclass[data-class="${joinCls}"]`); await pc.click('#welJoin');
      await pc.evaluate(() => { const r = document.getElementById('welLv'); r.value = '12'; r.dispatchEvent(new Event('input')); });
      await Promise.all([pc.waitForEvent('load'), pc.click('#welGo')]); await pc.waitForTimeout(400);
      const joined = await pc.evaluate(() => ({ chars: Object.values(state.chars).filter(x => !x.deletedAt).map(x => x.class), lv: char(state).level, quest: char(state).quest, welcomed: state.welcomed }));
      ok(`welcome class: the pick carries into the join form (${joinCls} at Lv 12, its story quest, welcomed)`, JSON.stringify(joined.chars) === JSON.stringify([joinCls]) && joined.lv === 12 && !!joined.quest && joined.welcomed === 1, joined);
      ok('welcome class: no page errors', !perrs.length, perrs);
      await ctxC.close();
    }
    ok('brand: apple-touch-icon link, Daeva Companion lockup in the header', /icons\/apple-touch-icon\.png$/.test(head.touch) && head.brand, head);
    const foot = await p.evaluate(() => { const f = document.querySelector('.fanline'), links = f ? [...f.querySelectorAll('a')] : [];
      return { text: f ? f.innerText : '', links: links.map(a => [a.textContent, a.getAttribute('href'), a.getAttribute('rel')]) }; });
    const mb = foot.links.find(l => l[0] === 'Metabot');
    ok('footer: fan-made / not affiliated with NCSoft line', /not affiliated with or endorsed by NCSoft/.test(foot.text), foot);
    ok('footer: Sources link + plain (dofollow) Metabot link', foot.links.some(l => l[0] === 'Sources' && l[1] === '#srcCard') && mb && /^https:\/\/metabot\.gg\//.test(mb[1]) && !/nofollow/.test(mb[2] || ''), foot.links);
    await p.click('#srcLink'); await p.waitForTimeout(150);
    ok('footer: the Sources link opens the Sources card', await p.evaluate(() => document.getElementById('srcCard').open));
    ok('all icons load (no broken images)', await p.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src'))).then(x => !x.length), await p.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src'))));
    /* export without window.claude: visible button, plain Blob download of the saved state */
    await writeSave(p, { checks: { 'g22:0': true }, level: 27, open: {}, quest: 'Preparations for Restoration' });
    await p.reload(); await p.waitForTimeout(500);
    const fm = await footerMeta(p);
    ok('footer: version after the Privacy link equals package.json, links to the CHANGELOG', fm.vText === 'v' + VERSION && fm.vPrev === 'Privacy' && fm.vHref === REPO + '/blob/main/CHANGELOG.md', { fm, VERSION });
    checkReport('footer', fm, { template: 'bug.yml', version: VERSION, level: '27', quest: 'Preparations for Restoration', mode: 'Advanced', build: 'site' });
    await p.click('.modeseg [data-mode=basic]'); await p.click('#lvlUp'); await p.waitForTimeout(100);
    const fm2 = await footerMeta(p), lv2 = await p.evaluate(() => String(char(state).level));
    checkReport('footer after a change', fm2, { template: 'bug.yml', version: VERSION, level: lv2, quest: 'Preparations for Restoration', mode: 'Basic', build: 'site' });
    await p.click('.modeseg [data-mode=advanced]'); await p.click('#lvlDown'); await p.waitForTimeout(100);
    ok('export: button visible outside claude.ai', await p.evaluate(() => !document.getElementById('expBtn').hidden));
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#expBtn')]);
    const exported = JSON.parse(fs.readFileSync(await dl.path(), 'utf8')), live = await p.evaluate(() => state);
    ok('export: Blob download equals the saved state', JSON.stringify(exported) === JSON.stringify(live) && fromStored(exported).level === 27 && /^companion-save-\d{4}-\d\d-\d\d\.json$/.test(dl.suggestedFilename()), dl.suggestedFilename());
    /* service worker */
    const sw = await p.evaluate(async () => { const r = await Promise.race([navigator.serviceWorker.ready, new Promise(res => setTimeout(() => res(null), 8000))]);
      return { ok: !!r, scope: r && r.scope, keys: await caches.keys(), build: await fetch('build.json').then(x => x.json()).then(x => x.build).catch(() => null) }; });
    ok('service worker registers on localhost (scope = site root)', sw.ok && sw.scope === CFG.BASE + '/', sw);
    ok('service worker cache is named after the build', sw.build && sw.keys.includes('aion2-route-' + sw.build), sw);
    await p.reload(); await p.waitForTimeout(400);
    ok('page is controlled by the service worker after a reload', await p.evaluate(() => !!navigator.serviceWorker.controller));
    await ctx.setOffline(true);
    await p.reload(); await p.waitForTimeout(700);
    const off = await p.evaluate(() => ({ cards: document.querySelectorAll('#nowStar .ns-card').length, lv: char(state).level, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length }));
    ok('offline: the app shell, icons and saved progress load from the cache', off.cards > 0 && off.lv === 27 && off.broken === 0, off);
    /* 0.6 P2: the class's own tables are a file of their own (dist/packs/<id>.<hash>.js), precached */
    const offChunk = await p.evaluate(() => ({ pack: self.DAEVA_PACK, pack2: char(state).pack, tables: !!self.DAEVA_CLASS && Object.keys(self.DAEVA_CLASS).length,
      file: performance.getEntriesByType('resource').map(e => new URL(e.name).pathname).filter(x => /\/packs\/[\w.-]+\.js$/.test(x)), html: [...document.scripts].filter(s => s.src).map(s => new URL(s.src).pathname) }));
    ok('offline: the current character\'s class chunk (packs/<id>.<hash>.js) loads from the service worker cache', offChunk.pack === offChunk.pack2 && offChunk.tables > 0 && offChunk.file.length === 1
      && offChunk.html.some(x => x === offChunk.file[0]) && fs.readFileSync(path.join(CFG.ROOT, 'dist', 'sw.js'), 'utf8').includes(`"${offChunk.file[0].slice(1)}"`), offChunk);
    /* 0.8 P6: the sync line is a chunk of its own (dist/sync.<hash>.js), precached; with sync shown (the test flag) it
       mounts offline too */
    {
      const syncFiles = fs.readdirSync(path.join(CFG.ROOT, 'dist')).filter(f => /^sync\.[0-9a-f]{8}\.js$/.test(f));
      const p2 = await ctx.newPage(), errs2 = []; p2.on('pageerror', e => errs2.push(e.message));
      await p2.addInitScript(() => { window.__dcSyncTest = true; });
      await p2.goto(CFG.CUR); await p2.waitForTimeout(700);
      const offSync = await p2.evaluate(() => ({ sw: !!document.getElementById('dcsSw'), lbl: (document.getElementById('dcsLbl') || {}).textContent || '', css: getComputedStyle(document.getElementById('dcsLine')).display,
        file: performance.getEntriesByType('resource').map(e => new URL(e.name).pathname).filter(x => /\/sync\.[0-9a-f]{8}\.js$/.test(x)) }));
      ok('offline: with sync shown, the sync chunk (sync.<hash>.js, precached) loads from the service worker cache and mounts the sync line',
        syncFiles.length === 1 && offSync.sw && !!offSync.lbl && offSync.css === 'flex' && offSync.file.length === 1 && offSync.file[0].endsWith('/' + syncFiles[0])
        && fs.readFileSync(path.join(CFG.ROOT, 'dist', 'sw.js'), 'utf8').includes(`"${syncFiles[0]}"`) && !errs2.length, { offSync, syncFiles, errs2 });
      await p2.close();
    }
    await ctx.setOffline(false);
    ok('no page errors, failed requests or 4xx/5xx (the blocked font files aside)', !errs.length && !bad.length, { errs, bad });
    const third = reqs.filter(u => !u.startsWith(CFG.BASE + '/') && !/^(data|blob):/.test(u));
    ok('no third-party requests (fonts come from this site)', !third.length && reqs.some(u => FONT_LOCAL.test(new URL(u).pathname)), third);
    await ctx.close();
  }

  /* 2. manifest, 404, robots, CNAME */
  {
    const ctx = await b.newContext(), p = await ctx.newPage();
    const m = await (await p.request.get(CFG.BASE + '/manifest.webmanifest')).json();
    const icons = await Promise.all(m.icons.map(async i => [i.src, (await p.request.get(CFG.BASE + '/' + i.src)).status()]));
    ok('manifest: name, start_url, standalone, colors, 192/512 icons all served', m.name && m.short_name && m.start_url && m.display === 'standalone' && m.theme_color === '#0b1b1e' && m.background_color === '#110c13' &&
      ['192x192', '512x512'].every(s => m.icons.some(i => i.sizes === s)) && icons.every(([, s]) => s === 200), { m, icons });
    ok('manifest: Daeva Companion; separate "any" and "maskable" PNGs at 192 and 512 (no "any maskable")', /^Daeva Companion/.test(m.name) && m.short_name.length <= 12 &&
      ['any', 'maskable'].every(pu => ['192x192', '512x512'].every(s => m.icons.some(i => i.sizes === s && i.purpose === pu && /\.png$/.test(i.src)))) &&
      m.icons.every(i => !/ /.test(i.purpose)) && new Set(m.icons.map(i => i.src)).size === m.icons.length, m.icons);
    const touch = await p.request.get(CFG.BASE + '/icons/apple-touch-icon.png');
    ok('apple-touch-icon: 180 px PNG served', touch.status() === 200 && touch.headers()['content-type'] === 'image/png' && (await touch.body()).readUInt32BE(16) === 180);
    const r404 = await p.goto(CFG.BASE + '/no-such-page');
    ok('404: status 404 with the styled page and a link home', r404.status() === 404 && /Off the route/.test(await p.innerText('h1')) && await p.getAttribute('a.btn', 'href') === '/');
    const robots = await (await p.request.get(CFG.BASE + '/robots.txt')).text(), cname = await (await p.request.get(CFG.BASE + '/CNAME')).text();
    ok('robots.txt allows all + sitemap; CNAME is daevacompanion.com', /Allow: \//.test(robots) && /Sitemap: https:\/\/daevacompanion\.com\/sitemap\.xml/.test(robots) && cname.trim() === 'daevacompanion.com', { robots, cname });
    await ctx.close();
  }

  /* 2b. self-hosted fonts: no Google Fonts anywhere in the built files; files + OFL texts shipped, served and precached;
     with the blocker lifted, all three families load in the site and the 404 page */
  {
    const D = path.join(CFG.ROOT, 'dist'), rd = f => fs.readFileSync(path.join(CFG.ROOT, f), 'utf8');
    const built = { 'dist/index.html': rd('dist/index.html'), 'dist/404.html': rd('dist/404.html'), 'dist/sw.js': rd('dist/sw.js') };
    const google = Object.keys(built).filter(f => /fonts\.(googleapis|gstatic)\.com/.test(built[f]));
    ok('fonts: no fonts.googleapis.com / fonts.gstatic.com in the built HTML or service worker', !google.length, google);
    const shipped = fs.readdirSync(path.join(D, 'assets', 'fonts')).sort();
    ok('fonts: six WOFF2 files and three OFL license texts shipped in dist/assets/fonts', JSON.stringify(shipped) === JSON.stringify([...['OFL-Figtree.txt', 'OFL-JetBrainsMono.txt', 'OFL-MarcellusSC.txt'], ...FONT_FILES].sort()), shipped);
    ok('fonts: every font file is in the service worker precache', FONT_FILES.every(f => built['dist/sw.js'].includes(`"assets/fonts/${f}"`)));
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } }); await ctx.unrouteAll(); const p = await ctx.newPage();
    const served = await Promise.all(FONT_FILES.map(async f => { const r = await p.request.get(CFG.BASE + '/assets/fonts/' + f); return [f, r.status(), r.headers()['content-type']]; }));
    ok('fonts: served as font/woff2', served.every(([, s, t]) => s === 200 && t === 'font/woff2'), served);
    await p.goto(CFG.CUR); const site = await loadedFamilies(p);
    await p.goto(CFG.BASE + '/no-such-page'); const nf = await loadedFamilies(p);
    ok('fonts: Marcellus SC, Figtree and JetBrains Mono load in the site and the 404 page', [site, nf].every(x => JSON.stringify(x) === JSON.stringify([...FONT_FAMILIES].sort())), { site, nf });
    await ctx.close();
  }

  /* 2c. persistent storage: asked only with saved progress, once per browser session; nothing is added to localStorage */
  {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
    await ctx.addInitScript(() => { if (!navigator.storage) return;
      navigator.storage.persisted = async () => false;
      navigator.storage.persist = async () => { window.name = String(+(window.name || 0) + 1); return false; }; });
    const p = await ctx.newPage(), calls = () => p.evaluate(() => +(window.name || 0));
    await p.goto(CFG.CUR); await p.waitForTimeout(400);
    const fresh = await calls();
    await writeSave(p, { checks: {}, level: 12, open: {}, quest: '' });
    await p.reload(); await p.waitForTimeout(400); const first = await calls();
    await p.reload(); await p.waitForTimeout(400); const again = await calls();
    const lsKeys = await p.evaluate(() => Object.keys(localStorage).sort());
    await p.evaluate(k => sessionStorage.removeItem(k + ':persist-asked'), KEY);
    await p.reload(); await p.waitForTimeout(400); const session = await calls();
    ok('persistent storage: not asked without saved progress; asked once with it; not again in the same session; again in a new session',
      fresh === 0 && first === 1 && again === 1 && session === 2, { fresh, first, again, session });
    ok('persistent storage: nothing added to localStorage', JSON.stringify(lsKeys) === JSON.stringify([KEY]), lsKeys);
    await ctx.close();
  }

  /* 2d. a save that throws shows the warning banner with Export; the next save that works hides it; the data is unchanged */
  {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 }, acceptDownloads: true });
    await ctx.addInitScript(k => { const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, v) { if (key === k && sessionStorage.getItem('__test:failSave') === '1') throw new DOMException('The quota has been exceeded.', 'QuotaExceededError'); return set.call(this, key, v); }; }, KEY);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(CFG.CUR);
    await writeSave(p, { checks: { 'g22:0': true }, level: 27, open: {}, quest: 'Preparations for Restoration' });
    await p.reload(); await p.waitForTimeout(400);
    const vis = () => p.evaluate(() => { const w = document.getElementById('saveWarn'), r = w.getBoundingClientRect();
      return { shown: !w.hidden && r.height > 0, text: w.innerText.trim(), exp: !document.getElementById('saveWarnExp').hidden, role: w.getAttribute('role') }; });
    await p.click('#lvlUp'); await p.waitForTimeout(100);
    const before = await vis();
    ok('save warning: hidden while saving works', !before.shown, before);
    await p.evaluate(() => sessionStorage.setItem('__test:failSave', '1'));
    await p.click('#lvlUp'); await p.waitForTimeout(100);
    const failed = await vis(), stored = (await readSave(p)).level;
    ok('save warning: shown when localStorage.setItem throws, with the Export action', failed.shown && failed.exp && failed.role === 'alert' && /^Your progress couldn.t be saved in this browser\. Export a backup\./.test(failed.text) && stored === 28, { failed, stored });
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#saveWarnExp')]);
    const exported = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
    ok('save warning: its Export button downloads the current (unsaved) progress', fromStored(exported).level === 29 && JSON.stringify(exported) === JSON.stringify(await p.evaluate(() => state)), fromStored(exported).level);
    await p.evaluate(() => sessionStorage.setItem('__test:failSave', '0'));
    await p.click('#lvlDown'); await p.waitForTimeout(100);
    /* the raw stored text vs the in-memory state (the page stores JSON.stringify(state)) */
    const back = await vis(), saved = (await readRaw(p)) === await p.evaluate(() => JSON.stringify(state));
    ok('save warning: hidden after the next successful save; saved data is exactly the state, under the same key', !back.shown && saved, { back, saved });
    ok('save warning: no page errors', !errs.length, errs);
    await ctx.close();
  }

  /* 2e. save safety (0.2.5, docs/design/0.2.5-save-safety.md §6): the "Last backup" line, the 14-day export nudge, the
     import rule and the one-time iPhone Safari Home Screen hint, with a fixed clock in a fixed time zone (noon, New York,
     no clock change in the days used) */
  {
    const T = Date.parse('2026-09-30T16:00:00Z'), DAY = 864e5, TZ = 'America/New_York';
    const SAVED = { checks: { 'g22:0': true }, level: 27, open: {}, quest: 'Preparations for Restoration' };
    const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    const page = async (opts = {}, init) => {
      const ctx = await b.newContext({ viewport: { width: opts.w || 1500, height: 1000 }, acceptDownloads: true, timezoneId: TZ, ...(opts.ua ? { userAgent: opts.ua } : {}) });
      if (init) await ctx.addInitScript(init);
      const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.clock.setFixedTime(T); await p.goto(CFG.CUR); await p.waitForTimeout(300);
      return { ctx, p, errs };
    };
    const load = async (p, save) => { await writeSave(p, save, { fresh: true }); await p.reload(); await p.waitForTimeout(400); };
    /* keys: every localStorage key (this checks that an export adds none) */
    const ui = async p => { const u = await p.evaluate(() => { const vis = id => { const e = document.getElementById(id); return !!e && !e.hidden && e.getBoundingClientRect().height > 0; };
      const l = document.getElementById('backupLine');
      return { line: l && l.textContent, stale: !!l && l.classList.contains('stale'), nudge: vis('nudge'), nudgeTxt: (document.getElementById('nudgeTxt') || {}).textContent,
        hint: vis('a2hs'), keys: Object.keys(localStorage).sort() }; });
      const s = await readSave(p), { keys, ...rest } = u;
      return { ...rest, backup: s && s.backup, keys }; };

    /* line + export */
    {
      const { ctx, p, errs } = await page();
      await load(p, { ...SAVED, backup: { since: T - 3 * DAY } });
      const a = await ui(p);
      ok('backup line: "No backup yet." in the export row before any export; no nudge (baseline 3 days old)', a.line === 'No backup yet.' && !a.stale && !a.nudge && !a.hint, a);
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#expBtn')]); await p.waitForTimeout(100);
      const file = JSON.parse(fs.readFileSync(await dl.path(), 'utf8')), c = await ui(p), stored = await readRaw(p);
      ok('backup line: after Export it reads "Last backup: today." and the save has backup.lastExportAt (no reload)', c.line === 'Last backup: today.' && c.backup && c.backup.lastExportAt === T && c.backup.since === T - 3 * DAY, c);
      ok('backup line: the export added no localStorage key; the save is still under ' + KEY, JSON.stringify(c.keys) === JSON.stringify(a.keys) && c.keys.includes(KEY), { before: a.keys, after: c.keys });
      ok('backup line: the exported file equals the stored save, lastExportAt included (stored before the file is built)', JSON.stringify(file) === JSON.stringify(JSON.parse(stored)) && file.backup.lastExportAt === T && file.backup.since === T - 3 * DAY, { file: file.backup, stored });
      for (const [n, text, stale] of [[1, 'Last backup: yesterday.', false], [13, 'Last backup: 13 days ago.', false], [14, 'Last backup: 14 days ago.', true]]) {
        await load(p, { ...SAVED, backup: { since: T - 99 * DAY, lastExportAt: T - n * DAY } }); const u = await ui(p);
        ok(`backup line: ${n} day(s) after an export: "${text}"${stale ? ', amber' : ''}`, u.line === text && u.stale === stale, u);
      }
      ok('backup line: no page errors', !errs.length, errs);
      await ctx.close();
    }
    /* nudge */
    {
      const { ctx, p, errs } = await page();
      await load(p, { ...SAVED, backup: { lastExportAt: T - 13 * DAY } });
      ok('nudge: not shown 13 days after an export', !(await ui(p)).nudge);
      await load(p, { ...SAVED, backup: { lastExportAt: T - 14 * DAY } });
      const n14 = await ui(p);
      ok('nudge: shown on day 14, same N as the line', n14.nudge && n14.nudgeTxt === "You haven't exported a backup in 14 days. Progress lives in this browser only." && n14.line === 'Last backup: 14 days ago.', n14);
      await load(p, { ...SAVED, backup: { lastExportAt: T - 15 * DAY } });
      const role = await p.evaluate(() => { const c = document.getElementById('nudge'); return c.closest('[role=status]') && c.closest('[role=status]').id; });
      ok('nudge: shown at 15 days in the full view, inside the role=status slot', (await ui(p)).nudge && role === 'bkNote', role);
      await p.click('.modeseg [data-mode=basic]'); await p.waitForTimeout(100);
      ok('nudge: shown in Basic mode too', (await ui(p)).nudge);
      await p.evaluate(() => setSaveWarn(true));
      const sw = (await ui(p)).nudge; await p.evaluate(() => setSaveWarn(false));
      ok('nudge: hidden while the save-failed banner shows, back when it goes', !sw && (await ui(p)).nudge, sw);
      await p.click('#nudgeNo'); await p.waitForTimeout(100);
      const no = await ui(p); await p.reload(); await p.waitForTimeout(400); const no2 = await ui(p);
      ok('nudge: Not now hides it, records nudgeAt and it stays gone after a reload', !no.nudge && no.backup.nudgeAt === T && !no2.nudge && !no2.hint, { no, no2 });
      await load(p, { ...SAVED, backup: { since: T - 30 * DAY } });
      const yet = await ui(p);
      ok('nudge: never exported, baseline 30 days old: the "yet" text', yet.nudge && yet.nudgeTxt === "You haven't exported a backup yet. Progress lives in this browser only." && yet.line === 'No backup yet.', yet);
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#nudgeExp')]); await p.waitForTimeout(100);
      const ex = await ui(p);
      ok('nudge: its Export downloads the progress, hides the card and updates the line', !!dl && !ex.nudge && ex.line === 'Last backup: today.' && ex.backup.lastExportAt === T, ex);
      await load(p, { checks: {}, level: 1, open: {}, quest: '', backup: { since: T - 30 * DAY } });
      ok('nudge: no progress (Lv 1, no ticks) = no nudge', !(await ui(p)).nudge);
      ok('nudge: no page errors', !errs.length, errs);
      await ctx.close();
    }
    /* import */
    {
      const { ctx, p, errs } = await page();
      await load(p, { ...SAVED, backup: { lastExportAt: T - 2 * DAY } });
      const file = toStored({ ...SAVED, level: 30, backup: { since: T - 40 * DAY, lastExportAt: T - 20 * DAY, nudgeAt: T - 30 * DAY, a2hsAt: T - 30 * DAY } });
      await p.setInputFiles('#impIn', { name: 'progress.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(file)) });
      await Promise.all([p.waitForEvent('load'), p.click('#impGo')]); await p.waitForTimeout(400);
      const u = await ui(p);
      ok('import: the file\'s backup is replaced by { since, lastExportAt } = the import time; no nudge; line "today"',
        JSON.stringify(u.backup) === JSON.stringify({ since: T, lastExportAt: T }) && !u.nudge && u.line === 'Last backup: today.' && await p.evaluate(() => char(state).level === 30), u);
      ok('import: no page errors', !errs.length, errs);
      await ctx.close();
    }
    /* Home Screen hint */
    {
      const { ctx, p, errs } = await page({ ua: IPHONE, w: 390 });
      await load(p, { ...SAVED, backup: { since: T - 2 * DAY } });
      const h = await ui(p), txt = await p.evaluate(() => document.querySelector('#a2hs span').textContent);
      ok('hint: shown in iPhone Safari with progress, in the same role=status slot', h.hint && !h.nudge && /^Safari can clear a site's saved data/.test(txt) && await p.evaluate(() => document.getElementById('a2hs').closest('[role=status]').id === 'bkNote'), { h, txt });
      await Promise.all([p.waitForEvent('download'), p.click('#a2hsExp')]); await p.waitForTimeout(100);
      ok('hint: its Export keeps the card (Share and Add to Home Screen come next)', (await ui(p)).hint);
      await p.click('#a2hsOk'); await p.waitForTimeout(100);
      const ok1 = await ui(p); await p.reload(); await p.waitForTimeout(400); const ok2 = await ui(p);
      ok('hint: Got it hides it for good (a2hsAt stored; gone after a reload)', !ok1.hint && ok1.backup.a2hsAt === T && !ok2.hint, { ok1, ok2 });
      await load(p, { ...SAVED, backup: { since: T - 20 * DAY } });
      const both = await ui(p);
      ok('hint: when the nudge is due too, only the nudge shows', both.nudge && !both.hint, both);
      ok('hint: no page errors', !errs.length, errs);
      await ctx.close();
      const absent = {};
      for (const [name, ua, init] of [['desktop', null], ['Chrome on iOS', IPHONE.replace('Version/18.0', 'CriOS/130.0.0.0')], ['in-app WebView', IPHONE.replace(' Safari/604.1', ' Instagram 350.0')],
        ['opened from the Home Screen', IPHONE, () => Object.defineProperty(navigator, 'standalone', { get: () => true })]]) {
        const x = await page({ ua, w: 390 }, init); await load(x.p, { ...SAVED, backup: { since: T - 2 * DAY } });
        absent[name] = (await ui(x.p)).hint; await x.ctx.close();
      }
      ok('hint: absent on desktop, Chrome on iOS, an in-app WebView and when opened from the Home Screen', Object.values(absent).every(v => !v), absent);
    }
  }

  /* 3. the site's icons (the claude.ai build and its /_blob/ checks went in 0.7 P9): every icon dist/index.html and its class
     chunks name (0.6 P2: the class tables, skill icons among them, ship in dist/packs/) is in dist/assets/icons */
  {
    const chunkFiles = fs.readdirSync(path.join(CFG.ROOT, 'dist', 'packs')).filter(f => f.endsWith('.js'));
    const web = [path.join(CFG.ROOT, 'dist', 'index.html'), ...chunkFiles.map(f => path.join(CFG.ROOT, 'dist', 'packs', f))].map(f => fs.readFileSync(f, 'utf8')).join('\n');
    const icons = [...new Set([...web.matchAll(/assets\/icons\/([\w-]+)\.png/g)].map(x => x[1]))];
    ok('site build: every icon the page and its class chunks name is in dist/assets/icons', chunkFiles.length > 0 && icons.length > 0 && icons.every(n => fs.existsSync(path.join(CFG.ROOT, 'dist', 'assets', 'icons', n + '.png'))), icons.filter(n => !fs.existsSync(path.join(CFG.ROOT, 'dist', 'assets', 'icons', n + '.png'))));
  }

  /* 8. sync UI (0.7 P6, docs/design/0.7-sync-mockup.md): every S2 state against the fake host (tests/fixtures/fake-host.mjs)
     behind the real base URL; the code never in an Export, the Report link or the save */
  {
    const { pathToFileURL } = require('url');
    const { fakeHost } = await import(pathToFileURL(path.join(CFG.ROOT, 'tests/fixtures/fake-host.mjs')).href);
    const M = await (await import(pathToFileURL(path.join(CFG.ROOT, 'tests/support/core-bundle.mjs')).href)).coreBundle();
    const T = JSON.parse(fs.readFileSync(path.join(CFG.ROOT, 'data/ui/sync-texts.json'), 'utf8')).texts;
    const host = fakeHost(), net = { down: false, race: false, status: 0, hold: null, n: 0 };
    const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type, if-match, if-none-match', 'access-control-allow-methods': 'GET, PUT, DELETE', 'access-control-expose-headers': 'etag' };
    const route = async r => {
      const q = r.request(), m = /^https:\/\/sync\.daevacompanion\.com\/v1\/s\/([^/?#]+)$/.exec(q.url()), h = await q.allHeaders();
      if (q.method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS });
      net.n++;
      if (net.down || !m) return r.abort('internetdisconnected');
      if (net.hold) await net.hold;
      const token = String(h.authorization || '').replace(/^Bearer /, '');
      let x = q.method() === 'GET' ? await host.get(m[1], token)
        : q.method() === 'PUT' ? (net.race ? { status: 412 } : await host.put(m[1], token, new Uint8Array(q.postDataBuffer()), h['if-match'] ? { etag: h['if-match'] } : {}))
        : await host.remove(m[1], token);
      if (net.status) x = { status: net.status };
      return r.fulfill({ status: x.status, headers: { ...CORS, ...(x.etag ? { etag: x.etag } : {}) }, body: x.body ? Buffer.from(x.body) : '' });
    };
    const device = async (w = 1500) => { const c = await b.newContext({ viewport: { width: w, height: 1000 }, acceptDownloads: true }); await c.route('https://sync.daevacompanion.com/**', route); await c.addInitScript(() => { window.__dcSyncTest = true; });
      const pg = await c.newPage(), errs = []; pg.on('pageerror', e => errs.push(e.message)); await pg.goto(CFG.CUR); await pg.waitForTimeout(500); return { c, p: pg, errs }; };
    const ui = pg => pg.evaluate(() => { const $ = id => document.getElementById(id), vis = e => !!e && !e.hidden && e.getClientRects().length > 0;
      return { on: $('dcsSw').getAttribute('aria-checked'), st: $('dcsSt').textContent, tone: $('dcsSt').className, strip: document.querySelector('#xfer .xfer-text > span').textContent,
        now: vis($('dcsNow')), opts: vis($('dcsOpts')), reload: vis($('dcsReload')), panel: vis($('dcsPanel')) ? $('dcsPanel').textContent : '', menu: vis($('dcsMenu')) ? $('dcsMenu').innerText : '',
        msg: $('dcsMsg').textContent, code: ($('dcsPanel').querySelector('.sync-code') || {}).textContent || '', rec: localStorage.getItem('companion-sync-v1'), focus: document.activeElement && document.activeElement.id }; });
    const until = async (pg, f, ms = 8000) => { const t = Date.now(); let u; while (Date.now() - t < ms) { u = await ui(pg); if (f(u)) return u; await pg.waitForTimeout(100); } return u; };
    const clickText = (pg, text) => pg.locator('#dcsPanel button:visible, #dcsMenu button:visible').filter({ hasText: text }).first().click();
    const syncedRe = new RegExp('^' + T['status.synced'].replace('{ago}', T['ago.now']) + '$');

    const A = await device(), p = A.p;
    let u = await ui(p);
    ok('sync n1: off on load: switch off, no status, no Sync now / options, today\'s strip sentence, no request', u.on === 'false' && !u.st && !u.now && !u.opts && !u.panel && u.strip === 'Progress is saved in this browser only.' && net.n === 0, { u, n: net.n });
    await p.click('#dcsSw'); u = await ui(p);
    ok('sync t1: the switch opens "Turn on sync" with its two choices and Cancel; panel focused; strip unchanged', u.on === 'true' && u.panel.includes(T['on.title']) && u.panel.includes(T['on.new']) && u.panel.includes(T['on.have']) && u.focus === 'dcsPanel' && u.strip === 'Progress is saved in this browser only.', u);
    await clickText(p, T.cancel); u = await ui(p);
    ok('sync t1: Cancel closes the panel, switch back off, focus back on the switch', u.on === 'false' && !u.panel && u.focus === 'dcsSw' && !u.rec, u);
    await p.click('#dcsSw'); await clickText(p, T['on.new']); u = await ui(p);
    const code = u.code, last = code.split('-').pop();
    const t2 = await p.evaluate(() => { const i = document.getElementById('dcsConfirm'), s = [...document.querySelectorAll('#dcsPanel button')].find(x => /saved/.test(x.textContent)); return { ph: i.placeholder, dis: s.disabled }; });
    ok('sync t2: a new code (DC1 + 6 groups) shown once, Copy, confirm field with "Last group" (never the group), I\'ve saved it disabled, status "Not synced yet"',
      /^DC1(-[0-9A-HJKMNP-TV-Z*~$=U]{1,5}){6}$/.test(code) && u.panel.includes(T['code.copy']) && t2.ph === T['code.confirmHint'] && t2.ph !== last && t2.dis && u.st === T['status.never'] && !u.rec && u.strip === 'Progress is saved in this browser only.', { u, t2 });
    await p.fill('#dcsConfirm', last.toLowerCase());
    ok('sync t3: typing the last group enables I\'ve saved it', await p.evaluate(() => ![...document.querySelectorAll('#dcsPanel button')].find(x => /saved/.test(x.textContent)).disabled));
    await clickText(p, T['code.saved']);
    u = await until(p, x => syncedRe.test(x.st));
    ok('sync s2: stored, first round uploads; Advanced: status "Synced · just now", Sync now then Sync options; strip says synced', syncedRe.test(u.st) && /ok/.test(u.tone) && JSON.parse(u.rec).code === code && host.objects.size === 1 && u.now && u.opts && u.strip === T['strip.on'] && !u.panel, u);
    ok('sync s2: Sync now comes before Sync options', await p.evaluate(() => !!(document.getElementById('dcsNow').compareDocumentPosition(document.getElementById('dcsOpts')) & Node.DOCUMENT_POSITION_FOLLOWING)));
    /* the code never leaves the record: not in the save, an Export file or the Report link */
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#expBtn')]);
    const expText = fs.readFileSync(await dl.path(), 'utf8'), rep = await p.evaluate(() => { const r = document.getElementById('reportLink'); r.dispatchEvent(new Event('focus')); return r.href; });
    const bare = code.replace(/-/g, '');
    const leak = s => s.includes(code) || s.includes(bare);
    ok('sync: Export and Report a problem never include the sync code (nor the save)', !leak(expText) && !leak(decodeURIComponent(rep)) && !leak(await p.evaluate(k => localStorage.getItem(k), KEY)) && !/companion-sync/.test(expText), { rep });
    await p.click('.modeseg [data-mode=basic]'); u = await ui(p);
    ok('sync s1: Basic shows label, switch and status only', syncedRe.test(u.st) && !u.now && !u.opts && u.on === 'true', u);
    await p.click('.modeseg [data-mode=advanced]');
    let release; net.hold = new Promise(r => { release = r; });
    await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.syncing'], 3000);
    ok('sync s3: a running round shows "Syncing…"', u.st === T['status.syncing'], u);
    net.hold = null; release(); await until(p, x => syncedRe.test(x.st));
    net.down = true; await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.offline']);
    ok('sync s5: host unreachable: "Offline · will sync when you\'re back online"', u.st === T['status.offline'] && /warn/.test(u.tone), u);
    net.down = false; await p.evaluate(() => dispatchEvent(new Event('online'))); u = await until(p, x => syncedRe.test(x.st));
    ok('sync s5: the online event retries and syncs', syncedRe.test(u.st), u);
    net.race = true; await p.click('#lvlUp'); await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.conflict'], 12000);
    ok('sync s6: losing every retry to another device: "Another device is syncing · trying again soon"', u.st === T['status.conflict'], u);
    net.race = false; net.status = 500; await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.error']);
    ok('sync s9: another status (500): "Sync failed, will retry"', u.st === T['status.error'] && /bad/.test(u.tone), u);
    net.status = 0; await p.click('#dcsNow'); await until(p, x => syncedRe.test(x.st));
    const id = [...host.objects.keys()][0], good = host.objects.get(id).body;
    host.objects.get(id).body = new Uint8Array(good.length).fill(7); await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.unreadable']);
    ok('sync s7: a cloud copy the code can\'t open: "This code doesn\'t open the cloud copy", nothing written', u.st === T['status.unreadable'] && host.objects.get(id).body[0] === 7, u);
    const env = { crypto: globalThis.crypto, CompressionStream: globalThis.CompressionStream, DecompressionStream: globalThis.DecompressionStream };
    const keysA = await M.syncKeys(env, M.parseSyncCode(code)), saveA = JSON.parse(await p.evaluate(k => localStorage.getItem(k), KEY));
    host.objects.get(id).body = await M.sealSave(env, keysA, { ...saveA, v: M.SAVE_V + 1 }); await p.click('#dcsNow'); u = await until(p, x => x.st === T['status.update']);
    ok('sync s8: a copy from a newer version: "Update the app to sync" with Reload', u.st === T['status.update'] && u.reload, u);
    host.objects.get(id).body = good; await p.click('#dcsNow'); await until(p, x => syncedRe.test(x.st));
    await p.click('#dcsOpts'); u = await ui(p);
    ok('sync m1: Sync options lists the four actions', [T['opt.show'], T['opt.new'], T['opt.delete'], T['opt.off']].every(t => u.menu.includes(t)) && u.menu.split('\n').filter(Boolean).length === 4, u.menu);
    await clickText(p, T['opt.show']); u = await ui(p);
    ok('sync m2: Show sync code shows the stored code with Copy and Hide', u.code === code && u.panel.includes(T['code.hide']), u);
    await clickText(p, T['code.hide']); u = await ui(p);
    ok('sync m2: Hide closes the panel, focus back on the switch', !u.panel && u.focus === 'dcsSw', u);
    await p.click('#dcsOpts'); await clickText(p, T['opt.new']); u = await ui(p);
    ok('sync m3: New sync code asks first', u.panel.includes(T['new.title']) && u.panel.includes(T['new.go']), u);
    await clickText(p, T['new.go']); u = await ui(p);
    const code2 = u.code; await p.fill('#dcsConfirm', code2.split('-').pop()); await clickText(p, T['code.saved']);
    u = await until(p, x => syncedRe.test(x.st) && JSON.parse(x.rec).code === code2);
    ok('sync m3: the new code replaces the old: old cloud copy deleted, new one uploaded', code2 !== code && JSON.parse(u.rec).code === code2 && host.objects.size === 1 && !host.objects.has(id), { u, ids: [...host.objects.keys()] });
    await p.click('#dcsOpts'); await clickText(p, T['opt.delete']); u = await ui(p);
    ok('sync d1: Delete cloud copy asks first', u.panel.includes(T['delete.title']), u);
    await clickText(p, T['opt.delete']); u = await until(p, x => !x.rec);
    ok('sync d2: deleted: host empty, code gone from the device, line back to off with one message', host.objects.size === 0 && !u.rec && u.on === 'false' && u.msg === T['delete.done'] && !u.st && u.strip === 'Progress is saved in this browser only.', u);
    await p.click('#dcsSw'); await clickText(p, T['on.new']); const code3 = (await ui(p)).code;
    await p.fill('#dcsConfirm', code3.split('-').pop()); await clickText(p, T['code.saved']); await until(p, x => syncedRe.test(x.st));
    await p.click('#dcsSw'); u = await ui(p);
    ok('sync o1: the switch, when on, asks before turning off', u.panel.includes(T['off.title']) && u.panel.includes('180 days'), u);
    await clickText(p, T['opt.off']); u = await ui(p);
    ok('sync o1: turned off: the code leaves the device, the cloud copy stays', !u.rec && u.on === 'false' && host.objects.size === 1, u);
    /* join from other devices, with A's copy (code3) on the host */
    const B = await device(390), q = B.p, n0 = net.n;
    await q.click('#dcsSw'); await clickText(q, T['on.have']);
    const typo = code3.slice(0, -1) + (code3.endsWith('0') ? '1' : '0');
    await q.fill('.sync-codein', typo); u = await ui(q);
    const j1 = await q.evaluate(() => ({ dis: [...document.querySelectorAll('#dcsPanel button')].find(x => x.textContent === 'Join').disabled, fs: getComputedStyle(document.querySelector('.sync-codein')).fontSize, tag: document.querySelector('.sync-codein').tagName, sw: document.querySelector('.sync-codein').scrollWidth, cw: document.querySelector('.sync-codein').clientWidth, sh: document.querySelector('.sync-codein').scrollHeight, ch: document.querySelector('.sync-codein').clientHeight }));
    ok('sync j1: a typo is caught on the device: message, Join disabled, no request', u.panel.includes(T['join.typo']) && j1.dis && net.n === n0, { u, j1 });
    /* P7 (#379): was an INPUT that cut the code off at 390 px; now a 2-row TEXTAREA that wraps after hyphens, so the whole code is visible */
    ok('sync j1: the join field shows the whole code at 390 px (wraps after hyphens, nothing cut off), 16 px on a phone', j1.tag === 'TEXTAREA' && j1.fs === '16px' && j1.sw <= j1.cw && j1.sh <= j1.ch, j1);
    await q.fill('.sync-codein', typo.slice(0, 10) + '\n ' + typo.slice(10));
    ok('sync j1: a pasted code with a newline or spaces is normalised', await q.evaluate(() => !/\s/.test(document.querySelector('.sync-codein').value)));
    const nope = M.newSyncCode(env); await q.fill('.sync-codein', nope); await clickText(q, T['join.button']); u = await until(q, x => x.panel.includes(T['join.notFound']));
    ok('sync j2: a code with no cloud copy: "No cloud copy for this code", nothing stored or created', u.panel.includes(T['join.notFound']) && !u.rec && host.objects.size === 1, u);
    await q.fill('.sync-codein', code3.toLowerCase()); await clickText(q, T['join.button']);
    await q.waitForLoadState(); await q.waitForTimeout(800); u = await until(q, x => syncedRe.test(x.st));
    ok('sync j4: a device without progress adopts the cloud copy: one confirmation line, synced', u.msg === T['join.adopted'] && JSON.parse(u.rec).code === code3 && syncedRe.test(u.st), u);
    const lvA = await p.evaluate(() => String(char(state).level)), lvB = await q.evaluate(() => String(char(state).level));
    ok('sync j4: the joined device shows the cloud copy\'s character', lvA === lvB, { lvA, lvB });
    /* §4a: at 390 px the code box never breaks inside a group and no line starts with "-" */
    await q.click('.modeseg [data-mode=advanced]'); await q.click('#dcsOpts'); await clickText(q, T['opt.show']);
    const wrap = await q.evaluate(() => { const box = document.querySelector('#dcsPanel .sync-code'), grps = [...box.querySelectorAll('.sync-grp')];
      const lines = new Set(grps.map(g => Math.round(g.getBoundingClientRect().top)));
      const hy = [...box.childNodes].filter(nd => nd.nodeType === 3).map(nd => { const r = document.createRange(); r.selectNodeContents(nd); return Math.round(r.getBoundingClientRect().top); });
      const prevTop = grps.slice(0, -1).map(g => Math.round(g.getBoundingClientRect().top));
      return { whole: grps.every(g => g.getClientRects().length === 1), lines: lines.size, hyOk: hy.every((t, i) => t === prevTop[i]) && hy.length === grps.length - 1, w: box.clientWidth }; });
    ok('sync 390 px: the code box wraps only after a hyphen (each group whole, no line starts with "-")', wrap.whole && wrap.hyOk && wrap.lines >= 1, wrap);
    const C = await device(), c3 = C.p;
    await writeSave(c3, { checks: { 'g22:0': true }, level: 27, open: {}, quest: 'Preparations for Restoration' }); await c3.reload(); await c3.waitForTimeout(500);
    await c3.click('#dcsSw'); await clickText(c3, T['on.have']); await c3.fill('.sync-codein', code3); await clickText(c3, T['join.button']);
    u = await until(c3, x => x.panel.includes(T['join.askTitle']));
    ok('sync j3: a device with progress is asked: Keep both / Use the cloud copy / Cancel', u.panel.includes(T['join.keepBoth']) && u.panel.includes(T['join.useCloud']) && u.panel.includes(T.cancel) && !u.rec, u);
    await clickText(c3, T['join.keepBoth']); await c3.waitForTimeout(800); await c3.waitForLoadState(); u = await until(c3, x => syncedRe.test(x.st));
    ok('sync j3: Keep both stores the code and merges into one cloud copy', JSON.parse(u.rec).code === code3 && syncedRe.test(u.st) && host.objects.size === 1, u);
    ok('sync: no page errors on any device', !A.errs.length && !B.errs.length && !C.errs.length, [A.errs, B.errs, C.errs]);
    for (const d of [A, B, C]) await d.c.close();
    /* off: the production default (SYNC_LIVE false, no test flag) mounts no sync line and requests nothing from the sync origin */
    {
      const c = await b.newContext({ viewport: { width: 390, height: 900 } }), reqs = [];
      c.on('request', q => { if (q.url().startsWith('https://sync.daevacompanion.com')) reqs.push(q.url()); });
      await c.route('https://sync.daevacompanion.com/**', r => r.abort('internetdisconnected'));
      const pg = await c.newPage(), errs = []; pg.on('pageerror', e => errs.push(e.message)); await pg.goto(CFG.CUR); await pg.waitForTimeout(1500);
      const o = await pg.evaluate(() => ({ sw: !!document.getElementById('dcsSw'), any: document.querySelectorAll('[id^="dcs"], .syncline, .sync-panel').length, strip: document.querySelector('#xfer .xfer-text > span').textContent,
        chunk: [...document.scripts].filter(s => /sync\.[0-9a-f]{8}\.js$/.test(s.src)).length + performance.getEntriesByType('resource').filter(e => /\/sync\.[0-9a-f]{8}\.js$/.test(e.name)).length,
        css: [...document.styleSheets].some(s => [...s.cssRules].some(r => /\.syncline\b/.test(r.selectorText || ''))) }));
      ok('sync off: the production site (SYNC_LIVE false) has no #dcsSw or sync markup, loads no sync chunk or its styles, makes no request to the sync origin, keeps the strip sentence', !o.sw && !o.any && !o.chunk && !o.css && o.strip === 'Progress is saved in this browser only.' && !reqs.length && !errs.length, { o, reqs, errs });
      await c.close();
    }
  }

  console.log(`${n - fail} ok, ${fail} failed`); console.log(fail ? `SITE CHECKS FAILED (${fail})` : 'SITE CHECKS PASSED');
  await b.close(); process.exit(fail ? 1 : 0);
})();
