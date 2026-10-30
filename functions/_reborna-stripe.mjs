// Reborna Stripe Connect integration. Keys are Cloudflare secrets, never bundled client-side.
// This module deliberately uses the same Stripe merchant account as Varanos,
// but independent metadata, customer orders, webhook secrets and D1 records.
const encoder=new TextEncoder();
export const FEE_BPS=650; // 3.5% platform promotional fee + 3% processing allowance.
export const LIVE_ORIGIN='https://reborna.co';
export const MINIMUM_PRICE_MINOR=500;
export const isUuid=s=>typeof s==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(s);
export const isAccount=s=>typeof s==='string'&&/^acct_[A-Za-z0-9]{12,}$/.test(s);
export const amountFee=minor=>Math.round(minor*FEE_BPS/10000);
export function requestJson(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function error(message,status=400){return requestJson({error:message},status)}
export function stripeEnabled(env){return env.REBORNA_STRIPE_LIVE_ENABLED==='enabled'&&typeof env.STRIPE_SECRET_KEY==='string'&&env.STRIPE_SECRET_KEY.startsWith('sk_live_')&&!!env.REBORNA_STRIPE_WEBHOOK_SECRET}
export function onboardEnabled(env){return env.REBORNA_STRIPE_ONBOARDING_ENABLED==='enabled'&&typeof env.STRIPE_SECRET_KEY==='string'&&/^sk_(live|test)_/.test(env.STRIPE_SECRET_KEY)}
export async function stripe(env,path,{method='GET',params=null,idempotency=null}={}){
 if(!/^sk_(live|test)_/.test(env.STRIPE_SECRET_KEY||''))throw Error('Stripe account key is not configured for Reborna.');
 const headers={'Authorization':'Bearer '+env.STRIPE_SECRET_KEY};
 if(idempotency)headers['Idempotency-Key']=idempotency;
 let body;
 if(params){
  const form=new URLSearchParams();
  for(const [k,value] of Object.entries(params)){
   if(Array.isArray(value))for(const entry of value)form.append(k+'[]',String(entry));
   else if(value!==null&&value!==undefined)form.append(k,String(value));
  }
  headers['Content-Type']='application/x-www-form-urlencoded';
  body=form.toString();
 }
 const response=await fetch('https://api.stripe.com/v1/'+path,{method,headers,body});
 let data;try{data=await response.json()}catch{data={}};
 if(!response.ok){const code=String(data?.error?.code||'unknown').slice(0,80);throw Error('Stripe rejected the operation ('+code+').')}
 return data;
}
export function sameSite(request){const origin=request.headers.get('Origin');return !origin||origin===LIVE_ORIGIN}
export async function verifiedSignature(payload,signature,secret,now=Math.floor(Date.now()/1000)){
 if(!signature||!secret?.startsWith('whsec_')||typeof payload!=='string'||payload.length>250000)return false;
 const parts=Object.fromEntries(signature.split(',').map(part=>part.trim().split('=',2)));
 const ts=Number(parts.t);
 if(!Number.isSafeInteger(ts)||Math.abs(now-ts)>300)return false;
 const signatures=signature.split(',').filter(x=>x.startsWith('v1=')).map(x=>x.slice(3).trim());
 if(!signatures.length)return false;
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),'HMAC',false,['sign']);
 const digest=await crypto.subtle.sign('HMAC',key,encoder.encode(String(ts)+'.'+payload));
 const expected=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 return signatures.some(given=>{
  if(given.length!==expected.length)return false;
  let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^given.charCodeAt(i);
  return diff===0;
 });
}
export function sellerReady(account){return Boolean(account&&account.charges_enabled&&account.payouts_enabled&&isAccount(account.stripe_account_id))}
export function orderGuard(order,session){
 return Boolean(order&&session&&session.id===order.stripe_session_id&&session.mode==='payment'&&session.status==='complete'&&session.payment_status==='paid'&&session.amount_total===order.amount_minor&&session.currency===order.currency?.toLowerCase()&&session.metadata?.project==='reborna'&&session.metadata?.order_id===order.id&&session.metadata?.work_id===order.work_id&&session.metadata?.seller_user_id===order.seller_user_id);
}