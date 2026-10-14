/** RAA directory discovery 2026-10-14; independent retailer kit evidence.
 * Sculptor bio is sourced, without implying RAA endorses Reborna.
 * Finished reborn photographs credit original sculptor and source gallery.
 */
import type {VerifiedArtist,VerifiedKit} from "./real-catalogue";
const cocoSource="https://www.irresistables.com/coco-reborn-vinyl-doll-kit-by-ebtehal-abul-20/";
const saraSource="https://www.irresistables.com/sara-reborn-vinyl-doll-19-by-ebtehal-abul/";
const cocoImage="https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4050/41126/414505396__43099.1612667847.jpg?c=2";
const saraImage="https://www.latiendadelbebereborn.com/wp-content/uploads/2021/02/sara-0.jpg";
const raaSource="https://rebornartistryalliance.com/products/ebtehal-abul";
export const raaNewArtists:VerifiedArtist[]=[
 {slug:"eva-brilli",name:"Eva Brilli",website:"https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/eva-brilli/",websiteRole:"retailer_reference",source:"https://rebornartistryalliance.com/products/eva-brilli",bio:"Italian original reborn sculptor and silicone doll artist. Eva Brilli began reborn art in 2006 and later developed original sculpts manufactured as vinyl kits, including Gabriel and Rachele. Sculpting and finished-doll painting are distinct stages of her work.",images:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4163/43814/167977430_1756215817897345_7969338892558838550_n__21325.1617416126.jpg?c=2",source:"https://www.irresistables.com/gabriel-reborn-vinyl-doll-kit-by-eva-brilli-19/",credit:"Irresistables — Gabriel original sculpt by Eva Brilli; finished prototype photography, not an artist portrait",role:"banner",reviewStatus:"source_identified"}]},

 {slug:"ebtehal-abul",name:"Ebtehal Abul",
  website:"https://macphersoncrafts.com/sculptors/manufacturers/ebtehal-abul?tmpl=component",
  websiteRole:"retailer_reference",
  source:raaSource,
  bio:"Kuwait-based original reborn sculptor working in polymer clay. Ebtehal began sculpting in 2017, and her original vinyl designs include Sara and Coco. An independent sculptor interview distinguishes her manufactured kits from one-of-a-kind silicone artwork.",
  images:[{url:cocoImage,source:cocoSource,credit:"Irresistables — finished Coco prototype, original sculpt by Ebtehal Abul; featured sculpt artwork, not an artist portrait",role:"banner",reviewStatus:"source_identified"}]
 }
];
export const raaNewKits:VerifiedKit[]=[
 {slug:"gabriel-eva-brilli",name:"Gabriel",artistSlug:"eva-brilli",material:"vinyl",sizeDescription:"Approximately 19 inches when finished",statusLabel:"Retailer lists sold out; current availability not established",statusChecked:"2026-10-14",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4163/43814/167977430_1756215817897345_7969338892558838550_n__21325.1617416126.jpg?c=2",source:"https://www.irresistables.com/gabriel-reborn-vinyl-doll-kit-by-eva-brilli-19/",credit:"Irresistables — finished Gabriel prototype example, original vinyl sculpt by Eva Brilli"}],sources:[{label:"Named original kit listing",url:"https://www.irresistables.com/gabriel-reborn-vinyl-doll-kit-by-eva-brilli-19/",kind:"retailer"}]},

 {slug:"coco-ebtehal-abul",name:"Coco",artistSlug:"ebtehal-abul",
  material:"vinyl",sizeDescription:"Approximately 20 inches when finished",
  statusLabel:"Retailer lists sold out; current availability not established",
  statusChecked:"2026-10-14",
  photos:[{url:cocoImage,source:cocoSource,credit:"Irresistables — named Coco prototype photograph, original sculpt by Ebtehal Abul; individual reborn painter not independently confirmed"}],
  sources:[{label:"Original kit retailer listing",url:cocoSource,kind:"retailer"},{label:"Sculptor interview",url:"https://macphersoncrafts.com/sculptors/manufacturers/ebtehal-abul?tmpl=component",kind:"retailer"}]},
 {slug:"sara-ebtehal-abul",name:"Sara",artistSlug:"ebtehal-abul",
  material:"vinyl",sizeDescription:"Approximately 19 inches when finished",
  statusLabel:"Retailer lists unavailable; current availability not established",
  statusChecked:"2026-10-14",
  photos:[{url:saraImage,source:"https://www.latiendadelbebereborn.com/producto/sara-ebtehal-abul-cuerpo/",credit:"La Tienda del Bebé Reborn — finished Sara prototype by Angela Plicka; original sculpt by Ebtehal Abul"}],
  sources:[{label:"Original kit retailer listing",url:saraSource,kind:"retailer"},{label:"Photographed prototype",url:"https://www.latiendadelbebereborn.com/producto/sara-ebtehal-abul-cuerpo/",kind:"retailer"}]}
];
