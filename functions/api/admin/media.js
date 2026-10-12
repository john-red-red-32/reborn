/**
 * Authenticated image ingestion on Cloudflare Pages Functions.
 * Requires MEDIA_INGEST_TOKEN secret and MEDIA_BUCKET R2 binding.
 * Ported from the protected Next.js admin endpoint; remains deny-by-default.
 */
const MAX=8*1024*1024;
const JSON_HEADERS={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
const reply=(value,status)=>new Response(JSON.stringify(value),{status,headers:JSON_HEADERS});
const validUrl=value=>{try{const url=new URL(value);return url.protocol==="https:"&&value.length<=800;}catch{return false;}};
async function authorized(supplied,expected){
  if(!expected||!supplied?.startsWith("Bearer "))return false;
  const a=new TextEncoder().encode(supplied.slice(7));
  const b=new TextEncoder().encode(expected);
  if(a.length!==b.length||a.length>1024)return false;
  const [ha,hb]=await Promise.all([crypto.subtle.digest("SHA-256",a),crypto.subtle.digest("SHA-256",b)]);
  const x=new Uint8Array(ha),y=new Uint8Array(hb);
  let difference=0;
  for(let i=0;i<x.length;i++)difference|=x[i]^y[i];
  return difference===0;
}
function magic(data,mime){
  if(mime==="image/jpeg")return data[0]===255&&data[1]===216&&data[2]===255;
  if(mime==="image/png")return data[0]===137&&data[1]===80&&data[2]===78&&data[3]===71;
  const str=(at,n)=>String.fromCharCode(...data.slice(at,at+n));
  if(mime==="image/webp")return str(0,4)==="RIFF"&&str(8,4)==="WEBP";
  if(mime==="image/avif")return str(4,8).includes("ftypavif");
  return false;
}
export async function onRequestPost({request,env}){
  if(!(await authorized(request.headers.get("Authorization"),env.MEDIA_INGEST_TOKEN)))return reply({error:"Unauthorized"},401);
  if(!env.MEDIA_BUCKET)return reply({error:"Media storage not configured"},503);
  const length=Number(request.headers.get("Content-Length")||0);
  if(length>MAX+20_000)return reply({error:"File too large"},413);
  let form;
  try{form=await request.formData();}catch{return reply({error:"Invalid form data"},400);}
  const file=form.get("file");
  if(!file||typeof file.arrayBuffer!=="function"||file.size<=0||file.size>MAX)return reply({error:"Missing image or invalid image size"},400);
  const mime=file.type;
  const ext=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/avif":"avif"})[mime];
  if(!ext)return reply({error:"Unsupported image type"},400);
  const ownerType=form.get("ownerType"),ownerId=form.get("ownerId"),
    sourceUrl=form.get("sourceUrl"),sourcePage=form.get("sourcePage"),
    credit=form.get("credit"),rights=form.get("rightsApproved");
  if(!["artist","sculpt"].includes(ownerType)||typeof ownerId!=="string"||
    !/^[a-z0-9_-]{2,100}$/.test(ownerId)||!validUrl(sourceUrl)||!validUrl(sourcePage)||
    typeof credit!=="string"||!credit.trim()||rights!=="true")
    return reply({error:"Valid identity, provenance and explicit rights approval required"},400);
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!magic(bytes,mime))return reply({error:"Image content does not match MIME type"},400);
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));
  const sha256=[...digest].map(x=>x.toString(16).padStart(2,"0")).join("");
  const key=`approved/${ownerType}/${ownerId}/${sha256}.${ext}`;
  try{
    await env.MEDIA_BUCKET.put(key,bytes,{httpMetadata:{contentType:mime,cacheControl:"public,max-age=31536000,immutable"},
      customMetadata:{sourceurl:sourceUrl.slice(0,800),sourcepage:sourcePage.slice(0,800),credit:credit.slice(0,250),rights:"approved"}});
    const head=await env.MEDIA_BUCKET.head(key);
    if(head?.size!==bytes.length)throw Error("Stored size mismatch");
    const base=(env.MEDIA_BASE_URL||"https://images.reborna.co").replace(/\/$/,"");
    return reply({key,bytes:head.size,sha256,publicUrl:`${base}/${key}`},201);
  }catch{return reply({error:"Storage operation failed"},503);}
}
export async function onRequest(context){
  if(context.request.method==="POST")return onRequestPost(context);
  return reply({error:"Method not allowed"},405);
}
