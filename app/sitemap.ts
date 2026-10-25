import type {MetadataRoute} from "next";
export const dynamic="force-static";
import {artists,verifiedKits} from "../lib/real-catalogue";
import {supplierListings} from "../lib/materials-catalogue";
import {materialProductPages} from "../lib/material-routing";
import {communityEvents} from "../lib/community-events";
import {canonical} from "../lib/seo";

// Next's sitemap serializer does not XML-escape image query strings.
// Preserve exact remote image URLs while escaping reserved XML characters.
const imageXmlUrl=(url:string)=>url.replace(/&amp;/g,"&").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export default function sitemap():MetadataRoute.Sitemap{
 const pages:string[]=[
  "/","/real-kits/","/artists/","/materials/","/events/","/community/","/marketplace/",
  "/community/guidelines/","/for-sculptors/","/verify/","/guides/original-reborn-kits/","/guides/cassie-ann-love-sculpt-history/","/contact/","/privacy/","/terms/","/cookies/"
 ];
 const fixed=pages.map(path=>({url:canonical(path)}));
 const artistPages=artists.map(artist=>({
  url:canonical("/artists/"+artist.slug+"/"),
  ...(artist.images?.[0]?.url?{images:[imageXmlUrl(artist.images[0].url)]}:{})
 }));
 const kitPages=verifiedKits.map(kit=>({
  url:canonical("/kits/"+kit.slug+"/"),
  ...(kit.photos?.length?{images:kit.photos.slice(0,4).map(photo=>imageXmlUrl(photo.url))}:{})
 }));
 const ranges=supplierListings.map(listing=>({url:canonical("/materials/"+listing.slug+"/")}));
 const materialPages=materialProductPages.map(item=>({
  url:canonical("/materials/"+item.rangeSlug+"/"+item.productSlug+"/"),
  ...(item.product.photoUrls.length?{images:item.product.photoUrls.slice(0,3).map(imageXmlUrl)}:{})
 }));
 const events=communityEvents.map(event=>({url:canonical("/events/"+event.slug+"/")}));
 // Avoid duplicates if source feeds repeat a merchant slug; never invent lastmod.
 return [...new Map([...fixed,...artistPages,...kitPages,...ranges,...materialPages,...events].map(page=>[page.url,page])).values()];
}
