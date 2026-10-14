#!/usr/bin/env python3
"""Manual named-product verification: source page, sculptor identity, image validity.
Research only until source and original sculptor identity is confirmed.
"""
import json,re,urllib.request,urllib.robotparser,urllib.parse,html,time
from pathlib import Path
from bs4 import BeautifulSoup
AGENT='RebornaDiscovery/0.1 (+https://reborna.co; named original-sculpt source audit)'
SOURCES=[
 ('rachele-eva-brilli','Rachele','Eva Brilli','https://www.irresistables.com/rachele-reborn-vinyl-doll-kit-by-eva-brilli-19/'),
 ('florence-eva-brilli','Florence','Eva Brilli','https://www.bebaby.it/tshop/index.php?controller=product&id_lang=1&id_product=4436&rewrite=florence-by-eva-brilli-'),
 ('sama-ebtehal-abul','Sama','Ebtehal Abul','https://www.irresistables.com/sama-reborn-vinyl-doll-by-ebtehal-abul-19/'),
 ('sila-ebtehal-abul','Sila','Ebtehal Abul','https://www.irresistables.com/sila-reborn-vinyl-doll-by-ebtehal-abul-18/'),
 ('arisha-nadine-dolotova','Arisha','Nadine Dolotova','https://reborn-silicone-dolls-by-nadine.myshopify.com/products/reborn-doll-blank-unpainted-vinyl-kit-arisha-11'),
 ('ozzy-nadine-dolotova','Ozzy','Nadine Dolotova','https://reborn-silicone-dolls-by-nadine.myshopify.com/products/reborn-fantasy-vinyl-kit-ozzy-by-nadine-dolotova-grinch-werewolf-elf-inspired'),
 ('tarni-nadine-dolotova','Tarni','Nadine Dolotova','https://reborn-silicone-dolls-by-nadine.myshopify.com/products/reborn-fantasy-vinyl-kit-tarni-the-mermaid-by-nadine-dolotova'),
]
def norm(s):return re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
robots={}
res=[]
for slug,name,artist,url in SOURCES:
 row={'slug':slug,'name':name,'sculptor':artist,'source':url,'status':'review_required','images':[]}
 try:
  h=urllib.parse.urlparse(url).hostname
  if h not in robots:
   rp=urllib.robotparser.RobotFileParser();rp.set_url('https://'+h+'/robots.txt');rp.read();robots[h]=rp
  if not robots[h].can_fetch(AGENT,url):row['status']='robots_denied';res.append(row);continue
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':AGENT,'Accept':'text/html'}),timeout=18) as r:
   page=r.read(2000000).decode('utf8','replace')
  soup=BeautifulSoup(page,'html.parser')
  tag=soup.find('h1')
  row['title']=tag.get_text(' ',strip=True)[:220] if tag else (soup.title.get_text(' ',strip=True) if soup.title else '')
  text=norm(soup.get_text(' ',strip=True)[:20000])
  row['title_matches_sculpt']=bool(re.search(r'(?<![a-z])'+re.escape(norm(name))+r'(?![a-z])',norm(row['title'])))
  row['artist_attributed']=norm(artist) in text or norm(artist) in norm(row['title'])
  candidates=[]
  for t in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
   if t.get('content'):candidates.append(('product_og',t['content']))
  # Product gallery image; avoid global recommendation thumbnails.
  for t in soup.select('.productView-images img, .productView-image img, .product__media img, .product-gallery img, .images-container img, .product-images img, [data-product-single-media-group] img, .product__photos img, [data-product-image] img'):
   for attr in ('data-src','src'): 
    if t.get(attr):candidates.append(('product_gallery',t[attr]))
  for el in soup.find_all('script',attrs={'type':'application/ld+json'}):
   try:obj=json.loads(el.string or el.get_text())
   except Exception:continue
   if not isinstance(obj,list):obj=[obj]
   for o in obj:
    if isinstance(o,dict) and ('Product' in str(o.get('@type')) or 'Product' in str(o.get('@graph',''))):
     images=o.get('image',[])
     for u in images if isinstance(images,list) else [images]:
      if isinstance(u,str):candidates.append(('structured_product',u))
  if 'myshopify.com' in url:
   # Shopify public product JSON is a first-party product record, not a page's other recommendations.
   jp=url.split('?')[0]+'.js'
   if robots[h].can_fetch(AGENT,jp):
    try:
     with urllib.request.urlopen(urllib.request.Request(jp,headers={'User-Agent':AGENT}),timeout=15) as f:jsonprod=json.load(f)
     if norm(name) in norm(jsonprod.get('title','')):
      for u in jsonprod.get('images',[])[:12]:
       if isinstance(u,str):candidates.append(('shopify_product_json',u))
    except Exception as e:row['json_issue']=str(e)[:110]
  seen=set()
  for basis,u in candidates:
   u=urllib.parse.urljoin(url,html.unescape(u))
   if not u.startswith('https://') or u in seen or not re.search(r'\.(?:jpe?g|png|webp)(?:\?|$)',u,re.I):continue
   seen.add(u)
   if any(x in u.lower() for x in ('logo','placeholder','favicon','header','icon')):continue
   pic={'url':u,'basis':basis}
   try:
    with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0','Accept':'image/*'}),timeout=15) as f:
     pic['status']=f.status;pic['content_type']=f.headers.get('Content-Type','');pic['has_bytes']=bool(f.read(32))
   except Exception as e:pic['error']=str(e)[:140]
   row['images'].append(pic)
   if len(row['images'])>=8:break
  if not row['title_matches_sculpt'] or not row['artist_attributed']:row['status']='identity_unconfirmed'
  elif any(p.get('status')==200 and p.get('content_type','').startswith('image/') for p in row['images']):row['status']='named_product_image_candidates'
  else:row['status']='images_unavailable'
 except Exception as e:row['status']=type(e).__name__;row['error']=str(e)[:180]
 res.append(row)
 print(json.dumps(row,ensure_ascii=False)[:1300],flush=True);time.sleep(.3)
Path('raa-extra-seven-kit-images.json').write_text(json.dumps(res,indent=2,ensure_ascii=False),encoding='utf8')
