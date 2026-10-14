"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {ArrowRight,ArrowUpRight,Search} from "lucide-react";
import {displayMoney,useShopLocale} from "./LocaleProvider";
import {materialProductPath,getMaterialProducts} from "../lib/material-routing";
import type {SupplyListing} from "../lib/materials-catalogue";
import {materialThumbnailStyle} from "../lib/material-image-style";
import {materialDisplayTitle} from "../lib/material-display-title";
import WishlistHeart from "./WishlistHeart";
export default function MaterialRangeProducts({listing,headingLevel="h2"}:{listing:SupplyListing;headingLevel?:"h1"|"h2"}){
 const Heading=headingLevel;
 const{currency,fx,locale}=useShopLocale();
 const[search,setSearch]=useState("");
 const[showAll,setShowAll]=useState(false);
 const[interactive,setInteractive]=useState(false);
 useEffect(()=>setInteractive(true),[]);
 const products=useMemo(()=>getMaterialProducts(listing.slug),[listing.slug]);
 const matching=products.filter(p=>p.title.toLowerCase().includes(search.toLowerCase())||materialDisplayTitle(p.title,listing.slug).name.toLowerCase().includes(search.toLowerCase()));
 const shown=showAll?matching:matching.slice(0,24);
 return <section className="rbrn-range-products" aria-label={listing.name+" individual products"}>
   <header className="rbrn-range-heading"><div><span className="section-kicker">THE MAKER'S STUDIO / {listing.method?.toUpperCase()||"MATERIALS"}</span><Heading>{listing.name}<span className="period">.</span></Heading><p>{listing.description}</p></div><span className="rbrn-range-counter">{products.length} distinct {products.length===1?"product":"products"}</span></header>
   {products.length>16&&<label className="rbrn-range-search"><Search size={17}/><input type="search" placeholder="Find a colour, style, product or size" aria-label="Search products in this range" value={search} onChange={e=>{setSearch(e.target.value);setShowAll(false)}}/></label>}
   <div className="rbrn-range-grid">{shown.map(p=>{const title=materialDisplayTitle(p.title,listing.slug);const price=p.nativePrice!==undefined?displayMoney(p.nativePrice,p.currency,currency,fx,locale):null;return <div className="rbrn-wishlist-wrapper" key={p.sourceUrl}><Link href={materialProductPath(listing.slug,p)} className="rbrn-range-card"><div className="rbrn-range-card-media">{p.photoUrls[0]&&<img src={p.photoUrls[0]} style={materialThumbnailStyle(p.photoUrls[0])} alt={p.title+" source photograph"} loading="lazy" decoding="async"/>}</div><div className="rbrn-range-card-content"><span>INDIVIDUAL PRODUCT</span><h3>{title.name}</h3>{title.detail&&<p className="rbrn-range-card-detail">{title.detail}</p>}<div><strong>{price?(p.unpricedOptions?.length?"From ":"")+(price.converted?"≈ ":"")+price.text:"View product"}</strong><ArrowRight size={17}/></div></div></Link><WishlistHeart item={{type:"material",path:materialProductPath(listing.slug,p),title:title.name,subtitle:listing.name,imageUrl:p.photoUrls[0]}}/></div>})}</div>
   {!matching.length&&<p className="rbrn-range-empty">No products match that search. Try another colour or style.</p>}
   {matching.length>24&&<button type="button" disabled={!interactive} className="rbrn-range-show-all" onClick={()=>setShowAll(x=>!x)}>{showAll?"Show fewer products":"Show all "+matching.length+" products"} <ArrowRight size={15}/></button>}
   <p className="rbrn-range-fineprint">Source-matched individual products and imagery; no stock guarantee. Prices are dated supplier observations and currency conversions are approximate. <a href={listing.url} target="_blank" rel="noopener noreferrer">Original range <ArrowUpRight size={13}/></a></p>
 </section>;
}
