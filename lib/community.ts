/** Display taxonomy: selecting a profession is self-description, never verification. */
export const communityRoles=[
 {id:'collector',label:'Collector & enthusiast',description:'Enjoy, discover or purchase reborn dolls'},
 {id:'reborn_artist',label:'Reborn artist',description:'Paint, root or finish reborn dolls'},
 {id:'sculptor',label:'Original sculptor',description:'Create original sculpts and kits'},
 {id:'supplier',label:'Supplier',description:'Produce or supply specialist materials'}
] as const;
export const communityInterests=[
 {id:'kits',label:'Original kits'},
 {id:'finished_dolls',label:'Completed dolls'},
 {id:'high_end_dolls',label:'Prototypes & collector auctions'},
 {id:'materials',label:'Paints & materials'},
 {id:'techniques',label:'Painting & techniques'},
 {id:'events',label:'Shows & events'},
 {id:'authenticity',label:'Authenticity'},
 {id:'selling',label:'Selling my work'}
] as const;
export const communityCategories=[
 {id:'general',name:'The common room',description:'Introductions, news and community conversations'},
 {id:'kits',name:'Sculpts & original kits',description:'Discuss original designs, kit releases and details'},
 {id:'painting',name:'Paints & techniques',description:'Heat-set, air-dry, mediums and making'},
 {id:'mohair',name:'Hair & rooting',description:'Mohair, needles, rooting and finishing'},
 {id:'silicone',name:'Silicone studio',description:'Specialist silicone materials and techniques'},
 {id:'authenticity',name:'Authenticity & provenance',description:'Original sculptors, legitimate kits and counterfeit concerns'},
 {id:'showcase',name:'Studio showcase',description:'Works in progress and finished creations'},
 {id:'marketplace',name:'Buying & selling',description:'Advice and discussion; transactions are not yet hosted'}
] as const;
export type CommunityUser={id:string;handle:string;displayName:string;bio:string;editorial:boolean;allowMessages:boolean;createdAt:string;avatarUrl:string|null;email:string;roles:string[];interests:string[];notificationEmail:boolean;marketingEmail:boolean};
export type CommunityPost={id:string;title:string;body:string;category:string;created_at:string;pinned:number;handle:string;display_name:string;is_editorial:number;reply_count:number;vote_count:number;liked?:boolean;products?:{type:string;path:string}[];locked?:number};
export type CommunityReply={id:string;body:string;created_at:string;handle:string;display_name:string;is_editorial:number};
export async function communityApi<T>(path:string,body?:unknown):Promise<T>{
 const response=await fetch('/api/community/'+path,{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
 const data=await response.json().catch(()=>({error:'The community service is unavailable.'}));
 if(!response.ok)throw new Error(data.error||'Request failed.');
 return data as T;
}
export function dateLabel(date:string){const v=new Date(date.endsWith('Z')||date.includes('+')?date:date.replace(' ','T')+'Z');return Number.isNaN(v.getTime())?'Recently':v.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
