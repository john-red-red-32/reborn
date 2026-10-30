import {viewer,clean,jsonBody} from '../../_gallery.mjs';
import {requestJson,error,stripe,stripeEnabled,onboardEnabled,sameSite,verifiedSignature,isUuid,isAccount,amountFee,MINIMUM_PRICE_MINOR,orderGuard,LIVE_ORIGIN} from '../../_reborna-stripe.mjs';
const ID=/^[a-f0-9-]{36}$/i;
const EXPIRES_SECONDS=2400;
const isId=x=>typeof x==='string'&&ID.test(x);
async function getSeller(db,id){
 return db.prepare('SELECT user_id,stripe_account_id,country,charges_enabled,payouts_enabled,details_submitted FROM gallery_stripe_sellers WHERE user_id=?').bind(id).first();
}
async function markSeller(db,id,a){
 return db.prepare("UPDATE gallery_stripe_sellers SET charges_enabled=?,payouts_enabled=?,details_submitted=?,updated_at=datetime('now') WHERE stripe_account_id=?")
  .bind(a.charges_enabled?1:0,a.payouts_enabled?1:0,a.details_submitted?1:0,id).run();
}
async function sellerStatus(request,env,db,user){
 const row=await getSeller(db,user.id);
 if(!row)return requestJson({connected:false,onboardingAvailable:onboardEnabled(env),checkoutLive:stripeEnabled(env),countryPilot:'GB'});
 if(onboardEnabled(env)){
  try{const account=await stripe(env,'accounts/'+encodeURIComponent(row.stripe_account_id));await markSeller(db,row.stripe_account_id,account);
    return requestJson({connected:true,country:row.country,chargesEnabled:!!account.charges_enabled,payoutsEnabled:!!account.payouts_enabled,detailsSubmitted:!!account.details_submitted,onboardingAvailable:true,checkoutLive:stripeEnabled(env)});
  }catch{return requestJson({connected:true,country:row.country,chargesEnabled:!!row.charges_enabled,payoutsEnabled:!!row.payouts_enabled,onboardingAvailable:true,checkoutLive:false});}
 }
 return requestJson({connected:true,country:row.country,chargesEnabled:!!row.charges_enabled,payoutsEnabled:!!row.payouts_enabled,onboardingAvailable:false,checkoutLive:false});
}
async function onboard(request,env,db,user){
 if(!onboardEnabled(env))return error('Stripe seller onboarding is not enabled yet.',503);
 const profile=await db.prepare('SELECT user_id FROM artist_galleries WHERE user_id=?').bind(user.id).first();
 if(!profile)return error('Create an artist gallery before connecting seller payments.',409);
 const body=await jsonBody(request);const country=clean(body.country||'GB',2).toUpperCase();
 // Initial pilot deliberately supports domestic GB settlement; broaden only after verified payout tests.
 if(country!=='GB')return error('Seller payouts currently support United Kingdom artists in the initial pilot.',422);
 let current=await getSeller(db,user.id);
 if(!current){
  const account=await stripe(env,'accounts',{method:'POST',idempotency:'reborna-connect-'+user.id,params:{
   type:'express',country:'GB','business_type':'individual','capabilities[card_payments][requested]':'true',
   'capabilities[transfers][requested]':'true',
   'business_profile[product_description]':'Independent reborn doll artist selling original finished artwork on Reborna',
   'metadata[project]':'reborna','metadata[reborna_user_id]':user.id
  }});
  if(!isAccount(account.id))return error('Stripe could not prepare this seller.',502);
  await db.prepare("INSERT INTO gallery_stripe_sellers(user_id,stripe_account_id,country,charges_enabled,payouts_enabled,details_submitted) VALUES(?,?,?,?,?,?)")
   .bind(user.id,account.id,'GB',account.charges_enabled?1:0,account.payouts_enabled?1:0,account.details_submitted?1:0).run();
  current={stripe_account_id:account.id};
 }
 const link=await stripe(env,'account_links',{method:'POST',params:{
  account:current.stripe_account_id,type:'account_onboarding',
  refresh_url:LIVE_ORIGIN+'/dashboard/?area=gallery&connect=refresh',
  return_url:LIVE_ORIGIN+'/dashboard/?area=gallery&connect=return'
 }});
 if(typeof link.url!=='string'||!link.url.startsWith('https://connect.stripe.com/'))return error('Secure seller onboarding link unavailable.',502);
 return requestJson({url:link.url});
}
async function saveShipping(request,db,user){
 const body=await jsonBody(request),id=body.workId;
 if(!isUuid(id))return error('Choose a valid artwork.');
 const item=await db.prepare("SELECT state FROM gallery_works WHERE id=? AND user_id=? AND kind='finished_doll'").bind(id,user.id).first();
 if(!item)return error('Finished artwork not found.',404);
 if(item.state==='pending')return error('Wait until the artwork review is finished before changing delivery details.',409);
 const included=body.shippingIncluded===true,country=clean(body.shipsFromCountry,2).toUpperCase(),destination=clean(body.destinationCountry,2).toUpperCase(),days=body.dispatchDays;
 if(!included||country!=='GB'||destination!=='GB'||!Number.isInteger(days)||days<1||days>30)return error('For the pilot, confirm shipping is included in the price, UK origin and destination, and 1–30 dispatch days.',422);
 await db.prepare("INSERT INTO gallery_shipping_terms(work_id,shipping_included,ships_from_country,destination_country,dispatch_days) VALUES(?,?,?,?,?) ON CONFLICT(work_id) DO UPDATE SET shipping_included=excluded.shipping_included,ships_from_country=excluded.ships_from_country,destination_country=excluded.destination_country,dispatch_days=excluded.dispatch_days,updated_at=datetime('now')")
  .bind(id,1,country,destination,days).run();
 // Delivery details materially affect a transaction; review the work again.
 await db.prepare("UPDATE gallery_works SET state='draft',updated_at=datetime('now') WHERE id=? AND user_id=?").bind(id,user.id).run();
 return requestJson({ok:true,needsReview:true});
}
async function checkout(request,env,db,user){
 if(!stripeEnabled(env))return error('Reborna payments are not open yet.',503);
 const body=await jsonBody(request),id=body.workId;
 if(!isUuid(id))return error('Choose a valid artwork.',422);
 const work=await db.prepare("SELECT w.id,w.user_id AS sellerId,w.title,w.kind,w.display_status AS displayStatus,w.sale_format AS saleFormat,w.asking_price_minor AS price,w.currency,w.state,g.state AS galleryState,s.stripe_account_id AS destination,s.charges_enabled AS chargesEnabled,s.payouts_enabled AS payoutsEnabled,t.shipping_included AS shippingIncluded,t.ships_from_country AS shipsFrom,t.destination_country AS shipsTo FROM gallery_works w JOIN artist_galleries g ON g.user_id=w.user_id JOIN gallery_stripe_sellers s ON s.user_id=w.user_id LEFT JOIN gallery_shipping_terms t ON t.work_id=w.id WHERE w.id=?").bind(id).first();
 if(!work||work.kind!=='finished_doll'||work.displayStatus!=='available'||work.saleFormat!=='fixed'||work.state!=='approved'||work.galleryState!=='approved')return error('This reborn is not currently available for immediate purchase.',409);
 if(work.sellerId===user.id)return error('You cannot purchase your own artwork.',409);
 if(!work.chargesEnabled||!work.payoutsEnabled||!isAccount(work.destination))return error('This artist has not completed payment onboarding.',409);
 if(work.shippingIncluded!==1||work.shipsFrom!=='GB'||work.shipsTo!=='GB')return error('The artist has not completed UK delivery details.',409);
 if(!Number.isSafeInteger(work.price)||work.price<MINIMUM_PRICE_MINOR||work.price>100000000||!['GBP','EUR','USD'].includes(work.currency))return error('This artwork needs a valid price.',409);
 const orderId=crypto.randomUUID(),expires=Math.floor(Date.now()/1000)+EXPIRES_SECONDS,fee=amountFee(work.price);
 // Persist the order before trying to acquire the single-artwork checkout lock.
 await db.prepare("INSERT INTO gallery_purchase_orders(id,work_id,buyer_user_id,seller_user_id,amount_minor,application_fee_minor,currency,checkout_expires_at) VALUES(?,?,?,?,?,?,?,?)")
  .bind(orderId,work.id,user.id,work.sellerId,work.price,fee,work.currency,expires).run();
 const hold=await db.prepare("INSERT INTO gallery_checkout_holds(work_id,order_id,expires_at) VALUES(?,?,?) ON CONFLICT(work_id) DO UPDATE SET order_id=excluded.order_id,expires_at=excluded.expires_at WHERE gallery_checkout_holds.expires_at<unixepoch()")
  .bind(work.id,orderId,expires).run();
 if(hold.meta?.changes!==1){
  await db.prepare("UPDATE gallery_purchase_orders SET status='failed' WHERE id=?").bind(orderId).run();
  return error('Another collector is checking out this artwork. Please try again later.',409);
 }
 try{
  const params={
   mode:'payment',success_url:LIVE_ORIGIN+'/marketplace/?checkout=success&session_id={CHECKOUT_SESSION_ID}',
   cancel_url:LIVE_ORIGIN+'/u/'+encodeURIComponent((await db.prepare('SELECT slug FROM artist_galleries WHERE user_id=?').bind(work.sellerId).first()).slug)+'/artwork/'+work.id+'/?checkout=cancel',
   client_reference_id:orderId,customer_email:user.email,
   'line_items[0][price_data][currency]':work.currency.toLowerCase(),
   'line_items[0][price_data][unit_amount]':String(work.price),
   'line_items[0][price_data][product_data][name]':work.title,
   'line_items[0][quantity]':'1',
   'payment_intent_data[application_fee_amount]':String(fee),
   'payment_intent_data[transfer_data][destination]':work.destination,
   'payment_intent_data[metadata][project]':'reborna',
   'payment_intent_data[metadata][order_id]':orderId,
   'metadata[project]':'reborna','metadata[order_id]':orderId,
   'metadata[work_id]':work.id,'metadata[seller_user_id]':work.sellerId,
   'shipping_address_collection[allowed_countries][0]':'GB',
   expires_at:String(expires)
  };
  const session=await stripe(env,'checkout/sessions',{method:'POST',idempotency:'reborna-checkout-'+orderId,params});
  if(!session.id?.startsWith('cs_live_')||typeof session.url!=='string'||!session.url.startsWith('https://checkout.stripe.com/'))throw Error('Stripe did not return a valid live checkout session.');
  await db.prepare("UPDATE gallery_purchase_orders SET stripe_session_id=?,status='checkout',updated_at=datetime('now') WHERE id=? AND status='creating'").bind(session.id,orderId).run();
  return requestJson({url:session.url});
 }catch(e){
  await db.prepare("UPDATE gallery_purchase_orders SET status='failed',updated_at=datetime('now') WHERE id=? AND status='creating'").bind(orderId).run();
  await db.prepare('DELETE FROM gallery_checkout_holds WHERE work_id=? AND order_id=?').bind(work.id,orderId).run();
  return error('Checkout could not be started. Please try again.',503);
 }
}
async function webhook(request,env,db){
 if(Number(request.headers.get('content-length')||0)>250000)return error('Webhook is too large.',413);
 const body=await request.text();
 if(!await verifiedSignature(body,request.headers.get('stripe-signature'),env.REBORNA_STRIPE_WEBHOOK_SECRET))return error('Invalid Stripe webhook signature.',400);
 let ev;try{ev=JSON.parse(body)}catch{return error('Invalid Stripe event.',400)}
 if(!/^evt_[A-Za-z0-9]+$/.test(ev.id||''))return error('Invalid event ID.',400);
 if(ev.type==='account.updated'){
  const a=ev.data?.object;
  if(isAccount(a?.id))await markSeller(db,a.id,a);
 }else if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(ev.type)){
  const item=ev.data?.object;
  if(item?.metadata?.project==='reborna'&&typeof item.id==='string'){
   const order=await db.prepare('SELECT * FROM gallery_purchase_orders WHERE stripe_session_id=?').bind(item.id).first();
   if(!order)return error('Checkout order not yet recorded.',503);
   // Ignore the untrusted webhook body for financial amounts: retrieve Stripe's authoritative session.
   const live=await stripe(env,'checkout/sessions/'+encodeURIComponent(item.id));
   if(live.payment_status!=='paid')return requestJson({received:true,paymentPending:true});
   if(!orderGuard(order,live))return error('Payment record did not match order details.',409);
   if(order.status==='checkout'){
    const change=await db.prepare("UPDATE gallery_purchase_orders SET status='paid',stripe_payment_intent_id=?,updated_at=datetime('now') WHERE id=? AND status='checkout'").bind(String(live.payment_intent||''),order.id).run();
    if(change.meta?.changes===1){
     await db.prepare("UPDATE gallery_works SET display_status='sold',updated_at=datetime('now') WHERE id=? AND user_id=? AND state='approved'").bind(order.work_id,order.seller_user_id).run();
     await db.prepare('DELETE FROM gallery_checkout_holds WHERE work_id=? AND order_id=?').bind(order.work_id,order.id).run();
    }
   }
  }
 }else if(ev.type==='checkout.session.expired'){
  const item=ev.data?.object;
  if(item?.metadata?.project==='reborna'){
   const order=await db.prepare('SELECT id,work_id FROM gallery_purchase_orders WHERE stripe_session_id=?').bind(item.id).first();
   if(order){
    await db.prepare("UPDATE gallery_purchase_orders SET status='expired',updated_at=datetime('now') WHERE id=? AND status IN ('checkout','creating')").bind(order.id).run();
    await db.prepare('DELETE FROM gallery_checkout_holds WHERE work_id=? AND order_id=?').bind(order.work_id,order.id).run();
   }
  }
 }
 // Mark after applying transitions. Unique IDs make duplicate deliveries harmless.
 await db.prepare('INSERT OR IGNORE INTO gallery_stripe_events(event_id,event_type) VALUES(?,?)').bind(ev.id,String(ev.type||'unknown').slice(0,120)).run();
 return requestJson({received:true});
}
export async function onRequest(context){
 const {env,request}=context;
 const db=env.COMMUNITY_DB;
 if(!db)return error('Marketplace database is unavailable.',503);
 const path=new URL(request.url).pathname.replace(/^\/api\/commerce\/?/,'').replace(/\/$/,'');
 if(request.method==='POST'&&path==='webhook'){
  try{return await webhook(request,env,db)}catch(e){console.error('Reborna Stripe webhook error',String(e?.message).slice(0,130));return error('Webhook could not be processed.',503)}
 }
 if(request.method==='GET'&&path==='status')return requestJson({checkoutLive:stripeEnabled(env),sellerOnboardingAvailable:onboardEnabled(env),initialSellerCountry:'GB'});
 if(!['GET','POST'].includes(request.method))return error('Method not allowed.',405);
 if(request.method==='POST'&&!sameSite(request))return error('Invalid request origin.',403);
 let user;try{user=await viewer(db,request)}catch{return error('Session unavailable.',503)}
 if(!user)return error('Sign in to your verified Reborna account.',401);
 try{
  if(request.method==='GET'&&path==='me')return sellerStatus(request,env,db,user);
  if(request.method==='POST'&&path==='onboard')return onboard(request,env,db,user);
  if(request.method==='POST'&&path==='shipping')return saveShipping(request,db,user);
  if(request.method==='POST'&&path==='checkout')return checkout(request,env,db,user);
  if(request.method==='GET'&&path==='orders'){
   const rows=(await db.prepare("SELECT o.id,o.work_id AS workId,w.title,o.amount_minor AS amountMinor,o.currency,o.status,o.created_at AS createdAt FROM gallery_purchase_orders o JOIN gallery_works w ON w.id=o.work_id WHERE o.buyer_user_id=? ORDER BY o.created_at DESC LIMIT 30").bind(user.id).all()).results||[];
   return requestJson({orders:rows});
  }
  return error('Not found.',404);
 }catch(e){console.error('Reborna commerce API error',String(e?.message).slice(0,140));return error('Marketplace payments are temporarily unavailable.',503)}
}