"use client";
import {useMemo,useState} from "react";
import type {KitVariant} from "../lib/real-catalogue";
import type {RetailOffer,VariantOfferPrice} from "../lib/retailer-offers";
import LocalizedOfferPrice from "./LocalizedOfferPrice";

const uniqueTotals=(prices:VariantOfferPrice[])=>new Set(prices.map(p=>p.total).filter((p):p is number=>typeof p==="number"));
export default function KitVariantOptions({variants,offers,basePhotos=[]}:{variants:KitVariant[];offers:RetailOffer[];basePhotos:{url:string;credit:string;source:string}[]}){
 const[selected,setSelected]=useState(variants[0]?.id??"");
 const variant=useMemo(()=>variants.find(v=>v.id===selected),[variants,selected]);
 const photos=variant?.photos?.length?variant.photos:basePhotos;
 const hasMultiPrice=offers.some(o=>uniqueTotals(o.variantPrices??[]).size>1);
 const selectedOffers=offers.map(o=>({offer:o,option:o.variantPrices?.find(p=>p.variantId===selected)}));
 return <section className="kit-variants" aria-label="Kit variations">
 <h2>Choose your kit</h2>
 <p>Options and inclusions can differ. Prices are confirmed retailer observations, not checkout quotes.</p>
 <label className="kit-variant-label" htmlFor="kit-variant-select">Kit configuration</label>
 <select id="kit-variant-select" className="kit-variant-select" value={selected} onChange={e=>setSelected(e.target.value)}>
 {variants.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}
 </select>
 {variant&&<div className="kit-variant-info">
 {Object.entries(variant.options).map(([name,value])=><div key={name}><span>{name}</span><strong>{value}</strong></div>)}
 {!!variant.includedParts?.length&&<small>Includes: {variant.includedParts.join(", ")}</small>}
 </div>}
 {!!photos.length&&<div className="kit-variant-photos">{photos.slice(0,6).map((p,i)=><img key={p.url} src={p.url} alt={`${variant?.label??"Kit"} — view ${i+1}`} loading="lazy"/>)}</div>}
 <h3>{hasMultiPrice?"Prices from participating retailers":"Retailer prices"}</h3>
 <div className="offer-list">
 {selectedOffers.map(({offer,option})=>{
  const tracked=!!offer.variantPrices?.length;
  if(tracked&&!option)return <div key={offer.url} className="kit-variant-offer"><strong>{offer.retailer}</strong><small>This configuration is not confirmed at this retailer.</small></div>;
  const total=option?.total??(!tracked?offer.total:undefined);
  const deposit=option?.deposit??(!tracked?offer.deposit:undefined);
  const balance=option?.balance??(!tracked?offer.balance:undefined);
  const status=option?.status??offer.status;
  const minPrices=offer.variantPrices?.map(p=>p.total).filter((p):p is number=>p!==undefined)??[];
  const from=uniqueTotals(offer.variantPrices??[]).size>1;
  const minTotal=from&&minPrices.length?Math.min(...minPrices):undefined;
  return <div key={offer.url} className="kit-variant-offer">
   <div><strong>{offer.retailer}</strong><small>{status==="preorder"?"Pre-order":status==="available"?"Listed available":"Unavailable"} · Checked {offer.checkedAt}</small>
   {from&&minTotal!==undefined&&<small>From <LocalizedOfferPrice total={minTotal} originalCurrency={offer.currency} compact showDeposit={false}/></small>}
   {offer.note&&<small>{offer.note}</small>}</div>
   <div className="offer-amount">{total!==undefined||deposit!==undefined?<LocalizedOfferPrice total={total} deposit={deposit} balance={status==="preorder"?balance:undefined} originalCurrency={offer.currency} showDeposit={status==="preorder"}/>:<strong>Price not confirmed for this option</strong>}
   <a href={option?.url??offer.url} target="_blank" rel="noopener noreferrer">Check seller ↗</a></div>
  </div>;
 })}
 </div>
 <small className="kit-variant-footnote">“From” appears only where different full prices are documented for configurations from the same retailer. Two identical prices do not create a range. Deposits and optional layaway aren't kit prices.</small>
 </section>;
}
