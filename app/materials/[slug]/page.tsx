import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft,ArrowRight,Info} from "lucide-react";
import {supplierListings,supplyCategories} from "../../../lib/materials-catalogue";
import {materialProductEvidence,materialShippingPolicies} from "../../../lib/material-product-evidence";
import MaterialProductViewer from "../../../components/MaterialProductViewer";
export function generateStaticParams(){return supplierListings.map(item=>({slug:item.slug}))}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const{slug}=await params;const item=supplierListings.find(x=>x.slug===slug);
 return {title:item?item.name+" — Reborna Materials":"Material not found | Reborna",description:item?item.description:undefined,robots:{index:false,follow:false}};
}
export default async function MaterialDetail({params}:Props){
 const{slug}=await params;const item=supplierListings.find(x=>x.slug===slug);
 if(!item)notFound();
 const evidence=materialProductEvidence[item.slug];
 const shipping=materialShippingPolicies[item.maker]??{basedIn:item.supplierCountry,international:"Not independently verified",summary:"Check eligible destinations and delivery charges directly with the supplier.",source:item.url};
 const group=supplyCategories.find(x=>x.slug===item.category);
 const related=supplierListings.filter(x=>x.category===item.category&&x.slug!==item.slug).slice(0,3);
 return <main className="rbrn-material-detail detail-shell">
  <div className="detail-top"><Link href="/materials/" className="back-link"><ArrowLeft size={17}/> Back to Shop materials</Link><span>REBORN / MATERIALS / {group?.label.toUpperCase()}</span></div>
  <MaterialProductViewer itemName={item.name} evidence={evidence} shipping={shipping} collectionUrl={item.url}/>
  <div className="rbrn-material-editorial-note"><Info size={17}/><p><strong>Why Reborna lists this material.</strong> {item.description} Products within a range may have different specifications and availability. We retain the original supplier links and dated source information so you can decide what is suitable for your work.</p></div>
  {!!related.length&&<section className="rbrn-material-related"><div><span className="section-kicker">FROM THE MAKER'S STUDIO</span><h2>Discover more materials.</h2></div><div className="rbrn-material-related-grid">{related.map(other=><Link key={other.slug} href={"/materials/"+other.slug+"/"} className="rbrn-material-related-tile">{materialProductEvidence[other.slug]?.products[0]?.photos[0]?.url?<img src={materialProductEvidence[other.slug].products[0].photos[0].url} alt={other.name+" supplier product photograph"} loading="lazy"/>:<span>✳</span>}<strong>{other.name}</strong><ArrowRight size={17}/></Link>)}</div></section>}
 </main>;
}
