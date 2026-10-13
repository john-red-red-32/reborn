#!/usr/bin/env python3
"""Conservative original Wix image-alt kit evidence from public HTML crawl.

Handles artist-owned collection pages with named image alt attributes, unlike
Cassie's iframe Masonry layout. This is evidence only, not publication.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

IMAGE_ROOT = "https://static.wixstatic.com/media/"
STATUS = re.compile(r"\s*[-–—]\s*(Available Now|Sold Out|Pre-Order(?: Open)?|Coming Soon)\s*$", re.I)
NAME = re.compile(r"^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 '&.,()/+-]{1,95}$")
ARTIFACT = re.compile(r"^https://static\.wixstatic\.com/media/[^/?#]+", re.I)

def extract(discovery, collection_paths):
    expected_host = (urlsplit(discovery.get("source","")).hostname or "").lower()
    records=[]
    seen=set()
    pages_checked=[]
    for page in discovery.get("pages",[]):
        url=page.get("url","")
        parsed=urlsplit(url)
        if parsed.scheme!="https" or (parsed.hostname or "").lower()!=expected_host:
            continue
        material=collection_paths.get(parsed.path.rstrip("/") or "/")
        if not material:
            continue
        pages_checked.append(url)
        for image in page.get("image_candidates",[]):
            alt=str(image.get("alt") or "").strip()
            raw=image.get("url") or ""
            found=ARTIFACT.match(raw)
            if not alt or not found:
                continue
            match=STATUS.search(alt)
            status=match.group(1).lower() if match else None
            name=STATUS.sub("",alt).strip() if match else alt
            if not NAME.fullmatch(name):
                continue
            photo=found.group(0)
            key=(url,name.casefold(),photo)
            if key in seen:
                continue
            seen.add(key)
            records.append({
                "title":name,"material":material,"source_page":url,
                "original_asset_url":photo,"image_alt":alt,
                "source_status_claim":status,
                "sculpt_identity":"source_named_requires_review",
                "multiple_designs_possible":bool(re.search(r"\s+and\s+|/",name,re.I)),
                "image_rights":"artist_hosted_reference_only",
                "evidence":"Named image alt on the artist's dedicated kit collection page",
                "review_status":"unreviewed"
            })
    return {
        "adapter":"wix-named-image-alt-v1",
        "source":discovery.get("source"),
        "source_scan_at":discovery.get("completed_at"),
        "pages_checked":pages_checked,
        "kit_candidates":records,
        "kit_cards_found":len(records),
        "notice":"Only artist-page named image evidence. Source stock labels are historical claims; no product identity, stock or usage rights automatically confirmed."
    }

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input",required=True)
    p.add_argument("--collection",action="append",required=True,help="Approved path:material, e.g. /doll-kits:vinyl")
    p.add_argument("--out",required=True)
    a=p.parse_args()
    paths={}
    for value in a.collection:
        path,sep,material=value.rpartition(":")
        if not sep or not path.startswith("/") or material not in ("vinyl","silicone") or "?" in path or "#" in path:
            p.error("Each collection must be an absolute path:vinyl or path:silicone")
        paths[path.rstrip("/") or "/"]=material
    source=json.loads(Path(a.input).read_text(encoding="utf-8"))
    output=extract(source,paths)
    target=Path(a.out)
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding="utf-8")
    print("Named Wix artist collection images:",output["kit_cards_found"],"from",len(output["pages_checked"]),"dedicated collection pages")
if __name__=="__main__":main()
