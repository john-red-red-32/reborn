#!/usr/bin/env python3
"""Check the actually served production SEO surfaces after Cloudflare sync.

Checks are public HTTP reads only. No Google indexing claims or site mutation.
"""
from html.parser import HTMLParser
from time import sleep
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = "https://reborna.co"
PATHS = [
    "/", "/robots.txt", "/sitemap.xml",
    "/artists/cassie-ann-love/",
    "/kits/winnie-cassie-ann-love/",
    "/guides/cassie-ann-love-sculpt-history/",
    "/guides/original-reborn-kits/",
]


class PublicPage(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.robots = []
        self.links = []
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "h1":
            self.h1 += 1
        if tag == "a":
            self.links.append(a.get("href", ""))
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href", ""))
        if tag == "meta" and a.get("name") == "robots":
            self.robots.append(a.get("content", ""))


def fetch(path: str) -> str:
    request = Request(ROOT + path, headers={"User-Agent": "RebornaProductionSeoCheck/1.0", "Accept": "text/html,application/xml,text/plain,*/*"})
    with urlopen(request, timeout=16) as response:
        assert response.status == 200, (path, response.status)
        return response.read(2_000_000).decode("utf-8", errors="replace")


def check():
    contents = {path: fetch(path) for path in PATHS}
    assert "Sitemap: https://reborna.co/sitemap.xml" in contents["/robots.txt"]
    assert "Disallow: /" not in [x.strip() for x in contents["/robots.txt"].splitlines()]
    sitemap = ET.fromstring(contents["/sitemap.xml"])
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [x.text for x in sitemap.findall("s:url/s:loc", ns)]
    assert len(urls) > 100, ("unexpected sitemap size", len(urls))
    assert ROOT + "/guides/cassie-ann-love-sculpt-history/" in urls
    for path in PATHS:
        if not path.endswith("/") and path != "/":
            continue
        parsed = PublicPage()
        parsed.feed(contents[path])
        assert parsed.h1 == 1, (path, "expected one h1", parsed.h1)
        assert ROOT + path in parsed.canonicals, (path, "canonical missing", parsed.canonicals)
        assert all("noindex" not in value.lower() for value in parsed.robots), (path, "noindex")
        if path == "/artists/cassie-ann-love/":
            assert "/guides/cassie-ann-love-sculpt-history/" in parsed.links, "sculpt history is not linked from artist"
        if path == "/guides/cassie-ann-love-sculpt-history/":
            assert "/artists/cassie-ann-love/" in parsed.links, "history should link to artist"
    print(f"PASS: public production HTTP 200 for {len(PATHS)} URLs; {len(urls)} sitemap entries; indexed canonical editorial pages with cross-links.")


if __name__ == "__main__":
    last = ""
    for attempt in range(12):
        try:
            check()
            break
        except Exception as exc:
            last = str(exc)
            print(f"Production check {attempt+1}/12 not ready: {last}", flush=True)
            if attempt == 11:
                raise
            sleep(10)
