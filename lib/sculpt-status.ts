import type {VerifiedKit} from "./real-catalogue";
import {offersFor} from "./retailer-offers";
/** Lifecycle is independent of retailer purchasing availability. Delay and repeated runs are explicit observations, never guesses. */
export type SculptLifecycle="announced"|"preorder_open"|"preorder_closed"|"in_production"|"delayed"|"released"|"unknown";
export type DisplayStatus="preorder_open"|"announced"|"preorder_closed"|"in_production"|"delayed"|"available"|"unavailable"|"sold_out"|"unknown";
export const statusNames:Record<Exclude<DisplayStatus,"unknown">,string>={preorder_open:"Pre-order open",announced:"Announced",preorder_closed:"Pre-order closed",in_production:"In production",delayed:"Delayed",available:"Available",unavailable:"Unavailable",sold_out:"Sold out"};
export function sculptStatus(k:VerifiedKit):DisplayStatus{
 const offers=offersFor(k.slug);
 const lifecycle=k.lifecycle;
 if(lifecycle==="delayed")return "delayed";
 if(offers.some(o=>o.status==="available"))return "available";
 if(offers.some(o=>o.status==="preorder"))return "preorder_open";
 if(lifecycle==="preorder_open")return "preorder_open";
 if(lifecycle==="announced")return "announced";
 if(lifecycle==="preorder_closed")return "preorder_closed";
 if(lifecycle==="in_production")return "in_production";
 if(offers.length&&offers.every(o=>o.status==="unavailable"))return "unavailable";
 const s=k.statusLabel.toLowerCase();
 if(s.includes("reconfirmation")||s.includes("unverified")||s.includes("unconfirmed")||s.includes("to verify")||s.includes("not established"))return "unknown";
 if(s.includes("pre-order closed")||s.includes("preorder closed"))return "preorder_closed";
 if(s.includes("delayed"))return "delayed";
 if(s.includes("pre-order")||s.includes("preorder"))return "preorder_open";
 if(s.includes("announced")||s.includes("coming soon"))return "announced";
 if(s.includes("in production"))return "in_production";
 if(s.includes("sold out")||s.includes("out of stock"))return "sold_out";
 if(s.includes("unavailable"))return "unavailable";
 if(s.includes("available")||s.includes("in stock"))return "available";
 return "unknown";
}
export const statusRank:Record<DisplayStatus,number>={preorder_open:0,announced:1,preorder_closed:2,in_production:3,delayed:4,available:5,unknown:6,unavailable:7,sold_out:8};
export const statusTone:Record<DisplayStatus,string>={preorder_open:"preorder",announced:"upcoming",preorder_closed:"closed",in_production:"shipping",delayed:"delayed",available:"available",unknown:"unknown",unavailable:"sold",sold_out:"sold"};
