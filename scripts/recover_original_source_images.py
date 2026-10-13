#!/usr/bin/env python3
"""Find named, original-source product photography for Reborna's image gaps.

RESEARCH ONLY. No automatic publication. Honor robots directives on each
origin; do not scrape Ping Lau's expressly restricted artist artwork.
Exact product page or name-matched retailer cards only. Never use a generic
sculptor search result as a named kit photograph.
"""
import argparse
import json
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

from bs4 import BeautifulSoup

AGENT = "RebornaDiscovery/0.1 (+https://reborna.co; named original-sculpt research)"
MAX_DOC = 2_500_000
IMG_SUFFIX = re.compile(r"\.(?:jpg|jpeg|png|webp)(?:\?|$)", re.I)
PLACEHOLDER = re.compile(r"logo|placeholder|spinner|icon|sprite|favicon|avatar|payment|banner|badge|no.image", re.I)
STOP_HOSTS = {"pingart.com", "www.pingart.com"}
LINK_PAT = re.compile(r"(^|\W)(?:shop|product|doll-kit|vinyl|silicone|reborn|sculpt)(?:\W|$)", re.I)

def simplify(value):
    return re.sub(r"[^a-z0-9]+", " ", str(value).casefold()).strip()

def name_match(name, text):
    n = simplify(name)
    t = simplify(text)
    return bool(n and re.search(r"(?<![a-z0-9])"+re.escape(n)+r"(?![a-z0-9])",t))

def valid_image(url, base):
    if not url:return None
    url=urljoin(base,url.strip())
    p=urlsplit(url)
    if p.scheme!="https" or not p.hostname or p.username or p.password or p.port:
        return None
    if PLACEHOLDER.search(p.path) or not IMG_SUFFIX.search(p.path):return None
    return url

def get_array(path):
    source=Path(path).read_text(encoding="utf8")
    start=source.index("export const ")
    begin=source.index("=[",start)+1
    end=source.index("];",begin)+1
    return json.loads(source[begin:end])

def all_entries(root):
    # Every photo-pending original in the two research cohorts, no current
    # image-backed or duplicate kits; approved names are from committed repo.
    relative=[
      "lib/indexed-kits-dawn-laura.ts","lib/indexed-kits-sabine.ts",
      "lib/indexed-kits-gudrun.ts","lib/indexed-kits-philomena.ts",
      "lib/indexed-kits-alejandra.ts","lib/indexed-kits-severine.ts",
      "lib/retailer-kits-elly-iveta.ts","lib/retailer-kits-olga.ts",
      "lib/retailer-kits-sabrina.ts","lib/retailer-kits-ping.ts",
      "lib/retailer-kits-lauralee.ts"
    ]
    for path in relative:
        for kit in get_array(root/path):
            if kit.get("photos"):continue
            yield kit

def robots_for(url,cache):
    p=urlsplit(url)
    hostname=(p.hostname or "").lower()
    if hostname in STOP_HOSTS:return False,"explicit_image_rights_restriction"
    if hostname not in cache:
        rp=RobotFileParser()
        rp.set_url("https://"+hostname+"/robots.txt")
        try:
            rp.read()
            if rp.disallow_all:cache[hostname]=(False,"robots_disallow_all")
            elif not rp.default_entry and not rp.entries and not rp.allow_all:
                cache[hostname]=(False,"robots_unknown_or_unavailable")
            else:cache[hostname]=(rp,"")
        except Exception as exc:
            cache[hostname]=(False,"robots_fetch_error_"+type(exc).__name__)
    rp,note=cache[hostname]
    return ((rp.can_fetch(AGENT,url),note) if isinstance(rp,RobotFileParser) else (False,note))

def fetch_page(url,host,cache):
    allowed,reason=robots_for(url,cache)
    if not allowed:return None,reason or "robots_disallowed"
    try:
        req=Request(url,headers={"User-Agent":AGENT,"Accept":"text/html"})
        with urlopen(req,timeout=14) as f:
            new=f.geturl()
            if (urlsplit(new).hostname or "").lower()!=host:return None,"cross_host_redirect"
            if "text/html" not in f.headers.get("Content-Type","").lower():
                return None,"not_html"
            blob=f.read(MAX_DOC+1)
            if len(blob)>MAX_DOC:return None,"page_too_large"
        return BeautifulSoup(blob,"html.parser"),None
    except Exception as exc:
        return None,"fetch_"+type(exc).__name__

def card_image_for(soup,name,page):
    # Retailer category/list: image MUST be inside a card containing the exact
    # sculpt name (no "nearest sibling", no entire category's first image).
    choices=[]
    for tag in soup.find_all(["article","li","div"]):
        cls=" ".join(tag.get("class",[]))
        if not re.search(r"product|card|item|listing",cls,re.I):continue
        if len(tag.get_text(" ",strip=True))>700:continue
        img=tag.find("img")
        if not img:continue
        text=tag.get_text(" ",strip=True)
        alt=img.get("alt") or img.get("title") or ""
        if not (name_match(name,text) or name_match(name,alt)):continue
        if name_match(name,alt) or (name_match(name,text) and len(text)<250):
            u=valid_image(img.get("data-src") or img.get("src") or img.get("data-lazy-src"),page)
            if u:choices.append((u,"name_matched_retailer_card"))
    # Strongest first, and never accept a generic artist category OG image.
    return choices[:3]

def product_images(soup,name,page):
    title=(soup.find("meta",attrs={"property":"og:title"}) or {}).get("content","")
    title=title or (soup.find("h1") or {}).get_text(" ",strip=True)
    parsed=urlsplit(page)
    direct=name_match(name,title) and (name_match(name,parsed.path) or "product" in parsed.path or "shop" in parsed.path)
    if not direct:return [],"page_not_exact_named_product"
    pics=[]
    for property_ in ["og:image","twitter:image"]:
        tag=soup.find("meta",attrs={"property":property_}) or soup.find("meta",attrs={"name":property_})
        if tag:
            url=valid_image(tag.get("content"),page)
            if url:pics.append((url,"exact_product_"+property_.replace(":","_")))
    # Image galleries in WooCommerce/Shopify/Bigcommerce/stores.
    for sel in [".woocommerce-product-gallery img",".product-gallery img",".product-images img",".product-image img",
                "main .woocommerce-product-gallery img","[itemprop='image']","img.wp-post-image"]:
        for img in soup.select(sel)[:7]:
            url=valid_image(img.get("data-large_image") or img.get("data-src") or img.get("src"),page)
            if url:pics.append((url,"exact_product_image_gallery"))
    seen=set();result=[]
    for url,basis in pics:
        canonical=url.split("#")[0]
        if canonical in seen:continue
        seen.add(canonical);result.append((canonical,basis))
    return result[:4],"matched_exact_product_title"

def inspect(kit,cache,delay=1):
    name=kit["name"]
    sources=kit.get("sources",[])
    result={"slug":kit["slug"],"name":name,"artist_slug":kit["artistSlug"],
            "primary_source":sources[0]["url"],"matched":[],"reason":None}
    for src in sources:
        page=src["url"]
        host=(urlsplit(page).hostname or "").lower()
        if host in STOP_HOSTS:
            result["reason"]="explicit_image_rights_restriction"
            continue
        soup,error=fetch_page(page,host,cache)
        if not soup:
            result["reason"]=error
            continue
        got,reason=product_images(soup,name,page)
        if got:
            result["matched"]=[{"url":url,"source":page,"basis":basis,
                 "credit":(src["label"].split(" — ")[0]+" — original product-page photograph")}
                for url,basis in got]
            result["reason"]="source_matched_photo_candidates"
            return result
        # Multi-kit listings can be matched only by named card, no loose hero.
        if src["kind"]=="retailer" or "product-category" in page or "manufacturer" in page:
            got=card_image_for(soup,name,page)
            if got:
                result["matched"]=[{"url":url,"source":page,"basis":basis,
                     "credit":src["label"].split(" — ")[0]+" — named retailer product photograph"}
                    for url,basis in got]
                result["reason"]="source_matched_card_candidates"
                return result
        result["reason"]=reason or "no_exact_image_found"
        time.sleep(delay)
    return result

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--root",type=Path,default=Path("."))
    p.add_argument("--artists",required=True,help="comma-separated artist slugs")
    p.add_argument("--out",required=True,type=Path)
    a=p.parse_args()
    allowed=set(a.artists.split(","))
    rows=[k for k in all_entries(a.root) if k["artistSlug"] in allowed]
    cache={}
    output={"adapter":"original-source-image-review-v1","scan_at":datetime.now(timezone.utc).isoformat(),
      "artists":sorted(allowed),"total":len(rows),"records":[]}
    for i,k in enumerate(rows):
        try:r=inspect(k,cache)
        except Exception as e:r={"slug":k["slug"],"artist_slug":k["artistSlug"],"matched":[],"reason":type(e).__name__}
        output["records"].append(r)
        print(f'[{i+1}/{len(rows)}] {k["artistSlug"]}/{k["name"]}: {len(r["matched"])} photos / {r["reason"]}',flush=True)
        time.sleep(1)
    a.out.parent.mkdir(parents=True,exist_ok=True)
    a.out.write_text(json.dumps(output,indent=2,ensure_ascii=False),encoding="utf8")
    print("MATCHED",sum(bool(x["matched"]) for x in output["records"]),"OF",len(rows),flush=True)

if __name__=="__main__":main()
