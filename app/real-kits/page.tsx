import Link from "next/link";
import T from "../../components/T";
import {ArrowLeft,ArrowUpRight} from "lucide-react";
import RealCatalogue from "../../components/RealCatalogue";
export const metadata={title:"Original Reborn Doll Kits & Sculptures | Reborna",description:"Discover original reborn doll sculpt kits, credited sculptors, documented artwork, artist sources and dated independent retailer information.",alternates:{canonical:"/real-kits/"}};
export default function RealKits(){return <main className="detail-shell"><div className="real-header"><span className="section-kicker"><T>{"THE SCULPT CATALOGUE"}</T></span><h1><T>{"Meet the sculpts"}</T><span className="period">.</span></h1><p><T>{"Discover documented sculpt kits from independent artists. Explore artists, filter availability and visit original retailer listings."}</T></p></div><RealCatalogue/></main>}