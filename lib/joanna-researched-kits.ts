/** Source-backed original reborn sculpt kits by Joanna Kazmierczak.
 * Individually researched from specialist retailer pages 26 October 2026.
 * A source listing is NOT a live inventory feed. Photos are attributed to
 * their original publisher and depict sample finished dolls, not boxed kits.
 * Do not turn twins, gender variants or painted examples into extra sculpts.
 */
import type {VerifiedKit} from "./real-catalogue";

const ir="https://www.irresistables.com/";
const asRetailer=(slug:string)=>[{label:"Irresistables — original sculpt kit listing",url:ir+slug+"/",kind:"retailer" as const}];
const base={
 material:"vinyl" as const,
 artistSlug:"joanna-kazmierczak",
 statusLabel:"Original vinyl sculpt — current availability not confirmed",
 statusChecked:"2026-10-26",
 releaseInfo:"An original blank, unpainted vinyl kit documented by a specialist retailer. Current stock, pricing and production dates must be confirmed directly with the seller."
};
export const joannaResearchedKits:VerifiedKit[]=[
 {
  ...base,slug:"otto-joanna-kazmierczak",name:"Otto",
  releaseInfo:"A documented original vinyl reborn sculpt by Joanna Kazmierczak. Retailers describe differing finished measurements depending on body/leg configuration; check details at the original source.",
  photos:[{url:"https://static.wixstatic.com/media/dcc6dd_30e1767a6c6642449a140d20c7868628~mv2.jpg/v1/fill/w_1000%2Ch_1000%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/dcc6dd_30e1767a6c6642449a140d20c7868628~mv2.jpg",credit:"Dollli Creations — published Otto finished doll example",source:"https://www.dollli.uk/product-page/otto-doll-kit-by-joanna-kazmierczak-le1040"}],
  sources:[...asRetailer("otto-reborn-vinyl-doll-kit-by-joanna-kazmierczak-17"),{label:"Dollli Creations — alternative kit information",url:"https://www.dollli.uk/product-page/otto-doll-kit-by-joanna-kazmierczak-le1040",kind:"retailer"}]
 },
 {
  ...base,slug:"lily-joanna-kazmierczak",name:"Lily",sizeDescription:"20 inches (specialist retailer listing)",
  releaseInfo:"Lily and Irys are documented as twin designs. This record is for Lily's original unpainted vinyl kit only; availability must be confirmed with the seller.",
  sources:[...asRetailer("lily-reborn-vinyl-doll-kit-by-joanna-kazmierczak-20"),{label:"TruBorns — original Lily and Irys twin set",url:"https://www.truborns.com/products/lily-and-irys-by-joanna-kazmierczak",kind:"retailer"}]
 },
 {
  ...base,slug:"irys-joanna-kazmierczak",name:"Irys",
  releaseInfo:"Irys and Lily are separately documented twin sculpts. This record refers to Irys's unpainted vinyl kit, not a finished reborn doll.",
  sources:[...asRetailer("irys-reborn-vinyl-doll-kit-by-joanna-kazmierczak"),{label:"TruBorns — original Lily and Irys twin set",url:"https://www.truborns.com/products/lily-and-irys-by-joanna-kazmierczak",kind:"retailer"}]
 },
 {
  ...base,slug:"eric-erica-joanna-kazmierczak",name:"Eric/Erica",edition:"Limited edition (size not established)",
  sizeDescription:"21 inches (retailer listing)",
  releaseInfo:"Eric/Erica is a single original limited-edition reborn vinyl kit listing; do not treat the naming variants as independently authenticated sculpts.",
  photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/original/products/5049/61871/371907804_839231267636449_751103133377845394_n__67722.1693595707.jpg?c=2",credit:"Irresistables — published Erica prototype example, not an unpainted kit photograph",source:ir+"eric-erica-reborn-vinyl-doll-kit-by-joanna-kazmierczak-21-limited-edition/"}],
  sources:asRetailer("eric-erica-reborn-vinyl-doll-kit-by-joanna-kazmierczak-21-limited-edition")
 },
 {
  ...base,slug:"charlie-joanna-kazmierczak",name:"Charlie",edition:"Limited edition of 1,200",editionSize:1200,
  sizeDescription:"19.5 inches (retailer documentation)",
  releaseDate:"2023",
  statusLabel:"Historically sold-out edition — current availability not established",
  releaseInfo:"The artist-attributed Charlie vinyl sculpt was documented as a limited edition of 1,200. The retailer describes secondary-market listings, not a new production run.",
  photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/original/products/4787/55899/319888283_555577373233816_3060161231574764942_n__17627.1671210852.jpg?c=2",credit:"Irresistables — Bianca Franke finished prototype of the Charlie sculpt",source:ir+"charlie-reborn-vinyl-doll-kit-by-joanna-kazmierczak-limited-edition-20/"}],
  sources:[...asRetailer("charlie-reborn-vinyl-doll-kit-by-joanna-kazmierczak-limited-edition-20"),{label:"Dollli Creations — kit edition information",url:"https://www.dollli.uk/product-page/pre-order-charlie-doll-kit-by-joanna-kazmierczak-pietka",kind:"retailer"}]
 },
 {
  ...base,slug:"pascale-joanna-kazmierczak",name:"Pascale",edition:"Limited edition of 3,300",editionSize:3300,
  releaseInfo:"The specialist retailer documents an original Pascale vinyl kit with a certificate of authenticity and edition size of 3,300. Published finished measurements differ between retailers, so none is presented as definitive.",
  photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/4448/50878/275005011_10208822529156922_5543074912019896711_n__22722.1647551304.jpg?c=2",credit:"Irresistables — published finished Pascale doll example",source:ir+"pascale-reborn-vinyl-doll-kit-by-joanna-kazmierczak-20/"}],
  sources:[...asRetailer("pascale-reborn-vinyl-doll-kit-by-joanna-kazmierczak-20"),{label:"Dollli Creations — edition and alternate sizing",url:"https://www.dollli.uk/product-page/pre-order-pascale-doll-kit",kind:"retailer"}]
 },
 {
  ...base,slug:"sandie-joanna-kazmierczak",name:"Sandie",sizeDescription:"25 inches (retailer listing)",
  releaseInfo:"Original unpainted toddler-size vinyl kit by Joanna Kazmierczak; retailer photographs show a completed doll interpretation, not the blank kit.",
  photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/original/products/4150/46968/245488456_10160054451924669_132647391195529706_n__90723.1649519233.jpg?c=2",credit:"Irresistables — published finished Sandie toddler doll example",source:ir+"sandie-reborn-toddler-vinyl-doll-kit-by-joanna-kazmierczak-25/"}],
  sources:asRetailer("sandie-reborn-toddler-vinyl-doll-kit-by-joanna-kazmierczak-25")
 },
 {
  ...base,slug:"elijah-joanna-kazmierczak",name:"Elijah",edition:"Limited edition (size not independently established)",sizeDescription:"17 inches (retailer listing)",
  statusLabel:"Historically limited edition — current availability not confirmed",
  releaseInfo:"Documented original limited-edition vinyl sculpt; specialist retailers describe secondary-market stock separately from initial production.",
  photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/original/products/3510/41075/144035464_4245447432137058_8378959760009984495_o__21796.1615498104.jpg?c=2",credit:"Irresistables — published finished Elijah doll example",source:ir+"elijah-limited-edition-reborn-vinyl-doll-kit-by-joanna-kazmierczak-17-secondary-market-pricing/"}],
  sources:asRetailer("elijah-limited-edition-reborn-vinyl-doll-kit-by-joanna-kazmierczak-17-secondary-market-pricing")
 },
 {
  ...base,slug:"lou-lou-joanna-kazmierczak",name:"Lou Lou",sizeDescription:"20 inches (retailer listing)",
  releaseInfo:"A documented historical original vinyl sculpt by Joanna Kazmierczak, also styled LouLou by some retailers. Current inventory is unverified.",
  photos:[{url:"https://www.truborns.com/cdn/shop/products/71555188_2414234931947287_5571081910198730752_n_1024x.jpg?v=1613445849",credit:"TruBorns — published LouLou finished doll example",source:"https://www.truborns.com/products/loulou-by-joanna-kazmierczak"}],
  sources:[...asRetailer("lou-lou-reborn-vinyl-doll-kit-by-joanna-kazmierczak-20-secondary-market-pricing"),{label:"TruBorns — LouLou source listing",url:"https://www.truborns.com/products/loulou-by-joanna-kazmierczak",kind:"retailer"}]
 },
 {
  ...base,slug:"april-joanna-kazmierczak",name:"April",sizeDescription:"20 inches (original artist account and retailer)",
  releaseInfo:"Original vinyl reborn kit described by the artist in her published 2021 kit account; the source discusses a 20-inch blank sculpt and certificate of authenticity. Current availability is unverified.",
  sources:[...asRetailer("april-by-joanna-kazmierczak"),{label:"Joanna Kazmierczak — historical artist-authored kit description",url:"https://joannakazmierzackpietka.medium.com/april-kit-by-joanna-kazmierczak-24b7d6c9d309",kind:"artist"}]
 }
];
