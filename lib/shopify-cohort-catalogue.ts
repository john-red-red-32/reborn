/** Curated source-linked original Shopify sculpt catalogue. No images are copied.
 * Evidence: public Shopify product JSON snapshots in scrape-results, run 38428033707.
 * Editorial selection 2026-10-13: 21 distinct original kit listings by named
 * sculptors. Combined Mellon + Clementine listing and Awake Olive require
 * separate identity/variant review, so remain in private research evidence.
 * Sales status is NOT live availability; variant options are not purchase offers.
 */
import type {VerifiedArtist,VerifiedKit} from "./real-catalogue";
export const shopifyCohortArtists:VerifiedArtist[]=[
  {
    "slug": "melody-hess",
    "name": "Melody Hess",
    "website": "https://www.melodyhessdolls.com/",
    "source": "https://www.melodyhessdolls.com/",
    "bio": "Melody Hess creates original reborn sculpts in vinyl and silicone. Her official catalogue documents limited-edition vinyl designs including Amara, Vivia and Jupiter, and distinguishes blank sculpt kits from finished reborn dolls."
  },
  {
    "slug": "kristin-englert",
    "name": "Kristin Englert",
    "website": "https://siliconeartdolls.com/",
    "source": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
    "bio": "Kristin Englert is the sculptor and owner of Silicone Art Dolls. Her own original silicone sculpts are offered as blank, unpainted kits with configurations such as armatures. The studio also carries other sculptors' work, which is credited separately."
  },
  {
    "slug": "maissa-said",
    "name": "Maissa Said",
    "website": "https://msartdolls.com/",
    "source": "https://msartdolls.com/pages/about-the-artist",
    "bio": "Toronto-based sculptor Maissa Said began working with one-of-a-kind baby dolls in 2010. Her hand-sculpted polymer-clay originals are reproduced in materials including silicone, vinyl and resin; her current site documents original blank full-body silicone kits."
  }
];
export const shopifyCohortKits:VerifiedKit[]=[
  {
    "slug": "amara-melody-hess",
    "name": "Amara",
    "artistSlug": "melody-hess",
    "material": "vinyl",
    "variantSource": "shopify",
    "sourceProductId": "7111282491426",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "edition": "Artist-listed limited edition of 800 kits",
    "sizeDescription": "20 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Melody Hess Dolls · official kit listing",
        "url": "https://www.melodyhessdolls.com/products/amara-vinyl-reborn-doll-kit",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/amara1.jpg?v=1662747874",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/amara-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/amara2.jpg?v=1662747874",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/amara-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/amara3.jpg?v=1662747874",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/amara-vinyl-reborn-doll-kit"
      }
    ]
  },
  {
    "slug": "vivia-melody-hess",
    "name": "Vivia",
    "artistSlug": "melody-hess",
    "material": "vinyl",
    "variantSource": "shopify",
    "sourceProductId": "7111274922018",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "edition": "Artist-listed limited edition of 800 kits",
    "sizeDescription": "19 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Melody Hess Dolls · official kit listing",
        "url": "https://www.melodyhessdolls.com/products/vivia-vinyl-reborn-doll-kit",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/vivia1.jpg?v=1662746735",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/vivia-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/vivia2.jpg?v=1662746735",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/vivia-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/vivia3.jpg?v=1662746735",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/vivia-vinyl-reborn-doll-kit"
      }
    ]
  },
  {
    "slug": "jupiter-melody-hess",
    "name": "Jupiter",
    "artistSlug": "melody-hess",
    "material": "vinyl",
    "variantSource": "shopify",
    "sourceProductId": "7110990528546",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "edition": "Artist-listed limited edition of 1500 kits",
    "sizeDescription": "23 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Melody Hess Dolls · official kit listing",
        "url": "https://www.melodyhessdolls.com/products/jupiter-vinyl-reborn-doll-kit",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/Jupiterfbcover.jpg?v=1662697103",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/jupiter-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/Jupiter_19.jpg?v=1662740303",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/jupiter-vinyl-reborn-doll-kit"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0587/0531/3826/products/Jupiter_23.jpg?v=1662740349",
        "credit": "Melody Hess Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://www.melodyhessdolls.com/products/jupiter-vinyl-reborn-doll-kit"
      }
    ]
  },
  {
    "slug": "cedar-kristin-englert",
    "name": "Cedar",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "10799894757687",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "20 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/cedar",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/3123ACD4-4DDA-4A6B-996E-4E831F49474B.jpg?v=1782408972",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/cedar"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/9A4CA1FF-5B90-4EB7-BDF0-5E001EA36417.jpg?v=1782408972",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/cedar"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/8DC2D6E8-EC73-454F-97FF-C3BFA34A9C67.jpg?v=1782408973",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/cedar"
      }
    ],
    "variants": [
      {
        "id": "52522364830007",
        "label": "Girl",
        "options": {
          "Cedar": "Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "52522364862775",
        "label": "Girl with arm armature",
        "options": {
          "Cedar": "Girl with arm armature"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "52522364895543",
        "label": "Girl with arm and leg armatures",
        "options": {
          "Cedar": "Girl with arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "52522364928311",
        "label": "Boy",
        "options": {
          "Cedar": "Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "52522364961079",
        "label": "Boy with arm armatures",
        "options": {
          "Cedar": "Boy with arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "52522364993847",
        "label": "Boy with arm and leg armatures",
        "options": {
          "Cedar": "Boy with arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/cedar",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "sydney-kristin-englert",
    "name": "Sydney",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "10442387521847",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/0A636960-EBB0-4D7B-8BFF-98BD7DB1567D.jpg?v=1772121841",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/sydney-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/164F6CE8-F89D-439A-A0B6-DDB24D2C333D.jpg?v=1772121841",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/sydney-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/3D6E480B-0C35-454C-802C-53DFD1104343.jpg?v=1772121841",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/sydney-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "51724501287223",
        "label": "Girl no armatures",
        "options": {
          "Sydney": "Girl no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51724501319991",
        "label": "Girl with arm armatures",
        "options": {
          "Sydney": "Girl with arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51724501352759",
        "label": "Girl with arm and leg armatures",
        "options": {
          "Sydney": "Girl with arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51724501385527",
        "label": "Boy no armatures",
        "options": {
          "Sydney": "Boy no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51724501418295",
        "label": "Boy with arm armatures",
        "options": {
          "Sydney": "Boy with arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51724501451063",
        "label": "Boy with arm and leg armatures",
        "options": {
          "Sydney": "Boy with arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/sydney-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "olive-kristin-englert",
    "name": "Olive",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "10432481984823",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "16 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/5620C668-F97C-4381-ADEB-0ED8D783AA22.jpg?v=1771269352",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/olive-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/C6DAED57-8398-4738-B5C3-6CC1C6E6C4BC.jpg?v=1771269353",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/olive-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/1B30110A-E356-46B4-9A3E-93487AAAF4C0.jpg?v=1771269352",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/olive-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "51691824709943",
        "label": "Girl no armatures",
        "options": {
          "Olive": "Girl no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51691824742711",
        "label": "Girl with Arm armatures",
        "options": {
          "Olive": "Girl with Arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51691824775479",
        "label": "Girl with Arm and Leg armatures",
        "options": {
          "Olive": "Girl with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51691824808247",
        "label": "Boy no armatures",
        "options": {
          "Olive": "Boy no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51691824841015",
        "label": "Boy with Arm armatures",
        "options": {
          "Olive": "Boy with Arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51691824873783",
        "label": "Boy with Arm and Leg armatures",
        "options": {
          "Olive": "Boy with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/olive-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "ava-kristin-englert",
    "name": "Ava",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "10338232959287",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "16 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/994925AC-0971-492C-A40F-7EC60932139D.jpg?v=1762956494",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ava-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/14363D5C-D4C5-441C-A26E-2774A8FDF8EA.jpg?v=1762956494",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ava-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/6D89C4B9-EAE8-437E-8F9D-BFC1B05C6CFD.jpg?v=1762956494",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ava-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "51335998406967",
        "label": "Girl no armatures",
        "options": {
          "Ava": "Girl no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51335998439735",
        "label": "Girl with Arm armatures",
        "options": {
          "Ava": "Girl with Arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51335998472503",
        "label": "Girl with Arm and Leg armatures",
        "options": {
          "Ava": "Girl with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51335998505271",
        "label": "Boy no armatures",
        "options": {
          "Ava": "Boy no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51335998538039",
        "label": "Boy with Arm armatures",
        "options": {
          "Ava": "Boy with Arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "51335998570807",
        "label": "Boy with Arm and Leg armatures",
        "options": {
          "Ava": "Boy with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ava-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "sisley-kristin-englert",
    "name": "Sisley",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "10209586970935",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/31D7A1D4-D439-4CA6-AB17-506FE148CF2B.jpg?v=1750470539",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/untitled-jun20_20-11"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/436109E1-7B5B-4932-83E1-1559EDDB9A60.jpg?v=1750470539",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/untitled-jun20_20-11"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/50D0580C-8EA1-405D-82EF-73CE3D3A4895.jpg?v=1750470539",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/untitled-jun20_20-11"
      }
    ],
    "variants": [
      {
        "id": "50740227309879",
        "label": "Sisley Girl",
        "options": {
          "Sisley": "Sisley Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50740227342647",
        "label": "Sisley boy",
        "options": {
          "Sisley": "Sisley boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50740227375415",
        "label": "Sisley girl arm armature",
        "options": {
          "Sisley": "Sisley girl arm armature"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50740227408183",
        "label": "Sisley girl arm and leg armatures",
        "options": {
          "Sisley": "Sisley girl arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50740227440951",
        "label": "Sisley boy arm armature",
        "options": {
          "Sisley": "Sisley boy arm armature"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50740227473719",
        "label": "Sisley boy arm and leg armatures",
        "options": {
          "Sisley": "Sisley boy arm and leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/untitled-jun20_20-11",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "pennie-kristin-englert",
    "name": "Pennie",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9976558616887",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "18 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/8567C0E2-821E-4894-A5A0-E69194B276D8.jpg?v=1736958705",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pennie-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/956E0F8B-74AD-4FAE-B2F0-B2B30A571AE5.jpg?v=1736958706",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pennie-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/7682C41A-41F9-4C7F-8E80-04D3226B7C7B.jpg?v=1736958705",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pennie-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "50034836767031",
        "label": "Pennie as a Girl",
        "options": {
          "Pennie": "Pennie as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50034836799799",
        "label": "Pennie a Girl with arm armatures",
        "options": {
          "Pennie": "Pennie a Girl with arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50034836832567",
        "label": "Pennie as a Boy",
        "options": {
          "Pennie": "Pennie as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50034836865335",
        "label": "Pennie as a Boy with arm armatures",
        "options": {
          "Pennie": "Pennie as a Boy with arm armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50034836898103",
        "label": "Pennie as a girl with Arm and Leg armatures",
        "options": {
          "Pennie": "Pennie as a girl with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "50034836930871",
        "label": "Pennie as a boy with Arm and Leg armatures",
        "options": {
          "Pennie": "Pennie as a boy with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pennie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "izabel-kristin-englert",
    "name": "Izabel",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9922244673847",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/izabel-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/4AB74453-752C-40E0-9643-618D76266432.jpg?v=1730245900",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/izabel-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/6AB55C52-1FB0-481B-9598-0B9CE6DE7241.jpg?v=1730245900",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/izabel-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/F2F5785F-A9B3-4966-B314-4F90C7210F41.jpg?v=1730245900",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/izabel-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "49862437896503",
        "label": "Izabel as a Girl",
        "options": {
          "Izabel": "Izabel as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/izabel-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49862437929271",
        "label": "Izabel Girl with armatures",
        "options": {
          "Izabel": "Izabel Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/izabel-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49862437962039",
        "label": "Izabel as a Boy",
        "options": {
          "Izabel": "Izabel as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/izabel-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49862437994807",
        "label": "Izabel Boy with armatures",
        "options": {
          "Izabel": "Izabel Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/izabel-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "clementine-kristin-englert",
    "name": "Clementine",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9876948975927",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/76301D91-9BFC-4BC6-B9F5-AA02EC7B567B.jpg?v=1727716935",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/clementine-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/C8B2AB4E-294E-4AE5-A3C7-904F4B7F5EF3.jpg?v=1727716935",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/clementine-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/844DA71F-76FC-423E-8A4D-6FA4B5ED9792.jpg?v=1727716935",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/clementine-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "49735939948855",
        "label": "Clementine as a Girl",
        "options": {
          "Clementine ": "Clementine as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49735939981623",
        "label": "Clementine a Girl with armatures",
        "options": {
          "Clementine ": "Clementine a Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49735940014391",
        "label": "Clementine as a Boy",
        "options": {
          "Clementine ": "Clementine as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49735940047159",
        "label": "Clementine as a Boy with armatures",
        "options": {
          "Clementine ": "Clementine as a Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49735942439223",
        "label": "Clementine as a girl with Arm and Leg armatures",
        "options": {
          "Clementine ": "Clementine as a girl with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49735942471991",
        "label": "Clementine as a boy with Arm and Leg armatures",
        "options": {
          "Clementine ": "Clementine as a boy with Arm and Leg armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/clementine-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "mellon-kristin-englert",
    "name": "Mellon",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9751800938807",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/mellon-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/E4AA0969-F974-4935-AB72-8EBE7FC7644E.png?v=1722018804",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mellon-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/3043D8EB-D6D1-45B8-90CC-546C61E6FF85.jpg?v=1722018652",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mellon-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/C85A7C4F-E68D-4661-8DCB-CE5967AE0404.jpg?v=1722018651",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mellon-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "49420504170807",
        "label": "Mellon as a Girl",
        "options": {
          "Mellon": "Mellon as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mellon-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49420504203575",
        "label": "Mellonas a Girl with armatures",
        "options": {
          "Mellon": "Mellonas a Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mellon-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49420504236343",
        "label": "Mellon as a Boy",
        "options": {
          "Mellon": "Mellon as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mellon-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49420504269111",
        "label": "Mellon as a Boy with armatures",
        "options": {
          "Mellon": "Mellon as a Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mellon-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "junie-kristin-englert",
    "name": "Junie",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9689574965559",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/junie-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/3519C465-21F1-4826-84FE-36042DC2317C.jpg?v=1755013310",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/junie-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/7F40C499-B319-48EB-A388-D254B4746FF6.jpg?v=1755013310",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/junie-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/6DE7F96C-DF23-4DFC-8CB7-6DA850EC57B1.jpg?v=1755013310",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/junie-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "49274877542711",
        "label": "Junie as a Girl",
        "options": {
          "Junie": "Junie as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/junie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49274877575479",
        "label": "Junie as a Girl with armatures",
        "options": {
          "Junie": "Junie as a Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/junie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49274877608247",
        "label": "Junie as a Boy",
        "options": {
          "Junie": "Junie as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/junie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "49274877641015",
        "label": "Junie as a Boy with armatures",
        "options": {
          "Junie": "Junie as a Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/junie-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "rue-kristin-englert",
    "name": "Rue",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9056986431799",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "12 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/rue-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_9916.jpg?v=1700432757",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rue-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_9913.jpg?v=1700432757",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rue-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_9919.jpg?v=1700432754",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rue-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "47650276573495",
        "label": "Rue no armatures",
        "options": {
          "Rue": "Rue no armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rue-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47650276606263",
        "label": "Rue with armatures in arms",
        "options": {
          "Rue": "Rue with armatures in arms"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rue-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47650276639031",
        "label": "Rue with armatures in arms and legs",
        "options": {
          "Rue": "Rue with armatures in arms and legs"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rue-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "ripley-kristin-englert",
    "name": "Ripley",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8701363847479",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "21.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_8361.jpg?v=1695603552",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ripley-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_E8359.jpg?v=1695603552",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ripley-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_E8293.jpg?v=1693179946",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/ripley-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "46797903921463",
        "label": "Ripley as a girl",
        "options": {
          "Ripley": "Ripley as a girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797903954231",
        "label": "Ripley as a girl with armatures",
        "options": {
          "Ripley": "Ripley as a girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797903986999",
        "label": "Ripley as a boy",
        "options": {
          "Ripley": "Ripley as a boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797904019767",
        "label": "Ripley as a boy with armatures",
        "options": {
          "Ripley": "Ripley as a boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/ripley-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "pippi-kristin-englert",
    "name": "Pippi",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8701330686263",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "20 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/pippi-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_E7551.jpg?v=1714229410",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pippi-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_7545.jpg?v=1714229410",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pippi-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_E7555.jpg?v=1714229410",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/pippi-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "46797845430583",
        "label": "Pippi as a Girl",
        "options": {
          "Pippi": "Pippi as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pippi-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797845463351",
        "label": "Pippi as a Girl with armatures",
        "options": {
          "Pippi": "Pippi as a Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pippi-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797845496119",
        "label": "Pippi as a Boy",
        "options": {
          "Pippi": "Pippi as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pippi-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46797845528887",
        "label": "Pippi as a Boy with armatures",
        "options": {
          "Pippi": "Pippi as a Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/pippi-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "rya-kristin-englert",
    "name": "Rya",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8480164020535",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "21.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/rya-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_4165.jpg?v=1694357660",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rya-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_4831.jpg?v=1694357660",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rya-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_4807.jpg?v=1694357660",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/rya-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "45799978959159",
        "label": "Rya as a girl",
        "options": {
          "Rya as a girl": "Rya as a girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rya-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795789500727",
        "label": "Rya as a girl with armatures",
        "options": {
          "Rya as a girl": "Rya as a girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rya-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795792482615",
        "label": "Rya as a boy",
        "options": {
          "Rya as a girl": "Rya as a boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rya-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795792843063",
        "label": "Rya as a boy with armatures",
        "options": {
          "Rya as a girl": "Rya as a boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/rya-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "mylah-kristin-englert",
    "name": "Mylah",
    "artistSlug": "kristin-englert",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8480154845495",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "21.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Silicone Art Dolls · official kit listing",
        "url": "https://siliconeartdolls.com/products/mylah-by-kristin-englert",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_5857.jpg?v=1695603652",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mylah-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/IMG_0446.jpg?v=1695603652",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mylah-by-kristin-englert"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0787/8495/4679/files/291965B9-769B-43E7-9BB6-9F5AF1BFA2E9.jpg?v=1695603652",
        "credit": "Silicone Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://siliconeartdolls.com/products/mylah-by-kristin-englert"
      }
    ],
    "variants": [
      {
        "id": "45799877378359",
        "label": "Mylah as a Girl",
        "options": {
          "Mylah as a girl": "Mylah as a Girl"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mylah-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795800445239",
        "label": "Mylah as a Girl with armatures",
        "options": {
          "Mylah as a girl": "Mylah as a Girl with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mylah-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795802575159",
        "label": "Mylah as a Boy",
        "options": {
          "Mylah as a girl": "Mylah as a Boy"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mylah-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46795803066679",
        "label": "Mylah as a Boy with armatures",
        "options": {
          "Mylah as a girl": "Mylah as a Boy with armatures"
        },
        "sourceUrl": "https://siliconeartdolls.com/products/mylah-by-kristin-englert",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "brielle-bobby-asleep-maissa-said",
    "name": "Brielle/Bobby Asleep",
    "artistSlug": "maissa-said",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "9251077980404",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "20 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Maissa Said Art Dolls · official kit listing",
        "url": "https://msartdolls.com/products/brielle-bobby-asleep",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/DSCN1043_17.jpg?v=1768861317",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/brielle-bobby-asleep"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/face.jpg?v=1770929201",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/brielle-bobby-asleep"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/6e7802ab-7cef-4d5d-b282-b15915d6b2ae.jpg?v=1783705272",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/brielle-bobby-asleep"
      }
    ],
    "variants": [
      {
        "id": "47347161661684",
        "label": "Super Soft Blend - Girl ($1950) / No Armature (+0$)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1950)",
          "Armature": "No Armature (+0$)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188728052",
        "label": "Super Soft Blend - Girl ($1950) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1950)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188760820",
        "label": "Super Soft Blend - Girl ($1950) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1950)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347161694452",
        "label": "Super Soft Blend - Boy ($1950) / No Armature (+0$)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1950)",
          "Armature": "No Armature (+0$)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188793588",
        "label": "Super Soft Blend - Boy ($1950) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1950)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188826356",
        "label": "Super Soft Blend - Boy ($1950) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1950)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347161727220",
        "label": "EcoFlex 20 - Girl ($1850) / No Armature (+0$)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Girl ($1850)",
          "Armature": "No Armature (+0$)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188859124",
        "label": "EcoFlex 20 - Girl ($1850) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Girl ($1850)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188891892",
        "label": "EcoFlex 20 - Girl ($1850) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Girl ($1850)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347161759988",
        "label": "EcoFlec 20 - Boy ($1850) / No Armature (+0$)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlec 20 - Boy ($1850)",
          "Armature": "No Armature (+0$)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188924660",
        "label": "EcoFlec 20 - Boy ($1850) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlec 20 - Boy ($1850)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "47347188957428",
        "label": "EcoFlec 20 - Boy ($1850) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlec 20 - Boy ($1850)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/brielle-bobby-asleep",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "annelene-andrew-asleep-maissa-said",
    "name": "Annelene/Andrew Asleep",
    "artistSlug": "maissa-said",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8194526970100",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "17.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Maissa Said Art Dolls · official kit listing",
        "url": "https://msartdolls.com/products/annelene-andrew-asleep",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/117078949_10157716544103299_5999227912624693054_n_704x480_crop_center_65708175-a9e7-4786-911a-d5c049d15b8d.webp?v=1694557343",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/annelene-andrew-asleep"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/DSC_5785_1_672x448_crop_center_21ab8a21-4b20-4993-a467-fb61c6a84dc3.webp?v=1695593448",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/annelene-andrew-asleep"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/DSC_5786_1_672x448_crop_center_09df68da-0436-460e-86bf-765ae7267182.webp?v=1695704709",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/annelene-andrew-asleep"
      }
    ],
    "variants": [
      {
        "id": "44139208868084",
        "label": "EcoFlex 20 Blend - Girl ($1550) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1550)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145636475124",
        "label": "EcoFlex 20 Blend - Girl ($1550) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1550)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "48570448380148",
        "label": "EcoFlex 20 Blend - Girl ($1550) / Arm and Leg Armature ($210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1550)",
          "Armature": "Arm and Leg Armature ($210)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44139208900852",
        "label": "EcoFlex 20 - Blend - Boy ($1550) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Blend - Boy ($1550)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145636737268",
        "label": "EcoFlex 20 - Blend - Boy ($1550) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Blend - Boy ($1550)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "48570448412916",
        "label": "EcoFlex 20 - Blend - Boy ($1550) / Arm and Leg Armature ($210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 - Blend - Boy ($1550)",
          "Armature": "Arm and Leg Armature ($210)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145636933876",
        "label": "Super Soft Blend - Girl ($1650) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1650)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145637032180",
        "label": "Super Soft Blend - Girl ($1650) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1650)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "48570448445684",
        "label": "Super Soft Blend - Girl ($1650) / Arm and Leg Armature ($210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1650)",
          "Armature": "Arm and Leg Armature ($210)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145637228788",
        "label": "Super Soft Blend - Boy ($1650) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1650)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "44145637327092",
        "label": "Super Soft Blend - Boy ($1650) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1650)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "48570448478452",
        "label": "Super Soft Blend - Boy ($1650) / Arm and Leg Armature ($210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1650)",
          "Armature": "Arm and Leg Armature ($210)"
        },
        "sourceUrl": "https://msartdolls.com/products/annelene-andrew-asleep",
        "verifiedAt": "2026-10-13"
      }
    ]
  },
  {
    "slug": "kaillie-kellan-asleep-maissa-said",
    "name": "Kaillie/Kellan Asleep",
    "artistSlug": "maissa-said",
    "material": "silicone",
    "variantSource": "shopify",
    "sourceProductId": "8574626234612",
    "statusLabel": "Original sculpt kit — check official source for availability",
    "statusChecked": "2026-10-13",
    "releaseInfo": "Original blank kit documented by the sculptor's official shop. Current availability, fulfilment time and price must be checked with the seller.",
    "sizeDescription": "19.5 inches (sculptor's kit listing)",
    "sources": [
      {
        "label": "Maissa Said Art Dolls · official kit listing",
        "url": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "kind": "artist"
      }
    ],
    "photos": [
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/DSC6363_704x480_crop_center_c20729fe-f3f8-4e44-947f-1eb835236706.webp?v=1715368233",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/kaillie-kellan-asleep-copy"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/329564734_746353420057648_5009509149846456777_n_4bdf6b83-d92e-4623-91e6-3a66ed1c0cc2.jpg?v=1737226896",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/kaillie-kellan-asleep-copy"
      },
      {
        "url": "https://cdn.shopify.com/s/files/1/0664/6743/0644/files/Blankkit_360fd93c-b5ee-4d10-8d3f-cd60e5c90f07.jpg?v=1737226896",
        "credit": "Maissa Said Art Dolls — artist-hosted product photography (photographer not independently verified)",
        "source": "https://msartdolls.com/products/kaillie-kellan-asleep-copy"
      }
    ],
    "variants": [
      {
        "id": "45175663493364",
        "label": "Super Soft Blend - Girl ($1850) / No Umbilical Cord Stump (+0) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663526132",
        "label": "Super Soft Blend - Girl ($1850) / No Umbilical Cord Stump (+0) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663558900",
        "label": "Super Soft Blend - Girl ($1850) / No Umbilical Cord Stump (+0) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663591668",
        "label": "Super Soft Blend - Girl ($1850) / Umbilical Cord Stump (+$75) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663624436",
        "label": "Super Soft Blend - Girl ($1850) / Umbilical Cord Stump (+$75) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663657204",
        "label": "Super Soft Blend - Girl ($1850) / Umbilical Cord Stump (+$75) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Girl ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663689972",
        "label": "Super Soft Blend - Boy ($1850) / No Umbilical Cord Stump (+0) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663722740",
        "label": "Super Soft Blend - Boy ($1850) / No Umbilical Cord Stump (+0) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663755508",
        "label": "Super Soft Blend - Boy ($1850) / No Umbilical Cord Stump (+0) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663788276",
        "label": "Super Soft Blend - Boy ($1850) / Umbilical Cord Stump (+$75) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663821044",
        "label": "Super Soft Blend - Boy ($1850) / Umbilical Cord Stump (+$75) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "45175663853812",
        "label": "Super Soft Blend - Boy ($1850) / Umbilical Cord Stump (+$75) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "Super Soft Blend - Boy ($1850)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589175540",
        "label": "EcoFlex 20 Blend - Girl ($1750) / No Umbilical Cord Stump (+0) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589208308",
        "label": "EcoFlex 20 Blend - Girl ($1750) / No Umbilical Cord Stump (+0) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589241076",
        "label": "EcoFlex 20 Blend - Girl ($1750) / No Umbilical Cord Stump (+0) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589273844",
        "label": "EcoFlex 20 Blend - Girl ($1750) / Umbilical Cord Stump (+$75) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589306612",
        "label": "EcoFlex 20 Blend - Girl ($1750) / Umbilical Cord Stump (+$75) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589339380",
        "label": "EcoFlex 20 Blend - Girl ($1750) / Umbilical Cord Stump (+$75) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Girl ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589372148",
        "label": "EcoFlex 20 Blend - Boy ($1750) / No Umbilical Cord Stump (+0) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589404916",
        "label": "EcoFlex 20 Blend - Boy ($1750) / No Umbilical Cord Stump (+0) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589437684",
        "label": "EcoFlex 20 Blend - Boy ($1750) / No Umbilical Cord Stump (+0) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "No Umbilical Cord Stump (+0)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589470452",
        "label": "EcoFlex 20 Blend - Boy ($1750) / Umbilical Cord Stump (+$75) / No Armature (+$0)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "No Armature (+$0)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589503220",
        "label": "EcoFlex 20 Blend - Boy ($1750) / Umbilical Cord Stump (+$75) / Arm Armature (+$155)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm Armature (+$155)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      },
      {
        "id": "46007589535988",
        "label": "EcoFlex 20 Blend - Boy ($1750) / Umbilical Cord Stump (+$75) / Arm and Leg Armature (+$210)",
        "options": {
          "Silicone Type and Gender of Doll": "EcoFlex 20 Blend - Boy ($1750)",
          "Umbilical Cord Stump": "Umbilical Cord Stump (+$75)",
          "Armature": "Arm and Leg Armature (+$210)"
        },
        "sourceUrl": "https://msartdolls.com/products/kaillie-kellan-asleep-copy",
        "verifiedAt": "2026-10-13"
      }
    ]
  }
];
