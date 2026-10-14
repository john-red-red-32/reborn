import {verifiedKits,kitArtist} from "../../../lib/real-catalogue";
import {materialProductPages} from "../../../lib/material-routing";
import {supplierListings} from "../../../lib/materials-catalogue";
export const dynamic="force-static";
export function GET(){
 const kits=verifiedKits.map(k=>({type:"kit",path:"/kits/"+k.slug+"/",name:k.name,group:kitArtist(k.artistSlug)?.name??"Original sculpt"}));
 const materials=materialProductPages.map(p=>({type:"material",path:"/materials/"+p.rangeSlug+"/"+p.productSlug+"/",name:p.product.title,group:supplierListings.find(s=>s.slug===p.rangeSlug)?.name??"Materials"}));
 return Response.json([...kits,...materials],{headers:{"Cache-Control":"public,max-age=3600"}});
}
