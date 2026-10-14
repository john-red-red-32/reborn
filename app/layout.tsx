import type { Metadata } from "next";
import "./globals.css";
import "./community.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {LocaleProvider} from "../components/LocaleProvider";
import {WishlistProvider} from "../components/WishlistProvider";
export const metadata: Metadata = {
  title: "Original Reborn Doll Sculptors, Kits & Art | Reborna",
  description: "Discover original reborn doll sculptors, source-attributed artist biographies, original sculpt kits, historic designs and specialist doll-making materials.",
  metadataBase: new URL("https://reborna.co"),
  applicationName: "Reborna",
  openGraph: {siteName:"Reborna",type:"website",locale:"en_GB"},
  twitter: {card:"summary_large_image"},
  robots: {index:true,follow:true,googleBot:{index:true,follow:true}}
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider><WishlistProvider><SiteHeader/>{children}<SiteFooter/></WishlistProvider></LocaleProvider></body></html>;
}
