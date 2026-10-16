import { spawn } from 'node:child_process';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { serve } from './serve.mjs';
const directory='docs/audit-v2/generated';await mkdir(directory+'/lighthouse',{recursive:true});
const servers=[await serve('dist',4173)];if(process.env.QA_BASELINE_DIR)servers.push(await serve(process.env.QA_BASELINE_DIR,4174));
const report={date:new Date().toISOString(),node:process.version,conditions:'GitHub Actions ubuntu-24.04; Chromium from pinned Playwright; Lighthouse simulated throttling; local production build; fresh profile for each run; 3 runs per version and preset; no score threshold',runs:[]};
try {
 for(const version of process.env.QA_BASELINE_DIR?['before','after']:['after'])for(const preset of ['mobile','desktop'])for(let run=1;run<=3;run++){
  const output=`${directory}/lighthouse/${version}-${preset}-${run}`;
  const args=['node_modules/lighthouse/cli/index.js',`http://127.0.0.1:${version==='before'?4174:4173}/`,'--quiet','--output=json','--output=html',`--output-path=${output}`,'--throttling-method=simulate','--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--only-categories=performance,accessibility,best-practices,seo'];
  if(preset==='desktop')args.push('--preset=desktop');
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:'inherit',env:{...process.env,CHROME_PATH:chromium.executablePath()}});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`Lighthouse exited ${code}`)));});
  const r=JSON.parse(await readFile(output+'.report.json','utf8'));
  report.runs.push({version,preset,run,lighthouseVersion:r.lighthouseVersion,userAgent:r.userAgent,settings:r.configSettings,scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:r.audits['largest-contentful-paint'].numericValue,CLS:r.audits['cumulative-layout-shift'].numericValue,TBT:r.audits['total-blocking-time'].numericValue,FCP:r.audits['first-contentful-paint'].numericValue,INP:null});
 }
} finally {for(const server of servers)server.close();await writeFile(directory+'/lighthouse.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report.runs.map(({settings,userAgent,...r})=>r),null,2));
