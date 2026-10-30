import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {onRequest as commerce} from '../functions/api/commerce/[[path]].js';
import {amountFee,orderGuard,verifiedSignature,stripeEnabled,onboardEnabled,isAccount} from '../functions/_reborna-stripe.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const req=(url,method='GET',body=null,headers={})=>new Request('https://reborna.co'+url,{method,headers:body?{'Content-Type':'application/json',...headers}:headers,body:body?JSON.stringify(body):undefined});
const env={COMMUNITY_DB:{prepare(){return {bind(){return {first:async()=>null,all:async()=>({results:[]}),run:async()=>({meta:{changes:1}})}}}}}};
test('6.5% combined introductory fee is exact and rounded consistently',()=>{
 assert.equal(amountFee(10000),650);
 assert.equal(amountFee(500),33);
 assert.equal(amountFee(20000),1300);
});
test('Stripe live gate never enables payment just because an unrelated merchant account exists',()=>{
 assert.equal(stripeEnabled({}),false);
 assert.equal(onboardEnabled({}),false);
 assert.equal(stripeEnabled({REBORNA_STRIPE_LIVE_ENABLED:'enabled',STRIPE_SECRET_KEY:'sk_live_example'}),false);
 assert.equal(stripeEnabled({REBORNA_STRIPE_LIVE_ENABLED:'enabled',STRIPE_SECRET_KEY:'sk_test_example',REBORNA_STRIPE_WEBHOOK_SECRET:'whsec_demo'}),false);
 assert.equal(stripeEnabled({REBORNA_STRIPE_LIVE_ENABLED:'enabled',STRIPE_SECRET_KEY:'sk_live_example',REBORNA_STRIPE_WEBHOOK_SECRET:'whsec_demo'}),true);
 assert.equal(isAccount('acct_1234567890123'),true);
});
test('unauthenticated seller or buyer never invokes a payment operation',async()=>{
 for(const url of ['/api/commerce/me','/api/commerce/orders']){
  const r=await commerce({request:req(url),env});
  assert.equal(r.status,401,url);
 }
 for(const path of ['checkout','onboard','shipping']){
  const r=await commerce({request:req('/api/commerce/'+path,'POST',{workId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'}),env});
  assert.equal(r.status,401,path);
 }
});
test('Cross-site financial POST is denied before any session or Stripe access',async()=>{
 const r=await commerce({request:req('/api/commerce/checkout','POST',{workId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'},{Origin:'https://evil.example'}),env});
 assert.equal(r.status,403);
});
test('public status correctly reports disabled seller onboarding and checkout',async()=>{
 const r=await commerce({request:req('/api/commerce/status'),env});
 assert.equal(r.status,200);
 assert.deepEqual(await r.json(),{checkoutLive:false,sellerOnboardingAvailable:false,initialSellerCountry:'GB'});
});
test('webhook signature rejects missing, stale and forged signatures and accepts valid SHA256 HMAC',async()=>{
 const raw='{"id":"evt_example","type":"checkout.session.completed"}',secret='whsec_test_string';
 const now=1900000000,ts=now-40;
 const key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(secret),'HMAC',false,['sign']);
 const bytes=await webcrypto.subtle.sign('HMAC',key,new TextEncoder().encode(ts+'.'+raw));
 const sig=Buffer.from(bytes).toString('hex');
 assert.equal(await verifiedSignature(raw,'t='+ts+',v1='+sig,secret,now),true);
 assert.equal(await verifiedSignature(raw,'t='+ts+',v1='+sig+'0',secret,now),false);
 assert.equal(await verifiedSignature(raw,'t='+(now-301)+',v1='+sig,secret,now),false);
 assert.equal(await verifiedSignature(raw,null,secret,now),false);
});
test('paid order is never accepted from merely a matching title or unverified webhook metadata',()=>{
 const o={id:'order-1',work_id:'work-1',seller_user_id:'seller-1',stripe_session_id:'cs_live_123',amount_minor:10000,currency:'GBP'};
 const s={id:'cs_live_123',mode:'payment',status:'complete',payment_status:'paid',amount_total:10000,currency:'gbp',metadata:{project:'reborna',order_id:'order-1',work_id:'work-1',seller_user_id:'seller-1'}};
 assert.equal(orderGuard(o,s),true);
 assert.equal(orderGuard(o,{...s,metadata:{...s.metadata,project:'varanos'}}),false);
 assert.equal(orderGuard(o,{...s,amount_total:9000}),false);
 assert.equal(orderGuard(o,{...s,payment_status:'unpaid'}),false);
});
test('webhook endpoint requires a separate Reborna signing secret',async()=>{
 const r=await commerce({request:new Request('https://reborna.co/api/commerce/webhook',{method:'POST',body:'{}'}),env});
 assert.equal(r.status,400);
});
