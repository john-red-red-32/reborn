"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Search} from "lucide-react";
import type {VerifiedArtist,VerifiedKit} from "../lib/real-catalogue";
import WishlistHeart from "./WishlistHeart";

export default function SculptorDirectory({artists,kits}:{artists:VerifiedArtist[];kits:VerifiedKit[]}){
 const[term,setTerm]=useState("");
 const found=useMemo(()=>artists.filter(a=>[a.name,a.bio,a.slug].join(" ").toLocaleLowerCase().includes(term.trim().toLocaleLowerCase())),[artists,term]);
 return <><div className="sculptor-directory-tools"><label className="sculptor-directory-search"><Search size={18}/><input aria-label="Search sculptors" placeholder="Search sculptors by name..." value={term} onChange={e=>setTerm(e.target.value)}/></label><span>{found.length} {found.length===1?"sculptor":"sculptors"} in the directory</span></div>
 <div className="artist-directory">{found.map(a=><div className="rbrn-wishlist-wrapper" key={a.slug}><Link className="artist-directory-card" href={`/artists/${a.slug}`}><div className="artist-directory-picture">{a.images?.some(image=>image.role==="portrait"||image.role==="square"||image.role==="banner")?<img src={(a.images.find(image=>image.role==="square")??a.images.find(image=>image.role==="portrait")??a.images.find(image=>image.role==="banner"))!.url} alt={a.images?.some(image=>image.role==="portrait")?`${a.name} portrait from artist source`:`Featured sculpt artwork from ${a.name}’s collection`} loading="lazy"/>:a.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div><span className="section-kicker">INDEPENDENT SCULPTOR</span><h2>{a.name} <ArrowUpRight size={20}/></h2><p>{a.bio}</p><small>{kits.filter(k=>k.artistSlug===a.slug).length} documented sculpt listings</small></div></Link><WishlistHeart item={{type:"artist",path:`/artists/${a.slug}/`,title:a.name,subtitle:"Original sculptor",imageUrl:a.images?.find(image=>image.role==="square"||image.role==="portrait"||image.role==="banner")?.url}}/></div>)}</div>
 {found.length===0&&<div className="sculpt-empty">No matching sculptors. <button onClick={()=>setTerm("")}>Show all sculptors</button></div>}
 <p className="disclaimer">Artist portraits appear only where a sourced photograph is available; otherwise a featured sculpt may illustrate the artist’s work. Inclusion does not imply an artist partnership or endorsement.</p></>
}