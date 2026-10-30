export type EditArticle={
 slug:string;category:string;title:string;deck:string;published:string;readingMinutes:number;accent:string;
 lead:string;sections:{heading:string;paragraphs:string[]}[];
 related:{label:string;href:string}[];
 sourceNote?:string;
};
export const editAuthor="Felix Frost";
export const editArticles:EditArticle[]=[
 {
 slug:"wishlist-unreasonable",category:"THE COLLECTOR'S LIFE",title:"Your wishlist is allowed to be completely unreasonable",
 deck:"Some people collect stamps. You have seventeen tabs open and a very specific opinion about tiny vinyl toes. We see you.",
 published:"2026-10-30",readingMinutes:4,accent:"rose",
 lead:"It begins innocently. One original sculpt catches your eye. A little face. A particular expression. That beautiful moment when you realise someone sculpted an entire personality into a lump of clay. Then suddenly you're comparing editions like a detective with a corkboard. Welcome, darling.",
 sections:[
 {heading:"A crush is not a purchase order",paragraphs:[
 "There is a glorious difference between loving a sculpt and needing to buy it immediately. Sometimes the best thing about collecting is having a place to keep the ones you admire. No checkout countdown. No seven screenshots lost in your camera roll. Just a beautifully curated collection of possibilities.",
 "We built Reborna's hearts for precisely that kind of emotional bookkeeping. Save original kits while browsing, follow the sculptors whose work you gravitate towards, and mark pieces as owned when they join your real collection. A wishlist can be ambitious without becoming a financial incident."
 ]},
 {heading:"Your taste is the interesting part",paragraphs:[
 "Two collectors can look at the same sculpt and see entirely different things: a sleeping expression, a strikingly realistic profile, a mouth that will be a dream to paint. That's the magic. Your collection doesn't need to look like anybody else's.",
 "And please, can we retire the idea that you must be an expert before you're allowed to have opinions? You can be new to the craft and still know exactly which little face has stolen your heart."
 ]},
 {heading:"Keep the receipts. The good kind.",paragraphs:[
 "When you save an original sculpt, pay attention to the artist credit and source information as well as the photograph. Edition details and stock change; authorship shouldn't get lost along the way.",
 "If you're on a different device tomorrow, a free Reborna account can keep your saved collection together. Your wishlist belongs to you, not to whichever browser tab you happen to be in."
 ]}
 ],
 related:[{label:"Start your personal collection",href:"/collection/"},{label:"Discover original sculpt kits",href:"/real-kits/"},{label:"Meet the sculptors",href:"/artists/"}]
 },
 {
 slug:"counterfeit-kit-problem",category:"THE ORIGINALITY FILES",title:"The counterfeit kit problem: cute doll, ugly backstory",
 deck:"That impossibly cheap kit? Before you fall in love with the price, find out whose art you're actually looking at.",
 published:"2026-10-30",readingMinutes:5,accent:"espresso",
 lead:"A beautifully reborn doll can stop you mid-scroll. The painting is exquisite, the hair is ridiculous in the best way, and the price looks suspiciously friendly. But there's an awkward question underneath the eyelashes: who actually created the original sculpt?",
 sections:[
 {heading:"The sculptor came first",paragraphs:[
 "Before a kit becomes a finished reborn, an original sculptor has put in the creative work: developing the expression, modelling the proportions, refining every crease and deciding what makes this particular face unmistakable.",
 "The person who paints and finishes a reborn adds their own artistry. Both contributions deserve credit. A copied sculpt that borrows the original designer's work without authorisation is not just another version of the same thing."
 ]},
 {heading:"Pretty photographs are not provenance",paragraphs:[
 "A product photograph cannot prove a kit is genuine. Neither can a familiar sculpt name, an eye-catching certificate image, or a seller's confident use of the word ‘original’. Names get copied and photos get reused.",
 "Look for a traceable route back to the sculptor: official artist channels, documented original suppliers, consistent edition details and credible source links. If information is missing, treat it as unknown rather than filling the blanks with optimism."
 ]},
 {heading:"The price deserves a second look",paragraphs:[
 "Not every inexpensive kit is counterfeit, and not every expensive one is authentic. Price is a clue, not a verdict. Old stock, second-hand kits and sales exist. So do misleading listings.",
 "When something feels off, compare the listing with the artist's documented work and ask questions before buying. A seller willing to explain provenance is a better sign than a dramatic banner promising instant authenticity."
 ]},
 {heading:"A certificate is a starting point, not magic",paragraphs:[
 "Reborna's certificate lookup tools can help check whether a code has been issued in a recorded production run. They cannot establish that a physical kit in someone's hands came from that run. A valid code can be copied or photographed, which is why provenance still matters.",
 "Our position is simple: celebrate original work, give credit accurately, and don't accuse an individual maker without evidence. The industry has enough drama without inventing our own."
 ]}
 ],
 related:[{label:"Read the original kit guide",href:"/guides/original-reborn-kits/"},{label:"Explore certificate lookup",href:"/verify/"},{label:"Discover credited sculptors",href:"/artists/"}],
 sourceNote:"This is an educational editorial, not an allegation against any named shop or individual. Kit identity and seller claims need case-by-case evidence."
 },
 {
 slug:"doll-show-diary-autumn-2026",category:"THE EVENT DIARY",title:"The doll-show diary: where to go, what to see, who to meet",
 deck:"Actual events. Actual organiser links. Absolutely no imaginary red-carpet sightings.",
 published:"2026-10-30",readingMinutes:4,accent:"sage",
 lead:"You can spend months staring at gorgeous reborn photographs online. But getting close enough to see the painting, chat with an artist and compare materials in person? That's an entirely different kind of obsession.",
 sections:[
 {heading:"Valencia, 31 October–1 November",paragraphs:[
 "MUVAL — Salón de Muñecas y Coleccionismo takes place in Valencia, Spain, at Hotel Primus Valencia. It includes reborn artistry, but it is a broader doll and collecting event — think Blythe, OOAK creations and miniatures alongside reborns.",
 "That's worth knowing before you go. If you want a mixed collector scene rather than an exclusively reborn gathering, this could be very much your weekend. The organiser lists free admission."
 ]},
 {heading:"Orlando, 14–15 November",paragraphs:[
 "The Yophi Doll Show is scheduled for 14–15 November 2026 in Orlando, Florida. Its organiser advertises reborn artistry, exhibitions and classes associated with the event.",
 "For collectors who want to talk techniques rather than simply admire finished dolls, a specialised show can be a beautiful way into the community."
 ]},
 {heading:"Basildon, 22 November",paragraphs:[
 "For UK collectors, The Doll Show in Basildon is scheduled for Sunday 22 November 2026, at Holiday Inn Basildon. The organiser lists public hours of 10:30–16:30 GMT, with earlier VIP entry.",
 "It's a straightforward opportunity to meet makers and fellow enthusiasts without needing to build an entire international itinerary around one adorable face. Although, frankly, we understand the temptation."
 ]},
 {heading:"The sensible bit (yes, we have one)",paragraphs:[
 "Dates, venues and attendance details can change, so use the official organiser links on each Reborna event page before booking travel. We list the type of event and what the organiser actually confirms. No invented guest appearances. No fantasy exhibitor lists.",
 "And if you go? Take photographs where permitted, ask about original sculpt credits, and talk to the people behind the work. The most valuable discovery may not be the kit you expected."
 ]}
 ],
 related:[{label:"MUVAL Valencia — organiser details",href:"/events/muval-valencia-2026/"},{label:"Yophi Doll Show — event listing",href:"/events/yophi-doll-show-2026/"},{label:"Basildon Doll Show — event listing",href:"/events/the-doll-show-basildon-2026/"},{label:"Browse every sourced event",href:"/events/"}],
 sourceNote:"Event information reflects organiser-sourced listings verified in October 2026. Always reconfirm event details with the organiser before travelling."
 },
 {
 slug:"original-sculpt-rabbit-hole",category:"THE SCULPT WATCH",title:"One sculpt, twelve tabs, and absolutely no regrets",
 deck:"The joy of finding the original artist behind a face you can't stop thinking about.",
 published:"2026-10-30",readingMinutes:4,accent:"plum",
 lead:"You see a finished reborn. The painting is divine. The photography could sell you a small country. You want to know the sculpt — and suddenly the caption says everything except the name of the person who actually sculpted it. Oh, we're doing research now.",
 sections:[
 {heading:"Names are clues, not the whole story",paragraphs:[
 "The same sculpt can appear across social media, retailer archives and reborn portfolios under slightly different descriptions. An artist may also change surname or studio branding over time. Following the source matters more than relying on a caption that has been copied three times.",
 "That's why Reborna links kits to their documented original sculptors and preserves source references. Sometimes the answer is beautifully clear. Sometimes there isn't enough evidence to match two older names, and we leave that uncertainty visible rather than deciding on vibes."
 ]},
 {heading:"Meet the makers, not just the merchandise",paragraphs:[
 "Start with a sculptor's profile and browse the designs credited to them. Look at how expressions change across their work, how different editions relate, and how a sculpt can take on a completely different character in the hands of a reborn artist.",
 "Explore Nikki Johnston's documented original kits, or visit our researched Cassie Ann Love archive, which connects her current artist identity with earlier work published under Cassie Brace. Those stories are richer than a product tile."
 ]},
 {heading:"A little more curiosity, a little less panic-buying",paragraphs:[
 "A pre-order label isn't a promise that stock is available right now. A historical catalogue entry isn't a live shopping basket. And a gorgeous photo doesn't mean Reborna sells the kit.",
 "The pleasure is in discovering the art, tracing the artist and saving the work you love. Then, if and when you're ready to buy, follow the identified original source and check its current terms."
 ]}
 ],
 related:[{label:"Explore Nikki Johnston's original sculpts",href:"/artists/nikki-johnston/"},{label:"Discover Cassie Ann Love's sculpt history",href:"/guides/cassie-ann-love-sculpt-history/"},{label:"Save your favourites",href:"/collection/"},{label:"Browse the release calendar",href:"/calendar/"}]
 }
];
export function editArticle(slug:string){return editArticles.find(article=>article.slug===slug)}
export function editDate(date:string){return new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"))}
