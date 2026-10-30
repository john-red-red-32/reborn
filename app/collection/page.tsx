import type {Metadata} from "next";
import CollectionShowcase from "../../components/CollectionShowcase";
import {artists,verifiedKits,kitArtist} from "../../lib/real-catalogue";
export const metadata:Metadata={title:"My Collection | Wishlist, Original Sculpt Kits & Favourite Artists | Reborna",description:"Save original reborn kits, follow sculptors and organise your personal collection. Start as a guest; a free Reborna account keeps your favourites across devices.",alternates:{canonical:"/collection/"}};
export default function CollectionPage(){
 const suggestions=verifiedKits.filter(k=>k.photos?.length).slice(0,16).map(k=>({slug:k.slug,name:k.name,artistSlug:k.artistSlug,artistName:kitArtist(k.artistSlug)?.name||"Original sculptor",photoUrl:k.photos?.[0]?.url}));
 const featured=artists.filter(a=>verifiedKits.some(k=>k.artistSlug===a.slug)).slice(0,12).map(a=>({slug:a.slug,name:a.name}));
 return <CollectionShowcase suggestions={suggestions} artists={featured}/>;
}
