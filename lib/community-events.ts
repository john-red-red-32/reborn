/** Organiser-sourced community events. Each event has its own source and last-verified date; see verifiedOn.
 * No speculative dates, artist participation or affiliate relationships.
 * Shared source for the Events directory, event detail pages and Reborn Calendar.
 */
export type CommunityEvent={
 slug:string; name:string; kind:"expo"|"class"; focus:"reborn-specific"|"includes-reborns"; focusEvidence:string; startDate:string; endDate:string;
 country:"United Kingdom"|"United States"|"Spain"|"Germany"; countryCode:"GB"|"US"|"ES"|"DE";
 city:string; region:string; venue:string; streetAddress:string; postalCode:string;
 organiser:string; officialUrl:string; sourceUrl:string; description:string;
 highlights:readonly string[]; verifiedOn:string; featuredArtistSlug?:string;
};
export const communityEvents:readonly CommunityEvent[]=[
 {
  slug:"weissenfels-reborn-event-2027",name:"4. Reborn-Event Weißenfels",kind:"expo",
  focus:"reborn-specific",
  focusEvidence:"The city of Weißenfels describes an event dedicated specifically to realistic reborn baby doll art, featuring artists' work and demonstrations of painting, rooting and fine sculpt detail.",
  startDate:"2027-03-06",endDate:"2027-03-07",country:"Germany",countryCode:"DE",
  city:"Weißenfels",region:"Saxony-Anhalt",venue:"Kulturhaus Weißenfels",
  streetAddress:"Merseburger Straße 14",postalCode:"06667",organiser:"Kulturamt Weißenfels",
  officialUrl:"https://weissenfels.de/Kurzmen%C3%BC/4-REBORN-EVENT.php?FID=3720.260314.1&La=1&ModID=11&NavID=3678.7&object=tx%2C3720.4.1",
  sourceUrl:"https://weissenfels-erlebnis.de/Entdecken-/Veranstaltungen/4-REBORN-EVENT.php?FID=3720.260315.1&ModID=11",
  description:"The city of Weißenfels hosts its fourth Reborn-Event at the Kulturhaus on 6–7 March 2027. Collectors can meet reborn doll artists, see their detailed creations and learn about painting, hair rooting and the techniques used to create lifelike baby dolls.",
  highlights:["Saturday 6 March: 10:00–17:00; Sunday 7 March: 10:00–16:00","Reborn baby doll artistry and hands-on demonstrations","Tickets available through the municipal organiser's advertised sales channels"],
  verifiedOn:"2026-10-26"
 },
 {
  slug:"muval-valencia-2026",name:"MUVAL — Salón de Muñecas y Coleccionismo",kind:"expo",
  focus:"includes-reborns",focusEvidence:"The organiser explicitly lists reborn art alongside Blythe, OOAK, vintage dolls, miniatures, bears and other collectibles. This is a mixed doll show, not a reborn-only expo.",
  startDate:"2026-10-31",endDate:"2026-11-01",country:"Spain",countryCode:"ES",
  city:"Valencia",region:"Valencian Community",venue:"Hotel Primus Valencia",streetAddress:"Calle Menorca, 22",postalCode:"46023",organiser:"MUVAL",
  officialUrl:"https://www.muval.art/index.html",sourceUrl:"https://www.muval.art/faq.html",
  description:"An art-doll and collecting show in Valencia that explicitly includes reborn doll artistry alongside Blythe, OOAK, vintage dolls, bears and miniatures. Reborns are part of this wider programme, not its sole focus. Free admission.",
  highlights:["Mixed doll show that includes reborn artists","Also features Blythe, OOAK, antiques and miniatures","Free admission, 31 October–1 November 2026"],
  verifiedOn:"2026-10-14"
 },
 {
  slug:"yophi-doll-show-2026",focus:"reborn-specific",focusEvidence:"The organiser's official programme includes original reborn sculpting, vinyl and silicone painting, rooting and classes.",name:"Yophi Doll Show",kind:"expo",
  startDate:"2026-11-14",endDate:"2026-11-15",country:"United States",countryCode:"US",
  city:"Orlando",region:"Florida",venue:"Avanti Palms Resort and Conference Center",
  streetAddress:"6515 International Drive",postalCode:"32819",organiser:"Yophi Doll Show",
  officialUrl:"https://www.yophidollshow.com/",sourceUrl:"https://www.yophidollshow.com/faq",
  description:"An Orlando gathering for reborn doll artists, exhibitors and collectors, with show-floor displays and community celebrations. The organiser separately schedules masterclasses in the days preceding the show.",
  highlights:["Reborn artistry and doll exhibits","Exhibitors and collector community","Show days: 14–15 November"],
  verifiedOn:"2026-10-14"
 },
 {
  slug:"the-doll-show-basildon-2026",focus:"reborn-specific",focusEvidence:"The organiser explicitly describes its UK events as reborn doll shows.",name:"The Doll Show — Basildon",kind:"expo",
  startDate:"2026-11-22",endDate:"2026-11-22",country:"United Kingdom",countryCode:"GB",
  city:"Basildon",region:"Essex",venue:"Holiday Inn Basildon",
  streetAddress:"Festival Leisure Park, Waterfront Walk",postalCode:"SS14 3DG",organiser:"The Doll Show",
  officialUrl:"https://www.thedollshow.co.uk/event-details/basildon-22nd-november-2026",
  sourceUrl:"https://www.thedollshow.co.uk/event-details/basildon-22nd-november-2026",
  description:"A UK doll show bringing collectors and makers together in Basildon. The organiser lists public admission on Sunday 22 November 2026, from 10:30 to 16:30 GMT, with earlier VIP entry.",
  highlights:["In-person UK doll show","Collector and exhibitor tables","Public hours: 10:30–16:30 GMT"],
  verifiedOn:"2026-10-14"
 },
 {
  slug:"west-coast-doll-show-2027",focus:"reborn-specific",focusEvidence:"The organiser describes this event as a celebration of reborn doll artistry and craftsmanship.",name:"West Coast Doll Show",kind:"expo",
  startDate:"2027-03-06",endDate:"2027-03-07",country:"United States",countryCode:"US",
  city:"Ontario",region:"California",venue:"DoubleTree by Hilton Ontario Airport",
  streetAddress:"222 North Vineyard Avenue",postalCode:"91764",organiser:"West Coast Doll Show",
  officialUrl:"https://www.westcoastdollshow.com/",
  sourceUrl:"https://www.westcoastdollshow.com/attendees",
  description:"A reborn doll and art-doll celebration with artists, collectors, vendors and demonstrations. The organiser has announced original sculptor Bonnie Brown as an honoured guest for its 2027 edition.",
  highlights:["Reborn and silicone doll artists","Live demonstrations and vendors","Bonnie Brown — announced honoured guest"],
  verifiedOn:"2026-10-14",featuredArtistSlug:"bonnie-brown"
 },
 {
  slug:"kansas-doll-show-2027",focus:"reborn-specific",focusEvidence:"The organiser explicitly describes the show as a celebration of reborn and silicone doll artistry.",name:"Kansas Doll Show",kind:"expo",
  startDate:"2027-09-04",endDate:"2027-09-05",country:"United States",countryCode:"US",
  city:"Wichita",region:"Kansas",venue:"DoubleTree by Hilton Wichita Airport",
  streetAddress:"2098 Airport Road",postalCode:"67209",organiser:"Kansas Doll Show",
  officialUrl:"https://www.kansasdollshow.com/",
  sourceUrl:"https://www.kansasdollshow.com/",
  description:"The tenth annual Kansas Doll Show brings reborn and silicone doll enthusiasts, artists, vendors and collectors together for a weekend in Wichita.",
  highlights:["Tenth-anniversary event","Artist and vendor exhibits","Collectors and doll-making community"],
  verifiedOn:"2026-10-14"
 }
];
/** The event's confirmed focus, not an assumption based on its name. */
export function eventFocusLabel(event:Pick<CommunityEvent,"focus">){
 return event.focus==="reborn-specific"?"Reborn-specific event":"Event includes reborns";
}
export const sortedCommunityEvents=[...communityEvents].sort((a,b)=>a.startDate.localeCompare(b.startDate));
export function eventDateLabel(event:CommunityEvent):string{
 const start=new Date(event.startDate+"T12:00:00Z");
 const end=new Date(event.endDate+"T12:00:00Z");
 const fmt=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
 if(event.startDate===event.endDate)return fmt.format(start);
 if(event.startDate.slice(0,7)===event.endDate.slice(0,7)){
  const m=new Intl.DateTimeFormat("en-GB",{month:"short",timeZone:"UTC"}).format(start);
  return String(start.getUTCDate())+"–"+String(end.getUTCDate())+" "+m+" "+start.getUTCFullYear();
 }
 return fmt.format(start)+" – "+fmt.format(end);
}
export function eventMonthLabel(isoDate:string){
 return new Intl.DateTimeFormat("en-GB",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(isoDate.slice(0,7)+"-01T12:00:00Z"));
}
