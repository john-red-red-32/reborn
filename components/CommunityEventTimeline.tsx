import Link from "next/link";
import {ArrowRight,CalendarDays,MapPin} from "lucide-react";
import {sortedCommunityEvents,eventDateLabel,eventMonthLabel} from "../lib/community-events";
export default function CommunityEventTimeline(){
 const months=new Map<string,typeof sortedCommunityEvents>();
 for(const event of sortedCommunityEvents){
  const key=event.startDate.slice(0,7);
  if(!months.has(key))months.set(key,[]);
  months.get(key)!.push(event);
 }
 return <section className="rbrn-calendar-events" aria-labelledby="rbrn-event-timeline">
  <div className="rbrn-calendar-events-top"><div><span className="section-kicker">AROUND THE REBORN WORLD</span><h2 id="rbrn-event-timeline">Community events<span className="period">.</span></h2><p>In-person shows with dates confirmed on organisers’ websites.</p></div><Link href="/events/">Explore all events <ArrowRight size={16}/></Link></div>
  <div className="rbrn-timeline-list">
   {[...months.entries()].map(([month,events])=><section key={month} className="rbrn-timeline-month" aria-label={eventMonthLabel(month)}>
    <h3>{eventMonthLabel(month)}<small>{events.length} {events.length===1?"event":"events"}</small></h3>
    {events.map(event=><Link key={event.slug} href={"/events/"+event.slug+"/"} className="rbrn-timeline-entry">
     <div className="rbrn-timeline-date"><CalendarDays size={17}/><time dateTime={event.startDate}>{eventDateLabel(event)}</time></div>
     <div className="rbrn-timeline-name"><strong>{event.name}</strong><span><MapPin size={13}/>{event.city}, {event.country}</span></div>
     <span className="rbrn-timeline-tag">Show / Expo</span><ArrowRight size={18} className="rbrn-timeline-arrow"/>
    </Link>)}
   </section>)}
  </div>
 </section>;
}
