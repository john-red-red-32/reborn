"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
export const CURRENCIES=["USD","EUR","GBP","MXN","PLN","RUB","CAD","AUD"] as const;
export type Currency=typeof CURRENCIES[number];
type FX={date:string;rates:Record<string,number>};
type LocaleState={currency:Currency;setCurrency:(c:Currency)=>void;fx:FX|null;locale:string};
const Context=createContext<LocaleState>({currency:"USD",setCurrency:()=>{},fx:null,locale:"en"});
const zoneCurrency=(language:string):Currency=>{const l=language.toLowerCase();if(l.includes("-mx"))return "MXN";if(l.includes("-gb"))return "GBP";if(l.includes("-pl"))return "PLN";if(l.includes("-ru"))return "RUB";if(l.includes("-ca"))return "CAD";if(l.includes("-au"))return "AUD";if(/-(es|fr|de|it|pt|nl|ie|at|be|fi|gr|eu)\b/.test(l))return "EUR";return "USD"};
export function LocaleProvider({children}:{children:React.ReactNode}){const[currency,update]=useState<Currency>("USD");const[fx,setFx]=useState<FX|null>(null);const[locale,setLocale]=useState("en");
useEffect(()=>{const saved=localStorage.getItem("reborn-currency");const languages=navigator.languages??[navigator.language];setLocale(languages[0]||"en");const guess=zoneCurrency(languages[0]||"en");update(saved&&CURRENCIES.includes(saved as Currency)?saved as Currency:guess);
fetch("https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,GBP,MXN,PLN,RUB,CAD,AUD",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then((rows:unknown)=>{if(!Array.isArray(rows))throw Error("Invalid reference rates");const rates:Record<string,number>={EUR:1};let date="";for(const item of rows){const row=item as {quote?:string;rate?:number;date?:string};if(row.quote&&typeof row.rate==="number"&&Number.isFinite(row.rate)&&row.rate>0){rates[row.quote]=row.rate;if(row.date&&(!date||row.date<date))date=row.date}}if(!date||Object.keys(rates).length<3)throw Error("Missing reference rates");setFx({date,rates})}).catch(()=>fetch("/api/exchange-rates").then(r=>r.ok?r.json():Promise.reject()).then(setFx).catch(()=>setFx(null)))},[]);
const setCurrency=(c:Currency)=>{update(c);localStorage.setItem("reborn-currency",c)};
const val=useMemo(()=>({currency,setCurrency,fx,locale}),[currency,fx,locale]);
return <Context.Provider value={val}>{children}</Context.Provider>}
export const useShopLocale=()=>useContext(Context);
export function displayMoney(value:number,source:string,target:string,fx:FX|null,locale="en"){const formatter=(amount:number,c:string)=>new Intl.NumberFormat(locale,{style:"currency",currency:c,currencyDisplay:"narrowSymbol",maximumFractionDigits:2}).format(amount);if(source===target)return {text:formatter(value,source),converted:false,available:true};const from=fx?.rates[source],to=fx?.rates[target];if(!from||!to)return {text:formatter(value,source),converted:false,available:false};return {text:formatter(value/from*to,target),converted:true,available:true}}
