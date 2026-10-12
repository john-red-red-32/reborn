"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,CalendarDays,Grid3X3,LayoutGrid,Search} from "lucide-react";
import {verifiedKits,artists,kitArtist} from "../lib/real-catalogue";
import {offersFor} from "../lib/retailer-offers";
import {cassieOfficialImages} from "../lib/cassie-images";
import SculptCalendar from "./SculptCalendar";
type Filter="all"|"preorder"|"upcoming"|"available"|"sold";
const categories:[Filter,string][]=[["all","All sculpts"],["preorder","Pre-order"],["upcoming","Coming soon"],["available","Available"],["sold","Sold out"]];
function status(k:(typeof verifiedKits)[number]){const offers=offersFor(k.slug);if(offers.some(o=>o.status==="preorder"))return "preorder";if(offers.some(o=>o.status==="available"))return "available";if(offers.length&&offers.every(o=>o.status==="unavailable"))return "sold";const s=k.statusLabel.toLowerCase();if(s.includes("reconfirmation")||s.includes("unconfirmed")||s.includes("verify"))return "other";if(s.includes("pre-order")||s.includes("preorder"))return "preorder";if(s.includes("coming soon")||s.includes("announced"))return "upcoming";if(s.includes("in stock")||s.includes("available"))return "available";if(s.includes("sold out")||s.includes("out of stock")||s.includes("unavailable"))return "sold";return "other"}
const ranking:Record<string,number>={preorder:0,upcoming:1,available:2,other:3,sold:4};
function date(k:(typeof verifiedKits)[number]){return k.releaseDate??k.preorderOpensAt??""}
export default function RealCatalogue(){
 const[term,setTerm]=useState("");const[artist,setArtist]=useState("all");const[filter,setFilter]=useState<Filter>("all");const[layout,setLayout]=useState<"comfortable"|"compact">("compact");const[view,setView]=useState<"grid"|"calendar">("grid");
 const listed=useMemo(()=>verifiedKits.filter(k=>(artist==="all"||k.artistSlug===artist)&&(filter==="all"||status(k)===filter)&&[k.name,kitArtist(k.artistSlug)?.name].join(" ").toLowerCase().includes(term.toLowerCase())).sort((a,b)=>ranking[status(a)]-ranking[status(b)]||(date(a)&&date(b)?date(b).localeCompare(date(a)):date(a)?-1:date(b)?1:a.name.localeCompare(b.name))),[artist,filter,term]);
 
 return <div className="sculpt-discovery">
 <div className="sculpt-toolbar">
 <label className="sculpt-search"><Search size={17}/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Search sculpts or artists" aria-label="Search sculpts or artists"/></label>
 <label className="sculpt-artist-select">Sculptor <select value={artist} onChange={e=>setArtist(e.target.value)}><option value="all">All sculptors</option>{artists.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}</select></label>
 </div>
 <div className="sculpt-filter-row"><div className="sculpt-quick-filters" role="group" aria-label="Filter by release status">{categories.map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)} className={filter===key?"sculpt-filter active":"sculpt-filter"}>{label}</button>)}</div>
 <div className="sculpt-view-controls"><button className={view==="grid"?"selected":""} onClick={()=>setView("grid")} aria-pressed={view==="grid"}><LayoutGrid size={15}/> Collection</button><button className={view==="calendar"?"selected":""} onClick={()=>setView("calendar")} aria-pressed={view==="calendar"}><CalendarDays size={15}/> Calendar</button></div></div>
 <div className="sculpt-results-summary"><span>{listed.length} documented {listed.length===1?"sculpt":"sculpts"}</span>{view==="grid"&&<div className="sculpt-density" role="group" aria-label="Card size"><button title="Three-column compact view" aria-label="Compact grid" aria-pressed={layout==="compact"} className={layout==="compact"?"selected":""} onClick={()=>setLayout("compact")}><Grid3X3 size={17}/></button><button title="Two-column larger view" aria-label="Large cards" aria-pressed={layout==="comfortable"} className={layout==="comfortable"?"selected":""} onClick={()=>setLayout("comfortable")}><LayoutGrid size={17}/></button></div>}</div>
 {view==="grid"?<div className={layout==="compact"?"sculpt-results-grid compact":"sculpt-results-grid comfortable"}>{listed.map(k=>{const state=status(k);const photos=k.photos?.length?k.photos:cassieOfficialImages[k.name]??[];return <Link key={k.slug} href={`/kits/${k.slug}`} className="sculpt-result-card"><div className="sculpt-result-photo">{photos[0]?<><img src={photos[0].url} alt={k.name+" original reborn sculpt"} loading="lazy"/>{photos[1]&&<img className="sculpt-result-alt" src={photos[1].url} alt={"Another view of "+k.name} loading="lazy"/>}</>:<span>{k.name.charAt(0)}</span>}</div><div className="sculpt-result-meta">{kitArtist(k.artistSlug)?.name}</div><div className="sculpt-result-title"><h2>{k.name}</h2>{state!=="other"&&<span className={"unified-badge "+(state==="preorder"?"preorder":state==="available"?"available":state==="upcoming"?"upcoming":"sold")}>{state==="preorder"?"Pre-order":state==="available"?"Available":state==="upcoming"?"Coming soon":"Sold out"}</span>}</div>{k.edition&&<p>{k.edition}</p>}</Link>})}</div>:<SculptCalendar kits={listed}/>}

 {!listed.length&&<div className="sculpt-empty">No matching sculpts. <button onClick={()=>{setTerm("");setArtist("all");setFilter("all")}}>Clear filters</button></div>}
 </div>
}