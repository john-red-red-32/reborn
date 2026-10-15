"use client";
import {useEffect,useRef} from "react";

declare global {
 interface Window {
  turnstile?:{
   render:(element:HTMLElement,options:{sitekey:string;action:string;theme:string;callback:(token:string)=>void;"expired-callback":()=>void;"error-callback":()=>void})=>string;
   remove:(widgetId:string)=>void;
  }
 }
}
type Props={siteKey:string;action:"register"|"topic"|"reply"|"contact";onVerify:(token:string)=>void;onError?:()=>void;resetKey?:number};
export default function TurnstileChallenge({siteKey,action,onVerify,onError,resetKey=0}:Props){
 const root=useRef<HTMLDivElement>(null),callback=useRef(onVerify),errorCallback=useRef(onError);
 useEffect(()=>{callback.current=onVerify;errorCallback.current=onError},[onVerify,onError]);
 useEffect(()=>{
  if(!siteKey||!root.current)return;
  let removed=false,widgetId:string|undefined;
  callback.current("");
  const render=()=>{
   if(removed||!root.current||!window.turnstile||widgetId)return;
   widgetId=window.turnstile.render(root.current,{sitekey:siteKey,action,theme:"light",callback:token=>callback.current(token),"expired-callback":()=>callback.current(""),"error-callback":()=>{callback.current("");errorCallback.current?.()}});
  };
  const url="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  let script=document.querySelector<HTMLScriptElement>('script[data-reborna-turnstile]');
  if(!script){
   script=document.createElement("script");script.src=url;script.async=true;script.defer=true;script.dataset.rebornaTurnstile="1";document.head.appendChild(script);
  }
  const fail=()=>{if(!removed)errorCallback.current?.()};
  script.addEventListener("load",render);
  script.addEventListener("error",fail);
  if(window.turnstile)render();
  const current=script;
  return()=>{removed=true;current.removeEventListener("load",render);current.removeEventListener("error",fail);if(widgetId&&window.turnstile)window.turnstile.remove(widgetId)};
 },[siteKey,action,resetKey]);
 if(!siteKey)return <p className="rbrn-community-muted">Security check is temporarily unavailable.</p>;
 return <div className="rbrn-turnstile" aria-label="Security check"><div ref={root}/><small>Protected by Cloudflare Turnstile. A challenge only appears when needed.</small></div>;
}
