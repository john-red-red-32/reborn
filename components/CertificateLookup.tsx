"use client";
import {useState} from "react";
import Link from "next/link";
import {AlertCircle,CheckCircle2,History,LockKeyhole,Search,ShieldAlert,ShieldCheck} from "lucide-react";
import {useShopLocale} from "./LocaleProvider";

type CertificateResult={
 found:boolean;status?:"issued"|"revoked"|"issuer_suspended";artistName?:string;artistSlug?:string;
 sculptName?:string;editionNote?:string;officialSculptUrl?:string;issuedAt?:string;revokedAt?:string|null;
 previousChecks?:number;totalChecks?:number;firstCheckedAt?:string|null;lastCheckedAt?:string|null;
 repeatedChecksIn24h?:number;reviewSuggested?:boolean;message?:string;
 productionRun?:number;certificateNumber?:number;originallyDeclaredSize?:number|null;currentlyDeclaredSize?:number|null;editionKind?:string;kitUrl?:string|null;
};
const dateLabel=(s?:string|null,locale="en-GB")=>s?new Date(s.includes("T")?s.replace(" ","T")+"Z":s.replace(" ","T")+"Z").toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"}):"Not previously checked";
export default function CertificateLookup(){
 const{t,locale}=useShopLocale();
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
  <div className="verify-heading"><LockKeyhole size={20}/><div><h2>{t("Check a certificate code")}</h2><p>{t("Enter the compact 12-character code concealed beneath the tamper-evident or scratch-off seal on a certificate issued through Reborna.")}</p></div></div>
  <form onSubmit={submit}>
   <label htmlFor="cert-code">{t("REBORNA CERTIFICATE CODE")}</label>
   <div className="verify-entry"><input id="cert-code" required value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setData(null);setError("")}} placeholder="XXXX-XXXX-XXXX" maxLength={30} autoComplete="off" autoCapitalize="characters" spellCheck={false}/><button disabled={busy||!code.trim()} type="submit">{t(busy?"Checking…":"Check code")} <Search size={16}/></button></div>
  </form>
  {error&&<div className="verify-info" role="alert"><AlertCircle size={19}/><p>{error}</p></div>}
  {data&&!data.found&&<div className="verify-info" role="status"><AlertCircle size={19}/><div><strong>{t("No certificate issuance record found")}</strong><p>{t(data.message||"")}</p><p>{t("Check that you typed every character accurately. An unregistered code cannot be used to establish authenticity.")}</p></div></div>}
  {data?.found&&<section className="rbrn-cert-result" aria-live="polite">
   <div className={"rbrn-cert-result-status "+(data.status==="issued"?"valid":"warning")}>
    {data.status==="issued"?<CheckCircle2 size={23}/>:<ShieldAlert size={23}/>}
    <div><strong>{t(data.status==="issued"?"Code issued through Reborna":data.status==="revoked"?"This certificate code has been revoked":"The issuing sculptor account is suspended")}</strong>
    <p>{t(data.status==="issued"?"This is a recorded issuance by an approved sculptor account—not physical authentication.":data.status==="revoked"?"This code is no longer valid for issuance confirmation. Contact the original artist.":"The issuer's account is suspended pending review. Contact the artist or Reborna.")}</p></div>
   </div>
   <dl className="rbrn-cert-result-details">
    <div><dt>{t("Original sculptor")}</dt><dd><Link href={"/artists/"+data.artistSlug+"/"}>{data.artistName}</Link></dd></div>
    <div><dt>{t("Original sculpt")}</dt><dd>{data.sculptName}</dd></div>
    {data.editionNote&&<div><dt>{t("Edition")}</dt><dd>{data.editionNote}</dd></div>}
    {data.productionRun&&<div><dt>{t("Production run")}</dt><dd>{t("Run")} {data.productionRun}</dd></div>}
    {data.certificateNumber&&<div><dt>{t("Certificate number")}</dt><dd>{data.certificateNumber.toLocaleString("en-GB")}{data.editionKind==="limited"&&data.currentlyDeclaredSize?" / "+data.currentlyDeclaredSize.toLocaleString("en-GB"):""}</dd></div>}
    {data.originallyDeclaredSize&&data.currentlyDeclaredSize&&data.currentlyDeclaredSize>data.originallyDeclaredSize&&<div><dt>{t("Edition declaration history")}</dt><dd>Originally {data.originallyDeclaredSize.toLocaleString("en-GB")}; later expanded to {data.currentlyDeclaredSize.toLocaleString("en-GB")} after review</dd></div>}
    {data.kitUrl&&<div><dt>{t("Original sculpt catalogue")}</dt><dd><Link href={data.kitUrl}>{t("View the Reborna kit page ↗")}</Link></dd></div>}
    <div><dt>{t("Code issued")}</dt><dd>{dateLabel(data.issuedAt,locale)}</dd></div>
    <div><dt>{t("Checks before yours")}</dt><dd>{data.previousChecks?.toLocaleString("en-GB")??"0"}</dd></div>
    <div><dt>{t("First previous check")}</dt><dd>{dateLabel(data.firstCheckedAt,locale)}</dd></div>
    <div><dt>{t("Last previous check")}</dt><dd>{dateLabel(data.lastCheckedAt,locale)}</dd></div>
   </dl>
   {data.reviewSuggested&&<p className="rbrn-cert-review-warning"><History size={17}/> This code has been checked multiple times. That can happen legitimately, but you may want to ask the sculptor to investigate possible certificate reuse. Multiple checks alone do not establish counterfeiting.</p>}
   {data.officialSculptUrl&&<p className="rbrn-cert-source"><a href={data.officialSculptUrl} target="_blank" rel="noopener noreferrer nofollow">{t("Review the sculptor-supplied official source ↗")}</a></p>}
   <p className="rbrn-cert-physical-note"><ShieldCheck size={17}/> {data.message}</p>
  </section>}
  <div className="verify-how">
   <div><History size={21}/><strong>{t("Private, useful check history")}</strong><p>{t("Reborna records the number and date of prior checks to help spot possible certificate reuse. We do not show collectors' names or locations.")}</p></div>
   <div><ShieldCheck size={21}/><strong>{t("Independently approved sculptor issuers")}</strong><p>{t("Only sculptor accounts authorised after editorial identity review may request unique codes. Codes are free in the initial pilot.")}</p></div>
  </div>
 </div>;
}
