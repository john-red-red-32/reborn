/** Identity-matched source photographs for historical sculpt discovery.
 * Each photo is tied to the exact artist-labelled source page/card. Empty or
 * generic limb images, duplicate kits, and any Ping Lau images from the artist's restricted gallery remain excluded.
 * Noncommercial retailer images from Irresistables have source-specific sharing terms. These are editor-reviewed references, not licensed assets.
 * Research: scrape-results/snapshots/image-review/dealer-archives-*.json;
 * public original sculptor product galleries consulted 2026-10-14.
 */
import type {VerifiedKit,ArtistImage} from "./real-catalogue";
export const recoveredKitPhotos:Record<string,NonNullable<VerifiedKit["photos"]>>={
  "lucas-elly-knoops": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Lucas-by-Elly-Knoops-1002.jpg",
      "credit": "Elly Knoops — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/elly-knoops"
    }
  ],
  "simon-iveta-eckertova": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/5346/images/67568/DSC_0412__63098.1724439445.500.750.jpg?c=2",
      "credit": "Iveta Eckertová — original product-page photograph",
      "source": "https://www.irresistables.com/simon-reborn-vinyl-doll-kit-by-iveta-eckertova-18-19/"
    }
  ],
  "marty-iveta-eckertova": [
    {
      "url": "https://static.wixstatic.com/media/dcc6dd_78ab719644304ddb883efe64c8f75ee3~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
      "credit": "Iveta Eckertová — original product-page photograph",
      "source": "https://www.dollli.uk/product-page/marty-doll-kit-by-iveta-eckertov%C3%A1-20"
    }
  ],
  "zoe-iveta-eckertova": [
    {
      "url": "https://www.bebaby.it/tshop/img/p/2/5/6/7/4/25674-home_default.jpg",
      "credit": "Iveta Eckertová — named retailer product photograph",
      "source": "https://www.bebaby.it/tshop/index.php?controller=category&id_category=837&id_lang=4"
    }
  ],
  "flower-the-elf-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5880/81804/821311463_10243261665254741_4110011727113917575_n__97905.1790276769.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "ilea-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5739/76781/6__42807.1773164339.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "yuna-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5691/75124/593301354_26002661609337553_634207060602836749_n__77340.1784755473.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "vian-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5597/73379/528570765_10214269129877628_7639472557233550693_n__90406.1754666406.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "alica-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5533/71463/495537971_10213718030780495_2014197799411602526_n__07856.1746480385.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "milan-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5417/69295/99__97521.1736304906.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "leano-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5378/68196/459776502_1714005516068503_8100710196024366449_n__63674.1726602999.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "levi-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5301/66560/441966563_8212892405407747_1759911828223029777_n__22275.1717532177.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "sebastian-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5018/59115/334528634_5934520399917656_4549645001769120434_n__28022.1678896471.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "oskar-olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/4496/50357/273746952_5417264754970540_1365738071040395852_n__57570.1644787895.jpg?c=2",
      "credit": "Olga Auer — named retailer product photograph",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/"
    }
  ],
  "maria-sabrina-hergarten": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/4314/images/45650/maria25__12815.1627073410.500.750.jpg?c=2",
      "credit": "Sabrina Hergarten — original product-page photograph",
      "source": "https://www.irresistables.com/maria-first-cry-reborn-vinyl-doll-kit-by-sabrina-hergarten-19/"
    }
  ],
  "mayla-sabrina-hergarten": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/3754/images/47082/241234191_10226835764984156_8626546225664315042_n__39205.1634784374.500.750.jpg?c=2",
      "credit": "Sabrina Hergarten — original product-page photograph",
      "source": "https://www.irresistables.com/mayla-reborn-vinyl-doll-kit-by-sabrina-hergarten-18-19/"
    }
  ],
  "alisha-sabrina-hergarten": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/3588/images/40117/136708425_10224924749609966_8766967972956326200_o__36696.1610329042.500.750.jpg?c=2",
      "credit": "Sabrina Hergarten — original product-page photograph",
      "source": "https://www.irresistables.com/alisha-reborn-vinyl-doll-kit-by-sabrina-hergarten-21/"
    }
  ],
  "amelia-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Amelia-by-Laura-Lee-Eagles-LE-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "americus-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Americus-by-Laura-Lee-Eagles-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "ashia-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Ashia-by-Laura-Lee-Eagles-004-k.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "atticus-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Atticus-by-Laura-Lee-Eagles-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "aurora-sky-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Aurora-Sky-by-Laura-Lee-Eagles-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "baby-birdie-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Baby-Birdie-by-Laura-Lee-Eagles-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "charlotte-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Charlotte-by-Laura-Lee-Eagles-001b.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "gertie-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Gertie-by-Laura-Lee-Eagles--1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "harmony-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Harmony-by-Laura-Lee-Eagles-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "knox-laura-lee-eagles": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Knox-by-Laura-Lee-Eagles-LE-1001.jpg",
      "credit": "Laura Lee Eagles — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/manufacturer/laura-lee-eagles"
    }
  ],
  "lyssi-laura-tuzio-ross": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5314/66894/447011129_970532525072579_8380893120348532936_n__05640.1719159786.jpg?c=2",
      "credit": "Irresistables — Lyssi by Laura Tuzio Ross, source-listed original kit photograph",
      "source": "https://www.irresistables.com/lyssi-reborn-vinyl-doll-kit-by-laura-tuzio-ross-23/"
    }
  ],
  "neikie-sabine-altenkirch-junkes": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5051/59641/344297816_800592794480575_2413506340892829516_n__95655.1684020770.jpg?c=2",
      "credit": "Irresistables — Neikie by Sabine Altenkirch, original kit example",
      "source": "https://www.irresistables.com/neikie-reborn-vinyl-doll-kit-by-sabine-altenkirch-limited-edition/"
    }
  ],
  "sam-gudrun-legler": [
    {
      "url": "https://files.ekmcdn.com/fairytales/resources/design/3301ac51-76c4-446d-8a8c-eeb2d0c953d5.jpeg",
      "credit": "Fairytales Reborn Nursery — Sam by Gudrun Legler, reborn example painted by Alicia Rodriguez",
      "source": "https://www.fairytalesrebornnursery.co.uk/sam-1553-p.asp"
    }
  ],
  "teddy-philomena-donnelly": [
    {
      "url": "https://static.wixstatic.com/media/e3ae82_803592d891c94f8d8990482f5d822211~mv2.jpg/v1/fill/w_480%2Ch_534%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/e3ae82_803592d891c94f8d8990482f5d822211~mv2.jpg",
      "credit": "Phil Donnelly Babies — original Teddy kit featured reborn photograph; individual painter credited on the source image",
      "source": "https://www.phildonnellybabies.co.uk/product-page/teddy-donnelly"
    }
  ],
  "zahli-laura-tuzio-ross": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Zahli%20by%20Laura%20Tuzio%20Ross%20003%20K.png",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/laura-tuzio-ross"
    }
  ],
  "lil-jude-laura-tuzio-ross": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/lil-jude-by-laura-tuzio-ross-001sdp.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/laura-tuzio-ross"
    }
  ],
  "kodi-bear-laura-tuzio-ross": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Kodi-Bear-by-Laura-Tuzio-Ross-001sdp.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/laura-tuzio-ross"
    }
  ],
  "winter-laura-tuzio-ross": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Winter-by-Laura-Tuzio-Ross-001-K.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/laura-tuzio-ross"
    }
  ],
  "kai-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Kai-by-Gudrun-Legler-002-k.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "ana-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Ana-by-Gudrun-Legler-002-k.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "romy-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Romy-by-Gudrun-Legler-002-k3.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "felicia-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Felicia-by-Gudrun-Legler-003-k.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "tayra-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Tayra-by-Gudrun-Legler-0.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "aleyna-gudrun-legler": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Alenya-by-Gudrun-Legler-201.jpg",
      "credit": "MacPherson Arts & Crafts — named retailer product photograph",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/gudrun-legler/by%2Cordering/results%2C1-40"
    }
  ],
  "elena-alejandra-de-zuniga": [
    {
      "url": "https://creatubebe.com/20388-thickbox_default/elena-alexandra-de-zuniga.jpg",
      "source": "https://creatubebe.com/en/limited-editions/3591-elena-alexandra-de-zuniga.html",
      "credit": "Crea Tu Bebé — Elena, original sculpt by Alejandra de Zuñiga; finished reborn example"
    }
  ],
  "kiki-severine-piret": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5122/61680/370214816_10231294285284377_3754750764682753257_n__70691.1693251401.jpg?c=2",
      "source": "https://www.irresistables.com/kiki-reborn-vinyl-doll-kit-by-severine-piret/",
      "credit": "Irresistables — Kiki prototype by Silver Lining Art Dolls, original sculpt by Séverine Piret"
    }
  ],
  "rafael-severine-piret": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4553/59169/337664487_1564670007398256_7967881658826902126_n__29148.1679787744.jpg?c=2",
      "source": "https://www.irresistables.com/rafael-reborn-vinyl-doll-kit-19-20-by-severine-piret/",
      "credit": "Irresistables — Rafael prototype by Silver Lining Art Dolls, original sculpt by Séverine Piret"
    }
  ],
  "aspen-dawn-donofrio": [
    {
      "url": "https://i0.wp.com/photos.smugmug.com/photos/i-svLN8mV/0/KJ69qpgvDHGqQxmq7KxfVsX6G2PzV69RQXx4B9qpm/L/i-svLN8mV-L.jpg?w=640&ssl=1",
      "source": "https://ellamck.com/aspen/",
      "credit": "Ella McK Creations — finished Aspen silicone reborn by Ella McK; original sculpt by Dawn Donofrio"
    },
    {
      "url": "https://i0.wp.com/photos.smugmug.com/photos/i-B6nwBdN/0/M7hjchctm5xp7gKh8Tnm98dGxDVX8G46bjBf3PCp5/XL/i-B6nwBdN-XL.jpg?w=640&ssl=1",
      "source": "https://ellamck.com/aspen/",
      "credit": "Ella McK Creations — finished Aspen silicone reborn by Ella McK; original sculpt by Dawn Donofrio"
    },
    {
      "url": "https://i0.wp.com/photos.smugmug.com/photos/i-5VHw97z/0/KwrtL2BNj4xDTfVWXHtgDzX5rcvNBC5ZS6cDgbm6D/L/i-5VHw97z-L.jpg?w=640&ssl=1",
      "source": "https://ellamck.com/aspen/",
      "credit": "Ella McK Creations — finished Aspen silicone reborn by Ella McK; original sculpt by Dawn Donofrio"
    },
    {
      "url": "https://i0.wp.com/photos.smugmug.com/photos/i-3PHrj9j/0/MkgBcrMJwNNZfzsS8LzVB8c689QKCkG4RMkQMxH5w/M/i-3PHrj9j-M.jpg?w=640&ssl=1",
      "source": "https://ellamck.com/aspen/",
      "credit": "Ella McK Creations — finished Aspen silicone reborn by Ella McK; original sculpt by Dawn Donofrio"
    }
  ],
  "willow-joanna-kazmierczak": [
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/8a7a8d1a-f657-43d3-93f2-1987b601a390/willowa.jpg",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed)"
    },
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/4c6417e1-b36d-4159-9e21-b84b8cc9721a/IMG_1945.JPG",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed)"
    },
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/fffc9c59-ced7-4de9-87b0-ec3fe75786ac/IMG_1942.JPG",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed)"
    },
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/3317c42c-dc92-4476-93f1-e87439cfbe82/IMG_1946.JPG",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed)"
    },
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/f5d168ab-ba5b-40c1-b5c2-423ffa26f29a/IMG_1941.JPG",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed)"
    }
  ],
  "luca-ping-lau": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/5293/images/65926/27067292_966228513527746_552028084665301222_n__68795.1714700401.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/luca-reborn-vinyl-toddler-doll-kit-by-ping-lau-30/",
      "credit": "Irresistables — Luca, original reborn sculpt by Ping Lau; finished-example photographer not individually named"
    }
  ],
  "tori-ping-lau": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/2232/images/17251/25311152_10213722532792864_9064514324990972668_o__81064.1529004455.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/copy-of-tori-doll-kit-by-ping-lau-limited-first-edition/",
      "credit": "Irresistables — Tori, original reborn sculpt by Ping Lau; finished-example photographer not individually named"
    }
  ],
  "raven-ping-lau": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/2182/images/16514/raven1__08241.1559584339.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/raven-by-ping-lau-2nd-edition/",
      "credit": "Irresistables — Raven, original reborn sculpt by Ping Lau; finished-example photographer not individually named"
    }
  ],
  "lovelyn-awake-ping-lau": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/151/images/785/lovelyn4__20362.1698866525.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/lovelyn-awake-reborn-vinyl-doll-kit-by-ping-lau-ultra-soft-vinyl-23/",
      "credit": "Irresistables — Lovelyn Awake, original reborn sculpt by Ping Lau; finished-example photographer not individually named"
    }
  ]
};
export const recoveredArtistCovers:Record<string,ArtistImage[]>={
  "elly-knoops": [
    {
      "url": "https://macphersoncrafts.com/images/stories/virtuemart/product/Lucas-by-Elly-Knoops-1002.jpg",
      "source": "https://macphersoncrafts.com/online-store/doll-kits-by-sculptor/elly-knoops",
      "credit": "Elly Knoops — named retailer product photograph — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "iveta-eckertova": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/5346/images/67568/DSC_0412__63098.1724439445.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/simon-reborn-vinyl-doll-kit-by-iveta-eckertova-18-19/",
      "credit": "Iveta Eckertová — original product-page photograph — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "olga-auer": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/160w/products/5739/76781/6__42807.1773164339.jpg?c=2",
      "source": "https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/olga-auer-reborn-doll-kits/",
      "credit": "Olga Auer — named retailer product photograph — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "sabrina-hergarten": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/4314/images/45650/maria25__12815.1627073410.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/maria-first-cry-reborn-vinyl-doll-kit-by-sabrina-hergarten-19/",
      "credit": "Sabrina Hergarten — original product-page photograph — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "laura-tuzio-ross": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5314/66894/447011129_970532525072579_8380893120348532936_n__05640.1719159786.jpg?c=2",
      "source": "https://www.irresistables.com/lyssi-reborn-vinyl-doll-kit-by-laura-tuzio-ross-23/",
      "credit": "Irresistables — Lyssi by Laura Tuzio Ross, source-listed original kit photograph — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "philomena-donnelly": [
    {
      "url": "https://static.wixstatic.com/media/e3ae82_803592d891c94f8d8990482f5d822211~mv2.jpg/v1/fill/w_480%2Ch_534%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/e3ae82_803592d891c94f8d8990482f5d822211~mv2.jpg",
      "source": "https://www.phildonnellybabies.co.uk/product-page/teddy-donnelly",
      "credit": "Phil Donnelly Babies — original Teddy kit featured reborn photograph; individual painter credited on the source image — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "sabine-altenkirch-junkes": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5051/59641/344297816_800592794480575_2413506340892829516_n__95655.1684020770.jpg?c=2",
      "source": "https://www.irresistables.com/neikie-reborn-vinyl-doll-kit-by-sabine-altenkirch-limited-edition/",
      "credit": "Irresistables — Neikie by Sabine Altenkirch, original kit example — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "gudrun-legler": [
    {
      "url": "https://files.ekmcdn.com/fairytales/resources/design/3301ac51-76c4-446d-8a8c-eeb2d0c953d5.jpeg",
      "source": "https://www.fairytalesrebornnursery.co.uk/sam-1553-p.asp",
      "credit": "Fairytales Reborn Nursery — Sam by Gudrun Legler, reborn example painted by Alicia Rodriguez — featured sculpt artwork, not an artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "dawn-donofrio": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5115/61436/361388984_749943356931978_4764181511077937181_n__61208.1692028072.jpg?c=2",
      "source": "https://www.irresistables.com/elowyn-reborn-vinyl-doll-kit-by-dawn-donofrio/",
      "credit": "Irresistables — Elowyn, original vinyl sculpt by Dawn Donofrio; featured artwork rather than artist portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "alejandra-de-zuniga": [
    {
      "url": "https://creatubebe.com/20388-thickbox_default/elena-alexandra-de-zuniga.jpg",
      "source": "https://creatubebe.com/en/limited-editions/3591-elena-alexandra-de-zuniga.html",
      "credit": "Crea Tu Bebé — Elena, original sculpt by Alejandra de Zuñiga; finished reborn example — featured sculpt artwork, not the sculptor's portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "severine-piret": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5122/61680/370214816_10231294285284377_3754750764682753257_n__70691.1693251401.jpg?c=2",
      "source": "https://www.irresistables.com/kiki-reborn-vinyl-doll-kit-by-severine-piret/",
      "credit": "Irresistables — Kiki prototype by Silver Lining Art Dolls, original sculpt by Séverine Piret — featured sculpt artwork, not the sculptor's portrait",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "joanna-kazmierczak": [
    {
      "url": "https://images.squarespace-cdn.com/content/v1/5eccb3d1357f2b58e13697ac/8a7a8d1a-f657-43d3-93f2-1987b601a390/willowa.jpg",
      "source": "https://www.cityofrebornangels.com.au/reborndoll-kits/p/willow-joanna-kazmierczak",
      "credit": "City of Reborn Angels — Willow by Joanna Kazmierczak-Pietka; finished reborn example (individual photographer not confirmed) — featured sculpt artwork, not a photograph of the sculptor",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ],
  "ping-lau": [
    {
      "url": "https://cdn11.bigcommerce.com/s-80sd8ywaj3/products/151/images/785/lovelyn4__20362.1698866525.500.750.jpg?c=2",
      "source": "https://www.irresistables.com/lovelyn-awake-reborn-vinyl-doll-kit-by-ping-lau-ultra-soft-vinyl-23/",
      "credit": "Irresistables — Lovelyn Awake, original reborn sculpt by Ping Lau; finished-example photographer not individually named — featured sculpt artwork, not a photograph of the sculptor",
      "role": "banner",
      "reviewStatus": "source_identified"
    }
  ]
};
