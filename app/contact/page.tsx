import type {Metadata} from "next";
import ContactForm from "../../components/ContactForm";
export const metadata:Metadata={title:"Contact Reborna | Artists, Kits & Community",description:"Get in touch with Reborna about independent reborn sculpt kits, artist collaborations, community accounts and editorial corrections."};
export default function ContactPage(){return <main className="rbrn-community-shell rbrn-contact-page"><div className="rbrn-community-intro"><span className="section-kicker">GET IN TOUCH</span><h1>Let's talk<span className="period">.</span></h1><p>We love the little details behind beautiful original sculpts—and the people who make this community special. Whatever's on your mind, we'd be happy to hear about it.</p></div><ContactForm/></main>}
