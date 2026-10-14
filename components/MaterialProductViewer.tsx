"use client";
import {useMemo,useState} from "react";
import {ArrowUpRight,ChevronLeft,ChevronRight,ImageIcon,Info,Truck,ExternalLink,Search} from "lucide-react";
import {displayMoney,useShopLocale} from "./LocaleProvider";
import type {MaterialPhoto,MaterialProductEvidence,MaterialShippingPolicy,MaterialSourceVariant} from "../lib/material-product-evidence";
import type {FamilyProduct} from "../lib/material-product-families";
import type {SupplyCategory} from "../lib/materials-catalogue";

type Option={label:string;options:string[];nativePrice?:number;photoUrl?:string};
type Choice={title:string;sourceUrl:string;photos:MaterialPhoto[];currency:string;nativePrice?:number;startingPrice:boolean;variants:Option[];unpricedOptions:string[];optionNames:string[]};
const supplierCurrency=(url:string)=>url.includes("bountifulbaby.com")?"USD":url.includes("kebelka.com")?"EUR":"GBP";
const priceNumber=(s?:string)=>{if(!s)return undefined;const match=s.match(/[\d,]+(?:\.\d+)?/);if(!match)return undefined;const n=Number(match[0].replace(/,/g,""));return Number.isFinite(n)?n:undefined};
function choicesFromEvidence(evidence:MaterialProductEvidence,family:FamilyProduct[]):Choice[]{
 const lookup=new Map(family.map(p=>[p.sourceUrl,p]));
 const a=evidence.products.map(p=>{
  const familySource=lookup.get(p.sourceUrl);
  const enriched=p.variants.map(v=>{const match=familySource?.variants?.find(x=>x.label===v.label);
   return {label:v.label,options:v.options,nativePrice:match?.nativePrice??priceNumber(v.observedPrice),photoUrl:match?.photoUrl};
  });
  const firstPrice=familySource?.nativePrice??priceNumber(p.priceAtReview);
  return {title:p.title,sourceUrl:p.sourceUrl,photos:p.photos,currency:familySource?.currency??supplierCurrency(p.sourceUrl),
    nativePrice:firstPrice,startingPrice:!!p.priceAtReview?.startsWith("From"),variants:enriched,
    unpricedOptions:familySource?.unpricedOptions??[],optionNames:p.optionNames};
 });
 const known=new Set(a.map(p=>p.sourceUrl));
 const b:Choice[]=family.filter(p=>!known.has(p.sourceUrl)).map(p=>({
  title:p.title,sourceUrl:p.sourceUrl,
  photos:p.photoUrls.map(url=>({url,source:p.sourceUrl,credit:"Original supplier — source-matched "+p.title+" product photograph; photographer not independently identified"})),
  currency:p.currency,nativePrice:p.nativePrice,startingPrice:!!p.unpricedOptions?.length,
  variants:p.variants??[],unpricedOptions:p.unpricedOptions??[],optionNames:p.optionNames??[]
 }));
 return [...a,...b];
}
export default function MaterialProductViewer({itemName,evidence,shipping,collectionUrl,family,category}:{itemName:string;evidence:MaterialProductEvidence;shipping:MaterialShippingPolicy;collectionUrl:string;family:FamilyProduct[];category:SupplyCategory}){
 const {currency,fx,locale}=useShopLocale();
 const products=useMemo(()=>choicesFromEvidence(evidence,family),[evidence,family]);
 const[productIndex,setProductIndex]=useState(0);
 const[photoIndex,setPhotoIndex]=useState(0);
 const[variantIndex,setVariantIndex]=useState<number|null>(null);
 const[sizeIndex,setSizeIndex]=useState<number|null>(null);
 const[manualImage,setManualImage]=useState(false);
 const[filter,setFilter]=useState("");
 const[showAll,setShowAll]=useState(false);
 const product=products[productIndex]??products[0];
 const images=product?.photos??[];
 const variants=product?.variants??[];
 const selectedVariant=variantIndex===null?null:variants[variantIndex];
 const selectedPhoto=selectedVariant?.photoUrl&&!manualImage?{url:selectedVariant.photoUrl,source:product.sourceUrl,credit:"Original supplier — variant-specific photograph for "+selectedVariant.label}:images[Math.min(photoIndex,Math.max(0,images.length-1))];
 const price=selectedVariant?.nativePrice??product?.nativePrice;
 const money=price!==undefined?displayMoney(price,product.currency,currency,fx,locale):null;
 const isFromPrice=product?.startingPrice&&!selectedVariant?.nativePrice;
 function chooseProduct(i:number){setProductIndex(i);setVariantIndex(null);setSizeIndex(null);setPhotoIndex(0);setManualImage(false)}
 function chooseVariant(i:number){setVariantIndex(i);setSizeIndex(null);setPhotoIndex(0);setManualImage(false)}
 function galleryMove(change:number){setPhotoIndex(v=>(v+images.length+change)%images.length);setManualImage(true)}
 const matching=products.map((p,i)=>({...p,index:i})).filter(p=>p.title.toLowerCase().includes(filter.trim().toLowerCase()));
 const visible=showAll?matching:matching.slice(0,18);
 const kindName=category==="paints"?"Paints, shades & sets":category==="hair"?"Hair colours & textures":category==="eyes"?"Eye colours, styles & sizes":category==="tools"?"Tool types & gauges":"Product sizes & styles";
 return <section className="rbrn-material-viewer" aria-label={itemName+" product information"}>
  <div className="rbrn-material-gallery">
   <div className="rbrn-material-image-area">
    {selectedPhoto?<figure className="rbrn-material-main-image"><img src={selectedPhoto.url} alt={product.title+(selectedVariant?" — "+selectedVariant.label:"")+" — original supplier photograph"} loading="eager" decoding="async"/><figcaption>SUPPLIER PHOTO{selectedVariant?.photoUrl&&!manualImage?" · SELECTED OPTION":" · "+(photoIndex+1)+" / "+images.length}</figcaption></figure>
    :<div className="rbrn-material-photo-missing"><ImageIcon size={34}/><strong>Photograph awaiting review</strong><p>We do not substitute a different product's photo.</p></div>}
    {images.length>1&&<><button className="rbrn-material-image-prev" aria-label="Previous product photograph" type="button" onClick={()=>galleryMove(-1)}><ChevronLeft size={21}/></button><button className="rbrn-material-image-next" aria-label="Next product photograph" type="button" onClick={()=>galleryMove(1)}><ChevronRight size={21}/></button></>}
   </div>
   {images.length>1&&<div className="rbrn-material-thumbs" aria-label="Product photograph gallery">{images.map((img,i)=><button key={img.url} type="button" aria-label={"View image "+(i+1)} aria-pressed={manualImage&&i===photoIndex} className={manualImage&&i===photoIndex?"active":""} onClick={()=>{setPhotoIndex(i);setManualImage(true)}}><img src={img.url} alt="" loading="lazy" decoding="async"/></button>)}</div>}
   {selectedPhoto&&<p className="rbrn-material-photo-credit">Source: <a href={selectedPhoto.source} target="_blank" rel="noopener noreferrer">{selectedPhoto.credit} <ExternalLink size={12}/></a></p>}
  </div>
  <div className="rbrn-material-buy-detail">
   <span className="section-kicker">SOURCE-VERIFIED MAKER MATERIALS</span>
   <h2>{itemName}<span className="period">.</span></h2>
   <p className="rbrn-material-subheading">Explore the exact colours, sizes and products documented by the supplier. All purchasing takes place on the supplier's own website.</p>
   {products.length>1&&<section className="rbrn-material-family-section" aria-label={kindName}>
    <div className="rbrn-material-family-top"><strong>{kindName}</strong><span>{products.length} source-listed products</span></div>
    {products.length>12&&<label className="rbrn-material-family-search"><Search size={15}/><input type="search" value={filter} onChange={e=>{setFilter(e.target.value);setShowAll(false)}} placeholder="Find a colour, size or product…" aria-label="Search product shades and types"/></label>}
    <div className="rbrn-material-family-grid">
     {visible.map(p=><button key={p.sourceUrl} type="button" aria-pressed={p.index===productIndex} className={"rbrn-material-family-choice"+(p.index===productIndex?" active":"")} onClick={()=>chooseProduct(p.index)}>
      {p.photos[0]&&<img src={p.photos[0].url} loading="lazy" decoding="async" alt=""/>}
      <span>{p.title}</span>
      {p.nativePrice!==undefined&&<small>{displayMoney(p.nativePrice,p.currency,currency,fx,locale).text}{p.startingPrice?" +":""}</small>}
     </button>)}
    </div>
    {matching.length>18&&<button type="button" className="rbrn-material-show-more" onClick={()=>setShowAll(v=>!v)}>{showAll?"Show fewer products":"Show all "+matching.length+" products"}</button>}
    {!matching.length&&<p className="rbrn-material-no-matches">No matching shades in this documented range.</p>}
   </section>}
   <div className="rbrn-material-selected-product"><small>{products.length>1?"SELECTED SOURCE PRODUCT":"SOURCE PRODUCT"}</small><h3>{product?.title}</h3>
    {money&&<div className="rbrn-material-dated-price"><strong>{isFromPrice?"From ":""}{money.converted?"≈ ":""}{money.text}</strong><span>Supplier price observed {evidence.sourceChecked}</span></div>}
    {money&&money.converted&&<p className="rbrn-material-fx-note">Approximate conversion from {product.currency} using the latest available reference exchange rate dated {fx?.date}. The seller charges in its own currency and determines the final checkout price.</p>}
    {money&&!money.available&&<p className="rbrn-material-fx-note">Conversion into {currency} is temporarily unavailable. Showing the original supplier currency ({product.currency}).</p>}
    {price===undefined&&<p className="rbrn-material-fx-note">Price not independently confirmed for this product. Please check with the supplier.</p>}
   </div>
   {!!variants.length&&<section className="rbrn-material-variant-picker"><div className="rbrn-material-variant-heading"><strong>Choose {product.optionNames.filter(x=>x!=="Title").join(" & ").toLowerCase()||"an option"}</strong><span>{variants.length} documented choices</span></div>
    <p>Select a supplier-listed option. Only images actually associated with that option are shown as such.</p>
    <div className="rbrn-material-option-cards">{variants.map((v,i)=><button key={i} type="button" aria-pressed={i===variantIndex} className={i===variantIndex?"active":""} onClick={()=>chooseVariant(i)}>{v.photoUrl&&<img src={v.photoUrl} loading="lazy" decoding="async" alt=""/>}<span>{v.label}</span>{v.nativePrice!==undefined&&<small>{displayMoney(v.nativePrice,product.currency,currency,fx,locale).text}</small>}</button>)}</div>
    {selectedVariant&&<p className="rbrn-material-variant-current"><strong>Selected: {selectedVariant.label}</strong><span>Confirm this option and price with the seller.</span></p>}
   </section>}
   {!!product.unpricedOptions.length&&<section className="rbrn-material-variant-picker"><div className="rbrn-material-variant-heading"><strong>Container sizes shown by supplier</strong></div><div className="rbrn-material-option-cards rbrn-material-unpriced-options">{product.unpricedOptions.map((size,i)=><button key={size} type="button" aria-pressed={sizeIndex===i} className={sizeIndex===i?"active":""} onClick={()=>setSizeIndex(i)}><span>{size}</span></button>)}</div><p className="rbrn-material-options-note"><Info size={14}/> The price above is the range's observed starting price. We have not verified separate prices for each size; confirm the selected size and total at the supplier.</p></section>}
   <div className="rbrn-material-shipping-card">
    <div className="rbrn-material-shipping-title"><Truck size={19}/><strong>Delivery & supplier information</strong></div>
    <dl><div><dt>Supplier based in</dt><dd>{shipping.basedIn}</dd></div><div><dt>Published shipping policy</dt><dd>{shipping.international}</dd></div><div><dt>Delivery to your location</dt><dd>Confirm at supplier checkout</dd></div></dl>
    <p>{shipping.summary}</p><a href={shipping.source} target="_blank" rel="noopener noreferrer">Read supplier delivery information <ArrowUpRight size={13}/></a>
   </div>
   <a className="rbrn-material-shop-link" href={product?.sourceUrl??collectionUrl} target="_blank" rel="noopener noreferrer">View selected product at supplier <ArrowUpRight size={20}/></a>
   {product?.sourceUrl&&product.sourceUrl!==collectionUrl&&<a className="rbrn-material-collection-link" href={collectionUrl} target="_blank" rel="noopener noreferrer">Explore full supplier range <ArrowUpRight size={14}/></a>}
   <p className="rbrn-material-buy-disclaimer">Reborna does not sell or fulfil this item. Product and option names, images and prices are dated editorial observations, not live stock quotes. Supplier prices may have changed; confirm exact options, delivery and total cost directly with the seller. Currency conversions are estimates based on published reference rates, not guaranteed checkout amounts.</p>
  </div>
 </section>;
}
