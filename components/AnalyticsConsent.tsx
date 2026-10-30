"use client";

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import styles from "./AnalyticsConsent.module.css";
import {useShopLocale} from "./LocaleProvider";

const MEASUREMENT_ID = "G-PTENZWZFC1";
const STORAGE_KEY = "reborna-analytics-consent-v1";
const SETTINGS_EVENT = "reborna:analytics-preferences";
const SCRIPT_ID = "reborna-ga4";
type Choice = "accepted" | "rejected";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

function readChoice(): Choice | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as {choice?: string} | null;
    return stored?.choice === "accepted" || stored?.choice === "rejected" ? stored.choice : null;
  } catch {
    return null;
  }
}

function startAnalytics(saved: Choice | null) {
  if (document.getElementById(SCRIPT_ID)) return;
  const win = window as AnalyticsWindow;
  win.dataLayer = win.dataLayer || [];
  win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
  // Advanced Consent Mode: the Google tag loads on entry, but analytics
  // storage remains denied until the visitor has opted in.
  win.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  if (saved === "accepted") {
    win.gtag("consent", "update", {analytics_storage: "granted"});
  }
  win.gtag("js", new Date());
  win.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function clearGaCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const domain of ["", "; domain=.reborna.co"]) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain}`;
    }
  }
}

function updateConsent(next: Choice) {
  (window as AnalyticsWindow).gtag?.("consent", "update", {
    analytics_storage: next === "accepted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  if (next === "rejected") clearGaCookies();
}

// Don't send member account, private conversations, seller or admin routes,
// search terms, session codes, emails or other query-string values to Google.
function isPublicAnalyticsPath(pathname: string): boolean {
  return !/^\/(?:account|dashboard|admin|inbox|messages|checkout|api|studio|seller|settings|verify|reset-password)(?:\/|$)/i.test(pathname);
}

export function AnalyticsSettingsButton() {
  const {t} = useShopLocale();
  return <button type="button" className={styles.settingsButton} onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>{t("Analytics choices")}</button>;
}

export default function AnalyticsConsent() {
  const {t} = useShopLocale();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readChoice();
    startAnalytics(saved);
    setChoice(saved);
    setOpen(!saved);
    setReady(true);
    const showSettings = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings);
  }, []);

  useEffect(() => {
    if (!ready || !isPublicAnalyticsPath(pathname)) return;
    // Strip search parameters and fragments; never transmit user identifiers.
    const pagePath = pathname || "/";
    (window as AnalyticsWindow).gtag?.("event", "page_view", {
      page_location: window.location.origin + pagePath,
      page_path: pagePath,
      page_title: "Reborna"
    });
  }, [pathname, ready]);

  const decide = (next: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({choice: next, updatedAt: new Date().toISOString()}));
    } catch {
      if (next === "accepted") return;
    }
    updateConsent(next);
    setChoice(next);
    setOpen(false);
  };

  if (!ready || !open) return null;
  return <section className={styles.banner} role="region" aria-label={t("Analytics privacy choices")}>
    <div className={styles.copy}>
      <span className={styles.eyebrow}>{t("YOUR PRIVACY, YOUR CHOICE")}</span>
      <h2>{t("Who doesn't love cookies?")}</h2>
      <p>{t("Google Analytics loads with analytics cookies disabled, allowing limited cookieless measurement. If you accept, analytics cookies help us understand how visitors find Reborna. Reject keeps those cookies off, and you can change your choice at any time.")} <Link href="/cookies/">{t("Learn more")}</Link>.</p>
    </div>
    <div className={styles.actions}>
      <button type="button" className={styles.reject} onClick={() => decide("rejected")}>{t("Reject analytics")}</button>
      <button type="button" className={styles.accept} onClick={() => decide("accepted")}>{t("Accept analytics")}</button>
      {choice && <button type="button" className={styles.close} onClick={() => setOpen(false)}>{t("Keep current choice")}</button>}
    </div>
  </section>;
}
