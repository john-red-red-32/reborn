import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,CalendarDays,MapPin,ExternalLink} from "lucide-react";
import {communityEvents,eventDateLabel,eventFocusLabel} from "../../../lib/community-events";
import {eventSearchSnippet} from "../../../lib/search-growth";
import {canonical} from "../../../lib/seo";
import type {CommunityEvent} from "../../../lib/community-events";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return communityEvents.map(event=>({slug:event.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const event=communityEvents.find(item=>item.slug===slug);
 if(!event)return {title:"Event not found | Reborna"};
 const {title,description}=eventSearchSnippet(event);
 return {title,description,alternates:{canonical:"/events/"+slug+"/"},openGraph:{title,description,url:canonical("/events/"+slug+"/")}};
}
function eventJsonLd(event:CommunityEvent){
 return {"@context":"https://schema.org","@type":"Event",
  name:event.name,startDate:event.startDate,endDate:event.endDate,
  eventStatus:"https://schema.org/EventScheduled",eventAttendanceMode:"https://schema.org/OfflineEventAttendanceMode",
  description:event.description,
  location:{"@type":"Place",name:event.venue,address:{"@type":"PostalAddress",streetAddress:event.streetAddress,addressLocality:event.city,addressRegion:event.region,postalCode:event.postalCode,addressCountry:event.countryCode}},
  organizer:{"@type":"Organization",name:event.organiser,url:event.officialUrl},
  url:canonical("/events/"+event.slug+"/"),sameAs:event.officialUrl};
}
export default async function EventDetail({params}:Props){
 const {slug}=await params;
 const event=communityEvents.find(item=>item.slug===slug);
 if(!event)notFound();
 const ld=JSON.stringify(eventJsonLd(event)).replace(/</g,"\\u003c");
 const checkedOn=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(event.verifiedOn+"T12:00:00Z"));
 return <main className="rbrn-event-detail">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:ld}}/>
  <div className="calendar-page-top"><Link href="/events/" className="back-link"><ArrowLeft size={16}/> All events</Link><span><CalendarDays size={16}/> SHOW / EXPO</span></div>
  <section className="rbrn-event-detail-hero"><span className="section-kicker">THE REBORNA COMMUNITY EDIT</span><div className={"rbrn-event-focus rbrn-focus-"+event.focus}><span aria-hidden="true">✳</span> {eventFocusLabel(event)}</div><h1>{event.name}<span className="period">.</span></h1><p>{event.city}, {event.region} · {event.country}</p></section>
  <div className="rbrn-event-detail-layout"><div className="rbrn-event-detail-story">
   <div className="rbrn-event-detail-signet" aria-hidden="true"><span>THE ART OF COMING TOGETHER</span><strong>✳</strong><small>COMMUNITY · CREATIVITY · DISCOVERY</small></div>
   <h2>A little more about the gathering.</h2><p className="rbrn-event-focus-evidence"><strong>What kind of show is this?</strong> {event.focusEvidence}</p><p>{event.description}</p>
   <h3>What to look forward to</h3><ul>{event.highlights.map(item=><li key={item}>{item}</li>)}</ul>
   {event.featuredArtistSlug&&<p className="rbrn-event-artist-link">Artist spotlight: <Link href={"/artists/"+event.featuredArtistSlug+"/"}>Meet Bonnie Brown →</Link></p>}
   <p className="rbrn-event-source">Event details verified {checkedOn} via <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">the organiser's published information <ExternalLink size={13}/></a>. Dates and arrangements may change.</p>
  </div>
  <aside className="rbrn-event-detail-aside" aria-label="Event information">
   <span className="rbrn-event-aside-eyebrow">THE ESSENTIALS</span><div className={"rbrn-event-focus rbrn-focus-"+event.focus}><span aria-hidden="true">✳</span> {eventFocusLabel(event)}</div>
   <div className="rbrn-event-aside-row"><CalendarDays size={20}/><div><small>WHEN</small><strong><time dateTime={event.startDate}>{eventDateLabel(event)}</time></strong></div></div>
   <div className="rbrn-event-aside-row"><MapPin size={20}/><div><small>WHERE</small><strong>{event.venue}</strong><span>{event.streetAddress}<br/>{event.city}, {event.region} {event.postalCode}<br/>{event.country}</span></div></div>
   <div className="rbrn-event-aside-row"><span className="rbrn-event-aside-dot">✳</span><div><small>ORGANISER</small><strong>{event.organiser}</strong></div></div>
   <a href={event.officialUrl} className="rbrn-event-organiser-button" target="_blank" rel="noopener noreferrer">Visit official event site <ArrowUpRight size={18}/></a>
   <p>For tickets and final arrangements, always check directly with the organiser.</p>
  </aside></div>
  <div className="rbrn-event-detail-footer"><Link href="/events/">← All community events</Link><Link href="/calendar/">Explore the Reborn Calendar →</Link></div>
 </main>;
}
