#!/usr/bin/env python3
"""Evidence-only source image review for Reborna missing-photo queue, 2026-10-14.
Manual identity and rights review is mandatory before production publication.
Only direct public artist or retailer pages; no logins or robots bypass.
"""
import json,re,time,urllib.robotparser,urllib.request,urllib.parse,html
from bs4 import BeautifulSoup
from urllib.parse import urlparse,urljoin
UA="RebornaDiscovery/0.1 (+https://reborna.co; independent original-sculpt research)"
ROWS=[
("danica-dawn-donofrio","Danica","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/danica-blank-partial-silicone-5-piece-doll-kit/"),
("journey-dawn-donofrio","Journey","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/journey-blank-full-body-silicone-doll-kit/"),
("remi-dawn-donofrio","Remi","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/remi-blank-full-body-silicone-doll-kit/"),
("river-awake-dawn-donofrio","River Awake","Dawn Donofrio","https://mybabyflowers.com/en/baby/river/?lang=en"),
("river-sleeping-dawn-donofrio","River Sleeping","Dawn Donofrio","https://www.ddartdolls.com/shop/silicone-dolls/blank-silicone-kits/limited-time-offer-river-sleeping-blank-full-body-silicone-doll-kit/"),
("tatum-dawn-donofrio","Tatum","Dawn Donofrio","https://mybabyflowers.com/en/baby/tatum/?lang=en"),
("amy-elly-knoops","Amy","Elly Knoops","https://macphersoncrafts.com/reborn-doll-kits/amy-by-elly-knoops.htm"),
("bibi-elly-knoops","Bibi","Elly Knoops","https://www.irresistables.com/bibi-reborn-vinyl-doll-kit-by-elly-knoops-22/"),
("eefje-elly-knoops","Eefje","Elly Knoops","https://www.irresistables.com/little-eefje-reborn-vinyl-doll-kit-by-elly-knoops-15-16/"),
("fleur-elly-knoops","Fleur","Elly Knoops","https://www.irresistables.com/fleur-reborn-vinyl-doll-kit-by-elly-knoops-21/"),
("luca-elly-knoops","Luca","Elly Knoops","https://www.irresistables.com/luca-by-elly-knoops/"),
("mattia-gudrun-legler","Mattia","Gudrun Legler","https://www.gudrun-legler-onlineshop.de/online-shop/reborn-set-mattia/"),
("mila-gudrun-legler","Mila","Gudrun Legler","https://www.dollli.uk/product-page/mila-doll-kit-by-gudrun-legler-le1234-19-20"),
("tony-gudrun-legler","Tony","Gudrun Legler","https://www.gudrun-legler-onlineshop.de/online-shop/reborn-set-tony/"),
("max-laura-lee-eagles","Max","Laura Lee Eagles","https://rebornsweetshop.com/products/deposit-custom-max-by-laura-lee-eagles-reborn-baby"),
("cameron-laura-tuzio-ross","Cameron","Laura Tuzio Ross","https://www.myworldofbabies.com/shop/vinyl-reborn-doll-kits/cameron/"),
("ellis-philomena-donnelly","Ellis","Phil Donnelly","https://www.phildonnellybabies.co.uk/reborndollkits"),
("kitty-philomena-donnelly","Kitty","Phil Donnelly","https://www.phildonnellybabies.co.uk/product-page/demi-donnelly-vinyl-reborn-doll-kit-presale-deposit"),
("lil-cry-philomena-donnelly","Lil' Cry","Phil Donnelly","https://www.phildonnellybabies.co.uk/product-page/lil-cry-coming-soon-20"),
("quinn-philomena-donnelly","Quinn","Phil Donnelly","https://www.phildonnellybabies.co.uk/reborndollkits"),
("candy-ping-lau","Candy","Ping Lau","https://www.irresistables.com/candy-reborn-vinyl-doll-kit-by-ping-lau-20/"),
("baby-george-ping-lau","Baby George","Ping Lau","https://macphersoncrafts.com/online-store/manufacturer/ping-lau"),
("josie-awake-ping-lau","Josie Awake","Ping Lau","https://www.puppen-traumland.de/reborn-bausaetze-doll-kits/puppen-traumland-reg-bausaetze/pt-reg-bausaetze-nach-kuenstlern/ping-lau/1075/reborn-bausatz-josie-wach-von-ping-lau"),
("josie-ping-lau","Josie","Ping Lau","https://macphersoncrafts.com/online-store/manufacturer/ping-lau"),
("minnie-ping-lau","Minnie","Ping Lau","https://www.oncesoreal.com/minnie-set-inklusive-torso-koerper-kopf-und-armverbinder/p-8129.html"),
("sugar-ping-lau","Sugar","Ping Lau","https://macphersoncrafts.com/online-store/manufacturer/ping-lau"),
("leo-sabine-altenkirch-junkes","Leo","Sabine Altenkirch","https://www.irresistables.com/leo-reborn-vinyl-doll-kit-by-sabine-altenkirch-20/"),
("lillegroda-sabine-altenkirch-junkes","Lillegroda","Sabine Altenkirch","https://www.sabine-altenkirch.com/startseite-home/shop/lillegroda/"),
("timothy-sabrina-hergarten","Timothy","Sabrina Hergarten","https://www.truborns.com/products/timothy-by-sabrina-hergarten"),
("lou-severine-piret","Lou","Severine Piret","https://www.mottandgido.com/product-page/lou-15-preemie-reborn-kit-by-s%C3%A9verine-piret"),
("pebbles-severine-piret","Pebbles","Severine Piret","https://www.irresistables.com/pebbles-reborn-vinyl-doll-kit-by-severine-piret/"),
("talula-severine-piret","Talula","Severine Piret","https://www.truborns.com/products/talula-by-severine-piret"),
]
def norm(s):return re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
def main():
  robots={};output=[]
  for slug,name,artist,url in ROWS:
    result=dict(slug=slug,name=name,artist=artist,source=url,status='not_visited',candidates=[])
    host=urlparse(url).hostname
    try:
      if host not in robots:
        rp=urllib.robotparser.RobotFileParser();rp.set_url('https://'+host+'/robots.txt');rp.read();robots[host]=rp
      if not robots[host].can_fetch(UA,url):result['status']='robots_denied';output.append(result);continue
      req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html'})
      with urllib.request.urlopen(req,timeout=18) as response:
        if 'html' not in response.headers.get('Content-Type',''):result['status']='not_html';output.append(result);continue
        body=response.read(2500000).decode('utf-8','replace')
      soup=BeautifulSoup(body,'html.parser')
      title=(soup.find('h1') or soup.find('title'))
      result['title']=title.get_text(' ',strip=True)[:200] if title else ''
      text=norm(soup.get_text(' ',strip=True)[:50000])
      full_name=norm(name); full_artist=norm(artist)
      title_norm=norm(result['title'])
      result['exact_title_match']=bool(re.search(r'(?<![a-z])'+re.escape(full_name)+r'(?![a-z])',title_norm))
      result['artist_name_present']=full_artist in text or full_artist in norm(body[:4000])
      # No source-page-only publication when a category mixes unrelated kits.
      if not result['exact_title_match'] or not result['artist_name_present']:
        result['status']='review_title_or_artist_mismatch';output.append(result);continue
      hits=[]
      for meta in soup.find_all('meta'):
        if (meta.get('property') or meta.get('name') or '').lower() in ('og:image','twitter:image','twitter:image:src'):
          hits.append(('og_product',meta.get('content',''),'' ))
      for im in soup.find_all('img'):
        alt=im.get('alt','')
        for prop in ('data-src','data-zoom-image','data-image','data-original','src'):
          val=im.get(prop)
          if val:hits.append(('page_img_'+prop,val,alt))
        srcset=im.get('srcset','') or im.get('data-srcset','')
        if srcset:
          hits.append(('srcset',srcset.split(',')[-1].strip().split(' ')[0],alt))
      for match in re.findall(r'https?://[^\s"<>\\]+?\.(?:jpg|jpeg|png|webp)(?:\?[^\s"<>\\]*)?',html.unescape(body),re.I):
        if ('cdn/shop/' in match or 'static.wixstatic' in match or 'cdn11.bigcommerce' in match or 'images.squarespace' in match):
          hits.append(('product_html',match,''))
      used=set()
      for basis,raw,alt in hits:
        raw=html.unescape(raw).strip()
        if not raw or raw.startswith('data:'):continue
        url_img=urljoin(url,raw)
        if not url_img.startswith('https://') or len(url_img)>1200:continue
        if url_img.split('?')[0] in used:continue
        if not re.search(r'\.(jpg|jpeg|png|webp)(?:\?|$)',url_img,re.I):continue
        if any(z in url_img.lower() for z in ('logo','icon','placeholder','favicon','payment','banner','watermark')):continue
        used.add(url_img.split('?')[0])
        result['candidates'].append(dict(url=url_img,basis=basis,alt=alt[:120]))
        if len(result['candidates'])>=10:break
      # Confirm only initial image responses without fetching restricted domains.
      for p in result['candidates'][:4]:
        try:
          req=urllib.request.Request(p['url'],headers={'User-Agent':'Mozilla/5.0','Accept':'image/*'},method='GET')
          with urllib.request.urlopen(req,timeout=12) as f:
            p['http']=f.status;p['type']=f.headers.get('Content-Type');p['has_bytes']=bool(f.read(60))
        except Exception as e:p['verify_error']=str(e)[:100]
      result['status']='review_candidates' if result['candidates'] else 'no_page_image_candidates'
    except Exception as e:result['status']='fetch_'+type(e).__name__;result['error']=str(e)[:180]
    output.append(result)
    print(json.dumps(result,ensure_ascii=False)[:1600],flush=True)
    time.sleep(.25)
  with open('photo-review-20261014.json','w') as f:json.dump({'source':'exact_public_product_page_review','rows':output,'notice':'This is research evidence, not usage permission or automatic identity acceptance.'},f,indent=2,ensure_ascii=False)
  print('SUMMARY',json.dumps({s:sum(1 for r in output if r['status']==s) for s in set(r['status'] for r in output)}),flush=True)
if __name__=='__main__':main()
