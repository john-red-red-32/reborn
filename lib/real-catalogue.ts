/**
 * Editorially verified seed records. Do not infer prices or stock from a search snippet.
 * Sources checked 2026-10-12. Attribution links are to original publisher sites.
 * No third-party images reproduced.
 */
import type {SculptLifecycle} from "./sculpt-status";
import type {SculptMaterial} from "./sculpt-material";
import {cassieProfile,cassieArchive} from "./cassie-profile";
import {cassieOfficialImages} from "./cassie-images";
import {publishedGalleryEvidence} from "./artist-gallery-data";
import {findArtistGalleryEvidence,editionTypeLabel} from "./artist-catalogue";
import {nikkiKits} from "./nikki-shopify-catalogue";
import {nikkiProfile} from "./nikki-profile";
import {shopifyCohortArtists,shopifyCohortKits} from "./shopify-cohort-catalogue";
import {wixCohortArtists,wixCohortKits} from "./wix-cohort-catalogue";
import {mayraOriginalArtist,mayraOriginalKits} from "./mayra-gallery-catalogue";
import {sandyOriginalArtist,sandyOriginalKits} from "./sandy-gallery-catalogue";
import {adrieOriginalArtist,adrieOriginalKits} from "./adrie-gallery-catalogue";
export type ArtistImage={url:string;source:string;credit:string;role:"portrait"|"square"|"banner";reviewStatus:"source_identified"|"artist_approved";};
export type VerifiedArtist = {slug:string;name:string;website:string;bio:string;source:string;images?:ArtistImage[]};
export type KitVariant = {id:string;label:string;options:Record<string,string>;includedParts?:string[];photos?:{url:string;credit:string;source:string}[];sourceUrl?:string;verifiedAt?:string};
export type VerifiedKit = {material?:SculptMaterial;variants?:KitVariant[];variantSource?:"shopify"|"wix"|"manual";sourceProductId?:string;editionSize?:number;sizeDescription?:string;headCircumference?:string;slug:string;name:string;artistSlug:string;edition?:string;releaseInfo?:string;releaseDate?:string;preorderOpensAt?:string;preorderClosesAt?:string;lifecycle?:SculptLifecycle;lifecycleCheckedAt?:string;lifecycleSource?:string;productionRun?:number;statusLabel:string;statusChecked:string;photos?:{url:string;credit:string;source:string}[];sources:{label:string;url:string;kind:"artist"|"retailer"}[]};
export const artists:VerifiedArtist[]=[
{slug:"nikki-johnston",name:"Nikki Johnston",website:"https://nikkisseasidebabies.co.uk/",bio:nikkiProfile.lead,source:"https://nikkisseasidebabies.co.uk/",images:[{url:nikkiKits[0].photos![0].url,source:nikkiKits[0].sources[0].url,credit:"Nikki’s Seaside Babies — featured sculpt artwork, not a portrait",role:"banner",reviewStatus:"source_identified"}]},
{slug:"cassie-ann-love",name:"Cassie Ann Love",website:"https://www.cassielove.co.uk/",bio:"Independent reborn sculptor, previously known as Cassie Brace. Her official portfolio includes a range of original reborn doll sculpts.",source:"https://www.cassielove.co.uk/",images:[{url:cassieProfile.portrait.url,source:cassieProfile.portrait.source,credit:"Cassie Ann Love official website",role:"portrait",reviewStatus:"source_identified"}]},
{slug:"joanna-kazmierczak",name:"Joanna Kazmierczak",website:"https://macphersoncrafts.com/",bio:"Sculptor whose Willow release is featured by specialist retailer MacPherson Arts & Crafts.",source:"https://macphersoncrafts.com/"},
{slug:"dawn-mcleod",name:"Dawn McLeod",website:"https://macphersoncrafts.com/",bio:"Sculptor of Cypress, featured among specialist retailer MacPherson's pre-order releases.",source:"https://macphersoncrafts.com/"}
,...shopifyCohortArtists,...wixCohortArtists,mayraOriginalArtist,sandyOriginalArtist,adrieOriginalArtist
];
const manuallyCuratedKits:VerifiedKit[]=[
...nikkiKits,
{slug:"winnie-cassie-ann-love",name:"Winnie",artistSlug:"cassie-ann-love",edition:"19-inch vinyl sculpt",statusLabel:"Historical sculpt — availability not established",statusChecked:"2026-10-12",photos:[{url:"https://www.createalittlemagic.co.za/cdn/shop/products/pre-order-deposit-only-winnie-by-cassie-brace-843063.jpg?v=1696056018",credit:"Source retailer",source:"https://www.createalittlemagic.co.za/products/winnie-by-cassie-brace"}],sources:[{label:"View original listing",url:"https://www.createalittlemagic.co.za/products/winnie-by-cassie-brace",kind:"retailer"}]},
{slug:"peaches-cassie-ann-love",name:"Peaches",artistSlug:"cassie-ann-love",statusLabel:"Retailer lists sold out",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4429/48391/ZHd8Ppv0__65484.1638300441.jpg?c=2",credit:"Source retailer",source:"https://www.irresistables.com/peaches-reborn-vinyl-doll-kit-by-cassie-brace-21-sold-out-edition/"}],sources:[{label:"View original listing",url:"https://www.irresistables.com/peaches-reborn-vinyl-doll-kit-by-cassie-brace-21-sold-out-edition/",kind:"retailer"}]},
{slug:"macie-cassie-ann-love",name:"Macie",artistSlug:"cassie-ann-love",statusLabel:"Edition and stock unverified",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/3674/37994/124033033_697808557530454_2729671441620712349_n__91235.1605903092.jpg?c=2",credit:"Source retailer",source:"https://www.irresistables.com/macie-reborn-vinyl-doll-kit-by-cassie-brace-19/"}],sources:[{label:"View original listing",url:"https://www.irresistables.com/macie-reborn-vinyl-doll-kit-by-cassie-brace-19/",kind:"retailer"}]},
{slug:"elliot-cassie-ann-love",name:"Elliot",artistSlug:"cassie-ann-love",statusLabel:"Retailer lists sold out",statusChecked:"2026-10-12",photos:[{url:"https://macphersoncrafts.com/images/stories/virtuemart/product/Elliot-by-Cassie-Brace-153-K.jpg",credit:"Source retailer",source:"https://macphersoncrafts.com/online-store/all-doll-kits-by-status/sold-out-editions/elliot-by-cassie-brace.htm"}],sources:[{label:"View original listing",url:"https://macphersoncrafts.com/online-store/all-doll-kits-by-status/sold-out-editions/elliot-by-cassie-brace.htm",kind:"retailer"}]},

{slug:"alice-cassie-ann-love",name:"Alice",artistSlug:"cassie-ann-love",edition:"Small limited edition",releaseDate:"2026",preorderOpensAt:"2026-03-03",statusLabel:"Retailer lists available",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5728/76529/524434254_24563747599877646_408176518904935837_n__74260.1770667994.jpg?c=2",credit:"Irresistables / Cassie Love",source:"https://www.irresistables.com/alice-reborn-vinyl-doll-kit-by-cassie-brace-19-5-small-limited-edition/"}],sources:[{label:"Irresistables",url:"https://www.irresistables.com/alice-reborn-vinyl-doll-kit-by-cassie-brace-19-5-small-limited-edition/",kind:"retailer"}]},
{slug:"laurie-cassie-ann-love",name:"Laurie",artistSlug:"cassie-ann-love",releaseDate:"2024",statusLabel:"Retailer lists unavailable",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5344/67468/454001939_1035731921249147_6205666991762453580_n__47744.1723232041.jpg?c=2",credit:"Irresistables / Cassie Love",source:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/"},{url:"https://static.wixstatic.com/media/684b25_d4d5d061becc48aa97ae0e1e4ae77a08~mv2.jpg",credit:"Cassie Ann Love website",source:"https://www.cassielove.co.uk/"}],sources:[{label:"Irresistables",url:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/",kind:"retailer"}]},
{slug:"lennox-cassie-ann-love",name:"Lennox",artistSlug:"cassie-ann-love",edition:"Limited edition",preorderOpensAt:"2026-08-10",releaseInfo:"Artist lists a pre-order opening date of 10 August 2026; deposit advertised at £20, subject to confirmation at checkout.",statusLabel:"Pre-order listed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"},{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"rosie-cassie-ann-love",name:"Rosie",artistSlug:"cassie-ann-love",edition:"Limited edition of 400",statusLabel:"Featured on artist site; stock unconfirmed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"}]},
{slug:"willow-joanna-kazmierczak",name:"Willow",artistSlug:"joanna-kazmierczak",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"cypress-dawn-mcleod",name:"Cypress",artistSlug:"dawn-mcleod",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]}
];
/**
 * Expand Cassie's accepted artist archive into individual, source-linked pages
 * only where a named sculpt image was actually verified. Leave Romilly and
 * Sienna as pending-identity archive entries rather than guessing from aliases.
 * Existing manually researched availability and retailer facts take priority.
 */
const cassieExpandedHistoricalKits:VerifiedKit[]=cassieArchive
 .filter(name=>!manuallyCuratedKits.some(kit=>kit.artistSlug==="cassie-ann-love"&&kit.name.toLocaleLowerCase("en")===name.toLocaleLowerCase("en")))
 .filter(name=>(cassieOfficialImages[name]??[]).length>0)
 .map(name=>{
   const gallery=findArtistGalleryEvidence("cassie-ann-love",name,publishedGalleryEvidence);
   const size=gallery?.approxSizeInches;
   const edition=gallery?editionTypeLabel(gallery.editionType):undefined;
   return {
     slug:name.toLocaleLowerCase("en").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-cassie-ann-love",
     name,artistSlug:"cassie-ann-love",material:"vinyl" as const,
     edition,
     sizeDescription:size?size+" inches (artist's gallery)":undefined,
     releaseInfo:"Historical original sculpt. Release date and current availability have not been established.",
     statusLabel:"Historical sculpt — current availability not established",
     statusChecked:"2026-10-13",
     photos:cassieOfficialImages[name],
     sources:[{label:"Cassie Ann Love — original sculpt gallery",url:gallery?.sourceUrl??"https://www.cassielove.co.uk/galleries",kind:"artist" as const}]
   };
 });
const cassieCuratedWithImages=manuallyCuratedKits.map(kit=>{
 if(kit.artistSlug!=="cassie-ann-love")return kit;
 const sourcePhotos=cassieOfficialImages[kit.name]??[];
 const photos=[...sourcePhotos,...(kit.photos??[])].filter((photo,index,array)=>array.findIndex(other=>other.url===photo.url)===index);
 const gallery=findArtistGalleryEvidence("cassie-ann-love",kit.name,publishedGalleryEvidence);
 return {
   ...kit,
   // Cassie records belong to her documented original vinyl-kit catalogue.
   material:kit.material??("vinyl" as const),
   photos:photos.length?photos:kit.photos,
   sizeDescription:kit.sizeDescription??(gallery?.approxSizeInches?gallery.approxSizeInches+" inches (artist's gallery)":undefined),
   sources:gallery&&!kit.sources.some(source=>source.url===gallery.sourceUrl)?[
      {label:"Original sculptor's gallery",url:gallery.sourceUrl,kind:"artist" as const},
      ...kit.sources
   ]:kit.sources
 };
});
export const verifiedKits:VerifiedKit[]=[...cassieCuratedWithImages,...cassieExpandedHistoricalKits,...shopifyCohortKits,...wixCohortKits,...mayraOriginalKits,...sandyOriginalKits,...adrieOriginalKits];
export const kitArtist=(slug:string)=>artists.find(a=>a.slug===slug);
