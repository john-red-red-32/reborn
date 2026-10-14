#!/usr/bin/env python3
"""Research original named image candidates from permitted artist/dealer pages.
Never blindly publish. Ping photos read solely from retailer whose product-page
terms permit non-commercial sharing; NO pingart.com image requests.
"""
import json, re, time, argparse, urllib.robotparser
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from bs4 import BeautifulSoup

AGENT="RebornaDiscovery/0.1 (+https://reborna.co; editorial source research)"
PAGES=[
 ("willow-joanna-kazmierczak","Willow","joanna-kazmierczak","https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak"),
 ("luca-ping-lau","Luca","ping-lau","https://www.irresistables.com/luca-reborn-vinyl-toddler-doll-kit-by-ping-lau-30/"),
 ("tori-ping-lau","Tori","ping-lau","https://www.irresistables.com/copy-of-tori-doll-kit-by-ping-lau-limited-first-edition/"),
 ("raven-ping-lau","Raven","ping-lau","https://www.irresistables.com/raven-by-ping-lau-2nd-edition/"),
 ("lovelyn-awake-ping-lau","Lovelyn Awake","ping-lau","https://www.irresistables.com/lovelyn-awake-reborn-vinyl-doll-kit-by-ping-lau-ultra-soft-vinyl-23/"),
 ("lovelyn-asleep-ping-lau","Lovelyn Asleep","ping-lau","https://www.irresistables.com/lovelyn-asleep-reborn-vinyl-doll-kit-by-ping-lau-ultra-soft-vinyl/"),
 ("soledad-ping-lau","Soledad","ping-lau","https://www.irresistables.com/copy-of-soledad-vinyl-doll-kit-by-ping-lau-ldc/"),
 ("josie-awake-ping-lau","Josie Awake","ping-lau","https://www.irresistables.com/josie-awake-reborn-vinyl-doll-kit-by-ping-lau/"),
 ("josie-ping-lau","Josie","ping-lau","https://www.irresistables.com/josie-reborn-vinyl-doll-kit-by-ping-lau/"),
 ("baby-george-ping-lau","Baby George","ping-lau","https://www.irresistables.com/newborn-george-reborn-vinyl-doll-kit-by-ping-lau-20/"),
 ("emma-dawn-donofrio","Emma","dawn-donofrio","https://rebornbabycreations.com/products/super-soft-silicone-baby-emma-by-dawn-64xg8mj82wno0xrd"),
 ("emerson-dawn-donofrio","Emerson","dawn-donofrio","https://rebornbabycreations.com/products/super-soft-silicone-baby-emerson-by-dawn-38489"),
]
def check_robot(url,cache):
 h=urlsplit(url).hostname
 if h in ("pingart.com","www.pingart.com"):return False,"explicit_ping_artist_site"
 if h not in cache:
  rp=urllib.robotparser.RobotFileParser(); rp.set_url("https://"+h+"/robots.txt")
  try:rp.read(); cache[h]=rp
  except Exception as exc:return False,"robots_error_"+type(exc).__name__
 return cache[h].can_fetch(AGENT,url),"robots_denied"
def value(s):return re.sub(r"\s+"," ",s).strip()
def read(url):
 r=Request(url,headers={"User-Agent":AGENT,"Accept":"text/html"})
 with urlopen(r,timeout=20) as f:
  if "text/html" not in f.headers.get("content-type",""):raise ValueError("not_html")
  return f.read(2_500_000).decode("utf-8","replace")
def inspect(item,cache):
 slug,name,artist,url=item
 result={"slug":slug,"name":name,"artist":artist,"source":url,"candidate_urls":[],"status":"unreviewed"}
 yes,why=check_robot(url,cache)
 if not yes:result["status"]=why;return result
 try:
  soup=BeautifulSoup(read(url),"html.parser")
  title=value((soup.find("h1") or soup.title).get_text(" ",strip=True))
  result["page_title"]=title
  norm=lambda s:re.sub(r"[^a-z0-9]+"," ",s.lower()).strip()
  if norm(name) not in norm(title):
   result["status"]="name_title_not_matched";return result
  if artist in ("ping-lau","dawn-donofrio") and not (("ping lau" if artist=="ping-lau" else "dawn donofrio") in norm(title) or ("ping lau" if artist=="ping-lau" else "dawn donofrio") in norm(soup.get_text(" ",strip=True)[:5000])):
   result["status"]="artist_not_confirmed";return result
  candidates=[]
  if slug.startswith("willow-"):
   for image in soup.find_all("img"):
    src=image.get("data-src") or image.get("src") or ""
    if "images.squarespace-cdn.com" in src and re.search(r"\.(jpg|jpeg|png|webp)",src,re.I) and not re.search(r"logo|watermark|icon",src,re.I):
     candidates.append({"url":urljoin(url,src),"basis":"exact_product_squarespace_gallery","alt":image.get("alt","")})
   # Squarespace product details may store image variants in JSON.
   for match in re.finditer(r'https?://images\.squarespace-cdn\.com/content/v1/[^"\\\s<>]+',str(soup)):
    u=match.group(0).replace("&amp;","&")
    if re.search(r"\.(jpg|jpeg|png|webp)",u,re.I) and not re.search(r"logo|watermark|icon",u,re.I):
     candidates.append({"url":u,"basis":"exact_product_squarespace_page","alt":""})
  else:
   meta=soup.find("meta",attrs={"property":"og:image"})
   if meta and meta.get("content"):
    candidates.append({"url":urljoin(url,meta["content"]),"basis":"exact_product_og_image","alt":""})
   for image in soup.select(".productView-images img, .productView-image img, [data-product-image] img, .product-gallery img")[:8]:
    src=image.get("data-src") or image.get("src")
    if src:candidates.append({"url":urljoin(url,src),"basis":"exact_product_gallery","alt":image.get("alt","")})
  seen=set()
  for c in candidates:
   u=c["url"]
   if not u.startswith("https://") or u in seen or len(u)>1100:continue
   if artist=="ping-lau" and ("macphersoncrafts.com" in u or "pingart.com" in u):continue
   seen.add(u)
   result["candidate_urls"].append(c)
  result["candidate_urls"]=result["candidate_urls"][:8]
  result["status"]="exact_product_image_candidates" if result["candidate_urls"] else "no_images_found"
 except Exception as exc:
  result["status"]="fetch_"+type(exc).__name__
 return result
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--out",required=True)
 args=ap.parse_args()
 cache={};rows=[]
 for item in PAGES:
  row=inspect(item,cache);rows.append(row)
  print(json.dumps(row,ensure_ascii=False)[:1600],flush=True)
  time.sleep(.7)
 with open(args.out,"w",encoding="utf8") as f:json.dump({"rows":rows,"source":"named_product_source_only","terms":"Ping retailer photography permitted for noncommercial sharing per Irresistables original kit pages; separate restrictions apply to pingart and MacPherson."},f,indent=2,ensure_ascii=False)
 print("CANDIDATES",sum(bool(x["candidate_urls"]) for x in rows),"of",len(rows),flush=True)
if __name__=="__main__":main()
