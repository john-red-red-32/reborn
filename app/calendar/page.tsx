import type {Metadata} from "next";
import Link from "next/link";
import ReleaseCalendarPage from "../../components/ReleaseCalendarPage";
import {ArrowLeft,CalendarDays} from "lucide-react";
export const metadata:Metadata={title:"Release Calendar | Reborna",description:"Explore reborn sculpt releases, pre-orders and estimated shipping dates by month. Illustrated preview entries are clearly identified.",robots:{index:false,follow:false}};
export default function CalendarPage(){
 return <main className="calendar-standalone"><div className="calendar-page-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to Discover</Link><span><CalendarDays size={16}/> RELEASE CALENDAR</span></div><ReleaseCalendarPage/></main>;
}
