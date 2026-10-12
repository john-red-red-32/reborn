"use client";
import {displayMoney,useShopLocale} from "./LocaleProvider";
export default function LocalizedOfferPrice({total,deposit,balance,originalCurrency,retailer,compact=false,showDeposit=true}:{total?:number;deposit?:number;balance?:number;originalCurrency:string;retailer?:string;compact?:boolean;showDeposit?:boolean}){
 const{currency,fx,locale}=useShopLocale();
 const primary=total??deposit;if(primary===undefined)return null;
 const v=displayMoney(primary,originalCurrency,currency,fx,locale);
 const depositLabel=showDeposit&&deposit!==undefined?displayMoney(deposit,originalCurrency,currency,fx,locale):null;
 const balanceLabel=balance!==undefined?displayMoney(balance,originalCurrency,currency,fx,locale):null;
 return <div className={compact?"localized-price compact":"localized-price"}>
 <strong>{total===undefined?"Deposit ":""}{v.converted?"≈ ":""}{v.text}</strong>
 {depositLabel&&total!==undefined&&<span> · Deposit {depositLabel.converted?"≈ ":""}{depositLabel.text}</span>}
 {balanceLabel&&!compact&&<span> · Balance {balanceLabel.converted?"≈ ":""}{balanceLabel.text}</span>}
 {retailer&&<small>Retailer: {retailer}</small>}
 {v.converted&&<small>Approximate conversion · checkout in {originalCurrency} · rate {fx?.date}</small>}
 {!v.available&&<small>Original seller currency {originalCurrency}; live conversion unavailable</small>}
 </div>
}