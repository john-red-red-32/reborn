"use client";
import {useState} from "react";
import type {VerifiedKit} from "../lib/real-catalogue";

type Photo=NonNullable<VerifiedKit["photos"]>[number];
/** Photos are Shopify/artist-source examples; they do not imply a finished doll is sold. */
export default function KitPhotoGallery({kitName,photos,sourceUrl}:{kitName:string;photos:Photo[];sourceUrl?:string}){
 const [selected,setSelected]=useState(0);
 if(!photos.length)return <div className="kit-awaiting-artwork"><div className="kit-awaiting-artwork-inner"><span className="kit-awaiting-kicker">ORIGINAL SCULPT · SOURCE DOCUMENTED</span><div className="kit-awaiting-initial" aria-hidden="true">{kitName.charAt(0)}</div><strong>{kitName}</strong><p>Photograph awaiting identity and usage-rights review.</p>{sourceUrl&&<a href={sourceUrl} target="_blank" rel="noopener noreferrer">View original sculpt source ↗</a>}</div></div>;
 const active=photos[Math.min(selected,photos.length-1)];
 return <div className="kit-photo-gallery">
   <figure className="kit-main-photo">
    <img src={active.url} alt={`${kitName} — artist's published example, photograph ${selected+1} of ${photos.length}`} loading="eager" decoding="async"/>
    <figcaption>PHOTO · {active.credit.split(" — ")[0]} · {selected+1}/{photos.length}</figcaption>
   </figure>
   {photos.length>1&&<div className="kit-photo-thumbnails" aria-label={`Browse photographs of ${kitName}`}>{photos.map((p,i)=><button type="button" key={p.url} className={i===selected?"kit-photo-thumb selected":"kit-photo-thumb"} aria-label={`Show image ${i+1} of ${kitName}`} aria-pressed={i===selected} onClick={()=>setSelected(i)}><img src={p.url} alt="" loading="lazy" decoding="async"/></button>)}</div>}
   <p className="kit-photo-provenance">Source: <a href={active.source} target="_blank" rel="noopener noreferrer">{active.credit} ↗</a>.</p>
 </div>;
}
