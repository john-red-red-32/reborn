import Link from "next/link";
import type {Metadata} from "next";
import {ArrowRight,ArrowUpRight,Heart} from "lucide-react";
import {editArticles,editAuthor,editDate} from "../../lib/the-edit";
import styles from "./editorial.module.css";
export const metadata:Metadata={
 title:"The Edit | Reborn Doll Stories, Collecting & Culture | Reborna",
 description:"Original reborn doll kits, collector culture, doll show diaries and counterfeit awareness — an irreverent, source-conscious editorial by Reborna.",
 alternates:{canonical:"/the-edit/"},
 openGraph:{title:"The Edit — Little dolls. Big opinions.",description:"An occasionally outrageous, always original editorial corner of reborn collecting.",url:"https://reborna.co/the-edit/"}
};
export default function TheEdit(){return <main className={styles.editShell}>
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
 <section className={styles.signup}><div><span className={styles.kicker}>YOUR COLLECTION, YOUR RULES</span><h2>Keep the ones you love.</h2><p>Follow favourite sculptors, heart original kits, and make a gloriously unreasonable wishlist. You can start as a guest — a free account keeps everything together across devices.</p></div>
 <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:14}}><Link href="/collection/" className={styles.primary}>Open my collection <Heart size={17}/></Link><Link href="/account/?from=the-edit" className={styles.secondary}>Create a free account <ArrowRight size={15}/></Link></div></section>
 <p className={styles.articleNote}>Felix Frost is Reborna's playful editorial pen name, not a real-world journalist. Stories clearly separate opinion from sourced event and product information. No invented interviews or collector quotes.</p>
 </main>}