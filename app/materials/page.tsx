import Link from "next/link";
import type {Metadata} from "next";
import {ArrowRight} from "lucide-react";
import MaterialSuppliesExplorer from "../../components/MaterialSuppliesExplorer";
export const metadata:Metadata={title:"Reborn Doll Making Supplies | Reborna",description:"Explore original reborn doll painting supplies, heat-set and air-dry paints, rooting hair, glass eyes, needles, cloth bodies and expert suppliers.",robots:{index:false,follow:false}};
export default function Materials(){
 return <main className="detail-shell materials-page rbrn-materials-page">
  <section className="materials-heading"><span className="section-kicker">THE MAKER'S STUDIO</span><h1>The artist's <em>essentials.</em></h1><p>From the first translucent paint layers to the final little eyelashes. A carefully researched directory of materials, systems and specialist suppliers that bring original sculpts to life.</p></section>
  <div className="rbrn-paint-guide"><div><span className="section-kicker">FIND YOUR PROCESS</span><h2>Not all paints work the same.</h2><p>Heat-set paints cure with carefully controlled heat, while air-dry systems cure without baking. Silicone dolls require different, compatible pigments and paint bases. Always follow the manufacturer's method for your material.</p></div><div className="rbrn-paint-guide-types"><span>HEAT-SET <small>Gemini · Alva & Go · Kebelka</small></span><span>AIR-DRY <small>Ultimate Fusion</small></span><span>SILICONE <small>Enfis pigments & compatible bases</small></span></div></div>
  <MaterialSuppliesExplorer/>
  <section className="materials-footer"><h2>From sculpt to something extraordinary.</h2><p>Discover the original kit first, then choose materials suited to its construction and your painting style. We link you directly to specialist suppliers rather than pretending to sell their inventory.</p><Link href="/real-kits/">Explore original sculpt kits <ArrowRight size={16}/></Link></section>
 </main>;
}