import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft} from "lucide-react";
import {supplierListings} from "../../../lib/materials-catalogue";
import MaterialRangeProducts from "../../../components/MaterialRangeProducts";
import {breadcrumbJsonLd,canonical,safeJsonLd} from "../../../lib/seo";
import {getMaterialProducts} from "../../../lib/material-routing";
export function generateStaticParams(){return supplierListings.map(p=>({slug:p.slug}))}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const item=supplierListings.find(p=>p.slug===slug);
 if(!item)return{title:"Material range not found | Reborna",robots:{index:false}};
 const description=`Explore ${item.name} for reborn doll artists: ${item.description} Compare individual products and verify details with the original supplier.`;
 const image=getMaterialProducts(slug)[0]?.photoUrls[0];
 return{title:`${item.name} | Reborn Doll Making Supplies | Reborna`,description,alternates:{canonical:"/materials/"+slug+"/"},openGraph:{title:item.name+" | Reborna",description,url:canonical("/materials/"+slug+"/"),...(image?{images:[image]}:{})}};
}
export default async function MaterialRangePage({params}:Props){
 const {slug}=await params;const item=supplierListings.find(p=>p.slug===slug);
 if(!item)notFound();
 const breadcrumbs=breadcrumbJsonLd([{name:"Reborna",path:"/"},{name:"Materials",path:"/materials/"},{name:item.name,path:"/materials/"+slug+"/"}]);
 return <main className="detail-shell rbrn-material-range-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumbs)}}/><div className="detail-top"><Link href="/materials/" className="back-link"><ArrowLeft size={17}/> Back to Shop materials</Link><span>REBORN / MATERIALS / PRODUCT RANGE</span></div><MaterialRangeProducts listing={item} headingLevel="h1"/></main>;
}
