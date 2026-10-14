"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,CalendarDays,Grid3X3,LayoutGrid,Search} from "lucide-react";
import {verifiedKits,artists,kitArtist} from "../lib/real-catalogue";
import {offersFor} from "../lib/retailer-offers";
import {cassieOfficialImages} from "../lib/cassie-images";
import SculptCalendar from "./SculptCalendar";
import WishlistHeart from "./WishlistHeart";
import MaterialFilter from "./MaterialFilter";
import {matchesSculptMaterial,type MaterialFilterValue} from "../lib/sculpt-material";
import {sculptStatus,statusRank,statusNames,statusTone,type DisplayStatus} from "../lib/sculpt-status";
type Filter="all"|Exclude<DisplayStatus,"unknown">;
const categories:[Filter,string][]=[["all","All sculpts"],["announced","Announced"],["preorder_open","Pre-order open"],["preorder_closed","Pre-order closed"],["in_production","In production"],["delayed","Delayed"],["available","Available"],["unavailable","Unavailable"],["sold_out","Sold out"]];
function date(k:(typeof verifiedKits)[number]){return k.releaseDate??k.preorderOpensAt??""}
export default function RealCatalogue(){
 const[term,setTerm]=useState("");const[material,setMaterial]=useState<MaterialFilterValue>("all");const[artist,setArtist]=useState("all");const[filter,setFilter]=useState<Filter>("all");const[layout,setLayout]=useState<"comfortable"|"compact">("compact");const[view,setView]=useState<"grid"|"calendar">("grid");
 const listed=useMemo(()=>verifiedKits.filter(k=>(artist==="all"||k.artistSlug===artist)&&(filter==="all"||sculptStatus(k)===filter)&&matchesSculptMaterial(k.material,material)&&[k.name,kitArtist(k.artistSlug)?.name].join(" ").toLowerCase().includes(term.toLowerCase())).sort((a,b)=>statusRank[sculptStatus(a)]-statusRank[sculptStatus(b)]||(date(a)&&date(b)?date(b).localeCompare(date(a)):date(a)?-1:date(b)?1:a.name.localeCompare(b.name))),[artist,filter,material,term]);
 
 return <div className="sculpt-discovery">
 <div className="sculpt-toolbar">
 <label className="sculpt-search"><Search size={17}/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Search sculpts or artists" aria-label="Search sculpts or artists"/></label>
 <label className="sculpt-artist-select">Sculptor <select value={artist} onChange={e=>setArtist(e.target.value)}><option value="all">All sculptors</option>{artists.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}</select></label>
 </div>
 <div className="sculpt-material-row"><span>Material</span><MaterialFilter value={material} onChange={setMaterial}/></div>
 <div className="sculpt-filter-row"><div className="sculpt-quick-filters" role="group" aria-label="Filter by release status">{categories.map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)} className={filter===key?"sculpt-filter active":"sculpt-filter"}>{label}</button>)}</div>
 <div className="sculpt-view-controls"><button className={view==="grid"?"selected":""} onClick={()=>setView("grid")} aria-pressed={view==="grid"}><LayoutGrid size={15}/> Collection</button><button className={view==="calendar"?"selected":""} onClick={()=>setView("calendar")} aria-pressed={view==="calendar"}><CalendarDays size={15}/> Calendar</button></div></div>
 <div className="sculpt-results-summary"><span>{listed.length} documented {listed.length===1?"sculpt":"sculpts"}</span>{view==="grid"&&<div className="sculpt-density" role="group" aria-label="Card size"><button title="Three-column compact view" aria-label="Compact grid" aria-pressed={layout==="compact"} className={layout==="compact"?"selected":""} onClick={()=>setLayout("compact")}><Grid3X3 size={17}/></button><button title="Two-column larger view" aria-label="Large cards" aria-pressed={layout==="comfortable"} className={layout==="comfortable"?"selected":""} onClick={()=>setLayout("comfortable")}><LayoutGrid size={17}/></button></div>}</div>
 {view==="grid"?<div className={layout==="compact"?"sculpt-results-grid compact":"sculpt-results-grid comfortable"}>{listed.map(k=>{const state=sculptStatus(k);const photos=k.photos?.length?k.photos:cassieOfficialImages[k.name]??[];return <div className="rbrn-wishlist-wrapper" key={k.slug}><Link href={`/kits/${k.slug}`} className="sculpt-result-card"><div className="sculpt-result-photo">{photos[0]?<><img src={photos[0].url} alt={k.name+" original reborn doll sculpt by "+(kitArtist(k.artistSlug)?.name||"the credited sculptor")} loading="lazy"/>{photos[1]&&<img className="sculpt-result-alt" src={photos[1].url} alt={"Alternate source-attributed photograph of "+k.name+" by "+(kitArtist(k.artistSlug)?.name||"its sculptor")} loading="lazy"/>}</>:<span>{k.name.charAt(0)}</span>}</div><div className="sculpt-result-meta">{kitArtist(k.artistSlug)?.name}</div><div className="sculpt-result-title"><h2>{k.name}</h2>{state!=="unknown"&&<span className={"unified-badge "+statusTone[state]}>{statusNames[state]}</span>}</div>{k.edition&&<p>{k.edition}</p>}</Link><WishlistHeart item={{type:"kit",path:`/kits/${k.slug}/`,title:k.name,subtitle:kitArtist(k.artistSlug)?.name||"Original sculptor",imageUrl:photos[0]?.url}}/></div>})}</div>:<SculptCalendar kits={listed}/>}

 {!listed.length&&<div className="sculpt-empty">No matching sculpts. <button onClick={()=>{setTerm("");setArtist("all");setFilter("all");setMaterial("all")}}>Clear filters</button></div>}
 </div>
}