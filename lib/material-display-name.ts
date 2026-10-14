/** Presentation-only, source-preserving titles for the materials range and product pages.
 * Never mutate source product names, source identifiers, routes, credits or search.
 * Return the original name for unfamiliar formats rather than silently changing meaning.
 */
export type MaterialDisplayName={title:string;detail?:string};
const tidy=(s:string)=>s.replace(/\s+/g," ").trim().replace(/\s*[-–]\s*$/,"");
const titleCase=(s:string)=>s.toLowerCase().replace(/(^|\s|[(-])([a-z])/g,(_,a,b)=>a+b.toUpperCase());
export function materialDisplayName(rangeSlug:string,sourceTitle:string):MaterialDisplayName{
 const original=tidy(sourceTitle);
 if(rangeSlug==="bountiful-baby-eyes"){
  const m=original.match(/^(\d{2}mm\s+.+?)\s*[-–]\s*Bountiful Baby Eyes\s*[-–]\s*(\d+\s+Pairs?)\s*[-–]\s*(#\d+)$/i);
  if(m)return{title:m[1],detail:m[2].toLowerCase()+" · "+m[3]};
 }
 if(rangeSlug==="hp-babylocks"){
  const m=original.match(/^HP\s*Babylocks\s+premium\s+mohair\s+(.+)$/i);
  if(m){
   let name=m[1],detail="";
   const options=name.match(/\*{3}\s*(\d+)\s+COLOURS AVAILABLE\s*\*{3}/i);
   if(options){detail=options[1]+" colours available";name=name.replace(options[0],"");}
   const colours=name.match(/\s*[-–]\s*(\d+)\s+colours?\s+(.+)$/i);
   if(colours){detail=colours[1]+" colours · "+tidy(colours[2]);name=name.replace(colours[0],"");}
   name=tidy(name);
   if(name)return{title:titleCase(name),detail:detail||undefined};
  }
 }
 if(rangeSlug==="nuborn-mohair"){
  const m=original.match(/^([\d/]+\s*oz)\s+NuBorn Mohair\s+(.+?)\s*[-–]\s*(.+?)\s*[-–]\s*(#\d+)$/i);
  if(m)return{title:tidy(m[2])+" — "+tidy(m[3]),detail:m[1]+" · "+m[4]};
 }
 if(rangeSlug==="german-glass-eyes"){
  const m=original.match(/^German\s+(\w+)\s+flat back glass eyes for dolls\s*[-–]\s*(.+)$/i);
  if(m)return{title:m[1]+" flat-back glass eyes",detail:tidy(m[2])};
 }
 if(rangeSlug==="kebelka-heat-paints"){
  const m=original.match(/^(.+?)\s*\/\s*KEBELKA\s+Set\s+heat\s+Paint(?:\s*\((.*?)\))?$/i);
  if(m)return{title:tidy(m[1]),detail:m[2]?tidy(m[2]):undefined};
 }
 if(rangeSlug==="gemini-heat-set"){
  const m=original.match(/^(.+?)\s*[-–]\s*Gemini®?\s*Heat Set Paint\s*[-–]\s*(.+)$/i);
  if(m)return{title:tidy(m[1]),detail:tidy(m[2])};
 }
 if(rangeSlug==="ultimate-fusion"){
  const m=original.match(/^Ultimate Fusion\s*[-–]\s*(.+)$/i);
  if(m)return{title:tidy(m[1])};
  const suffix=original.match(/^(.+?)\s+by Ultimate Fusion$/i);
  if(suffix)return{title:tidy(suffix[1])};
 }
 if(rangeSlug==="rooting-needles-uk"){
  const m=original.match(/^Pixie Kissed Babies Rooting Needles\s*[-–]\s*(.+)$/i);
  if(m)return{title:tidy(m[1]),detail:"Rooting needles"};
 }
 return{title:original};
}
