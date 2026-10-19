import {corePhrases} from "./core";
export const LANGUAGES=["en","es","it","de","ru"] as const;
export type WebsiteLanguage=typeof LANGUAGES[number];
export const languageLabels:Record<WebsiteLanguage,string>={
 en:"English",es:"Español",it:"Italiano",de:"Deutsch",ru:"Русский"
};
export function translate(text:string,language:WebsiteLanguage):string{
 if(language==="en")return text;
 const phrase=corePhrases[text];
 return phrase?.[{es:0,it:1,de:2,ru:3}[language]]||text;
}
export function isWebsiteLanguage(value:unknown):value is WebsiteLanguage{
 return typeof value==="string"&&LANGUAGES.includes(value as WebsiteLanguage);
}
