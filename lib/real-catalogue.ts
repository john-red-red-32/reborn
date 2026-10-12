/**
 * Editorially verified seed records. Do not infer prices or stock from a search snippet.
 * Sources checked 2026-10-12. Attribution links are to original publisher sites.
 * No third-party images reproduced.
 */
export type VerifiedArtist = {slug:string;name:string;website:string;bio:string;source:string};
export type VerifiedKit = {slug:string;name:string;artistSlug:string;edition?:string;releaseInfo?:string;statusLabel:string;statusChecked:string;sources:{label:string;url:string;kind:"artist"|"retailer"}[]};
export const artists:VerifiedArtist[]=[
{slug:"cassie-ann-love",name:"Cassie Ann Love",website:"https://www.cassielove.co.uk/",bio:"Independent reborn sculptor, previously known as Cassie Brace. Her official portfolio includes a range of original reborn doll sculpts.",source:"https://www.cassielove.co.uk/"},
{slug:"joanna-kazmierczak",name:"Joanna Kazmierczak",website:"https://macphersoncrafts.com/",bio:"Sculptor whose Willow release is featured by specialist retailer MacPherson Arts & Crafts.",source:"https://macphersoncrafts.com/"},
{slug:"dawn-mcleod",name:"Dawn McLeod",website:"https://macphersoncrafts.com/",bio:"Sculptor of Cypress, featured among specialist retailer MacPherson's pre-order releases.",source:"https://macphersoncrafts.com/"}
];
export const verifiedKits:VerifiedKit[]=[
{slug:"lennox-cassie-ann-love",name:"Lennox",artistSlug:"cassie-ann-love",edition:"Limited edition",releaseInfo:"Artist lists a pre-order opening date of 10 August 2026; deposit advertised at £20, subject to confirmation at checkout.",statusLabel:"Pre-order listed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"},{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"rosie-cassie-ann-love",name:"Rosie",artistSlug:"cassie-ann-love",edition:"Limited edition of 400",statusLabel:"Featured on artist site; stock unconfirmed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"}]},
{slug:"willow-joanna-kazmierczak",name:"Willow",artistSlug:"joanna-kazmierczak",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"cypress-dawn-mcleod",name:"Cypress",artistSlug:"dawn-mcleod",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]}
];
export const kitArtist=(slug:string)=>artists.find(a=>a.slug===slug);
