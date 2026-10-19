import {corePhrases} from "./core";
import {extendedPhrases} from "./extended";
import {formPhrases} from "./forms";
import {coreRegional} from "./multi-core";
import {extendedRegional} from "./multi-extended";
import {formsRegional} from "./multi-forms";
export const LANGUAGES=["en","es","it","de","ru"] as const;
export type WebsiteLanguage=typeof LANGUAGES[number];
export const languageLabels:Record<WebsiteLanguage,string>={
 en:"English",es:"Español",it:"Italiano",de:"Deutsch",ru:"Русский"
};
export function translate(text:string,language:WebsiteLanguage):string{
 if(language==="en")return text;
 if(language==="es")return corePhrases[text]||extendedPhrases[text]||formPhrases[text]||text;
 const variant=coreRegional[text]||extendedRegional[text]||formsRegional[text];
 return variant?.[{it:0,de:1,ru:2}[language]]||text;
}
export function isWebsiteLanguage(value:unknown):value is WebsiteLanguage{
 return typeof value==="string"&&LANGUAGES.includes(value as WebsiteLanguage);
}
