"use client";
import {useRef,useState} from "react";
import {ArrowLeft,ArrowRight,SlidersHorizontal} from "lucide-react";
import {supplierListings,supplyCategories} from "../lib/materials-catalogue";
import {materialProductEvidence} from "../lib/material-product-evidence";
import type {SupplyCategory} from "../lib/materials-catalogue";
import MaterialRangeProducts from "./MaterialRangeProducts";
import {materialThumbnailStyle} from "../lib/material-image-style";
import {useShopLocale} from "./LocaleProvider";
export default function MaterialSuppliesExplorer(){
 const{t}=useShopLocale();
 const[category,setCategory]=useState<SupplyCategory|"all">("all");
 const[country,setCountry]=useState("all");
 const[method,setMethod]=useState("all");
 const[selected,setSelected]=useState<string|null>(null);
 const resultsRef=useRef<HTMLDivElement>(null);
 const listing=selected?supplierListings.find(p=>p.slug===selected):undefined;
 const listings=supplierListings.filter(p=>(category==="all"||p.category===category)&&(country==="all"||p.supplierCountry===country)&&(method==="all"||p.method===method));
 function navigateRange(slug:string|null){
  setSelected(slug);
  window.requestAnimationFrame(()=>resultsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}));
 }
 return <section className="rbrn-supplies-wrap" aria-label={t("Reborning materials and suppliers")}>
  <div ref={resultsRef} className="rbrn-catalog-anchor"/>
  {listing?<>
   <div className="rbrn-range-navigation"><button type="button" onClick={()=>navigateRange(null)}><ArrowLeft size={17}/> {t("All material ranges")}</button><span>{t("Shop materials").toUpperCase()} / {listing.name.toUpperCase()}</span></div>
   <MaterialRangeProducts key={listing.slug} listing={listing}/>
  </>:<>
   <div className="rbrn-supplies-tabs" role="group" aria-label={t("Material categories")}>{supplyCategories.map(c=><button type="button" key={c.slug} aria-pressed={category===c.slug} className={category===c.slug?"active":""} onClick={()=>{setCategory(c.slug);setMethod("all")}}>{t(c.label)}</button>)}</div>
   <div className="rbrn-supplies-filter"><span><SlidersHorizontal size={16}/> {t("Discover materials")} <small>{listings.length} {t("curated ranges")}</small></span><div>
    <label>{t("Supplier based in")} <select value={country} onChange={e=>setCountry(e.target.value)}><option value="all">{t("All supplier locations")}</option><option value="UK">UK</option><option value="US">USA</option><option value="Spain">Spain</option></select></label>
    {category==="paints"&&<label>{t("Paint system")} <select value={method} onChange={e=>setMethod(e.target.value)}><option value="all">{t("All systems")}</option><option value="Heat-set">{t("Heat-set")}</option><option value="Air-dry">{t("Air-dry")}</option><option value="Silicone">{t("Silicone")}</option></select></label>}
   </div></div>
   <div className="rbrn-supplies-grid">{listings.map(item=>{
    const image=materialProductEvidence[item.slug]?.products[0]?.photos[0];
    return <article key={item.slug} className="rbrn-supply-card rbrn-supply-photo-card">
      <button type="button" onClick={()=>navigateRange(item.slug)} className="rbrn-supply-picture" aria-label={t("Browse products")+": "+item.name}>{image?<img src={image.url} style={materialThumbnailStyle(image.url)} alt={item.name+" — source-attributed catalogue photograph"} loading="lazy" decoding="async"/>:<div className="rbrn-supply-art"><span>{t("THE MAKER'S STUDIO")}</span><strong>✳</strong></div>}<span className="rbrn-supply-image-note">{t("SUPPLIER PHOTOGRAPH")}</span></button>
      <div className="rbrn-supply-info"><div className="rbrn-supply-meta"><span>{t(item.method??"ARTIST SUPPLIES")}</span></div>
       <h3><button type="button" className="rbrn-supply-title-button" onClick={()=>navigateRange(item.slug)}>{item.name}</button></h3><p>{item.description}</p><div className="rbrn-supply-actions"><span>{item.maker}</span><button type="button" onClick={()=>navigateRange(item.slug)}>{t("Browse products")} <ArrowRight size={15}/></button></div>
      </div>
    </article>;
   })}</div>
   {!listings.length&&<div className="rbrn-supplies-empty"><p>{t("No ranges match these filters yet.")}</p><button type="button" onClick={()=>{setCategory("all");setCountry("all");setMethod("all")}}>{t("Clear filters")}</button></div>}
   <p className="rbrn-supplies-disclaimer">{t("Editorial photographs are source-attributed. Supplier location does not determine where the product can ship. Browse a range, select an individual product, then choose its available options; purchases take place directly with the original supplier.")}</p>
  </>}
 </section>;
}
