"use client";
import {useState} from "react";
import {ChevronDown,ChevronUp} from "lucide-react";
export default function ArtistBiography({lead,story,legacy}:{lead:string;story:string;legacy:string}){
 const[expanded,setExpanded]=useState(false);
 return <div className="artist-biography"><p>{lead}</p><div className={expanded?"artist-more expanded":"artist-more"} id="artist-expanded-bio"><p>{story}</p><p>{legacy}</p></div><button className="artist-readmore" onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded} aria-controls="artist-expanded-bio">{expanded?"Read less":"Read her story"} {expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</button></div>
}