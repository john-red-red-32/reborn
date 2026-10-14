import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft,CalendarDays,ArrowRight} from "lucide-react";
import EventsExplorer from "../../components/EventsExplorer";
export const metadata:Metadata={
 title:"Reborn Events Around the World | Reborna",
 description:"Explore independently verified reborn and doll shows in the UK, United States and beyond. Find dates, venues and links directly to event organisers.",
 alternates:{canonical:"/events/"}
};
export default function EventsPage(){
 return <main className="rbrn-events-page">
  <div className="calendar-page-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to Discover</Link><span><CalendarDays size={16}/> COMMUNITY EVENTS</span></div>
  <section className="rbrn-events-hero"><div><span className="section-kicker">THE REBORNA COMMUNITY EDIT</span><h1>Where our world<br/><em>comes together.</em></h1><p>From dedicated reborn conventions to broader doll shows that explicitly welcome reborn artists. Every listing tells you exactly what kind of event to expect.</p><Link className="rbrn-events-hero-link" href="/calendar/">View the Reborn Calendar <ArrowRight size={17}/></Link></div><div className="rbrn-events-hero-art" aria-hidden="true"><div className="rbrn-events-arch"><span>GATHERINGS</span><strong>✳</strong><small>AN INTERNATIONAL COMMUNITY<br/>UNITED BY ART</small></div></div></section>
  <EventsExplorer/>
 </main>;
}
