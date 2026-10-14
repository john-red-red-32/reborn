import Link from "next/link";
import {ArrowRight,ArrowUpRight,CalendarDays,MapPin} from "lucide-react";
import type {CommunityEvent} from "../lib/community-events";
import {eventDateLabel,eventFocusLabel} from "../lib/community-events";

/** Deliberately illustrated in typography, not unauthorised third-party posters. */
export default function CommunityEventCard({event,compact=false}:{event:CommunityEvent;compact?:boolean}){
 return <article className={"rbrn-event-card"+(compact?" rbrn-event-card-compact":"")}>
  <div className="rbrn-event-card-art" aria-hidden="true">
   <div className="rbrn-event-art-eyebrow">THE REBORNA COMMUNITY EDIT</div>
   <span className="rbrn-event-art-glyph">✳</span>
   <span className="rbrn-event-art-location">{event.city}<small>{event.country.toUpperCase()}</small></span>
   <div className="rbrn-event-art-bottom"><span>{event.startDate.slice(0,4)}</span><span>ART • COMMUNITY • DISCOVERY</span></div>
  </div>
  <div className="rbrn-event-card-copy">
   <div className="rbrn-event-card-label"><span>IN-PERSON SHOW</span><span>ORGANISER-SOURCED</span></div>
   <div className={"rbrn-event-focus rbrn-focus-"+event.focus}><span aria-hidden="true">✳</span> {eventFocusLabel(event)}</div>
   <h3><Link href={"/events/"+event.slug+"/"}>{event.name}</Link></h3>
   <div className="rbrn-event-meta"><span><CalendarDays size={15}/><time dateTime={event.startDate}>{eventDateLabel(event)}</time></span><span><MapPin size={15}/>{event.city}, {event.region}</span></div>
   <p>{event.description}</p>
   <div className="rbrn-event-card-actions"><Link href={"/events/"+event.slug+"/"} className="rbrn-event-details-link">Explore the event <ArrowRight size={16}/></Link><a href={event.officialUrl} target="_blank" rel="noopener noreferrer" className="rbrn-event-external-link">Official website <ArrowUpRight size={15}/></a></div>
  </div>
 </article>;
}
