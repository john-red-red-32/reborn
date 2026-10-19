"use client";
import {materialOptions,type MaterialFilterValue} from "../lib/sculpt-material";
import {useShopLocale} from "./LocaleProvider";
export default function MaterialFilter({value,onChange,className=""}:{value:MaterialFilterValue;onChange:(value:MaterialFilterValue)=>void;className?:string}){
 const{t}=useShopLocale();
 return <div className={"material-filter "+className} role="group" aria-label={t("Filter by sculpt material")}>
  {materialOptions.map(option=><button key={option.value} type="button" className={value===option.value?"active":""} aria-pressed={value===option.value} onClick={()=>onChange(option.value)}>{t(option.label)}</button>)}
 </div>;
}
