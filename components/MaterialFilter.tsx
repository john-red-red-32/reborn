"use client";
import {materialOptions,type MaterialFilterValue} from "../lib/sculpt-material";
export default function MaterialFilter({value,onChange,className=""}:{value:MaterialFilterValue;onChange:(value:MaterialFilterValue)=>void;className?:string}){
 return <div className={"material-filter "+className} role="group" aria-label="Filter by sculpt material">
  {materialOptions.map(option=><button key={option.value} type="button" className={value===option.value?"active":""} aria-pressed={value===option.value} onClick={()=>onChange(option.value)}>{option.label}</button>)}
 </div>;
}
