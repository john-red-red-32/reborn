#!/usr/bin/env python3
"""Research real product families: named products, source photos, option labels and prices.
No synthetic shades/SKUs, no stock claims and no copying of image bytes.
Only source domains with robots permission; unsupported sites remain review-needed.
"""
import concurrent.futures,json,re,urllib.request,urllib.parse,urllib.robotparser,threading,time
from bs4 import BeautifulSoup
from pathlib import Path
AGENT="RebornaResearch/0.3 (+https://reborna.co; editorial product source matching)"
B="https://www.bountifulbaby.com"
P="https://pixiekissedbabies-boutique.com"
K="https://www.kebelka.com"
requests={
 "gemini-heat-set":[(B,"/collections/gemini",r"\bgemini\b")],
 "alva-go-heat-set":[(P,"/collections/heat-set-paint-mediums-alva-go",r"alva\s*(?:&|and)?\s*go")],
 "ultimate-fusion":[(P,"/collections/ultimate-fusion",r"ultimate fusion")],
 "enfis-silicone":[(P,"/collections/artists-supplies",r"enfis.*(?:pigment|silicone)")],
 "hp-babylocks":[(P,"/collections/mohair-and-alpaca",r"(hp[\s-]*babylocks|premium.*mohair|mohair)")],
 "nuborn-mohair":[(B,"/collections/mohair",r"\bnuborn mohair\b")],
 "german-glass-eyes":[(P,"/collections/doll-artists-glass-eyes-and-mohair",r"german.*glass eyes")],
 "bountiful-baby-eyes":[(B,"/collections/eyes",r"bountiful baby eyes")],
 "rooting-needles-uk":[(P,"/collections/artists-supplies",r"(rooting|punching)\s*(?:hair\s*)?needles")],
 "rooting-needles-us":[(B,"/collections/needles",r"needle")],
 "texture-sponges":[(P,"/collections/artists-supplies",r"(stippling|texture)\s*sponges?")],
 "cloth-bodies":[(B,"/collections/cloth-bodies",r"(body|bodies)")],
 "silicone-finishing":[(P,"/collections/artists-supplies",r"(silicone velvet|matting powder)")],
}
robots={}
lock=threading.Lock()
def fetch(url):
 parts=urllib.parse.urlsplit(url);host=parts.hostname
 if parts.scheme!="https" or host not in ("www.bountifulbaby.com","pixiekissedbabies-boutique.com","www.kebelka.com"):raise ValueError("untrusted_host")
 with lock:
  if host not in robots:
   r=urllib.robotparser.RobotFileParser()
   r.set_url("https://"+host+"/robots.txt")
   r.read();robots[host]=r
  rp=robots[host]
 if not rp.can_fetch(AGENT,url):raise PermissionError("robots_denied")
 req=urllib.request.Request(url,headers={"User-Agent":AGENT,"Accept":"text/html,application/json"})
 with urllib.request.urlopen(req,timeout=23) as response:
  if urllib.parse.urlsplit(response.geturl()).hostname!=host:raise ValueError("cross_host_redirect")
  data=response.read(6000000)
  return data.decode("utf8","replace")
def image_url(url):
 if not isinstance(url,str):return None
 if url.startswith("//"):url="https:"+url
 if not url.startswith("https://"):return None
 if not urllib.parse.urlsplit(url).hostname:return None
 return url
def parse_product(base,p):
 name=p.get("title","")
 if not p.get("handle") or not name:return None
 if "*discontinued*" in name.lower():return None
 url=base+"/products/"+p["handle"]
 imgs=p.get("images",[])
 normalized=[]
 image_by_id={}
 for img in imgs[:7]:
  if isinstance(img,dict):im=image_url(img.get("src"));iid=img.get("id")
  else:im=image_url(img);iid=None
  if im:
   if iid:image_by_id[str(iid)]=im
   if im not in normalized:normalized.append(im)
 if not normalized:
  return None
 variations=[]
 for v in p.get("variants",[])[:125]:
  opts=[x for x in [v.get("option1"),v.get("option2"),v.get("option3")] if x and str(x).lower()!="default title"]
  if not opts:continue
  variant_image=image_by_id.get(str(v.get("featured_image_id")))
  if not variant_image and isinstance(v.get("featured_image"),dict):variant_image=image_url(v["featured_image"].get("src"))
  variations.append({"label":" / ".join(map(str,opts)),"options":opts,"native_price":v.get("price"),"photo":variant_image})
 price=None
 if p.get("variants"):
  numbers=[]
  for v in p["variants"]:
   x=v.get("price")
   try:
    x=float(x)
    if x>=0:numbers.append(x)
   except:continue
  if numbers:
   # Shopify collections /products.json uses decimal-string pricing (unlike /products/handle.js which returns minor units).
   pmin=min(numbers)
   # Strings from products.json are major units; some Shopify storefronts send integers as dollars in this endpoint.
   price=pmin
 return {"title":name,"source_url":url,"image_urls":normalized,"variants":variations,"native_price":price,"options":[o.get("name") if isinstance(o,dict) else o for o in p.get("options",[])][:3],"platform":"shopify_collection_api"}
def shopify_family(slug,base,path,pattern):
 report={"slug":slug,"source":base+path,"products":[],"errors":[]}
 try:
  raw=fetch(base+path.rstrip("/")+"/products.json?limit=250")
  data=json.loads(raw)
  items=data.get("products",[])
  report["source_count"]=len(items)
  rx=re.compile(pattern,re.I)
  found=[p for p in items if rx.search(p.get("title",""))]
  products=[parse_product(base,p) for p in found]
  report["products"]=[x for x in products if x]
  report["matched"]=len(found)
 except Exception as e:report["errors"].append(type(e).__name__+":"+str(e)[:160])
 return report
def kebelka_listing():
 urls=["https://www.kebelka.com/termosellables/"]+["https://www.kebelka.com/termosellables/p-2mzi5njq/"+str(i)+"/" for i in range(1,6)]
 map={}
 for url in urls:
  try:
   soup=BeautifulSoup(fetch(url),"html.parser")
   for a in soup.select('a[href*="/p/"]'):
    label=a.get_text(" ",strip=True)
    name=re.search(r"(?:^|\s)(\d{2}[A-Z]?)[\s.:\-]*([^\n]{1,75}?)\s*/\s*KEBELKA\s*Set\s*heat\s*Paint",label,re.I)
    if not name:continue
    href=urllib.parse.urljoin(url,a.get("href",""))
    if urllib.parse.urlsplit(href).hostname!="www.kebelka.com":continue
    if "/p/" not in urllib.parse.urlsplit(href).path:continue
    shade=name.group(1).upper(); title=label.split("Desde")[0].strip()
    # Collection links may repeat across pagination.
    key=shade+"-"+urllib.parse.urlsplit(href).path
    map[key]={"title":title,"source_url":href,"shade":shade,"image_urls":[],"native_price":None,"variants":[],"options":[],"platform":"webnode_named_product"}
  except Exception as e:print("KEBELKA COLLECTION PAGE ERROR",url,type(e).__name__,str(e)[:110],flush=True)
 return list(map.values())
def kebelka_detail(item):
 try:
  soup=BeautifulSoup(fetch(item["source_url"]),"html.parser")
  img=soup.find("meta",attrs={"property":"og:image"})
  if img:
   u=img.get("content")
   if u and u.startswith("https://"):item["image_urls"]=[u]
  # Inspect product page size labels. Do not infer sizes across shades.
  content=soup.get_text(" ",strip=True)
  if "Tamaño" in content and "30 ml" in content and "5 Gr." in content:
   item["options"]=["Tamaño: 5 Gr.","Tamaño: 30 ml"]
  amount=re.search(r"(?:Desde|Precio)[\s\xa0]*([\d,]+)\s*€",content,re.I)
  if amount:item["native_price"]=float(amount.group(1).replace(",","."))
 except Exception as e:item["error"]=type(e).__name__+":"+str(e)[:110]
 return item
def main():
 reports={}
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
  futures={pool.submit(shopify_family,slug,base,path,pattern):slug for slug,entry in requests.items() for base,path,pattern in entry}
  for future in concurrent.futures.as_completed(futures):
   slug=futures[future];reports[slug]=future.result()
   row=reports[slug]
   print("SHOPIFY",slug,"matched",row.get("matched"),"photographed",len(row["products"]),"errors",row["errors"],flush=True)
 kb=kebelka_listing()
 print("KEBELKA LINKS",len(kb),flush=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:kb=list(pool.map(kebelka_detail,kb))
 kb=[p for p in kb if p["image_urls"] and p["title"]]
 kb.sort(key=lambda x:(int(re.match(r"\d+",x["shade"]).group()),x["shade"]))
 reports["kebelka-heat-paints"]={"slug":"kebelka-heat-paints","source":"https://www.kebelka.com/termosellables/","products":kb,"matched":len(kb),"errors":[]}
 print("KEBELKA EXACT-PHOTO-SHADES",len(kb),[(p["shade"],p["title"]) for p in kb[:10]],flush=True)
 for slug,row in reports.items():
  print("REPORT",slug,"products",len(row["products"]),"variants",sum(len(p["variants"]) for p in row["products"]),"photo_per_product",sum(bool(p["image_urls"]) for p in row["products"]),flush=True)
 Path("materials-product-families-20261014.json").write_text(json.dumps({"reviewed_at":"2026-10-14","method":"official Shopify collection API and robots-permitted Webnode product pages","no_stock_claims":True,"photo_rights":"Source attribution does not convey a commercial image licence","families":reports},ensure_ascii=False,indent=2),encoding="utf8")
if __name__=="__main__":main()
