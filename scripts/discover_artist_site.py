#!/usr/bin/env python3
"""Reborna source discovery v1: read-only, source-attributed, manual URL pilot.

Does not publish listings, store third-party images, or assign release years.
"""
import argparse
import hashlib
import json
import re
import time
from collections import deque
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urldefrag
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
from site_platforms import detect_platform, sitemap_urls

AGENT = "RebornaDiscovery/0.1 (+https://reborna.co; editorial source research)"
MAX_BYTES = 2_000_000
PARSER_VERSION = "url-discovery-v2-platform-sitemaps"

class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.images, self.titles, self.meta, self.jsonld = [], [], [], {}, []
        self._title = False
        self._script = False
        self._buffer = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "img":
            src = a.get("data-src") or a.get("src")
            if src: self.images.append({"src": src, "alt": a.get("alt", ""), "srcset": a.get("srcset", "")})
        if tag == "meta":
            key = a.get("property") or a.get("name")
            if key and a.get("content"): self.meta[key] = a["content"][:1200]
        if tag == "title": self._title = True
        if tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._script = True
            self._buffer = []
    def handle_endtag(self, tag):
        if tag == "title": self._title = False
        if tag == "script" and self._script:
            try: self.jsonld.append(json.loads("".join(self._buffer)))
            except (ValueError, TypeError): pass
            self._script = False
    def handle_data(self, data):
        if self._title: self.titles.append(data)
        if self._script: self._buffer.append(data)

def clean_url(raw, parent):
    try:
        value = urldefrag(urljoin(parent, raw))[0]
        s = urlsplit(value)
        if s.scheme not in ("https", "http") or not s.hostname or s.username or s.password: return None
        if s.port and s.port not in (80, 443): return None
        return value
    except ValueError:
        return None

def crawl(start_url, max_pages, pause):
    host = urlsplit(start_url).hostname
    robots = RobotFileParser()
    robots.set_url(urljoin(start_url, "/robots.txt"))
    try: robots.read()
    except Exception: raise SystemExit("Robots policy unavailable: aborting safely")
    if not robots.can_fetch(AGENT, start_url):
        raise SystemExit("robots.txt does not permit this starting page")
    sitemap = sitemap_urls(start_url, AGENT, robots, max_urls=160)
    queue, seen, pages = deque([start_url, *sitemap]), set(), []
    platform_counts = {}
    errors = []
    while queue and len(pages) < max_pages:
        url = queue.popleft()
        if url in seen: continue
        seen.add(url)
        if not robots.can_fetch(AGENT, url):
            errors.append({"url": url, "reason": "robots_disallowed"})
            continue
        try:
            req = Request(url, headers={"User-Agent": AGENT, "Accept": "text/html"})
            with urlopen(req, timeout=15) as res:
                mime = res.headers.get("Content-Type", "").lower()
                if "text/html" not in mime: continue
                data = res.read(MAX_BYTES + 1)
                if len(data) > MAX_BYTES: raise ValueError("HTML exceeded size cap")
                effective = res.geturl()
                if urlsplit(effective).hostname != host: raise ValueError("redirected off permitted host")
                charset = res.headers.get_content_charset() or "utf-8"
                html = data.decode(charset, errors="replace")
                ex = Extract()
                ex.feed(html)
                platform = detect_platform(html, ex.meta)
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
                links = [clean_url(v, effective) for v in ex.links]
                links = sorted(set(x for x in links if x and urlsplit(x).hostname == host))
                images = []
                img_seen = set()
                for item in ex.images:
                    src = clean_url(item["src"], effective)
                    if src and src not in img_seen:
                        images.append({"url": src, "alt": item["alt"], "srcset": item["srcset"][:1500]})
                        img_seen.add(src)
                pages.append({
                    "url": effective, "platform": platform, "observed_at": datetime.now(timezone.utc).isoformat(),
                    "sha256_html": hashlib.sha256(data).hexdigest(),
                    "title": " ".join(ex.titles).strip()[:300],
                    "metadata": ex.meta, "structured_data": ex.jsonld[:25],
                    "image_candidates": images[:100], "links": links,
                    "extraction_status": "candidate_unreviewed"
                })
                for x in reversed(links):
                    if x not in seen and x not in queue: queue.appendleft(x)
        except (HTTPError, URLError, UnicodeError, ValueError, TimeoutError) as e:
            errors.append({"url": url, "reason": type(e).__name__, "detail": str(e)[:200]})
        time.sleep(pause)
    return {
        "source": start_url, "host": host, "parser_version": PARSER_VERSION,
        "started_from": start_url, "completed_at": datetime.now(timezone.utc).isoformat(),
        "page_limit": max_pages, "sitemap_discovered_urls": len(sitemap), "platforms": platform_counts, "pages_checked": len(seen),
        "pages_succeeded": len(pages), "queue_remaining": len(queue),
        "complete": not queue and not errors, "errors": errors, "pages": pages,
        "notice": "Discovery evidence only. No images copied; no status or release-date inference."
    }

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--url", required=True, help="Artist's official HTTPS homepage or sculpt index")
    p.add_argument("--max-pages", type=int, default=30)
    p.add_argument("--delay", type=float, default=1.5)
    p.add_argument("--out", default="artifacts/source-discovery.json")
    args = p.parse_args()
    s = urlsplit(args.url)
    if s.scheme != "https" or not s.hostname or s.username or s.password:
        p.error("Use an official public HTTPS URL without userinfo")
    if not 1 <= args.max_pages <= 80 or not 1.0 <= args.delay <= 30:
        p.error("Page limit must be 1–80 and delay 1–30 seconds")
    report = crawl(args.url, args.max_pages, args.delay)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(report['pages'])} pages, {len(report['errors'])} errors, complete={report['complete']} -> {out}")

if __name__ == "__main__": main()
