#!/usr/bin/env python3
"""Create reviewed-scope, source-grounded Wix image candidates for a sculptor.

Only exact artist-scoped named Masonry gallery cards are auto-linked.
Never infer that a finished reborn gallery or filename hint identifies a kit.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

def key(s):
    return re.sub(r"[^a-z0-9]+", "", s.casefold())

def extract(gallery, archive, host="www.cassielove.co.uk"):
    names={}
    for name in archive:
        k=key(name)
        if k in names:
            raise ValueError("Archive contains ambiguous normalized artist identities")
        names[k]=name
    source=(urlsplit(gallery.get("source","")).hostname or "").lower()
    if source!=host:
        raise ValueError(f"Unexpected source host: {source}")
    entries={}
    held=[]
    assets=set()
    for card in gallery.get("kit_candidates",[]):
        name=card.get("title","").strip()
        asset=card.get("original_asset_url") or card.get("photo_url","").split("/v1/")[0]
        page=card.get("source_page","")
        parsed=urlsplit(asset)
        if parsed.scheme!="https" or parsed.hostname!="static.wixstatic.com" or not re.fullmatch(r"/media/[a-zA-Z0-9_.~%-]+",parsed.path) or parsed.query or parsed.fragment:
            held.append({"name":name,"reason":"image URL outside known source media path"});continue
        if page!="https://www.cassielove.co.uk/vinyl-doll-kits":
            held.append({"name":name,"reason":"not original vinyl-kit gallery"});continue
        k=key(name)
        if k not in names:
            held.append({"name":name,"reason":"name requires identity/alias review"});continue
        if k in entries or asset in assets:
            held.append({"name":name,"reason":"duplicate name or photo asset"});continue
        assets.add(asset)
        entries[k]={"sculpt":names[k],"source_name":name,"image_url":asset,
                    "source_page":page,"image_role":"artist_vinyl_gallery_example",
                    "wix_asset_id":card.get("wix_asset_id"),"review_status":"exact_identity_source_observed",
                    "source_checked_at":gallery.get("source_scan_at"),
                    "credit":"Cassie Ann Love — original sculpt gallery"}
    return {"version":"artist-image-evidence-v1","source":gallery.get("source"),"observed_at":gallery.get("source_scan_at"),
            "exact_source_images":len(entries),"linked_images":sorted(entries.values(),key=lambda x:x["sculpt"].lower()),
            "pending_identity_or_source_review":held,
            "not_in_named_vinyl_gallery":[n for n in archive if key(n) not in entries],
            "notice":"No clay filename guesses, finished reborn gallery photos, fuzzy identity merges, or mirrored media."}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--gallery",required=True)
    p.add_argument("--archive",required=True)
    p.add_argument("--out",required=True)
    args=p.parse_args()
    text=Path(args.archive).read_text(encoding="utf8")
    match=re.search(r"export\s+const\s+cassieArchive\s*=\s*\[([\s\S]*?)\]\s*as\s+const",text)
    if not match:raise ValueError("Cannot find accepted Cassie archive names")
    archive=re.findall(r'"([^"]+)"',match.group(1))
    gallery=json.loads(Path(args.gallery).read_text(encoding="utf8"))
    result=extract(gallery,archive)
    out=Path(args.out);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding="utf8")
    print(f"Wix images: {result['exact_source_images']} safely name-linked assets, {len(result['pending_identity_or_source_review'])} for manual review")
if __name__=="__main__":main()
