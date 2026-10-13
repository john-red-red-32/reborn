"use client";
import {useEffect,useState} from "react";
import {kits} from "../lib/demo-data";
import HomeReleaseCalendar from "./HomeReleaseCalendar";

/** Keeps the original design-preview watchlist intact after moving the calendar. */
export default function ReleaseCalendarPage(){
 const[saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{try{const values=JSON.parse(localStorage.getItem("reborn-watches")||"[]");if(Array.isArray(values))setSaved(values.filter(v=>typeof v==="string"));}catch{}},[]);
 function toggle(id:string){
  setSaved(current=>{
   const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];
   try{localStorage.setItem("reborn-watches",JSON.stringify(next))}catch{}
   return next;
  });
 }
 return <HomeReleaseCalendar kits={kits} saved={saved} onToggle={toggle}/>;
}
