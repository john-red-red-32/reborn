import test from "node:test";
import assert from "node:assert/strict";
import {handleProduction,lookupProductionCode,isProductionPath} from "../functions/api/community/production.mjs";
import {CODE_FORMAT} from "../lib/certificate-code.mjs";

const user={id:"original-artist-user",email:"verified@example.org",email_verified_at:"2026-10-15",handle:"sculptor"};
const originalSculpt={id:"11111111-1111-4111-8111-111111111111",issuer_user_id:user.id,artist_slug:"original-sculptor",sculpt_name:"Amelia",official_url:null,issuer_state:"active"};
const originalEdition={id:"22222222-2222-4222-8222-222222222222",sculpt_id:originalSculpt.id,issuer_user_id:user.id,artist_slug:"original-sculptor",sculpt_name:"Amelia",edition_label:"First vinyl edition",edition_kind:"limited",initially_declared_quantity:500,current_declared_quantity:500};
const originalRun={id:"33333333-3333-4333-8333-333333333333",edition_id:originalEdition.id,sculpt_id:originalSculpt.id,artist_slug:"original-sculptor",sculpt_name:"Amelia",edition_label:"First vinyl edition",edition_kind:"limited",initially_declared_quantity:500,current_declared_quantity:500,quantity:80,run_number:1,serial_start:1,generated_count:0,status:"generating",issuer_state:"active",export_expires_at:null,export_archived_at:null};
const key=Buffer.alloc(32,71).toString("base64");
const secureHash=async(s)=>Buffer.from(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))).toString("base64url");
function harness({moderator=false,approved=true,oldQuantity=0,expired=false,sessionValid=true}={}){
 const run={...originalRun};
 const sculpt={...originalSculpt};
 const edition={...originalEdition};
 const writes=[],chunks=new Map(),persistedCodes=[],mail=[],prepared=[];
 const db={
  prepare(sql){
   const stmt={
    args:[],
    bind(...args){this.args=args;return this},
    async first(){
     if(sql.includes("FROM production_export_sessions WHERE"))return sessionValid?{yes:1}:null;
     if(sql.includes("FROM production_runs r JOIN production_editions e")&&sql.includes("r.id=?"))return run;
     if(sql.includes("FROM production_editions e JOIN production_sculpts s")&&sql.includes("e.id=?"))return edition;
     if(sql.includes("FROM production_sculpts s JOIN verified_sculptor_issuers")&&sql.includes("s.id=?"))return sculpt;
     if(sql.includes("FROM production_runs r JOIN production_editions e")&&sql.includes("r.status IN"))return {total:0};
     if(sql.includes("FROM production_runs WHERE edition_id=?")&&sql.includes("COALESCE"))return {total:oldQuantity,last:oldQuantity?1:0};
     if(sql.includes("FROM production_runs r JOIN production_editions e")&&sql.includes("r.started_at>="))return {total:0};
     if(sql.includes("FROM certificate_batches WHERE issuer_user_id"))return {total:0};
     if(sql.includes("SELECT encryption_iv,encrypted_data,item_count FROM production_export_chunks"))return chunks.get(this.args[1])||null;
     if(sql.includes("SELECT c.id,c.state,c.lookup_count")&&sql.includes("FROM production_codes"))return null;
     if(sql.includes("SELECT 1 AS yes FROM verified_sculptor_issuers"))return approved?{yes:1}:null;
     if(sql.includes("SELECT COUNT(*) AS total FROM production_codes"))return {total:0};
     if(sql.includes("SELECT id FROM production_sculpts WHERE"))return null;
     if(sql.includes("SELECT id FROM production_link_proposals WHERE"))return null;
     return null;
    },
    async all(){return {results:[]}},
    async run(){
     writes.push({sql,args:this.args});
     if(sql.startsWith("INSERT INTO production_codes")){
      const rows=this.args.length/5;
      assert.equal(this.args.length%5,0);
      assert.ok(this.args.length<=100,"never exceed Cloudflare D1's 100-bound-parameter limit");
      for(let i=0;i<rows;i++)persistedCodes.push(this.args.slice(i*5,(i+1)*5));
     }
     if(sql.startsWith("INSERT INTO production_export_chunks"))chunks.set(this.args[1],{encryption_iv:this.args[3],encrypted_data:this.args[4],item_count:this.args[2]});
     if(sql.startsWith("UPDATE production_runs SET generated_count")){
      run.generated_count=this.args[0];run.status=this.args[1];
      if(run.status==="ready")run.export_expires_at="2026-10-30 13:00:00";
     }
     if(sql.startsWith("INSERT INTO production_runs")){
      prepared.push(this.args);
     }
     return {success:true,meta:{changes:1}};
    }
   };
   return stmt;
  },
  async batch(statements){
   for(const stmt of statements)await stmt.run();
   return statements.map(()=>({success:true}));
  }
 };
 const env={COMMUNITY_DB:db,CERTIFICATE_EXPORT_KEY:key};
 async function call(path,payload={},method="POST"){
  const request=new Request("https://reborna.co/api/community/"+path,{method,headers:{"Content-Type":"application/json","Origin":"https://reborna.co"},...(method==="POST"?{body:JSON.stringify(payload)}:{})});
  const response=await handleProduction({path,request,env,db,user,sha:secureHash,readJson:r=>r.json(),sendEmail:async(...items)=>{mail.push(items)},emailReady:()=>true,isModerator:async()=>moderator,throttle:async()=>true,context:{waitUntil:async p=>{await p}}});
  return {status:response.status,body:await response.json()};
 }
 return {call,run,sculpt,edition,writes,chunks,persistedCodes,prepared,mail};
}

test("production endpoints are explicitly private routes, unlike public code lookup",()=>{
 assert.equal(isProductionPath("production-next"),true);
 assert.equal(isProductionPath("production-run-review"),true);
 assert.equal(isProductionPath("certificate-lookup"),false);
});
test("a production run accepts an exact quantity and rejects accidental reprints",async()=>{
 const h=harness();
 const base={editionId:originalEdition.id,quantity:2300};
 assert.equal((await h.call("production-run-request",base)).status,400);
 const r=await h.call("production-run-request",{...base,confirmedNewIssue:true,acknowledgeEditionChange:true});
 assert.equal(r.status,201);
 assert.equal(h.prepared[0][3],2300);
 assert.equal(h.prepared[0][4],1);
});
test("limited edition expansion is blocked without explicit declaration and founder review",async()=>{
 const h=harness({oldQuantity:500});
 const base={editionId:originalEdition.id,quantity:500,confirmedNewIssue:true};
 assert.equal((await h.call("production-run-request",base)).status,409);
 assert.equal((await h.call("production-run-request",{...base,acknowledgeEditionChange:true})).status,201);
 assert.equal(h.prepared[0][5],1);
});
test("pending quantities can be corrected before approval, but not reprinted",async()=>{
 const h=harness();
 h.run.status="pending";
 const missing=await h.call("production-run-edit",{runId:originalRun.id,quantity:400});
 assert.equal(missing.status,400);
 const fixed=await h.call("production-run-edit",{runId:originalRun.id,quantity:400,confirmedNewIssue:true});
 assert.equal(fixed.status,200);
 const amended=h.writes.find(x=>x.sql.startsWith("UPDATE production_runs SET quantity="));
 assert.equal(amended.args[0],400);
 assert.equal(h.persistedCodes.length,0);
});
test("only founder/moderator sees the private production review queue",async()=>{
 const h=harness({moderator:false});
 const r=await h.call("production-review-queue",{},"GET");
 assert.equal(r.status,403);
});
test("bulk generation writes hashed certificates, never plain codes, and AES-GCM protected export chunks",async()=>{
 const h=harness();
 const r=await h.call("production-next",{runId:originalRun.id,sessionToken:"a".repeat(64)});
 assert.equal(r.status,200);assert.equal(r.body.done,true);
 assert.equal(r.body.generatedCount,80);
 assert.equal(h.persistedCodes.length,80);
 assert.equal(h.chunks.size,1);
 assert.equal(h.run.status,"ready");
 const cipher=h.chunks.get(0);
 assert.match(cipher.encrypted_data,/^[A-Za-z0-9+/=]+$/);
 assert.ok(!cipher.encrypted_data.includes("AAAA-"));
 const exported=await h.call("production-export-chunk",{runId:originalRun.id,sessionToken:"a".repeat(64),start:0});
 assert.equal(exported.status,200);
 assert.equal(exported.body.records.length,80);
 assert.equal(exported.body.records[0].number,1);
 assert.equal(exported.body.records[79].number,80);
 for(const entry of exported.body.records)assert.match(entry.code,CODE_FORMAT);
 const allWrites=JSON.stringify(h.writes);
 for(const entry of exported.body.records)assert.ok(!allWrites.includes(entry.code),"plaintext secret stored in D1 rather than encrypted");
 const hashes=new Set(h.persistedCodes.map(x=>x[3]));
 assert.equal(hashes.size,80);
 const again=await h.call("production-next",{runId:originalRun.id,sessionToken:"a".repeat(64)});
 assert.equal(again.status,200);assert.equal(again.body.done,true);
 assert.equal(h.persistedCodes.length,80,"completed production must never create another set of codes");
});
test("an expired or missing export session cannot decrypt the temporary certificates",async()=>{
 const h=harness({sessionValid:false});
 const out=await h.call("production-export-chunk",{runId:originalRun.id,sessionToken:"b".repeat(64),start:0});
 assert.equal(out.status,403);
 const generate=await h.call("production-next",{runId:originalRun.id,sessionToken:"b".repeat(64)});
 assert.equal(generate.status,403);
});
test("only an independently verified artist can create a new private sculpt",async()=>{
 const blocked=harness({approved:false});
 assert.equal((await blocked.call("production-sculpt-create",{artistSlug:"original-sculptor",sculptName:"Sample original"})).status,403);
 const valid=harness({approved:true});
 assert.equal((await valid.call("production-sculpt-create",{artistSlug:"original-sculptor",sculptName:"Sample original"})).status,201);
});
test("founder cannot approve an edition run without a substantive review note",async()=>{
 const h=harness({moderator:true});
 assert.equal((await h.call("production-run-review",{runId:originalRun.id,decision:"approved",note:"Looks fine"})).status,400);
});
