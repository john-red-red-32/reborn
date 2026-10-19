export const SUPPORTED_LANGUAGES:readonly ["en","es","it","de","ru"];
export const COUNTRY_LANGUAGE_HINTS:Readonly<Record<string,"es"|"it"|"de"|"ru">>;
export const MULTILINGUAL_HINTS:Readonly<Record<string,readonly string[]>>;
export function preferredSupportedLanguage(browserLanguages:readonly string[]):"en"|"es"|"it"|"de"|"ru";
export function suggestLanguage(country:string|null|undefined,browserLanguages:readonly string[]):{language:"en"|"es"|"it"|"de"|"ru";reason:"browser"|"region"|"default"};
