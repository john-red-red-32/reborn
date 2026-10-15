"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AlertTriangle,CheckCircle2,Download,FilePlus2,FolderOpen,Layers3,Link2,MailCheck,RefreshCcw,ShieldCheck} from "lucide-react";
import {communityApi,dateLabel} from "../lib/community";

export type KitCandidate={slug:string;name:string;artistSlug:string};
type Sculpt={id:string;artistSlug:string;sculptName:string;officialUrl:string|null;catalogueKitSlug:string|null;linkStatus:string;proposedKitSlug:string|null};
type Edition={id:string;sculptId:string;editionLabel:string;editionKind:"limited"|"open";initiallyDeclaredQuantity:number|null;currentDeclaredQuantity:number|null};
type Run={id:string;editionId:string;runNumber:number;quantity:number;serialStart:number;status:"pending"|"approved"|"rejected"|"generating"|"ready"|"archived";generatedCount:number;reviewNote:string|null;exportExpiresAt:string|null;exportArchivedAt:string|null;submittedAt:string};
type Studio={sculpts:Sculpt[];editions:Edition[];runs:Run[];issuers:{artistSlug:string;artistName:string;state:"active"|"suspended"}[];proposals:{id:string;sculptId:string;proposedKitSlug:string;state:string;reviewNote:string|null}[];corrections:{id:string;sculptId:string;state:string;proposedName:string;reviewNote:string|null}[];exportReady:boolean;maxRunQuantity:number;freePilot:boolean};
type Session={runId:string;token:string;quantity:number;status:string};
const fixedCodes="XXXX-XXXX-XXXX";
const safeCsv=(v:string|number)=>{const text=String(v);const protectedText=/^[=+@\-\t\r]/.test(text)?"'"+text:text;return '"'+protectedText.replace(/"/g,'""')+'"'};
const nice=(x:string)=>x.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g,"");
const description:{[key in Run["status"]]:string}={
 pending:"Awaiting founder approval",approved:"Approved · Email confirmation required",
 rejected:"Not approved",generating:"Generating · Can resume securely",
 ready:"Codes ready · Download within 7 days",archived:"Codes registered · Original export cleared"
};
export default function ProductionStudio({catalogueKits}:{catalogueKits:KitCandidate[]}){
 const [data,setData]=useState<Studio|null>(null),[error,setError]=useState(""),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false);
 const [sculptName,setSculptName]=useState(""),[officialUrl,setOfficialUrl]=useState(""),[issuerSlug,setIssuerSlug]=useState("");
 const [sculptId,setSculptId]=useState(""),[editionLabel,setEditionLabel]=useState("Original vinyl edition"),[editionKind,setEditionKind]=useState<"limited"|"open">("limited"),[declaredQuantity,setDeclaredQuantity]=useState("500");
 const [editionId,setEditionId]=useState(""),[runQuantity,setRunQuantity]=useState("500"),[ackNew,setAckNew]=useState(false),[ackExpand,setAckExpand]=useState(false);
 const [selectedRun,setSelectedRun]=useState(""),[approvalId,setApprovalId]=useState(""),[emailCode,setEmailCode]=useState(""),[session,setSession]=useState<Session|null>(null),[progress,setProgress]=useState(0);
 const [editSculpt,setEditSculpt]=useState(""),[editName,setEditName]=useState(""),[editSource,setEditSource]=useState(""),[editNote,setEditNote]=useState("");
 const [linkSculpt,setLinkSculpt]=useState(""),[linkKit,setLinkKit]=useState(""),[linkNote,setLinkNote]=useState("");
 const [exportDownloaded,setExportDownloaded]=useState(false);
 const refresh=async()=>{const r=await communityApi<Studio>("production-studio");setData(r);setIssuerSlug(v=>v||r.issuers.find(i=>i.state==="active")?.artistSlug||"")};
 useEffect(()=>{void refresh().catch(e=>setError((e as Error).message))},[]);
 const issuerReady=(data?.issuers||[]).some(x=>x.state==="active");
 const selectedEdition=data?.editions.find(x=>x.id===editionId);
 const selectedEditionSculpt=data?.sculpts.find(x=>x.id===selectedEdition?.sculptId);
 const existingQuantity=data?.runs.filter(r=>r.editionId===editionId&&r.status!=="rejected").reduce((n,r)=>n+r.quantity,0)||0;
 const requestedSize=Number(runQuantity);
 const increasing=selectedEdition?.editionKind==="limited"&&existingQuantity+requestedSize>(selectedEdition.currentDeclaredQuantity||0);
 const runSculpt=(r:Run)=>data?.sculpts.find(x=>x.id===data?.editions.find(e=>e.id===r.editionId)?.sculptId);
 const automaticMatches=useMemo(()=>data?.sculpts.filter(s=>s.linkStatus!=="linked").flatMap(s=>{
  const matches=catalogueKits.filter(k=>k.artistSlug===s.artistSlug&&nice(k.name)===nice(s.sculptName));
  return matches.length===1?[{sculpt:s,kit:matches[0]}]:[];
 })||[],[data?.sculpts,catalogueKits]);
 const potential=useMemo(()=>{
  const s=data?.sculpts.find(x=>x.id===linkSculpt);
  if(!s)return [];
  return catalogueKits.filter(x=>x.artistSlug===s.artistSlug).sort((a,b)=>Number(nice(b.name)===nice(s.sculptName))-Number(nice(a.name)===nice(s.sculptName))||a.name.localeCompare(b.name)).slice(0,130);
 },[catalogueKits,data?.sculpts,linkSculpt]);
 const wrapped=async(action:()=>Promise<unknown>)=>{setBusy(true);setError("");setNotice("");try{await action();await refresh()}catch(e){setError((e as Error).message)}finally{setBusy(false)}};
 async function createSculpt(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{id:string}>("production-sculpt-create",{artistSlug:issuerSlug,sculptName,officialUrl});setSculptName("");setOfficialUrl("");setSculptId(r.id);setNotice("Pre-release sculpt saved privately. Next, create its edition.")})}
 async function createEdition(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{id:string}>("production-edition-create",{sculptId,editionLabel,editionKind,declaredQuantity:editionKind==="limited"?Number(declaredQuantity):null});setEditionId(r.id);setNotice("Edition created. Request your first production run below.")})}
 async function requestRun(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{message:string}>("production-run-request",{editionId,quantity:requestedSize,confirmedNewIssue:ackNew,acknowledgeEditionChange:ackExpand});setNotice(r.message);setAckNew(false);setAckExpand(false)})}
 async function sendEmail(run:Run){await wrapped(async()=>{const r=await communityApi<{approvalId:string;message:string}>("production-prepare",{runId:run.id});setSelectedRun(run.id);setApprovalId(r.approvalId);setEmailCode("");setSession(null);setProgress(run.generatedCount);setExportDownloaded(false);setNotice(r.message)})}
 async function confirmEmail(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{sessionToken:string;quantity:number;status:string;generatedCount:number}>("production-confirm",{runId:selectedRun,approvalId,emailCode});setSession({runId:selectedRun,token:r.sessionToken,quantity:r.quantity,status:r.status});setProgress(r.generatedCount);setEmailCode("");setApprovalId("");setNotice(r.status==="ready"?"Email confirmed. Download the secure CSV below.":"Email confirmed. Start or resume generation using the button below.")})}
 async function generate(){
  if(!session)return;
  setBusy(true);setError("");setNotice("");
  try{
   let done=false,next=progress;
   for(let i=0;i<100&&!done;i++){
    const result=await communityApi<{generatedCount:number;done:boolean;quantity:number}>("production-next",{runId:session.runId,sessionToken:session.token});
    if(result.generatedCount<next)throw Error("The generator returned an earlier progress state. Please refresh.");
    next=result.generatedCount;setProgress(next);done=result.done;
   }
   if(!done)throw Error("Generation paused safely. You can resume this same production run.");
   setSession({...session,status:"ready"});setNotice("All "+session.quantity.toLocaleString("en-GB")+" distinct certificate codes are safely registered. Download your encrypted-backed CSV now.");
   await refresh();
  }catch(e){setError((e as Error).message+" Previously committed codes have not been lost; confirm by email again to resume if necessary.")}
  finally{setBusy(false)}
 }
 async function download(){
  if(!session)return;
  setBusy(true);setError("");setNotice("");setExportDownloaded(false);
  try{
   const run=data?.runs.find(r=>r.id===session.runId);
   const sculpt=run?runSculpt(run):null;
   const edition=data?.editions.find(x=>x.id===run?.editionId);
   const lines=["certificate_number,sculpt,edition,production_run,concealed_verification_code,verification_url"];
   let start=0;
   while(start<session.quantity){
    const r=await communityApi<{records:{number:number;code:string}[];nextStart:number;total:number}>("production-export-chunk",{runId:session.runId,sessionToken:session.token,start});
    if(!r.records.length||r.nextStart<=start||r.total!==session.quantity)throw Error("Incomplete encrypted export; no CSV was downloaded.");
    for(const record of r.records)lines.push([record.number,sculpt?.sculptName||"",edition?.editionLabel||"",run?.runNumber||1,record.code,"https://reborna.co/verify/"].map(safeCsv).join(","));
    start=r.nextStart;
   }
   if(lines.length!==session.quantity+1)throw Error("Export row count doesn't match your approved production quantity.");
   const blob=new Blob(["\uFEFF"+lines.join("\r\n")+"\r\n"],{type:"text/csv;charset=utf-8"});
   const url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="reborna-"+(sculpt?.sculptName||"sculpt").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,35)+"-run-"+(run?.runNumber||1)+"-"+session.quantity+"-certificates.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   setExportDownloaded(true);setNotice("Your complete "+session.quantity.toLocaleString("en-GB")+"-row CSV has been offered to your browser. Check your Downloads and back up the file before clearing the secure export.");
  }catch(e){setError((e as Error).message+" You can retry this download while the secure export is still available.")}
  finally{setBusy(false)}
 }
 async function archive(){
  if(!session||!exportDownloaded||!window.confirm("Have you checked the full CSV was saved and backed up? Clearing it permanently deletes our encrypted export. The issued codes will remain registered."))return;
  await wrapped(async()=>{const r=await communityApi<{message:string}>("production-export-archive",{runId:session.runId,sessionToken:session.token,confirmedSaved:true});setSession(null);setExportDownloaded(false);setNotice(r.message)});
 }
 async function correction(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{message:string}>("production-correction-request",{sculptId:editSculpt,sculptName:editName,officialUrl:editSource,justification:editNote});setNotice(r.message);setEditNote("")})}
 async function link(e:React.FormEvent){e.preventDefault();await wrapped(async()=>{const r=await communityApi<{message:string}>("production-link-propose",{sculptId:linkSculpt,kitSlug:linkKit,note:linkNote});setNotice(r.message);setLinkNote("")})}
 return <section className="rbrn-production" aria-label="Original sculpt production and edition studio">
  <span className="section-kicker">REBORNA · ORIGINAL ARTIST PRODUCTION STUDIO</span>
  <h3>From the sculpt to every original certificate.</h3>
  <p className="rbrn-sculptor-small">Maintain a private pre-release sculpt, declare its edition, and request the exact number of new certificates required. Our editorial team reviews real production requests before securely issuing up to 5,000 distinct codes. There is no charge during the pilot.</p>
  <div className="rbrn-cert-duplicate-warning"><AlertTriangle size={22}/><div><strong>Already generated certificates for this production run?</strong><p><strong>Do not request additional codes just to print or reprint the same certificates.</strong> Use the exact codes from your original CSV. A new code creates another usable certificate. A genuine new manufacturing run should be entered separately, with its own review and history.</p></div></div>
  {!data?<p>Checking your private studio…</p>:!issuerReady?<p className="rbrn-dash-notlive"><ShieldCheck size={22}/> An independently approved sculptor identity is required before creating production certificates. Use the profile-claim and founder identity-review process above.</p>:<>
   <div className="rbrn-production-steps">
    <details open={data.sculpts.length===0}>
     <summary><span>01</span><strong>Add your original sculpt</strong><small>Private, including pre-release work</small></summary>
     <form onSubmit={createSculpt}>
      <label>Authorised sculptor<select value={issuerSlug} onChange={e=>setIssuerSlug(e.target.value)}>{data.issuers.filter(x=>x.state==="active").map(x=><option key={x.artistSlug} value={x.artistSlug}>{x.artistName}</option>)}</select></label>
      <label>Original sculpt name<input required minLength={2} maxLength={120} value={sculptName} onChange={e=>setSculptName(e.target.value)} placeholder="The name of your new design"/></label>
      <label>Official source / studio page <small>Optional until release</small><input type="url" value={officialUrl} onChange={e=>setOfficialUrl(e.target.value)} placeholder="https://yourstudio.com/sculpt"/></label>
      <button disabled={busy} className="rbrn-community-primary" type="submit"><FilePlus2 size={15}/> Save private sculpt</button>
     </form>
    </details>
    <details open={data.sculpts.length>0&&data.editions.length===0}>
     <summary><span>02</span><strong>Declare an edition</strong><small>Limited size or open edition</small></summary>
     {data.sculpts.length===0?<p>Create a sculpt first.</p>:<form onSubmit={createEdition}>
      <label>Original sculpt<select required value={sculptId} onChange={e=>setSculptId(e.target.value)}><option value="">Choose a private sculpt</option>{data.sculpts.map(x=><option value={x.id} key={x.id}>{x.sculptName}</option>)}</select></label>
      <label>Edition name<input required maxLength={90} value={editionLabel} onChange={e=>setEditionLabel(e.target.value)} placeholder="e.g. First vinyl edition"/></label>
      <label>Edition classification<select value={editionKind} onChange={e=>setEditionKind(e.target.value as "limited"|"open")}><option value="limited">Limited · declared maximum</option><option value="open">Open production · no promised total</option></select></label>
      {editionKind==="limited"&&<label>Originally declared edition size<input required type="number" min={1} max={50000} value={declaredQuantity} onChange={e=>setDeclaredQuantity(e.target.value)}/></label>}
      <button disabled={busy} className="rbrn-community-primary" type="submit"><Layers3 size={15}/> Save edition</button>
     </form>}
    </details>
    <details open={data.editions.length>0&&data.runs.length===0}>
     <summary><span>03</span><strong>Request a production run</strong><small>Any exact quantity, 1–5,000 codes</small></summary>
     {data.editions.length===0?<p>Create an edition first.</p>:<form onSubmit={requestRun}>
      <label>Edition to produce<select required value={editionId} onChange={e=>{setEditionId(e.target.value);setAckNew(false);setAckExpand(false)}}><option value="">Choose an existing edition</option>{data.editions.map(x=><option value={x.id} key={x.id}>{data.sculpts.find(y=>y.id===x.sculptId)?.sculptName||"Sculpt"} · {x.editionLabel}</option>)}</select></label>
      {selectedEdition&&<div className="rbrn-production-note">Sculpt: <strong>{selectedEditionSculpt?.sculptName}</strong>. Previous planned or issued certificates: <strong>{existingQuantity.toLocaleString("en-GB")}</strong>. {selectedEdition.editionKind==="limited"?<>Original promised size: <strong>{selectedEdition.initiallyDeclaredQuantity?.toLocaleString("en-GB")}</strong>; current approved maximum: <strong>{selectedEdition.currentDeclaredQuantity?.toLocaleString("en-GB")}</strong>.</>:"This is an open edition."}</div>}
      <label>Number of NEW certificates for this production run<input required type="number" min={1} max={5000} step={1} value={runQuantity} onChange={e=>{setRunQuantity(e.target.value);setAckExpand(false)}}/></label>
      {increasing&&<label className="rbrn-production-check"><input required type="checkbox" checked={ackExpand} onChange={e=>setAckExpand(e.target.checked)}/> I understand this will increase the previously declared edition size. Reborna must explicitly review it and preserve the original declaration for collectors.</label>}
      <label className="rbrn-production-check"><input required type="checkbox" checked={ackNew} onChange={e=>setAckNew(e.target.checked)}/> These are genuinely NEW certificates for physical production, not replacements for codes already downloaded or printed.</label>
      <div className="rbrn-production-cost"><span>New codes requested: <strong>{Number.isInteger(requestedSize)&&requestedSize>=1?requestedSize.toLocaleString("en-GB"):"—"}</strong></span><strong>Today's total: $0.00</strong></div>
      <button disabled={busy||!editionId||!ackNew||(increasing&&!ackExpand)} className="rbrn-community-primary" type="submit"><ShieldCheck size={15}/> Request editorial approval</button>
      <p className="rbrn-sculptor-small">One outstanding request per sculptor; only one newly approved production run can begin per rolling 24 hours. Reprints use the original CSV and existing codes.</p>
     </form>}
    </details>
   </div>
   <section className="rbrn-production-runs">
    <h4>My production runs</h4>
    {data.runs.length===0?<p className="rbrn-sculptor-small">No production runs yet. Once you request one, its review and issuance status will appear here.</p>:data.runs.map(run=><article key={run.id}>
     <div className="rbrn-production-run-top"><div><strong>{runSculpt(run)?.sculptName||"Original sculpt"}</strong><small>{data.editions.find(x=>x.id===run.editionId)?.editionLabel} · Run {run.runNumber} · certificates {run.serialStart}–{run.serialStart+run.quantity-1}</small></div><span>{description[run.status]}</span></div>
     <p>{run.quantity.toLocaleString("en-GB")} certificates · {run.generatedCount.toLocaleString("en-GB")} issued · Submitted {dateLabel(run.submittedAt)}</p>
     {run.reviewNote&&<p className="rbrn-production-note">Editorial note: {run.reviewNote}</p>}
     {["approved","generating","ready"].includes(run.status)&&<button disabled={busy} type="button" onClick={()=>sendEmail(run)} className="rbrn-production-action"><MailCheck size={15}/>{run.status==="approved"?"Email confirmation to generate":run.status==="generating"?"Email confirmation to resume":"Email confirmation to download CSV"}</button>}
     {run.status==="archived"&&<p className="rbrn-sculptor-small">The complete codes were issued. The original encrypted export has been cleared; Reborna cannot reconstruct your CSV from the saved code hashes.</p>}
    </article>)}
   </section>
   {selectedRun&&approvalId&&<form className="rbrn-production-email" onSubmit={confirmEmail}><MailCheck size={23}/><h4>Email confirmation required</h4><p>Enter the eight-digit code sent to your verified email. It expires after 10 minutes. No secret certificate numbers are emailed; only your secure dashboard session can retrieve them.</p>
    <label>Approval code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" minLength={8} maxLength={8} value={emailCode} onChange={e=>setEmailCode(e.target.value.replace(/[^0-9]/g,""))} placeholder="12345678"/></label>
    <button disabled={busy||emailCode.length!==8} className="rbrn-community-primary">Confirm and unlock secure production</button>
   </form>}
   {session&&<section className="rbrn-production-export">
    <h4>Secure production session</h4><p>{progress.toLocaleString("en-GB")} of {session.quantity.toLocaleString("en-GB")} certificates registered.</p>
    <progress value={progress} max={session.quantity} aria-label="Secure certificate generation progress"/>
    {session.status!=="ready"?<button className="rbrn-community-primary" disabled={busy} onClick={generate} type="button"><RefreshCcw size={16}/>{busy?"Working securely…":"Generate / resume production"}</button>:<>
     <button className="rbrn-community-primary" disabled={busy} onClick={download} type="button"><Download size={16}/>{busy?"Decrypting secure CSV…":"Download complete certificate CSV"}</button>
     {exportDownloaded&&<button className="rbrn-community-secondary" disabled={busy} onClick={archive} type="button">I've safely downloaded and backed up my codes · Clear encrypted export</button>}
    </>}
    <p className="rbrn-sculptor-small">If you leave or the session expires, simply request a new email approval for this SAME run. Registered codes are never duplicated. Download remains available for seven days, unless you deliberately clear the encrypted export.</p>
   </section>}
   {automaticMatches.length>0&&<div className="rbrn-production-matches"><span className="section-kicker">NEW POTENTIAL CATALOGUE MATCHES</span><h4>Our catalogue may have found your original sculpt.</h4><p className="rbrn-sculptor-small">These suggestions come from independently sourced kit records as our scrapers and editorial catalogue expand. They are never linked automatically; please confirm the specific sculpt, then Reborna's editor will review it.</p>
    {automaticMatches.slice(0,8).map(x=><div key={x.sculpt.id}><span><strong>{x.sculpt.sculptName}</strong> → <Link href={"/kits/"+x.kit.slug+"/"} target="_blank">{x.kit.name} ↗</Link></span><button type="button" onClick={()=>{setLinkSculpt(x.sculpt.id);setLinkKit(x.kit.slug);document.getElementById("reborna-kit-link-form")?.scrollIntoView({behavior:"smooth",block:"center"})}}>Review and propose match</button></div>)}
   </div>}
   <details id="reborna-kit-link-form" className="rbrn-production-secondary">
    <summary><Link2 size={17}/> Connect a sculpt to its existing Reborna kit page</summary>
    <p>Reborna can suggest matches when our source catalogue grows. A similar sculpt name alone is insufficient: choose the correct page, confirm it's yours, then our editorial team must approve the link. Until then, certificates show the original sculptor's source, not a guessed product.</p>
    <form onSubmit={link}>
     <label>Private sculpt<select value={linkSculpt} required onChange={e=>{setLinkSculpt(e.target.value);setLinkKit("")}}><option value="">Select a sculpt</option>{data.sculpts.map(x=><option key={x.id} value={x.id}>{x.sculptName}</option>)}</select></label>
     {linkSculpt&&<><label>Possible source-backed Reborna listing<select required value={linkKit} onChange={e=>setLinkKit(e.target.value)}><option value="">Choose a matching original sculpt</option>{potential.map(x=><option key={x.slug} value={x.slug}>{x.name} · {x.slug}</option>)}</select></label>
      {linkKit&&<p className="rbrn-production-note"><Link href={"/kits/"+linkKit+"/"} target="_blank">Review this actual kit page ↗</Link></p>}
      {!potential.length&&<p className="rbrn-sculptor-small">No original kit records have been indexed for this sculptor yet. Our catalogue enrichment can find it after publication.</p>}</>}
     <label>Why is this the same original sculpt?<textarea required minLength={10} maxLength={450} value={linkNote} onChange={e=>setLinkNote(e.target.value)} placeholder="Official sculpt name, source page, edition or other corroboration"/></label>
     <button className="rbrn-community-primary" disabled={busy||!linkKit} type="submit">Send match for editorial review</button>
    </form>
   </details>
   <details className="rbrn-production-secondary">
    <summary><FolderOpen size={17}/> Correct your sculpt's name or source without losing codes</summary>
    <p>Changes to sculpts with issued certificates are independently reviewed and permanently audited. The code hash, original edition declaration and production-run history do not change.</p>
    <form onSubmit={correction}>
     <label>Choose sculpt<select required value={editSculpt} onChange={e=>{setEditSculpt(e.target.value);const s=data.sculpts.find(x=>x.id===e.target.value);setEditName(s?.sculptName||"");setEditSource(s?.officialUrl||"")}}><option value="">Select your sculpt</option>{data.sculpts.map(x=><option key={x.id} value={x.id}>{x.sculptName}</option>)}</select></label>
     <label>Corrected sculpt name<input required maxLength={120} minLength={2} value={editName} onChange={e=>setEditName(e.target.value)}/></label>
     <label>Updated official source <small>Optional until released</small><input type="url" value={editSource} onChange={e=>setEditSource(e.target.value)}/></label>
     <label>Reason for change<textarea required minLength={15} maxLength={600} value={editNote} onChange={e=>setEditNote(e.target.value)} placeholder="Spelling correction, changed studio website, or release details"/></label>
     <button disabled={busy||!editSculpt} className="rbrn-community-primary" type="submit">Request an audited correction</button>
    </form>
   </details>
   {data.proposals.some(x=>x.state==="pending")&&<p className="rbrn-production-note">{data.proposals.filter(x=>x.state==="pending").length} catalogue match request(s) awaiting Reborna editorial review.</p>}
   {data.corrections.some(x=>x.state==="pending")&&<p className="rbrn-production-note">{data.corrections.filter(x=>x.state==="pending").length} sculpt correction(s) awaiting editorial review.</p>}
  </>}
  {notice&&<p className="rbrn-community-feedback" role="status"><CheckCircle2 size={16}/>{notice}</p>}
  {error&&<p className="rbrn-community-feedback error" role="alert"><AlertTriangle size={16}/>{error}</p>}
  <p className="rbrn-sculptor-small">Concealed certificate codes follow the compact {fixedCodes} pattern, with approximately 60 bits of unpredictable randomness. Original source documentation and this registry do not guarantee the physical kit is genuine.</p>
 </section>;
}
