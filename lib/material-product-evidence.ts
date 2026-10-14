/** Reborna evidence from read-only exact retailer product sources (14 Oct 2026).
 * Original Shopify product photos stay on credited retailer CDNs; not mirrored.
 * Not a licence assertion, live stock feed, or guarantee of variant availability.
 * Source evidence: snapshots/materials/product-images-variants.json and product-exceptions.json
 */
export type MaterialPhoto={url:string;source:string;credit:string};
export type MaterialSourceVariant={label:string;options:string[];observedPrice?:string};
export type MaterialSourceProduct={title:string;sourceUrl:string;photos:MaterialPhoto[];optionNames:string[];variants:MaterialSourceVariant[];priceAtReview?:string};
export type MaterialProductEvidence={sourceChecked:string;products:MaterialSourceProduct[];identityBasis:string};
export type MaterialShippingPolicy={basedIn:string;summary:string;international:string;source:string};
export const materialShippingPolicies:Record<string,MaterialShippingPolicy>={
  "Bountiful Baby": {
    "basedIn": "United States",
    "summary": "The supplier publishes a US and international shipping policy. International orders may incur customs duties and delivery exclusions; your destination and final charges must be checked at checkout.",
    "international": "Supplier advertises international shipping",
    "source": "https://www.bountifulbaby.com/pages/shipping-policy"
  },
  "Pixie Kissed Babies": {
    "basedIn": "United Kingdom",
    "summary": "The supplier states that it ships worldwide. The eligible destinations, shipping options and charges for this item are determined at checkout.",
    "international": "Supplier states worldwide shipping",
    "source": "https://pixiekissedbabies-boutique.com/"
  },
  "Kebelka": {
    "basedIn": "Spain",
    "summary": "We have verified this Spanish store and its published product catalogue, but we have not independently confirmed its full delivery-country list. Check shipping eligibility and charges with the supplier.",
    "international": "Destinations not independently verified",
    "source": "https://www.kebelka.com/pinturas-para-reborn/"
  }
};
export const materialProductEvidence:Record<string,MaterialProductEvidence>={
  "gemini-heat-set": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Complete Set of EIGHT Custom Gemini® Heat Set Paints - #6723",
        "sourceUrl": "https://www.bountifulbaby.com/products/complete-set-of-eight-custom-gemini-heat-set-paints-6723",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/files/6723_bc1afc8c-c396-4f99-a3fc-1c458867f0d4.png?v=1727228147",
            "source": "https://www.bountifulbaby.com/products/complete-set-of-eight-custom-gemini-heat-set-paints-6723",
            "credit": "Bountiful Baby — named Complete Set of EIGHT Custom Gemini® Heat Set Paints - #6723 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$52.39"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "alva-go-heat-set": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Heat Set Reborn Paint: Alva & Go 5ml",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/background-editor_output_900797c4-d430-4286-8391-c6774c1973fd.png?v=1724092614",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/background-editor_output_50901901-d6de-4a78-98c2-97bcd8e1c243.png?v=1724092614",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/04_c2a619fc-b737-4bc1-bcc1-a4461229dd84.webp?v=1732815940",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/00_1c10343e-3de6-4919-9b1c-fdb8df773d68.webp?v=1732816005",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/01_32d26c36-96bd-47a7-9e02-ab2e0c8d4985.webp?v=1732816025",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/02_c925f817-8941-4921-912e-4095fe6c3569.webp?v=1732816051",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/03_39d8a44b-669b-4564-af00-6d68f6e622b5.webp?v=1732816097",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/05_8e9da686-a9b0-4047-b172-32cf02a94cf0.webp?v=1732816161",
            "source": "https://pixiekissedbabies-boutique.com/products/heat-set-reborn-paint-alva-go",
            "credit": "Pixie Kissed Babies — named Heat Set Reborn Paint: Alva & Go 5ml product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Colour"
        ],
        "variants": [
          {
            "label": "02: Carmine Red",
            "options": [
              "02: Carmine Red"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "005: ultramarine Blue",
            "options": [
              "005: ultramarine Blue"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "06: Cyan / Turquoise",
            "options": [
              "06: Cyan / Turquoise"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "07: Flesh 08",
            "options": [
              "07: Flesh 08"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "09: Black",
            "options": [
              "09: Black"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "10: Green",
            "options": [
              "10: Green"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "11: emerald green",
            "options": [
              "11: emerald green"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "12: Magenta",
            "options": [
              "12: Magenta"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "13: Purple",
            "options": [
              "13: Purple"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "15: Burnt Umber",
            "options": [
              "15: Burnt Umber"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "17: Lemon Yellow",
            "options": [
              "17: Lemon Yellow"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "18: Yellow Ochre",
            "options": [
              "18: Yellow Ochre"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "19: Raw Sienna",
            "options": [
              "19: Raw Sienna"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "21: Dark Quinacridone",
            "options": [
              "21: Dark Quinacridone"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "24: White",
            "options": [
              "24: White"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "35: Mint green",
            "options": [
              "35: Mint green"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Lilac",
            "options": [
              "Lilac"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Amarillo Yellow",
            "options": [
              "Amarillo Yellow"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "16 Flesh 01",
            "options": [
              "16 Flesh 01"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Flesh 02",
            "options": [
              "Flesh 02"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "21. Brunette",
            "options": [
              "21. Brunette"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Eyelid purple",
            "options": [
              "Eyelid purple"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Sky blue",
            "options": [
              "Sky blue"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Fresa (pink)",
            "options": [
              "Fresa (pink)"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Flesh 01 30ml",
            "options": [
              "Flesh 01 30ml"
            ],
            "observedPrice": "£22.50"
          },
          {
            "label": "Flesh 02 30ml",
            "options": [
              "Flesh 02 30ml"
            ],
            "observedPrice": "£22.50"
          },
          {
            "label": "Flesh 08 30ml",
            "options": [
              "Flesh 08 30ml"
            ],
            "observedPrice": "£22.50"
          }
        ],
        "priceAtReview": "From £7.50"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "ultimate-fusion": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Ultimate Fusion - Paint Colours (12ml)",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rangeimage.jpg?v=1710887953",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh01.webp?v=1710888237",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh02_f253ce1c-ae00-4238-861f-28a64c88d156.webp?v=1710888238",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh03.webp?v=1710888355",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh04_69c32b2a-d773-48e7-86a0-11544c59c439.webp?v=1710888356",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh05_98eb5722-bbc8-453f-ab4d-62d74cad55ca.webp?v=1710888355",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh06_8da4c077-90d7-436b-ba68-19de30b156af.webp?v=1710888355",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/flesh07.webp?v=1710888356",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-ultimate-fusion-15ml-paint-hair-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Paint Colours (12ml) product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Color"
        ],
        "variants": [
          {
            "label": "Flesh01",
            "options": [
              "Flesh01"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh02",
            "options": [
              "Flesh02"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh03",
            "options": [
              "Flesh03"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh04",
            "options": [
              "Flesh04"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh05",
            "options": [
              "Flesh05"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh06",
            "options": [
              "Flesh06"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh07",
            "options": [
              "Flesh07"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Flesh08",
            "options": [
              "Flesh08"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Baby pink skin",
            "options": [
              "Baby pink skin"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Aqua Vein",
            "options": [
              "Aqua Vein"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Blue Deep Vein",
            "options": [
              "Blue Deep Vein"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Green Vein",
            "options": [
              "Green Vein"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Newborn lip",
            "options": [
              "Newborn lip"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "toddler lip",
            "options": [
              "toddler lip"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "coral lip",
            "options": [
              "coral lip"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "berry ethnic lip",
            "options": [
              "berry ethnic lip"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "deep newborn lips",
            "options": [
              "deep newborn lips"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "strawberry and cream skin blush",
            "options": [
              "strawberry and cream skin blush"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "strawberry and cream skin lips",
            "options": [
              "strawberry and cream skin lips"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "strawberry and cream skin creases",
            "options": [
              "strawberry and cream skin creases"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "peaches and cream skin blush",
            "options": [
              "peaches and cream skin blush"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "peaches and cream skin lips",
            "options": [
              "peaches and cream skin lips"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "peaches and cream skin creases",
            "options": [
              "peaches and cream skin creases"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "sweetheart blush",
            "options": [
              "sweetheart blush"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "sweetheart lips",
            "options": [
              "sweetheart lips"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "sweetheart creases",
            "options": [
              "sweetheart creases"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "brown",
            "options": [
              "brown"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "lips nails blush",
            "options": [
              "lips nails blush"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "red ochre",
            "options": [
              "red ochre"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "brown eyebrow",
            "options": [
              "brown eyebrow"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "raw umber",
            "options": [
              "raw umber"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Burnt umber",
            "options": [
              "Burnt umber"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Burnt Sienna",
            "options": [
              "Burnt Sienna"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Red Wine",
            "options": [
              "Red Wine"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Yellow Ochre",
            "options": [
              "Yellow Ochre"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Yellow Warm",
            "options": [
              "Yellow Warm"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Cadmium Yellow",
            "options": [
              "Cadmium Yellow"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Bismuth Yellow",
            "options": [
              "Bismuth Yellow"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Fluorescent pink",
            "options": [
              "Fluorescent pink"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Fluorescent yellow",
            "options": [
              "Fluorescent yellow"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Fluorescent blue",
            "options": [
              "Fluorescent blue"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Dioxazine Purple",
            "options": [
              "Dioxazine Purple"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Orange (secondary)",
            "options": [
              "Orange (secondary)"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Viridian Green",
            "options": [
              "Viridian Green"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Cobalt Blue",
            "options": [
              "Cobalt Blue"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Warm Red",
            "options": [
              "Warm Red"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Cool Red",
            "options": [
              "Cool Red"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Pthalo Blue",
            "options": [
              "Pthalo Blue"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Ultramarine Blue",
            "options": [
              "Ultramarine Blue"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Blue Vein",
            "options": [
              "Blue Vein"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "magenta",
            "options": [
              "magenta"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Black",
            "options": [
              "Black"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "White",
            "options": [
              "White"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Flesh Base",
            "options": [
              "Flesh Base"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Diarylide Yellow",
            "options": [
              "Diarylide Yellow"
            ],
            "observedPrice": "£8.00"
          },
          {
            "label": "Ethnic Green Vein",
            "options": [
              "Ethnic Green Vein"
            ],
            "observedPrice": "£7.50"
          }
        ],
        "priceAtReview": "From £7.50"
      },
      {
        "title": "Ultimate Fusion - Primary colours",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primarysettrimmed.jpg?v=1711313480",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryred.webp?v=1711313481",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryyellow.webp?v=1711313480",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryblue.webp?v=1711313481",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryyellow.jpg?v=1711313479",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryblue.jpg?v=1711313480",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/primaryredsmall.webp?v=1711313541",
            "source": "https://pixiekissedbabies-boutique.com/products/ultimate-fusion-primary-colours",
            "credit": "Pixie Kissed Babies — named Ultimate Fusion - Primary colours product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Color",
          "Size"
        ],
        "variants": [
          {
            "label": "Primary Red / 12ml",
            "options": [
              "Primary Red",
              "12ml"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Primary Red / 30ml",
            "options": [
              "Primary Red",
              "30ml"
            ],
            "observedPrice": "£16.00"
          },
          {
            "label": "Primary Blue / 12ml",
            "options": [
              "Primary Blue",
              "12ml"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Primary Blue / 30ml",
            "options": [
              "Primary Blue",
              "30ml"
            ],
            "observedPrice": "£16.00"
          },
          {
            "label": "Primary Yellow / 12ml",
            "options": [
              "Primary Yellow",
              "12ml"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "Primary Yellow / 30ml",
            "options": [
              "Primary Yellow",
              "30ml"
            ],
            "observedPrice": "£16.00"
          }
        ],
        "priceAtReview": "From £7.50"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "kebelka-heat-paints": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "33 Coral / KEBELKA Set Heat Paint",
        "sourceUrl": "https://www.kebelka.com/p/33-coral-pintura-para-reborn/",
        "photos": [
          {
            "url": "https://bf8e9a3a4a.clvaw-cdnwnd.com/58124a82fe217f7f7effd91439ff36b3/200003077-6e81c6e81e/700/Copia%20de%20NUEVOS%20TONOS%20%2823%29-8.png?ph=bf8e9a3a4a",
            "source": "https://www.kebelka.com/p/33-coral-pintura-para-reborn/",
            "credit": "Kebelka — named 33 Coral / KEBELKA Set Heat Paint product gallery (photographer not independently identified)"
          },
          {
            "url": "https://bf8e9a3a4a.clvaw-cdnwnd.com/58124a82fe217f7f7effd91439ff36b3/200003082-ca6a4ca6a5/33%20CORAL-7.png?ph=bf8e9a3a4a",
            "source": "https://www.kebelka.com/p/33-coral-pintura-para-reborn/",
            "credit": "Kebelka — named 33 Coral / KEBELKA Set Heat Paint product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "From €2.99"
      }
    ],
    "identityBasis": "Named Kebelka 33 Coral source product page; no programme-wide shade-variant feed available"
  },
  "enfis-silicone": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/background-editor_output_3649f87d-bb21-42a3-82c6-36de9bc87a2b.png?v=1725394150",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20200818_162339.jpg?v=1597765075",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/masterwinglogowithtext_eb9f3bb4-7e4c-4736-b170-4234230b59b3.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/white_6148c43b-1857-4cff-be9f-6f1c9cbbdc71.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/grassgreen_cdac2d1c-fd0b-4578-998f-6341a6997023.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/eggyolk_2d43065f-9279-48b7-85e0-6b1ae473f13d.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/teal_fddeec29-4785-4a36-ac04-31b131d07533.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/peacockblue_4e1f3d75-e623-4548-a101-640be09c147c.jpg?v=1597765062",
            "source": "https://pixiekissedbabies-boutique.com/products/copy-of-silicone-painting-starter-set-enfis-nature-colours-plus-psycho-paint",
            "credit": "Pixie Kissed Babies — named Silicone Pigments - Enfis Nature Colours 11 colour pigment trial kit (NO CLEAR PAINT BASE INCLUDED IN THIS SET product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "£80.00"
      },
      {
        "title": "Enfis Professional Silicone Pigments - Flesh Colours",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_180926.jpg?v=1654363910",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_180935.jpg?v=1654363910",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_180825.jpg?v=1654363912",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_181036.jpg?v=1654363911",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_181105.jpg?v=1654363911",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_181123.jpg?v=1654363911",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_181132.jpg?v=1654363911",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20220604_181140.jpg?v=1654363910",
            "source": "https://pixiekissedbabies-boutique.com/products/enfis-professional-silicone-pigments-flesh-colours",
            "credit": "Pixie Kissed Babies — named Enfis Professional Silicone Pigments - Flesh Colours product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Size",
          "Colour"
        ],
        "variants": [
          {
            "label": "50g / 101",
            "options": [
              "50g",
              "101"
            ],
            "observedPrice": "£14.99"
          },
          {
            "label": "50g / 201",
            "options": [
              "50g",
              "201"
            ],
            "observedPrice": "£14.99"
          },
          {
            "label": "50g / 301",
            "options": [
              "50g",
              "301"
            ],
            "observedPrice": "£14.99"
          },
          {
            "label": "50g / 401",
            "options": [
              "50g",
              "401"
            ],
            "observedPrice": "£14.99"
          },
          {
            "label": "50g / 501",
            "options": [
              "50g",
              "501"
            ],
            "observedPrice": "£14.99"
          },
          {
            "label": "100g / 101",
            "options": [
              "100g",
              "101"
            ],
            "observedPrice": "£18.99"
          },
          {
            "label": "100g / 201",
            "options": [
              "100g",
              "201"
            ],
            "observedPrice": "£18.99"
          },
          {
            "label": "100g / 301",
            "options": [
              "100g",
              "301"
            ],
            "observedPrice": "£18.99"
          },
          {
            "label": "100g / 401",
            "options": [
              "100g",
              "401"
            ],
            "observedPrice": "£18.99"
          },
          {
            "label": "100g / 501",
            "options": [
              "100g",
              "501"
            ],
            "observedPrice": "£18.99"
          }
        ],
        "priceAtReview": "From £14.99"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "hp-babylocks": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE***",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/mohair",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/straighttowavy.png?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4001BabyBrownsmall_2000x_d14dda5b-cec3-4b85-84c1-923f1c501008.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4007GoldenBlondsmall_600x_73a453e8-e571-44e5-92b3-f45599cc2377.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/FB_IMG_1597166446839.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4009NaturalBlondsmall_2000x_5b03242a-830d-4d7b-93a3-c8f1a2ff6691.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4006DarkBrownsmall_2000x_4e804d34-a120-4cd3-b61a-06fa119231c1.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4003ChocolateBrownsmall_2000x_5d705433-12c8-47cf-a840-4c019b26ea4d.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/4011Chestnutsmall_600x_dd849525-cc0f-4ef1-aaab-30cb8d6d74d2.jpg?v=1652785283",
            "source": "https://pixiekissedbabies-boutique.com/products/mohair",
            "credit": "Pixie Kissed Babies — named HP Babylocks Premium Mohair STRAIGHT TO WAVY  ***17 COLOURS AVAILABLE*** product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Color",
          "Style"
        ],
        "variants": [
          {
            "label": "Natural blonde / Wavy to Straight",
            "options": [
              "Natural blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Nordic blonde / Wavy to Straight",
            "options": [
              "Nordic blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Golden blonde / Wavy to Straight",
            "options": [
              "Golden blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Baby blonde / Wavy to Straight",
            "options": [
              "Baby blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Dark Blonde / Wavy to Straight",
            "options": [
              "Dark Blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Honey Blonde / Wavy to Straight",
            "options": [
              "Honey Blonde",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Copper gold / Wavy to Straight",
            "options": [
              "Copper gold",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Copper Red / Wavy to Straight",
            "options": [
              "Copper Red",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Ruby Red *NEW / Wavy to Straight",
            "options": [
              "Ruby Red *NEW",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Chestnut / Wavy to Straight",
            "options": [
              "Chestnut",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Light brown / Wavy to Straight",
            "options": [
              "Light brown",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Baby brown / Wavy to Straight",
            "options": [
              "Baby brown",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Chocolate brown / Wavy to Straight",
            "options": [
              "Chocolate brown",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Mocha **NEW** / Wavy to Straight",
            "options": [
              "Mocha **NEW**",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Dark brown / Wavy to Straight",
            "options": [
              "Dark brown",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          },
          {
            "label": "Black / Wavy to Straight",
            "options": [
              "Black",
              "Wavy to Straight"
            ],
            "observedPrice": "£59.99"
          }
        ],
        "priceAtReview": "£59.99"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "nuborn-mohair": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "1/4 oz NuBorn Mohair Dark Brown - Curve 6M2 - #5629",
        "sourceUrl": "https://www.bountifulbaby.com/products/5629",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/files/darkbrowncurve.png?v=1768434711",
            "source": "https://www.bountifulbaby.com/products/5629",
            "credit": "Bountiful Baby — named 1/4 oz NuBorn Mohair Dark Brown - Curve 6M2 - #5629 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$19.95"
      },
      {
        "title": "1/4 oz NuBorn Mohair Light Brown - Curve 6SP - #5634",
        "sourceUrl": "https://www.bountifulbaby.com/products/5634",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/products/lightbrowncurve_grande_53b577b9-f763-40cf-8b5b-ff834e10d6da.jpg?v=1528217024",
            "source": "https://www.bountifulbaby.com/products/5634",
            "credit": "Bountiful Baby — named 1/4 oz NuBorn Mohair Light Brown - Curve 6SP - #5634 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$19.95"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "german-glass-eyes": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm)",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20210612_090427.jpg?v=1623486264",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20201112_113826.jpg?v=1623486264",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20201112_113836.jpg?v=1623486264",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20201112_113748.jpg?v=1623486264",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20210612_090443.jpg?v=1623486264",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_b4ee9e19-42bd-42c3-bc74-e5e623d47104.jpg?v=1782976297",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_2ffb9475-ac05-46f6-a8ba-94ddeba8f889.jpg?v=1782976629",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_dbdd1dc3-99a5-4441-b2f8-23162dfd4570.jpg?v=1782976710",
            "source": "https://pixiekissedbabies-boutique.com/products/german-flat-back-glass-eyes-saturn-large-iris-2-colours",
            "credit": "Pixie Kissed Babies — named German Neptune flat back glass eyes for dolls  - large iris (3 colours,14mm to 22mm) product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Size",
          "Color"
        ],
        "variants": [
          {
            "label": "14mm / Newborn Blue",
            "options": [
              "14mm",
              "Newborn Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "14mm / Baby Blue",
            "options": [
              "14mm",
              "Baby Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "16mm / Newborn Blue",
            "options": [
              "16mm",
              "Newborn Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "17mm / Newborn Blue",
            "options": [
              "17mm",
              "Newborn Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "18mm pair / Baby Blue",
            "options": [
              "18mm pair",
              "Baby Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "20mm pair / Baby Blue",
            "options": [
              "20mm pair",
              "Baby Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "20mm pair / Chestnut Brown",
            "options": [
              "20mm pair",
              "Chestnut Brown"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "22mm / Newborn Blue",
            "options": [
              "22mm",
              "Newborn Blue"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "14mm / Chestnut brown",
            "options": [
              "14mm",
              "Chestnut brown"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "17mm / Chestnut Brown",
            "options": [
              "17mm",
              "Chestnut Brown"
            ],
            "observedPrice": "£24.99"
          }
        ],
        "priceAtReview": "£24.99"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "bountiful-baby-eyes": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "18mm Baby Brown - Bountiful Baby Eyes - 1 Pair - #2321",
        "sourceUrl": "https://www.bountifulbaby.com/products/2321",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/products/babybrown_caf31e68-ef72-4224-be38-e53aa7767aa5.jpg?v=1528150766",
            "source": "https://www.bountifulbaby.com/products/2321",
            "credit": "Bountiful Baby — named 18mm Baby Brown - Bountiful Baby Eyes - 1 Pair - #2321 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$8.95"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "rooting-needles-uk": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Pixie Kissed Rooting (hair punch) needles Very Fine 46G/43G/42G Crown",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/pixie-kissed-rooting-hair-punching-needles-very-fine-46g-crown",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/FN_Composing_23_content_picture.jpg?v=1652726992",
            "source": "https://pixiekissedbabies-boutique.com/products/pixie-kissed-rooting-hair-punching-needles-very-fine-46g-crown",
            "credit": "Pixie Kissed Babies — named Pixie Kissed Rooting (hair punch) needles Very Fine 46G/43G/42G Crown product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/740325_orig.jpg?v=1652726992",
            "source": "https://pixiekissedbabies-boutique.com/products/pixie-kissed-rooting-hair-punching-needles-very-fine-46g-crown",
            "credit": "Pixie Kissed Babies — named Pixie Kissed Rooting (hair punch) needles Very Fine 46G/43G/42G Crown product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/DSC08869.jpg?v=1784034034",
            "source": "https://pixiekissedbabies-boutique.com/products/pixie-kissed-rooting-hair-punching-needles-very-fine-46g-crown",
            "credit": "Pixie Kissed Babies — named Pixie Kissed Rooting (hair punch) needles Very Fine 46G/43G/42G Crown product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Style",
          "Size",
          "Pack Size"
        ],
        "variants": [
          {
            "label": "Crown / 46G / 5 pack",
            "options": [
              "Crown",
              "46G",
              "5 pack"
            ],
            "observedPrice": "£4.99"
          },
          {
            "label": "Crown / 46G / 10 pack",
            "options": [
              "Crown",
              "46G",
              "10 pack"
            ],
            "observedPrice": "£8.99"
          },
          {
            "label": "Crown / 43G / 5 pack",
            "options": [
              "Crown",
              "43G",
              "5 pack"
            ],
            "observedPrice": "£4.99"
          },
          {
            "label": "Crown / 43G / 10 pack",
            "options": [
              "Crown",
              "43G",
              "10 pack"
            ],
            "observedPrice": "£8.99"
          },
          {
            "label": "Crown / 42G / 5 pack",
            "options": [
              "Crown",
              "42G",
              "5 pack"
            ],
            "observedPrice": "£4.99"
          },
          {
            "label": "Crown / 42G / 10 pack",
            "options": [
              "Crown",
              "42G",
              "10 pack"
            ],
            "observedPrice": "£4.99"
          }
        ],
        "priceAtReview": "From £4.99"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "rooting-needles-us": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "5 Pre-Cut 42 Gauge CROWN Needles - #4494",
        "sourceUrl": "https://www.bountifulbaby.com/products/4494",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/products/ultratipsmall_grande_360e64f5-c9bb-4b05-a8bb-0f8ee5195830.jpg?v=1523749420",
            "source": "https://www.bountifulbaby.com/products/4494",
            "credit": "Bountiful Baby — named 5 Pre-Cut 42 Gauge CROWN Needles - #4494 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$11.95"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "texture-sponges": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Stippling sponges - 3 effect sizes (for silicone or vinyl painting)",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20210108_122203.jpg?v=1610108591",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/1454_Stoppelschwamm_gif_1024x1024_73286928-c66b-40cd-89cd-30166779e086.gif?v=1610108591",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20210108_122754.jpg?v=1610109066",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/products/20210108_122939.jpg?v=1610109066",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_cde4f832-4555-404c-aa46-335c1d6cdb99.jpg?v=1783352889",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_77f480bb-b2c6-4827-92e1-f38896fd93c7.jpg?v=1783352889",
            "source": "https://pixiekissedbabies-boutique.com/products/pack-of-3-stippling-sponges-black",
            "credit": "Pixie Kissed Babies — named Stippling sponges - 3 effect sizes (for silicone or vinyl painting) product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "pack"
        ],
        "variants": [
          {
            "label": "3 x black medium",
            "options": [
              "3 x black medium"
            ],
            "observedPrice": "£6.50"
          },
          {
            "label": "3 x white fine",
            "options": [
              "3 x white fine"
            ],
            "observedPrice": "£6.50"
          },
          {
            "label": "twin pack 1 medium/1 coarse",
            "options": [
              "twin pack 1 medium/1 coarse"
            ],
            "observedPrice": "£6.00"
          },
          {
            "label": "triple pack 1 of each type",
            "options": [
              "triple pack 1 of each type"
            ],
            "observedPrice": "£7.50"
          },
          {
            "label": "3 x blue coarse",
            "options": [
              "3 x blue coarse"
            ],
            "observedPrice": "£6.50"
          }
        ],
        "priceAtReview": "From £6.00"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "cloth-bodies": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "19\" Premium Gathered Body for Full Limbs - #3650",
        "sourceUrl": "https://www.bountifulbaby.com/products/3650",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/products/3585_1024_c6a6ab59-b187-499a-ad4b-dc9bf75c8fe1.jpg?v=1570227190",
            "source": "https://www.bountifulbaby.com/products/3650",
            "credit": "Bountiful Baby — named 19\" Premium Gathered Body for Full Limbs - #3650 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$19.95"
      },
      {
        "title": "19-20\" Premium Gathered Body for Full Limbs - #3585",
        "sourceUrl": "https://www.bountifulbaby.com/products/3585",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/0001/8618/7833/products/3585_1024.jpg?v=1570203235",
            "source": "https://www.bountifulbaby.com/products/3585",
            "credit": "Bountiful Baby — named 19-20\" Premium Gathered Body for Full Limbs - #3585 product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [],
        "variants": [],
        "priceAtReview": "$22.95"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  },
  "silicone-finishing": {
    "sourceChecked": "2026-10-14",
    "products": [
      {
        "title": "Silicone Velvet Matting Powder (select your size)",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20260422_111423.jpg?v=1776950441",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20250209-175026_2fecc887-c640-41fa-adf8-1f38a2c7b238.jpg?v=1739124890",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20250209-175037_e9b1c7dd-e014-45df-9b13-27809390e1fc.jpg?v=1739124929",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_powder_20g_in_hand.jpg?v=1776950448",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_powder_70g_bottle.jpg?v=1776950447",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_powder_150g_bottle.jpg?v=1776950448",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_powder_sample_jar_2ml_874b6400-7dcf-400c-830b-329efd486d7c.jpg?v=1776950445",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20260422_110948_529f3f45-de02-4d0d-a9a1-655e31868bba.jpg?v=1776950408",
            "source": "https://pixiekissedbabies-boutique.com/products/silicone-velvet-matte",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Matting Powder (select your size) product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "Size"
        ],
        "variants": [
          {
            "label": "7g refill bag (good for people with one doll)",
            "options": [
              "7g refill bag (good for people with one doll)"
            ],
            "observedPrice": "£15.99"
          },
          {
            "label": "Powder Bottle 15g (1/3 full)",
            "options": [
              "Powder Bottle 15g (1/3 full)"
            ],
            "observedPrice": "£24.99"
          },
          {
            "label": "20g  refill bag  (good for artists or people with multiple dolls)",
            "options": [
              "20g  refill bag  (good for artists or people with multiple dolls)"
            ],
            "observedPrice": "£25.99"
          },
          {
            "label": "Powder bottle 40g (3/4 full)",
            "options": [
              "Powder bottle 40g (3/4 full)"
            ],
            "observedPrice": "£40.00"
          },
          {
            "label": "70g refill bag for busy artists",
            "options": [
              "70g refill bag for busy artists"
            ],
            "observedPrice": "£67.00"
          },
          {
            "label": "150g  refill for professional artists",
            "options": [
              "150g  refill for professional artists"
            ],
            "observedPrice": "£135.00"
          },
          {
            "label": "artists gift multipack (6 x 2g sifter jars) plus gift cards (filled)",
            "options": [
              "artists gift multipack (6 x 2g sifter jars) plus gift cards (filled)"
            ],
            "observedPrice": "£30.00"
          },
          {
            "label": "SELF FILL artists gift sifters x 6 (empty) with gift cards",
            "options": [
              "SELF FILL artists gift sifters x 6 (empty) with gift cards"
            ],
            "observedPrice": "£15.00"
          },
          {
            "label": "2g mini sifter (sample)",
            "options": [
              "2g mini sifter (sample)"
            ],
            "observedPrice": "£6.95"
          }
        ],
        "priceAtReview": "From £6.95"
      },
      {
        "title": "Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff.",
        "sourceUrl": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
        "photos": [
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20260422_110948.jpg?v=1776939125",
            "source": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff. product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/20260422_110908.jpg?v=1776939124",
            "source": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff. product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_powder_sample_jar_2ml.jpg?v=1776939159",
            "source": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff. product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/silicone_velvet_sample_jar_2ml_side_view.jpg?v=1776939159",
            "source": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff. product gallery (photographer not independently identified)"
          },
          {
            "url": "https://cdn.shopify.com/s/files/1/1871/4057/files/rn-image_picker_lib_temp_bd1f6aeb-dd66-41ff-bde3-9df08140b546.jpg?v=1753114508",
            "source": "https://pixiekissedbabies-boutique.com/products/2g-silicone-velvet-sample-in-jar-with-puff",
            "credit": "Pixie Kissed Babies — named Silicone Velvet Doll Matting and Care Powder Mini Jar with Puff. product gallery (photographer not independently identified)"
          }
        ],
        "optionNames": [
          "pack size"
        ],
        "variants": [
          {
            "label": "single",
            "options": [
              "single"
            ],
            "observedPrice": "£6.95"
          },
          {
            "label": "three pack",
            "options": [
              "three pack"
            ],
            "observedPrice": "£18.00"
          },
          {
            "label": "12 pack for artists with gift cards",
            "options": [
              "12 pack for artists with gift cards"
            ],
            "observedPrice": "£65.00"
          }
        ],
        "priceAtReview": "From £6.95"
      }
    ],
    "identityBasis": "Named products and first-party Shopify product gallery. Product options retained only from the source; collection siblings are separate products."
  }
};
