#!/usr/bin/env python3
"""Source-only second pass. Evidence is published exclusively to scrape-results."""
import json,re,html,urllib.robotparser,urllib.request,urllib.parse,time
from bs4 import BeautifulSoup
ROWS=[
("eefje-elly-knoops","Eefje","Elly Knoops","https://www.oncesoreal.com/eefje-lange-vinylteile-set/p-140.html"),
("mattia-gudrun-legler","Mattia","Gudrun Legler","https://www.oncesoreal.com/mattia-set/p-5682.html"),
("tony-gudrun-legler","Tony","Gudrun Legler","https://www.gudrun-legler-onlineshop.de/online-shop/reborn-set-tony/"),
("ellis-philomena-donnelly","Ellis","Phil Donnelly","https://www.oncesoreal.com/ellis-set/p-7465.html"),
("quinn-philomena-donnelly","Quinn","Phil Donnelly","https://www.oncesoreal.com/quinn-set/p-7574.html"),
("lil-cry-philomena-donnelly","Lil' Cry","Phil Donnelly","https://www.phildonnellybabies.co.uk/product-page/lil-cry-coming-soon-20"),
("josie-awake-ping-lau","Josie Awake","Ping Lau","https://www.irresistables.com/josie-awake-reborn-vinyl-doll-kit-by-ping-lau/"),
("josie-ping-lau","Josie","Ping Lau","https://www.irresistables.com/josie-reborn-vinyl-doll-kit-by-ping-lau/"),
("baby-george-ping-lau","Baby George","Ping Lau","https://www.irresistables.com/newborn-george-reborn-vinyl-doll-kit-by-ping-lau-20/"),
("sugar-ping-lau","Sugar","Ping Lau","https://www.oncesoreal.com/sugar-von-ping-lau/p-7500.html"),
("lillegroda-sabine-altenkirch-junkes","Lillegroda","Sabine Altenkirch","https://www.irresistables.com/lillegroda-reborn-vinyl-doll-kit-by-sabine-altenkirch-18/"),
("amy-elly-knoops","Amy","Elly Knoops","https://macphersoncrafts.com/reborn-doll-kits/amy-by-elly-knoops.htm"),
("river-sleeping-dawn-donofrio","River Sleeping","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/limited-time-offer-river-sleeping-blank-full-body-silicone-doll-kit/"),
("danica-dawn-donofrio","Danica","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/danica-blank-partial-silicone-5-piece-doll-kit/"),
("remi-dawn-donofrio","Remi","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/remi-blank-full-body-silicone-doll-kit/"),
("journey-dawn-donofrio","Journey","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/journey-blank-full-body-silicone-doll-kit/"),
("cameron-laura-tuzio-ross","Cameron","Laura Tuzio Ross","https://www.myworldofbabies.com/shop/vinyl-reborn-doll-kits/cameron/"),
]
UA="RebornaDiscovery/0.1 (+https://reborna.co; editorial archival research)"
rps={}
results=[]
for slug,name,artist,url in ROWS:
 rec=dict(slug=slug,name=name,artist=artist,url=url,status="unknown")
 try:
  host=urllib.parse.urlparse(url).netloc
  if host not in rps:
   rp=urllib.robotparser.RobotFileParser();rp.set_url("https://"+host+"/robots.txt");rp.read();rps[host]=rp
  if not rps[host].can_fetch(UA,url):
   rec["status"]="robots_denied";results.append(rec);continue
  with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":UA,"Accept":"text/html"}),timeout=15) as f:body=f.read(2500000).decode("utf8","replace")
  soup=BeautifulSoup(body,"html.parser")
  rec["title"]=(soup.find("h1") or soup.title).get_text(" ",strip=True) if soup.find("h1") or soup.title else ""
  rec["og"]=[x.get("content") for x in soup.select('meta[property="og:image"],meta[name="twitter:image"]')]
  sel=soup.select('.product-gallery img,.productView-images img,.woocommerce-product-gallery img,.product-single img,.product-gallery__image img,main img')
  rec["img"]=[{"src":x.get("src"),"data-src":x.get("data-src"),"alt":x.get("alt","")[:75]} for x in sel][:24]
  rec["status"]="loaded"
 except Exception as e:rec["status"]=type(e).__name__;rec["error"]=str(e)[:100]
 results.append(rec)
 print(json.dumps(rec,ensure_ascii=False)[:2500],flush=True)
 time.sleep(.2)
with open("photo-review-remaining-pass2.json","w") as f:json.dump(results,f,indent=2,ensure_ascii=False)
