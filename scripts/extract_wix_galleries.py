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
    result["diagnostics"]=page.evaluate("""() => {
      const html=document.documentElement.outerHTML;
      const sample=(text)=>{const i=html.indexOf(text);return i<0?"":html.slice(Math.max(0,i-300),i+550)};
      const elems=[...document.querySelectorAll("wix-image,wix-bg-image,[data-image-info],[data-testid*=gallery],[data-hook*=gallery]")];
      return {body_text_length:document.body.innerText.length,body_text_sample:document.body.innerText.slice(0,2700),html_length:html.length,
        leo_sample:sample("Leo"),wix_image_count:document.querySelectorAll("wix-image").length,all_img_count:document.querySelectorAll("img").length,
        relevant_nodes:elems.length,relevant_html:elems.slice(0,6).map(x=>x.outerHTML.slice(0,1100)),
        iframe_count:document.querySelectorAll("iframe").length,
        frames:[...document.querySelectorAll("iframe")].map(x=>({src:x.src,title:x.title})).slice(0,12)};
    }""")
    result["frame_diagnostics"]=[]
    for fr in page.frames[1:8]:
     try:
      result["frame_diagnostics"].append({"url":fr.url[:400],"body_sample":fr.locator("body").inner_text(timeout=2500)[:700]})
     except Exception as ex:result["frame_diagnostics"].append({"url":fr.url[:400],"error":str(ex)[:100]})
    result["gallery_frames"]=[]
    for fr in page.frames[1:]:
     if not any(x in fr.url for x in ("/Masonry/","/Collage/")):
      continue
     try:
      frame_data=fr.evaluate("""() => {
        const html=document.documentElement.outerHTML;
        const i=html.indexOf("Leo");
        const imgs=[...document.querySelectorAll("img")];
        return {url:location.href.split("?")[0],body_text_length:document.body.innerText.length,
          html_length:html.length,img_count:imgs.length,html_start:html.slice(0,1800),
          html_near_leo:i<0?"":html.slice(Math.max(0,i-1500),i+2400),
          sample_images:imgs.slice(0,4).map(x=>({src:x.currentSrc||x.src,alt:x.alt,html:x.parentElement?.parentElement?.outerHTML.slice(0,1600)})),
          masonry_classes:[...new Set([...document.querySelectorAll("[class]")].map(x=>x.className).filter(x=>typeof x==="string"))].slice(0,65)};
      }""")
      result["gallery_frames"].append(frame_data)
     except Exception as ex:result["gallery_frames"].append({"error":str(ex)[:170]})
    result["state"]="rendered"
   except (BrowserTimeout,Exception) as exc:
    result["state"]="error"
    result["errors"].append(str(exc)[:240])
   finally:
    evidence.append(result)
    page.close()
  browser.close()
 output={"adapter":"wix-gallery-browser-v3-frame-diagnostics","source":src.get("source"),"scan_at":src.get("completed_at"),
 "gallery_pages_examined":len(evidence),"pages":evidence,
 "notice":"Rendered DOM candidate evidence only. No images downloaded, no name/identity inferred from unrelated photos."}
 dest=Path(args.out);dest.parent.mkdir(parents=True,exist_ok=True)
 dest.write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding="utf8")
 print(f"Wix gallery evidence from {len(evidence)} pages, {sum(len(p['elements']) for p in evidence)} image elements")
if __name__=="__main__":main()
