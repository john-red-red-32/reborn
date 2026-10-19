"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {CalendarDays,ArrowUpRight} from "lucide-react";
import {kits} from "../lib/demo-data";
import {sortedCommunityEvents} from "../lib/community-events";
import HomeReleaseCalendar from "./HomeReleaseCalendar";
import {useShopLocale} from "./LocaleProvider";

/** Focused on kit releases; confirmed reborn-focused events are an optional layer. */
export default function ReleaseCalendarPage(){
 const{t}=useShopLocale();
 const[includeEvents,setIncludeEvents]=useState(false);
 const[saved,setSaved]=useState<string[]>([]);
 const relevantEvents=sortedCommunityEvents.filter(event=>event.focus==="reborn-specific");
 useEffect(()=>{try{const values=JSON.parse(localStorage.getItem("reborn-watches")||"[]");if(Array.isArray(values))setSaved(values.filter(v=>typeof v==="string"));}catch{}},[]);
 function toggle(id:string){setSaved(current=>{const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];try{localStorage.setItem("reborn-watches",JSON.stringify(next))}catch{}return next})}
 return <>
  <div className="rbrn-calendar-header">
   <span className="section-kicker">{t("ORIGINAL SCULPTS / LAUNCHES / PRE-ORDERS")}</span>
   <h1>{t("The Reborn Calendar")}<span className="period">.</span></h1>
   <p>{t("Follow sculptors and their kit releases in one place. Add confirmed reborn shows whenever you'd like to see community events alongside them.")}</p>
   <div className="rbrn-calendar-display-options">
    <span className="rbrn-calendar-display-default"><CalendarDays size={16}/> <strong>{t("Kit releases")}</strong> <small>{t("Always shown")}</small></span>
    <label className="rbrn-calendar-event-toggle">
      <input type="checkbox" checked={includeEvents} onChange={e=>setIncludeEvents(e.target.checked)}/>
      <span className="rbrn-calendar-toggle-track" aria-hidden="true"/>
      <span><strong>{t("Include reborn shows")}</strong><small>{relevantEvents.length} {t("confirmed, reborn-specific events")}</small></span>
    </label>
    <Link href="/events/">{t("All events")} <ArrowUpRight size={15}/></Link>
   </div>
  </div>
  <HomeReleaseCalendar kits={kits} saved={saved} onToggle={toggle} events={includeEvents?relevantEvents:[]}/>
 </>;
}
