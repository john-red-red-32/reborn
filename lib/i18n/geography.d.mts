export const SUPPORTED_LANGUAGES:readonly ["en","es","it","de","ru"];
export const COUNTRY_LANGUAGE_HINTS:Readonly<Record<string,"es"|"it"|"de"|"ru">>;
export const MULTILINGUAL_HINTS:Readonly<Record<string,readonly string[]>>;
export function preferredSupportedLanguage(browserLanguages:readonly string[]):"en"|"es"|"it"|"de"|"ru";
export function suggestLanguage(country:string|null|undefined,browserLanguages:readonly string[]):{language:"en"|"es"|"it"|"de"|"ru";reason:"browser"|"region"|"default"};

export const SUPPORTED_CURRENCIES:readonly ["USD","EUR","GBP","MXN","PLN","RUB","CAD","AUD","CZK","DKK","HUF","RON","SEK","CHF","NOK"];
export const COUNTRY_CURRENCY_HINTS:Readonly<Record<string,typeof SUPPORTED_CURRENCIES[number]>>;
export function currencyFromCountry(country:unknown):typeof SUPPORTED_CURRENCIES[number]|null;
export function preferredCurrency(browserLanguages:readonly string[]):typeof SUPPORTED_CURRENCIES[number];
export function suggestCurrency(country:unknown,browserLanguages:readonly string[]):typeof SUPPORTED_CURRENCIES[number];
