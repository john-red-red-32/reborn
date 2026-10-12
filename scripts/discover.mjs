#!/usr/bin/env node
/**
 * Controlled discovery demonstration:
 * fetches one explicitly allowlisted seed URL, extracts candidates into JSON,
 * never writes directly to the published catalogue.
 * Run manually: node scripts/discover.mjs
 */
import {mkdir,writeFile} from "node:fs/promises";
const SOURCE="https://www.cassielove.co.uk/";
const ua="RebornDiscoveryPrototype/0.1 (manual editorial research; contact repository owner)";
async function main(){
 const res=await fetch(SOURCE,{headers:{"User-Agent":ua,"Accept":"text/html"},signal:AbortSignal.timeout(12000)});
 if(!res.ok)throw new Error(`Source HTTP ${res.status}`);
 const html=await res.text();
 const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ");
 const names=["Lennox","Rosie","Harriet","Alessandro Awake","Noa","Lovan","Edith","Laurie","Elsie"];
 const discovered=names.filter(name=>text.toLowerCase().includes(name.toLowerCase())).map(name=>({name,source:SOURCE,discoveredAt:new Date().toISOString(),status:"needs_human_review",confidence:"name_mentioned_only"}));
 const output={source:SOURCE,fetchedAt:new Date().toISOString(),notice:"Discovery only. No prices, release status, copyright images or live inventory inferred. Respect website terms and robots rules.",discovered};
 await mkdir("data/import-review",{recursive:true});await writeFile("data/import-review/cassie-love-candidates.json",JSON.stringify(output,null,2));
 console.log(`Collected ${discovered.length} review candidates. No public catalogue changed.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
