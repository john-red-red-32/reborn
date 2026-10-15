import type {Metadata} from "next";
import MemberDashboard from "../../components/MemberDashboard";
import {artists,verifiedKits} from "../../lib/real-catalogue";
export const metadata:Metadata={title:"Your Dashboard | My Collection, Studio & Community | Reborna",description:"Your private Reborna collection, studio projects, listing drafts and community space.",robots:{index:false,follow:false}};
export default function DashboardPage(){return <MemberDashboard artists={artists.map(a=>({slug:a.slug,name:a.name}))} catalogueKits={verifiedKits.map(k=>({slug:k.slug,name:k.name,artistSlug:k.artistSlug}))}/>}
