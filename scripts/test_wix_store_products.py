"""Offline safety tests for Wix Stores original-kit evidence."""
import unittest
from extract_wix_store_products import product_candidates,extract_page

class WixStoreTests(unittest.TestCase):
 def test_collection_only_product_links(self):
  r=product_candidates({"source":"https://shop.example/","pages":[
   {"url":"https://shop.example/vinyl-kits","links":[
    "https://shop.example/product-page/kori","https://shop.example/product-page/raerae",
    "https://shop.example/product-page/kori","https://malicious.invalid/product-page/fake"]},
   {"url":"https://shop.example/babies-for-adoption","links":["https://shop.example/product-page/a-doll"]}
  ]},{"/vinyl-kits":"vinyl"})
  self.assertEqual(r,[("https://shop.example/product-page/kori","vinyl"),("https://shop.example/product-page/raerae","vinyl")])
 def test_named_wix_store_photo(self):
  html='''<html><head><meta property="og:title" content='"Kori" VINYL Reborn Doll KIT (unpainted) | dmh sculptures'></head><body>
  <img src="https://static.wixstatic.com/media/logo.jpg" alt="DMH Sculptures">
  <img src="https://static.wixstatic.com/media/original.jpg/v1/fill/w_300" alt='"Kori" VINYL Reborn Doll KIT (unpainted)'>
  <img src="https://static.wixstatic.com/media/other.jpg" alt="Angelique Joy">
  </body></html>'''
  r=extract_page(html,"https://shop.example/product-page/kori","vinyl")
  self.assertEqual(r["sculpt_name_candidate"],"Kori")
  self.assertEqual(r["material_candidate"],"vinyl")
  self.assertEqual(r["photo_candidates"],["https://static.wixstatic.com/media/original.jpg"])
  self.assertTrue(r["publication_ready"])
 def test_unverified_name_held(self):
  html='<html><head><meta property="og:title" content="Maxan | dmh sculptures"></head></html>'
  r=extract_page(html,"https://shop.example/product-page/maxan","vinyl")
  self.assertFalse(r["publication_ready"])
  self.assertEqual(r["review_reason"],"no_explicit_kit_type_in_product_title")
 def test_finished_doll_excluded(self):
  html='<meta property="og:title" content="Mabel completed painted reborn silicone doll">'
  self.assertIsNone(extract_page(html,"https://shop.example/product-page/mabel","silicone"))
 def test_cross_material_placement(self):
  html='<meta property="og:title" content="William full body silicone toddler kit, unpainted">'
  r=extract_page(html,"https://shop.example/product-page/william","vinyl")
  self.assertEqual(r["material_candidate"],"silicone")
if __name__=="__main__":unittest.main()
