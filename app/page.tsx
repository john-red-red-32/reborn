import Link from "next/link";
import {ArrowRight,CalendarDays,Heart,Sparkles,Store} from "lucide-react";
import {verifiedKits} from "../lib/real-catalogue";
import DiscoverFeed from "../components/DiscoverFeed";

/** Static-exportable homepage. The discovery feed progressively reveals
 * genuine records, while the illustrative calendar remains at /calendar.
 */
export default function Home(){
 const featured=verifiedKits.filter(k=>k.photos?.length).slice(0,2);
 return <main>
  <div className="announcement"><Sparkles size={14}/> Your new home for independent reborn sculpt discoveries <ArrowRight size={13}/></div>
  <section className="hero"><div className="hero-content">
   <div className="eyebrow"><span className="dot"/> THE SCULPT COLLECTOR'S EDIT</div>
   <h1>Discover the art<br/>of <em>what’s next.</em></h1>
   <p>Beautifully crafted reborn sculpt kits from independent artists. Find new releases, follow pre-orders and discover where to buy — all in one place.</p>
   <div className="hero-actions">
     <a className="primary" href="#catalogue">Explore the collection <ArrowRight size={16}/></a>
     <Link className="secondary" href="/calendar/">View release calendar <CalendarDays size={16}/></Link>
   </div>
   <div className="hero-mini"><span className="mini-line"/> Made for collectors, by people who love the art.</div>
  </div><div className="hero-visual"><div className="arch"><div className="hero-art"><span className="small-top">THE ART OF THE SCULPT</span><div className="sculpt-shape"><span>r</span></div><span className="small-bottom">A CURATED WORLD OF CREATIVITY</span></div></div><div className="floating-note"><span>✧</span><div><strong>Something wonderful is coming</strong><small>Explore original sculpt collections</small></div></div></div></section>
  <section className="benefits"><div><CalendarDays size={20}/><span><b>Follow upcoming releases</b><small>Pre-orders and artist announcements</small></span></div><div><Heart size={20}/><span><b>Save the ones you love</b><small>Keep your favourite original sculpts close</small></span></div><div><Store size={20}/><span><b>Find original retailers</b><small>Trace kits back to the artist and their sellers</small></span></div></section>
  <DiscoverFeed/>
  <section className="featured-real"><div><span className="section-kicker">FROM THE ORIGINAL SCULPTORS</span><h2>A closer look at the art.</h2><p>Discover original designs from independent sculptors and follow the source to learn more.</p><Link href="/artists/">Meet the artists <ArrowRight size={15}/></Link></div>{featured.map(k=><Link key={k.slug} href={`/kits/${k.slug}/`} className="featured-photo"><img src={k.photos![0].url} alt={`${k.name} original sculpt example`} loading="lazy"/>{k.photos![1]&&<img className="sculpt-photo-hover" src={k.photos![1].url} alt={`${k.name} alternate angle`} loading="lazy"/>}<span><strong>{k.name}</strong></span></Link>)}</section>
  <section className="bottom-cta"><div><span className="section-kicker">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h2>Beautiful things are worth the wait.</h2><p>Watch artist launches and find the latest documented release dates.</p></div><Link href="/calendar/">Explore release calendar <ArrowRight size={18}/></Link></section>
  <footer><div className="logo">reborna<span className="logo-mark">✳</span></div><span>Independent artists. One beautiful place to discover them.</span><small>Editorial discovery · Purchase directly from original sources</small></footer>
 </main>;
}
