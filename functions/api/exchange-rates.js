/**
 * Cloudflare Pages Function replacing Next.js /api/exchange-rates.
 * Live FX is fetched server-side and cached at Cloudflare's edge.
 */
export async function onRequestGet({request}) {
  const currencies=new Set(["USD","GBP","MXN","PLN","RUB","CAD","AUD"]);
  const endpoint="https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,GBP,MXN,PLN,RUB,CAD,AUD";
  try {
    const response=await fetch(endpoint,{headers:{Accept:"application/json"},cf:{cacheTtl:21600,cacheEverything:true}});
    if(!response.ok)throw Error("Rate source unavailable");
    const rows=await response.json();
    if(!Array.isArray(rows))throw Error("Unexpected rate format");
    const rates={EUR:1};let date="";
    for(const row of rows){
      if(currencies.has(row.quote)&&Number.isFinite(row.rate)&&row.rate>0){
        rates[row.quote]=row.rate;
        if(!date||row.date<date)date=row.date;
      }
    }
    if(Object.keys(rates).length<3)throw Error("Incomplete FX data");
    return new Response(JSON.stringify({date,rates}),{
      headers:{"Content-Type":"application/json; charset=utf-8",
        "Cache-Control":"public, max-age=1800, s-maxage=21600, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin":new URL(request.url).origin}
    });
  }catch{
    return Response.json({error:"Exchange rates temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
