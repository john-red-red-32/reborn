import test from "node:test";
import assert from "node:assert/strict";
import {generateCertificateCode,normaliseCertificateCode,CODE_FORMAT} from "../lib/certificate-code.mjs";
import {onRequest} from "../functions/api/community/[[path]].js";

test("120-bit random certificates use the canonical, readable, non-sequential format",()=>{
 const codes=Array.from({length:300},()=>generateCertificateCode());
 assert.equal(new Set(codes).size,300);
 for(const code of codes){assert.match(code,CODE_FORMAT);assert.equal(normaliseCertificateCode(code),code);assert.equal(normaliseCertificateCode(code.toLowerCase().replaceAll("-"," ")),code);}
 for(const candidate of ["","RB-ABCD","RB-","<script>","RB-AAAAAA-AAAAAA-AAAAAA-AAAAAI","RB-AAAAAA-AAAAAA-AAAAAA-AAAAAO"])assert.equal(normaliseCertificateCode(candidate),null);
});

function makeHarness({loggedIn=false,authorised=false,moderator=false,found=false,revoked=false,issuerSuspended=false,rateAllowed=true,closedClaim=true}={}){
 const writes=[],queries=[],responses=[];
 const issuer={user_id:"real-artist-id",artist_slug:"original-sculptor",artist_name:"Original Sculptor",official_source_url:"https://artist.example/portfolio",state:issuerSuspended?"suspended":"active"};
 const cert={id:"cert-id",code_state:revoked?"revoked":"active",lookup_count:3,first_checked_at:"2026-10-14 13:30:00",last_checked_at:"2026-10-15 06:00:00",revoked_at:revoked?"2026-10-15 06:01:00":null,artist_slug:issuer.artist_slug,artist_name:issuer.artist_name,sculpt_name:"Sample Original Sculpt",edition_note:"First vinyl release",official_sculpt_url:"https://artist.example/sculpts/sample",issued_at:"2026-10-14 10:00:00",issuer_state:issuer.state};
 const db={
  prepare(sql){
   const statement={
    args:[],
    bind(...args){this.args=args;return this},
    async first(){
     queries.push({sql,args:this.args});
     if(sql.includes("FROM sessions s JOIN users"))return loggedIn?{id:issuer.user_id,handle:"original_artist",status:"active",email_verified_at:"2026-10-15"}:null;
     if(sql.includes("FROM community_moderators WHERE user_id"))return moderator?{yes:1}:null;
     if(sql.includes("SELECT count FROM rate_limits"))return {count:rateAllowed?1:200};
     if(sql.includes("SELECT * FROM verified_sculptor_issuers WHERE"))return authorised?issuer:null;
     if(sql.includes("COALESCE(SUM(quantity),0)"))return {total:0};
     if(sql.includes("FROM certificate_codes c JOIN certificate_batches b ON b.id=c.batch_id JOIN verified_sculptor_issuers"))return found?cert:null;
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
    async run(){writes.push({sql,args:this.args});return {success:true}}
   };
   return statement;
  },
  async batch(statements){for(const statement of statements)await statement.run();return statements.map(()=>({success:true}))}
 };
 const env={COMMUNITY_DB:db};
 return {
  writes,queries,responses,
  async call(endpoint,body,method=body===undefined?"GET":"POST"){
   const headers={Origin:"https://reborna.co"};
   if(loggedIn)headers.Cookie="rb_session="+("a".repeat(48));
   if(body!==undefined)headers["Content-Type"]="application/json";
   const r=await onRequest({request:new Request("https://reborna.co/api/community/"+endpoint,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env,waitUntil:()=>{}});
   return {status:r.status,body:await r.json()};
  }
 };
}

test("valid code lookup distinguishes authentic issuance from physical kit authenticity",async()=>{
 const h=makeHarness({found:true});
 const code=generateCertificateCode();
 const result=await h.call("certificate-lookup",{code});
 assert.equal(result.status,200);assert.equal(result.body.found,true);assert.equal(result.body.status,"issued");
 assert.equal(result.body.artistName,"Original Sculptor");
 assert.equal(result.body.previousChecks,3);
 assert.equal(result.body.totalChecks,4);
 assert.match(result.body.message,/cannot authenticate a physical kit/i);
 assert.ok(h.writes.some(x=>x.sql.includes("certificate_lookup_events")));
 assert.ok(!h.queries.some(q=>JSON.stringify(q).includes(code)));
 assert.ok(!h.writes.some(q=>JSON.stringify(q).includes(code)));
});

test("unknown codes never cause a false issuance claim",async()=>{
 const h=makeHarness();const result=await h.call("certificate-lookup",{code:generateCertificateCode()});
 assert.equal(result.status,200);assert.equal(result.body.found,false);
 assert.equal(h.writes.filter(x=>x.sql.includes("certificate_lookup_events")).length,0);
});
test("revoked code and suspended issuer are never reported as issued",async()=>{
 for(const config of [{revoked:true,expected:"revoked"},{issuerSuspended:true,expected:"issuer_suspended"}]){
  const h=makeHarness({found:true,...config});
  const r=await h.call("certificate-lookup",{code:generateCertificateCode()});
  assert.equal(r.body.status,config.expected);
 }
});
test("rate limit prevents repeated enumeration attempts",async()=>{
 const h=makeHarness({rateAllowed:false});
 const r=await h.call("certificate-lookup",{code:generateCertificateCode()});
 assert.equal(r.status,429);
});

test("a claimed sculptor cannot issue certificates without independent editorial approval",async()=>{
 const h=makeHarness({loggedIn:true,authorised:false});
 const r=await h.call("certificate-issue",{artistSlug:"original-sculptor",sculptName:"Sample Original Sculpt",officialSculptUrl:"https://artist.example/sculpt",quantity:2});
 assert.equal(r.status,403);assert.ok(!h.writes.some(x=>x.sql.includes("INSERT INTO certificate_codes")));
});
test("approved sculptor sees plaintext codes only in the one-time response; D1 stores hashes",async()=>{
 const h=makeHarness({loggedIn:true,authorised:true});
 const r=await h.call("certificate-issue",{artistSlug:"original-sculptor",sculptName:"Sample Original Sculpt",editionNote:"Artist's first vinyl release",officialSculptUrl:"https://artist.example/sculpt",quantity:4});
 assert.equal(r.status,201);assert.equal(r.body.pricePerCodeMinor,0);assert.equal(r.body.currency,"USD");
 assert.equal(r.body.codes.length,4);assert.equal(new Set(r.body.codes).size,4);
 assert.equal(h.writes.filter(x=>x.sql.includes("INSERT INTO certificate_codes")).length,4);
 const persisted=JSON.stringify(h.writes);
 for(const code of r.body.codes)assert.ok(!persisted.includes(code),"plaintext code leaked into database writes");
 assert.ok(h.writes.some(x=>x.sql.includes("certificate_audit")));
});

test("only an independent verified original artist and founder moderator can authorise issuance",async()=>{
 const payload={claimId:"123e4567-e89b-12d3-a456-426614174000",officialSourceUrl:"https://artist.example/original-portfolio",reviewNote:"I independently contacted the original artist through their established studio website and confirmed ownership of the registered account.",confirmedOfficialChannel:true};
 const outsider=makeHarness({loggedIn:true,moderator:false});
 assert.equal((await outsider.call("certificate-authorise",payload)).status,403);
 const missingEvidence=makeHarness({loggedIn:true,moderator:true});
 assert.equal((await missingEvidence.call("certificate-authorise",{...payload,confirmedOfficialChannel:false})).status,400);
 const founder=makeHarness({loggedIn:true,moderator:true});
 assert.equal((await founder.call("certificate-authorise",payload)).status,200);
 assert.ok(founder.writes.some(x=>x.sql.includes("INSERT INTO verified_sculptor_issuers")));
 assert.ok(founder.writes.some(x=>x.sql.includes("INSERT INTO certificate_audit")));
});

test("only certificate owner may permanently revoke their code",async()=>{
 const stranger=makeHarness({loggedIn:true,authorised:false});
 assert.equal((await stranger.call("certificate-revoke",{id:"123e4567-e89b-12d3-a456-426614174000",reason:"Certificate copies observed across multiple sellers"})).status,404);
 const owner=makeHarness({loggedIn:true,authorised:true});
 assert.equal((await owner.call("certificate-revoke",{id:"123e4567-e89b-12d3-a456-426614174000",reason:"Certificate copies observed across multiple sellers"})).status,200);
 assert.ok(owner.writes.some(x=>x.sql.includes("UPDATE certificate_codes SET state='revoked'")));
 assert.ok(owner.writes.some(x=>x.sql.includes("INSERT INTO certificate_audit")));
});
