/* Reborna Community API — Cloudflare Pages Functions + isolated D1.
 * Static Next.js pages call same-origin /api/community/*.
 * Requires COMMUNITY_DB D1 binding. Public signup requires configured transactional email.
 */
const ROLES=['collector','reborn_artist','sculptor','supplier'];
const INTERESTS=['kits','finished_dolls','high_end_dolls','materials','techniques','events','authenticity','selling'];
const CATEGORIES=['general','kits','painting','mohair','silicone','authenticity','showcase','marketplace'];
const encoder=new TextEncoder();
const COOKIE='rb_session';
const ITERATIONS=310000;
const now=()=>Math.floor(Date.now()/1000);
function response(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})}
const failure=(message,status=400)=>response({error:message},status);
function bytes(length){const a=new Uint8Array(length);crypto.getRandomValues(a);return a}
function b64(a){return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){const raw=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0))}
async function sha(value){return b64(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unb64(salt),iterations:ITERATIONS,hash:'SHA-256'},key,256)))}
function safeEqual(a,b){if(!a||!b||a.length!==b.length)return false;let out=0;for(let i=0;i<a.length;i++)out|=a.charCodeAt(i)^b.charCodeAt(i);return out===0}
function cookie(token,maxAge){return COOKIE+'='+token+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age='+maxAge}
function clearCookie(){return cookie('',0)}
async function readJson(request){if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw Error('Send JSON data.');const n=Number(request.headers.get('content-length')||0);if(n>30000)throw Error('Request too large.');return request.json()}
function clean(value,length){return typeof value==='string'?value.trim().slice(0,length):''}
function strings(value,allowed){return Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&allowed.includes(x)))]:[]}
function validHandle(s){return /^[a-z][a-z0-9_]{2,23}$/.test(s)&&!['admin','support','moderator','reborna','official','staff','system','help'].includes(s)}
function validatedProducts(p){if(!Array.isArray(p))return[];return p.slice(0,3).filter(v=>v&&typeof v.path==='string'&&typeof v.type==='string'&&((v.type==='kit'&&/^\/kits\/[a-z0-9-]+\/?$/.test(v.path))||(v.type==='material'&&/^\/materials\/[a-z0-9-]+\/[a-z0-9-]+\/?$/.test(v.path)))).map(v=>({path:v.path.endsWith('/')?v.path:v.path+'/',type:v.type})).filter((v,i,a)=>a.findIndex(x=>x.path===v.path)===i)}
function publicUser(u){return {id:u.id,handle:u.handle,displayName:u.display_name,bio:u.bio||'',editorial:!!u.is_editorial,allowMessages:!!u.allow_messages,createdAt:u.created_at}}
async function getUser(db,request){const v=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));if(!v)return null;const raw=v.slice(COOKIE.length+1);if(!/^[\w-]{40,100}$/.test(raw))return null;const h=await sha(raw);return db.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>datetime('now') AND u.status='active' AND u.email_verified_at IS NOT NULL").bind(h).first()}
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
async function verifyTurnstile(env,request,token,action){
 if(!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_SITE_KEY||typeof token!=='string'||token.length<10||token.length>2048)return false;
 try{
  const form=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});
  const ip=request.headers.get('CF-Connecting-IP');if(ip)form.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!r.ok)return false;
  const answer=await r.json();
  const hostname=answer.hostname||'';
  return answer.success===true&&answer.action===action&&['reborna.co','www.reborna.co','reborna-site.pages.dev'].some(h=>hostname===h||hostname.endsWith('.'+h));
 }catch{return false}
}
const moderationVisible=(alias,type)=>"NOT EXISTS (SELECT 1 FROM content_moderation cm WHERE cm.content_type='"+type+"' AND cm.content_id="+alias+".id AND cm.state<>'approved')";
async function moderationProcess(db,env,type,id,title,body){
 try{
  if(!env.AI){await db.prepare("UPDATE content_moderation SET state='needs_review',reason_code='other',reason_text='Automated review is temporarily unavailable',updated_at=datetime('now') WHERE content_type=? AND content_id=? AND state='pending'").bind(type,id).run();return}
  const text=(title?title+'\n':'')+body;
  const result=await env.AI.run('@cf/meta/llama-guard-3-8b',{messages:[{role:'user',content:text.slice(0,6400)}],max_tokens:90});
  const verdict=typeof result?.response==='string'?result.response.trim().toLowerCase():'';
  const safe=/^safe(?:\s|$)/.test(verdict);
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
async function onePost(db,id,user){const row=await db.prepare(`SELECT p.*,u.handle,u.display_name,u.is_editorial,(SELECT COUNT(*) FROM replies r WHERE r.post_id=p.id AND r.status='published' AND ${moderationVisible('r','reply')}) AS reply_count,(SELECT COUNT(*) FROM votes v WHERE v.post_id=p.id) AS vote_count FROM posts p JOIN users u ON u.id=p.author_id WHERE p.id=? AND p.status='published' AND ${moderationVisible('p','post')}`).bind(id).first();if(!row)return null;const products=(await db.prepare('SELECT product_type AS type,product_path AS path FROM post_products WHERE post_id=?').bind(id).all()).results||[];return {...row,products,liked:false};}
export async function onRequest(context){
 const {request,env}=context,db=env.COMMUNITY_DB;
 const path=new URL(request.url).pathname.replace(/^\/api\/community\/?/,'').replace(/\/$/,'');
 const method=request.method,query=new URL(request.url).searchParams;
 if(!db)return failure('Community database is not configured.',503);
 if(method==='OPTIONS')return new Response(null,{status:405});
 if(method!=='GET'&&method!=='POST')return failure('Method not allowed.',405);
 if(method==='POST'&&!originValid(request))return failure('Invalid request origin.',403);
 try{
 if(method==='GET'&&path==='status')return response({available:true,registrationOpen:emailReady(env)&&!!(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET_KEY),turnstileSiteKey:env.TURNSTILE_SITE_KEY||null,moderation:'review-before-publication',mediaUploads:false,launch:'editorial'});
 if(!(await throttle(db,request,'all',280,3600)))return failure('Too many requests. Please try again later.',429);
 if(method==='GET'&&path==='posts'){
  const category=clean(query.get('category'),30),product=clean(query.get('product'),260),search=clean(query.get('q'),100),page=Math.min(40,Math.max(1,Number(query.get('page'))||1)),offset=(page-1)*20;
  let sql=`SELECT p.id,p.title,p.category,p.body,p.created_at,p.pinned,u.handle,u.display_name,u.is_editorial,(SELECT COUNT(*) FROM replies r WHERE r.post_id=p.id AND r.status='published' AND ${moderationVisible('r','reply')}) AS reply_count,(SELECT COUNT(*) FROM votes v WHERE v.post_id=p.id) AS vote_count FROM posts p JOIN users u ON u.id=p.author_id WHERE p.status='published' AND ${moderationVisible('p','post')}`,args=[];
  if(CATEGORIES.includes(category)){sql+=' AND p.category=?';args.push(category)}
  if(product&&/^\/(kits|materials)\/[a-z0-9/-]{2,170}\/?$/.test(product)){sql+=' AND EXISTS (SELECT 1 FROM post_products pp WHERE pp.post_id=p.id AND pp.product_path=?)';args.push(product.endsWith('/')?product:product+'/')}
  if(search){sql+=' AND (p.title LIKE ? OR p.body LIKE ?)';args.push('%'+search+'%','%'+search+'%')}
  sql+=' ORDER BY p.pinned DESC,p.created_at DESC LIMIT 20 OFFSET ?';args.push(offset);
  const rows=(await db.prepare(sql).bind(...args).all()).results||[];
  return response({posts:rows.map(p=>({...p,body:p.body.slice(0,230)})),hasMore:rows.length===20,page});
 }
 if(method==='GET'&&path==='post'){
  const id=clean(query.get('id'),100);const post=await onePost(db,id);if(!post)return failure('Discussion not found.',404);
  const replies=(await db.prepare(`SELECT r.id,r.body,r.created_at,u.handle,u.display_name,u.is_editorial FROM replies r JOIN users u ON u.id=r.author_id WHERE r.post_id=? AND r.status='published' AND ${moderationVisible('r','reply')} ORDER BY r.created_at LIMIT 250`).bind(id).all()).results||[];
  const viewer=await getUser(db,request);if(viewer){const vote=await db.prepare('SELECT 1 FROM votes WHERE post_id=? AND user_id=?').bind(id,viewer.id).first();post.liked=!!vote}
  return response({post,replies});
 }
 if(method==='GET'&&path==='profile'){const handle=clean(query.get('handle'),25);const u=await db.prepare("SELECT id,handle,display_name,bio,is_editorial,allow_messages,created_at FROM users WHERE handle=? AND status='active'").bind(handle).first();if(!u)return failure('Member not found.',404);const roles=(await db.prepare('SELECT role FROM user_roles WHERE user_id=?').bind(u.id).all()).results.map(x=>x.role);return response({profile:publicUser(u),roles,rolesAreSelfDescribed:true})}
 if(method==='GET'&&path==='me'){const u=await getUser(db,request);if(!u)return response({user:null});const roles=(await db.prepare('SELECT role FROM user_roles WHERE user_id=?').bind(u.id).all()).results.map(x=>x.role);const interests=(await db.prepare('SELECT interest FROM user_interests WHERE user_id=?').bind(u.id).all()).results.map(x=>x.interest);return response({user:{...publicUser(u),email:u.email,roles,interests,notificationEmail:!!u.notification_email,marketingEmail:!!u.marketing_email}})}
 if(method==='POST'&&path==='register'){
  if(!emailReady(env)||!env.TURNSTILE_SITE_KEY||!env.TURNSTILE_SECRET_KEY)return failure('Registrations are being prepared. Please check back soon.',503);
  if(!(await throttle(db,request,'register',5,3600)))return failure('Please try registering later.',429);
  const d=await readJson(request),email=clean(d.email,254).toLowerCase(),handle=clean(d.handle,24).toLowerCase(),display=clean(d.displayName,70),password=d.password;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!validHandle(handle)||display.length<2||typeof password!=='string'||password.length<12||password.length>128)return failure('Use a valid email, a 3–24 character username, a display name and a password of at least 12 characters.');
  if(!(await verifyTurnstile(env,request,d.turnstileToken,'register')))return failure('Please complete the security check and try again.',403);
  const existing=await db.prepare('SELECT 1 FROM users WHERE email=? OR handle=?').bind(email,handle).first();if(existing)return failure('That email or username is already registered.',409);
  const salt=b64(bytes(20)),hash=await passwordHash(password,salt),id=crypto.randomUUID();
  await db.prepare('INSERT INTO users(id,email,handle,display_name,password_salt,password_hash,marketing_email,notification_email) VALUES(?,?,?,?,?,?,?,?)').bind(id,email,handle,display,salt,hash,d.marketingEmail===true?1:0,d.notificationEmail===true?1:0).run();
  const roles=strings(d.roles,ROLES),interests=strings(d.interests,INTERESTS);
  const statements=[...roles.map(x=>db.prepare('INSERT INTO user_roles(user_id,role) VALUES(?,?)').bind(id,x)),...interests.map(x=>db.prepare('INSERT INTO user_interests(user_id,interest) VALUES(?,?)').bind(id,x))];if(statements.length)await db.batch(statements);
  try{await deliverToken(db,env,{id,email},'verify')}catch(e){return failure('Account created, but the confirmation email could not be sent. Please use resend verification.',503)}
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
  const candidate=await passwordHash(pw,u?.password_salt||dummySalt);
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
  await db.batch([db.prepare("UPDATE users SET password_salt=?,password_hash=?,updated_at=datetime('now') WHERE id=?").bind(salt,pwHash,t.user_id),db.prepare('DELETE FROM sessions WHERE user_id=?').bind(t.user_id),db.prepare("UPDATE email_tokens SET used_at=datetime('now') WHERE token_hash=?").bind(hash)]);
  return response({ok:true,message:'Password updated. Please sign in.'});
 }
 if(method==='POST'&&path==='logout'){
  const v=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));if(v){const token=v.slice(COOKIE.length+1);await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(token)).run()}return response({ok:true},200,{'Set-Cookie':clearCookie()});
 }
 const user=await getUser(db,request);
 if(!user)return failure('Please sign in to continue.',401);
 if(method==='POST'&&path==='settings'){
  const d=await readJson(request),roles=strings(d.roles,ROLES),interests=strings(d.interests,INTERESTS),bio=clean(d.bio,600),display=clean(d.displayName,70);
  if(display.length<2)return failure('Please enter a display name.');
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
  await db.prepare('INSERT INTO reports(id,reporter_id,target_type,target_id,reason) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),user.id,type,target,reason).run();return response({ok:true});
 }
 return failure('Community endpoint not found.',404);
 }catch(e){if(String(e).includes('UNIQUE constraint'))return failure('That email or username is already in use.',409);if(e instanceof SyntaxError)return failure('Invalid request data.');if(['Send JSON data.','Request too large.'].includes(e.message))return failure(e.message);console.error('Community request failed',path,String(e));return failure('The community service could not complete this request.',500)}
}
