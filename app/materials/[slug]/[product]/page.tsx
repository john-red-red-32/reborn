import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft,Info} from "lucide-react";
import {supplierListings,supplyCategories} from "../../../../lib/materials-catalogue";
import {materialShippingPolicies,materialProductEvidence} from "../../../../lib/material-product-evidence";
import {getMaterialProducts,materialProductSlug,materialProductPages} from "../../../../lib/material-routing";
import MaterialProductViewer from "../../../../components/MaterialProductViewer";
export function generateStaticParams(){return materialProductPages.map(p=>({slug:p.rangeSlug,product:p.productSlug}))}
type Props={params:Promise<{slug:string;product:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const{slug,product}=await params;const item=getMaterialProducts(slug).find(p=>materialProductSlug(p)===product);
 return {title:item?item.title+" | Reborna Materials":"Material product not found",description:item?"Explore "+item.title+": genuine options, photographs, supplier and dated prices.":undefined,robots:{index:false,follow:false}};
}
export default async function IndividualMaterialProduct({params}:Props){
 const{slug,product:productSlug}=await params;
 const listing=supplierListings.find(p=>p.slug===slug);
 const product=getMaterialProducts(slug).find(p=>materialProductSlug(p)===productSlug);
 if(!listing||!product)notFound();
 const policy=materialShippingPolicies[listing.maker]??{basedIn:listing.supplierCountry,international:"Not independently verified",summary:"Confirm destination and delivery charges directly with the supplier.",source:listing.url};
 const evidence=materialProductEvidence[slug];
 const group=supplyCategories.find(p=>p.slug===listing.category);
 return <main className="rbrn-material-detail detail-shell">
  <div className="detail-top"><Link href={"/materials/"+slug+"/"} className="back-link"><ArrowLeft size={17}/> Back to {listing.name}</Link><span>REBORN / MATERIALS / {group?.label.toUpperCase()}</span></div>
  <MaterialProductViewer product={product} evidence={evidence} shipping={policy} collectionUrl={listing.url} rangeName={listing.name} rangeSlug={listing.slug}/>
  <div className="rbrn-material-editorial-note"><Info size={17}/><p><strong>About this product range.</strong> {listing.description} Product availability, exact variation and delivery must always be confirmed with the original seller before ordering.</p></div>
 </main>;
}
