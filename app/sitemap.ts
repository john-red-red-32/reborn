import type {MetadataRoute} from "next";
import {artists,verifiedKits} from "../lib/real-catalogue";
import {supplierListings} from "../lib/materials-catalogue";
import {materialProductPages} from "../lib/material-routing";
import {communityEvents} from "../lib/community-events";
import {canonical} from "../lib/seo";

export default function sitemap():MetadataRoute.Sitemap{
 const pages:string[]=[
  "/","/real-kits/","/artists/","/materials/","/events/","/community/",
  "/community/guidelines/","/contact/","/privacy/","/terms/","/cookies/"
 ];
 const fixed=pages.map(path=>({url:canonical(path)}));
 const artistPages=artists.map(artist=>({
  url:canonical("/artists/"+artist.slug+"/"),
  ...(artist.images?.[0]?.url?{images:[artist.images[0].url]}:{})
 }));
 const kitPages=verifiedKits.map(kit=>({
  url:canonical("/kits/"+kit.slug+"/"),
  ...(kit.photos?.length?{images:kit.photos.slice(0,4).map(photo=>photo.url)}:{})
 }));
 const ranges=supplierListings.map(listing=>({url:canonical("/materials/"+listing.slug+"/")}));
 const materialPages=materialProductPages.map(item=>({
  url:canonical("/materials/"+item.rangeSlug+"/"+item.productSlug+"/"),
  ...(item.product.photoUrls.length?{images:item.product.photoUrls.slice(0,3)}:{})
 }));
 const events=communityEvents.map(event=>({url:canonical("/events/"+event.slug+"/")}));
 // Avoid duplicates if source feeds repeat a merchant slug; never invent lastmod.
 return [...new Map([...fixed,...artistPages,...kitPages,...ranges,...materialPages,...events].map(page=>[page.url,page])).values()];
}
