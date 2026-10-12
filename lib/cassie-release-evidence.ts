/** Release-year claims with distinct provenance. Never infer launch years from gallery order, photo upload dates or sale dates. */
export type ReleaseEvidence={year:string;source:string;basis:string;confidence:"artist"|"retailer"|"third_party"};
export const cassieReleaseEvidence:Record<string,ReleaseEvidence>={
 "susie":{year:"2023",source:"https://www.etsy.com/listing/1494694091/reborn-baby-susie-by-cassie-brace-21",basis:"Contemporary kit seller explicitly states 31 May 2023 release",confidence:"third_party"},
 "laurie":{year:"2024",source:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/",basis:"Retailer identifies a 2024 model; exact release date is not established",confidence:"retailer"},
 "alice":{year:"2026",source:"https://www.cassielove.co.uk/product-page/preorder-alice-by-cassie-love-starts-5pm-3rd-march",basis:"Artist shop identifies 2026 pre-order; production release not independently dated",confidence:"artist"}
};
