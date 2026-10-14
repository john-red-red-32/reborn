import Link from "next/link";
import {ArrowRight,CalendarDays,Heart,Sparkles,Store} from "lucide-react";
import {artists,verifiedKits,kitArtist} from "../lib/real-catalogue";
import type {Metadata} from "next";
import {canonical,safeJsonLd} from "../lib/seo";
import DiscoverFeed from "../components/DiscoverFeed";

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
   <h1>Discover the art<br/>of <em>what’s next.</em></h1>
   <p>Beautifully crafted original reborn doll sculpt kits from independent sculptors. Find new releases, follow pre-orders and discover where to buy — all in one place.</p>
   <div className="hero-actions">
     <a className="primary" href="#catalogue">Explore the collection <ArrowRight size={16}/></a>
     <Link className="secondary" href="/calendar/">View Reborn Calendar <CalendarDays size={16}/></Link>
   </div>
   <div className="hero-mini"><span className="mini-line"/> Made for collectors, by people who love the art.</div>
  </div><div className="hero-visual"><div className="arch"><div className="hero-art"><span className="small-top">THE ART OF THE SCULPT</span><div className="sculpt-shape"><span>r</span></div><span className="small-bottom">A CURATED WORLD OF CREATIVITY</span></div></div><div className="floating-note"><span>✧</span><div><strong>Something wonderful is coming</strong><small>Explore original sculpt collections</small></div></div></div></section>
  <section className="benefits"><div><CalendarDays size={20}/><span><b>Follow upcoming releases</b><small>Pre-orders and artist announcements</small></span></div><div><Heart size={20}/><span><b>Save the ones you love</b><small>Keep your favourite original sculpts close</small></span></div><div><Store size={20}/><span><b>Find original retailers</b><small>Trace kits back to the artist and their sellers</small></span></div></section>
  <DiscoverFeed/>
  <section className="featured-real"><div><span className="section-kicker">FROM THE ORIGINAL SCULPTORS</span><h2>Original sculptors. Beautifully individual art.</h2><p>Discover original designs from independent sculptors and follow the source to learn more.</p><Link href="/artists/">Meet the artists <ArrowRight size={15}/></Link></div>{featured.map(k=><Link key={k.slug} href={`/kits/${k.slug}/`} className="featured-photo"><img src={k.photos![0].url} alt={`${k.name} original reborn doll sculpt design by ${kitArtist(k.artistSlug)?.name||"its credited sculptor"}`} loading="lazy"/>{k.photos![1]&&<img className="sculpt-photo-hover" src={k.photos![1].url} alt={`Alternate published photograph of ${k.name}, original reborn sculpture by ${kitArtist(k.artistSlug)?.name||"its artist"}`} loading="lazy"/>}<span><strong>{k.name}</strong></span></Link>)}</section>
  <section className="rbrn-seo-related rbrn-home-artist-index" aria-labelledby="home-artist-index"><span className="section-kicker">KNOW THE HANDS BEHIND THE SCULPT</span><h2 id="home-artist-index">Explore original reborn doll sculptors</h2><p>Research the artists behind the original designs, discover their documented reborn doll sculpt kits and follow links back to official sculptor or specialist source information.</p><div className="rbrn-seo-link-grid">{artistIndex.map(artist=><Link key={artist.slug} href={"/artists/"+artist.slug+"/"}>{artist.name} <span>sculptor biography & kits →</span></Link>)}</div><Link className="rbrn-seo-view-all" href="/artists/">View all original reborn sculptors →</Link></section>
  <section className="rbrn-events-home-promo"><div><span className="section-kicker">BEYOND THE SCULPT</span><h2>Where the reborn world meets.</h2><p>Explore international doll shows, meet fellow collectors and discover the community behind the art.</p></div><Link href="/events/">Explore community events <ArrowRight size={17}/></Link></section>
  <section className="bottom-cta"><div><span className="section-kicker">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h2>Beautiful things are worth the wait.</h2><p>Watch artist launches and find the latest documented release dates.</p></div><Link href="/calendar/">Explore Reborn Calendar <ArrowRight size={18}/></Link></section>
 </main>;
}
