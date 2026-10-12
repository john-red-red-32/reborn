/**
 * Editorially verified seed records. Do not infer prices or stock from a search snippet.
 * Sources checked 2026-10-12. Attribution links are to original publisher sites.
 * No third-party images reproduced.
 */
export type VerifiedArtist = {slug:string;name:string;website:string;bio:string;source:string};
export type VerifiedKit = {slug:string;name:string;artistSlug:string;edition?:string;releaseInfo?:string;statusLabel:string;statusChecked:string;photos?:{url:string;credit:string;source:string}[];sources:{label:string;url:string;kind:"artist"|"retailer"}[]};
export const artists:VerifiedArtist[]=[
{slug:"cassie-ann-love",name:"Cassie Ann Love",website:"https://www.cassielove.co.uk/",bio:"Independent reborn sculptor, previously known as Cassie Brace. Her official portfolio includes a range of original reborn doll sculpts.",source:"https://www.cassielove.co.uk/"},
{slug:"joanna-kazmierczak",name:"Joanna Kazmierczak",website:"https://macphersoncrafts.com/",bio:"Sculptor whose Willow release is featured by specialist retailer MacPherson Arts & Crafts.",source:"https://macphersoncrafts.com/"},
{slug:"dawn-mcleod",name:"Dawn McLeod",website:"https://macphersoncrafts.com/",bio:"Sculptor of Cypress, featured among specialist retailer MacPherson's pre-order releases.",source:"https://macphersoncrafts.com/"}
];
export const verifiedKits:VerifiedKit[]=[
{slug:"alice-cassie-ann-love",name:"Alice",artistSlug:"cassie-ann-love",edition:"Small limited edition",statusLabel:"Retailer lists available",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5728/76529/524434254_24563747599877646_408176518904935837_n__74260.1770667994.jpg?c=2",credit:"Irresistables / Cassie Love",source:"https://www.irresistables.com/alice-reborn-vinyl-doll-kit-by-cassie-brace-19-5-small-limited-edition/"}],sources:[{label:"Irresistables",url:"https://www.irresistables.com/alice-reborn-vinyl-doll-kit-by-cassie-brace-19-5-small-limited-edition/",kind:"retailer"}]},
{slug:"laurie-cassie-ann-love",name:"Laurie",artistSlug:"cassie-ann-love",statusLabel:"Availability to verify",statusChecked:"2026-10-12",photos:[{url:"https://cdn11.bigcommerce.com/s-80sd8ywaj3/images/stencil/1024x1024/products/5344/67468/454001939_1035731921249147_6205666991762453580_n__47744.1723232041.jpg?c=2",credit:"Irresistables / Cassie Love",source:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/"}],sources:[{label:"Irresistables",url:"https://www.irresistables.com/laurie-reborn-vinyl-doll-kit-by-cassie-love-brace-19/",kind:"retailer"}]},
{slug:"lennox-cassie-ann-love",name:"Lennox",artistSlug:"cassie-ann-love",edition:"Limited edition",releaseInfo:"Artist lists a pre-order opening date of 10 August 2026; deposit advertised at £20, subject to confirmation at checkout.",statusLabel:"Pre-order listed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"},{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"rosie-cassie-ann-love",name:"Rosie",artistSlug:"cassie-ann-love",edition:"Limited edition of 400",statusLabel:"Featured on artist site; stock unconfirmed",statusChecked:"2026-10-12",sources:[{label:"Artist website",url:"https://www.cassielove.co.uk/",kind:"artist"}]},
{slug:"willow-joanna-kazmierczak",name:"Willow",artistSlug:"joanna-kazmierczak",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]},
{slug:"cypress-dawn-mcleod",name:"Cypress",artistSlug:"dawn-mcleod",statusLabel:"Pre-order status needs reconfirmation",statusChecked:"2026-10-12",sources:[{label:"MacPherson Arts & Crafts",url:"https://macphersoncrafts.com/",kind:"retailer"}]}
];
export const kitArtist=(slug:string)=>artists.find(a=>a.slug===slug);
