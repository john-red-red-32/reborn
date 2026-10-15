"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {AlertTriangle,CheckCircle2,Download,ExternalLink,FileKey2,MailCheck,ShieldAlert,ShieldCheck} from "lucide-react";
import {communityApi,dateLabel} from "../lib/community";

type Issuer={artistSlug:string;artistName:string;officialSourceUrl:string;state:"active"|"suspended";authorisedAt:string};
type Batch={id:string;artistSlug:string;artistName:string;sculptName:string;editionNote:string;officialSculptUrl:string;quantity:number;pricePerCodeMinor:number;currency:"USD";issuedAt:string};
type CodeRecord={id:string;batchId:string;hint:string;state:"active"|"revoked";lookupCount:number;firstCheckedAt:string|null;lastCheckedAt:string|null;revokedAt:string|null};
type StudioResult={issuers:Issuer[];batches:Batch[];codes:CodeRecord[];pricing:{currency:"USD";pricePerCodeMinor:number;freePilot:boolean};canIssue:boolean};
type NewBatch={batchId:string;artistName:string;sculptName:string;quantity:number;codes:string[];pricePerCodeMinor:0};
const initial={artistSlug:"",sculptName:"",editionNote:"",officialSculptUrl:"",quantity:5,confirmedNewIssue:false};

export default function CertificateStudio(){
 const [data,setData]=useState<StudioResult|null>(null);
 const [form,setForm]=useState(initial),[issued,setIssued]=useState<NewBatch|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const [step,setStep]=useState<"details"|"email">("details"),[approvalId,setApprovalId]=useState(""),[emailCode,setEmailCode]=useState("");
 const [revokeReason,setRevokeReason]=useState<Record<string,string>>({}),[expandedBatch,setExpandedBatch]=useState("");
 const load=async()=>{const r=await communityApi<StudioResult>("certificate-studio");setData(r);setForm(f=>({...f,artistSlug:r.issuers.find(x=>x.state==="active")?.artistSlug||f.artistSlug}))};
 useEffect(()=>{void load().catch(e=>setError((e as Error).message))},[]);
 const selected=data?.issuers.find(x=>x.artistSlug===form.artistSlug&&x.state==="active");
 async function prepare(e:React.FormEvent){
  e.preventDefault();
  if(issued&&!window.confirm("Have you securely downloaded your previous one-time codes? New issuance will clear that on-screen list."))return;
  setBusy(true);setError("");setNotice("");
  try{
   const r=await communityApi<{approvalId:string;message:string}>("certificate-prepare",{...form});
   setApprovalId(r.approvalId);setEmailCode("");setStep("email");setNotice(r.message);
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 async function issue(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError("");setNotice("");
  try{
   const r=await communityApi<NewBatch>("certificate-issue",{...form,approvalId,emailCode});
   setIssued(r);await load();setForm(f=>({...f,sculptName:"",editionNote:"",officialSculptUrl:"",confirmedNewIssue:false}));
   setEmailCode("");setApprovalId("");setStep("details");
   setNotice("Certificate codes generated. Download your CSV now. A confirmation email contains the quantity and sculpt name, never your secret codes.");
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 function download(){
  if(!issued)return;
  const rows=["code,verification_page",...issued.codes.map(c=>c+",https://reborna.co/verify/")];
  const content="\uFEFF"+rows.join("\r\n")+"\r\n";
  const blob=new Blob([content],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="reborna-certificates-"+issued.batchId.slice(0,8)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  setNotice("The CSV has been offered to your browser. Check your downloads and store it securely; only an issuance notice, not the codes, is emailed.");
 }
 async function revoke(id:string){
  const reason=(revokeReason[id]||"").trim();
  if(reason.length<12){setError("Please write a meaningful reason for revoking this code.");return}
  if(!window.confirm("Revoke this certificate code permanently? Its earlier check history will remain visible."))return;
  setBusy(true);setError("");
  try{await communityApi("certificate-revoke",{id,reason});await load();setNotice("Certificate revoked. Its issuance and lookup history remain recorded.")}catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 return <section className="rbrn-cert-studio" aria-label="Artist certificate codes">
  <span className="section-kicker">CERTIFICATE REGISTRY · ORIGINAL ARTISTS</span>
  <h3>Certificates of originality.</h3>
  <p className="rbrn-sculptor-small">Secure codes issued by independently approved original sculptors can be printed on a certificate or placed beneath a scratch-off sticker. Collectors can then check the issuing artist and usage history at <Link href="/verify/">Reborna Verify</Link>.</p>
  <div className="rbrn-cert-pilot"><ShieldCheck size={21}/><div><strong>Free during the pilot · $0.00 per code</strong><p>We may introduce a $1-per-code fee later. There is no checkout today. This initial pilot supports 1–25 codes per real batch and one completed issuance per rolling 24 hours; larger editions will use the upcoming reviewed bulk workflow.</p></div></div>
  {!data?<p className="rbrn-sculptor-small">Loading approved artist access…</p>:!data.canIssue?<div className="rbrn-dash-notlive"><FileKey2 size={24}/><div><strong>Artist authorisation required before code issuance.</strong><p>Your Reborna member role isn't proof of identity. First submit a profile claim with official sources, then complete independent review with our editorial team. We won't generate any certificates for an unverified account.</p>{data.issuers.some(x=>x.state==="suspended")&&<p>One or more issuer permissions are suspended pending investigation.</p>}</div></div>:<>
   <form onSubmit={step==="details"?prepare:issue} className="rbrn-cert-issue-form">
    <div className="rbrn-cert-duplicate-warning" role="note"><AlertTriangle size={21}/><div><strong>Already generated codes for this production run?</strong><p><strong>Do not generate another batch just to reprint certificates.</strong> Reuse the exact codes from the original CSV. New codes create additional valid certificates, not copies of the original codes. If you lost the original file, contact Reborna about revocation and reissuance.</p></div></div>
    <label>Approved sculptor account<select disabled={step==="email"} value={form.artistSlug} onChange={e=>setForm(f=>({...f,artistSlug:e.target.value}))}>
     {data.issuers.filter(x=>x.state==="active").map(x=><option value={x.artistSlug} key={x.artistSlug}>{x.artistName}</option>)}
    </select></label>
    <label>Original sculpt name<input required minLength={2} maxLength={120} disabled={step==="email"} value={form.sculptName} onChange={e=>setForm(f=>({...f,sculptName:e.target.value}))} placeholder="Your original sculpt's published name"/></label>
    <label>Official sculpt page <small>Required for each batch</small><input type="url" required maxLength={500} disabled={step==="email"} value={form.officialSculptUrl} onChange={e=>setForm(f=>({...f,officialSculptUrl:e.target.value}))} placeholder="https://yourstudio.com/sculpt"/></label>
    <div className="rbrn-sculptor-form-pair">
     <label>Edition or production note <small>Optional, from your records</small><input maxLength={90} disabled={step==="email"} value={form.editionNote} onChange={e=>setForm(f=>({...f,editionNote:e.target.value}))} placeholder="e.g. First vinyl production"/></label>
     <label>How many codes?<select disabled={step==="email"} value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:Number(e.target.value)}))}>{[1,2,5,10,15,20,25].map(q=><option key={q} value={q}>{q} {q===1?"code":"codes"} · Free</option>)}</select></label>
    </div>
    <p className="rbrn-sculptor-small">The codes will be linked to <strong>{selected?.artistName}</strong>. You are responsible for applying the right code to the right legitimate certificate. Keep each compact code concealed under a tamper-evident peel-away or scratch-off seal; never print it visibly on a public certificate photograph.</p>
    {step==="details"?<><label className="rbrn-cert-attestation"><input required type="checkbox" checked={form.confirmedNewIssue} onChange={e=>setForm(f=>({...f,confirmedNewIssue:e.target.checked}))}/> I confirm these are NEW certificates, not a reprint or replacement of codes already generated for this production run.</label><button type="submit" className="rbrn-community-primary" disabled={busy||!selected||!form.confirmedNewIssue}><MailCheck size={16}/>{busy?"Sending approval email…":"Email me an approval code"}</button></>
    :<div className="rbrn-cert-email-confirm">
     <MailCheck size={22}/><h4>Check your verified email address.</h4>
     <p>Enter the eight-digit approval code we sent you. It expires after 10 minutes. Your CSV will be available for one-time download here after confirmation; it will <strong>not</strong> be attached to the email. Check your spam folder if you cannot see the message.</p>
     <label>Eight-digit approval code<input required autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{8}" maxLength={8} minLength={8} value={emailCode} disabled={busy} onChange={e=>setEmailCode(e.target.value.replace(/[^0-9]/g,""))} placeholder="12345678"/></label>
     <button type="submit" disabled={busy||emailCode.length!==8} className="rbrn-community-primary">{busy?"Confirming and issuing…":"Confirm email and generate codes"}</button>
     <button className="rbrn-community-secondary" disabled={busy} type="button" onClick={()=>{setStep("details");setApprovalId("");setEmailCode("");setError("");setNotice("Check the details and request a new approval code if needed.")}}>Change details or resend approval</button>
    </div>}
   </form>
  </>}
  {issued&&<div className="rbrn-cert-new-batch" role="status">
   <CheckCircle2 size={25}/><h4>{issued.quantity} code{issued.quantity>1?"s":""} created for {issued.sculptName}.</h4>
   <p><strong>Important:</strong> These full codes are shown only now, for one-time download. We save their secure hashes but cannot recover the originals. Store the file safely and conceal each short code underneath a tamper-evident peel-away or scratch-off seal. Reprinting an existing certificate must use the SAME code; creating new codes does not replace old ones.</p>
   <button type="button" className="rbrn-community-primary" onClick={download}><Download size={15}/> Download one-time CSV</button>
   <p className="rbrn-cert-code-preview">{issued.codes.slice(0,3).join(" · ")}{issued.codes.length>3?" · …":""}</p>
   <button className="rbrn-community-secondary" type="button" onClick={()=>{if(window.confirm("Have you safely downloaded and backed up these codes? Full codes cannot be recovered from Reborna.")){setIssued(null);setNotice("The private code list has been cleared from this page.")}}}>I've saved them · Clear from screen</button>
  </div>}
  {data&&data.batches.length>0&&<section className="rbrn-cert-history">
   <h4>Your past certificate batches.</h4>
   <p className="rbrn-sculptor-small">You can see code endings, checks and revocation status here, but not retrieve previously issued full codes.</p>
   {data.batches.map(batch=>{
    const codes=data.codes.filter(x=>x.batchId===batch.id);
    const open=expandedBatch===batch.id;
    return <article key={batch.id}>
     <button className="rbrn-cert-batch-title" type="button" aria-expanded={open} onClick={()=>setExpandedBatch(open?"":batch.id)}><span><strong>{batch.sculptName}</strong><small>{batch.artistName} · {batch.quantity} codes · {dateLabel(batch.issuedAt)}</small></span><span>{open?"Hide codes":"View history"}</span></button>
     {open&&<div className="rbrn-cert-batch-details"><a href={batch.officialSculptUrl} rel="noopener noreferrer nofollow" target="_blank">Official sculpt source <ExternalLink size={13}/></a>
      {codes.map(cert=><div key={cert.id} className="rbrn-cert-code-row"><div><strong>Code ending …{cert.hint}</strong><small>{cert.state==="revoked"?"Revoked":"Active"} · {cert.lookupCount} collector check{cert.lookupCount===1?"":"s"}{cert.lastCheckedAt?" · Last "+dateLabel(cert.lastCheckedAt):""}</small></div>{cert.state==="active"&&<div className="rbrn-cert-revoke"><input aria-label={"Reason for revoking code ending "+cert.hint} maxLength={300} placeholder="Reason if compromised" value={revokeReason[cert.id]||""} onChange={e=>setRevokeReason(v=>({...v,[cert.id]:e.target.value}))}/><button type="button" disabled={busy} onClick={()=>revoke(cert.id)}>Revoke</button></div>}</div>)}
     </div>}
    </article>
   })}
  </section>}
  {error&&<p className="rbrn-community-feedback error" role="alert"><ShieldAlert size={16}/>{error}</p>}
  {notice&&<p className="rbrn-community-feedback" role="status"><CheckCircle2 size={16}/>{notice}</p>}
 </section>;
}
