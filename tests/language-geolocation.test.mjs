import test from "node:test";
import assert from "node:assert/strict";
import {suggestLanguage,preferredSupportedLanguage} from "../lib/i18n/geography.mjs";
import {onRequestGet,onRequest} from "../functions/api/locale.js";

test("geo hints follow regional language in supported monolingual regions",()=>{
 for(const [country,expected] of [["ES","es"],["IT","it"],["DE","de"],["AT","de"],["RU","ru"],["MX","es"],["AR","es"]]){
  assert.equal(suggestLanguage(country,["en-GB"]).language,expected);
 }
});
test("browser override beats country for expats and multilingual contexts",()=>{
 assert.equal(suggestLanguage("DE",["ru-RU","en-US"]).language,"ru");
 assert.equal(suggestLanguage("ES",["it-IT"]).language,"it");
 assert.equal(suggestLanguage("CH",["it-CH"]).language,"it");
 assert.equal(suggestLanguage("CH",["de-CH"]).language,"de");
 assert.equal(suggestLanguage("CH",["en-US"]).language,"en");
 assert.equal(suggestLanguage("GB",["es-ES"]).language,"es");
});
test("unsupported, unknown and unsafe country hints fall back to browser or English",()=>{
 for(const country of [null,undefined,"xx","T1","","\nES",123]){
  assert.equal(suggestLanguage(country,["en-GB"]).language,"en");
 }
 assert.equal(preferredSupportedLanguage(["fr-FR","pt-BR","de-DE"]),"de");
 assert.equal(preferredSupportedLanguage(["fr-FR","pt-BR"]),"en");
 assert.equal(suggestLanguage("UA",["uk-UA"]).language,"en");
});
test("geolocation endpoint only returns anonymised ISO country, never visitor identifiers",async()=>{
 const request={cf:{country:"DE"},headers:new Headers({"CF-Connecting-IP":"192.0.2.33"})};
 const response=onRequestGet({request});
 assert.equal(response.status,200);
 assert.equal(response.headers.get("Cache-Control"),"private, no-store, max-age=0");
 const data=await response.json();assert.deepEqual(data,{country:"DE"});
 assert.ok(!JSON.stringify(data).includes("192.0.2"));
 assert.deepEqual(await onRequestGet({request:{cf:{country:"T1"}}}).json(),{country:null});
 assert.equal(onRequest().status,405);
});
