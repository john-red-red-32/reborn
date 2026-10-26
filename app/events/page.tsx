import type {Metadata} from "next";
import T from "../../components/T";
import Link from "next/link";
import {ArrowLeft,CalendarDays,ArrowRight} from "lucide-react";
import EventsExplorer from "../../components/EventsExplorer";
export const metadata:Metadata={
 title:"Reborn Doll Shows & Events | UK, Europe & USA | Reborna",
 description:"Find independently sourced reborn doll shows in Basildon, Orlando, Weißenfels, Spain and beyond. Explore dates, venues, show types and official organiser links.",
 alternates:{canonical:"/events/"}
};
export default function EventsPage(){
 return <main className="rbrn-events-page">
  <div className="calendar-page-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to Discover</Link><span><CalendarDays size={16}/> COMMUNITY EVENTS</span></div>
  <section className="rbrn-events-hero"><div><span className="section-kicker"><T>{"THE REBORNA COMMUNITY EDIT"}</T></span><h1><T>{"Where our world"}</T><br/><em><T>{"comes together."}</T></em></h1><p><T>{"From dedicated reborn conventions to broader doll shows that explicitly welcome reborn artists. Every listing tells you exactly what kind of event to expect."}</T></p><Link className="rbrn-events-hero-link" href="/calendar/"><T>{"View the Reborn Calendar"}</T> <ArrowRight size={17}/></Link></div><div className="rbrn-events-hero-art" aria-hidden="true"><div className="rbrn-events-arch"><span><T>{"GATHERINGS"}</T></span><strong>✳</strong><small><T>{"AN INTERNATIONAL COMMUNITY"}</T><br/><T>{"UNITED BY ART"}</T></small></div></div></section>
  <EventsExplorer/>
 </main>;
}
