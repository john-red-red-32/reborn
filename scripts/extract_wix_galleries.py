#!/usr/bin/env python3
"""Read-only Wix historical galleries: extract named kit cards from public iframe DOM.

Masonry cards carry the sculpt name, edition/size description and exact image;
Collage cards carry clay photographs, often with ambiguous filenames. Preserve
the distinction and never publish or mirror unreviewed third-party images.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ADAPTER_VERSION = "wix-gallery-iframe-v4"
GALLERY_PATHS = ("/galleries", "/sculpting", "/reborns", "/silicone", "/vinyl")
IMAGE_PATTERN = re.compile(r"/media/([^/?]+)")
SIZE_PATTERN = re.compile(r'(\d+(?:\s*[-–]\s*\d+)?)\s*(?:"|”|inches?\b)', re.I)

def normalize_card(raw, source_page, frame_kind):
    name = re.sub(r"\s+", " ", str(raw.get("title") or "")).strip()
    description = re.sub(r"\s+", " ", str(raw.get("description") or "")).strip()
    image = str(raw.get("image") or "")
    if not image.startswith("https://static.wixstatic.com/media/"):
        return None
    match = IMAGE_PATTERN.search(image)
    if not match:
        return None
    if frame_kind == "Masonry" and not name:
        return None
    edition = "limited" if re.search(r"\blimited\s+edition\b", description, re.I) else ("open" if re.search(r"\bopen\s+edition\b", description, re.I) else None)
    size = SIZE_PATTERN.search(description)
    return {
        "record_type": "original_vinyl_kit" if frame_kind == "Masonry" and "/vinyl-doll-kits" in urlparse(source_page).path else "unverified_gallery_photo",
        "title": name,
        "description": description[:400],
        "edition_type": edition,
        "approx_size_inches": size.group(1).replace(" ", "") if size else None,
        "photo_url": image,
        "wix_asset_id": match.group(1),
        "source_page": source_page,
        "gallery_kind": frame_kind,
        "evidence": "Wix public gallery iframe item with matching photo, title and description",
        "review_status": "source_identified_unreviewed"
    }

FRAME_EXTRACTION = """() => {
 const frames=[];
 const cards=[...document.querySelectorAll("#viewport .item, .grid .item")].slice(0,450);
 for(const card of cards){
   const image=card.querySelector("img");
   const fill=card.querySelector(".filler");
   const background=fill?getComputedStyle(fill).backgroundImage:"";
   const match=background.match(/url\\(["']?([^"')]+)["']?\\)/);
   frames.push({
     title:(card.querySelector(".title")?.getAttribute("title") || card.querySelector(".title")?.textContent || "").trim().slice(0,160),
     description:(card.querySelector(".desc")?.textContent||"").trim().slice(0,400),
     image:(image?.currentSrc||image?.src||match?.[1]||"").trim()
   });
 }
 return {cards:frames, total_dom_cards:document.querySelectorAll("#viewport .item, .grid .item").length};
}"""

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    discovered = json.loads(Path(args.input).read_text(encoding="utf-8"))
    pages = [p for p in discovered.get("pages", []) if urlparse(p["url"]).path.lower().startswith(GALLERY_PATHS)]
    evidence = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=["--disable-dev-shm-usage"])
        context = browser.new_context(viewport={"width": 1400, "height": 1000},
            user_agent="RebornaDiscovery/0.1 (+https://reborna.co; editorial source research)")
        for entry in pages[:8]:
            url = entry["url"]
            page = context.new_page()
            result = {"url": url, "state": "unknown", "gallery_frames": [], "kit_cards": [],
                "unverified_gallery_photos": [], "errors": []}
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=25000)
                page.wait_for_timeout(2500)
                for fraction in (0.3, 0.6, 1):
                    page.evaluate("(f)=>window.scrollTo(0,document.body.scrollHeight*f)", fraction)
                    page.wait_for_timeout(600)
                for frame in page.frames[1:]:
                    frame_kind = next((kind for kind in ("Masonry", "Collage") if f"/{kind}/" in frame.url), None)
                    if frame_kind is None:
                        continue
                    raw = frame.evaluate(FRAME_EXTRACTION)
                    records = [r for raw_card in raw["cards"]
                               if (r := normalize_card(raw_card, url, frame_kind))]
                    result["gallery_frames"].append({
                        "type": frame_kind, "total_dom_cards": raw["total_dom_cards"],
                        "extracted_with_images": len(records)})
                    for record in records:
                        if record["record_type"] == "original_vinyl_kit":
                            result["kit_cards"].append(record)
                        else:
                            result["unverified_gallery_photos"].append(record)
                result["state"] = "rendered"
                if not result["gallery_frames"] and urlparse(url).path in ("/vinyl-doll-kits", "/sculpting"):
                    result["errors"].append("Expected gallery iframe not present; coverage unverified")
            except Exception as exc:
                result["state"] = "error"
                result["errors"].append(f"{type(exc).__name__}: {str(exc)[:220]}")
            finally:
                evidence.append(result)
                page.close()
        browser.close()
    kits = [r for p in evidence for r in p["kit_cards"]]
    photos = [r for p in evidence for r in p["unverified_gallery_photos"]]
    output = {"adapter": ADAPTER_VERSION, "source": discovered.get("source"),
        "source_scan_at": discovered.get("completed_at"),
        "pages_examined": len(evidence), "kit_cards_found": len(kits),
        "unverified_gallery_photos_found": len(photos), "pages": evidence,
        "kit_candidates": kits,
        "notice": "Candidate source evidence only; no images mirrored, identities inferred for clay photographs, or catalogue modified."}
    dest = Path(args.out)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wix gallery: {len(kits)} named kit cards and {len(photos)} unverified gallery photos")
    for result in evidence:
        print(f" {urlparse(result['url']).path}: {len(result['kit_cards'])} kits, {len(result['unverified_gallery_photos'])} photos, errors={result['errors']}")

if __name__ == "__main__":
    main()
