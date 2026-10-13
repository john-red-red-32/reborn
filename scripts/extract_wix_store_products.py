#!/usr/bin/env python3
"""Read-only extraction of source-linked Wix Stores product pages.

Unlike iframe Wix Gallery and alt-tag collection adapters, follows explicit
same-host /product-page/ links on *approved artist kit collection pages*.
Keeps each page's material and photo evidence independently reviewable.
Never infers availability, dates, price or a claimed relationship.
"""
import argparse
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

from discover_artist_site import Extract, clean_url, AGENT, MAX_BYTES

IMAGE = re.compile(r"^https://static\.wixstatic\.com/media/[^?#]+", re.I)
STOREFRONT = re.compile(r"/product-page/[^/?#]+$", re.I)
KIT = re.compile(r"\b(vinyl|silicone)\b", re.I)
CLEAN_NAME = re.compile(r'^["“]?([^"”]+)["”]?')

def clean_title(value):
    title=re.sub(r"\s+"," ",value or "").strip()
    # Product names are sometimes quoted followed by the variant/type text.
    m=re.search(r'["“]([^"”]{2,85})["”]',title)
    if m: return m.group(1).strip()
    title=re.sub(r"(?i)^(\s*SOLD OUT\s+|PRE-?ORDER\s+|SNEAK PEEK\s+)","",title).strip()
    title=re.sub(r"(?i)\s*(?:full body|fb)?\s*(?:vinyl|silicone)\s+(?:reborn\s+)?(?:doll\s+)?(?:kit|toddler\b).*","",title).strip(" -—:,")
    return title[:92] if title else ""

def title_material(title, category):
    # Some product placements are cross-listed: explicit title overrides
    # collection default; otherwise a *dedicated kit* collection supplies it.
    explicit=KIT.findall(title)
    if len(set(x.lower() for x in explicit))==1: return explicit[0].lower()
    return category if category in ("vinyl","silicone") and not explicit else None

def product_candidates(discovery,collection_paths,max_products=60):
    host=(urlsplit(discovery.get("source","")).hostname or "").lower()
    links={}
    for page in discovery.get("pages",[]):
        parsed=urlsplit(page.get("url",""))
        if parsed.hostname!=host or parsed.path.rstrip("/") not in collection_paths:
            continue
        category=collection_paths[parsed.path.rstrip("/")]
        for link in page.get("links",[]):
            url=urlsplit(link)
            if url.scheme=="https" and url.hostname==host and STOREFRONT.fullmatch(url.path):
                links.setdefault(link.split("#")[0],category)
    return list(links.items())[:max_products]

def extract_page(html,url,material_hint):
    parser=Extract()
    parser.feed(html)
    title=parser.meta.get("og:title") or " ".join(parser.titles)
    title=re.sub(r"\s*(?:\|| - )\s*(?:dmh sculptures|dmhstudio).*$","",title,flags=re.I).strip()
    if not title: return None
    # Store listings carry named headings and photo alts. Avoid blanket
    # image galleries, logo assets and unrelated finished dolls.
    lowered=title.casefold()
    if re.search(r"\b(completed|finished|painted and rooted|adoptable)\b",lowered):
        return None
    explicit=bool(re.search(r"\bkit\b|\bunpainted\b|\bblank\b",lowered))
    if not explicit:
        # Names like Maxan may omit "kit" in title. Defer to review, not auto-publish.
        return {
            "source_url":url,"source_title":title,"sculpt_name_candidate":clean_title(title),
            "material_candidate":title_material(title,material_hint),
            "publication_ready":False,"review_reason":"no_explicit_kit_type_in_product_title",
            "photo_candidates":[],"source_type":"wix_store_product_page"
        }
    material=title_material(title,material_hint)
    name=clean_title(title)
    if not name or len(name)<2 or not material:
        return None
    # Use only product-labelled hero images, never the page logo/navigation.
    photos=[]
    for item in parser.images:
        alt=re.sub(r"\s+"," ",item.get("alt") or "").strip()
        full=clean_url(item.get("src") or "",url)
        if not full or not IMAGE.match(full):continue
        name_exact=alt.casefold()==title.casefold()
        if not name_exact and not (len(name)>=4 and name.casefold() in alt.casefold() and re.search(r"\b(?:kit|sculpt|thumbnail)\b",alt,re.I)):
            continue
        asset=full.split("/v1/")[0]
        if asset not in photos:photos.append(asset)
    if not photos:
        og=parser.meta.get("og:image") or ""
        if IMAGE.match(og): photos.append(og.split("/v1/")[0])
    return {"source_url":url,"source_title":title,"sculpt_name_candidate":name,
            "material_candidate":material,"publication_ready":bool(photos),
            "review_reason":None if photos else "no_source_matched_product_photo",
            "photo_candidates":photos[:10],
            "source_type":"wix_store_product_page",
            "image_rights":"source_hosted_reference_only",
            "evidence":"Official kit collection links to a named Wix Stores product detail page"}

def scan(discovery,collections,max_products=60,delay=1):
    host=(urlsplit(discovery.get("source","")).hostname or "").lower()
    if not host: raise ValueError("Missing source hostname")
    robot=RobotFileParser()
    robot.set_url("https://"+host+"/robots.txt")
    robot.read()
    links=product_candidates(discovery,collections,max_products)
    records=[];errors=[]
    for url,category in links:
        if not robot.can_fetch(AGENT,url):
            errors.append({"url":url,"status":"robots_disallowed"})
            continue
        try:
            req=Request(url,headers={"User-Agent":AGENT,"Accept":"text/html"})
            with urlopen(req,timeout=17) as res:
                if urlsplit(res.geturl()).hostname!=host:raise ValueError("Cross-domain redirect")
                if "text/html" not in res.headers.get("Content-Type","").lower():raise ValueError("Not HTML")
                blob=res.read(MAX_BYTES+1)
                if len(blob)>MAX_BYTES:raise ValueError("HTML too large")
                html=blob.decode(res.headers.get_content_charset() or "utf-8",errors="replace")
            record=extract_page(html,url,category)
            if record:records.append(record)
        except Exception as ex:
            errors.append({"url":url,"status":type(ex).__name__,"note":str(ex)[:150]})
        time.sleep(delay)
    return {"adapter":"wix-stores-kit-products-v1","source":discovery.get("source"),"source_scan_at":datetime.now(timezone.utc).isoformat(),
            "product_pages_found":len(links),"products_parsed":len(records),
            "source_photo_matched":sum(bool(x["photo_candidates"]) for x in records),
            "products":records,"errors":errors,
            "notice":"Research-only, no current stock or price inferred. Artist image URLs are source-hosted; artwork credits remain with original site."}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input",required=True)
    p.add_argument("--collection",action="append",required=True,help="Approved /path:vinyl or /path:silicone")
    p.add_argument("--max-products",type=int,default=60)
    p.add_argument("--delay",type=float,default=1.0)
    p.add_argument("--out",required=True)
    a=p.parse_args()
    if not 1<=a.max_products<=80 or a.delay<1.0:p.error("Invalid limits")
    collections={}
    for col in a.collection:
        path,sep,kind=col.rpartition(":")
        if not sep or not path.startswith("/") or kind not in ("vinyl","silicone"):p.error("Invalid approved collection")
        collections[path.rstrip("/") or "/"]=kind
    source=json.loads(Path(a.input).read_text(encoding="utf8"))
    result=scan(source,collections,a.max_products,a.delay)
    out=Path(a.out);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
    print("Wix Stores: links=",result["product_pages_found"],"parsed=",result["products_parsed"],
          "source-photo-matched=",result["source_photo_matched"],"errors=",len(result["errors"]))
    for error in result["errors"][:6]:print("WARN",error)
if __name__=="__main__":main()
