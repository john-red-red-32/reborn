"""Offline regression tests for source-attributed contact enrichment."""
import unittest
from enrich_artist_contacts import PublicPage, enrich_profile, extract_emails, safe_url, valid_email, bio_links

class TestContactEnrichment(unittest.TestCase):
    def test_public_bio_and_contact(self):
        result=enrich_profile({'username':'artist.test','biography':'Original kits: Studio@artist.test','externalUrl':'https://artist.test/','public_email':'studio@artist.test'})
        self.assertEqual(result['bio_links'],['https://artist.test/'])
        self.assertEqual({v['source_kind'] for v in result['contacts']},
                         {'instagram_bio','instagram_public_business_contact_reported'})
        self.assertTrue(all(v['review_status']=='pending' for v in result['contacts']))
    def test_private_skipped(self):
        result=enrich_profile({'username':'private','is_private':True,'emails':['private@artist.test']})
        self.assertTrue(result['skipped_private'])
        self.assertEqual(result['contacts'],[])
    def test_provider_email_unverified(self):
        result=enrich_profile({'username':'artist','email':'hello@artist.test'})
        self.assertEqual(result['contacts'][0]['source_kind'],'profile_provider_unverified')
    def test_visible_email_and_mailto(self):
        page=PublicPage()
        page.feed('<script>hidden@invalid.test</script><a href="mailto:Info@artist.test?subject=Hello">Email</a><p>Studio@artist.test</p>')
        self.assertEqual(page.mailto,['info@artist.test'])
        self.assertEqual(extract_emails(' '.join(page.visible)),['studio@artist.test'])
    def test_safe_https_only(self):
        for bad in ('http://artist.test', 'https://127.0.0.1', 'https://localhost', 'https://example.test:8080','https://a:b@example.test'):
            self.assertIsNone(safe_url(bad))
        self.assertEqual(valid_email('Contact@artist.test'),'contact@artist.test')
        self.assertIsNone(valid_email('me@example.com'))
    def test_bio_link_aliases(self):
        self.assertEqual(bio_links({'bioLinks':[{'url':'https://linktr.ee/artist'},'https://artist.test']}),['https://linktr.ee/artist','https://artist.test'])

if __name__=='__main__': unittest.main()
