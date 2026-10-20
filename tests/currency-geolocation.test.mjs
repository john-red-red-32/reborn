import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SUPPORTED_CURRENCIES,currencyFromCountry,preferredCurrency,suggestCurrency} from "../lib/i18n/geography.mjs";

test("currency auto-detection includes all 21 euro-area countries in 2026",()=>{
 const euroCountries="AT BE BG HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES".split(" ");
 assert.equal(euroCountries.length,21);
 for(const country of euroCountries)assert.equal(currencyFromCountry(country),"EUR",country);
 for(const code of ["AD","MC","SM","VA","ME","XK"])assert.equal(currencyFromCountry(code),"EUR",code);
 assert.equal(currencyFromCountry("DK"),"DKK");
 assert.equal(currencyFromCountry("SE"),"SEK");
 assert.equal(currencyFromCountry("CZ"),"CZK");
});
test("visitor country determines price currency independent of browser language",()=>{
 for(const [code,currency] of [
  ["GB","GBP"],["RU","RUB"],["DE","EUR"],["BG","EUR"],["FR","EUR"],
  ["PL","PLN"],["MX","MXN"],["US","USD"],["CA","CAD"],["AU","AUD"],
  ["CH","CHF"],["NO","NOK"],["HU","HUF"],["RO","RON"],["DK","DKK"]
 ]){
  assert.equal(suggestCurrency(code,["en-GB"]),currency,code);
  assert.ok(SUPPORTED_CURRENCIES.includes(currency));
 }
 assert.equal(suggestCurrency("DE",["ru-RU"]),"EUR","Russian-language German visitor still sees euros");
 assert.equal(suggestCurrency("RU",["en-GB"]),"RUB","English-language Russian visitor still sees rubles");
});
test("invalid or unsupported country safely falls back to browser region then USD",()=>{
 for(const unsafe of [null,undefined,"","GB\n","T1",123,"RU-NOW"]){
  assert.equal(suggestCurrency(unsafe,["en-GB"]),"GBP");
 }
 assert.equal(preferredCurrency(["de-DE","en-GB"]),"EUR");
 assert.equal(preferredCurrency(["en-US"]),"USD");
 assert.equal(preferredCurrency(["fr-FR"]),"EUR");
 assert.equal(preferredCurrency(["es-MX"]),"MXN");
 assert.equal(preferredCurrency(["es-419"]),"USD");
 assert.equal(suggestCurrency("ZZ",["en-GB"]),"GBP");
 assert.equal(suggestCurrency("ZZ",["ja-JP"]),"USD");
});
test("language and currency preferences are separate, manual currency is never overwritten",()=>{
 const provider=readFileSync(new URL("../components/LocaleProvider.tsx",import.meta.url),"utf8");
 assert.match(provider,/localStorage\.getItem\("reborn-currency"\)/);
 assert.match(provider,/currencyChosen\.current=true;update\(c\)/);
 assert.match(provider,/if\(!currencyChosen\.current\)update\(suggestCurrency\(country,languages\)\)/);
 assert.match(provider,/const chosen=readChoice\(\);/);
 assert.match(provider,/fetch\("\/api\/locale"/);
 assert.ok(provider.indexOf('fetch("/api/locale"')>provider.indexOf("if(chosen){manuallyChosen.current"),"geo must run for currency even when language is already saved");
 assert.doesNotMatch(provider,/CF-Connecting-IP|geolocation\.db|ipstack|geoip2/i);
});
test("all consumer-facing price components use one shared converter, including preview calendar",()=>{
 const files=["LocalizedOfferPrice.tsx","MaterialRangeProducts.tsx","MaterialProductViewer.tsx","HomeReleaseCalendar.tsx"];
 for(const name of files){
  const source=readFileSync(new URL("../components/"+name,import.meta.url),"utf8");
  assert.match(source,/displayMoney\(/,name);
 }
 const calendar=readFileSync(new URL("../components/HomeReleaseCalendar.tsx",import.meta.url),"utf8");
 assert.doesNotMatch(calendar,/"£"\s*\+/,"No hard-coded pounds for the sample prices");
 const rateSources=["../components/LocaleProvider.tsx","../app/api/exchange-rates/route.ts"];
 for(const file of rateSources){
  const source=readFileSync(new URL(file,import.meta.url),"utf8");
  for(const currency of SUPPORTED_CURRENCIES)if(currency!=="EUR")assert.ok(source.includes(currency),file+" quote "+currency);
 }
});

test("Mexico and every South American sovereign state receive the local display currency",()=>{
 const countries={
  MX:"MXN",AR:"ARS",BO:"BOB",BR:"BRL",CL:"CLP",CO:"COP",
  EC:"USD",GY:"GYD",PY:"PYG",PE:"PEN",SR:"SRD",UY:"UYU",VE:"VES"
 };
 for(const [country,currency] of Object.entries(countries)){
  assert.equal(suggestCurrency(country,["en-GB"]),currency,country);
  assert.equal(suggestCurrency(country,["ru-RU"]),currency,"currency must not depend on page language");
  assert.ok(SUPPORTED_CURRENCIES.includes(currency),country+" missing currency dropdown");
 }
 // Cloudflare may independently identify South American non-sovereign regions.
 assert.equal(suggestCurrency("GF",["en-GB"]),"EUR","French Guiana uses euro");
 assert.equal(suggestCurrency("FK",["en-GB"]),"FKP","Falklands use local pounds");
});
test("Latin American browser fallbacks work without a Cloudflare location, preserving manual logic",()=>{
 const cases=[["es-MX","MXN"],["pt-BR","BRL"],["es-AR","ARS"],
              ["es-CL","CLP"],["es-CO","COP"],["es-PE","PEN"],["es-UY","UYU"]];
 for(const [locale,currency] of cases){
  assert.equal(preferredCurrency([locale]),currency,locale);
  assert.equal(suggestCurrency(null,[locale]),currency,locale);
 }
 assert.equal(suggestCurrency("BR",["en-US"]),"BRL","country outranks browser currency");
 assert.equal(suggestCurrency("MX",["pt-BR"]),"MXN","Mexican visitors get pesos");
});
test("Latin American currency codes are available to native browser Intl formatting",()=>{
 for(const code of ["MXN","ARS","BOB","BRL","CLP","COP","USD","GYD","PYG","PEN","SRD","UYU","VES","FKP"]){
  const str=new Intl.NumberFormat("en-GB",{style:"currency",currency:code,currencyDisplay:"narrowSymbol",maximumFractionDigits:2}).format(25.5);
  assert.ok(str.length>0&&/[0-9]/.test(str),code);
 }
});
