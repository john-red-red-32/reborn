import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {AnalyticsSettingsButton} from "./AnalyticsConsent";
import T from "./T";
/** Simple shared footer — intentionally quieter than the main navigation. */
export default function SiteFooter(){
 return <footer className="rbrn-site-footer" aria-label="Reborna footer">
  <div className="rbrn-site-footer-brand"><Link href="/" className="logo" aria-label="Reborna home">reborna<span className="logo-mark">✳</span></Link><p><T>{"Independent artists. Original sculpts. One beautiful place to discover them."}</T></p><small><T>{"Editorial discovery, original sources, genuine conversations."}</T></small></div>
  <nav aria-label="Explore Reborna"><span><T>{"EXPLORE"}</T></span><Link href="/real-kits/"><T>{"Discover kits"}</T></Link><Link href="/materials/"><T>{"Materials"}</T></Link><Link href="/artists/"><T>{"Original artists"}</T></Link><Link href="/for-sculptors/"><T>{"For sculptors"}</T></Link><Link href="/verify/"><T>{"Verify a certificate"}</T></Link><Link href="/community/"><T>{"Community"}</T></Link><Link href="/dashboard/"><T>{"My collection"}</T></Link></nav>
  <nav aria-label="Help and information"><span><T>{"HERE TO HELP"}</T></span><Link href="/contact/">Contact us <ArrowUpRight size={13}/></Link><Link href="/guides/original-reborn-kits/"><T>{"Original kit guide"}</T></Link><Link href="/community/guidelines/"><T>{"Community guidelines"}</T></Link><Link href="/terms/"><T>{"Terms of use"}</T></Link><Link href="/privacy/"><T>{"Privacy policy"}</T></Link><Link href="/cookies/">Cookies &amp; storage</Link><AnalyticsSettingsButton/></nav>
  <div className="rbrn-site-footer-end"><span><T>{"MADE FOR THE ART OF REBORNING"}</T></span><p><T>{"Reborna is an independent discovery platform. Unless otherwise stated, kits and materials are purchased directly from their original suppliers."}</T></p><small>© {new Date().getUTCFullYear()} Reborna</small></div>
 </footer>
}
