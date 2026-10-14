import Link from "next/link";
import type {ReactNode} from "react";

export default function LegalDocument({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children:ReactNode}){
 return <main className="rbrn-community-shell rbrn-legal-page">
  <header className="rbrn-legal-intro">
   <span className="section-kicker">{eyebrow}</span>
   <h1>{title}<span className="period">.</span></h1>
   <p>{description}</p>
   <div className="rbrn-legal-meta"><span>Published 14 October 2026</span><span>Reborna</span></div>
  </header>
  <div className="rbrn-legal-columns">
   <article className="rbrn-legal-copy">{children}</article>
   <aside className="rbrn-legal-aside" aria-label="Legal information links">
    <span className="section-kicker">ALWAYS HERE TO HELP</span>
    <h2>Questions about Reborna?</h2>
    <p>We want our policies to be clear and easy to understand. If anything needs explaining, please get in touch.</p>
    <Link href="/contact/">Contact us →</Link>
    <nav aria-label="Other Reborna policies">
     <Link href="/terms/">Terms of Use</Link>
     <Link href="/privacy/">Privacy Policy</Link>
     <Link href="/cookies/">Cookies &amp; Storage</Link>
     <Link href="/community/guidelines/">Community Guidelines</Link>
    </nav>
   </aside>
  </div>
 </main>
}