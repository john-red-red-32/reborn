import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft} from "lucide-react";
import {supplierListings} from "../../../lib/materials-catalogue";
import MaterialRangeProducts from "../../../components/MaterialRangeProducts";
export function generateStaticParams(){return supplierListings.map(p=>({slug:p.slug}))}
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const item=supplierListings.find(p=>p.slug===slug);
 return {title:item?item.name+" | Browse Materials | Reborna":"Material range not found",description:item?.description,robots:{index:false,follow:false}};
}
export default async function MaterialRangePage({params}:Props){
 const {slug}=await params;const item=supplierListings.find(p=>p.slug===slug);
 if(!item)notFound();
 return <main className="detail-shell rbrn-material-range-page"><div className="detail-top"><Link href="/materials/" className="back-link"><ArrowLeft size={17}/> Back to Shop materials</Link><span>REBORN / MATERIALS / PRODUCT RANGE</span></div><MaterialRangeProducts listing={item}/></main>;
}
