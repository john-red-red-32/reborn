import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
/** Simple shared footer — intentionally quieter than the main navigation. */
export default function SiteFooter(){
 return <footer className="rbrn-site-footer" aria-label="Reborna footer">
  <div className="rbrn-site-footer-brand"><Link href="/" className="logo" aria-label="Reborna home">reborna<span className="logo-mark">✳</span></Link><p>Independent artists. Original sculpts. One beautiful place to discover them.</p><small>Editorial discovery, original sources, genuine conversations.</small></div>
  <nav aria-label="Explore Reborna"><span>EXPLORE</span><Link href="/real-kits/">Discover kits</Link><Link href="/materials/">Materials</Link><Link href="/artists/">Original artists</Link><Link href="/community/">Community</Link><Link href="/dashboard/">My collection</Link></nav>
  <nav aria-label="Help and information"><span>HERE TO HELP</span><Link href="/contact/">Contact us <ArrowUpRight size={13}/></Link><Link href="/verify/">Verify a kit</Link><Link href="/community/guidelines/">Community guidelines</Link></nav>
  <div className="rbrn-site-footer-end"><span>MADE FOR THE ART OF REBORNING</span><p>Reborna is an independent discovery platform. Unless otherwise stated, kits and materials are purchased directly from their original suppliers.</p><small>© {new Date().getUTCFullYear()} Reborna</small></div>
 </footer>
}
