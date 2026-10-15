/** Cloudflare Pages contact form endpoint.
 * Verified Turnstile -> private EU D1 -> Resend notification when configured.
 * Messages are safely queued in D1 even when transactional email delivery is unavailable.
 */
const TYPES={general:'General enquiry',artist:'Artists & sculptors',verification:'Kit verification',community:'Community & accounts',supplier:'Suppliers & partnerships',events:'Events & Studio Sessions',report:'Report a concern'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail=(reason,status=400)=>json({error:reason},status);
const encoder=new TextEncoder();
const trim=(x,n)=>typeof x==='string'?x.trim().slice(0,n):'';
const artistIntents={introduce:'Sculptor introduction',claim_profile:'Request to claim a profile',submit_sculpt:'Submit an original sculpt for review'};
function sourceUrl(value){if(value===null||value===undefined||value==='')return null;if(typeof value!=='string'||value.length>500)return false;try{const u=new URL(value.trim());if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port||!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(u.hostname)||u.hostname.endsWith('.local'))return false;return u.href}catch{return false}}

const html=(x)=>x.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function sha(s){const a=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(s)));return Array.from(a).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function throttle(db,request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const k=await sha('rbrn-contact-v1:'+ip);
 const epoch=Math.floor(Date.now()/1000);
 await db.prepare("INSERT INTO rate_limits(key,count,window_start) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_start<? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END").bind(k,epoch,epoch-3600,epoch-3600,epoch).run();
 const row=await db.prepare('SELECT count FROM rate_limits WHERE key=?').bind(k).first();
 return (row?.count||0)<=5;
}
async function verify(env,request,token){
 if(!env.TURNSTILE_SECRET_KEY||typeof token!=='string'||token.length<10||token.length>2048)return false;
 try{
  const form=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});
  const ip=request.headers.get('CF-Connecting-IP');if(ip)form.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!r.ok)return false;
  const result=await r.json();
  return result.success===true&&result.action==='contact'&&['reborna.co','www.reborna.co','reborna-site.pages.dev'].some(s=>result.hostname===s||result.hostname?.endsWith('.'+s));
 }catch{return false}
}
async function deliver(db,env,record){
 if(!env.RESEND_API_KEY||!env.COMMUNITY_MAIL_FROM)return;
 const body='<div style="max-width:620px;margin:0 auto;padding:26px;font-family:Arial,sans-serif;color:#5b4737"><h1 style="font-family:Georgia,serif;font-weight:normal">New Reborna enquiry</h1><p style="color:#947966">A visitor has contacted Reborna through the website.</p><p><strong>Category:</strong> '+html(TYPES[record.category])+'</p><p><strong>Name:</strong> '+html(record.name)+'</p><p><strong>Email:</strong> '+html(record.email)+'</p>'+(record.artistIntent?'<p><strong>Request:</strong> '+html(artistIntents[record.artistIntent])+'</p>':'')+(record.websiteUrl?'<p><strong>Official website:</strong> '+html(record.websiteUrl)+'</p>':'')+(record.socialUrl?'<p><strong>Social profile:</strong> '+html(record.socialUrl)+'</p>':'')+'<hr style="border:0;border-top:1px solid #e2d6ca"/><p style="white-space:pre-wrap;line-height:1.8">'+html(record.message).replace(/\n/g,'<br/>')+'</p><small>Enquiry reference '+record.id+'. This email is an automated notification. Replying from an ordinary clinic mailbox will show that mailbox as the sender.</small></div>';
 try{
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.RESEND_API_KEY},body:JSON.stringify({from:env.COMMUNITY_MAIL_FROM,to:['hi@thegorgeousclinic.co.uk'],subject:'Reborna enquiry · '+TYPES[record.category],html:body,text:'Reborna website enquiry\n\nCategory: '+TYPES[record.category]+'\nName: '+record.name+'\nEmail: '+record.email+'\nSculptor enquiry: '+(artistIntents[record.artistIntent]||'n/a')+'\nOfficial website: '+(record.websiteUrl||'not supplied')+'\nSocial profile: '+(record.socialUrl||'not supplied')+'\n\n'+record.message+'\n\nReference: '+record.id})});
  if(!r.ok)throw Error('Email provider unavailable ('+r.status+')');
  await db.prepare("UPDATE contact_enquiries SET delivery_status='sent',delivered_at=datetime('now'),delivery_error=NULL WHERE id=?").bind(record.id).run();
 }catch(e){console.error('Contact email delivery failed',String(e).slice(0,130));await db.prepare("UPDATE contact_enquiries SET delivery_status='failed',delivery_error='Delivery service unavailable' WHERE id=?").bind(record.id).run()}
}
export async function onRequest(context){
 const {request,env}=context,db=env.COMMUNITY_DB;
 if(request.method!=='POST')return fail('Method not allowed.',405);
 if(!db)return fail('Contact form is temporarily unavailable.',503);
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return fail('Invalid request origin.',403);
 const length=Number(request.headers.get('content-length')||0);
 if(length>12000)return fail('Message too large.',413);
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))return fail('JSON required.',415);
 try{
  const input=await request.json();
  // Honeypot catches unsophisticated spambots without storing their data.
  if(input&&typeof input.website==='string'&&input.website.trim())return json({ok:true,message:'Thanks for getting in touch.'},202);
  if(!(await throttle(db,request)))return fail('Too many enquiries. Please try again later.',429);
  const name=trim(input?.name,110),email=trim(input?.email,255).toLowerCase(),category=trim(input?.category,40),message=trim(input?.message,5500);
  if(name.length<2||name.length>100||!email||email.length>200||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!Object.hasOwn(TYPES,category)||message.length<25||message.length>5000)return fail('Please enter your name, a valid email, an enquiry category and a message of 25–5000 characters.');
  const artistIntent=category==='artist'&&Object.hasOwn(artistIntents,input?.artistIntent)?input.artistIntent:null;
  const websiteUrl=category==='artist'?sourceUrl(input?.websiteUrl):null,socialUrl=category==='artist'?sourceUrl(input?.socialUrl):null;
  if(websiteUrl===false||socialUrl===false)return fail('Please provide complete website and social URLs starting with https://, or leave the fields blank.');
  if(!(await verify(env,request,input?.turnstileToken)))return fail('Please complete the security check.',403);
  const id=crypto.randomUUID();
  await db.prepare('INSERT INTO contact_enquiries(id,sender_name,sender_email,category,message,website_url,social_url,artist_intent) VALUES(?,?,?,?,?,?,?,?)').bind(id,name,email,category,message,websiteUrl,socialUrl,artistIntent).run();
  context.waitUntil(deliver(db,env,{id,name,email,category,message,websiteUrl,socialUrl,artistIntent}));
  return json({ok:true,message:'Thank you. Your message has been received by Reborna.',reference:id.slice(0,8)},202);
 }catch(e){console.error('Contact request failed',String(e).slice(0,130));return fail('Your enquiry could not be saved. Please try again later.',500)}
}
