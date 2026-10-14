"use client";
import {useEffect,useState} from "react";
import {ArrowRight,CheckCircle2,Mail,Send,ShieldCheck} from "lucide-react";
import TurnstileChallenge from "./TurnstileChallenge";

type Category="general"|"artist"|"verification"|"community"|"supplier"|"events"|"report";
const categories:[Category,string][]=[
 ["general","Something else"],
 ["artist","Artist or original sculptor enquiry"],
 ["verification","Kit provenance or authenticity"],
 ["community","Accounts and community"],
 ["supplier","Materials supplier or partnership"],
 ["events","Events or Reborna Originals"],
 ["report","Report an issue with our information"]
];
export default function ContactForm(){
 const[name,setName]=useState(""),[email,setEmail]=useState(""),[category,setCategory]=useState<Category>("general"),[message,setMessage]=useState("");
 const[siteKey,setSiteKey]=useState(""),[token,setToken]=useState(""),[resetKey,setResetKey]=useState(0),[sending,setSending]=useState(false);
 const[error,setError]=useState(""),[success,setSuccess]=useState(""),[reference,setReference]=useState("");
 useEffect(()=>{let live=true;fetch('/api/community/status',{cache:'no-store'}).then(r=>r.json()).then(d=>{if(live)setSiteKey(d.turnstileSiteKey||"")}).catch(()=>{});return()=>{live=false}},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setError("");setSuccess("");
  if(!token){setError("Please complete the security check.");return}
  setSending(true);
  try{
   const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({name,email,category,message,turnstileToken:token,website:""})});
   const result=await r.json().catch(()=>({error:"Our contact service is temporarily unavailable."}));
   if(!r.ok)throw Error(result.error||"Your enquiry could not be saved.");
   setSuccess(result.message||"Thank you. We have received your message.");
   setReference(result.reference||"");setMessage("");
  }catch(e){setError((e as Error).message)}finally{setSending(false);setToken("");setResetKey(x=>x+1)}
 }
 return <div className="rbrn-contact-layout">
  <section className="rbrn-contact-main">
   <span className="section-kicker">WE'D LOVE TO HEAR FROM YOU</span>
   <h2>Drop us a little note<span className="period">.</span></h2>
   <p>Questions about a sculpt, a listing or the Reborna community? Send your enquiry and we'll make sure it reaches the right place.</p>
   {success?<div className="rbrn-contact-success" role="status"><CheckCircle2 size={28}/><h3>Message received.</h3><p>{success}</p>{reference&&<small>Your reference: {reference}</small>}<button type="button" onClick={()=>{setSuccess("");setReference("")}}>Send another message <ArrowRight size={14}/></button></div>:
    <form onSubmit={submit}>
     <div className="rbrn-contact-two-fields">
      <label className="rbrn-form-field">Your name<input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="How should we address you?"/></label>
      <label className="rbrn-form-field">Your email<input required type="email" maxLength={200} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Where can we reply?"/></label>
     </div>
     <label className="rbrn-form-field">What's this about?<select value={category} onChange={e=>setCategory(e.target.value as Category)}>{categories.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
     <label className="rbrn-form-field">Your message<textarea required minLength={25} maxLength={5000} rows={7} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us a little about what you need…"/></label>
     <label className="rbrn-contact-honey" aria-hidden="true">Website<input tabIndex={-1} type="text" autoComplete="off" name="website"/></label>
     <TurnstileChallenge siteKey={siteKey} action="contact" onVerify={setToken} resetKey={resetKey}/>
     {error&&<p className="rbrn-community-feedback error" role="alert">{error}</p>}
     <p className="rbrn-contact-fineprint">We use these details only to deal with your enquiry. No marketing emails, and your message isn't posted publicly. Please avoid including sensitive personal or payment information.</p>
     <button className="rbrn-community-primary" type="submit" disabled={sending||!token||message.trim().length<25}>{sending?"Sending your note…":"Send your message"} <Send size={16}/></button>
    </form>
   }
  </section>
  <aside className="rbrn-contact-side">
   <span className="section-kicker">A SMALL, INDEPENDENT TEAM</span>
   <h2>We're here for the details.</h2>
   <p>Reborna brings original sculpts, independent artists, specialist materials and the people who love them together in one place.</p>
   <div><Mail size={20}/><span><strong>General enquiries</strong><small>Ideas, corrections, collaborations and a friendly hello.</small></span></div>
   <div><ShieldCheck size={20}/><span><strong>Originality matters</strong><small>Tell us when an artist credit, attribution or product detail needs a closer look.</small></span></div>
   <div className="rbrn-contact-aside-note"><strong>A note on orders</strong><p>We currently link to original suppliers rather than fulfilling orders ourselves. For refunds, delivery or stock queries, please contact the retailer you purchased from.</p></div>
  </aside>
 </div>;
}
