import Link from "next/link";
import T from "../../components/T";
import type {Metadata} from "next";
import {ArrowRight} from "lucide-react";
import MaterialSuppliesExplorer from "../../components/MaterialSuppliesExplorer";
export const metadata:Metadata={title:"Reborn Doll Making Supplies, Paints & Mohair | Reborna",description:"Explore original reborn doll painting supplies, heat-set and air-dry paints, rooting hair, glass eyes, needles, cloth bodies and expert suppliers.",alternates:{canonical:"/materials/"}};
export default function Materials(){
 return <main className="detail-shell materials-page rbrn-materials-page">
  <section className="materials-heading"><span className="section-kicker"><T>{"THE MAKER'S STUDIO"}</T></span><h1><T>{"The artist\'s"}</T> <em><T>{"essentials."}</T></em></h1><p><T>{"From the first translucent paint layers to the final little eyelashes. A carefully researched directory of materials, systems and specialist suppliers that bring original sculpts to life."}</T></p></section>
  <div className="rbrn-paint-guide"><div><span className="section-kicker"><T>{"FIND YOUR PROCESS"}</T></span><h2><T>{"Not all paints work the same."}</T></h2><p><T>{"Heat-set paints cure with carefully controlled heat, while air-dry systems cure without baking. Silicone dolls require different, compatible pigments and paint bases. Always follow the manufacturer's method for your material."}</T></p></div><div className="rbrn-paint-guide-types"><span>HEAT-SET <small>Gemini · Alva & Go · Kebelka</small></span><span>AIR-DRY <small>Ultimate Fusion</small></span><span>SILICONE <small>Enfis pigments & compatible bases</small></span></div></div>
  <MaterialSuppliesExplorer/>
  <section className="materials-footer"><h2><T>{"From sculpt to something extraordinary."}</T></h2><p><T>{"Discover the original kit first, then choose materials suited to its construction and your painting style. We link you directly to specialist suppliers rather than pretending to sell their inventory."}</T></p><Link href="/real-kits/"><T>{"Explore original sculpt kits"}</T> <ArrowRight size={16}/></Link></section>
 </main>;
}