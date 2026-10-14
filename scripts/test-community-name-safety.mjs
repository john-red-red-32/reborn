import assert from 'node:assert/strict';
import {inspectPublicName,publicNameError} from '../lib/community-name-safety.mjs';
const denied=[
 'nigger','N1GG3R','n.i.g.g.e.r','nіggеr','NIGGA_fan',
 'faggot','kike','Fuck','f.u.c.k','FUCCCK','shit','shit_painter',
 'piss','piss_off','cunt','wanker','twat','asshole','raghead','gook',
 'fuckyou','artist_fucker','Spic','Paki','Chink','Coon'
];
const permitted=[
 'Scunthorpe Dolls','Nigel Sculptor','Niger Handmade Dolls',
 'Shiitake Studio','Camille Pissarro','Pakistan Originals',
 'Spicy Colours','Cunningham Studio','Sassy Doll Maker','Sniggering Painter',
 'Georgina’s Workshop','Willow Artist','Collector123'
];
for(const name of denied){
 assert.equal(inspectPublicName(name).ok,false,'Should reject: '+name);
 assert.match(publicNameError(name),/name|profanity|slurs/i);
}
for(const name of permitted)assert.equal(inspectPublicName(name).ok,true,'Should allow innocent name: '+name);
assert.equal(inspectPublicName('n1gg3r',{handle:true}).ok,false);
assert.equal(inspectPublicName('scunthorpe',{handle:true}).ok,true);
assert.equal(inspectPublicName('reborna.sc').ok,true); // reserved handles separately checked
assert.equal(inspectPublicName('\u202ehidden').ok,false); // Unicode bidirectional control
console.log('PASS identity names: slurs, spelling evasions, harmless real names, Unicode controls');
