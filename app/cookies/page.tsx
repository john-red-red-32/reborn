import type {Metadata} from "next";
import Link from "next/link";
import LegalDocument from "../../components/LegalDocument";

export const metadata:Metadata={title:"Cookies & Storage | Reborna",description:"How Reborna uses sign-in cookies, saved favourites, currency preferences and essential security."};

const entries=[
 ["rb_session","Secure account sign-in; Secure, HttpOnly, SameSite=Lax","Cookie; up to 30 days per login. Cleared on sign-out."],
 ["reborna-wishlist-v1","Remembers guest favourites and unsynced saves on your device","Local storage; until removed or cleared."],
 ["reborna-saved-original-kits","Migrates earlier-version saved sculpts","Legacy local storage; removed during migration."],
 ["reborna-wishlist-first-save-invited-v1","Avoids repeating the free-account invitation after your first guest favourite","Session storage; generally until the tab/session closes."],
 ["reborn-currency","Remembers your selected catalogue currency","Local storage; until changed or cleared."],
 ["reborna-analytics-consent-v1","Stores your optional analytics choice so we can respect it on future visits","Local storage; until removed or changed in Analytics choices."],
 ["_ga and _ga_PTENZWZFC1","First-party Google Analytics cookies provide fuller measurements only after acceptance; limited cookieless pings can occur before consent","First-party cookies; typically up to 2 years, or until cleared/consent withdrawn."],
 ["Cloudflare Turnstile","Helps protect signup and other forms from automated abuse","Security signals handled by Cloudflare; retention depends on its security systems."]
];
export default function CookiesPage(){return <LegalDocument eyebrow="A LITTLE TRANSPARENCY" title="Cookies & storage" description="A simple guide to the small things Reborna remembers to make the site work for you.">
 <section><h2>1. Why browser storage matters</h2><p>Cookies are values your browser can send to a website. Local and session storage keep feature choices on your device. We use these technologies for secure sign-in, account security, guest favourites and currency preferences.</p></section>
 <section><h2>2. What we use today</h2><div className="rbrn-legal-table-scroll"><table><thead><tr><th>Name or service</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>{entries.map(([name,purpose,duration])=><tr key={name}><td><strong>{name}</strong></td><td>{purpose}</td><td>{duration}</td></tr>)}</tbody></table></div></section>
 <section><h2>3. Browsing as a guest</h2><p>You can explore sculpts and save favourites without creating an account. Those hearts are initially kept on your device. Registering and signing in can transfer compatible favourites into your member collection across devices. Clearing browser storage can remove guest-only favourites.</p></section>
 <section><h2>4. Necessary features and your choices</h2><p>Some technologies are required for requested services and security. Blocking them may stop account features or forms from working. You can sign out to end your account session, change the displayed currency, or clear device-only favourites through browser settings.</p><p>Reborna does not operate a behavioural advertising-tracking programme. Google Analytics 4 loads in advanced consent mode with analytics cookie storage denied by default. Before you accept, limited cookieless signals may still be sent to Google. Choose “Accept analytics” to enable fuller, cookie-based measurement, or “Reject analytics” to keep optional analytics cookies disabled. You can change your preference through “Analytics choices” in the site footer. On withdrawal we deny analytics cookie storage and clear accessible first-party Google Analytics cookies. External image hosts and linked retailer websites may use their own technologies when your browser contacts them.</p></section>
 <section><h2>5. Questions</h2><p>Our <Link href="/privacy/">Privacy Policy</Link> explains how personal information is used. For questions contact <a href="mailto:hello@reborna.co">hello@reborna.co</a>. We will update this notice when our technology changes materially.</p></section>
 </LegalDocument>}
