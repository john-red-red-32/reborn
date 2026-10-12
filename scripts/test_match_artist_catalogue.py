#!/usr/bin/env python3
"""Test safe identity rules before any source scan."""
import unittest
from match_artist_catalogue import match_candidates, normalise

class ArtistIdentityTests(unittest.TestCase):
    def test_case_punctuation_match(self):
        result=match_candidates("artist-a",["Remi Ashton","LEO"],["Remi-Ashton","Leo"])
        self.assertEqual(len(result["exact_and_approved_matches"]),2)
        self.assertFalse(result["requires_review"])

    def test_unapproved_near_match_requires_review(self):
        result=match_candidates("cassie-ann-love",["Romily","Sienna Rae"],["Romilly","Sienna"])
        self.assertEqual(len(result["exact_and_approved_matches"]),0)
        self.assertEqual(len(result["requires_review"]),2)

    def test_approved_alias(self):
        result=match_candidates("artist-a",["Sienna Rae"],["Sienna"],{"Sienna Rae":"Sienna"})
        self.assertEqual(result["exact_and_approved_matches"][0]["method"],"approved_alias")

    def test_no_unrelated_artist_merges(self):
        a=match_candidates("artist-a",["Leo"],["Leo"])
        b=match_candidates("artist-b",["Leo"],["Other"])
        self.assertEqual(len(a["exact_and_approved_matches"]),1)
        self.assertEqual(len(b["exact_and_approved_matches"]),0)

    def test_bad_alias_target_fails(self):
        with self.assertRaises(ValueError):
            match_candidates("artist-a",["Missing"],["Leo"],{"Missing":"Somebody Else"})

    def test_source_absence_not_deletion(self):
        result=match_candidates("artist-a",[],["Leo"])
        self.assertEqual(result["not_seen_in_source"],["Leo"])
        self.assertEqual(len(result["exact_and_approved_matches"]),0)

if __name__=="__main__":
    unittest.main()
