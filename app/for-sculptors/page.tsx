import Link from "next/link";
import type {Metadata} from "next";
import {ArrowUpRight,BookOpenText,Camera,FileCheck2,HeartHandshake,MessagesSquare,ShieldCheck,Sparkles} from "lucide-react";
import {canonical,safeJsonLd,breadcrumbJsonLd} from "../../lib/seo";
import styles from "./sculptors.module.css";

export const metadata:Metadata={
 title:"For Original Reborn Sculptors & Artists | Reborna",
 description:"Original reborn sculptors: discover Reborna's independently researched archive, suggest factual profile corrections, share original sources and explore editorial collaborations.",
 alternates:{canonical:"/for-sculptors/"},
 openGraph:{title:"For the artists behind the originals | Reborna",description:"A place to discover and credit independent reborn doll sculptors. Contribute source-backed portfolio information and explore future features.",url:canonical("/for-sculptors/")}
};

const values=[
 {icon:BookOpenText,title:"The story behind each sculpt",description:"We connect original sculptors to their named designs and catalogue history, preserving older names and documented sources rather than guessing at details."},
 {icon:Camera,title:"Photographs with provenance",description:"We credit the published source of each photograph, distinguish sculptor and reborn artist contributions, and welcome corrections or permission discussions."},
 {icon:ShieldCheck,title:"Respect for original work",description:"Original designs are separate from manufactured kits and finished reborns. Reborna doesn't certify products, infer authenticity from images, or promote counterfeit sculpts."}
];
const steps=[
 {number:"01",title:"Tell us about your work",description:"Introduce yourself, share an official studio or portfolio link, or point out information you would like us to review."},
 {number:"02",title:"We examine the sources",description:"We compare the information with artist-authored and identifiable source material. We may follow up privately where details are uncertain."},
 {number:"03",title:"We make careful editorial updates",description:"Where warranted, we correct credits, link original records and refine the profile. Attribution and photo-use questions are reviewed individually."}
];
export default function ForSculptors(){
 const crumbs=breadcrumbJsonLd([{name:"Reborna",path:"/"},{name:"For original sculptors",path:"/for-sculptors/"}]);
 return <main className={styles.shell}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(crumbs)}}/>
  <section className={styles.hero}>
   <span className={styles.kicker}>FOR THE ARTISTS BEHIND THE ORIGINALS</span>
   <Sparkles size={30} strokeWidth={1.2} aria-hidden="true" className={styles.sparkle}/>
   <h1>Your work deserves to be seen.<br/><em>And credited.</em></h1>
   <p>Every original reborn doll begins with a sculptor's imagination, patience and craftsmanship. Reborna is building a carefully researched place to discover those designs, connect their stories and celebrate the people who created them.</p>
   <div className={styles.heroActions}>
    <Link className={styles.primary} href="/contact/?category=artist">Get in touch <ArrowUpRight size={17} aria-hidden="true"/></Link>
    <Link className={styles.secondary} href="/artists/">Explore the artist archive <ArrowUpRight size={15} aria-hidden="true"/></Link>
   </div>
   <p className={styles.heroNote}>An independent editorial platform, not an artist-managed marketplace. Participation is optional and does not imply endorsement.</p>
  </section>

  <section className={styles.intro} aria-labelledby="sculptor-value">
   <div><span className={styles.kicker}>WHY WE'RE HERE</span><h2 id="sculptor-value">The original art matters<span className={styles.period}>.</span></h2></div>
   <p>Artwork can travel far beyond its original studio. Sculpt names are reused, surnames change, and photographs of completed reborns are often separated from their original artist credits. Reborna aims to make that history easier to follow—with documented, attributed records.</p>
  </section>

  <section className={styles.valueGrid} aria-label="Our editorial commitments">
   {values.map(({icon:Icon,title,description})=><article className={styles.value} key={title}><Icon size={28} strokeWidth={1.25} aria-hidden="true"/><h3>{title}</h3><p>{description}</p></article>)}
  </section>

  <section className={styles.research} aria-labelledby="research-example">
   <div className={styles.researchCopy}>
    <span className={styles.kicker}>A GLIMPSE OF THE ARCHIVE</span>
    <h2 id="research-example">Research that respects the maker<span className={styles.period}>.</span></h2>
    <p>We've already assembled research-led sculptor profiles and kit collections using original studio websites, published interviews and traceable gallery references.</p>
    <p>Our <Link href="/artists/cassie-ann-love/">Cassie Ann Love (formerly Cassie Brace)</Link> research connects her current portfolio with historical sculpt names, while carefully leaving uncertain identities unresolved. The <Link href="/artists/nikki-johnston/">Nikki Johnston</Link> collection similarly distinguishes her original designs from finished reborn artwork.</p>
    <Link className={styles.textLink} href="/guides/cassie-ann-love-sculpt-history/">Read a sourced sculpt-history feature <ArrowUpRight size={15} aria-hidden="true"/></Link>
   </div>
   <div className={styles.researchPanel}>
    <span>OUR EDITORIAL PROMISE</span>
    <p>“Credit the sculptor. Respect the interpretation. Follow the source.”</p>
    <small>We don't invent stock, announce unconfirmed releases or substitute an attractive image for reliable attribution.</small>
   </div>
  </section>

  <section className={styles.protection} aria-labelledby="protect-originals">
   <span className={styles.kicker}>PROTECTING ORIGINALITY · BUILDING TRUST</span>
   <h2 id="protect-originals">Original art. Carefully credited.<br/><em>Better protected.</em></h2>
   <p>Reborna helps collectors identify the artists behind original sculpts—and reduces confusion caused by unauthorised copies, recasts and misleading product claims. We prioritise traceable sources, fair corrections and independent review, not commercial favouritism.</p>
   <div className={styles.protectionGrid}>
    <article><ShieldCheck size={27} strokeWidth={1.3}/><h3>Source-led discovery</h3><p>We trace designs to credited sculptors and their published sources. A social profile or member role alone doesn't establish ownership or guarantee inclusion.</p></article>
    <article><BookOpenText size={27} strokeWidth={1.3}/><h3>Questions welcome</h3><p>Artists and collectors can report suspected copies, incorrect credits or uncertain origins. Every concern deserves evidence and fair human review.</p></article>
    <article><FileCheck2 size={27} strokeWidth={1.3}/><h3>Future certificate tools</h3><p>Our free certificate pilot lets independently approved sculptors request short, concealed certificate codes in reviewed production runs of any exact size from 1 to 5,000, with email confirmation and protected CSV exports; collectors can check code issuance and lookup history. Conceal the code beneath a tamper-evident peel-away or scratch-off area so normal certificate photographs do not expose it. A code alone cannot authenticate a physical kit.</p></article>
   </div>
   <div className={styles.protectionNote}><strong>Available now:</strong> source-backed research, reviewed artist submissions, collector certificate lookup and free code issuance for independently authorised original sculptors. <strong>Still in development:</strong> wider artist onboarding, more anti-counterfeit signals and a possible paid code service. A recorded code is never a guarantee that the physical product is original.</div>
  </section>
  <section className={styles.process} aria-labelledby="contribute-heading">
   <span className={styles.kicker}>HELP US GET THE DETAILS RIGHT</span>
   <h2 id="contribute-heading">Your perspective belongs in the story<span className={styles.period}>.</span></h2>
   <p className={styles.processLead}>If you are an original sculptor, we'd love to hear about an omission, correction, source photo, historical release or potential editorial feature. Here's how enquiries work today.</p>
   <div className={styles.steps}>{steps.map(step=><article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
   <div className={styles.processActions}>
    <Link className={styles.primary} href="/contact/?category=artist&intent=claim_profile">Introduce yourself or contribute a source <ArrowUpRight size={16} aria-hidden="true"/></Link>
    <Link className={styles.textLink} href="/contact/?category=report">Request a factual correction <ArrowUpRight size={15} aria-hidden="true"/></Link>
   </div>
   <p className={styles.fineprint}>Already have a Reborna account? Identify as an original sculptor in your account preferences, then <Link href="/dashboard/?area=sculptors">send a private profile claim or original kit submission from your dashboard</Link>. All requests are reviewed before any public changes. Please send links rather than uploading someone else's artwork. Publication or reuse of new photography requires an appropriate review of rights and attribution. A contribution is not automatically published.</p>
  </section>

  <section className={styles.sessions} aria-labelledby="sessions-heading">
   <div className={styles.sessionsIcon}><MessagesSquare size={27} strokeWidth={1.3} aria-hidden="true"/></div>
   <div><span className={styles.kicker}>THE FUTURE OF REBORNA</span><h2 id="sessions-heading">Conversations from the studio<span className={styles.period}>.</span></h2><p>We'd love to develop occasional <strong>Reborna Studio Sessions</strong>—thoughtful interviews and artist-led conversations about the original sculpting process, the stories behind designs and the craft that follows. No sessions are scheduled or open for booking yet; we're simply inviting ideas and potential collaborators.</p><Link className={styles.textLink} href="/contact/?category=events">Discuss a future Studio Session <ArrowUpRight size={15} aria-hidden="true"/></Link></div>
  </section>

  <section className={styles.closing}>
   <HeartHandshake size={31} strokeWidth={1.1} aria-hidden="true"/>
   <h2>Made for the artists behind the art<span className={styles.period}>.</span></h2>
   <p>We're beginning with careful documentation, useful discovery, reviewed artist onboarding and a free certificate-code pilot for independently approved sculptors. We do not offer authenticity guarantees, public paid placement, or marketplace checkout.</p>
   <Link className={styles.primary} href="/contact/?category=artist&intent=introduce">Say hello to Reborna <ArrowUpRight size={16} aria-hidden="true"/></Link>
   <small>Prefer email? <a href="mailto:hello@reborna.co">hello@reborna.co</a></small>
  </section>
 </main>;
}
