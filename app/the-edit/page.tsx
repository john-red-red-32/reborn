import Link from "next/link";
import type {Metadata} from "next";
export const metadata:Metadata={title:"The Edit | Reborna — Reborn Doll Culture, Kits & Collecting",description:"The occasionally opinionated Reborna editorial: original sculpt kits, doll shows, collecting culture and why authenticity matters.",alternates:{canonical:"/the-edit/"}};
const stories=[
{tag:"THE COLLECTOR'S MANIFESTO",title:"Your wishlist is allowed to be completely unreasonable",dek:"One sculpt becomes three. Three becomes a spreadsheet. Darling, this is a collection, not a character flaw.",href:"/dashboard/",cta:"Build your collection"},
{tag:"AUTHENTICITY, PLEASE",title:"The counterfeit kit problem: cute doll, ugly backstory",dek:"A suspiciously cheap kit is not always a bargain. Here's why the artist behind the original sculpt deserves to stay in the picture.",href:"/verify/",cta:"Explore kit verification"},
{tag:"OUT & ABOUT",title:"Doll shows are having their main-character moment",dek:"Meet the makers, inspect the details and leave with approximately seventeen new favourites. Browse the event calendar before planning your next outing.",href:"/events/",cta:"Find upcoming shows"},
{tag:"THE SCULPT WATCH",title:"The next obsession is probably already in the catalogue",dek:"From expressive little faces to distinctive artist signatures, discover original sculpts without the counterfeit chaos.",href:"/real-kits/",cta:"Discover original kits"}
];
export default function TheEdit(){return <main style={{maxWidth:1160,margin:"0 auto",padding:"clamp(36px,6vw,88px) 22px 110px"}}>
<div style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",color:"#8b766c"}}>REBORNA PRESENTS · THE EDIT</div>
<h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:"clamp(54px,9vw,110px)",lineHeight:1.04,margin:"22px 0"}}>Little dolls.<br/><em>Big opinions.</em></h1>
<p style={{fontSize:"clamp(18px,2vw,23px)",lineHeight:1.65,maxWidth:730,color:"#655951"}}>A delightfully nosy corner of reborn culture: original sculpts, collector obsessions, shows worth knowing about and the occasional counterfeit side-eye. Written with love, not a corporate clipboard.</p>
<p style={{fontSize:13,letterSpacing:1,color:"#917e73",marginTop:28}}>THE EDITORIAL DESK · BY FELIX FROST</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,300px),1fr))",gap:24,marginTop:60}}>
{stories.map((s,i)=><article key={s.title} style={{background:i%2?"#f3eee9":"#f8f5f1",padding:"clamp(26px,4vw,42px)",border:"1px solid #e8ded6",minHeight:320,display:"flex",flexDirection:"column"}}>
<span style={{fontSize:11,letterSpacing:2,color:"#90796d"}}>{s.tag}</span><h2 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:400,lineHeight:1.18,margin:"20px 0"}}>{s.title}</h2><p style={{lineHeight:1.7,color:"#675b54",flex:1}}>{s.dek}</p><Link style={{color:"#6e4c3e",fontWeight:600,marginTop:18}} href={s.href}>{s.cta} →</Link></article>)}
</div><section style={{marginTop:70,padding:"40px",background:"#eae1da",textAlign:"center"}}><h2 style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:400}}>Keep the ones you love.</h2><p>Save your favourite sculpts now. Create a free account to bring your collection across devices.</p><Link href="/account/?from=the-edit" style={{display:"inline-block",background:"#503d34",color:"white",padding:"15px 26px",marginTop:14}}>Create your free account →</Link></section>
<p style={{fontSize:12,color:"#82756d",marginTop:32}}>Editorial commentary and collecting inspiration. We distinguish opinion from verified release information; no invented artist quotes, release dates or event reports.</p>
</main>}