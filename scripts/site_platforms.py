"""Conservative platform recognition and public XML sitemap URL discovery."""
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

def detect_platform(html,meta=None):
    t=html.lower()
    if "wixstatic.com" in t or "wix.com" in t or "wixsite" in t: return "wix"
    if "cdn.shopify.com" in t or "shopify.theme" in t or "myshopify" in t: return "shopify"
    if "jimcdn.com" in t or "jimdo.com" in t or "jimdofree" in t: return "jimdo"
    if "jwwb.nl" in t or "webador" in t or "jouwweb" in t: return "webador"
    if "woocommerce" in t or "wc-block" in t: return "woocommerce"
    if "wp-content/" in t or "wordpress" in t or "wp-json" in t: return "wordpress"
    if "godaddy.com" in t or "secureserver.net" in t or "websitebuilder" in t: return "godaddy"
    return "unknown"

def sitemap_urls(start_url,agent,robots,max_urls=200):
    """Follow public XML sitemap indexes (max 8 documents); return same-host HTML candidates."""
    host=urlsplit(start_url).hostname
    roots=[urljoin(start_url,"/sitemap.xml")]
    found=set(); visited=set()
    while roots and len(visited)<8 and len(found)<max_urls:
        sitemap=roots.pop(0)
        if sitemap in visited or not robots.can_fetch(agent,sitemap):continue
        visited.add(sitemap)
        try:
            with urlopen(Request(sitemap,headers={"User-Agent":agent,"Accept":"application/xml,text/xml"}),timeout=12) as r:
                if urlsplit(r.geturl()).hostname!=host:continue
                data=r.read(1_000_001)
                if len(data)>1_000_000:continue
            root=ET.fromstring(data)
            urls=[(e.text or "").strip() for e in root.iter() if e.tag.split("}")[-1]=="loc"]
            if root.tag.split("}")[-1]=="sitemapindex":
                for u in urls:
                    if urlsplit(u).hostname==host and u not in visited and len(roots)<15:roots.append(u)
            else:
                for u in urls:
                    s=urlsplit(u)
                    if s.scheme=="https" and s.hostname==host and robots.can_fetch(agent,u):
                        found.add(u)
                        if len(found)>=max_urls:break
        except (HTTPError,URLError,TimeoutError,ET.ParseError,ValueError):
            continue
    return sorted(found)
