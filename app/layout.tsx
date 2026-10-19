import type { Metadata } from "next";
import "./globals.css";
import "./community.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {LocaleProvider} from "../components/LocaleProvider";
import {WishlistProvider} from "../components/WishlistProvider";
import AnalyticsConsent from "../components/AnalyticsConsent";
import LanguageWelcome from "../components/LanguageWelcome";
export const metadata: Metadata = {
  title: "Original Reborn Doll Sculptors, Kits & Art | Reborna",
  description: "Discover original reborn doll sculptors, source-attributed artist biographies, original sculpt kits, historic designs and specialist doll-making materials.",
  metadataBase: new URL("https://reborna.co"),
  applicationName: "Reborna",
  icons: {
    icon: [
      {url:"/favicon.svg?v=1",type:"image/svg+xml",sizes:"any"},
      {url:"/favicon.ico?v=1",type:"image/x-icon",sizes:"16x16 32x32"}
    ],
    shortcut: "/favicon.ico?v=1",
    apple: [{url:"/apple-touch-icon.png?v=1",sizes:"180x180",type:"image/png"}]
  },
  openGraph: {siteName:"Reborna",type:"website",locale:"en_GB"},
  twitter: {card:"summary_large_image"},
  robots: {index:true,follow:true,googleBot:{index:true,follow:true}}
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider><WishlistProvider><SiteHeader/>{children}<SiteFooter/><LanguageWelcome/><AnalyticsConsent/></WishlistProvider></LocaleProvider></body></html>;
}
