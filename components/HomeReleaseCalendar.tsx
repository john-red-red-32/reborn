import {CalendarDays,Heart} from "lucide-react";
import type {Kit} from "../lib/demo-data";

type DatedEntry={kit:Kit;date:string;dateKind:"shipping"|"release"};
type MonthGroup={key:string;label:string;entries:DatedEntry[]};
type YearGroup={year:string;months:MonthGroup[]};
const validDate=(s?:string)=>!!s&&/^\d{4}-\d{2}(?:-\d{2})?$/.test(s)&&+s.slice(5,7)>=1&&+s.slice(5,7)<=12;
const monthName=(value:string)=>new Intl.DateTimeFormat("en-GB",{month:"long",timeZone:"UTC"}).format(new Date(value.slice(0,7)+"-01T12:00:00Z"));
const dateLabel=(value:string)=>new Intl.DateTimeFormat("en-GB",{day:value.length===7?undefined:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(value.length===7?value+"-01T12:00:00Z":value+"T12:00:00Z"));

/**
 * Fully rendered into static HTML: every year and month is present even without
 * JavaScript. CSS content-visibility:auto defers off-screen painting/layout.
 */
export function createReleaseTimeline(kits:readonly Kit[]):YearGroup[]{
 const events:DatedEntry[]=kits.flatMap(kit=>{
   const date=validDate(kit.ship)?kit.ship!:validDate(kit.launch)?kit.launch!:null;
   return date?[{kit,date,dateKind:date===kit.ship?"shipping" as const:"release" as const}]:[];
 }).sort((a,b)=>b.date.localeCompare(a.date)||a.kit.name.localeCompare(b.kit.name));
 const years=new Map<string,Map<string,DatedEntry[]>>();
 for(const entry of events){
   const year=entry.date.slice(0,4),month=entry.date.slice(0,7);
   if(!years.has(year))years.set(year,new Map());
   const months=years.get(year)!;
   if(!months.has(month))months.set(month,[]);
   months.get(month)!.push(entry);
 }
 return [...years].map(([year,months])=>({year,months:[...months].map(([key,entries])=>({key,label:monthName(key),entries}))}));
}

export default function HomeReleaseCalendar({kits,saved,onToggle}:{kits:readonly Kit[];saved:readonly string[];onToggle:(id:string)=>void}){
 const groups=createReleaseTimeline(kits);
 return <section className="content home-calendar-section" id="release-calendar" aria-labelledby="release-calendar-heading">
   <div className="section-kicker">SCULPT RELEASES — DESIGN PREVIEW</div>
   <div className="section-head home-calendar-head"><div>
     <h2 id="release-calendar-heading">Kit release preview<span className="period">.</span></h2>
     <p>Illustrative launches, pre-orders and shipping dates, organised by month.</p>
   </div><a className="outline-btn" href="/#catalogue">Browse all kits <span aria-hidden="true">↗</span></a></div>
   <p className="calendar-preview-warning">Illustrative design preview only: the kit names, dates and amounts in this section are not verified upcoming releases. The community events above are organiser-sourced; these sample kit dates are not.</p>
   <div className="home-calendar-archive">
     {groups.map(({year,months})=><section className="home-calendar-year" key={year} aria-label={`Releases in ${year}`}>
       <h3 className="home-calendar-year-title">{year}<span>Releases</span></h3>
       {months.map(({key,label,entries})=><section className="home-calendar-month" key={key} aria-label={`${label} ${year}`}>
         <div className="home-calendar-month-head"><h4>{label}</h4><span>{entries.length} {entries.length===1?"sculpt":"sculpts"}</span></div>
         <div className="home-calendar-cards">{entries.map(({kit,date,dateKind})=><article className="home-calendar-card" key={kit.id}>
           <div className="home-calendar-card-main">
             <div><span className="timeline-sculptor">{kit.sculptor}</span><h5>{kit.name}</h5></div>
             <button type="button" className={saved.includes(kit.id)?"heart saved":"heart"} onClick={()=>onToggle(kit.id)} aria-label={saved.includes(kit.id)?`Remove ${kit.name} from watchlist`:`Save ${kit.name} to watchlist`} aria-pressed={saved.includes(kit.id)}><Heart size={19} fill={saved.includes(kit.id)?"currentColor":"none"}/></button>
           </div>
           <div className="home-calendar-event-line"><span className="calendar-event-type"><CalendarDays size={14}/>{dateKind==="shipping"?"Estimated shipping":"Release / pre-order"}</span><time dateTime={date}>{dateLabel(date)}</time></div>
           <div className="home-calendar-card-bottom"><span className={"status "+kit.status.toLowerCase().replaceAll(" ","-")}>{kit.status}</span><div className="home-calendar-financials"><span>Deposit <b>{kit.deposit!==undefined?`£${kit.deposit}`:"TBA"}</b></span><span>Final balance <b>{kit.balance!==undefined?`£${kit.balance}`:"TBA"}</b></span><span>Total <b>{kit.deposit!==undefined&&kit.balance!==undefined?`£${kit.deposit+kit.balance}`:"TBA"}</b></span></div></div>
           {kit.ship&&kit.launch&&dateKind==="shipping"&&<details className="home-calendar-more"><summary>More dates</summary><p>Pre-order / launch: <time dateTime={kit.launch}>{dateLabel(kit.launch)}</time></p></details>}
         </article>)}</div>
       </section>)}
     </section>)}
   </div>
   {!groups.length&&<p className="archive-empty">No dated releases have been documented yet.</p>}
   <p className="archive-foot">Dates and prices can change. Confirm details with the sculptor before placing an order.</p>
 </section>;
}
