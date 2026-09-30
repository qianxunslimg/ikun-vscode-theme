import {createRequire} from 'node:module';import {chromium} from 'playwright';import fs from 'node:fs';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const{frameSvg,FRAMES}=require('../src/typing-effects');
const uri=(style,frame)=>'data:image/svg+xml;base64,'+Buffer.from(frameSvg(style,frame,'#F5AA70','lively')).toString('base64');
const browser=await chromium.launch({executablePath:process.env.IKUN_CHROME||'/opt/google/chrome/chrome',args:['--no-sandbox']});
try{const page=await browser.newPage({viewport:{width:720,height:420},deviceScaleFactor:2});
 for(const size of [12,14,18,24,32]){
  await page.setContent(`<style>body{font:${size}px/${Math.round(size*1.35)}px monospace}.effect::after{content:url('${uri('basketball',2)}');display:inline-block;width:32px;height:1em;margin:${Math.min(0,size-29)}px -32px 0 0}</style><div><span id=left>const score = </span><span id=effect></span><span id=right>25;</span></div>`);
  const positions=()=>page.evaluate(()=>['left','right'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return{x:r.x,y:r.y}}));
  const before=await positions();await page.locator('#effect').evaluate(e=>e.className='effect');await page.waitForTimeout(50);assert.deepEqual(await positions(),before,`text shifted at ${size}px`);
 }
 const frames=['basketball','chick','spark'].flatMap(style=>Array.from({length:FRAMES},(_,f)=>uri(style,f)));
 await page.setContent(frames.map(src=>`<img src="${src}">`).join(''));await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.setContent(`<style>body{margin:0;padding:36px;background:#19191c;color:#e9e6e0;font:14px system-ui}h1{font-size:22px;font-weight:500}p{color:#9b99a2}section{display:flex;align-items:center;gap:20px;height:65px;border-bottom:1px solid #35343b}label{width:100px}code{font-size:19px}img{width:80px;height:56px}</style><h1>打字特效</h1><p>篮球弹跳 · 中分小鸡 · 轻盈火花</p>${['basketball','chick','spark'].map((s,i)=>`<section><label>${['篮球弹跳','中分小鸡','轻盈火花'][i]}</label><code>const score = 25;</code><img src="${uri(s,2)}"></section>`).join('')}`);
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await page.screenshot({path:'docs/previews/typing-styles.png'});
 console.log('PASS: all 36 animation frames decode; text x/y unchanged at 12, 14, 18, 24, 32px');
}finally{await browser.close()}
