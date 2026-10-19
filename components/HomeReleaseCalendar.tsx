"use client";
import Link from "next/link";
import {ArrowRight,CalendarDays,Heart,MapPin} from "lucide-react";
import type {Kit} from "../lib/demo-data";
import type {CommunityEvent} from "../lib/community-events";
import {eventDateLabel,eventFocusLabel} from "../lib/community-events";
import {displayMoney,useShopLocale} from "./LocaleProvider";

type KitEntry={kind:"kit";kit:Kit;date:string;dateKind:"shipping"|"release"};
type ShowEntry={kind:"show";event:CommunityEvent;date:string};
type Entry=KitEntry|ShowEntry;
type MonthGroup={key:string;label:string;entries:Entry[]};
type YearGroup={year:string;months:MonthGroup[]};
const validDate=(s?:string)=>!!s&&/^\d{4}-\d{2}(?:-\d{2})?$/.test(s)&&+s.slice(5,7)>=1&&+s.slice(5,7)<=12;
const monthName=(value:string)=>new Intl.DateTimeFormat("en-GB",{month:"long",timeZone:"UTC"}).format(new Date(value.slice(0,7)+"-01T12:00:00Z"));
const dateLabel=(value:string)=>new Intl.DateTimeFormat("en-GB",{day:value.length===7?undefined:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(value.length===7?value+"-01T12:00:00Z":value+"T12:00:00Z"));

/** Mixed chronological release+show timeline; show dates are sourced, kit examples illustrative. */
export function createReleaseTimeline(kits:readonly Kit[],events:readonly CommunityEvent[]=[]):YearGroup[]{
 const releases:Entry[]=kits.flatMap(kit=>{
  const date=validDate(kit.ship)?kit.ship!:validDate(kit.launch)?kit.launch!:null;
  return date?[{kind:"kit" as const,kit,date,dateKind:date===kit.ship?"shipping" as const:"release" as const}]:[];
 });
 const shows:Entry[]=events.filter(event=>event.focus==="reborn-specific"&&validDate(event.startDate)).map(event=>({kind:"show",event,date:event.startDate}));
 const entries=[...releases,...shows].sort((a,b)=>b.date.localeCompare(a.date)||a.kind.localeCompare(b.kind));
 const years=new Map<string,Map<string,Entry[]>>();
 for(const entry of entries){
  const year=entry.date.slice(0,4),month=entry.date.slice(0,7);
  if(!years.has(year))years.set(year,new Map());
  const months=years.get(year)!;
  if(!months.has(month))months.set(month,[]);
  months.get(month)!.push(entry);
 }
 return [...years].map(([year,months])=>({year,months:[...months].map(([key,monthEntries])=>({key,label:monthName(key),entries:monthEntries}))}));
}
export default function HomeReleaseCalendar({kits,saved,onToggle,events=[]}:{kits:readonly Kit[];saved:readonly string[];onToggle:(id:string)=>void;events?:readonly CommunityEvent[]}){
 const groups=createReleaseTimeline(kits,events);
 const {currency,fx,locale}=useShopLocale();
 const examplePrice=(amount?:number)=>{
  if(amount===undefined)return "TBA";
  const formatted=displayMoney(amount,"GBP",currency,fx,locale);
  return (formatted.converted?"≈ ":"")+formatted.text;
 };
 return <section className="content home-calendar-section" id="release-calendar" aria-labelledby="release-calendar-heading">
   <div className="section-kicker">SCULPT RELEASES — DESIGN PREVIEW</div>
   <div className="section-head home-calendar-head"><div>
     <h2 id="release-calendar-heading">Kit release calendar<span className="period">.</span></h2>
     <p>{events.length?"Kit releases and selected reborn shows, together in one chronological calendar.":"Sculptor launches, pre-orders and shipping dates, organised by month."}</p>
   </div><a className="outline-btn" href="/real-kits/">Browse original kits <span aria-hidden="true">↗</span></a></div>
   <p className="calendar-preview-warning">Design preview: the kit names, dates and amounts in this section are illustrative examples only, not verified releases. {events.length?"Events labelled “Confirmed show” are sourced from event organisers; sample kit dates are not.": "Confirmed events can be added using the “Include reborn shows” option above."}</p>
   <div className="home-calendar-archive">
     {groups.map(({year,months})=><section className="home-calendar-year" key={year} aria-label={"Releases and events in "+year}>
       <h3 className="home-calendar-year-title">{year}<span>Calendar</span></h3>
       {months.map(({key,label,entries})=><section className="home-calendar-month" key={key} aria-label={label+" "+year}>
         <div className="home-calendar-month-head"><h4>{label}</h4><span>{entries.length} {entries.length===1?"entry":"entries"}</span></div>
         <div className="home-calendar-cards">{entries.map(entry=>entry.kind==="kit"?<article className="home-calendar-card" key={"kit-"+entry.kit.id}>
           <div className="home-calendar-card-main">
             <div><span className="timeline-sculptor">{entry.kit.sculptor}</span><h5>{entry.kit.name}</h5></div>
             <button type="button" className={saved.includes(entry.kit.id)?"heart saved":"heart"} onClick={()=>onToggle(entry.kit.id)} aria-label={saved.includes(entry.kit.id)?"Remove "+entry.kit.name+" from watchlist":"Save "+entry.kit.name+" to watchlist"} aria-pressed={saved.includes(entry.kit.id)}><Heart size={19} fill={saved.includes(entry.kit.id)?"currentColor":"none"}/></button>
           </div>
           <div className="home-calendar-event-line"><span className="calendar-event-type"><CalendarDays size={14}/>{entry.dateKind==="shipping"?"Estimated shipping":"Release / pre-order"}</span><time dateTime={entry.date}>{dateLabel(entry.date)}</time></div>
           <div className="home-calendar-card-bottom"><span className={"status "+entry.kit.status.toLowerCase().replaceAll(" ","-")}>{entry.kit.status}</span><div className="home-calendar-financials"><span>Deposit <b>{examplePrice(entry.kit.deposit)}</b></span><span>Final balance <b>{examplePrice(entry.kit.balance)}</b></span><span>Total <b>{examplePrice(entry.kit.deposit!==undefined&&entry.kit.balance!==undefined?entry.kit.deposit+entry.kit.balance:undefined)}</b></span></div></div>
           {entry.kit.ship&&entry.kit.launch&&entry.dateKind==="shipping"&&<details className="home-calendar-more"><summary>More dates</summary><p>Pre-order / launch: <time dateTime={entry.kit.launch}>{dateLabel(entry.kit.launch)}</time></p></details>}
         </article>:<article className="home-calendar-card rbrn-calendar-inline-show" key={"show-"+entry.event.slug}>
           <div className="rbrn-calendar-inline-label"><CalendarDays size={15}/> Confirmed show <span>REBORNS</span></div>
           <div className="home-calendar-card-main"><div><span className="timeline-sculptor">{eventFocusLabel(entry.event)}</span><h5><Link href={"/events/"+entry.event.slug+"/"}>{entry.event.name}</Link></h5></div></div>
           <div className="home-calendar-event-line"><span className="calendar-event-type"><MapPin size={14}/>{entry.event.city}, {entry.event.country}</span><time dateTime={entry.event.startDate}>{eventDateLabel(entry.event)}</time></div>
           <Link className="rbrn-calendar-event-link" href={"/events/"+entry.event.slug+"/"}>Event details <ArrowRight size={15}/></Link>
         </article>)}</div>
       </section>)}
     </section>)}
   </div>
   {!groups.length&&<p className="archive-empty">No dated releases have been documented yet.</p>}
   <p className="archive-foot">Always confirm release dates and prices with sculptors and show details with organisers.</p>
 </section>;
}
