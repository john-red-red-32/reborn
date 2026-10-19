import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

function load(file){
 const source=readFileSync(new URL("../lib/i18n/"+file,import.meta.url),"utf8");
 const part=source.slice(source.indexOf(" = ")+3).trim().replace(/;$/,"");
 return JSON.parse(part);
}
const core=load("core.ts"),regional=load("multi-core.ts"),extended=load("extended.ts"),forms=load("forms.ts");
const cyrillic=/[\u0400-\u052f]/;

test("all four language variants have authored copy for essential public navigation and discovery",()=>{
 const essential=[
  "Discover","Shop kits","Shop materials","Reborn calendar","Meet the artists",
  "Community","Verify a kit","Your account","Website language",
  "THE SCULPT COLLECTOR'S EDIT","Discover the art",
  "Beautifully crafted original reborn doll sculpt kits from independent sculptors. Find new releases, follow pre-orders and discover where to buy — all in one place.",
  "A continually growing collection of original reborn sculpts. Available kits first, followed by pre-orders and past favourites.",
  "Original sculptors. Beautifully individual art.",
  "The Reborn Calendar","GET IN TOUCH","ORIGINAL SCULPTS · BETTER PROVENANCE",
  "Check a certificate code","Accept analytics","Reject analytics",
  "Privacy policy","Terms of use"
 ];
 for(const english of essential){
  assert.ok(core[english]||extended[english]||forms[english],english+" missing Spanish");
  assert.ok(regional[english]||extended[english]||forms[english],english+" missing Italian/German/Russian");
 }
});
test("every extended and consent phrase has exactly four populated translated variants",()=>{
 for(const [file,data] of [["extended.ts",extended],["forms.ts",forms]]){
  for(const [key,values] of Object.entries(data)){
   assert.equal(values.length,4,file+" "+key);
   for(const [i,value] of values.entries())assert.ok(typeof value==="string"&&value.trim().length>0,file+" "+key+" "+i);
   assert.ok(!cyrillic.test(values[0]),"Russian text leaked into Spanish: "+key);
  }
 }
});
test("core Spanish translations and Italian German Russian core phrases are complete",()=>{
 for(const [key,value] of Object.entries(core)){
  assert.ok(typeof value==="string"&&value.trim().length>0,"Empty Spanish: "+key);
  assert.ok(!cyrillic.test(value),"Russian text leaked into Spanish core: "+key);
 }
 for(const [key,values] of Object.entries(regional)){
  assert.equal(values.length,3,key);
  assert.ok(values.every(v=>typeof v==="string"&&v.trim()),key);
 }
});
test("original artist names and research data are never passed through an online machine translator",()=>{
 const locale=readFileSync(new URL("../components/LocaleProvider.tsx",import.meta.url),"utf8");
 const source=readFileSync(new URL("../lib/i18n/translation.ts",import.meta.url),"utf8");
 const endpoint=readFileSync(new URL("../functions/api/locale.js",import.meta.url),"utf8");
 assert.match(locale,/persistChoice/);
 assert.match(locale,/manuallyChosen/);
 assert.match(locale,/document\.documentElement\.lang=language/);
 assert.match(source,/return .*\|\|text/);
 assert.doesNotMatch(locale+source,/translate\.googleapis|google-translate|deepL|openai\.com/i);
 assert.match(endpoint,/request\.cf\?\.country/);
 assert.doesNotMatch(endpoint,/CF-Connecting-IP|console\.log|cf-ray/i);
});
