"use client";
import {useEffect,useState} from "react";
import {CheckCircle2,ShieldAlert,ShieldCheck} from "lucide-react";
import {communityApi} from "../lib/community";

type Claim={id:string;kind:string;state:string;artistName:string;existingArtistSlug:string|null;memberHandle?:string;websiteUrl:string|null;socialUrl:string|null;sourceUrl:string|null};
type Issuer={artistSlug:string;artistName:string;officialSourceUrl:string;state:"active"|"suspended";authorisedAt:string;memberHandle:string};

export default function CertificateModerator({claims}:{claims:Claim[]}){
 const [issuers,setIssuers]=useState<Issuer[]>([]),[claimId,setClaimId]=useState(""),[sourceUrl,setSourceUrl]=useState(""),[reviewNote,setReviewNote]=useState(""),[confirmed,setConfirmed]=useState(false),[reason,setReason]=useState<Record<string,string>>({});
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const refresh=async()=>{const r=await communityApi<{issuers:Issuer[]}>("certificate-issuers");setIssuers(r.issuers)};
 useEffect(()=>{void refresh().catch(e=>setError((e as Error).message))},[]);
 const candidates=claims.filter(x=>x.kind==="claim_profile"&&x.state==="closed"&&x.existingArtistSlug&&!issuers.some(i=>i.artistSlug===x.existingArtistSlug));
 async function authorise(e:React.FormEvent){
  e.preventDefault();
  if(!window.confirm("Have you independently contacted the original sculptor through an established official channel and confirmed this member controls that identity? This grants REAL certificate-issuing authority."))return;
  setBusy(true);setError("");setNotice("");
  try{
   await communityApi("certificate-authorise",{claimId,officialSourceUrl:sourceUrl,reviewNote,confirmedOfficialChannel:confirmed});
   await refresh();setClaimId("");setSourceUrl("");setReviewNote("");setConfirmed(false);
   setNotice("Issuer authorisation saved with a review audit record.");
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 async function suspend(slug:string){
  const message=(reason[slug]||"").trim();
  if(message.length<20){setError("Describe the specific evidence or safety concern before suspending an issuer.");return}
  if(!window.confirm("Suspend all new certificate issuance for this verified artist? Public checks will warn that the issuer is suspended."))return;
  setBusy(true);setError("");setNotice("");
  try{await communityApi("certificate-suspend-issuer",{artistSlug:slug,reason:message});await refresh();setNotice("Issuer suspended. Existing code history is preserved.")}catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 return <section className="rbrn-cert-moderator" aria-label="Founder certificate issuer approvals">
  <span className="section-kicker">FOUNDER-ONLY · ORIGINAL ARTIST IDENTITY</span>
  <h3>Approve certificate issuers.</h3>
  <p className="rbrn-sculptor-small">This grants the ability to issue real certificate codes. Closing a profile request or seeing a social-media link is not sufficient. Check identity through a previously established, independent official source and document the confirmation.</p>
  {candidates.length>0?<form onSubmit={authorise} className="rbrn-dash-edit-form">
   <label>Completed profile claim<select required value={claimId} onChange={e=>{setClaimId(e.target.value);setSourceUrl("");setReviewNote("");setConfirmed(false)}}>
    <option value="">Choose a claim after independently checking the artist</option>
    {candidates.map(x=><option value={x.id} key={x.id}>{x.artistName} · @{x.memberHandle} · {x.existingArtistSlug}</option>)}
   </select></label>
   <label>Independent official artist source <small>Mandatory; NOT merely a self-provided social profile</small><input type="url" required maxLength={500} value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)} placeholder="https://known-artist-site.example/"/></label>
   <label>Private founder identity-review notes <small>At least 50 characters; stored in the audit trail</small><textarea required minLength={50} maxLength={950} rows={4} value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder="How you contacted the original artist through their already-public channel; what they confirmed; any evidence discrepancies…"/></label>
   <label className="rbrn-cert-attestation"><input type="checkbox" required checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I independently confirmed the original sculptor controls this Reborna account and approve them to issue certificate codes for this artist.</label>
   <button type="submit" className="rbrn-community-primary" disabled={busy||!claimId||reviewNote.trim().length<50||!confirmed}><ShieldCheck size={16}/> Grant certificate issuing authority</button>
  </form>:<p className="rbrn-sculptor-small">No completed, unassigned original-sculptor profile claims qualify for issuer review yet. That is expected at launch.</p>}
  <div className="rbrn-cert-issuer-list">
   <h4>Approved issuer registry.</h4>
   {!issuers.length?<p className="rbrn-sculptor-small">No certificate issuers have been approved yet. The public verification service will not invent codes or registry entries.</p>:issuers.map(x=><article key={x.artistSlug}><strong>{x.artistName} · @{x.memberHandle}</strong><span>{x.state==="active"?"Active issuer":"Suspended"} · {x.artistSlug}</span>
    <a href={x.officialSourceUrl} target="_blank" rel="noopener noreferrer nofollow">Reviewed public source ↗</a>
    {x.state==="active"&&<div className="rbrn-cert-revoke"><input aria-label={"Reason to suspend "+x.artistName} value={reason[x.artistSlug]||""} maxLength={450} placeholder="Document a suspension reason" onChange={e=>setReason(m=>({...m,[x.artistSlug]:e.target.value}))}/><button disabled={busy} type="button" onClick={()=>suspend(x.artistSlug)}>Suspend</button></div>}</article>)}
  </div>
  {error&&<p className="rbrn-community-feedback error" role="alert"><ShieldAlert size={16}/>{error}</p>}
  {notice&&<p className="rbrn-community-feedback" role="status"><CheckCircle2 size={16}/>{notice}</p>}
 </section>;
}
