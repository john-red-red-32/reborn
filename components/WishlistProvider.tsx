"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {Check,Heart,X} from "lucide-react";

export type SavedItemType="kit"|"material"|"artist"|"archive";
export type SavedItem={type:SavedItemType;path:string;title:string;subtitle?:string;imageUrl?:string|null;collectionStatus?:"wishlist"|"owned";savedAt?:string};
type State="loading"|"member"|"guest"|"unavailable";
type WishlistValue={items:SavedItem[];state:State;isSaved:(path:string)=>boolean;toggle:(item:SavedItem)=>Promise<void>;updateStatus:(item:SavedItem,status:"wishlist"|"owned")=>Promise<void>;remove:(item:SavedItem)=>Promise<void>;refresh:()=>Promise<void>};
const storeKey="reborna-wishlist-v1",legacyKey="reborna-saved-original-kits",guestInviteKey="reborna-wishlist-first-save-invited-v1";
const Context=createContext<WishlistValue|null>(null);
const normalized=(path:string)=>path.includes("?")?path:(path.endsWith("/")?path:path+"/");
function guestItems():SavedItem[]{
 try{
  const raw=JSON.parse(localStorage.getItem(storeKey)||"[]");
  const parsed:Array<SavedItem>=Array.isArray(raw)?raw.filter((x):x is SavedItem=>x&&typeof x.path==="string"&&["kit","material","artist","archive"].includes(x.type)&&typeof x.title==="string").slice(0,1000):[];
  let old:unknown=[];try{old=JSON.parse(localStorage.getItem(legacyKey)||"[]")}catch{}
  if(Array.isArray(old))for(const slug of old){
   if(typeof slug!=="string"||! /^[a-z0-9-]{2,90}$/.test(slug))continue;
   const path="/kits/"+slug+"/";
   if(!parsed.some(x=>normalized(x.path)===path))parsed.push({type:"kit",path,title:slug.replace(/-/g," ").replace(/\b\w/g,ch=>ch.toUpperCase()),subtitle:"Original sculpt kit"});
  }
  return parsed.slice(0,1000).map(x=>({...x,path:normalized(x.path)}));
 }catch{return []}
}
function persist(items:SavedItem[]){try{localStorage.setItem(storeKey,JSON.stringify(items));localStorage.removeItem(legacyKey)}catch{}}
async function request(path:string,payload?:unknown){
 const res=await fetch("/api/community/"+path,{credentials:"same-origin",cache:"no-store",method:payload===undefined?"GET":"POST",headers:payload===undefined?undefined:{"Content-Type":"application/json"},body:payload===undefined?undefined:JSON.stringify(payload)});
 const data=await res.json().catch(()=>({error:"The collection service is temporarily unavailable."}));
 if(!res.ok)throw Object.assign(new Error(data.error||"Request failed."),{status:res.status});
 return data;
}
export function WishlistProvider({children}:{children:React.ReactNode}){
 const[items,setItems]=useState<SavedItem[]>([]),[state,setState]=useState<State>("loading"),[notice,setNotice]=useState(""),[showGuestInvite,setShowGuestInvite]=useState(false);
 const refresh=useCallback(async()=>{
  setShowGuestInvite(false);
  try{
   // A member's canonical collection is always loaded from Cloudflare D1.
   const res=await request("wishlist") as {items:SavedItem[]};
   const browser=guestItems();
   if(browser.length){
    try{
     await request("wishlist",{action:"import",items:browser.slice(0,100)});
     // Never silently lose unsynced browser saves.
     persist(browser.length>100?browser.slice(100):[]);
     const updated=await request("wishlist") as {items:SavedItem[]};
     setItems(updated.items);
    }catch{setItems(res.items);setNotice("Some earlier browser-only favourites could not be synced. They are still saved on this device.")}
   }else setItems(res.items);
   setState("member");
  }catch(e){
   if((e as {status?:number}).status===401){setItems(guestItems());setState("guest")}
   else{setItems(guestItems());setState("unavailable");setNotice("Cloud collection couldn't load. Saves will stay on this device until the connection returns.")}
  }
 },[]);
 useEffect(()=>{void refresh()},[refresh]);
 const isSaved=useCallback((path:string)=>items.some(i=>normalized(i.path)===normalized(path)),[items]);
 const execute=useCallback(async(action:string,item:SavedItem)=>{
  const path=normalized(item.path);
  const previous=items;
  const exists=previous.some(i=>normalized(i.path)===path);
  const next=action==="remove"?previous.filter(i=>normalized(i.path)!==path):
   action==="save"?exists?previous:[{...item,path,collectionStatus:"wishlist" as const},...previous]:
   previous.map(i=>normalized(i.path)===path?{...i,collectionStatus:action==="mark-owned"?"owned" as const:"wishlist" as const}:i);
  setItems(next);
  if(state==="guest"||state==="unavailable"){
   persist(next);
   let firstSave=false;
   if(state==="guest"&&action==="save"){
    try{firstSave=sessionStorage.getItem(guestInviteKey)!=="shown";if(firstSave)sessionStorage.setItem(guestInviteKey,"shown")}
    catch{firstSave=true}
   }
   setShowGuestInvite(firstSave);
   setNotice(state==="unavailable"?"Saved on this device for now. Account syncing is temporarily unavailable.":action==="save"?"Saved to your favourites.":action==="remove"?"Removed from your favourites.":"Sign in to organise your collection across devices.");
   return;
  }
  try{await request("wishlist",{action,item:{...item,path}});setShowGuestInvite(false);setNotice(action==="save"?"Added to your wishlist.":action==="remove"?"Removed from your wishlist.":"Your collection was updated.")}
  catch(e){setItems(previous);setNotice((e as Error).message)}
 },[items,state]);
 const toggle=useCallback(async(item:SavedItem)=>{if(state==="loading")return;await execute(isSaved(item.path)?"remove":"save",item)},[state,execute,isSaved]);
 const updateStatus=useCallback((item:SavedItem,status:"wishlist"|"owned")=>execute(status==="owned"?"mark-owned":"mark-wishlist",item),[execute]);
 const remove=useCallback((item:SavedItem)=>execute("remove",item),[execute]);
 const value=useMemo(()=>({items,state,isSaved,toggle,updateStatus,remove,refresh}),[items,state,isSaved,toggle,updateStatus,remove,refresh]);
 return <Context.Provider value={value}>{children}
  {notice&&showGuestInvite&&state==="guest"?
   <aside className="rbrn-save-toast rbrn-save-invite" role="status" aria-label="Save your favourites with a free Reborna account">
    <Heart size={20} fill="currentColor" aria-hidden="true"/>
    <div className="rbrn-save-invite-copy"><strong>Saved to your favourites.</strong><p>Keep your collection across devices with a free Reborna account. The favourites you've saved here will come with you.</p>
     <div className="rbrn-save-invite-actions"><Link href="/account/?from=wishlist" onClick={()=>{setNotice("");setShowGuestInvite(false)}}>Create my free account</Link><button type="button" onClick={()=>{setNotice("");setShowGuestInvite(false)}}>Maybe later</button></div>
    </div>
    <button className="rbrn-save-close" type="button" aria-label="Dismiss invitation" onClick={()=>{setNotice("");setShowGuestInvite(false)}}><X size={17}/></button>
   </aside>:
   notice&&<div className="rbrn-save-toast" role="status"><Heart size={17} fill="currentColor"/><span>{notice}</span>{state==="guest"&&<Link href="/account/?from=wishlist">Free account</Link>}<button type="button" aria-label="Dismiss notification" onClick={()=>setNotice("")}><X size={17}/></button></div>}
 </Context.Provider>;
}
export function useWishlist(){const ctx=useContext(Context);if(!ctx)throw Error("WishlistProvider is required.");return ctx}
