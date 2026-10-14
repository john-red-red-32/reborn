"use client";
import {useState} from "react";
import {ArrowUpRight,SlidersHorizontal} from "lucide-react";
import {supplierListings,supplyCategories} from "../lib/materials-catalogue";
import type {SupplyCategory} from "../lib/materials-catalogue";
export default function MaterialSuppliesExplorer(){
 const[category,setCategory]=useState<SupplyCategory|"all">("all");
 const[region,setRegion]=useState("all");
 const[method,setMethod]=useState("all");
 const listings=supplierListings.filter(x=>(category==="all"||x.category===category)&&(region==="all"||x.region===region)&&(method==="all"||x.method===method));
 return <section className="rbrn-supplies-wrap" aria-label="Reborning materials and suppliers">
  <div className="rbrn-supplies-tabs" role="group" aria-label="Material categories">{supplyCategories.map(c=><button type="button" key={c.slug} aria-pressed={category===c.slug} className={category===c.slug?"active":""} onClick={()=>setCategory(c.slug)}>{c.label}</button>)}</div>
  <div className="rbrn-supplies-filter"><span><SlidersHorizontal size={16}/> Curated supplies <small>{listings.length} supplier collections</small></span><div>
   <label>Region <select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">All regions</option><option value="UK">UK</option><option value="US">USA</option><option value="Spain">Spain</option></select></label>
   {category==="paints"&&<label>Paint system <select value={method} onChange={e=>setMethod(e.target.value)}><option value="all">All systems</option><option value="Heat-set">Heat-set</option><option value="Air-dry">Air-dry</option><option value="Silicone">Silicone</option></select></label>}
  </div></div>
  <div className="rbrn-supplies-grid">{listings.map((item,i)=><article key={item.slug} className="rbrn-supply-card"><div className="rbrn-supply-art" aria-hidden="true"><span>THE MAKER'S STUDIO</span><strong>{item.category==="paints"?"◒":item.category==="hair"?"〰":item.category==="eyes"?"◉":item.category==="tools"?"✳":"◇"}</strong><small>{item.method??supplyCategories.find(c=>c.slug===item.category)?.label}</small></div><div className="rbrn-supply-info">
   <div className="rbrn-supply-meta"><span>{item.region==="US"?"USA":item.region}</span><span>{item.method??"ARTIST SUPPLIES"}</span></div>
   <h3>{item.name}</h3><p>{item.description}</p><div className="rbrn-supply-actions"><span>{item.maker}</span><a href={item.url} target="_blank" rel="noopener noreferrer">View supplier <ArrowUpRight size={15}/></a></div>
  </div></article>)}</div>
  {!listings.length&&<div className="rbrn-supplies-empty"><p>No supplier collections match these filters yet.</p><button type="button" onClick={()=>{setCategory("all");setRegion("all");setMethod("all")}}>Clear filters</button></div>}
  <p className="rbrn-supplies-disclaimer">Independent editorial links, not Reborna inventory or endorsements. Prices, stock, shipping and product compatibility are determined by each supplier. No affiliate placements at launch. Sources reviewed 14 October 2026.</p>
 </section>;
}