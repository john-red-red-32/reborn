"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowRight,CheckCircle2,ExternalLink,FileCheck2,FolderSearch,Send,ShieldCheck} from "lucide-react";
import {communityApi,dateLabel,type CommunityUser} from "../lib/community";
import CertificateStudio from "./CertificateStudio";
import CertificateModerator from "./CertificateModerator";

type ArtistRef={slug:string;name:string};
type Kind="claim_profile"|"submit_sculpt";
type RequestItem={
 id:string;kind:Kind;artistName:string;existingArtistSlug:string|null;sculptName:string|null;
 sourceUrl:string|null;websiteUrl:string|null;socialUrl:string|null;details:string;
 state:"pending"|"reviewing"|"needs_info"|"closed";reviewerMessage:string|null;
 createdAt:string;updatedAt:string;memberHandle?:string
};
type FormState={kind:Kind;artistSlug:string;artistName:string;sculptName:string;sourceUrl:string;websiteUrl:string;socialUrl:string;details:string};
const initial:FormState={kind:"claim_profile",artistSlug:"",artistName:"",sculptName:"",sourceUrl:"",websiteUrl:"",socialUrl:"",details:""};
const labels:Record<RequestItem["state"],string>={pending:"Awaiting editorial review",reviewing:"Being reviewed",needs_info:"More information requested",closed:"Review completed · No automatic publication"};
const kinds:Record<Kind,string>={claim_profile:"Profile contribution or claim",submit_sculpt:"Original sculpt submission"};

function ExternalEvidence({href,title}:{href:string|null;title:string}){
 if(!href)return null;
 return <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="rbrn-sculptor-evidence-link">{title} <ExternalLink size={13}/></a>;
}
export default function SculptorWorkspace({account,artists}:{account:CommunityUser;artists:ArtistRef[]}){
 const isSculptor=account.roles.includes("sculptor");
 const [form,setForm]=useState<FormState>(initial);
 const [own,setOwn]=useState<RequestItem[]>([]),[queue,setQueue]=useState<RequestItem[]>([]);
 const [busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const [messages,setMessages]=useState<Record<string,string>>({}),[reviewBusy,setReviewBusy]=useState("");
 const refresh=async()=>{
  const tasks:Promise<unknown>[]=[];
  if(isSculptor)tasks.push(communityApi<{requests:RequestItem[]}>("sculptor-requests").then(r=>setOwn(r.requests)));
  if(account.moderator)tasks.push(communityApi<{requests:RequestItem[]}>("sculptor-review-queue").then(r=>setQueue(r.requests)));
  await Promise.all(tasks);
 };
 useEffect(()=>{let active=true;setLoading(true);refresh().catch(e=>{if(active)setError((e as Error).message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[account.id,account.moderator,isSculptor]);
 const change=(key:keyof FormState,value:string)=>setForm(previous=>({...previous,[key]:value}));
 const chooseArtist=(slug:string)=>setForm(prev=>({...prev,artistSlug:slug,artistName:artists.find(a=>a.slug===slug)?.name||""}));
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");setNotice("");
  try{
   const result=await communityApi<{message:string}>("sculptor-requests",{
    kind:form.kind,existingArtistSlug:form.artistSlug,artistName:form.artistName,sculptName:form.kind==="submit_sculpt"?form.sculptName:"",
    sourceUrl:form.sourceUrl,websiteUrl:form.websiteUrl,socialUrl:form.socialUrl,details:form.details
   });
   await refresh();setForm(initial);setNotice(result.message);
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 async function review(item:RequestItem,state:"reviewing"|"needs_info"|"closed"){
  setReviewBusy(item.id);setError("");setNotice("");
  try{
   await communityApi("sculptor-review",{id:item.id,state,message:messages[item.id]||""});
   await refresh();setNotice("Editorial review status saved. Nothing was automatically published or verified.");
  }catch(e){setError((e as Error).message)}finally{setReviewBusy("")}
 }
 return <div className="rbrn-sculptor-workspace">
  <span className="section-kicker">THE ORIGINAL WORK · ARTIST SOURCES</span>
  <h2>Your work, your story.</h2>
  <p className="rbrn-dash-lead">Help us connect your original sculpts to the correct published artist profile. Reborna reviews source evidence before editing any public catalogue entry; selecting a sculptor role does not verify your identity.</p>
  <div className="rbrn-dash-notlive"><ShieldCheck size={23}/><div><strong>Every claim and submission is reviewed by Reborna.</strong><p>No profile is automatically transferred, no kit becomes a live listing and no payments are taken. Website and social links are research leads—not proof of identity or permission to reuse photography.</p></div></div>
  {!isSculptor?<div className="rbrn-dash-panel"><h3>Are you an original sculptor?</h3><p>Choose <strong>Original sculptor</strong> under your account's self-described roles. Then return here to submit a profile or kit for our team's review.</p><Link href="/account/">Update your account roles <ArrowRight size={15}/></Link></div>:<>
   <section className="rbrn-sculptor-panel">
    <h3>Send your work for editorial review.</h3>
    <form className="rbrn-dash-edit-form" onSubmit={submit}>
     <label>What would you like to do?<select value={form.kind} onChange={e=>change("kind",e.target.value as Kind)}>
      <option value="claim_profile">Request an existing artist profile / suggest a correction</option>
      <option value="submit_sculpt">Submit an original sculpt or kit for our catalogue</option>
     </select></label>
     <label>Is the sculptor already in Reborna?<select value={form.artistSlug} onChange={e=>chooseArtist(e.target.value)}>
      <option value="">Not listed yet / I am not sure</option>
      {artists.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}
     </select></label>
     <label>Original sculptor's name<input required minLength={2} maxLength={120} value={form.artistName} onChange={e=>change("artistName",e.target.value)} readOnly={Boolean(form.artistSlug)} placeholder="Your name or published studio name"/></label>
     {form.kind==="submit_sculpt"&&<><label>Name of the original sculpt<input required minLength={2} maxLength={120} value={form.sculptName} onChange={e=>change("sculptName",e.target.value)} placeholder="e.g. an original vinyl sculpt"/></label><label>Official page for this sculpt <small>Required</small><input required type="url" maxLength={500} value={form.sourceUrl} onChange={e=>change("sourceUrl",e.target.value)} placeholder="https://yourstudio.com/your-original-sculpt"/></label></>}
     <div className="rbrn-sculptor-form-pair">
      <label>Official studio or shop website <small>Optional</small><input type="url" maxLength={500} value={form.websiteUrl} onChange={e=>change("websiteUrl",e.target.value)} placeholder="https://yourstudio.com"/></label>
      <label>Public social profile <small>Optional · Instagram, Facebook, etc.</small><input type="url" maxLength={500} value={form.socialUrl} onChange={e=>change("socialUrl",e.target.value)} placeholder="https://instagram.com/yourstudio"/></label>
     </div>
     <label>Additional source or context <small>Optional</small><textarea maxLength={1400} rows={4} value={form.details} onChange={e=>change("details",e.target.value)} placeholder="Historical names, artist-authored references, where to find your original work, or the information you want to correct…"/></label>
     <p className="rbrn-sculptor-small">For a profile claim, please include at least one website or social link. You do not need your own website. Our team may request further evidence through a verified official channel before granting any future artist-management privileges.</p>
     <div><button className="rbrn-community-primary" type="submit" disabled={busy}><Send size={15}/>{busy?"Submitting privately…":"Submit for review"}</button></div>
    </form>
   </section>
   <section className="rbrn-sculptor-panel" aria-label="Your editorial submissions">
    <h3>Your submitted requests.</h3>
    {loading?<p>Loading your submissions…</p>:own.length===0?<p className="rbrn-sculptor-small">No artist requests yet. When you send one, its review status will appear here.</p>:<div className="rbrn-sculptor-request-list">
     {own.map(item=><article key={item.id}>
      <span className="section-kicker">{kinds[item.kind]}</span><h4>{item.sculptName?item.sculptName+" · ":""}{item.artistName}</h4><strong>{labels[item.state]}</strong>
      <p>Submitted {dateLabel(item.createdAt)}. {item.state==="closed"?"Editorial review has concluded; this does not by itself confirm publication or profile ownership.":""}</p>
      {item.reviewerMessage&&<p className="rbrn-sculptor-review-note"><FileCheck2 size={15}/> Editorial message: {item.reviewerMessage}</p>}
     </article>)}
    </div>}
   </section>
  </>}
  {account.moderator&&<section className="rbrn-sculptor-panel rbrn-sculptor-moderation" aria-label="Private sculptor editorial review queue">
    <span className="section-kicker">AUTHORised MODERATOR VIEW</span>
    <h3>Artist research queue.</h3>
    <p className="rbrn-sculptor-small">Only authorised moderators can read these sources or change review statuses. A closed request does not publish a kit, attach an artist account or certify a product. Verify claims through the original artist's independently established channel.</p>
    {loading?<p>Checking editor requests…</p>:queue.length===0?<p>No artist requests to review yet.</p>:<div className="rbrn-sculptor-request-list">
     {queue.map(item=><article key={item.id}>
      <span className="section-kicker">{kinds[item.kind]} · @{item.memberHandle}</span>
      <h4>{item.artistName}{item.sculptName?" · "+item.sculptName:""}</h4><strong>{labels[item.state]}</strong>
      {item.existingArtistSlug&&<p>Matched catalogue candidate: <Link href={"/artists/"+item.existingArtistSlug+"/"}>{item.existingArtistSlug}</Link></p>}
      <div className="rbrn-sculptor-review-links"><ExternalEvidence href={item.sourceUrl} title="Official sculpt source"/><ExternalEvidence href={item.websiteUrl} title="Website"/><ExternalEvidence href={item.socialUrl} title="Social profile"/></div>
      {item.details&&<p>{item.details}</p>}
      <label>Message to the member <small>Visible in their dashboard</small><textarea maxLength={600} rows={3} value={messages[item.id]??item.reviewerMessage??""} onChange={e=>setMessages(v=>({...v,[item.id]:e.target.value}))} placeholder="Briefly describe any evidence needed or how the enquiry was resolved…"/></label>
      <div className="rbrn-sculptor-review-actions">
       <button type="button" disabled={!!reviewBusy||item.state==="closed"} onClick={()=>review(item,"reviewing")}>Mark under review</button>
       <button type="button" disabled={!!reviewBusy||item.state==="closed"} onClick={()=>review(item,"needs_info")}>Request more evidence</button>
       <button type="button" disabled={!!reviewBusy||item.state==="closed"} onClick={()=>review(item,"closed")}>Close review</button>
      </div>
     </article>)}
    </div>}
   </section>}
  {(isSculptor||account.moderator)&&<CertificateStudio/>}
  {account.moderator&&<CertificateModerator claims={queue}/>}
  {notice&&<p className="rbrn-community-feedback" role="status"><CheckCircle2 size={16}/>{notice}</p>}
  {error&&<p className="rbrn-community-feedback error" role="alert">{error}</p>}
  <p className="rbrn-sculptor-small">Artist-managed marketplace listings remain in planning. Secure certificate-code issuance is now available to independently approved sculptors during the free pilot. <Link href="/for-sculptors/">Read how Reborna protects original work <ArrowRight size={13}/></Link>.</p>
 </div>;
}
