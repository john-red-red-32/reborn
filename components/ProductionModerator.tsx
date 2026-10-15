"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {AlertTriangle,CheckCircle2,ClipboardCheck,Link2,ShieldCheck} from "lucide-react";
import {communityApi} from "../lib/community";

type Run={id:string;quantity:number;serialStart:number;runNumber:number;changeAcknowledged:number;editionLabel:string;editionKind:string;declaredQuantity:number|null;initialQuantity:number|null;sculptName:string;artistSlug:string;officialUrl:string|null;memberHandle:string};
type Correction={id:string;sculptId:string;proposedName:string;proposedOfficialUrl:string|null;justification:string;currentName:string;currentUrl:string|null;artistSlug:string;memberHandle:string};
type LinkProposal={id:string;sculptId:string;proposedKitSlug:string;sourceNote:string;sculptName:string;artistSlug:string;memberHandle:string};
type Queue={runs:Run[];corrections:Correction[];links:LinkProposal[]};
export default function ProductionModerator({catalogueKits}:{catalogueKits:{slug:string;name:string;artistSlug:string}[]}){
 const [data,setData]=useState<Queue|null>(null),[busy,setBusy]=useState(""),[messages,setMessages]=useState<Record<string,string>>({}),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const refresh=async()=>setData(await communityApi<Queue>("production-review-queue"));
 useEffect(()=>{void refresh().catch(e=>setError((e as Error).message))},[]);
 const decide=async(path:string,id:string,decision:string)=>{
  const note=(messages[id]||"").trim();
  if(note.length<20){setError("Write at least 20 characters describing the evidence before making this decision.");return}
  if(!window.confirm("Record this "+decision+" editorial decision? This changes private production permissions or a source-backed public link."))return;
  setBusy(id);setError("");setNotice("");
  try{
   const run=data?.runs.find(r=>r.id===id);const payload=path==="production-run-review"?{runId:id,decision,note,expectedQuantity:run?.quantity,expectedSerialStart:run?.serialStart}:{id,decision,note};
   const result=await communityApi<{message:string}>(path,payload);await refresh();setNotice(result.message);
  }catch(e){setError((e as Error).message)}finally{setBusy("")}
 };
 const reason=(id:string,placeholder:string)=> <textarea value={messages[id]||""} maxLength={450} rows={3} onChange={e=>setMessages(s=>({...s,[id]:e.target.value}))} placeholder={placeholder} aria-label="Document the evidence and editorial decision"/>;
 return <section className="rbrn-production-moderator" aria-label="Founder production and catalogue editorial review">
  <span className="section-kicker">PRIVATE FOUNDER TOOLS · EVIDENCE-FIRST</span><h3>Production & catalogue reviews.</h3>
  <p className="rbrn-sculptor-small">The artist supplies production declarations; your approval permits email-confirmed issuance. Check previous run totals and limited-edition promises before approving. Catalogue links and post-issuance name changes require their own editorial review, never a name-only match.</p>
  {!data?<p>Loading the private review queue…</p>:<>
   <h4>New production requests ({data.runs.length})</h4>
   {!data.runs.length?<p className="rbrn-sculptor-small">No production runs awaiting approval.</p>:data.runs.map(run=><article key={run.id}>
    <strong>{run.sculptName} · @{run.memberHandle}</strong>
    <p>{run.editionLabel} · Run {run.runNumber} · <strong>{run.quantity.toLocaleString("en-GB")} codes</strong> · Serial {run.serialStart}–{run.serialStart+run.quantity-1}</p>
    <p>{run.editionKind==="limited"?<>Original edition declaration: {run.initialQuantity?.toLocaleString("en-GB")}, current maximum: {run.declaredQuantity?.toLocaleString("en-GB")}.</>:"Open edition; serial number reflects total produced, not a promised cap."}</p>
    {run.changeAcknowledged===1&&<p className="rbrn-production-review-warning"><AlertTriangle size={16}/> This is a proposed increase of a previously declared edition size. Check the original promise to collectors; consider requiring a separately named edition if appropriate.</p>}
    {run.officialUrl&&<a href={run.officialUrl} rel="noopener noreferrer nofollow" target="_blank">Original studio source ↗</a>}
    {reason(run.id,"Document independently checked production evidence, edition limits, and any issues…")}
    <div className="rbrn-production-buttons"><button type="button" disabled={!!busy} onClick={()=>decide("production-run-review",run.id,"approved")}>Approve issuance request</button><button type="button" disabled={!!busy} onClick={()=>decide("production-run-review",run.id,"rejected")}>Reject request</button></div>
   </article>)}
   <h4>Identity and source corrections ({data.corrections.length})</h4>
   {!data.corrections.length?<p className="rbrn-sculptor-small">No sculpt corrections awaiting review.</p>:data.corrections.map(c=><article key={c.id}>
    <strong>{c.currentName} → {c.proposedName}</strong><small>@{c.memberHandle} · {c.artistSlug}</small>
    <p>Artist's reason: {c.justification}</p>
    <p>New official source: {c.proposedOfficialUrl?<a href={c.proposedOfficialUrl} target="_blank" rel="noopener noreferrer nofollow">{c.proposedOfficialUrl}</a>:"Not supplied"}</p>
    {reason(c.id,"Explain why this corrected sculpt identity and source are supported by the original artist…")}
    <div className="rbrn-production-buttons"><button disabled={!!busy} onClick={()=>decide("production-correction-review",c.id,"approved")} type="button">Approve correction</button><button disabled={!!busy} onClick={()=>decide("production-correction-review",c.id,"rejected")} type="button">Reject</button></div>
   </article>)}
   <h4>Catalogue page matches ({data.links.length})</h4>
   {!data.links.length?<p className="rbrn-sculptor-small">No pending catalogue association requests.</p>:data.links.map(l=>{
    const candidate=catalogueKits.find(x=>x.slug===l.proposedKitSlug);
    const sameArtist=candidate?.artistSlug===l.artistSlug;
    return <article key={l.id}>
     <strong>{l.sculptName} · @{l.memberHandle}</strong><p>Artist-confirmed potential link: <Link target="_blank" href={"/kits/"+l.proposedKitSlug+"/"}>{candidate?.name||l.proposedKitSlug} ↗</Link></p>
     <p>Submitted evidence: {l.sourceNote}</p>
     {!sameArtist&&<p className="rbrn-production-review-warning"><AlertTriangle size={16}/> The published kit is missing from this catalogue build or belongs to a different sculptor. Do not approve without investigating and correcting the source record.</p>}
     {reason(l.id,"Describe matching original sculpt, artist-authored source, image rights and why this is safe to link publicly…")}
     <div className="rbrn-production-buttons"><button disabled={!!busy||!sameArtist} onClick={()=>decide("production-link-review",l.id,"linked")} type="button"><Link2 size={14}/> Confirm and link</button><button disabled={!!busy} onClick={()=>decide("production-link-review",l.id,"rejected")} type="button">Reject link</button></div>
    </article>;
   })}
  </>}
  <div className="rbrn-production-buttons"><button type="button" disabled={!!busy} onClick={async()=>{setBusy("cleanup");setError("");try{const r=await communityApi<{expiredChunksPurged:number}>("production-cleanup",{});setNotice("Expired confidential exports cleaned: "+r.expiredChunksPurged+" chunk(s).")}catch(e){setError((e as Error).message)}finally{setBusy("")}}}><ShieldCheck size={14}/> Purge expired secure exports</button></div>
  {notice&&<p className="rbrn-community-feedback" role="status"><CheckCircle2 size={16}/>{notice}</p>}
  {error&&<p className="rbrn-community-feedback error" role="alert">{error}</p>}
 </section>;
}
