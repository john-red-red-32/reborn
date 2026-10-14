#!/usr/bin/env python3
"""Source-referenced exceptions: Kebelka Webador-ish HTML OG; Bountiful Shopify exact products."""
import urllib.request,urllib.robotparser,urllib.parse,json,re
from html.parser import HTMLParser
from pathlib import Path
class Read(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.images=[];self.title=[];self.intitle=False
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=="meta":
   k=d.get("property") or d.get("name")
   if k:self.meta[k]=d.get("content","")
  if tag=="img" and (d.get("src") or d.get("data-src")):
   self.images.append({"url":d.get("data-src") or d.get("src"),"alt":d.get("alt","")})
  if tag=="title":self.intitle=True
 def handle_endtag(self,tag):
  if tag=="title":self.intitle=False
 def handle_data(self,data):
  if self.intitle:self.title.append(data)
urls={
 "kebelka-heat-paints":"https://www.kebelka.com/p/33-coral-pintura-para-reborn/",
 "bountiful-baby-eyes":"https://www.bountifulbaby.com/products/2321",
 "rooting-needles-us":"https://www.bountifulbaby.com/products/4494",
 "german-glass-eyes":"https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours"
}
result={}
for slug,url in urls.items():
 row={"slug":slug,"source":url,"images":[],"variants":[]}
 try:
  host=urllib.parse.urlsplit(url).hostname
  rp=urllib.robotparser.RobotFileParser();rp.set_url("https://"+host+"/robots.txt");rp.read()
  agent="RebornaResearch/0.2 (+https://reborna.co)"
  if not rp.can_fetch(agent,url):raise PermissionError("robots_denied")
  with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":agent}),timeout=19) as f:html=f.read(2000000).decode("utf8","replace")
  p=Read();p.feed(html)
  row["title"]=" ".join(p.title)[:180]
  row["og_images"]=[{"url":urllib.parse.urljoin(url,p.meta[k]),"basis":"named-product-og"} for k in ["og:image","twitter:image"] if p.meta.get(k) and not any(x in p.meta[k].lower() for x in ["logo","icon","placeholder"])]
  row["inline_images"]=[{"url":urllib.parse.urljoin(url,x["url"]),"alt":x["alt"]} for x in p.images[:22]]
  if "/products/" in url:
   urljs="https://"+host+"/products/"+url.split("/products/")[-1]+".js"
   if rp.can_fetch(agent,urljs):
    try:
     with urllib.request.urlopen(urllib.request.Request(urljs,headers={"User-Agent":agent}),timeout=17) as f:o=json.load(f)
     row.update(shopify_title=o.get("title"),images=[{"url":u if u.startswith("https:") else "https:"+u,"basis":"shopify-product-json"} for u in o.get("images",[])[:14]],
       variants=[{"label":v.get("public_title") or v.get("title"),"option1":v.get("option1"),"option2":v.get("option2"),"option3":v.get("option3")} for v in o.get("variants",[])[:80]],
       options=[a.get("name") if isinstance(a,dict) else a for a in o.get("options",[])])
    except Exception as e:row["shopify_json_error"]=str(e)[:150]
 except Exception as e:row["error"]=str(e)[:170]
 result[slug]=row
 print(json.dumps({"slug":slug,"title":row.get("shopify_title") or row.get("title"),"images":len(row.get("images",[])),"og":row.get("og_images"),"variants":len(row.get("variants",[])),"error":row.get("error")})[:750],flush=True)
Path("materials-exceptions.json").write_text(json.dumps(result,ensure_ascii=False,indent=2))
