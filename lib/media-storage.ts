/** Reborna media storage configuration. R2 must be enabled in Cloudflare first.
 * Never expose server credentials to client code or commit secrets to GitHub.
 * Only licensed/approved media should be stored and delivered through this service.
 */
export type MediaRecord={
 id:string;
 ownerType:"artist"|"sculpt";
 ownerId:string;
 role:"portrait"|"square"|"banner"|"primary"|"alternate"|"detail"|"prototype"|"blank_kit"|"finished_example";
 objectKey:string;
 sourceUrl:string;
 sourcePage:string;
 credit:string;
 rightsStatus:"approved"|"pending"|"revoked";
 mimeType:string;
 width?:number;
 height?:number;
 sha256?:string;
 order:number;
};
const safeSegment=(value:string)=>value.toLowerCase().replace(/[^a-z0-9_-]/g,"-").slice(0,100);
export function mediaObjectKey(ownerType:MediaRecord["ownerType"],ownerId:string,sha256:string,extension:"jpg"|"png"|"webp"|"avif"){
 if(!/^[0-9a-f]{64}$/.test(sha256))throw new Error("Expected SHA-256 hex digest");
 return `${ownerType}/${safeSegment(ownerId)}/${sha256}.${extension}`;
}
export function publicMediaUrl(objectKey:string):string|null{
 const base=process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://images.reborna.co";
 if(!base||!/^https:\/\//.test(base)||objectKey.includes("..")||objectKey.startsWith("/"))return null;
 return base.replace(/\/$/,"")+"/"+objectKey.split("/").map(encodeURIComponent).join("/");
}
