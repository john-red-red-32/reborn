import "server-only";
import {S3Client,PutObjectCommand,HeadObjectCommand} from "@aws-sdk/client-s3";
import {createHash} from "node:crypto";
import {mediaObjectKey} from "./media-storage";
const env=(key:string)=>{const value=process.env[key];if(!value)throw new Error("Missing server configuration: "+key);return value};
function client(){return new S3Client({region:"auto",endpoint:"https://"+env("R2_ACCOUNT_ID")+".r2.cloudflarestorage.com",credentials:{accessKeyId:env("R2_ACCESS_KEY_ID"),secretAccessKey:env("R2_SECRET_ACCESS_KEY")}})}
export async function putApprovedImage(input:{ownerType:"artist"|"sculpt";ownerId:string;bytes:Uint8Array;mime:"image/jpeg"|"image/png"|"image/webp"|"image/avif";sourceUrl:string;sourcePage:string;credit:string}){
 const extensions: Record<typeof input.mime, "jpg"|"png"|"webp"|"avif"> = {"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/avif":"avif"};
 const ext=extensions[input.mime];
 const digest=createHash("sha256").update(input.bytes).digest("hex");
 const key=mediaObjectKey(input.ownerType,input.ownerId,digest,ext);
 const s3=client(),Bucket=env("R2_BUCKET_NAME");
 await s3.send(new PutObjectCommand({Bucket,Key:key,Body:input.bytes,ContentType:input.mime,CacheControl:"public,max-age=31536000,immutable",Metadata:{sourceurl:input.sourceUrl.slice(0,800),sourcepage:input.sourcePage.slice(0,800),credit:input.credit.slice(0,250),rights:"approved"}}));
 const head=await s3.send(new HeadObjectCommand({Bucket,Key:key}));
 if(head.ContentLength!==input.bytes.length)throw new Error("R2 upload size verification failed");
 return {key,bytes:head.ContentLength,sha256:digest,publicUrl:env("NEXT_PUBLIC_MEDIA_BASE_URL").replace(/\/$/,"")+"/"+key};
}
