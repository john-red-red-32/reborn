#!/usr/bin/env node
/** Publish due editorial pieces by updating a committed manifest.
 * Cloudflare Pages is statically generated: future article pages must NOT be
 * generated or included in sitemap until this file changes and deploys.
 * Zero extra runtime services, no customer data and no editorial database writes.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const schedule=load('lib/edit-schedule.json');
const manifest=load('lib/edit-release.json');
const todayArg=process.argv.find(x=>x.startsWith('--date='));
const day=todayArg?todayArg.slice('--date='.length):new Date().toISOString().slice(0,10);
if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Expected a UTC ISO date');
if(schedule.articles.length!==20||manifest.released.length<5)throw Error('Incorrect editorial publication queue');
const plan=new Map();
for(const item of schedule.articles){
 if(!/^[a-z0-9-]+$/.test(item.slug)||!/^2026-(11|12)-\d{2}$/.test(item.date)||plan.has(item.slug))throw Error('Invalid scheduled article: '+item.slug);
 plan.set(item.slug,item.date);
}
const published=new Set(manifest.released);
for(const slug of published){if(!plan.has(slug))throw Error('Released unknown article '+slug);if(plan.get(slug)>day&& !process.argv.includes('--check'))throw Error('Article released before scheduled date: '+slug);}
const due=schedule.articles.filter(x=>x.date<=day).map(x=>x.slug);
const newSlugs=due.filter(slug=>!published.has(slug));
if(process.argv.includes('--check')){
 if(schedule.articles.filter(x=>x.date==='2026-11-09').length!==5)throw Error('Expected exactly five launch stories');
 if(schedule.articles.at(-1)?.date>'2026-12-14')throw Error('Publication schedule exceeds 35 days');
 console.log('PASS: 20 planned articles, 5 launch slots; '+newSlugs.length+' currently due but not released');
 process.exit(0);
}
if(process.argv.includes('--dry-run')){console.log(JSON.stringify({today:day,due:newSlugs}));process.exit(0);}
if(newSlugs.length===0){console.log('No new articles due on '+day);process.exit(0);}
const next={version:1,released:[...published,...newSlugs].sort((a,b)=>plan.get(a).localeCompare(plan.get(b))||a.localeCompare(b)),updated:day};
writeFileSync(resolve(root,'lib/edit-release.json'),JSON.stringify(next,null,2)+'\n');
console.log('Published '+newSlugs.length+' scheduled articles for '+day+': '+newSlugs.join(', '));
