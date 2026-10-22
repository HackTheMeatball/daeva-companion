/* 0.9 P22 macro frames (docs/design/0.9-keys-macro.md). Run: npm run build && node docs/design/0.9-keys/macro/shoot.mjs docs/design/0.9-keys/macro <outdir>; */
import { createServer } from 'node:http'; import { readFileSync, existsSync, statSync } from 'node:fs'; import { join, extname } from 'node:path'; import { createRequire } from 'node:module';
const ROOT='/home/user/daeva-companion', require=createRequire(ROOT+'/package.json'); const { chromium }=require('playwright'); const { writeSave }=require(ROOT+'/tests/support/save.js');
const D=process.argv[2], OUT=process.argv[3], T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const css=readFileSync(D+'/mock.css','utf8');
const s=await new Promise(r=>{const x=createServer((q,res)=>{let f=join(ROOT,'dist',decodeURIComponent(new URL(q.url,'http://x').pathname));if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':T[extname(f)]||'application/octet-stream'});res.end(readFileSync(f));}).listen(0,'127.0.0.1',()=>r(x));});
const url='http://127.0.0.1:'+s.address().port+'/'; const b=await chromium.launch();
for (const [name,file] of [['22-play-macro','play-macro.html'],['22-macro-steps','macro-steps.html']]) for (const [w,h] of [[1500,1100],[390,844]]) for (const theme of ['dark']) {
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,serviceWorkers:'block',reducedMotion:'reduce',colorScheme:theme}); const p=await ctx.newPage();
 await p.goto(url); await p.waitForTimeout(300); await writeSave(p,{open:{},hideCards:false,mode:'advanced',level:20},{fresh:true}); await p.reload(); await p.waitForTimeout(600);
 await p.addStyleTag({content:css}); const html=readFileSync(D+'/'+file,'utf8');
 await p.evaluate(v=>{ const o=document.createElement('div'); o.style.cssText='position:absolute;left:0;top:0;right:0;min-height:100vh;z-index:9999;background:var(--bg);padding:24px 16px;box-sizing:border-box;display:flex;justify-content:center;align-items:flex-start'; o.innerHTML=v; document.body.appendChild(o); window.scrollTo(0,0); },html);
 await p.waitForTimeout(300); const el=await p.$('.km'); await el.screenshot({path:`${OUT}/${name}-${w}.png`}); await ctx.close(); }
await b.close(); s.close();
