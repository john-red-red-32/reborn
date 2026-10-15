import type {Metadata} from "next";
import Link from "next/link";
import LegalDocument from "../../components/LegalDocument";

export const metadata:Metadata={title:"Privacy Policy | Reborna",description:"How Reborna protects personal information, member accounts, messages, collections and contact enquiries."};

export default function PrivacyPage(){return <LegalDocument eyebrow="PRIVACY & TRUST" title="Your privacy matters" description="A clear explanation of the information Reborna uses, why we need it, and the choices that remain yours.">
 <section><h2>1. Who is responsible?</h2>
  <p>Reborna is the name under which <strong>reborna.co</strong> is operated. References to “Reborna”, “we” and “us” mean the operator responsible for the services described here. Reborna decides how personal information collected through the website is used for those services.</p>
  <p>For privacy enquiries, legal-identity enquiries, access requests or complaints, contact <a href="mailto:hello@reborna.co">hello@reborna.co</a> or use our <Link href="/contact/">contact form</Link>.</p>
 </section>
 <section><h2>2. What information do we collect?</h2>
  <p>We collect information according to the features you choose to use:</p>
  <ul>
   <li><strong>Account and verification:</strong> email address, chosen username and display name, verification status, a securely derived password hash and salt (not your plain password), session information, and your optional interests, roles and communication choices.</li>
   <li><strong>Public community information:</strong> your chosen public name, optional profile photograph and short bio, discussions, replies and contributions you choose to publish. Your selected member roles are self-described, not verified professional credentials.</li>
   <li><strong>Private member features:</strong> your saved wishlist, items you mark as owned, private studio-project notes, unposted listing drafts and private conversations.</li>
   <li><strong>Requests and safety:</strong> enquiries, emails, reports, content-moderation decisions, security checks and limited records required to investigate abuse. If you contact us as an artist or submit a profile claim or original sculpt for review, we also collect any official website or social-profile links you choose to give us, the referenced sculpt or profile, your supporting description and confidential editorial review notes. Independently approved sculptors may also request certificate codes; the registry stores short-lived email approval-code hashes, private sculpt and edition details, production-run history, signed-off source corrections, encrypted temporary certificate CSV fragments, and issuance, revocation and code lookup counts and dates. Full codes are not retained in readable form in the database. Protected exports are available to approved artists for up to seven days (or until they clear them), after which retrieval is blocked and old encrypted fragments are purged during maintenance. We do not associate buyer identity, IP address or location with certificate check histories.</li>
   <li><strong>Technical data:</strong> information such as an IP address, browser signals, device settings, security-related logs, pseudonymous rate-limit identifiers and essential account cookies. Third-party images can also cause your browser to contact their host.</li>
  </ul>
  <p>Please do not send passwords, payment-card numbers, sensitive medical information or other unnecessary personal information in messages, profiles or contact forms.</p>
 </section>
 <section><h2>3. Why we use it</h2>
  <p>We use necessary account information to provide the service you request, including registration, email verification, signing in, saved collections and private workspaces. We use member-contributed information to operate profiles, discussions, messages and any optional features you choose.</p>
  <p>We also have legitimate interests in maintaining reliable and safe services, protecting accounts, preventing spam and fraud, examining community reports, responding to enquiries and keeping accurate operational records. We use optional artist-source links to research catalogue accuracy and review profile or sculpt submission requests; these links do not automatically establish artist identity, photo-use rights or permission to publish. Where a legal requirement applies, we process information to meet that obligation.</p>
  <p>Promotional emails are optional and separate from essential account or security messages. Where consent is required for marketing, we rely on your opt-in and you can withdraw it. Selecting a community interest or a member role does not automatically subscribe you to promotional emails.</p>
 </section>
 <section><h2>4. Who can see your information?</h2>
  <p>Your public profile and approved forum contributions may be visible to other people. Your email address, login details, wishlist, self-reported owned collection, private studio plans, unpublished seller drafts, artist-review submissions and their review notes are not intended to be public.</p>
  <p>Private messages are intended only for their participants, with limited access for authorised safety, legal or technical purposes where appropriate. People may report concerning material, and moderators may need to review reports. Please avoid sharing information with other members that you would not want them to retain or repeat.</p>
 </section>
 <section><h2>5. Content review and safety screening</h2>
  <p>Cloudflare security tools help detect automated abuse. Public forum posts and replies may also be screened by an AI-assisted safety system: content assessed as lower risk can be published, while potentially harmful or uncertain submissions may be held for human review. Automated screening can be wrong and is not proof that a statement is true or a product authentic.</p>
  <p>Moderation reports and appeals are reviewed against the <Link href="/community/guidelines/">Community Guidelines</Link>. Respectful criticism of artists, businesses and Reborna itself is permitted. To question a decision, email <a href="mailto:hello@reborna.co">hello@reborna.co</a>.</p>
 </section>
 <section><h2>6. Services and information sharing</h2>
  <p>We use <strong>Cloudflare</strong> for hosting, security checks, website delivery, database services and certain AI-assisted safety functions. We use <strong>Resend</strong> to deliver verification, password reset and other operational emails. If you opt in to optional analytics, we use <strong>Google Analytics 4</strong> to understand visits and how the website is used. Google may process pseudonymous usage, browser and device information and associated cookies under its own service terms. External artists, supplier sites and image-delivery services may receive basic browser-connection data if you follow their links or load their hosted imagery.</p>
  <p>Our community database is configured in a European region, but that does <strong>not</strong> mean every hosting, security or email operation is restricted to the UK or Europe. When personal information is processed internationally, relevant UK data-transfer rules and safeguards must apply.</p>
  <p>We do not sell member personal data to advertisers. We may share information where reasonably necessary for the service, with appropriate providers, or where required by law.</p>
 </section>
 <section><h2>7. Cookies and browser storage</h2>
  <p>Signing in uses a secure session cookie lasting up to 30 days. You can also save favourites in your browser before joining, remember a currency preference and use Cloudflare’s security checks when submitting forms. Read our <Link href="/cookies/">Cookies &amp; Storage Notice</Link> for details. We do not operate an advertising-tracking programme. Google Analytics 4 is optional and does not load unless you accept it in our analytics choices. It uses first-party analytics cookies; you can change your preference at any time through the “Analytics choices” link in the site footer.</p>
 </section>
 <section><h2>8. How long information is kept</h2>
  <p>Account information and the saved features you use are retained while needed to provide those features. Email verification links expire after 24 hours and password-reset links after 30 minutes; sign-in sessions last up to 30 days. Other records, including messages, community content, moderation and security records, support enquiries and contact correspondence, may be retained as reasonably necessary for service operations, safety and legal responsibilities.</p>
  <p>Account deletion and data export are currently handled by request rather than through a self-service button. We review requests against applicable rights and any lawful reasons to retain specific records. Some backups or legally required records may take longer to remove.</p>
 </section>
 <section><h2>9. Your choices and rights</h2>
  <p>Subject to applicable UK data-protection law, you may be able to access, correct, erase, restrict or obtain a copy of your information, object to certain uses, or withdraw optional consent. You can edit your public profile and communication preferences under <Link href="/account/">Your account</Link>. You can withdraw analytics consent through the footer link without losing access to Reborna.</p>
  <p>To request access, correction, erasure, data export or a response to a privacy complaint, email <a href="mailto:hello@reborna.co">hello@reborna.co</a> with the subject <strong>Privacy request</strong>. We may need to confirm that you control the account before disclosing or changing its information. We handle complaints within applicable statutory deadlines. You may also complain to the <a href="https://ico.org.uk/" rel="noopener noreferrer" target="_blank">Information Commissioner’s Office (ICO)</a>.</p>
 </section>
 <section><h2>10. Young users and future services</h2>
  <p>Reborna is not designed specifically for children. Community access, user-generated content and private messaging present safety considerations which we continue to assess. If additional age-related safeguards are needed, we will introduce them. Please do not use the service to contact or exploit children.</p>
  <p>Reborna does not yet provide public marketplace checkout, payment processing, order tracking or in-platform purchases. We will update this notice before materially changing how we use information for those facilities or other new services.</p>
 </section>
 <section><h2>11. Updates</h2>
  <p>We may revise this notice as the service develops, with a new publication date where changes are made. Material changes will be explained to members where required.</p>
 </section>
 </LegalDocument>}
