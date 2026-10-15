import test from "node:test";
import assert from "node:assert/strict";
import {onRequest} from "../functions/api/community/[[path]].js";

function setup({loggedIn=true,sculptor=true,moderator=false,hasSource=true}={}){
 const writes=[],queues=[],requested=[],tasks=[];
 const db={
  prepare(sql){
   const op={
    args:[],
    bind(...args){this.args=args;return this},
    async first(){
     if(sql.includes("FROM sessions s JOIN users"))return {id:"member-1",email:"artist@example.net",handle:"artist",email_verified_at:"2026-10-15",status:"active"};
     if(sql.includes("FROM community_moderators WHERE user_id"))return moderator?{one:1}:null;
     if(sql.includes("FROM user_roles WHERE user_id"))return sculptor?{yes:1}:null;
     if(sql.includes("SELECT count FROM rate_limits"))return {count:1};
     if(sql.includes("SELECT COUNT(*) AS count FROM sculptor_requests"))return {count:0};
     if(sql.includes("SELECT state FROM sculptor_requests"))return {state:"pending"};
     return null;
    },
    async all(){
     if(sql.includes("FROM sculptor_requests"))return {results:hasSource?[{id:"request-1",kind:"claim_profile",artistName:"Original Artist",state:"pending"}]:[]};
     return {results:[]}
    },
    async run(){writes.push({sql,args:this.args});return {success:true}}
   };return op
  },
  async batch(queries){for(const item of queries)await item.run();return queries.map(()=>({success:true}))}
 };
 const env={COMMUNITY_DB:db};
 async function call(route,body,method=body===undefined?"GET":"POST"){
  const path="https://reborna.co/api/community/"+route;
  const headers={"Origin":"https://reborna.co"};
  if(loggedIn)headers.Cookie="rb_session="+"a".repeat(48);
  if(body!==undefined)headers["Content-Type"]="application/json";
  const request=new Request(path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})});
  const response=await onRequest({request,env,waitUntil:p=>tasks.push(p)});
  await Promise.allSettled(tasks.splice(0));
  return {status:response.status,data:await response.json()};
 }
 return {call,writes,queues,requested};
}
test("private artist request endpoint denies logged-out visitors",async()=>{
 const h=setup({loggedIn:false});
 const result=await h.call("sculptor-review-queue");
 assert.equal(result.status,401);
});
test("self-described non-sculptors cannot submit claims",async()=>{
 const h=setup({sculptor:false});
 const result=await h.call("sculptor-requests",{kind:"claim_profile",artistName:"Original Artist",websiteUrl:"https://example.org/portfolio"});
 assert.equal(result.status,403);
 assert.equal(h.writes.filter(w=>w.sql.includes("INSERT INTO sculptor_requests")).length,0);
});
test("sculptor claims are private pending requests, never automatically approved",async()=>{
 const h=setup();
 const result=await h.call("sculptor-requests",{kind:"claim_profile",artistName:"Original Artist",websiteUrl:"https://example.org/portfolio"});
 assert.equal(result.status,201);
 assert.match(result.data.message,/not yet a verified artist/i);
 const insert=h.writes.find(w=>w.sql.includes("INSERT INTO sculptor_requests"));
 assert.ok(insert);
 assert.equal(insert.args[1],"member-1");
 assert.equal(insert.args[2],"claim_profile");
 assert.equal(insert.args[7],"https://example.org/portfolio");
 assert.ok(!h.writes.some(w=>/UPDATE artists|INSERT INTO kits|UPDATE user_roles/.test(w.sql)));
});
test("kit suggestions must link to an official source",async()=>{
 const h=setup();
 const result=await h.call("sculptor-requests",{kind:"submit_sculpt",artistName:"Original Artist",sculptName:"Baby Rose"});
 assert.equal(result.status,400);
 assert.ok(!h.writes.some(w=>w.sql.includes("INSERT INTO sculptor_requests")));
});
test("only moderators may inspect the editorial queue",async()=>{
 const regular=setup({moderator:false});
 assert.equal((await regular.call("sculptor-review-queue")).status,403);
 const founder=setup({moderator:true});
 const result=await founder.call("sculptor-review-queue");
 assert.equal(result.status,200);
 assert.equal(result.data.requests.length,1);
});
test("moderator review cannot automatically verify an artist or publish a kit",async()=>{
 const founder=setup({moderator:true});
 const result=await founder.call("sculptor-review",{id:"123e4567-e89b-12d3-a456-426614174000",state:"needs_info",message:"Please share an independent official studio reference."});
 assert.equal(result.status,200);
 assert.ok(founder.writes.some(w=>w.sql.includes("UPDATE sculptor_requests SET state")));
 assert.ok(founder.writes.some(w=>w.sql.includes("INSERT INTO sculptor_request_audit")));
 assert.ok(!founder.writes.some(w=>/UPDATE artists|INSERT INTO kits|INSERT INTO community_moderators/.test(w.sql)));
});
