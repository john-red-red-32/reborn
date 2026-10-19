"use client";
import {useEffect,useState} from "react";
import {Globe2,MapPin,Search} from "lucide-react";
import type {CommunityEvent} from "../lib/community-events";
import {sortedCommunityEvents} from "../lib/community-events";
import CommunityEventCard from "./CommunityEventCard";
import {useShopLocale} from "./LocaleProvider";

export default function EventsExplorer(){
 const{t}=useShopLocale();
 const[country,setCountry]=useState("all");
 const[kind,setKind]=useState("all");
 const[focus,setFocus]=useState("all");
 const[today,setToday]=useState<string|null>(null);
 useEffect(()=>setToday(new Date().toISOString().slice(0,10)),[]);
 const options=[...new Set(sortedCommunityEvents.map(event=>event.country))];
 const kinds=[...new Set(sortedCommunityEvents.map(event=>event.kind))];
 const events=sortedCommunityEvents.filter(event=>(!today||event.endDate>=today)&&(country==="all"||event.country===country)&&(kind==="all"||event.kind===kind)&&(focus==="all"||event.focus===focus));
 return <section className="rbrn-events-explorer" aria-label={t("Explore community events")}>
  <div className="rbrn-events-explainer"><div className="rbrn-event-focus rbrn-focus-reborn-specific"><span aria-hidden="true">✳</span> Reborn-specific event</div><span>{t("The show focuses on reborn and silicone doll artistry.")}</span><div className="rbrn-event-focus rbrn-focus-includes-reborns"><span aria-hidden="true">✳</span> Event includes reborns</div><span>{t("A wider doll show with confirmed reborn participation.")}</span></div>
  <div className="rbrn-events-controls">
   <div className="rbrn-events-filter-title"><Search size={17}/> Explore upcoming gatherings <span>{events.length} {t(events.length===1?"event":"events")}</span></div>
   <div className="rbrn-events-selects">
    <label><span><Globe2 size={14}/> Country</span><select value={country} onChange={e=>setCountry(e.target.value)}><option value="all">{t("All countries")}</option>{options.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
    <label><span><MapPin size={14}/> Reborn focus</span><select value={focus} onChange={e=>setFocus(e.target.value)}><option value="all">{t("All confirmed")}</option><option value="reborn-specific">{t("Reborn-specific only")}</option><option value="includes-reborns">{t("Includes reborns")}</option></select></label>
    {kinds.length>1&&<label><span><MapPin size={14}/> Event type</span><select value={kind} onChange={e=>setKind(e.target.value)}><option value="all">{t("All types")}</option>{kinds.map(value=><option key={value} value={value}>{value==="expo"?"Shows & expos":"Classes"}</option>)}</select></label>}
   </div>
  </div>
  <div className="rbrn-events-grid">{events.map(event=><CommunityEventCard key={event.slug} event={event}/>)}</div>
  {!events.length&&<div className="rbrn-events-empty"><h3>{t("Nothing on the calendar here just yet.")}</h3><p>{t("Try another country. We only publish events whose dates and venues we can trace to an organiser.")}</p><button type="button" onClick={()=>{setCountry("all");setKind("all");setFocus("all");}}>{t("Show all events")}</button></div>}
  <p className="rbrn-events-fineprint">{t("Dates and venues were checked against organisers on 14 October 2026 and may change. Always confirm details and tickets with the event organiser. Listings are editorial, not paid placements.")}</p>
 </section>;
}
