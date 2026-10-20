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
  const code=typeof country==="string"&&/^[a-z]{2}$/i.test(country)?country.toUpperCase():"";
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


/** Currency hints follow the visitor's approximate country, independently from
 * the language they read. Only currencies supported by our display/rate service
 * are mapped; unsupported countries fall back to browser region or USD.
 * 21 EU euro users as of January 2026 (including Bulgaria). */
export const COUNTRY_CURRENCY_HINTS=Object.freeze({
  AT:"EUR",BE:"EUR",BG:"EUR",HR:"EUR",CY:"EUR",EE:"EUR",FI:"EUR",
  FR:"EUR",DE:"EUR",GR:"EUR",IE:"EUR",IT:"EUR",LV:"EUR",LT:"EUR",
  LU:"EUR",MT:"EUR",NL:"EUR",PT:"EUR",SK:"EUR",SI:"EUR",ES:"EUR",
  AD:"EUR",MC:"EUR",SM:"EUR",VA:"EUR",ME:"EUR",XK:"EUR",
  GB:"GBP",IM:"GBP",JE:"GBP",GG:"GBP",
  RU:"RUB",PL:"PLN",MX:"MXN",US:"USD",CA:"CAD",AU:"AUD",
  CZ:"CZK",DK:"DKK",HU:"HUF",RO:"RON",SE:"SEK",CH:"CHF",LI:"CHF",
  NO:"NOK",SJ:"NOK",
  // Mexico was already supported; complete the South American currency map.
  AR:"ARS",BO:"BOB",BR:"BRL",CL:"CLP",CO:"COP",EC:"USD",
  GY:"GYD",PY:"PYG",PE:"PEN",SR:"SRD",UY:"UYU",VE:"VES",
  // South American territories: French Guiana uses EUR, the Falklands FKP.
  GF:"EUR",FK:"FKP"
});
export const SUPPORTED_CURRENCIES=Object.freeze(["USD","EUR","GBP","MXN","PLN","RUB","CAD","AUD","CZK","DKK","HUF","RON","SEK","CHF","NOK","ARS","BOB","BRL","CLP","COP","GYD","PYG","PEN","SRD","UYU","VES","FKP"]);
export function currencyFromCountry(country){
  if(typeof country!=="string"||!/^[a-z]{2}$/i.test(country))return null;
  return COUNTRY_CURRENCY_HINTS[country.toUpperCase()]??null;
}
export function preferredCurrency(browserLanguages=[]){
  for(const tag of browserLanguages){
    if(typeof tag!=="string")continue;
    const m=tag.trim().match(/^[a-z]{2,3}[-_]([a-z]{2})(?:[-_]|$)/i);
    if(m){
      const currency=currencyFromCountry(m[1]);
      if(currency)return currency;
    }
  }
  return "USD";
}
export function suggestCurrency(country,browserLanguages=[]){
  return currencyFromCountry(country)??preferredCurrency(browserLanguages);
}
