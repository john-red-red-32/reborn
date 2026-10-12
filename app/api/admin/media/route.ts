import {NextRequest,NextResponse} from "next/server";
import {timingSafeEqual} from "node:crypto";
import {putApprovedImage} from "../../../../lib/r2-server";
export const runtime="nodejs";
export const maxDuration=30;
const validToken=(authorization:string|null)=>{const token=process.env.MEDIA_INGEST_TOKEN;if(!token||!authorization?.startsWith("Bearer "))return false;const a=Buffer.from(authorization.slice(7)),b=Buffer.from(token);return a.length===b.length&&timingSafeEqual(a,b)};
export async function POST(req:NextRequest){
 if(!validToken(req.headers.get("authorization")))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const form=await req.formData();const file=form.get("file");
  if(!(file instanceof File))return NextResponse.json({error:"Missing image file"},{status:400});
  const mime=file.type as "image/jpeg"|"image/png"|"image/webp"|"image/avif";
  if(!["image/jpeg","image/png","image/webp","image/avif"].includes(mime)||file.size>8*1024*1024||file.size===0)return NextResponse.json({error:"Unsupported image or size"},{status:400});
  const ownerType=form.get("ownerType"),ownerId=form.get("ownerId"),sourceUrl=form.get("sourceUrl"),sourcePage=form.get("sourcePage"),credit=form.get("credit"),rights=form.get("rightsApproved");
  if((ownerType!=="artist"&&ownerType!=="sculpt")||typeof ownerId!=="string"||! /^[a-z0-9_-]{2,100}$/.test(ownerId)||typeof sourceUrl!=="string"||typeof sourcePage!=="string"||typeof credit!=="string"||rights!=="true")return NextResponse.json({error:"Valid identity, provenance and explicit rights approval required"},{status:400});
  for(const u of [sourceUrl,sourcePage]){try{const parsed=new URL(u);if(parsed.protocol!=="https:"||u.length>800)throw Error()}catch{return NextResponse.json({error:"Source URLs must be valid HTTPS links"},{status:400})}}
  const bytes=new Uint8Array(await file.arrayBuffer());
  // Check actual file magic bytes, not only the browser-provided MIME type.
  const matches=mime==="image/jpeg"?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:mime==="image/png"?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:mime==="image/webp"?String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP":String.fromCharCode(...bytes.slice(4,12)).includes("ftypavif");
  if(!matches)return NextResponse.json({error:"Image content does not match declared format"},{status:400});
  const saved=await putApprovedImage({ownerType,ownerId,bytes,mime,sourceUrl,sourcePage,credit});
  return NextResponse.json(saved,{status:201});
 }catch(err){console.error("Media ingestion failed",err);return NextResponse.json({error:"Storage operation failed"},{status:503})}
}
