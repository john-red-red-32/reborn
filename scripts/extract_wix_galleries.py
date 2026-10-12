#!/usr/bin/env python3
"""Read-only, browser-rendered Wix gallery discovery with visible-DOM evidence only."""
import argparse,json,re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, TimeoutError as BrowserTimeout

GALLERY_PATHS=("/galleries","/sculpting","/reborns","/silicone","/vinyl")
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--input",required=True)
 p.add_argument("--out",required=True)
 args=p.parse_args()
 src=json.loads(Path(args.input).read_text(encoding="utf8"))
 pages=[r for r in src.get("pages",[]) if urlparse(r["url"]).path.lower().startswith(GALLERY_PATHS)]
 evidence=[]
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,args=["--disable-dev-shm-usage"])
  context=browser.new_context(viewport={"width":1400,"height":1000},user_agent="RebornaDiscovery/0.1 (+https://reborna.co; editorial source research)")
  for entry in pages[:8]:
   page=context.new_page()
   result={"url":entry["url"],"platform":"wix","state":"unknown","elements":[],"errors":[]}
   try:
    page.goto(entry["url"],wait_until="domcontentloaded",timeout=25000)
    page.wait_for_timeout(2500)
    # Scroll slowly to activate lazy Wix galleries; never click private links.
    for fraction in (0.3,0.6,1):
     page.evaluate("(f)=>window.scrollTo(0,document.body.scrollHeight*f)",fraction)
     page.wait_for_timeout(650)
    result["elements"]=page.evaluate("""() => {
      const cards=[...document.querySelectorAll('figure,[role="figure"],[data-hook*="gallery"],[class*="gallery-item"],[class*="pro-gallery"],img')];
      const dedup=new Map();
      for(const el of cards.slice(0,900)){
       const img=el.tagName==='IMG'?el:el.querySelector('img');
       if(!img)continue;
       const url=img.currentSrc||img.src||img.getAttribute('data-src')||'';
       if(!/^https?:/.test(url))continue;
       const scope=el.tagName==='IMG'?(el.closest('figure,[role="figure"],[data-hook*="gallery-item"]')||el.parentElement):el;
       const caption=(scope?.querySelector('figcaption,[class*="caption"],[data-hook*="title"]')?.textContent||'').trim().slice(0,220);
       const alt=(img.alt||'').trim().slice(0,220);
       const title=(img.title||'').trim().slice(0,220);
       if(!dedup.has(url))dedup.set(url,{url,alt,title,caption});
      }
      return [...dedup.values()].slice(0,200);
    }""")
    result["visible_headings"]=page.locator("h1,h2,h3").all_text_contents()[:70]
    result["state"]="rendered"
   except (BrowserTimeout,Exception) as exc:
    result["state"]="error"
    result["errors"].append(str(exc)[:240])
   finally:
    evidence.append(result)
    page.close()
  browser.close()
 output={"adapter":"wix-gallery-browser-v1","source":src.get("source"),"scan_at":src.get("completed_at"),
 "gallery_pages_examined":len(evidence),"pages":evidence,
 "notice":"Rendered DOM candidate evidence only. No images downloaded, no name/identity inferred from unrelated photos."}
 dest=Path(args.out);dest.parent.mkdir(parents=True,exist_ok=True)
 dest.write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding="utf8")
 print(f"Wix gallery evidence from {len(evidence)} pages, {sum(len(p['elements']) for p in evidence)} image elements")
if __name__=="__main__":main()
