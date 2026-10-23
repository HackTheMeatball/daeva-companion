/* Accessibility checks (0.1.6, audit docs/audits/2026-10-mobile-a11y.md). node tests/a11y.js  (page at AION_BASE; see tests/config.js)

   1. axe-core (devDependency, pinned) at 390 and 1500 px in fresh / Lv 27 (the user's save) / Lv 45 × Basic / Advanced,
      with the Build drawer and the card "mini" panels open so their content is checked too. Fails on any violated rule
      that isn't in ALLOW below; allowed rules are still counted in the output, so they stay visible until fixed.
   2. Spoken names: no button is named "What is ?" (the "i" buttons beside section titles), no unnamed button.
   3. Reduced motion: shortly after Level up no animation is running except the toast's fade in place (rwToastFade, no
      movement), the toast spells out the gains, and SMOOTH() is "auto". Without reduced motion Level up does animate
      (so the check can see animations at all).
   4. "i" popovers: aria-expanded / aria-controls, Escape closes them and returns focus (milestone tip, card tip,
      Next up info).
   5. Hit areas (P1-3): each control with an invisible ::before / ::after hit area (HIT) is at least 24 × 24 px with it,
      and the extension never takes a point from a neighbouring control: for points just inside every control that the
      extension reaches, document.elementFromPoint is compared with the control's pseudo-elements left out of hit
      testing and with them in; a point the neighbour had and lost is a failure.
   6. Touch (0.1.9, P1-4 / P3-1; 390 px with touch emulation, fresh / Lv 20 / Lv 27 / Lv 45 × Basic / Advanced,
      drawer and panels open): every text field and select at 16 px or more (iPhone Safari zooms below that) and the big number
      fields (BIGNUM) still at 18 px, the primary buttons (PRIMARY) at least 44 px tall, no text under 11 px (mono) /
      12 px (body) except the icon glyphs in GLYPH.
   7. Story connector (P2-4): on a fresh save no connector line is drawn above the first story row.
   8. Page zoom (P2-9, 0.5 P7): at 195 px (200 % zoom on a 390 px phone), 260 px (150 %) and 640 px (a half-width desktop window) the page doesn't scroll
      sideways and no card header (nor a Dungeons region header, section head or row, or their text) runs past its card on
      either side; no Dungeons row is cut off by its max-height and no map pin sits on a row's name.
   9. Folded cleared steps (P3-2, 390 px, Lv 27 and Lv 45): in every ticked milestone step the warnings (.note) and the
      location / "Reward:" line (.loc) are visible, and every link or button in the step is either out of the layout
      (display: none, so not focusable) or visible inside its row: nothing hidden can take keyboard focus.
  10. Derived rows (0.3 E4, 390 / 1500 px × Basic / Advanced): a row done in the story (byStory, wrapper, regional
      follow-up) is a ticked, disabled box named "<row>: done in the story" with that tooltip, axe-clean; the same rows
      in both modes; moving the story back shows the stored false again (box enabled, save untouched).
  11. Ascension bar (0.3 E8, same saves as 10): shown in Basic and Advanced, a progressbar named "Ascension" with its value
      (aria-valuenow / max / valuetext), the same label in both modes, axe-clean.
  15. Headings and the board line (0.6.1 F4): no empty heading, no two h2 with the same name (locked-card shells
      included); the Daevanion board line inside its card at desktop widths in the shipped fonts.
  16. Step how and item icons (0.6.2 P17, #397; 390 / 1500 px × Basic / Advanced): the Lv 10 Extract card is title, how
      line, meta line, the rest behind its "i" (no tip popover inside); Later rows have no how and no "i"; a step with
      nothing after its bold phrase has only its title. Item icons: "Soul Crystal" / "Life Crystal" get none (the one
      matcher, itemKeyOf / itemLine), milestone rows get none, and at 195 / 390 / 1500 px no number + icon + word unit
      wraps apart. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const CFG = require('./config');
const { writeSave, clearSave, flatFixture } = require('./support/save');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const { writeFixture } = require('./support/regress-fixture');
/* the user's v285 save (Lv 27) as the current build stores it after loading it (a flat fixture, frozen since 0.4 P3c) */
const USER = flatFixture('fixture-user-v285.flat.json');
let fail = 0; const ok = (n, c, d) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 700) : '')); if (!c) fail++; };
const info = (n, d) => console.log('info ' + n + (d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 700) : ''));

/* Rules still expected until they are fixed (each with the audit item that fixes it). Anything else fails. */
const ALLOW = {
  'scrollable-region-focusable': 'P3-5 (0.1.7): #spSoon / #dvThen / #stSoon scroll without keyboard focus',
};

/* the controls given a hit area in 0.1.6 (src/styles/app.css, "Pointer targets of at least 24 px") and before */
const HIT = ['.tip', '.tipbtn', '#nowStar .q-act', '#gates li.qrow .q-act', '#nowStar a.q-pin','#stCard .st-lvctl button', '.fold-btn', '.sec .ns-pop', '.sd-close',
  '.zone-btn', '.ms-name', '.nsinfo', '#nowStar .ns-pin', '.trk-sum',
  '#nowStar .rq-wait > summary', '.jfilt-btn', '.jfilt-x', '.dvi', '#stCard .st-chg .st-pick',
  /* 0.6.1 F4 (#321 note 9): the Next up objective checkboxes (their label is the target) and the Dungeons "N traces" links */
  '#nowStar .ns-obj label', '.ztr'];

/* touch: the primary buttons that get 44 px, and the glyphs in fixed boxes that keep their size (icons, not text) */
const PRIMARY = '.lvlup-btn, .ns-btn.primary, #nowStar .ns-card .ns-go, .dvbuy';
const GLYPH = '.tip, .tipbtn, .dvi, .nsinfo, .zchev, .cstep-b button, .spmini.ini, .st-mini.ini, .filt-n';
const BIGNUM = ['lvlNum', 'spPts', 'dvIn', 'stShards'];

const STATES = {
  fresh: () => null,
  lv27: () => ({ ...USER }),
  lv45: 'fixture',
};

async function load(p, state, mode) {
  await p.goto(CFG.CUR);
  if (state === 'fixture' || state === 'fixture20') await writeFixture(p, { L: state === 'fixture' ? 45 : 20, mode, fx: 'clean' });
  else if (state) await writeSave(p, { ...state, mode }, { fresh: true });
  else await clearSave(p);
  await p.reload(); await p.waitForTimeout(400);
  /* one view (0.9 P21): mode is stored in the save but no longer read; both values open the same page */
  await p.waitForTimeout(150);
}

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const page = async (width, opts = {}) => { const ctx = await b.newContext({ viewport: { width, height: 1000 }, ...opts }); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); return { ctx, p }; };

  /* ---------- 1. axe, 2. names, 5. hit areas ---------- */
  const seen = {};
  for (const width of [390, 1500]) for (const [sn, sf] of Object.entries(STATES)) for (const mode of ['basic', 'advanced']) {
    const id = `${sn} ${mode} ${width}px`;
    const { ctx, p } = await page(width);
    await load(p, typeof sf === 'function' ? sf() : sf, mode);
    /* open the drawer and the folded panels so what they hold is checked as well */
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (d && !d.classList.contains('open')) document.getElementById('sdTab').click();
      document.querySelectorAll('details.mini, details.foldcard').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(250);
    await p.addScriptTag({ content: AXE });
    const res = await p.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, first: v.nodes.slice(0, 3).map(x => x.target.join(' ')) })); });
    const bad = res.filter(v => !ALLOW[v.id]);
    ok(`axe ${id}: no violations outside the allowlist`, !bad.length, bad);
    /* the pass above only covers the Active / Passive chip's contrast if the chip is on screen in this state (0.2.7) */
    const chips = await p.evaluate(() => [...document.querySelectorAll('.sptype')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).length);
    /* a fresh Lv 1 character has no Skills card (0.6 P16: it opens at Lv 4), so its chips are axed in the lv27 / lv45 states */
    if (sn === 'fresh') ok(`axe ${id}: the Skills card is locked at Lv 1, so no .sptype chip is on screen (${chips})`, chips === 0 && await p.evaluate(() => document.getElementById('spCard').hidden), chips);
    else ok(`axe ${id}: .sptype chips visible in the axed state (${chips})`, chips > 0, chips);
    /* and the green "(+x)" skill bonus (0.6 P9) only where ticked Daevanion nodes add levels: the Lv 45 fixture's in Advanced (Sync levels open; Basic hides
       the card's footer and its fully bought plan leaves no level arrow) */
    if (sn === 'lv45' && mode === 'advanced') {
      const bonus = await p.evaluate(() => [...document.querySelectorAll('.spbonus')].filter(e => { const r = e.getBoundingClientRect(); return e.textContent && r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).length);
      ok(`axe ${id}: green skill bonuses visible in the axed state (${bonus})`, bonus > 0, bonus);
    }
    res.filter(v => ALLOW[v.id]).forEach(v => { seen[v.id] = (seen[v.id] || 0) + v.n; });
    const names = await p.evaluate(() => [...document.querySelectorAll('button')].map(x => ({ n: (x.getAttribute('aria-label') || x.textContent || x.title || '').replace(/\s+/g, ' ').trim(), c: x.className })));
    ok(`names ${id}: no "What is ?" button, every button named`, !names.some(x => /What is\s*\?/.test(x.n)) && names.every(x => x.n), names.filter(x => !x.n || /What is\s*\?/.test(x.n)));
    /* 0.9 P8 (#625): a clause as a tip's label ("Respec is free") read "What is Respec is free?"; such a button takes its tip's title */
    const isIs = names.filter(x => /\bis\b.*\bis\b/i.test(x.n));
    ok(`names ${id}: no accessible name reads "is … is"`, !isIs.length, isIs);
    if (mode === 'advanced' || width === 390) {
      await p.addStyleTag({ content: '.a11y-nohit::before, .a11y-nohit::after { pointer-events: none !important; } #stCard .st-chg .st-pick.a11y-nohit { inset: 0 !important; width: 100% !important; height: 100% !important; }' });
      const hit = await p.evaluate(async HIT => {
        const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
        const ext = e => { /* the control's box grown by its hit-area pseudo-element (the larger of ::before / ::after) */
          const r = e.getBoundingClientRect(); let o = { l: r.left, t: r.top, r: r.right, b: r.bottom };
          for (const ps of ['::before', '::after']) { const cs = getComputedStyle(e, ps); if (cs.content === 'none' || cs.position !== 'absolute') continue;
            const px = v => /px$/.test(v) ? parseFloat(v) : 0;
            o = { l: Math.min(o.l, r.left + px(cs.left)), t: Math.min(o.t, r.top + px(cs.top)), r: Math.max(o.r, r.right - px(cs.right)), b: Math.max(o.b, r.bottom - px(cs.bottom)) }; }
          if (e.matches('#stCard .st-chg .st-pick')) o = { l: r.left, t: r.top, r: r.right, b: r.bottom };
          return o; };
        const CTL = 'button, a[href], input:not([type=hidden]), select, summary, label, [tabindex="0"]';
        const small = [], steal = [];
        const els = [...new Set(HIT.flatMap(s => [...document.querySelectorAll(s)]))].filter(vis);
        for (const e of els) {
          e.scrollIntoView({ block: 'center', inline: 'nearest' });
          const x = ext(e), w = x.r - x.l, h = x.b - x.t;
          const desc = el => (el.parentElement ? (el.parentElement.id ? '#' + el.parentElement.id : el.parentElement.classList[0] ? '.' + el.parentElement.classList[0] : el.parentElement.tagName.toLowerCase()) + ' > ' : '') + el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '');
          /* inline links / summaries in running text and the sliver Build tab are out of scope (see docs) */
          if (Math.round(w) < 24 || Math.round(h) < 24) small.push(`${desc(e)} ${Math.round(w)}x${Math.round(h)}`);
          const near = [...document.querySelectorAll(CTL)].filter(n => n !== e && !n.contains(e) && !e.contains(n) && vis(n) && !(n.tagName === 'LABEL' && n.contains(e)) && !(e.tagName === 'LABEL' && e.contains(n)))
            .filter(n => { const r = n.getBoundingClientRect(); return r.left < x.r && r.right > x.l && r.top < x.b && r.bottom > x.t; });
          for (const n of near) {
            const r = n.getBoundingClientRect(), cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
            for (const [px, py] of [[cx, cy], [r.left + 1.5, cy], [r.right - 1.5, cy], [cx, r.top + 1.5], [cx, r.bottom - 1.5]]) {
              if (px < x.l || px > x.r || py < x.t || py > x.b) continue; /* only points the extension could reach */
              /* the same point with the control's pseudo-elements left out of hit testing: a steal is a point the
                 neighbour gets without the extension and loses with it */
              e.classList.add('a11y-nohit'); const before = document.elementFromPoint(px, py); e.classList.remove('a11y-nohit');
              const after = document.elementFromPoint(px, py);
              if (before && n.contains(before) && after && !n.contains(after) && (after === e || e.contains(after))) steal.push(`${desc(e)} takes ${desc(n)} at ${Math.round(px - r.left)},${Math.round(py - r.top)}`);
            }
          }
        }
        return { n: els.length, small: [...new Set(small)], steal: [...new Set(steal)] };
      }, HIT);
      ok(`hit areas ${id}: ${hit.n} controls at least 24 x 24 px`, !hit.small.length, hit.small);
      ok(`hit areas ${id}: no control's hit area takes a point of a neighbour`, !hit.steal.length, hit.steal);
    }
    await ctx.close();
  }
  info('allowed axe rules still violated (node count over all runs)', seen);

  /* ---------- 15. headings and the Daevanion board line (0.6.1 F4, #321 notes 9 and 11) ---------- */
  /* No heading in the DOM is empty, and no two h2 share a name (a locked card's shell used to carry a second "Skills" /
     "Daevanion" / "Stigmas" h2 next to the card's own, kept after the card opened): 1500 / 390 px × fresh / Lv 20 / Lv 27 /
     Lv 45 × Basic / Advanced, and a fresh save levelled to 45 in place (every shell made, then hidden). */
  const headings = p => p.evaluate(() => {
    const hs = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role=heading]')];
    const desc = h => h.tagName.toLowerCase() + (h.id ? '#' + h.id : '') + ' in #' + ((h.parentElement && h.parentElement.closest('[id]')) || {}).id;
    const names = {}; hs.filter(h => h.tagName === 'H2').forEach(h => { const n = h.textContent.replace(/\s+/g, ' ').trim(); (names[n] = names[n] || []).push(desc(h)); });
    return { empty: hs.filter(h => !h.textContent.trim()).map(desc), dup: Object.entries(names).filter(([, v]) => v.length > 1) };
  });
  for (const width of [1500, 390]) for (const sn of ['fresh', 'lv20', 'lv27', 'lv45']) for (const mode of ['basic', 'advanced']) {
    const id = `headings ${sn} ${mode} ${width}px`, { ctx, p } = await page(width);
    await load(p, sn === 'lv20' ? 'fixture20' : typeof STATES[sn] === 'function' ? STATES[sn]() : STATES[sn], mode);
    let r = await headings(p);
    ok(`${id}: no empty heading`, !r.empty.length, r.empty);
    ok(`${id}: no two h2 with the same name (the card headings once each)`, !r.dup.length, r.dup);
    if (sn === 'fresh') {
      await p.evaluate(() => { char(state).level = 45; update(); });
      r = await headings(p);
      ok(`${id}, levelled to 45 in place: no empty heading, no two h2 with the same name`, !r.empty.length && !r.dup.length, r);
    }
    await ctx.close();
  }
  /* The board line ("Nezekan board New · 0 of 10 acquired") stays inside the Daevanion card at desktop widths, at Lv 20
     with the board just opened (the player's report: nothing bought, the gold "New" tag) and in the Lv 20 fixture, in the
     shipped fonts (the suites block web fonts, so the check adds Figtree and JetBrains Mono itself, as section 12 does). */
  const FONTS = [['Figtree', 'figtree-latin', ['400', '500', '600', '700']], ['JetBrains Mono', 'jetbrains-mono-latin', ['400', '600']]]
    .map(([fam, file, ws]) => [fam, fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'fonts', file + '.woff2')).toString('base64'), ws]);
  for (const [sn, st] of [['lv20 new board', { level: 20, quest: 'Cemetery Cleanup', checks: {}, open: {} }], ['lv20 fixture', 'fixture20']]) {
    const { ctx, p } = await page(1500);
    await load(p, st, 'advanced');
    const r = [];
    for (const width of [1500, 1440, 1366, 1280, 1100, 1024, 900]) {
      await p.setViewportSize({ width, height: 1000 });
      r.push(await p.evaluate(async FONTS => {
        for (const [fam, b64, ws] of FONTS) for (const weight of ws) document.fonts.add(await new FontFace(fam, Uint8Array.from(atob(b64), ch => ch.charCodeAt(0)), { weight }).load());
        await document.fonts.ready; await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
        const card = document.getElementById('dvBox'), top = card && card.querySelector('#dvBoard .dvbh-top');
        if (!top || !top.offsetParent) return { w: innerWidth, shown: false };
        const cr = card.getBoundingClientRect(), tr = top.getBoundingClientRect(), right = Math.max(...[top, ...top.querySelectorAll('*')].map(e => e.getBoundingClientRect().right));
        return { w: innerWidth, shown: true, text: top.textContent, isNew: !!top.querySelector('.dvb-new'), right: Math.round(right), line: Math.round(tr.right), card: Math.round(cr.right), inside: right <= tr.right + 0.5 && right <= cr.right + 0.5 };
      }, FONTS));
    }
    ok(`board line ${sn} advanced: inside the Daevanion card at ${r.map(x => x.w).join(' / ')} px (shipped fonts)`, r.every(x => x.shown && x.inside && x.isNew === (sn === 'lv20 new board')), r.filter(x => !x.shown || !x.inside || x.isNew !== (sn === 'lv20 new board')));
    await ctx.close();
  }

  /* ---------- 3. reduced motion ---------- */
  for (const motion of ['reduce', 'no-preference']) {
    const { ctx, p } = await page(1500, { reducedMotion: motion });
    await load(p, { ...USER }, 'advanced');
    await p.click('#lvlUpBig'); await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ anims: document.getAnimations().filter(a => a.playState === 'running').map(a => a.animationName || a.constructor.name),
      toast: (document.getElementById('rwToast') || {}).textContent || '', smooth: SMOOTH(), lv: char(state).level }));
    if (motion === 'reduce') {
      ok('reduced motion: nothing moves after Level up (only the toast fades in place)', r.anims.every(a => a === 'rwToastFade') && r.anims.length === 1, r);
      ok('reduced motion: the toast spells out the Level up gains', /Lv 28/.test(r.toast) && /skill pts/.test(r.toast), r);
      ok('reduced motion: script scrolls are instant (SMOOTH() = "auto")', r.smooth === 'auto', r);
      await p.waitForTimeout(2800);
      const left = await p.evaluate(() => ({ html: document.getElementById('rwToast').innerHTML, show: document.getElementById('rwToast').classList.contains('show') }));
      ok('reduced motion: the toast still clears on animationend', left.html === '', left);
    } else {
      ok('motion allowed: Level up animates (the check above can see animations)', r.anims.some(a => /lvlpop|lvlpulse|lvlspark|lvlfloat/.test(a)) && r.smooth === 'smooth' && !/Lv 28/.test(r.toast), r);
    }
    await ctx.close();
  }

  /* ---------- 3b. phone overlaps (0.8 P7, #496; 390 x 844): the Undo toast stays fully above the tab bar at every frame, and the
     level-up chip never covers the character-name box or another control while it floats ---------- */
  for (const sn of ['lv5', 'lv27']) {
    const { ctx, p } = await page(390, { isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
    await p.setViewportSize({ width: 390, height: 844 });
    await load(p, sn === 'lv27' ? { ...USER } : null, 'advanced');
    if (sn === 'lv5') for (let i = 0; i < 4; i++) await p.click('#lvlUp');
    const r = await p.evaluate(() => new Promise(res => {
      const box = e => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
      const hit = (a, b) => a.l < b.r - 0.5 && a.r > b.l + 0.5 && a.t < b.b - 0.5 && a.b > b.t + 0.5;
      /* a control the chip covers is one you can see there: some point of the overlap shows the control (the chip has
         pointer-events: none). One scrolled under the sticky level bar, where the chip floats, is hidden by the bar already */
      const seen = (e, a, b) => { const l = Math.max(a.l, b.l), r = Math.min(a.r, b.r), t = Math.max(a.t, b.t), bt = Math.min(a.b, b.b);
        return [[.5, .5], [.15, .15], [.85, .15], [.15, .85], [.85, .85]].some(([x, y]) => { const top = document.elementFromPoint(l + (r - l) * x, t + (bt - t) * y); return !!top && (e === top || e.contains(top)); }); };
      const out = { frames: 0, toastFrames: 0, chipFrames: 0, toastOver: 0, chipOver: [], chipOut: 0 };
      rewardToast('Lv 2: "Test quest" turned in', () => {});
      document.getElementById('lvlUpBig').click();
      const t0 = performance.now();
      const tick = () => {
        const bar = box(document.getElementById('tabBar')), t = document.getElementById('rwToast'), c = document.querySelector('.lvl-float');
        out.frames++;
        if (t && t.classList.contains('show')) { out.toastFrames++; if (box(t).b > bar.t + 0.5) out.toastOver = Math.max(out.toastOver, Math.round(box(t).b - bar.t)); }
        if (c) {
          out.chipFrames++; const cb = box(c);
          if (cb.l < -0.5 || cb.r > innerWidth + 0.5) out.chipOut++;
          for (const e of document.querySelectorAll('#charCard, #tabBar, #rwToast, #lvlUpBig, #lvlNum, #lvlUp, #lvlDown, #lvlRange, button, input, select, a[href], summary')) { if (e.classList.contains('lvl-float') || e.offsetParent === null && e.id !== 'tabBar') continue; const b = box(e); if (b.r > b.l && b.b > b.t && hit(cb, b) && seen(e, cb, b)) out.chipOver.push(e.id || e.className || e.tagName); }
        }
        if (performance.now() - t0 < 2200) requestAnimationFrame(tick); else res(out);
      };
      requestAnimationFrame(tick);
    }));
    r.chipOver = [...new Set(r.chipOver)];
    ok(`phone 390px ${sn}: the Undo toast sits fully above the tab bar in every frame`, r.toastFrames > 10 && r.toastOver === 0, r);
    ok(`phone 390px ${sn}: the level-up chip is measured during its transition, stays on screen and overlaps no control`, r.chipFrames > 10 && r.chipOut === 0 && r.chipOver.length === 0, r);
    await ctx.close();
  }

  /* ---------- 0.8 P12 (#501): the welcome's class radiogroup by keyboard. One tab stop (the picked badge); arrow keys move
     the pick through the classes with a guide, wrapping, and skip the "Soon" ones (aria-disabled, never focused) ---------- */
  for (const width of [390, 1500]) {
    const { ctx, p } = await page(width);
    await p.goto(CFG.CUR); await p.waitForTimeout(400);
    const st = () => p.evaluate(() => { const a = document.activeElement;
      return { focus: a && a.classList.contains('welclass') ? a.dataset.class : null, picked: [...document.querySelectorAll('.welclass[aria-checked="true"]')].map(x => x.dataset.class).join(),
        stops: [...document.querySelectorAll('.welclass')].filter(x => x.tabIndex === 0).map(x => x.dataset.class).join(),
        order: [...document.querySelectorAll('.welclass:not([aria-disabled="true"])')].map(x => x.dataset.class),
        soon: [...document.querySelectorAll('.welclass[aria-disabled="true"]')].map(x => x.dataset.class) }; });
    const s0 = await st();
    ok(`welcome class ${width}px: one tab stop, the picked Assassin`, s0.stops === 'assassin' && s0.picked === 'assassin', s0);
    await p.focus('.welclass[data-class="assassin"]');
    const seenR = [];
    for (let i = 0; i < s0.order.length; i++) { await p.keyboard.press('ArrowRight'); seenR.push((await st()).focus); }
    const wantR = s0.order.map((_, i) => s0.order[(s0.order.indexOf('assassin') + i + 1) % s0.order.length]);
    const s1 = await st();
    ok(`welcome class ${width}px: ArrowRight walks every class with a guide, wrapping, never a "Soon" one; focus and pick move together`,
      JSON.stringify(seenR) === JSON.stringify(wantR) && !seenR.some(c => s0.soon.includes(c)) && s1.picked === s1.focus && s1.stops === s1.focus, { seenR, wantR, s0, s1 });
    await p.keyboard.press('ArrowLeft'); const s2 = await st();
    await p.keyboard.press('End'); const s3 = await st();
    await p.keyboard.press('Home'); const s4 = await st();
    ok(`welcome class ${width}px: ArrowLeft back one, End / Home to the last / first class with a guide`,
      s2.focus === s0.order[(s0.order.indexOf(s1.focus) - 1 + s0.order.length) % s0.order.length] && s3.focus === s0.order[s0.order.length - 1] && s4.focus === s0.order[0] && s4.picked === s0.order[0], { s2, s3, s4 });
    await ctx.close();
  }

  /* ---------- 4. "i" popovers and Escape ---------- */
  {
    const { ctx, p } = await page(1500);
    await load(p, { ...USER }, 'advanced');
    /* milestone tip (T()): opens a tip box below its row */
    const tip = await p.evaluateHandle(() => [...document.querySelectorAll('#gates .tip, #areaList .tip')].find(x => x.getBoundingClientRect().width));
    ok('popover: a milestone / section "i" is visible', !!(await tip.evaluate(x => !!x)));
    await tip.evaluate(x => x.scrollIntoView({ block: 'center' })); await tip.click();
    let r = await tip.evaluate(x => ({ exp: x.getAttribute('aria-expanded'), ctl: x.getAttribute('aria-controls'), box: !!document.getElementById(x.getAttribute('aria-controls') || '-') }));
    ok('popover: the "i" sets aria-expanded and aria-controls points at the open tip', r.exp === 'true' && r.box, r);
    await p.keyboard.press('Escape'); await p.waitForTimeout(50);
    r = await tip.evaluate(x => ({ exp: x.getAttribute('aria-expanded'), boxes: document.querySelectorAll('li.tipbox').length, focus: document.activeElement === x }));
    ok('popover: Escape closes the tip and focus returns to its button', r.exp === 'false' && !r.boxes && r.focus, r);
    /* card tip (.tipwrap): shown beside a "need more" status; Lv 35 with 10 crystals leaves the Daevanion card short */
    await load(p, { ...USER, level: 35, stones: 0, dvTotal: 10 }, 'advanced');
    await p.evaluate(() => { const w = document.querySelector('.tipwrap .tipbtn'); if (w) w.scrollIntoView({ block: 'center' }); });
    const tb = await p.$('.tipwrap .tipbtn');
    ok('popover: a card "i" is shown (Daevanion short of crystals)', !!(tb && await tb.isVisible()));
    if (tb && await tb.isVisible()) {
      await tb.click();
      r = await tb.evaluate(x => ({ open: x.parentElement.classList.contains('open'), exp: x.getAttribute('aria-expanded'), pop: !!document.getElementById(x.getAttribute('aria-controls') || '-') }));
      ok('popover: card "i" opens with aria-expanded and a controlled popover', r.open && r.exp === 'true' && r.pop, r);
      await p.keyboard.press('Escape'); await p.waitForTimeout(50);
      r = await tb.evaluate(x => ({ open: x.parentElement.classList.contains('open'), exp: x.getAttribute('aria-expanded'), focus: document.activeElement === x }));
      ok('popover: Escape closes the card popover', !r.open && r.exp === 'false' && r.focus, r);
    }
    await load(p, { ...USER }, 'advanced');
    const nb = await p.$('#nowStar .nsinfo');
    ok('popover: a Next up "i" is shown (Lv 27 save)', !!(nb && await nb.isVisible()));
    if (nb && await nb.isVisible()) {
      await nb.click();
      r = await nb.evaluate(x => ({ show: !!x.closest('.show-info'), exp: x.getAttribute('aria-expanded'), ctl: !!document.getElementById(x.getAttribute('aria-controls') || '-') }));
      ok('popover: Next up "i" shows its info with aria-expanded / aria-controls', r.show && r.exp === 'true' && r.ctl, r);
      await p.keyboard.press('Escape'); await p.waitForTimeout(50);
      r = await nb.evaluate(x => ({ show: !!x.closest('.show-info'), exp: x.getAttribute('aria-expanded') }));
      ok('popover: Escape hides the Next up info', !r.show && r.exp === 'false', r);
    }
    await ctx.close();
  }

  /* Key setup grid probe (0.6.2 P18 #414; 0.8 P9 #498; 0.9 P22 note 12): run at 390 and 1500 px. Every box (empty ones
     too) the same square, at most 88 px (Design Lead on #853, rev 2.2 §2: was 112), the icon filling it; the name leaves the box (visually hidden) and is its
     accessible name and its tooltip; key chips (buttons since #388) on one line under the columns, the defaults note under
     the grid (0.8 P14), each filled cell's accessible name carries its key. (The 0.6.2 name-wrap checks went with the names
     in the boxes: an intended change, docs/design/0.9-keys/README.md §12.) */
  const keyGridProbe = () => {
    const v = document.getElementById('stackViz'); if (!v) return null;
    const cells = [...v.querySelectorAll(':scope > .sk')], hs = [...new Set(cells.map(c => Math.round(c.getBoundingClientRect().height)))];
    const notSquare = cells.filter(c => { const b = c.getBoundingClientRect(); return Math.abs(b.width - b.height) > 1 || b.width > 88.5; }).map(c => c.getAttribute('aria-label') || 'empty');
    const shown = [...v.querySelectorAll(':scope > .sk .nm')].filter(n => n.getBoundingClientRect().width > 1).map(n => n.textContent);
    const noIco = cells.filter(c => !c.classList.contains('empty') && !c.querySelector('img.kv-ico')).map(c => c.textContent);
    const icoSmall = cells.filter(c => { const i = c.querySelector('img.kv-ico'); return i && i.getBoundingClientRect().width < c.getBoundingClientRect().width - 4; }).map(c => c.textContent);
    const keys = [...v.querySelectorAll(':scope > .kv-key')], row0 = cells.slice(-keys.length), note = v.querySelector('.kv-note'), lmb = v.querySelector('.lmb');
    const keyBad = keys.map((k, i) => { const b = k.getBoundingClientRect(), c = row0[i].getBoundingClientRect();
      return b.height > 30 || b.height < 24 || b.top < c.bottom || b.left < c.left - 1 || b.right > c.right + 1 || k.tagName !== 'BUTTON' ? k.textContent : null; }).filter(Boolean);
    const named = cells.filter(c => !c.classList.contains('empty')), cols = ['Q', 'E', 'T'];
    const unnamed = named.filter(c => { const g = c.getAttribute('aria-label') || '', nm = c.querySelector('.nm').textContent;
      return c.getAttribute('role') !== 'group' || c.tabIndex > 0 || !c.hasAttribute('tabindex') || !g.startsWith(nm + ', ') || !cols.some(k => g.includes(', ' + k + ','))
        || c.dataset.tip !== nm + ' · ' + g.slice(nm.length + 2); }).map(c => c.textContent);
    return { n: cells.length, hs, notSquare, shown, icoSmall, noIco, unnamed, stops: named.filter(c => c.tabIndex === 0).length, keys: keys.map(k => k.firstChild.textContent), keyBad,
      marked: keys.filter(k => /†/.test(k.textContent + getComputedStyle(k, '::after').content)).map(k => k.textContent),
      head: (h => !!h && h === v.firstElementChild && h.getBoundingClientRect().bottom <= cells[0].getBoundingClientRect().top + 0.5 ? h.textContent : '')(v.querySelector(':scope > .kv-sugg')),
      lmbBelow: !!lmb && lmb.getBoundingClientRect().top >= keys[0].getBoundingClientRect().bottom,
      noteBelow: !!note && !!lmb && note.getBoundingClientRect().top >= lmb.getBoundingClientRect().bottom,
      defs: (lis => ({ head: (note && note.querySelector(':scope > .khead') || {}).textContent || '',
        rows: lis.map(li => (li.querySelector('.kv-key') || {}).textContent + '|' + [...li.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()),
        chipFirst: !!lis.length && lis.every(li => { const c = li.firstElementChild; return !!c && c === li.firstChild && c.classList.contains('kv-key') && c.getBoundingClientRect().height <= 24; }),
        last: (note && note.lastElementChild || {}).textContent || '' }))(note ? [...note.querySelectorAll('li')] : []) };
  };
  const keyGridChecks = (kv, id) => {
    if (!kv || !kv.n) return;
    ok(`keys ${id}: all 12 Key setup boxes are one square size, at most 88 px`, kv.n === 12 && kv.hs.length === 1 && !kv.notSquare.length, kv);
    ok(`keys ${id}: no skill name is drawn in a box (it's the accessible name and the tooltip)`, !kv.shown.length, kv.shown);
    ok(`keys ${id}: every filled cell shows its icon, filling the box`, !kv.noIco.length && !kv.icoSmall.length, kv);
    ok(`keys ${id}: every filled cell is focusable, its accessible name and tooltip carry its name, key and row`, !kv.unnamed.length, kv.unnamed);
    /* 0.9 P22b (#855 builder note): the grid is one Tab stop (roving tabindex, the arrows move), so Tab reaches the key chips
       after one stop instead of twelve (was: every filled cell tabindex 0) */
    ok(`keys ${id}: the grid's boxes are one Tab stop`, kv.stops === 1, kv.stops);
    /* 0.8 P14 (#503): the game's columns (research-387-macro): Q, E and T (the macro's stack), all three the guide's
       suggested binding, said once in a line heading the grid (Design Lead on #565: no † per chip); left click (the
       game's default) its own line under them, then the game's default keys */
    ok(`keys ${id}: key chips Q / E / T (buttons 24–30 px tall, rev 2.2 §5) on one line under their columns, Left click under them, the defaults note under that`,
      kv.keys.join('|') === 'Q|E|T' && !kv.keyBad.length && kv.lmbBelow && kv.noteBelow, kv);
    /* 0.9 P17: the same line ends on the E stack's label (keyStacks.eOrderStatus: disputed, C21b), as a sentence (#774
       Design Lead: "The stigmas on E: check in game" was a fragment) */
    ok(`keys ${id}: one line above the grid says Q, E and T are suggested keys, then the E stack's label; the chips carry no mark`,
      /^Suggested keys: Q, E and T \(T holds the stack the right-click macro fires\)\. Move the skills there yourself\. The stigma order on E is unsure: check in game$/.test(kv.head) && !kv.marked.length, { head: kv.head, marked: kv.marked });
    /* Design Lead on #565 (2026-10-20): the defaults are a list under a "Game default keys" eyebrow, one key chip per
       line, then the macro's place, still labelled (inferred) */
    ok(`keys ${id}: the defaults list puts key 1 on Shadowstrike, one chip per line, and ends with the inferred macro line`,
      kv.defs.head === 'Game default keys' && kv.defs.rows.includes('1|Shadowstrike') && kv.defs.chipFirst
      && /^The macro takes right click from Savage Roar \(inferred\)\.$/.test(kv.defs.last), kv.defs); /* rev 2.2 §4: "not a rule" said once, in the how-to */
  };
  /* 0.9 P22 (docs/design/0.9-keys-macro.md, #388): the macro as steps, the Hold clause, the tooltip on focus, rebinding by
     keyboard (Esc cancels; a clash asks; Swap them; Back to suggested keys) and every key line following */
  const keySetupBehaviour = async (p, sn) => {
    const id = `keys ${sn} 1500px`;
    let r = await p.evaluate(() => { const m = document.querySelector('#kvMacro .kv-mac'), txt = s => (s || {}).textContent || '';
      return { head: txt(m && m.querySelector('.khead')), steps: m ? [...m.querySelectorAll('ol.playsteps > li')].map(li => li.textContent) : [],
        fine: m ? [...m.querySelectorAll('ol.macro-steps > li')].map(x => x.textContent) : [], lead: m ? [...m.querySelectorAll('ol.macro-steps > li > b:first-child')].map(x => x.textContent) : [], hold: txt([...document.querySelectorAll('#rotPlay li')].pop()),
        drawer: document.getElementById('statDrawer').textContent };
    });
    ok(`${id}: one macro, headed "Macro on right click" with no step count (one step)`, r.head === 'Macro on right click', r.head);
    /* 0.9 P22b (#855): on desktop the open fold is the wide Key setup panel: "Key setup · Lv N" heading, the grid left and the
       macro right, the Rotation hidden; Tab from the grid's one stop reaches the chips; Esc folds it back into the drawer
       (focus on the "Key setup ↑" summary, the drawer still open), and opening the summary again brings it back */
    r = await p.evaluate(() => { const d = document.getElementById('statDrawer'), b = s => document.querySelector(s).getBoundingClientRect();
      return { wide: d.classList.contains('kv-wide'), w: Math.round(b('#sdPanel').width), head: [...d.querySelector('.sd-head').children].filter(e => !e.hidden).map(e => e.textContent).join(' '),
        sideBySide: b('#kvMacro').left >= b('#stackViz').right, rot: getComputedStyle(document.getElementById('rotPlay')).display, up: getComputedStyle(document.querySelector('.kv-fold .kv-up')).display }; });
    ok(`${id}: the open Key setup is the wide panel (up to 820 px), headed "Key setup Lv 27", grid left and macro right, the Rotation hidden`,
      r.wide && r.w > 700 && r.w <= 820 && /^Key setup Lv 27 Back to Build ×$/.test(r.head.trim()) && r.sideBySide && r.rot === 'none' && r.up === 'inline', r);
    await p.focus('#stackViz > .sk[tabindex="0"]'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(30);
    r = await p.evaluate(() => { const a = document.activeElement; return { lbl: a.getAttribute('aria-label'), stops: document.querySelectorAll('#stackViz > .sk[tabindex="0"]').length }; });
    ok(`${id}: the arrow keys move between the grid's boxes, keeping one Tab stop`, /, (Q|E|T), row \d/.test(r.lbl || '') && r.stops === 1, r);
    await p.keyboard.press('Tab'); await p.waitForTimeout(30);
    r = await p.evaluate(() => document.activeElement.dataset.col);
    ok(`${id}: one Tab from the grid reaches the first key chip`, r === 'Q', r);
    await p.keyboard.press('Escape'); await p.waitForTimeout(80);
    r = await p.evaluate(() => { const d = document.getElementById('statDrawer'); return { wide: d.classList.contains('kv-wide'), open: d.classList.contains('open'), f: document.activeElement.tagName, head: d.querySelector('.sd-head h2').textContent }; });
    ok(`${id}: Esc folds the panel back into the drawer (still open, focus on the Key setup summary)`, !r.wide && r.open && r.f === 'SUMMARY' && r.head === 'Stat priority', r);
    await p.keyboard.press('Enter'); await p.waitForTimeout(120);
    r = await p.evaluate(() => ({ wide: document.getElementById('statDrawer').classList.contains('kv-wide'), f: document.activeElement.id }));
    ok(`${id}: Enter on "Key setup ↑" opens the panel again, focus on Back to Build`, r.wide && r.f === 'kvBack', r);
    ok(`${id}: its one step names the T key and Quick Use 2, the whole stack, row 0 first, no delay`, r.steps.length === 1 && r.steps[0] === 'T: Quick Use 2 · the whole T stack, row 0 first', r.steps);
    /* the how-to is a numbered list with bold lead-ins, make then bind (Design Lead on #853, rev 2.2 §3: was two lines) */
    ok(`${id}: the numbered how-to: make (the 10 ms default, no 2+ steps line), then put it on right click`, r.fine.length === 2 && r.lead.join('|') === 'Make the macro:|Put it on right click'
      && /Each step's Delay starts at 10 ms, the game's default/.test(r.fine[0]) && !/Up to 20 steps/.test(r.fine.join(' ')) && /^Put it on right click \(this guide's choice, not a rule\): Esc, Key Settings/.test(r.fine[1]), r);
    ok(`${id}: the old third line is gone and the Hold step carries its warning`, !/Hold right and left click together/.test(r.drawer) && r.hold === 'Hold right + left click · right click alone drains MP (your test)', r.hold);
    /* the tooltip opens on focus */
    r = await p.evaluate(() => { const c = document.querySelector('#stackViz > .sk:not(.empty)'); c.focus(); return { tip: getComputedStyle(c, '::after').content, want: c.dataset.tip }; });
    ok(`${id}: a key box's tooltip opens on focus`, r.tip === JSON.stringify(r.want), r);
    /* rebinding by keyboard: Enter on the Q chip listens, Esc cancels, then R makes Q's column R */
    const chip = col => `#stackViz [data-col="${col}"]`;
    await p.focus(chip('Q')); await p.keyboard.press('Enter'); await p.waitForTimeout(50);
    r = await p.evaluate(() => ({ t: document.querySelector('#stackViz [data-col="Q"]').textContent, f: document.activeElement.dataset.col, hint: document.getElementById('kvHint').textContent, open: document.getElementById('statDrawer').classList.contains('open') }));
    ok(`${id}: Enter on a key chip listens ("Press a key", focus kept, the hint says Esc cancels)`, r.t === 'Press a key' && r.f === 'Q' && /Esc cancels/.test(r.hint), r);
    await p.keyboard.press('Escape'); await p.waitForTimeout(50);
    r = await p.evaluate(() => ({ t: document.querySelector('#stackViz [data-col="Q"]').firstChild.textContent, open: document.getElementById('statDrawer').classList.contains('open') }));
    ok(`${id}: Esc cancels the listening chip and leaves the drawer open`, r.t === 'Q' && r.open, r);
    await p.focus(chip('Q')); await p.keyboard.press('Enter'); await p.keyboard.press('r'); await p.waitForTimeout(80);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')), c = s.chars[s.current];
      return { keys: c.keyBinds, chip: document.querySelector('#stackViz [data-col="Q"]').firstChild.textContent, mine: document.querySelector('#stackViz [data-col="Q"]').classList.contains('mine'),
        sugg: document.querySelector('#stackViz .kv-sugg').textContent, rot: document.getElementById('rotPlay').textContent, reset: !!document.querySelector('#kvHint [data-kv="reset"]') }; });
    ok(`${id}: pressing R rebinds Q's column to R, saved as keyBinds, the chip marked yours`, JSON.stringify(r.keys) === '{"Q":"R"}' && r.chip === 'R' && r.mine && r.reset, r);
    ok(`${id}: the suggestion line and the Rotation follow the new key`, /^Your keys: R, E and T/.test(r.sugg) && /\bR\b.*Shadowstrike/.test(r.rot), r);
    /* a clash: T on E's column asks, Swap them swaps */
    await p.focus(chip('E')); await p.keyboard.press('Enter'); await p.keyboard.press('t'); await p.waitForTimeout(80);
    r = await p.evaluate(() => document.getElementById('kvHint').textContent);
    ok(`${id}: a key another column holds asks first (Swap them / Pick another)`, /^T already holds the right-click stack\. Swap them Pick another$/.test(r), r);
    await p.click('#kvHint [data-kv="swap"]'); await p.waitForTimeout(80);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return { keys: s.chars[s.current].keyBinds, step: document.querySelector('#kvMacro li').textContent }; });
    ok(`${id}: Swap them swaps the two keys, and the macro step's chip follows`, JSON.stringify(r.keys) === '{"Q":"R","E":"T","T":"E"}' && r.step === 'E: Quick Use 2 · the whole E stack, row 0 first', r);
    await p.click('#kvHint [data-kv="reset"]'); await p.waitForTimeout(80);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return { has: 'keyBinds' in s.chars[s.current], chips: [...document.querySelectorAll('#stackViz > .kv-key')].map(k => k.firstChild.textContent).join('|') }; });
    ok(`${id}: Back to suggested keys drops the field and restores Q / E / T`, !r.has && r.chips === 'Q|E|T', r);
    /* listening ends when focus leaves the chip or the drawer closes: no later key press anywhere binds (review of #853) */
    const unbound = () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return { has: 'keyBinds' in s.chars[s.current], listen: !!document.querySelector('#stackViz .kv-key.listen') }; });
    await p.click(chip('Q')); await p.click('#kvMacro .khead'); await p.waitForTimeout(80); await p.keyboard.press('r'); await p.waitForTimeout(80);
    r = await unbound();
    ok(`${id}: clicking away from a listening chip cancels it, so a later key binds nothing`, !r.has && !r.listen, r);
    await p.focus(chip('Q')); await p.keyboard.press('Enter'); await p.keyboard.press('Tab'); await p.waitForTimeout(80); await p.keyboard.press('r'); await p.waitForTimeout(80);
    r = await unbound();
    ok(`${id}: Tab from a listening chip cancels it`, !r.has && !r.listen, r);
    await p.click(chip('Q')); await p.click('#sdClose'); await p.waitForTimeout(80); await p.keyboard.press('r'); await p.waitForTimeout(80);
    r = await unbound();
    ok(`${id}: closing the drawer cancels a listening chip`, !r.has && !r.listen, r);
    /* a key HTML would read never becomes a binding (it goes into the chip's markup and aria-label) */
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); s.chars[s.current].keyBinds = { Q: '"' }; localStorage.setItem('companion-save-v6', JSON.stringify(s)); });
    await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('sdTab').click(); document.querySelectorAll('details').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(300);
    r = await p.evaluate(() => document.querySelector('#stackViz [data-col="Q"]').getAttribute('aria-label'));
    ok(`${id}: a saved key with a quote falls back to the suggestion`, r === 'Q: change the key for this stack', r);
    /* 0.9 P22b (#855 builder note): only keys the game can bind (D3) are bound; a media key pressed while listening binds
       nothing (was: silently dropped on read when longer than 12 characters) */
    await p.focus(chip('Q')); await p.keyboard.press('Enter'); await p.keyboard.press('AudioVolumeUp'); await p.waitForTimeout(80);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return { keys: s.chars[s.current].keyBinds, listen: !!document.querySelector('#stackViz .kv-key.listen') }; });
    ok(`${id}: a key the game can't bind (AudioVolumeUp) is refused while listening`, JSON.stringify(r.keys || {}) === '{"Q":"\\""}' && r.listen, r);
    await p.keyboard.press('Escape');
  };
  /* 0.9 P22b (#855; frame 388-key-listen-390): on a phone a key chip opens the picker of bindable keys. By keyboard: Enter
     opens it with focus on the column's key, every key named, keys another stack holds say so; Esc closes it and not the
     drawer, focus back on the chip; picking a free key binds it; a held key asks first; "Other key" refuses a key the game
     can't bind */
  {
    const { ctx, p } = await page(390, { isMobile: true, hasTouch: true });
    await load(p, typeof STATES.lv27 === 'function' ? STATES.lv27() : STATES.lv27, 'advanced');
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (!d.classList.contains('open')) document.getElementById('tabBuild').click(); document.querySelector('#statDrawer details.kv-fold').open = true; });
    await p.waitForTimeout(500);
    const id = 'keys picker lv27 390px', chip = col => `#stackViz [data-col="${col}"]`;
    await p.focus(chip('E')); await p.keyboard.press('Enter'); await p.waitForTimeout(80);
    let r = await p.evaluate(() => { const k = document.getElementById('kvPick'); return k && { head: k.querySelector('#kvPickH').textContent, f: document.activeElement.dataset.pick, exp: document.querySelector('#stackViz [data-col="E"]').getAttribute('aria-expanded'),
      names: [...k.querySelectorAll('.kv-pk')].map(b => b.getAttribute('aria-label')), wide: document.getElementById('statDrawer').classList.contains('kv-wide'),
      inView: (b => b.top >= 0 && b.bottom <= innerHeight)(k.getBoundingClientRect()) }; });
    ok(`${id}: Enter on the E chip opens the picker headed "Key for the E stack", focus on E, the chip expanded, no desktop panel`, !!r && r.head === 'Key for the E stack' && r.f === 'E' && r.exp === 'true' && !r.wide && r.inView, r);
    ok(`${id}: every key in the picker has an accessible name; Q and T say which stack holds them`, !!r && r.names.length === 14 && r.names.every(Boolean)
      && r.names.includes('Q, holds the Q stack') && r.names.includes('T, holds the right-click stack') && r.names.includes('R') && r.names.includes('Right click'), r && r.names);
    await p.keyboard.press('Escape'); await p.waitForTimeout(80);
    r = await p.evaluate(() => ({ pick: !!document.getElementById('kvPick'), open: document.getElementById('statDrawer').classList.contains('open'), f: document.activeElement.dataset.col }));
    ok(`${id}: Esc closes the picker, not the drawer, focus back on the chip`, !r.pick && r.open && r.f === 'E', r);
    await p.keyboard.press('Enter'); await p.waitForTimeout(80); await p.click('#kvPick [data-pick="R"]'); await p.waitForTimeout(120);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return { keys: s.chars[s.current].keyBinds, pick: !!document.getElementById('kvPick'), chip: document.querySelector('#stackViz [data-col="E"]').firstChild.textContent, f: document.activeElement.dataset.col }; });
    ok(`${id}: picking R binds E's column to R and closes the picker`, JSON.stringify(r.keys) === '{"E":"R"}' && !r.pick && r.chip === 'R' && r.f === 'E', r);
    await p.click(chip('Q')); await p.waitForTimeout(80); await p.click('#kvPick [data-pick="T"]'); await p.waitForTimeout(80);
    r = await p.evaluate(() => document.getElementById('kvHint').textContent);
    ok(`${id}: picking a key another stack holds asks first`, /^T already holds the right-click stack\. Swap them Pick another$/.test(r), r);
    await p.click('#kvHint [data-kv="other"]'); await p.waitForTimeout(80);
    await p.fill('#kvOther', 'volume'); await p.press('#kvOther', 'Enter'); await p.waitForTimeout(80);
    r = await p.evaluate(() => ({ pick: !!document.getElementById('kvPick'), err: (document.getElementById('kvOtherErr') || {}).textContent || '', inv: document.getElementById('kvOther').getAttribute('aria-invalid') }));
    ok(`${id}: "Pick another" reopens the picker, and "Other key" refuses a key the game can't bind`, r.pick && /isn't a key the game can bind/.test(r.err) && r.inv === 'true', r);
    await p.fill('#kvOther', 'f5'); await p.press('#kvOther', 'Enter'); await p.waitForTimeout(120);
    r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('companion-save-v6')); return s.chars[s.current].keyBinds; });
    ok(`${id}: "Other key" binds a typed key the game takes (f5 → F5)`, JSON.stringify(r) === '{"E":"R","Q":"F5"}', r);
    await ctx.close();
  }
  /* Fixture macro (window.__macros, the page's test hook; no class's data has these cases yet): a macro on Q of three
     steps, one a Delay other than 10 ms, one a lone skill */
  {
    const { ctx, p } = await page(1500);
    await ctx.addInitScript(() => { window.__macros = [{ quickslot: 'Quick Use 7', rows: [{ minLv: 1, steps: [{ slot: 'Quick Use 7' }, { slot: 'Quick Use 2', delayMs: 50 }, { skill: 'Shadowstrike' }] }] }]; });
    await load(p, typeof STATES.lv27 === 'function' ? STATES.lv27() : STATES.lv27, 'advanced');
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (d && !d.classList.contains('open')) document.getElementById('sdTab').click(); document.querySelectorAll('details').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const m = document.querySelector('#kvMacro .kv-mac');
      return { n: document.querySelectorAll('#kvMacro .kv-mac').length, head: m.querySelector('.khead').textContent, steps: [...m.querySelectorAll('ol.playsteps > li')].map(li => li.textContent.trim()),
        fine: [...m.querySelectorAll('ol.macro-steps > li')].map(x => x.textContent) }; });
    const id = 'keys fixture macro lv27 1500px';
    ok(`${id}: a macro on Q is headed with its key and its step count`, r.n === 1 && r.head === 'Macro on Q · 3 steps', r.head);
    ok(`${id}: its steps in order: the Q stack, the right-click stack with "· Delay 50 ms", then one skill`, r.steps.length === 3
      && r.steps[0] === 'Q: Quick Use 7 · the whole Q stack, row 0 first'
      && r.steps[1] === 'Right click: Quick Use 2 · the whole right click stack, row 0 first · Delay 50 ms'
      && /Shadowstrike · one skill$/.test(r.steps[2]) && !/Delay/.test(r.steps[0] + r.steps[2]), r.steps);
    ok(`${id}: 2+ steps add "Up to 20 steps" to the make-it line, and the key line names Q`, r.fine.length === 2
      && /Up to 20 steps\. Left click can only be the last step\.$/.test(r.fine[0]) && /^Put it on Q \(this guide's choice, not a rule\)/.test(r.fine[1]), r.fine);
    await ctx.close();
  }
  /* The key box tooltip on a phone (Design Lead on #853, rev 2.2 §1): at 360 and 260 px, Lv 45 (the longest names), every
     filled box's tooltip, opened by a tap (a click focuses the box), sits inside the grid and the screen and holds the whole
     "name · key, row N" text. The ::after's box is worked out from its used width and the box's side class. */
  for (const w of [360, 260]) {
    const { ctx, p } = await page(w);
    await load(p, typeof STATES.lv45 === 'function' ? STATES.lv45() : STATES.lv45, 'advanced');
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (d && !d.classList.contains('open')) document.getElementById('tabBuild').click(); document.querySelectorAll('#statDrawer details').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(600);
    const n = await p.evaluate(() => document.querySelectorAll('#stackViz > .sk[data-tip]').length), bad = [];
    for (let i = 0; i < n; i++) {
      const box = p.locator('#stackViz > .sk[data-tip]').nth(i);
      await box.scrollIntoViewIfNeeded(); await box.click(); await p.waitForTimeout(30);
      bad.push(await box.evaluate(c => { const s = getComputedStyle(c, '::after'), b = c.getBoundingClientRect(), g = c.parentElement.getBoundingClientRect(), tw = parseFloat(s.width);
        const left = c.classList.contains('tip-l') ? b.left : c.classList.contains('tip-r') ? b.right - tw : b.left + b.width / 2 - tw / 2;
        const ok = document.activeElement === c && s.content === JSON.stringify(c.dataset.tip) && s.whiteSpace === 'normal' && left >= g.left - 0.5 && left + tw <= g.right + 0.5 && left >= 0 && left + tw <= innerWidth;
        return ok ? null : { tip: c.dataset.tip, left, tw, g: [g.left, g.right], focused: document.activeElement === c }; }));
    }
    ok(`keys tooltip lv45 ${w}px: a tap opens each box's tooltip, inside the grid and the screen, wrapping whole`, n > 0 && !bad.filter(Boolean).length, bad.filter(Boolean));
    await ctx.close();
  }
  for (const sn of ['lv27', 'lv45']) {
    const { ctx, p } = await page(1500);
    await load(p, typeof STATES[sn] === 'function' ? STATES[sn]() : STATES[sn], 'advanced');
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (d && !d.classList.contains('open')) document.getElementById('sdTab').click(); document.querySelectorAll('details').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(600);
    keyGridChecks(await p.evaluate(keyGridProbe), `${sn} advanced 1500px`);
    if (sn === 'lv27') await keySetupBehaviour(p, sn);
    await ctx.close();
  }

  /* ---------- 6. touch: field sizes, primary buttons, minimum text; 7. story connector ---------- */
  /* Lv 20 (generated) adds the Daevanion cost column, "open" board rows and "+N more" objectives */
  for (const sn of ['fresh', 'lv20', 'lv27', 'lv45']) for (const mode of ['basic', 'advanced']) {
    const id = `${sn} ${mode} 390px touch`;
    const { ctx, p } = await page(390, { isMobile: true, hasTouch: true });
    await load(p, sn === 'lv20' ? 'fixture20' : typeof STATES[sn] === 'function' ? STATES[sn]() : STATES[sn], mode);
    await p.evaluate(() => { const d = document.getElementById('statDrawer'); if (d && !d.classList.contains('open')) document.getElementById('sdTab').click();
      document.querySelectorAll('details').forEach(x => { x.open = true; }); });
    await p.waitForTimeout(250);
    const r = await p.evaluate(([PRIMARY, GLYPH, BIGNUM]) => {
      const desc = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : '');
      const vis = e => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0; };
      const fields = [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]), select, textarea')]
        .filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).map(e => desc(e) + ' ' + getComputedStyle(e).fontSize);
      const prim = [...document.querySelectorAll(PRIMARY)].filter(vis).filter(e => e.getBoundingClientRect().height < 43.5).map(e => desc(e) + ' ' + Math.round(e.getBoundingClientRect().height));
      const small = [];
      for (const e of document.querySelectorAll('body *')) {
        if (!vis(e) || e.closest('svg') || e.closest(GLYPH) || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize), min = /Mono|monospace/.test(cs.fontFamily) ? 11 : 12;
        if (fs > 0 && fs < min - .01) /* 0 px: text deliberately not rendered (a folded cleared step) */ small.push((e.parentElement ? desc(e.parentElement) + ' > ' : '') + desc(e) + ' ' + fs);
      }
      const tgt = [...document.querySelectorAll('.fold-btn, .numctl button')].filter(vis).map(e => [desc(e), e.getBoundingClientRect()])
        .filter(([, b]) => b.width < 43.5 || b.height < 43.5).map(([d, b]) => d + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
      const first = document.querySelector('ul.story > li.st:not(:empty)');
      const line = first && getComputedStyle(first, '::before').content;
      const big = BIGNUM.map(id => document.getElementById(id)).filter(Boolean).filter(e => getComputedStyle(e).fontSize !== '18px').map(e => desc(e) + ' ' + getComputedStyle(e).fontSize);
      return { tgt: [...new Set(tgt)], fields, big, prim: [...new Set(prim)], small: [...new Set(small)], line };
    }, [PRIMARY, GLYPH, BIGNUM]);
    ok(`touch ${id}: fields at 16 px or more (no zoom on focus)`, !r.fields.length, r.fields);
    ok(`touch ${id}: the big number fields stay at 18 px`, !r.big.length, r.big);
    ok(`touch ${id}: primary buttons at least 44 px tall`, !r.prim.length, r.prim);
    ok(`touch ${id}: mode switch and number steppers at least 44 px (phone patch A)`, !r.tgt.length, r.tgt);
    ok(`touch ${id}: no text under 11 px (mono) / 12 px`, !r.small.length, r.small);
    if (sn === 'fresh') ok(`story ${id}: no connector above the first story row`, r.line === 'none', r.line);
    keyGridChecks(await p.evaluate(keyGridProbe), id);
    await ctx.close();
  }

  /* ---------- 8. page zoom: no sideways scroll, no card header past its card (195 px = 200 % on a 390 px phone) ---------- */
  for (const width of [195, 260, 640]) for (const mode of ['basic', 'advanced']) {
    const { ctx, p } = await page(width);
    await load(p, { ...USER }, mode);
    const r = await p.evaluate(() => {
      const out = [];
      /* each element's own text runs are measured too, since a row-reverse flex box overflows to the left (no sideways
         scroll) and its text isn't an element */
      const past = (name, els, cr) => { for (const h of els) {
        if (!h.offsetParent) continue;
        const rs = [h.getBoundingClientRect()];
        for (const t of h.childNodes) if (t.nodeType === 3 && t.textContent.trim()) { const g = document.createRange(); g.selectNodeContents(t); rs.push(g.getBoundingClientRect()); }
        for (const hr of rs) if (hr.width && (hr.right > cr.right + 0.5 || hr.left < cr.left - 0.5))
          out.push(name + ' > ' + h.tagName.toLowerCase() + '.' + String(h.className).split(' ')[0] + ' "' + (h.textContent || '').trim().slice(0, 24) + '" ' +
            Math.round(hr.left) + '–' + Math.round(hr.right) + ' in ' + Math.round(cr.left) + '–' + Math.round(cr.right));
      } };
      /* section headers outside a card (Milestones) stay inside the viewport */
      past('page', [...document.querySelectorAll('.sec, .sec *')].filter(h => !h.closest('.card')), { left: 0, right: innerWidth });
      for (const card of document.querySelectorAll('.card')) {
        const cr = card.getBoundingClientRect(); if (!cr.width) continue;
        /* headers, plus the Dungeons region headers, section heads and rows */
        past(card.id || card.className, card.querySelectorAll('.sec, .sec *, h2, h3, summary, summary *, .zone-h, .zone-h *, .asec, .asec *, .item.arow *'), cr);
        /* a row's sub-line cut off by the row's own overflow: hidden (max-height) */
        for (const li of card.querySelectorAll('.item.arow')) if (li.offsetParent && li.scrollHeight > li.clientHeight + 1)
          out.push((card.id || card.className) + ' > li.arow clipped "' + (li.textContent || '').trim().slice(0, 24) + '" ' + li.scrollHeight + ' > ' + li.clientHeight);
        /* the map pin doesn't sit on the row's name */
        for (const li of card.querySelectorAll('.item.arow')) {
          const a = li.querySelector('.amap'), b = li.querySelector('.txt'); if (!a || !b || !li.offsetParent) continue;
          const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
          if (ar.width && br.width && ar.left < br.right - 0.5 && ar.right > br.left + 0.5 && ar.top < br.bottom && ar.bottom > br.top)
            out.push((card.id || card.className) + ' > a.amap over "' + (b.textContent || '').trim().slice(0, 24) + '"');
        }
      }
      const wide = [];   /* what reaches past the viewport (not clipped by an ancestor, not fixed), for the failure message */
      if (document.documentElement.scrollWidth > innerWidth) for (const e of document.body.querySelectorAll('*')) {
        if (!e.offsetParent || e.getBoundingClientRect().right <= innerWidth + 0.5) continue;
        let clipped = false;
        for (let a = e; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).overflowX !== 'visible') clipped = true;
        if (!clipped) wide.push(e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0] + ' "' + (e.textContent || '').trim().slice(0, 20) + '" ' + Math.round(e.getBoundingClientRect().right));
      }
      return { over: document.documentElement.scrollWidth - innerWidth, wide: wide.slice(0, 8), hdr: [...new Set(out)].slice(0, 12) };
    });
    ok(`page zoom lv27 ${mode} ${width}px: no horizontal scroll`, r.over <= 0, [r.over, r.wide]);
    ok(`page zoom lv27 ${mode} ${width}px: no card header past its card`, !r.hdr.length, r.hdr);
    await ctx.close();
  }

  /* ---------- 9. folded cleared steps on phones ---------- */
  for (const sn of ['lv27', 'lv45']) {
    const { ctx, p } = await page(390);
    await load(p, typeof STATES[sn] === 'function' ? STATES[sn]() : STATES[sn], 'advanced');
    /* every card, the cleared ones too (hidden by "hide cleared cards"): at Lv 45 on "Forgotten Commander" the only ticked row
       of a shown card was g45's story line, which since E6 waits for that quest's turn-in (unticked), so check them all */
    await p.evaluate(() => document.querySelectorAll('#gates details.step').forEach(x => { x.open = true; x.hidden = false; }));
    /* one view (0.9 P21): ticked rows sit in each step's "Done and optional" fold, steps past the next in "All steps"; open them all */
    await p.evaluate(() => { state.open.allSteps = true; document.querySelectorAll('#gates .done-fold').forEach(b => { state.open[b.dataset.fkey] = true; }); update(); });
    await p.waitForTimeout(250);
    const r = await p.evaluate(() => {
      /* rendered rows only (a done milestone keeps its list collapsed even when open) */
      const items = [...document.querySelectorAll('#gates li.item')].filter(li => li.querySelector('input:checked') && li.querySelector('.txt') && li.getBoundingClientRect().height);
      const hiddenKept = [], focusHidden = []; let folded = 0;
      for (const li of items) {
        const t = li.querySelector('.txt'), name = (li.querySelector('.txt > b') || t).textContent.trim().slice(0, 40), lr = li.getBoundingClientRect();
        if (parseFloat(getComputedStyle(t).fontSize) === 0) folded++;
        const tr = t.getBoundingClientRect(); /* clipped outside .txt (e.g. by a line clamp) counts as hidden */
        for (const k of t.querySelectorAll(':scope > .note, :scope > .loc')) { const b = k.getBoundingClientRect(); if (!b.width || !b.height || b.bottom > tr.bottom + 1) hiddenKept.push(name + ' ' + k.className); }
        for (const f of t.querySelectorAll('a[href], button, input, select, summary, [tabindex]')) {
          if (!f.checkVisibility()) continue; /* display: none somewhere above: not focusable */
          const b = f.getBoundingClientRect();
          if (!b.width || !b.height || b.top < lr.top - 1 || b.bottom > lr.bottom + 1) focusHidden.push(name + ' > ' + f.tagName.toLowerCase() + '.' + f.className);
        }
      }
      return { n: items.length, folded, hiddenKept, focusHidden };
    });
    ok(`fold ${sn} 390px: ${r.n} ticked steps, ${r.folded} folded; warnings and Reward lines visible`, r.n > 0 && r.folded === r.n && !r.hiddenKept.length, r);
    ok(`fold ${sn} 390px: no hidden link or button can take focus`, !r.focusHidden.length, r.focusHidden);
    await ctx.close();
  }

  /* ---------- 10. derived rows (0.3 E4): a row done in the story is a ticked, disabled box with a name ---------- */
  for (const width of [390, 1500]) {
    const counts = {};
    for (const mode of ['basic', 'advanced']) {
      const { ctx, p } = await page(width);
      await p.goto(CFG.CUR);
      /* Lv 22, story one quest past "Daeva in a Dream" (g6:0 … g16:monolith byStory, g22:0 wrapper), a stored false on
         g16:0, "In the Fang Legion's Name" picked up (its prerequisites by follow-up) */
      const q = await p.evaluate(() => QUESTS[QUESTS.findIndex(x => questNameOf(x[1]) === 'Daeva in a Dream') + 1][1]); /* a story key (save v6) */
      await writeSave(p, { checks: { 'g16:0': false }, started: { 'rq:2202017': 1 }, level: 22, quest: q, mode, open: {} });
      await p.reload(); await p.waitForTimeout(400);
      await p.evaluate(() => document.querySelectorAll('#gates details.step').forEach(x => { x.open = true; x.hidden = false; }));
      const id = `derived ${mode} ${width}px`;
      const r = await p.evaluate(() => [...document.querySelectorAll('#gates input[data-derived]')].map(i => ({ k: i.dataset.k, checked: i.checked, disabled: i.disabled, label: i.getAttribute('aria-label') || '', title: i.title })));
      counts[mode] = r.map(x => x.k).sort().join(' ');
      ok(`${id}: derived rows (byStory, wrapper, follow-up) are ticked and disabled`, ['g16:0', 'g22:0', 'rq:2202016'].every(k => r.some(x => x.k === k)) && r.every(x => x.checked && x.disabled), r);
      ok(`${id}: each has a name and a tooltip saying "done in the story"`, r.length && r.every(x => /\S: done in the story$/.test(x.label) && /^done in the story/.test(x.title)), r.slice(0, 4));
      await p.addScriptTag({ content: AXE });
      const ax = await p.evaluate(async () => (await axe.run('#gates', { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, n: v.nodes.length, first: v.nodes.slice(0, 2).map(x => x.target.join(' ')) })));
      ok(`${id}: axe on the milestones, no violations outside the allowlist`, !ax.filter(v => !ALLOW[v.id]).length, ax);
      /* 11. the Ascension bar (0.3 E8): shown in both modes, a progressbar with a name and a value (2 / 4 here: Perceives and
         Hears the Voice derived from their wrappers), its label as visible text */
      const asc = await p.evaluate(() => { const el = document.getElementById('asc'), b = el && el.querySelector('[role="progressbar"]');
        return { shown: !!el && el.offsetParent !== null, name: b && b.getAttribute('aria-label'), now: b && b.getAttribute('aria-valuenow'), max: b && b.getAttribute('aria-valuemax'),
          text: b && b.getAttribute('aria-valuetext'), on: b ? b.querySelectorAll('.on').length : -1, label: el ? el.querySelector('.asc-txt').textContent : '',
          desc: b && (document.getElementById(b.getAttribute('aria-describedby')) || {}).textContent }; });
      counts[mode] += ' | ' + asc.label;
      ok(`${id}: Ascension bar shown, a progressbar named "Ascension" with value 2 of 4, described by its label`, asc.shown && asc.name === 'Ascension' && asc.now === '2' && asc.max === '4' &&
        asc.text === '2 of 4 chapters done' && asc.on === 2 && asc.label === 'Ascension 2 / 4 · next: Dreams · gauge 100%' && asc.desc === asc.label, asc);
      const axAsc = await p.evaluate(async () => (await axe.run('#asc', { resultTypes: ['violations'] })).violations.map(v => v.id));
      ok(`${id}: axe on the Ascension bar, no violations`, !axAsc.length, axAsc);
      /* A3: the story moves back before "Buried Atrocities": the stored false shows again, the box is enabled */
      const back = await p.evaluate(() => { char(state).quest = QUESTS.find(x => questNameOf(x[1]) === 'Buried Atrocities')[1] /* its story key (save v6) */; update(); const i = document.querySelector('#gates input[data-k="g16:0"]');
        return { checked: i.checked, disabled: i.disabled, derived: 'derived' in i.dataset, label: i.getAttribute('aria-label'), stored: char(state).checks['g16:0'] }; });
      ok(`${id}: story moved back: g16:0 unticked and enabled again, its stored false untouched`, !back.checked && !back.disabled && !back.derived && back.label === null && back.stored === false, back);
      await ctx.close();
    }
    ok(`derived ${width}px: the same derived rows and Ascension bar in Basic and Advanced`, counts.basic === counts.advanced, counts);
  }

  /* ---------- 12. the Ascension label wraps instead of being cut off on a phone (owner, 2026-10-16): 390 px Basic and 360 px
     Basic / Advanced, touch (the 12 px phone size), at every story position and at 4 / 4 (all four steps ticked). It must
     not be nowrap or ellipsised, and its right edge stays inside the #asc card. The suites block web fonts (fallback
     fonts, tests/run.mjs), but this is a width check in the font users get, so it adds the shipped Figtree 400 itself. ---------- */
  for (const [W, mode] of [[390, 'basic'], [360, 'basic'], [360, 'advanced']]) {
    const { ctx, p } = await page(W, { hasTouch: true });
    await p.goto(CFG.CUR);
    await writeSave(p, { checks: {}, level: 45, quest: '', mode, open: {} });
    await p.reload(); await p.waitForTimeout(400);
    const FIG = fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'fonts', 'figtree-latin.woff2')).toString('base64');
    const r = await p.evaluate(async fig => {
      const f = new FontFace('Figtree', Uint8Array.from(atob(fig), ch => ch.charCodeAt(0)), { weight: '400' }); document.fonts.add(await f.load());
      const s = () => document.querySelector('#asc .asc-txt'), out = { size: getComputedStyle(s()).fontSize, font: f.status, n: 0, want: QUESTS.length + 2, wide: [] };
      const fits = () => { const t = s(), cs = getComputedStyle(t), right = t.getBoundingClientRect().right, card = document.getElementById('asc').getBoundingClientRect().right;
        out.n++; if ((cs.whiteSpace === 'nowrap' || cs.textOverflow !== 'clip' || right > card + 0.5 || t.scrollWidth > t.clientWidth) && out.wide.length < 3) out.wide.push(`${t.textContent} (${cs.whiteSpace}, ${cs.textOverflow}, right ${right} vs card ${card})`); };
      for (const q of ['', ...QUESTS.map(x => x[1])]) { char(state).quest = q; update(); fits(); }
      Object.assign(char(state).checks, { 'g6:0': true, 'g22:0': true, 'g32:dreams': true, 'g45:witness': true }); update(); fits();
      return out;
    }, FIG);
    ok(`Ascension label never clipped at ${W}px (touch, ${mode}, ${r.size} Figtree, wraps rather than cuts off): ${r.n} positions`, r.size === '12px' && r.font === 'loaded' && r.n === r.want && !r.wide.length, r);
    await ctx.close();
  }

  /* ---------- 13. Active / Passive tags on the Skills card (0.2.7, F2): 390 px, Basic and Advanced, every level 1-45: each skill
     shown (the hero and every Coming up row, specialty rows too) carries a visible "Active" / "Passive" tag, and it matches
     the data (skills.json type, compiled to SP_SKILLS[].passive). The tag is text, so it is in the accessible name. ---------- */
  const SK_TYPES = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'packs', 'aion2', 'classes', 'assassin', 'skills.json'), 'utf8')).records.map(x => [x.name, x.type]));
  for (const mode of ['basic', 'advanced']) {
    const { ctx, p } = await page(390);
    await p.goto(CFG.CUR);
    await writeSave(p, { checks: {}, level: 45, quest: '', mode, open: {} });
    await p.reload(); await p.waitForTimeout(400);
    const r = await p.evaluate(TYPES => {
      const out = { rows: 0, checked: 0, bad: [], names: new Set(), levels: 0, empty: [] };
      const names = SP_SKILLS.map(s => s.n).sort((a, b) => b.length - a.length);
      for (let lv = 1; lv <= 45; lv++) {
        char(state).level = lv; update(); out.levels++;
        /* every skill row in the DOM: the hero (not the "All planned upgrades spent" card) and each Coming up row */
        const rows = [...document.querySelectorAll('#spHero .sphero:not(.spdone) .spname, #spSoon .sname')];
        if (!rows.length && !document.querySelector('#spHero .spdone')) out.empty.push(lv);
        for (const el of rows) {
          out.rows++;
          const text = el.textContent.trim(), n = names.find(x => text.startsWith(x));
          if (!n) { out.bad.push(`Lv ${lv}: no recognised skill name in "${text.slice(0, 40)}"`); continue; }
          const tag = el.querySelector('.sptype'), want = TYPES[n] === 'passive' ? 'Passive' : TYPES[n] === 'active' ? 'Active' : 'a type in skills.json';
          out.checked++; out.names.add(n);
          if (!tag || tag.textContent !== want || !el.textContent.includes(want)) out.bad.push(`Lv ${lv} ${n}: ${tag ? tag.textContent : 'no tag'} (want ${want})`);
        }
      }
      return { rows: out.rows, checked: out.checked, levels: out.levels, empty: out.empty, skills: out.names.size, bad: out.bad.slice(0, 5), hasBoth: SP_SKILLS.some(s => s.passive) && SP_SKILLS.some(s => !s.passive),
        /* the compiled flag agrees with the JSON type, and every compiled skill has one */
        drift: SP_SKILLS.filter(s => TYPES[s.n] !== (s.passive ? 'passive' : 'active')).map(s => s.n) };
    }, SK_TYPES);
    ok(`${mode} 390px: every skill row on the Skills card has an Active / Passive tag matching the data (${r.rows} rows, all ${r.checked} checked, ${r.skills} skills, ${r.levels} levels)`,
      r.rows > 0 && r.checked === r.rows && r.levels === 45 && !r.empty.length && !r.drift.length && r.skills > 1 && r.hasBoth && !r.bad.length, r);
    await ctx.close();
  }

  /* ---------- 14. Save safety (0.2.5): the export nudge (with the amber "Last backup" line) at 390 / 1500 px × Basic /
     Advanced, and the iPhone Home Screen hint at 390 px with touch: inside the role=status slot (not an alert), buttons
     named, axe-clean (contrast included), focus not moved to them, 44 px buttons on touch. ---------- */
  {
    const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    const BASE = { checks: { 'g22:0': true }, level: 27, open: {}, quest: '' };
    const cases = [];
    for (const width of [390, 1500]) for (const mode of ['basic', 'advanced']) cases.push({ id: `nudge ${mode} ${width}px`, card: 'nudge', width, mode, days: 15 });
    for (const mode of ['basic', 'advanced']) cases.push({ id: `hint ${mode} 390px touch`, card: 'a2hs', width: 390, mode, days: 2, opts: { userAgent: IPHONE, hasTouch: true, isMobile: true } });
    for (const c of cases) {
      const { ctx, p } = await page(c.width, c.opts);
      await p.goto(CFG.CUR);
      const now = await p.evaluate(() => Date.now()), d = c.days; /* the page's clock */
      await writeSave(p, { ...BASE, mode: c.mode, backup: d >= 14 ? { lastExportAt: now - d * 864e5 } : { since: now - d * 864e5 } }, { fresh: true });
      await p.reload(); await p.waitForTimeout(400);
      await p.addScriptTag({ content: AXE });
      const r = await p.evaluate(async card => {
        const el = document.getElementById(card), box = el && el.getBoundingClientRect(), slot = el && el.closest('[role]');
        const btns = el ? [...el.querySelectorAll('button')].map(x => ({ n: (x.getAttribute('aria-label') || x.textContent).trim(), h: Math.round(x.getBoundingClientRect().height), type: x.type })) : [];
        const line = document.getElementById('backupLine');
        const v = await axe.run(document, { resultTypes: ['violations'] });
        return { shown: !!el && !el.hidden && box.height > 0, role: slot && slot.getAttribute('role'), btns, focus: el && el.contains(document.activeElement),
          stale: line && line.classList.contains('stale'), axe: v.violations.map(x => ({ id: x.id, n: x.nodes.length, first: x.nodes.slice(0, 2).map(y => y.target.join(' ')) })) };
      }, c.card);
      const bad = r.axe.filter(v => !ALLOW[v.id]);
      ok(`save safety ${c.id}: shown in a role=status slot, buttons named, focus not moved, axe-clean`, r.shown && r.role === 'status' && r.btns.length === 2 && r.btns.every(x => x.n && x.type === 'button') && !r.focus && !bad.length && (c.card !== 'nudge' || r.stale), { ...r, axe: bad });
      if (c.opts && c.opts.hasTouch) ok(`save safety ${c.id}: buttons at least 44 px tall on touch`, r.btns.every(x => x.h >= 44), r.btns);
      await ctx.close();
    }
  }

  /* ---------- 0.6 P16: cards open as the game unlocks them (owner-ok-0.6.2-icons-locks Q1, replacing owner-ok-S1 Q1's
     "Advanced only": faded at desktop width in Basic and Advanced, hidden on phones in both). Skills open at Lv 4,
     Daevanion after "Urgent Pursuit" ("Cemetery Cleanup" is the quest after it), Stigmas at Lv 22. A locked card is out of
     the page and the tab order; a faded shell is one named block with nothing focusable. 0.6.2 P19 (Q2): a level unlock's
     shell counts down ("18 levels to go" at Lv 4, "1 level to go" at Lv 21), a quest unlock's has no count. ---------- */
  {
    const CARDS = { spCard: 'Skills', dvBox: 'Daevanion', stCard: 'Stigmas' };
    const STAGES = [
      { id: 'Lv 1', save: { level: 1, checks: {}, open: {} }, open: [], left: { spCard: '3 levels to go', dvBox: '', stCard: '21 levels to go' } },
      { id: 'Lv 4', save: { level: 4, checks: {}, open: {} }, open: ['spCard'], left: { dvBox: '', stCard: '18 levels to go' } },
      { id: 'after "Urgent Pursuit"', save: { level: 13, quest: 'Cemetery Cleanup', checks: {}, open: {} }, open: ['spCard', 'dvBox'], left: { stCard: '9 levels to go' } },
      { id: 'Lv 21', save: { level: 21, quest: 'Cemetery Cleanup', checks: {}, open: {} }, open: ['spCard', 'dvBox'], left: { stCard: '1 level to go' } },
      { id: 'Lv 22', save: { level: 22, quest: 'Cemetery Cleanup', checks: {}, open: {} }, open: ['spCard', 'dvBox', 'stCard'], left: {} },
    ];
    for (const [width, mode] of [[1500, 'advanced'], [1500, 'basic'], [390, 'advanced'], [390, 'basic']]) for (const st of STAGES) {
      const faded = width > 860, id = `locked cards ${st.id} ${mode} ${width}px`;
      const { ctx, p } = await page(width);
      await load(p, st.save, mode);
      const r = await p.evaluate(ids => ids.map(root => { const el = document.getElementById(root), sh = document.getElementById(root + 'Lock');
        const focusIn = x => !!x && [...x.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')].some(f => f.tabIndex >= 0 && f.offsetParent !== null);
        return { root, shown: el.offsetParent !== null, shell: !!sh && sh.offsetParent !== null, label: sh && sh.getAttribute('aria-label'), role: sh && sh.getAttribute('role'),
          focus: !el.offsetParent && focusIn(el), shellFocus: focusIn(sh), line: sh ? sh.querySelector('.lockline').textContent : '',
          left: sh && sh.querySelector('.lockleft') ? sh.querySelector('.lockleft').textContent : '' }; }), Object.keys(CARDS));
      for (const x of r) {
        const open = st.open.includes(x.root), name = CARDS[x.root];
        if (open) ok(`${id}: ${name} shown, no shell`, x.shown && !x.shell, x);
        else if (faded) {
          ok(`${id}: ${name} locked: card hidden, faded shell "${x.label}" (role group) with nothing to tab to`,
            !x.shown && x.shell && x.role === 'group' && x.label.startsWith(name + ', opens ') && /^Opens /.test(x.line) && !x.shellFocus, x);
          const want = st.left[x.root];
          ok(`${id}: ${name} shell count ${want ? `"${want}" (also in its name)` : 'none (quest unlock)'}`,
            x.left === want && (want ? x.label.endsWith(', ' + want) : !/to go/.test(x.label)), x);
        }
        else ok(`${id}: ${name} locked: hidden, no shell, nothing of it in the tab order`, !x.shown && !x.shell && !x.focus, x);
      }
      if (faded && (st.id === 'Lv 1' || st.id === 'Lv 4')) {
        await p.addScriptTag({ content: AXE });
        const ax = await p.evaluate(async () => (await axe.run('.top-grid', { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, n: v.nodes.length })));
        ok(`${id}: axe on the faded shells, no violations outside the allowlist`, !ax.filter(v => !ALLOW[v.id]).length, ax);
      }
      await ctx.close();
    }
  }

  /* ---------- 0.6 P18: a term's explanation is a disclosure (mockup §1.4): the mark is a button with aria-expanded that
     names its note with aria-describedby; Enter / Space open and close it, Esc closes it and focus stays on the mark, one
     is open at a time; on a phone focus alone doesn't open it, on desktop focus does. ---------- */
  for (const [width, opts] of [[390, { isMobile: true, hasTouch: true }], [1500, {}]]) {
    const id = `term ${width}px`, { ctx, p } = await page(width, opts);
    await load(p, { level: 22, quest: 'Cemetery Cleanup', checks: {}, open: {} }, 'advanced');
    await p.evaluate(() => { document.getElementById('syncBox').open = true; document.querySelectorAll('#spCard details.mini').forEach(d => { d.open = true; }); });
    const st = sel => p.evaluate(s => { const b = document.querySelector(s), n = b && document.getElementById(b.getAttribute('aria-describedby'));
      return { tag: b && b.tagName, type: b && b.type, name: b && b.textContent.trim(), exp: b && b.getAttribute('aria-expanded'), ctl: b && b.getAttribute('aria-controls'),
        note: n ? n.textContent : null, shown: !!n && !n.hidden && n.offsetHeight > 0, inCard: !!n && !!n.closest('section.card'), focus: document.activeElement === b }; }, sel);
    const DV = 'button.term[data-term="term:daevanion"]', SPEC = 'button.term[data-term="term:specialty"]';
    await p.focus(DV);
    const f = await st(DV);
    ok(`${id}: the mark is a named button with aria-expanded, describedby its note (one sentence, at most 140 characters)`, f.tag === 'BUTTON' && f.type === 'button' && f.name === 'Daevanion'
      && !!f.ctl && f.note && f.note.length <= 140 && /^[^.!?]+[.!?]$/.test(f.note) && f.inCard, f);
    ok(`${id}: focus ${width > 860 ? 'opens' : "doesn't open"} it`, width > 860 ? f.exp === 'true' && f.shown : f.exp === 'false' && !f.shown, f);
    if (width > 860) { await p.keyboard.press('Escape'); ok(`${id}: Esc closes it, focus stays on the mark`, await st(DV).then(x => x.exp === 'false' && !x.shown && x.focus)); }
    await p.keyboard.press('Enter');
    ok(`${id}: Enter opens it, in the card's flow`, await st(DV).then(x => x.exp === 'true' && x.shown && x.focus));
    await p.addScriptTag({ content: AXE });
    const ax = await p.evaluate(async () => (await axe.run('#spCard', { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, n: v.nodes.length })));
    ok(`${id}: axe on the Skills card with a note open, no violations outside the allowlist`, !ax.filter(v => !ALLOW[v.id]).length, ax);
    await p.keyboard.press('Enter');
    ok(`${id}: Enter again closes it`, await st(DV).then(x => x.exp === 'false' && !x.shown));
    await p.keyboard.press('Space');
    ok(`${id}: Space opens it`, await st(DV).then(x => x.exp === 'true' && x.shown));
    await p.focus(SPEC); await p.keyboard.press('Enter');
    const [a, s] = [await st(DV), await st(SPEC)];
    ok(`${id}: one open at a time`, a.exp === 'false' && !a.shown && s.exp === 'true' && s.shown, { a, s });
    await p.keyboard.press('Escape');
    ok(`${id}: Esc closes it`, await st(SPEC).then(x => x.exp === 'false' && !x.shown && x.focus));
    await ctx.close();
  }

  /* ---------- 0.5 P5: bottom tab bar and Build sheet at 390 px ---------- */
  {
    const { ctx, p } = await page(390, { isMobile: true, hasTouch: true });
    await load(p, typeof STATES.lv27 === 'function' ? STATES.lv27() : STATES.lv27, 'basic');
    await p.evaluate(() => { if (document.getElementById('statDrawer').classList.contains('open')) document.getElementById('sdClose').click(); });
    await p.waitForTimeout(300);
    const bar = await p.evaluate(() => { const bs = [...document.querySelectorAll('#tabBar button')].map(b => b.getBoundingClientRect()); const r = document.getElementById('tabBar').getBoundingClientRect(); return { n: bs.length, minH: Math.min(...bs.map(b => b.height)), minW: Math.min(...bs.map(b => b.width)), bottom: Math.round(r.bottom), ih: innerHeight, nav: !!document.querySelector('nav#tabBar[aria-label]') }; });
    ok('tab bar 390px: three tabs of at least 44 px, pinned to the bottom, a named nav', bar.n === 3 && bar.minH >= 44 && bar.minW >= 44 && bar.bottom === bar.ih && bar.nav, bar);
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(150);
    ok('tab bar 390px: still visible at the end of the page', await p.evaluate(() => Math.round(document.getElementById('tabBar').getBoundingClientRect().bottom) === innerHeight));
    await p.tap('#tabBar [data-go=nowStar]'); await p.waitForTimeout(1000);
    const route = await p.evaluate(() => { const t = document.getElementById('nowStar').getBoundingClientRect().top; return { t, bar: document.getElementById('lvlBar').getBoundingClientRect().bottom, half: innerHeight / 2 }; });
    ok('tab bar 390px: Route lands on Next up (just under the level bar)', route.t >= route.bar - 2 && route.t < route.half, route);
    await p.tap('#tabBar [data-go=top]'); await p.waitForTimeout(1000);
    ok('tab bar 390px: Gear lands on the top row', await p.evaluate(() => { const t = document.querySelector('#main .top-grid').getBoundingClientRect().top; return t < innerHeight / 2 && t > -4; }));
    const lv0 = await p.evaluate(() => char(state).level);
    await p.tap('#tabBuild'); await p.waitForTimeout(400);
    const open = await p.evaluate(() => { const s = document.getElementById('sdPanel'); return { in: s.contains(document.activeElement), exp: document.getElementById('tabBuild').getAttribute('aria-expanded'), inert: !!document.querySelector('[inert]'), side: getComputedStyle(document.getElementById('sdTab')).display }; });
    ok('Build sheet 390px: focus moves into the sheet, no inert region, side tab hidden', open.in && open.exp === 'true' && !open.inert && open.side === 'none', open);
    await p.tap('#lvlUpBig'); await p.waitForTimeout(400);
    ok('Build sheet 390px: Level up in the bar works while the sheet is open', await p.evaluate(l => char(state).level === l + 1 && document.getElementById('statDrawer').classList.contains('open'), lv0));
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    ok('Build sheet 390px: Escape closes it and focus returns to the Build tab', await p.evaluate(() => !document.getElementById('statDrawer').classList.contains('open') && document.activeElement.id === 'tabBuild'));
    await ctx.close();
  }

  /* ---------- 0.6.2 P17 (#397): a step card's how line (mockup §1-§2) and inline item icons (§4) ---------- */
  {
    /* every step below the level ticked, as the mockup's frames (the Lv 10 Extract card) */
    /* (only: tick the level's own steps too, all but that one, so it is the step Next up shows) */
    const upTo = async (p, L, only) => p.evaluate(([L, only]) => ({ level: L, quest: QUESTS.find(([l]) => l >= L)[1], open: {},
      checks: Object.fromEntries(GATES.filter(g => g.lv < L || (only && g.lv === L)).flatMap(g => g.items.filter(it => it.k && it.k !== only)).map(it => [it.k, true])) }), [L, only]);
    const card = (p, re) => p.evaluate(re => { /* the title without its "i" button */
      const h3Of = c => { const h = c.querySelector('h3').cloneNode(true); h.querySelectorAll('button').forEach(b => b.remove()); return h.textContent.trim(); };
      const c = [...document.querySelectorAll('#nowStar .ns-card')].find(x => new RegExp(re).test(h3Of(x)));
      if (!c) return null; const t = c.querySelector('.title'), kids = [...t.children].map(e => e.tagName + (e.className ? '.' + e.className.split(' ')[0] : ''));
      return { h3: h3Of(c), how: (t.querySelector('p.ns-how') || {}).textContent || '', i: !!c.querySelector('h3 .nsinfo'), info: (c.querySelector('.ns-info') || {}).textContent || '', kids, tip: !!c.querySelector('.ns-how .tip, .ns-info .tip') }; }, re);
    for (const [width, mode] of [[390, 'basic'], [390, 'advanced'], [1500, 'basic'], [1500, 'advanced']]) {
      const id = `step how ${mode} ${width}px`, { ctx, p } = await page(width);
      await load(p, null, mode); await load(p, await upTo(p, 10), mode);
      const x = await card(p, '^Extract gear');
      ok(`${id}: the Extract card is title + how line + meta line, the rest behind its "i"`, x && x.h3 === "Extract gear you've replaced" && x.how === 'Open the Cube, click the old piece, choose Extract and confirm.'
        && x.i && /^Only gear in your Cube can be extracted/.test(x.info) && x.kids.join() === 'H3,P.ns-how,P,SPAN.ns-info' && !x.tip, x);
      /* the how line is built from the step's text, not the card title (its short `ns` title has no how) */
      ok(`${id}: the how line is not the title`, x && !x.how.includes(x.h3), x);
      /* later rows stay title-only */
      const later = await p.evaluate(() => [...document.querySelectorAll('#nowStar .ns-card.later')].map(c => ({ t: c.querySelector('h3').textContent, how: !!c.querySelector('.ns-how'), i: !!c.querySelector('.nsinfo') })));
      ok(`${id}: Later rows have no how line and no "i" (${later.length})`, later.every(c => !c.how && !c.i), later);
      await ctx.close();
    }
    {
      /* a step with nothing after its bold phrase looks as before: no how line, no "i" (Assassin Lv 37 "Put … on E, then run the full rotation …") */
      const { ctx, p } = await page(1500);
      await load(p, null, 'advanced'); await load(p, await upTo(p, 37, 'g37:1'), 'advanced');
      /* its card view, as src/cards/nextup.js builds it for a step card (stepView: a page global, like every top-level name) */
      const x = await p.evaluate(() => { const g = GATES.find(g => g.items.some(it => it.k === 'g37:1')), it = g.items.find(it => it.k === 'g37:1');
        const v = stepView(g, { k: it.k, it }, {}); return { t: v.t, keys: Object.keys(v).sort().join() }; });
      ok('step how: a step with no text after its bold phrase gets no how line and no "i" (its view is only the title, as before)', /full rotation/.test(x.t) && x.keys === 't', x);
      await ctx.close();
    }
    /* item icons: the one matcher, milestone rows, the number + icon + word unit at 195 / 390 px */
    for (const width of [195, 390, 1500]) {
      const id = `item icons ${width}px`, { ctx, p } = await page(width);
      await load(p, null, 'advanced'); await load(p, { ...await upTo(p, 20), pendSt: 3, pendCr: 2 }, 'advanced');
      if (width === 1500) {
        const m = await p.evaluate(() => { const n = s => (itemLine(s).match(/<img class="itm-ico"/g) || []).length;
          return { soul: n('Soul Crystal'), souls: n('+1 Soul Crystals'), life: n('Life Crystal'), lifes: n('2 Life Crystals'), azphel: n('Azphel crystals'),
            reward: n('2 Crystals · 2 Wisdom Stones'), dc: n('Daevanion Crystals'), enh: n('Enhance Stones') + n('3 Enhancement Stones'), keys: ['Soul Crystal', 'Life Crystal', 'Wisdom Stones', 'Daevanion Crystal', 'crystals', 'Enhancement Stone'].map(itemKeyOf) }; });
        ok(`${id}: "Soul Crystal" / "Life Crystal" (and other named crystals) get no icon; the three items do`, m.soul + m.souls + m.life + m.lifes + m.azphel === 0 && m.reward === 2 && m.dc === 1 && m.enh === 2
          && m.keys.join() === ',,wisdom,crystal,crystal,enhance', m);
      }
      const d = await p.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const units = [...document.querySelectorAll('.itq, a.itm:has(> .itm-ico)')].filter(vis);
        return { gates: document.querySelectorAll('#gates .itm-ico').length, rows: document.querySelectorAll('#gates li.item .itm-ico').length,
          now: document.querySelectorAll('#nowStar .itm-ico').length, cube: !!document.querySelector('#nowStar .ns-card .itq .itm-ico'),
          note: document.querySelectorAll('#areaList .sh-note .itm-ico').length, units: units.length,
          split: units.filter(e => { const rs = [...e.getClientRects()].filter(r => r.width > 0); return rs.length !== 1; }).map(e => e.textContent) }; });
      ok(`${id}: no inline item icon in milestone rows (their tile shows it)`, d.gates === 0 && d.rows === 0, d);
      ok(`${id}: icons on the Next up cards (Cube counts, item links) and the Dungeons reward line`, d.now >= 2 && d.cube && d.note === 2, d);
      ok(`${id}: number, icon and word never wrap apart (${d.units} units)`, d.units >= 3 && !d.split.length, d);
      await ctx.close();
    }
  }

  ok('no page errors', !errs.length, errs);
  console.log(fail ? `A11Y CHECKS FAILED (${fail})` : 'A11Y CHECKS PASSED'); await b.close(); process.exit(fail ? 1 : 0);
})();
