"use client";
import {useEffect,useState} from "react";
import {kits} from "../lib/demo-data";
import HomeReleaseCalendar from "./HomeReleaseCalendar";
import CommunityEventTimeline from "./CommunityEventTimeline";

type CalendarFilter="all"|"kits"|"events";
/** Real organiser-sourced shows are separate from illustrative release previews. */
export default function ReleaseCalendarPage(){
 const[filter,setFilter]=useState<CalendarFilter>("all");
 const[saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{try{const values=JSON.parse(localStorage.getItem("reborn-watches")||"[]");if(Array.isArray(values))setSaved(values.filter(v=>typeof v==="string"));}catch{}},[]);
 function toggle(id:string){
  setSaved(current=>{
   const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];
   try{localStorage.setItem("reborn-watches",JSON.stringify(next))}catch{}
   return next;
  });
 }
 return <>
  <div className="rbrn-calendar-header"><span className="section-kicker">YOUR WORLD, ALL IN ONE PLACE</span><h1>The Reborn Calendar<span className="period">.</span></h1><p>Original sculpt launches and the gatherings that bring our community together.</p>
   <div className="rbrn-calendar-tabs" role="tablist" aria-label="Calendar category">
    {([["all","All"],["kits","Kit releases"],["events","Events"]] as const).map(([value,label])=><button key={value} type="button" role="tab" aria-selected={filter===value} className={filter===value?"active":""} onClick={()=>setFilter(value)}>{label}</button>)}
   </div>
  </div>
  {filter!=="kits"&&<CommunityEventTimeline/>}
  {filter!=="events"&&<HomeReleaseCalendar kits={kits} saved={saved} onToggle={toggle}/>}
 </>;
}
