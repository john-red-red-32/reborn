#!/usr/bin/env python3
"""Artist-scoped identity matching for extracted public sculpt catalogues.

All records remain source assertions. Only exact names or explicitly approved
aliases can resolve automatically to an accepted sculpt identity.
"""
import argparse
import difflib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit


def normalise(value):
    return re.sub(r"[^a-z0-9]+", "", str(value).casefold())


def match_candidates(artist_id, source_names, accepted_names, approved_aliases=None):
    approved_aliases = approved_aliases or {}
    canonical = {}
    for name in accepted_names:
        token = normalise(name)
        if token in canonical and canonical[token] != name:
            raise ValueError(f"Ambiguous normalised name for artist {artist_id}")
        canonical[token] = name
    aliases = {}
    for alias, target in approved_aliases.items():
        token, target_token = normalise(alias), normalise(target)
        if target_token not in canonical:
            raise ValueError(f"Alias '{alias}' points to unknown canonical sculpt")
        if token in canonical and canonical[token] != canonical[target_token]:
            raise ValueError(f"Alias '{alias}' conflicts with canonical name")
        if token in aliases and aliases[token] != canonical[target_token]:
            raise ValueError(f"Ambiguous alias '{alias}'")
        aliases[token] = canonical[target_token]
    matches, review, duplicate_names = [], [], set()
    seen = set()
    for name in source_names:
        token = normalise(name)
        if not token or token in seen:
            duplicate_names.add(name)
            continue
        seen.add(token)
        if token in canonical:
            matches.append({"source_name": name, "canonical_name": canonical[token], "method": "exact"})
        elif token in aliases:
            matches.append({"source_name": name, "canonical_name": aliases[token], "method": "approved_alias"})
        else:
            near = difflib.get_close_matches(token, list(canonical), n=3, cutoff=0.74)
            review.append({"source_name": name, "suggestions": [canonical[t] for t in near],
                           "state": "manual_review_required"})
    matched_ids = {normalise(row["canonical_name"]) for row in matches}
    missing = [name for name in accepted_names if normalise(name) not in matched_ids]
    return {"artist_id": artist_id, "exact_and_approved_matches": matches,
            "requires_review": review, "not_seen_in_source": missing,
            "duplicate_source_names": sorted(duplicate_names),
            "note": "Never assume an unobserved accepted sculpt has been removed or sold out."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gallery", required=True, help="Wix gallery evidence JSON file")
    parser.add_argument("--manifest", help="Specific reviewed artist source manifest")
    parser.add_argument("--manifest-dir", default="config/artist-sources", help="Registered artist manifests")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    gallery = json.loads(Path(args.gallery).read_text(encoding="utf-8"))
    host = (urlsplit(gallery.get("source", "")).hostname or "").lower()
    paths = [Path(args.manifest)] if args.manifest else sorted(Path(args.manifest_dir).glob("*.json"))
    matching = [m for path in paths if host in {h.lower() for h in (m := json.loads(path.read_text(encoding="utf-8")))["allowed_hosts"]}]
    if len(matching) > 1:
        raise SystemExit("Multiple artist manifests claim this host")
    if matching:
        manifest = matching[0]
        output = match_candidates(manifest["artist_id"],
            [c["title"] for c in gallery.get("kit_candidates", [])],
            manifest["accepted_names"], manifest.get("approved_aliases"))
        output["manifest_version"] = manifest.get("version", 1)
    else:
        output = {"status": "source_unregistered", "source": gallery.get("source"),
                  "warning": "No registered artist manifest for host; no identity matches inferred."}
    output.update({"source": gallery.get("source"), "source_scan_at": gallery.get("source_scan_at")})
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Artist identity: {output.get('artist_id', 'unregistered')}, matched={len(output.get('exact_and_approved_matches', []))}, review={len(output.get('requires_review', []))}")

if __name__ == "__main__":
    main()
