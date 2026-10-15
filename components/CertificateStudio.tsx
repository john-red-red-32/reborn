"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {CheckCircle2,Download,ExternalLink,FileKey2,ShieldAlert,ShieldCheck} from "lucide-react";
import {communityApi,dateLabel} from "../lib/community";

type Issuer={artistSlug:string;artistName:string;officialSourceUrl:string;state:"active"|"suspended";authorisedAt:string};
type Batch={id:string;artistSlug:string;artistName:string;sculptName:string;editionNote:string;officialSculptUrl:string;quantity:number;pricePerCodeMinor:number;currency:"USD";issuedAt:string};
type CodeRecord={id:string;batchId:string;hint:string;state:"active"|"revoked";lookupCount:number;firstCheckedAt:string|null;lastCheckedAt:string|null;revokedAt:string|null};
type StudioResult={issuers:Issuer[];batches:Batch[];codes:CodeRecord[];pricing:{currency:"USD";pricePerCodeMinor:number;freePilot:boolean};canIssue:boolean};
type NewBatch={batchId:string;artistName:string;sculptName:string;quantity:number;codes:string[];pricePerCodeMinor:0};
const initial={artistSlug:"",sculptName:"",editionNote:"",officialSculptUrl:"",quantity:5};

export default function CertificateStudio(){
 const [data,setData]=useState<StudioResult|null>(null);
 const [form,setForm]=useState(initial),[issued,setIssued]=useState<NewBatch|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const [revokeReason,setRevokeReason]=useState<Record<string,string>>({}),[expandedBatch,setExpandedBatch]=useState("");
 const load=async()=>{const r=await communityApi<StudioResult>("certificate-studio");setData(r);setForm(f=>({...f,artistSlug:r.issuers.find(x=>x.state==="active")?.artistSlug||f.artistSlug}))};
 useEffect(()=>{void load().catch(e=>setError((e as Error).message))},[]);
 const selected=data?.issuers.find(x=>x.artistSlug===form.artistSlug&&x.state==="active");
 async function issue(e:React.FormEvent){
  e.preventDefault();
  if(issued&&!window.confirm("You haven't cleared the previous one-time codes. Did you already download them?"))return;
  setBusy(true);setError("");setNotice("");
  try{
   const r=await communityApi<NewBatch>("certificate-issue",{...form});
   setIssued(r);await load();
   setNotice("Your codes have been generated securely. Download your certificate list now—full codes cannot be recovered later.");
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 function download(){
  if(!issued)return;
  const rows=["code,verification_page",...issued.codes.map(c=>c+",https://reborna.co/verify/")];
  const content="\uFEFF"+rows.join("\r\n")+"\r\n";
  const blob=new Blob([content],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="reborna-certificates-"+issued.batchId.slice(0,8)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  setNotice("The code file has been offered to your browser. Check your downloads and store it securely before clearing this screen.");
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
  <div className="rbrn-cert-pilot"><ShieldCheck size={21}/><div><strong>Free during the pilot · $0.00 per code</strong><p>We may introduce a $1-per-code fee later, with clear pricing before any purchase. There is no checkout or subscription today. New batches are limited to 25 codes at a time and 100 per day.</p></div></div>
  {!data?<p className="rbrn-sculptor-small">Loading approved artist access…</p>:!data.canIssue?<div className="rbrn-dash-notlive"><FileKey2 size={24}/><div><strong>Artist authorisation required before code issuance.</strong><p>Your Reborna member role isn't proof of identity. First submit a profile claim with official sources, then complete independent review with our editorial team. We won't generate any certificates for an unverified account.</p>{data.issuers.some(x=>x.state==="suspended")&&<p>One or more issuer permissions are suspended pending investigation.</p>}</div></div>:<>
   <form onSubmit={issue} className="rbrn-cert-issue-form">
    <label>Approved sculptor account<select value={form.artistSlug} onChange={e=>setForm(f=>({...f,artistSlug:e.target.value}))}>
     {data.issuers.filter(x=>x.state==="active").map(x=><option value={x.artistSlug} key={x.artistSlug}>{x.artistName}</option>)}
    </select></label>
    <label>Original sculpt name<input required minLength={2} maxLength={120} value={form.sculptName} onChange={e=>setForm(f=>({...f,sculptName:e.target.value}))} placeholder="Your original sculpt's published name"/></label>
    <label>Official sculpt page <small>Required for each batch</small><input type="url" required maxLength={500} value={form.officialSculptUrl} onChange={e=>setForm(f=>({...f,officialSculptUrl:e.target.value}))} placeholder="https://yourstudio.com/sculpt"/></label>
    <div className="rbrn-sculptor-form-pair">
     <label>Edition or production note <small>Optional, from your records</small><input maxLength={90} value={form.editionNote} onChange={e=>setForm(f=>({...f,editionNote:e.target.value}))} placeholder="e.g. First vinyl production"/></label>
     <label>How many codes?<select value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:Number(e.target.value)}))}>{[1,2,5,10,15,20,25].map(q=><option key={q} value={q}>{q} {q===1?"code":"codes"} · Free</option>)}</select></label>
    </div>
    <p className="rbrn-sculptor-small">The codes will be linked to <strong>{selected?.artistName}</strong>. You are responsible for applying the right code to the right legitimate certificate. Never place full codes on a publicly visible listing.</p>
    <button type="submit" className="rbrn-community-primary" disabled={busy||!selected}>{busy?"Generating secure codes…":"Generate free certificate codes"}</button>
   </form>
  </>}
  {issued&&<div className="rbrn-cert-new-batch" role="status">
   <CheckCircle2 size={25}/><h4>{issued.quantity} code{issued.quantity>1?"s":""} created for {issued.sculptName}.</h4>
   <p><strong>Important:</strong> These full codes are shown only now, for one-time download. We save their secure hashes but cannot recover the originals. Store the file safely and print each code under a scratch-off area; a visible code can be copied.</p>
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
