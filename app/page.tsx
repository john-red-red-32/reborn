import Link from "next/link";
import {ArrowRight,CalendarDays,Heart,Sparkles,Store} from "lucide-react";
import {artists,verifiedKits,kitArtist} from "../lib/real-catalogue";
import type {Metadata} from "next";
import {canonical,safeJsonLd} from "../lib/seo";
import DiscoverFeed from "../components/DiscoverFeed";
import T from "../components/T";

/** Static-exportable homepage. The discovery feed progressively reveals
 * genuine records, while the illustrative calendar remains at /calendar.
 */
export const metadata:Metadata={title:"Original Reborn Doll Sculptors & Kits | Reborna",description:"Explore original reborn doll sculptors and their designs. Browse documented original sculpt kits, credible artist sources, photographic collections and specialist supplies.",alternates:{canonical:"/"},openGraph:{title:"Original Reborn Doll Sculptors & Kits | Reborna",description:"A source-attributed home for original reborn doll sculptures, artists and collectors.",url:canonical("/")}};
export default function Home(){
 const featured=verifiedKits.filter(k=>k.photos?.length).slice(0,2);
 const artistIndex=artists.filter(a=>verifiedKits.some(k=>k.artistSlug===a.slug)).slice(0,12);
 const ld={"@context":"https://schema.org","@type":"WebSite",name:"Reborna",url:canonical("/"),description:"Independent directory of original reborn doll sculptors and documented original reborn doll kits",inLanguage:"en-GB"};
 return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(ld)}}/>
  <div className="announcement"><Sparkles size={14}/> <T>{"Your new home for independent reborn sculpt discoveries"}</T> <ArrowRight size={13}/></div>
  <section className="hero"><div className="hero-content">
   <div className="eyebrow"><span className="dot"/> THE SCULPT COLLECTOR'S EDIT</div>
   <h1><T>{"Discover the art"}</T><br/><em><T>{"of what’s next."}</T></em></h1>
   <p><T>{"Beautifully crafted original reborn doll sculpt kits from independent sculptors. Find new releases, follow pre-orders and discover where to buy — all in one place."}</T></p>
   <div className="hero-actions">
     <a className="primary" href="#catalogue"><T>{"Explore the collection"}</T> <ArrowRight size={16}/></a>
     <Link className="secondary" href="/calendar/"><T>{"View Reborn Calendar"}</T> <CalendarDays size={16}/></Link>
   </div>
   <div className="hero-mini"><span className="mini-line"/> <T>{"Made for collectors, by people who love the art."}</T></div>
  </div><div className="hero-visual"><div className="arch"><div className="hero-art"><span className="small-top"><T>{"THE ART OF THE SCULPT"}</T></span><div className="sculpt-shape"><span>r</span></div><span className="small-bottom"><T>{"A CURATED WORLD OF CREATIVITY"}</T></span></div></div><div className="floating-note"><span>✧</span><div><strong><T>{"Something wonderful is coming"}</T></strong><small><T>{"Explore original sculpt collections"}</T></small></div></div></div></section>
  <section className="benefits"><div><CalendarDays size={20}/><span><b><T>{"Follow upcoming releases"}</T></b><small><T>{"Pre-orders and artist announcements"}</T></small></span></div><div><Heart size={20}/><span><b><T>{"Save the ones you love"}</T></b><small><T>{"Keep your favourite original sculpts close"}</T></small></span></div><div><Store size={20}/><span><b><T>{"Find original retailers"}</T></b><small><T>{"Trace kits back to the artist and their sellers"}</T></small></span></div></section>
  <section aria-label="Your collector benefits" style={{maxWidth:1320,margin:"38px auto 28px",padding:"0 5%",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,340px),1fr))",gap:16}}>
   <div style={{padding:"27px clamp(20px,3vw,38px)",background:"#eae0d7",border:"1px solid #e0d3c9"}}><span style={{fontSize:11,letterSpacing:2,color:"#846859"}}>YOUR PERSONAL COLLECTION</span><h2 style={{font:"400 clamp(25px,3vw,36px) Playfair Display,Georgia,serif",margin:"14px 0"}}>Fall in love. Save the evidence.</h2><p style={{fontSize:14,lineHeight:1.75,color:"#756355"}}>Heart original kits and follow your favourite sculptors. Keep a wishlist as a guest, then make it yours across devices with a free account.</p><Link href="/collection/" style={{fontWeight:700,fontSize:13,color:"#604536"}}>Open my collection →</Link></div>
   <div style={{padding:"27px clamp(20px,3vw,38px)",background:"#ece5e8",border:"1px solid #e1d4dc"}}><span style={{fontSize:11,letterSpacing:2,color:"#846859"}}>NEW · THE EDIT BY FELIX FROST</span><h2 style={{font:"400 clamp(25px,3vw,36px) Playfair Display,Georgia,serif",margin:"14px 0"}}>Little dolls. Big opinions.</h2><p style={{fontSize:14,lineHeight:1.75,color:"#756355"}}>Collector obsessions, original artist stories, event diaries and the occasional counterfeit side-eye. A lot of personality, zero made-up gossip.</p><Link href="/the-edit/" style={{fontWeight:700,fontSize:13,color:"#604536"}}>Read The Edit →</Link></div>
  </section>
  <DiscoverFeed/>
  <section className="featured-real"><div><span className="section-kicker"><T>{"FROM THE ORIGINAL SCULPTORS"}</T></span><h2><T>{"Original sculptors. Beautifully individual art."}</T></h2><p><T>{"Discover original designs from independent sculptors and follow the source to learn more."}</T></p><Link href="/artists/"><T>{"Meet the artists"}</T> <ArrowRight size={15}/></Link></div>{featured.map(k=><Link key={k.slug} href={`/kits/${k.slug}/`} className="featured-photo"><img src={k.photos![0].url} alt={`${k.name} original reborn doll sculpt design by ${kitArtist(k.artistSlug)?.name||"its credited sculptor"}`} loading="lazy"/>{k.photos![1]&&<img className="sculpt-photo-hover" src={k.photos![1].url} alt={`Alternate published photograph of ${k.name}, original reborn sculpture by ${kitArtist(k.artistSlug)?.name||"its artist"}`} loading="lazy"/>}<span><strong>{k.name}</strong></span></Link>)}</section>
  <section className="rbrn-seo-related rbrn-home-artist-index" aria-labelledby="home-artist-index"><span className="section-kicker"><T>{"KNOW THE HANDS BEHIND THE SCULPT"}</T></span><h2 id="home-artist-index"><T>{"Explore original reborn doll sculptors"}</T></h2><p><T>{"Research the artists behind the original designs, discover their documented reborn doll sculpt kits and follow links back to official sculptor or specialist source information."}</T></p><div className="rbrn-seo-link-grid">{artistIndex.map(artist=><Link key={artist.slug} href={"/artists/"+artist.slug+"/"}>{artist.name} <span><T>{"sculptor biography & kits →"}</T></span></Link>)}</div><Link className="rbrn-seo-view-all" href="/artists/"><T>{"View all original reborn sculptors →"}</T></Link></section>
  <section className="rbrn-events-home-promo"><div><span className="section-kicker"><T>{"BEYOND THE SCULPT"}</T></span><h2><T>{"Where the reborn world meets."}</T></h2><p><T>{"Explore international doll shows, meet fellow collectors and discover the community behind the art."}</T></p></div><Link href="/events/"><T>{"Explore community events"}</T> <ArrowRight size={17}/></Link></section>
  <section className="bottom-cta"><div><span className="section-kicker"><T>{"A LITTLE SOMETHING TO LOOK FORWARD TO"}</T></span><h2><T>{"Beautiful things are worth the wait."}</T></h2><p><T>{"Watch artist launches and find the latest documented release dates."}</T></p></div><Link href="/calendar/"><T>{"Explore Reborn Calendar"}</T> <ArrowRight size={18}/></Link></section>
 </main>;
}
