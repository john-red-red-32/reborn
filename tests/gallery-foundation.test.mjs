import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest as api} from '../functions/api/gallery/[[path]].js';
import {onRequest as galleryPage} from '../functions/u/[[handle]].js';
import {esc,slugValid} from '../functions/_gallery.mjs';
const req=(path,method='GET',headers={},body)=>new Request('https://reborna.co'+path,{method,headers,body});
function fakeDb(respond){
 return {
  prepare(sql){
   return {
    bind(...args){
     return {
      first:async()=>respond(sql,args,'first'),
      all:async()=>({results:respond(sql,args,'all')||[]}),
      run:async()=>({meta:{changes:1}})
     };
    },
    all:async()=>({results:respond(sql,[],'all')||[]})
   };
  }
 };
}

test('artist slugs are scoped, safe, human-readable and exclude privileged handles',()=>{
 for(const s of ['little-babies-by-anna','studio-123','anna'])assert.equal(slugValid(s),true);
 for(const s of ['admin','reborna','../bad','A B','u','', 'marketplace'])assert.equal(slugValid(s),false);
 assert.equal(esc('<script>"&\''),'&lt;script&gt;&quot;&amp;&#39;');
});
test('all private gallery APIs require a verified account and reject cross-origin writes',async()=>{
 const db=fakeDb(()=>null);
 for(const [path,method] of [['/api/gallery/me','GET'],['/api/gallery/profile','POST'],['/api/gallery/work','POST'],['/api/gallery/review','GET'],['/api/gallery/upload?scope=cover','POST']]){
  const r=await api({request:req(path,method,method==='POST'?{'content-type':'application/json'}:{},method==='POST'?'{}':undefined),env:{COMMUNITY_DB:db}});
  assert.equal(r.status,401,path);
 }
 const x=await api({request:req('/api/gallery/profile','POST',{'content-type':'application/json',origin:'https://evil.example'},'{}'),env:{COMMUNITY_DB:db}});
 assert.equal(x.status,403);
});
test('public artist discovery returns no unreviewed artwork and does not enable checkout',async()=>{
 const db=fakeDb(()=>[]);
 const r=await api({request:req('/api/gallery/public'),env:{COMMUNITY_DB:db}});
 assert.equal(r.status,200);assert.deepEqual(await r.json(),{artists:[],listings:[],checkoutLive:false,auctionsLive:false});
});
test('unapproved artist gallery pages never appear in public or in search',async()=>{
 const db=fakeDb(()=>null);
 const r=await galleryPage({request:req('/u/private-artist/'),env:{COMMUNITY_DB:db}});
 assert.equal(r.status,404);assert.equal(r.headers.get('x-robots-tag'),'noindex');
});
test('approved artist page renders photo-first portfolio safely with no active checkout',async()=>{
 const db=fakeDb((sql,args,kind)=>{
  if(sql.includes("FROM artist_galleries g JOIN users"))return {user_id:'user-1',slug:'anna-studio',headline:'Beautiful handmade dolls',story:'I love creating originals',displayName:'Anna <script>alert(1)</script>',handle:'anna'};
  if(sql.includes("FROM gallery_works w WHERE"))return [{id:'work-1',title:'Evie & friends',description:'Hand painted with care',kind:'finished_doll',originalSculpt:'Evie',originalSculptor:'Original Artist',materials:'Vinyl',displayStatus:'sold',saleFormat:'auction',askingPriceMinor:null,currency:'GBP'}];
  if(sql.includes('SELECT cover_image_id'))return {cover_image_id:null};
  if(sql.includes('FROM gallery_images WHERE work_id'))return [{id:'photo-1',workId:'work-1',sortOrder:0}];
  return null;
 });
 const r=await galleryPage({request:req('/u/anna-studio/'),env:{COMMUNITY_DB:db}});
 assert.equal(r.status,200);const html=await r.text();
 assert.match(html,/Anna &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
 assert.doesNotMatch(html,/<script>alert/);
 assert.match(html,/Previously collected/);
 assert.match(html,/\/api\/gallery\/photo\?id=photo-1/);
 assert.match(html,/Checkout and auctions are not yet enabled/);
 assert.match(html,/rel="canonical" href="https:\/\/reborna.co\/u\/anna-studio\/"/);
});
test('private images are never publicly returned without gallery approval',async()=>{
 const db=fakeDb((sql,args)=>sql.includes('FROM gallery_images i LEFT JOIN')?{id:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',user_id:'owner',work_id:'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',work_state:'pending',gallery_state:'draft',object_key:'artist-galleries/owner/image',mime_type:'image/webp'}:null);
 const r=await api({request:req('/api/gallery/photo?id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),env:{COMMUNITY_DB:db,MEDIA_BUCKET:{get:async()=>{throw Error('Storage should never be reached')}}}});
 assert.equal(r.status,404);
});


test('public reborn artist portfolio separates collected works from current availability',async()=>{
 const db=fakeDb((sql,args,kind)=>{
  if(sql.includes('FROM artist_galleries g JOIN users'))return {user_id:'artist-1',slug:'art-by-anna',headline:'Artfully painted dolls',story:'Portfolio of reborn doll artistry',displayName:'Anna Studio',handle:'anna'};
  if(sql.includes('FROM gallery_works w WHERE'))return [
    {id:'w1',title:'Available Evie',description:'Original finished reborn',kind:'finished_doll',originalSculpt:'Evie',originalSculptor:'Maker',materials:'Vinyl',displayStatus:'available',saleFormat:'auction',askingPriceMinor:12000,currency:'GBP'},
    {id:'w2',title:'Sold Robin',description:'From my earlier collection',kind:'finished_doll',originalSculpt:'Robin',originalSculptor:'Maker',materials:'Vinyl',displayStatus:'sold',saleFormat:'fixed',askingPriceMinor:null,currency:'GBP'},
    {id:'w3',title:'Archive Daisy',description:'Exhibition only',kind:'finished_doll',originalSculpt:'Daisy',originalSculptor:'Maker',materials:'Vinyl',displayStatus:'gallery',saleFormat:'fixed',askingPriceMinor:null,currency:'GBP'}
  ];
  if(sql.includes('SELECT cover_image_id'))return {cover_image_id:null};
  return [];
 });
 const r=await galleryPage({request:req('/u/art-by-anna/'),env:{COMMUNITY_DB:db}});
 assert.equal(r.status,200);const markup=await r.text();
 for(const title of ['Currently available','Previously collected','The artist’s portfolio'])assert.match(markup,new RegExp(title));
 assert.ok(markup.indexOf('Available Evie')<markup.indexOf('Sold Robin'));
 assert.ok(markup.indexOf('Sold Robin')<markup.indexOf('Archive Daisy'));
 assert.match(markup,/£120\.00/);
 assert.match(markup,/Checkout and auctions are not yet enabled/);
});

test('public marketplace only sources reviewed available completed dolls with reviewed artists',async()=>{
 const sqlSeen=[];
 const db=fakeDb((sql,args,kind)=>{
  sqlSeen.push(sql);
  if(sql.includes("FROM gallery_works w JOIN artist_galleries g"))return [{id:'real-work',slug:'anna-studio',title:'Little Evie',artistName:'Anna Studio',saleFormat:'auction',askingPriceMinor:12000,currency:'GBP',photoId:'image-1'}];
  return [];
 });
 const r=await api({request:req('/api/gallery/public'),env:{COMMUNITY_DB:db}});
 assert.equal(r.status,200);
 const data=await r.json();
 assert.equal(data.listings.length,1);
 assert.equal(data.listings[0].title,'Little Evie');
 assert.equal(data.listings[0].photoUrl,'/api/gallery/photo?id=image-1');
 assert.equal(data.checkoutLive,false);
 assert.equal(data.auctionsLive,false);
 const query=sqlSeen.find(x=>x.includes("FROM gallery_works w JOIN artist_galleries g"));
 for(const restriction of ["w.kind='finished_doll'","w.display_status='available'","w.state='approved'","g.state='approved'","u.status='active'"])assert.ok(query.includes(restriction),restriction);
});
