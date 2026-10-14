/** Reborna's private moderation Worker: only callable through a Cloudflare Service binding.
 * This is an advisory Llama Guard 3 classifier. Human moderators decide flagged cases.
 */
export default {
 async fetch(request,env){
  if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405});
  if(!env.AI)return Response.json({error:'AI unavailable'},{status:503});
  let input;
  try{input=await request.json()}catch{return Response.json({error:'Invalid request'},{status:400})}
  if(!input||typeof input.text!=='string'||input.text.length>8000)return Response.json({error:'Invalid input'},{status:400});
  try{
   const result=await env.AI.run('@cf/meta/llama-guard-3-8b',{messages:[{role:'user',content:input.text}],max_tokens:90});
   const output=typeof result?.response==='string'?result.response.trim().toLowerCase():'';
   return Response.json({safe:/^safe(?:\s|$)/.test(output),model:'llama-guard-3-8b'});
  }catch{return Response.json({error:'Classification temporarily unavailable'},{status:503})}
 }
};
