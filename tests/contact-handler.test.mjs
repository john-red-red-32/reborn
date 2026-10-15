import test from "node:test";
import assert from "node:assert/strict";
import {onRequest} from "../functions/api/contact.js";

function harness({acceptToken=true,sendOkay=true}={}){
 const saved=[];
 const updates=[];
 const deliveries=[];
 const tasks=[];
 let rateCount=0;
 const db={
  prepare(sql){
   return {
    bind(...params){
     return {
      async run(){
       if(sql.startsWith("INSERT INTO rate_limits"))rateCount++;
       if(sql.startsWith("INSERT INTO contact_enquiries"))saved.push(params);
       if(sql.startsWith("UPDATE contact_enquiries"))updates.push(sql);
       return {success:true};
      },
      async first(){return {count:rateCount}}
     };
    }
   };
  }
 };
 const env={COMMUNITY_DB:db,TURNSTILE_SECRET_KEY:"server-only-test-secret",RESEND_API_KEY:"test-mail-token",COMMUNITY_MAIL_FROM:"Reborna <notifications@reborna.co>"};
 const oldFetch=globalThis.fetch;
 globalThis.fetch=async (url,options)=>{
  const target=String(url);
  if(target.includes("siteverify")){
   assert.equal(new URLSearchParams(options.body).get("secret"),"server-only-test-secret");
   return Response.json({success:acceptToken,action:"contact",hostname:"reborna.co"});
  }
  if(target.includes("api.resend.com")){
   deliveries.push(JSON.parse(options.body));
   return Response.json({id:"test-delivery-id"},{status:sendOkay?200:500});
  }
  throw Error("Unexpected network call");
 };
 const input={name:"Test Sender",email:"sender@example.org",category:"artist",message:"An original sculptor would like to correct their profile details.",turnstileToken:"test-validated-token-12345",website:""};
 return {
  saved,updates,deliveries,input,
  restore(){globalThis.fetch=oldFetch},
  async submit(changes={}){
   const request=new Request("https://reborna.co/api/contact",{method:"POST",headers:{"Content-Type":"application/json","Origin":"https://reborna.co"},body:JSON.stringify({...input,...changes})});
   const response=await onRequest({request,env,waitUntil:promise=>tasks.push(promise)});
   await Promise.all(tasks.splice(0));
   return {response,data:await response.json()};
  }
 };
}

test("verified artist enquiries are saved and a notification is requested",async()=>{
 const h=harness();
 try{
  const {response,data}=await h.submit();
  assert.equal(response.status,202);
  assert.equal(data.ok,true);
  assert.equal(typeof data.reference,"string");
  assert.equal(h.saved.length,1);
  assert.equal(h.saved[0][3],"artist");
  assert.equal(h.deliveries.length,1);
  assert.ok(h.updates.some(x=>x.includes("delivery_status='sent'")));
 }finally{h.restore()}
});

test("invalid Turnstile cannot store or send a message",async()=>{
 const h=harness({acceptToken:false});
 try{
  const {response,data}=await h.submit();
  assert.equal(response.status,403);
  assert.match(data.error,/security check/i);
  assert.equal(h.saved.length,0);
  assert.equal(h.deliveries.length,0);
 }finally{h.restore()}
});

test("email failure does not falsely report that a saved enquiry was lost",async()=>{
 const h=harness({sendOkay:false});
 try{
  const {response,data}=await h.submit();
  assert.equal(response.status,202);
  assert.equal(data.ok,true);
  assert.equal(h.saved.length,1);
  assert.ok(h.updates.some(x=>x.includes("delivery_status='failed'")));
 }finally{h.restore()}
});

test("sculptor source fields are stored privately and included in notifications",async()=>{
 const h=harness();
 try{
  const {response}=await h.submit({artistIntent:"claim_profile",websiteUrl:"https://originalartist.example.com/gallery",socialUrl:"https://instagram.com/sculptingstudio"});
  assert.equal(response.status,202);
  assert.equal(h.saved.length,1);
  assert.equal(h.saved[0][5],"https://originalartist.example.com/gallery");
  assert.equal(h.saved[0][6],"https://instagram.com/sculptingstudio");
  assert.equal(h.saved[0][7],"claim_profile");
  assert.match(h.deliveries[0].html,/Social profile:/);
  assert.match(h.deliveries[0].text,/Sculptor enquiry:/);
 }finally{h.restore()}
});

test("invalid source URLs cannot be saved or emailed",async()=>{
 const h=harness();
 try{
  const {response,data}=await h.submit({websiteUrl:"javascript:alert(1)",artistIntent:"claim_profile"});
  assert.equal(response.status,400);
  assert.match(data.error,/URLs/i);
  assert.equal(h.saved.length,0);
  assert.equal(h.deliveries.length,0);
 }finally{h.restore()}
});
