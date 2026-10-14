"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowRight,ArrowUpRight,Search} from "lucide-react";
import {displayMoney,useShopLocale} from "./LocaleProvider";
import {materialProductPath,getMaterialProducts} from "../lib/material-routing";
import type {SupplyListing} from "../lib/materials-catalogue";
export default function MaterialRangeProducts({listing}:{listing:SupplyListing}){
 const{currency,fx,locale}=useShopLocale();
 const[search,setSearch]=useState("");
 const[showAll,setShowAll]=useState(false);
 const products=useMemo(()=>getMaterialProducts(listing.slug),[listing.slug]);
 const matching=products.filter(p=>p.title.toLowerCase().includes(search.toLowerCase()));
 const shown=showAll?matching:matching.slice(0,24);
 return <section className="rbrn-range-products" aria-label={listing.name+" individual products"}>
   <header className="rbrn-range-heading"><div><span className="section-kicker">THE MAKER'S STUDIO / {listing.method?.toUpperCase()||"MATERIALS"}</span><h2>{listing.name}<span className="period">.</span></h2><p>{listing.description}</p></div><span className="rbrn-range-counter">{products.length} distinct {products.length===1?"product":"products"}</span></header>
   {products.length>16&&<label className="rbrn-range-search"><Search size={17}/><input type="search" placeholder="Find a colour, style, product or size" aria-label="Search products in this range" value={search} onChange={e=>{setSearch(e.target.value);setShowAll(false)}}/></label>}
   <div className="rbrn-range-grid">{shown.map(p=>{const price=p.nativePrice!==undefined?displayMoney(p.nativePrice,p.currency,currency,fx,locale):null;return <Link key={p.sourceUrl} href={materialProductPath(listing.slug,p)} className="rbrn-range-card"><div className="rbrn-range-card-media">{p.photoUrls[0]&&<img src={p.photoUrls[0]} alt={p.title+" source photograph"} loading="lazy" decoding="async"/>}</div><div className="rbrn-range-card-content"><span>INDIVIDUAL PRODUCT</span><h3>{p.title}</h3><div><strong>{price?(p.unpricedOptions?.length?"From ":"")+(price.converted?"≈ ":"")+price.text:"View product"}</strong><ArrowRight size={17}/></div></div></Link>})}</div>
   {!matching.length&&<p className="rbrn-range-empty">No products match that search. Try another colour or style.</p>}
   {matching.length>24&&<button type="button" className="rbrn-range-show-all" onClick={()=>setShowAll(x=>!x)}>{showAll?"Show fewer products":"Show all "+matching.length+" products"} <ArrowRight size={15}/></button>}
   <p className="rbrn-range-fineprint">Source-matched individual products and imagery; no stock guarantee. Prices are dated supplier observations and currency conversions are approximate. <a href={listing.url} target="_blank" rel="noopener noreferrer">Original range <ArrowUpRight size={13}/></a></p>
 </section>;
}
