"use client";
import {useState} from "react";
import {ArrowUpRight,ChevronLeft,ChevronRight,ImageIcon,Info,Truck,ExternalLink} from "lucide-react";
import type {MaterialProductEvidence,MaterialShippingPolicy,MaterialSourceProduct} from "../lib/material-product-evidence";
export default function MaterialProductViewer({itemName,evidence,shipping,collectionUrl}:{itemName:string;evidence:MaterialProductEvidence;shipping:MaterialShippingPolicy;collectionUrl:string}){
 const[productIndex,setProductIndex]=useState(0);
 const[photoIndex,setPhotoIndex]=useState(0);
 const[variantIndex,setVariantIndex]=useState<number|null>(null);
 const products=evidence.products;
 const product=products[productIndex];
 const images=product?.photos??[];
 const photo=images[Math.min(photoIndex,Math.max(0,images.length-1))];
 const variations=product?.variants??[];
 function selectProduct(index:number){setProductIndex(index);setPhotoIndex(0);setVariantIndex(null)}
 return <section className="rbrn-material-viewer" aria-label={itemName+" product information"}>
  <div className="rbrn-material-gallery">
   <div className="rbrn-material-image-area">
    {photo?<figure className="rbrn-material-main-image"><img src={photo.url} alt={product.title+" — source product photograph "+(photoIndex+1)+" of "+images.length} loading="eager" decoding="async"/><figcaption>SUPPLIER PHOTO · {photoIndex+1} / {images.length}</figcaption></figure>
    :<div className="rbrn-material-photo-missing"><ImageIcon size={34}/><strong>Product photograph awaiting source review</strong><p>We won't substitute an unrelated product image.</p></div>}
    {images.length>1&&<><button className="rbrn-material-image-prev" aria-label="Previous product photograph" type="button" onClick={()=>setPhotoIndex(v=>(v+images.length-1)%images.length)}><ChevronLeft size={21}/></button><button className="rbrn-material-image-next" aria-label="Next product photograph" type="button" onClick={()=>setPhotoIndex(v=>(v+1)%images.length)}><ChevronRight size={21}/></button></>}
   </div>
   {images.length>1&&<div className="rbrn-material-thumbs" aria-label="Product photo gallery">{images.map((img,i)=><button key={img.url} type="button" aria-label={"View image "+(i+1)} aria-pressed={i===photoIndex} className={i===photoIndex?"active":""} onClick={()=>setPhotoIndex(i)}><img src={img.url} alt="" loading="lazy" decoding="async"/></button>)}</div>}
   {photo&&<p className="rbrn-material-photo-credit">Source: <a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} <ExternalLink size={12}/></a></p>}
  </div>
  <div className="rbrn-material-buy-detail">
   <span className="section-kicker">ORIGINAL SUPPLIER CATALOGUE</span>
   <h2>{itemName}<span className="period">.</span></h2>
   <p className="rbrn-material-subheading">A carefully researched range of artist supplies. Compare documented options here, then complete any purchase on the independent supplier's website.</p>
   {products.length>1&&<section className="rbrn-material-source-options" aria-label="Featured products in this range"><strong>Featured products from this range</strong><div className="rbrn-material-product-siblings">{products.map((p,i)=><button key={p.sourceUrl} type="button" className={productIndex===i?"active":""} onClick={()=>selectProduct(i)}>{p.title}</button>)}</div></section>}
   {product&&<div className="rbrn-material-selected-product"><small>{products.length>1?"SELECTED PRODUCT":"PRODUCT FROM THIS RANGE"}</small><h3>{product.title}</h3></div>}
   {!!variations.length&&<section className="rbrn-material-variant-picker"><div className="rbrn-material-variant-heading"><strong>Supplier-listed options</strong><span>{variations.length} documented</span></div><p>Scroll to explore the seller's colour, size or style labels.</p><div className="rbrn-material-variant-scroll" aria-label="Choose an original supplier option">{variations.map((variant,i)=><button key={variant.label+"-"+i} type="button" aria-pressed={i===variantIndex} className={i===variantIndex?"active":""} onClick={()=>setVariantIndex(i)}>{variant.label}</button>)}</div>{variantIndex!==null&&<div className="rbrn-material-variant-current"><span>Selected for comparison</span><strong>{variations[variantIndex].label}</strong></div>}<p className="rbrn-material-options-note"><Info size={14}/> Variants are from the supplier's published product record; colour photography, stock and exact options must be confirmed when ordering.</p></section>}
   <div className="rbrn-material-shipping-card">
    <div className="rbrn-material-shipping-title"><Truck size={19}/><strong>Delivery & supplier information</strong></div>
    <dl><div><dt>Supplier based in</dt><dd>{shipping.basedIn}</dd></div><div><dt>Published shipping policy</dt><dd>{shipping.international}</dd></div><div><dt>Delivery to your location</dt><dd>Confirm at supplier checkout</dd></div></dl>
    <p>{shipping.summary}</p><a href={shipping.source} target="_blank" rel="noopener noreferrer">Read supplier delivery information <ArrowUpRight size={13}/></a>
   </div>
   <a className="rbrn-material-shop-link" href={product?.sourceUrl??collectionUrl} target="_blank" rel="noopener noreferrer">View product at supplier <ArrowUpRight size={20}/></a>
   {product?.sourceUrl&&product.sourceUrl!==collectionUrl&&<a className="rbrn-material-collection-link" href={collectionUrl} target="_blank" rel="noopener noreferrer">Explore the full supplier range <ArrowUpRight size={14}/></a>}
   <p className="rbrn-material-buy-disclaimer">Reborna does not sell or fulfil this item. No real-time stock or price is claimed. Product images and variations were researched on {evidence.sourceChecked}; supplier listings may have changed. The supplier confirms final item options, delivery and total cost.</p>
  </div>
 </section>;
}
