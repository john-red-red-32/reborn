import Link from "next/link";
import {ArrowUpRight,ShieldCheck} from "lucide-react";

/** Editorial standards statement; never implies all retailers are guaranteed genuine. */
export default function AuthenticityStatement(){
 return <aside className="authenticity-statement" aria-label="Our commitment to authentic reborn art">
   <ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true"/>
   <div><strong>Original art deserves to be protected.</strong>
     <p>Reborna champions authentic reborn sculpts and the artists who create them. We do not knowingly promote counterfeit kits or plagiarised designs. Every listing should be traceable to an original sculptor or an identifiable source — and we stand firmly against copying within the reborn community.</p>
     <Link href="/guides/original-reborn-kits/">How to research an original reborn kit <ArrowUpRight size={14}/></Link>
   </div>
 </aside>;
}
