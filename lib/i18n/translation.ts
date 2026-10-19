import {corePhrases} from "./core";
import {extendedPhrases} from "./extended";
import {formPhrases} from "./forms";
import {coreRegional} from "./multi-core";
export const LANGUAGES=["en","es","it","de","ru"] as const;
export type WebsiteLanguage=typeof LANGUAGES[number];
export const languageLabels:Record<WebsiteLanguage,string>={
 en:"English",es:"Español",it:"Italiano",de:"Deutsch",ru:"Русский"
};
/** Fallback to English only for untranslated interface copy.
 * Artist identities, source biographies and user text are deliberately untouched. */
export function translate(text:string,language:WebsiteLanguage):string{
 if(language==="en")return text;
 if(language==="es")return corePhrases[text]||extendedPhrases[text]?.[0]||formPhrases[text]?.[0]||text;
 const languageIndex={it:0,de:1,ru:2}[language];
 return coreRegional[text]?.[languageIndex]||extendedPhrases[text]?.[languageIndex+1]||formPhrases[text]?.[languageIndex+1]||text;
}
export function isWebsiteLanguage(value:unknown):value is WebsiteLanguage{
 return typeof value==="string"&&LANGUAGES.includes(value as WebsiteLanguage);
}
