import type {Metadata} from "next";
import MemberDashboard from "../../components/MemberDashboard";
export const metadata:Metadata={title:"Your Dashboard | My Collection, Studio & Community | Reborna",description:"Your private Reborna collection, studio projects, listing drafts and community space.",robots:{index:false,follow:false}};
export default function DashboardPage(){return <MemberDashboard/>}
