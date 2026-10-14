#!/usr/bin/env python3
"""Read-only robots-aware Shopify materials source evidence; never mirrors imagery."""
import json,re,urllib.request,urllib.robotparser,urllib.parse,concurrent.futures
from pathlib import Path
AGENT="RebornaResearch/0.2 (+https://reborna.co; source-authenticated materials)"
hosts={"b":"https://www.bountifulbaby.com","p":"https://pixiekissedbabies-boutique.com","k":"https://www.kebelka.com"}
targets=[
("gemini-heat-set","b","/collections/all-products/products/complete-set-of-eight-custom-gemini-heat-set-paints-6723","Gemini"),
("alva-go-heat-set","p","/products/heat-set-reborn-paint-alva-go","alva"),
("ultimate-fusion","p","/collections/ultimate-fusion","ultimate fusion.*(paint colour|primary colours)"),
("kebelka-heat-paints","k","/kebelkaborn/","kebelka"),
("enfis-silicone","p","/collections/artists-supplies","enfis.*pigment"),
("hp-babylocks","p","/products/mohair","mohair"),
("nuborn-mohair","b","/collections/mohair","mohair"),
("german-glass-eyes","p","/collections/doll-artists-glass-eyes-and-mohair","german.*(neptune|jupiter|glass)"),
("bountiful-baby-eyes","b","/collections/eyes","eyes?"),
("rooting-needles-uk","p","/products/pixie-kissed-rooting-hair-punching-needles-very-fine-46g-crown","needle"),
("rooting-needles-us","b","/collections/needles","rooting.*needle"),
("texture-sponges","p","/collections/artists-supplies","stippling.*sponge"),
("cloth-bodies","b","/collections/cloth-bodies","premium.*body"),
("silicone-finishing","p","/collections/artists-supplies","silicone velvet.*(matting|powder)")
]
def fetch(url):
 host=urllib.parse.urlsplit(url).hostname
 rp=urllib.robotparser.RobotFileParser();rp.set_url("https://"+host+"/robots.txt");rp.read()
 if not rp.can_fetch(AGENT,url):raise PermissionError("robots_disallowed")
 with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":AGENT}),timeout=17) as r:
  if urllib.parse.urlsplit(r.geturl()).hostname!=host:raise ValueError("offhost_redirect")
  return r.read(3500000).decode("utf8","replace")
def product(base,handle):
 url=base+"/products/"+handle;data={"source_url":url,"images":[],"variants":[]}
 try:
  obj=json.loads(fetch(url+".js"))
  data.update(title=obj.get("title"),product_id=obj.get("id"),
    images=[{"url":u if u.startswith("https:") else "https:"+u if u.startswith("//") else u,"basis":"first_party_shopify_product"} for u in obj.get("images",[])[:12] if isinstance(u,str)],
    options=[o.get("name") if isinstance(o,dict) else o for o in obj.get("options",[])],
    variants=[{"label":v.get("public_title") or v.get("title"),"option1":v.get("option1"),"option2":v.get("option2"),"option3":v.get("option3"),"image_id":(v.get("featured_image") or {}).get("id") if isinstance(v.get("featured_image"),dict) else None,"price_minor":v.get("price"),"available_at_review":v.get("available")} for v in obj.get("variants",[])[:180]])
 except Exception as e:data["status"]=type(e).__name__+":"+str(e)[:120]
 return data
def research(entry):
 slug,h,path,pattern=entry;base=hosts[h];out={"slug":slug,"listing_url":base+path,"products":[]}
 try:
  if "/products/" in path:out["products"]=[product(base,path.split("/products/",1)[-1])]
  else:
   js=base+path.rstrip("/")+"/products.json?limit=120"
   obj=json.loads(fetch(js));out["collection_count"]=len(obj.get("products",[]))
   found=[p for p in obj.get("products",[]) if re.search(pattern,p.get("title",""),re.I)]
   out["matching_names"]=[p.get("title") for p in found[:12]]
   out["products"]=[product(base,p["handle"]) for p in found[:2]]
 except Exception as e:out["status"]=type(e).__name__+":"+str(e)[:130]
 return out
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:rows=list(pool.map(research,targets))
for r in rows:print(json.dumps({"slug":r["slug"],"names":[p.get("title") for p in r["products"]],"photos":[len(p["images"]) for p in r["products"]],"variants":[len(p["variants"]) for p in r["products"]],"error":r.get("status")},ensure_ascii=False),flush=True)
Path("materials-image-research.json").write_text(json.dumps({"source":"official product pages; first party Shopify public product JSON","copyright":"External images are only references; no image reproduction rights implied","records":rows},indent=2,ensure_ascii=False))
