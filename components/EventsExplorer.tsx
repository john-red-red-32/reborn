"use client";
import {useEffect,useState} from "react";
import {Globe2,MapPin,Search} from "lucide-react";
import type {CommunityEvent} from "../lib/community-events";
import {sortedCommunityEvents} from "../lib/community-events";
import CommunityEventCard from "./CommunityEventCard";

export default function EventsExplorer(){
 const[country,setCountry]=useState("all");
 const[kind,setKind]=useState("all");
 const[today,setToday]=useState<string|null>(null);
 useEffect(()=>setToday(new Date().toISOString().slice(0,10)),[]);
 const options=[...new Set(sortedCommunityEvents.map(event=>event.country))];
 const kinds=[...new Set(sortedCommunityEvents.map(event=>event.kind))];
 const events=sortedCommunityEvents.filter(event=>(!today||event.endDate>=today)&&(country==="all"||event.country===country)&&(kind==="all"||event.kind===kind));
 return <section className="rbrn-events-explorer" aria-label="Explore community events">
  <div className="rbrn-events-controls">
   <div className="rbrn-events-filter-title"><Search size={17}/> Explore upcoming gatherings <span>{events.length} {events.length===1?"event":"events"}</span></div>
   <div className="rbrn-events-selects">
    <label><span><Globe2 size={14}/> Country</span><select value={country} onChange={e=>setCountry(e.target.value)}><option value="all">All countries</option>{options.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
    {kinds.length>1&&<label><span><MapPin size={14}/> Event type</span><select value={kind} onChange={e=>setKind(e.target.value)}><option value="all">All types</option>{kinds.map(value=><option key={value} value={value}>{value==="expo"?"Shows & expos":"Classes"}</option>)}</select></label>}
   </div>
  </div>
  <div className="rbrn-events-grid">{events.map(event=><CommunityEventCard key={event.slug} event={event}/>)}</div>
  {!events.length&&<div className="rbrn-events-empty"><h3>Nothing on the calendar here just yet.</h3><p>Try another country. We only publish events whose dates and venues we can trace to an organiser.</p><button type="button" onClick={()=>{setCountry("all");setKind("all");}}>Show all events</button></div>}
  <p className="rbrn-events-fineprint">Dates and venues were checked against organisers on 14 October 2026 and may change. Always confirm details and tickets with the event organiser. Listings are editorial, not paid placements.</p>
 </section>;
}
