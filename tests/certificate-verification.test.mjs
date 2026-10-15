import test from "node:test";
import assert from "node:assert/strict";
import {generateCertificateCode,normaliseCertificateCode,CODE_FORMAT} from "../lib/certificate-code.mjs";
import {onRequest} from "../functions/api/community/[[path]].js";

test("the concealed code uses 12 uniformly random base32 characters and three compact groups",()=>{
 const codes=Array.from({length:500},()=>generateCertificateCode());
 assert.equal(new Set(codes).size,500);
 for(const code of codes){
  assert.match(code,CODE_FORMAT);
  assert.equal(code.length,14);
  assert.equal(normaliseCertificateCode(code),code);
  assert.equal(normaliseCertificateCode(code.toLowerCase().replaceAll("-"," ")),code);
 }
 for(const invalid of ["","RB-ABCD","RB-AAAAAA-AAAAAA-AAAAAA-AAAAAA","<script>","AAAA-AAAA-AAAA-I","AAAA-AAAA-AAAA-0","AAAA-AAAA-AAAA-1"])
  assert.equal(normaliseCertificateCode(invalid),null);
 assert.equal(32**12,2**60);
});

function harness({loggedIn=false,authorised=false,moderator=false,found=false,revoked=false,issuerSuspended=false,rateAllowed=true,closedClaim=true,mailFails=false}={}){
 const writes=[],queries=[],mail=[],pending=[];
 let issuedCount=0,approval=null;
 const issuer={user_id:"real-artist-id",artist_slug:"original-sculptor",artist_name:"Original Sculptor",official_source_url:"https://artist.example/portfolio",state:issuerSuspended?"suspended":"active"};
 const certificate={id:"cert-id",code_state:revoked?"revoked":"active",lookup_count:3,first_checked_at:"2026-10-14 13:30:00",last_checked_at:"2026-10-15 06:00:00",revoked_at:revoked?"2026-10-15 06:01:00":null,artist_slug:issuer.artist_slug,artist_name:issuer.artist_name,sculpt_name:"Sample Original Sculpt",edition_note:"First vinyl release",official_sculpt_url:"https://artist.example/sculpts/sample",issued_at:"2026-10-14 10:00:00",issuer_state:issuer.state};
 const db={
  prepare(sql){
   return {
    args:[],
    bind(...args){this.args=args;return this},
    async first(){
     queries.push({sql,args:this.args});
     if(sql.includes("FROM sessions s JOIN users"))return loggedIn?{id:issuer.user_id,email:"artist@example.org",handle:"original_artist",status:"active",email_verified_at:"2026-10-15"}:null;
     if(sql.includes("FROM community_moderators WHERE user_id"))return moderator?{yes:1}:null;
     if(sql.includes("SELECT count FROM rate_limits"))return {count:rateAllowed?1:200};
     if(sql.includes("SELECT artist_name FROM verified_sculptor_issuers"))return authorised?issuer:null;
     if(sql.includes("SELECT * FROM verified_sculptor_issuers WHERE"))return authorised?issuer:null;
     if(sql.includes("SELECT COUNT(*) AS total FROM certificate_batches WHERE issuer_user_id"))return {total:issuedCount};
     if(sql.includes("COALESCE(SUM(quantity),0)"))return {total:issuedCount};
     if(sql.startsWith("UPDATE certificate_issue_approvals SET used_at")){
      if(approval&&!approval.used&&approval.id===this.args[0]&&approval.hash===this.args[3]&&approval.requestHash===this.args[4]&&approval.attempts<5){
       approval.used=true;return {id:approval.id};
      }
      return null;
     }
     if(sql.includes("FROM certificate_codes c JOIN certificate_batches b ON b.id=c.batch_id JOIN verified_sculptor_issuers"))return found?certificate:null;
     if(sql.includes("SELECT COUNT(*) AS total FROM certificate_lookup_events"))return {total:3};
     if(sql.includes("FROM certificate_codes c JOIN certificate_batches b ON b.id=c.batch_id WHERE c.id=?"))return authorised?{id:"cert-id",state:"active",artist_slug:issuer.artist_slug,batch_id:"batch-id"}:null;
     if(sql.includes("FROM sculptor_requests r JOIN users u ON"))return closedClaim?{member_id:"real-artist-id",existing_artist_slug:issuer.artist_slug,artist_name:issuer.artist_name,kind:"claim_profile",state:"closed"}:null;
     if(sql.includes("FROM user_roles WHERE user_id"))return {yes:1};
     if(sql.includes("SELECT user_id FROM verified_sculptor_issuers WHERE"))return null;
     return null;
    },
    async all(){
     queries.push({sql,args:this.args});
     if(sql.includes("FROM verified_sculptor_issuers WHERE user_id="))return {results:authorised?[{artistSlug:issuer.artist_slug,artistName:issuer.artist_name,state:issuer.state}]:[]};
     return {results:[]};
    },
    async run(){
     writes.push({sql,args:this.args});
     if(sql.startsWith("INSERT INTO certificate_issue_approvals"))approval={id:this.args[0],hash:this.args[4],requestHash:this.args[3],attempts:0,used:false};
     if(sql.startsWith("DELETE FROM certificate_issue_approvals"))approval=null;
     if(sql.startsWith("UPDATE certificate_issue_approvals SET attempts")&&approval)approval.attempts++;
     if(sql.startsWith("INSERT INTO certificate_batches"))issuedCount++;
     return {success:true};
    }
   };
  },
  async batch(statements){for(const statement of statements)await statement.run();return statements.map(()=>({success:true}))}
 };
 const env={COMMUNITY_DB:db,RESEND_API_KEY:"test-only-key",COMMUNITY_MAIL_FROM:"Reborna <hello@reborna.co>"};
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async(url,options)=>{
  if(String(url)!=="https://api.resend.com/emails")throw Error("Unexpected outbound request");
  const item=JSON.parse(options.body);mail.push(item);
  return Response.json(mailFails?{error:"test email rejected"}:{id:"mock-email-id"},{status:mailFails?500:200});
 };
 const input={artistSlug:issuer.artist_slug,sculptName:"Sample Original Sculpt",editionNote:"Artist studio run",officialSculptUrl:"https://artist.example/sculpt",quantity:4,confirmedNewIssue:true};
 return {
  writes,queries,mail,input,getApproval:()=>approval,restore(){globalThis.fetch=originalFetch},
  async call(endpoint,body,method=body===undefined?"GET":"POST"){
   const headers={Origin:"https://reborna.co"};
   if(loggedIn)headers.Cookie="rb_session="+("a".repeat(48));
   if(body!==undefined)headers["Content-Type"]="application/json";
   const r=await onRequest({request:new Request("https://reborna.co/api/community/"+endpoint,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env,waitUntil:p=>pending.push(p)});
   await Promise.all(pending.splice(0));
   return {status:r.status,body:await r.json()};
  }
 };
}

test("valid lookup confirms issuance but explicitly not the physical kit",async()=>{
 const h=harness({found:true});
 try{
  const code=generateCertificateCode();
  const result=await h.call("certificate-lookup",{code});
  assert.equal(result.status,200);assert.equal(result.body.found,true);
  assert.equal(result.body.status,"issued");assert.equal(result.body.artistName,"Original Sculptor");
  assert.equal(result.body.previousChecks,3);assert.equal(result.body.totalChecks,4);
  assert.match(result.body.message,/cannot authenticate a physical kit/i);
  assert.ok(h.writes.some(x=>x.sql.includes("certificate_lookup_events")));
  assert.ok(!h.queries.some(q=>JSON.stringify(q).includes(code)));
  assert.ok(!h.writes.some(q=>JSON.stringify(q).includes(code)));
 }finally{h.restore()}
});
test("unregistered certificates never create issuance records",async()=>{
 const h=harness();
 try{
  const result=await h.call("certificate-lookup",{code:generateCertificateCode()});
  assert.equal(result.status,200);assert.equal(result.body.found,false);
  assert.equal(h.writes.filter(x=>x.sql.includes("certificate_lookup_events")).length,0);
 }finally{h.restore()}
});
test("revoked or suspended credentials cannot look valid",async()=>{
 for(const config of [{revoked:true,expected:"revoked"},{issuerSuspended:true,expected:"issuer_suspended"}]){
  const h=harness({found:true,...config});
  try{const r=await h.call("certificate-lookup",{code:generateCertificateCode()});assert.equal(r.body.status,config.expected)}
  finally{h.restore()}
 }
});
test("rate-limited lookup resists bulk guessing",async()=>{
 const h=harness({rateAllowed:false});
 try{assert.equal((await h.call("certificate-lookup",{code:generateCertificateCode()})).status,429)}
 finally{h.restore()}
});

test("artist who merely self-identifies as a sculptor cannot get an email approval or issue codes",async()=>{
 const h=harness({loggedIn:true,authorised:false});
 try{
  assert.equal((await h.call("certificate-prepare",h.input)).status,403);
  assert.equal(h.mail.length,0);
  assert.equal((await h.call("certificate-issue",h.input)).status,400);
  assert.ok(!h.writes.some(x=>x.sql.includes("INSERT INTO certificate_codes")));
 }finally{h.restore()}
});
test("clear duplication warning acknowledgment is mandatory before email step-up",async()=>{
 const h=harness({loggedIn:true,authorised:true});
 try{
  assert.equal((await h.call("certificate-prepare",{...h.input,confirmedNewIssue:false})).status,400);
  assert.equal(h.mail.length,0);
 }finally{h.restore()}
});
test("email approval is short-lived, bound to exact issuance details, and plaintext secrets are never emailed",async()=>{
 const h=harness({loggedIn:true,authorised:true});
 try{
  const requested=await h.call("certificate-prepare",h.input);
  assert.equal(requested.status,200);
  assert.equal(requested.body.expiresInMinutes,10);
  assert.equal(h.mail.length,1);
  assert.equal(h.mail[0].to[0],"artist@example.org");
  const pin=h.mail[0].html.match(/one-time approval code: ([0-9]{8})/i)?.[1];
  assert.match(pin,/^[0-9]{8}$/);
  assert.ok(!JSON.stringify(h.writes).includes(pin));
  const changed=await h.call("certificate-issue",{...h.input,quantity:5,approvalId:requested.body.approvalId,emailCode:pin});
  assert.equal(changed.status,403,"email approval must bind to exact quantity");
  const wrong=await h.call("certificate-issue",{...h.input,approvalId:requested.body.approvalId,emailCode:"99999999"===pin?"88888888":"99999999"});
  assert.equal(wrong.status,403,"incorrect email code must not issue codes");
  const issued=await h.call("certificate-issue",{...h.input,approvalId:requested.body.approvalId,emailCode:pin});
  assert.equal(issued.status,201);
  assert.equal(issued.body.quantity,4);
  assert.equal(issued.body.pricePerCodeMinor,0);
  assert.equal(issued.body.codes.length,4);
  for(const code of issued.body.codes)assert.match(code,CODE_FORMAT);
  assert.equal(new Set(issued.body.codes).size,4);
  assert.equal(h.writes.filter(x=>x.sql.includes("INSERT INTO certificate_codes")).length,4);
  const stored=JSON.stringify(h.writes),emails=JSON.stringify(h.mail);
  for(const code of issued.body.codes){
   assert.ok(!stored.includes(code),"certificate code leaked into D1");
   assert.ok(!emails.includes(code),"certificate code leaked into mail provider");
  }
  assert.equal(h.mail.length,2,"a separate email receipt, WITHOUT codes, must be requested");
  assert.ok(h.mail[1].html.includes("were presented ONCE"));
  assert.ok(h.writes.some(x=>x.sql.includes("certificate_audit")));
  const reuse=await h.call("certificate-issue",{...h.input,approvalId:requested.body.approvalId,emailCode:pin});
  assert.equal(reuse.status,403,"one-time approval must not be reusable");
  const retry=await h.call("certificate-prepare",h.input);
  assert.equal(retry.status,429,"one completed batch per rolling 24 hours");
 }finally{h.restore()}
});
test("email failure does not mint secret certificate codes or leave usable approval",async()=>{
 const h=harness({loggedIn:true,authorised:true,mailFails:true});
 try{
  const attempted=await h.call("certificate-prepare",h.input);
  assert.equal(attempted.status,503);
  assert.ok(!h.getApproval());
  assert.equal(h.writes.filter(x=>x.sql.includes("INSERT INTO certificate_codes")).length,0);
 }finally{h.restore()}
});

test("only independently verified original artist with founder review may get issuance permission",async()=>{
 const payload={claimId:"123e4567-e89b-12d3-a456-426614174000",officialSourceUrl:"https://artist.example/original-portfolio",reviewNote:"I independently contacted the original artist through their established studio website and confirmed ownership of the registered account.",confirmedOfficialChannel:true};
 const outsider=harness({loggedIn:true,moderator:false});
 try{assert.equal((await outsider.call("certificate-authorise",payload)).status,403)}finally{outsider.restore()}
 const incomplete=harness({loggedIn:true,moderator:true});
 try{assert.equal((await incomplete.call("certificate-authorise",{...payload,confirmedOfficialChannel:false})).status,400)}finally{incomplete.restore()}
 const founder=harness({loggedIn:true,moderator:true});
 try{
  assert.equal((await founder.call("certificate-authorise",payload)).status,200);
  assert.ok(founder.writes.some(x=>x.sql.includes("INSERT INTO verified_sculptor_issuers")));
  assert.ok(founder.writes.some(x=>x.sql.includes("INSERT INTO certificate_audit")));
 }finally{founder.restore()}
});
test("only certificate owner may revoke codes",async()=>{
 const payload={id:"123e4567-e89b-12d3-a456-426614174000",reason:"Certificate copies observed across multiple sellers"};
 const stranger=harness({loggedIn:true,authorised:false});
 try{assert.equal((await stranger.call("certificate-revoke",payload)).status,404)}
 finally{stranger.restore()}
 const owner=harness({loggedIn:true,authorised:true});
 try{
  assert.equal((await owner.call("certificate-revoke",payload)).status,200);
  assert.ok(owner.writes.some(x=>x.sql.includes("UPDATE certificate_codes SET state='revoked'")));
  assert.ok(owner.writes.some(x=>x.sql.includes("INSERT INTO certificate_audit")));
 }finally{owner.restore()}
});
