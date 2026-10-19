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
  <div className="announcement"><Sparkles size={14}/> Your new home for independent reborn sculpt discoveries <ArrowRight size={13}/></div>
  <section className="hero"><div className="hero-content">
   <div className="eyebrow"><span className="dot"/> THE SCULPT COLLECTOR'S EDIT</div>
   <h1><T>{"Discover the art"}</T><br/><em><T>{"of what’s next."}</T></em></h1>
   <p><T>{"Beautifully crafted original reborn doll sculpt kits from independent sculptors. Find new releases, follow pre-orders and discover where to buy — all in one place."}</T></p>
   <div className="hero-actions">
     <a className="primary" href="#catalogue">Explore the collection <ArrowRight size={16}/></a>
     <Link className="secondary" href="/calendar/">View Reborn Calendar <CalendarDays size={16}/></Link>
   </div>
   <div className="hero-mini"><span className="mini-line"/> Made for collectors, by people who love the art.</div>
  </div><div className="hero-visual"><div className="arch"><div className="hero-art"><span className="small-top"><T>{"THE ART OF THE SCULPT"}</T></span><div className="sculpt-shape"><span>r</span></div><span className="small-bottom"><T>{"A CURATED WORLD OF CREATIVITY"}</T></span></div></div><div className="floating-note"><span>✧</span><div><strong><T>{"Something wonderful is coming"}</T></strong><small><T>{"Explore original sculpt collections"}</T></small></div></div></div></section>
  <section className="benefits"><div><CalendarDays size={20}/><span><b><T>{"Follow upcoming releases"}</T></b><small><T>{"Pre-orders and artist announcements"}</T></small></span></div><div><Heart size={20}/><span><b><T>{"Save the ones you love"}</T></b><small><T>{"Keep your favourite original sculpts close"}</T></small></span></div><div><Store size={20}/><span><b><T>{"Find original retailers"}</T></b><small><T>{"Trace kits back to the artist and their sellers"}</T></small></span></div></section>
  <DiscoverFeed/>
  <section className="featured-real"><div><span className="section-kicker"><T>{"FROM THE ORIGINAL SCULPTORS"}</T></span><h2><T>{"Original sculptors. Beautifully individual art."}</T></h2><p><T>{"Discover original designs from independent sculptors and follow the source to learn more."}</T></p><Link href="/artists/">Meet the artists <ArrowRight size={15}/></Link></div>{featured.map(k=><Link key={k.slug} href={`/kits/${k.slug}/`} className="featured-photo"><img src={k.photos![0].url} alt={`${k.name} original reborn doll sculpt design by ${kitArtist(k.artistSlug)?.name||"its credited sculptor"}`} loading="lazy"/>{k.photos![1]&&<img className="sculpt-photo-hover" src={k.photos![1].url} alt={`Alternate published photograph of ${k.name}, original reborn sculpture by ${kitArtist(k.artistSlug)?.name||"its artist"}`} loading="lazy"/>}<span><strong>{k.name}</strong></span></Link>)}</section>
  <section className="rbrn-seo-related rbrn-home-artist-index" aria-labelledby="home-artist-index"><span className="section-kicker"><T>{"KNOW THE HANDS BEHIND THE SCULPT"}</T></span><h2 id="home-artist-index"><T>{"Explore original reborn doll sculptors"}</T></h2><p><T>{"Research the artists behind the original designs, discover their documented reborn doll sculpt kits and follow links back to official sculptor or specialist source information."}</T></p><div className="rbrn-seo-link-grid">{artistIndex.map(artist=><Link key={artist.slug} href={"/artists/"+artist.slug+"/"}>{artist.name} <span><T>{"sculptor biography & kits →"}</T></span></Link>)}</div><Link className="rbrn-seo-view-all" href="/artists/"><T>{"View all original reborn sculptors →"}</T></Link></section>
  <section className="rbrn-events-home-promo"><div><span className="section-kicker"><T>{"BEYOND THE SCULPT"}</T></span><h2><T>{"Where the reborn world meets."}</T></h2><p><T>{"Explore international doll shows, meet fellow collectors and discover the community behind the art."}</T></p></div><Link href="/events/">Explore community events <ArrowRight size={17}/></Link></section>
  <section className="bottom-cta"><div><span className="section-kicker"><T>{"A LITTLE SOMETHING TO LOOK FORWARD TO"}</T></span><h2><T>{"Beautiful things are worth the wait."}</T></h2><p><T>{"Watch artist launches and find the latest documented release dates."}</T></p></div><Link href="/calendar/">Explore Reborn Calendar <ArrowRight size={18}/></Link></section>
 </main>;
}
