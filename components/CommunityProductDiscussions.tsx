"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowRight,MessageCircle} from "lucide-react";
import {communityApi,dateLabel,type CommunityPost} from "../lib/community";
export default function CommunityProductDiscussions({path,title}:{path:string;title:string}){
 const[posts,setPosts]=useState<CommunityPost[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{communityApi<{posts:CommunityPost[]}>("posts?product="+encodeURIComponent(path)).then(r=>setPosts(r.posts.slice(0,6))).catch(()=>{}).finally(()=>setLoading(false))},[path]);
 return <section className="rbrn-product-community" aria-labelledby="rbrn-product-community-title"><div className="rbrn-product-community-heading"><div><span className="section-kicker">INDEPENDENT COMMUNITY</span><h2 id="rbrn-product-community-title">What people are saying<span className="period">.</span></h2><p>Discussions from the Reborna community, linked to this exact product. We don't edit opinions to favour suppliers.</p></div><Link href={"/community/new/?product="+encodeURIComponent(path)}>Start a conversation <ArrowRight size={16}/></Link></div>
 {posts.length?<div className="rbrn-product-community-grid">{posts.map(p=><Link key={p.id} href={"/community/discussion/?id="+encodeURIComponent(p.id)}><span>{p.is_editorial?"REBORNA EDITORIAL":"@"+p.handle} · {dateLabel(p.created_at)}</span><strong>{p.title}</strong><small><MessageCircle size={13}/> {p.reply_count} replies</small></Link>)}</div>:!loading?<div className="rbrn-product-community-empty"><MessageCircle size={20}/><p>No discussion linked to <strong>{title}</strong> yet. Be the first to ask a question or share an experience.</p><Link href={"/community/new/?product="+encodeURIComponent(path)}>Discuss this product <ArrowRight size={14}/></Link></div>:<p className="rbrn-community-muted">Looking for related discussions…</p>}
 </section>
}
