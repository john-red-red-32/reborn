/**
 * Optional LLM reading guide. Google Search does not use llms.txt as a ranking factor.
 * A static plain-text route exists for readers/tools that choose to consume this format.
 */
export const dynamic="force-static";
export function GET(){
 const text=`# Reborna

> An independent, source-attributed directory for original reborn doll sculptors, original sculpt designs, authorised manufactured kits and specialist reborn-making materials.

Website: https://reborna.co/
Contact: hello@reborna.co

## Start here
- [Original reborn sculptors](https://reborna.co/artists/): Sculptor biographies, documented original works, attribution and references to official artist sources.
- [Original sculpt and kit catalogue](https://reborna.co/real-kits/): Named sculpt records with source-based kit details, historical availability observations and links to the artist and independent sellers.
- [Reborn doll making materials](https://reborna.co/materials/): Paints, rooting materials, eyes, finishing tools and original specialist supplier references.
- [Reborn and doll shows](https://reborna.co/events/): Independently researched gatherings and event organiser links.
- [Community](https://reborna.co/community/): Member discussion and learning, moderated according to published community guidelines.
- [Original reborn doll kit research guide](https://reborna.co/guides/original-reborn-kits/): Practical steps for researching genuine original sculpt kits and suspicious recasts. Reborna does not yet offer active certificate verification.

## Read specific creators and designs
- [Cassie Ann Love (formerly Cassie Brace)](https://reborna.co/artists/cassie-ann-love/)
- [Nikki Johnston](https://reborna.co/artists/nikki-johnston/)
- [All original sculptors](https://reborna.co/artists/)
- [Complete XML sitemap](https://reborna.co/sitemap.xml)

## Source and accuracy notes
- An artist's original sculpt is distinct from an authorised manufactured blank kit and from a finished doll painted by a reborn artist.
- Catalogue information is editorial, not a claim that Reborna owns, manufactures, stocks or sells the items.
- Product stock, retail pricing, release dates and shipping can change; use dated source observations and original seller links.
- Artist profiles do not imply an endorsement, partnership or artist-managed account.
- Some historical sculptures have no current product page and appear as archive records only.
- Community member labels are self-described unless explicitly verified. Private accounts, private messages, private drafts and wishlist data are not public editorial sources.

## Policies
- [Terms of Use](https://reborna.co/terms/)
- [Privacy Policy](https://reborna.co/privacy/)
- [Cookies & Storage](https://reborna.co/cookies/)
- [Community Guidelines](https://reborna.co/community/guidelines/)

This document is an optional navigation aid; please cite the specific Reborna page and its primary source links for facts.`;
 return new Response(text,{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=3600"}});
}
