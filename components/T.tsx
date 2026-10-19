"use client";
import {useShopLocale} from "./LocaleProvider";
/** Only translate authored interface strings; preserves original artist names,
 * user posts, quotes, edition names and source-attributed catalogue facts. */
export default function T({children}:{children:string}){
 const {t}=useShopLocale();
 return <>{t(children)}</>;
}
