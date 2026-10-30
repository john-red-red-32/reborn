"use client";

import {useEffect, useState} from "react";
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
  // Advanced consent mode: load the Google tag immediately, but deny analytics
  // cookies until a visitor has explicitly accepted. Denied mode sends only
  // cookieless measurement pings, not full GA cookie-based visitor analytics.
  const win = window as AnalyticsWindow;
  (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = false;
  win.dataLayer = win.dataLayer || [];
  win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
  win.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  if (saved === "accepted") win.gtag("consent", "update", {analytics_storage: "granted"});
  win.gtag("js", new Date());
  // Strip query parameters: these can contain member or payment identifiers.
  const pageLocation = location.origin + location.pathname;
  let referrer = "";
  try { const r = new URL(document.referrer); referrer = r.origin + r.pathname; } catch {}
  win.gtag("config", MEASUREMENT_ID, {
    page_location: pageLocation,
    page_path: location.pathname,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function stopAnalytics() {
  // Consent mode denies storage without removing the already loaded Google tag.
  // Clear accessible first-party GA cookies when permission is withdrawn.
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const domain of ["", "; domain=.reborna.co"]) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain}`;
    }
  }
}

export function AnalyticsSettingsButton() {
  const{t}=useShopLocale();
  return <button type="button" className={styles.settingsButton} onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>{t("Analytics choices")}</button>;
}

export default function AnalyticsConsent() {
  const{t}=useShopLocale();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readChoice();
    setChoice(saved);
    setOpen(!saved);
    startAnalytics(saved);
    const showSettings = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings);
  }, []);

  const decide = (next: Choice) => {
    const previouslyAccepted = choice === "accepted";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({choice: next, updatedAt: new Date().toISOString()}));
    } catch {
      // Blocked storage must never accidentally authorise tracking.
      if (next === "accepted") return;
    }
    (window as AnalyticsWindow).gtag?.("consent", "update", {
      analytics_storage: next === "accepted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    if (next === "rejected" && previouslyAccepted) stopAnalytics();
    setChoice(next);
    setOpen(false);
  };

  if (!ready || !open) return null;
  return <section className={styles.banner} role="region" aria-label={t("Analytics privacy choices")}>
    <div className={styles.copy}>
      <span className={styles.eyebrow}>{t("YOUR PRIVACY, YOUR CHOICE")}</span>
      <h2>{t("Who doesn't love cookies?")}</h2>
      <p>{t("Google Analytics measures visits with cookies disabled by default. Before you accept, it sends limited cookieless measurement to help us understand how Reborna is used. Accept for fuller analytics, or reject to keep optional cookies off.")} <Link href="/cookies/">{t("Learn more")}</Link>.</p>
    </div>
    <div className={styles.actions}>
      <button type="button" className={styles.reject} onClick={() => decide("rejected")}>{t("Reject analytics")}</button>
      <button type="button" className={styles.accept} onClick={() => decide("accepted")}>{t("Accept analytics")}</button>
      {choice && <button type="button" className={styles.close} onClick={() => setOpen(false)}>{t("Keep current choice")}</button>}
    </div>
  </section>;
}
