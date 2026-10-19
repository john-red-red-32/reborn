import type {Metadata} from "next";
import T from "../../components/T";
import Link from "next/link";
import ReleaseCalendarPage from "../../components/ReleaseCalendarPage";
import {ArrowLeft,CalendarDays} from "lucide-react";
export const metadata:Metadata={title:"Reborn Calendar | Reborna",description:"Explore sculptor kit release previews with the option to include verified, reborn-specific community shows in the same calendar. Sample release dates are illustrative.",robots:{index:false,follow:false}};
export default function CalendarPage(){
 return <main className="calendar-standalone"><div className="calendar-page-top"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to Discover</Link><span><CalendarDays size={16}/> REBORN CALENDAR</span></div><ReleaseCalendarPage/></main>;
}
