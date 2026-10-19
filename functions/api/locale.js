/** Coarse IP COUNTRY hint only; no visitor address is exposed or recorded. */
export function onRequestGet({request}){
 const country=request.cf?.country;
 const safe=typeof country==="string"&&/^[A-Z]{2}$/.test(country)?country:null;
 return new Response(JSON.stringify({country:safe}),{
  headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store, max-age=0","Vary":"Accept-Language","X-Content-Type-Options":"nosniff"}
 });
}
export function onRequest(){return new Response("Method not allowed",{status:405,headers:{"Allow":"GET","Cache-Control":"no-store"}})}
