/** Initial original Adrie Stoete portfolio curated only from three
 * artist-owned, named product pages which explicitly state that
 * each purchase is an unpainted vinyl kit with Adrie-signed certificate.
 * The Adriesdolls shop also sells third-party work. No other items
 * are automatically attributed to her.
 * Evidence: official Adriesdolls product pages checked 2026-10-13 and
 * snapshot in scrape-results, run 38457897482 (Xavi).
 * All image URLs remain artist-hosted and may show other artists' finished
 * prototypes; no licence or present stock is claimed.
 */
import type {VerifiedArtist,VerifiedKit} from "./real-catalogue";
export const adrieOriginalArtist:VerifiedArtist={
  "slug": "adrie-stoete",
  "name": "Adrie Stoete",
  "website": "https://www.adriesdolls.com/",
  "source": "https://www.adriesdolls.com/",
  "bio": "Original doll sculptor Adrie Stoete creates authentic unpainted vinyl kits, often with artist-signed authenticity certificates. Her official Adriesdolls shop also carries other sculptors' work; Reborna credits individual sculpts to the original creator.",
  "images": [
    {
      "url": "https://www.adriesdolls.com/var/images/product/400.400/3%20xavi.jpg",
      "source": "https://www.adriesdolls.com/xavi",
      "credit": "Adrie Stoete official sculpt-kit product photograph; not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ]
};
export const adrieOriginalKits:VerifiedKit[]=[
  {
    "slug": "xavi-adrie-stoete",
    "name": "Xavi",
    "artistSlug": "adrie-stoete",
    "material": "vinyl",
    "statusLabel": "Original blank vinyl sculpt kit — availability not independently confirmed",
    "statusChecked": "2026-10-13",
    "sizeDescription": "19 inches (official product listing)",
    "releaseInfo": "Original unpainted kit includes sculpt components; original seller may offer optional bodies and plates. Photographs may be artist-painted prototype interpretations, not the blank kit supplied.",
    "photos": [
      {
        "url": "https://www.adriesdolls.com/var/images/product/400.400/3%20xavi.jpg",
        "credit": "Adriesdolls official original kit listing — completed prototype interpretations may be by independent artists",
        "source": "https://www.adriesdolls.com/xavi"
      }
    ],
    "sources": [
      {
        "label": "Adrie Stoete — official original vinyl kit listing",
        "url": "https://www.adriesdolls.com/xavi",
        "kind": "artist"
      }
    ]
  },
  {
    "slug": "cecily-adrie-stoete",
    "name": "Cecily",
    "artistSlug": "adrie-stoete",
    "material": "vinyl",
    "statusLabel": "Original blank vinyl sculpt kit — availability not independently confirmed",
    "statusChecked": "2026-10-13",
    "sizeDescription": "19 inches (official product listing)",
    "edition": "Artist lists a limited edition of 1,000",
    "releaseInfo": "Original unpainted kit includes sculpt components; original seller may offer optional bodies and plates. Photographs may be artist-painted prototype interpretations, not the blank kit supplied.",
    "photos": [
      {
        "url": "https://www.adriesdolls.com/var/images/product/400.400/3%20cecily.jpg",
        "credit": "Adriesdolls official original kit listing — completed prototype interpretations may be by independent artists",
        "source": "https://www.adriesdolls.com/en/dollkits/19-kits/cecily"
      }
    ],
    "sources": [
      {
        "label": "Adrie Stoete — official original vinyl kit listing",
        "url": "https://www.adriesdolls.com/en/dollkits/19-kits/cecily",
        "kind": "artist"
      }
    ]
  },
  {
    "slug": "dottie-adrie-stoete",
    "name": "Dottie",
    "artistSlug": "adrie-stoete",
    "material": "vinyl",
    "statusLabel": "Original blank vinyl sculpt kit — availability not independently confirmed",
    "statusChecked": "2026-10-13",
    "sizeDescription": "18 inches (official product listing)",
    "edition": "Artist lists a limited edition (number not confirmed)",
    "releaseInfo": "Original unpainted kit includes sculpt components; original seller may offer optional bodies and plates. Photographs may be artist-painted prototype interpretations, not the blank kit supplied.",
    "photos": [
      {
        "url": "https://www.adriesdolls.com/var/images/product/400.400/0%20Dottie%203.jpg",
        "credit": "Adriesdolls official original kit listing — completed prototype interpretations may be by independent artists",
        "source": "https://www.adriesdolls.com/dollkits/16-18-kits-tiny-sweetness-collection/dottie-product"
      }
    ],
    "sources": [
      {
        "label": "Adrie Stoete — official original vinyl kit listing",
        "url": "https://www.adriesdolls.com/dollkits/16-18-kits-tiny-sweetness-collection/dottie-product",
        "kind": "artist"
      }
    ]
  }
];
