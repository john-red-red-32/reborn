"use client";
import Link from "next/link";
import {Heart,ArrowRight,ArrowUpRight,Bookmark,Package,Users} from "lucide-react";
import {useMemo,useState} from "react";
import {useWishlist,type SavedItem} from "./WishlistProvider";
import WishlistHeart from "./WishlistHeart";
import styles from "../app/collection/collection.module.css";
type Recommendation={slug:string;name:string;artistSlug:string;artistName:string;photoUrl?:string};
type ArtistRecommendation={slug:string;name:string};
type Filter="all"|"wishlist"|"owned"|"kit"|"artist"|"material";
const filters:{id:Filter;label:string}[]=[{id:"all",label:"Everything"},{id:"wishlist",label:"Wishlist"},{id:"owned",label:"I own these"},{id:"kit",label:"Original kits"},{id:"artist",label:"Following"},{id:"material",label:"Materials"}];
export default function CollectionShowcase({suggestions,artists}:{suggestions:Recommendation[];artists:ArtistRecommendation[]}){
 const {items,state,remove,updateStatus}=useWishlist();
 const [filter,setFilter]=useState<Filter>("all");
 const owned=items.filter(x=>x.collectionStatus==="owned").length;
 const following=items.filter(x=>x.type==="artist").length;
 const shown=useMemo(()=>items.filter(x=>filter==="all"||filter==="wishlist"&&x.collectionStatus!=="owned"||filter==="owned"&&x.collectionStatus==="owned"||x.type===filter),[filter,items]);
 const member=state==="member";
 return <main className={styles.shell}>
  <header className={styles.hero}><div><div className={styles.kicker}>YOUR OWN LITTLE CORNER OF REBORNA</div>
   <h1>My collection.<br/><em>My obsession.</em></h1>
   <p>Save original sculpts, follow your favourite artists and keep your dream projects close. There's no pressure to buy anything — this is where your excellent taste lives.</p></div>
   <div className={styles.summary}><strong>{items.length}</strong><span>{items.length===1?"saved favourite":"saved favourites"}</span></div>
  </header>
  <div className={styles.counts} aria-live="polite"><span><Heart size={13}/> {items.length-owned} on your wishlist</span><span><Package size={13}/> {owned} owned</span><span><Users size={13}/> {following} artists followed</span></div>
  {state==="loading"?<div className={styles.empty}><h2>Getting your favourites ready…</h2></div>:<>
   {items.length>0&&<><div className={styles.tabs} role="group" aria-label="Filter your saved collection">{filters.map(x=><button key={x.id} type="button" aria-pressed={filter===x.id} onClick={()=>setFilter(x.id)}>{x.label}</button>)}</div>
    {shown.length?<div className={styles.grid}>{shown.map(item=><article className={styles.card} key={item.path}>
     <Link href={item.path} className={styles.photo}>{item.imageUrl?<img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async"/>:<span className={styles.placeholder}>{item.title[0]}</span>}</Link>
     <div className={styles.details}><span className={styles.kicker}>{item.type==="artist"?"FOLLOWING ARTIST":item.type==="kit"?"ORIGINAL SCULPT":item.type==="material"?"MATERIAL":"SAVED DISCOVERY"}</span>
      <h3><Link href={item.path}>{item.title}</Link></h3><p>{item.subtitle||"Saved on Reborna"}</p>
      <div className={styles.actions}>{item.type!=="artist"?<button type="button" onClick={()=>void updateStatus(item,item.collectionStatus==="owned"?"wishlist":"owned")}>{item.collectionStatus==="owned"?"✓ Owned · change":"+ Mark as owned"}</button>:<span style={{fontSize:12,color:"#7b685a"}}>Following</span>}<button type="button" aria-label={"Remove "+item.title} onClick={()=>void remove(item)}>Remove</button></div>
     </div></article>)}</div>:<div className={styles.empty}><h2>Not in this chapter yet.</h2><p>Your other saved favourites are still here. Try a different filter.</p><button onClick={()=>setFilter("all")} type="button">Show everything</button></div>}
    </>}
   {!items.length&&<div className={styles.empty}><Heart size={31}/><h2>A blank page. Delicious possibilities.</h2><p>Tap a heart on any sculpt, artist or material and it will appear here. You don't need an account to start collecting.</p><Link href="/#catalogue" className={styles.primary}>Find your first favourite <ArrowRight size={17}/></Link></div>}
   <section className={styles.panel}><div><span className={styles.kicker}>{member?"YOUR COLLECTION IS SYNCED":"KEEP YOUR FAVOURITES FOREVER"}</span>
    <h2>{member?"Your saved collection travels with you.":"Don't leave your favourites stranded in one browser."}</h2>
    <p>{member?"Your favourites are saved to your Reborna account. You can also visit your member dashboard for studio projects, messages and selling tools.":"Your hearts are saved on this device right now. Make a free Reborna account and we'll bring them along when you sign in — so your favourite sculpts are still yours on your next device."}</p>
    {state==="unavailable"&&<p role="status">Account synchronisation is temporarily unavailable; favourites saved here stay on this device until it returns.</p>}</div>
    <div className={styles.panelActions}>{member?<Link href="/dashboard/?area=collection" className={styles.primary}>My member dashboard <ArrowUpRight size={16}/></Link>:<Link href="/account/?from=collection" className={styles.primary}>Create my free account <ArrowRight size={16}/></Link>}
     <Link href="/the-edit/">Read The Edit</Link></div>
   </section>
  </>}
  <section className={styles.recs}><span className={styles.kicker}>A LITTLE FRESH INSPIRATION</span><h2>Something else might catch your eye.</h2><p>Discover credited original kits and artists. The little heart is all yours.</p>
   <div className={styles.recGrid}>{suggestions.filter(s=>!items.some(x=>x.path==="/kits/"+s.slug+"/")).slice(0,4).map(kit=><div className={styles.recCard} key={kit.slug}>
    <small>ORIGINAL SCULPT · {kit.artistName}</small><Link href={"/kits/"+kit.slug+"/"}>{kit.name} <ArrowUpRight size={15}/></Link>
    <div><WishlistHeart placement="inline" item={{type:"kit",path:"/kits/"+kit.slug+"/",title:kit.name,subtitle:kit.artistName,imageUrl:kit.photoUrl}}/></div>
   </div>)}</div>
   <h2 style={{marginTop:55,fontSize:32}}>Artists worth following.</h2>
   <div className={styles.recGrid}>{artists.filter(a=>!items.some(x=>x.path==="/artists/"+a.slug+"/")).slice(0,4).map(a=><div className={styles.recCard} key={a.slug}>
    <small>ORIGINAL SCULPTOR</small><Link href={"/artists/"+a.slug+"/"}>{a.name} <ArrowUpRight size={15}/></Link>
    <div><WishlistHeart placement="inline" item={{type:"artist",path:"/artists/"+a.slug+"/",title:a.name,subtitle:"Original sculptor"}}/></div>
   </div>)}</div>
  </section>
 </main>;
}
