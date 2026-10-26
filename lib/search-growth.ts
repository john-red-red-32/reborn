/** Search snippets for factual artist and event discovery.
 * Preserve original names and verified editorial context, never invent seller
 * prices, active stock, ticket availability, paid partnerships or endorsement.
 */
import type {VerifiedArtist,VerifiedKit} from "./real-catalogue";
import type {CommunityEvent} from "./community-events";
import {eventDateLabel} from "./community-events";

function readableSummary(text:string,max=158){
 const normalized=text.replace(/\s+/g," ").trim();
 if(normalized.length<=max)return normalized;
 const prefix=normalized.slice(0,max-1),boundary=prefix.lastIndexOf(" ");
 return prefix.slice(0,boundary>max-35?boundary:max-1).trimEnd()+"…";
}
export function artistSearchSnippet(artist:VerifiedArtist,kits:readonly VerifiedKit[]){
 const name=artist.name;
 const works=kits.filter(item=>item.artistSlug===artist.slug);
 const examples=works.slice(0,3).map(item=>item.name);
 if(artist.slug==="joanna-kazmierczak"){
  return {
   title:"Joanna Kazmierczak Reborn Doll Kits | Reborna",
   description:"Explore original vinyl reborn sculpts by Joanna Kazmierczak, including Willow, Lily, Irys and Charlie. Browse documented kits, photos and retailer sources."
  };
 }
 if(artist.slug==="kristin-englert"){
  return {
   title:"Kristin Englert | Original Silicone Doll Kits | Reborna",
   description:"Discover original silicone baby sculpts by Kristin Englert of Silicone Art Dolls. Browse Cedar, Sydney, Ripley and other documented blank kits."
  };
 }
 const title=`${name} | Original Reborn Sculptor | Reborna`;
 if(!examples.length)return {title,description:readableSummary(`Meet ${name}, original reborn sculptor. Explore an independently researched biography, credited artwork and original artist or retailer references.`)};
 const lead=works.length===1?"original sculpt kit":"original sculpt kits";
 return {title,description:readableSummary(`Discover ${name}'s ${lead}, including ${examples.join(", ")}. Explore source-documented designs, attributed photographs and original seller references.`)};
}
export function eventSearchSnippet(event:CommunityEvent){
 const date=eventDateLabel(event);
 const shortDay=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(event.startDate+"T12:00:00Z"));
 const dateLabel=event.startDate===event.endDate?shortDay:date;
 const base=`${event.name} | ${dateLabel} | Reborna`;
 const fallback=`${event.city} Reborn Doll Show | ${shortDay} | Reborna`;
 const title=base.length<=67?base:fallback;
 const focus=event.focus==="reborn-specific"?"Reborn-focused show":"Doll show with confirmed reborn participation";
 return {title,description:readableSummary(`${focus}: ${event.name}, ${date}, at ${event.venue} in ${event.city}, ${event.country}. See event details and the organiser's official website.`)};
}
