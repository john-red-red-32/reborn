"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowUpRight,Search} from "lucide-react";
import {cassieArchive} from "../lib/cassie-profile";
import type {VerifiedKit} from "../lib/real-catalogue";
const categories=["All remaining sculpts","Search archive"] as const;
export default function CassieArchive({kits}:{kits:VerifiedKit[]}){
 const[query,setQuery]=useState("");const[category,setCategory]=useState<(typeof categories)[number]>("All remaining sculpts");
 const items=useMemo(()=>cassieArchive.filter(name=>!kits.some(k=>k.name.toLowerCase()===name.toLowerCase())).filter(name=>name.toLowerCase().includes(query.trim().toLowerCase())),[kits,query]);
 return <section className="cassie-archive"><div className="archive-heading"><div><span className="section-kicker">THE REST OF THE COLLECTION</span><h2>Browse the sculpt archive<span className="period">.</span></h2><p>Explore Cassie's other original sculpt designs, including older editions. Detailed listings pictured above are not repeated here. Availability for these archive entries is not yet verified.</p></div><span className="archive-count">{items.length} additional designs</span></div><div className="archive-tools"><label className="archive-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the collection..." aria-label="Search Cassie's sculpt archive"/></label></div><div className="archive-grid">{items.map(name=>{const matched=kits.find(k=>k.name.toLowerCase()===name.toLowerCase());return matched?<Link key={name} href={`/kits/${matched.slug}`} className="archive-item"><strong>{name}</strong><span>View sculpt <ArrowUpRight size={14}/></span></Link>:<div key={name} className="archive-item"><strong>{name}</strong><small>From the sculpt archive</small></div>})}</div>{items.length===0&&<p className="archive-empty">No matching sculpts. Try another search.</p>}<p className="archive-foot">Sculpt names: <a href="https://www.cassielove.co.uk/" target="_blank" rel="noopener noreferrer">Cassie Ann Love's official catalogue ↗</a>. This archive is not a stock or sales listing.</p></section>
}