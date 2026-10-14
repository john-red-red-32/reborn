"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowRight,SlidersHorizontal} from "lucide-react";
import {supplierListings,supplyCategories} from "../lib/materials-catalogue";
import {materialProductEvidence} from "../lib/material-product-evidence";
import type {SupplyCategory} from "../lib/materials-catalogue";
export default function MaterialSuppliesExplorer(){
 const[category,setCategory]=useState<SupplyCategory|"all">("all");
 const[country,setCountry]=useState("all");
 const[method,setMethod]=useState("all");
 const listings=supplierListings.filter(x=>(category==="all"||x.category===category)&&(country==="all"||x.supplierCountry===country)&&(method==="all"||x.method===method));
 return <section className="rbrn-supplies-wrap" aria-label="Reborning materials and suppliers">
  <div className="rbrn-supplies-tabs" role="group" aria-label="Material categories">{supplyCategories.map(c=><button type="button" key={c.slug} aria-pressed={category===c.slug} className={category===c.slug?"active":""} onClick={()=>{setCategory(c.slug);setMethod("all");}}>{c.label}</button>)}</div>
  <div className="rbrn-supplies-filter"><span><SlidersHorizontal size={16}/> Discover materials <small>{listings.length} curated ranges</small></span><div>
   <label>Supplier based in <select value={country} onChange={e=>setCountry(e.target.value)}><option value="all">All supplier locations</option><option value="UK">UK</option><option value="US">USA</option><option value="Spain">Spain</option></select></label>
   {category==="paints"&&<label>Paint system <select value={method} onChange={e=>setMethod(e.target.value)}><option value="all">All systems</option><option value="Heat-set">Heat-set</option><option value="Air-dry">Air-dry</option><option value="Silicone">Silicone</option></select></label>}
  </div></div>
  <div className="rbrn-supplies-grid">{listings.map(item=>{
    const image=materialProductEvidence[item.slug]?.products[0]?.photos[0];
    return <article key={item.slug} className="rbrn-supply-card rbrn-supply-photo-card">
      <Link href={"/materials/"+item.slug+"/"} className="rbrn-supply-picture" aria-label={"Discover "+item.name}>{image?<img src={image.url} alt={item.name+" — featured supplier catalogue photograph"} loading="lazy" decoding="async"/>:<div className="rbrn-supply-art"><span>THE MAKER'S STUDIO</span><strong>✳</strong></div>}<span className="rbrn-supply-image-note">SUPPLIER PHOTOGRAPH</span></Link>
      <div className="rbrn-supply-info"><div className="rbrn-supply-meta"><span>{item.method??"ARTIST SUPPLIES"}</span></div>
       <h3><Link href={"/materials/"+item.slug+"/"}>{item.name}</Link></h3><p>{item.description}</p><div className="rbrn-supply-actions"><span>{item.maker}</span><Link href={"/materials/"+item.slug+"/"}>Discover more <ArrowRight size={15}/></Link></div>
      </div>
    </article>
   })}</div>
  {!listings.length&&<div className="rbrn-supplies-empty"><p>No product ranges match these filters yet.</p><button type="button" onClick={()=>{setCategory("all");setCountry("all");setMethod("all")}}>Clear filters</button></div>}
  <p className="rbrn-supplies-disclaimer">Editorial product photographs are source-attributed. The location filter refers to where the <em>supplier</em> is based, not where the product can be shipped. Explore each product for its published shipping policy and dated options. Orders are fulfilled externally.</p>
 </section>;
}
