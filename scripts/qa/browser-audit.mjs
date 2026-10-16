// Run in CI, or on a development machine with Playwright Chromium installed.
import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const require=createRequire(import.meta.url);
const directory='docs/audit-v2/generated';
await mkdir(directory+'/captures',{recursive:true});
const widths=[1440,1280,768,390,320];
const routes=['/','/projects/nlos-computational-imaging/','/projects/industrial-computer-vision/','/projects/cnn-reproducibility/','/projects/basel-tram-air/','/projects/distributed-sentiment-analysis/'];
const baseline=process.env.QA_BASELINE_DIR;
const servers=[await serve('dist',4173)];
if(baseline)servers.push(await serve(baseline,4174));
const browser=await chromium.launch({args:['--no-sandbox']});
const report={date:new Date().toISOString(),browser:browser.version(),conditions:{widths,height:900,deviceScaleFactor:1,reducedMotion:'reduce for deterministic captures; separate normal-motion test',network:'local HTTP, no throttling',baseline:process.env.QA_BASELINE_SHA||null},checks:[],errors:[]};
const verify=(condition,message)=>{if(!condition)report.errors.push(message);};
async function ready(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.loading!=='lazy'||i.getBoundingClientRect().top<innerHeight).map(i=>i.decode().catch(()=>{})));});}
try {
 for(const version of baseline?['before','after']:['after']){
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:900}});
  const page=await context.newPage();
  page.on('pageerror',error=>{if(version==='after')report.errors.push('Page error: '+error.message);});
  const base=version==='before'?'http://127.0.0.1:4174':'http://127.0.0.1:4173';
  for(const width of widths){
   await page.setViewportSize({width,height:900});
   for(const route of routes){
    const response=await page.goto(base+route);await ready(page);
    const layout=await page.evaluate(()=>{
     const visible=[...document.querySelectorAll('body *')].filter(e=>e.namespaceURI==='http://www.w3.org/1999/xhtml'&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
     const small=visible.filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>({text:e.textContent.trim().slice(0,60),size:getComputedStyle(e).fontSize}));
     const overflow=visible.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>document.documentElement.clientWidth+1||r.left< -1);}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,50)}));
     return {width:innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,small,overflow};
    });
    const check={version,width,route,status:response.status(),layout};
    report.checks.push(check);
    if(version==='after'){
     verify(response.status()===200,`${width} ${route}: status ${response.status()}`);
     verify(layout.scrollWidth<=layout.clientWidth,`${width} ${route}: horizontal overflow (${layout.scrollWidth}/${layout.clientWidth})`);
     verify(layout.small.length===0,`${width} ${route}: ${layout.small.length} text elements below 12px`);
     await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
     check.axe=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length};});
     verify(check.axe.violations.length===0,`${width} ${route}: axe ${check.axe.violations.map(v=>v.id).join(', ')}`);
    }
    if(route==='/'||width===1440||width===390){
     const name=route==='/'?'hero':route.split('/')[2];
     await page.screenshot({path:`${directory}/captures/${version}-${name}-${width}.jpg`,type:'jpeg',quality:85});
    }
    if(route==='/'){
     await page.getByRole('button',{name:'MAGYAR SA — Applied ML project',exact:true}).click();
     await ready(page);
     const panelHeight=await page.locator('#organization-details').evaluate(e=>e.getBoundingClientRect().height);
     await page.locator('#organizations').screenshot({path:`${directory}/captures/${version}-organizations-${width}.jpg`,type:'jpeg',quality:85});
     if(version==='after'){
      const labels=['ISL — Research internship','ENSISA — Engineering degree','UQAC — Master’s double-degree pathway'];
      for(const name of labels){await page.getByRole('button',{name,exact:true}).click();verify(Math.abs(await page.locator('#organization-details').evaluate(e=>e.getBoundingClientRect().height)-panelHeight)<1,`${width}: organization panel changes height`);}
      await page.getByRole('link',{name:'View education',exact:true}).focus();await page.keyboard.press('Escape');
      verify(await page.getByRole('button',{name:labels[2],exact:true}).evaluate(e=>e===document.activeElement),`${width}: organization Escape focus`);
      const logos=await page.locator('.logo-tile img').evaluateAll(images=>images.map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,filter:getComputedStyle(i).filter})));
      verify(logos.length===4&&logos.every(i=>i.loaded&&i.filter==='none'),`${width}: logo load or original colors`);check.logos=logos;
      if(width<681){await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation').getByRole('link',{name:'Projects',exact:true}).focus();await page.keyboard.press('Escape');verify(await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e===document.activeElement),`${width}: navigation Escape focus`);}
     }
    }
   }
  }
  await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:4173/');await ready(page);
 await page.getByRole('button',{name:'01 Signals'}).click();
 await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.cloud-points')).opacity)<0.01);
 verify(await page.locator('.signal-traces').evaluate(e=>getComputedStyle(e).opacity)==='1','Signal traces not visible');
 await page.getByRole('button',{name:'Pause visual animation'}).click();
 verify(await page.locator('.cloud-motion').evaluate(e=>getComputedStyle(e).animationPlayState)==='paused','Animation pause does not stop cloud');
 await page.emulateMedia({reducedMotion:'reduce'});
 verify(await page.locator('.signal-traces').evaluate(e=>getComputedStyle(e).animationName)==='none','Reduced motion is not respected');
 // Equivalent 200% reflow viewport; native browser zoom still requires a manual check.
 await page.setViewportSize({width:720,height:450});await page.goto('http://127.0.0.1:4173/');await ready(page);
 report.reflow200={method:'720 × 450 CSS viewport, equivalent to 1440 × 900 at 200%; not native browser zoom',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)};
 verify(!report.reflow200.overflow,'200% reflow viewport overflows');
 await page.screenshot({path:directory+'/captures/after-reflow-200.jpg',type:'jpeg',quality:85});
 const pdf=await page.request.get('http://127.0.0.1:4173/cv/Matthis-Lahargoue-CV.pdf');verify(pdf.status()===200&&pdf.headers()['content-type']==='application/pdf','CV download failed');
 const missing=await page.request.get('http://127.0.0.1:4173/does-not-exist/');verify(missing.status()===404,'Missing route must return 404');
 await page.goto('http://127.0.0.1:4173/#experience-magyar');await ready(page);verify(await page.locator('#experience-magyar').evaluate(e=>e.open),'Direct experience hash did not open details');
 await page.locator('#experience-magyar summary').focus();await page.keyboard.press('Enter');verify(!(await page.locator('#experience-magyar').evaluate(e=>e.open)),'Native keyboard disclosure did not close');
 await page.goto('http://127.0.0.1:4173/projects/industrial-computer-vision/');await page.getByRole('link',{name:'All projects',exact:true}).click();verify(new URL(page.url()).hash==='#projects','Case-study return link');
 await page.getByRole('link',{name:'Read NLOS computational imaging case study',exact:true}).click();await page.locator('.next-project').click();verify(new URL(page.url()).pathname==='/projects/industrial-computer-vision/','Next project navigation');
} catch(error){report.errors.push(error.stack);} finally {
 await browser.close();for(const server of servers)server.close();
 await writeFile(directory+'/browser.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({browser:report.browser,checks:report.checks.length,errors:report.errors},null,2));
 if(report.errors.length)process.exitCode=1;
}
