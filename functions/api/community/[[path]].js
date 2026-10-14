import {publicNameError} from '../../../lib/community-name-safety.mjs';

/* Reborna Community API — Cloudflare Pages Functions + isolated D1.
 * Static Next.js pages call same-origin /api/community/*.
 * Requires COMMUNITY_DB D1 binding. Public signup requires configured transactional email.
 */
const ROLES=['collector','reborn_artist','sculptor','supplier'];
const INTERESTS=['kits','finished_dolls','high_end_dolls','materials','techniques','events','authenticity','selling'];
const CATEGORIES=['general','kits','painting','mohair','silicone','authenticity','showcase','marketplace'];
const encoder=new TextEncoder();
const COOKIE='rb_session';
// Cloudflare Workers rejects WebCrypto PBKDF2 calls above 100,000 iterations.
// Work factor is stored per user; do not silently raise it above the edge runtime ceiling.
const ITERATIONS=100000;
const now=()=>Math.floor(Date.now()/1000);
function response(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})}
const failure=(message,status=400)=>response({error:message},status);
function bytes(length){const a=new Uint8Array(length);crypto.getRandomValues(a);return a}
function b64(a){return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){const raw=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0))}
async function sha(value){return b64(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}
async function passwordHash(password,salt,iterations=ITERATIONS){
 if(!Number.isInteger(iterations)||iterations<1||iterations>100000)throw Error('Unsupported password-hashing work factor');
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unb64(salt),iterations,hash:'SHA-256'},key,256)));
}
function safeEqual(a,b){if(!a||!b||a.length!==b.length)return false;let out=0;for(let i=0;i<a.length;i++)out|=a.charCodeAt(i)^b.charCodeAt(i);return out===0}
function cookie(token,maxAge){return COOKIE+'='+token+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age='+maxAge}
function clearCookie(){return cookie('',0)}
async function readJson(request){if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw Error('Send JSON data.');const n=Number(request.headers.get('content-length')||0);if(n>30000)throw Error('Request too large.');return request.json()}
function clean(value,length){return typeof value==='string'?value.trim().slice(0,length):''}
function strings(value,allowed){return Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&allowed.includes(x)))]:[]}
function validHandle(s){return /^[a-z][a-z0-9_]{2,23}$/.test(s)&&!['admin','support','moderator','reborna','official','staff','system','help'].includes(s)}
// Saved items are only canonical catalogue paths; never external redirect URLs.
function canonicalSavedItem(raw){
 if(!raw||typeof raw!=='object')return null;
 const type=raw.type,path=raw.path,title=clean(raw.title,150),subtitle=clean(raw.subtitle,160);
 if(!['kit','material','artist','archive'].includes(type)||!title||!path||typeof path!=='string')return null;
 const patterns={kit:/^\/kits\/[a-z0-9-]{2,90}\/?$/,material:/^\/materials\/[a-z0-9-]{2,70}\/[a-z0-9-]{2,100}\/?$/,artist:/^\/artists\/[a-z0-9-]{2,90}\/?$/,archive:/^\/artists\/[a-z0-9-]{2,90}\/\?sculpt=[a-z0-9-]{2,90}$/};
 if(!patterns[type].test(path))return null;
 const url=typeof raw.imageUrl==='string'?raw.imageUrl.trim():'';
 let imageUrl=null;
 if(url&&url.length<=950){
  try{
   const parsed=new URL(url,'https://reborna.co');
   if(['https:'].includes(parsed.protocol)&&!parsed.username&&!parsed.password)imageUrl=parsed.href;
  }catch{}
 }
 return {type,path:path.includes('?')?path:(path.endsWith('/')?path:path+'/'),title,subtitle,imageUrl};
}
const cleanProjectPath=value=>typeof value==='string'&&/^\/kits\/[a-z0-9-]{2,90}\/?$/.test(value)?(value.endsWith('/')?value:value+'/'):null;
function validatedProducts(p){if(!Array.isArray(p))return[];return p.slice(0,3).filter(v=>v&&typeof v.path==='string'&&typeof v.type==='string'&&((v.type==='kit'&&/^\/kits\/[a-z0-9-]+\/?$/.test(v.path))||(v.type==='material'&&/^\/materials\/[a-z0-9-]+\/[a-z0-9-]+\/?$/.test(v.path)))).map(v=>({path:v.path.endsWith('/')?v.path:v.path+'/',type:v.type})).filter((v,i,a)=>a.findIndex(x=>x.path===v.path)===i)}
function avatarLink(id,version){return version?'/api/community/avatar?id='+encodeURIComponent(id)+'&v='+encodeURIComponent(version):null}
function publicUser(u){return {id:u.id,handle:u.handle,displayName:u.display_name,bio:u.bio||'',editorial:!!u.is_editorial,allowMessages:!!u.allow_messages,createdAt:u.created_at,avatarUrl:avatarLink(u.id,u.avatar_version)}}
async function getUser(db,request){const v=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));if(!v)return null;const raw=v.slice(COOKIE.length+1);if(!/^[\w-]{40,100}$/.test(raw))return null;const h=await sha(raw);return db.prepare("SELECT u.*,av.version AS avatar_version FROM sessions s JOIN users u ON u.id=s.user_id LEFT JOIN profile_avatars av ON av.user_id=u.id WHERE s.token_hash=? AND s.expires_at>datetime('now') AND u.status='active' AND u.email_verified_at IS NOT NULL").bind(h).first()}
async function session(db,userId){const token=b64(bytes(40)),hash=await sha(token);await db.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,datetime('now','+30 days'))").bind(hash,userId).run();return cookie(token,30*86400)}
async function throttle(db,request,action,limit,window=900){const ip=request.headers.get('cf-connecting-ip')||'unknown';const key=await sha('reborna-ratelimit-v1:'+action+':'+ip);const epoch=now();await db.prepare("INSERT INTO rate_limits(key,count,window_start) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_start<? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END").bind(key,epoch,epoch-window,epoch-window,epoch).run();const row=await db.prepare("SELECT count FROM rate_limits WHERE key=?").bind(key).first();return row.count<=limit}
function originValid(request){const url=new URL(request.url),origin=request.headers.get('origin');return !origin||origin===url.origin}
function emailReady(env){return !!(env.COMMUNITY_MAIL_FROM&&(env.RESEND_API_KEY||env.EMAIL))}
async function sendEmail(env,email,subject,html){
 if(!emailReady(env))throw Error('Email provider not configured');
 if(env.EMAIL){await env.EMAIL.send({from:env.COMMUNITY_MAIL_FROM,to:email,subject,html,text:html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&')});return}
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.COMMUNITY_MAIL_FROM,to:[email],subject,html})});
 if(!r.ok)throw Error('Email temporarily unavailable');
}
async function recordSignupIssue(db,stage,reason){
 if(!db)return;
 try{
  // Intentionally no IP address, email, password, username, Turnstile token, or request payload.
  await db.prepare("DELETE FROM signup_diagnostics WHERE created_at<datetime('now','-7 days')").run();
  await db.prepare('INSERT INTO signup_diagnostics(id,stage,reason) VALUES(?,?,?)').bind(crypto.randomUUID(),stage,reason).run();
 }catch(e){console.warn('Reborna diagnostic storage unavailable',String(e).slice(0,90))}
}
async function verifyTurnstile(env,request,token,action,db=null){
 const report=async reason=>{if(action==='register')await recordSignupIssue(db,'human_check',reason)};
 if(!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_SITE_KEY){await report('configuration_missing');return false}
 if(typeof token!=='string'||token.length<10||token.length>2048){await report('token_missing_or_expired');return false}
 try{
  const form=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});
  const ip=request.headers.get('CF-Connecting-IP');if(ip)form.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!r.ok){await report('siteverify_http_failure');return false}
  const answer=await r.json();
  if(answer.success!==true){
   const errors=Array.isArray(answer['error-codes'])?answer['error-codes']:[];
   const code=errors.includes('timeout-or-duplicate')?'token_expired_or_reused':errors.includes('invalid-input-secret')?'secret_rejected':errors.includes('invalid-input-response')?'token_invalid':'siteverify_rejected';
   await report(code);
   return false;
  }
  if(answer.action!==action){await report('action_mismatch');return false}
  const hostname=answer.hostname||'';
  if(!['reborna.co','www.reborna.co','reborna-site.pages.dev'].some(h=>hostname===h||hostname.endsWith('.'+h))){await report('hostname_mismatch');return false}
  return true;
 }catch(e){await report('siteverify_unavailable');return false}
}
// Compact raster-only avatars avoid a paid image-hosting service. The browser
// removes EXIF metadata when it redraws a source image onto a small canvas.
async function readAvatarBody(request){
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw Error('Send JSON data.');
 const length=Number(request.headers.get('content-length')||0);
 if(length>115000)throw Error('Photo payload is too large.');
 if(!request.body)throw Error('Photo payload is missing.');
 const reader=request.body.getReader();let chunks=[],size=0;
 try{
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;
   if(size>115000){await reader.cancel();throw Error('Photo payload is too large.')}
   chunks.push(value);
  }
 }finally{reader.releaseLock()}
 const packed=new Uint8Array(size);let i=0;for(const chunk of chunks){packed.set(chunk,i);i+=chunk.length}
 return JSON.parse(new TextDecoder().decode(packed));
}
function avatarDimensions(raw,type){
 const b=i=>raw.charCodeAt(i);
 if(type==='image/webp'){
  if(raw.length<32||raw.slice(0,4)!=='RIFF'||raw.slice(8,12)!=='WEBP')return null;
  const format=raw.slice(12,16);
  if(format==='VP8 '){
   if(b(23)!==0x9d||b(24)!==0x01||b(25)!==0x2a)return null;
   return [b(26)|((b(27)&63)<<8),b(28)|((b(29)&63)<<8)];
  }
  if(format==='VP8L'){
   if(b(20)!==0x2f)return null;
   return [1+b(21)+((b(22)&63)<<8),1+((b(22)>>6)&3)+(b(23)<<2)+((b(24)&15)<<10)];
  }
  if(format==='VP8X'){
   if((b(20)&(0x02|0x04|0x08|0x20))!==0)return null; // no animation, EXIF, ICC or XMP metadata
   return [1+b(24)+(b(25)<<8)+(b(26)<<16),1+b(27)+(b(28)<<8)+(b(29)<<16)];
  }
  return null;
 }
 if(type==='image/jpeg'){
  if(b(0)!==255||b(1)!==216||b(raw.length-2)!==255||b(raw.length-1)!==217)return null;
  let p=2;
  while(p+9<raw.length){
   if(b(p)!==255){p++;continue}
   while(b(p)===255)p++;
   const marker=b(p++);if(marker===0xd9||marker===0xda)break;
   if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
   const len=(b(p)<<8)+b(p+1);
   if(len<2||p+len>raw.length)return null;
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){
    return [(b(p+5)<<8)+b(p+6),(b(p+3)<<8)+b(p+4)];
   }
   p+=len;
  }
 }
 return null;
}
function validatedAvatar(input){
 if(typeof input!=='string'||input.length>113000)return null;
 const match=/^data:(image\/(?:webp|jpeg));base64,([A-Za-z0-9+/]+={0,2})$/.exec(input);
 if(!match)return null;
 let raw;try{raw=atob(match[2])}catch{return null}
 if(raw.length<80||raw.length>76000)return null;
 const dims=avatarDimensions(raw,match[1]);
 if(!dims||dims.some(d=>d<1||d>512))return null;
 return {mime:match[1],image:match[2]};
}

const moderationVisible=(alias,type)=>"NOT EXISTS (SELECT 1 FROM content_moderation cm WHERE cm.content_type='"+type+"' AND cm.content_id="+alias+".id AND cm.state<>'approved')";
async function moderationProcess(db,env,type,id,title,body){
 try{
  if(!env.COMMUNITY_SAFETY&&!env.AI){await db.prepare("UPDATE content_moderation SET state='needs_review',reason_code='other',reason_text='Automated review is temporarily unavailable',updated_at=datetime('now') WHERE content_type=? AND content_id=? AND state='pending'").bind(type,id).run();return}
  const text=(title?title+'\n':'')+body;
  let safe;
  if(env.COMMUNITY_SAFETY){
   const r=await env.COMMUNITY_SAFETY.fetch('https://reborna.internal/moderate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,6400)})});
   if(!r.ok)throw Error('AI moderation service unavailable');
   const result=await r.json();
   if(typeof result?.safe!=='boolean')throw Error('Unexpected AI moderation result');
   safe=result.safe;
  }else{
   const result=await env.AI.run('@cf/meta/llama-guard-3-8b',{messages:[{role:'user',content:text.slice(0,6400)}],max_tokens:90});
   const verdict=typeof result?.response==='string'?result.response.trim().toLowerCase():'';
   safe=/^safe(?:\s|$)/.test(verdict);
  }
  // Potentially unsafe results are held for a human; critical product criticism is not automatically censored.
  const state=safe?'approved':'needs_review';
  const reason=safe?null:'other';
  await db.prepare("UPDATE content_moderation SET state=?,reason_code=?,reason_text=?,updated_at=datetime('now') WHERE content_type=? AND content_id=? AND state='pending'").bind(state,reason,safe?null:'AI moderation flagged this for a human decision',type,id).run();
 }catch(e){
  console.error('Reborna moderation review temporarily unavailable',type,String(e).slice(0,200));
  await db.prepare("UPDATE content_moderation SET state='needs_review',reason_code='other',reason_text='Automated review unavailable',updated_at=datetime('now') WHERE content_type=? AND content_id=? AND state='pending'").bind(type,id).run();
 }
}
async function isModerator(db,userId){return !!await db.prepare('SELECT 1 FROM community_moderators WHERE user_id=?').bind(userId).first()}
async function notifyModeration(db,env,id){
 const task=await db.prepare("SELECT n.*,u.email FROM moderation_notifications n JOIN users u ON u.id=n.member_id WHERE n.id=? AND n.state IN ('queued','failed')").bind(id).first();
 if(!task||!task.email||!emailReady(env))return;
 try{await sendEmail(env,task.email,task.subject,'<p>'+task.body.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</p><p>You can sign in to Reborna to see your submission status.</p>');await db.prepare("UPDATE moderation_notifications SET state='sent',sent_at=datetime('now') WHERE id=?").bind(id).run()}
 catch(e){console.error('Community moderation email failed',String(e).slice(0,120));await db.prepare("UPDATE moderation_notifications SET state='failed' WHERE id=?").bind(id).run()}
}

async function deliverToken(db,env,u,purpose){const token=b64(bytes(32)),hash=await sha(token);await db.prepare("DELETE FROM email_tokens WHERE user_id=? AND purpose=?").bind(u.id,purpose).run();await db.prepare("INSERT INTO email_tokens(token_hash,user_id,purpose,expires_at) VALUES(?,?,?,datetime('now',?))").bind(hash,u.id,purpose,purpose==='verify'?'+24 hours':'+30 minutes').run();const path=purpose==='verify'?'/account/?verify=':'/account/?reset=';const link='https://reborna.co'+path+encodeURIComponent(token);const subject=purpose==='verify'?'Verify your Reborna email':'Reset your Reborna password';const html='<p>Hello,</p><p>'+ (purpose==='verify'?'Confirm your Reborna membership:':'Reset your Reborna password:') +'</p><p><a href="'+link+'">Continue securely to Reborna</a></p><p>This link expires '+(purpose==='verify'?'in 24 hours':'in 30 minutes')+'. If you did not request it, you can ignore this email.</p>';await sendEmail(env,u.email,subject,html)}
async function onePost(db,id,user){const row=await db.prepare(`SELECT p.*,u.handle,u.display_name,u.is_editorial,u.id AS avatar_user_id,av.version AS avatar_version,(SELECT COUNT(*) FROM replies r WHERE r.post_id=p.id AND r.status='published' AND ${moderationVisible('r','reply')}) AS reply_count,(SELECT COUNT(*) FROM votes v WHERE v.post_id=p.id) AS vote_count FROM posts p JOIN users u ON u.id=p.author_id LEFT JOIN profile_avatars av ON av.user_id=u.id WHERE p.id=? AND p.status='published' AND ${moderationVisible('p','post')}`).bind(id).first();if(!row)return null;const products=(await db.prepare('SELECT product_type AS type,product_path AS path FROM post_products WHERE post_id=?').bind(id).all()).results||[];return {...row,avatarUrl:avatarLink(row.avatar_user_id,row.avatar_version),products,liked:false};}
export async function onRequest(context){
 const {request,env}=context,db=env.COMMUNITY_DB;
 const path=new URL(request.url).pathname.replace(/^\/api\/community\/?/,'').replace(/\/$/,'');
 const method=request.method,query=new URL(request.url).searchParams;
 if(!db)return failure('Community database is not configured.',503);
 if(method==='OPTIONS')return new Response(null,{status:405});
 if(method!=='GET'&&method!=='POST')return failure('Method not allowed.',405);
 if(method==='POST'&&!originValid(request))return failure('Invalid request origin.',403);
 try{
 if(method==='GET'&&path==='status')return response({available:true,registrationOpen:emailReady(env)&&!!(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET_KEY),turnstileSiteKey:env.TURNSTILE_SITE_KEY||null,moderation:'review-before-publication',aiModerationReady:!!(env.COMMUNITY_SAFETY||env.AI),mediaUploads:false,launch:'editorial'});
 if(method==='GET'&&path==='avatar'){
  const id=clean(query.get('id'),75);
  if(!/^[a-zA-Z0-9_-]{8,75}$/.test(id))return failure('Profile photo not found.',404);
  const row=await db.prepare("SELECT av.mime_type,av.image_base64 FROM profile_avatars av JOIN users u ON u.id=av.user_id WHERE av.user_id=? AND u.status='active' AND u.email_verified_at IS NOT NULL").bind(id).first();
  if(!row)return failure('Profile photo not found.',404);
  const raw=atob(row.image_base64);
  return new Response(Uint8Array.from(raw,c=>c.charCodeAt(0)),{headers:{'Content-Type':row.mime_type,'Cache-Control':'public, max-age=300, stale-while-revalidate=600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
 }
 if(!(await throttle(db,request,'all',280,3600)))return failure('Too many requests. Please try again later.',429);
 if(method==='GET'&&path==='posts'){
  const category=clean(query.get('category'),30),product=clean(query.get('product'),260),search=clean(query.get('q'),100),page=Math.min(40,Math.max(1,Number(query.get('page'))||1)),offset=(page-1)*20;
  let sql=`SELECT p.id,p.title,p.category,p.body,p.created_at,p.pinned,u.handle,u.display_name,u.is_editorial,u.id AS avatar_user_id,av.version AS avatar_version,(SELECT COUNT(*) FROM replies r WHERE r.post_id=p.id AND r.status='published' AND ${moderationVisible('r','reply')}) AS reply_count,(SELECT COUNT(*) FROM votes v WHERE v.post_id=p.id) AS vote_count FROM posts p JOIN users u ON u.id=p.author_id LEFT JOIN profile_avatars av ON av.user_id=u.id WHERE p.status='published' AND ${moderationVisible('p','post')}`,args=[];
  if(CATEGORIES.includes(category)){sql+=' AND p.category=?';args.push(category)}
  if(product&&/^\/(kits|materials)\/[a-z0-9/-]{2,170}\/?$/.test(product)){sql+=' AND EXISTS (SELECT 1 FROM post_products pp WHERE pp.post_id=p.id AND pp.product_path=?)';args.push(product.endsWith('/')?product:product+'/')}
  if(search){sql+=' AND (p.title LIKE ? OR p.body LIKE ?)';args.push('%'+search+'%','%'+search+'%')}
  sql+=' ORDER BY p.pinned DESC,p.created_at DESC LIMIT 20 OFFSET ?';args.push(offset);
  const rows=(await db.prepare(sql).bind(...args).all()).results||[];
  return response({posts:rows.map(p=>({...p,body:p.body.slice(0,230),avatarUrl:avatarLink(p.avatar_user_id,p.avatar_version)})),hasMore:rows.length===20,page});
 }
 if(method==='GET'&&path==='post'){
  const id=clean(query.get('id'),100);const post=await onePost(db,id);if(!post)return failure('Discussion not found.',404);
  const replies=(await db.prepare(`SELECT r.id,r.body,r.created_at,u.handle,u.display_name,u.is_editorial,u.id AS avatar_user_id,av.version AS avatar_version FROM replies r JOIN users u ON u.id=r.author_id LEFT JOIN profile_avatars av ON av.user_id=u.id WHERE r.post_id=? AND r.status='published' AND ${moderationVisible('r','reply')} ORDER BY r.created_at LIMIT 250`).bind(id).all()).results||[];
  const viewer=await getUser(db,request);if(viewer){const vote=await db.prepare('SELECT 1 FROM votes WHERE post_id=? AND user_id=?').bind(id,viewer.id).first();post.liked=!!vote}
  return response({post,replies:replies.map(r=>({...r,avatarUrl:avatarLink(r.avatar_user_id,r.avatar_version)}))});
 }
 if(method==='GET'&&path==='profile'){const handle=clean(query.get('handle'),25);const u=await db.prepare("SELECT u.id,u.handle,u.display_name,u.bio,u.is_editorial,u.allow_messages,u.created_at,av.version AS avatar_version FROM users u LEFT JOIN profile_avatars av ON av.user_id=u.id WHERE u.handle=? AND u.status='active' AND (u.is_editorial=1 OR u.email_verified_at IS NOT NULL)").bind(handle).first();if(!u)return failure('Member not found.',404);const roles=(await db.prepare('SELECT role FROM user_roles WHERE user_id=?').bind(u.id).all()).results.map(x=>x.role);return response({profile:publicUser(u),roles,rolesAreSelfDescribed:true})}
 if(method==='GET'&&path==='me'){const u=await getUser(db,request);if(!u)return response({user:null});const roles=(await db.prepare('SELECT role FROM user_roles WHERE user_id=?').bind(u.id).all()).results.map(x=>x.role);const interests=(await db.prepare('SELECT interest FROM user_interests WHERE user_id=?').bind(u.id).all()).results.map(x=>x.interest);return response({user:{...publicUser(u),email:u.email,roles,interests,notificationEmail:!!u.notification_email,marketingEmail:!!u.marketing_email}})}
 if(method==='POST'&&path==='register'){
  if(!emailReady(env)||!env.TURNSTILE_SITE_KEY||!env.TURNSTILE_SECRET_KEY)return failure('Registrations are being prepared. Please check back soon.',503);
  if(!(await throttle(db,request,'register',5,3600)))return failure('Please try registering later.',429);
  const d=await readJson(request),email=clean(d.email,254).toLowerCase(),handle=clean(d.handle,24).toLowerCase(),display=clean(d.displayName,70),password=d.password;
  // Contract acceptance is distinct from optional promotional email consent.
  if(d.termsAccepted!==true||d.termsVersion!=='2026-10-14')return failure('Please read and agree to the Terms of Use and Community Guidelines before registering.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){await recordSignupIssue(db,'form','invalid_email');return failure('Please enter a valid email address.')}
  if(!validHandle(handle)){await recordSignupIssue(db,'form','invalid_username');return failure('Choose a username of 3–24 letters, numbers or underscores, starting with a letter. Reserved names such as admin or reborna cannot be used.')}
  const handleError=publicNameError(handle,'handle'),displayError=publicNameError(display,'display');
  if(handleError){await recordSignupIssue(db,'form','unsafe_username');return failure(handleError)}
  if(displayError){await recordSignupIssue(db,'form','unsafe_display_name');return failure(displayError)}
  if(typeof password!=='string'||password.length<12||password.length>128){await recordSignupIssue(db,'form','invalid_password');return failure('Your password needs between 12 and 128 characters.')}
  if(!(await verifyTurnstile(env,request,d.turnstileToken,'register',db)))return failure('The human verification did not validate. Please complete a fresh check and try again.',403);
  const existing=await db.prepare('SELECT 1 FROM users WHERE email=? OR handle=?').bind(email,handle).first();
  if(existing){await recordSignupIssue(db,'form','account_exists');return failure('That email or username is already registered. You can sign in or use the verification-link option.',409)}
  let salt,hash;
  try{salt=b64(bytes(20));hash=await passwordHash(password,salt)}catch(e){await recordSignupIssue(db,'password','hash_failure');throw e}
  const id=crypto.randomUUID();
  const roles=strings(d.roles,ROLES),interests=strings(d.interests,INTERESTS);
  // D1 batch keeps account creation, versioned acceptance, and role selections together.
  const statements=[
   db.prepare('INSERT INTO users(id,email,handle,display_name,password_salt,password_hash,password_iterations,marketing_email,notification_email) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,email,handle,display,salt,hash,ITERATIONS,d.marketingEmail===true?1:0,d.notificationEmail===true?1:0),
   db.prepare('INSERT INTO member_terms_acceptance(user_id,terms_version) VALUES(?,?)').bind(id,'2026-10-14'),
   ...roles.map(x=>db.prepare('INSERT INTO user_roles(user_id,role) VALUES(?,?)').bind(id,x)),
   ...interests.map(x=>db.prepare('INSERT INTO user_interests(user_id,interest) VALUES(?,?)').bind(id,x))
  ];
  await db.batch(statements);
  try{await deliverToken(db,env,{id,email},'verify')}catch(e){await recordSignupIssue(db,'email','send_failure');return failure('Your account was saved, but the verification email could not be delivered. Choose Sign in, then select Resend my verification link.',503)}
  return response({ok:true,message:'Check your inbox to verify your email before signing in.'},201);
 }
 if(method==='POST'&&path==='resend-verification'){
  if(!(await throttle(db,request,'resend',3,3600)))return failure('Please try later.',429);
  const d=await readJson(request),email=clean(d.email,254).toLowerCase();
  const u=await db.prepare("SELECT id,email FROM users WHERE email=? AND status='active' AND email_verified_at IS NULL").bind(email).first();
  if(u&&emailReady(env))await deliverToken(db,env,u,'verify');
  return response({ok:true,message:'If that address has an unverified account, a link has been sent.'});
 }
 if(method==='POST'&&path==='verify'){
  if(!(await throttle(db,request,'verify',12,900)))return failure('Please try later.',429);
  const d=await readJson(request),token=clean(d.token,150);
  if(!/^[A-Za-z0-9_-]{40,150}$/.test(token))return failure('Invalid or expired link.',400);
  const hash=await sha(token);
  const t=await db.prepare("SELECT * FROM email_tokens WHERE token_hash=? AND purpose='verify' AND used_at IS NULL AND expires_at>datetime('now')").bind(hash).first();
  if(!t)return failure('Invalid or expired link.',400);
  await db.batch([db.prepare("UPDATE users SET email_verified_at=datetime('now') WHERE id=?").bind(t.user_id),db.prepare("UPDATE email_tokens SET used_at=datetime('now') WHERE token_hash=? AND used_at IS NULL").bind(hash)]);
  return response({ok:true},200,{'Set-Cookie':await session(db,t.user_id)});
 }
 if(method==='POST'&&path==='login'){
  if(!(await throttle(db,request,'login',12,900)))return failure('Too many attempts. Please try again later.',429);
  const d=await readJson(request),email=clean(d.email,254).toLowerCase();
  const u=await db.prepare("SELECT * FROM users WHERE email=? AND is_editorial=0 AND status='active'").bind(email).first();
  const dummySalt='AAAAAAAAAAAAAAAAAAAAAAAAAAA',pw=typeof d.password==='string'&&d.password.length<=128?d.password:'';
  const candidate=await passwordHash(pw,u?.password_salt||dummySalt,u?.password_iterations||ITERATIONS);
  if(!u||!safeEqual(candidate,u.password_hash))return failure('Email or password is incorrect.',401);
  if(!u.email_verified_at)return failure('Please confirm your email before signing in.',403);
  return response({ok:true,user:publicUser(u)},200,{'Set-Cookie':await session(db,u.id)});
 }
 if(method==='POST'&&path==='forgot'){
  if(!(await throttle(db,request,'forgot',3,3600)))return failure('Please try later.',429);
  const d=await readJson(request),email=clean(d.email,254).toLowerCase(),u=await db.prepare("SELECT id,email FROM users WHERE email=? AND status='active' AND email_verified_at IS NOT NULL").bind(email).first();
  if(u&&emailReady(env))await deliverToken(db,env,u,'reset');
  return response({ok:true,message:'If your email is registered, a reset link has been sent.'});
 }
 if(method==='POST'&&path==='reset'){
  if(!(await throttle(db,request,'reset',9,900)))return failure('Please try later.',429);
  const d=await readJson(request),token=clean(d.token,150);
  if(!/^[A-Za-z0-9_-]{40,150}$/.test(token)||typeof d.password!=='string'||d.password.length<12||d.password.length>128)return failure('Invalid reset link or password.');
  const hash=await sha(token);
  const t=await db.prepare("SELECT * FROM email_tokens WHERE token_hash=? AND purpose='reset' AND used_at IS NULL AND expires_at>datetime('now')").bind(hash).first();if(!t)return failure('Invalid or expired reset link.');
  const salt=b64(bytes(20)),pwHash=await passwordHash(d.password,salt);
  await db.batch([db.prepare("UPDATE users SET password_salt=?,password_hash=?,password_iterations=?,updated_at=datetime('now') WHERE id=?").bind(salt,pwHash,ITERATIONS,t.user_id),db.prepare('DELETE FROM sessions WHERE user_id=?').bind(t.user_id),db.prepare("UPDATE email_tokens SET used_at=datetime('now') WHERE token_hash=?").bind(hash)]);
  return response({ok:true,message:'Password updated. Please sign in.'});
 }
 if(method==='POST'&&path==='logout'){
  const v=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));if(v){const token=v.slice(COOKIE.length+1);await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(token)).run()}return response({ok:true},200,{'Set-Cookie':clearCookie()});
 }
 const user=await getUser(db,request);
 if(!user)return failure('Please sign in to continue.',401);
 if(method==='GET'&&path==='wishlist'){
  const items=(await db.prepare('SELECT item_type AS type,item_path AS path,item_title AS title,item_subtitle AS subtitle,collection_status AS collectionStatus,image_url AS imageUrl,saved_at AS savedAt FROM member_saved_items WHERE user_id=? ORDER BY saved_at DESC,item_path ASC LIMIT 1200').bind(user.id).all()).results||[];
  return response({items});
 }
 if(method==='POST'&&path==='wishlist'){
  if(!(await throttle(db,request,'wishlist-write',180,3600)))return failure('Too many collection changes. Please wait before trying again.',429);
  const data=await readJson(request),action=data?.action;
  if(action==='mark-owned'||action==='mark-wishlist'){
   const item=canonicalSavedItem(data?.item);
   if(!item)return failure('Select a valid saved catalogue item.');
   const state=action==='mark-owned'?'owned':'wishlist';
   const changed=await db.prepare('UPDATE member_saved_items SET collection_status=? WHERE user_id=? AND item_path=?').bind(state,user.id,item.path).run();
   if(!changed.meta?.changes)return failure('Save this item to your collection first.',404);
   return response({ok:true,collectionStatus:state});
  }
  if(action==='remove'){
   const item=canonicalSavedItem(data?.item);
   if(!item)return failure('Select a valid Reborna catalogue item.');
   await db.prepare('DELETE FROM member_saved_items WHERE user_id=? AND item_path=?').bind(user.id,item.path).run();
   return response({ok:true,saved:false});
  }
  if(action==='save'){
   const item=canonicalSavedItem(data?.item);
   if(!item)return failure('Select a valid Reborna catalogue item.');
   const count=await db.prepare('SELECT COUNT(*) AS total FROM member_saved_items WHERE user_id=?').bind(user.id).first();
   if(count.total>=1000){
    const exists=await db.prepare('SELECT 1 FROM member_saved_items WHERE user_id=? AND item_path=?').bind(user.id,item.path).first();
    if(!exists)return failure('Your collection has reached its 1,000 item limit.',409);
   }
   await db.prepare('INSERT INTO member_saved_items(user_id,item_type,item_path,item_title,item_subtitle,image_url) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,item_path) DO UPDATE SET item_title=excluded.item_title,item_subtitle=excluded.item_subtitle,image_url=COALESCE(excluded.image_url,member_saved_items.image_url)').bind(user.id,item.type,item.path,item.title,item.subtitle,item.imageUrl).run();
   return response({ok:true,saved:true});
  }
  if(action==='import'){
   const entries=Array.isArray(data?.items)?data.items.slice(0,100):[];
   if(entries.length===0)return response({ok:true,imported:0});
   const valid=[...new Map(entries.map(canonicalSavedItem).filter(Boolean).map(i=>[i.path,i])).values()];
   const count=await db.prepare('SELECT COUNT(*) AS total FROM member_saved_items WHERE user_id=?').bind(user.id).first();
   if(count.total+valid.length>1000)return failure('Your collection has reached its item limit.',409);
   if(valid.length)await db.batch(valid.map(i=>db.prepare('INSERT INTO member_saved_items(user_id,item_type,item_path,item_title,item_subtitle,image_url) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,item_path) DO NOTHING').bind(user.id,i.type,i.path,i.title,i.subtitle,i.imageUrl)));
   return response({ok:true,imported:valid.length});
  }
  return failure('Unknown collection action.');
 }
 if(method==='GET'&&path==='studio'){
  const projects=(await db.prepare('SELECT id,title,notes,linked_kit_path AS linkedKitPath,stage,created_at AS createdAt,updated_at AS updatedAt FROM member_studio_projects WHERE user_id=? ORDER BY updated_at DESC LIMIT 100').bind(user.id).all()).results||[];
  return response({projects});
 }
 if(method==='POST'&&path==='studio'){
  if(!(await throttle(db,request,'studio-write',60,3600)))return failure('Please wait before making more changes.',429);
  const d=await readJson(request);
  if(d?.action==='delete'){
   if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/.test(d.id))return failure('Invalid project.');
   await db.prepare('DELETE FROM member_studio_projects WHERE id=? AND user_id=?').bind(d.id,user.id).run();
   return response({ok:true});
  }
  if(!['create','update'].includes(d?.action))return failure('Unknown studio action.');
  const title=clean(d.title,111),notes=clean(d.notes,1801),linkedKitPath=cleanProjectPath(d.linkedKitPath),stage=clean(d.stage,30)||'planning';
  if(title.length<2||title.length>110||notes.length>1800||!['planning','painting','rooting','completed'].includes(stage))return failure('Enter a project name and valid stage (notes up to 1,800 characters).');
  if(d.linkedKitPath&& !linkedKitPath)return failure('Choose a valid original kit link.');
  if(d.action==='create'){
   const count=await db.prepare('SELECT count(*) AS total FROM member_studio_projects WHERE user_id=?').bind(user.id).first();
   if(count.total>=100)return failure('You can currently save up to 100 studio projects.',409);
   const id=crypto.randomUUID();
   await db.prepare('INSERT INTO member_studio_projects(id,user_id,title,notes,linked_kit_path,stage) VALUES(?,?,?,?,?,?)').bind(id,user.id,title,notes,linkedKitPath,stage).run();
   return response({ok:true,id},201);
  }
  if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/.test(d.id))return failure('Invalid project.');
  const result=await db.prepare("UPDATE member_studio_projects SET title=?,notes=?,linked_kit_path=?,stage=?,updated_at=datetime('now') WHERE id=? AND user_id=?").bind(title,notes,linkedKitPath,stage,d.id,user.id).run();
  if(!result.meta?.changes)return failure('Project not found.',404);
  return response({ok:true,id:d.id});
 }
 if(method==='GET'&&path==='listing-drafts'){
  const drafts=(await db.prepare('SELECT id,title,description,item_kind AS kind,asking_price_minor AS askingPriceMinor,currency,created_at AS createdAt,updated_at AS updatedAt FROM member_listing_drafts WHERE user_id=? ORDER BY updated_at DESC LIMIT 100').bind(user.id).all()).results||[];
  return response({drafts,salesLive:false,purchasesLive:false});
 }
 if(method==='POST'&&path==='listing-drafts'){
  if(!(await throttle(db,request,'listing-drafts-write',45,3600)))return failure('Please wait before changing more listing drafts.',429);
  const d=await readJson(request);
  if(d?.action==='delete'){
   if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/.test(d.id))return failure('Invalid listing.');
   await db.prepare('DELETE FROM member_listing_drafts WHERE id=? AND user_id=?').bind(d.id,user.id).run();
   return response({ok:true});
  }
  if(!['create','update'].includes(d?.action))return failure('Unknown draft action.');
  const title=clean(d.title,111),description=clean(d.description,2501),kind=clean(d.kind,30),currency=clean(d.currency,3)||'GBP';
  const price=d.askingPriceMinor===null||d.askingPriceMinor===''?null:d.askingPriceMinor;
  if(title.length<2||title.length>110||description.length>2500||!['finished_doll','original_kit','materials','other'].includes(kind)||!['GBP','USD','EUR'].includes(currency)||!(price===null||Number.isInteger(price)&&price>=0&&price<=100000000))return failure('Please enter a title, item type and optional valid price.');
  if(d.action==='create'){
   const count=await db.prepare('SELECT count(*) AS total FROM member_listing_drafts WHERE user_id=?').bind(user.id).first();
   if(count.total>=100)return failure('You can currently save up to 100 listing drafts.',409);
   const id=crypto.randomUUID();
   await db.prepare('INSERT INTO member_listing_drafts(id,user_id,title,description,item_kind,asking_price_minor,currency) VALUES(?,?,?,?,?,?,?)').bind(id,user.id,title,description,kind,price,currency).run();
   return response({ok:true,id},201);
  }
  if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/.test(d.id))return failure('Invalid listing.');
  const result=await db.prepare("UPDATE member_listing_drafts SET title=?,description=?,item_kind=?,asking_price_minor=?,currency=?,updated_at=datetime('now') WHERE id=? AND user_id=?").bind(title,description,kind,price,currency,d.id,user.id).run();
  if(!result.meta?.changes)return failure('Draft not found.',404);
  return response({ok:true,id:d.id});
 }

 if(method==='POST'&&path==='avatar'){
  if(!(await throttle(db,request,'avatar-upload',12,86400)))return failure('Too many photo changes. Please try tomorrow.',429);
  const d=await readAvatarBody(request);
  if(d?.remove===true){
   await db.prepare('DELETE FROM profile_avatars WHERE user_id=?').bind(user.id).run();
   return response({ok:true,avatarUrl:null,message:'Your profile photo has been removed.'});
  }
  const avatar=validatedAvatar(d?.avatarData);
  if(!avatar)return failure('Please upload a JPEG, PNG or WebP photo. It will be resized to a small square image (up to 512 pixels and 76 KB).');
  const version=Date.now();
  await db.prepare("INSERT INTO profile_avatars(user_id,mime_type,image_base64,version) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET mime_type=excluded.mime_type,image_base64=excluded.image_base64,version=excluded.version,uploaded_at=datetime('now')").bind(user.id,avatar.mime,avatar.image,version).run();
  return response({ok:true,avatarUrl:'/api/community/avatar?id='+encodeURIComponent(user.id)+'&v='+version,message:'Your new profile photo is live.'});
 }
 if(method==='POST'&&path==='settings'){
  const d=await readJson(request),roles=strings(d.roles,ROLES),interests=strings(d.interests,INTERESTS),bio=clean(d.bio,320),display=clean(d.displayName,70);
  const displayError=publicNameError(display,'display');if(displayError)return failure(displayError);
  await db.batch([db.prepare("UPDATE users SET display_name=?,bio=?,allow_messages=?,notification_email=?,marketing_email=?,updated_at=datetime('now') WHERE id=?").bind(display,bio,d.allowMessages===false?0:1,d.notificationEmail===true?1:0,d.marketingEmail===true?1:0,user.id),db.prepare('DELETE FROM user_roles WHERE user_id=?').bind(user.id),db.prepare('DELETE FROM user_interests WHERE user_id=?').bind(user.id),...roles.map(x=>db.prepare('INSERT INTO user_roles(user_id,role) VALUES(?,?)').bind(user.id,x)),...interests.map(x=>db.prepare('INSERT INTO user_interests(user_id,interest) VALUES(?,?)').bind(user.id,x))]);
  return response({ok:true});
 }
 if(method==='POST'&&path==='posts'){
  if(!(await throttle(db,request,'posting',20,3600)))return failure('Please wait before posting again.',429);
  const d=await readJson(request),title=clean(d.title,140),body=clean(d.body,6500),category=clean(d.category,30),products=validatedProducts(d.products);
  if(title.length<8||title.length>110||body.length<40||body.length>6000||!CATEGORIES.includes(category))return failure('Choose a category, title (8–110 characters) and message (40–6000 characters).');
  if(!(await verifyTurnstile(env,request,d.turnstileToken,'topic')))return failure('Please complete the security check and try again.',403);
  const id=crypto.randomUUID(),stmts=[db.prepare('INSERT INTO posts(id,author_id,category,title,body) VALUES(?,?,?,?,?)').bind(id,user.id,category,title,body),
    db.prepare("INSERT INTO content_moderation(content_type,content_id,state) VALUES('post',?,'pending')").bind(id),
    ...products.map(p=>db.prepare('INSERT INTO post_products(post_id,product_type,product_path) VALUES(?,?,?)').bind(id,p.type,p.path))];
  await db.batch(stmts);
  context.waitUntil(moderationProcess(db,env,'post',id,title,body));
  return response({ok:true,id,moderation:'pending',message:'Your discussion has been received and is being reviewed before publication.'},202);
 }
 if(method==='POST'&&path==='reply'){
  if(!(await throttle(db,request,'reply',45,3600)))return failure('Please wait before replying again.',429);
  const d=await readJson(request),body=clean(d.body,2200),id=clean(d.postId,100);
  if(body.length<2||body.length>2000)return failure('Replies must be between 2 and 2000 characters.');
  const p=await db.prepare(`SELECT id FROM posts p WHERE id=? AND status='published' AND locked=0 AND ${moderationVisible('p','post')}`).bind(id).first();if(!p)return failure('Discussion is unavailable or closed.',404);
  if(!(await verifyTurnstile(env,request,d.turnstileToken,'reply')))return failure('Please complete the security check and try again.',403);
  const replyId=crypto.randomUUID();
  await db.batch([db.prepare('INSERT INTO replies(id,post_id,author_id,body) VALUES(?,?,?,?)').bind(replyId,id,user.id,body),db.prepare("INSERT INTO content_moderation(content_type,content_id,state) VALUES('reply',?,'pending')").bind(replyId)]);
  context.waitUntil(moderationProcess(db,env,'reply',replyId,'',body));
  return response({ok:true,moderation:'pending',message:'Your reply is being reviewed before publication.'},202);
 }
 if(method==='POST'&&path==='vote'){
  if(!(await throttle(db,request,'votes',90,3600)))return failure('Please wait before voting again.',429);
  const d=await readJson(request),id=clean(d.postId,100),post=await db.prepare(`SELECT id FROM posts p WHERE id=? AND status='published' AND ${moderationVisible('p','post')}`).bind(id).first();if(!post)return failure('Discussion not found.',404);
  const voted=await db.prepare('SELECT 1 FROM votes WHERE post_id=? AND user_id=?').bind(id,user.id).first();
  if(voted)await db.prepare('DELETE FROM votes WHERE post_id=? AND user_id=?').bind(id,user.id).run();else await db.prepare('INSERT OR IGNORE INTO votes(user_id,post_id) VALUES(?,?)').bind(user.id,id).run();return response({ok:true,liked:!voted});
 }
 if(method==='GET'&&path==='inbox'){
  const rows=(await db.prepare(`SELECT c.id,c.updated_at,m.body AS last_message,(SELECT u.handle FROM conversation_members cm JOIN users u ON u.id=cm.user_id WHERE cm.conversation_id=c.id AND cm.user_id<>? LIMIT 1) AS other_handle FROM conversations c JOIN conversation_members membership ON membership.conversation_id=c.id LEFT JOIN messages m ON m.id=(SELECT id FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) WHERE membership.user_id=? ORDER BY c.updated_at DESC LIMIT 50`).bind(user.id,user.id).all()).results||[];
  return response({conversations:rows});
 }
 if(method==='GET'&&path==='thread'){
  const id=clean(query.get('id'),80),member=await db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id=? AND user_id=?').bind(id,user.id).first();if(!member)return failure('Conversation not found.',404);
  const rows=(await db.prepare(`SELECT m.id,m.body,m.created_at,u.handle,u.display_name,m.sender_id FROM messages m JOIN users u ON u.id=m.sender_id WHERE m.conversation_id=? ORDER BY m.created_at DESC LIMIT 200`).bind(id).all()).results||[];
  await db.prepare("UPDATE conversation_members SET last_read_at=datetime('now') WHERE conversation_id=? AND user_id=?").bind(id,user.id).run();return response({messages:rows.reverse()});
 }
 if(method==='POST'&&path==='message'){
  if(!(await throttle(db,request,'message',50,3600)))return failure('Please wait before sending more messages.',429);
  const d=await readJson(request),body=clean(d.body,2200),conversationId=clean(d.conversationId,80),recipient=clean(d.recipientHandle,24);
  if(body.length<2||body.length>2000)return failure('Enter a message between 2 and 2000 characters.');
  let id=conversationId;
  if(id){const member=await db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id=? AND user_id=?').bind(id,user.id).first();if(!member)return failure('Conversation not found.',404)}
  else {
   const other=await db.prepare("SELECT id,allow_messages FROM users WHERE handle=? AND status='active' AND is_editorial=0").bind(recipient).first();if(!other||other.id===user.id||!other.allow_messages)return failure('This member is not accepting messages.',403);
   const previous=await db.prepare(`SELECT cm.conversation_id AS id FROM conversation_members cm JOIN conversation_members cc ON cc.conversation_id=cm.conversation_id AND cc.user_id=? WHERE cm.user_id=? AND (SELECT COUNT(*) FROM conversation_members q WHERE q.conversation_id=cm.conversation_id)=2 LIMIT 1`).bind(other.id,user.id).first();
   if(previous)id=previous.id;else{ id=crypto.randomUUID();await db.batch([db.prepare('INSERT INTO conversations(id) VALUES(?)').bind(id),db.prepare('INSERT INTO conversation_members(conversation_id,user_id) VALUES(?,?)').bind(id,user.id),db.prepare('INSERT INTO conversation_members(conversation_id,user_id) VALUES(?,?)').bind(id,other.id)]);}
  }
  await db.batch([db.prepare('INSERT INTO messages(id,conversation_id,sender_id,body) VALUES(?,?,?,?)').bind(crypto.randomUUID(),id,user.id,body),db.prepare("UPDATE conversations SET updated_at=datetime('now') WHERE id=?").bind(id)]);return response({ok:true,conversationId:id},201);
 }
 if(method==='GET'&&path==='my-submissions'){
  const rows=(await db.prepare(`SELECT p.id,p.title,p.created_at,COALESCE(cm.state,'approved') AS moderation_state,cm.reason_code FROM posts p LEFT JOIN content_moderation cm ON cm.content_type='post' AND cm.content_id=p.id WHERE p.author_id=? ORDER BY p.created_at DESC LIMIT 40`).bind(user.id).all()).results||[];
  return response({submissions:rows});
 }
 if(method==='GET'&&path==='moderation-queue'){
  if(!(await isModerator(db,user.id)))return failure('Not authorised.',403);
  const state=clean(query.get('state'),30),mode=['pending','needs_review','rejected'].includes(state)?state:'needs_review';
  const list=(await db.prepare(`SELECT cm.content_type,cm.content_id,cm.state,cm.reason_code,cm.reason_text,cm.created_at,COALESCE(p.title,'Reply') AS title,COALESCE(p.body,r.body) AS body,u.handle FROM content_moderation cm LEFT JOIN posts p ON cm.content_type='post' AND p.id=cm.content_id LEFT JOIN replies r ON cm.content_type='reply' AND r.id=cm.content_id JOIN users u ON u.id=COALESCE(p.author_id,r.author_id) WHERE cm.state=? ORDER BY cm.created_at LIMIT 60`).bind(mode).all()).results||[];
  return response({items:list});
 }
 if(method==='POST'&&path==='moderate'){
  if(!(await isModerator(db,user.id)))return failure('Not authorised.',403);
  const d=await readJson(request),type=clean(d.type,10),id=clean(d.id,100),state=clean(d.state,30),reason=clean(d.reason,30);
  if(!['post','reply'].includes(type)||!['approved','rejected','needs_review'].includes(state)||!id)return failure('Invalid moderation action.');
  const allowed=['harassment','hate','threats','spam','privacy','other'];
  if(state==='rejected'&&!allowed.includes(reason))return failure('Choose a clear rejection category.');
  const m=await db.prepare("SELECT state FROM content_moderation WHERE content_type=? AND content_id=?").bind(type,id).first();
  if(!m)return failure('Moderation item not found.',404);
  const reasonText=state==='rejected'?({harassment:'Personal harassment or bullying',hate:'Hateful or discriminatory content',threats:'Threats or intimidation',spam:'Spam or misleading promotion',privacy:'Personal information shared without permission',other:'Our published community guidelines'}[reason]):null;
  const update=db.prepare("UPDATE content_moderation SET state=?,reason_code=?,reason_text=?,reviewed_by=?,updated_at=datetime('now') WHERE content_type=? AND content_id=?").bind(state,state==='rejected'?reason:null,reasonText,user.id,type,id);
  const audit=db.prepare('INSERT INTO moderation_audit(id,reviewer_id,content_type,content_id,action,reason_code) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,type,id,state,state==='rejected'?reason:null);
  const statements=[update,audit];
  let noticeId=null;
  if(state==='rejected'){
   const author=await db.prepare(type==='post'?'SELECT author_id AS id FROM posts WHERE id=?':'SELECT author_id AS id FROM replies WHERE id=?').bind(id).first();
   if(author){noticeId=crypto.randomUUID();statements.push(db.prepare('INSERT INTO moderation_notifications(id,content_type,content_id,member_id,subject,body) VALUES(?,?,?,?,?,?)').bind(noticeId,type,id,author.id,'Your Reborna community submission','Your recent '+(type==='post'?'discussion':'reply')+' could not be published because it appears to breach our guidelines regarding '+reasonText.toLowerCase()+'. You may contact the Reborna moderation team if you believe this was a mistake.'))}
  }
  await db.batch(statements);
  if(noticeId)context.waitUntil(notifyModeration(db,env,noticeId));
  return response({ok:true});
 }
 if(method==='POST'&&path==='report'){
  if(!(await throttle(db,request,'report',12,3600)))return failure('Please wait before submitting another report.',429);
  const d=await readJson(request),type=clean(d.targetType,20),target=clean(d.targetId,100),reason=clean(d.reason,500);
  if(!['post','reply','message','user'].includes(type)||!target||reason.length<10)return failure('Provide an item and a reason (at least 10 characters).');
  // Verify a real visible target, and never let members probe another conversation's messages.
  const check=type==='post'
    ?db.prepare("SELECT 1 FROM posts WHERE id=? AND status='published'").bind(target)
    :type==='reply'
    ?db.prepare("SELECT 1 FROM replies r JOIN posts p ON p.id=r.post_id WHERE r.id=? AND r.status='published' AND p.status='published'").bind(target)
    :type==='message'
    ?db.prepare("SELECT 1 FROM messages m JOIN conversation_members cm ON cm.conversation_id=m.conversation_id WHERE m.id=? AND cm.user_id=?").bind(target,user.id)
    :db.prepare("SELECT 1 FROM users WHERE id=? AND status='active'").bind(target);
  if(!(await check.first()))return failure('The content is unavailable or you do not have access to it.',404);
  const reportId=crypto.randomUUID();
  await db.prepare('INSERT INTO reports(id,reporter_id,target_type,target_id,reason) VALUES(?,?,?,?,?)').bind(reportId,user.id,type,target,reason).run();
  if(emailReady(env)&&typeof context.waitUntil==='function'){
   const html='<p>A new member safety report needs review on Reborna.</p><p>Category: '+type+'. Reference: '+reportId+'.</p><p><a href="https://reborna.co/community/moderation/">Open the private moderation dashboard</a></p><p>For privacy, the reported content is not included in this email.</p>';
   context.waitUntil(sendEmail(env,'hello@reborna.co','Reborna member safety report',html).catch(e=>console.error('Member report alert failed',String(e).slice(0,120))));
  }
  return response({ok:true});
 }
 return failure('Community endpoint not found.',404);
 }catch(e){if(String(e).includes('UNIQUE constraint'))return failure('That email or username is already in use.',409);if(e instanceof SyntaxError)return failure('Invalid request data.');if(['Send JSON data.','Request too large.'].includes(e.message))return failure(e.message);console.error('Community request failed',path,String(e));if(path==='register')await recordSignupIssue(db,'server','unexpected_error');return failure('The community service could not complete this request.',500)}
}
