/**
 * Reborna artist production registry, edition history and reviewed secure bulk
 * issuance. Runs inside the existing authenticated /api/community gateway.
 * Untrusted inputs are never executable instructions or identity evidence.
 */
import {generateCertificateCode} from "../../../lib/certificate-code.mjs";

const MAX_QTY=5000,CHUNK=80;
const isUuid=s=>typeof s==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const slugOk=s=>typeof s==="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)&&s.length<=115;
const txt=(v,n)=>typeof v==="string"?v.trim().slice(0,n+1):"";
const ok=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const fail=(msg,status=400)=>ok({error:msg},status);
const safeUrl=v=>{
 if(!v)return "";
 if(typeof v!=="string"||v.length>500)return null;
 try{const url=new URL(v.trim());if(!["https:","http:"].includes(url.protocol)||url.username||url.password||url.port||!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname)||url.hostname.endsWith(".local"))return null;url.hash="";return url.href}catch{return null}
};
const randomHex=(n=32)=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>x.toString(16).padStart(2,"0")).join("");
const b64=x=>btoa(String.fromCharCode(...x));
const ub64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const encoder=new TextEncoder();
let cachedCryptoKey, cachedKeyText;
async function encryptionKey(env){
 const raw=env.CERTIFICATE_EXPORT_KEY;
 if(!raw||typeof raw!=="string")throw Error("Certificate export encryption is not configured.");
 if(cachedCryptoKey&&cachedKeyText===raw)return cachedCryptoKey;
 const bytes=ub64(raw);
 if(bytes.length!==32)throw Error("Certificate export key must contain 32 random bytes.");
 cachedCryptoKey=await crypto.subtle.importKey("raw",bytes,"AES-GCM",false,["encrypt","decrypt"]);
 cachedKeyText=raw;
 return cachedCryptoKey;
}
async function seal(env,runId,start,records){
 const key=await encryptionKey(env),iv=crypto.getRandomValues(new Uint8Array(12));
 const associatedData=encoder.encode("reborna-artist-production-v1:"+runId+":"+start);
 const raw=encoder.encode(JSON.stringify(records));
 const encrypted=await crypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:associatedData},key,raw);
 return {iv:b64(iv),ciphertext:b64(new Uint8Array(encrypted))};
}
async function unseal(env,runId,start,row){
 const key=await encryptionKey(env);
 const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:ub64(row.encryption_iv),additionalData:encoder.encode("reborna-artist-production-v1:"+runId+":"+start)},key,ub64(row.encrypted_data));
 return JSON.parse(new TextDecoder().decode(plain));
}
async function audit(db,actor,action,refs={},oldValue="",newValue="",note=""){
 return db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,old_value,new_value,note) VALUES(?,?,?,?,?,?,?,?,?)")
 .bind(crypto.randomUUID(),refs.sculptId||null,refs.editionId||null,refs.runId||null,actor,action,oldValue||null,newValue||null,note||null).run();
}
async function mySculpt(db,id,userId){
 return db.prepare("SELECT s.*,v.state AS issuer_state FROM production_sculpts s JOIN verified_sculptor_issuers v ON v.artist_slug=s.artist_slug AND v.user_id=s.issuer_user_id WHERE s.id=? AND s.issuer_user_id=?").bind(id,userId).first();
}
async function myEdition(db,id,userId){
 return db.prepare("SELECT e.*,s.issuer_user_id,s.artist_slug,s.sculpt_name,s.id AS sculpt_id,s.official_url FROM production_editions e JOIN production_sculpts s ON s.id=e.sculpt_id JOIN verified_sculptor_issuers v ON v.user_id=s.issuer_user_id AND v.artist_slug=s.artist_slug WHERE e.id=? AND s.issuer_user_id=? AND v.state='active'").bind(id,userId).first();
}
async function myRun(db,id,userId){
 return db.prepare("SELECT r.*,e.sculpt_id,e.edition_kind,e.edition_label,e.initially_declared_quantity,e.current_declared_quantity,s.artist_slug,s.sculpt_name,s.official_url,s.catalogue_kit_slug,v.state AS issuer_state FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id JOIN verified_sculptor_issuers v ON v.artist_slug=s.artist_slug AND v.user_id=s.issuer_user_id WHERE r.id=? AND s.issuer_user_id=?").bind(id,userId).first();
}
async function validateExportSession(db,userId,runId,token,sha){
 if(!/^[0-9a-f]{64}$/i.test(token||""))return false;
 const record=await db.prepare("SELECT 1 AS yes FROM production_export_sessions WHERE token_hash=? AND user_id=? AND run_id=? AND expires_at>datetime('now')").bind(await sha("reborna-production-session:"+token),userId,runId).first();
 return !!record;
}
const noticeNotGenuine="A successful lookup confirms only that an authorised sculptor account issued this code. It cannot authenticate the physical kit or exclude a copied certificate.";

export async function lookupProductionCode({db,codeHash,sha}){
 const c=await db.prepare("SELECT c.id,c.state,c.lookup_count,c.first_checked_at,c.last_checked_at,c.revoked_at,c.serial_number,r.id AS run_id,r.run_number,r.quantity AS run_quantity,r.submitted_at,r.completed_at,e.edition_kind,e.edition_label,e.initially_declared_quantity,e.current_declared_quantity,s.artist_slug,s.sculpt_name,s.official_url,s.catalogue_kit_slug,s.catalogue_link_status,v.artist_name,v.state AS issuer_state FROM production_codes c JOIN production_runs r ON r.id=c.run_id JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id JOIN verified_sculptor_issuers v ON v.user_id=s.issuer_user_id AND v.artist_slug=s.artist_slug WHERE c.code_hash=?").bind(codeHash).first();
 if(!c)return null;
 await db.batch([
  db.prepare("UPDATE production_codes SET lookup_count=lookup_count+1,first_checked_at=COALESCE(first_checked_at,datetime('now')),last_checked_at=datetime('now') WHERE id=?").bind(c.id),
  db.prepare("INSERT INTO production_code_lookups(id,code_id) VALUES(?,?)").bind(crypto.randomUUID(),c.id)
 ]);
 const day=await db.prepare("SELECT COUNT(*) AS total FROM production_code_lookups WHERE code_id=? AND checked_at>=datetime('now','-1 day')").bind(c.id).first();
 return {
  found:true,status:c.state==="revoked"?"revoked":c.issuer_state!=="active"?"issuer_suspended":"issued",
  artistName:c.artist_name,artistSlug:c.artist_slug,sculptName:c.sculpt_name,
  editionNote:c.edition_label,officialSculptUrl:c.official_url||null,
  issuedAt:c.completed_at,revokedAt:c.revoked_at,
  previousChecks:c.lookup_count,totalChecks:c.lookup_count+1,
  firstCheckedAt:c.first_checked_at,lastCheckedAt:c.last_checked_at,
  repeatedChecksIn24h:Math.max(0,(day?.total||1)-1),
  reviewSuggested:c.lookup_count+1>=5||(day?.total||0)>=4,
  productionRun:c.run_number,
  certificateNumber:c.serial_number,
  originallyDeclaredSize:c.initially_declared_quantity,
  currentlyDeclaredSize:c.current_declared_quantity,
  editionKind:c.edition_kind,
  kitUrl:c.catalogue_link_status==="linked"&&slugOk(c.catalogue_kit_slug)?"/kits/"+c.catalogue_kit_slug+"/":null,
  message:noticeNotGenuine
 };
}
const productionRoutes=new Set([
 "production-studio","production-sculpt-create","production-sculpt-edit","production-edition-create",
 "production-run-request","production-run-edit","production-review-queue","production-run-review",
 "production-correction-request","production-correction-review","production-link-propose","production-link-review",
 "production-prepare","production-confirm","production-next","production-export-chunk",
 "production-export-archive","production-revoke","production-cleanup"
]);
export function isProductionPath(path){return productionRoutes.has(path)}
export async function handleProduction(ctx){
 const {path,request,env,db,user,sha,readJson,sendEmail,emailReady,isModerator,throttle,context}=ctx;
 const method=request.method;
 const body=method==="POST"?await readJson(request):{};
 if(method==="GET"&&path==="production-studio"){
  const [sculpts,editions,runs,proposals,corrections]=await Promise.all([
   db.prepare("SELECT s.id,s.artist_slug AS artistSlug,s.sculpt_name AS sculptName,s.official_url AS officialUrl,s.catalogue_kit_slug AS catalogueKitSlug,s.catalogue_link_status AS linkStatus,s.proposed_kit_slug AS proposedKitSlug,s.created_at AS createdAt FROM production_sculpts s WHERE issuer_user_id=? ORDER BY s.created_at DESC LIMIT 65").bind(user.id).all(),
   db.prepare("SELECT e.id,e.sculpt_id AS sculptId,e.edition_label AS editionLabel,e.edition_kind AS editionKind,e.initially_declared_quantity AS initiallyDeclaredQuantity,e.current_declared_quantity AS currentDeclaredQuantity FROM production_editions e JOIN production_sculpts s ON e.sculpt_id=s.id WHERE s.issuer_user_id=? ORDER BY e.created_at DESC LIMIT 120").bind(user.id).all(),
   db.prepare("SELECT r.id,r.edition_id AS editionId,r.run_number AS runNumber,r.quantity,r.serial_start AS serialStart,r.status,r.generated_count AS generatedCount,r.change_acknowledged AS changeAcknowledged,r.review_note AS reviewNote,r.submitted_at AS submittedAt,r.completed_at AS completedAt,r.export_expires_at AS exportExpiresAt,r.export_archived_at AS exportArchivedAt FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id WHERE s.issuer_user_id=? ORDER BY r.submitted_at DESC LIMIT 140").bind(user.id).all(),
   db.prepare("SELECT p.id,p.sculpt_id AS sculptId,p.proposed_kit_slug AS proposedKitSlug,p.state,p.review_note AS reviewNote FROM production_link_proposals p JOIN production_sculpts s ON s.id=p.sculpt_id WHERE s.issuer_user_id=? ORDER BY p.created_at DESC LIMIT 30").bind(user.id).all(),
   db.prepare("SELECT p.id,p.sculpt_id AS sculptId,p.proposed_name AS proposedName,p.state,p.review_note AS reviewNote FROM production_corrections p JOIN production_sculpts s ON s.id=p.sculpt_id WHERE s.issuer_user_id=? ORDER BY p.created_at DESC LIMIT 30").bind(user.id).all()
  ]);
  const issuers=(await db.prepare("SELECT artist_slug AS artistSlug,artist_name AS artistName,state FROM verified_sculptor_issuers WHERE user_id=? ORDER BY artist_name").bind(user.id).all()).results||[];
  return ok({sculpts:sculpts.results||[],editions:editions.results||[],runs:runs.results||[],proposals:proposals.results||[],corrections:corrections.results||[],issuers,exportReady:!!env.CERTIFICATE_EXPORT_KEY,freePilot:true,maxRunQuantity:MAX_QTY});
 }
 if(method==="POST"&&path==="production-sculpt-create"){
  if(!(await throttle(db,request,"production-sculpt-create",30,86400)))return fail("Too many new private sculpt records today.",429);
  const artistSlug=txt(body.artistSlug,95),name=txt(body.sculptName,120),url=safeUrl(body.officialUrl);
  if(!slugOk(artistSlug)||name.length<2||name.length>120||url===null)return fail("Enter an approved sculptor, an original sculpt name, and optionally its official source website.");
  const issuer=await db.prepare("SELECT 1 AS yes FROM verified_sculptor_issuers WHERE user_id=? AND artist_slug=? AND state='active'").bind(user.id,artistSlug).first();
  if(!issuer)return fail("Only independently authorised sculptors can create production records.",403);
  const prior=await db.prepare("SELECT id FROM production_sculpts WHERE issuer_user_id=? AND artist_slug=? AND lower(sculpt_name)=lower(?)").bind(user.id,artistSlug,name).first();
  if(prior)return fail("You've already created this sculpt in your private studio. Add an edition to the existing record.",409);
  const id=crypto.randomUUID();
  await db.batch([
   db.prepare("INSERT INTO production_sculpts(id,issuer_user_id,artist_slug,sculpt_name,official_url) VALUES(?,?,?,?,?)").bind(id,user.id,artistSlug,name,url||null),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,actor_id,action,new_value) VALUES(?,? ,?,'create_sculpt',?)").bind(crypto.randomUUID(),id,user.id,name)
  ]);
  return ok({ok:true,id,message:"Private sculpt saved. It isn't publicly listed or authenticated."},201);
 }
 if(method==="POST"&&path==="production-sculpt-edit"){
  const id=txt(body.sculptId,45),name=txt(body.sculptName,120),url=safeUrl(body.officialUrl);
  if(!isUuid(id)||name.length<2||name.length>120||url===null)return fail("Enter a valid sculpt and correction details.");
  const sculpt=await mySculpt(db,id,user.id);
  if(!sculpt||sculpt.issuer_state!=="active")return fail("Sculpt not available.",403);
  const count=await db.prepare("SELECT COUNT(*) AS total FROM production_codes c JOIN production_runs r ON r.id=c.run_id JOIN production_editions e ON e.id=r.edition_id WHERE e.sculpt_id=?").bind(id).first();
  if(count?.total>0)return fail("Codes have already been issued. Submit an audited editorial correction instead of editing the live identity.",409);
  await db.batch([
   db.prepare("UPDATE production_sculpts SET sculpt_name=?,official_url=?,updated_at=datetime('now') WHERE id=?").bind(name,url||null,id),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,actor_id,action,old_value,new_value) VALUES(?,?,?,'edit_preissuance',?,?)").bind(crypto.randomUUID(),id,user.id,JSON.stringify({name:sculpt.sculpt_name,url:sculpt.official_url}),JSON.stringify({name,url}))
  ]);
  return ok({ok:true,message:"Private sculpt updated. Existing certificate codes were not affected."});
 }
 if(method==="POST"&&path==="production-edition-create"){
  if(!(await throttle(db,request,"production-edition-create",20,86400)))return fail("Too many edition records created today.",429);
  const sculptId=txt(body.sculptId,45),label=txt(body.editionLabel,95),kind=body.editionKind;
  const declared=body.declaredQuantity;
  if(!isUuid(sculptId)||label.length<2||label.length>90||!["limited","open"].includes(kind))return fail("Please provide the edition name and its publication type.");
  if(kind==="limited"&&(!Number.isInteger(declared)||declared<1||declared>50000))return fail("A limited edition needs a declared size from 1 to 50,000.");
  const sculpt=await mySculpt(db,sculptId,user.id);
  if(!sculpt||sculpt.issuer_state!=="active")return fail("A verified issuer must own the sculpt.",403);
  const id=crypto.randomUUID();
  try{await db.batch([
   db.prepare("INSERT INTO production_editions(id,sculpt_id,edition_label,edition_kind,initially_declared_quantity,current_declared_quantity) VALUES(?,?,?,?,?,?)").bind(id,sculptId,label,kind,kind==="limited"?declared:null,kind==="limited"?declared:null),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,actor_id,action,new_value) VALUES(?,?,?,?,'create_edition',?)").bind(crypto.randomUUID(),sculptId,id,user.id,JSON.stringify({label,kind,declared}))
  ])}catch(e){if(String(e).includes("UNIQUE"))return fail("This edition already exists. Use the existing edition for further production runs.",409);throw e}
  return ok({ok:true,id},201);
 }
 if(method==="POST"&&path==="production-run-request"){
  if(!(await throttle(db,request,"production-run-request",6,86400)))return fail("Too many new production requests today.",429);
  const editionId=txt(body.editionId,45),qty=body.quantity;
  if(!isUuid(editionId)||!Number.isInteger(qty)||qty<1||qty>MAX_QTY)return fail("Choose an edition and enter an exact quantity between 1 and 5,000.");
  if(body.confirmedNewIssue!==true)return fail("Confirm these are new certificates, not replacements or reprints of previously issued codes.");
  const edition=await myEdition(db,editionId,user.id);
  if(!edition)return fail("Only the independently approved original sculptor can request this production run.",403);
  const open=await db.prepare("SELECT COUNT(*) AS total FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id WHERE s.issuer_user_id=? AND r.status IN ('pending','approved','generating')").bind(user.id).first();
  if(open?.total>0)return fail("You already have an open production request. Complete or resolve it before requesting more.",429);
  const prior=await db.prepare("SELECT COALESCE(SUM(quantity),0) AS total,COALESCE(MAX(run_number),0) AS last FROM production_runs WHERE edition_id=? AND status!='rejected'").bind(editionId).first();
  const serialStart=(prior?.total||0)+1,editionTotal=serialStart+qty-1;
  const expansion=edition.edition_kind==="limited"&&editionTotal>edition.current_declared_quantity;
  if(expansion&&body.acknowledgeEditionChange!==true)return fail("This request exceeds the edition's published size. Confirm the proposed increase; Reborna will flag it for review and retain the originally declared limit.",409);
  const id=crypto.randomUUID();
  try{await db.batch([
   db.prepare("INSERT INTO production_runs(id,edition_id,run_number,quantity,serial_start,change_acknowledged) VALUES(?,?,?,?,?,?)").bind(id,editionId,(prior?.last||0)+1,qty,serialStart,expansion?1:0),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,new_value,note) VALUES(?,?,?,?,?,'request_run',?,?)").bind(crypto.randomUUID(),edition.sculpt_id,editionId,id,user.id,JSON.stringify({qty,serialStart,editionTotal}),expansion?"Expansion of declared edition size requested":"New production run")
  ])}catch(e){if(String(e).includes("UNIQUE"))return fail("Concurrent production request detected. Refresh before trying again.",409);throw e}
  if(emailReady(env)&&typeof context.waitUntil==="function")context.waitUntil(sendEmail(env,"hello@reborna.co","Reborna production run awaiting editorial review","<p>A verified sculptor submitted a production request. Log in to the private dashboard to review edition history and quantity.</p><p>Reference: "+id+"</p>").catch(()=>{}));
  return ok({ok:true,id,message:"Run sent for editorial approval. No certificate codes have been generated."},201);
 }
 if(method==="POST"&&path==="production-run-edit"){
  const id=txt(body.runId,45),quantity=body.quantity;
  if(!isUuid(id)||!Number.isInteger(quantity)||quantity<1||quantity>MAX_QTY||body.confirmedNewIssue!==true)return fail("Enter an exact quantity and confirm these are new certificates, not reprints.");
  const run=await myRun(db,id,user.id);
  if(!run||run.status!=="pending")return fail("Only pending requests can be edited; reviewed production declarations are locked.",409);
  const finalCount=run.serial_start+quantity-1;
  const expanding=run.edition_kind==="limited"&&finalCount>run.current_declared_quantity;
  if(expanding&&body.acknowledgeEditionChange!==true)return fail("Explicitly acknowledge increasing the edition's published size.",409);
  await db.batch([
   db.prepare("UPDATE production_runs SET quantity=?,change_acknowledged=?,submitted_at=datetime('now') WHERE id=? AND status='pending'").bind(quantity,expanding?1:0,id),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,old_value,new_value,note) VALUES(?,?,?,?,?,'edit_pending_run',?,?,?)").bind(crypto.randomUUID(),run.sculpt_id,run.edition_id,id,user.id,String(run.quantity),String(quantity),"Pending quantity updated before editorial approval")
  ]);
  return ok({ok:true,message:"Pending production quantity updated; the request remains awaiting founder review. No codes have been issued."});
 }
 if(method==="GET"&&path==="production-review-queue"){
  if(!(await isModerator(db,user.id)))return fail("Not authorised.",403);
  const [runs,corrections,links]=await Promise.all([
   db.prepare("SELECT r.id,r.status,r.quantity,r.serial_start AS serialStart,r.run_number AS runNumber,r.change_acknowledged AS changeAcknowledged,r.review_note AS reviewNote,e.edition_label AS editionLabel,e.edition_kind AS editionKind,e.current_declared_quantity AS declaredQuantity,e.initially_declared_quantity AS initialQuantity,s.sculpt_name AS sculptName,s.artist_slug AS artistSlug,s.official_url AS officialUrl,u.handle AS memberHandle FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id JOIN users u ON u.id=s.issuer_user_id WHERE r.status='pending' ORDER BY r.submitted_at DESC LIMIT 50").all(),
   db.prepare("SELECT c.id,c.sculpt_id AS sculptId,c.proposed_name AS proposedName,c.proposed_official_url AS proposedOfficialUrl,c.justification,s.sculpt_name AS currentName,s.official_url AS currentUrl,s.artist_slug AS artistSlug,u.handle AS memberHandle FROM production_corrections c JOIN production_sculpts s ON s.id=c.sculpt_id JOIN users u ON u.id=s.issuer_user_id WHERE c.state='pending' ORDER BY c.created_at DESC LIMIT 30").all(),
   db.prepare("SELECT p.id,p.sculpt_id AS sculptId,p.proposed_kit_slug AS proposedKitSlug,p.source_note AS sourceNote,s.sculpt_name AS sculptName,s.artist_slug AS artistSlug,u.handle AS memberHandle FROM production_link_proposals p JOIN production_sculpts s ON s.id=p.sculpt_id JOIN users u ON u.id=s.issuer_user_id WHERE p.state='pending' ORDER BY p.created_at DESC LIMIT 30").all()
  ]);
  return ok({runs:runs.results||[],corrections:corrections.results||[],links:links.results||[]});
 }
 if(method==="POST"&&path==="production-run-review"){
  if(!(await isModerator(db,user.id)))return fail("Not authorised.",403);
  const runId=txt(body.runId,45),decision=body.decision,note=txt(body.note,500);
  if(!isUuid(runId)||!["approved","rejected"].includes(decision)||note.length<20||note.length>450)return fail("Review needs a valid run, decision, and an explanation of at least 20 characters.");
  const r=await db.prepare("SELECT r.*,e.current_declared_quantity,e.initially_declared_quantity,e.edition_kind,e.sculpt_id,s.issuer_user_id,s.artist_slug,v.state AS issuer_state FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id JOIN verified_sculptor_issuers v ON v.user_id=s.issuer_user_id AND v.artist_slug=s.artist_slug WHERE r.id=?").bind(runId).first();
  if(!r||r.status!=="pending")return fail("This request has already been reviewed, or no longer exists.",409);
  if(r.issuer_state!=="active"&&decision==="approved")return fail("The sculptor's issuing account is suspended.",403);
  const total=r.serial_start+r.quantity-1;
  if(r.edition_kind==="limited"&&total>r.current_declared_quantity&&!r.change_acknowledged&&decision==="approved")return fail("Edition expansion was not explicitly acknowledged by its original sculptor.",409);
  const commands=[
   db.prepare("UPDATE production_runs SET status=?,review_note=?,reviewed_by=?,reviewed_at=datetime('now') WHERE id=? AND status='pending'").bind(decision,note,user.id,runId),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,old_value,new_value,note) VALUES(?,?,?,?,?,'review_run','pending',?,?)").bind(crypto.randomUUID(),r.sculpt_id,r.edition_id,runId,user.id,decision,note)
  ];
  if(decision==="approved"&&r.edition_kind==="limited"&&total>r.current_declared_quantity){
   commands.push(db.prepare("UPDATE production_editions SET current_declared_quantity=? WHERE id=?").bind(total,r.edition_id));
   commands.push(db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,old_value,new_value,note) VALUES(?,?,?,?,?,'approve_edition_expansion',?,?,?)").bind(crypto.randomUUID(),r.sculpt_id,r.edition_id,runId,user.id,String(r.current_declared_quantity),String(total),note));
  }
  await db.batch(commands);
  return ok({ok:true,message:decision==="approved"?"Approved. Only this sculptor can now confirm by email and generate the new codes.":"Request rejected; no codes were generated."});
 }
 if(method==="POST"&&path==="production-correction-request"){
  if(!(await throttle(db,request,"production-correction-request",6,86400)))return fail("Too many correction requests today.",429);
  const sculptId=txt(body.sculptId,45),name=txt(body.sculptName,130),url=safeUrl(body.officialUrl),justification=txt(body.justification,650);
  if(!isUuid(sculptId)||name.length<2||name.length>120||url===null||justification.length<15||justification.length>600)return fail("Provide the new sculpt details and a reason for the correction.");
  if(!(await mySculpt(db,sculptId,user.id)))return fail("Original sculpt not found.",404);
  const old=await db.prepare("SELECT id FROM production_corrections WHERE sculpt_id=? AND state='pending'").bind(sculptId).first();
  if(old)return fail("A correction is already being reviewed for this sculpt.",409);
  const id=crypto.randomUUID();
  await db.prepare("INSERT INTO production_corrections(id,sculpt_id,proposed_name,proposed_official_url,justification) VALUES(?,?,?,?,?)").bind(id,sculptId,name,url||null,justification).run();
  return ok({ok:true,message:"Correction submitted for editorial review. Issued codes remain unchanged."},201);
 }
 if(method==="POST"&&path==="production-correction-review"){
  if(!(await isModerator(db,user.id)))return fail("Not authorised.",403);
  const id=txt(body.id,45),decision=body.decision,note=txt(body.note,450);
  if(!isUuid(id)||!["approved","rejected"].includes(decision)||note.length<15)return fail("Complete the editorial decision and documented reason.");
  const c=await db.prepare("SELECT c.*,s.sculpt_name,s.official_url FROM production_corrections c JOIN production_sculpts s ON c.sculpt_id=s.id WHERE c.id=? AND c.state='pending'").bind(id).first();
  if(!c)return fail("Correction already reviewed or missing.",409);
  const changes=[
   db.prepare("UPDATE production_corrections SET state=?,reviewed_by=?,review_note=?,reviewed_at=datetime('now') WHERE id=? AND state='pending'").bind(decision,user.id,note,id),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,actor_id,action,old_value,new_value,note) VALUES(?, ?,?,'review_sculpt_correction',?,?,?)").bind(crypto.randomUUID(),c.sculpt_id,user.id,JSON.stringify({name:c.sculpt_name,url:c.official_url}),JSON.stringify({decision,name:c.proposed_name,url:c.proposed_official_url}),note)
  ];
  if(decision==="approved")changes.push(db.prepare("UPDATE production_sculpts SET sculpt_name=?,official_url=?,updated_at=datetime('now') WHERE id=?").bind(c.proposed_name,c.proposed_official_url,c.sculpt_id));
  await db.batch(changes);
  return ok({ok:true,message:"Correction reviewed. Every original code and edition declaration remains preserved."});
 }
 if(method==="POST"&&path==="production-link-propose"){
  if(!(await throttle(db,request,"production-link-propose",6,86400)))return fail("Too many catalogue association requests today.",429);
  const sculptId=txt(body.sculptId,45),slug=txt(body.kitSlug,120),note=txt(body.note,450);
  if(!isUuid(sculptId)||!slugOk(slug)||note.length<10)return fail("Select a known Reborna kit page and explain the catalogue match.");
  const sculpt=await mySculpt(db,sculptId,user.id);
  if(!sculpt)return fail("Sculpt record not available.",404);
  const active=await db.prepare("SELECT id FROM production_link_proposals WHERE sculpt_id=? AND state='pending'").bind(sculptId).first();
  if(active)return fail("A proposed catalogue link already awaits editorial review.",409);
  const id=crypto.randomUUID();
  await db.batch([
   db.prepare("INSERT INTO production_link_proposals(id,sculpt_id,proposed_kit_slug,source_note) VALUES(?,?,?,?)").bind(id,sculptId,slug,note),
   db.prepare("UPDATE production_sculpts SET proposed_kit_slug=?,catalogue_link_status='suggested' WHERE id=?").bind(slug,sculptId)
  ]);
  return ok({ok:true,message:"Artist-confirmed possible match sent for editorial verification. No automatic public link was made."},201);
 }
 if(method==="POST"&&path==="production-link-review"){
  if(!(await isModerator(db,user.id)))return fail("Not authorised.",403);
  const id=txt(body.id,45),decision=body.decision,note=txt(body.note,450);
  if(!isUuid(id)||!["linked","rejected"].includes(decision)||note.length<20)return fail("A documented source check is required before linking the public catalogue.");
  const p=await db.prepare("SELECT p.*,s.catalogue_kit_slug,s.artist_slug FROM production_link_proposals p JOIN production_sculpts s ON s.id=p.sculpt_id WHERE p.id=? AND p.state='pending'").bind(id).first();
  if(!p)return fail("Catalogue proposal no longer pending.",409);
  const commands=[
   db.prepare("UPDATE production_link_proposals SET state=?,reviewed_by=?,review_note=?,reviewed_at=datetime('now') WHERE id=? AND state='pending'").bind(decision,user.id,note,id),
   db.prepare("UPDATE production_sculpts SET catalogue_kit_slug=?,catalogue_link_status=?,proposed_kit_slug=NULL,updated_at=datetime('now') WHERE id=?").bind(decision==="linked"?p.proposed_kit_slug:p.catalogue_kit_slug,decision==="linked"?"linked":p.catalogue_kit_slug?"linked":"unlinked",p.sculpt_id),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,actor_id,action,old_value,new_value,note) VALUES(?, ?,?,'review_catalogue_link',?,?,?)").bind(crypto.randomUUID(),p.sculpt_id,user.id,p.catalogue_kit_slug||"",decision==="linked"?p.proposed_kit_slug:"rejected",note)
  ];
  await db.batch(commands);
  return ok({ok:true,message:decision==="linked"?"Artist-confirmed and editorially reviewed catalogue link approved.":"Unverified match rejected."});
 }
 if(method==="POST"&&path==="production-prepare"){
  if(!emailReady(env)||!user.email||!user.email_verified_at)return fail("A verified member email and operational email delivery are required.",503);
  if(!env.CERTIFICATE_EXPORT_KEY)return fail("Secure bulk certificate exports are not enabled.",503);
  if(!(await throttle(db,request,"production-prepare",4,3600)))return fail("Too many approval emails. Try again later.",429);
  const runId=txt(body.runId,45);
  if(!isUuid(runId))return fail("Select an approved production run.");
  const run=await myRun(db,runId,user.id);
  if(!run||run.issuer_state!=="active"||!["approved","generating","ready"].includes(run.status))return fail("A founder-approved production run is required for secure issuance.",403);
  if(run.status==="ready"&&(run.export_archived_at||run.export_expires_at&&run.export_expires_at.replace(" ","T")+"Z"<new Date().toISOString()))return fail("This secure export is no longer available. Contact Reborna; generating extra codes is not a replacement.",409);
  if(run.status==="approved"){
   const previous=await db.prepare("SELECT COUNT(*) AS total FROM production_runs r JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON e.sculpt_id=s.id WHERE s.issuer_user_id=? AND r.status IN ('generating','ready','archived') AND r.started_at>=datetime('now','-1 day')").bind(user.id).first();
   const legacy=await db.prepare("SELECT COUNT(*) AS total FROM certificate_batches WHERE issuer_user_id=? AND issued_at>=datetime('now','-1 day')").bind(user.id).first();
   if((previous?.total||0)>0||(legacy?.total||0)>0)return fail("Only one NEW production run can begin in 24 hours. Reuse existing downloaded codes for reprints.",429);
  }
  const id=crypto.randomUUID(),pin=String(crypto.getRandomValues(new Uint32Array(1))[0]%100000000).padStart(8,"0");
  const requestHash=await sha("reborna-production-approval:"+run.id+":"+run.quantity);
  const approvalHash=await sha("reborna-certificate-email-v1:"+id+":"+pin);
  await db.batch([
   db.prepare("DELETE FROM certificate_issue_approvals WHERE user_id=? OR expires_at<datetime('now')").bind(user.id),
   db.prepare("INSERT INTO certificate_issue_approvals(id,user_id,artist_slug,request_hash,approval_hash) VALUES(?,?,?,?,?)").bind(id,user.id,run.artist_slug,requestHash,approvalHash)
  ]);
  const html="<p>Confirm Reborna certificate issuance or secure export access.</p>"
   +"<p>Original sculpt: "+run.sculpt_name.replace(/[&<>"']/g,"")+"; production run: "+run.run_number+"; certificates: "+run.quantity+".</p>"
   +"<p><strong>Your one-time approval code: "+pin+"</strong></p>"
   +"<p>Enter it on your signed-in dashboard within 10 minutes. If you did not request this, do not approve it; contact hello@reborna.co.</p>"
   +"<p>Full certificate codes are NEVER emailed. They remain concealed until secure download.</p>";
  try{await sendEmail(env,user.email,"Approve your Reborna production run",html)}
  catch{
   await db.prepare("DELETE FROM certificate_issue_approvals WHERE id=? AND user_id=?").bind(id,user.id).run();
   return fail("Email delivery failed. No codes were issued. Retry the confirmation later.",503);
  }
  return ok({ok:true,approvalId:id,message:"We've emailed an eight-digit approval code to your verified address. Check spam if needed. This is not your certificate CSV."});
 }
 if(method==="POST"&&path==="production-confirm"){
  if(!env.CERTIFICATE_EXPORT_KEY)return fail("Certificate encryption is not configured.",503);
  const runId=txt(body.runId,45),approvalId=txt(body.approvalId,45),pin=txt(body.emailCode,12);
  if(!isUuid(runId)||!isUuid(approvalId)||!/^[0-9]{8}$/.test(pin))return fail("Enter your emailed eight-digit approval code.");
  const run=await myRun(db,runId,user.id);
  if(!run||run.issuer_state!=="active"||!["approved","generating","ready"].includes(run.status))return fail("This run cannot be accessed.",403);
  const requestHash=await sha("reborna-production-approval:"+run.id+":"+run.quantity),approvalHash=await sha("reborna-certificate-email-v1:"+approvalId+":"+pin);
  const approved=await db.prepare("UPDATE certificate_issue_approvals SET used_at=datetime('now') WHERE id=? AND user_id=? AND artist_slug=? AND request_hash=? AND approval_hash=? AND attempts<5 AND used_at IS NULL AND expires_at>datetime('now') RETURNING id").bind(approvalId,user.id,run.artist_slug,requestHash,approvalHash).first();
  if(!approved){
   await db.prepare("UPDATE certificate_issue_approvals SET attempts=attempts+1 WHERE id=? AND user_id=? AND used_at IS NULL AND attempts<5").bind(approvalId,user.id).run();
   return fail("Approval code invalid, expired or used. Please request a fresh email.",403);
  }
  // Starting production locks the run. The token is secret, time-limited,
  // bound to both issuer and run and kept only in browser memory.
  const token=randomHex(32),tokenHash=await sha("reborna-production-session:"+token);
  const commands=[
   db.prepare("INSERT INTO production_export_sessions(token_hash,run_id,user_id) VALUES(?,?,?)").bind(tokenHash,runId,user.id)
  ];
  if(run.status==="approved"){
   commands.push(db.prepare("UPDATE production_runs SET status='generating',started_at=datetime('now') WHERE id=? AND status='approved'").bind(runId));
   commands.push(db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,new_value) VALUES(?,?,?,?,?,'start_generation',?)").bind(crypto.randomUUID(),run.sculpt_id,run.edition_id,runId,user.id,String(run.quantity)));
  }
  await db.batch(commands);
  return ok({ok:true,sessionToken:token,expiresInMinutes:45,quantity:run.quantity,generatedCount:run.generated_count,status:run.status==="approved"?"generating":run.status,message:"Secure email-confirmed access granted. Keep this tab open during generation or confirm by email again later to resume."});
 }
 if(method==="POST"&&path==="production-next"){
  const runId=txt(body.runId,45),sessionToken=body.sessionToken;
  if(!isUuid(runId)||!(await validateExportSession(db,user.id,runId,sessionToken,sha)))return fail("Your secure session has expired. Confirm your email again to resume.",403);
  const run=await myRun(db,runId,user.id);
  if(!run||run.issuer_state!=="active")return fail("Issuer no longer authorised.",403);
  if(run.status==="ready")return ok({ok:true,done:true,generatedCount:run.generated_count,quantity:run.quantity});
  if(run.status!=="generating")return fail("This production run is not generating certificates.",409);
  const start=run.generated_count,total=Math.min(CHUNK,run.quantity-start);
  if(total<=0)return fail("Run has an inconsistent generation state. Contact support.",409);
  const records=Array.from({length:total},(_,i)=>({id:crypto.randomUUID(),serial:run.serial_start+start+i,code:generateCertificateCode()}));
  const hashes=await Promise.all(records.map(x=>sha("certificate-v2:"+x.code)));
  const sealed=await seal(env,runId,start,records.map(x=>({number:x.serial,code:x.code})));
  const statements=[];
  for(let i=0;i<records.length;i+=20){
   const slice=records.slice(i,i+20);
   const placeholders=slice.map(()=>" (?,?,?,?,?) ").join(",");
   const binds=slice.flatMap((x,j)=>[x.id,runId,x.serial,hashes[i+j],x.code.slice(-4)]);
   statements.push(db.prepare("INSERT INTO production_codes(id,run_id,serial_number,code_hash,hint) VALUES "+placeholders).bind(...binds));
  }
  statements.push(db.prepare("INSERT INTO production_export_chunks(run_id,chunk_start,item_count,encryption_iv,encrypted_data) VALUES(?,?,?,?,?)").bind(runId,start,total,sealed.iv,sealed.ciphertext));
  statements.push(db.prepare("UPDATE production_runs SET generated_count=?,status=?,completed_at=CASE WHEN ?='ready' THEN datetime('now') ELSE completed_at END,export_expires_at=CASE WHEN ?='ready' THEN datetime('now','+7 days') ELSE export_expires_at END WHERE id=? AND status='generating' AND generated_count=?").bind(start+total,start+total===run.quantity?"ready":"generating",start+total===run.quantity?"ready":"generating",start+total===run.quantity?"ready":"generating",runId,start));
  try{await db.batch(statements)}catch(e){
   // A duplicate chunk from competing tabs is rolled back as one transaction.
   const current=await myRun(db,runId,user.id);
   if(current&&current.generated_count>start)return ok({ok:true,done:current.status==="ready",generatedCount:current.generated_count,quantity:current.quantity,recoveredFromConcurrentRequest:true});
   throw e;
  }
  const done=start+total===run.quantity;
  if(done){
   if(typeof context.waitUntil==="function"&&emailReady(env)&&user.email){
    context.waitUntil(sendEmail(env,user.email,"Reborna certificate production completed",
     "<p>Your new certificate run has finished generating.</p><p>Original sculpt: "+run.sculpt_name.replace(/[&<>"']/g,"")
     +"; number of certificates: "+run.quantity+".</p><p>The secret CSV is available after email verification in your signed-in dashboard for up to seven days. The secret codes are NOT attached.</p><p>If unexpected, contact hello@reborna.co.</p>").catch(()=>{}));
   }
   await audit(db,user.id,"complete_generation",{sculptId:run.sculpt_id,editionId:run.edition_id,runId},"",String(run.quantity),"Encrypted export available for seven days");
  }
  return ok({ok:true,done,generatedCount:start+total,quantity:run.quantity});
 }
 if(method==="POST"&&path==="production-export-chunk"){
  const runId=txt(body.runId,45),sessionToken=body.sessionToken,start=body.start;
  if(!isUuid(runId)||!Number.isInteger(start)||start<0||start>MAX_QTY||!(await validateExportSession(db,user.id,runId,sessionToken,sha)))return fail("Confirm your email again before downloading private codes.",403);
  const run=await myRun(db,runId,user.id);
  if(!run||run.status!=="ready"||run.export_archived_at||!run.export_expires_at||run.export_expires_at.replace(" ","T")+"Z"<new Date().toISOString())return fail("This export is not ready, expired, or has been securely cleared.",409);
  const row=await db.prepare("SELECT encryption_iv,encrypted_data,item_count FROM production_export_chunks WHERE run_id=? AND chunk_start=?").bind(runId,start).first();
  if(!row)return fail("This export chunk is not available.",404);
  const records=await unseal(env,runId,start,row);
  if(!Array.isArray(records)||records.length!==row.item_count)return fail("Protected export integrity check failed.",500);
  return ok({ok:true,records,nextStart:start+records.length,total:run.quantity});
 }
 if(method==="POST"&&path==="production-export-archive"){
  const runId=txt(body.runId,45),sessionToken=body.sessionToken;
  if(!isUuid(runId)||body.confirmedSaved!==true||!(await validateExportSession(db,user.id,runId,sessionToken,sha)))return fail("Confirm that you have safely downloaded and backed up the complete CSV.",403);
  const run=await myRun(db,runId,user.id);
  if(!run||run.status!=="ready")return fail("The production run is not ready for archiving.",409);
  await db.batch([
   db.prepare("DELETE FROM production_export_chunks WHERE run_id=?").bind(runId),
   db.prepare("UPDATE production_runs SET status='archived',export_archived_at=datetime('now') WHERE id=? AND status='ready'").bind(runId),
   db.prepare("DELETE FROM production_export_sessions WHERE run_id=?").bind(runId),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,note) VALUES(?,?,?,?,?,'clear_export',?)").bind(crypto.randomUUID(),run.sculpt_id,run.edition_id,runId,user.id,"Artist confirmed safe download; encrypted copies cleared.")
  ]);
  return ok({ok:true,message:"Encrypted export deleted. Your codes remain registered but can no longer be downloaded from Reborna."});
 }
 if(method==="POST"&&path==="production-revoke"){
  const id=txt(body.id,45),reason=txt(body.reason,300);
  if(!isUuid(id)||reason.length<12)return fail("Provide a certificate identifier and documented revocation reason.");
  const c=await db.prepare("SELECT c.id,c.state,s.issuer_user_id,r.id AS run_id,e.id AS edition_id,s.id AS sculpt_id FROM production_codes c JOIN production_runs r ON r.id=c.run_id JOIN production_editions e ON e.id=r.edition_id JOIN production_sculpts s ON s.id=e.sculpt_id WHERE c.id=?").bind(id).first();
  if(!c||c.issuer_user_id!==user.id&&!(await isModerator(db,user.id)))return fail("Certificate not found or not authorised.",404);
  if(c.state==="revoked")return ok({ok:true,alreadyRevoked:true});
  await db.batch([
   db.prepare("UPDATE production_codes SET state='revoked',revoked_by=?,revocation_reason=?,revoked_at=datetime('now') WHERE id=?").bind(user.id,reason,id),
   db.prepare("INSERT INTO production_audit(id,sculpt_id,edition_id,run_id,actor_id,action,note) VALUES(?,?,?,?,?,'revoke_code',?)").bind(crypto.randomUUID(),c.sculpt_id,c.edition_id,c.run_id,user.id,reason)
  ]);
  return ok({ok:true});
 }
 if(method==="POST"&&path==="production-cleanup"){
  if(!(await isModerator(db,user.id)))return fail("Not authorised.",403);
  const expired=await db.prepare("SELECT COUNT(*) AS total FROM production_export_chunks WHERE run_id IN (SELECT id FROM production_runs WHERE export_expires_at < datetime('now'))").first();
  await db.batch([
   db.prepare("DELETE FROM production_export_chunks WHERE run_id IN (SELECT id FROM production_runs WHERE export_expires_at < datetime('now'))"),
   db.prepare("UPDATE production_runs SET status='archived',export_archived_at=COALESCE(export_archived_at,datetime('now')) WHERE status='ready' AND export_expires_at<datetime('now')"),
   db.prepare("DELETE FROM production_export_sessions WHERE expires_at<datetime('now')"),
   db.prepare("DELETE FROM certificate_issue_approvals WHERE expires_at<datetime('now')")
  ]);
  return ok({ok:true,expiredChunksPurged:expired?.total||0,message:"Expired encrypted exports and temporary approval sessions purged."});
 }
 return fail("Unknown production endpoint.",404);
}
