#!/usr/bin/env python3
"""Reconcile Wix gallery evidence against Cassie's existing editorial archive.

A mismatch or photo-filename resemblance never changes an accepted sculpt identity.
"""
import argparse
import difflib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

VERSION="wix-archive-reconciliation-v1"

def key(v):
    return re.sub(r"[^a-z0-9]+","",v.casefold())

def load_archive(path):
    text=Path(path).read_text(encoding="utf-8")
    match=re.search(r"export\s+const\s+cassieArchive\s*=\s*\[([\s\S]*?)\]\s*as\s+const",text)
    if not match:
        raise ValueError("Cassie editorial archive could not be parsed")
    return re.findall(r'"([^"]+)"',match.group(1))

def reconcile(gallery,archive):
    cards=gallery.get("kit_candidates",[])
    originals={key(name):name for name in archive}
    aliases=[]
    matching={}
    unmatched=[]
    for card in cards:
        label=card.get("title","").strip()
        normalized=key(label)
        if normalized in originals:
            matching[normalized]=label
            continue
        possibilities=difflib.get_close_matches(normalized,list(originals),n=2,cutoff=0.74)
        aliases.append({"published_gallery_name":label,"possible_editorial_names":[originals[v] for v in possibilities],
            "status":"manual_alias_review_required"})
        unmatched.append(label)
    missing=[name for name in archive if key(name) not in matching]
    clay=[]
    finished=0
    for page in gallery.get("pages",[]):
        for item in page.get("unverified_gallery_photos",[]):
            kind=item.get("record_type")
            if kind=="finished_reborn_doll_gallery_photo":
                finished+=1
                continue
            if kind!="original_clay_gallery_photo":
                continue
            raw=item.get("title","").strip()
            raw=re.sub(r"(?i)\.(jpe?g|png|webp)$","",raw)
            raw=re.sub(r"(?i)\s*sculpt\s*$","",raw)
            raw=re.sub(r"\d+$","",raw).strip()
            normalized=key(raw)
            if not normalized or normalized not in originals:
                continue
            clay.append({"gallery_title":item.get("title"),"possible_sculpt":originals[normalized],
                "image_url":item.get("photo_url"),"source":item.get("source_page"),
                "confidence":"filename_hint_only_review_required"})
    return {
        "version":VERSION,"source":gallery.get("source"),"source_scan_at":gallery.get("source_scan_at"),
        "published_named_kit_cards":len(cards),
        "prior_editorial_archive_names":len(archive),
        "exact_name_matches":len(matching),
        "unmatched_editorial_names":missing,
        "gallery_names_requiring_alias_review":aliases,
        "potential_clay_photo_filename_matches":clay,
        "clay_photo_matches_for_review":len(clay),
        "finished_reborn_photos_excluded":finished,
        "warnings":["Gallery naming and edition labels are dated artist assertions, not proof of current sale or re-release.",
                    "Fuzzy name candidates are NOT automatically merged.",
                    "Clay photo filename matches are not verified sculpt identities.",
                    "Finished reborn doll photos must never be misclassified as blank kit photos.",
                    "No images copied or catalogue records changed."]
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--gallery",required=True)
    ap.add_argument("--archive",required=True)
    ap.add_argument("--out",required=True)
    a=ap.parse_args()
    gallery=json.loads(Path(a.gallery).read_text(encoding="utf-8"))
    host=(urlsplit(gallery.get("source","")).hostname or "").lower()
    if host in ("cassielove.co.uk","www.cassielove.co.uk"):
        report=reconcile(gallery,load_archive(a.archive))
    else:
        report={"version":VERSION,"source":gallery.get("source"),"status":"not_applicable",
                "reason":"Cassie-specific editorial archive reconciliation does not apply to this source."}
    out=Path(a.out);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Reconciliation: {report['published_named_kit_cards']} gallery kits, {report['exact_name_matches']} exact archive matches, {len(report['gallery_names_requiring_alias_review'])} naming reviews, {report['finished_reborn_photos_excluded']} finished-reborn photos excluded")
if __name__=="__main__":main()
