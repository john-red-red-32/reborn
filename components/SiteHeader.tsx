"use client";
import Link from "next/link";
import {useState} from "react";
import {Menu,X} from "lucide-react";
export default function SiteHeader(){const[open,setOpen]=useState(false);return <header className="inner-header"><Link href="/" className="logo">reborn<span className="logo-mark">✳</span></Link><nav className={open?"inner-nav open":"inner-nav"}><Link href="/" onClick={()=>setOpen(false)}>Discover</Link><Link href="/real-kits" onClick={()=>setOpen(false)}>Sculpt catalogue</Link><Link href="/artists" onClick={()=>setOpen(false)}>Meet the artists</Link></nav><span className="inner-header-caption">INDEPENDENT SCULPT MARKETPLACE</span><button className="inner-menu" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>}