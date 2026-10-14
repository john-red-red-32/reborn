import type { Metadata } from "next";
import "./globals.css";
import "./community.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {LocaleProvider} from "../components/LocaleProvider";
import {WishlistProvider} from "../components/WishlistProvider";
export const metadata: Metadata = {
  title: "Reborna — Discover the next beautiful sculpt",
  description: "Explore independent reborn sculpt kits, upcoming releases, preorder calendars and retailer availability in one carefully curated place.",
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider><WishlistProvider><SiteHeader/>{children}<SiteFooter/></WishlistProvider></LocaleProvider></body></html>;
}
