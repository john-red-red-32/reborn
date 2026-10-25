// Shared gallery helpers for Cloudflare Pages Functions. Never trust role labels self-selected by users.
const enc=new TextEncoder();
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export const fail=(message,status=400)=>json({error:message},status);
export const clean=(s,n)=>typeof s==='string'?s.trim().slice(0,n):'';
export const slugValid=s=>typeof s==='string'&&/^[a-z][a-z0-9-]{2,49}$/.test(s)&&!['admin','support','moderator','reborna','official','staff','system','help','marketplace','artists','api'].includes(s);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function viewer(db,request){
 const cookie=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('rb_session='));
 if(!cookie)return null;
 const token=cookie.slice(11);
 if(!/^[\\w-]{40,100}$/.test(token))return null;
 const hash=await crypto.subtle.digest('SHA-256',enc.encode(token));
 const value=btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
 return db.prepare("SELECT u.id,u.handle,u.display_name,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>datetime('now') AND u.status='active' AND u.email_verified_at IS NOT NULL").bind(value).first();
}
export async function moderator(db,id){return !!await db.prepare('SELECT 1 FROM community_moderators WHERE user_id=?').bind(id).first()}
export async function publicProfile(db,slug){
 return db.prepare("SELECT g.user_id,g.slug,g.headline,g.story,u.display_name AS displayName,u.handle FROM artist_galleries g JOIN users u ON u.id=g.user_id WHERE g.slug=? AND g.state='approved' AND u.status='active'").bind(slug).first();
}
export async function publicWorks(db,userId){
 return (await db.prepare("SELECT w.id,w.title,w.description,w.kind,w.original_sculpt AS originalSculpt,w.original_sculptor AS originalSculptor,w.materials,w.provenance_note AS provenanceNote,w.display_status AS displayStatus,w.sale_format AS saleFormat,w.asking_price_minor AS askingPriceMinor,w.currency,w.created_at AS createdAt FROM gallery_works w WHERE w.user_id=? AND w.state='approved' ORDER BY w.created_at DESC LIMIT 100").bind(userId).all()).results||[];
}
export async function imagesFor(db,workId){
 return (await db.prepare('SELECT id,work_id AS workId,sort_order AS sortOrder FROM gallery_images WHERE work_id=? ORDER BY sort_order,created_at LIMIT 12').bind(workId).all()).results||[];
}
export async function sendReviewEmail(env,db,type,id,ownerHandle){
 if(!env.RESEND_API_KEY||!env.COMMUNITY_MAIL_FROM)return;
 const moderators=(await db.prepare("SELECT DISTINCT u.email FROM community_moderators m JOIN users u ON u.id=m.user_id WHERE u.email IS NOT NULL AND u.status='active' LIMIT 4").all()).results||[];
 const subject='Reborna gallery review: '+type;
 for(const m of moderators){
  try{await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.COMMUNITY_MAIL_FROM,to:[m.email],subject,text:'A '+type+' from @'+ownerHandle+' awaits review in the Reborna moderator dashboard. Reference: '+id+'. No public listing or payment has been enabled.'})})}catch{/* The submission remains in the review queue if email is unavailable. */}
 }
}
export async function jsonBody(request){
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw Error('Send JSON data.');
 if(Number(request.headers.get('content-length')||0)>15000)throw Error('Request too large.');
 const text=await request.text();if(text.length>15000)throw Error('Request too large.');
 return JSON.parse(text);
}
export function sameOrigin(request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin}
export function photoUrl(id){return '/api/gallery/photo?id='+encodeURIComponent(id)}
