import {json,fail,clean,slugValid,viewer,moderator,publicProfile,publicWorks,imagesFor,sendReviewEmail,jsonBody,sameOrigin,photoUrl} from '../../_gallery.mjs';

const UUID=/^[a-f0-9-]{36}$/;
const fmt=['fixed','auction'];
const status=['gallery','available','sold'];
const kinds=['finished_doll','original_kit'];
const currencies=['GBP','EUR','USD'];
const durations=[3,5,7,10,14];
const safeId=id=>typeof id==='string'&&UUID.test(id);
const imgMime={'image/jpeg':true,'image/webp':true,'image/png':true};
function magicOK(bytes,mime){
 if(mime==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(mime==='image/png')return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10;
 if(mime==='image/webp')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 return false;
}
async function fetchMine(db,user){
 const gallery=await db.prepare('SELECT slug,headline,story,cover_image_id AS coverImageId,state,updated_at AS updatedAt FROM artist_galleries WHERE user_id=?').bind(user.id).first();
 const works=(await db.prepare('SELECT id,title,description,kind,original_sculpt AS originalSculpt,original_sculptor AS originalSculptor,materials,provenance_note AS provenanceNote,display_status AS displayStatus,sale_format AS saleFormat,asking_price_minor AS askingPriceMinor,currency,state,created_at AS createdAt,updated_at AS updatedAt FROM gallery_works WHERE user_id=? ORDER BY updated_at DESC LIMIT 100').bind(user.id).all()).results||[];
 const images=(await db.prepare('SELECT id,work_id AS workId,sort_order AS sortOrder FROM gallery_images WHERE user_id=? ORDER BY sort_order,created_at LIMIT 800').bind(user.id).all()).results||[];
 const sales=(await db.prepare('SELECT work_id AS workId,auction_duration_days AS auctionDurationDays,reserve_price_minor AS reservePriceMinor,buy_now_price_minor AS buyNowPriceMinor FROM gallery_sale_settings WHERE work_id IN (SELECT id FROM gallery_works WHERE user_id=?)').bind(user.id).all()).results||[];
 const shipping=(await db.prepare('SELECT work_id AS workId,shipping_included AS shippingIncluded,dispatch_days AS dispatchDays FROM gallery_shipping_terms WHERE work_id IN (SELECT id FROM gallery_works WHERE user_id=?)').bind(user.id).all()).results||[];
 return {gallery:gallery||null,works:works.map(w=>({...w,...(sales.find(s=>s.workId===w.id)||{auctionDurationDays:7,reservePriceMinor:null,buyNowPriceMinor:null}),...(shipping.find(s=>s.workId===w.id)||{shippingIncluded:0,dispatchDays:5}),images:images.filter(i=>i.workId===w.id).map(i=>({...i,url:photoUrl(i.id)}))})),coverUrl:gallery?.coverImageId?photoUrl(gallery.coverImageId):null};
}
async function submit(db,env,context,user,d){
 const type=clean(d.type,20),id=clean(d.id,60);
 if(type==='profile'){
  const row=await db.prepare('SELECT slug,headline,story,state FROM artist_galleries WHERE user_id=?').bind(user.id).first();
  if(!row||row.headline.length<8||row.story.length<30)return fail('Complete your gallery headline and story before requesting review.');
  if(row.state==='pending')return fail('Your profile is already awaiting review.',409);
  await db.prepare("UPDATE artist_galleries SET state='pending',updated_at=datetime('now') WHERE user_id=?").bind(user.id).run();
  context.waitUntil(sendReviewEmail(env,db,'artist profile',user.id,user.handle));
  return json({ok:true,state:'pending',message:'Your gallery is awaiting human review. It is not public yet.'});
 }
 if(type==='work'&&safeId(id)){
  const work=await db.prepare('SELECT id,title,description,kind,original_sculpt AS originalSculpt,original_sculptor AS originalSculptor,state FROM gallery_works WHERE id=? AND user_id=?').bind(id,user.id).first();
  if(!work)return fail('Artwork not found.',404);
  const photo=await db.prepare('SELECT 1 FROM gallery_images WHERE work_id=? LIMIT 1').bind(id).first();
  if(!photo||work.description.length<35||!work.originalSculpt||!work.originalSculptor)return fail('Add at least one photo, a description, the original sculpt and its sculptor before requesting review.');
  if(work.state==='pending')return fail('This artwork is already awaiting review.',409);
  await db.prepare("UPDATE gallery_works SET state='pending',updated_at=datetime('now') WHERE id=? AND user_id=?").bind(id,user.id).run();
  context.waitUntil(sendReviewEmail(env,db,'artwork',id,user.handle));
  return json({ok:true,state:'pending',message:'Your artwork has been sent for review. No sale or auction is live.'});
 }
 return fail('Invalid submission.');
}
export async function onRequest(context){
 const {request,env}=context,db=env.COMMUNITY_DB;
 const path=new URL(request.url).pathname.replace(/^\/api\/gallery\/?/,'').replace(/\/$/,'');
 const query=new URL(request.url).searchParams;
 if(!db)return fail('Gallery database is not configured.',503);
 if(!['GET','POST'].includes(request.method))return fail('Method not allowed.',405);
 if(request.method==='POST'&&!sameOrigin(request))return fail('Invalid request origin.',403);
 try{
  if(request.method==='GET'&&path==='public'){
   const list=(await db.prepare("SELECT g.slug,u.display_name AS displayName,g.headline,(SELECT i.id FROM gallery_images i JOIN gallery_works w ON w.id=i.work_id WHERE w.user_id=g.user_id AND w.state='approved' ORDER BY w.created_at DESC,i.sort_order LIMIT 1) AS coverId,COUNT(w.id) AS works FROM artist_galleries g JOIN users u ON u.id=g.user_id LEFT JOIN gallery_works w ON w.user_id=g.user_id AND w.state='approved' WHERE g.state='approved' AND u.status='active' GROUP BY g.user_id ORDER BY g.updated_at DESC LIMIT 48").all()).results||[];
   const listings=(await db.prepare("SELECT w.id,w.title,w.sale_format AS saleFormat,w.asking_price_minor AS askingPriceMinor,w.currency,g.slug,u.display_name AS artistName,(SELECT i.id FROM gallery_images i WHERE i.work_id=w.id ORDER BY i.sort_order,i.created_at LIMIT 1) AS photoId FROM gallery_works w JOIN artist_galleries g ON g.user_id=w.user_id JOIN users u ON u.id=w.user_id WHERE w.kind='finished_doll' AND w.display_status='available' AND w.state='approved' AND g.state='approved' AND u.status='active' ORDER BY w.updated_at DESC LIMIT 48").all()).results||[];
   return json({artists:list.map(a=>({...a,coverUrl:a.coverId?photoUrl(a.coverId):null})),listings:listings.map(w=>({...w,photoUrl:w.photoId?photoUrl(w.photoId):null})),checkoutLive:false,auctionsLive:false});
  }
  if(request.method==='GET'&&path==='photo'){
   const id=query.get('id');if(!safeId(id))return fail('Photo not found.',404);
   const row=await db.prepare("SELECT i.*,w.state AS work_state,w.user_id AS work_owner,g.state AS gallery_state,u.status AS owner_status FROM gallery_images i LEFT JOIN gallery_works w ON w.id=i.work_id LEFT JOIN artist_galleries g ON g.user_id=i.user_id JOIN users u ON u.id=i.user_id WHERE i.id=?").bind(id).first();
   if(!row)return fail('Photo not found.',404);
   const publicImage=row.owner_status==='active'&&(row.work_id?row.work_state==='approved'&&row.gallery_state==='approved':row.gallery_state==='approved'&&row.id===await db.prepare('SELECT cover_image_id FROM artist_galleries WHERE user_id=?').bind(row.user_id).first().then(x=>x?.cover_image_id));
   if(!publicImage){
    const current=await viewer(db,request);
    if(!current||current.id!==row.user_id&&!(await moderator(db,current.id)))return fail('Photo not found.',404);
   }
   if(!env.MEDIA_BUCKET)return fail('Gallery photo storage is unavailable.',503);
   const object=await env.MEDIA_BUCKET.get(row.object_key);
   if(!object)return fail('Photo not found.',404);
   return new Response(object.body,{headers:{'Content-Type':row.mime_type,'Cache-Control':publicImage?'public, max-age=300':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
  }
  const user=await viewer(db,request);
  if(!user)return fail('Please sign in with a verified email.',401);
  if(request.method==='GET'&&path==='me')return json(await fetchMine(db,user));
  if(request.method==='GET'&&path==='review'){
   if(!(await moderator(db,user.id)))return fail('Not authorised.',403);
   const profiles=(await db.prepare("SELECT g.user_id AS id,g.slug,g.headline,g.story,g.state,u.handle FROM artist_galleries g JOIN users u ON u.id=g.user_id WHERE g.state='pending' ORDER BY g.updated_at LIMIT 50").all()).results||[];
   const works=(await db.prepare("SELECT w.id,w.title,w.description,w.kind,w.original_sculpt AS originalSculpt,w.original_sculptor AS originalSculptor,w.provenance_note AS provenanceNote,w.state,u.handle,g.slug FROM gallery_works w JOIN users u ON u.id=w.user_id LEFT JOIN artist_galleries g ON g.user_id=w.user_id WHERE w.state='pending' ORDER BY w.updated_at LIMIT 50").all()).results||[];
   const images=(await db.prepare("SELECT i.id,i.work_id AS workId FROM gallery_images i JOIN gallery_works w ON w.id=i.work_id WHERE w.state='pending' LIMIT 500").all()).results||[];
   return json({profiles,works:works.map(w=>({...w,images:images.filter(i=>i.workId===w.id).map(i=>photoUrl(i.id))}))});
  }
  if(request.method==='POST'&&path==='review'){
   if(!(await moderator(db,user.id)))return fail('Not authorised.',403);
   const d=await jsonBody(request),type=clean(d.type,20),id=clean(d.id,70),decision=clean(d.decision,20),note=clean(d.note,500);
   if(!['profile','work'].includes(type)||!['approved','rejected','hidden'].includes(decision))return fail('Invalid review decision.');
   const table=type==='profile'?'artist_galleries':'gallery_works',key=type==='profile'?'user_id':'id';
   if(type==='work'&&!safeId(id))return fail('Invalid artwork ID.');
   const existing=await db.prepare('SELECT state FROM '+table+' WHERE '+key+'=?').bind(id).first();
   if(!existing||existing.state!=='pending')return fail('Review item is no longer pending.',409);
   const change=await db.prepare("UPDATE "+table+" SET state=?,reviewed_by=?,reviewed_at=datetime('now'),updated_at=datetime('now') WHERE "+key+"=? AND state='pending'").bind(decision,user.id,id).run();
   if(!change.meta?.changes)return fail('Review changed; refresh and try again.',409);
   await db.prepare('INSERT INTO gallery_review_log(id,content_type,content_id,actor_id,old_state,new_state,note) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),type,id,user.id,'pending',decision,note).run();
   return json({ok:true});
  }
  if(request.method!=='POST')return fail('Not found.',404);
  if(path==='profile'){
   const d=await jsonBody(request),slug=clean(d.slug,50).toLowerCase(),headline=clean(d.headline,161),story=clean(d.story,1801);
   if(!slugValid(slug)||headline.length>160||story.length>1800)return fail('Choose a unique gallery URL (3–50 letters, numbers or hyphens) and keep within the biography limits.');
   const exists=await db.prepare('SELECT user_id FROM artist_galleries WHERE slug=?').bind(slug).first();
   if(exists&&exists.user_id!==user.id)return fail('This gallery address is already taken.',409);
   const current=await db.prepare('SELECT state FROM artist_galleries WHERE user_id=?').bind(user.id).first();
   if(current?.state==='pending')return fail('Please wait for your pending gallery review before editing.',409);
   if(!current)await db.prepare("INSERT INTO artist_galleries(user_id,slug,headline,story) VALUES(?,?,?,?)").bind(user.id,slug,headline,story).run();
   else await db.prepare("UPDATE artist_galleries SET slug=?,headline=?,story=?,state='draft',updated_at=datetime('now') WHERE user_id=?").bind(slug,headline,story,user.id).run();
   return json({ok:true,state:'draft',message:'Gallery saved privately. Request review when ready.'});
  }
  if(path==='work'){
   const d=await jsonBody(request),title=clean(d.title,111),description=clean(d.description,3001),kind=clean(d.kind,30),sculpt=clean(d.originalSculpt,121),sculptor=clean(d.originalSculptor,121),materials=clean(d.materials,141),provenance=clean(d.provenanceNote,601),display=clean(d.displayStatus,20),format=clean(d.saleFormat,20),currency=clean(d.currency,3),price=d.askingPriceMinor,duration=d.auctionDurationDays??7,reserve=d.reservePriceMinor??null,buyNow=d.buyNowPriceMinor??null;
   if(title.length<2||title.length>110||description.length>3000||sculpt.length>120||sculptor.length>120||materials.length>140||provenance.length>600||!kinds.includes(kind)||!status.includes(display)||!fmt.includes(format)||!currencies.includes(currency)||!(price===null||Number.isInteger(price)&&price>=0&&price<=100000000))return fail('Please check the artwork details and price.');
   if(display==='available'&&price===null)return fail('An available artwork needs an asking price or opening bid.');
   if(!durations.includes(duration)||![reserve,buyNow].every(n=>n===null||Number.isSafeInteger(n)&&n>=0&&n<=100000000))return fail('Check auction duration, reserve and Buy It Now prices.');
   if(format==='auction'&&display==='available'&&price!==null&&(reserve!==null&&reserve<price||buyNow!==null&&buyNow<=price||buyNow!==null&&reserve!==null&&buyNow<=reserve))return fail('Reserve must not be below the opening bid, and Buy It Now must exceed the opening bid and reserve.');
   if(d.id){
    if(!safeId(d.id))return fail('Invalid artwork ID.');
    const old=await db.prepare('SELECT state FROM gallery_works WHERE id=? AND user_id=?').bind(d.id,user.id).first();
    if(!old)return fail('Artwork not found.',404);
    if(old.state==='pending')return fail('Wait for review before editing this artwork.',409);
    await db.prepare("UPDATE gallery_works SET title=?,description=?,kind=?,original_sculpt=?,original_sculptor=?,materials=?,provenance_note=?,display_status=?,sale_format=?,asking_price_minor=?,currency=?,state='draft',updated_at=datetime('now') WHERE id=? AND user_id=?").bind(title,description,kind,sculpt,sculptor,materials,provenance,display,format,price,currency,d.id,user.id).run();
    await db.prepare("INSERT INTO gallery_sale_settings(work_id,auction_duration_days,reserve_price_minor,buy_now_price_minor) VALUES(?,?,?,?) ON CONFLICT(work_id) DO UPDATE SET auction_duration_days=excluded.auction_duration_days,reserve_price_minor=excluded.reserve_price_minor,buy_now_price_minor=excluded.buy_now_price_minor,updated_at=datetime('now')").bind(d.id,duration,format==='auction'?reserve:null,format==='auction'?buyNow:null).run();
    return json({ok:true,id:d.id,state:'draft'});
   }
   const count=await db.prepare('SELECT COUNT(*) AS total FROM gallery_works WHERE user_id=?').bind(user.id).first();
   if(count.total>=80)return fail('The pilot currently allows up to 80 artworks.',409);
   const id=crypto.randomUUID();
   await db.prepare("INSERT INTO gallery_works(id,user_id,title,description,kind,original_sculpt,original_sculptor,materials,provenance_note,display_status,sale_format,asking_price_minor,currency) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,user.id,title,description,kind,sculpt,sculptor,materials,provenance,display,format,price,currency).run();
   await db.prepare('INSERT INTO gallery_sale_settings(work_id,auction_duration_days,reserve_price_minor,buy_now_price_minor) VALUES(?,?,?,?)').bind(id,duration,format==='auction'?reserve:null,format==='auction'?buyNow:null).run();
   return json({ok:true,id,state:'draft'},201);
  }
  if(path==='submit')return submit(db,env,context,user,await jsonBody(request));
  if(path==='upload'){
   if(!env.MEDIA_BUCKET)return fail('Photo uploads are not enabled in this environment.',503);
   const totalPhotos=await db.prepare('SELECT COUNT(*) AS total FROM gallery_images WHERE user_id=?').bind(user.id).first();
   if(totalPhotos.total>=80)return fail('The gallery pilot currently allows up to 80 photographs per artist.',409);
   const recentPhotos=await db.prepare("SELECT COUNT(*) AS total FROM gallery_images WHERE user_id=? AND created_at>=datetime('now','-1 day')").bind(user.id).first();
   if(recentPhotos.total>=20)return fail('Please wait until tomorrow to upload more gallery photos.',429);
   const workId=query.get('work'),scope=query.get('scope');
   if(scope!=='cover'&&!safeId(workId))return fail('Choose an artwork for this photo.');
   if(scope!=='cover'){
    const work=await db.prepare('SELECT state FROM gallery_works WHERE id=? AND user_id=?').bind(workId,user.id).first();
    if(!work)return fail('Artwork not found.',404);
    if(work.state==='pending')return fail('Wait for review before changing photos.',409);
    const count=await db.prepare('SELECT COUNT(*) AS total FROM gallery_images WHERE work_id=?').bind(workId).first();
    if(count.total>=10)return fail('Each artwork can have up to 10 photos.',409);
   }else{
    const gallery=await db.prepare('SELECT state FROM artist_galleries WHERE user_id=?').bind(user.id).first();
    if(!gallery)return fail('Save your gallery profile before adding a cover.');
    if(gallery.state==='pending')return fail('Wait for review before changing the cover.',409);
   }
   const mime=(request.headers.get('content-type')||'').split(';')[0].toLowerCase();
   if(!imgMime[mime])return fail('Upload a JPEG, PNG or WebP photo.');
   if(Number(request.headers.get('content-length')||0)>1500000)return fail('Resize the photo to under 1.5 MB.');
   const data=await request.arrayBuffer();
   if(data.byteLength<150||data.byteLength>1500000||!magicOK(new Uint8Array(data).slice(0,16),mime))return fail('Photo format or size is invalid.');
   const id=crypto.randomUUID(),key='artist-galleries/'+user.id+'/'+id;
   await env.MEDIA_BUCKET.put(key,data,{httpMetadata:{contentType:mime}});
   try{
    if(scope==='cover'){
     const old=await db.prepare('SELECT cover_image_id AS id FROM artist_galleries WHERE user_id=?').bind(user.id).first();
     await db.prepare("INSERT INTO gallery_images(id,user_id,work_id,object_key,mime_type,bytes) VALUES(?,?,NULL,?,?,?)").bind(id,user.id,key,mime,data.byteLength).run();
     await db.prepare("UPDATE artist_galleries SET cover_image_id=?,state='draft',updated_at=datetime('now') WHERE user_id=?").bind(id,user.id).run();
     if(old?.id){const stale=await db.prepare('SELECT object_key FROM gallery_images WHERE id=? AND user_id=?').bind(old.id,user.id).first();if(stale){await db.prepare('DELETE FROM gallery_images WHERE id=?').bind(old.id).run();await env.MEDIA_BUCKET.delete(stale.object_key)}}
    }else{
     await db.prepare('INSERT INTO gallery_images(id,user_id,work_id,object_key,mime_type,bytes) VALUES(?,?,?,?,?,?)').bind(id,user.id,workId,key,mime,data.byteLength).run();
     await db.prepare("UPDATE gallery_works SET state='draft',updated_at=datetime('now') WHERE id=? AND user_id=?").bind(workId,user.id).run();
    }
   }catch(e){await env.MEDIA_BUCKET.delete(key);throw e}
   return json({ok:true,id,url:photoUrl(id)},201);
  }
  if(path==='delete-photo'){
   const d=await jsonBody(request);
   if(!safeId(d.id))return fail('Invalid photo.');
   const img=await db.prepare('SELECT i.*,w.state AS work_state,g.state AS gallery_state FROM gallery_images i LEFT JOIN gallery_works w ON w.id=i.work_id LEFT JOIN artist_galleries g ON g.user_id=i.user_id WHERE i.id=? AND i.user_id=?').bind(d.id,user.id).first();
   if(!img)return fail('Photo not found.',404);
   if(img.work_id&&img.work_state==='pending'||!img.work_id&&img.gallery_state==='pending')return fail('Wait for review before removing photos.',409);
   if(!env.MEDIA_BUCKET)return fail('Photo storage is unavailable.',503);
   await db.prepare('DELETE FROM gallery_images WHERE id=? AND user_id=?').bind(d.id,user.id).run();
   if(!img.work_id)await db.prepare("UPDATE artist_galleries SET cover_image_id=NULL,state='draft' WHERE user_id=? AND cover_image_id=?").bind(user.id,d.id).run();
   else await db.prepare("UPDATE gallery_works SET state='draft',updated_at=datetime('now') WHERE id=? AND user_id=?").bind(img.work_id,user.id).run();
   await env.MEDIA_BUCKET.delete(img.object_key);
   return json({ok:true});
  }
  return fail('Not found.',404);
 }catch(e){if(e?.message==='Request too large.'||e?.message==='Send JSON data.')return fail(e.message,413);console.error('Gallery API error',String(e).slice(0,130));return fail('Gallery temporarily unavailable.',503)}
}
