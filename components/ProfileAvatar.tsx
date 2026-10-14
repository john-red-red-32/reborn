import {UserRound} from "lucide-react";
export default function ProfileAvatar({src,alt="Member profile photo",large=false}:{src?:string|null;alt?:string;large?:boolean}){
 return <div className={"rbrn-profile-avatar"+(large?" large":"")}>
  {src?<img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer"/>:<UserRound size={large?40:27} aria-hidden="true"/>}
 </div>;
}
