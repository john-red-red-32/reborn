#!/usr/bin/env python3
"""Audit exported Reborna image discovery without copying or modifying source images.

Usage: python3 scripts/audit-image-discovery.py out [--probe]
--probe checks at most one remote source image per hostname. Remote HTTP
failures are warnings, not proof of broken files (publishers may block bots).
"""
from __future__ import annotations

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, unquote
from urllib.request import Request, urlopen
import json
import os
import xml.etree.ElementTree as ET

SITEMAP_NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "image": "http://www.google.com/schemas/sitemap-image/1.1"}


class HTMLImages(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls: set[str] = set()

    def handle_starttag(self, tag, attrs):
        if tag != "img":
            return
        values = dict(attrs)
        if values.get("src"):
            self.urls.add(values["src"])
        if values.get("srcset"):
            for part in values["srcset"].split(","):
                candidate = part.strip().split(" ")[0]
                if candidate:
                    self.urls.add(candidate)


def html_path(out: Path, url: str) -> Path:
    parsed = urlsplit(url)
    return out / unquote(parsed.path).lstrip("/") / "index.html" if parsed.path != "/" else out / "index.html"


def probe_remote(item: tuple[str, str]) -> dict:
    hostname, url = item
    try:
        request = Request(url, headers={"User-Agent": "RebornaSourceImageAudit/1.0 (+https://reborna.co/)"}, method="HEAD")
        try:
            with urlopen(request, timeout=8) as response:
                return {"host": hostname, "status": response.status, "content_type": response.headers.get("Content-Type", ""), "classification": "accessible"}
        except HTTPError as exc:
            if exc.code not in (403, 405):
                raise
        request = Request(url, headers={"User-Agent": "RebornaSourceImageAudit/1.0 (+https://reborna.co/)", "Range": "bytes=0-0"})
        with urlopen(request, timeout=8) as response:
            return {"host": hostname, "status": response.status, "content_type": response.headers.get("Content-Type", ""), "classification": "accessible"}
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        return {"host": hostname, "classification": "needs_browser_review", "detail": str(exc)[:160]}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("out", type=Path)
    parser.add_argument("--probe", action="store_true")
    args = parser.parse_args()
    sitemap = args.out / "sitemap.xml"
    assert sitemap.is_file(), f"Missing generated sitemap: {sitemap}"
    root = ET.parse(sitemap).getroot()
    pages = root.findall("s:url", SITEMAP_NS)
    image_total = 0
    pages_with_images = 0
    match_count = 0
    unmatched = []
    samples_by_host: dict[str, str] = {}
    invalid = []
    duplicate = []
    host_counts = Counter()

    for entry in pages:
        page = entry.findtext("s:loc", namespaces=SITEMAP_NS) or ""
        image_urls = [el.text or "" for el in entry.findall("image:image/image:loc", SITEMAP_NS)]
        if not image_urls:
            continue
        pages_with_images += 1
        image_total += len(image_urls)
        if len(image_urls) != len(set(image_urls)):
            duplicate.append(page)
        markup = HTMLImages()
        file = html_path(args.out, page)
        if file.is_file():
            markup.feed(file.read_text(encoding="utf-8"))
        for image in image_urls:
            parsed = urlsplit(image)
            if parsed.scheme not in ("https", "http") or not parsed.hostname or any(ch.isspace() for ch in image):
                invalid.append({"page": page, "image": image})
                continue
            host_counts[parsed.hostname] += 1
            samples_by_host.setdefault(parsed.hostname, image)
            # Google should be able to discover a visible <img src>, not only
            # a sitemap entry. A mismatch is a review flag, not a content claim.
            if image in markup.urls:
                match_count += 1
            elif len(unmatched) < 20:
                unmatched.append({"page": page, "image": image, "html_found": file.is_file()})

    probes = []
    if args.probe:
        samples = list(sorted(samples_by_host.items()))[:12]
        with ThreadPoolExecutor(max_workers=4) as pool:
            probes = list(pool.map(probe_remote, samples))

    report = {
        "sitemap_pages": len(pages), "image_entries": image_total,
        "pages_with_images": pages_with_images, "visible_html_image_matches": match_count,
        "missing_from_visible_html_examples": unmatched, "duplicate_image_pages": duplicate[:15],
        "invalid_urls": invalid[:15], "image_host_counts": dict(host_counts.most_common()),
        "remote_host_probes": probes,
        "note": "Third-party image rights, Google indexing and live visual loading are not established by this audit."
    }
    print(json.dumps(report, indent=2))
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        lines = [
            "## Reborna image discovery audit",
            f"- Sitemap URLs: **{len(pages)}**",
            f"- Listed image URLs: **{image_total}** across **{pages_with_images}** landing pages",
            f"- Matched to static HTML image sources: **{match_count}/{image_total}**",
            f"- Image URL hosts: **{len(host_counts)}**",
            f"- Duplicate image pages flagged: **{len(duplicate)}**",
            f"- Invalid image URLs: **{len(invalid)}**",
            "- Remote source probe failures are non-blocking: some publishers block automated clients.",
        ]
        if unmatched:
            lines.append("- Some sitemap images weren't found in static <img> markup; review audit output for examples.")
        for result in probes:
            lines.append(f"  - `{result['host']}`: {result['classification']} {result.get('status', result.get('detail',''))}")
        with open(summary, "a", encoding="utf-8") as handle:
            handle.write("\n".join(lines) + "\n")
    # Only structurally invalid URLs should fail CI. Third-party responses and
    # gallery markup differences require review, never automatic image removal.
    if invalid:
        raise SystemExit(f"Invalid sitemap image URLs: {len(invalid)}")


if __name__ == "__main__":
    main()
