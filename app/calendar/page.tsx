import type {Metadata} from "next";
import Link from "next/link";
import ReleaseCalendarPage from "../../components/ReleaseCalendarPage";
import {ArrowLeft,CalendarDays} from "lucide-react";
export const metadata:Metadata={title:"Reborn Calendar | Reborna",description:"Explore verified international reborn doll shows and preview sculpt release dates. Real-world events and illustrative kit dates are clearly distinguished.",robots:{index:false,follow:false}};
export default function CalendarPage(){
 return <main className="calendar-standalone"><div className="calendar-page-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to Discover</Link><span><CalendarDays size={16}/> REBORN CALENDAR</span></div><ReleaseCalendarPage/></main>;
}
