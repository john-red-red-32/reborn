"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Heart,Search,X} from "lucide-react";
import {verifiedKits,kitArtist} from "../lib/real-catalogue";
import {cassieOfficialImages} from "../lib/cassie-images";
import MaterialFilter from "./MaterialFilter";
import {matchesSculptMaterial,type MaterialFilterValue} from "../lib/sculpt-material";
import {sculptStatus,statusNames,statusTone,type DisplayStatus} from "../lib/sculpt-status";

type FeedFilter="all"|"available"|"preorder";
const filterLabels:Record<FeedFilter,string>={all:"Discover all",available:"Available now",preorder:"Pre-orders"};
const sortRank:Record<DisplayStatus,number>={available:0,preorder_open:1,announced:2,in_production:3,preorder_closed:4,delayed:5,unknown:6,unavailable:7,sold_out:8};
const BATCH_SIZE=12;
const storedKey="reborna-saved-original-kits";

/** Real, finite catalogue: never recycle products or invent more inventory.
 * Next.js prerenders the first batch to static HTML; remaining source records
 * render automatically in batches as visitors approach the end of the feed.
 * The /real-kits catalogue remains the full browsable static source index.
 */
export default function DiscoverFeed(){
 const[term,setTerm]=useState("");
 const[filter,setFilter]=useState<FeedFilter>("all");
 const[material,setMaterial]=useState<MaterialFilterValue>("all");
 const[limit,setLimit]=useState(BATCH_SIZE);
 const[saved,setSaved]=useState<string[]>([]);
 const sentinel=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{try{const result=JSON.parse(localStorage.getItem(storedKey)||"[]");if(Array.isArray(result))setSaved(result.filter(x=>typeof x==="string"));}catch{}},[]);
 const items=useMemo(()=>verifiedKits.filter(k=>{
   const state=sculptStatus(k);
   return matchesSculptMaterial(k.material,material)&&(filter==="all"||filter==="available"&&state==="available"||filter==="preorder"&&state==="preorder_open")
     &&(k.name+" "+(kitArtist(k.artistSlug)?.name||"")).toLocaleLowerCase("en").includes(term.trim().toLocaleLowerCase("en"));
 }).sort((a,b)=>sortRank[sculptStatus(a)]-sortRank[sculptStatus(b)]||
   (b.statusChecked||"").localeCompare(a.statusChecked||"")||a.name.localeCompare(b.name)),[filter,material,term]);
 useEffect(()=>{setLimit(BATCH_SIZE)},[filter,material,term]);
 useEffect(()=>{
   const node=sentinel.current;
   if(!node||limit>=items.length||typeof IntersectionObserver==="undefined")return;
   const observer=new IntersectionObserver(entries=>{
     if(entries.some(e=>e.isIntersecting))setLimit(value=>Math.min(value+BATCH_SIZE,items.length))
   },{rootMargin:"650px 0px",threshold:0});
   observer.observe(node);
   return()=>observer.disconnect();
 },[limit,items.length]);
 function toggleSave(slug:string){
   setSaved(current=>{
     const next=current.includes(slug)?current.filter(x=>x!==slug):[...current,slug];
     try{localStorage.setItem(storedKey,JSON.stringify(next))}catch{}
     return next;
   });
 }
 return <section className="content discover-feed-section" id="catalogue" aria-labelledby="discover-feed-title">
   <div className="section-kicker">THE COLLECTOR'S DISCOVERY FEED</div>
   <div className="section-head discover-feed-intro"><div>
     <h2 id="discover-feed-title">Discover sculpt kits<span className="period">.</span></h2>
     <p>A continually growing collection of original reborn sculpts. Available kits first, followed by pre-orders and past favourites.</p>
   </div><Link className="discover-calendar-link" href="/calendar/">Release calendar <ArrowUpRight size={16}/></Link></div>
   <div className="discover-feed-tools">
     <label className="discover-feed-search"><Search size={18}/><input type="search" value={term} onChange={e=>setTerm(e.target.value)} placeholder="Find a sculpt or artist" aria-label="Search the sculpt collection"/>{term&&<button type="button" onClick={()=>setTerm("")} aria-label="Clear search"><X size={16}/></button>}</label>
     <div className="discover-feed-filters" role="group" aria-label="Filter original kits">{(["all","available","preorder"] as FeedFilter[]).map(key=><button key={key} className={filter===key?"active":""} type="button" onClick={()=>setFilter(key)} aria-pressed={filter===key}>{filterLabels[key]}</button>)}</div>
     <MaterialFilter value={material} onChange={setMaterial}/>
   </div>
   <div className="discover-feed-count" aria-live="polite">Showing {Math.min(limit,items.length)} of {items.length} documented {items.length===1?"sculpt":"sculpts"}{saved.length>0&&<span> · {saved.length} saved</span>}</div>
   {items.length?<div className="discover-feed-grid">{items.slice(0,limit).map(kit=>{
     const state=sculptStatus(kit);
     const photo=kit.photos?.[0]??cassieOfficialImages[kit.name]?.[0];
     return <article className="discover-feed-card" key={kit.slug}>
       <Link href={`/kits/${kit.slug}/`} className="discover-feed-art">
         {photo?<img src={photo.url} alt={kit.name+" original sculpt example"} loading="lazy" decoding="async"/>:<span className="discover-feed-initial">{kit.name.charAt(0)}</span>}
         <span className={"discover-feed-status unified-badge "+statusTone[state]}>{state==="unknown"?"Historical sculpt":statusNames[state]}</span>
       </Link>
       <button className={saved.includes(kit.slug)?"discover-save saved":"discover-save"} type="button" onClick={()=>toggleSave(kit.slug)} aria-label={saved.includes(kit.slug)?"Remove "+kit.name+" from saved sculpts":"Save "+kit.name} aria-pressed={saved.includes(kit.slug)}><Heart size={18} fill={saved.includes(kit.slug)?"currentColor":"none"}/></button>
       <div className="discover-feed-copy"><Link className="discover-feed-sculptor" href={`/artists/${kit.artistSlug}/`}>{kitArtist(kit.artistSlug)?.name||"Original sculptor"}</Link><Link className="discover-feed-name" href={`/kits/${kit.slug}/`}>{kit.name}<ArrowUpRight size={16}/></Link>{kit.sizeDescription&&<small>{kit.sizeDescription}</small>}{!kit.sizeDescription&&kit.edition&&<small>{kit.edition}</small>}</div>
     </article>
   })}</div>:<div className="discover-feed-empty"><h3>Nothing matching just yet.</h3><p>Try another artist or material. Kits without confirmed materials appear under All materials.</p><button type="button" onClick={()=>{setFilter("all");setMaterial("all");setTerm("")}}>Show all sculpts</button></div>}
   {items.length>limit&&<div className="discover-feed-load" ref={sentinel}><p>More original sculpts ahead</p><button type="button" onClick={()=>setLimit(value=>Math.min(value+BATCH_SIZE,items.length))}>Show more kits</button></div>}
   {items.length>0&&limit>=items.length&&<div className="discover-feed-end"><span>✧</span><p>You've explored every documented sculpt in this view. New originals will join the collection as sources are verified.</p><Link href="/artists/">Meet the artists <ArrowUpRight size={14}/></Link></div>}
   <p className="discover-feed-note">Availability and prices are dated seller observations, not guaranteed live stock. Purchases take place on the original artist's or retailer's website. Saved sculpts are stored only in this browser.</p>
 </section>;
}
