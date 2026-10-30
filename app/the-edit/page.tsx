import Link from "next/link";
import type {Metadata} from "next";
import {ArrowRight,ArrowUpRight,Heart} from "lucide-react";
import {editArticles,editDate} from "../../lib/the-edit";
import {verifiedKits,kitArtist} from "../../lib/real-catalogue";
import {sculptStatus,statusNames} from "../../lib/sculpt-status";
import {communityEvents,eventDateLabel} from "../../lib/community-events";
import styles from "./editorial.module.css";
export const metadata:Metadata={
 title:"The Edit | Reborn Doll Stories, Collecting & Culture | Reborna",
 description:"Original reborn doll kits, collector culture, doll show diaries and counterfeit awareness — an irreverent, source-conscious editorial by Reborna.",
 alternates:{canonical:"/the-edit/"},
 openGraph:{title:"The Edit — Little dolls. Big opinions.",description:"An occasionally outrageous, always original editorial corner of reborn collecting.",url:"https://reborna.co/the-edit/"}
};
export default function TheEdit(){
 const radar=verifiedKits.filter(k=>k.statusChecked?.startsWith("2026-10")&&["announced","preorder_open","in_production"].includes(sculptStatus(k))&&k.photos?.length).slice(0,4);
 const upcoming=communityEvents.filter(e=>e.startDate>="2026-10-30").sort((a,b)=>a.startDate.localeCompare(b.startDate)).slice(0,3);
 return <main className={styles.editShell}>
 <section className={styles.hero}><div>
  <div className={styles.kicker}>REBORNA PRESENTS · THE EDIT</div>
  <h1>Little dolls.<br/><em>Big opinions.</em></h1>
  <p>Artist obsessions, original kits, event diaries and the occasional perfectly justified counterfeit side-eye. A little wit, a lot of love for the craft, and not a corporate clipboard in sight.</p>
  <div className={styles.byline}>WITH FELIX FROST · REBORNA'S FICTIONAL EDITORIAL PERSONA</div>
  <div className={styles.topics}><a href="#latest">The latest stories</a><Link href="/collection/">My collection</Link><Link href="/community/">The community forum</Link></div>
 </div><div className={styles.heroArt} aria-label="Decorative Reborna editorial monogram"><span>r.</span><small>COLLECTING CULTURE<br/>WITHOUT THE BORING BITS</small></div></section>
 <section id="latest" aria-labelledby="edit-latest"><div className={styles.sectionHeading}><div><span className={styles.kicker}>PULL UP A CHAIR, DARLING</span><h2 id="edit-latest">Fresh from the edit.</h2></div></div>
 <div className={styles.grid}>{editArticles.map(article=><article key={article.slug} className={styles.feature+" "+styles[article.accent as keyof typeof styles]}>
  <div><span className={styles.kicker}>{article.category} · {editDate(article.published)}</span>
  <h3>{article.title}</h3><p>{article.deck}</p></div>
  <Link className={styles.featureLink} href={"/the-edit/"+article.slug+"/"}>Read the story <ArrowUpRight size={17}/></Link>
 </article>)}</div>
 </section>
 <section className={styles.recs}><div className={styles.sectionHeading}><div><span className={styles.kicker}>WHAT'S ON THE RADAR · SOURCED CATALOGUE</span><h2>Currently making eyes at us.</h2></div><Link className={styles.secondary} href="/calendar/">Full release calendar <ArrowUpRight size={15}/></Link></div>
 <p>Original kits marked as announced, in production or on pre-order in our October catalogue observations. This isn't a live stock guarantee; each kit links to its dated evidence.</p>
 <div className={styles.radarGrid}>{radar.map(k=><Link key={k.slug} href={"/kits/"+k.slug+"/"} className={styles.radarCard}>
  <div className={styles.radarImage}>{k.photos?.[0]?.url?<img src={k.photos[0].url} alt={k.name+" original sculpt, source-attributed on kit page"} loading="lazy"/>:<span>✳</span>}</div>
  <div><span className={styles.kicker}>{statusNames[sculptStatus(k) as keyof typeof statusNames]||"Catalogue watch"}</span><h3>{k.name}</h3><small>{kitArtist(k.artistSlug)?.name||"Original sculptor"}</small><p>Last noted: {k.statusChecked} · Check the original source for updates.</p></div>
 </Link>)}</div>
 </section>
 <section className={styles.recs}><div className={styles.sectionHeading}><div><span className={styles.kicker}>REAL EVENTS · NO IMAGINARY VIPS</span><h2>Out of the group chat.</h2></div><Link className={styles.secondary} href="/events/">All upcoming events <ArrowUpRight size={15}/></Link></div>
 <div className={styles.eventGrid}>{upcoming.map(e=><Link href={"/events/"+e.slug+"/"} key={e.slug}><span className={styles.kicker}>{e.city} · {eventDateLabel(e)}</span><h3>{e.name}</h3><p>{e.focus==="reborn-specific"?"Reborn-specific gathering":"Includes reborn artistry"} · Organiser-sourced details</p><span>Event details →</span></Link>)}</div>
 </section>
 <section className={styles.signup}><div><span className={styles.kicker}>YOUR COLLECTION, YOUR RULES</span><h2>Keep the ones you love.</h2><p>Follow favourite sculptors, heart original kits, and make a gloriously unreasonable wishlist. You can start as a guest — a free account keeps everything together across devices.</p></div>
 <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:14}}><Link href="/collection/" className={styles.primary}>Open my collection <Heart size={17}/></Link><Link href="/account/?from=the-edit" className={styles.secondary}>Create a free account <ArrowRight size={15}/></Link></div></section>
 <p className={styles.articleNote}>Felix Frost is Reborna's playful editorial pen name, not a real-world journalist. Stories clearly separate opinion from sourced event and product information. No invented interviews or collector quotes.</p>
 </main>}