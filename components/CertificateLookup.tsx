"use client";
import {useState} from "react";
import Link from "next/link";
import {AlertCircle,CheckCircle2,History,LockKeyhole,Search,ShieldAlert,ShieldCheck} from "lucide-react";

type CertificateResult={
 found:boolean;status?:"issued"|"revoked"|"issuer_suspended";artistName?:string;artistSlug?:string;
 sculptName?:string;editionNote?:string;officialSculptUrl?:string;issuedAt?:string;revokedAt?:string|null;
 previousChecks?:number;totalChecks?:number;firstCheckedAt?:string|null;lastCheckedAt?:string|null;
 repeatedChecksIn24h?:number;reviewSuggested?:boolean;message?:string;
 productionRun?:number;certificateNumber?:number;originallyDeclaredSize?:number|null;currentlyDeclaredSize?:number|null;editionKind?:string;kitUrl?:string|null;
};
const dateLabel=(s?:string|null)=>s?new Date(s.includes("T")?s.replace(" ","T")+"Z":s.replace(" ","T")+"Z").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):"Not previously checked";
export default function CertificateLookup(){
 const [code,setCode]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[data,setData]=useState<CertificateResult|null>(null);
 async function submit(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError("");setData(null);
  try{
   const r=await fetch("/api/community/certificate-lookup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code}),cache:"no-store",credentials:"same-origin"});
   const result=await r.json().catch(()=>({error:"The certificate service could not be reached."}));
   if(!r.ok)throw Error(result.error||"This code could not be checked.");
   setData(result as CertificateResult);
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 return <div className="verify-card">
  <div className="verify-heading"><LockKeyhole size={20}/><div><h2>Check a certificate code</h2><p>Enter the compact 12-character code concealed beneath the tamper-evident or scratch-off seal on a certificate issued through Reborna.</p></div></div>
  <form onSubmit={submit}>
   <label htmlFor="cert-code">REBORNA CERTIFICATE CODE</label>
   <div className="verify-entry"><input id="cert-code" required value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setData(null);setError("")}} placeholder="XXXX-XXXX-XXXX" maxLength={30} autoComplete="off" autoCapitalize="characters" spellCheck={false}/><button disabled={busy||!code.trim()} type="submit">{busy?"Checking…":"Check code"} <Search size={16}/></button></div>
  </form>
  {error&&<div className="verify-info" role="alert"><AlertCircle size={19}/><p>{error}</p></div>}
  {data&&!data.found&&<div className="verify-info" role="status"><AlertCircle size={19}/><div><strong>No certificate issuance record found</strong><p>{data.message}</p><p>Check that you typed every character accurately. An unregistered code cannot be used to establish authenticity.</p></div></div>}
  {data?.found&&<section className="rbrn-cert-result" aria-live="polite">
   <div className={"rbrn-cert-result-status "+(data.status==="issued"?"valid":"warning")}>
    {data.status==="issued"?<CheckCircle2 size={23}/>:<ShieldAlert size={23}/>}
    <div><strong>{data.status==="issued"?"Code issued through Reborna":data.status==="revoked"?"This certificate code has been revoked":"The issuing sculptor account is suspended"}</strong>
    <p>{data.status==="issued"?"This is a recorded issuance by an approved sculptor account—not physical authentication.":data.status==="revoked"?"This code is no longer valid for issuance confirmation. Contact the original artist.":"The issuer's account is suspended pending review. Contact the artist or Reborna."}</p></div>
   </div>
   <dl className="rbrn-cert-result-details">
    <div><dt>Original sculptor</dt><dd><Link href={"/artists/"+data.artistSlug+"/"}>{data.artistName}</Link></dd></div>
    <div><dt>Original sculpt</dt><dd>{data.sculptName}</dd></div>
    {data.editionNote&&<div><dt>Edition</dt><dd>{data.editionNote}</dd></div>}
    {data.productionRun&&<div><dt>Production run</dt><dd>Run {data.productionRun}</dd></div>}
    {data.certificateNumber&&<div><dt>Certificate number</dt><dd>{data.certificateNumber.toLocaleString("en-GB")}{data.editionKind==="limited"&&data.currentlyDeclaredSize?" / "+data.currentlyDeclaredSize.toLocaleString("en-GB"):""}</dd></div>}
    {data.originallyDeclaredSize&&data.currentlyDeclaredSize&&data.currentlyDeclaredSize>data.originallyDeclaredSize&&<div><dt>Edition declaration history</dt><dd>Originally {data.originallyDeclaredSize.toLocaleString("en-GB")}; later expanded to {data.currentlyDeclaredSize.toLocaleString("en-GB")} after review</dd></div>}
    {data.kitUrl&&<div><dt>Original sculpt catalogue</dt><dd><Link href={data.kitUrl}>View the Reborna kit page ↗</Link></dd></div>}
    <div><dt>Code issued</dt><dd>{dateLabel(data.issuedAt)}</dd></div>
    <div><dt>Checks before yours</dt><dd>{data.previousChecks?.toLocaleString("en-GB")??"0"}</dd></div>
    <div><dt>First previous check</dt><dd>{dateLabel(data.firstCheckedAt)}</dd></div>
    <div><dt>Last previous check</dt><dd>{dateLabel(data.lastCheckedAt)}</dd></div>
   </dl>
   {data.reviewSuggested&&<p className="rbrn-cert-review-warning"><History size={17}/> This code has been checked multiple times. That can happen legitimately, but you may want to ask the sculptor to investigate possible certificate reuse. Multiple checks alone do not establish counterfeiting.</p>}
   {data.officialSculptUrl&&<p className="rbrn-cert-source"><a href={data.officialSculptUrl} target="_blank" rel="noopener noreferrer nofollow">Review the sculptor-supplied official source ↗</a></p>}
   <p className="rbrn-cert-physical-note"><ShieldCheck size={17}/> {data.message}</p>
  </section>}
  <div className="verify-how">
   <div><History size={21}/><strong>Private, useful check history</strong><p>Reborna records the number and date of prior checks to help spot possible certificate reuse. We do not show collectors' names or locations.</p></div>
   <div><ShieldCheck size={21}/><strong>Independently approved sculptor issuers</strong><p>Only sculptor accounts authorised after editorial identity review may request unique codes. Codes are free in the initial pilot.</p></div>
  </div>
 </div>;
}
