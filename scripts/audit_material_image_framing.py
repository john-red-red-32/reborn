#!/usr/bin/env python3
"""Conservative materials thumbnail subject-framing audit.

Only inspect fresh, source-hosted photos when catalogue URLs change. Store tiny crop
instructions, never copy or publish transformed supplier imagery. Originals remain
available in each gallery. Flat/transparent backgrounds only; otherwise no crop.
"""
import concurrent.futures
import io
import json
import math
import statistics
import threading
import urllib.parse
import urllib.request
import urllib.robotparser
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

ROOT=Path("lib")
SOURCE=ROOT/"material-product-families.ts"
OUTPUT=ROOT/"material-image-framing.json"
EVIDENCE=ROOT/"material-product-evidence.ts"
START="export const materialFamilies:Record<string,FamilyProduct[]>="
EVIDENCE_START="export const materialProductEvidence:Record<string,MaterialProductEvidence>="
AGENT="RebornaResearch/0.4 (+https://reborna.co; non-generative framing analysis)"
ALLOWED={"cdn.shopify.com","bf8e9a3a4a.clvaw-cdnwnd.com"}
ROBOT_LOCK=threading.Lock()
ROBOTS={}

def original_urls():
    text=SOURCE.read_text()
    families=json.loads(text.split(START)[1].strip().removesuffix(";"))
    seen=set()
    for products in families.values():
        for product in products:
            for url in product.get("photoUrls",[]):
                if url and url not in seen:
                    seen.add(url)
                    yield url
            for variant in product.get("variants",[]):
                url=variant.get("photoUrl")
                if url and url not in seen:
                    seen.add(url)
                    yield url
    # Also cover additional gallery images already curated from exact Shopify sources.
    if EVIDENCE.exists():
        evidence=json.loads(EVIDENCE.read_text().split(EVIDENCE_START)[1].strip().removesuffix(";"))
        for record in evidence.values():
            for product in record.get("products",[]):
                for photo in product.get("photos",[]):
                    url=photo.get("url")
                    if url and url not in seen:
                        seen.add(url)
                        yield url

def fetch_image(url):
    parsed=urllib.parse.urlsplit(url)
    if parsed.scheme!="https" or parsed.hostname not in ALLOWED:
        return None
    with ROBOT_LOCK:
        if parsed.hostname not in ROBOTS:
            parser=urllib.robotparser.RobotFileParser()
            parser.set_url("https://"+parsed.hostname+"/robots.txt")
            try:parser.read()
            except Exception:return None
            ROBOTS[parsed.hostname]=parser
        policy=ROBOTS[parsed.hostname]
    if not policy.can_fetch(AGENT,url):
        return None
    # Shopify serves requested thumbnail widths without touching the source record.
    # CDN Webnode images are already served as /700/ variants.
    if parsed.hostname=="cdn.shopify.com":
        sep="&" if parsed.query else "?"
        request_url=url+sep+"width=300"
    else:
        request_url=url
    req=urllib.request.Request(request_url,headers={"User-Agent":AGENT,"Accept":"image/avif,image/webp,image/jpeg,image/png,*/*;q=0.3"})
    with urllib.request.urlopen(req,timeout=17) as response:
        if urllib.parse.urlsplit(response.geturl()).hostname not in ALLOWED:
            return None
        content_type=response.headers.get("Content-Type","")
        if not content_type.startswith("image/"):
            return None
        data=response.read(1_600_001)
        if len(data)>1_600_000:
            return None
    image=Image.open(io.BytesIO(data))
    image=ImageOps.exif_transpose(image)
    if image.width<60 or image.height<60:
        return None
    image.thumbnail((120,120))
    return image.convert("RGBA"),image.width/image.height

def analyse(image,aspect):
    w,h=image.size
    pixels=list(image.getdata())
    corners=[]
    for xx,yy in [(2,2),(w-3,2),(2,h-3),(w-3,h-3),(w//2,2),(w//2,h-3),(2,h//2),(w-3,h//2)]:
        corners.append(pixels[yy*w+xx])
    alpha_background=sum(1 for r,g,b,a in corners if a<22)>=5
    if alpha_background:
        foreground=[int(p[3]>45) for p in pixels]
    else:
        # A flat studio white or consistently coloured border is required.
        colour=[int(statistics.median([p[channel] for p in corners])) for channel in range(3)]
        corner_noise=max(max(abs(p[ch]-colour[ch]) for ch in range(3)) for p in corners)
        if corner_noise>24:
            return None
        foreground=[]
        for r,g,b,a in pixels:
            delta=max(abs(r-colour[0]),abs(g-colour[1]),abs(b-colour[2]))
            total=abs(r-colour[0])+abs(g-colour[1])+abs(b-colour[2])
            foreground.append(int(delta>32 and total>59))
    count=sum(foreground)
    if count<w*h*0.014 or count>w*h*0.78:
        return None
    # Remove scattered background specks, shadows and isolated border text.
    rows=[sum(foreground[y*w:(y+1)*w]) for y in range(h)]
    cols=[sum(foreground[x::w]) for x in range(w)]
    xs=[x for x,v in enumerate(cols) if v>=max(2,int(h*0.032))]
    ys=[y for y,v in enumerate(rows) if v>=max(2,int(w*0.032))]
    if not xs or not ys:
        return None
    l,r=min(xs)/w,(max(xs)+1)/w
    t,b=min(ys)/h,(max(ys)+1)/h
    bw,bh=r-l,b-t
    if bw<0.055 or bh<0.055:
        return None
    # Maximum fit of the original entire image inside a square card.
    rw=min(1,aspect)
    rh=min(1,1/aspect)
    object_span=max(bw*rw,bh*rh)
    if object_span>=0.68:
        return None
    # Conservative: preserve ~13% breathing space around detected item.
    zoom=min(2.10,0.78/max(object_span,0.01))
    zoom=min(zoom,0.89/max(bw*rw,0.01),0.89/max(bh*rh,0.01))
    if zoom<1.24:
        return None
    zoom=max(1.0,round(zoom,2))
    cx=(l+r)/2
    cy=(t+b)/2
    # CSS translate is a percent of image element dimensions before scaling.
    dx=round((0.5-cx)*rw*zoom*100,1)
    dy=round((0.5-cy)*rh*zoom*100,1)
    dx=max(-30,min(30,dx))
    dy=max(-30,min(30,dy))
    return [zoom,dx,dy]

def inspect(url):
    try:
        result=fetch_image(url)
        if not result:return (url,None)
        return (url,analyse(*result))
    except (OSError,ValueError,TypeError,UnidentifiedImageError,ZeroDivisionError):
        return (url,None)
    except Exception:
        return (url,None)

def main():
    urls=list(original_urls())
    previous={}
    if OUTPUT.exists():
        try:
            previous=json.loads(OUTPUT.read_text())
            if not isinstance(previous,dict):previous={}
        except (ValueError,TypeError):previous={}
    results={url:previous[url] for url in urls if url in previous}
    missing=[url for url in urls if url not in previous]
    print("Framing audit total",len(urls),"cached",len(results),"new",len(missing),flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for index,(url,frame) in enumerate(pool.map(inspect,missing),1):
            results[url]=frame
            if index%30==0:print("Examined",index,"of",len(missing),"positive",sum(v is not None for v in results.values()),flush=True)
    # Stable ordering and single tiny metadata entry per original image URL.
    OUTPUT.write_text(json.dumps({url:results[url] for url in urls},ensure_ascii=False,separators=(",",":"))+"\n")
    count=sum(v is not None for v in results.values())
    print("Framing metadata written",OUTPUT,"checked",len(urls),"autoframed",count,"kept_original",len(urls)-count,flush=True)
    print("Sample",[(url.split("/")[-1][:35],f) for url,f in results.items() if f is not None][:12],flush=True)

if __name__=="__main__":main()
