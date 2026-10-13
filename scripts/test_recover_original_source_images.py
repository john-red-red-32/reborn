"""Offline regression tests: an exact named product cannot become another kit."""
import unittest
from bs4 import BeautifulSoup
from recover_original_source_images import name_match,product_images,card_image_for,valid_image

class Tests(unittest.TestCase):
 def test_similar_names_not_mixed(self):
  self.assertTrue(name_match("Emma","Emma BLANK silicone kit"))
  self.assertFalse(name_match("Emma","Emmerson BLANK silicone kit"))
  self.assertFalse(name_match("River Awake","River Sleeping"))
 def test_specific_product_meta(self):
  url="https://artist.example/shop/emma-blank-silicone-kit/"
  html='<meta property="og:title" content="Emma blank silicone kit"/><meta property="og:image" content="https://artist.example/uploads/emma-original.jpg">'
  items,_=product_images(BeautifulSoup(html,"html.parser"),"Emma",url)
  self.assertEqual(items[0][0],"https://artist.example/uploads/emma-original.jpg")
  items,_=product_images(BeautifulSoup(html,"html.parser"),"Emerson",url)
  self.assertEqual(items,[])
 def test_category_og_photo_rejected(self):
  html='<meta property="og:title" content="Original vinyl kit catalogue"/><meta property="og:image" content="https://shop.example/gallery.jpg">'
  out,_=product_images(BeautifulSoup(html,"html.parser"),"Alfie","https://shop.example/doll-kits")
  self.assertEqual(out,[])
 def test_retailer_card_named(self):
  html='<article class="product"><h3>Alfie by Laura Lee Eagles</h3><img src="/image/alfie.jpg" alt="Alfie doll"/></article><article class="product"><h3>Amelia by Laura Lee Eagles</h3><img src="/image/amelia.jpg" alt="Amelia doll"/></article>'
  dom=BeautifulSoup(html,"html.parser")
  self.assertEqual(card_image_for(dom,"Alfie","https://shop.example/kits")[0][0],"https://shop.example/image/alfie.jpg")
  self.assertEqual(card_image_for(dom,"Charlotte","https://shop.example/kits"),[])
 def test_generic_logo_is_not_gallery(self):
  self.assertIsNone(valid_image("https://shop.example/img/logo.jpg","https://shop.example/"))

if __name__=="__main__":unittest.main()
