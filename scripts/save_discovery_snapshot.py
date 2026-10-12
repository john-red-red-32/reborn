#!/usr/bin/env python3
"""Prepare a safe, versioned JSON snapshot for the separate scrape-results branch."""
import argparse
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--input-dir",required=True)
    ap.add_argument("--output-dir",required=True)
    ap.add_argument("--url",required=True)
    ap.add_argument("--run-id",required=True)
    a=ap.parse_args()
    host=(urlsplit(a.url).hostname or "unknown").lower()
    slug=re.sub(r"[^a-z0-9.-]+","-",host).strip(".-")[:90]
    if not re.fullmatch(r"[0-9]+",a.run_id): raise SystemExit("Invalid GitHub run ID")
    base=Path(a.input_dir)
    files=["source-discovery.json","extraction-candidates.json","wix-gallery-evidence.json","wix-archive-reconciliation.json","artist-identity-matches.json"]
    for name in files:
        source=base/name
        if not source.is_file(): raise SystemExit(f"Missing report {name}")
        json.loads(source.read_text(encoding="utf-8"))
        if source.stat().st_size>3_000_000: raise SystemExit("Report too large for GitHub archival")
    root=Path(a.output_dir)/slug
    version=root/"runs"/a.run_id
    version.mkdir(parents=True,exist_ok=True)
    for name in files:
        shutil.copyfile(base/name,version/name)
        shutil.copyfile(base/name,root/("latest-"+name))
    (root/"latest-run.json").write_text(json.dumps({"github_run_id":a.run_id,"source":a.url,"paths":[f"runs/{a.run_id}/{name}" for name in files]},indent=2),encoding="utf-8")
    print(f"Snapshot ready: snapshots/{slug}/runs/{a.run_id}/")
if __name__=="__main__":main()
