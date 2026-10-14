/** Concise editorial headings; original supplier titles stay untouched for provenance,
 * source captions, SEO metadata, accessibility and stable product identities.
 * Product-line distinctions and quantities are never guessed from photographs.
 */
export type MaterialDisplayTitle={name:string;detail:string};
export function materialDisplayTitle(sourceTitle:string,rangeSlug:string):MaterialDisplayTitle{
 const original=sourceTitle.trim();
 let name=original;
 let detail="";
 if(rangeSlug==="bountiful-baby-eyes"){
  const match=original.match(/^(.+?)\s*[-–]\s*Bountiful Baby Eyes\s*[-–]\s*(.+?)\s*[-–]\s*(#\d+)$/i);
  if(match)return {name:match[1].trim(),detail:match[2].trim()+" · "+match[3]};
 }
 if(rangeSlug==="hp-babylocks"){
  name=original.replace(/^HP\s*Babylocks\s+premium\s+mohair\s+/i,"").replace(/\*+/g,"").trim();
  const colours=name.match(/\s+(\d+\s+colours?\s+available)\s*$/i);
  const description=name.match(/\s*[-–]\s*(\d+\s+colours?\b.+)$/i);
  if(colours){detail=colours[1].toLowerCase();name=name.slice(0,colours.index).trim();}
  else if(description){detail=description[1].trim();name=name.slice(0,description.index).trim();}
  name=name.replace(/^STRAIGHT TO WAVY$/i,"Straight to Wavy").replace(/^NEW WAVY$/i,"New Wavy").replace(/^Very Curly \(afro\)$/i,"Very Curly (Afro)");
  if(name!==original)return {name,detail:detail?"Premium mohair · "+detail:"Premium mohair"};
 }
 if(rangeSlug==="nuborn-mohair"){
  const match=original.match(/^(.+?)\s+NuBorn Mohair\s+(.+?)\s*[-–]\s*(Curve|Straight)\s+([\w]+)\s*[-–]\s*(#\d+)$/i);
  if(match)return {name:match[2]+" · "+match[3]+" "+match[4],detail:match[1]+" · "+match[5]};
 }
 if(rangeSlug==="kebelka-heat-paints"){
  name=original.replace(/\s*\/\s*KEBELKA\s+Set\s+heat\s+paint\b/i,"").trim();
  if(name!==original)return {name,detail:""};
 }
 if(rangeSlug==="ultimate-fusion"){
  name=original.replace(/^Ultimate Fusion\s*(?:[-–]\s*|\s+)/i,"").trim();
  if(name&&name!==original)return {name,detail:""};
 }
 if(rangeSlug==="gemini-heat-set"){
  name=original.replace(/\s*[-–]\s*Gemini®?\s+Heat\s+Set\s+Paints?\b/gi,"")
    .replace(/^Gemini®?\s+Heat\s+Set\s+/i,"").trim();
  const sku=name.match(/\s*[-–]?\s*(#\d+)\s*$/);
  if(sku){detail=sku[1];name=name.slice(0,sku.index).trim();}
  const size=name.match(/\s*[-–]\s*(\d+\+?\s*(?:grams?|oz|ml))\s*$/i);
  if(size){detail=size[1]+(detail?" · "+detail:"");name=name.slice(0,size.index).trim();}
  if(name!==original)return {name,detail};
 }
 if(rangeSlug==="german-glass-eyes"){
  name=original.replace(/^German\s+(.+?)\s+flat\s+back\s+glass\s+eyes\s+for\s+dolls\s*[-–]\s*/i,"$1 · ").trim();
  if(name!==original)return {name,detail:"Flat-back glass eyes"};
 }
 if(rangeSlug==="rooting-needles-uk"){
  name=original.replace(/^Pixie\s+Kissed\s+Babies\s+/i,"").trim();
  if(name!==original)return {name,detail:""};
 }
 if(rangeSlug==="alva-go-heat-set"){
  name=original.replace(/\bAlva\s*&\s*Go\b/gi,"").replace(/\s{2,}/g," ").trim().replace(/[\s:–-]+$/,"");
  if(name&&name!==original)return {name,detail:""};
 }
 return {name:original,detail:""};
}
