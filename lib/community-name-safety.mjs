/* Reborna public-name safety. Keep these rules specific to names, not forum debate.
 * No AI dependence. Human moderators can handle rare legitimate-name collisions.
 * This is a deterrent, not a complete substitute for community reporting.
 */
const confusables={
  'а':'a','ɑ':'a','α':'a','е':'e','ё':'e','ε':'e','і':'i','ї':'i','ι':'i',
  'о':'o','ο':'o','р':'p','ρ':'p','с':'c','ϲ':'c','υ':'u','ѵ':'v','у':'y',
  'х':'x','χ':'x','к':'k','κ':'k','м':'m','τ':'t','т':'t','н':'h','ν':'v'
};
const leets={'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s','!':'i','+':'t'};
const protectedWords=[
  // Real place names, family names and ordinary nouns must not trigger substring bans.
  'scunthorpe','snigger','sniggers','sniggering','sniggered','pissarro',
  'shiitake','shitake','pakistan','pakistani'
];
const severe=['nigger','nigga','faggot','kike','raghead','gook'];
const contextSensitive=['paki','spic','chink','coon'];
const obscene=['motherfucker','asshole','fuck','shit','piss','cunt','wanker','twat'];
export function inspectPublicName(value,{handle=false}={}){
 if(typeof value!=='string')return {ok:false,reason:'invalid'};
 if(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(value))return {ok:false,reason:'control'};
 if(value.trim().length<(handle?3:2)||value.trim().length>(handle?24:70))return {ok:false,reason:'length'};
 const basic=value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f\u200b-\u200f\u2060\u2061\u2062\u2063\u2064\ufeff\u00ad]/gu,'');
 const folded=Array.from(basic,c=>confusables[c]??leets[c]??c).join('');
 const words=folded.match(/[a-z0-9]+/g)||[];
 const compact=words.join('');
 // Remove known legitimate words before looking for embedded slurs.
 // "Scunthorpe" and "snigger" are the classic failures of naive substring filters.
 const stripped=protectedWords.reduce((s,w)=>s.split(w).join(''),compact);
 const collapsed=stripped.replace(/(.)\1+/g,'$1');
 const matches=term=>stripped.includes(term)||collapsed.includes(term.replace(/(.)\1+/g,'$1'));
 if(severe.some(matches))return{ok:false,reason:'abusive'};
 // Ambiguous short terms must stand alone. Do not censor "Pakistan" or innocent names.
 if(contextSensitive.some(term=>words.some(w=>w===term||w===term+'s')||stripped===term))return{ok:false,reason:'abusive'};
 if(obscene.some(matches))return{ok:false,reason:'abusive'};
 return {ok:true};
}
export function publicNameError(value,kind='display'){
 const check=inspectPublicName(value,{handle:kind==='handle'});
 if(check.ok)return '';
 if(check.reason==='abusive')return 'Please choose a respectful public '+(kind==='handle'?'username':'display name')+' without slurs or explicit profanity.';
 if(check.reason==='control')return 'Public names cannot contain invisible formatting or control characters.';
 return kind==='handle'
  ? 'Choose a username of 3–24 letters, numbers or underscores, starting with a letter.'
  : 'Choose a display name between 2 and 70 characters.';
}
