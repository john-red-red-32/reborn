import type {Metadata} from "next";
import ArtistMarketplace from "../../components/ArtistMarketplace";
export const metadata:Metadata={title:"Reborn Artist Galleries & Marketplace | Reborna",description:"Explore one-of-a-kind completed reborn dolls and artist portfolios. Create a free, beautifully presented gallery and share your work on Reborna.",alternates:{canonical:"/marketplace/"},openGraph:{title:"Reborna Artist Galleries",description:"A beautiful place for reborn artists to showcase their work, build a portfolio and prepare future sales.",url:"https://reborna.co/marketplace/"}}; 
export default function MarketplacePage(){return <ArtistMarketplace/>}
