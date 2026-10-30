import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {ArrowLeft,ArrowUpRight,Heart} from "lucide-react";
import {editArticle,editArticles,editAuthor,editDate} from "../../../lib/the-edit";
import {canonical,safeJsonLd} from "../../../lib/seo";
import styles from "../editorial.module.css";
export function generateStaticParams(){return editArticles.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const article=editArticle(slug);
 if(!article)return {title:"Story not found | Reborna",robots:{index:false}};
 return {title:article.title+" | The Edit | Reborna",description:article.deck,alternates:{canonical:"/the-edit/"+slug+"/"},openGraph:{title:article.title,description:article.deck,url:canonical("/the-edit/"+slug+"/"),type:"article",publishedTime:article.published}};
}
export default async function EditorialArticle({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const article=editArticle(slug);if(!article)notFound();
 const structured={"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.deck,datePublished:article.published,dateModified:article.published,
 author:{"@type":"Organization",name:"Reborna editorial"},publisher:{"@type":"Organization",name:"Reborna",url:canonical("/")},mainEntityOfPage:canonical("/the-edit/"+slug+"/")};
 const more=editArticles.filter(x=>x.slug!==slug).slice(0,2);
 return <main className={styles.article}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(structured)}}/>
  <Link href="/the-edit/" className={styles.articleBack}><ArrowLeft size={15}/> Back to The Edit</Link>
  <header className={styles.articleHeader}>
   <span className={styles.kicker}>{article.category}</span>
   <h1>{article.title}</h1>
   <p className={styles.articleDeck}>{article.deck}</p>
   <div className={styles.articleMeta}>BY {editAuthor.toUpperCase()} · {editDate(article.published).toUpperCase()} · {article.readingMinutes} MIN READ</div>
  </header>
  <div className={styles.articleBody}>
   <p className={styles.articleLead}>{article.lead}</p>
   {article.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
  </div>
  {article.sourceNote&&<p className={styles.articleNote}>{article.sourceNote}</p>}
  <section className={styles.articleRelated}><span className={styles.kicker}>COME DOWN THE RABBIT HOLE</span>{article.related.map(x=><Link key={x.href} href={x.href}>{x.label}<ArrowUpRight size={16}/></Link>)}</section>
  <section className={styles.signup}><div><span className={styles.kicker}>CONSIDER YOURSELF ENABLED</span><h2>Save what you love.</h2><p>A wishlist for original sculpts, favourite artists and all those future projects. Start without an account, then take your collection across devices when you join.</p></div>
   <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:13}}><Link href="/collection/" className={styles.primary}>My collection <Heart size={17}/></Link><Link href="/account/?from=the-edit" className={styles.secondary}>Join Reborna free <ArrowUpRight size={15}/></Link></div></section>
  <div className={styles.articleRelated} style={{marginTop:55}}><span className={styles.kicker}>MORE FROM THE EDIT</span>{more.map(x=><Link key={x.slug} href={"/the-edit/"+x.slug+"/"}>{x.title}<ArrowUpRight size={16}/></Link>)}</div>
  <p className={styles.articleNote}>Felix Frost is a fictional Reborna editorial persona. No fabricated interviews, personal experiences or testimonials are presented as reporting.</p>
 </main>
}
