"use client";
import {createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {isWebsiteLanguage,translate,type WebsiteLanguage} from "../lib/i18n/translation";
import {suggestLanguage,preferredSupportedLanguage} from "../lib/i18n/geography.mjs";
export const CURRENCIES=["USD","EUR","GBP","MXN","PLN","RUB","CAD","AUD"] as const;
export type Currency=typeof CURRENCIES[number];
type FX={date:string;rates:Record<string,number>};
type LocaleState={currency:Currency;setCurrency:(c:Currency)=>void;fx:FX|null;locale:string;
 language:WebsiteLanguage;setLanguage:(value:WebsiteLanguage)=>void;
 welcomeLanguage:WebsiteLanguage|null;welcomeReason:"region"|"browser"|null;
 dismissLanguageWelcome:()=>void;
 t:(text:string)=>string
};
const Context=createContext<LocaleState>({currency:"USD",setCurrency:()=>{},fx:null,locale:"en",language:"en",setLanguage:()=>{},welcomeLanguage:null,welcomeReason:null,dismissLanguageWelcome:()=>{},t:(text)=>text});
const STORAGE_KEY="reborna-website-language-v1";
/** Non-standard browser language tags (e.g. en-US@posix) must never crash price formatting. */
const safeLocale=(raw:string)=>{const candidate=(raw||"en").split("@")[0];try{return Intl.getCanonicalLocales(candidate)[0]||"en"}catch{return "en"}};
const zoneCurrency=(language:string):Currency=>{const l=language.toLowerCase();if(l.includes("-mx"))return "MXN";if(l.includes("-gb"))return "GBP";if(l.includes("-pl"))return "PLN";if(l.includes("-ru"))return "RUB";if(l.includes("-ca"))return "CAD";if(l.includes("-au"))return "AUD";if(/-(es|fr|de|it|pt|nl|ie|at|be|fi|gr|eu)\b/.test(l))return "EUR";return "USD"};
function persistChoice(language:WebsiteLanguage){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify({language,chosenAt:new Date().toISOString()}))}catch{/* Nothing private is required for the site to work. */}
}
function readChoice():WebsiteLanguage|null{
 try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");return isWebsiteLanguage(data?.language)?data.language:null}catch{return null}
}
export function LocaleProvider({children}:{children:React.ReactNode}){
 const[currency,update]=useState<Currency>("USD"),[fx,setFx]=useState<FX|null>(null);
 const[locale,setLocale]=useState("en"),[language,updateLanguage]=useState<WebsiteLanguage>("en");
 const[welcomeLanguage,setWelcomeLanguage]=useState<WebsiteLanguage|null>(null);
 const[welcomeReason,setWelcomeReason]=useState<"region"|"browser"|null>(null);
 const manuallyChosen=useRef(false);
 useEffect(()=>{
  const languages=navigator.languages?.length?Array.from(navigator.languages):[navigator.language||"en"];
  const browserLocale=safeLocale(languages[0]||"en");
  setLocale(browserLocale);
  let savedCurrency:string|null=null;
  try{savedCurrency=localStorage.getItem("reborn-currency")}catch{}
  update(savedCurrency&&CURRENCIES.includes(savedCurrency as Currency)?savedCurrency as Currency:zoneCurrency(browserLocale));
  const chosen=readChoice();
  if(chosen){manuallyChosen.current=true;updateLanguage(chosen)}
  else{
   fetch("/api/locale",{cache:"no-store",credentials:"same-origin"})
   .then(r=>r.ok?r.json():Promise.reject(Error("Geolocation unavailable")))
   .then((data:unknown)=>{
     if(manuallyChosen.current)return;
     const country=typeof data==="object"&&data!==null&&"country" in data?(data as {country?:string|null}).country:null;
     const decision=suggestLanguage(country,languages);
     if(decision.language!=="en"){
       updateLanguage(decision.language);
       setWelcomeLanguage(decision.language);
       setWelcomeReason(decision.reason==="region"?"region":"browser");
     }
   })
   .catch(()=>{
     if(manuallyChosen.current)return;
     const browser=preferredSupportedLanguage(languages);
     if(browser!=="en"){updateLanguage(browser);setWelcomeLanguage(browser);setWelcomeReason("browser")}
   });
  }
  fetch("https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,GBP,MXN,PLN,RUB,CAD,AUD",{cache:"no-store"})
   .then(r=>r.ok?r.json():Promise.reject()).then((rows:unknown)=>{
    if(!Array.isArray(rows))throw Error("Invalid reference rates");
    const rates:Record<string,number>={EUR:1};let date="";
    for(const item of rows){const row=item as {quote?:string;rate?:number;date?:string};if(row.quote&&typeof row.rate==="number"&&Number.isFinite(row.rate)&&row.rate>0){rates[row.quote]=row.rate;if(row.date&&(!date||row.date<date))date=row.date}}
    if(!date||Object.keys(rates).length<3)throw Error("Missing reference rates");
    setFx({date,rates})
   }).catch(()=>fetch("/api/exchange-rates").then(r=>r.ok?r.json():Promise.reject()).then(setFx).catch(()=>setFx(null)));
 },[]);
 useEffect(()=>{document.documentElement.lang=language},[language]);
 const setCurrency=(c:Currency)=>{update(c);try{localStorage.setItem("reborn-currency",c)}catch{}};
 const setLanguage=(value:WebsiteLanguage)=>{
  if(!isWebsiteLanguage(value))return;
  manuallyChosen.current=true;updateLanguage(value);setWelcomeLanguage(null);setWelcomeReason(null);persistChoice(value);
 };
 const dismissLanguageWelcome=()=>{
  setWelcomeLanguage(null);setWelcomeReason(null);manuallyChosen.current=true;persistChoice(language);
 };
 const val=useMemo(()=>({currency,setCurrency,fx,locale:language==="en"?locale:language,
  language,setLanguage,welcomeLanguage,welcomeReason,dismissLanguageWelcome,t:(text:string)=>translate(text,language)
 }),[currency,fx,locale,language,welcomeLanguage,welcomeReason]);
 return <Context.Provider value={val}>{children}</Context.Provider>
}
export const useShopLocale=()=>useContext(Context);
export function displayMoney(value:number,source:string,target:string,fx:FX|null,locale="en"){
 const formatter=(amount:number,c:string)=>new Intl.NumberFormat(safeLocale(locale),{style:"currency",currency:c,currencyDisplay:"narrowSymbol",maximumFractionDigits:2}).format(amount);
 if(source===target)return {text:formatter(value,source),converted:false,available:true};
 const from=fx?.rates[source],to=fx?.rates[target];
 if(!from||!to)return {text:formatter(value,source),converted:false,available:false};
 return {text:formatter(value/from*to,target),converted:true,available:true}
}
