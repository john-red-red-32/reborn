import type {Metadata} from "next";
import Link from "next/link";
import {cassieArchive,cassieProfile} from "../../../lib/cassie-profile";
import {cassieOriginalProductionOrder} from "../../../lib/cassie-chronology";
import {cassieReleaseEvidence} from "../../../lib/cassie-release-evidence";
import {publishedGalleryEvidence} from "../../../lib/artist-gallery-data";
import {verifiedKits} from "../../../lib/real-catalogue";
import {breadcrumbJsonLd,canonical,safeJsonLd} from "../../../lib/seo";

export const metadata:Metadata={
 title:"Cassie Ann Love (Cassie Brace) Sculpt History & Kit Archive | Reborna",
 description:"Explore Cassie Ann Love's original reborn sculptures, the 30-name early production sequence, sourced kit history and research notes on older Cassie Brace names.",
 alternates:{canonical:"/guides/cassie-ann-love-sculpt-history/"}
};

const firstThirty=new Set<string>(cassieOriginalProductionOrder);
const matchedPhotos=publishedGalleryEvidence.filter(item=>item.artistSlug==="cassie-ann-love"&&item.matchStatus==="exact_editorial_match");
const works=verifiedKits.filter(item=>item.artistSlug==="cassie-ann-love");
const workByName=new Map(works.map(kit=>[kit.name.toLocaleLowerCase("en"),kit]));
const sourceList=[
 {label:"Cassie Ann Love — official biography and previous name",url:cassieProfile.source},
 {label:"Cassie Ann Love — published vinyl doll kit gallery",url:"https://www.cassielove.co.uk/vinyl-doll-kits"},
 {label:"Cassie Ann Love — original clay sculpture gallery",url:"https://www.cassielove.co.uk/sculpting"},
 {label:"MacPherson Arts & Crafts — sculptor interview and early production order",url:cassieProfile.interview}
];
const datedReferences=Object.entries(cassieReleaseEvidence).sort((a,b)=>a[1].year.localeCompare(b[1].year));

export default function CassieSculptHistory(){
 const pageUrl=canonical("/guides/cassie-ann-love-sculpt-history/");
 const structuredData={"@context":"https://schema.org","@graph":[
  {"@type":"Article","@id":pageUrl+"#research",headline:"Cassie Ann Love (Cassie Brace): original reborn sculpt history and archive",
   description:"Source-led study of Cassie Ann Love's sculpt archive, original kit production sequence and documented release references.",
   mainEntityOfPage:pageUrl,author:{"@type":"Organization",name:"Reborna",url:"https://reborna.co/"},
   about:{"@type":"Person",name:"Cassie Ann Love",alternateName:"Cassie Brace",url:canonical("/artists/cassie-ann-love/")},
   citation:sourceList.map(source=>source.url)},
  {...breadcrumbJsonLd([{name:"Reborna",path:"/"},{name:"Original sculptors",path:"/artists/"},{name:"Cassie Ann Love sculpt history",path:"/guides/cassie-ann-love-sculpt-history/"}]),"@id":pageUrl+"#breadcrumbs"}
 ]};
 return <main className="rbrn-community-shell rbrn-legal-page rbrn-seo-guide">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(structuredData)}}/>
  <header className="rbrn-legal-intro"><span className="section-kicker">SCULPTOR RESEARCH / THE ORIGINAL WORK</span>
   <h1>Cassie Ann Love: a history of the original sculpts<span className="period">.</span></h1>
   <p>From Hattie in 2012 to the sculptor's present-day portfolio: a carefully attributed reference to the work collectors also know under the name Cassie Brace. The original sculpt, manufactured blank kit and finished reborn artwork are distinct.</p>
  </header>
  <div className="rbrn-legal-columns"><article className="rbrn-legal-copy">
   <section><h2>One sculptor, two names in the archive.</h2>
    <p>Cassie Ann Love has confirmed on her <a href={cassieProfile.source} target="_blank" rel="noopener noreferrer">official biography ↗</a> that she was formerly known as Cassie Brace. Older retailer listings and photographic archives still use that surname. Reborna brings these sources together under her current artist name rather than treating the two names as different sculptors.</p>
    <p>In a <a href={cassieProfile.interview} target="_blank" rel="noopener noreferrer">published MacPherson interview ↗</a>, Cassie identifies <strong>Hattie (2012)</strong> as her first production doll kit and describes moving from reborning to sculpting her own designs. The first three names in her recorded production sequence are Hattie, Ella and Junior.</p>
   </section>
   <section><h2>Her first 30 production designs.</h2>
    <p>The interview contains an artist-supplied list of the first 30 produced doll kits in <em>production order</em>. That order is not a release calendar: apart from Hattie, the source does not establish the exact year of each entry. Some names differ in spelling between the old interview and newer gallery labels, so questionable matches remain separate until independently resolved.</p>
    <ol className="rbrn-history-index">{cassieOriginalProductionOrder.map(name=>{
      const kit=workByName.get(name.toLocaleLowerCase("en"));
      const uncertain=name==="Sienna"||name==="Romilly";
      return <li key={name}><span>{kit&&!uncertain?<Link href={"/kits/"+kit.slug+"/"}>{name} <span aria-hidden="true">↗</span></Link>:name}</span>{uncertain&&<small>Identity requires review</small>}</li>;
    })}</ol>
    <p><a href={cassieProfile.interview} target="_blank" rel="noopener noreferrer">Read the original sculptor interview and production-order record ↗</a></p>
   </section>
   <section><h2>Release-year evidence, not guessed dates.</h2>
    <p>Only a small number of designs currently have an individually attributed year reference in our research. A model-year observation, release claim and pre-order opening are different kinds of evidence and should not be conflated.</p>
    <ul className="rbrn-history-evidence">{datedReferences.map(([name,reference])=>{
      const kit=workByName.get(name);
      return <li key={name}><strong>{reference.year} · {kit?<Link href={"/kits/"+kit.slug+"/"}>{kit.name}</Link>:name}</strong>
       <p>{reference.basis}. <a href={reference.source} target="_blank" rel="noopener noreferrer">{reference.confidence==="artist"?"Original sculptor":reference.confidence==="retailer"?"Retailer source":"Independent seller source"} ↗</a></p></li>;
    })}</ul>
   </section>
   <section><h2>What the photographic archive establishes.</h2>
    <p>Cassie's <a href="https://www.cassielove.co.uk/vinyl-doll-kits" target="_blank" rel="noopener noreferrer">published vinyl-kit gallery ↗</a> displays named original works alongside images and selected details. Reborna's research currently records {cassieArchive.length} accepted historical sculpt names, including {matchedPhotos.length} exact named gallery-photo observations. These counts describe catalogue research, not manufactured inventory, official edition numbers or photographs licensed for reuse.</p>
    <p>The sculptor also publishes <a href="https://www.cassielove.co.uk/sculpting" target="_blank" rel="noopener noreferrer">original clay sculptures ↗</a>, a useful way to distinguish the sculpted design from later painted and rooted interpretations. Where a photograph comes from a retailer or other publisher, the original page is attributed; a finished-doll photo is not automatically an image of the blank kit included in a sale.</p>
   </section>
   <section><h2>Names still awaiting clarification.</h2>
    <p>The historical index includes <strong>Romilly</strong> and <strong>Sienna</strong>. The current artist gallery also uses the forms “Romily” and “Sienna Rae”. These are plausible related names, but Reborna deliberately does not silently join their image identities or create fabricated image matches. We will update the records only after source verification.</p>
    <p>Other titles in the wider archive may be documented without a currently available blank kit. A historic entry does not imply stock, current manufacture, a new release or an artist endorsement of Reborna.</p>
   </section>
   <section><h2>Further reading and original sources.</h2>
    <ul>{sourceList.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul>
    <p>Explore the <Link href="/artists/cassie-ann-love/">Cassie Ann Love sculptor profile and individual records</Link>, or use the <Link href="/guides/original-reborn-kits/">guide to investigating original kits and suspected recasts</Link> when researching a purchase.</p>
   </section>
  </article>
  <aside className="rbrn-legal-aside"><span className="section-kicker">AN EDITORIAL REFERENCE</span>
   <h2>Start with the original artist.</h2>
   <p>This research brings together first-person statements, artist-published galleries and clearly identified third-party observations. It is independent of the sculptor and makes no claim to authenticate individual kits.</p>
   <nav><Link href="/artists/cassie-ann-love/">Cassie's sculptor profile</Link><Link href="/real-kits/">Browse the original sculpt catalogue</Link><Link href="/guides/original-reborn-kits/">Research an authentic kit</Link></nav>
  </aside></div>
 </main>;
}
