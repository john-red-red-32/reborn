/** Dated retailer observations. Prices are per retailer and currency;
 * deposits are not item prices and layaway is not always a preorder.
 * Observed from public seller pages on 2026-10-12. */
export type VariantOfferPrice={variantId:string;total?:number;deposit?:number;balance?:number;status?:"preorder"|"available"|"unavailable";sellerSku?:string;url?:string};
export type RetailOffer={variantPrices?:VariantOfferPrice[];sculptSlug:string;retailer:string;url:string;currency:"USD"|"GBP"|"EUR";total?:number;deposit?:number;balance?:number;status:"preorder"|"available"|"unavailable";checkedAt:string;note?:string};
export const retailerOffers:RetailOffer[]=[
{sculptSlug:"lennox-cassie-ann-love",retailer:"Cassie Ann Love (official)",url:"https://www.cassielove.co.uk/shop",currency:"GBP",deposit:20,status:"preorder",checkedAt:"2026-10-12",note:"Deposit advertised; balance/full price not confirmed on artist store"},
{sculptSlug:"lennox-cassie-ann-love",retailer:"Mis Lindos Reborns",url:"https://www.mislindosreborns.es/inicio/4207-10-agosto-pre-orden-kit-lennox-escultora-cassie-ann-love-edicion-limitada.html",currency:"EUR",deposit:30,balance:99.90,total:129.90,status:"preorder",checkedAt:"2026-10-12",note:"Shipping excluded"},
{sculptSlug:"lennox-cassie-ann-love",retailer:"Irresistables",url:"https://www.irresistables.com/reborn-doll-kits/reborn-doll-kits-by-artist/cassie-brace-reborn-doll-kits/",currency:"USD",deposit:20,total:139.99,status:"preorder",checkedAt:"2026-10-12",note:"Retailer catalogue lists $20–$139.99; verify final option at checkout"},
{sculptSlug:"rosie-cassie-ann-love",retailer:"Irresistables",url:"https://www.irresistables.com/rosie-reborn-vinyl-doll-kit-by-cassie-brace-20/",currency:"USD",total:104.99,deposit:20,status:"available",checkedAt:"2026-10-12",note:"$20 is optional layaway deposit, not a preorder"},
{sculptSlug:"laurie-cassie-ann-love",retailer:"Irresistables",url:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/",currency:"USD",status:"unavailable",checkedAt:"2026-10-12",note:"Product page explicitly says unavailable"}
];
export const offersFor=(slug:string)=>retailerOffers.filter(o=>o.sculptSlug===slug);
export const money=(amount:number,currency:string)=>new Intl.NumberFormat("en-GB",{style:"currency",currency,maximumFractionDigits:2}).format(amount);
