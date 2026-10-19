/** Country hints are deliberately coarse, anonymous, and non-authoritative.
 * Never derive identity, nationality, citizenship or language proficiency from an IP. */
export const SUPPORTED_LANGUAGES=["en","es","it","de","ru"];
export const COUNTRY_LANGUAGE_HINTS=Object.freeze({
  ES:"es",MX:"es",AR:"es",CO:"es",CL:"es",PE:"es",VE:"es",EC:"es",BO:"es",PY:"es",UY:"es",CR:"es",PA:"es",GT:"es",SV:"es",HN:"es",NI:"es",DO:"es",CU:"es",
  IT:"it",SM:"it",VA:"it",
  DE:"de",AT:"de",LI:"de",
  RU:"ru"
});
export const MULTILINGUAL_HINTS=Object.freeze({
  CH:["de","it"],BE:["de"],LU:["de"],AD:["es"],GI:["es"],MD:["ru"],KZ:["ru"],KG:["ru"],UZ:["ru"],EE:["ru"],LV:["ru"],LT:["ru"]
});
export function preferredSupportedLanguage(browserLanguages=[]){
  for(const entry of browserLanguages){
    if(typeof entry!=="string")continue;
    const lang=entry.trim().split(/[-_]/)[0].toLowerCase();
    if(SUPPORTED_LANGUAGES.includes(lang))return lang;
  }
  return "en";
}
export function suggestLanguage(country,browserLanguages=[]){
  const code=typeof country==="string"?country.trim().toUpperCase():"";
  const browser=preferredSupportedLanguage(browserLanguages);
  const fixed=COUNTRY_LANGUAGE_HINTS[code];
  // Respect travellers and expatriates: a clearly supported browser language
  // takes precedence over geolocation, which is only a rough suggestion.
  if(browser!=="en")return {language:browser,reason:"browser"};
  if(fixed)return {language:fixed,reason:"region"};
  const choices=MULTILINGUAL_HINTS[code];
  if(choices?.includes(browser))return {language:browser,reason:"browser"};
  return {language:"en",reason:"default"};
}
