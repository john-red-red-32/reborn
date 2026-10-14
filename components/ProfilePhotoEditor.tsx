"use client";
import {useRef,useState} from "react";
import {Camera,ImagePlus,Trash2,CheckCircle2} from "lucide-react";
import {communityApi} from "../lib/community";
import ProfileAvatar from "./ProfileAvatar";

type SaveResponse={avatarUrl:string|null;message:string};
const MAX_FILE=6*1024*1024;
async function smallSquare(file:File):Promise<string>{
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Choose a JPEG, PNG or WebP photo.");
 if(file.size>MAX_FILE)throw Error("Please choose an image smaller than 6 MB.");
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error("This photo could not be read."));image.src=url});
  if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth>14000||image.naturalHeight>14000)throw Error("Please choose a smaller photo.");
  const sourceSize=Math.min(image.naturalWidth,image.naturalHeight);
  const x=(image.naturalWidth-sourceSize)/2,y=(image.naturalHeight-sourceSize)/2;
  for(const size of [256,224,192,160]){
   const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Photo editing isn't available in this browser.");
   ctx.fillStyle="#f9f4ee";ctx.fillRect(0,0,size,size);
   ctx.drawImage(image,x,y,sourceSize,sourceSize,0,0,size,size);
   for(const quality of [0.78,0.62,0.48]){
    let encoded=canvas.toDataURL("image/webp",quality);
    if(!encoded.startsWith("data:image/webp;"))encoded=canvas.toDataURL("image/jpeg",quality);
    if(encoded.length<=99000)return encoded;
   }
  }
  throw Error("We couldn't compress that photo enough. Please try another image.");
 }finally{URL.revokeObjectURL(url)}
}
export default function ProfilePhotoEditor({avatarUrl,onSaved}:{avatarUrl:string|null;onSaved:(url:string|null)=>void}){
 const picker=useRef<HTMLInputElement>(null);
 const [pending,setPending]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 async function choose(e:React.ChangeEvent<HTMLInputElement>){
  const file=e.currentTarget.files?.[0];if(!file)return;
  setError("");setNotice("");
  try{setPending(await smallSquare(file))}catch(e){setError((e as Error).message);setPending("")}
  finally{if(picker.current)picker.current.value=""}
 }
 async function save(remove=false){
  setError("");setNotice("");setBusy(true);
  try{
   const result=await communityApi<SaveResponse>("avatar",remove?{remove:true}:{avatarData:pending});
   onSaved(result.avatarUrl);
   setPending("");setNotice(result.message);
  }catch(e){setError((e as Error).message)}
  finally{setBusy(false)}
 }
 return <section className="rbrn-avatar-editor" aria-label="Your public profile photo">
  <div className="rbrn-avatar-editor-main">
   <ProfileAvatar src={pending||avatarUrl} alt="Your profile photo" large/>
   <div className="rbrn-avatar-editor-content"><strong>Profile picture <span>Optional</span></strong>
    <p>Show a photo of yourself, your studio or your work. We'll centre-crop and resize it before uploading. Your image is visible to other members.</p>
    <div className="rbrn-avatar-editor-actions">
     <input ref={picker} type="file" id="rbrn-avatar-picker" accept="image/jpeg,image/png,image/webp" onChange={choose} disabled={busy} aria-label="Choose a profile photo"/>
     <label htmlFor="rbrn-avatar-picker" className="rbrn-community-secondary"><ImagePlus size={15}/> {avatarUrl||pending?"Change photo":"Choose photo"}</label>
     {pending&&<button type="button" className="rbrn-community-primary" onClick={()=>save(false)} disabled={busy}><Camera size={15}/>{busy?"Saving…":"Save photo"}</button>}
     {!pending&&avatarUrl&&<button type="button" className="rbrn-avatar-delete" onClick={()=>save(true)} disabled={busy}><Trash2 size={14}/> Remove</button>}
     {pending&&<button type="button" className="rbrn-avatar-delete" onClick={()=>setPending("")} disabled={busy}>Cancel</button>}
    </div>
   </div>
  </div>
  {notice&&<p role="status" className="rbrn-avatar-editor-notice"><CheckCircle2 size={14}/>{notice}</p>}
  {error&&<p role="alert" className="rbrn-community-feedback error">{error}</p>}
 </section>;
}
