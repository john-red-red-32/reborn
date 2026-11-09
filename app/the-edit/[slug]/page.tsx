import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft,ArrowUpRight,Heart,CalendarDays} from "lucide-react";
import {editArticle,editArticles,editAuthor,editDate} from "../../../lib/the-edit";
import {communityEvents,eventDateLabel} from "../../../lib/community-events";
import {canonical,safeJsonLd,breadcrumbJsonLd,homeCrumb} from "../../../lib/seo";
import styles from "../editorial.module.css";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return editArticles.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const article=editArticle(slug);
 if(!article)return {title:"Story not found | Reborna",robots:{index:false}};
 const description=article.metaDescription||article.deck;
 const url=canonical("/the-edit/"+slug+"/");
 return {title:article.title+" | The Edit | Reborna",description,alternates:{canonical:url},
  openGraph:{title:article.title,description,url,type:"article",publishedTime:article.published,modifiedTime:article.published,siteName:"Reborna"},
  twitter:{card:"summary",title:article.title,description},
  robots:{index:true,follow:true}
 };
}
export default async function EditorialArticle({params}:Props){
 const {slug}=await params;
 const article=editArticle(slug);
 if(!article)notFound();
 const url=canonical("/the-edit/"+slug+"/");
 const structured={"@context":"https://schema.org","@type":"Article",
  headline:article.title,description:article.metaDescription||article.deck,articleSection:article.category,
  datePublished:article.published,dateModified:article.published,isAccessibleForFree:true,
  author:{"@type":"Organization",name:"Reborna editorial"},
  publisher:{"@type":"Organization",name:"Reborna",url:canonical("/")},
  mainEntityOfPage:{"@type":"WebPage","@id":url},url
 };
 const breadcrumbs=breadcrumbJsonLd([homeCrumb,{name:"The Edit",path:"/the-edit/"},{name:article.title,path:"/the-edit/"+slug+"/"}]);
 const more=editArticles.filter(x=>x.slug!==slug&&x.category===article.category).slice(0,3);
 const other=(more.length?more:editArticles.filter(x=>x.slug!==slug).slice(0,3));
 const event=article.eventSlug?communityEvents.find(x=>x.slug===article.eventSlug):undefined;
 // Static build emits only verified future events. Never re-list old show dates as upcoming.
 const today=new Date().toISOString().slice(0,10);
 const upcoming=communityEvents.filter(e=>e.endDate>=today&&e.slug!==event?.slug)
  .sort((a,b)=>a.startDate.localeCompare(b.startDate)).slice(0,3);
 return <main className={styles.article}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(structured)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumbs)}}/>
  <Link href="/the-edit/" className={styles.articleBack}><ArrowLeft size={15}/> Back to The Edit</Link>
  <header className={styles.articleHeader}>
   <span className={styles.kicker}>{article.category}</span>
   <h1>{article.title}</h1>
   <p className={styles.articleDeck}>{article.deck}</p>
   <div className={styles.articleMeta}>BY {editAuthor.toUpperCase()} · {editDate(article.published).toUpperCase()} · {article.readingMinutes} MIN READ</div>
  </header>
  {event&&<aside className={styles.eventContext} aria-label="Verified event details">
   <div><span className={styles.kicker}>{event.endDate<today?"ARCHIVED EVENT":"COMING UP · VERIFIED EVENT"}</span>
    <h2>{event.name}</h2><p><CalendarDays size={16}/> {eventDateLabel(event)} · {event.city}, {event.country}</p>
   </div>
   <div className={styles.eventLinks}>
    <Link href={"/events/"+event.slug+"/"}>Verified event page <ArrowUpRight size={15}/></Link>
    <a href={event.officialUrl} target="_blank" rel="noopener noreferrer">Official organiser <ArrowUpRight size={15}/></a>
   </div>
  </aside>}
  <div className={styles.articleBody}>
   <p className={styles.articleLead}>{article.lead}</p>
   {article.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
  </div>
  {article.sourceLinks?.length? <section className={styles.references} aria-label="Research sources">
   <span className={styles.kicker}>THE RECEIPTS, DARLING</span>
   <h2>Sources and further reading</h2>
   <p>Primary organiser material and attributed original sources, checked for this article. Programmes, availability and ticket policies can change.</p>
   <ul>{article.sourceLinks.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <ArrowUpRight size={14}/></a></li>)}</ul>
  </section>:null}
  {article.sourceNote&&<p className={styles.articleNote}>{article.sourceNote}</p>}
  <section className={styles.articleRelated}><span className={styles.kicker}>COME DOWN THE RABBIT HOLE</span>{article.related.map(x=><Link key={x.href} href={x.href}>{x.label}<ArrowUpRight size={16}/></Link>)}</section>
  <section className={styles.signup}><div><span className={styles.kicker}>CONSIDER YOURSELF ENABLED</span><h2>Save what you love.</h2><p>Heart original kits, follow sculptors and build an unapologetically personal collection. Browsing is free; a free account keeps your favourites together across devices.</p></div>
   <div className={styles.signupActions}><Link href="/collection/" className={styles.primary}>My collection <Heart size={17}/></Link><Link href="/account/?from=the-edit" className={styles.secondary}>Join Reborna free <ArrowUpRight size={15}/></Link><Link href="/marketplace/" className={styles.secondary}>Explore finished doll artwork <ArrowUpRight size={15}/></Link></div></section>
  <section className={styles.articleRelated}><span className={styles.kicker}>MORE FROM THE EDIT</span>{other.map(x=><Link key={x.slug} href={"/the-edit/"+x.slug+"/"}>{x.title}<ArrowUpRight size={16}/></Link>)}</section>
  {upcoming.length>0&&<section className={styles.relatedEvents}><span className={styles.kicker}>WHERE OUR WORLD COMES TOGETHER</span><h2>Upcoming doll shows</h2><div>{upcoming.map(x=><Link key={x.slug} href={"/events/"+x.slug+"/"}><strong>{x.name}</strong><small>{x.city} · {eventDateLabel(x)}</small><ArrowUpRight size={15}/></Link>)}</div></section>}
  <p className={styles.articleNote}>Felix Frost is Reborna's fictional editorial persona, not a real-world journalist. This publication does not invent interviews, first-hand experiences, testimonials or industry gossip.</p>
 </main>;
}
