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

function startAnalytics() {
  if (document.getElementById(SCRIPT_ID)) return;
  // Withhold the tag entirely until the visitor has affirmatively opted in.
  const win = window as AnalyticsWindow;
  (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = false;
  win.dataLayer = win.dataLayer || [];
  win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
  win.gtag("js", new Date());
  win.gtag("config", MEASUREMENT_ID);
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function stopAnalytics() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  document.getElementById(SCRIPT_ID)?.remove();
  // Removing the script does not unload a script already executed. The page
  // is reloaded after withdrawal, and first-party GA cookies are cleared.
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
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readChoice();
    setChoice(saved);
    setOpen(!saved);
    setReady(true);
    const showSettings = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings);
  }, []);

  useEffect(() => {
    if (ready && choice === "accepted") startAnalytics();
  }, [ready, choice]);

  const decide = (next: Choice) => {
    const previouslyAccepted = choice === "accepted";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({choice: next, updatedAt: new Date().toISOString()}));
    } catch {
      // Blocked storage must never accidentally authorise tracking.
      if (next === "accepted") return;
    }
    if (next === "rejected" && previouslyAccepted) {
      stopAnalytics();
      window.location.reload();
      return;
    }
    setChoice(next);
    setOpen(false);
  };

  if (!ready || !open) return null;
  return <section className={styles.banner} role="region" aria-label={t("Analytics privacy choices")}>
    <div className={styles.copy}>
      <span className={styles.eyebrow}>{t("YOUR PRIVACY, YOUR CHOICE")}</span>
      <h2>{t("Who doesn't love cookies?")}</h2>
      <p>{t("We use optional Google Analytics cookies to understand how people find and explore Reborna, helping us make the experience even better. You can accept or reject them — Reborna works just as beautifully either way.")} <Link href="/cookies/">{t("Learn more")}</Link>.</p>
    </div>
    <div className={styles.actions}>
      <button type="button" className={styles.reject} onClick={() => decide("rejected")}>{t("Reject analytics")}</button>
      <button type="button" className={styles.accept} onClick={() => decide("accepted")}>{t("Accept analytics")}</button>
      {choice && <button type="button" className={styles.close} onClick={() => setOpen(false)}>{t("Keep current choice")}</button>}
    </div>
  </section>;
}
