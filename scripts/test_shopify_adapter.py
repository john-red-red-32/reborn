#!/usr/bin/env python3
"""Offline safety tests for Shopify original kit discovery, variants, and exclusion."""
import unittest
from extract_shopify_kits import classification, parse_product, kit_facts

class ShopifyKitTests(unittest.TestCase):
    def product(self,title="Christopher - In Stock",body="You are buying the BLANK doll kit only. Belly Plate: Optional extra. Edition size: 600",variants=None):
        return {"id":100,"title":title,"handle":"christopher","body_html":f"<p>{body}</p>",
            "product_type":"Kit","options":[{"name":"Belly Plate Option"}],
            "variants":variants if variants is not None else [
                {"id":1,"title":"Without Belly Plate","option1":"Without","price":9900,"available":True},
                {"id":2,"title":"With Belly Plate","option1":"With","price":11900,"available":True}],
            "images":["https://cdn.shopify.com/example.jpg"]}
    def test_original_blank_kit_and_belly_plate_prices(self):
        row=parse_product(self.product(),"https://nikkisseasidebabies.co.uk/","hash","time")
        self.assertEqual(row["classification"],"original_kit_candidate")
        self.assertEqual(row["published_kit_facts"]["edition_size"],600)
        self.assertTrue(row["has_genuine_full_price_range"])
        self.assertEqual(row["from_price_native"],99.0)
        self.assertEqual(row["variants"][1]["option_values"]["Belly Plate Option"],"With")
    def test_two_identical_prices_are_not_from(self):
        p=self.product()
        p["variants"][1]["price"]=9900
        row=parse_product(p,"https://nikkisseasidebabies.co.uk/","hash","time")
        self.assertFalse(row["has_genuine_full_price_range"])
        self.assertIsNone(row["from_price_native"])
    def test_deposit_excluded_from_full_price(self):
        p=self.product()
        p["options"]=[{"name":"Deposit or Full Payment"}]
        p["variants"]=[{"id":1,"title":"Deposit Only","option1":"Deposit Only","price":2000},
                       {"id":2,"title":"Pay in Full","option1":"Full Payment","price":9900}]
        row=parse_product(p,"https://nikkisseasidebabies.co.uk/","hash","time")
        self.assertEqual(row["variants"][0]["price_kind"],"deposit_only")
        self.assertEqual(row["distinct_full_prices"],[99.0])
        self.assertFalse(row["has_genuine_full_price_range"])
    def test_decimal_string_prices_and_accessory_only_do_not_lower_from(self):
        p=self.product()
        p["variants"]=[
            {"id":1,"title":"Mabel Kit - NO Belly Plate","option1":"NO Belly Plate","price":"99.00","available":True},
            {"id":2,"title":"Mabel Kit - WITH Belly Plate","option1":"WITH Belly Plate","price":"114.00","available":True},
            {"id":3,"title":"Belly Plate ONLY - NO KIT!!","option1":"Belly Plate ONLY - NO KIT!!","price":"15.00","available":True}]
        row=parse_product(p,"https://nikkisseasidebabies.co.uk/","hash","time")
        self.assertEqual([v["price_native"] for v in row["variants"]],[99.0,114.0,15.0])
        self.assertEqual(row["variants"][2]["price_kind"],"accessory_only")
        self.assertEqual(row["distinct_full_prices"],[99.0,114.0])
        self.assertEqual(row["from_price_native"],99.0)
    def test_specs_keep_decimal_dimensions_and_separate_labels(self):
        facts=kit_facts('Name: Mabel Sculptor: Nikki Johnston Kit length: Approx 19/20” (bent legs) Head circumference: 13.5” Custom Cloth Body: Included & signed Belly Plate: Optional extra (GBP £15) COA: Included Vinyl: JoyDolls Edition size: 2,500')
        self.assertEqual(facts["published_head_circumference"],'13.5”')
        self.assertEqual(facts["cloth_body"],"Included & signed")
        self.assertEqual(facts["edition_size"],2500)
        self.assertEqual(facts["manufacturer"],"JoyDolls")
        self.assertEqual(facts["belly_plate_addon_price_gbp"],15.0)
    def test_rooting_classes_are_not_sculpt_kits(self):
        self.assertEqual(classification(self.product("Advanced Rooting (Level 3 - Coming Soon)"))[0],"non_kit_excluded")

    def test_finished_doll_never_kit(self):
        self.assertEqual(classification(self.product("PROTOTYPE Winnie - Complete Reborn Baby, Sculpted by Cassie Brace"))[0],"finished_doll_excluded")
    def test_standalone_component_excluded(self):
        self.assertEqual(classification(self.product("Delilah Belly Plate"))[0],"component_excluded")
    def test_tutorial_excluded(self):
        self.assertEqual(classification(self.product("Online Tutorials"))[0],"non_kit_excluded")
    def test_kit_explicit_preorder_over_stock_flag(self):
        row=parse_product(self.product("Mabel - Pre Order"),"https://nikkisseasidebabies.co.uk/","hash","time")
        self.assertEqual(row["lifecycle_evidence"],"preorder_advertised")
if __name__=="__main__":unittest.main()
