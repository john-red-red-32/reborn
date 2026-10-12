export type Status = "Pre-order open" | "Coming soon" | "Shipping" | "Available" | "Sold out";
export type Kit = {id:string;name:string;sculptor:string;status:Status;edition:string;size:string;deposit?:number;balance?:number;launch?:string;ship?:string;retailers:number;note:string;initials:string;palette:string};
export const kits: Kit[] = [
{id:"luna",name:"Luna",sculptor:"Atelier Willow",status:"Pre-order open",edition:"Limited edition",size:"19 inches",deposit:45,balance:95,launch:"2026-10-18",ship:"2027-01",retailers:3,note:"A delicately detailed newborn sculpt with expressive hands.",initials:"LW",palette:"peach"},
{id:"elodie",name:"Elodie",sculptor:"Maison Rose",status:"Coming soon",edition:"Limited edition",size:"20 inches",deposit:55,balance:115,launch:"2026-10-26",retailers:2,note:"Soft sleeping expression and finely sculpted features.",initials:"MR",palette:"lavender"},
{id:"theo",name:"Theo",sculptor:"North & Nest",status:"Available",edition:"Open edition",size:"21 inches",retailers:5,note:"An expressive awake sculpt with intricate detailing.",initials:"NN",palette:"sage"},
{id:"amelia",name:"Amelia",sculptor:"Atelier Willow",status:"Shipping",edition:"Limited edition",size:"18 inches",deposit:40,balance:100,launch:"2026-09-12",ship:"2026-10",retailers:4,note:"A much-loved sculpt now arriving with retailers.",initials:"AW",palette:"sand"},
{id:"oliver",name:"Oliver",sculptor:"Little Form Studio",status:"Sold out",edition:"Limited edition",size:"20 inches",retailers:0,note:"Join your watchlist for any verified retailer restock.",initials:"LF",palette:"blue"},
{id:"iris",name:"Iris",sculptor:"Maison Rose",status:"Coming soon",edition:"Limited edition",size:"19 inches",deposit:50,balance:105,launch:"2026-11-04",retailers:2,note:"A charming new sculpt with a softly peaceful expression.",initials:"MR",palette:"rose"}
];
// All entries above are illustrative placeholders, not real listings or verified offers.
