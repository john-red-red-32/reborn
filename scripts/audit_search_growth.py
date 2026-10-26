#!/usr/bin/env python3
"""Audit exported search snippets and documented original sculpt/event pages."""
from __future__ import annotations
import json
from html.parser import HTMLParser
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path("out")
base="https://reborna.co"

class HtmlInfo(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title=""
        self.in_title=False
        self.meta={}
        self.links=[]
        self.canonicals=[]
        self.h1=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=="title":self.in_title=True
        if tag=="meta":
            key=attrs.get("name") or attrs.get("property")
            if key:self.meta[key]=attrs.get("content","")
        if tag=="a":self.links.append(attrs.get("href",""))
        if tag=="link" and attrs.get("rel")=="canonical":self.canonicals.append(attrs.get("href",""))
        if tag=="h1":self.h1+=1
    def handle_endtag(self,tag):
        if tag=="title":self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

def read(path):
    file=root / path.strip("/") / "index.html"
    if path=="/":file=root/"index.html"
    assert file.exists(),f"Expected exported HTML: {file}"
    html=file.read_text()
    page=HtmlInfo()
    page.feed(html)
    assert page.h1==1,(path,"h1 count",page.h1)
    assert page.canonicals==[base+path],(path,"canonical",page.canonicals)
    assert "noindex" not in page.meta.get("robots","").lower(),(path,"not indexable")
    assert 20<len(page.title)<=90,(path,"implausible title",page.title)
    assert 50<=len(page.meta.get("description",""))<=175,(path,"description length",page.meta.get("description"))
    assert page.meta.get("og:title"),(path,"missing OpenGraph title")
    return html,page

joanna_html,joanna=read("/artists/joanna-kazmierczak/")
assert "Joanna Kazmierczak Reborn Doll Kits" in joanna.title,joanna.title
for name in ["Willow","Lily","Irys","Charlie"]:
    assert name in joanna.meta["description"],(name,joanna.meta["description"])
for phrase in ["Grantham","Peterborough","MacPherson"]:
    assert phrase in joanna_html,("missing verified artist history",phrase)
kristin_html,kristin=read("/artists/kristin-englert/")
assert "Kristin Englert" in kristin.title
assert "Silicone" in kristin.title, kristin.title
for name in ["Cedar","Sydney","Ripley"]:
    assert name in kristin.meta["description"],kristin.meta["description"]

new_kit_slugs=[
    "otto","lily","irys","eric-erica","charlie","pascale",
    "sandie","elijah","lou-lou","april"
]
for short in new_kit_slugs:
    slug=f"{short}-joanna-kazmierczak"
    path=f"/kits/{slug}/"
    html,page=read(path)
    assert "Joanna Kazmierczak" in page.title,(path,page.title)
    assert "irresistables.com" in html,(path,"missing verified retailer source")
    assert "/artists/joanna-kazmierczak/" in page.links,(path,"missing original artist attribution")
    assert "Original reborn doll sculpt" in html,(path,"missing original kit / sculpt attribution")
    assert "Retailers &amp; artist links" in html or "Retailers & artist links" in html,(path,"missing sources section")

show_path="/events/weissenfels-reborn-event-2027/"
html,event=read(show_path)
assert "Weißenfels" in event.title,(show_path,event.title)
assert "2027" in event.title,(show_path,event.title)
assert "6–7 Mar 2027" in event.meta["description"],event.meta["description"]
assert "weissenfels" in html.lower(),show_path
assert "2027-03-06" in html and "2027-03-07" in html
assert "Kulturamt" in html and "Merseburger" in html
basildon_html,basildon=read("/events/the-doll-show-basildon-2026/")
assert "22 Nov 2026" in basildon.title,basildon.title
assert "Basildon" in basildon.meta["description"]
events_html,events=read("/events/")
assert "Doll Shows" in events.title and "Basildon" in events.meta["description"]
assert show_path in events_html,(show_path,"new researched show not in directory")
assert "/events/the-doll-show-basildon-2026/" in events_html

ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
site=ET.parse(root/"sitemap.xml").getroot()
urls=[row.text for row in site.findall("s:url/s:loc",ns)]
assert len(urls)==len(set(urls)),"duplicate sitemap URLs"
for p in [show_path]+[f"/kits/{slug}-joanna-kazmierczak/" for slug in new_kit_slugs]:
    assert base+p in urls,("new researched page missing from sitemap",p)
print(f"PASS: 2 sculptor search snippets, {len(new_kit_slugs)} original kit pages, 2 event snippets, evidence links and {len(urls)} unique sitemap URLs")
