"use client";
import {useEffect,useRef,useState} from "react";
import {ArrowUpRight,ChevronLeft,ChevronRight,ChevronDown,ImageIcon,Info,Truck,ExternalLink,Search} from "lucide-react";
import {displayMoney,useShopLocale} from "./LocaleProvider";
import type {MaterialProductEvidence,MaterialShippingPolicy} from "../lib/material-product-evidence";
import type {FamilyProduct} from "../lib/material-product-families";
import {materialThumbnailStyle,materialHasTighterFraming} from "../lib/material-image-style";
function parsedPrice(s?:string){const m=s?.match(/[\d,]+(?:\.\d+)?/);return m?Number(m[0].replace(/,/g,"")):undefined}
export default function MaterialProductViewer({product,evidence,shipping,collectionUrl,rangeName}:{product:FamilyProduct;evidence:MaterialProductEvidence;shipping:MaterialShippingPolicy;collectionUrl:string;rangeName:string}){
 const{currency,fx,locale}=useShopLocale();
 const[photoIndex,setPhotoIndex]=useState(0);
 const[manualPhoto,setManualPhoto]=useState(false);
 const[showFullPhoto,setShowFullPhoto]=useState(false);
 const[chosen,setChosen]=useState<number|null>(null);
 const[chosenSize,setChosenSize]=useState<number|null>(null);
 const[open,setOpen]=useState(false);
 const[search,setSearch]=useState("");
 const popoverRef=useRef<HTMLDivElement>(null);
 const galleryRef=useRef<HTMLDivElement>(null);
 const extra=evidence.products.find(p=>p.sourceUrl===product.sourceUrl);
 const photos=[...new Set([...(product.photoUrls||[]),...(extra?.photos.map(p=>p.url)||[])])];
 const variants=(product.variants?.length?product.variants:extra?.variants.map(v=>({label:v.label,options:v.options,nativePrice:parsedPrice(v.observedPrice),photoUrl:undefined as string|undefined})))??[];
 const sizes=product.unpricedOptions??[];
 const selected=chosen!==null?variants[chosen]:null;
 const chosenPhoto=selected?.photoUrl;
 const featured=chosenPhoto&&!manualPhoto?chosenPhoto:photos[Math.min(photoIndex,Math.max(0,photos.length-1))];
 const focusStyle=!showFullPhoto?materialThumbnailStyle(featured):undefined;
 const canToggleFraming=materialHasTighterFraming(featured);
 const selectedPrice=selected?.nativePrice??product.nativePrice??parsedPrice(extra?.priceAtReview);
 const money=selectedPrice!==undefined?displayMoney(selectedPrice,product.currency,currency,fx,locale):null;
 const hasOptions=variants.length>0||sizes.length>0;
 const selectedLabel=selected?.label??(chosenSize!==null?sizes[chosenSize]:null);
 const filtered=variants.map((v,i)=>({...v,index:i})).filter(v=>v.label.toLowerCase().includes(search.toLowerCase()));
 const rangePrice=sizes.length>0&&selected?.nativePrice===undefined;
 useEffect(()=>{
  if(!open)return;
  function onDown(event:PointerEvent){if(popoverRef.current&&!popoverRef.current.contains(event.target as Node))setOpen(false)}
  function onKey(event:KeyboardEvent){if(event.key==="Escape")setOpen(false)}
  document.addEventListener("pointerdown",onDown);
  document.addEventListener("keydown",onKey);
  return ()=>{document.removeEventListener("pointerdown",onDown);document.removeEventListener("keydown",onKey)};
 },[open]);
 function afterChoice(){setOpen(false);setManualPhoto(false);setShowFullPhoto(false);setPhotoIndex(0);if(window.matchMedia("(max-width: 1050px)").matches){window.requestAnimationFrame(()=>galleryRef.current?.scrollIntoView({behavior:"smooth",block:"start"}))}}
 function chooseVariant(index:number){setChosen(index);setChosenSize(null);afterChoice()}
 function chooseSize(index:number){setChosenSize(index);setChosen(null);afterChoice()}
 const credit="Original supplier — photograph of "+product.title+(selected?.photoUrl&&!manualPhoto?" / "+selected.label:"");
 return <section className="rbrn-material-viewer rbrn-material-single-product" aria-label={product.title+" product information"}>
  <div className="rbrn-material-gallery" ref={galleryRef}>
   <div className="rbrn-material-image-area">{featured?<figure className="rbrn-material-main-image"><img src={featured} style={focusStyle} alt={product.title+(selectedLabel?" — "+selectedLabel:"")+" supplier photograph"} decoding="async" loading="eager"/><figcaption>SUPPLIER PHOTO{chosenPhoto&&!manualPhoto?" · SELECTED OPTION":" · "+(photoIndex+1)+" / "+photos.length}</figcaption></figure>:<div className="rbrn-material-photo-missing"><ImageIcon size={34}/><strong>Product photograph awaiting review</strong><p>We don't substitute another product's photograph.</p></div>}
    {photos.length>1&&<><button type="button" className="rbrn-material-image-prev" aria-label="Previous photograph" onClick={()=>{setManualPhoto(true);setShowFullPhoto(false);setPhotoIndex(p=>(p+photos.length-1)%photos.length)}}><ChevronLeft size={21}/></button><button type="button" className="rbrn-material-image-next" aria-label="Next photograph" onClick={()=>{setManualPhoto(true);setShowFullPhoto(false);setPhotoIndex(p=>(p+1)%photos.length)}}><ChevronRight size={21}/></button></>}
    {canToggleFraming&&<button type="button" className="rbrn-material-frame-toggle" aria-pressed={showFullPhoto} title="Toggle between focused product view and complete supplier photograph" onClick={()=>setShowFullPhoto(v=>!v)}>{showFullPhoto?"Focus on product":"View full photograph"}</button>}
   </div>
   {photos.length>1&&<div className="rbrn-material-thumbs" aria-label="Gallery photographs">{photos.map((url,i)=><button key={url} type="button" aria-pressed={manualPhoto&&photoIndex===i} aria-label={"View photograph "+(i+1)} className={manualPhoto&&photoIndex===i?"active":""} onClick={()=>{setManualPhoto(true);setShowFullPhoto(false);setPhotoIndex(i)}}><img src={url} style={materialThumbnailStyle(url)} alt="" decoding="async" loading="lazy"/></button>)}</div>}
   {featured&&<p className="rbrn-material-photo-credit">Photo: <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">{credit} <ExternalLink size={12}/></a></p>}
  </div>
  <div className="rbrn-material-buy-detail">
   <span className="section-kicker">{rangeName.toUpperCase()} / ORIGINAL SUPPLIER</span>
   <h2>{product.title}<span className="period">.</span></h2>
   <p className="rbrn-material-subheading">Explore this product's supplier-listed options, photographs and dated prices. Complete any purchase directly with the original seller.</p>
   <div className="rbrn-material-selected-product"><small>SUPPLIER LISTED PRODUCT</small>
    {money?<div className="rbrn-material-dated-price"><strong>{rangePrice?"From ":""}{money.converted?"≈ ":""}{money.text}</strong><span>Observed {evidence.sourceChecked} · not live</span></div>:<p className="rbrn-material-fx-note">Price not independently confirmed for this product.</p>}
    {money?.converted&&<p className="rbrn-material-fx-note">Approximate currency conversion from {product.currency}, reference rate dated {fx?.date}. The final checkout amount may differ.</p>}
    {money&&!money.available&&<p className="rbrn-material-fx-note">Conversion unavailable; showing supplier currency {product.currency}.</p>}
   </div>
   {hasOptions&&<div className="rbrn-material-compact-picker" ref={popoverRef}>
    <div className="rbrn-material-picker-heading"><strong>{variants.length?product.optionNames?.filter(s=>s!=="Title").join(" & ")||"Choose an option":"Choose a size"}</strong><span>{variants.length||sizes.length} options</span></div>
    <button type="button" className="rbrn-material-picker-trigger" aria-expanded={open} aria-controls="rbrn-product-variants" onClick={()=>{setOpen(v=>!v);setSearch("")}}>
     {selected?.photoUrl?<span className="rbrn-picker-thumbnail"><img src={selected.photoUrl} style={materialThumbnailStyle(selected.photoUrl)} alt="" decoding="async"/></span>:null}
     <span><small>{selectedLabel?"YOUR SELECTION":"SELECT A VARIATION"}</small><strong>{selectedLabel||"Choose colour, size or style"}</strong></span><ChevronDown size={18} className={open?"rotated":""}/>
    </button>
    {open&&<div id="rbrn-product-variants" className="rbrn-material-picker-popover">
     {variants.length>18&&<label className="rbrn-material-picker-search"><Search size={15}/><input autoFocus type="search" placeholder="Find a colour or option" value={search} onChange={e=>setSearch(e.target.value)}/></label>}
     <div className="rbrn-material-picker-list">
      {variants.length?filtered.map(v=><button key={v.index} type="button" aria-pressed={chosen===v.index} className={chosen===v.index?"active":""} onClick={()=>chooseVariant(v.index)}>
       {v.photoUrl&&<span className="rbrn-picker-option-thumbnail"><img src={v.photoUrl} style={materialThumbnailStyle(v.photoUrl)} alt="" loading="lazy" decoding="async"/></span>}
       <span>{v.label}</span>{v.nativePrice!==undefined&&<small>{displayMoney(v.nativePrice,product.currency,currency,fx,locale).text}</small>}
      </button>):sizes.map((v,i)=><button key={v} type="button" aria-pressed={chosenSize===i} className={chosenSize===i?"active":""} onClick={()=>chooseSize(i)}><span>{v}</span></button>)}
     </div>
     {variants.length>0&&!filtered.length&&<p className="rbrn-range-empty">No matching options.</p>}
     <p className="rbrn-material-picker-foot">Source-listed options only · selection is not a reservation</p>
    </div>}
    {sizes.length>0&&<p className="rbrn-material-options-note"><Info size={13}/> Individual size prices have not been verified; the price above is a starting price.</p>}
   </div>}
   <div className="rbrn-material-shipping-card"><div className="rbrn-material-shipping-title"><Truck size={19}/><strong>Delivery & supplier information</strong></div><dl><div><dt>Supplier based in</dt><dd>{shipping.basedIn}</dd></div><div><dt>Published shipping policy</dt><dd>{shipping.international}</dd></div><div><dt>Delivery to your location</dt><dd>Confirm at supplier checkout</dd></div></dl><p>{shipping.summary}</p><a href={shipping.source} target="_blank" rel="noopener noreferrer">Read supplier shipping policy <ArrowUpRight size={13}/></a></div>
   <a href={product.sourceUrl} className="rbrn-material-shop-link" target="_blank" rel="noopener noreferrer">View at original supplier <ArrowUpRight size={20}/></a>
   <a href={collectionUrl} className="rbrn-material-collection-link" target="_blank" rel="noopener noreferrer">Explore supplier's full range <ArrowUpRight size={14}/></a>
   <p className="rbrn-material-buy-disclaimer">Reborna does not sell or fulfil this item. Photographs, products, variations and prices are dated research, not live stock or binding quotes. Source details were reviewed {evidence.sourceChecked}; confirm exact options, current price and delivery with the seller. Converted prices use reference exchange rates, not guaranteed checkout amounts.</p>
  </div>
 </section>;
}
