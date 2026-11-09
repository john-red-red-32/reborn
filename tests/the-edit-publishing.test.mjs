import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
const json=path=>JSON.parse(read(path));
const types=["events","sculpts","collecting","community"];
function articleFile(name){
 const content=read("lib/edit-"+name+".ts");
 const pos=content.indexOf("=[");
 assert.ok(pos>0,name);
 return JSON.parse(content.slice(pos+1).trim().replace(/;\s*$/,""));
}
const all=types.flatMap(articleFile);
const schedule=json("lib/edit-schedule.json").articles;
const published=json("lib/edit-release.json").released;
test("exactly 20 new Felix stories with distinct source-aware SEO identities",()=>{
 assert.equal(all.length,20);
 assert.equal(new Set(all.map(x=>x.slug)).size,20);
 assert.equal(new Set(all.map(x=>x.title)).size,20);
 for(const a of all){
  assert.match(a.slug,/^[a-z0-9-]+$/);
  assert.ok(a.title.length>=25&&a.title.length<=115,a.slug+": title");
  assert.ok(a.metaDescription.length>=80&&a.metaDescription.length<=170,a.slug+": description length");
  assert.ok(a.sections.length>=3,a.slug+": substantive sections");
  assert.ok(a.sections.every(s=>s.heading&&s.paragraphs.length>=2&&s.paragraphs.every(p=>p.length>=70)),a.slug+": substantial paragraphs");
  assert.ok(a.related.length>=3,a.slug+": valid internal discovery links");
  assert.ok(a.related.every(link=>link.href.startsWith("/")&&!link.href.startsWith("//")&&!link.href.includes("javascript:")),a.slug+": safe links");
  assert.match(a.published,/^2026-(11|12)-\d\d$/);
  assert.ok(!/https?:\/\//.test(a.lead),a.slug+": no raw links in prose");
 }
});
test("five go-live stories and 15 future releases, no hidden pages early",()=>{
 const slugs=new Set(all.map(a=>a.slug));
 assert.equal(schedule.length,20);
 assert.equal(published.length,5);
 assert.equal(new Set(published).size,5);
 assert.equal(schedule.filter(a=>a.date==="2026-11-09").length,5);
 for(const item of schedule){
  assert.ok(slugs.has(item.slug),"scheduled unknown "+item.slug);
  assert.equal(all.find(a=>a.slug===item.slug)?.published,item.date);
  if(item.date>"2026-11-09")assert.ok(!published.includes(item.slug),"future page released early: "+item.slug);
 }
 for(const slug of published)assert.ok(schedule.some(a=>a.slug===slug&&a.date==="2026-11-09"));
 assert.equal(schedule.at(-1).date,"2026-12-14");
});
test("every verified event has dedicated sourced editorial context or documented historical handling",()=>{
 const events=articleFile("events");
 assert.equal(events.length,5);
 assert.ok(events.every(a=>a.eventSlug&&a.sourceLinks?.length>=2));
 const slugs=new Set(all.filter(a=>a.eventSlug).map(a=>a.eventSlug));
 for(const expected of ["the-doll-show-basildon-2026","yophi-doll-show-2026","weissenfels-reborn-event-2027","west-coast-doll-show-2027","kansas-doll-show-2027","muval-valencia-2026"])assert.ok(slugs.has(expected),expected);
 for(const a of all.filter(a=>a.sourceLinks)){
  for(const s of a.sourceLinks){
   const url=new URL(s.url);
   assert.equal(url.protocol,"https:");
   assert.ok(!url.username&&!url.password);
   assert.ok(s.label.length>8);
  }
 }
});
test("static routes and sitemap derive exclusively from released editArticles",()=>{
 const src=read("lib/the-edit.ts");
 const page=read("app/the-edit/[slug]/page.tsx");
 const sitemap=read("app/sitemap.ts");
 assert.match(src,/editPipeline\.filter\(article=>publishedSlugs\.has\(article\.slug\)\)/);
 assert.match(page,/generateStaticParams\(\)\{return editArticles\.map/);
 assert.match(sitemap,/editArticles\.map\(article=>/);
 assert.match(page,/breadcrumbJsonLd/);
 assert.match(page,/safeJsonLd\(structured\)/);
 assert.match(page,/article\.sourceLinks/);
});
test("scheduled release workflow syncs the production branch when dates are due",()=>{
 const yaml=read(".github/workflows/publish-the-edit.yml");
 assert.match(yaml,/cron:/);
 assert.match(yaml,/node scripts\/publish-the-edit\.mjs/);
 assert.match(yaml,/git push origin HEAD:main/);
 assert.match(yaml,/git push origin HEAD:cloudflare-pages/);
 assert.ok(!yaml.includes("STRIPE_SECRET_KEY"));
});
