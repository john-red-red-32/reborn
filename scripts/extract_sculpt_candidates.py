#!/usr/bin/env python3
"""Reborna product extractor: evidence-only candidates from discovery JSON, not public catalogue writes."""
import argparse
import json
import re
from pathlib import Path

VERSION = "candidate-extractor-v3-preorder-evidence"
def txt(v):
    return re.sub(r"\s+"," ", v if isinstance(v,str) else "").strip()
def products(node):
    if isinstance(node,list):
        for x in node: yield from products(x)
    elif isinstance(node,dict):
        types=node.get("@type",[])
        types=types if isinstance(types,list) else [types]
        if any(isinstance(t,str) and t.lower().split("/")[-1] in ("product","productgroup") for t in types):
            yield node
        for k in ("@graph","mainEntity","hasVariant","itemListElement"):
            if k in node: yield from products(node[k])
def image_urls(items):
    for x in items if isinstance(items,list) else [items]:
        if isinstance(x,str) and x.startswith("https://"): yield {"url":x}
        elif isinstance(x,dict):
            u=x.get("contentUrl") or x.get("url")
            if isinstance(u,str) and u.startswith("https://"):
                yield {"url":u,"width":x.get("width"),"height":x.get("height")}
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input",required=True)
    p.add_argument("--out",default="artifacts/extraction-candidates.json")
    args=p.parse_args()
    report=json.loads(Path(args.input).read_text(encoding="utf-8"))
    candidates=[]
    for page in report.get("pages",[]):
        for product in products(page.get("structured_data",[])):
            name=txt(product.get("name"))
            if not name: continue
            images=list(image_urls(product.get("image",[])))
            seen=set(); dedup=[]
            for image in images:
                # Wix size-specific image URLs share the same intrinsic asset ID.
                key=re.search(r"/media/([^/]+)",image["url"])
                identifier=key.group(1) if key else image["url"].split("?")[0]
                if identifier not in seen:
                    seen.add(identifier);dedup.append(image)
            offer=product.get("offers")
            offers=offer if isinstance(offer,list) else [offer] if isinstance(offer,dict) else []
            prices=[{"price":o.get("price"),"priceCurrency":o.get("priceCurrency"),"availability":o.get("availability"),"url":o.get("url")} for o in offers if isinstance(o,dict)]
            # Explicit seller preorder wording overrides generic schema InStock, which can enable checkout.
            description=txt(product.get("description"))
            statement=" ".join([name,description]).lower()
            preorder=bool(re.search(r"\\bpre[ -]?order(?:s|ing|ed)?\\b",statement))
            lifecycle="preorder_advertised" if preorder else "not_confirmed"
            # Use seller-authored structured data only. Never infer kit variations from different offers.
            candidates.append({"name":name,"source_url":page["url"],"evidence_type":"structured_product",
             "confidence":"structured_unreviewed","description":description[:3000],"lifecycle_evidence":lifecycle,
             "images":dedup[:25],"image_count":len(dedup),
             "advertised_offers":prices,"variant_options":[],"review_state":"pending"})
    output={"extractor_version":VERSION,"source":report.get("source"),
      "scan_completed_at":report.get("completed_at"),"scan_complete":report.get("complete",False),
      "pages_succeeded":report.get("pages_succeeded",0),"candidate_count":len(candidates),
      "candidates":candidates,
      "warnings":["A crawl can be complete for visible HTML links without covering JavaScript galleries or historical kits.",
                  "Product data are seller claims pending validation; no automatic publication.",
                  "Images are references, not licensed replicas; no download occurs."]}
    out=Path(args.out);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(output,indent=2,ensure_ascii=False),encoding="utf-8")
    print(f"Extracted {len(candidates)} structured product candidates -> {out}")
if __name__=="__main__": main()
