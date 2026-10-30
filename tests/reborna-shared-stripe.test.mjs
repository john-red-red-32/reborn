import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {onRequest as commerce} from '../functions/api/commerce/[[path]].js';
import {amountFee,orderGuard,verifiedSignature,stripeEnabled,onboardEnabled} from '../functions/_reborna-stripe.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const request=(path,method='GET',data=null,headers={})=>new Request('https://reborna.co'+path,{method,headers:data?{'Content-Type':'application/json',...headers}:headers,body:data?JSON.stringify(data):undefined});
const env={COMMUNITY_DB:{prepare(){return {bind(){return {first:async()=>null,all:async()=>({results:[]}),run:async()=>({meta:{changes:1}})}}}}}};
test('fee arithmetic remains exactly 6.5% introductory',()=>{
 assert.equal(amountFee(10000),650);
 assert.equal(amountFee(500),33);
 assert.equal(amountFee(20000),1300);
});
test('marketplace must not activate without its own explicit settings',()=>{
 assert.equal(stripeEnabled({}),false);
 assert.equal(onboardEnabled({}),false);
 assert.equal(stripeEnabled({REBORNA_STRIPE_LIVE_ENABLED:'enabled'}),false);
});
test('private marketplace APIs require a verified signed-in account',async()=>{
 for(const path of ['/api/commerce/me','/api/commerce/orders']){
  const result=await commerce({request:request(path),env});assert.equal(result.status,401);
 }
 for(const path of ['checkout','onboard','shipping']){
  const result=await commerce({request:request('/api/commerce/'+path,'POST',{workId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'}),env});
  assert.equal(result.status,401);
 }
});
test('checkout rejects foreign origins',async()=>{
 const result=await commerce({request:request('/api/commerce/checkout','POST',{workId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'},{Origin:'https://another.example'}),env});
 assert.equal(result.status,403);
});
test('public feature status is disabled before a live launch',async()=>{
 const result=await commerce({request:request('/api/commerce/status'),env});
 assert.deepEqual(await result.json(),{checkoutLive:false,sellerOnboardingAvailable:false,initialSellerCountry:'GB'});
});
test('signed webhook checks SHA-256 HMAC and rejects forged and expired deliveries',async()=>{
 const payload='{"id":"evt_unit","type":"checkout.session.completed"}',secret='local-unit-test-signing-key';
 const now=1900000000,ts=now-30;
 const key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=await webcrypto.subtle.sign('HMAC',key,new TextEncoder().encode(ts+'.'+payload));
 const valid=Buffer.from(bytes).toString('hex');
 assert.equal(await verifiedSignature(payload,'t='+ts+',v1='+valid,secret,now),true);
 assert.equal(await verifiedSignature(payload,'t='+ts+',v1='+valid.slice(1),secret,now),false);
 assert.equal(await verifiedSignature(payload,'t='+(now-301)+',v1='+valid,secret,now),false);
 assert.equal(await verifiedSignature(payload,null,secret,now),false);
});
test('Stripe paid session validation is bound to Reborna order and payment amount',()=>{
 const order={id:'order-1',work_id:'art-1',seller_user_id:'seller-1',stripe_session_id:'session-1',amount_minor:10000,currency:'GBP'};
 const session={id:'session-1',mode:'payment',status:'complete',payment_status:'paid',amount_total:10000,currency:'gbp',metadata:{project:'reborna',order_id:'order-1',work_id:'art-1',seller_user_id:'seller-1'}};
 assert.equal(orderGuard(order,session),true);
 assert.equal(orderGuard(order,{...session,payment_status:'unpaid'}),false);
 assert.equal(orderGuard(order,{...session,amount_total:9000}),false);
 assert.equal(orderGuard(order,{...session,metadata:{...session.metadata,project:'other-business'}}),false);
});
test('webhook without valid HMAC is never accepted',async()=>{
 const result=await commerce({request:new Request('https://reborna.co/api/commerce/webhook',{method:'POST',body:'{}'}),env});
 assert.equal(result.status,400);
});
