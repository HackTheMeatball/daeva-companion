/* 0.9 P22 frames, rev 2 (docs/design/0.9-keys-macro.md): the real Build drawer, its Key setup fold closed or open, with
   the macro block (a fragment here) in place of today's three how-to lines. Run: npm run build && node docs/design/0.9-keys/macro/shoot.mjs docs/design/0.9-keys/macro <outdir> */
import { createServer } from 'node:http'; import { readFileSync, existsSync, statSync } from 'node:fs'; import { join, extname } from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const ROOT=fileURLToPath(new URL('../../../../',import.meta.url)).replace(/\/$/,''), require=createRequire(ROOT+'/package.json'); const { chromium }=require('playwright'); const { writeSave }=require(ROOT+'/tests/support/save.js'); const { writeFixture }=require(ROOT+'/tests/support/regress-fixture.js');
const D=process.argv[2], OUT=process.argv[3], T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const css=readFileSync(D+'/mock.css','utf8');
const s=await new Promise(r=>{const x=createServer((q,res)=>{let f=join(ROOT,'dist',decodeURIComponent(new URL(q.url,'http://x').pathname));if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':T[extname(f)]||'application/octet-stream'});res.end(readFileSync(f));}).listen(0,'127.0.0.1',()=>r(x));});
const url='http://127.0.0.1:'+s.address().port+'/'; const b=await chromium.launch();
/* name, level, fold open, fragment (null: today's fold, closed), widths, fixture mode (Lv 27 / 45 and Basic: the test fixture, stigmas equipped) */
const CASES=[['22-rotation',20,false,null,[1500,390]],['22-macro',20,true,'macro-lv20.html',[1500,390,360]],['22-macro-lv1',1,true,'macro-lv1.html',[390]],['22-macro-steps',20,true,'macro-steps.html',[1500,390]],
 ['22-macro-lv27',27,true,'macro-lv20.html',[390],'advanced'],['22-macro-lv45',45,true,'macro-lv20.html',[390],'advanced'],['22-macro-basic',20,true,'macro-lv20.html',[390],'basic']];
for (const [name,level,open,file,widths,fx] of CASES) for (const w of widths) {
 const ctx=await b.newContext({viewport:{width:w,height:w>1000?1100:844},deviceScaleFactor:1,serviceWorkers:'block',reducedMotion:'reduce',colorScheme:'dark'}); const p=await ctx.newPage();
 await p.goto(url); await p.waitForTimeout(300); if (fx) await writeFixture(p,{L:level,mode:fx,fx:'clean'}); else await writeSave(p,{open:{},hideCards:false,level},{fresh:true}); await p.reload(); await p.waitForTimeout(600);
 await p.addStyleTag({content:css}); const html=file?readFileSync(D+'/'+file,'utf8'):null;
 await p.evaluate(([html,open])=>{ document.getElementById('sdTab').click(); const hold=document.querySelector('#rotPlay li:last-child'); if (hold) hold.insertAdjacentHTML('beforeend',' <span class="muted">· right click alone drains MP (your test)</span>'); /* Saul 1: the clause line 3 carried */ const d=document.querySelector('#statDrawer details.mini'); d.open=open;
  if(html){ const m=d.querySelector('.macro-steps'); m.insertAdjacentHTML('afterend',html); m.remove(); }
  const sp=document.getElementById('sdPanel'); Object.assign(sp.style,{maxHeight:'none',height:'auto',overflow:'visible'});
  for (const x of document.body.querySelectorAll('*')) if (getComputedStyle(x).position==='fixed' && !x.contains(sp) && !sp.contains(x)) x.style.visibility='hidden'; /* the Level up bar would cover the tall frame */ },[html,open]);
 await p.waitForTimeout(500); const el=await p.$('#sdPanel'); await el.screenshot({path:`${OUT}/${name}-${w}.png`}); await ctx.close(); }
await b.close(); s.close();
