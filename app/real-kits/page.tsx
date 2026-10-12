import Link from "next/link";
import {ArrowLeft,ArrowUpRight} from "lucide-react";
import RealCatalogue from "../../components/RealCatalogue";
export const metadata={title:"Real sculpt listings | Reborn",robots:{index:false,follow:false}};
export default function RealKits(){return <main className="detail-shell"><div className="real-header"><span className="section-kicker">THE SCULPT CATALOGUE</span><h1>Meet the sculpts<span className="period">.</span></h1><p>Discover documented sculpt kits from independent artists. Explore artists, filter availability and visit original retailer listings.</p></div><RealCatalogue/></main>}