"use client";
import {Heart} from "lucide-react";
import {useWishlist,type SavedItem} from "./WishlistProvider";

type Props={item:SavedItem;placement?:"overlay"|"inline";compact?:boolean};
export default function WishlistHeart({item,placement="overlay",compact=false}:Props){
 const{state,isSaved,toggle}=useWishlist();
 const active=isSaved(item.path);
 const label=item.type==="artist"?(active?"Unfollow artist":"Follow artist"):(active?"Remove from wishlist":"Add to wishlist");
 return <button
   type="button"
   className={"rbrn-wishlist-heart "+(placement==="overlay"?"is-overlay":"is-inline")+(active?" is-saved":"")+(compact?" is-compact":"")}
   title={label}
   data-tip={label}
   aria-label={label+" — "+item.title}
   aria-pressed={active}
   disabled={state==="loading"}
   onClick={e=>{e.preventDefault();e.stopPropagation();void toggle(item)}}
 ><Heart size={compact?17:20} strokeWidth={1.85} fill={active?"currentColor":"none"}/></button>;
}
