import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import {LocaleProvider} from "../components/LocaleProvider";
export const metadata: Metadata = {
  title: "Reborna — Discover the next beautiful sculpt",
  description: "Explore independent reborn sculpt kits, upcoming releases, preorder calendars and retailer availability in one carefully curated place.",
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider><SiteHeader/>{children}</LocaleProvider></body></html>;
}
