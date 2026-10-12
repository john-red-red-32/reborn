#!/usr/bin/env python3
"""Create reviewable original-sculpt candidates from a Reborna discovery JSON artifact.

Never writes to the public catalogue. No inferred release dates, ownership or inventory.
"""
import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlsplit

VERSION = "candidate-extractor-v1"
STOP = {"home","about","contact","privacy","terms","blog","shop","gallery","sculpts","archive","portfolio","original","reborn","doll","kit","kits","preorder","pre-order"}
def clean(text):
    return re.sub(r"\s+", " ", text or "").strip()

def extract_schema_products(node, result):
    if isinstance(node, list):
        for child in node: extract_schema_products(child, result)
    elif isinstance(node, dict):
        kind = node.get("@type", [])
        kinds = [kind] if isinstance(kind, str) else kind if isinstance(kind, list) else []
        if any(k.lower().split("/")[-1] in ("product", "productgroup") for k in kinds):
            result.append(node)
        for key in ("@graph","mainEntity","hasVariant","itemListElement"):
            if key in node: extract_schema_products(node[key], result)

def derive_candidates(report):
    entries = []
    for page in report.get("pages", []):
        url = page.get("url", "")
        meta = page.get("metadata") or {}
        structured = []
        for obj in page.get("structured_data", []):
            extract_schema_products(obj, structured)
        title = clean(page.get("title", ""))
        for product in structured:
            name = clean(product.get("name", "")) if isinstance(product.get("name"), str) else ""
            if name:
                entries.append({"name":name,"source_url":url,"evidence_type":"structured_product","confidence":"candidate","image_candidates":page.get("image_candidates",[])[:30],"seller_offers_unverified":product.get("offers") is not None})
        if structured:
            continue
        # Metadata-only suggestions are low-confidence; never assume a title is a sculpt.
        social_title = clean(meta.get("og:title") or meta.get("twitter:title") or title)
        path = urlsplit(url).path.lower()
        if not social_title or path in ("","/") or any(x in path for x in ("/about", "/contact", "/privacy", "/terms")):
            continue
        if not (any(token in (social_title+" "+path).lower() for token in ("kit", "sculpt", "doll", "gallery", "product", "portfolio"))):
            continue
        name = re.split(r"\s+[|–—]\s+", social_title)[0].strip()
        if len(name)>100 or len(name)<3 or name.lower() in STOP: continue
        entries.append({"name":name,"source_url":url,"evidence_type":"page_metadata_only","confidence":"low","image_candidates":page.get("image_candidates",[])[:30]})
    grouped = defaultdict(lambda: {"sources":[],"image_candidates":[]})
    for item in entries:
        key=clean(item["name"]).casefold()
        group=grouped[key]
        group["name"]=item["name"]
        group["sources"].append({"url":item["source_url"],"evidence_type":item["evidence_type"],"confidence":item["confidence"]})
        known={x["url"] for x in group["image_candidates"]}
        for image in item["image_candidates"]:
            if image.get("url") not in known:
                group["image_candidates"].append(image)
                known.add(image.get("url"))
    return list(sorted(grouped.values(),key=lambda x:x["name"].casefold()))

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input",required=True)
    p.add_argument("--out",default="artifacts/extraction-candidates.json")
    args=p.parse_args()
    data=json.loads(Path(args.input).read_text(encoding="utf-8"))
    candidates=derive_candidates(data)
    out={"extractor_version":VERSION,"source":data.get("source"),"scan_completed_at":data.get("completed_at"),"scan_complete":data.get("complete",False),
         "pages_succeeded":data.get("pages_succeeded",0),"candidate_count":len(candidates),
         "candidates":candidates,"warnings":["Titles and images are unverified source candidates only.","Do not publish automatically, infer announcement/release year, or copy remote images without appropriate rights."]}
    dest=Path(args.out);dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Extracted {len(candidates)} review candidates -> {dest}")
if __name__=="__main__":main()
