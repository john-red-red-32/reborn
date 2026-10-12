# Reborna artist biography research and media publication standard

## A sculptor biography is an editorial research task, not a paraphrase of a store

1. Start with the sculptor's own site and published biography, gallery chronology and original product descriptions.
2. Independently search the public web for the artist's **full name + studio name**, interviews, reputable specialist retailer profiles, past exhibits and teaching/workshop listings, and older first-person artist journals. Search both current and earlier aliases. Where no independent material is available, say so rather than adding acclaim.
3. Maintain a research sheet with **fact, source URL, primary/independent status, publication date, and confidence**. For awards, commissions, exhibitions, formal training, collaboration and "world-famous" claims, require an authoritative direct reference; a landing-page event link is not proof of participation.
4. Write a vivid, grounded editorial narrative with identifiable milestones (first kit, year, medium, techniques, community work). Avoid empty promotional adjectives. Cite the origin of factual milestones via source links displayed on the artist's page.
5. Never infer present-day tenure from an old undated interview's "X years ago"; prefer exact milestones and explicit historical context.
6. Never conflate a finished reborn doll produced by an artist with a sculpture they designed.

## Photography

- Source Shopify **product** images by the exact originating artist's public product ID/handle and preserve direct product-source URL; never mix finished doll product photos into original sculpture products.
- Galleries may include images of painted prototypes or completed example dolls based on the original sculpt. Label them **artist examples**, not blank kits, unless individual photo type is confirmed.
- Preserve the original Shopify variant IDs, so variant photos are only attached where an exact variant ID appears in Shopify's image metadata.
- Display direct published image references with credit/source; do not copy or mirror into R2 automatically. Before distributing copies or author portraits, confirm reuse rights.
- Artist **portrait** must be separately sourced, actually depict the artist, and have usage approval. A product photo/featured sculpt artwork can decorate the profile, but must be explicitly described as artwork, never a human headshot.
- If a current artist headshot has not been supplied or approved, mark the portrait as **awaiting approval** rather than fetching a random similarly named person.

## Nikki Johnston evidence, checked 2026-10-13

- Nikki's official site: https://nikkisseasidebabies.co.uk/
- Nikki's independent MacPherson interview: https://macphersoncrafts.com/sculptors/manufacturer/nikki-johnston
- Nikki's own 2011 artist journal: https://nikkis-seaside-babies.blogspot.com/2011/02/
- Tutorial background: https://nikkisseasidebabies.co.uk/pages/online-tutorials
- International dealer representation: https://nikkisseasidebabies.co.uk/pages/dealer-list
- First original production kit: Princess Charlotte (2015), followed by Robin Asleep, according to Nikki's interview.
- Reborning began in 2009; sculpting began in 2015, according to Nikki's interview.
- MacPherson's site specifically restricts re-use of its images; do **not** use its interview photograph as Nikki's public headshot without explicit permission.
- The kit-gallery media now uses direct official Shopify CDN images attached to the exact original product. Artist hero has a documented **featured sculpt photo** only, NOT Nikki's personal portrait. A genuine approved headshot remains to be supplied.

## Acceptance testing

Require a successful Next.js build and Cloudflare deployment; verify all 15 original kit pages include primary images and a gallery; HTTP-request each source CDN primary image to ensure it returns a valid image response; verify artist visual is labelled correctly; verify Nikki's biography milestones and external source links; check Cassie's existing portraits are unchanged. Test the public reborna.co host, not merely Pages deployment success.
