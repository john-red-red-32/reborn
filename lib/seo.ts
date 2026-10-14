/** Shared canonical URLs and safe static JSON-LD. No artificial reviews, stock or offer markup. */
export const SEO_ORIGIN="https://reborna.co";
export const canonical=(path:string)=>SEO_ORIGIN+(path.startsWith("/")?path:"/"+path);
export const canonicalPath=(path:string)=>path.endsWith("/")?path:path+"/";
export function safeJsonLd(value:unknown){return JSON.stringify(value).replace(/</g,"\\u003c");}
export function breadcrumbJsonLd(crumbs:{name:string;path:string}[]){
 return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":crumbs.map((crumb,i)=>({
  "@type":"ListItem",position:i+1,name:crumb.name,item:canonical(canonicalPath(crumb.path))
 }))};
}
export const homeCrumb={name:"Reborna",path:"/"};
