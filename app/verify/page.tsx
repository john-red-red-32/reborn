import type {Metadata} from "next";
import T from "../../components/T";
import Link from "next/link";
import {ArrowRight,ShieldCheck} from "lucide-react";
import CertificateLookup from "../../components/CertificateLookup";

export const metadata:Metadata={
 title:"Check an Original Reborn Kit Certificate Code | Reborna",
 description:"Check a Reborna-issued sculptor certificate code, view the issuing original sculptor and previous lookup history, and learn the limits of certificate authentication.",
 alternates:{canonical:"/verify/"}
};

export default function VerifyPage(){
 return <main className="verify-wrap">
  <section className="verify-hero">
   <div className="section-kicker"><T>{"ORIGINAL SCULPTS · BETTER PROVENANCE"}</T></div>
   <ShieldCheck size={39} strokeWidth={1.2}/>
   <h1><T>{"Verify the original"}</T><span className="period">.</span></h1>
   <p><T>{"Have a concealed Reborna certificate code? Check its issuing sculptor and historical usage. This service helps trace artist-issued certificates, alongside independent checks of the physical kit and its seller."}</T></p>
  </section>
  <CertificateLookup/>
  <p className="verify-disclaimer">The short certificate code should remain concealed until the owner chooses to reveal it. A genuine issuance record does not prove the physical kit in front of you is original: genuine codes and certificates can be copied. Reborna records certificate issuance only for authorised sculptor accounts. It does not guarantee individual items, transactions or retailers.</p>
  <section className="authenticity-guide" aria-labelledby="verify-checklist-title">
   <div className="section-kicker"><T>{"BEFORE YOU BUY"}</T></div>
   <h2 id="verify-checklist-title"><T>{"How to research a genuine kit"}</T><span className="period">.</span></h2>
   <div className="authenticity-guide-grid">
    <article><span>01 · KNOW THE SCULPTOR</span><h3><T>{"Find the original design"}</T></h3><p>Check the original artist's portfolio and the particular sculpt or edition. A matching name or image alone isn't proof of origin.</p></article>
    <article><span>02 · CHECK THE SELLER</span><h3><T>{"Follow trusted sources"}</T></h3><p>Prefer the sculptor's shop or dealers identified by the artist. Request original production, provenance and edition information where relevant.</p></article>
    <article><span>03 · EXAMINE THE EVIDENCE</span><h3><T>{"Look beyond the code"}</T></h3><p>Compare physical kit details, packaging, edition markers and certificate condition. Codes can be copied: unusual check histories are signals for review, not accusations.</p></article>
   </div>
   <p className="authenticity-guide-note">Worried about a copied kit? Contact the original sculptor with relevant evidence. Read our <Link href="/guides/original-reborn-kits/">independent original-kit guide</Link> and <Link href="/contact/?category=verification">report concerns</Link> where appropriate.</p>
  </section>
  <div className="verify-end"><span><T>{"FOR ORIGINAL SCULPTORS"}</T></span><h2><T>{"Protect the work behind the art."}</T></h2><p>Verified sculptor accounts can request secure certificate codes at no charge during our limited pilot. Identity approval is required. Future pricing may be $1 per code, but no purchase or charge is currently available.</p><Link href="/for-sculptors/"><T>{"Explore sculptor verification"}</T> <ArrowRight size={16}/></Link></div>
 </main>;
}
