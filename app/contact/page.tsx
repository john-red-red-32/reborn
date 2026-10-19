import type {Metadata} from "next";
import T from "../../components/T";
import ContactForm from "../../components/ContactForm";
export const metadata:Metadata={title:"Contact Reborna | Artists, Kits & Community",description:"Get in touch with Reborna about independent reborn sculpt kits, artist collaborations, community accounts and editorial corrections."};
export default function ContactPage(){return <main className="rbrn-community-shell rbrn-contact-page"><div className="rbrn-community-intro"><span className="section-kicker"><T>{"GET IN TOUCH"}</T></span><h1><T>{"Let's talk"}</T><span className="period">.</span></h1><p><T>{"We love the little details behind beautiful original sculpts—and the people who make this community special. Whatever's on your mind, we'd be happy to hear about it."}</T></p></div><ContactForm/></main>}
