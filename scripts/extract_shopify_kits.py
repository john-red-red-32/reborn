#!/usr/bin/env python3
"""Read-only public Shopify product/variant discovery for original blank sculpt kits.

No authentication, checkout actions, private Shopify APIs, media downloads or
automatic publication. Preserves artist claims and review flags separately.
"""
import argparse
import hashlib
import json
import re
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urljoin
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

VERSION="shopify-original-kit-v1"
AGENT="RebornaDiscovery/0.1 (+https://reborna.co; editorial source research)"
LIMIT_BYTES=4_000_000
MAX_PAGES=3

class TextReader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts=[]
    def handle_data(self,text): self.parts.append(text)

def plaintext(s):
    reader=TextReader()
    reader.feed(s if isinstance(s,str) else "")
    return re.sub(r"\s+"," "," ".join(reader.parts)).strip()

def permitted_json(url, host, robots):
    parsed=urlsplit(url)
    if parsed.scheme!="https" or parsed.hostname!=host or parsed.username or parsed.password or parsed.port:
        raise ValueError("Unsafe cross-origin or non-HTTPS Shopify URL")
    if not robots.can_fetch(AGENT,url):
        raise PermissionError("Disallowed by robots.txt")
    req=Request(url,headers={"User-Agent":AGENT,"Accept":"application/json"})
    with urlopen(req,timeout=18) as res:
        if urlsplit(res.geturl()).hostname!=host: raise ValueError("Cross-host redirect refused")
        raw=res.read(LIMIT_BYTES+1)
        if len(raw)>LIMIT_BYTES: raise ValueError("JSON too large")
        return json.loads(raw),hashlib.sha256(raw).hexdigest()

def classification(product):
    title=str(product.get("title") or "")
    body=plaintext(product.get("body_html") or product.get("description") or "")
    tags=product.get("tags") or []
    if isinstance(tags,str):tags=[x.strip() for x in tags.split(",")]
    words=" ".join([title,body,str(product.get("product_type") or "")," ".join(str(x) for x in tags)]).lower()
    head=title.lower()
    if re.search(r"\b(prototype|completed reborn|complete(d)? baby|reborn baby|ready[- ]to[- ]adopt|one.of.a.kind)\b",head):
        return "finished_doll_excluded", "title_explicit_finished_doll"
    if re.search(r"\b(gift card|tutorials?|online course|training|painting class|rooting class|(?:advanced|intermediate|beginners?)\s+rooting)\b",head):
        return "non_kit_excluded", "title_non_kit"
    if re.search(r"\b(belly plate|body only|vinyl head only)\b",head):
        return "component_excluded", "standalone_component"
    if re.search(r"\b(sculpted by|sculptor:)\s+(?!nikki\s+johnston)",words):
        return "needs_review", "third_party_sculptor_mentioned"
    if re.search(r"\b(blank\s+(vinyl\s+)?(doll\s+)?kit|buying the\s+blank|vinyl doll kit|reborn doll kit|sculptor:\s*nikki\s+johnston)\b",words):
        return "original_kit_candidate", "seller_explicit_blank_kit"
    return "needs_review", "insufficient_explicit_kit_evidence"

def kit_facts(body):
    def get(pattern):
        m=re.search(pattern,body,re.I)
        return m.group(1).strip(" .;") if m else None
    return {
      "published_kit_length": get(r"(?:kit\s+length|kit\s+size)\s*:\s*([^.;]{1,75})"),
      "published_head_circumference": get(r"head\s+circumference\s*:\s*([^.;]{1,55})"),
      "edition_size": int(m.group(1)) if (m:=re.search(r"edition\s+si(?:z|t)e\s*:\s*([\d,]+)",body,re.I)) else None,
      "cloth_body":get(r"(?:custom\s+)?cloth\s+body\s*:\s*([^.;]{1,65})"),
      "coa":get(r"\bCOA\s*:\s*([^.;]{1,50})"),
      "manufacturer":get(r"\bvinyl\s*:\s*([^.;]{1,45})"),
      "belly_plate_offered":bool(re.search(r"belly\s+plate\s*:\s*(?:optional|available)",body,re.I)),
    }

def money(value):
    """Shopify Product REST JSON uses decimal GBP strings; Ajax .js uses integer pence."""
    if value is None or isinstance(value,bool):return None
    try:
        if isinstance(value,str):
            clean=value.replace(",","").strip()
            return round(float(clean),2) if "." in clean else round(int(clean)/100,2)
        if isinstance(value,int):
            return round(value/100,2)
        return round(float(value),2)
    except (TypeError,ValueError,OverflowError):
        return None

def option_map(product,variant):
    options=product.get("options") or []
    values={}
    for index,option in enumerate(options,1):
        name=option if isinstance(option,str) else option.get("name",f"Option {index}")
        value=variant.get(f"option{index}")
        if value not in (None,"Default Title"):values[str(name)]=str(value)
    if not values and variant.get("title") not in (None,"Default Title"):
        values["Configuration"]=str(variant["title"])
    return values

def sculpt_name_candidate(title,body):
    # The artist's explicit 'Kit Spec Name' is stronger than an SEO listing title.
    match=re.search(r"\bName\s*:\s*(.*?)\s*(?=(?:Sculptor|Kit length|Kit size|Limb length|Head circumference|Cloth Body|COA|Vinyl|Edition size)\s*:|$)",body,re.I)
    if match and len(match.group(1).strip())<95:
        raw=match.group(1).strip(" .;-")
        raw=re.split(r"(?i)\s+find\s+(?:his|her|their)\s+twin\b",raw)[0].strip(" .;-")
        raw=re.sub(r"(?i),?\s+by\s+nikki\s+johnston\b.*$","",raw).strip(" .;-")
        return raw,"artist_kit_spec"
    cleaned=re.sub(r"(?i)^\s*new\s*[-–:]\s*","",title)
    cleaned=re.sub(r"(?i)\s*(?:[-–( ]+)?(?:pre[ -]?order|in stock|sold out)\s*\)?\s*$","",cleaned).strip(" -–()")
    return cleaned,"retailer_title_review"

def parse_product(product,origin,sha,observed):
    title=str(product.get("title") or "").strip()
    body=plaintext(product.get("body_html") or "")
    kind,reason=classification(product)
    sculpt_name,name_method=sculpt_name_candidate(title,body)
    handle=product.get("handle") or ""
    url=urljoin(origin,f"/products/{handle}")
    variants=[]
    for v in product.get("variants") or []:
        opts=option_map(product,v)
        joined=" ".join(opts.values()).lower()
        if re.search(r"\bno\s+kit\b|\b(?:belly|tummy)\s+plate\s+only\b",joined):
            price_kind="accessory_only"
        elif re.search(r"\bboth\b.*\b(?:awake|asleep|kits?)\b",joined):
            price_kind="multi_kit_bundle"
        elif re.search(r"\bdeposit(?:\s+only)?\b",joined) and not re.search(r"full\s+pay",joined):
            price_kind="deposit_only"
        else:
            price_kind="full_purchase"
        variants.append({
            "shopify_variant_id":str(v.get("id") or ""),"seller_sku":v.get("sku") or None,
            "label":v.get("public_title") or v.get("title") or "Standard",
            "option_values":opts,"price_native":money(v.get("price")),
            "compare_at_price_native":money(v.get("compare_at_price")),
            "price_kind":price_kind,"availability_flag":v.get("available"),
            "image_id":str(v.get("featured_image",{}).get("id")) if isinstance(v.get("featured_image"),dict) and v["featured_image"].get("id") else None,
            "source_product_url":url
        })
    full_prices=sorted(set(v["price_native"] for v in variants if v["price_kind"]=="full_purchase" and v["price_native"] is not None))
    images=[]
    for item in product.get("images") or []:
        if isinstance(item,str): images.append({"url":item,"role":"unreviewed_kit_or_prototype","rights":"not_granted"})
        elif isinstance(item,dict) and item.get("src"):images.append({"url":item["src"],"id":str(item.get("id") or ""),"alt":item.get("alt") or "",
            "variant_ids":[str(k) for k in item.get("variant_ids") or []],"role":"unreviewed_kit_or_prototype","rights":"not_granted"})
    if not images:
        for src in product.get("images") or []:
            if isinstance(src,str): images.append({"url":src,"role":"unreviewed_kit_or_prototype","rights":"not_granted"})
    statement=(title+" "+body).lower()
    lifecycle="preorder_advertised" if re.search(r"\bpre[ -]?orders?\b",title.lower()) else (
        "sold_out_advertised" if re.search(r"\bsold\s*out\b",title.lower()) else "not_confirmed")
    return {
        "shopify_product_id":str(product.get("id") or ""),"handle":handle,"source_url":url,"source_scan_at":observed,
        "source_sha256":sha,"name":title,"sculpt_name_candidate":sculpt_name,"sculpt_name_basis":name_method,"source_product_type":product.get("product_type") or "",
        "classification":kind,"classification_basis":reason,
        "description":body[:9000],"published_kit_facts":kit_facts(body),
        "currency":"GBP", # pilot store in GBP; confirm against storefront before live price publication
        "variants":variants,"variant_total":len(variants),
        "distinct_full_prices":full_prices,
        "from_price_native":full_prices[0] if len(full_prices)>1 else None,
        "has_genuine_full_price_range":len(full_prices)>1,
        "seller_availability_flags":[v["availability_flag"] for v in variants],
        "lifecycle_evidence":lifecycle,"images":images[:40],
        "published_at":product.get("published_at"),"created_at":product.get("created_at"),
        "review_status":"unreviewed","rights_status":"not_authorized_for_mirroring",
        "notes":["Deposit is never a full item price.","Prototype photographs do not automatically represent blank kits."]
    }

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input",required=True)
    ap.add_argument("--out",default="artifacts/shopify-kit-candidates.json")
    ap.add_argument("--max-products",type=int,default=85)
    ap.add_argument("--delay",type=float,default=1.0)
    args=ap.parse_args()
    if not 1<=args.max_products<=150 or args.delay<1:ap.error("Out of bounds")
    source=json.loads(Path(args.input).read_text(encoding="utf-8"))
    origin=source.get("source","")
    host=urlsplit(origin).hostname
    observed=datetime.now(timezone.utc).isoformat()
    counts=source.get("platforms") or {}
    result={"adapter":VERSION,"source":origin,"observed_at":observed,"platform_detected":counts,
        "products":[],"errors":[],"coverage":"partial","source_kind":"public_shopify_product_json"}
    if counts.get("shopify",0)<1:
        result["status"]="not_applicable"
    else:
        robots=RobotFileParser()
        robots.set_url(urljoin(origin,"/robots.txt"))
        robots.read()
        products={}
        # Public Shopify collections, never private/admin routes or customer data.
        for page in range(1,MAX_PAGES+1):
            endpoint=urljoin(origin,f"/products.json?limit=100&page={page}")
            try:
                payload,sha=permitted_json(endpoint,host,robots)
                entries=payload.get("products",[]) if isinstance(payload,dict) else []
                if not isinstance(entries,list):raise ValueError("Unexpected product index format")
                for product in entries:
                    if isinstance(product,dict) and product.get("handle"):
                        products[product["handle"]]=(product,sha)
                if not entries or len(entries)<100:break
            except (HTTPError,URLError,ValueError,PermissionError,TimeoutError) as exc:
                result["errors"].append({"url":endpoint,"error":type(exc).__name__,"detail":str(exc)[:170]})
                break
            time.sleep(args.delay)
        # If public index is unavailable, fetch standard public product JSON for links seen in crawl.
        if not products:
            handles=set()
            for p in source.get("pages",[]):
                for link in [p.get("url",""),*(p.get("links") or [])]:
                    parts=urlsplit(link)
                    m=re.search(r"^/products/([a-z0-9-]+)",parts.path,re.I)
                    if parts.hostname==host and m:handles.add(m.group(1))
            for handle in sorted(handles)[:args.max_products]:
                endpoint=urljoin(origin,f"/products/{handle}.js")
                try:
                    product,sha=permitted_json(endpoint,host,robots)
                    if isinstance(product,dict) and product.get("handle"):
                        products[product["handle"]]=(product,sha)
                except (HTTPError,URLError,ValueError,PermissionError,TimeoutError) as exc:
                    result["errors"].append({"url":endpoint,"error":type(exc).__name__,"detail":str(exc)[:150]})
                time.sleep(args.delay)
        for product,sha in list(products.values())[:args.max_products]:
            result["products"].append(parse_product(product,origin,sha,observed))
        result["status"]="scanned"
        result["products_seen"]=len(products)
        result["original_kit_candidates"]=sum(x["classification"]=="original_kit_candidate" for x in result["products"])
        result["finished_dolls_excluded"]=sum(x["classification"]=="finished_doll_excluded" for x in result["products"])
        result["component_or_non_kit_excluded"]=sum(x["classification"] in ("component_excluded","non_kit_excluded") for x in result["products"])
        result["uncertain_products"]=sum(x["classification"]=="needs_review" for x in result["products"])
        result["coverage"]="partial" if result["errors"] or len(products)>args.max_products else "index_enumerated"
        if not products:result["coverage"]="unavailable"
    dest=Path(args.out);dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding="utf-8")
    print(f"Shopify: {result['status']} | kits={result.get('original_kit_candidates',0)} | finished excluded={result.get('finished_dolls_excluded',0)} | review={result.get('uncertain_products',0)} | errors={len(result['errors'])}")
if __name__=="__main__":main()
