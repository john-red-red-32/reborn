/** Real separate supplier products, each with its own permanent Reborna URL. */
import {materialFamilies,type FamilyProduct} from "./material-product-families";
import {materialProductEvidence} from "./material-product-evidence";
import {supplierListings} from "./materials-catalogue";
function price(s?:string){const m=s?.match(/[\d,]+(?:\.\d+)?/);return m?Number(m[0].replace(/,/g,"")):undefined}
function nativeCurrency(url:string):"USD"|"EUR"|"GBP"{return url.includes("bountifulbaby.com")?"USD":url.includes("kebelka.com")?"EUR":"GBP"}
export function getMaterialProducts(slug:string):FamilyProduct[]{
 const list=[...(materialFamilies[slug]??[])];const known=new Set(list.map(x=>x.sourceUrl));
 for(const p of materialProductEvidence[slug]?.products??[]){
  if(known.has(p.sourceUrl)||!p.photos.length)continue;
  const variants=p.variants.map(v=>({label:v.label,options:v.options,nativePrice:price(v.observedPrice)}));
  list.push({title:p.title,sourceUrl:p.sourceUrl,photoUrls:p.photos.map(x=>x.url),currency:nativeCurrency(p.sourceUrl),nativePrice:price(p.priceAtReview),variants,optionNames:p.optionNames});
  known.add(p.sourceUrl);
 }
 return list;
}
export function materialProductSlug(p:Pick<FamilyProduct,"sourceUrl">){
 const raw=p.sourceUrl.split("?")[0].split("/").filter(Boolean).slice(-1)[0]||"product";
 return decodeURIComponent(raw).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
export function materialProductPath(rangeSlug:string,p:Pick<FamilyProduct,"sourceUrl">){return "/materials/"+rangeSlug+"/"+materialProductSlug(p)+"/"}
export const materialProductPages=supplierListings.flatMap(listing=>getMaterialProducts(listing.slug).map(product=>({rangeSlug:listing.slug,productSlug:materialProductSlug(product),product})));
