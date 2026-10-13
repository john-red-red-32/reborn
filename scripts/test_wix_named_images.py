"""Offline checks for conservative Wix named-image extractor."""
import unittest
from extract_wix_named_images import extract

class WixNamedImagesTests(unittest.TestCase):
 def test_only_original_named_collection_photos(self):
  source={
   "source":"https://www.example-sculptor.com/","completed_at":"2026-10-13",
   "pages":[
    {"url":"https://www.example-sculptor.com/doll-kits",
     "image_candidates":[
      {"url":"https://static.wixstatic.com/media/a.jpg/v1/fill/w_100","alt":"Twin B - Available Now"},
      {"url":"https://static.wixstatic.com/media/b.jpg/v1/fill/w_100","alt":"Milla and Ronnie - Sold Out"},
      {"url":"https://static.wixstatic.com/media/c.jpg","alt":""}
      ]},
    {"url":"https://www.example-sculptor.com/silicone-dolls","image_candidates":[
      {"url":"https://static.wixstatic.com/media/x.jpg","alt":"Finished baby"}]},
    {"url":"https://malicious.invalid/doll-kits","image_candidates":[
      {"url":"https://static.wixstatic.com/media/y.jpg","alt":"Fake"}]},
   ]}
  r=extract(source,{"/doll-kits":"vinyl"})
  self.assertEqual([x["title"] for x in r["kit_candidates"]],["Twin B","Milla and Ronnie"])
  self.assertEqual(r["kit_candidates"][0]["original_asset_url"],"https://static.wixstatic.com/media/a.jpg")
  self.assertTrue(r["kit_candidates"][1]["multiple_designs_possible"])
  self.assertEqual(r["kit_candidates"][0]["source_status_claim"],"available now")
  self.assertTrue(all(x["material"]=="vinyl" for x in r["kit_candidates"]))
 def test_branding_and_paginated_logo_rejected(self):
  source={"source":"https://dmh.example/vinyl-kits","pages":[
   {"url":"https://dmh.example/vinyl-kits","image_candidates":[
    {"alt":"Doris Moyers-Hornbogen DMH","url":"https://static.wixstatic.com/media/a.jpg"},
    {"alt":"DMH Sculptures","url":"https://static.wixstatic.com/media/b.jpg"},
    {"alt":"MAD gallery","url":"https://static.wixstatic.com/media/c.jpg"},
    {"alt":"Kobi - Sold Out","url":"https://static.wixstatic.com/media/d.jpg"}]},
   {"url":"https://dmh.example/vinyl-kits?page=2","image_candidates":[
    {"alt":"Kobi - Sold Out","url":"https://static.wixstatic.com/media/d.jpg"}]}
  ]}
  data=extract(source,{"/vinyl-kits":"vinyl"})
  self.assertEqual(data["kit_cards_found"],1)
  self.assertEqual(data["kit_candidates"][0]["title"],"Kobi")

 def test_unapproved_collection_ignored(self):
  r=extract({"source":"https://studio.example","pages":[{"url":"https://studio.example/gallery","image_candidates":[{"alt":"Olive","url":"https://static.wixstatic.com/media/a.jpg"}]}]}, {"/vinyl-kits":"vinyl"})
  self.assertEqual(r["kit_cards_found"],0)
if __name__=="__main__":unittest.main()
