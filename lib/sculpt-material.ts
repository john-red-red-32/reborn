/** Verified sculpt material, not a guess from the artist or a product photograph. */
export type SculptMaterial="vinyl"|"silicone";
export type MaterialFilterValue="all"|SculptMaterial;
export const materialOptions:{value:MaterialFilterValue;label:string}[]=[
 {value:"all",label:"All materials"},
 {value:"vinyl",label:"Vinyl"},
 {value:"silicone",label:"Silicone"}
];
export function matchesSculptMaterial(material:SculptMaterial|undefined,filter:MaterialFilterValue):boolean{
 return filter==="all"||material===filter;
}
